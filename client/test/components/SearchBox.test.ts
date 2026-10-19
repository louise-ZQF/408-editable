import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { mount, flushPromises } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import SearchBox from '@/components/home-page/SearchBox.vue'

function makeRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/search', name: 'search', component: { template: '<div />' } },
      { path: '/:pathMatch(.*)*', name: 'any', component: { template: '<div />' } },
    ],
  })
}

async function mountSearch() {
  const router = makeRouter()
  const wrapper = mount(SearchBox, { global: { plugins: [router] } })
  await router.isReady()
  return { wrapper, router }
}

describe('SearchBox', () => {
  it('挂载成功并渲染占位符', async () => {
    const { wrapper } = await mountSearch()
    const input = wrapper.find('input')
    expect(input.exists()).toBe(true)
    expect(input.attributes('placeholder')).toContain('搜索知识点或章节')
  })

  it('输入文本更新 v-model', async () => {
    const { wrapper } = await mountSearch()
    await wrapper.find('input').setValue('CPU')
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('CPU')
  })

  it('超过 20 字的输入被截断', async () => {
    const { wrapper } = await mountSearch()
    const long = 'x'.repeat(25)
    await wrapper.find('input').setValue(long)
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('x'.repeat(20))
  })

  it('提交后跳转到搜索路由（带 q 参数）', async () => {
    const { wrapper, router } = await mountSearch()
    await wrapper.find('input').setValue('  二叉树  ')
    await wrapper.trigger('submit')
    await flushPromises()
    await nextTick()
    expect(router.currentRoute.value.name).toBe('search')
    expect(router.currentRoute.value.query.q).toBe('二叉树')
  })

  it('空输入（全空格）提交不跳转', async () => {
    const { wrapper, router } = await mountSearch()
    await wrapper.find('input').setValue('   ')
    await wrapper.trigger('submit')
    expect(router.currentRoute.value.name).not.toBe('search')
  })
})