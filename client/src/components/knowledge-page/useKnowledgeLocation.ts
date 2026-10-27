import { nextTick, onBeforeUnmount, watch, type Ref } from 'vue'

export function knowledgeAnchor(block: unknown, hash: string): string {
  if (typeof block === 'string' && block) return block
  const anchor = hash.replace(/^#/, '')
  try { return decodeURIComponent(anchor) } catch { return anchor }
}

/** 用 Range 定位跨加粗、链接等节点的文字，不修改正文或个人编辑数据。 */
export function findSearchRange(element: HTMLElement, query: string): Range | undefined {
  const clean = query.trim().toLowerCase()
  if (!clean) return
  const terms = new Set([clean, ...clean.match(/[a-z0-9]+|[\u3400-\u9fff]+/g) || []])
  for (const word of [...terms]) {
    if (/^[\u3400-\u9fff]{3,}$/.test(word)) {
      for (let i = 0; i < word.length - 1; i++) terms.add(word.slice(i, i + 2))
    }
  }
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT)
  const nodes: { node: Text; start: number; end: number }[] = []
  let text = ''
  while (walker.nextNode()) {
    const node = walker.currentNode as Text
    if (node.parentElement?.closest('script,style,svg,math,annotation,button,[hidden],[aria-hidden="true"],[contenteditable="true"]')) continue
    nodes.push({ node, start: text.length, end: text.length + node.length })
    text += node.data
  }
  const lower = text.toLowerCase()
  for (const term of [...terms].sort((a, b) => b.length - a.length)) {
    const start = lower.indexOf(term)
    if (start < 0) continue
    const first = nodes.find(n => n.end > start)
    const last = nodes.find(n => n.end >= start + term.length)
    if (!first || !last) continue
    const range = document.createRange()
    range.setStart(first.node, start - first.start)
    range.setEnd(last.node, start + term.length - last.start)
    return range
  }
}

export function useKnowledgeLocation(id: Ref<string>, query: Ref<string>, ready: Ref<boolean>) {
  let dispose = () => {}
  let sequence = 0

  async function locate() {
    const current = ++sequence
    dispose()
    if (!ready.value || !id.value) return
    await nextTick()
    if (current !== sequence) return
    const element = document.getElementById(id.value)
    if (!element) return

    const range = findSearchRange(element, query.value)
    const previousTabIndex = element.getAttribute('tabindex')
    element.setAttribute('data-search-target', '')
    element.setAttribute('tabindex', '-1')
    const css = CSS as typeof CSS & { highlights?: Map<string, unknown> }
    const HighlightClass = (window as Window & { Highlight?: new (range: Range) => unknown }).Highlight
    if (range && css.highlights && HighlightClass) css.highlights.set('knowledge-search', new HighlightClass(range))

    let stopped = false
    let frame = 0
    let observer: ResizeObserver | undefined
    const scroll = () => {
      if (stopped || current !== sequence || !element.isConnected) return
      const rect = range?.getBoundingClientRect()
      const position = rect?.height ? rect : element.getBoundingClientRect()
      window.scrollTo({ top: Math.max(0, position.top + window.scrollY - 100), behavior: 'instant' })
    }
    const stopTracking = () => {
      stopped = true
      cancelAnimationFrame(frame)
      observer?.disconnect()
      for (const event of ['wheel', 'touchstart', 'pointerdown', 'keydown']) window.removeEventListener(event, stopTracking)
    }
    const timer = window.setTimeout(stopTracking, 3000)
    dispose = () => {
      stopTracking()
      window.clearTimeout(timer)
      element.removeAttribute('data-search-target')
      if (previousTabIndex === null) element.removeAttribute('tabindex')
      else element.setAttribute('tabindex', previousTabIndex)
      css.highlights?.delete('knowledge-search')
    }
    for (const event of ['wheel', 'touchstart', 'pointerdown', 'keydown']) window.addEventListener(event, stopTracking, { passive: true })
    frame = requestAnimationFrame(() => {
      scroll()
      element.focus({ preventScroll: true })
      // 上方图片和公式加载后可能改变位置，短暂跟随布局；用户开始操作就立即停止。
      const column = element.closest('[data-testid="knowledge-article-column"]')
      if (column && typeof ResizeObserver !== 'undefined') {
        observer = new ResizeObserver(() => { cancelAnimationFrame(frame); frame = requestAnimationFrame(scroll) })
        observer.observe(column)
      }
    })
  }

  watch([id, query, ready], () => void locate(), { immediate: true, flush: 'post' })
  onBeforeUnmount(() => { sequence++; dispose() })
}
