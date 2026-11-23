import { extractSnippet } from '@/search/shared'
import { normalizeSearch, phrasePattern, plainSearchText, searchPhrases, searchTopic, SEARCH_SUBJECTS, type SearchSubject } from '@/search/query'
import type { LoadedCorpus } from '@/search/shared'
import type { SearchExamItem, SearchResult } from '@/search/types'

export function parseExactYearNumber(input: string): { year: number; number: number } | null {
  const text = normalizeSearch(input)
  const full = text.match(/^(20\d{2})(?:\s*[年\-./·,，_/]\s*|\s*)(?:第\s*)?(\d{1,2})\s*(?:题|小题)?$/)
  const short = full ? null : text.match(/^(\d{2})\s*年\s*(?:第\s*)?(\d{1,2})\s*(?:题|小题)?$/)
  if (full) return { year: Number(full[1]), number: Number(full[2]) }
  if (short) return { year: 2000 + Number(short[1]), number: Number(short[2]) }
  return null
}

function toResult(exam: SearchExamItem, query: string, isExact = false): SearchResult {
  const subject = SEARCH_SUBJECTS.find((item) => item.id === exam.subject)?.title
  return {
    type: 'exam',
    title: exam.title,
    subtitle: [subject, exam.chapter].filter(Boolean).join(' › '),
    snippet: extractSnippet(plainSearchText(exam.stem), query, 120),
    route: exam.route,
    year: exam.year,
    number: exam.number,
    isExact,
  }
}

export function searchExam(
  query: string,
  loaded: LoadedCorpus,
  limit = 8,
  subject: SearchSubject | '' = '',
): SearchResult[] {
  const exact = parseExactYearNumber(query)
  if (exact) {
    const exam = loaded.examYearNumberMap.get(exact.year + '-' + exact.number)
    return exam && (!subject || exam.subject === subject) ? [toResult(exam, query, true)] : []
  }

  const normalized = normalizeSearch(query)
  const year = /^20\d{2}年?$/.test(normalized) ? Number(normalized.slice(0, 4)) : 0
  const topicQuery = searchTopic(query)
  const phrases = searchPhrases(topicQuery, loaded.synonyms).map(phrasePattern)
  const words = (topicQuery.match(/[\p{Script=Han}]+|[a-z0-9]+/gu) ?? []).map((word) =>
    searchPhrases(word, loaded.synonyms).map(phrasePattern),
  )
  if (!words.length) return []

  const matches: Array<{ exam: SearchExamItem; score: number }> = []
  for (const exam of loaded.examYearNumberMap.values()) {
    if (subject && exam.subject !== subject) continue
    if (year) {
      if (exam.year === year) matches.push({ exam, score: 1 })
      continue
    }

    const topic = normalizeSearch([exam.chapter, ...exam.tags].join(' '))
    const stem = normalizeSearch(exam.stem)
    const matchedTopic = phrases.some((pattern) => pattern.test(topic))
    const matchedStem = phrases.some((pattern) => pattern.test(stem))
    const allWords = words.length > 1 && words.every((alternatives) =>
      alternatives.some((pattern) => pattern.test(topic) || pattern.test(stem)),
    )
    if (matchedTopic || matchedStem || allWords) {
      matches.push({ exam, score: Number(matchedTopic) * 4 + Number(matchedStem) * 2 + Number(allWords) })
    }
  }

  return matches
    .sort((a, b) => b.score - a.score || b.exam.year - a.exam.year || a.exam.number - b.exam.number)
    .slice(0, limit)
    .map(({ exam }) => toResult(exam, topicQuery))
}
