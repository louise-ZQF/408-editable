<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import RichTextEditor from './RichTextEditor.vue'
import { clone, uid } from './store'
import { animations, ensureAnimations } from './content'
import { clipboardImages, readImage } from './images'
import { addInlineBlock, deleteInlineBlock, inlineAction, inlineFocusId, inlineKinds, inlineMode, moveInlineBlock, refreshDirtyCount, registerInlineDraft, saveInlineBlock } from './inline'
import type { KnowledgeArticleBlock } from '@/content/knowledge-articles/types'

const props = defineProps<{ block: KnowledgeArticleBlock; pointId: string; subpointId: string; first: boolean; last: boolean; enabled?: boolean }>()
const active = computed(() => !!props.enabled && inlineMode.value)
const editing = ref(false), addMenu = ref(false), busy = ref(false), error = ref('')
const richFocused = ref(false)
const draft = ref<any>(clone(props.block)), root = ref<HTMLElement>()
const richEditor = ref<InstanceType<typeof RichTextEditor>>()
const richBlock = computed(() => ['paragraph', 'html', 'callout', 'formula'].includes(props.block.type))
const catalog = ref<string[]>([])
const imageReading = ref(false), richPending = ref(false)
const dirty = computed(() => editing.value && (imageReading.value || richPending.value || JSON.stringify(draft.value) !== JSON.stringify(clone(props.block))))
let saving: Promise<void> | undefined
let pendingImage: Promise<void> | undefined
let editSession = 0
watch(dirty, refreshDirtyCount, { flush: 'sync' })
const unregister = registerInlineDraft(props.block.id + uid('draft'), { dirty: () => dirty.value, save })
onBeforeUnmount(unregister)
async function start() {
  if (props.enabled && richBlock.value) { await nextTick(); richEditor.value?.focus(); return }
  if (!active.value || editing.value) return
  editSession++; pendingImage = undefined; imageReading.value = false; richPending.value = false
  draft.value = clone(props.block); error.value = ''; editing.value = true; addMenu.value = false
  await nextTick(); root.value?.querySelector<HTMLElement>('.inline-image-paste-zone, textarea, input, select')?.focus()
  if (props.block.type === 'animation') void loadAnimations()
}
function contentClick(event: MouseEvent) {
  if (!props.enabled || window.getSelection()?.toString()) return
  if ((event.target as HTMLElement).closest('a, button, input, select, textarea, iframe, video, [data-no-inline]')) return
  inlineMode.value = true
  void start()
}
function beginRichEditing() {
  richFocused.value = true
  if (editing.value) return
  editSession++; draft.value = clone(props.block); error.value = ''; editing.value = true
}
function cancel() { editSession++; editing.value = false; imageReading.value = false; richPending.value = false; draft.value = clone(props.block); error.value = ''; refreshDirtyCount() }
async function save() {
  if (saving) return saving
  const session = editSession
  busy.value = true; error.value = ''
  saving = (async () => {
    await Promise.all([richEditor.value?.flush(), pendingImage])
    if (!editing.value || session !== editSession) return
    if (dirty.value) await saveInlineBlock(props.pointId, props.subpointId, clone(draft.value))
    editing.value = richBlock.value && richFocused.value; refreshDirtyCount()
  })().catch(e => { error.value = e instanceof Error ? e.message : String(e); throw e }).finally(() => { busy.value = false; saving = undefined })
  return saving
}
function focusout(event: FocusEvent) {
  if (!editing.value || root.value?.contains(event.relatedTarget as Node)) return
  if (dirty.value) void inlineAction(save)
}
function keydown(event: KeyboardEvent) {
  if (richBlock.value && props.enabled && event.key === 'Escape') { (document.activeElement as HTMLElement)?.blur(); return }
  if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); cancel() }
  if ((event.metaKey || event.ctrlKey) && (event.key === 's' || event.key === 'Enter')) { event.preventDefault(); void inlineAction(save) }
}
function richChanged(html: string) { if (!editing.value) beginRichEditing(); draft.value = { id: props.block.id, type: 'html', html } }
function setImage(file: File) {
  const session = editSession
  imageReading.value = true; error.value = ''
  const task = readImage(file).then(image => {
    if (!editing.value || session !== editSession || pendingImage !== task) return
    draft.value.src = image.src
    if (!draft.value.alt) draft.value.alt = image.alt
  }).catch(e => { if (session === editSession) error.value = e instanceof Error ? e.message : String(e); throw e }).finally(() => {
    if (pendingImage === task) { imageReading.value = false; pendingImage = undefined }
  })
  pendingImage = task
  void task.catch(() => {})
}
function imageFile(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]; if (file) setImage(file)
}
function pasteImage(event: ClipboardEvent) {
  if (draft.value.type !== 'image') return
  const file = clipboardImages(event.clipboardData)[0]
  if (!file) return
  event.preventDefault(); setImage(file)
}
async function loadAnimations() { await ensureAnimations(); catalog.value = [...animations.keys()] }
async function add(type: keyof typeof inlineKinds) { addMenu.value = false; await addInlineBlock(props.pointId, props.subpointId, type, props.block.id) }
watch(() => [inlineFocusId.value, inlineMode.value], async () => {
  if (active.value && inlineFocusId.value === props.block.id) { inlineFocusId.value = ''; await start() }
}, { immediate: true })
watch(inlineMode, value => { if (!value && !richBlock.value) cancel() })
</script>

