import { workspace } from '@/editor/store'
import type { Exam, ExamFilters, ExamFilterBookChapter, ExamFilterBookChapterSection, ExamKnowledgeLink, ExamListResponse, ExamQuestionType, ExamSubject } from '@/types'
import { withBase } from '@/search/shared'
import { knowledgeBooks } from '@/content/knowledge-tree'
import { blockIdsOfPoint } from '@/content/knowledge-articles/registry'

/**
 * 真题静态数据仓库。所有真题数据从 client/public/exams/ 读取（纯静态）。
 * manifest.json / index.json / {year}/paper.json 是静态题库文件，直接作为数据源。
 * 路径统一走 withBase 拼接 BASE_URL，适配 GitHub Pages 二级目录部署。
 */

export type ExamManifest = {
  version: number
  totalQuestions: number
  years: Array<{ year: number; questionCount: number; path: string }>
}

/** index.json 单行：轻量筛选/搜索索引（不含答案/解析/图片） */
export type ExamIndexItem = {
  id: string
  year: number
  number: number
  type: ExamQuestionType
  subject: ExamSubject
  chapter: string
  topic: string
  stemText: string
  knowledgeBlockIds: string[]
  tags: string[]
}

export type ExamPaper = {
  year: number
  title: string
  questionCount: number
  questions: Exam[]
}

const SUBJECT_LABELS = {
  ds: '数据结构',
  co: '计算机组成原理',
  os: '操作系统',
  cn: '计算机网络',
} as const

/** ExamSubject (ds/co/os/cn) ↔ knowledge Book.subject 枚举值 */
const EXAM_SUBJECT_TO_KNOWLEDGE_SUBJECT: Record<ExamSubject, string> = {
  ds: 'DATA_STRUCTURES',
  co: 'COMPUTER_ORGANIZATION',
  os: 'OPERATING_SYSTEMS',
  cn: 'NETWORK',
}

/* ---------- 请求缓存：避免同一文件重复请求 ---------- */
let manifestPromise: Promise<ExamManifest> | null = null
let indexPromise: Promise<ExamIndexItem[]> | null = null
const paperCache = new Map<number, Promise<ExamPaper | null>>()

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, { headers: { Accept: 'application/json' } })
  if (!response.ok) throw new Error(`静态题库加载失败：${url}（${response.status}）`)
  return response.json() as Promise<T>
}

export function getExamManifest(): Promise<ExamManifest> {
  if (!manifestPromise) manifestPromise = fetchJson<ExamManifest>(withBase('/exams/manifest.json'))
  return manifestPromise
}

export async function getExamIndex(): Promise<ExamIndexItem[]> {
  if (!indexPromise) indexPromise = fetchJson<ExamIndexItem[]>(withBase('/exams/index.json'))
  const original = await indexPromise
  const map = new Map(original.filter(q => !workspace.deletedExams.includes(q.id)).map(q => [q.id, q]))
  for (const q of Object.values(workspace.exams)) if (!workspace.deletedExams.includes(q.id)) map.set(q.id, {
    id: q.id, year: q.year, number: q.number, type: q.questionType, subject: q.subject,
    chapter: q.chapterName, topic: '', stemText: q.stem, knowledgeBlockIds: q.knowledgeBlockIds, tags: q.tags,
  })
  return [...map.values()]
}

export async function getExamPaper(year: number): Promise<ExamPaper | null> {
  let pending = paperCache.get(year)
  if (!pending) {
    pending = fetchJson<ExamPaper>(withBase(`/exams/${year}/paper.json`)).catch(() => {
      paperCache.delete(year)
      return null
    })
    paperCache.set(year, pending)
  }
  const original = await pending
  const overrides = Object.values(workspace.exams).filter(q => q.year === year && !workspace.deletedExams.includes(q.id))
  if (!original && !overrides.length) return null
  const questions = (original?.questions || []).filter(q => !workspace.deletedExams.includes(q.id) && !workspace.exams[q.id]).concat(overrides)
  return { year, title: original?.title || `${year} 年试题`, questionCount: questions.length, questions }
}

/* ---------- 查询 ---------- */

