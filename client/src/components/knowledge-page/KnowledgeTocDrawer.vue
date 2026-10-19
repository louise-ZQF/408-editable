<script setup lang="ts">
import ReaderDrawer from "@/components/ReaderDrawer.vue";
import KnowledgeToc from "./KnowledgeToc.vue";
import type { KnowledgeTocEntry } from "./pageTypes";

defineProps<{
  entries: KnowledgeTocEntry[];
  open: boolean;
  pinned: boolean;
  visible: boolean;
}>();

const emit = defineEmits<{
  hover: [value: boolean];
  pin: [value: boolean];
}>();
</script>

<template>
  <ReaderDrawer
    side="right"
    :width="270"
    :open="open"
    :pinned="pinned"
    trigger-label="悬停展开本节目录"
    pin-label="本节目录"
    @hover="emit('hover', $event)"
    @pin="emit('pin', $event)"
  >
    <template #header>
      <div>
        <p class="mb-1 mt-0 font-mono text-[9px] font-bold tracking-[.16em] text-[#31559e]">
          ON THIS PAGE
        </p>
        <h2 class="m-0 text-[15px] font-semibold tracking-[-.015em] text-[#071225]">
          本节目录
        </h2>
      </div>
    </template>
    <KnowledgeToc
      v-if="visible"
      :entries="entries"
      class="h-full"
    />
  </ReaderDrawer>
</template>
