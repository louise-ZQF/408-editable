#!/usr/bin/env node
/**
 * 构建全站搜索语料（构建时执行）
 *
 * 思路：
 *   - 使用 jiti 直接 require TS 文件（不自定义 transform，避免影响其 TS 编译）。
 *   - jiti 走 Node CJS require 管线，因此对 .svg/.png 等静态资源，
 *     直接在 require.extensions 上注册 stub handler，返回字符串 URL。
 *
 * 用法：node scripts/build-search-index.cjs
 */
const path = require("node:path");
const { createJiti } = require("jiti");
const {
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync,
} = require("node:fs");
const MiniSearch = require("minisearch");

const PROJECT_ROOT = path.resolve(__dirname, "..");
const CLIENT_ROOT = path.join(PROJECT_ROOT, "client");

/* -------- 1.5 中文分词（segmentit，供倒排索引切词） -------- */
let segmenter = null;
try {
  const segMod = require("segmentit");
  if (segMod && segMod.useDefault && segMod.Segment) {
    segmenter = segMod.useDefault(new segMod.Segment());
    const dictPath = path.join(CLIENT_ROOT, "src", "search", "408-terms.txt");
    if (existsSync(dictPath) && typeof segmenter.loadDict === "function") {
      const dictText = readFileSync(dictPath, "utf8")
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line && !line.startsWith("#"))
        .join("\n");
      segmenter.loadDict(dictText);
    }
  }
} catch (_e) {
  segmenter = null;
}
/**
 * 归一化 I/O 写法：把 "I/O" / "i / o" 归一为 "io"，让 "IO" 查询能命中 "I/O" 文档。
 */
function normalizeIo(text = "") {
  return String(text).replace(/i\s*\/\s*o/gi, "io");
}
/** 对文本切词，返回小写词列表（去标点；失败/无分词器时退化为过滤后的原文按空白切） */
function tokenizeText(text = "") {
  const clean = normalizeIo(String(text)).normalize("NFKC").toLowerCase();
  if (segmenter && typeof segmenter.doSegment === "function") {
    try {
      const out = segmenter.doSegment(clean, { simple: true });
      if (Array.isArray(out)) {
        return out
          .map((word) => String(word).trim())
          .filter((word) => /[a-z0-9\u3400-\u9fff]/i.test(word));
      }
    } catch (_e) {
      /* fallthrough */
    }
  }
  // 降级：去掉标点按空白与词边界切
  return clean.replace(/\p{P}/gu, " ").split(/\s+/).filter(Boolean);
}

/* -------- 1. 注册静态资源扩展名 stub（必须在 jiti 加载前做） -------- */
const STUB_EXTS = [
  ".svg",
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".gif",
  ".avif",
  ".woff",
  ".woff2",
  ".ttf",
  ".otf",
  ".eot",
  ".css",
  ".scss",
  ".less",
  ".sass",
  ".wasm",
];

// require.extensions 中 .js 默认存在；用同样的 handler 模板注册 stub 扩展
// Node 会把 JS loader 用于 .ts，但 jiti 在拦截阶段就处理了。这里只为 asset 服务。
for (const ext of STUB_EXTS) {
  // eslint-disable-next-line node/no-deprecated-api
  require.extensions[ext] = function stubAssetLoader(module, filename) {
    const fileName = (filename.split(/[\\/]/).pop() || "asset").replace(
      /[^A-Za-z0-9_-]/g,
      "_",
    );
    module.exports = `/_stub_asset/${fileName}`;
  };
}

/* -------- 2. 创建 jiti 实例（无自定义 transform，保持其 TS 编译） -------- */
const jitiInstance = createJiti(CLIENT_ROOT, {
  cache: false,
  extensions: [".ts", ".tsx", ".mjs", ".cjs", ".js", ".json"],
  interopDefault: false,
  alias: {
    "@": path.join(CLIENT_ROOT, "src"),
  },
});

