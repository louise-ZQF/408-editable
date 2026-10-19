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
    class="bg-[#e9eef5]"
    :left-width="304"
    :right-width="270"
  >
    <template #left="{ open, pinned, hover, pin }">
      <KnowledgeLibraryDrawer
        :active-section-id="reader.activeSectionId.value"
        :book="reader.book.value"
        :book-id="reader.bookId.value"
        :books="reader.books"
        :open="open"
        :pinned="pinned"
        @hover="hover"
        @pin="pin"
        @select-book="reader.selectBook"
        @select-section="reader.selectSection"
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

    <template #right="{ open, pinned, hover, pin }">
      <KnowledgeTocDrawer
        :entries="reader.tocEntries.value"
        :open="open"
        :pinned="pinned"
        :visible="Boolean(reader.section.value)"
        @hover="hover"
        @pin="pin"
      />
    </template>
  </ReaderDrawerLayout>
</template>
