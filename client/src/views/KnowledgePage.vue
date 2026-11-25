<script setup lang="ts">
import KnowledgeLibraryDrawer from '@/components/knowledge-page/KnowledgeLibraryDrawer.vue'
import KnowledgeReaderContent from '@/components/knowledge-page/KnowledgeReaderContent.vue'
import KnowledgeTocDrawer from '@/components/knowledge-page/KnowledgeTocDrawer.vue'
import ReaderDrawerLayout from '@/components/ReaderDrawerLayout.vue'
import { useKnowledgeReader } from '@/components/knowledge-page/useKnowledgeReader'

const reader = useKnowledgeReader()
</script>

<template>
  <ReaderDrawerLayout
    left-label="书籍目录"
    right-label="本节目录"
    :context-label="reader.book.value?.title"
    :left-width="304"
    :right-width="270"
  >
    <template #left="{ open, pinned, compact, hover, pin, closeOnSelect }">
      <KnowledgeLibraryDrawer
        :active-section-id="reader.activeSectionId.value"
        :book="reader.book.value"
        :book-id="reader.bookId.value"
        :books="reader.books"
        :open="open"
        :pinned="pinned"
        :compact="compact"
        @hover="hover"
        @pin="pin"
        @select-book="reader.selectBook"
        @select-section="reader.selectSection($event); closeOnSelect()"
      />
    </template>

    <KnowledgeReaderContent
      :article-entries="reader.articleEntries.value"
      :error="reader.error.value"
      :loading="reader.loading.value"
      :page="reader.page.value"
      :section="reader.section.value"
      :section-exam="reader.sectionExam.value"
      :total-pages="reader.totalPages.value"
      @page="reader.changePage"
    />

    <template #right="{ open, pinned, compact, hover, pin, closeOnSelect }">
      <KnowledgeTocDrawer
        :entries="reader.tocEntries.value"
        :open="open"
        :pinned="pinned"
        :compact="compact"
        :visible="Boolean(reader.section.value)"
        @hover="hover"
        @pin="pin"
        @navigate="closeOnSelect"
      />
    </template>
  </ReaderDrawerLayout>
</template>
