<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { knowledgeBooks } from '@/content/knowledge-tree'
import { getExamIndex, getQuestionById } from '@/services/examRepository'
import type { Exam } from '@/types'
import ArticleEditor from './ArticleEditor.vue'
import { addNode, completeBackup, deleteNode, editTree, findNode, kindNames, restoreItem } from './content'
import { addTrash, changeWorkspace, clone, defaults, downloadJSON, editorOpen, editTarget, errorMessage, importWorkspace, openEditor, revision, reloadPublished, saveStatus, snapshot, uid, undo, undoCount, unpublished, workspace } from './store'
import { publishToGitHub } from './github'
import './editor.css'

const route = useRoute(); const router = useRouter()
const tab = ref('knowledge'); const query = ref(''); const selectedId = ref('')
const expanded = ref(new Set<string>())
const meta = ref<any>(null); const metaBefore = ref(''); const articleDirty = ref(false)
const articleRef = ref<InstanceType<typeof ArticleEditor>>()
const settings = ref(clone(workspace.settings)); const settingsBefore = ref(JSON.stringify(settings.value))
const exam = ref<Exam | null>(null); const examBefore = ref(''); const examJSON = ref(''); const examSource = ref(false)
const examIndex = ref<any[]>([]); const examLimit = ref(60); const examLoading = ref(false)
const busy = ref(false); const message = ref(''); const token = ref(''); const publishLink = ref('')
const confirmText = ref(''); let confirmedAction: (() => void) | undefined
const dialogRef = ref<HTMLElement>(); let lastFocus: HTMLElement | null = null
const pending = computed(() => articleDirty.value || (meta.value && JSON.stringify(meta.value) !== metaBefore.value) || JSON.stringify(settings.value) !== settingsBefore.value || (exam.value && JSON.stringify(exam.value) !== examBefore.value) || (examSource.value && examJSON.value !== JSON.stringify(exam.value, null, 2)))
const selected = computed(() => findNode(selectedId.value))
const stats = computed(() => ({ books: knowledgeBooks.length, points: knowledgeBooks.flatMap(b => b.chapters.flatMap(c => c.sections.flatMap(s => s.points))).length, exams: examIndex.value.length }))
const flatNodes = computed(() => {
  const all: any[] = []; const q = query.value.toLocaleLowerCase()
  function walk(nodes: any[], depth: number, path: string[], ancestors: string[]) {
    for (const node of nodes) {
      const kind = ['book', 'chapter', 'section', 'point'][depth]
      const titlePath = [...path, node.title]
      if (q ? titlePath.join(' ').toLocaleLowerCase().includes(q) : ancestors.every(id => expanded.value.has(id))) all.push({ ...node, kind, depth: q ? 0 : depth, context: path.join(' / '), hasChildren: kind !== 'point' })
      const children = node[['chapters', 'sections', 'points'][depth]]
      if (children) walk(children, depth + 1, titlePath, [...ancestors, node.id])
    }
  }
  walk(knowledgeBooks, 0, [], []); return all
})
const parentOptions = computed(() => {
  const kind = selected.value?.kind; const targetDepth = { chapter: 0, section: 1, point: 2 }[kind || '']
  const options: any[] = []
  function walk(nodes: any[], depth: number, path: string[]) {
    for (const node of nodes) {
      const next = [...path, node.title]; if (depth === targetDepth) options.push({ id: node.id, title: next.join(' / ') })
      const children = node[['chapters', 'sections'][depth]]; if (children && depth < 2) walk(children, depth + 1, next)
    }
  }
  walk(knowledgeBooks, 0, []); return options
})
const filteredExams = computed(() => {
  const q = query.value.trim().toLocaleLowerCase()
  return examIndex.value.filter(x => !q || `${x.year} ${x.number} ${x.stemText} ${x.chapter}`.toLocaleLowerCase().includes(q))
})
function run(action: () => void) { try { action(); errorMessage.value = '' } catch (e) { errorMessage.value = e instanceof Error ? e.message : String(e) } }
function ask(text: string, action: () => void) { confirmText.value = text; confirmedAction = action }
function guard(action: () => void) { if (pending.value) ask('当前有尚未保存的修改，离开后这些草稿会丢失。要继续吗？', action); else action() }
function confirm() { const action = confirmedAction; confirmText.value = ''; confirmedAction = undefined; if (action) run(action) }
function discardDrafts() { articleDirty.value = false; meta.value = null; metaBefore.value = ''; exam.value = null; examBefore.value = ''; examSource.value = false; settings.value = clone(workspace.settings); settingsBefore.value = JSON.stringify(settings.value) }
function choose(id: string) { guard(() => { discardDrafts(); selectedId.value = id; const found = findNode(id); if (found) { meta.value = { ...clone(found.node), parentId: found.parent?.id || '' }; metaBefore.value = JSON.stringify(meta.value) } }) }
function switchTab(value: string) { guard(() => { discardDrafts(); query.value = ''; tab.value = value; if (value === 'exams') void loadExams() }) }
function expand(id: string) { const next = new Set(expanded.value); next.has(id) ? next.delete(id) : next.add(id); expanded.value = next }
function create(parentId = '') { guard(() => { discardDrafts(); const id = addNode(parentId); if (parentId) expanded.value.add(parentId); choose(id) }) }
function saveMeta() {
  run(() => {
    if (!meta.value?.title.trim()) throw new Error('请填写标题')
    const form = clone(meta.value)
    editTree('保存目录', books => {
      const found = findNode(selectedId.value, books); if (!found) throw new Error('当前目录已被删除')
      const { parentId, ...node } = form
      Object.assign(found.node, node)
      if (found.kind !== 'book' && parentId !== found.parent.id) {
        const target = findNode(parentId, books); if (!target) throw new Error('请选择有效的上级目录')
        found.siblings.splice(found.siblings.indexOf(found.node), 1)
        target.node[{ chapter: 'sections', section: 'points', book: 'chapters' }[target.kind]!].push(found.node)
      }
    })
    metaBefore.value = JSON.stringify(meta.value); message.value = '目录已保存'
  })
}
function reorder(offset: number) {
  guard(() => {
    editTree('调整目录顺序', books => { const f = findNode(selectedId.value, books); if (!f) return; const i = f.siblings.indexOf(f.node); const j = i + offset; if (j < 0 || j >= f.siblings.length) return; const [item] = f.siblings.splice(i, 1); f.siblings.splice(j, 0, item) })
    const id = selectedId.value; discardDrafts(); choose(id)
  })
}
function removeSelected() { if (!selected.value) return; ask(`将「${selected.value.node.title}」及其全部下级内容移入回收站？你可以随时恢复。`, () => { deleteNode(selectedId.value); discardDrafts(); selectedId.value = ''; message.value = '已移入回收站' }) }
function openReader() { if (!selected.value) return; const f = selected.value; const sectionId = f.kind === 'point' ? f.parent.id : f.kind === 'section' ? f.node.id : f.kind === 'chapter' ? f.node.sections[0]?.id : f.node.chapters[0]?.sections[0]?.id; guard(() => { discardDrafts(); editorOpen.value = false; router.push({ name: 'knowledge', params: { bookId: f.bookId, sectionId }, query: f.kind === 'point' ? { block: `article-${f.node.id}` } : {} }) }) }
async function loadExams() { examLoading.value = true; try { examIndex.value = await getExamIndex() } catch { errorMessage.value = '题库未加载成功，请重试' } finally { examLoading.value = false } }
async function chooseExam(id: string) {
  guard(() => { discardDrafts(); void (async () => { const q = await getQuestionById(id); if (!q) return; exam.value = clone(q); examBefore.value = JSON.stringify(q); examJSON.value = JSON.stringify(q, null, 2) })() })
}
function newExam() { guard(() => { discardDrafts(); exam.value = { id: uid('exam'), year: new Date().getFullYear(), number: 1, score: 2, questionType: 'choice', subject: 'ds', chapterName: '', stem: '', options: ['A','B','C','D'].map(key => ({ key, text: '' })), answer: '', explanation: '', difficulty: 3, tags: [], resourceLinks: [], knowledgeBlockIds: [] }; examBefore.value = ''; examJSON.value = JSON.stringify(exam.value, null, 2) }) }
function saveExam() {
  run(() => {
    const value: Exam = examSource.value ? JSON.parse(examJSON.value) : clone(exam.value!)
    if (!value.stem.trim()) throw new Error('请填写题干')
    if (value.id !== exam.value!.id) throw new Error('题目编号不可修改；新增请点击「新增题目」')
    changeWorkspace('保存题目', data => { data.exams[value.id] = value; data.deletedExams = data.deletedExams.filter(id => id !== value.id) })
    exam.value = clone(value); examBefore.value = JSON.stringify(value); examJSON.value = JSON.stringify(value, null, 2); void loadExams(); message.value = '题目已保存'
  })
}
function removeExam() { if (!exam.value) return; const q = clone(exam.value); ask(`将 ${q.year} 年第 ${q.number} 题移入回收站？`, () => { changeWorkspace('删除题目', data => { addTrash(data, { kind: 'exam', title: `${q.year} 年第 ${q.number} 题`, parentId: '', index: 0, data: q }); data.deletedExams.push(q.id); delete data.exams[q.id] }); discardDrafts(); void loadExams(); message.value = '题目已移入回收站' }) }
function setCSV(key: 'tags' | 'resourceLinks' | 'knowledgeBlockIds', event: Event) { if (exam.value) exam.value[key] = (event.target as HTMLInputElement).value.split(/[,，\n]/).map(x => x.trim()).filter(Boolean) }
function saveSettings() { run(() => { changeWorkspace('保存网站设置', data => { data.settings = clone(settings.value) }); settingsBefore.value = JSON.stringify(settings.value); message.value = '网站设置已保存' }) }
async function exportBackup(full = false) { busy.value = true; try { const data = full ? await completeBackup() : snapshot(); downloadJSON(data, `408-${full ? '完整教材' : '个人修改'}-${new Date().toISOString().slice(0,10)}.json`); message.value = '备份已下载' } catch (e) { errorMessage.value = String(e) } finally { busy.value = false } }
async function importFile(event: Event) {
  const input = event.target as HTMLInputElement; const file = input.files?.[0]; if (!file) return
  try { const data = JSON.parse(await file.text()); ask('导入备份会替换当前个人内容，现有内容可以通过「撤销」恢复。继续导入吗？', () => { importWorkspace(data); discardDrafts(); message.value = '备份已导入'; void loadExams() }) } catch { errorMessage.value = '备份文件无法读取，请选择正确的 JSON 文件' }
  input.value = ''
}
async function publish() { if (pending.value) { errorMessage.value = '请先保存尚未提交的草稿，再发布到 GitHub'; return } busy.value = true; try { publishLink.value = await publishToGitHub(token.value); token.value = ''; message.value = '已提交至你的 GitHub，Pages 正在重新部署；通常需要 1–3 分钟。' } catch(e) { errorMessage.value = e instanceof Error ? e.message : String(e) } finally { busy.value = false } }
function close() { guard(() => { discardDrafts(); editorOpen.value = false }) }
function keyboard(e: KeyboardEvent) {
  if (!editorOpen.value) return
  if (e.key === 'Escape') { e.preventDefault(); if (confirmText.value) confirmText.value = ''; else close() }
  if (e.key === 'Tab' && dialogRef.value) {
    const scope = confirmText.value ? dialogRef.value.querySelector('.ed-confirm-box')! : dialogRef.value
    const items = [...scope.querySelectorAll<HTMLElement>('button:not(:disabled), input, select, textarea, a[href], [tabindex="0"]')].filter(x => x.getClientRects().length)
    const first = items[0], last = items[items.length - 1]
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus() }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus() }
  }
}
watch(editorOpen, async value => {
  document.body.style.overflow = value ? 'hidden' : ''
  if (value) {
    lastFocus = document.activeElement as HTMLElement; discardDrafts(); tab.value = 'knowledge'; query.value = ''
    const target = editTarget.value || String(route.params.sectionId || '')
    if (target && findNode(target)) { choose(target); for (const b of knowledgeBooks) { expanded.value.add(b.id); for (const c of b.chapters) if (c.sections.some(s => s.id === target || s.points.some(p => p.id === target))) { expanded.value.add(c.id); for(const s of c.sections) if (s.points.some(p => p.id === target)) expanded.value.add(s.id) } } }
    else { selectedId.value = ''; for(const b of knowledgeBooks) expanded.value.add(b.id) }
    await nextTick(); dialogRef.value?.focus(); void loadExams()
  } else { token.value = ''; lastFocus?.focus() }
})
watch(confirmText, async value => { if (value) { await nextTick(); dialogRef.value?.querySelector<HTMLElement>('.ed-confirm-box button')?.focus() } })
window.addEventListener('keydown', keyboard)
window.addEventListener('beforeunload', beforeUnload)
function beforeUnload(e: BeforeUnloadEvent) { if (pending.value) { e.preventDefault(); e.returnValue = '' } }
onBeforeUnmount(() => { window.removeEventListener('keydown', keyboard); window.removeEventListener('beforeunload', beforeUnload); document.body.style.overflow = '' })
</script>

