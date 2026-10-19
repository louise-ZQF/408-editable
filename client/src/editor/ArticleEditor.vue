<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { addTrash, changeWorkspace, clone, uid } from './store'
import { animations, ensureAnimations, getEditableArticle, hydrateArticle } from './content'
import KnowledgeArticle from '@/components/knowledge-page/KnowledgeArticle.vue'
import type { KnowledgeArticleData, KnowledgeArticleBlock } from '@/content/knowledge-articles/types'

const props = defineProps<{ pointId: string }>()
const emit = defineEmits<{ dirty: [value: boolean]; saved: []; error: [message: string] }>()
const article = ref<KnowledgeArticleData>({ pointId: '', subpoints: [] })
const original = ref('')
const loading = ref(false)
const preview = ref(false)
const sourceMode = ref(false)
const source = ref('')
const catalog = ref<string[]>([])
const removed = ref<any[]>([])
const blockKinds = { paragraph: '文字 / Markdown / 代码', formula: '数学公式', callout: '提示框', image: '图片', html: 'HTML / SVG 图表', animation: '原站交互动画', embed: '自定义交互动画（HTML）' }
const isDirty = computed(() => { if (sourceMode.value) { try { return JSON.stringify(JSON.parse(source.value)) !== original.value } catch { return true } } return JSON.stringify(article.value) !== original.value })
watch(isDirty, value => emit('dirty', value))
watch(() => props.pointId, async id => {
  loading.value = true
  try {
    article.value = await getEditableArticle(id); original.value = JSON.stringify(article.value); source.value = original.value
    removed.value = []; preview.value = false; sourceMode.value = false
  } catch (e) { emit('error', String(e)) } finally { loading.value = false }
}, { immediate: true })
function addSubpoint() { article.value.subpoints.push({ id: uid('subpoint'), title: '未命名小节', blocks: [] }) }
function addBlock(sub: typeof article.value.subpoints[number], type: string) {
  const value: any = { id: uid('kb'), type }
  Object.assign(value, { paragraph: { text: '' }, formula: { formula: '', caption: '' }, callout: { title: '提示', text: '', tone: 'orange' }, image: { src: '', alt: '', caption: '' }, html: { html: '' }, animation: { animation: { id: catalog.value[0] || '' } }, embed: { title: '交互演示', html: '<!doctype html><html lang="zh-CN"><body><button onclick="this.textContent=\'运行成功\'">运行演示</button></body></html>' } }[type])
  sub.blocks.push(value)
}
function move(list: any[], index: number, offset: number) {
  const target = index + offset; if (target < 0 || target >= list.length) return
  const [item] = list.splice(index, 1); list.splice(target, 0, item)
}
function removeSub(index: number) {
  const sub = article.value.subpoints[index]
  removed.value.push({ kind: 'subpoint', title: sub.title, parentId: props.pointId, index, data: { pointId: props.pointId, value: clone(sub) } })
  article.value.subpoints.splice(index, 1)
}
function removeBlock(sub: typeof article.value.subpoints[number], index: number) {
  const block = sub.blocks[index]
  removed.value.push({ kind: 'block', title: block.type + ' · ' + block.id, parentId: sub.id, index, data: { pointId: props.pointId, subpointId: sub.id, value: clone(block) } })
  sub.blocks.splice(index, 1)
}
async function uploadImage(event: Event, block: any) {
  const file = (event.target as HTMLInputElement).files?.[0]; if (!file) return
  if (!/^image\/(png|jpeg|webp|gif|svg\+xml)$/.test(file.type)) { emit('error', '请选择 PNG、JPG、WebP、GIF 或 SVG 图片'); return }
  if (file.size > 8 * 1024 * 1024) { emit('error', '单张图片最大 8 MB'); return }
  block.src = await new Promise<string>((resolve, reject) => { const r = new FileReader(); r.onload = () => resolve(String(r.result)); r.onerror = reject; r.readAsDataURL(file) })
  if (!block.alt) block.alt = file.name
}
async function loadCatalog() { await ensureAnimations(); catalog.value = [...animations.keys()] }
function toggleSource() {
  try {
    if (sourceMode.value) article.value = JSON.parse(source.value)
    else source.value = JSON.stringify(article.value, null, 2)
    sourceMode.value = !sourceMode.value
  } catch { emit('error', 'JSON 格式错误，请检查后再切换') }
}
function save() {
  try {
    const value = sourceMode.value ? JSON.parse(source.value) : clone(article.value)
    if (value.pointId !== props.pointId) throw new Error('文章编号不能改变；移动文章请使用上级目录设置')
    changeWorkspace('保存文章', data => { data.articles[props.pointId] = value; for (const item of removed.value) addTrash(data, item) })
    article.value = clone(value); original.value = JSON.stringify(value); source.value = JSON.stringify(value, null, 2); removed.value = []
    emit('dirty', false); emit('saved')
  } catch (e) { emit('error', e instanceof Error ? e.message : String(e)) }
}
function handleShortcut(event: KeyboardEvent) { if ((event.metaKey || event.ctrlKey) && event.key === 's') { event.preventDefault(); save() } }
defineExpose({ save, isDirty })
</script>

