<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";

export type ExamKnowledgeLinkItem = {
  key: string;
  title: string;
  href: string;
};

const props = withDefaults(
  defineProps<{
    open: boolean;
    linkedKnowledge: ExamKnowledgeLinkItem[];
    /** 选择题、已选中选项、尚未作答 → 菜单显示「提交答案」 */
    canSubmit: boolean;
    /** 答案与解析是否已加载 */
    hasAnswer: boolean;
    answerExpanded: boolean;
  }>(),
  {
    linkedKnowledge: () => [],
  },
);

const emit = defineEmits<{
  toggle: [];
  close: [];
  reveal: [];
  submit: [];
  toggleAnswer: [];
}>();

const root = ref<HTMLElement | null>(null);
const knowledgeExpanded = ref(false);

watch(
  () => props.open,
  (open) => {
    if (!open) knowledgeExpanded.value = false;
  },
);

function onClickOutside(event: MouseEvent) {
  if (!props.open) return;
  if (root.value && !root.value.contains(event.target as Node)) emit("close");
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === "Escape" && props.open) emit("close");
}

onMounted(() => {
  document.addEventListener("click", onClickOutside);
  document.addEventListener("keydown", onKeydown);
});
onBeforeUnmount(() => {
  document.removeEventListener("click", onClickOutside);
  document.removeEventListener("keydown", onKeydown);
});
</script>

<template>
  <div ref="root" class="relative">
    <button
      type="button"
      aria-label="题目工具"
      aria-haspopup="menu"
      :aria-expanded="open"
      class="inline-grid h-9 w-9 place-items-center rounded-[6px] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#8ea7d0]"
      :class="
        open
          ? 'bg-[#edf2fa] text-[#12327f]'
          : 'text-[#8b99b0] opacity-60 group-hover:opacity-100 group-focus-within:opacity-100 hover:bg-[#edf2fa] hover:text-[#12327f] focus-visible:opacity-100'
      "
      @click="emit('toggle')"
    >
      <span class="flex flex-col items-center gap-[3px]" aria-hidden="true">
        <i class="block h-[3px] w-[3px] rounded-full bg-current"></i>
        <i class="block h-[3px] w-[3px] rounded-full bg-current"></i>
        <i class="block h-[3px] w-[3px] rounded-full bg-current"></i>
      </span>
    </button>

    <Transition name="tools-pop">
      <div
        v-if="open"
        role="menu"
        aria-label="题目工具菜单"
        class="absolute right-0 top-10 z-30 w-48 origin-top-right rounded-[6px] border border-[#e2e8f0] bg-white py-1 shadow-[0_14px_38px_rgba(15,23,42,.12)]"
      >
        <!-- 关联知识：始终先展开子列表，再点击具体知识项跳转 -->
        <template v-if="linkedKnowledge.length">
          <button
            type="button"
            role="menuitem"
            :aria-expanded="knowledgeExpanded"
            class="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-[13px] font-medium text-[#334155] transition-colors hover:bg-[#f4f7fb] hover:text-[#12327f]"
            @click="knowledgeExpanded = !knowledgeExpanded"
          >
            <svg
              class="h-4 w-4 shrink-0 opacity-70"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              aria-hidden="true"
            >
              <path d="M7 6 3 10l4 4" />
              <path d="M13 6l4 4-4 4" />
              <path d="M11 3l-2 14" />
            </svg>
            关联子知识点
            <span
              class="ml-auto text-[#a3b0c3] transition-transform"
              :class="knowledgeExpanded ? 'rotate-90 -mr-0.5' : ''"
              aria-hidden="true"
              >▸</span
            >
          </button>
          <ul
            v-if="knowledgeExpanded"
            class="m-0 list-none border-t border-[#eef2f7] py-1 pl-9"
          >
            <li v-for="link in linkedKnowledge" :key="link.key">
              <a
                :href="link.href"
                class="block py-1.5 pr-2 text-[13px] leading-5 text-[#54698b] transition-colors hover:text-[#12327f]"
                >{{ link.title }}</a
              >
            </li>
          </ul>
        </template>

        <!-- 提交答案 -->
        <button
          v-if="canSubmit"
          type="button"
          role="menuitem"
          class="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-[13px] font-medium text-[#334155] transition-colors hover:bg-[#f4f7fb] hover:text-[#12327f]"
          @click="emit('submit')"
        >
          <svg
            class="h-4 w-4 shrink-0 opacity-70"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            aria-hidden="true"
          >
            <path d="m4 10 4 4 8-8" />
          </svg>
          提交答案
        </button>

        <!-- 答案与解析 / 收起答案 -->
        <button
          v-if="hasAnswer"
          type="button"
          role="menuitem"
          class="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-[13px] font-medium text-[#334155] transition-colors hover:bg-[#f4f7fb] hover:text-[#12327f]"
          @click="emit('toggleAnswer')"
        >
          <svg
            class="h-4 w-4 shrink-0 opacity-70"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            aria-hidden="true"
          >
            <path
              d="M5 3h10a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"
            />
            <path d="M8 7h4M8 10h4" />
          </svg>
          {{ answerExpanded ? "收起答案" : "展开答案" }}
        </button>
        <button
          v-else
          type="button"
          role="menuitem"
          class="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-[13px] font-medium text-[#334155] transition-colors hover:bg-[#f4f7fb] hover:text-[#12327f]"
          @click="emit('reveal')"
        >
          <svg
            class="h-4 w-4 shrink-0 opacity-70"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            aria-hidden="true"
          >
            <path
              d="M5 3h10a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"
            />
            <path d="M8 7h4M8 10h4" />
          </svg>
          答案与解析
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.tools-pop-enter-active,
.tools-pop-leave-active {
  transition:
    opacity 0.16s ease,
    transform 0.16s ease;
}
.tools-pop-enter-from,
.tools-pop-leave-to {
  opacity: 0;
  transform: scale(0.97) translateY(-3px);
}
</style>