export type ExamFilterQuery = {
  year?: number
  fromYear?: number
  toYear?: number
  subject?: ExamSubject | ''
  questionType?: ExamQuestionType | ''
  chapter?: string
  tag?: string
  tags?: string
  keyword?: string
  difficulty?: number
  minDifficulty?: number
  maxDifficulty?: number
  score?: number
  knowledgeBlockId?: string
  knowledgeBlockIds?: string
  hasResources?: boolean
  sortKey?: 'year' | 'number'
  sortOrder?: 'asc' | 'desc'
}

/** 从 index 里过滤得到题目 id 列表（轻量），再按需加载 paper 补全 */
export async function queryIndexIds(query: ExamFilterQuery): Promise<ExamIndexItem[]> {
  const index = await getExamIndex()
  let rows = index.slice()

  if (query.year != null) rows = rows.filter((x) => x.year === query.year)
  if (query.fromYear != null) rows = rows.filter((x) => x.year >= query.fromYear!)
  if (query.toYear != null) rows = rows.filter((x) => x.year <= query.toYear!)
  if (query.subject) rows = rows.filter((x) => x.subject === query.subject)
  if (query.questionType) rows = rows.filter((x) => x.type === query.questionType)

  if (query.chapter) {
    const ch = query.chapter.toLocaleLowerCase('zh-CN').trim()
    rows = rows.filter((x) => x.chapter.toLocaleLowerCase('zh-CN').includes(ch))
  }

  if (query.tag) {
    const tag = query.tag.toLocaleLowerCase('zh-CN').trim()
    rows = rows.filter((x) => x.tags.some((t) => t.toLocaleLowerCase('zh-CN').includes(tag)))
  }
  if (query.tags) {
    const tags = query.tags.split(',').map((t) => t.trim()).filter(Boolean)
    rows = rows.filter((x) => tags.every((expected) => x.tags.some((t) => t.includes(expected))))
  }

  if (query.keyword) {
    const kw = query.keyword.toLocaleLowerCase('zh-CN').trim()
    rows = rows.filter((x) =>
      x.stemText.toLocaleLowerCase('zh-CN').includes(kw)
      || x.chapter.toLocaleLowerCase('zh-CN').includes(kw)
      || x.tags.some((t) => t.toLocaleLowerCase('zh-CN').includes(kw)),
    )
  }

  // 知识块筛选：合并 knowledgeBlockIds（复数，逗号分隔）与 knowledgeBlockId（单值）
  const kbIds = [
    ...(query.knowledgeBlockIds ? query.knowledgeBlockIds.split(',').map((s) => s.trim()).filter(Boolean) : []),
    ...(query.knowledgeBlockId ? [query.knowledgeBlockId] : []),
  ]
  if (kbIds.length) rows = rows.filter((x) => x.knowledgeBlockIds.some((b) => kbIds.includes(b)))

  // 难度/分值/资源需完整数据，这里先用 index 无法承担，留空由调用方补充（或用 paper 补全字段）
  // 为简洁，这里忽略 difficulty/score/hasResources（前端筛选 UI 未使用它们做过滤）

  // 稳定排序：默认正序（年份升序 → 题号升序，即 2009.1 → 2026.47）
  const dir = query.sortOrder === 'desc' ? -1 : 1
  rows.sort((a, b) => ((a.year - b.year) || (a.number - b.number)) * dir)

  return rows
}

/** 加载一批题目的完整数据（答案/解析）。 */
export async function getExamsByIds(ids: string[]): Promise<Exam[]> {
  const index = await getExamIndex()
  const byId = new Map(index.map((x) => [x.id, x]))
  const perYear = new Map<number, string[]>()
  for (const id of ids) {
    const row = byId.get(id)
    if (row) {
      const list = perYear.get(row.year) || []
      list.push(id)
      perYear.set(row.year, list)
    }
  }

  const result: Exam[] = []
  for (const [year, yearIds] of perYear) {
    const paper = await getExamPaper(year)
    if (!paper) continue
    const idSet = new Set(yearIds)
    for (const q of paper.questions) if (idSet.has(q.id)) result.push(q)
  }
  return result
}

