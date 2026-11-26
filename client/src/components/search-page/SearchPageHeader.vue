<script setup lang="ts">
import BrandLogo from '@/components/BrandLogo.vue'
import SearchField from '@/components/SearchField.vue'
import { workspace } from '@/editor/store'

const query = defineModel<string>({ required: true })
const emit = defineEmits<{ submit: [] }>()
</script>

<template>
  <header class="border-b border-[#dfe7f2] bg-white">
    <div class="mx-auto grid max-w-6xl grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2 px-5 py-2.5 sm:px-8 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:gap-8">
      <BrandLogo class="min-h-11 justify-self-start" />
      <nav aria-label="主导航" class="flex items-center gap-3 text-sm font-semibold text-[#365181] sm:gap-5 lg:col-start-3 lg:row-start-1">
        <RouterLink v-if="workspace.settings.showKnowledge" to="/knowledge" class="top-link">知识简纲</RouterLink>
      </nav>
      <SearchField v-model="query" class="col-span-2 lg:col-span-1 lg:col-start-2 lg:row-start-1" @submit="emit('submit')" />
    </div>
  </header>
</template>

<style scoped>
.top-link { display: inline-flex; align-items: center; min-height: 44px; }
.top-link:hover { color: #234db4; }
.top-link:focus-visible { outline: 2px solid #2855bf; outline-offset: 2px; }
</style>
