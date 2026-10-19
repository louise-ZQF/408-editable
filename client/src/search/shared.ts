import { watch } from 'vue'
import { revision, workspace } from '@/editor/store'
/**
 * search/shared —— 真题搜索与知识搜索共用的底层工具。
 *
 *  - 语料加载：从 /search/*.json 拉取并构建运行时索引结构（全局 Promise 缓存）
 *  - 文本归一化：normalizeIo、CJK_RE
 *  - 高亮候选词抽取：extractHighlightTerms（拉丁整词 + CJK 整段 + bigram）
 *  - snippet 截取：以首个命中 token 为中心
 *  - 高亮：highlightText
 */
import MiniSearch from 'minisearch'
import type {
  SearchCorpus,
  SearchExamItem,
  SearchKnowledgeFragmentDoc,
  SearchKnowledgeSectionDoc,
} from '@/search/types'

/* ========================================================================== *
 * 文本归一化
 * ========================================================================== */

/** 把 "I/O" / "i / o" 归一为 "io"，让 "IO" 查询能命中 "I/O" 文档 */
export function normalizeIo(text: string): string {
  return String(text).replace(/i\s*\/\s*o/gi, 'io')
}

/** CJK 连续段正则（含扩展 CJK / 假名 / 谚文 / 全角符号） */
export const CJK_RE = /[\u3400-\u9FFF\u3040-\u30FF\uAC00-\uD7AF\uFF00-\uFFEF]+/g

/* ========================================================================== *
 * 词法分析：从查询抽取匹配项与权重
 * ========================================================================== */

/* ========================================================================== *
 * 语料加载（Promise 缓存 + segmentit 懒加载）
 * ========================================================================== */

/** 运行时语料：真题与知识各自取需要的字段 */
export type LoadedCorpus = {
  /** 决定 Section 结果顺序的主索引。 */
  sectionIndex: MiniSearch<SearchKnowledgeSectionDoc>
  /** 决定每个 Section 展示和定位到哪个内部片段的轻量索引。 */
  fragmentIndex: MiniSearch<SearchKnowledgeFragmentDoc>
  /** 同义词查找表：word → 同组全部变体 */
  synonyms: Map<string, string[]>
  /** 真题 "年份-题号" -> exam，用于精确题号命中 */
  examYearNumberMap: Map<string, SearchExamItem>
}

/* ========================================================================== *
 * 公共路径工具（GitHub Pages 二级目录部署适配）
 * ========================================================================== */

/**
 * 拼上 Vite 部署的 base 路径，让二级目录部署下也能正确请求静态资源。
 *   - base = '/postgraduate-exam-website/'，
 *     withBase('/search/search-index.json') → '/postgraduate-exam-website/search/search-index.json'
 *   - base = '/' 时直接原样返回。
 * 完整 URL（http(s):// / //:）和相对路径不拼接，直接返回。
 */
