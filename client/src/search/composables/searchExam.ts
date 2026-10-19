/**
 * searchExam —— 真题精确题号搜索。
 *
 * 仅支持"年份+题号"写法（如 "2019 01" / "2019年1题" / "19年第3题"），
 * 命中则返回单条 SearchResult；其余查询返回空数组。
 */
import type { LoadedCorpus } from "@/search/shared";
import { extractSnippet } from "@/search/shared";
import type { SearchResult } from "@/search/types";

/**
 * 解析 "2019 01" / "2019年1题" / "19年第3题" 等题号写法。
 * 命中则返回 {year, number}，用于真题精确命中。
 */
export function parseExactYearNumber(
  input: string,
): { year: number; number: number } | null {
  const text = input.trim();
  if (!text) return null;
  const fullYear = text.match(
    /(20\d{2})\s*[年.·\-_/，,。\s]*\s*(\d{1,2})\s*[题小问]?/,
  );
  if (fullYear)
    return { year: Number(fullYear[1]), number: Number(fullYear[2]) };
  const shortYear = text.match(/(\d{2})\s*年\s*第?\s*(\d{1,2})\s*[题小问]?/);
  if (shortYear)
    return { year: 2000 + Number(shortYear[1]), number: Number(shortYear[2]) };
  return null;
}

/**
 * 真题搜索：解析题号 → 查 examYearNumberMap → 构造 SearchResult。
 * 命中返回单条结果（含 snippet），未命中返回空数组。
 */
export function searchExam(
  query: string,
  loaded: LoadedCorpus,
): SearchResult[] {
  const parsed = parseExactYearNumber(query);
  if (!parsed) return [];
  const exam = loaded.examYearNumberMap.get(`${parsed.year}-${parsed.number}`);
  if (!exam) return [];
  return [
    {
      type: "exam",
      title: exam.title,
      subtitle: exam.chapter || "",
      snippet: extractSnippet(exam.stem, query, 100),
      route: exam.route,
      year: exam.year,
      number: exam.number,
      isExact: true,
    },
  ];
}
