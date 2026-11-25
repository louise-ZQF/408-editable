<script setup lang="ts">
import ReaderDrawer from "@/components/ReaderDrawer.vue";
import KnowledgeToc from "./KnowledgeToc.vue";
import type { KnowledgeTocEntry } from "./pageTypes";

defineProps<{
  entries: KnowledgeTocEntry[];
  open: boolean;
  pinned: boolean;
  compact: boolean;
  visible: boolean;
}>();

const emit = defineEmits<{
  hover: [value: boolean];
  pin: [value: boolean];
  navigate: [];
}>();
</script>

<template>
  <ReaderDrawer
    side="right"
    :open="open"
    :pinned="pinned"
    :compact="compact"
    pin-label="本节目录"
    @hover="emit('hover', $event)"
    @pin="emit('pin', $event)"
  >
    <template #header>
      <div>
        <h2 class="m-0 text-[15px] font-semibold tracking-[-.015em] text-[#071225]">
          本节目录
        </h2>
      </div>
    </template>
    <KnowledgeToc
      v-if="visible"
      :entries="entries"
      :open="open"
      @navigate="emit('navigate')"
    />
  </ReaderDrawer>
</template>
