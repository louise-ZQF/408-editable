<script setup lang="ts">
import { ref, watch } from "vue";
import type { Exam } from "@/types";
import ReaderPageNavigation from "@/components/ReaderPageNavigation.vue";
import ExamPaperItem from "./ExamPaperItem.vue";

const props = defineProps<{
  error: string;
  exams: Exam[];
  loading: boolean;
  page: number;
  totalPages: number;
}>();

const emit = defineEmits<{ page: [page: number] }>();
const openToolsId = ref("");

watch(
  () => props.loading,
  (loading) => {
    if (loading) openToolsId.value = "";
  },
);

function changePage(page: number) {
  if (
    props.loading ||
    page < 1 ||
    page > props.totalPages ||
    page === props.page
  ) return;
  openToolsId.value = "";
  emit("page", page);
}
</script>

<template>
  <div class="min-w-0">
    <main
      class="mx-auto max-w-[1200px] px-[clamp(12px,3vw,40px)] pb-24 pt-[clamp(12px,3vw,38px)]"
    >
      <p
        v-if="error"
        class="border-l-[3px] border-red-500 bg-red-50 px-4 py-3 text-sm text-red-700"
      >
        {{ error }}
      </p>

      <section
        class="bg-white px-[clamp(22px,6vw,82px)] shadow-[0_22px_70px_rgba(25,39,61,.06)]"
      >
        <ExamPaperItem
          v-for="exam in exams"
          :key="exam.id"
          :exam="exam"
          :menu-open="openToolsId === exam.id"
          @toggle-tools="openToolsId = openToolsId === exam.id ? '' : exam.id"
          @close-tools="
            openToolsId = openToolsId === exam.id ? '' : openToolsId
          "
        />

        <div v-if="loading" class="py-24 text-center text-sm text-slate-500">
          正在整理试卷…
        </div>
        <div
          v-else-if="!exams.length"
          class="py-24 text-center text-sm text-slate-500"
        >
          没有符合条件的题目，请调整筛选条件。
        </div>
      </section>

      <ReaderPageNavigation
        :page="page"
        :total-pages="totalPages"
        :disabled="loading || Boolean(error)"
        @page="changePage"
      />
    </main>
  </div>
</template>
