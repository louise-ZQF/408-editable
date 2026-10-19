import { workspace } from '@/editor/store'
import { ensureAnimations, hydrateArticle, rememberAnimations } from '@/editor/content'
import type { KnowledgeArticleData } from './types'
import {
  blockIdsOfPoint as originalBlockIdsOfPoint,
  bookOfPoint,
  subpointLocationByBlockId,
} from './block-index.generated'

/**
 * 知识正文注册表 —— 按教材（book）拆分后，这里不再静态打包任何文章正文。
 * 运行时通过动态 import() 按需加载「当前教材」对应的正文 chunk，
 * 轻量同步元数据（block 反查、筛选器 blockIds）来自自动生成的 block-index。
 */

/** 教材 id → 该教材正文模块的动态加载器（每个模块是独立 chunk）。 */
const BOOK_LOADERS: Record<string, () => Promise<{ articlesByPoint: Record<string, KnowledgeArticleData> }>> = {
  'computer-network': () => import('./books/computer-network'),
  'data-structures': () => import('./books/data-structures'),
  'computer-organization': () => import('./books/computer-organization'),
  'operating-systems': () => import('./books/operating-systems'),
}

/** 按教材缓存已加载的正文，避免同一教材重复下载。 */
const bookRegistryCache = new Map<string, Promise<Record<string, KnowledgeArticleData>>>()

/** 加载某教材的全部知识正文（pointId → 文章），结果按教材缓存。 */
export function loadOriginalBookContent(bookId: string): Promise<Record<string, KnowledgeArticleData>> {
  let pending = bookRegistryCache.get(bookId)
  if (pending) return pending
  const loader = BOOK_LOADERS[bookId]
  pending = loader
    ? loader()
        .then((mod) => { rememberAnimations(mod.articlesByPoint); return mod.articlesByPoint })
        .catch((error) => {
          bookRegistryCache.delete(bookId)
          throw error
        })
    : Promise.resolve({})
  bookRegistryCache.set(bookId, pending)
  return pending
}

/** 由 pointId 加载其所在教材的正文文章（跨书共用点也能正确命中拥有者）。 */
export async function getArticleForPoint(pointId: string): Promise<KnowledgeArticleData | undefined> {
  const owner = bookOfPoint[pointId]
  if (owner) await loadOriginalBookContent(owner)
  if (workspace.articles[pointId]) {
    if (workspace.articles[pointId].subpoints.some(s => s.blocks.some(b => b.type === 'animation'))) await ensureAnimations()
    return hydrateArticle(workspace.articles[pointId])
  }
  if (!owner) return undefined
  const articles = await loadBookContent(owner)
  return articles[pointId]
}

/** pointId → 其正文所属教材 bookId（同步元数据）。 */
export { bookOfPoint }

export type KnowledgeSubpointLocation = {
  pointId: string
  subpointId: string
  subpointTitle: string
}

/** 由知识块 ID（kb-*）反查它所属的小知识点 subpoint（轻量同步元数据）。 */
export function findSubpointLocationByBlockId(blockId: string): KnowledgeSubpointLocation | undefined {
  for (const article of Object.values(workspace.articles)) for (const sub of article.subpoints) {
    if (sub.blocks.some(b => b.id === blockId)) return { pointId: article.pointId, subpointId: sub.id, subpointTitle: sub.title }
  }
  const original = subpointLocationByBlockId[blockId]
  if (original && workspace.articles[original.pointId]) return undefined
  return original
}

/** 由知识块 ID（kb-*）反查它所属的知识点 pointId */
export function findPointIdByBlockId(blockId: string): string | undefined {
  return findSubpointLocationByBlockId(blockId)?.pointId
}

/** pointId → 该知识点正文的全部 kb-* block ID（同步元数据，供筛选器/真题侧栏统计用）。 */
export const blockIdsOfPoint = new Proxy(originalBlockIdsOfPoint, {
  get(target, key: string) {
    const article = workspace.articles[key]
    return article ? article.subpoints.flatMap(s => s.blocks.map(b => b.id)) : target[key]
  },
})
export async function loadBookContent(bookId: string): Promise<Record<string, KnowledgeArticleData>> {
  const original = await loadOriginalBookContent(bookId)
  return { ...original, ...Object.fromEntries(Object.entries(workspace.articles).map(([id, article]) => [id, hydrateArticle(article)])) }
}