const knowledgeTreeMod = jitiInstance("./src/content/knowledge-tree.ts");
const books = knowledgeTreeMod.knowledgeBooks || [];
const allKnowledgePoints =
  knowledgeTreeMod.allKnowledgePoints ||
  books.flatMap((b) =>
    b.chapters.flatMap((ch) => ch.sections.flatMap((s) => s.points || [])),
  );
// 知识正文从「按 book 拆分的模块」读取（构建期无需关心浏览器分包），
// 同时记录每篇文章拥有者，供生成运行时轻量索引使用。
const BOOK_MODULE_PATHS = [
  "./src/content/knowledge-articles/books/computer-network.ts",
  "./src/content/knowledge-articles/books/data-structures.ts",
  "./src/content/knowledge-articles/books/computer-organization.ts",
  "./src/content/knowledge-articles/books/operating-systems.ts",
];
const articleMap = {}; // pointId -> KnowledgeArticleData
const bookOfPoint = {}; // pointId -> 拥有该文章正文的 bookId
for (const rel of BOOK_MODULE_PATHS) {
  const bookMod = jitiInstance(rel);
  for (const [pointId, article] of Object.entries(bookMod.articlesByPoint || {})) {
    articleMap[pointId] = article;
    bookOfPoint[pointId] = bookMod.bookId || "";
  }
}
const getArticle = (pointId) => articleMap[pointId];

/* ========== 3. 知识树标题索引 ========== */
const bookIdOfSection = new Map();
const bookTitleOfId = new Map();
const sectionTitleOfId = new Map();
const sectionIdOfPoint = new Map();
const chapterTitleOfSection = new Map();
const pointTitleOfId = new Map();

for (const book of books) {
  bookTitleOfId.set(book.id, book.title);
  for (const chapter of book.chapters) {
    for (const section of chapter.sections) {
      bookIdOfSection.set(section.id, book.id);
      sectionTitleOfId.set(section.id, section.title);
      chapterTitleOfSection.set(section.id, chapter.title);
      for (const point of section.points || []) {
        sectionIdOfPoint.set(point.id, section.id);
        pointTitleOfId.set(point.id, point.title);
      }
    }
  }
}

/* ========== 4. 提取文章正文 ========== */
/** 把常见 LaTeX 命令转成可读纯文本，避免 \frac、\times、\sqrt、$ 等原样出现在搜索摘要里 */
function latexToPlain(latex = "") {
  return (
    String(latex)
      // 嵌套结构（\text/\frac/\sqrt 各支持一层花括号，覆盖题库正文的写法）
      .replace(/\\text\{([^{}]*)\}/g, "$1")
      .replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g, "($1)/($2)")
      .replace(/\\sqrt\{([^{}]*)\}/g, "√($1)")
      // 常见符号/命令
      .replace(/\\times/g, "×")
      .replace(/\\cdot/g, "·")
      .replace(/\\div/g, "÷")
      .replace(/\\pm/g, "±")
      .replace(/\\sum/g, "Σ")
      .replace(/\\prod/g, "Π")
      .replace(/\\int/g, "∫")
      .replace(/\\infty/g, "∞")
      .replace(/\\rightarrow|\\to(?![a-z])/g, "→")
      .replace(/\\leftarrow/g, "←")
      .replace(/\\le(?![a-z])|\\leq/g, "≤")
      .replace(/\\ge(?![a-z])|\\geq/g, "≥")
      .replace(/\\ne(?![a-z])|\\neq/g, "≠")
      .replace(/\\bmod|\\mod/g, "mod")
      .replace(/\\dots|\\ldots|\\cdots/g, "…")
      .replace(/\\left|\\right/g, "")
      .replace(/\\\{/g, "{")
      .replace(/\\\}/g, "}")
      .replace(/\\%/g, "%")
      .replace(/\\_/g, "_")
      .replace(/\\\^/g, "^")
      .replace(/\\\\/g, " ")
      // 残留的其它命令：去掉反斜杠、保留命令名（如 \log → log）
      .replace(/\\([a-zA-Z]+)/g, "$1")
      .replace(/\s+/g, " ")
      .trim()
  );
}

