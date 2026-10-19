import { reactive, ref } from 'vue'
import type { Book, Exam } from '@/types'
import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export type TrashItem = { id: string; kind: string; title: string; parentId: string; index: number; data: any; time: number }
export type Settings = {
  title: string; headline: string; tagline: string; lines: string[]; footer: string;
  showLogo: boolean; showSubtitle: boolean; showSearch: boolean; showKnowledge: boolean;
  showExams: boolean; showContributors: boolean; showRepo: boolean; showFooter: boolean;
  knowledgeLabel: string; examsLabel: string; accent: string; fontSize: number;
  repository: string; branch: string; contributorsJSON: string; contributorTitle: string; contributorSubtitle: string;
}
export type WorkspaceData = {
  format: '408-editable-v1'; updatedAt: number; books: Book[] | null;
  articles: Record<string, KnowledgeArticleData>; exams: Record<string, Exam>;
  deletedExams: string[]; trash: TrashItem[]; settings: Settings;
}
export const defaults: Settings = {
  title: '408 简纲', headline: '把 408 学薄一点', tagline: '极简 · 精炼 · 可视化',
  lines: ['用更少的内容，建立更清晰的知识体系', '我的教材，由我自己定义', '用图像和交互式动画，帮助你快速掌握复杂的知识'],
  footer: '极简 · 精炼 · 可视化 · 开源共享 · 持续更新 · 一起进步',
  showLogo: true, showSubtitle: true, showSearch: true, showKnowledge: true, showExams: true,
  showContributors: true, showRepo: true, showFooter: true,
  knowledgeLabel: '浏览知识简纲', examsLabel: '查看历年真题', accent: '#1f49ba', fontSize: 19,
  repository: 'louise-ZQF/408-editable', branch: 'main', contributorsJSON: '', contributorTitle: '一起把 408 学薄一点', contributorSubtitle: '感谢每一位参与共建、纠错与分享的朋友',
}
function empty(): WorkspaceData { return { format: '408-editable-v1', updatedAt: 0, books: null, articles: {}, exams: {}, deletedExams: [], trash: [], settings: { ...defaults, lines: [...defaults.lines] } } }
export const workspace = reactive<WorkspaceData>(empty())
export const revision = ref(0)
export const editorOpen = ref(false)
export const editTarget = ref('')
export const saveStatus = ref('正在读取个人内容…')
export const errorMessage = ref('')
export const undoCount = ref(0)
export const diskAvailable = ref(false)
export const unpublished = ref(false)
const history: string[] = []
let db: IDBDatabase | undefined
let saving: Promise<void> = Promise.resolve()

