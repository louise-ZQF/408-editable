import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { queryIndexIds, type ExamIndexItem } from '@/services/examRepository'

/** 最小 index 数据：覆盖 ds/co、choice/comprehensive，含 kb 关联与中文章节名 */
function makeIndex(): ExamIndexItem[] {
  return [
    {
      id: '2009-1', year: 2009, number: 1, type: 'choice', subject: 'ds',
      chapter: '线性表', topic: '顺序表', stemText: '关于线性表的下列说法',
      knowledgeBlockIds: ['kb-ds-2-1'], tags: ['线性表'],
    },
    {
      id: '2009-2', year: 2009, number: 2, type: 'choice', subject: 'ds',
      chapter: '树与二叉树', topic: '二叉树', stemText: 'I/O 方式与中断',
      knowledgeBlockIds: ['kb-ds-5-2'], tags: ['树'],
    },
    {
      id: '2010-3', year: 2010, number: 1, type: 'comprehensive', subject: 'co',
      chapter: '数据的表示和运算', topic: '浮点数', stemText: 'IEEE754 浮点表示',
      knowledgeBlockIds: ['kb-co-float', 'kb-ds-2-1'], tags: ['组成原理'],
    },
    {
      id: '2010-4', year: 2010, number: 2, type: 'choice', subject: 'co',
      chapter: '存储器层次结构', topic: 'Cache', stemText: 'Cache 命中率计算',
      knowledgeBlockIds: ['kb-co-cache'], tags: ['Cache'],
    },
  ]
}

// 复刻 examRepository 内部 fetchJson 返回结构：mock 全局 fetch
beforeEach(() => {
  const index = makeIndex()
  vi.stubGlobal('fetch', vi.fn(async () => {
    return {
      ok: true,
      json: async () => index,
    } as Response
  }))
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('queryIndexIds 核心过滤逻辑', () => {
  it('无查询条件返回全部题目（按年份/题号升序）', async () => {
    const rows = await queryIndexIds({})
    expect(rows.map((x) => x.id)).toEqual(['2009-1', '2009-2', '2010-3', '2010-4'])
  })

  it('subject 过滤', async () => {
    const rows = await queryIndexIds({ subject: 'co' })
    expect(rows.map((x) => x.id)).toEqual(['2010-3', '2010-4'])
  })

  it('questionType 过滤', async () => {
    const rows = await queryIndexIds({ questionType: 'comprehensive' })
    expect(rows.map((x) => x.id)).toEqual(['2010-3'])
  })

  it('chapter 子串过滤（zh-CN 归一，含中文）', async () => {
    const rows = await queryIndexIds({ chapter: '存储' })
    expect(rows.map((x) => x.id)).toEqual(['2010-4'])
  })

  it('tag 过滤（大小写不敏感 + 子串）', async () => {
    const rows = await queryIndexIds({ tag: 'cache' })
    expect(rows.map((x) => x.id)).toEqual(['2010-4'])
  })

  it('tags（AND 语义）过滤', async () => {
    const rows = await queryIndexIds({ tags: '树,线性表' })
    expect(rows.map((x) => x.id)).toEqual([])
    // 只有 2009-1 的 tags 含 '线性表'（2010-3 的 tags 是 ['组成原理']）
    const rows2 = await queryIndexIds({ tags: '线性表' })
    expect(rows2.map((x) => x.id)).toEqual(['2009-1'])
  })

  it('keyword 命中 stemText（含 I/O 归一前的小写匹配）', async () => {
    const rows = await queryIndexIds({ keyword: '中断' })
    expect(rows.map((x) => x.id)).toEqual(['2009-2'])
  })

  it('knowledgeBlockIds 交集过滤', async () => {
    const rows = await queryIndexIds({ knowledgeBlockIds: 'kb-ds-2-1' })
    expect(rows.map((x) => x.id)).toEqual(['2009-1', '2010-3'])
  })

  it('knowledgeBlockId 单值过滤', async () => {
    const rows = await queryIndexIds({ knowledgeBlockId: 'kb-co-cache' })
    expect(rows.map((x) => x.id)).toEqual(['2010-4'])
  })

  it('sortOrder: desc 倒序', async () => {
    const rows = await queryIndexIds({ sortOrder: 'desc' })
    expect(rows.map((x) => x.id)).toEqual(['2010-4', '2010-3', '2009-2', '2009-1'])
  })

  it('fromYear/toYear 范围过滤', async () => {
    const rows = await queryIndexIds({ fromYear: 2010 })
    expect(rows.map((x) => x.id)).toEqual(['2010-3', '2010-4'])
  })
})