function stripMarkdown(text = "") {
  return (
    String(text)
      // LaTeX 公式源：先把 $...$ / $$...$$ / \(...\) / \[...\] 转成纯文本
      .replace(/\$\$([\s\S]+?)\$\$/g, (_m, inner) => latexToPlain(inner))
      .replace(/\$([^$\n]+?)\$/g, (_m, inner) => latexToPlain(inner))
      .replace(/\\\(([\s\S]+?)\\\)/g, (_m, inner) => latexToPlain(inner))
      .replace(/\\\[([\s\S]+?)\\\]/g, (_m, inner) => latexToPlain(inner))
      .replace(/`{1,3}([^`]+)`{1,3}/g, (_1, w) => w)
      .replace(/\*\*([^*]+)\*\*/g, (_1, w) => w)
      .replace(/\*([^*]+)\*/g, (_1, w) => w)
      .replace(/#{1,6}\s+/g, "")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, (_1, w) => w)
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  );
}

function extractBlockText(block) {
  if (!block) return "";
  switch (block.type) {
    case "paragraph":
      return stripMarkdown(block.text || "");
    case "callout":
      return [block.title, block.text]
        .filter(Boolean)
        .map((t) => stripMarkdown(t))
        .join(" ");
    case "formula":
      return block.caption ? stripMarkdown(block.caption) : "";
    case "image":
      return [block.alt, block.caption]
        .filter(Boolean)
        .map((t) => stripMarkdown(t))
        .join(" ");
    case "html":
      return stripMarkdown(block.html || "");
  }
  return "";
}

function extractBlockTexts(blocks = []) {
  return blocks.map(extractBlockText);
}

function extractSubpointText(blocks = []) {
  return extractBlockTexts(blocks).filter(Boolean).join(" ").trim();
}

const knowledgePoints = [];
const knowledgeDocs = []; // 子点级文档（含各层标题字段），docIdx 即数组下标
const seenSubpointDocs = new Set(); // 跨书/跨节重复注册的 subpoint 去重
let skipped = 0;
for (const point of allKnowledgePoints) {
  const article = getArticle(point.id);
  if (!article || !Array.isArray(article.subpoints)) {
    skipped++;
    continue;
  }
  const sectionId = sectionIdOfPoint.get(point.id);
  if (!sectionId) {
    skipped++;
    continue;
  }
  const bookId = bookIdOfSection.get(sectionId) || "";
  const bookTitle = bookTitleOfId.get(bookId) || "";
  const chapterTitle = chapterTitleOfSection.get(sectionId) || "";
  const sectionTitle = sectionTitleOfId.get(sectionId) || "";
  const pointTitle = pointTitleOfId.get(point.id) || point.title || "";
  const breadcrumb = [bookTitle, chapterTitle, sectionTitle, pointTitle]
    .filter(Boolean)
    .join(" › ");
  // blockId / allBlockIds 都用 blocks[] 内的稳定 kb-* 级 ID（exams/index.json 的 knowledgeBlockIds 也是这种格式）
  const subpoints = [];
  const allBlockIds = [];
  for (const sp of article.subpoints) {
    const blocks = Array.isArray(sp.blocks) ? sp.blocks : [];
    const blockIds = blocks.map((b) => b.id).filter(Boolean);
    allBlockIds.push(...blockIds);
    subpoints.push({
      id: sp.id,
      blockId: blockIds[0] || sp.id,
      title: sp.title,
      text: extractSubpointText(blocks),
      // block 级文本，与 blockIds 一一对应（用于运行时反查 snippet 对应的具体 block）
      blockTexts: extractBlockTexts(blocks),
      blockIds: [...blockIds],
    });
  }
  // 子点级中间文档：随后按 section 聚合，再交给 MiniSearch 建索引。
  // 同一 point 可能因跨书/跨节注册被多次遍历（如 OS 与计组共用的 co-source-to-load），
  // 按 pointId+subpoint 去重，避免搜索结果重复。
  for (let spIdx = 0; spIdx < subpoints.length; spIdx++) {
    const sp = subpoints[spIdx];
    const dedupKey = `${point.id}\u0000${sp.title || ""}`;
    if (seenSubpointDocs.has(dedupKey)) continue;
    seenSubpointDocs.add(dedupKey);
    const docIdx = knowledgeDocs.length;
    knowledgeDocs.push({
      docIdx,
      pointId: point.id,
      sectionId,
      bookId,
      bookTitle,
      chapterTitle,
      sectionTitle,
      pointTitle,
      subpointTitle: sp.title,
      subpointId: subpoints[spIdx].id,
      blockTexts: subpoints[spIdx].blockTexts,
      blockIds: subpoints[spIdx].blockIds,
      breadcrumb,
      route: `/knowledge/${bookId}/${sectionId}`,
      blockId: subpoints[spIdx].blockId,
      allBlockIds: [...allBlockIds],
      examCount: 0,
    });
  }
  knowledgePoints.push({
    pointId: point.id,
    sectionId,
    bookId,
    title: pointTitle,
    breadcrumb,
    route: `/knowledge/${bookId}/${sectionId}`,
    subpoints,
    examCount: 0,
    allBlockIds,
  });
}

/* ========== 5. 真题索引 ========== */
const examsIndexPath = path.join(CLIENT_ROOT, "public", "exams", "index.json");
let examIndexItems = [];
if (existsSync(examsIndexPath)) {
  try {
    examIndexItems = JSON.parse(readFileSync(examsIndexPath, "utf-8"));
  } catch (e) {
    console.error("[search-index] 读取 exams/index.json 失败：", e.message);
  }
}
const examItems = examIndexItems.map((item) => ({
  id: item.id,
  year: item.year,
  number: item.number,
  title: `${item.year}年第${item.number}题`,
  subject: item.subject,
  chapter: item.chapter,
  stem: item.stemText || "",
  tags: item.tags || [],
  knowledgeBlockIds: item.knowledgeBlockIds || [],
  route: `/exams?year=${item.year}&exam=${item.id}`,
}));

/* ========== 6. 关联真题计数 ========== */
const blockToExams = new Map();
for (const exam of examItems) {
  for (const bid of exam.knowledgeBlockIds) {
    const set = blockToExams.get(bid) || new Set();
    set.add(exam.id);
    blockToExams.set(bid, set);
  }
}
function countExamsForBlocks(blockIds) {
  const set = new Set();
  for (const bid of blockIds) {
    const s = blockToExams.get(bid);
    if (s) s.forEach((e) => set.add(e));
  }
  return set.size;
}
for (const kp of knowledgePoints)
  kp.examCount = countExamsForBlocks(kp.allBlockIds);
for (const doc of knowledgeDocs) {
  const set = new Set();
  for (const bid of doc.allBlockIds) {
    const s = blockToExams.get(bid);
    if (s) s.forEach((e) => set.add(e));
  }
  doc.examCount = set.size;
}

/* ========== 6.5 按 section 聚合 MiniSearch 文档 ========== */
const sectionDocMap = new Map();
for (const doc of knowledgeDocs) {
  let sectionDoc = sectionDocMap.get(doc.sectionId);
  if (!sectionDoc) {
    sectionDoc = {
      sectionId: doc.sectionId,
      bookId: doc.bookId,
      bookTitle: doc.bookTitle,
      chapterTitle: doc.chapterTitle,
      sectionTitle: doc.sectionTitle,
      pointTitleSet: new Set(),
      subpointTitleSet: new Set(),
      route: doc.route,
      parts: [],
      allBlockIdSet: new Set(),
    };
    sectionDocMap.set(doc.sectionId, sectionDoc);
  }
  if (doc.pointTitle) sectionDoc.pointTitleSet.add(doc.pointTitle);
  if (doc.subpointTitle) sectionDoc.subpointTitleSet.add(doc.subpointTitle);
  doc.allBlockIds.forEach((blockId) => sectionDoc.allBlockIdSet.add(blockId));
  sectionDoc.parts.push({
    pointId: doc.pointId,
    pointTitle: doc.pointTitle,
    subpointTitle: doc.subpointTitle,
    subpointId: doc.subpointId,
    blockId: doc.blockId,
    blockTexts: doc.blockTexts,
    blockIds: doc.blockIds,
  });
}

const sectionDocs = Array.from(sectionDocMap.values()).map((doc) => {
  const allBlockIds = Array.from(doc.allBlockIdSet);
  return {
    sectionId: doc.sectionId,
    bookId: doc.bookId,
    bookTitle: doc.bookTitle,
    chapterTitle: doc.chapterTitle,
    sectionTitle: doc.sectionTitle,
    pointTitles: Array.from(doc.pointTitleSet).join(" "),
    subpointTitles: Array.from(doc.subpointTitleSet).join(" "),
    route: doc.route,
    parts: doc.parts,
    allBlockIds,
    examCount: countExamsForBlocks(allBlockIds),
  };
});

/* ========== 6.6 构建 Section 内部片段索引文档 ========== */
const fragmentDocs = [];
for (const section of sectionDocs) {
  const seenPointFragments = new Set();
  section.parts.forEach((part, partIndex) => {
    if (!seenPointFragments.has(part.pointId)) {
      seenPointFragments.add(part.pointId);
      fragmentDocs.push({
        fragmentId: `point:${section.sectionId}:${part.pointId}`,
        sectionId: section.sectionId,
        kind: "point",
        partIndex,
        blockIndex: -1,
        title: part.pointTitle,
        text: "",
      });
    }

    fragmentDocs.push({
      fragmentId: `subpoint:${section.sectionId}:${part.pointId}:${part.subpointId}`,
      sectionId: section.sectionId,
      kind: "subpoint",
      partIndex,
      blockIndex: -1,
      title: part.subpointTitle,
      text: "",
    });

    part.blockTexts.forEach((text, blockIndex) => {
      if (!text) return;
      fragmentDocs.push({
        fragmentId: `block:${section.sectionId}:${part.pointId}:${part.subpointId}:${blockIndex}`,
        sectionId: section.sectionId,
        kind: "block",
        partIndex,
        blockIndex,
        title: "",
        text,
      });
    });
  });
}

/* ========== 6.7 生成运行时知识块反查索引（按 book 拆包后，注册表不再带正文） ========== */
// 轻量同步元数据：subpointLocationByBlockId / blockIdsOfPoint / bookOfPoint，
// 供真题页、筛选器离线同步使用；知识正文本身改为按 book 懒加载。
const subpointLocationByBlockId = {};
const blockIdsOfPoint = {};
for (const [pointId, article] of Object.entries(articleMap)) {
  const blockIds = [];
  for (const sp of article.subpoints || []) {
    for (const block of sp.blocks || []) {
      if (!block || !block.id) continue;
      blockIds.push(block.id);
      subpointLocationByBlockId[block.id] = {
        pointId,
        subpointId: sp.id,
        subpointTitle: sp.title,
      };
    }
  }
  if (blockIds.length) blockIdsOfPoint[pointId] = blockIds;
}
const blockIndexPath = path.join(
  CLIENT_ROOT,
  "src/content/knowledge-articles/block-index.generated.ts",
);
writeFileSync(
  blockIndexPath,
  "// 本文件由 scripts/build-search-index.cjs 自动生成，请勿手动修改。\n" +
    "export type GeneratedBlockLocation = { pointId: string; subpointId: string; subpointTitle: string };\n\n" +
    "/** 由已知 blockId 反查它所属的 subpoint（轻量同步元数据）。 */\n" +
    `export const subpointLocationByBlockId: Record<string, GeneratedBlockLocation> = ${JSON.stringify(subpointLocationByBlockId)};\n\n` +
    "/** pointId → 该知识点正文的全部 kb-* block ID（构建真题筛选器用）。 */\n" +
    `export const blockIdsOfPoint: Record<string, string[]> = ${JSON.stringify(blockIdsOfPoint)};\n\n` +
    "/** pointId → 其正文所属教材 bookId（知识页按 book 懒加载定位）。 */\n" +
    `export const bookOfPoint: Record<string, string> = ${JSON.stringify(bookOfPoint)};\n`,
  "utf-8",
);

/* ========== 7. 输出 ========== */
const OUT_DIR = path.join(CLIENT_ROOT, "public", "search");
mkdirSync(OUT_DIR, { recursive: true });

const storeFields = [
  "sectionId",
  "bookId",
  "bookTitle",
  "chapterTitle",
  "sectionTitle",
  "pointTitles",
  "subpointTitles",
  "route",
  "parts",
  "allBlockIds",
  "examCount",
];
const miniSearch = new MiniSearch({
  idField: "sectionId",
  fields: ["sectionTitle", "pointTitles", "subpointTitles", "body"],
  storeFields,
  tokenize: tokenizeText,
  processTerm: (term) => term,
  extractField: (document, fieldName) =>
    fieldName === "body"
      ? document.parts.flatMap((part) => part.blockTexts).join(" ")
      : document[fieldName],
});
miniSearch.addAll(sectionDocs);

const fragmentMiniSearch = new MiniSearch({
  idField: "fragmentId",
  fields: ["title", "text"],
  storeFields: ["fragmentId", "sectionId", "kind", "partIndex", "blockIndex"],
  tokenize: tokenizeText,
  processTerm: (term) => term,
});
fragmentMiniSearch.addAll(fragmentDocs);

const output = {
  version: 5,
  generatedAt: new Date().toISOString(),
  exams: examItems,
};
writeFileSync(
  path.join(OUT_DIR, "search-index.json"),
  JSON.stringify(output),
  "utf-8",
);
writeFileSync(
  path.join(OUT_DIR, "minisearch-index.json"),
  JSON.stringify(miniSearch),
  "utf-8",
);
writeFileSync(
  path.join(OUT_DIR, "minisearch-fragment-index.json"),
  JSON.stringify(fragmentMiniSearch),
  "utf-8",
);

const subTotal = knowledgePoints.reduce((n, k) => n + k.subpoints.length, 0);
const corpusBytes = Buffer.byteLength(JSON.stringify(output), "utf-8");
const indexBytes = Buffer.byteLength(JSON.stringify(miniSearch), "utf-8");
const fragmentIndexBytes = Buffer.byteLength(
  JSON.stringify(fragmentMiniSearch),
  "utf-8",
);
console.log("✓ 搜索语料生成完成");
console.log(
  `  - 知识: ${knowledgePoints.length} points, ${subTotal} subpoints / ${sectionDocs.length} sections`,
);
console.log(`  - 真题: ${examItems.length} questions`);
console.log(
  `  - MiniSearch: ${miniSearch.termCount} 个 Section 词条；${fragmentDocs.length} 个片段 / ${fragmentMiniSearch.termCount} 个片段词条`,
);
console.log(
  `  - 输出大小: corpus ${(corpusBytes / 1024).toFixed(0)} KB + section index ${(indexBytes / 1024).toFixed(0)} KB + fragment index ${(fragmentIndexBytes / 1024).toFixed(0)} KB`,
);
