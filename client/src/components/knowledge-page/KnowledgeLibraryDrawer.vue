<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import type { Book } from "@/types";
import BrandLogo from "@/components/BrandLogo.vue";
import ReaderDrawer from "@/components/ReaderDrawer.vue";
import KnowledgeSidebar from "./KnowledgeSidebar.vue";
import { warmSearch } from "@/search/shared";

type SearchSuggestion = {
  kind: "chapter" | "section" | "point";
  id: string;
  title: string;
  context: string;
  sectionId: string;
};

type SearchPanelItem =
  | { type: "search"; term: string }
  | { type: "history"; term: string }
  | { type: "suggestion"; suggestion: SearchSuggestion };

const props = defineProps<{
  activeSectionId: string;
  book?: Book;
  bookId: string;
  books: Book[];
  open: boolean;
  pinned: boolean;
}>();

const emit = defineEmits<{
  hover: [value: boolean];
  pin: [value: boolean];
  selectBook: [id: string];
  selectSection: [id: string];
}>();

const router = useRouter();
const sidebarQuery = ref("");
const searchFocused = ref(false);
const highlightIndex = ref(-1);
const bookMenuOpen = ref(false);
const bookMenuRef = ref<HTMLElement | null>(null);
const searchBoxRef = ref<HTMLElement | null>(null);
const SEARCH_HISTORY_KEY = "knowledge-sidebar-search-history:v1";
const MAX_SEARCH_HISTORY = 8;

function loadSearchHistory(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed: unknown = JSON.parse(
      window.localStorage.getItem(SEARCH_HISTORY_KEY) || "[]",
    );
    return Array.isArray(parsed)
      ? parsed
          .filter((item): item is string => typeof item === "string")
          .slice(0, MAX_SEARCH_HISTORY)
      : [];
  } catch {
    return [];
  }
}

const searchHistory = ref(loadSearchHistory());
const currentBookTitle = computed(
  () => props.books.find((item) => item.id === props.bookId)?.title || "",
);
const searchSuggestions = computed<SearchSuggestion[]>(() => {
  const query = sidebarQuery.value.trim().toLowerCase();
  if (!query || !props.book) return [];
  const suggestions: SearchSuggestion[] = [];
  for (const chapter of props.book.chapters) {
    if (chapter.title.toLowerCase().includes(query)) {
      suggestions.push({
        kind: "chapter",
        id: chapter.id,
        title: chapter.title,
        context: "",
        sectionId: chapter.sections[0]?.id || "",
      });
    }
    for (const section of chapter.sections) {
      if (section.title.toLowerCase().includes(query)) {
        suggestions.push({
          kind: "section",
          id: section.id,
          title: section.title,
          context: chapter.title,
          sectionId: section.id,
        });
      }
      for (const point of section.points) {
        if (point.title.toLowerCase().includes(query)) {
          suggestions.push({
            kind: "point",
            id: point.id,
            title: point.title,
            context: `${chapter.title} / ${section.title}`,
            sectionId: section.id,
          });
        }
      }
    }
  }
  return suggestions.slice(0, 8);
});
const searchPanelItems = computed<SearchPanelItem[]>(() => {
  const query = sidebarQuery.value.trim();
  if (!query)
    return searchHistory.value.map((term) => ({ type: "history", term }));
  return [
    { type: "search", term: query },
    ...searchSuggestions.value.map(
      (suggestion): SearchPanelItem => ({ type: "suggestion", suggestion }),
    ),
  ];
});
const searchPanelVisible = computed(
  () => searchFocused.value && searchPanelItems.value.length > 0,
);

function saveSearchHistory() {
  try {
    window.localStorage.setItem(
      SEARCH_HISTORY_KEY,
      JSON.stringify(searchHistory.value),
    );
  } catch {
    // 私有模式或受限环境下 localStorage 不可用，忽略即可。
  }
}

function recordSearch(term: string) {
  const query = term.trim();
  if (!query) return;
  searchHistory.value = [
    query,
    ...searchHistory.value.filter((item) => item !== query),
  ].slice(0, MAX_SEARCH_HISTORY);
  saveSearchHistory();
}

function clearSearchHistory() {
  searchHistory.value = [];
  saveSearchHistory();
}

function closeSearchPanel() {
  searchFocused.value = false;
  highlightIndex.value = -1;
}

function openSearchPage(term: string) {
  const query = term.trim();
  if (!query) return;
  recordSearch(query);
  closeSearchPanel();
  router.push({ name: "search", query: { q: query } });
}

