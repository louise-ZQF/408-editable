import { describe, expect, it } from 'vitest'
import { contentSignature, mergeWorkspaces } from '@/editor/workspaceMerge'

function original() { return { updatedAt: 1, articles: { a: { subpoints: [{ id: 's', blocks: [{ id: 'one', html: '原文一' }, { id: 'two', html: '原文二' }] }] } }, trash: [] as { id: string }[] } }
describe('个人内容安全合并', () => {
  it('合并不同段落修改、增加和删除，并保留拖动后的顺序', () => {
    const base = original(), local = structuredClone(base), remote = structuredClone(base)
    local.articles.a.subpoints[0].blocks = [{ id: 'two', html: '原文二' }, { id: 'one', html: '中文与颜色的新修改' }]
    remote.articles.a.subpoints[0].blocks[1].html = '远端修改，包含图片'
    remote.articles.a.subpoints[0].blocks.push({ id: 'three', html: '新增段落' })
    const merged = mergeWorkspaces(base, local, remote)
    expect(merged.articles.a.subpoints[0].blocks).toEqual([{ id: 'two', html: '远端修改，包含图片' }, { id: 'one', html: '中文与颜色的新修改' }, { id: 'three', html: '新增段落' }])
    const later = structuredClone(merged)
    later.articles.a.subpoints[0].blocks.splice(1, 1)
    expect(mergeWorkspaces(merged, later, merged).articles.a.subpoints[0].blocks.map(b => b.id)).toEqual(['two', 'three'])
  })
  it('同一段被不同修改或一边删除另一边修改时阻止覆盖', () => {
    const base = original(), local = structuredClone(base), remote = structuredClone(base)
    local.articles.a.subpoints[0].blocks[0].html = '本机修改'
    remote.articles.a.subpoints[0].blocks[0].html = '线上修改'
    expect(() => mergeWorkspaces(base, local, remote)).toThrow('同一处内容')
    local.articles.a.subpoints[0].blocks.shift()
    expect(() => mergeWorkspaces(base, local, remote)).toThrow('同一处内容')
    expect(remote.articles.a.subpoints[0].blocks[0].html).toBe('线上修改')
  })
  it('合并回收站新记录，内容相同但保存时间不同不重复发布', () => {
    const base = original(), local = structuredClone(base), remote = structuredClone(base)
    local.trash.push({ id: 'local' }); remote.trash.push({ id: 'remote' })
    expect(mergeWorkspaces(base, local, remote).trash.map(item => item.id)).toEqual(['local', 'remote'])
    expect(contentSignature({ ...local, updatedAt: 10 })).toBe(contentSignature({ ...local, updatedAt: 99 }))
  })
})
