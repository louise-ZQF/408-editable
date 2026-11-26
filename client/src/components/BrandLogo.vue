<script setup lang="ts">
import { workspace } from '@/editor/store'
</script>
<template>
  <RouterLink
    to="/"
    aria-label="返回首页"
    class="group inline-flex items-center font-mono text-[14px] font-bold tracking-[.12em] text-[#12327f]"
  >
    <span class="transition-colors group-hover:text-[#071225]">{{ workspace.settings.title }}</span>
  </RouterLink>
</template>
