<script setup lang="ts">
import InlineTitle from '@/editor/InlineTitle.vue'
import { addInlineArticle, inlineAction, inlineMode } from '@/editor/inline'
import { openEditor } from '@/editor/store'
import type { Section } from "@/types";
import ReaderPageNavigation from "@/components/ReaderPageNavigation.vue";
import KnowledgeArticle from "./KnowledgeArticle.vue";
import type { SectionArticleEntry, SectionExamSummary } from "./pageTypes";

defineProps<{
  articleEntries: SectionArticleEntry[];
  error: string;
  loading: boolean;
  page: number;
  section?: Section;
  sectionExam: SectionExamSummary;
  totalPages: number;
}>();

const emit = defineEmits<{ page: [page: number] }>();
</script>

<template>
  <main
    class="min-w-0 px-[clamp(12px,3vw,46px)] pb-24 pt-[clamp(12px,3vw,38px)] transition-[padding] duration-500 ease-[cubic-bezier(.22,1,.36,1)]"
  >
    <div class="mx-auto max-w-[1180px]">
      <div
        class="mx-auto min-h-[calc(100vh-32px)] max-w-[1180px] border border-[#d9e1eb] bg-white px-[clamp(24px,5vw,76px)] pb-24 pt-[clamp(34px,5vw,66px)] shadow-[0_24px_80px_rgba(25,39,61,.07)] max-sm:px-5"
      >
        <div
          v-if="error"
          class="border-l-[3px] border-orange-400 bg-orange-50 px-5 py-4 text-orange-800"
        >
          {{ error }}
        </div>
        <template v-else-if="section">
          <header
            class="mb-10 border-b border-[#dce3ec] pb-7 flex items-baseline gap-4"
          >
            <h1
              class="m-0 text-[clamp(1.7rem,3vw,2.25rem)] font-semibold leading-tight tracking-[-.045em] text-[#071225]"
            >
              <InlineTitle :title="section.title" :node-id="section.id" />
            </h1>
            <RouterLink
              v-if="sectionExam.examCount"
              :to="{
                name: 'exams',
                query: { knowledgeBlockIds: sectionExam.blockIds.join(',') },
              }"
              class="group mt-3 inline-flex items-baseline gap-1.5 border-b border-[#8ea7d9] pb-0.5 text-[13px] font-semibold tracking-wide text-[#31559e] transition-colors hover:border-[#12327f] hover:text-[#12327f]"
            >
              <span class="font-bold text-[#12327f]">{{
                sectionExam.examCount
              }}</span>
              <span>道关联真题</span>
              <span
                class="transition-transform duration-150 group-hover:translate-x-0.5"
                aria-hidden="true"
                >→</span
              >
            </RouterLink>
          </header>

          <div data-testid="knowledge-article-column" class="min-w-0">
            <section
              v-for="(entry, index) in articleEntries"
              :key="entry.point.id"
              class="border-t border-[#dce3ec] py-16 first:border-t-0 first:pt-0"
            >
              <header
                :id="`article-${entry.point.id}`"
                class="mb-10 scroll-mt-16"
              >
                <h2
                  class="m-0 text-[clamp(2.15rem,4vw,3.1rem)] font-semibold leading-tight tracking-[-.055em] text-[#071225]"
                >
                  <span
                    class="mb-2 block font-mono text-[.34em] font-bold tracking-[.16em] text-[#31559e]"
                    >ARTICLE {{ String(index + 1).padStart(2, "0") }}</span
                  >
                  <InlineTitle :title="entry.point.title" :node-id="entry.point.id" />
                </h2>
              </header>
              <button class="mb-5 rounded-md border border-[#d7e0ee] px-3 py-2 text-xs text-[#54729e] hover:bg-[#f3f6fc]" @click="inlineMode = true">显示文章增删工具</button>
              <KnowledgeArticle
                :article="entry.article"
                :editable="true"
                :exam-links="entry.examLinks"
              />
            </section>
            <button v-if="inlineMode" class="inline-add-subpoint" @click="inlineAction(() => addInlineArticle(section!.id))">＋ 添加文章</button>
          </div>
        </template>
        <div v-else-if="!loading" class="personal-empty-reader"><div><p class="mb-5">当前教材还没有页面，你可以从内容管理中添加。</p><button @click="openEditor()">打开内容管理</button></div></div>
        <div v-else-if="loading" class="py-24 text-center text-sm text-slate-500">
          知识内容正在加载…
        </div>
      </div>
      <ReaderPageNavigation
        v-if="section && !error"
        :page="page"
        :total-pages="totalPages"
        :disabled="loading"
        @page="emit('page', $event)"
      />
    </div>
  </main>
</template>