function selectSuggestion(suggestion: SearchSuggestion) {
  if (!suggestion.sectionId) return;
  recordSearch(sidebarQuery.value);
  closeSearchPanel();
  emit("selectSection", suggestion.sectionId);
}

function handleSearchPanelClick(item: SearchPanelItem) {
  if (item.type === "suggestion") selectSuggestion(item.suggestion);
  else openSearchPage(item.term);
}

function searchPanelKindLabel(item: SearchPanelItem) {
  if (item.type === "search") return "搜索";
  if (item.type === "history") return "历史";
  if (item.suggestion.kind === "chapter") return "章";
  if (item.suggestion.kind === "section") return "节";
  return "点";
}

function searchPanelLabel(item: SearchPanelItem) {
  return item.type === "suggestion" ? item.suggestion.title : item.term;
}

function searchPanelItemKey(item: SearchPanelItem) {
  return item.type === "suggestion"
    ? `suggestion:${item.suggestion.id}`
    : `${item.type}:${item.term}`;
}

function onSearchFocusout(event: FocusEvent) {
  const next = event.relatedTarget;
  if (next instanceof Node && searchBoxRef.value?.contains(next)) return;
  closeSearchPanel();
}

function onSearchKeydown(event: KeyboardEvent) {
  const items = searchPanelItems.value;
  if (event.key === "Enter") {
    event.preventDefault();
    const highlighted =
      highlightIndex.value >= 0 ? items[highlightIndex.value] : undefined;
    if (highlighted?.type === "suggestion")
      selectSuggestion(highlighted.suggestion);
    else if (highlighted) openSearchPage(highlighted.term);
    else openSearchPage(sidebarQuery.value);
    return;
  }
  if (event.key === "Escape") {
    event.preventDefault();
    closeSearchPanel();
    return;
  }
  if (!items.length) return;
  if (event.key === "ArrowDown") {
    event.preventDefault();
    highlightIndex.value =
      highlightIndex.value >= items.length - 1 ? 0 : highlightIndex.value + 1;
  } else if (event.key === "ArrowUp") {
    event.preventDefault();
    highlightIndex.value =
      highlightIndex.value <= 0 ? items.length - 1 : highlightIndex.value - 1;
  }
}

function chooseBook(id: string) {
  bookMenuOpen.value = false;
  if (id !== props.bookId) emit("selectBook", id);
}

function onBookMenuFocusout(event: FocusEvent) {
  const next = event.relatedTarget;
  if (next instanceof Node && bookMenuRef.value?.contains(next)) return;
  bookMenuOpen.value = false;
}

watch(
  () => props.open,
  (open) => {
    if (open) return;
    closeSearchPanel();
    bookMenuOpen.value = false;
  },
);
</script>

