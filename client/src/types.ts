export type ExamSubject = 'ds' | 'co' | 'os' | 'cn'

/**
 * 知识文章元数据，不作为左侧目录层级渲染。
 * Section 按 points 顺序聚合对应文章；正文、动画和真题关联由文章块负责。
 */
export type KnowledgePoint = {
  id: string
  title: string
  summary: string
  importance: number
}

/**
 * 左侧目录的第二层，也是知识正文页面的路由与标题单元。
 * 一个 Section 页面按顺序渲染 points 对应的全部文章。
 */
export type Section = {
  id: string
  title: string
  points: KnowledgePoint[]
}

/**
 * 左侧目录的第一层，例如“计算机网络体系结构”。
 */
export type Chapter = {
  id: string
  title: string
  layer: string
  sections: Section[]
}

/**
 * 书籍/教材，整个知识体系的最顶层
 * 例如："408计算机学科专业基础综合"
 */
export type Book = {
  id: string
  title: string
  subtitle: string
  subject: string
  chapters: Chapter[]
}

export type ExamQuestionType = 'choice' | 'comprehensive'
export type ExamOption = { key: string; text: string }
export type ExamSubQuestion = {
  number: number
  score: number | null
  description: string
  tags: string[]
}

export type Exam = {
  id: string
  year: number
  number: number
  score: number
  questionType: ExamQuestionType
  subject: ExamSubject
  chapterName: string
  stem: string
  options: ExamOption[]
  answer?: string
  explanation?: string
  difficulty: number
  tags: string[]
  resourceLinks: string[]
  /** 关联的知识块 ID 列表（kb-*），最多 4 个；选择题与综合题均写在题目上 */
  knowledgeBlockIds: string[]
  subQuestions?: ExamSubQuestion[]
}

export type ExamKnowledgeLink = {
  knowledgeBlockId: string
  examId: string
  year: number
  number: number
  subject: ExamSubject
  score: number | null
  stem: string
}

export type ExamListResponse = {
  items: Exam[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export type ExamFilterBookChapterSection = {
  /** 知识树 section.id，稳定 key */
  id: string
  /** 显示名：知识树 section.title，例如「I/O与中断」 */
  name: string
  /** 去重后的真题数：题目的 knowledgeBlockIds 与本节的所有 kb-* blockId 有交集 */
  count: number
  /** 本节所有 blockId，点选时用于 knowledgeBlockIds= 精确筛选（与 subject 限定同时生效） */
  blockIds: string[]
}

export type ExamFilterBookChapter = {
  /** 知识树 chapter.id，稳定 key */
  id: string
  /** 显示名：知识树 chapter.title，例如「总线与输入输出系统」 */
  name: string
  /** 本章各 section 的 blockId 并集去重后的题目数量（按 section 聚合后仍可能一题跨多 section，用并集去重） */
  count: number
  /** 本章所有 blockId，点选 chapter 时用于精确筛选 */
  blockIds: string[]
  sections: ExamFilterBookChapterSection[]
}

export type ExamFilters = {
  total: number
  years: number[]
  subjects: Array<{ value: ExamSubject; label: string }>
  questionTypes: Array<{ value: ExamQuestionType; label: string }>
  chapters: string[]
  /**
   * 真题侧栏的「书本 → 章节 → 小节」三级结构，与知识树对齐。
   * 每一级的 count 都基于 knowledgeBlockIds ∩ 该级 block 并集（去重），
   * 这样侧栏显示数量与知识页每节「N 道关联真题」使用同一口径。
   */
  books: Array<{
    subject: ExamSubject
    label: string
    chapters: ExamFilterBookChapter[]
  }>
  tags: string[]
  difficulties: number[]
  scores: number[]
}
