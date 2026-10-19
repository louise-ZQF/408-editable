<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { addNode, deleteNode, findNode } from './content'
import { flushInlineDrafts, inlineAction, inlineFeedback, inlineMode, renameInlineTitle } from './inline'
const props = defineProps<{ nodeId: string; book?: boolean }>()
const router = useRouter(), renaming = ref(false), title = ref('')
const node = computed(() => findNode(props.nodeId))
const childLabel = computed(() => ({ book: '章节', chapter: '页面', section: '文章' }[node.value?.kind || '']))
async function rename() { await renameInlineTitle('node', props.nodeId, title.value); renaming.value = false }
async function create() {
  await flushInlineDrafts()
  if (node.value?.kind === 'section') { const { addInlineArticle } = await import('./inline'); await addInlineArticle(props.nodeId); return }
  const id = addNode(props.nodeId), added = findNode(id)
  if (added?.kind === 'section') await router.push({ name: 'knowledge', params: { bookId: added.bookId, sectionId: id } })
  inlineFeedback('已添加' + (childLabel.value || '内容') + '，可以在目录中继续修改')
}
async function remove() { await flushInlineDrafts(); deleteNode(props.nodeId); inlineFeedback('已移入回收站，可以直接撤销') }
async function newBook() { await flushInlineDrafts(); const id = addNode(); await router.push({ name: 'knowledge', params: { bookId: id } }); inlineFeedback('新教材已添加，可以在左侧添加章节和页面') }
</script>
<template><div v-if="inlineMode && node" class="inline-node-tools"><template v-if="!renaming"><button :aria-label="'重命名' + node.node.title" @click="title = node.node.title; renaming = true">改名</button><button v-if="childLabel" @click="inlineAction(create)">＋ {{ childLabel }}</button><button class="inline-danger" :aria-label="'删除' + node.node.title" @click="inlineAction(remove)">删除</button><button v-if="book" @click="inlineAction(newBook)">＋ 新教材</button></template><form v-else class="inline-node-form" @submit.prevent="inlineAction(rename)"><input v-model="title" aria-label="新的目录名称" /><button type="submit">保存</button><button type="button" @click="renaming = false">取消</button></form></div></template>
