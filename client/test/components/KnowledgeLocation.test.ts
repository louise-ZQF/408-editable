import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick, ref } from 'vue'
import { findSearchRange, knowledgeAnchor, useKnowledgeLocation } from '@/components/knowledge-page/useKnowledgeLocation'

describe('知识正文搜索定位', () => {
  let cleanup = () => {}

  beforeEach(() => {
    vi.useFakeTimers()
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => window.setTimeout(() => callback(0), 0))
    vi.stubGlobal('cancelAnimationFrame', (id: number) => window.clearTimeout(id))
    document.body.innerHTML = '<div data-testid="knowledge-article-column"><section id="kb-first"><p>端口用于寻<strong>址与复用</strong>。</p></section><section id="kb-second"><p>TCP 拥塞控制</p></section></div>'
    for (const [index, element] of [...document.querySelectorAll('section')].entries()) {
      vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({ top: 800 + 400 * index, height: 200 } as DOMRect)
    }
  })

  afterEach(() => {
    cleanup()
    cleanup = () => {}
    vi.useRealTimers()
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
    document.body.innerHTML = ''
  })

  it('兼容搜索的 hash 和旧的 block 查询参数', () => {
    expect(knowledgeAnchor(undefined, '#kb-first')).toBe('kb-first')
    expect(knowledgeAnchor('kb-second', '#kb-first')).toBe('kb-second')
    expect(knowledgeAnchor(undefined, '#%E4%B8%AD%E6%96%87')).toBe('中文')
    expect(knowledgeAnchor(undefined, '#bad%')).toBe('bad%')
  })

  it('能匹配跨加粗节点的短语，保留原始富文本', () => {
    const element = document.getElementById('kb-first')!
    const before = element.innerHTML
    expect(findSearchRange(element, '寻址与复用')?.toString()).toBe('寻址与复用')
    expect(element.innerHTML).toBe(before)
    expect(findSearchRange(element, '不存在')).toBeUndefined()
  })

  it('不在编辑器和隐藏内容中定位关键词', () => {
    const element = document.getElementById('kb-first')!
    element.innerHTML = '<button>关键词</button><span hidden>关键词</span><div contenteditable="true">关键词</div><p>正文关键词</p>'
    const range = findSearchRange(element, '关键词')!
    expect(range.startContainer.parentElement?.tagName).toBe('P')
  })

  it('等待正文加载后跳转，并在同一页改换位置和卸载时清理提示', async () => {
    const id = ref('kb-first'), query = ref(''), ready = ref(false)
    const wrapper = mount(defineComponent({ setup() { useKnowledgeLocation(id, query, ready); return () => null } }))
    cleanup = () => wrapper.unmount()
    await nextTick()
    expect(window.scrollTo).not.toHaveBeenCalled()
    ready.value = true
    await nextTick()
    await vi.advanceTimersByTimeAsync(0)
    expect(window.scrollTo).toHaveBeenLastCalledWith({ top: 700, behavior: 'instant' })
    expect(document.getElementById('kb-first')?.hasAttribute('data-search-target')).toBe(true)
    id.value = 'kb-second'
    await nextTick()
    await vi.advanceTimersByTimeAsync(0)
    expect(window.scrollTo).toHaveBeenLastCalledWith({ top: 1100, behavior: 'instant' })
    expect(document.getElementById('kb-first')?.hasAttribute('data-search-target')).toBe(false)
    wrapper.unmount()
    cleanup = () => {}
    expect(document.getElementById('kb-second')?.hasAttribute('data-search-target')).toBe(false)
    expect(document.getElementById('kb-second')?.hasAttribute('tabindex')).toBe(false)
  })
})
