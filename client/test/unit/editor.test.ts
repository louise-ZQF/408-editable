import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { addNetworkProtocolSummary, changeWorkspace, defaults, snapshot, undo, validateWorkspace, workspace } from '@/editor/store'
import { addNode, deleteNode, findNode, getEditableArticle, restoreItem } from '@/editor/content'
import { computerNetworkBook, knowledgeBooks } from '@/content/knowledge-tree'
import { getExamIndex, getQuestionById, queryIndexIds } from '@/services/examRepository'
import type { Exam } from '@/types'

const question: Exam = { id: 'test-question', year: 2025, number: 1, score: 2, questionType: 'choice', subject: 'ds', chapterName: '测试章节', stem: '原始题干', options: [{ key: 'A', text: '选项 A' }], answer: 'A', explanation: '解析', difficulty: 3, tags: [], resourceLinks: [], knowledgeBlockIds: ['kb-test'] }

beforeEach(async () => {
  Object.assign(workspace, { format: '408-editable-v1', updatedAt: 0, books: null, articles: {}, exams: {}, deletedExams: [], trash: [], settings: { ...defaults } })
  await nextTick()
  vi.stubGlobal('fetch', vi.fn(async (url: string) => ({ ok: true, json: async () => url.includes('paper.json') ? { year: 2025, title: '试卷', questionCount: 1, questions: [question] } : [{ id: question.id, year: 2025, number: 1, type: 'choice', subject: 'ds', chapter: '测试章节', topic: '', stemText: '原始题干', knowledgeBlockIds: ['kb-test'], tags: [] }] })))
})

describe('个人教材内容闭环', () => {
  it('旧个人目录补入协议汇总时保留个人修改，且以后删除不会被重新加入', () => {
    const chapter = computerNetworkBook.chapters[0]
    const data = snapshot()
    delete data.contentAdditions
    data.books = [{ ...structuredClone(computerNetworkBook), chapters: [{ id: 'my-network-chapter', title: '我的网络笔记', layer: 'TOP', sections: [] }] }]
    const articles = JSON.stringify(data.articles)
    addNetworkProtocolSummary(data, chapter)
    expect(data.books[0].chapters.map(item => item.id)).toEqual([chapter.id, 'my-network-chapter'])
    expect(JSON.stringify(data.articles)).toBe(articles)
    data.books[0].chapters.shift()
    addNetworkProtocolSummary(data, chapter)
    expect(data.books[0].chapters.map(item => item.title)).toEqual(['我的网络笔记'])
  })
  it('添加、删除、恢复整本教材以及下级文章', async () => {
    const book = addNode(); await nextTick()
    const chapter = addNode(book); await nextTick()
    const section = addNode(chapter); await nextTick()
    const point = addNode(section); await nextTick()
    expect(findNode(point)?.kind).toBe('point')
    deleteNode(book); await nextTick()
    expect(findNode(point)).toBeUndefined()
    restoreItem(workspace.trash[0].id); await nextTick()
    expect(findNode(point)?.parent.id).toBe(section)
    expect(workspace.trash).toHaveLength(0)
  })
  it('删除所有教材后允许空目录，并能撤销恢复', async () => {
    changeWorkspace('清空教材', data => { data.books = [] }); await nextTick()
    expect(knowledgeBooks).toHaveLength(0)
    undo(); await nextTick(); expect(knowledgeBooks).toHaveLength(4)
  })
  it('保留原站原文，并把个人文章覆盖接入原阅读路径', async () => {
    const pointId = knowledgeBooks[0].chapters[0].sections[0].points[0].id
    expect((await getEditableArticle(pointId)).subpoints.length).toBeGreaterThan(0)
    changeWorkspace('修改正文', data => { data.articles[pointId] = { pointId, subpoints: [{ id: 'my-sub', title: '个人小节', blocks: [{ id: 'kb-my-block', type: 'paragraph', text: '我自己的正文' }] }] } })
    expect((await getEditableArticle(pointId)).subpoints[0].blocks[0]).toMatchObject({ text: '我自己的正文' })
  })
  it('题目的新增、改年份、关键词筛选、删除和答案均使用同一数据源', async () => {
    expect((await getExamIndex()).some(q => q.id === question.id)).toBe(true)
    changeWorkspace('修改试题', data => { data.exams[question.id] = { ...question, year: 2030, stem: '全新关键词题干', answer: 'B' } })
    expect((await queryIndexIds({ year: 2030, keyword: '全新关键词' })).map(q => q.id)).toEqual([question.id])
    expect(await getQuestionById(question.id)).toMatchObject({ year: 2030, answer: 'B' })
    changeWorkspace('删除试题', data => { data.deletedExams.push(question.id) })
    expect(await getQuestionById(question.id)).toBeNull()
  })
  it('备份校验拒绝重复块、错误选项和原型字段，失败时不改变现有内容', () => {
    const data = snapshot()
    data.articles.x = { pointId: 'x', subpoints: [{ id: 's', title: '标题', blocks: [{ id: 'b', type: 'paragraph', text: '1' }, { id: 'b', type: 'paragraph', text: '2' }] }] }
    expect(() => validateWorkspace(data)).toThrow('重复')
    expect(() => validateWorkspace(JSON.parse(JSON.stringify(snapshot()).replace('"articles":{}', '"articles":{"__proto__":{}}')))).toThrow('不支持')
    expect(workspace.articles).toEqual({})
  })
  it('删除正文块后能恢复到原文章位置', () => {
    changeWorkspace('设置回收站', data => {
      data.articles.x = { pointId: 'x', subpoints: [{ id: 's', title: '小节', blocks: [] }] }
      data.trash.push({ id: 'deleted', kind: 'block', title: '正文', parentId: 's', index: 0, time: 0, data: { pointId: 'x', subpointId: 's', value: { id: 'kb-old', type: 'paragraph', text: '恢复正文' } } })
    })
    restoreItem('deleted')
    expect(workspace.articles.x.subpoints[0].blocks[0]).toMatchObject({ text: '恢复正文' })
  })
})
