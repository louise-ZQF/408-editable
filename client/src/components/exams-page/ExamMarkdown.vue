<script setup lang="ts">
import { computed } from "vue";
import DOMPurify from "dompurify";
import katex from "katex";
import { marked } from "marked";

const props = defineProps<{ source?: string; inline?: boolean }>();

const html = computed(() => {
  const rendered = marked.parse(props.source || "", {
    async: false,
    breaks: true,
    gfm: true,
  });

  // 给绝对路径 <img src="/..."> 拼上 Vite base，修复 GitHub Pages 二级目录下图片 404
  const withBase = rewriteImgSrc(rendered as string);

  const sanitized = DOMPurify.sanitize(withBase, {
    FORBID_ATTR: ["class", "id", "style"],
    FORBID_TAGS: [
      "button",
      "embed",
      "form",
      "iframe",
      "input",
      "object",
      "script",
      "style",
    ],
    USE_PROFILES: { html: true },
  });

  return renderMath(sanitized as string);
});

/** 把 markdown 渲染出的 <img src="/xxx"> 改成 BASE_URL + /xxx，适配二级目录部署 */
function rewriteImgSrc(html: string): string {
  const base = import.meta.env.BASE_URL ?? "/";
  if (!base || base === "/") return html;
  return html.replace(/(<img\s+[^>]*?src=["'])\/(?!\/)/gi, `$1${base}`);
}

function renderMath(html: string): string {
  const mathPattern =
    /\$\$([\s\S]*?)\$\$|\\\[([\s\S]*?)\\\]|\$([^$\n]+?)\$|\\\(([\s\S]*?)\\\)/g;

  return html.replace(
    mathPattern,
    (
      _,
      displayDollar: string | undefined,
      displayBracket: string | undefined,
      inlineDollar: string | undefined,
      inlineParen: string | undefined,
    ) => {
      const formulaHtml =
        displayDollar ?? displayBracket ?? inlineDollar ?? inlineParen ?? "";
      const displayMode =
        displayDollar !== undefined || displayBracket !== undefined;
      const formula = extractFormulaText(formulaHtml);

      try {
        return katex.renderToString(formula, {
          displayMode,
          throwOnError: false,
          trust: false,
        });
      } catch {
        return `<code>公式错误: ${escapeHtml(formula)}</code>`;
      }
    },
  );
}

function extractFormulaText(formulaHtml: string): string {
  const normalized = formulaHtml.replace(/<br\s*\/?>/gi, "\n");
  const container = document.createElement("div");
  container.innerHTML = normalized;
  return (container.textContent ?? "").trim();
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
</script>

<template>
  <component
    :is="inline ? 'span' : 'div'"
    :class="[
      'code-lined-markdown min-w-0 text-[#27364b] [&_a]:font-semibold [&_a]:text-[#12327f] [&_a]:underline [&_a]:decoration-[#b8c8e5] [&_a]:underline-offset-4 hover:[&_a]:text-[#071f56] [&_blockquote]:m-0 [&_blockquote]:border-l-[3px] [&_blockquote]:border-[#9aadd0] [&_blockquote]:bg-[#f7f9fc] [&_blockquote]:px-5 [&_blockquote]:py-3 [&_code]:rounded-sm [&_code]:bg-slate-100 [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[.88em] [&_code]:text-[#071225] [&_del]:text-slate-400 [&_em]:italic [&_h1]:m-0 [&_h1]:text-2xl [&_h1]:font-semibold [&_h1]:leading-tight [&_h1]:text-[#071225] [&_h2]:m-0 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:leading-tight [&_h2]:text-[#071225] [&_h3]:m-0 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-[#071225] [&_h4]:m-0 [&_h4]:text-lg [&_h4]:font-semibold [&_h4]:text-[#071225] [&_hr]:my-6 [&_hr]:border-0 [&_hr]:border-t [&_hr]:border-[#dce3ec] [&_img]:mx-auto [&_img]:my-7 [&_img]:block [&_img]:h-auto [&_img]:max-h-[72vh] [&_img]:max-w-full [&_li]:my-1.5 [&_li_p]:m-0 [&_ol]:my-0 [&_ol]:list-decimal [&_ol]:pl-7 [&_p]:m-0 [&_pre]:m-0 [&_pre]:font-mono [&_pre]:text-base [&_pre]:leading-8 [&_strong]:font-semibold [&_strong]:text-[#071225] [&_table]:w-full [&_table]:border-separate [&_table]:border-spacing-0 [&_table]:overflow-hidden [&_table]:rounded-[4px] [&_table]:border [&_table]:border-[#dce3ec] [&_table]:text-[16px] [&_td]:border-b [&_td]:border-r [&_td]:border-[#dce3ec] [&_td]:px-4 [&_td]:py-3 [&_th]:border-b [&_th]:border-r [&_th]:border-[#dce3ec] [&_th]:bg-[#f2f5f9] [&_th]:px-4 [&_th]:py-3 [&_th]:text-left [&_th]:font-semibold [&_th]:text-[#071225] [&_tr:last-child_td]:border-b-0 [&_th:last-child]:border-r-0 [&_td:last-child]:border-r-0 [&_ul]:my-0 [&_ul]:list-disc [&_ul]:pl-7',
      inline ? 'text-[17px] leading-8' : 'space-y-6 text-[19px] leading-[2]',
    ]"
    v-html="html"
  ></component>
</template>

<style scoped>
.code-lined-markdown :deep(pre) {
  margin: 0;
  overflow-x: auto;
  border: 1px solid #e6e9ee;
  border-radius: 4px;
  background: #f4f6f9;
  padding: 1rem 1.25rem;
  color: #24292f;
  line-height: 1.65;
  font-family:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono",
    monospace;
}

.code-lined-markdown :deep(pre > code) {
  display: block;
  min-width: max-content;
  border-radius: 0;
  background: transparent;
  padding: 0;
  color: inherit;
}
</style>