/** 经典分页查询，返回与后端一致的 ExamListResponse。 */
export async function queryQuestions(query: ExamFilterQuery & { page?: number; pageSize?: number }): Promise<ExamListResponse> {
  const rows = await queryIndexIds(query)
  const page = Math.max(1, query.page || 1)
  const pageSize = query.pageSize || 50
  const start = (page - 1) * pageSize
  const pageRows = rows.slice(start, start + pageSize)
  const items = await getExamsByIds(pageRows.map((x) => x.id))
  // items 里的顺序按 getExamsByIds 的分组产生，需按 id 排序回 pageRows 顺序
  const order = new Map(pageRows.map((x) => [x.id, 0]))
  const pageExamIdSet = new Set(pageRows.map((x) => x.id))
  const ordered = items
    .filter((x) => pageExamIdSet.has(x.id))
    .sort((a, b) => (pageRows.findIndex((p) => p.id === a.id) - pageRows.findIndex((p) => p.id === b.id)))
  return {
    items: ordered,
    total: rows.length,
    page,
    pageSize,
    totalPages: Math.ceil(rows.length / pageSize),
  }
}

export async function getQuestionById(id: string): Promise<Exam | null> {
  const index = await getExamIndex()
  const row = index.find((x) => x.id === id)
  if (!row) return null
  const paper = await getExamPaper(row.year)
  if (!paper) return null
  return paper.questions.find((q) => q.id === id) || null
}

/** 知识块关联：index 反查所有关联题目 id，按年份/题号稳定排序。 */
export async function getQuestionsByKnowledgeBlockIds(blockIds: string[]): Promise<ExamKnowledgeLink[]> {
  const set = new Set(blockIds.map((b) => b.trim()).filter(Boolean))
  if (!set.size) return []
  const index = await getExamIndex()
  const links: ExamKnowledgeLink[] = []
  for (const row of index) {
    const matched = row.knowledgeBlockIds.filter((b) => set.has(b))
    for (const kb of matched) {
      links.push({
        knowledgeBlockId: kb,
        examId: row.id,
        year: row.year,
        number: row.number,
        subject: row.subject,
        score: null,
        stem: row.stemText,
      })
    }
  }
  return links.sort((a, b) => a.year - b.year || a.number - b.number)
}

/** 前/后一题（在当前筛选结果范围内）。 */
export async function getAdjacentQuestion(
  currentId: string,
  direction: 'prev' | 'next',
  query: ExamFilterQuery,
): Promise<{ id: string; year: number; number: number } | null> {
  const rows = await queryIndexIds(query)
  const idx = rows.findIndex((x) => x.id === currentId)
  if (idx === -1) return null
  const target = direction === 'prev' ? rows[idx - 1] : rows[idx + 1]
  if (!target) return null
  return { id: target.id, year: target.year, number: target.number }
}

/* ---------- 筛选器（filters） ---------- */

/**
 * 从知识树 pointId 出发，返回该 point 对应文章里全部 kb-* block ID（轻量同步索引）。
 * 没注册文章的点返回空数组。
 */
function collectBlockIdsOfPoint(pointId: string): string[] {
  return blockIdsOfPoint[pointId] ?? []
}

/**
 * 基于知识块 ID 集合，统计「题目的 knowledgeBlockIds 与之有交集」的去重真题数。
 * 注意：此处 **不按 subject 过滤**，口径与知识页每节「N 道关联真题」完全一致
 * （允许跨科目 kb 关联，例如 OS 的系统调用题挂到了 co-interrupt，也会计入 CO 的关联计数）。
 * 这样侧栏显示的数字与知识页点进去看到的数量才会一致。
 * 同时返回匹配到的题目 id 集合，供上层去重合并使用。
 */
function countIntersectingExams(
  index: ExamIndexItem[],
  _subject: ExamSubject,
  blockIds: Set<string>,
): { count: number; examIds: Set<string> } {
  const examIds = new Set<string>()
  if (blockIds.size === 0) return { count: 0, examIds }
  for (const row of index) {
    // 注意：不按 subject 过滤，用 knowledgeBlockIds 关联作为唯一真理
    if (examIds.has(row.id)) continue
    if (row.knowledgeBlockIds.some((b) => blockIds.has(b))) examIds.add(row.id)
  }
  return { count: examIds.size, examIds }
}

