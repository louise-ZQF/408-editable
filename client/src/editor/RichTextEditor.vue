<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import { editableRichHTML, serializeRichHTML } from './richText'
import { clipboardRichHTML } from './clipboard'
import { clipboardImages, readImage } from './images'

const props = defineProps<{ initialHtml: string; label?: string; initialOffset?: number }>()
const emit = defineEmits<{ change: [html: string]; pending: [value: boolean]; error: [message: string] }>()
const surface = ref<HTMLElement>()
const composing = ref(false)
const symbols = ref(false)
let selection: Range | undefined
let touched = false
let pendingPaste: Promise<void> = Promise.resolve()
let pendingImages = 0
function protectMath() {
  for (const element of surface.value?.querySelectorAll<HTMLElement>('[data-rich-math], svg') || []) element.contentEditable = 'false'
}
function rememberSelection() {
  const current = window.getSelection()
  if (current?.rangeCount && surface.value?.contains(current.anchorNode)) selection = current.getRangeAt(0).cloneRange()
}
function restoreSelection() {
  surface.value?.focus()
  const current = window.getSelection()
  if (selection && current && surface.value?.contains(selection.commonAncestorContainer)) { current.removeAllRanges(); current.addRange(selection) }
}
function changed(event?: Event) {
  touched = true
  if (composing.value || (event as InputEvent | undefined)?.isComposing) return
  rememberSelection()
  if (surface.value) emit('change', serializeRichHTML(surface.value))
}
function compositionEnded() { composing.value = false; changed() }
function format(command: string, value?: string) {
  restoreSelection()
  document.execCommand(command, false, value)
  protectMath(); rememberSelection(); changed()
}
function addTable() { format('insertHTML', '<table><thead><tr><th>标题</th><th>说明</th></tr></thead><tbody><tr><td>点击填写</td><td>点击填写</td></tr><tr><td>点击填写</td><td>点击填写</td></tr></tbody></table><p><br></p>') }
function paste(event: ClipboardEvent) {
  event.preventDefault()
  rememberSelection()
  const files = clipboardImages(event.clipboardData)
  if (files.length) {
    const caret = selection?.cloneRange()
    pendingImages++; emit('pending', true); emit('error', '')
    pendingPaste = pendingPaste.catch(() => {}).then(async () => {
      const images = await Promise.all(files.map(readImage))
      if (!surface.value) return
      const container = document.createElement('div')
      for (const image of images) { const img = document.createElement('img'); img.src = image.src; img.alt = image.alt; container.append(img, document.createElement('br')) }
      const range = caret && surface.value.contains(caret.commonAncestorContainer) ? caret : document.createRange()
      if (range !== caret) { range.selectNodeContents(surface.value); range.collapse(false) }
      if (document.activeElement === surface.value || surface.value.contains(document.activeElement)) {
        selection = range; format('insertHTML', container.innerHTML)
      } else {
        // 已经移开光标时仍在原位置插入，不抢回用户正在编辑的位置。
        range.deleteContents(); range.insertNode(range.createContextualFragment(container.innerHTML)); changed()
      }
    })
    void pendingPaste.catch(error => emit('error', error instanceof Error ? error.message : String(error))).finally(() => { pendingImages--; emit('pending', pendingImages > 0) })
    return
  }
  const text = event.clipboardData?.getData('text/plain') || ''
  const node = window.getSelection()?.anchorNode
  const element = node instanceof Element ? node : node?.parentElement
  if (element?.closest('pre, code')) format('insertText', text)
  else format('insertHTML', clipboardRichHTML(event.clipboardData?.getData('text/html') || '', text))
}
async function flush() { await pendingPaste; if (surface.value && touched) emit('change', serializeRichHTML(surface.value)) }
onMounted(async () => {
  if (!surface.value) return
  surface.value.innerHTML = editableRichHTML(props.initialHtml)
  protectMath()
  await nextTick(); surface.value.focus()
  if (props.initialOffset != null) {
    let remaining = props.initialOffset
    const walker = document.createTreeWalker(surface.value, NodeFilter.SHOW_TEXT)
    let text = walker.nextNode()
    while (text) {
      const length = text.textContent?.length || 0
      if (remaining <= length) {
        const range = document.createRange(); range.setStart(text, remaining); range.collapse(true)
        const current = window.getSelection(); current?.removeAllRanges(); current?.addRange(range); break
      }
      remaining -= length; text = walker.nextNode()
    }
  }
  rememberSelection()
})
defineExpose({ flush })
</script>

<template>
  <div class="rich-editor">
    <div class="rich-toolbar" role="toolbar" aria-label="文字格式">
      <button type="button" aria-label="加粗" title="加粗" @mousedown.prevent @click="format('bold')"><b>加粗</b></button>
      <button type="button" aria-label="斜体" @mousedown.prevent @click="format('italic')"><i>斜体</i></button>
      <button type="button" aria-label="项目列表" @mousedown.prevent @click="format('insertUnorderedList')">列表</button>
      <button type="button" aria-label="编号列表" @mousedown.prevent @click="format('insertOrderedList')">编号</button>
      <button type="button" aria-label="插入表格" @mousedown.prevent @click="addTable">表格</button>
      <button type="button" :aria-expanded="symbols" @mousedown.prevent @click="symbols = !symbols">数学符号</button>
      <button type="button" aria-label="清除格式" @mousedown.prevent @click="format('removeFormat')">清除格式</button>
    </div>
    <p class="rich-paste-hint">可以直接粘贴图片、截图或 GPT 的回答，文字和常见公式会自动排版。</p>
    <div v-if="symbols" class="rich-symbols" aria-label="常用数学符号"><button v-for="symbol in ['²','³','₀','₁','₂','≤','≥','≠','×','÷','√','∑','π','∞','→','∈']" :key="symbol" type="button" @mousedown.prevent @click="format('insertText', symbol)">{{ symbol }}</button></div>
    <div ref="surface" class="rich-surface" contenteditable="true" role="textbox" :aria-label="label || '直接编辑正文'" aria-multiline="true" spellcheck="false" data-placeholder="直接在这里输入中文…" @input="changed" @compositionstart="composing = true" @compositionend="compositionEnded" @keyup="rememberSelection" @mouseup="rememberSelection" @paste="paste" />
  </div>
</template>
