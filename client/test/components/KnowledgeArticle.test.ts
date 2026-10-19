import { describe, expect, it } from 'vitest'
import { mount, shallowMount } from '@vue/test-utils'
import { createMemoryHistory, createRouter, type Router } from 'vue-router'
import KnowledgeArticle from '@/components/knowledge-page/KnowledgeArticle.vue'
import { nextTick } from 'vue'

type Block = { id: string; type: string } & Record<string, unknown>
type Subpoint = { id: string; title: string; blocks: Block[] }
type Article = { subpoints: Subpoint[] }

function makeArticle(): Article {
  return {
    subpoints: [
      {
        id: 'sp-1',
        title: '二叉树',
        blocks: [
          { id: 'kb-1', type: 'paragraph', text: '二叉树定义' },
          { id: 'kb-2', type: 'formula', formula: 'x^2', caption: '公式' },
        ],
      },
      {
        id: 'sp-2',
        title: '遍历',
        blocks: [{ id: 'kb-anim', type: 'animation', animation: { foo: 1 } }],
      },
    ],
  }
}

function makeRouter(): Router {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/exams', name: 'exams', component: { template: '<div />' } },
      { path: '/', name: 'home', component: { template: '<div />' } },
    ],
  })
}

describe('KnowledgeArticle', () => {
  it('按 subpoint/block 渲染章节标题与段落', () => {
    const wrapper = mount(KnowledgeArticle, {
      props: { article: makeArticle(), examLinks: [] },
      global: {
        plugins: [makeRouter()],
        stubs: { KnowledgeMarkdown: true, ManimCodePlayer: true, RouterLink: true },
      },
    })
    expect(wrapper.text()).toContain('二叉树')
    expect(wrapper.text()).toContain('遍历')
    // 每个 subpoint 都有 leding index（01 / 02）
    expect(wrapper.find('[id="sp-1"]').exists()).toBe(true)
    expect(wrapper.find('[id="kb-1"]').exists()).toBe(true)
  })

  it('有公式块时渲染 KaTeX 输出', () => {
    const wrapper = mount(KnowledgeArticle, {
      props: { article: makeArticle(), examLinks: [] },
      global: {
        plugins: [makeRouter()],
        stubs: { KnowledgeMarkdown: true, ManimCodePlayer: true, RouterLink: true },
      },
    })
    // katex.renderToString(x^2) 输出 math 元素
    expect(wrapper.find('[id="kb-2"]').html()).toContain('<math')
  })

  it('有关联真题时显示 N 道关联真题链接', async () => {
    const router = makeRouter()
    const article: Article = {
      subpoints: [
        { id: 'sp-x', title: 'AVL', blocks: [{ id: 'kb-avl', type: 'paragraph', text: 't' }] },
      ],
    }
    // 不 stub RouterLink，让真实路由链接渲染出 <a>
    const wrapper = mount(KnowledgeArticle, {
      props: {
        article,
        examLinks: [{ knowledgeBlockId: 'kb-avl', examId: '2009-1', year: 2009, number: 1, subject: 'ds', score: null, stem: 's' }],
      },
      global: {
        plugins: [router],
        stubs: { KnowledgeMarkdown: true, ManimCodePlayer: true },
      },
    })
    await router.isReady()
    await nextTick()
    // RouterLink 渲染 a[href]，需选到实际 <a>
    const link = wrapper.findComponent({ name: 'RouterLink' })
    expect(link.exists()).toBe(true)
    expect(link.text()).toContain('1')
    expect(link.text()).toContain('道关联真题')
  })

  it('无动画块时不实例化 ManimCodePlayer（懒加载不触发）', () => {
    const article: Article = {
      subpoints: [{ id: 'sp', title: 't', blocks: [{ id: 'kb-p', type: 'paragraph', text: 'x' }] }],
    }
    const wrapper = shallowMount(KnowledgeArticle, {
      props: { article, examLinks: [] },
      global: {
        plugins: [makeRouter()],
        stubs: { KnowledgeMarkdown: true, RouterLink: true },
      },
    })
    // 未传入 animation 块 → ManimCodePlayer 异步组件不应被渲染
    expect(wrapper.findComponent({ name: 'ManimCodePlayer' }).exists()).toBe(false)
  })
})