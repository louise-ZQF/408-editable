<script setup lang="ts">
import { ref } from 'vue'
import { addInlineBlock, inlineAction, inlineKinds, inlineMode } from './inline'
const props = defineProps<{ pointId: string; subpointId: string }>()
const open = ref(false)
</script>
<template>
  <div v-if="inlineMode" class="inline-add-content"><button :aria-expanded="open" @click="open = !open">＋ 添加内容</button><div v-if="open" class="inline-add-options"><button v-for="(name, kind) in inlineKinds" :key="kind" @click="open = false; inlineAction(() => addInlineBlock(props.pointId, props.subpointId, kind))">{{ name }}</button></div></div>
</template>
