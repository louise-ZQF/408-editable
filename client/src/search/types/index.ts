export type SearchKnowledgeSubpoint = {
  /** kb-* 稳定块 ID */
  blockId: string
  /** subpoint 标题 */
  title: string
  /** 从 paragraph/callout/formula/image.caption/html 提取的纯文本（去掉 Markdown 语法） */
  text: string
}

export type SearchKnowledgePoint = {
  /** 知识树 point id，如 kp-tcp-reliable */
  pointId: string
  /** 所属 section id，如 cn-transport-tcp */
  sectionId: string
  /** 所属 book id，如 cn */
  bookId: string
  /** point 标题 */
  title: string
  /** 完整面包屑，如 "计算机网络 › 传输层 › TCP 可靠传输" */
  breadcrumb: string
  /** 跳转路由，如 "/knowledge/cn/cn-transport-tcp" */
  route: string
  /** subpoint 列表：正文文本与 blockId 一一对应 */
  subpoints: SearchKnowledgeSubpoint[]
  /** 该 point 下所有 subpoint 关联的真题数量（去重） */
  examCount: number
  /** 该 point 关联的所有知识块 ID（聚合） */
  allBlockIds: string[]
}

/** 构建脚本提取的 subpoint 中间结构，最终会聚合为 SearchKnowledgeSectionDoc。 */
export type SearchKnowledgeDoc = {
  /** 构建期中间结构的唯一索引 */
  docIdx: number
  pointId: string
  sectionId: string
  bookId: string
  bookTitle: string
  chapterTitle: string
  sectionTitle: string
  pointTitle: string
  subpointTitle: string
  /** 各 block 的纯文本，与 blockIds 一一对应（用于反查 snippet 对应的具体 block） */
  blockTexts: string[]
  /** 当前 subpoint 自己的 block id 数组，与 blockTexts 一一对应 */
  blockIds: string[]
  /** subpoint 在文章里的稳定 id（如 'co-cache-performance'），用于标题命中时跳到 h2 锚点 */
  subpointId: string
  /** 完整面包屑，如 "计算机网络 › 传输层 › TCP 可靠传输" */
  breadcrumb: string
  route: string
  blockId: string
  /** 整个 point 下所有 subpoint 的 block id 聚合（"看相关真题"用） */
  allBlockIds: string[]
  examCount: number
}

export type SearchKnowledgeSectionPart = {
  pointId: string
  pointTitle: string
  subpointTitle: string
  subpointId: string
  blockId: string
  blockTexts: string[]
  blockIds: string[]
}

/** MiniSearch 的实际索引单位：一个 section 聚合成一篇文档。 */
export type SearchKnowledgeSectionDoc = {
  sectionId: string
  bookId: string
  bookTitle: string
  chapterTitle: string
  sectionTitle: string
  pointTitles: string
  subpointTitles: string
  route: string
  parts: SearchKnowledgeSectionPart[]
  allBlockIds: string[]
  examCount: number
}

/** Section 内部的可定位片段；由独立 MiniSearch 索引选出当前 Section 的最佳命中位置。 */
export type SearchKnowledgeFragmentDoc = {
  fragmentId: string
  sectionId: string
  kind: 'point' | 'subpoint' | 'block'
  /** 对应 SearchKnowledgeSectionDoc.parts 的位置。 */
  partIndex: number
  /** kind=block 时对应 part.blockTexts 的位置，否则为 -1。 */
  blockIndex: number
  /** 仅参与建索引，不序列化进搜索结果。 */
  title: string
  /** 仅参与建索引，不序列化进搜索结果。 */
  text: string
}

export type SearchExamItem = {
  /** 题目 id，如 exam-2020-5 */
  id: string
  year: number
  number: number
  /** 展示标题，如 "2020年第5题" */
  title: string
  /** 科目英文：ds / co / os / cn */
  subject: string
  /** 章节中文，如 "传输层" */
  chapter: string
  /** 题干预览文字（来自 index.json.stemText） */
  stem: string
  /** 标签数组 */
  tags: string[]
  /** 关联的知识块 ID */
  knowledgeBlockIds: string[]
  /** 跳转路由，如 "/exams?year=2020&exam=exam-2020-5" */
  route: string
}

/** 构建时输出的搜索语料 JSON */
export type SearchCorpus = {
  version: number
  generatedAt: string
  exams: SearchExamItem[]
}

/** 知识结果的匹配层级（用于展示/排序）：数值越小优先级越高 */
export type KnowledgeMatchField =
  | 'subpoint'   // 子点标题
  | 'point'      // 知识点标题
  | 'section'    // section 标题
  | 'chapter'    // 章节标题
  | 'book'       // 书名
  | 'body'       // 正文
  | 'breadcrumb' // 完整路径（冗余召回）

/** 运行时查询返回的单条结果 */
export type SearchResult = {
  /** 结果来源：知识 subpoint 或 真题 */
  type: 'knowledge' | 'exam'
  /** 展示标题 */
  title: string
  /** 副标题：面包屑（知识）/ 科目+章节（真题） */
  subtitle: string
  /** 匹配片段摘要，供前端 <mark> 高亮 */
  snippet?: string
  /** 点击跳转路由 */
  route: string

  /* 知识结果独有 */
  /** 命中的 subpoint 所在 blockId，用于跳转到真题过滤页面 */
  blockId?: string
  /** 此 point/section 级 "看相关真题" 时传递的全部 blockId（可能比 blockId 多） */
  blockIds?: string[]
  /** 关联真题数量（已算好，可直接展示） */
  examCount?: number
  /** 相关真题页路由：/exams?knowledgeBlockId=blockId */
  examRoute?: string
  /** 知识命中的层级（subpoint/point/section/body），用于排序与选择性高亮 */
  matchField?: KnowledgeMatchField
  /** 命中 point 的 id（跳转到该 point 锚点时用） */
  pointId?: string
  /** 命中 section 的 id（跳转到该 section 开头时用） */
  sectionId?: string
  /** subpoint 在文章里的稳定 id（标题命中时跳到该 subpoint 的 h2 锚点） */
  subpointId?: string
  /** 正文命中时精确到具体 block 的 id（用户看到的 snippet 对应的 block） */
  matchedBlockId?: string
  /** 用于高亮的原始用户查询；同义词只参与召回，不扩大高亮范围。 */
  highlightQuery?: string
  /** 各级标题（供路径分段渲染与精确高亮） */
  bookTitle?: string
  chapterTitle?: string
  sectionTitle?: string
  pointTitle?: string
  subpointTitle?: string

  /* 真题结果独有 */
  year?: number
  number?: number

  /** 精确题号命中为最高优先级，用于排序加权 */
  isExact?: boolean
  /** 原始得分，仅供调试 */
  score?: number
}
