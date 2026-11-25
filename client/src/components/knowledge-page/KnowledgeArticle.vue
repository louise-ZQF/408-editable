<script setup lang="ts">
import InlineBlock from '@/editor/InlineBlock.vue';
import InlineTitle from '@/editor/InlineTitle.vue';
import InlineAddContent from '@/editor/InlineAddContent.vue';
import { inlineMode, inlineAction, addInlineSubpoint, deleteInlineSubpoint } from '@/editor/inline';
import { computed, defineAsyncComponent } from "vue";
import katex from "katex";
import DOMPurify from "dompurify";
import { renderRichHTML } from '@/editor/richText';
import KnowledgeMarkdown from "./KnowledgeMarkdown.vue";
const ManimCodePlayer = defineAsyncComponent(() => import("./ManimCodePlayer.vue"));
import type { KnowledgeArticleData } from "@/content/knowledge-articles/types";
import type { ExamKnowledgeLink } from "@/types";

const props = withDefaults(
  defineProps<{
    article: KnowledgeArticleData;
    examLinks: ExamKnowledgeLink[];
    editable?: boolean;
  }>(),
  { examLinks: () => [], editable: false },
);

type SubpointExamSummary = {
  blockIds: string[];
  examCount: number;
};

/**
 * 后端仍把真题关联到最小的 block；展示层把同一 subpoint 下的关联向上聚合。
 * 一道题即使同时关联多个 block，也只计数一次。
 */
const subpointExamSummaries = computed<Record<string, SubpointExamSummary>>(
  () => {
    const summaries: Record<string, SubpointExamSummary> = {};

    for (const subpoint of props.article.subpoints) {
      const subpointBlockIds = new Set(
        subpoint.blocks.map((block) => block.id),
      );
      const linkedBlockIds = new Set<string>();
      const linkedExamIds = new Set<string>();

      for (const link of props.examLinks) {
        if (!subpointBlockIds.has(link.knowledgeBlockId)) continue;
        linkedBlockIds.add(link.knowledgeBlockId);
        linkedExamIds.add(link.examId);
      }

      if (linkedExamIds.size) {
        summaries[subpoint.id] = {
          blockIds: [...linkedBlockIds],
          examCount: linkedExamIds.size,
        };
      }
    }

    return summaries;
  },
);

function renderFormula(latex: string): string {
  try {
    return katex.renderToString(latex, {
      displayMode: true,
      throwOnError: false,
      trust: false,
    });
  } catch {
    return `<code class="text-red-600">公式渲染错误: ${latex.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code>`;
  }
}

function renderInlineMath(text: string): string {
  // Render $...$ and $$...$$ in callout/plain text
  return text
    .replace(/\$\$([^$]+)\$\$/g, (_, f: string) => {
      try {
        return katex.renderToString(f.trim(), {
          displayMode: true,
          throwOnError: false,
          trust: false,
        });
      } catch {
        return `$$${f}$$`;
      }
    })
    .replace(/\$([^$]+)\$/g, (_, f: string) => {
      try {
        return katex.renderToString(f.trim(), {
          displayMode: false,
          throwOnError: false,
          trust: false,
        });
      } catch {
        return `$${f}$`;
      }
    });
}
</script>