export async function getExamFilters(): Promise<ExamFilters> {
  const index = await getExamIndex()
  const years = [...new Set(index.map((x) => x.year))].sort((a, b) => b - a)
  // chapters 列表保留历史字段（兼容其他调用方），内容仍是 paper.json 的原始 chapter 名
  const chapters = [...new Set(index.map((x) => x.chapter))].sort((a, b) => a.localeCompare(b, 'zh-CN'))
  const tags = [...new Set(index.flatMap((x) => x.tags))].sort((a, b) => a.localeCompare(b, 'zh-CN'))
  const subjects = Object.entries(SUBJECT_LABELS).map(([value, label]) => ({ value: value as ExamSubject, label }))

  const books = (Object.entries(SUBJECT_LABELS) as Array<[ExamSubject, string]>).map(([subject, label]) => {
    const knowledgeSubject = EXAM_SUBJECT_TO_KNOWLEDGE_SUBJECT[subject]
    const knowledgeBook = knowledgeBooks.find((b) => b.subject === knowledgeSubject)

    // 知识树上找不到对应书本（极端兜底）：退回 paper.json chapter 字段聚合
    if (!knowledgeBook) {
      const counts = new Map<string, number>()
      for (const row of index) {
        if (row.subject !== subject) continue
        counts.set(row.chapter, (counts.get(row.chapter) || 0) + 1)
      }
      const fallbackChapters: ExamFilterBookChapter[] = [...counts.entries()]
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'zh-CN'))
        .map(([name, count]) => ({
          id: `${subject}__fallback__${name}`,
          name,
          count,
          blockIds: [],
          sections: [],
        }))
      return { subject, label, chapters: fallbackChapters }
    }

    // 正常路径：按知识树 chapter → section 层级，用 knowledgeBlockIds 交集统计
    const bookExamIds = new Set<string>()
    const builtChapters: ExamFilterBookChapter[] = []

    for (const chapter of knowledgeBook.chapters) {
      const chapterBlockSet = new Set<string>()
      const sections: ExamFilterBookChapterSection[] = []

      for (const section of chapter.sections) {
        const sectionBlockSet = new Set<string>()
        for (const point of section.points) {
          for (const bid of collectBlockIdsOfPoint(point.id)) sectionBlockSet.add(bid)
        }
        const { count, examIds } = countIntersectingExams(index, subject, sectionBlockSet)
        for (const bid of sectionBlockSet) chapterBlockSet.add(bid)
        for (const eid of examIds) bookExamIds.add(eid)
        sections.push({
          id: section.id,
          name: section.title,
          count,
          blockIds: [...sectionBlockSet],
        })
      }

      // chapter 级 count：按本章所有 block 并集去重（避免 section 之间一题多 block 重复计数）
      const chapterStat = countIntersectingExams(index, subject, chapterBlockSet)
      builtChapters.push({
        id: chapter.id,
        name: chapter.title,
        count: chapterStat.count,
        blockIds: [...chapterBlockSet],
        sections,
      })
    }

    return { subject, label, chapters: builtChapters }
  })

  return {
    total: index.length,
    years,
    subjects,
    questionTypes: [
      { value: 'choice', label: '选择题' },
      { value: 'comprehensive', label: '综合题' },
    ],
    chapters,
    books,
    tags,
    difficulties: [1, 2, 3, 4, 5],
    scores: [],
  }
}

/** 判题：纯前端比较答案。 */
export function submitAnswer(examId: string, answer: string) {
  return getQuestionById(examId).then((exam) => {
    if (!exam) throw new Error('未找到该题')
    const normalize = (s: string) => s.trim().toLocaleLowerCase('zh-CN')
    return {
      correct: normalize(exam.answer || '') === normalize(answer),
      answer: exam.answer || '',
      explanation: exam.explanation || '',
    }
  })
}
