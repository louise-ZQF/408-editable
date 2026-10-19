<script setup lang="ts">
import type { Exam } from "@/types";
import ReaderDrawer from "@/components/ReaderDrawer.vue";

defineProps<{
  activeExamId: string;
  currentFilterText: string;
  exams: Exam[];
  open: boolean;
  pinned: boolean;
}>();

const emit = defineEmits<{
  hover: [hovered: boolean];
  pin: [pinned: boolean];
  select: [examId: string];
}>();
</script>

<template>
  <ReaderDrawer
    side="right"
    :width="244"
    :open="open"
    :pinned="pinned"
    surface-class="bg-[#f7f9fc]"
    trigger-label="悬停展开题目目录"
    pin-label="题目目录"
    @hover="emit('hover', $event)"
    @pin="emit('pin', $event)"
  >
    <template #header>
      <div>
        <p
          class="mb-1.5 mt-0 text-[10px] font-semibold tracking-[.08em] text-slate-400"
        >
          当前筛选
        </p>
        <h2
          class="m-0 max-w-[160px] text-[15px] font-semibold leading-6 tracking-[-.02em]"
        >
          {{ currentFilterText }}
        </h2>
      </div>
    </template>
    <ol
      class="m-0 h-[calc(100vh-86px)] list-none space-y-1 overflow-y-auto px-3 py-4"
    >
      <li v-for="exam in exams" :key="exam.id">
        <button
          type="button"
          class="flex w-full items-baseline justify-between gap-3 border-l-2 px-3 py-3 text-left transition hover:bg-white"
          :class="
            activeExamId === exam.id
              ? 'border-[#12327f] bg-white text-[#12327f]'
              : 'border-transparent text-slate-500 hover:text-[#071225]'
          "
          @click="emit('select', exam.id)"
        >
          <span class="font-mono text-[11px] font-semibold tracking-[.04em]">{{
            exam.year
          }}</span>
          <span class="text-[13px] font-semibold">第 {{ exam.number }} 题</span>
        </button>
      </li>
    </ol>
  </ReaderDrawer>
</template>