<template>
  <section class="article-workbench" @keydown="handleShortcut">
    <div class="ed-toolbar">
      <div><h3>文章正文</h3><span class="ed-muted">每一段文字、公式、图表和动画都可以增删与排序。</span></div>
      <div class="ed-actions"><button @click="toggleSource">{{ sourceMode ? '返回可视编辑' : 'JSON 源码' }}</button><button :aria-pressed="preview" @click="preview = !preview">{{ preview ? '继续编辑' : '预览正文' }}</button><button class="ed-primary" aria-label="保存正文" @click="save">保存正文<span v-if="isDirty"> ·</span></button></div>
    </div>
    <div v-if="loading" class="ed-empty">正在载入完整原文…</div>
    <div v-else-if="preview" class="ed-preview"><KnowledgeArticle :article="hydrateArticle(article)" :exam-links="[]" /></div>
    <label v-else-if="sourceMode" class="ed-field">文章完整数据<textarea v-model="source" class="ed-code ed-source" spellcheck="false" /><span class="ed-muted">支持修改全部字段；动画保留引用 id，正文块的 id 用于真题关联。</span></label>
    <template v-else>
      <div v-if="!article.subpoints.length" class="ed-empty">这篇文章还没有内容。添加第一个小节，开始写你的教材。</div>
      <section v-for="(sub, si) in article.subpoints" :key="sub.id" class="ed-subpoint">
        <header class="ed-subhead"><span class="ed-number">{{ String(si + 1).padStart(2, '0') }}</span><label class="ed-grow"><span class="sr-only">小节标题</span><input v-model="sub.title" aria-label="小节标题" class="ed-title-input" /></label><div class="ed-actions"><button :disabled="si === 0" aria-label="上移小节" @click="move(article.subpoints, si, -1)">↑</button><button :disabled="si === article.subpoints.length - 1" aria-label="下移小节" @click="move(article.subpoints, si, 1)">↓</button><button class="ed-danger" @click="removeSub(si)">删除小节</button></div></header>
        <details v-for="(b, bi) in (sub.blocks as any[])" :key="b.id" class="ed-block" open>
          <summary><span class="ed-block-type">{{ (blockKinds as any)[b.type] }}</span><span class="ed-muted ed-truncate">{{ (b.text || b.caption || b.title || b.formula || b.alt || b.id).slice(0, 65) }}</span><span class="ed-chevron">⌄</span></summary>
          <div class="ed-block-body">
            <label v-if="b.type === 'paragraph'" class="ed-field">正文（支持 Markdown、代码和 $LaTeX$）<textarea v-model="b.text" rows="7" spellcheck="false" /></label>
            <template v-if="b.type === 'formula'"><label class="ed-field">LaTeX 公式<textarea v-model="b.formula" class="ed-code" rows="3" spellcheck="false" /></label><label class="ed-field">公式说明<input v-model="b.caption" /></label></template>
            <template v-if="b.type === 'callout'"><label class="ed-field">提示标题<input v-model="b.title" /></label><label class="ed-field">提示内容<textarea v-model="b.text" rows="4" /></label><label class="ed-field">提示颜色<select v-model="b.tone"><option value="orange">橙色</option><option value="blue">蓝色</option></select></label></template>
            <template v-if="b.type === 'image'"><label class="ed-field">图片链接<input v-model="b.src" placeholder="https://…，或直接上传图片" /></label><label class="ed-upload">从电脑上传图片<input type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml" @change="uploadImage($event, b)" /></label><label class="ed-field">替代文本<input v-model="b.alt" /></label><label class="ed-field">图片说明<input v-model="b.caption" /></label><img v-if="b.src" :src="b.src" :alt="b.alt" class="ed-image-preview" /></template>
            <label v-if="b.type === 'html'" class="ed-field">HTML / SVG 内容<textarea v-model="b.html" rows="8" class="ed-code" spellcheck="false" /><span class="ed-muted">此处支持图表和排版，脚本会被过滤；可运行演示请使用自定义交互动画。</span></label>
            <template v-if="b.type === 'animation'"><div class="ed-actions"><button @click="loadCatalog">载入原站动画库</button><span class="ed-muted">现有动画会保留全部播放步骤。</span></div><label class="ed-field">动画引用<select v-if="catalog.length" v-model="b.animation.id"><option v-for="id in catalog" :key="id" :value="id">{{ id }}</option></select><input v-else v-model="b.animation.id" /></label></template>
            <template v-if="b.type === 'embed'"><label class="ed-field">动画标题<input v-model="b.title" /></label><label class="ed-field">可运行的 HTML / CSS / JavaScript<textarea v-model="b.html" rows="9" class="ed-code" spellcheck="false" /><span class="ed-muted">在独立沙箱中运行，可以自由编写新的交互演示。</span></label></template>
            <footer class="ed-block-footer"><code>{{ b.id }}</code><div class="ed-actions"><button :disabled="bi === 0" aria-label="上移正文块" @click="move(sub.blocks, bi, -1)">↑</button><button :disabled="bi === sub.blocks.length - 1" aria-label="下移正文块" @click="move(sub.blocks, bi, 1)">↓</button><button @click="sub.blocks.splice(bi + 1, 0, { ...clone(b), id: uid('kb') } as KnowledgeArticleBlock)">复制</button><button class="ed-danger" @click="removeBlock(sub, bi)">删除块</button></div></footer>
          </div>
        </details>
        <div class="ed-add-block"><span class="ed-muted">添加内容</span><button v-for="(name, kind) in blockKinds" :key="kind" @click="addBlock(sub, kind)">＋ {{ name.split(' / ')[0] }}</button></div>
      </section>
      <button class="ed-add-section" @click="addSubpoint">＋ 添加小节</button>
      <p class="ed-muted">正文修改需点击「保存正文」后生效，也可以按 Ctrl / ⌘ + S。删除的内容会进入回收站。</p>
    </template>
  </section>
</template>