export function clone<T>(data: T): T { return JSON.parse(JSON.stringify(data)) }
export function uid(prefix = 'custom') { return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}` }
export function snapshot(): WorkspaceData { return clone(workspace) }
export function openEditor(target = '') { editTarget.value = target; editorOpen.value = true }

function assert(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(message) }
export function validateWorkspace(raw: unknown): WorkspaceData {
  assert(raw && typeof raw === 'object', '备份必须是 JSON 对象')
  const data = raw as WorkspaceData
  assert(data.format === '408-editable-v1', '请选择本网站导出的 408 教材备份')
  const scan = (value: any, depth = 0) => {
    assert(depth < 50, '备份层级过深')
    if (!value || typeof value !== 'object') return
    for (const [key, child] of Object.entries(value)) {
      assert(!['__proto__', 'constructor', 'prototype'].includes(key), '备份包含不支持的字段')
      scan(child, depth + 1)
    }
  }
  scan(data)
  assert(Number.isFinite(data.updatedAt), '缺少有效的保存时间')
  assert(data.books === null || Array.isArray(data.books), '教材目录格式错误')
  const ids = new Set<string>()
  const checkNodes = (nodes: any[], depth: number) => {
    for (const node of nodes) {
      assert(node && typeof node.id === 'string' && /^[\w-]+$/.test(node.id) && typeof node.title === 'string', '目录标题或编号格式错误')
      // 原站跨教材共用部分文章，知识点允许复用，路由和上级目录必须唯一。
      if (depth < 3) { assert(!ids.has(node.id), `目录编号重复：${node.id}`); ids.add(node.id) }
      if (depth < 3) { const children = node[['chapters', 'sections', 'points'][depth]]; assert(Array.isArray(children), '目录层级格式错误'); checkNodes(children, depth + 1) }
    }
  }
  if (data.books) checkNodes(data.books, 0)
  for (const field of ['articles', 'exams'] as const) assert(data[field] && !Array.isArray(data[field]) && typeof data[field] === 'object', '内容数据格式错误')
  for (const [id, article] of Object.entries(data.articles)) {
    assert(article.pointId === id && Array.isArray(article.subpoints), `文章格式错误：${id}`)
    const blockIds = new Set<string>()
    const subIds = new Set<string>()
    for (const sub of article.subpoints) {
      assert(typeof sub.id === 'string' && typeof sub.title === 'string' && Array.isArray(sub.blocks) && !subIds.has(sub.id), '小节格式错误或编号重复')
      subIds.add(sub.id)
      for (const block of sub.blocks) {
        assert(typeof block.id === 'string' && !blockIds.has(block.id), '正文块编号缺失或重复'); blockIds.add(block.id)
        assert(['paragraph', 'html', 'formula', 'callout', 'image', 'animation', 'embed'].includes(block.type), '正文块类型不支持')
        const b = block as any
        const required: Record<string, string[]> = { paragraph: ['text'], html: ['html'], formula: ['formula'], callout: ['title', 'text'], image: ['src', 'alt'], embed: ['html', 'title'] }
        for (const key of required[b.type] || []) assert(typeof b[key] === 'string', `正文块缺少 ${key}`)
        if (b.type === 'animation') assert(b.animation && typeof b.animation.id === 'string', '动画引用错误')
      }
    }
  }
  for (const [id, q] of Object.entries(data.exams)) {
    assert(q.id === id && typeof q.stem === 'string' && Number.isFinite(q.year) && Number.isFinite(q.number), '题目编号、年份或题干格式错误')
    assert(['choice', 'comprehensive'].includes(q.questionType) && ['ds', 'co', 'os', 'cn'].includes(q.subject), '题型或科目格式错误')
    assert(Array.isArray(q.options) && q.options.every(o => typeof o.key === 'string' && typeof o.text === 'string'), '题目选项格式错误')
    for (const key of ['tags', 'resourceLinks', 'knowledgeBlockIds'] as const) assert(Array.isArray(q[key]) && q[key].every(x => typeof x === 'string'), '题目关联信息格式错误')
    assert(typeof q.chapterName === 'string' && Number.isFinite(q.score) && Number.isFinite(q.difficulty), '题目属性格式错误')
  }
  assert(Array.isArray(data.deletedExams) && data.deletedExams.every(x => typeof x === 'string') && Array.isArray(data.trash), '回收站格式错误')
  assert(data.settings && typeof data.settings === 'object', '网站设置格式错误')
  const settings = { ...defaults, ...data.settings }
  for (const [key, value] of Object.entries(defaults)) assert(typeof (settings as any)[key] === typeof value, `网站设置格式错误：${key}`)
  assert(Array.isArray(settings.lines) && settings.lines.every(x => typeof x === 'string'), '副标题必须为文本列表')
  if (settings.contributorsJSON.trim()) { const people = JSON.parse(settings.contributorsJSON); assert(Array.isArray(people) && people.every((p: any) => typeof p.name === 'string' && ['github','bilibili','douyin','xhs'].includes(p.platform) && /^https?:\/\//.test(p.url)), '共建者列表格式错误') }
  assert(/^#[0-9a-f]{6}$/i.test(settings.accent) && settings.fontSize >= 14 && settings.fontSize <= 28, '主题颜色或字号格式错误')
  return clone({ ...data, settings })
}

function putIDB(data: WorkspaceData): Promise<void> {
  if (!db) return Promise.reject(new Error('浏览器未允许持久存储，请下载备份'))
  return new Promise((resolve, reject) => {
    const tx = db!.transaction('workspace', 'readwrite')
    tx.objectStore('workspace').put(data, 'current')
    tx.oncomplete = () => resolve(); tx.onerror = () => reject(tx.error)
  })
}
export async function initializeWorkspace() {
  let local: WorkspaceData | undefined
  let lastPublishedAt = 0
  try {
    db = await new Promise<IDBDatabase>((resolve, reject) => {
      const req = indexedDB.open('408-editable-v1', 1)
      req.onupgradeneeded = () => req.result.createObjectStore('workspace')
      req.onsuccess = () => resolve(req.result); req.onerror = () => reject(req.error)
    })
    const stored = await new Promise<any>((resolve, reject) => {
      const req = db!.transaction('workspace').objectStore('workspace').get('current')
      req.onsuccess = () => resolve(req.result); req.onerror = () => reject(req.error)
    })
    if (stored) local = validateWorkspace(stored)
    lastPublishedAt = await new Promise<number>(resolve => { const req = db!.transaction('workspace').objectStore('workspace').get('lastPublishedAt'); req.onsuccess = () => resolve(Number(req.result) || 0); req.onerror = () => resolve(0) })
  } catch { errorMessage.value = '浏览器存储不可用，请及时导出备份。' }
  let published: WorkspaceData | undefined
  try {
    const r = await fetch(`${import.meta.env.BASE_URL}editor/content.json?t=${Date.now()}`, { cache: 'no-store' })
    if (r.ok) published = validateWorkspace(await r.json())
  } catch { /* 无发布数据时使用原教材。 */ }
  if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
    try {
      const r = await fetch('/__editor/data')
      if (r.headers.get('Content-Type')?.includes('application/json')) {
        const data = await r.json(); diskAvailable.value = true
        if (data && (!local || data.updatedAt > local.updatedAt)) local = validateWorkspace(data)
      }
    } catch { /* 静态预览没有文件服务。 */ }
  }
  const conflict = !!local && !!published && local.updatedAt > lastPublishedAt && published.updatedAt > lastPublishedAt && local.updatedAt !== published.updatedAt
  const chosen = local && (conflict || !published || local.updatedAt >= published.updatedAt) ? local : published
  if (conflict) errorMessage.value = '本机与 GitHub 都有未合并的修改，已保留本机版本。请先下载备份，再从「备份与发布」载入 GitHub 版本或发布。' 
  if (chosen) Object.assign(workspace, chosen)
  unpublished.value = !!local && local.updatedAt !== (published?.updatedAt || 0)
  if (published && chosen === published) await markPublished(published.updatedAt)
  saveStatus.value = diskAvailable.value ? '已保存到浏览器和本机文件' : '已保存到此浏览器'
  if (chosen && db) await putIDB(chosen).catch(() => {})
}
function queueSave() {
  const data = snapshot()
  saveStatus.value = '正在保存…'
  saving = saving.catch(() => {}).then(async () => {
    let browserSaved = false
    try { await putIDB(data); browserSaved = true } catch { /* 仍尝试磁盘保存。 */ }
    let diskSaved = false
    if (diskAvailable.value) {
      try {
        const r = await fetch('/__editor/data', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
        if (!r.ok) throw new Error('文件保存失败')
        diskSaved = true
      } catch { errorMessage.value = '本机文件保存失败，浏览器副本仍可使用，请导出备份。' }
    }
    saveStatus.value = diskSaved ? '已保存到浏览器和本机文件' : browserSaved ? '已保存到此浏览器' : '保存失败，请立即导出备份'
    if (!browserSaved && !diskSaved) errorMessage.value = '无法持久保存，请立即导出备份后重试。'
  })
}
export function changeWorkspace(label: string, update: (data: WorkspaceData) => void) {
  const before = snapshot(); const next = clone(before)
  update(next)
  next.updatedAt = Date.now()
  const valid = validateWorkspace(next)
  history.push(JSON.stringify(before)); if (history.length > 20) history.shift()
  undoCount.value = history.length
  Object.assign(workspace, valid); revision.value++; unpublished.value = true
  errorMessage.value = ''; queueSave()
}
export function undo() {
  const prior = history.pop(); if (!prior) return
  Object.assign(workspace, JSON.parse(prior), { updatedAt: Date.now() }); undoCount.value = history.length
  revision.value++; unpublished.value = true; queueSave()
}
export function importWorkspace(raw: unknown) {
  const data = validateWorkspace(raw)
  changeWorkspace('导入备份', draft => Object.assign(draft, data))
}
export function downloadJSON(data: unknown, name: string) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }))
  const a = document.createElement('a'); a.href = url; a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000)
}
export function addTrash(data: WorkspaceData, item: Omit<TrashItem, 'id' | 'time'>) { data.trash.unshift({ ...item, id: uid('trash'), time: Date.now() }) }
export async function flushSave() { await saving }

export async function markPublished(time: number) {
  if (!db) return
  await new Promise<void>((resolve, reject) => { const tx = db!.transaction('workspace', 'readwrite'); tx.objectStore('workspace').put(time, 'lastPublishedAt'); tx.oncomplete = () => resolve(); tx.onerror = () => reject(tx.error) }).catch(() => {})
}
export async function reloadPublished() {
  const response = await fetch(`${import.meta.env.BASE_URL}editor/content.json?t=${Date.now()}`, { cache: 'no-store' })
  if (!response.ok) throw new Error('GitHub 发布数据暂时无法读取')
  const data = validateWorkspace(await response.json())
  importWorkspace(data)
  await markPublished(workspace.updatedAt)
  unpublished.value = false
}
