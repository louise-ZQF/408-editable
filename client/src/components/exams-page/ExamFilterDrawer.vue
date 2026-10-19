<script setup lang="ts">
import { ref, watch } from "vue";
import { Search } from "@element-plus/icons-vue";
import type {
  ExamFilterBookChapter,
  ExamFilterBookChapterSection,
  ExamFilters,
  ExamSubject,
} from "@/types";
import BrandLogo from "@/components/BrandLogo.vue";
import ReaderDrawer from "@/components/ReaderDrawer.vue";
import { warmSearch } from "@/search/shared";
import type { ExamFilterPatch, ExamFilterSelection } from "./pageTypes";

const props = defineProps<{
  currentFilterText: string;
  filters?: ExamFilters;
  hasActiveFilters: boolean;
  open: boolean;
  pinned: boolean;
  selection: ExamFilterSelection;
}>();

const emit = defineEmits<{
  hover: [value: boolean];
  pin: [value: boolean];
  reset: [];
  search: [term: string];
  update: [patch: ExamFilterPatch];
}>();

const openBookId = ref("");
const openChapterId = ref("");

function toggleBook(subject: string) {
  openBookId.value = openBookId.value === subject ? "" : subject;
  if (openBookId.value) openChapterId.value = "";
}

function toggleChapter(chapterId: string) {
  openChapterId.value = openChapterId.value === chapterId ? "" : chapterId;
}

function selectChapter(subject: ExamSubject, chapter: ExamFilterBookChapter) {
  emit("update", {
    subject,
    chapter: chapter.name,
    section: "",
    knowledgeBlockId: chapter.blockIds.join(","),
  });
}

function selectSection(
  subject: ExamSubject,
  chapter: ExamFilterBookChapter,
  section: ExamFilterBookChapterSection,
) {
  emit("update", {
    subject,
    chapter: chapter.name,
    section: section.name,
    knowledgeBlockId: section.blockIds.join(","),
  });
}

function normalizedBlockIds(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .sort()
    .join(",");
}

function isChapterActive(subject: ExamSubject, chapter: ExamFilterBookChapter) {
  if (props.selection.subject !== subject || props.selection.section)
    return false;
  const current = normalizedBlockIds(props.selection.knowledgeBlockId);
  const chapterIds = [...chapter.blockIds].sort().join(",");
  if (current && chapterIds && current === chapterIds) return true;
  return !current && props.selection.chapter === chapter.name;
}

function isSectionActive(
  subject: ExamSubject,
  section: ExamFilterBookChapterSection,
) {
  if (props.selection.subject !== subject) return false;
  const current = normalizedBlockIds(props.selection.knowledgeBlockId);
  const sectionIds = [...section.blockIds].sort().join(",");
  return Boolean(current && sectionIds && current === sectionIds);
}

function bookTotal(book: { chapters: Array<{ count: number }> }) {
  return book.chapters.reduce((sum, chapter) => sum + chapter.count, 0);
}

function onSearchKeydown(event: KeyboardEvent) {
  if (event.key !== "Enter") return;
  event.preventDefault();
  emit("search", props.selection.keyword);
}

watch(
  () => props.selection.subject,
  (subject) => {
    if (subject) openBookId.value = subject;
  },
);
watch(
  () => props.hasActiveFilters,
  (hasActiveFilters) => {
    if (!hasActiveFilters) openChapterId.value = "";
  },
);
</script>

