import { beforeEach, describe, expect, it } from 'vitest'
import { defaults, workspace } from '@/editor/store'
import { restoreItem } from '@/editor/content'
import { addInlineBlock, deleteInlineBlock, finishInlineEditing, inlineDirtyCount, inlineMode, refreshDirtyCount, registerInlineDraft, renameInlineTitle, saveInlineBlock } from '@/editor/inline'

beforeEach(() => {
  Object.assign(workspace, { format: '408-editable-v1', updatedAt: 0, books: null, articles: { test: { pointId: 'test', subpoints: [{ id: 's', title: '原来的标题', blocks: [{ id: 'a', type: 'paragraph', text: '段落 A' }, { id: 'b', type: 'paragraph', text: '段落 B' }] }] } }, exams: {}, deletedExams: [], trash: [], settings: { ...defaults } })
  inlineMode.value = false
})

describe('阅读页直接编辑', () => {
  it('两个段落同时自动保存时，不用旧文章覆盖另一个段落的修改', async () => {
    await Promise.all([
      saveInlineBlock('test', 's', { id: 'a', type: 'paragraph', text: 'A 的新内容' }),
      saveInlineBlock('test', 's', { id: 'b', type: 'paragraph', text: 'B 的新内容' }),
    ])
    expect(workspace.articles.test.subpoints[0].blocks).toEqual([{ id: 'a', type: 'paragraph', text: 'A 的新内容' }, { id: 'b', type: 'paragraph', text: 'B 的新内容' }])
  })
  it('删除正文后可从回收站原位恢复', async () => {
    await deleteInlineBlock('test', 's', 'a')
    expect(workspace.articles.test.subpoints[0].blocks.map(b => b.id)).toEqual(['b'])
    restoreItem(workspace.trash[0].id)
    expect(workspace.articles.test.subpoints[0].blocks.map(b => b.id)).toEqual(['a', 'b'])
  })
  it('在指定段落后插入内容，保留其他段落以及稳定编号', async () => {
    await addInlineBlock('test', 's', 'formula', 'a')
    const blocks = workspace.articles.test.subpoints[0].blocks
    expect(blocks.map(b => b.type)).toEqual(['paragraph', 'formula', 'paragraph'])
    expect(blocks[0].id).toBe('a'); expect(blocks[2].id).toBe('b')
  })
  it('标题原位修改时校验空标题，不改变原来的内容', async () => {
    await expect(renameInlineTitle('subpoint', 's', ' ', 'test')).rejects.toThrow('不能为空')
    expect(workspace.articles.test.subpoints[0].title).toBe('原来的标题')
    await renameInlineTitle('subpoint', 's', '新的小节标题', 'test')
    expect(workspace.articles.test.subpoints[0].title).toBe('新的小节标题')
  })
  it('有保存错误时不退出编辑模式，保留尚未保存的草稿', async () => {
    inlineMode.value = true
    const unregister = registerInlineDraft('invalid', { dirty: () => true, save: async () => { throw new Error('标题不能为空') } })
    refreshDirtyCount()
    expect(inlineDirtyCount.value).toBe(1)
    await expect(finishInlineEditing()).rejects.toThrow('标题不能为空')
    expect(inlineMode.value).toBe(true)
    unregister()
    expect(inlineDirtyCount.value).toBe(0)
  })
})
