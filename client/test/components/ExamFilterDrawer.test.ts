import { describe, expect, it } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import ExamFilterDrawer from '@/components/exams-page/ExamFilterDrawer.vue'

const baseSelection = {
  subject: '',
  year: undefined,
  fromYear: undefined,
  toYear: undefined,
  questionType: '' as string,
  chapter: '',
  section: '',
  keyword: '',
  knowledgeBlockId: '',
  sortKey: 'year' as const,
  sortOrder: 'asc' as const,
}

function mountDrawer(overrides: Record<string, unknown> = {}) {
  return shallowMount(ExamFilterDrawer, {
    props: {
      currentFilterText: '',
      filters: undefined,
      hasActiveFilters: false,
      open: false,
      pinned: false,
      selection: baseSelection,
      ...overrides,
    },
    global: {
      stubs: { ReaderDrawer: true, BrandLogo: true, Search: true },
    },
  })
}

describe('ExamFilterDrawer', () => {
  it('挂载成功（ReaderDrawer 被存根为浅渲染根节点）', () => {
    const wrapper = mountDrawer()
    expect(wrapper.exists()).toBe(true)
    // shallowMount 下 ReaderDrawer 为存根，不渲染插槽；仅断言组件能被实例化
    expect(wrapper.findComponent({ name: 'ReaderDrawer' }).exists()).toBe(true)
  })

  it('选中章节触发 update emit（chapter + knowledgeBlockId 拼接）', async () => {
    const wrapper = mountDrawer()
    await wrapper.vm.selectChapter('ds', {
      name: '线性表',
      blockIds: ['kb-a', 'kb-b'],
    } as never)
    const [patch] = wrapper.emitted('update')!.at(-1) as unknown as [unknown]
    expect(patch).toMatchObject({
      subject: 'ds',
      chapter: '线性表',
      section: '',
      knowledgeBlockId: 'kb-a,kb-b',
    })
  })

  it('选中小节触发 update emit（section + 对应 blockIds）', async () => {
    const wrapper = mountDrawer()
    await wrapper.vm.selectSection('cn', {
      name: '物理层',
      blockIds: ['kb-c', 'kb-d'],
    } as never, {
      name: '传输介质',
      blockIds: ['kb-c'],
    } as never)
    const [patch] = wrapper.emitted('update')!.at(-1) as unknown as [unknown]
    expect(patch).toMatchObject({
      subject: 'cn',
      chapter: '物理层',
      section: '传输介质',
      knowledgeBlockId: 'kb-c',
    })
  })

  it('isChapterActive：全选章节与无筛选章节名匹配时返回 true', () => {
    const wrapper = mountDrawer({
      selection: {
        ...baseSelection,
        subject: 'ds',
        chapter: '线性表',
      },
    })
    expect(wrapper.vm.isChapterActive('ds', { name: '线性表', blockIds: [] } as never)).toBe(true)
    expect(wrapper.vm.isChapterActive('ds', { name: '树', blockIds: [] } as never)).toBe(false)
  })

  it('回车触发 search emit', async () => {
    const wrapper = mountDrawer({
      selection: { ...baseSelection, keyword: '中断' },
    })
    await wrapper.vm.onSearchKeydown({ key: 'Enter', preventDefault: () => {} } as KeyboardEvent)
    const [term] = wrapper.emitted('search')!.at(-1) as unknown as [string]
    expect(term).toBe('中断')
  })
})