<template>
  <article class="min-w-0 space-y-5">
    <section
      v-for="(subpoint, index) in article.subpoints"
      :id="subpoint.id"
      :key="subpoint.id"
      class="min-w-0 scroll-mt-28 border-t border-[#e6ecf4] pb-4 pt-8 first:border-t-0 first:pt-0 sm:pt-10"
    >
      <header class="mb-5 flex flex-wrap items-center gap-x-3 gap-y-1 sm:gap-x-5">
        <h3
          class="m-0 text-[clamp(1.15rem,2vw,1.45rem)] font-semibold leading-snug tracking-[-.023em] text-[#101a2d]"
        >
          <span class="mr-2.5 align-[.12em] font-mono text-[.59em] font-semibold text-[#42628e]">{{
            String(index + 1).padStart(2, "0")
          }}</span
          ><InlineTitle v-if="editable" :title="subpoint.title" :node-id="subpoint.id" kind="subpoint" :point-id="article.pointId || ''" /><template v-else>{{ subpoint.title }}</template>
        </h3>

        <RouterLink
          v-if="subpointExamSummaries[subpoint.id]"
          :to="{
            name: 'exams',
            query: {
              knowledgeBlockIds:
                subpointExamSummaries[subpoint.id].blockIds.join(','),
            },
          }"
          class="group inline-flex min-h-9 items-center gap-1.5 rounded-lg px-1.5 text-[12px] font-semibold text-[#31559e] transition-colors hover:bg-[#edf3fd]"
        >
          <span class="font-bold text-[#12327f]">{{
            subpointExamSummaries[subpoint.id].examCount
          }}</span>
          <span>道关联真题</span>
          <span
            class="transition-transform duration-150 group-hover:translate-x-0.5"
            aria-hidden="true"
            >→</span
          >
        </RouterLink>
        <button v-if="editable && inlineMode" class="inline-subpoint-delete" @click="inlineAction(() => deleteInlineSubpoint(article.pointId, subpoint.id))">删除小节</button>
      </header>

      <div class="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-6 sm:gap-7" :class="{ 'inline-drop-zone': editable && inlineMode }" :data-inline-drop-point="editable && inlineMode ? article.pointId : undefined" :data-inline-drop-subpoint="editable && inlineMode ? subpoint.id : undefined">
        <section
          v-for="(block, blockIndex) in subpoint.blocks"
          :id="block.id"
          :key="block.id"
          class="min-w-0 scroll-mt-28"
        >
          <InlineBlock :block="block" :point-id="article.pointId || ''" :subpoint-id="subpoint.id" :first="blockIndex === 0" :last="blockIndex === subpoint.blocks.length - 1" :enabled="editable">
          <KnowledgeMarkdown
            v-if="block.type === 'paragraph'"
            :source="block.text"
          />

          <div
            v-else-if="block.type === 'html'"
            class="rich-content max-w-full overflow-x-auto break-words text-[clamp(1rem,1.4vw,1.16rem)] leading-[1.88] text-[#2b394e] [&_h2]:mb-4 [&_h2]:mt-9 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-[#071225] [&_p]:my-5 [&_strong]:font-semibold [&_strong]:text-[#071225]"
            v-html="renderRichHTML(block.html)"
          ></div>

          <figure
            v-else-if="block.type === 'image'"
            class="m-0 overflow-hidden rounded-xl border border-[#e6ecf4] bg-white px-2 py-4 sm:px-4 sm:py-6"
          >
            <a v-if="block.fullWidth" :href="block.src" target="_blank" rel="noopener" :aria-label="'打开高清图：' + block.alt">
              <img :src="block.src" :alt="block.alt" class="mx-auto block h-auto w-full max-w-full" loading="lazy" />
            </a>
            <img
              v-else
              :src="block.src"
              :alt="block.alt"
              class="mx-auto block h-auto max-h-[60vh] max-w-full w-auto"
              loading="lazy"
            />
            <figcaption
              v-if="block.caption"
              class="mt-4 text-center text-[13px] leading-6 text-slate-500"
            >
              图 · {{ block.caption }}
            </figcaption>
          </figure>

          <figure
            v-else-if="block.type === 'formula'"
            class="m-0 max-w-full overflow-x-auto rounded-xl border border-[#e6ecf4] bg-white px-3 py-4 text-[17px] sm:px-6 sm:text-[19px]"
          >
            <div v-if="block.formula" v-html="renderFormula(block.formula)"></div>
            <p v-else class="m-0 min-h-8"><br /></p>
            <figcaption
              v-if="block.caption"
              class="mt-1 text-sm leading-7 text-slate-500"
            >
              {{ block.caption }}
            </figcaption>
          </figure>

          <aside
            v-else-if="block.type === 'callout'"
            class="rounded-xl border px-4 py-3.5 sm:px-5"
            :class="block.tone === 'blue' ? 'border-blue-100 bg-blue-50/60' : 'border-amber-100 bg-amber-50/60'"
          >
            <div class="flex items-center gap-2.5">
              <svg
                class="h-[18px] w-[18px] shrink-0"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <circle cx="10" cy="10" r="10" fill="#f59e0b" />
                <path
                  d="M10 5.5v5.5"
                  stroke="#fff"
                  stroke-width="1.9"
                  stroke-linecap="round"
                />
                <circle cx="10" cy="14.2" r="1.35" fill="#fff" />
              </svg>
              <strong class="text-[15px] font-bold leading-7 text-[#071225]">{{
                block.title
              }}</strong>
            </div>
            <p
              class="mb-0 mt-1 text-[17px] leading-8 text-slate-600"
              v-html="DOMPurify.sanitize(renderInlineMath(block.text))"
            ></p>
          </aside>

          <figure v-else-if="block.type === 'embed'" class="m-0 py-3"><iframe class="personal-embed" :title="block.title" :srcdoc="block.html" sandbox="allow-scripts" referrerpolicy="no-referrer"></iframe><figcaption class="mt-2 text-sm text-slate-500">{{ block.title }}</figcaption></figure>
          <figure v-else-if="block.type === 'animation'" class="m-0 py-3">
            <ManimCodePlayer v-if="block.animation.steps" :animation="block.animation" /><p v-else class="text-sm text-slate-500">动画引用未找到，请在内容管理中重新选择动画。</p>
          </figure>
          </InlineBlock>
        </section>
      </div>
      <InlineAddContent v-if="editable" :point-id="article.pointId || ''" :subpoint-id="subpoint.id" />
    </section>
    <button v-if="editable && inlineMode" class="inline-add-subpoint" @click="inlineAction(() => addInlineSubpoint(article.pointId))">＋ 添加小节</button>
  </article>
</template>
