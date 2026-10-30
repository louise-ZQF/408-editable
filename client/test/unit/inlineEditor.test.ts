import { beforeEach, describe, expect, it } from 'vitest'
import { clone, defaults, undo, workspace } from '@/editor/store'
import { restoreItem } from '@/editor/content'
import { addInlineBlock, deleteInlineBlock, finishInlineEditing, inlineDirtyCount, inlineMode, refreshDirtyCount, registerInlineDraft, relocateInlineBlock, renameInlineTitle, saveInlineBlock } from '@/editor/inline'

beforeEach(() => {
  Object.assign(workspace, { format: '408-editable-v1', updatedAt: 0, books: null, articles: { test: { pointId: 'test', subpoints: [{ id: 's', title: '原来的标题', blocks: [{ id: 'a', type: 'paragraph', text: '段落 A' }, { id: 'b', type: 'paragraph', text: '段落 B' }] }] } }, exams: {}, deletedExams: [], trash: [], settings: { ...defaults } })
  inlineMode.value = false
})

describe('阅读页直接编辑', () => {
  it('拖动插入按删除后的目标位置计算，支持向上、向下和末尾', async () => {
    const blocks = workspace.articles.test.subpoints[0].blocks
    blocks.push({ id: 'c', type: 'paragraph', text: 'C' }, { id: 'd', type: 'paragraph', text: 'D' })
    await relocateInlineBlock({ pointId: 'test', subpointId: 's', blockId: 'a' }, { pointId: 'test', subpointId: 's', beforeBlockId: 'd' })
    expect(workspace.articles.test.subpoints[0].blocks.map(b => b.id)).toEqual(['b', 'c', 'a', 'd'])
    await relocateInlineBlock({ pointId: 'test', subpointId: 's', blockId: 'd' }, { pointId: 'test', subpointId: 's', beforeBlockId: 'b' })
    expect(workspace.articles.test.subpoints[0].blocks.map(b => b.id)).toEqual(['d', 'b', 'c', 'a'])
    await relocateInlineBlock({ pointId: 'test', subpointId: 's', blockId: 'd' }, { pointId: 'test', subpointId: 's' })
    expect(workspace.articles.test.subpoints[0].blocks.map(b => b.id)).toEqual(['b', 'c', 'a', 'd'])
  })
  it('跨文章拖入空小节时先保存草稿，并可一次撤销整个移动', async () => {
    workspace.articles.other = { pointId: 'other', subpoints: [{ id: 'empty', title: '空小节', blocks: [] }] }
    let dirty = true
    const unregister = registerInlineDraft('drag-unsaved', { dirty: () => dirty, save: async () => {
      await saveInlineBlock('test', 's', { id: 'a', type: 'html', html: '<p><b style="color:red">刚输入的中文</b></p>' })
      dirty = false
    } })
    try {
      await relocateInlineBlock({ pointId: 'test', subpointId: 's', blockId: 'a' }, { pointId: 'other', subpointId: 'empty' })
      expect(workspace.articles.test.subpoints[0].blocks.map(b => b.id)).toEqual(['b'])
      expect(workspace.articles.other.subpoints[0].blocks).toEqual([{ id: 'a', type: 'html', html: '<p><b style="color:red">刚输入的中文</b></p>' }])
      undo()
      expect(workspace.articles.test.subpoints[0].blocks[0]).toEqual({ id: 'a', type: 'html', html: '<p><b style="color:red">刚输入的中文</b></p>' })
      expect(workspace.articles.other.subpoints[0].blocks).toEqual([])
    } finally { unregister() }
  })
  it('目标已删除时不移走内容；同文章跨小节保持稳定编号', async () => {
    const before = clone(workspace.articles.test)
    await expect(relocateInlineBlock({ pointId: 'test', subpointId: 's', blockId: 'a' }, { pointId: 'test', subpointId: 'deleted' })).rejects.toThrow('位置已变化')
    expect(workspace.articles.test).toEqual(before)
    workspace.articles.test.subpoints.push({ id: 'second', title: '第二节', blocks: [] })
    await relocateInlineBlock({ pointId: 'test', subpointId: 's', blockId: 'a' }, { pointId: 'test', subpointId: 'second' })
    expect(workspace.articles.test.subpoints.map(s => s.blocks.map(b => b.id))).toEqual([['b'], ['a']])
  })
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