export function withBase(path: string): string {
  if (!path) return ''
  if (/^(https?:)?\/\//i.test(path)) return path // 完整 URL / protocol-relative
  if (!path.startsWith('/')) return path          // 相对路径直接返回
  const base = import.meta.env?.BASE_URL ?? '/'
  if (!base || base === '/') return path
  return `${base.replace(/\/$/, '')}${path}`
}

let corpusPromise: Promise<LoadedCorpus> | null = null
watch(revision, () => { corpusPromise = null })
let segmentPromise: Promise<((input: string) => string[]) | undefined> | null = null
let dictPromise: Promise<string> | null = null

/* ========================================================================== *
 * 语料加载（Promise 缓存 + segmentit 懒加载）
 * ========================================================================== */

/** 读取构建阶段同步到 public/search 的 408 领域专业词典。 */
async function loadExam408Dict(): Promise<string> {
  if (dictPromise) return dictPromise
  dictPromise = loadExam408DictUncached()
  return dictPromise
}

async function loadExam408DictUncached(): Promise<string> {
  const browserPath = withBase('/search/408-terms.txt')
  try {
    const res = await fetch(browserPath)
    if (res.ok) {
      const txt = await res.text()
      return txt
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter((l) => l && !l.startsWith('#'))
        .join('\n')
    }
  } catch {
    return ''
  }
  return ''
}

/** MiniSearch 构建期和查询期共用的 Segmentit 分词规范。 */
export function createSearchTokenizer(segment?: (input: string) => string[]): (text: string) => string[] {
  return (text: string) => {
    const clean = normalizeIo(text).normalize('NFKC').toLowerCase()
    const words = segment ? segment(clean) : clean.replace(/\p{P}/gu, ' ').split(/\s+/)
    return words
      .map((word) => String(word).trim())
      .filter((word) => /[a-z0-9\u3400-\u9fff]/i.test(word))
  }
}

function sectionIndexOptions(segment?: (input: string) => string[]) {
  return {
    idField: 'sectionId',
    fields: ['sectionTitle', 'pointTitles', 'subpointTitles', 'body'],
    storeFields: [
      'sectionId', 'bookId', 'bookTitle', 'chapterTitle', 'sectionTitle',
      'pointTitles', 'subpointTitles', 'route', 'parts', 'allBlockIds', 'examCount',
    ],
    tokenize: createSearchTokenizer(segment),
    processTerm: (term: string) => term,
    extractField: (document: SearchKnowledgeSectionDoc, fieldName: string) => fieldName === 'body'
      ? document.parts.flatMap((part) => part.blockTexts).join(' ')
      : document[fieldName as keyof SearchKnowledgeSectionDoc],
  }
}

function fragmentIndexOptions(segment?: (input: string) => string[]) {
  return {
    idField: 'fragmentId',
    fields: ['title', 'text'],
    storeFields: ['fragmentId', 'sectionId', 'kind', 'partIndex', 'blockIndex'],
    tokenize: createSearchTokenizer(segment),
    processTerm: (term: string) => term,
  }
}

/** 懒加载 segmentit 分词器，注入 408 领域词典。任一步失败回退 undefined（降级 bigram） */
function loadSegmentit(): Promise<((input: string) => string[]) | undefined> {
  if (segmentPromise) return segmentPromise
  segmentPromise = (async () => {
    try {
      const [modAny, dictText] = await Promise.all([
        import('segmentit') as unknown as Promise<Record<string, unknown>>,
        loadExam408Dict(),
      ])
      const mod = modAny as {
        default?: { Segment?: new () => unknown; useDefault?: (s: unknown) => unknown }
        Segment?: new () => unknown
        useDefault?: (s: unknown) => unknown
      }
      const SegmentCtor = mod.Segment ?? mod.default?.Segment
      const useDefaultFn = mod.useDefault ?? mod.default?.useDefault
      if (!SegmentCtor || !useDefaultFn) return undefined
      const seg = useDefaultFn(new SegmentCtor()) as {
        doSegment?: (s: string, o?: object) => string[] | Array<{ w?: string }>
        loadDict?: (dict: string) => void
      }
      if (typeof seg?.doSegment !== 'function') return undefined
      // 注入 408 领域词典（词频 4000-5500 高于默认词典，保证专业词义优先）
      if (dictText && typeof seg.loadDict === 'function') seg.loadDict(dictText)
      const doSegment = seg.doSegment.bind(seg)
      return (input: string): string[] => {
        const out = doSegment(String(input), { simple: true })
        return Array.isArray(out) ? out.map((x) => (typeof x === 'string' ? x : (x.w ?? ''))) : []
      }
    } catch {
      return undefined
    }
  })()
  return segmentPromise
}

/** 把同义词组二维数组转为 word → 同组全部变体 的查找表 */
function buildSynonymLookup(groups: string[][]): Map<string, string[]> {
  const lookup = new Map<string, string[]>()
  for (const group of groups) {
    const normGroup = group.map((w) => w.trim()).filter(Boolean)
    for (const word of normGroup) {
      const key = word.toLowerCase()
      const prior = lookup.get(key) || []
      const merged = Array.from(new Set([...prior, ...normGroup]))
      for (const w of merged) lookup.set(w.toLowerCase(), merged)
    }
  }
  return lookup
}

/** 并行加载轻量元数据、同义词、分词器和预生成索引；全局只执行一次。 */
export async function ensureCorpusLoaded(): Promise<LoadedCorpus> {
  if (corpusPromise) return corpusPromise
  corpusPromise = (async () => {
    const [corpusJson, sectionIndexJson, fragmentIndexJson, synonymsJson, segment]: [SearchCorpus, string, string, string[][], ((i: string) => string[]) | undefined] = await Promise.all([
      fetch(withBase('/search/search-index.json')).then((r) => r.json()),
      fetch(withBase('/search/minisearch-index.json')).then((r) => r.text()),
      fetch(withBase('/search/minisearch-fragment-index.json')).then((r) => r.text()),
      fetch(withBase('/search/synonyms.json')).then((r) => r.json()),
      loadSegmentit(),
    ])

    const examYearNumberMap = new Map<string, SearchExamItem>()
    for (const exam of corpusJson.exams) {
      examYearNumberMap.set(`${exam.year}-${exam.number}`, exam)
    }

    let sectionIndex = MiniSearch.loadJSON<SearchKnowledgeSectionDoc>(sectionIndexJson, sectionIndexOptions(segment))
    let fragmentIndex = MiniSearch.loadJSON<SearchKnowledgeFragmentDoc>(fragmentIndexJson, fragmentIndexOptions(segment))
    if (workspace.books !== null || Object.keys(workspace.articles).length) {
      const [{ knowledgeBooks }, { loadBookContent }] = await Promise.all([import('@/content/knowledge-tree'), import('@/content/knowledge-articles/registry')])
      const docs: SearchKnowledgeSectionDoc[] = []; const fragments: SearchKnowledgeFragmentDoc[] = []
      for (const book of knowledgeBooks) {
        const articles = await loadBookContent(book.id)
        for (const chapter of book.chapters) for (const section of chapter.sections) {
          const parts: SearchKnowledgeSectionDoc['parts'] = []
          for (const point of section.points) {
            const article = articles[point.id]
            for (const sub of article?.subpoints || [{ id: point.id, title: point.title, blocks: [{ id: point.id, type: 'paragraph', text: point.summary }] }]) {
              const blocks = sub.blocks as any[]
              const texts = blocks.map(b => [b.text, b.html, b.formula, b.caption, b.alt, b.title].filter(Boolean).join(' ').replace(/<[^>]+>/g, ' '))
              const pi = parts.length
              parts.push({ pointId: point.id, pointTitle: point.title, subpointTitle: sub.title, subpointId: sub.id, blockId: blocks[0]?.id || '', blockTexts: texts, blockIds: blocks.map(b => b.id) })
              fragments.push({ fragmentId: section.id + '-' + pi + '-p', sectionId: section.id, kind: 'point', partIndex: pi, blockIndex: -1, title: point.title, text: point.summary })
              fragments.push({ fragmentId: section.id + '-' + pi + '-s', sectionId: section.id, kind: 'subpoint', partIndex: pi, blockIndex: -1, title: sub.title, text: sub.title })
              texts.forEach((text, bi) => fragments.push({ fragmentId: section.id + '-' + pi + '-' + bi, sectionId: section.id, kind: 'block', partIndex: pi, blockIndex: bi, title: sub.title, text }))
            }
          }
          docs.push({ sectionId: section.id, bookId: book.id, bookTitle: book.title, chapterTitle: chapter.title, sectionTitle: section.title, pointTitles: section.points.map(p => p.title).join(' '), subpointTitles: parts.map(p => p.subpointTitle).join(' '), route: `/knowledge/${book.id}/${section.id}`, parts, allBlockIds: parts.flatMap(p => p.blockIds), examCount: 0 })
        }
      }
      sectionIndex = new MiniSearch<SearchKnowledgeSectionDoc>(sectionIndexOptions(segment)); sectionIndex.addAll(docs)
      fragmentIndex = new MiniSearch<SearchKnowledgeFragmentDoc>(fragmentIndexOptions(segment)); fragmentIndex.addAll(fragments)
    }
    if (workspace.deletedExams.length || Object.keys(workspace.exams).length) {
      const { getExamIndex } = await import('@/services/examRepository')
      examYearNumberMap.clear()
      for (const q of await getExamIndex()) examYearNumberMap.set(`${q.year}-${q.number}`, { id: q.id, year: q.year, number: q.number, title: `${q.year}年第${q.number}题`, subject: q.subject, chapter: q.chapter, stem: q.stemText, tags: q.tags, knowledgeBlockIds: q.knowledgeBlockIds, route: `/exams?year=${q.year}&exam=${q.id}` })
    }
    return { sectionIndex, fragmentIndex, synonyms: buildSynonymLookup(synonymsJson), examYearNumberMap }
  })()
  try {
    return await corpusPromise
  } catch (error) {
    corpusPromise = null
    throw error
  }
}

/** 页面空闲或搜索框获得焦点时预热；失败不影响页面，真正搜索时仍会重试加载。 */
export function warmSearch(): void {
  void ensureCorpusLoaded().catch(() => {
    corpusPromise = null
  })
}

/* ========================================================================== *
 * snippet 截取：以匹配位置为中心
 * ========================================================================== */

/** 以首个命中 token 为中心截取 maxLen 长度的片段，前后加 … */
export function extractSnippet(text: string, rawQuery: string, maxLen = 70): string {
  if (!text) return ''
  const clean = text.replace(/\s+/g, ' ').trim()
  if (clean.length <= maxLen) return clean

  const rawTokens = rawQuery.replace(/\p{P}/gu, ' ').split(/\s+/).filter(Boolean).map((t) => t.toLowerCase())
  const cjkBigrams: string[] = []
  for (const m of rawQuery.matchAll(/[\u3400-\u9FFF]+/g)) {
    const seg = m[0]
    for (let i = 0; i < seg.length - 1; i++) cjkBigrams.push(seg.slice(i, i + 2).toLowerCase())
  }
  const allTokens = [...rawTokens, ...cjkBigrams].filter((t) => t.length >= 2).sort((a, b) => b.length - a.length)

  const lower = clean.toLowerCase()
  let hit = -1
  for (const t of allTokens) {
    const idx = lower.indexOf(t)
    if (idx >= 0) { hit = idx; break }
  }
  if (hit < 0) hit = 0

  const half = Math.floor(maxLen / 2)
  let start = Math.max(0, hit - half)
  if (start + maxLen > clean.length) start = Math.max(0, clean.length - maxLen)

  const prefix = start > 0 ? '…' : ''
  const suffix = start + maxLen < clean.length ? '…' : ''
  return `${prefix}${clean.slice(start, start + maxLen)}${suffix}`
}

/* ========================================================================== *
 * 高亮工具
 * ========================================================================== */

export function escapeHtml(s: string): string {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** 抽取高亮候选词：拉丁整词 + CJK 整段 + CJK bigram（复用原 lexMatchTerms 的词抽取逻辑） */
function extractHighlightTerms(rawQuery: string): string[] {
  const text = 
  normalizeIo(String(rawQuery)).normalize('NFKC').toLowerCase()
  const terms = new Set<string>()
  for (const m of text.matchAll(/[a-z0-9]+/g)) {
    const w = m[0]
    if (w) terms.add(w)
  }
  for (const m of text.matchAll(CJK_RE)) {
    const seg = m[0]
    if (seg.length >= 2) {
      terms.add(seg)
      for (let i = 0; i < seg.length - 1; i++) terms.add(seg.slice(i, i + 2))
    }
  }
  return Array.from(terms)
}

/**
 * 高亮查询命中：按查询抽取的词（整词/整段 + bigram）在文本里插 <mark>。
 *  - 长匹配项优先，避免短项先插入 <mark> 干扰长项匹配。
 *  - "io" 允许匹配 "I/O"（斜杠可选），让 "IO方式" 能高亮正文里的 "I/O"。
 */
export function highlightText(text: string, rawQuery: string): string {
  if (!text) return ''
  const terms = extractHighlightTerms(rawQuery)
  if (!terms.length) return escapeHtml(text)
  const sorted = terms.sort((a, b) => b.length - a.length)
  let result = escapeHtml(text)
  for (const term of sorted) {
    const patternSource = escapeRegExp(escapeHtml(term)).replace(/io/gi, 'i[/]?o')
    result = result.replace(
      new RegExp(`(?!<mark[^>]*>)([^<]*?)(${patternSource})([^<]*?)(?![^<]*</mark>)`, 'ig'),
      '$1<mark>$2</mark>$3',
    )
  }
  return result
}
