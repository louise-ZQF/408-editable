<script setup lang="ts">
import SearchPageHeader from '@/components/search-page/SearchPageHeader.vue'
import SearchResultsPanel from '@/components/search-page/SearchResultsPanel.vue'
import { useSearchPage } from '@/components/search-page/useSearchPage'

const searchPage = useSearchPage()
</script>

<template>
  <div class="min-h-screen bg-white font-sans text-[#0a1d40]">
    <SearchPageHeader v-model="searchPage.query.value" @submit="searchPage.submit" />
    <SearchResultsPanel
      :loading="searchPage.loading.value"
      :page="searchPage.page.value"
      :page-size="searchPage.pageSize"
      :query="searchPage.query.value"
      :results="searchPage.pagedResults.value"
      :total="searchPage.total.value"
      :total-pages="searchPage.totalPages.value"
      @page="searchPage.goToPage"
      @select="searchPage.openResult"
    />
  </div>
</template>
