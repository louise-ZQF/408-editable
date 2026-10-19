/**
 * 知识搜索：构建期把内容聚合为 section 文档，MiniSearch 直接负责评分与排序。
 * 运行时只保留同义词扩展、摘要定位和 SearchResult 结构转换。
 */
import type { SearchResult as MiniSearchResult } from "minisearch";
import type {
  KnowledgeMatchField,
  SearchKnowledgeFragmentDoc,
  SearchKnowledgeSectionDoc,
  SearchResult,
} from "@/search/types";
import type { LoadedCorpus } from "@/search/shared";
import { extractSnippet, normalizeIo } from "@/search/shared";

function asciiWordMatch(text: string, word: string): boolean {
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^a-z0-9])${escaped}(?=$|[^a-z0-9])`).test(text);
}

/** 保留既有同义词召回；它只扩充查询，不参与计算相关性分数。 */
export function expandWithSynonyms(
  rawQuery: string,
  synonyms: Map<string, string[]>,
): string {
  const text = String(rawQuery);
  const expanded = new Set<string>();
  text
    .replace(/[\p{P}]/gu, " ")
    .split(/\s+/)
    .filter(Boolean)
    .forEach((token) => expanded.add(token));

  const normalized = normalizeIo(text).toLowerCase();
  for (const [word, group] of synonyms) {
    if (!word) continue;
    const matched = /[\u3400-\u9fff]/.test(word)
      ? normalized.includes(word)
      : asciiWordMatch(normalized, word);
    if (matched) group.forEach((variant) => expanded.add(variant));
  }
  return Array.from(expanded).join(" ");
}

type KnowledgeHit = MiniSearchResult & SearchKnowledgeSectionDoc;
type FragmentHit = MiniSearchResult & SearchKnowledgeFragmentDoc;

function findBestFragments(
  expandedQuery: string,
  sectionIds: Set<string>,
  loaded: LoadedCorpus,
): Map<string, FragmentHit> {
  const bestBySection = new Map<string, FragmentHit>();
  const fragments = loaded.fragmentIndex.search(expandedQuery, {
    combineWith: "OR",
    boost: { title: 2, text: 1 },
  }) as FragmentHit[];

  // MiniSearch 已按相关性排序；每个 Section 第一次出现的片段就是其内部最高分结果。
  for (const fragment of fragments) {
    if (!sectionIds.has(fragment.sectionId) || bestBySection.has(fragment.sectionId)) continue;
    bestBySection.set(fragment.sectionId, fragment);
    if (bestBySection.size === sectionIds.size) break;
  }
  return bestBySection;
}

export function searchKnowledge(
  query: string,
  loaded: LoadedCorpus,
  topK: number,
): SearchResult[] {
  const expandedQuery = expandWithSynonyms(query, loaded.synonyms);
  const hits = loaded.sectionIndex.search(expandedQuery, {
    combineWith: "OR",
    boost: {
      sectionTitle: 3,
      pointTitles: 2.5,
      subpointTitles: 2,
      body: 1,
    },
  }) as KnowledgeHit[];

  const topHits = hits.slice(0, topK);
  const bestFragments = findBestFragments(
    expandedQuery,
    new Set(topHits.map((hit) => hit.sectionId)),
    loaded,
  );

  return topHits.map((hit) => {
    const fragment = bestFragments.get(hit.sectionId);
    const matchedPart = fragment ? hit.parts[fragment.partIndex] : undefined;
    const fallbackPart = matchedPart || hit.parts[0];
    const snippetText = fragment?.kind === "point"
      ? matchedPart?.pointTitle
      : fragment?.kind === "subpoint"
        ? matchedPart?.subpointTitle
        : fragment?.kind === "block"
          ? matchedPart?.blockTexts[fragment.blockIndex]
          : hit.sectionTitle;
    const blockId = fragment?.kind === "block"
      ? matchedPart?.blockIds[fragment.blockIndex] || matchedPart?.blockId
      : matchedPart?.blockId || fallbackPart?.blockId;
    const anchor = fragment?.kind === "point" && matchedPart?.pointId
      ? `article-${matchedPart.pointId}`
      : fragment?.kind === "subpoint"
        ? matchedPart?.subpointId
        : blockId;
    const matchField: KnowledgeMatchField = fragment?.kind === "point"
      ? "point"
      : fragment?.kind === "subpoint"
        ? "subpoint"
        : fragment?.kind === "block"
          ? "body"
          : "section";
    return {
      type: "knowledge" as const,
      title: hit.sectionTitle,
      subtitle: [hit.bookTitle, hit.chapterTitle, hit.sectionTitle]
        .filter(Boolean)
        .join(" › "),
      snippet: extractSnippet(snippetText || hit.sectionTitle, query),
      route: anchor ? `${hit.route}#${anchor}` : hit.route,
      blockId,
      blockIds: hit.allBlockIds,
      examCount: hit.examCount,
      matchField,
      pointId: matchedPart?.pointId,
      sectionId: hit.sectionId,
      subpointId: matchedPart?.subpointId,
      matchedBlockId: blockId,
      bookTitle: hit.bookTitle,
      chapterTitle: hit.chapterTitle,
      sectionTitle: hit.sectionTitle,
      pointTitle: matchedPart?.pointTitle,
      subpointTitle: matchedPart?.subpointTitle,
      score: hit.score,
      highlightQuery: query,
    };
  });
}
