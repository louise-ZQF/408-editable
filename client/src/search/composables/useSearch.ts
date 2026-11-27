import { knowledgeBooks } from '@/content/knowledge-tree'
import { workspace } from '@/editor/store'
import { ensureCorpusLoaded } from '@/search/shared'
import { isPersonalAdditionSearch, normalizeSearch, PERSONAL_ADDITION_PREFIX, PERSONAL_ADDITION_TAG, SEARCH_SUBJECTS, type SearchFilters } from '@/search/query'
import type { SearchResult } from '@/search/types'
import { searchExam, parseExactYearNumber } from './searchExam'
import { searchKnowledge } from './searchKnowledge'

const TOP_K = 8

function findPersonalAdditions(): SearchResult[] {
  const results: SearchResult[] = []
  const seen = new Set<string>()
  for (const book of knowledgeBooks) for (const chapter of book.chapters) {
    for (const section of chapter.sections) for (const point of section.points) {
      for (const subpoint of workspace.articles[point.id]?.subpoints ?? []) {
        if (!subpoint.title.startsWith(PERSONAL_ADDITION_PREFIX)) continue
        const key = JSON.stringify([point.id, subpoint.id])
        if (seen.has(key)) continue
        seen.add(key)
        const query = new URLSearchParams({ block: subpoint.id, q: PERSONAL_ADDITION_TAG })
        results.push({
          type: 'knowledge',
          title: subpoint.title,
          subtitle: `${book.title} › ${section.title}`,
          route: `/knowledge/${encodeURIComponent(book.id)}/${encodeURIComponent(section.id)}?${query}`,
          highlightQuery: PERSONAL_ADDITION_TAG,
        })
      }
    }
  }
  return results
}

export async function findSearchResults(query: string, filters: SearchFilters): Promise<SearchResult[]> {
  if (filters.scope !== 'exam' && isPersonalAdditionSearch(query)) return findPersonalAdditions()

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