<template>
  <ReaderDrawer
    side="left"
    :width="304"
    :open="open"
    :pinned="pinned"
    trigger-label="悬停展开书籍目录"
    pin-label="书籍目录"
    @hover="emit('hover', $event)"
    @pin="emit('pin', $event)"
  >
    <template #header><BrandLogo /></template>

    <section class="shrink-0 border-b border-[#d8e0eb] px-5 pb-5 pt-5">

      <div
        ref="searchBoxRef"
        class="relative mb-5 block"
        @focusout="onSearchFocusout"
        @pointerenter="warmSearch"
      >
        <span class="sr-only">搜索知识目录</span>
        <svg
          class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="6.5" />
          <path d="m16 16 4 4" />
        </svg>
        <input
          v-model="sidebarQuery"
          type="search"
          class="h-10 w-full rounded-xl border border-[#d5deea] bg-white pl-9 pr-3 text-[13px] outline-none transition placeholder:text-slate-400 hover:border-[#aebbd0] focus:border-[#6686c7]"
          placeholder="搜索知识点（回车前往搜索页）"
          autocomplete="off"
          spellcheck="false"
          @focus="
            searchFocused = true;
            warmSearch();
          "
          @input="highlightIndex = -1"
          @keydown="onSearchKeydown"
        />
        <div
          v-if="searchPanelVisible"
          class="search-panel"
          role="listbox"
          aria-label="搜索建议"
        >
          <div v-if="!sidebarQuery.trim()" class="search-panel-head">
            <span>搜索历史</span>
            <button
              type="button"
              class="search-panel-clear"
              @click="clearSearchHistory"
            >
              清空
            </button>
          </div>
          <ul class="m-0 list-none p-1">
            <li
              v-for="(item, index) in searchPanelItems"
              :key="searchPanelItemKey(item)"
              role="option"
              :aria-selected="highlightIndex === index"
            >
              <button
                type="button"
                class="search-panel-item"
                :class="highlightIndex === index ? 'is-highlighted' : ''"
                @mousedown.prevent
                @click="handleSearchPanelClick(item)"
              >
                <span class="search-panel-kind" aria-hidden="true">{{
                  searchPanelKindLabel(item)
                }}</span>
                <span class="min-w-0 flex-1">
                  <span class="block truncate">{{
                    searchPanelLabel(item)
                  }}</span>
                  <span
                    v-if="item.type === 'suggestion' && item.suggestion.context"
                    class="block truncate text-[11px] text-[#93a0b4]"
                    >{{ item.suggestion.context }}</span
                  >
                </span>
              </button>
            </li>
          </ul>
        </div>
      </div>

      <p
        class="mb-2 mt-0 text-[11px] font-semibold tracking-[.08em] text-slate-500"
      >
        选择书籍
      </p>
      <div
        ref="bookMenuRef"
        class="relative min-w-0"
        @focusout="onBookMenuFocusout"
      >
        <button
          type="button"
          class="flex w-full justify-between cursor-pointer items-center gap-1 border-0 bg-transparent py-0 text-left text-[20px] font-semibold tracking-[-.03em] text-[#071225] outline-none"
          aria-haspopup="listbox"
          :aria-expanded="bookMenuOpen"
          @click="bookMenuOpen = !bookMenuOpen"
        >
          <span class="min-w-0 flex-1 truncate">{{ currentBookTitle }}</span>
          <span
            class="pointer-events-none text-xs text-slate-400 transition-transform duration-200"
            :class="bookMenuOpen ? 'hidden' : ''"
            aria-hidden="true"
            >⌄</span
          >
        </button>
        <div
          class="book-menu"
          :class="bookMenuOpen ? 'is-open' : ''"
          role="listbox"
          aria-label="选择教材"
        >
          <ul
            class="book-menu-inner m-0 list-none"
            :class="bookMenuOpen ? 'is-open' : ''"
          >
            <li
              v-for="item in books"
              :key="item.id"
              role="option"
              :aria-selected="item.id === bookId"
            >
              <button
                type="button"
                class="block w-full px-3 py-2 text-left text-sm transition-colors"
                :class="
                  item.id === bookId
                    ? 'bg-[#e6eefb] font-semibold text-[#12327f]'
                    : 'text-slate-600 hover:bg-[#f2f5f9] hover:text-[#071225]'
                "
                @click="chooseBook(item.id)"
              >
                {{ item.title }}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <KnowledgeSidebar
      v-if="book"
      class="min-h-0 flex-1"
      :chapters="book.chapters"
      :active-section-id="activeSectionId"
      :open="open"
      :query="sidebarQuery"
      @select-section="emit('selectSection', $event)"
    />
    <div v-else class="px-5 py-10 text-sm text-slate-500">
      正在建立知识目录…
    </div>
  </ReaderDrawer>
</template>

<style scoped>
.book-menu {
  display: grid;
  grid-template-rows: 0fr;
  opacity: 0;
  visibility: hidden;
  transition:
    grid-template-rows 0.35s ease,
    opacity 0.3s ease,
    visibility 0s linear 0.35s;
}
.book-menu.is-open {
  grid-template-rows: 1fr;
  opacity: 1;
  visibility: visible;
  transition-delay: 0s;
}
.book-menu-inner {
  min-height: 0;
  overflow: hidden;
  margin-top: 0;
  padding: 0;
  border: 0 solid #d8e0eb;
  background: #fff;
}
.book-menu-inner.is-open {
  margin-top: 6px;
  padding: 6px;
  border-width: 1px;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.12);
}
.search-panel {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  z-index: 40;
  overflow: hidden;
  border: 1px solid #d8e0eb;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 14px 40px rgba(15, 23, 42, 0.16);
}
.search-panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px 4px;
  color: #8a97ad;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
}
.search-panel-clear {
  color: #31559e;
  font-size: 12px;
  font-weight: 600;
}
.search-panel-clear:hover {
  color: #12327f;
}
.search-panel-item {
  display: flex;
  width: 100%;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 8px;
  color: #33415c;
  text-align: left;
  font-size: 13px;
  transition: background-color 0.12s ease;
}
.search-panel-item.is-highlighted {
  background: #eef3fb;
  color: #0f1f3d;
}
.search-panel-kind {
  flex: none;
  min-width: 34px;
  padding: 2px 6px;
  border-radius: 999px;
  background: #eef2f8;
  color: #64748b;
  font-size: 10px;
  font-weight: 700;
  text-align: center;
}
.search-panel-item.is-highlighted .search-panel-kind {
  background: #dbe7fb;
  color: #31559e;
}
</style>
