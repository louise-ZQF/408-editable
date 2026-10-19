/**
 * useSearch —— 全站搜索主 composable。
 *
 * 协调真题搜索（searchExam）+ 知识搜索（searchKnowledge）+ 语料加载（shared）：
 *  - query：双向绑定的查询串（v-model）
 *  - search(override?)：传参则立即搜索并返回结果；不传则读 query.value 走防抖
 *  - dispose：卸载时清理防抖定时器
 *  内部用 searchSeq 序列号丢弃过期结果，保证快速输入时只展示最新一次。
 *
 * 数据来源：构建期预生成的 Section/片段 MiniSearch 索引 + /search/search-index.json。
 *           + /search/synonyms.json（同义词组）。
 * 检索策略：知识走 MiniSearch BM25 排序 + section 聚合 + 同义词扩展 + Segmentit 分词；
 *           真题仅支持"年份+题号"精确命中（如 2019 01）。
 */
import type { ShallowRef } from "vue";
import { onBeforeUnmount, shallowRef } from "vue";
import type { SearchResult } from "@/search/types";
import { ensureCorpusLoaded } from "@/search/shared";
import { searchExam } from "./searchExam";
import { searchKnowledge } from "./searchKnowledge";

/** 一次搜索的返回结果（调用方直接获取，避免共享 reactive state 的竞态） */
export type SearchOutcome = {
  results: SearchResult[];
  exact: SearchResult[];
};

export interface UseSearchReturn {
  query: ShallowRef<string>;
  search: (overrideQuery?: string) => Promise<SearchOutcome | null>;
  dispose: () => void;
}

/** 空结果常量，避免重复创建 */
const EMPTY_OUTCOME: SearchOutcome = { results: [], exact: [] };

/**
 * 全站搜索 composable。
 */
export function useSearch(options?: {
  debounceMs?: number;
  topK?: number;
}): UseSearchReturn {
  const debounceMs = options?.debounceMs ?? 180;
  const topK = options?.topK ?? 10;

  const query = shallowRef<string>("");
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;
  let disposed = false;
  let searchSeq = 0;

  async function runSearch(raw: string): Promise<SearchOutcome | null> {
    if (!raw || !raw.trim()) return EMPTY_OUTCOME;
    const q = raw.trim();
    const mySeq = ++searchSeq;
    try {
      const loaded = await ensureCorpusLoaded();
      // 等待语料加载期间若来了新查询，丢弃本次结果
      if (disposed || mySeq !== searchSeq) return null;

      // 精确题号命中（如 "2019 01"）
      const exact = searchExam(q, loaded);
      // 知识检索
      const results = searchKnowledge(q, loaded, topK);

      return { results, exact };
    } catch {
      return null;
    }
  }

  async function search(overrideQuery?: string): Promise<SearchOutcome | null> {
    const q = (
      overrideQuery != null ? overrideQuery : query.value || ""
    ).trim();
    if (debounceTimer) {
      clearTimeout(debounceTimer);
      debounceTimer = null;
    }

    // 允许“树”“栈”等单个中文字符搜索；仍拦截过于宽泛的单个字母或数字。
    const characters = Array.from(q);
    if (!q || (characters.length === 1 && /^[a-z0-9]$/i.test(q))) {
      return EMPTY_OUTCOME;
    }

    if (overrideQuery != null) return runSearch(q);
    return new Promise<SearchOutcome | null>((resolve) => {
      debounceTimer = setTimeout(() => {
        runSearch(q).then(resolve);
      }, debounceMs);
    });
  }

  function dispose() {
    disposed = true;
    if (debounceTimer) clearTimeout(debounceTimer);
  }
  onBeforeUnmount(dispose);

  return { query, search, dispose };
}

/* 高亮工具从 shared 重新导出，保持现有 import 路径不变 */
export { highlightText } from "@/search/shared";
