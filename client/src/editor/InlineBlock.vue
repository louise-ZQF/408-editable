<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import RichTextEditor from './RichTextEditor.vue'
import { clone, uid } from './store'
import { animations, ensureAnimations } from './content'
import { addInlineBlock, deleteInlineBlock, inlineAction, inlineFocusId, inlineKinds, inlineMode, moveInlineBlock, refreshDirtyCount, registerInlineDraft, saveInlineBlock } from './inline'
import type { KnowledgeArticleBlock } from '@/content/knowledge-articles/types'

const props = defineProps<{ block: KnowledgeArticleBlock; pointId: string; subpointId: string; first: boolean; last: boolean; enabled?: boolean }>()
const active = computed(() => !!props.enabled && inlineMode.value)
const editing = ref(false), addMenu = ref(false), busy = ref(false), error = ref('')
const draft = ref<any>(clone(props.block)), root = ref<HTMLElement>()
const richEditor = ref<InstanceType<typeof RichTextEditor>>(), richInitialHTML = ref(''), richInitialOffset = ref<number>()
const richBlock = computed(() => ['paragraph', 'html', 'callout', 'formula'].includes(props.block.type))
const catalog = ref<string[]>([])
const dirty = computed(() => editing.value && JSON.stringify(draft.value) !== JSON.stringify(clone(props.block)))
let saving: Promise<void> | undefined
watch(dirty, refreshDirtyCount, { flush: 'sync' })
const unregister = registerInlineDraft(props.block.id + uid('draft'), { dirty: () => dirty.value, save })
onBeforeUnmount(unregister)
async function start() {
  if (!active.value || editing.value) return
  const rendered = root.value?.querySelector<HTMLElement>('[data-inline-display]')
  const markdown = rendered?.querySelector<HTMLElement>('.code-lined-markdown')
  const rich = rendered?.firstElementChild?.classList.contains('rich-content') ? rendered.firstElementChild : undefined
  const selection = window.getSelection()
  richInitialOffset.value = undefined
  if (rendered && selection?.anchorNode && rendered.contains(selection.anchorNode)) {
    const range = document.createRange(); range.selectNodeContents(rendered); range.setEnd(selection.anchorNode, selection.anchorOffset); richInitialOffset.value = range.toString().length
  }
  richInitialHTML.value = props.block.type === 'paragraph' ? (markdown?.innerHTML || '') : (rich?.innerHTML ?? rendered?.innerHTML ?? '')
  draft.value = clone(props.block); error.value = ''; editing.value = true; addMenu.value = false
  await nextTick(); root.value?.querySelector<HTMLElement>('textarea, input, select')?.focus()
  if (props.block.type === 'animation') void loadAnimations()
}
function contentClick(event: MouseEvent) {
  if (!props.enabled || window.getSelection()?.toString()) return
  if ((event.target as HTMLElement).closest('a, button, input, select, textarea, iframe, video, [data-no-inline]')) return
  inlineMode.value = true
  void start()
}
function cancel() { editing.value = false; draft.value = clone(props.block); error.value = ''; refreshDirtyCount() }
async function save() {
  richEditor.value?.flush()
  if (saving) return saving
  if (!dirty.value) { editing.value = false; refreshDirtyCount(); return }
  const value = clone(draft.value)
  busy.value = true; error.value = ''
  saving = saveInlineBlock(props.pointId, props.subpointId, value).then(() => {
    editing.value = false; refreshDirtyCount()
  }).catch(e => { error.value = e instanceof Error ? e.message : String(e); throw e }).finally(() => { busy.value = false; saving = undefined })
  return saving
}
function focusout(event: FocusEvent) {
  if (!editing.value || root.value?.contains(event.relatedTarget as Node)) return
  if (dirty.value) void inlineAction(save)
}
function keydown(event: KeyboardEvent) {
  if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); cancel() }
  if ((event.metaKey || event.ctrlKey) && (event.key === 's' || event.key === 'Enter')) { event.preventDefault(); void inlineAction(save) }
}
function richChanged(html: string) { draft.value = { id: props.block.id, type: 'html', html } }
async function imageFile(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]; if (!file) return
  if (!/^image\/(png|jpeg|webp|gif|svg\+xml)$/.test(file.type) || file.size > 8 * 1024 * 1024) { error.value = '请选择 8 MB 以内的 PNG、JPG、WebP、GIF 或 SVG 图片'; return }
  draft.value.src = await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = reject; reader.readAsDataURL(file) })
  if (!draft.value.alt) draft.value.alt = file.name
}
async function loadAnimations() { await ensureAnimations(); catalog.value = [...animations.keys()] }
async function add(type: keyof typeof inlineKinds) { addMenu.value = false; await addInlineBlock(props.pointId, props.subpointId, type, props.block.id) }
watch(() => [inlineFocusId.value, inlineMode.value], async () => {
  if (active.value && inlineFocusId.value === props.block.id) { inlineFocusId.value = ''; await start() }
}, { immediate: true })
watch(inlineMode, value => { if (!value) cancel() })
</script>

