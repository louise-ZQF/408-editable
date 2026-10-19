import { knowledgeBooks } from './knowledge-tree'
import * as repo from '@/services/examRepository'
import type { ExamFilterQuery } from '@/services/examRepository'

function getBook(bookId = 'computer-network') {
  const book = knowledgeBooks.find((candidate) => candidate.id === bookId)
  return book || knowledgeBooks[0]
}

function getPointLocation(pointId: string) {
  for (const book of knowledgeBooks) {
    for (const chapter of book.chapters) {
      for (const section of chapter.sections) {
        const point = section.points.find((candidate) => candidate.id === pointId)
        if (point) return { book, chapter, section, point }
      }
    }
  }
  return undefined
}

function getKnowledgePageHref(pointId: string, blockId?: string) {
  const location = getPointLocation(pointId)
  if (!location) return '#/knowledge'
  const href = `#/knowledge/${location.book.id}/${location.section.id}`
  return blockId ? `${href}?block=${encodeURIComponent(blockId)}` : href
}

/**
 * 真题数据走前端静态仓库（examRepository），无后端依赖。
 * 知识树与文章仍是前端静态内容。
 */
export const content = {
  getBook,
  getPointLocation,
  getKnowledgePageHref,
  getKnowledgeLinks: repo.getQuestionsByKnowledgeBlockIds,
  getExam: (id: string, includeAnswer = false) => repo.getQuestionById(id),
  getExamFilters: repo.getExamFilters,
  getExams(params: ExamFilterQuery & { page?: number; pageSize?: number } = {}) {
    return repo.queryQuestions(params)
  },
  submitAnswer: repo.submitAnswer,
  /** 纯前端编辑仅更新内存 + 导出，不再写后端。由编辑组件处理后更新本地状态。 */
  updateExam: async (id: string, exam: unknown) => ({ ...(await repo.getQuestionById(id)), ...(exam as object) }),
}

export { allKnowledgePoints, knowledgeBooks } from './knowledge-tree'
