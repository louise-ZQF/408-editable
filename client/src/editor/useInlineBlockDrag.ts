import { onBeforeUnmount, watch, type Ref } from 'vue'
import { inlineAction, inlineFeedback, relocateInlineBlock, type InlineBlockDestination, type InlineBlockLocation } from './inline'

let cancelCurrentDrag: (() => void) | undefined

export function useInlineBlockDrag(root: Ref<HTMLElement | undefined>, enabled: Ref<boolean>, location: () => InlineBlockLocation) {
  let cleanup: (() => void) | undefined
  function stop() { cleanup?.() }

  function start(event: PointerEvent) {
    if (!enabled.value || event.button !== 0 || !event.isPrimary || !root.value) return
    event.preventDefault()
    cancelCurrentDrag?.()
    const source = location()
    const sourceElement = root.value
    const handle = event.currentTarget as HTMLElement
    const pointerId = event.pointerId
    const originX = event.clientX, originY = event.clientY
    let x = originX, y = originY, dragging = false, frame = 0
    let preview: HTMLElement | undefined, indicator: HTMLElement | undefined
    let destination: InlineBlockDestination | undefined
    handle.setPointerCapture(pointerId)

    function target() {
      destination = undefined
      const group = document.elementFromPoint(x, y)?.closest<HTMLElement>('[data-inline-drop-subpoint]')
      if (!group?.dataset.inlineDropPoint || !group.dataset.inlineDropSubpoint) {
        if (indicator) indicator.hidden = true
        return
      }
      const blocks = [...group.querySelectorAll<HTMLElement>('[data-inline-block]')].filter(block => block !== sourceElement)
      const before = blocks.find(block => { const rect = block.getBoundingClientRect(); return y < rect.top + rect.height / 2 })
      destination = { pointId: group.dataset.inlineDropPoint, subpointId: group.dataset.inlineDropSubpoint, beforeBlockId: before?.dataset.inlineBlock }
      const rect = group.getBoundingClientRect()
      const edge = before ? before.getBoundingClientRect().top - 10 : blocks.length ? blocks[blocks.length - 1].getBoundingClientRect().bottom + 10 : rect.top + 16
      if (indicator) {
        indicator.hidden = false
        Object.assign(indicator.style, { left: `${rect.left}px`, top: `${edge}px`, width: `${rect.width}px` })
      }
    }

    function animate() {
      if (!dragging) return
      const speed = y < 90 ? -Math.min(24, (90 - y) / 4) : y > innerHeight - 90 ? Math.min(24, (y - innerHeight + 90) / 4) : 0
      if (speed) window.scrollBy(0, speed)
      target()
      if (preview) preview.style.transform = `translate(${Math.max(8, Math.min(x + 18, innerWidth - 276))}px, ${Math.max(8, Math.min(y + 18, innerHeight - 100))}px)`
      frame = requestAnimationFrame(animate)
    }

    function move(event: PointerEvent) {
      if (event.pointerId !== pointerId) return
      x = event.clientX; y = event.clientY
      if (!dragging && Math.hypot(x - originX, y - originY) >= 6) {
        dragging = true
        sourceElement.classList.add('inline-block-dragging')
        document.body.classList.add('inline-drag-active')
        preview = document.createElement('div'); preview.className = 'inline-drag-preview'; preview.setAttribute('aria-hidden', 'true')
        const title = document.createElement('strong'); title.textContent = '拖到蓝线处松开'
        const excerpt = document.createElement('span'); excerpt.textContent = (sourceElement.querySelector('[data-inline-display]')?.textContent || '内容框').trim().slice(0, 72)
        preview.append(title, excerpt)
        indicator = document.createElement('div'); indicator.className = 'inline-drop-indicator'; indicator.setAttribute('aria-hidden', 'true')
        document.body.append(preview, indicator)
        inlineFeedback('正在拖动，松开放置；按 Esc 取消')
        animate()
      }
      if (dragging) event.preventDefault()
    }

    function finish(event: PointerEvent) {
      if (event.pointerId !== pointerId) return
      const moved = dragging
      x = event.clientX; y = event.clientY
      if (moved) target()
      const drop = destination
      stop()
      if (moved && drop) void inlineAction(() => relocateInlineBlock(source, drop))
      else if (moved) inlineFeedback('已取消拖动，位置未改变')
    }

    function cancel() { const moved = dragging; stop(); if (moved) inlineFeedback('已取消拖动，位置未改变') }
    function key(event: KeyboardEvent) { if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); cancel() } }
    function pointerCancel(event: PointerEvent) { if (event.pointerId === pointerId) cancel() }

    cleanup = () => {
      dragging = false; cancelAnimationFrame(frame)
      preview?.remove(); indicator?.remove()
      sourceElement.classList.remove('inline-block-dragging')
      document.body.classList.remove('inline-drag-active')
      document.removeEventListener('pointermove', move, true)
      document.removeEventListener('pointerup', finish, true)
      document.removeEventListener('pointercancel', pointerCancel, true)
      document.removeEventListener('keydown', key, true)
      window.removeEventListener('blur', cancel)
      handle.removeEventListener('lostpointercapture', pointerCancel)
      cleanup = undefined
      if (cancelCurrentDrag === stop) cancelCurrentDrag = undefined
      if (handle.hasPointerCapture(pointerId)) handle.releasePointerCapture(pointerId)
    }
    cancelCurrentDrag = stop
    document.addEventListener('pointermove', move, { capture: true, passive: false })
    document.addEventListener('pointerup', finish, true)
    document.addEventListener('pointercancel', pointerCancel, true)
    document.addEventListener('keydown', key, true)
    window.addEventListener('blur', cancel)
    handle.addEventListener('lostpointercapture', pointerCancel)
  }

  watch(enabled, value => { if (!value) stop() })
  onBeforeUnmount(stop)
  return { start }
}
