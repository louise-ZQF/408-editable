<script setup lang="ts">
import { useRouter } from 'vue-router'
import SearchPageHeader from '@/components/search-page/SearchPageHeader.vue'
import SearchResultsPanel from '@/components/search-page/SearchResultsPanel.vue'
import { useSearchPage } from '@/components/search-page/useSearchPage'
import type { SearchResult } from '@/search/types'

const router = useRouter()
const { query, activeQuery, filters, failed, loading, results, submit, setFilters, selectQuery, saveQueryBeforeLeaving } = useSearchPage()

async function openResult(result: SearchResult) {
  await saveQueryBeforeLeaving()
  await router.push(result.route)
}
</script>

<template>
  <div class="min-h-screen bg-white text-[#122748]">
    <SearchPageHeader v-model="query" @submit="submit" />
    <SearchResultsPanel
      :loading="loading"
      :failed="failed"
      :query="activeQuery"
      :results="results"
      :filters="filters"
      @filter="setFilters"
      @example="selectQuery"
      @retry="submit"
      @select="openResult"
    />
  </div>
</template>
