import { knowledgeBooks } from '@/content/knowledge-tree'
import { loadBookContent, getArticleForPoint, loadOriginalBookContent } from '@/content/knowledge-articles/registry'
import { getExamManifest, getExamPaper } from '@/services/examRepository'
import { addTrash, changeWorkspace, clone, snapshot, uid, workspace } from './store'
import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'
import type { ManimWebAnimation } from '@/animations/types'

export const animations = new Map<string, ManimWebAnimation>()
export function rememberAnimations(articles: Record<string, KnowledgeArticleData>) {
  for (const article of Object.values(articles)) for (const sub of article.subpoints) for (const b of sub.blocks) if (b.type === 'animation') animations.set(b.animation.id, b.animation)
}
export function serializeArticle(article: KnowledgeArticleData): KnowledgeArticleData {
  return JSON.parse(JSON.stringify(article, (key, value) => key === 'animation' ? { id: value.id } : value))
}
export function hydrateArticle(article: KnowledgeArticleData): KnowledgeArticleData {
  return { ...article, subpoints: article.subpoints.map(s => ({ ...s, blocks: s.blocks.map(b => b.type === 'animation' && animations.has(b.animation.id) ? { ...b, animation: animations.get(b.animation.id)! } : b) })) }
}
export async function ensureAnimations() {
  for (const book of ['data-structures', 'computer-organization', 'operating-systems', 'computer-network']) await loadOriginalBookContent(book)
  return animations
}
export function findNode(id: string, books = knowledgeBooks): { node: any; parent: any; siblings: any[]; kind: string; bookId: string } | undefined {
  for (const book of books) {
    if (book.id === id) return { node: book, parent: null, siblings: books, kind: 'book', bookId: book.id }
    for (const chapter of book.chapters) {
      if (chapter.id === id) return { node: chapter, parent: book, siblings: book.chapters, kind: 'chapter', bookId: book.id }
      for (const section of chapter.sections) {
        if (section.id === id) return { node: section, parent: chapter, siblings: chapter.sections, kind: 'section', bookId: book.id }
        for (const point of section.points) if (point.id === id) return { node: point, parent: section, siblings: section.points, kind: 'point', bookId: book.id }
      }
    }
  }
}
export function editTree(label: string, update: (books: typeof knowledgeBooks, data: ReturnType<typeof snapshot>) => void) {
  changeWorkspace(label, data => { if (!data.books) data.books = clone(knowledgeBooks); update(data.books, data) })
}
export const kindNames: Record<string, string> = { book: '书籍', chapter: '章节', section: '页面', point: '文章', subpoint: '小节', block: '正文块', exam: '题目' }
export function addNode(parentId = '') {
  const parent = findNode(parentId)
  const kind = !parent ? 'book' : { book: 'chapter', chapter: 'section', section: 'point' }[parent.kind]
  if (!kind) return ''
  const id = uid(kind)
  const node: any = { id, title: `未命名${kindNames[kind]}` }
  if (kind === 'book') Object.assign(node, { subtitle: '', subject: 'DATA_STRUCTURES', chapters: [] })
  if (kind === 'chapter') Object.assign(node, { layer: 'L1', sections: [] })
  if (kind === 'section') Object.assign(node, { points: [] })
  if (kind === 'point') Object.assign(node, { summary: '', importance: 3 })
  editTree('新增目录', books => {
    if (kind === 'book') books.push(node)
    else { const p = findNode(parentId, books)!.node; p[{ chapter: 'chapters', section: 'sections', point: 'points' }[kind]!].push(node) }
  })
  return id
}
export function deleteNode(id: string) {
  editTree('移入回收站', (books, data) => {
    const found = findNode(id, books); if (!found) return
    const index = found.siblings.indexOf(found.node)
    addTrash(data, { kind: found.kind, title: found.node.title, parentId: found.parent?.id || '', index, data: found.node })
    found.siblings.splice(index, 1)
  })
}
export function restoreItem(id: string) {
  changeWorkspace('从回收站恢复', data => {
    const item = data.trash.find(x => x.id === id); if (!item) return
    if (item.kind === 'exam') {
      data.deletedExams = data.deletedExams.filter(x => x !== item.data.id)
      data.exams[item.data.id] = item.data
    } else if (item.kind === 'subpoint' || item.kind === 'block') {
      const { pointId, subpointId, value } = item.data
      const article = data.articles[pointId]
      if (!article) throw new Error('请先恢复所属文章')
      const list = item.kind === 'subpoint' ? article.subpoints : article.subpoints.find(s => s.id === subpointId)?.blocks
      if (!list) throw new Error('请先恢复所属小节')
      if (list.some((x: any) => x.id === value.id)) throw new Error('内容已存在')
      ;(list as any[]).splice(Math.min(item.index, list.length), 0, value)
    } else {
      if (!data.books) data.books = clone(knowledgeBooks)
      if (findNode(item.data.id, data.books)) throw new Error('目录已存在')
      const parent = findNode(item.parentId, data.books)
      if (item.kind !== 'book' && !parent) throw new Error('请先恢复所属上级目录')
      const key = { chapter: 'chapters', section: 'sections', point: 'points' }[item.kind]
      const list = item.kind === 'book' ? data.books : parent!.node[key!]
      list.splice(Math.min(item.index, list.length), 0, item.data)
    }
    data.trash = data.trash.filter(x => x.id !== id)
  })
}
export async function getEditableArticle(pointId: string) {
  const original = await getArticleForPoint(pointId)
  return original ? serializeArticle(original) : { pointId, subpoints: [] }
}
export async function completeBackup() {
  const data = snapshot(); data.books = clone(knowledgeBooks)
  for (const book of knowledgeBooks) {
    const articles = await loadBookContent(book.id)
    for (const chapter of book.chapters) for (const section of chapter.sections) for (const point of section.points) if (articles[point.id]) data.articles[point.id] = serializeArticle(articles[point.id])
  }
  const manifest = await getExamManifest()
  for (const year of manifest.years) {
    const paper = await getExamPaper(year.year)
    if (!paper) throw new Error(`${year.year} 年试卷未加载，完整备份中止，请重试`)
    for (const q of paper.questions) data.exams[q.id] = clone(q)
  }
  for (const id of data.deletedExams) delete data.exams[id]
  return data
}
