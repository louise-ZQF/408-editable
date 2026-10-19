<script setup lang="ts">
import { highlightText } from "@/search/composables/useSearch";
import type { SearchResult } from "@/search/types";

defineProps<{
  loading: boolean;
  page: number;
  pageSize: number;
  query: string;
  results: SearchResult[];
  total: number;
  totalPages: number;
}>();

const emit = defineEmits<{
  select: [result: SearchResult];
  page: [page: number];
}>();
</script>

<template>
  <main class="w-full max-w-[1080px] mx-auto px-5 py-[42px] pb-16">
    <div v-if="loading" class="py-20 flex flex-col items-center gap-4">
      <div class="spinner"></div>
      <div class="text-[#7587a8] text-sm">正在检索…</div>
    </div>

    <template v-else-if="query">
      <section class="mb-[22px]">
        <h1 class="m-0 mb-2 text-[30px] leading-[1.25] tracking-[-0.02em]">
          “<span class="text-[#2259d6]">{{ query }}</span
          >” 的搜索结果
        </h1>
        <div v-if="total" class="text-sm text-[#7587a8]">
          共 {{ total }} 条相关内容
        </div>
      </section>

      <section
        v-if="total"
        class="border border-[#e4eaf2] rounded-[14px] overflow-hidden bg-white"
      >
        <article
          v-for="(result, index) in results"
          :key="result.route"
          class="result-item relative px-[26px] py-[18px] pr-14 border-b border-[#e4eaf2] last:border-b-0 transition-colors duration-150 hover:bg-[#f7f9fd] cursor-pointer max-[820px]:pl-[18px] max-[820px]:pr-[42px]"
          :style="{ '--delay': index * 80 + 'ms' }"
          @click="emit('select', result)"
        >
          <div class="text-xs text-[#7082a1] mb-1.5 flex items-center gap-2">
            <span
              v-if="result.type === 'exam'"
              class="inline-block px-[7px] py-[1px] rounded-[4px] bg-[#fff1e0] text-[#c25700] text-[11px] font-semibold leading-[1.5]"
              >真题</span
            >{{ result.subtitle }}
          </div>
          <h2
            v-if="result.type === 'knowledge'"
            class="m-0 mb-[5px] text-[17px] leading-[1.35]"
            v-html="highlightText(result.title, query)"
          ></h2>
          <h2 v-else class="m-0 mb-[5px] text-[17px] leading-[1.35]">
            {{ result.title }}
          </h2>
          <p
            v-if="result.snippet"
            class="m-0 text-[#445675] text-sm leading-[1.65] line-clamp-2 overflow-hidden"
            v-html="highlightText(result.snippet, query)"
          ></p>
          <span
            class="absolute right-6 top-1/2 -translate-y-1/2 text-2xl text-[#153a72]"
            >›</span
          >
        </article>
      </section>

      <div v-else class="py-20 text-center text-[#7587a8]">
        <p class="m-0 mb-2 text-base">未找到匹配结果</p>
        <p class="m-0 text-[13px] text-[#9aa9c3]">
          试试更精准的关键词，或换个角度描述
        </p>
      </div>

      <div
        v-if="total > pageSize"
        class="flex justify-center gap-2.5 my-5 mb-2.5"
      >
        <button
          :disabled="page === 1"
          class="page-button"
          @click="emit('page', page - 1)"
        >
          ‹
        </button>
        <button
          v-for="pageNumber in totalPages"
          :key="pageNumber"
          class="page-button"
          :class="pageNumber === page ? 'is-active' : ''"
          @click="emit('page', pageNumber)"
        >
          {{ pageNumber }}
        </button>
        <button
          :disabled="page === totalPages"
          class="page-button"
          @click="emit('page', page + 1)"
        >
          ›
        </button>
      </div>
    </template>

    <div v-else class="py-20 text-center text-[#7587a8]">
      <p class="m-0 text-base">在上方搜索框输入关键词开始搜索</p>
    </div>
  </main>
</template>

<style scoped>
:deep(.hit),
:deep(mark) {
  color: #b04a00;
  font-weight: 700;
  background: #fff09a;
  padding: 0 3px;
  border-radius: 3px;
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
}
.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e4eaf2;
  border-top-color: #2259d6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.result-item {
  opacity: 0;
  transform: translateY(-8px);
  animation: result-in 0.8s ease-out forwards;
  animation-delay: var(--delay, 0ms);
}
@keyframes result-in {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.page-button {
  width: 34px;
  height: 34px;
  border: 1px solid #dfe6ef;
  border-radius: 999px;
  background: #fff;
  color: #50627f;
  cursor: pointer;
  font-size: 14px;
  transition:
    border-color 0.15s,
    color 0.15s,
    background-color 0.15s;
}
.page-button:hover {
  border-color: #2259d6;
  color: #2259d6;
}
.page-button.is-active {
  border-color: #2259d6;
  background: #2259d6;
  color: #fff;
}
.page-button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
