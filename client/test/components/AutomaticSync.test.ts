import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { mergeWorkspaces } from '@/editor/workspaceMerge'

function initial() { return { format: '408-editable-v1', updatedAt: 1, articles: { a: { pointId: 'a', subpoints: [{ id: 's', blocks: [{ id: 'b', html: '自己的修改' }] }] } }, books: null, settings: {}, exams: {}, deletedExams: [], trash: [] } as any }
beforeEach(() => { vi.resetModules(); vi.useFakeTimers(); localStorage.clear(); vi.stubGlobal('location', { hostname: 'louise-zqf.github.io', pathname: '/408-editable/', origin: 'https://louise-zqf.github.io' }) })
afterEach(() => { vi.clearAllTimers(); vi.useRealTimers(); vi.unstubAllGlobals() })

describe('浏览器自动同步', () => {
  it('首次连接导入本机合并内容，后续有后台状态轮询', async () => {
    const api = await import('@/editor/automaticSync')
    let current = initial()
    const canonical = structuredClone(current); canonical.articles.other = { pointId: 'other', subpoints: [] }; canonical.updatedAt = 2
    const fetchMock = vi.fn(async (_url: string, options: any) => ({ ok: true, json: async () => options.method === 'GET' ? { enabled: true, status: { message: '已自动更新到 GitHub 网站', publishedAt: 2 } } : { enabled: true, workspace: canonical, status: { message: '已备份到本机' } } }))
    vi.stubGlobal('fetch', fetchMock)
    const published = vi.fn(async () => {})
    await api.initializeAutomaticSync({ get: () => current, apply: async value => { current = value }, saveBase: async () => {}, published, canApply: () => true }, undefined, false)
    expect(fetchMock).not.toHaveBeenCalled()
    await api.enableAutomaticSync()
    expect(Object.keys(current.articles)).toEqual(['a', 'other'])
    await vi.advanceTimersByTimeAsync(15_000)
    expect(api.automaticSyncStatus.value).toBe('已自动更新到 GitHub 网站')
    expect(published).toHaveBeenCalledWith(2)
  })
  it('正在输入时不重绘正文，连续保存仍保留其他来源的文章', async () => {
    const api = await import('@/editor/automaticSync')
    const original = initial()
    let current = structuredClone(original), server = structuredClone(original), idle = false
    server.articles.other = { pointId: 'other', subpoints: [] }; server.updatedAt = 2
    vi.stubGlobal('fetch', vi.fn(async (_url: string, options: any) => {
      if (options.method === 'POST') { const payload = JSON.parse(options.body); server = mergeWorkspaces(payload.base || original, payload.workspace, server) }
      return { ok: true, json: async () => ({ enabled: true, workspace: structuredClone(server), status: { message: '本机已保存' } }) }
    }))
    await api.initializeAutomaticSync({ get: () => current, apply: async value => { current = value }, saveBase: async () => {}, published: async () => {}, canApply: () => idle }, undefined, true)
    expect(current.articles.other).toBeUndefined()
    current.articles.a.subpoints[0].blocks[0].html = '正在继续输入的新内容'; current.updatedAt = 3
    api.queueAutomaticSync(structuredClone(current))
    await flushPromises()
    expect(server.articles.a.subpoints[0].blocks[0].html).toBe('正在继续输入的新内容')
    expect(server.articles.other).toBeDefined()
    idle = true
    await vi.advanceTimersByTimeAsync(15_000)
    expect(current.articles.other).toBeDefined()
    expect(current.articles.a.subpoints[0].blocks[0].html).toBe('正在继续输入的新内容')
  })
})
