<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { uid } from './store'
import { inlineAction, inlineMode, refreshDirtyCount, registerInlineDraft, renameInlineTitle } from './inline'
const props = defineProps<{ title: string; nodeId: string; kind?: 'node' | 'subpoint'; pointId?: string }>()
const editing = ref(false), draft = ref(props.title), field = ref<HTMLInputElement>(), error = ref('')
const dirty = computed(() => editing.value && draft.value !== props.title)
watch(dirty, refreshDirtyCount, { flush: 'sync' })
let saving: Promise<void> | undefined
const unregister = registerInlineDraft('title-' + props.nodeId + uid('draft'), { dirty: () => dirty.value, save })
onBeforeUnmount(unregister)
async function start() { inlineMode.value = true; draft.value = props.title; editing.value = true; error.value = ''; await nextTick(); field.value?.focus(); field.value?.select() }
function cancel() { editing.value = false; error.value = ''; refreshDirtyCount() }
async function save() {
  if (saving) return saving
  if (!dirty.value) { cancel(); return }
  error.value = ''
  saving = renameInlineTitle(props.kind || 'node', props.nodeId, draft.value, props.pointId).then(cancel).catch(e => { error.value = e.message; throw e }).finally(() => { saving = undefined })
  return saving
}
watch(inlineMode, value => { if (!value) cancel() })
</script>
<template>
  <span class="inline-title" :class="{ 'inline-title-enabled': inlineMode }" :data-inline-title="nodeId">
    <span v-if="!editing" role="button" tabindex="0" title="点击直接改字" @click="start" @keydown.enter.prevent="start">{{ title }}</span>
    <span v-else class="inline-title-form"><input ref="field" v-model="draft" aria-label="直接修改标题" @blur="inlineAction(save)" @keydown.enter.prevent="inlineAction(save)" @keydown.esc.prevent.stop="cancel" /><span v-if="error" class="inline-error" role="alert">{{ error }}</span></span>
  </span>
</template>
