import { knowledgeBooks } from '@/content/knowledge-tree'
import { ensureCorpusLoaded } from '@/search/shared'
import { normalizeSearch, SEARCH_SUBJECTS, type SearchFilters } from '@/search/query'
import type { SearchResult } from '@/search/types'
import { searchExam, parseExactYearNumber } from './searchExam'
import { searchKnowledge } from './searchKnowledge'

const TOP_K = 8

export async function findSearchResults(query: string, filters: SearchFilters): Promise<SearchResult[]> {
  const normalized = normalizeSearch(query)
  if (!normalized || /^[a-z0-9]$/i.test(normalized)) return []

  const corpus = await ensureCorpusLoaded()
  const bookSubject = SEARCH_SUBJECTS.find((subject) => subject.id === filters.subject)?.bookSubject
  const bookIds = bookSubject
    ? new Set(knowledgeBooks.filter((book) => book.subject === bookSubject).map((book) => book.id))
    : undefined
  const questions = filters.scope === 'knowledge' ? [] : searchExam(query, corpus, TOP_K, filters.subject)

  if (filters.scope === 'exam' || (filters.scope === 'all' && (parseExactYearNumber(query) || /^20\d{2}年?$/.test(normalized)))) {
    return questions
  }
  const knowledge = searchKnowledge(query, corpus, TOP_K, bookIds)
  const knowledgeBudget = TOP_K - Math.min(questions.length, 3)
  return [...knowledge.slice(0, knowledgeBudget), ...questions.slice(0, TOP_K - Math.min(knowledge.length, knowledgeBudget))]
}
