<script setup lang="ts">
import { onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { editorOpen, errorMessage, saveStatus, undo, undoCount } from './store'
import { finishInlineEditing, flushInlineDrafts, inlineAction, inlineDirtyCount, inlineError, inlineFeedback, inlineMessage, inlineMode } from './inline'
import './inline.css'
const route = useRoute()
function beforeUnload(event: BeforeUnloadEvent) { if (inlineDirtyCount.value) { event.preventDefault(); event.returnValue = '' } }
window.addEventListener('beforeunload', beforeUnload)
onBeforeUnmount(() => window.removeEventListener('beforeunload', beforeUnload))
async function undoEdit() { await flushInlineDrafts(); undo(); inlineFeedback('已撤销上一步') }
</script>
<template>
  <aside v-if="!editorOpen && route.name === 'knowledge'" class="inline-edit-bar" :class="{ 'inline-edit-bar-active': inlineMode }" aria-label="页面直接编辑">
    <template v-if="!inlineMode"><button class="inline-primary inline-start" @click="inlineMode = true; inlineFeedback('点击正文或标题就能修改，离开输入框自动保存')"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="m15 5 4 4M4 20l4-1 12-12a2.8 2.8 0 0 0-4-4L4 15z"/></svg>直接编辑</button></template>
    <template v-else><div class="inline-bar-info"><strong><i />编辑模式</strong><span role="status">{{ inlineDirtyCount ? '输入中，离开输入框自动保存' : saveStatus }}</span></div><div class="inline-bar-actions"><button :disabled="!undoCount && !inlineDirtyCount" @click="inlineAction(undoEdit)">撤销</button><button class="inline-primary" @click="inlineAction(finishInlineEditing)">完成编辑</button></div><p v-if="inlineMessage || errorMessage" class="inline-bar-message" :class="{ 'inline-error': inlineError || errorMessage }" role="status">{{ errorMessage || inlineMessage }}</p></template>
  </aside>
</template>
