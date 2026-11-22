<script setup lang="ts">
import { ArrowRight, Document, Reading, Search } from '@element-plus/icons-vue'
import { highlightText } from '@/search/shared'
import { SEARCH_EXAMPLES, SEARCH_SUBJECTS, type SearchFilters, type SearchScope, type SearchSubject } from '@/search/query'
import type { SearchResult } from '@/search/types'

defineProps<{
  loading: boolean
  failed: boolean
  query: string
  results: SearchResult[]
  filters: SearchFilters
}>()

const emit = defineEmits<{
  select: [result: SearchResult]
  filter: [scope: SearchScope, subject: SearchSubject | '']
  example: [query: string]
  retry: []
}>()

const scopes: { id: SearchScope; title: string }[] = [
  { id: 'all', title: '全部内容' },
  { id: 'knowledge', title: '知识点' },
  { id: 'exam', title: '真题' },
]

function openResult(event: MouseEvent, result: SearchResult) {
  if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return
  event.preventDefault()
  emit('select', result)
}
</script>

<template>
  <main class="mx-auto min-h-[75vh] w-full max-w-6xl px-5 pb-20 pt-7 sm:px-8 sm:pt-10" :aria-busy="loading">
    <h1 class="mb-4 text-[clamp(1.65rem,3vw,2.1rem)] font-bold tracking-tight text-[#122748]">搜索</h1>
    <div class="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-[#dce5f1] pb-4">
      <div role="group" aria-label="内容类型" class="inline-flex flex-wrap gap-1 rounded-xl border border-[#d8e3f3] bg-white p-1">
        <button
          v-for="item in scopes"
          :key="item.id"
          type="button"
          :aria-pressed="filters.scope === item.id"
          class="scope-button min-h-11 rounded-lg px-3 text-sm font-semibold sm:px-4"
          @click="emit('filter', item.id, filters.subject)"
        >{{ item.title }}</button>
      </div>
      <div class="flex items-center gap-2 text-sm font-semibold text-[#465b7b]">
        <label for="search-subject">科目</label>
        <select
          id="search-subject"
          class="min-h-11 rounded-lg border border-[#b5c6de] bg-white px-3 text-[#162e53]"
          :value="filters.subject"
          @change="emit('filter', filters.scope, ($event.target as HTMLSelectElement).value as SearchSubject | '')"
        >
          <option value="">全部科目</option>
          <option v-for="subject in SEARCH_SUBJECTS" :key="subject.id" :value="subject.id">{{ subject.title }}</option>
        </select>
      </div>
    </div>

    <p v-if="loading" role="status" class="mb-3 text-sm text-[#465b7b]">正在查找「{{ query }}」…</p>
    <p v-else-if="query && results.length" role="status" class="mb-3 text-sm text-[#465b7b]">
      「{{ query }}」的{{ results.length === 8 ? '前' : '' }} {{ results.length }} 条结果
    </p>

    <ul v-if="results.length" class="grid list-none gap-2.5 p-0">
      <li v-for="result in results" :key="result.route" class="min-w-0">
        <RouterLink :to="result.route" custom v-slot="{ href }">
          <a :href="href" class="result-item group" @click="openResult($event, result)">
            <span class="result-icon" :class="{ 'result-icon-exam': result.type === 'exam' }">
              <component :is="result.type === 'exam' ? Document : Reading" class="h-5 w-5" aria-hidden="true" />
            </span>
            <div class="min-w-0 flex-1">
              <p class="mb-0.5 text-xs font-medium leading-relaxed text-[#4b6080]">
                {{ result.type === 'exam' ? '真题' : '知识点' }}
                <span v-if="result.subtitle"> · {{ result.subtitle }}</span>
              </p>
              <h2 class="m-0 text-base font-bold leading-snug text-[#132c55] sm:text-lg" v-html="highlightText(result.title, result.highlightQuery || query)" />
              <p v-if="result.subpointTitle && result.subpointTitle !== result.title" class="mb-0 mt-1 text-sm text-[#355aa4]" v-html="highlightText(result.subpointTitle, result.highlightQuery || query)" />
              <p v-if="result.snippet && result.snippet !== result.title && result.snippet !== result.subpointTitle" class="mb-0 mt-1 line-clamp-2 text-sm leading-relaxed text-[#425777]" v-html="highlightText(result.snippet, result.highlightQuery || query)" />
            </div>
            <ArrowRight class="h-4 w-4 shrink-0 self-center text-[#506a95] group-hover:text-[#234db4]" aria-hidden="true" />
          </a>
        </RouterLink>
      </li>
    </ul>

    <div v-else-if="loading" class="grid gap-2.5" aria-hidden="true">
      <div v-for="item in 3" :key="item" class="h-24 rounded-xl border border-[#dfe7f2] bg-[#edf2f9]" />
    </div>

    <div v-else class="rounded-xl border border-[#dce5f1] bg-white px-6 py-10 text-center">
      <Search class="mx-auto mb-3 h-6 w-6 text-[#4369ad]" aria-hidden="true" />
      <h2 class="mb-2 text-lg font-bold text-[#142b50]">{{ failed ? '搜索暂时无法加载' : query ? '没有找到匹配结果' : '搜索知识点或真题' }}</h2>
      <p v-if="failed" class="mb-3 text-sm text-[#465b7b]">可以重新加载索引后再试一次。</p>
      <p v-else-if="query" class="mb-3 text-sm text-[#465b7b]">换个关键词，或放宽筛选范围。</p>
      <p v-else class="mb-3 text-sm text-[#465b7b]">支持知识点、题干关键词和真题题号。</p>
      <button v-if="failed" type="button" class="empty-button" @click="emit('retry')">重试</button>
      <button v-else-if="query && (filters.scope !== 'all' || filters.subject)" type="button" class="empty-button" @click="emit('filter', 'all', '')">清除筛选</button>
      <div v-else class="flex flex-wrap justify-center gap-x-2">
        <button v-for="example in SEARCH_EXAMPLES" :key="example" type="button" class="empty-button" @click="emit('example', example)">{{ example }}</button>
      </div>
    </div>
  </main>
</template>

<style scoped>
.scope-button { color: #455e84; cursor: pointer; }
.scope-button:hover { background: #f0f4fc; }
.scope-button[aria-pressed="true"] { background: #e6efff; color: #174394; }
.result-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 13px 14px;
  border: 1px solid #dce5f1;
  border-radius: 12px;
  background: white;
  transition: background-color 150ms, border-color 150ms;
}
.result-item:hover { border-color: #83a0d4; background: #f8faff; }
.result-icon {
  display: grid;
  width: 36px;
  height: 36px;
  flex: none;
  place-items: center;
  border-radius: 9px;
  background: #e8effd;
  color: #284fa1;
}
.result-icon-exam { background: #e2f2eb; color: #236548; }
.empty-button {
  min-height: 44px;
  padding: 0 10px;
  border-radius: 8px;
  color: #214aa3;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}
.empty-button:hover { background: #edf3fd; }
:where(a, button, select):focus-visible { outline: 2px solid #2855bf; outline-offset: 2px; }
:deep(mark) { background: #fff1a7; color: #352805; border-radius: 2px; }
@media (prefers-reduced-motion: reduce) { .result-item { transition: none; } }
</style>