<template>
  <div ref="root" class="inline-block" :class="{ 'inline-block-enabled': active, 'inline-block-editing': editing }" :data-inline-block="block.id" @focusout="focusout" @keydown="keydown">
    <div v-if="active && !editing" class="inline-block-tools" aria-label="段落操作">
      <button aria-label="修改这段内容" @click="start">编辑</button><button :disabled="first" aria-label="向上移动这段内容" @click="inlineAction(() => moveInlineBlock(pointId, subpointId, block.id, -1))">↑</button><button :disabled="last" aria-label="向下移动这段内容" @click="inlineAction(() => moveInlineBlock(pointId, subpointId, block.id, 1))">↓</button><button :aria-expanded="addMenu" aria-label="在此处添加内容" @click="addMenu = !addMenu">＋</button><button class="inline-danger" aria-label="删除这段内容" @click="inlineAction(() => deleteInlineBlock(pointId, subpointId, block.id))">删除</button>
    </div>
    <div v-if="addMenu && active" class="inline-type-menu"><button v-for="(name, kind) in inlineKinds" :key="kind" @click="inlineAction(() => add(kind))">{{ name }}</button></div>
    <div v-if="!editing" data-inline-display :class="{ 'inline-clickable': active }" :tabindex="enabled ? 0 : undefined" :aria-label="enabled ? '点击修改这段内容' : undefined" @click="contentClick" @keydown.enter.self.prevent="enabled && (inlineMode = true); start()"><slot /><p v-if="active && block.type === 'paragraph' && !block.text" class="inline-placeholder">点击这里，写下你的内容…</p></div>
    <div v-else class="inline-edit-form" :class="{ 'inline-word-form': richBlock }">
      <div v-if="!richBlock" class="inline-edit-caption"><span>{{ inlineKinds[block.type] }}</span><span>离开此处自动保存</span></div>
      <RichTextEditor v-if="richBlock" ref="richEditor" :initial-html="richInitialHTML" :initial-offset="richInitialOffset" :label="block.type === 'formula' ? '公式' : '直接编辑正文'" @change="richChanged" />
      <template v-if="draft.type === 'image'"><label class="inline-field">图片链接<input v-model="draft.src" placeholder="粘贴链接，或从电脑上传" /></label><label class="inline-upload">上传图片<input type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml" @change="imageFile" /></label><label class="inline-field">图片说明<input v-model="draft.caption" /></label><label class="inline-field">替代文本<input v-model="draft.alt" /></label><img v-if="draft.src" :src="draft.src" :alt="draft.alt" class="inline-image-preview" /></template>
      <template v-if="draft.type === 'animation'"><label class="inline-field">选择原站动画<select v-model="draft.animation.id"><option v-if="!catalog.length" :value="draft.animation.id">{{ draft.animation.id || '正在读取动画库…' }}</option><option v-for="id in catalog" :key="id" :value="id">{{ animations.get(id)?.ariaLabel || id }}</option></select></label><button @click="loadAnimations">重新载入动画库</button></template>
      <template v-if="draft.type === 'embed'"><label class="inline-field">演示标题<input v-model="draft.title" /></label><details><summary>高级设置</summary><label class="inline-field">演示内容<textarea v-model="draft.html" rows="9" spellcheck="false" /></label></details></template>
      <p v-if="error" :id="'inline-error-' + block.id" class="inline-error" role="alert">{{ error }}</p>
      <div class="inline-edit-footer"><span>直接输入中文，离开此处自动保存</span><button :disabled="busy" @click="cancel">取消</button><button class="inline-primary" :disabled="busy" aria-label="保存这段内容" @click="inlineAction(save)">{{ busy ? '保存中…' : '保存' }}</button></div>
    </div>
  </div>
</template>
