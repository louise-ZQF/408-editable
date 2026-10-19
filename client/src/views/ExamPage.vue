<script setup lang="ts">
import ExamFilterDrawer from '@/components/exams-page/ExamFilterDrawer.vue'
import ExamPaperList from '@/components/exams-page/ExamPaperList.vue'
import ExamTocDrawer from '@/components/exams-page/ExamTocDrawer.vue'
import ReaderDrawerLayout from '@/components/ReaderDrawerLayout.vue'
import { useExamPage } from '@/components/exams-page/useExamPage'

const examPage = useExamPage()
</script>

<template>
  <ReaderDrawerLayout
    class="bg-[#edf1f6] text-[#071225]"
    :left-width="300"
    :right-width="244"
  >
    <template #left="{ open, pinned, hover, pin }">
      <ExamFilterDrawer
        :current-filter-text="examPage.currentFilterText.value"
        :filters="examPage.filters.value"
        :has-active-filters="examPage.hasActiveFilters.value"
        :open="open"
        :pinned="pinned"
        :selection="examPage.selection"
        @hover="hover"
        @pin="pin"
        @reset="examPage.resetFilters"
        @search="examPage.openSearchPage"
        @update="examPage.updateSelection"
      />
    </template>

    <ExamPaperList
      :error="examPage.error.value"
      :exams="examPage.exams.value"
      :loading="examPage.loading.value"
      :page="examPage.page.value"
      :total-pages="examPage.totalPages.value"
      @page="examPage.changePage"
    />

    <template #right="{ open, pinned, hover, pin }">
      <ExamTocDrawer
        :active-exam-id="examPage.activeExamId.value"
        :current-filter-text="examPage.currentFilterText.value"
        :exams="examPage.exams.value"
        :open="open"
        :pinned="pinned"
        @hover="hover"
        @pin="pin"
        @select="examPage.scrollToExam"
      />
    </template>
  </ReaderDrawerLayout>
</template>
