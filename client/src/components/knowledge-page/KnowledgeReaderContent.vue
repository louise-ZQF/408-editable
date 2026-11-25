<script setup lang="ts">
import InlineTitle from '@/editor/InlineTitle.vue'
import { addInlineArticle, inlineAction, inlineMode } from '@/editor/inline'
import { openEditor } from '@/editor/store'
import { Search } from '@element-plus/icons-vue'
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
    class="min-w-0 px-[clamp(18px,4vw,52px)] pb-24 pt-[clamp(25px,4vw,52px)]"
  >
    <div class="mx-auto max-w-[900px]">
      <div
        class="min-h-[min(68vh,620px)] min-w-0 bg-white"
      >
        <div
          v-if="error"
          class="border-l-[3px] border-orange-400 bg-orange-50 px-5 py-4 text-orange-800"
        >
          {{ error }}
        </div>
        <template v-else-if="section">
          <header
            class="mb-6 flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-[#e6ecf4] pb-4 sm:mb-8 sm:gap-x-4 sm:pb-6"
          >
            <h1
              class="m-0 min-w-0 text-[clamp(1.85rem,4vw,2.6rem)] font-bold leading-tight tracking-[-.038em] text-[#101a2d]"
            >
              <InlineTitle :title="section.title" :node-id="section.id" />
            </h1>
            <RouterLink
              v-if="sectionExam.examCount"
              :to="{
                name: 'exams',
                query: { knowledgeBlockIds: sectionExam.blockIds.join(',') },
              }"
              class="group inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-[#eef4fd] px-2.5 text-[12px] font-semibold text-[#2e5596] transition-colors hover:bg-[#e4edf9]"
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
            <RouterLink
              :to="{ name: 'search' }"
              aria-label="全站搜索"
              class="ml-auto inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center gap-1.5 rounded-lg px-2.5 text-[13px] font-semibold text-[#31559e] transition-colors hover:bg-[#eef4ff] focus-visible:outline-2 focus-visible:outline-[#2855bf]"
            >
              <Search class="h-4 w-4" aria-hidden="true" />
              <span class="hidden sm:inline">全站搜索</span>
            </RouterLink>
          </header>

          <div data-testid="knowledge-article-column" class="min-w-0">
            <section
              v-for="entry in articleEntries"
              :key="entry.point.id"
              class="min-w-0 border-t border-[#e6ecf4] py-10 first:border-t-0 first:pt-0 sm:py-12"
            >
              <header
                :id="`article-${entry.point.id}`"
                class="mb-7 scroll-mt-24 sm:mb-8"
              >
                <h2
                  class="m-0 text-[clamp(1.4rem,2.65vw,2rem)] font-semibold leading-tight tracking-[-.027em] text-[#101a2d]"
                >
                  <InlineTitle :title="entry.point.title" :node-id="entry.point.id" />
                </h2>
              </header>
              <KnowledgeArticle
                :article="entry.article"
                :editable="inlineMode"
                :exam-links="entry.examLinks"
              />
            </section>
            <button v-if="inlineMode" class="inline-add-subpoint" @click="inlineAction(() => addInlineArticle(section!.id))">＋ 添加文章</button>
          </div>
        </template>
        <div v-else-if="!loading" class="personal-empty-reader"><div><p class="mb-5">当前教材还没有页面，你可以从内容管理中添加。</p><button @click="openEditor()">打开内容管理</button></div></div>
        <div v-else-if="loading" role="status" class="py-24 text-center text-sm text-slate-600">
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