<template>
  <button class="editor-launch" @click="openEditor()"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="m15 5 4 4M4 20l4-1 12-12a2.8 2.8 0 0 0-4-4L4 15z"/></svg><span>内容管理</span><span v-if="unpublished" class="ed-unsynced" title="有尚未发布到 GitHub 的修改" /></button>
  <Teleport to="body"><div v-if="editorOpen" ref="dialogRef" class="ed-shell" role="dialog" aria-modal="true" aria-labelledby="editor-title" tabindex="-1">
    <header class="ed-topbar"><div class="ed-brand"><span class="ed-brand-icon">408</span><div><h1 id="editor-title">我的教材工作台</h1><span class="ed-muted">保留原站体验，让每一处内容由你决定。</span></div></div><div class="ed-top-actions"><span class="ed-save-status" role="status"><i />{{ saveStatus }}</span><button :disabled="!undoCount" @click="guard(() => { undo(); discardDrafts(); selectedId = ''; loadExams() })">撤销<span v-if="undoCount"> {{ undoCount }}</span></button><button class="ed-close" aria-label="关闭内容管理" @click="close">×</button></div></header>
    <nav class="ed-tabs" aria-label="管理范围"><button v-for="(name, id) in { knowledge: '教材与知识', exams: '题库管理', settings: '网站设置', backups: '备份与发布', trash: '回收站' }" :key="id" :class="{ active: tab === id }" @click="switchTab(id)">{{ name }}<span v-if="id === 'trash' && workspace.trash.length" class="ed-badge">{{ workspace.trash.length }}</span></button></nav>
    <div v-if="errorMessage || message" class="ed-notice" :class="{ error: errorMessage }" role="status"><span>{{ errorMessage || message }}</span><a v-if="publishLink && !errorMessage" :href="publishLink" target="_blank" rel="noopener">查看 GitHub 提交 ↗</a><button aria-label="关闭提示" @click="errorMessage = ''; message = ''; publishLink = ''">×</button></div>
    <div class="ed-body" :class="{ 'ed-single': !['knowledge', 'exams'].includes(tab) }">
      <aside v-if="tab === 'knowledge' || tab === 'exams'" class="ed-sidebar"><div class="ed-side-head"><label class="ed-field"><span class="sr-only">搜索管理内容</span><input v-model="query" aria-label="搜索管理内容" type="search" :placeholder="tab === 'knowledge' ? '查找书籍、章节或知识点…' : '搜索年份、题干或章节…'" /></label><button class="ed-add" @click="tab === 'knowledge' ? create() : newExam()">＋ {{ tab === 'knowledge' ? '新增书籍' : '新增题目' }}</button></div>
        <div v-if="tab === 'knowledge'" class="ed-tree" aria-label="可编辑教材目录"><p class="ed-overline">{{ stats.books }} 本教材 · {{ stats.points }} 篇文章</p><div v-for="node in flatNodes" :key="node.id + node.context" class="ed-tree-row" :class="{ selected: selectedId === node.id }" :style="{ paddingLeft: 12 + node.depth * 14 + 'px' }"><button v-if="node.hasChildren && !query" class="ed-expander" :aria-label="(expanded.has(node.id) ? '收起' : '展开') + node.title" :aria-expanded="expanded.has(node.id)" @click="expand(node.id)">{{ expanded.has(node.id) ? '⌄' : '›' }}</button><span v-else class="ed-tree-dot">·</span><button class="ed-tree-label" :title="node.context" @click="choose(node.id)"><span>{{ node.title }}</span><small v-if="query">{{ node.context }}</small></button><span class="ed-node-kind">{{ kindNames[node.kind] }}</span></div><p v-if="!flatNodes.length" class="ed-empty">{{ query ? '没有匹配的目录' : '还没有教材，点击上方添加。' }}</p></div>
        <div v-else class="ed-exam-list"><p class="ed-overline">{{ filteredExams.length }} 道题目</p><p v-if="examLoading" class="ed-empty">正在读取题库…</p><button v-for="item in filteredExams.slice(0, examLimit)" :key="item.id" class="ed-exam-row" :class="{ selected: exam?.id === item.id }" @click="chooseExam(item.id)"><strong>{{ item.year }} 年 · 第 {{ item.number }} 题</strong><span>{{ item.stemText.replace(/<[^>]*>/g, '').slice(0, 62) }}</span></button><button v-if="filteredExams.length > examLimit" class="ed-load-more" @click="examLimit += 60">载入更多题目</button></div>
      </aside>
      <main class="ed-main">
        <template v-if="tab === 'knowledge'">
          <div v-if="!selected || !meta" class="ed-welcome"><span class="ed-overline">YOUR PERSONAL TEXTBOOK</span><h2>原来的教材，<br />现在由你定义。</h2><p>从左侧选择任何一本书、章节、页面或文章，就能修改、添加、删除和调整顺序。原站的正文、真题与交互动画都已保留。</p><button class="ed-primary" @click="create()">＋ 添加一本新教材</button><div class="ed-welcome-stats"><div><strong>{{ stats.books }}</strong><span>本教材</span></div><div><strong>{{ stats.points }}</strong><span>篇知识文章</span></div><div><strong>{{ stats.exams || '…' }}</strong><span>道历年真题</span></div></div></div>
          <template v-else><div class="ed-document-head"><span class="ed-overline">{{ kindNames[selected.kind] }} / {{ selected.node.id }}</span><h2>{{ selected.node.title }}</h2><div class="ed-actions"><button @click="openReader">打开阅读页 ↗</button><button v-if="selected.kind !== 'point'" @click="create(selectedId)">＋ 新增{{ { book: '章节', chapter: '页面', section: '文章' }[selected.kind] }}</button><button @click="reorder(-1)">上移</button><button @click="reorder(1)">下移</button><button class="ed-danger" @click="removeSelected">删除{{ kindNames[selected.kind] }}</button></div></div>
            <section class="ed-card"><div class="ed-form-grid"><label class="ed-field">标题<input v-model="meta.title" /></label><label v-if="selected.kind !== 'book'" class="ed-field">上级目录<select v-model="meta.parentId"><option v-for="p in parentOptions" :key="p.id" :value="p.id">{{ p.title }}</option></select></label><template v-if="selected.kind === 'book'"><label class="ed-field">副标题<input v-model="meta.subtitle" /></label><label class="ed-field">关联科目<select v-model="meta.subject"><option value="DATA_STRUCTURES">数据结构</option><option value="COMPUTER_ORGANIZATION">计算机组成原理</option><option value="OPERATING_SYSTEMS">操作系统</option><option value="NETWORK">计算机网络</option><option value="CUSTOM">自定义科目</option></select></label></template><label v-if="selected.kind === 'chapter'" class="ed-field">层级标记<input v-model="meta.layer" /></label><template v-if="selected.kind === 'point'"><label class="ed-field">重要程度<select v-model.number="meta.importance"><option v-for="n in 5" :key="n" :value="n">{{ n }} / 5</option></select></label><label class="ed-field ed-full">摘要<textarea v-model="meta.summary" rows="3" /></label></template></div><div class="ed-actions"><button class="ed-primary" @click="saveMeta">保存{{ kindNames[selected.kind] }}信息</button></div></section>
            <ArticleEditor v-if="selected.kind === 'point'" :key="selectedId" ref="articleRef" :point-id="selectedId" @dirty="articleDirty = $event" @saved="message = '正文已保存，阅读页已更新'" @error="errorMessage = $event" />
            <section v-else class="ed-card"><h3>下级内容</h3><p class="ed-muted">点击下方内容继续编辑，也可以添加新的{{ { book: '章节', chapter: '页面', section: '文章' }[selected.kind] }}。</p><button v-for="child in selected.node[{ book: 'chapters', chapter: 'sections', section: 'points' }[selected.kind]!]" :key="child.id" class="ed-child" @click="choose(child.id)"><span>{{ child.title }}</span><span>编辑 →</span></button><button class="ed-add-section" @click="create(selectedId)">＋ 新增{{ { book: '章节', chapter: '页面', section: '文章' }[selected.kind] }}</button></section>
          </template>
        </template>
        <template v-if="tab === 'exams'">
          <div v-if="!exam" class="ed-welcome"><span class="ed-overline">QUESTION LIBRARY</span><h2>题目也能<br />按你的方式整理。</h2><p>原站历年真题已全部保留。题干、选项、答案、解析、标签、图片链接和知识块关联都可以修改，也可以加入自己的练习题。</p><button class="ed-primary" @click="newExam">＋ 新增题目</button></div>
          <template v-else><div class="ed-document-head"><span class="ed-overline">QUESTION / {{ exam.id }}</span><h2>{{ exam.year }} 年 · 第 {{ exam.number }} 题</h2><div class="ed-actions"><button @click="() => { if (examSource) { run(() => { const q = JSON.parse(examJSON); if(q.id !== exam?.id) throw new Error('不可更改题目编号'); exam = q; examSource = false }) } else { examJSON = JSON.stringify(exam, null, 2); examSource = true } }">{{ examSource ? '返回表单' : '完整 JSON（含小题）' }}</button><button class="ed-danger" @click="removeExam">删除题目</button><button class="ed-primary" @click="saveExam">保存题目</button></div></div>
          <section class="ed-card"><label v-if="examSource" class="ed-field">全部题目字段<textarea v-model="examJSON" class="ed-code ed-source" /></label><template v-else><div class="ed-form-grid ed-three"><label class="ed-field">年份<input v-model.number="exam.year" type="number" min="1900" max="2200" /></label><label class="ed-field">题号<input v-model.number="exam.number" type="number" min="1" /></label><label class="ed-field">分值<input v-model.number="exam.score" type="number" min="0" /></label><label class="ed-field">科目<select v-model="exam.subject"><option value="ds">数据结构</option><option value="co">计算机组成原理</option><option value="os">操作系统</option><option value="cn">计算机网络</option></select></label><label class="ed-field">题型<select v-model="exam.questionType"><option value="choice">选择题</option><option value="comprehensive">综合题</option></select></label><label class="ed-field">难度<select v-model.number="exam.difficulty"><option v-for="n in 5" :key="n" :value="n">{{ n }} / 5</option></select></label></div><label class="ed-field">所属章节<input v-model="exam.chapterName" /></label><label class="ed-field">题干（支持 Markdown、公式与图片）<textarea v-model="exam.stem" rows="7" /></label><template v-if="exam.questionType === 'choice'"><label v-for="(option, i) in exam.options" :key="i" class="ed-field">选项 {{ option.key }}<div class="ed-option"><input v-model="option.key" aria-label="选项编号" class="ed-option-key" /><textarea v-model="option.text" rows="2" :aria-label="'选项 ' + option.key" /><button class="ed-danger" @click="exam.options.splice(i, 1)">删除</button></div></label><button @click="exam.options.push({ key: String.fromCharCode(65 + exam.options.length), text: '' })">＋ 添加选项</button></template><label class="ed-field">答案<textarea v-model="exam.answer" rows="2" /></label><label class="ed-field">解析<textarea v-model="exam.explanation" rows="7" /></label><label class="ed-field">标签（逗号分隔）<input :value="exam.tags.join(', ')" @input="setCSV('tags', $event)" /></label><label class="ed-field">关联知识块 ID（逗号分隔）<input :value="exam.knowledgeBlockIds.join(', ')" @input="setCSV('knowledgeBlockIds', $event)" /></label><label class="ed-field">资源链接（每行一个）<textarea :value="exam.resourceLinks.join('\n')" rows="3" @input="setCSV('resourceLinks', $event)" /></label></template><button class="ed-primary" @click="saveExam">保存题目</button></section></template>
        </template>
        <template v-if="tab === 'settings'"><div class="ed-document-head"><span class="ed-overline">MAKE IT YOURS</span><h2>网站设置</h2><p class="ed-muted">调整首页文字、显示模块与阅读样式；关闭模块即可从页面移除。</p></div><section class="ed-card"><div class="ed-form-grid"><label v-for="(label, key) in { title: '网站名称', headline: '首页大标题', tagline: '顶部标语', knowledgeLabel: '教材入口文字', examsLabel: '真题入口文字', footer: '页脚文字', contributorTitle: '共建者区域标题', contributorSubtitle: '共建者区域说明' }" :key="key" class="ed-field">{{ label }}<input v-model="settings[key]" /></label><label class="ed-field ed-full">轮播副标题（每行一句）<textarea :value="settings.lines.join('\n')" rows="4" @input="settings.lines = ($event.target as HTMLTextAreaElement).value.split('\n')" /></label><label class="ed-field">主题颜色<input v-model="settings.accent" type="color" /></label><label class="ed-field">阅读字号 · {{ settings.fontSize }} px<input v-model.number="settings.fontSize" type="range" min="14" max="28" /></label></div><label class="ed-field">共建者列表（JSON，留空使用原站名单，填 [] 删除全部）<textarea v-model="settings.contributorsJSON" class="ed-code" rows="5" placeholder='[{"name":"我的名字","platform":"github","url":"https://github.com/用户名"}]' /></label><div class="ed-toggles"><label v-for="(label, key) in { showLogo: '首页标志', showSubtitle: '轮播副标题', showSearch: '首页搜索', showKnowledge: '教材入口', showExams: '真题入口', showRepo: 'GitHub 链接', showContributors: '原站共建者', showFooter: '页脚' }" :key="key"><span>{{ label }}</span><input v-model="settings[key]" type="checkbox" role="switch" /></label></div><button class="ed-primary" @click="saveSettings">保存网站设置</button></section></template>
        <template v-if="tab === 'backups'"><div class="ed-document-head"><span class="ed-overline">YOUR CONTENT, YOUR GITHUB</span><h2>备份与发布</h2><p class="ed-muted">浏览器会保存个人修改；发布到你的 GitHub 后，其他设备也能读取最新教材。</p></div><section class="ed-card"><span class="ed-card-label">01 / 本地备份</span><h3>把你的教材握在手里</h3><p>「个人修改」包含目录调整、已编辑的文章、题目、设置和回收站；「完整教材」会同时导出所有原始正文及题目，图片上传内容会随备份保留，原站动画以源码引用保留。</p><div class="ed-actions"><button :disabled="busy" @click="exportBackup(false)">下载个人修改</button><button :disabled="busy" @click="exportBackup(true)">{{ busy ? '正在处理…' : '下载完整教材' }}</button><label class="ed-upload">导入备份<input type="file" accept="application/json,.json" @change="importFile" /></label></div></section><section class="ed-card"><span class="ed-card-label">02 / GITHUB PAGES</span><h3>发布到你的 GitHub</h3><p>GitHub Pages 是静态托管，网站需要你的仓库写入权限才能发布修改。填写仅授权此仓库、具备 <code>Contents: Read and write</code> 权限的细粒度令牌，点击发布后会生成一次 Git 提交并自动更新网站。</p><p class="ed-muted">令牌仅在当前页面内存中使用，关闭工作台后清除，不写入备份或仓库；数据仅发送到 api.github.com。仓库中的教材修改文件是公开的，请勿加入私人资料。</p><div class="ed-form-grid"><label class="ed-field">GitHub 仓库<input :value="workspace.settings.repository" readonly /></label><label class="ed-field">分支<input :value="workspace.settings.branch" readonly /></label></div><label class="ed-field">GitHub 细粒度令牌<input v-model="token" type="password" autocomplete="off" placeholder="github_pat_…" /></label><div class="ed-actions"><a :href="'https://github.com/settings/personal-access-tokens/new?name=408-editable&target_name=louise-ZQF'" target="_blank" rel="noopener">在 GitHub 创建仓库专用令牌 ↗</a><button class="ed-primary" :disabled="busy" @click="publish">{{ busy ? '正在提交…' : '发布修改到我的 GitHub' }}</button></div><p class="ed-muted">{{ unpublished ? '当前有未发布的个人修改。' : '当前没有未发布的个人修改。' }} 发布期间可以继续阅读，GitHub Pages 通常在 1–3 分钟后完成部署。</p></section><section class="ed-card"><h3>重新载入 GitHub 上的版本</h3><p>换设备或遇到同步冲突时，可先下载个人修改作为备份，再载入已部署的 GitHub 版本；当前版本会保留在「撤销」记录中。</p><button @click="ask('载入 GitHub 版本会替换当前个人内容。请先下载备份，是否继续？', () => { busy = true; reloadPublished().then(() => { discardDrafts(); message = '已载入 GitHub 发布版本' }).catch(e => errorMessage = String(e)).finally(() => busy = false) })">载入 GitHub 发布版本</button></section><section class="ed-card"><h3>源码与署名</h3><p>本网站基于 <a href="https://github.com/liangbohan/postgraduate-exam-website" target="_blank" rel="noopener">liangbohan / postgraduate-exam-website</a>，原项目采用 CC BY 4.0，本版本加入个人内容管理、持久保存、回收站与 GitHub 发布功能。</p><a href="https://github.com/louise-ZQF/408-editable" target="_blank" rel="noopener">查看你自己的完整源码 ↗</a></section></template>
        <template v-if="tab === 'trash'"><div class="ed-document-head"><span class="ed-overline">NOTHING LOST</span><h2>回收站</h2><p class="ed-muted">删除的书籍、目录、正文块与题目都可以恢复；删除上级目录时，下级内容会一起保留。</p></div><div v-if="!workspace.trash.length" class="ed-empty ed-card">回收站是空的。</div><section v-for="item in workspace.trash" :key="item.id" class="ed-trash-item"><div><span class="ed-card-label">{{ kindNames[item.kind] || item.kind }}</span><h3>{{ item.title }}</h3><span class="ed-muted">{{ new Date(item.time).toLocaleString('zh-CN') }}</span></div><button @click="run(() => { restoreItem(item.id); message = '内容已恢复' })">恢复内容</button></section></template>
      </main>
    </div>
    <div v-if="confirmText" class="ed-confirm-backdrop"><section class="ed-confirm-box" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title"><h2 id="confirm-title">确认操作</h2><p>{{ confirmText }}</p><div class="ed-actions"><button @click="confirmText = ''">取消</button><button class="ed-primary" @click="confirm">确认</button></div></section></div>
  </div></Teleport>
</template>