<template>
  <div ref="root" class="inline-block" :class="{ 'inline-block-enabled': active, 'inline-block-editing': editing && !richBlock }" :data-inline-block="block.id" @focusout="focusout" @keydown="keydown">
    <div v-if="active && (!editing || richBlock)" class="inline-block-tools" aria-label="段落操作">
      <button :aria-label="richBlock ? '打开文字格式工具' : '修改这段内容'" @mousedown.prevent @click="richBlock ? richEditor?.toggleToolbar() : start()">{{ richBlock ? '格式' : '编辑' }}</button><button :disabled="first" aria-label="向上移动这段内容" @click="inlineAction(() => moveInlineBlock(pointId, subpointId, block.id, -1))">↑</button><button :disabled="last" aria-label="向下移动这段内容" @click="inlineAction(() => moveInlineBlock(pointId, subpointId, block.id, 1))">↓</button><button :aria-expanded="addMenu" aria-label="在此处添加内容" @click="addMenu = !addMenu">＋</button><button class="inline-danger" aria-label="删除这段内容" @click="inlineAction(() => deleteInlineBlock(pointId, subpointId, block.id))">删除</button>
    </div>
    <div v-if="addMenu && active" class="inline-type-menu"><button v-for="(name, kind) in inlineKinds" :key="kind" @click="inlineAction(() => add(kind))">{{ name }}</button></div>
    <div v-if="enabled && richBlock" data-inline-display class="inline-clickable"><RichTextEditor ref="richEditor" in-place :version="block" :label="block.type === 'formula' ? '公式' : '直接编辑正文'" @focus="beginRichEditing" @blur="richFocused = false" @change="richChanged" @pending="richPending = $event" @error="error = $event"><slot /></RichTextEditor><p v-if="error" class="inline-error" role="alert">{{ error }}</p></div>
    <div v-else-if="!editing" data-inline-display :class="{ 'inline-clickable': active }" :tabindex="enabled ? 0 : undefined" :aria-label="enabled ? '点击修改这段内容' : undefined" @click="contentClick" @keydown.enter.self.prevent="enabled && (inlineMode = true); start()"><slot /></div>
    <div v-else class="inline-edit-form" :class="{ 'inline-word-form': richBlock }" @paste="pasteImage">
      <div v-if="!richBlock" class="inline-edit-caption"><span>{{ inlineKinds[block.type] }}</span><span>离开此处自动保存</span></div>
      <template v-if="draft.type === 'image'"><div class="inline-image-paste-zone" tabindex="0" role="group" aria-label="粘贴图片" :aria-busy="imageReading"><img v-if="draft.src" :src="draft.src" :alt="draft.alt" class="inline-image-preview" /><strong>{{ imageReading ? '正在插入图片…' : draft.src ? '再粘贴一张即可更换图片' : '点击这里，直接粘贴图片或截图' }}</strong><span>⌘V / Ctrl+V</span></div><label class="inline-upload">也可以选择图片<input type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml,image/avif,image/bmp" @change="imageFile" /></label><details class="inline-image-settings"><summary>图片说明与其他设置</summary><label class="inline-field">图片说明<input v-model="draft.caption" /></label><label class="inline-field">替代文本<input v-model="draft.alt" /></label><label class="inline-field">图片链接<input v-model="draft.src" placeholder="也可以使用图片链接" /></label></details></template>
      <template v-if="draft.type === 'animation'"><label class="inline-field">选择原站动画<select v-model="draft.animation.id"><option v-if="!catalog.length" :value="draft.animation.id">{{ draft.animation.id || '正在读取动画库…' }}</option><option v-for="id in catalog" :key="id" :value="id">{{ animations.get(id)?.ariaLabel || id }}</option></select></label><button @click="loadAnimations">重新载入动画库</button></template>
      <template v-if="draft.type === 'embed'"><label class="inline-field">演示标题<input v-model="draft.title" /></label><details><summary>高级设置</summary><label class="inline-field">演示内容<textarea v-model="draft.html" rows="9" spellcheck="false" /></label></details></template>
      <p v-if="error" :id="'inline-error-' + block.id" class="inline-error" role="alert">{{ error }}</p>
      <div class="inline-edit-footer"><span>直接输入中文，离开此处自动保存</span><button :disabled="busy" @click="cancel">取消</button><button class="inline-primary" :disabled="busy" aria-label="保存这段内容" @click="inlineAction(save)">{{ busy ? '保存中…' : '保存' }}</button></div>
    </div>
  </div>
</template>
