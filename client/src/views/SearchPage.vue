<script setup lang="ts">
import { useRouter } from 'vue-router'
import SearchPageHeader from '@/components/search-page/SearchPageHeader.vue'
import SearchResultsPanel from '@/components/search-page/SearchResultsPanel.vue'
import { useSearchPage } from '@/components/search-page/useSearchPage'
import type { SearchResult } from '@/search/types'

const router = useRouter()
const { query, activeQuery, subject, failed, loading, results, submit, setSubject, selectQuery, saveQueryBeforeLeaving } = useSearchPage()

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
      :subject="subject"
      @subject="setSubject"
      @example="selectQuery"
      @retry="submit"
      @select="openResult"
    />
  </div>
</template>
