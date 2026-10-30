import { ref } from 'vue'
import type { KnowledgeArticleBlock, KnowledgeArticleData } from '@/content/knowledge-articles/types'
import { getEditableArticle, editTree, findNode } from './content'
import { addTrash, changeWorkspace, clone, uid, workspace } from './store'

export const inlineMode = ref(false)
export const inlineFocusId = ref('')
export const inlineMessage = ref('')
export const inlineError = ref(false)
export const inlineDirtyCount = ref(0)
const drafts = new Map<string, { save: () => Promise<void>; dirty: () => boolean }>()
export function registerInlineDraft(id: string, draft: { save: () => Promise<void>; dirty: () => boolean }) {
  drafts.set(id, draft)
  return () => { drafts.delete(id); refreshDirtyCount() }
}
export function refreshDirtyCount() { inlineDirtyCount.value = [...drafts.values()].filter(d => d.dirty()).length }
export function inlineFeedback(message: string, error = false) { inlineMessage.value = message; inlineError.value = error }
export async function flushInlineDrafts() {
  await Promise.all([...drafts.values()].filter(d => d.dirty()).map(d => d.save()))
  refreshDirtyCount()
}
export async function finishInlineEditing() { await flushInlineDrafts(); inlineMode.value = false; inlineFeedback('已退出编辑，修改已保存在当前浏览器') }
export async function mutateInlineArticle(pointId: string, label: string, mutate: (article: KnowledgeArticleData, data: Parameters<Parameters<typeof changeWorkspace>[1]>[0]) => void) {
  const original = await getEditableArticle(pointId)
  changeWorkspace(label, data => {
    const article = clone(data.articles[pointId] || original)
    mutate(article, data)
    data.articles[pointId] = article
  })
}
export async function saveInlineBlock(pointId: string, subpointId: string, block: KnowledgeArticleBlock) {
  await mutateInlineArticle(pointId, '直接修改正文', article => {
    const sub = article.subpoints.find(s => s.id === subpointId)
    const i = sub?.blocks.findIndex(b => b.id === block.id) ?? -1
    if (!sub || i < 0) throw new Error('这段内容已被删除，请先恢复后再修改')
    sub.blocks[i] = clone(block)
  })
  inlineFeedback('这段内容已保存')
}
export async function deleteInlineBlock(pointId: string, subpointId: string, blockId: string) {
  await flushInlineDrafts()
  await mutateInlineArticle(pointId, '直接删除正文', (article, data) => {
    const sub = article.subpoints.find(s => s.id === subpointId)
    const index = sub?.blocks.findIndex(b => b.id === blockId) ?? -1
    if (!sub || index < 0) throw new Error('这段内容已不存在')
    const block = sub.blocks[index]
    addTrash(data, { kind: 'block', title: '正文 · ' + ((block as any).text || (block as any).title || block.id).slice(0, 35), parentId: subpointId, index, data: { pointId, subpointId, value: block } })
    sub.blocks.splice(index, 1)
  })
  inlineFeedback('已移入回收站，可以直接撤销')
}
export async function moveInlineBlock(pointId: string, subpointId: string, blockId: string, offset: number) {
  await flushInlineDrafts()
  await mutateInlineArticle(pointId, '直接调整正文顺序', article => {
    const blocks = article.subpoints.find(s => s.id === subpointId)?.blocks
    if (!blocks) return
    const i = blocks.findIndex(b => b.id === blockId), j = i + offset
    if (i < 0 || j < 0 || j >= blocks.length) return
    const [block] = blocks.splice(i, 1); blocks.splice(j, 0, block)
  })
  inlineFeedback('顺序已更新')
}
export type InlineBlockLocation = { pointId: string; subpointId: string; blockId: string }
export type InlineBlockDestination = { pointId: string; subpointId: string; beforeBlockId?: string }
export async function relocateInlineBlock(source: InlineBlockLocation, destination: InlineBlockDestination) {
  await flushInlineDrafts()
  const [originalSource, originalTarget] = await Promise.all([
    getEditableArticle(source.pointId),
    source.pointId === destination.pointId ? Promise.resolve(undefined) : getEditableArticle(destination.pointId),
  ])
  const sourceArticle = clone(workspace.articles[source.pointId] || originalSource)
  const targetArticle = source.pointId === destination.pointId ? sourceArticle : clone(workspace.articles[destination.pointId] || originalTarget!)
  const sourceBlocks = sourceArticle.subpoints.find(s => s.id === source.subpointId)?.blocks
  const targetBlocks = targetArticle.subpoints.find(s => s.id === destination.subpointId)?.blocks
  const sourceIndex = sourceBlocks?.findIndex(block => block.id === source.blockId) ?? -1
  const targetIndex = destination.beforeBlockId ? targetBlocks?.findIndex(block => block.id === destination.beforeBlockId) ?? -1 : targetBlocks?.length ?? -1
  if (!sourceBlocks || sourceIndex < 0 || !targetBlocks || targetIndex < 0) throw new Error('内容位置已变化，请重新拖动')
  if (sourceBlocks === targetBlocks && (targetIndex === sourceIndex || targetIndex === sourceIndex + 1)) { inlineFeedback('位置未改变'); return }
  if (sourceBlocks !== targetBlocks && targetBlocks.some(block => block.id === source.blockId)) throw new Error('目标小节已有相同编号的内容，已保留原位置')
  const [block] = sourceBlocks.splice(sourceIndex, 1)
  const index = destination.beforeBlockId ? targetBlocks.findIndex(item => item.id === destination.beforeBlockId) : targetBlocks.length
  targetBlocks.splice(index, 0, block)
  changeWorkspace('拖动调整正文位置', data => {
    data.articles[source.pointId] = sourceArticle
    if (source.pointId !== destination.pointId) data.articles[destination.pointId] = targetArticle
  })
  inlineFeedback('位置已更新，可以撤销')
}
export const inlineKinds = { paragraph: '文字段落', formula: '公式', image: '图片', callout: '提示框', html: '表格', animation: '原站动画', embed: '自定义动画' } as const
export async function addInlineBlock(pointId: string, subpointId: string, type: keyof typeof inlineKinds = 'paragraph', afterId?: string) {
  await flushInlineDrafts()
  const id = uid('kb')
  const content = { paragraph: { text: '' }, formula: { formula: '', caption: '' }, image: { src: '', alt: '', caption: '' }, callout: { title: '提示', text: '', tone: 'orange' }, html: { html: '<table><tr><th>标题</th><th>说明</th></tr><tr><td>内容</td><td>内容</td></tr></table>' }, animation: { animation: { id: '' } }, embed: { title: '交互演示', html: '<!doctype html><html lang="zh-CN"><body><button onclick="this.textContent=\'运行成功\'">运行演示</button></body></html>' } }[type]
  inlineFocusId.value = id
  await mutateInlineArticle(pointId, '直接添加内容', article => {
    const sub = article.subpoints.find(s => s.id === subpointId)
    if (!sub) throw new Error('所属小节已被删除')
    const index = afterId ? sub.blocks.findIndex(b => b.id === afterId) + 1 : sub.blocks.length
    sub.blocks.splice(index, 0, { id, type, ...content } as KnowledgeArticleBlock)
  })
  inlineFeedback('已添加，直接输入内容即可')
}
export async function addInlineSubpoint(pointId: string) {
  await flushInlineDrafts()
  const subId = uid('subpoint'), blockId = uid('kb')
  inlineFocusId.value = blockId
  await mutateInlineArticle(pointId, '直接添加小节', article => article.subpoints.push({ id: subId, title: '新小节', blocks: [{ id: blockId, type: 'paragraph', text: '' }] }))
}
export async function addInlineArticle(sectionId: string) {
  await flushInlineDrafts()
  const { addNode } = await import('./content')
  const id = addNode(sectionId)
  if (!id) throw new Error('无法添加文章，请选择有效的页面')
  await addInlineSubpoint(id)
  inlineFeedback('新文章已加入，可以直接修改标题和正文')
}
export async function deleteInlineSubpoint(pointId: string, subpointId: string) {
  await flushInlineDrafts()
  await mutateInlineArticle(pointId, '直接删除小节', (article, data) => {
    const index = article.subpoints.findIndex(s => s.id === subpointId)
    if (index < 0) return
    const value = article.subpoints[index]
    addTrash(data, { kind: 'subpoint', title: value.title, parentId: pointId, index, data: { pointId, value } })
    article.subpoints.splice(index, 1)
  })
  inlineFeedback('小节已移入回收站，可以直接撤销')
}
export async function renameInlineTitle(kind: 'node' | 'subpoint', id: string, title: string, pointId?: string) {
  if (!title.trim()) throw new Error('标题不能为空')
  if (kind === 'node') editTree('直接修改标题', books => { const found = findNode(id, books); if (!found) throw new Error('目录已不存在'); found.node.title = title.trim() })
  else await mutateInlineArticle(pointId!, '直接修改小节标题', article => { const sub = article.subpoints.find(s => s.id === id); if (!sub) throw new Error('小节已不存在'); sub.title = title.trim() })
  inlineFeedback('标题已保存')
}
export async function inlineAction(action: () => Promise<unknown> | unknown) {
  try { await action() } catch (e) { inlineFeedback(e instanceof Error ? e.message : String(e), true) }
}
