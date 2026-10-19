<script setup lang="ts">
import { workspace } from '@/editor/store'
</script>
<template>
  <RouterLink
    to="/"
    aria-label="返回首页"
    class="group inline-flex items-center gap-2.5 font-mono text-[12px] font-bold tracking-[.16em] text-[#12327f]"
  >
    <svg class="h-7 w-8 overflow-visible" viewBox="0 0 34 28" aria-hidden="true">
      <path d="M6 14 26 5M6 14l20 9" fill="none" stroke="currentColor" stroke-width="1.5" opacity=".72" />
      <circle cx="6" cy="14" r="4" fill="#1d4ed8" />
      <circle cx="26" cy="5" r="4" fill="#38bdf8" />
      <circle cx="26" cy="23" r="4" fill="#06b6d4" />
    </svg>
    <span class="transition-colors group-hover:text-[#071225]">{{ workspace.settings.title }}</span>
  </RouterLink>
</template>