<template>
  <ReaderDrawer
    side="left"
    :width="300"
    :open="open"
    :pinned="pinned"
    surface-class="bg-[#f8fafc]"
    trigger-label="悬停展开真题筛选"
    pin-label="真题筛选"
    @hover="emit('hover', $event)"
    @pin="emit('pin', $event)"
  >
    <template #header><BrandLogo /></template>

    <section class="px-5 pb-5 pt-5">
      <label class="relative block" @pointerenter="warmSearch">
        <span class="sr-only">搜索真题</span>
        <Search
          class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
        />
        <input
          :value="selection.keyword"
          class="h-10 w-full rounded-xl border border-[#d5deea] bg-white pl-9 pr-3 text-[13px] outline-none transition placeholder:text-slate-400 hover:border-[#aebbd0] focus:border-[#6686c7]"
          placeholder="搜索知识点（回车前往搜索页）"
          autocomplete="off"
          spellcheck="false"
          type="search"
          @input="
            emit('update', {
              keyword: ($event.target as HTMLInputElement).value,
            })
          "
          @focus="warmSearch"
          @keydown="onSearchKeydown"
        />
      </label>
    </section>

    <div class="min-h-0 flex-1 overflow-y-auto px-3 pb-10 pt-3">
      <section class="mb-1 px-3" aria-live="polite" aria-label="当前筛选">
        <p class="current-filter-summary__label">当前筛选</p>
        <p class="current-filter-summary__value">{{ currentFilterText }}</p>
        <button
          v-if="hasActiveFilters"
          type="button"
          class="current-filter-summary__clear"
          aria-label="清除全部真题筛选"
          @click="emit('reset')"
        >
          清除全部筛选 <span aria-hidden="true">×</span>
        </button>
      </section>

      <div class="space-y-5 px-3 py-3">
        <div>
          <p
            class="mb-2.5 text-[11px] font-semibold tracking-[.06em] text-slate-500"
          >
            年份
          </p>
          <div class="flex flex-wrap gap-1.5">
            <button
              type="button"
              class="filter-chip"
              :class="selection.year === undefined ? 'is-active' : ''"
              @click="emit('update', { year: undefined })"
            >
              全部
            </button>
            <button
              v-for="year in filters?.years"
              :key="year"
              type="button"
              class="filter-chip"
              :class="selection.year === year ? 'is-active' : ''"
              @click="emit('update', { year })"
            >
              {{ year }}
            </button>
          </div>
        </div>
        <div>
          <p
            class="mb-2.5 text-[11px] font-semibold tracking-[.06em] text-slate-500"
          >
            题型
          </p>
          <div class="flex flex-wrap gap-1.5">
            <button
              type="button"
              class="filter-chip"
              :class="selection.questionType === '' ? 'is-active' : ''"
              @click="emit('update', { questionType: '' })"
            >
              全部
            </button>
            <button
              v-for="item in filters?.questionTypes"
              :key="item.value"
              type="button"
              class="filter-chip"
              :class="selection.questionType === item.value ? 'is-active' : ''"
              @click="emit('update', { questionType: item.value })"
            >
              {{ item.label }}
            </button>
          </div>
        </div>
      </div>

      <nav class="px-3 py-4" aria-label="按书本与章节筛选">
        <div
          class="mb-2 px-3 font-mono text-[10px] font-bold tracking-[.15em] text-slate-400"
        >
          BOOKS / 书本
        </div>
        <ol class="m-0 list-none space-y-1 p-0">
          <li
            v-for="book in filters?.books"
            :key="book.subject"
            class="overflow-hidden rounded-[6px]"
            :class="
              openBookId === book.subject
                ? 'bg-white ring-1 ring-[#e3e9f1]'
                : ''
            "
          >
            <button
              type="button"
              class="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-2 px-3 py-[13px] text-left transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#12327f]"
              :class="
                openBookId === book.subject
                  ? 'rounded-t-[6px] bg-[#eef2f8] text-[#071225]'
                  : 'rounded-[6px] text-slate-600 hover:bg-[#eef2f8] hover:text-[#071225]'
              "
              :aria-expanded="openBookId === book.subject"
              @click="toggleBook(book.subject)"
            >
              <span
                class="min-w-0 text-[16px] font-semibold leading-6 tracking-[-.018em]"
                >{{ book.label }}</span
              >
              <span class="flex items-center gap-1.5"
                ><span
                  class="font-mono text-[11px] font-semibold text-slate-400"
                  >{{ bookTotal(book) }}</span
                ><span
                  class="text-sm font-light text-slate-400"
                  aria-hidden="true"
                  >{{ openBookId === book.subject ? "−" : "+" }}</span
                ></span
              >
            </button>
            <ul
              v-if="openBookId === book.subject"
              class="m-0 list-none px-1.5 pb-2 pt-1 space-y-1"
            >
              <li v-for="chapter in book.chapters" :key="chapter.id">
                <div class="overflow-hidden rounded-[4px]">
                  <button
                    type="button"
                    class="flex w-full items-center justify-between gap-2 rounded-[4px] px-3 py-2 text-left text-[15px] leading-6 tracking-[-.012em] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#12327f]"
                    :class="
                      isChapterActive(book.subject, chapter)
                        ? 'bg-[#e6eefb] font-semibold text-[#12327f]'
                        : openChapterId === chapter.id
                          ? 'bg-[#f5f8fc] font-semibold text-[#071225]'
                          : 'font-normal text-slate-600 hover:bg-[#f2f5f9] hover:text-[#071225]'
                    "
                    :aria-current="
                      isChapterActive(book.subject, chapter)
                        ? 'page'
                        : undefined
                    "
                    @click="selectChapter(book.subject, chapter)"
                  >
                    <span class="min-w-0 truncate">{{ chapter.name }}</span>
                    <span class="flex shrink-0 items-center gap-1.5"
                      ><span
                        class="font-mono text-[11px] font-semibold text-slate-400"
                        >{{ chapter.count }}</span
                      ><span
                        v-if="chapter.sections.length"
                        class="text-sm font-light text-slate-400 select-none"
                        aria-hidden="true"
                        @click.stop="toggleChapter(chapter.id)"
                        >{{ openChapterId === chapter.id ? "−" : "+" }}</span
                      ></span
                    >
                  </button>
                  <ul
                    v-if="
                      chapter.sections.length && openChapterId === chapter.id
                    "
                    class="m-0 mt-0.5 list-none space-y-0.5 border-l border-[#e1e8f3] pl-2"
                  >
                    <li v-for="section in chapter.sections" :key="section.id">
                      <button
                        type="button"
                        class="flex w-full items-center justify-between gap-2 rounded-[4px] px-3 py-1.5 text-left text-[14px] leading-6 tracking-[-.01em] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#12327f]"
                        :class="
                          isSectionActive(book.subject, section)
                            ? 'bg-[#e6eefb] font-semibold text-[#12327f]'
                            : 'font-normal text-slate-500 hover:bg-[#f2f5f9] hover:text-[#071225]'
                        "
                        :aria-current="
                          isSectionActive(book.subject, section)
                            ? 'page'
                            : undefined
                        "
                        @click="selectSection(book.subject, chapter, section)"
                      >
                        <span class="min-w-0 truncate">{{ section.name }}</span
                        ><span
                          class="shrink-0 font-mono text-[11px] font-semibold text-slate-400"
                          >{{ section.count }}</span
                        >
                      </button>
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
          </li>
        </ol>
      </nav>
    </div>
  </ReaderDrawer>
</template>

<style scoped>
.current-filter-summary__label {
  margin: 0 0 6px;
  color: #94a3b8;
  font-family:
    ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
}
.current-filter-summary__value {
  margin: 0;
  color: #172033;
  font-size: 16px;
  font-weight: 600;
  line-height: 22px;
  word-break: break-word;
}
.current-filter-summary__clear {
  margin-top: 8px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #64748b;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  transition: color 0.12s ease;
}
.current-filter-summary__clear:hover {
  color: #12327f;
}
.filter-chip {
  border-radius: 6px;
  background: #eef2f8;
  padding: 4px 10px;
  color: #475569;
  font-size: 12px;
  font-weight: 600;
  transition: background-color 0.15s;
}
.filter-chip:hover {
  background: #e3e9f2;
}
.filter-chip.is-active {
  background: #12327f;
  color: #fff;
}
</style>
