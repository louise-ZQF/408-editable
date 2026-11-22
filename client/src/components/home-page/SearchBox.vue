<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import SearchField from '@/components/SearchField.vue'
import { SEARCH_EXAMPLES } from '@/search/query'

const router = useRouter()
const query = ref('')

function submit() {
  const q = query.value.trim()
  if (q) void router.push({ name: 'search', query: { q } })
}
</script>

<template>
  <div>
    <SearchField v-model="query" @submit="submit" />
    <div class="mt-3 flex flex-wrap items-center gap-x-2 text-sm text-[#516584]">
      <span class="mr-1 font-medium">试搜</span>
      <RouterLink
        v-for="example in SEARCH_EXAMPLES"
        :key="example"
        :to="{ name: 'search', query: { q: example } }"
        class="inline-flex min-h-11 items-center rounded-lg px-2.5 font-medium text-[#244caf] hover:bg-[#dae6ff] focus-visible:outline-2 focus-visible:outline-[#2855bf]"
      >{{ example }}</RouterLink>
    </div>
  </div>
</template>
