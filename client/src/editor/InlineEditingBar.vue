<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref } from 'vue'
import { useRoute } from 'vue-router'
import { editorOpen, errorMessage, saveStatus, undo, undoCount } from './store'
import { finishInlineEditing, flushInlineDrafts, inlineAction, inlineDirtyCount, inlineError, inlineFeedback, inlineMessage, inlineMode } from './inline'
import './inline.css'
const route = useRoute()
const collapsedKey = '408-editable:inline-toolbar-collapsed'
function readCollapsed() { try { return localStorage.getItem(collapsedKey) === 'true' } catch { return false } }
const collapsed = ref(readCollapsed())
function startEditing() { collapsed.value = false; inlineMode.value = true; inlineFeedback('已进入编辑模式，点击正文或标题即可修改') }
const collapseButton = ref<HTMLButtonElement>(), expandButton = ref<HTMLButtonElement>()
async function toggleCollapsed(value: boolean, event: MouseEvent) {
  collapsed.value = value
  try { localStorage.setItem(collapsedKey, String(value)) } catch { /* 浏览器禁用存储时仍可收起 */ }
  if (event.detail === 0) { await nextTick(); (value ? expandButton.value : collapseButton.value)?.focus() }
}
function beforeUnload(event: BeforeUnloadEvent) { if (inlineDirtyCount.value) { event.preventDefault(); event.returnValue = '' } }
window.addEventListener('beforeunload', beforeUnload)
onBeforeUnmount(() => window.removeEventListener('beforeunload', beforeUnload))
async function undoEdit() { await flushInlineDrafts(); undo(); inlineFeedback('已撤销上一步') }
</script>
<template>
  <aside v-if="!editorOpen && route.name === 'knowledge'" class="inline-edit-bar" :class="{ 'inline-edit-bar-active': inlineMode && !collapsed, 'inline-edit-bar-collapsed': inlineMode && collapsed }" aria-label="页面直接编辑">
    <template v-if="!inlineMode"><button class="inline-primary inline-start" @click="startEditing"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="m15 5 4 4M4 20l4-1 12-12a2.8 2.8 0 0 0-4-4L4 15z"/></svg>编辑模式</button></template>
    <button v-else-if="collapsed" ref="expandButton" type="button" class="inline-bar-expand" :class="{ 'inline-bar-has-error': inlineError || errorMessage }" aria-label="展开编辑工具栏" :aria-expanded="false" :title="errorMessage || (inlineError ? inlineMessage : '展开编辑工具栏')" @mousedown.prevent @click="toggleCollapsed(false, $event)"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="m15 5 4 4M4 20l4-1 12-12a2.8 2.8 0 0 0-4-4L4 15z"/></svg><span v-if="inlineError || errorMessage" class="inline-bar-error-dot" aria-hidden="true" /></button>
    <template v-else><div class="inline-bar-info"><strong><i />编辑模式</strong><span role="status">{{ inlineDirtyCount ? '正在写入，离开此处自动保存' : saveStatus }}</span></div><div class="inline-bar-actions"><button :disabled="!undoCount && !inlineDirtyCount" @click="inlineAction(undoEdit)">撤销</button><button class="inline-primary" @click="inlineAction(finishInlineEditing)">完成编辑</button><button ref="collapseButton" type="button" class="inline-bar-collapse" aria-label="收起编辑工具栏" :aria-expanded="true" title="收起工具栏，继续编辑正文" @mousedown.prevent @click="toggleCollapsed(true, $event)">收起<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></button></div><p v-if="inlineMessage || errorMessage" class="inline-bar-message" :class="{ 'inline-error': inlineError || errorMessage }" role="status">{{ errorMessage || inlineMessage }}</p></template>
  </aside>
</template>
