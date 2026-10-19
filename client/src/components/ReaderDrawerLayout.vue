<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

const props = withDefaults(
  defineProps<{
    leftWidth: number;
    rightWidth: number;
    compactBreakpoint?: number;
  }>(),
  { compactBreakpoint: 1024 },
);

const compact = ref(false);
const overlayLayout = ref(false);
const leftHovered = ref(false);
const leftPinned = ref(false);
const rightHovered = ref(false);
const rightPinned = ref(false);

const leftOpen = computed(() =>
  compact.value ? leftPinned.value : leftPinned.value || leftHovered.value,
);
const rightOpen = computed(() =>
  compact.value ? rightPinned.value : rightPinned.value || rightHovered.value,
);
const columns = computed(() =>
  overlayLayout.value
    ? "minmax(0,1fr)"
    : `${leftOpen.value ? props.leftWidth : 0}px minmax(0,1fr) ${rightOpen.value ? props.rightWidth : 0}px`,
);

function setHovered(side: "left" | "right", value: boolean) {
  if (compact.value) return;
  if (side === "left") leftHovered.value = value;
  else rightHovered.value = value;
}

function setPinned(side: "left" | "right", value: boolean) {
  if (side === "left") {
    leftPinned.value = value;
    if (compact.value && value) rightPinned.value = false;
  } else {
    rightPinned.value = value;
    if (compact.value && value) leftPinned.value = false;
  }
}

function updateLayoutMode() {
  compact.value = window.innerWidth < props.compactBreakpoint;
  overlayLayout.value = window.innerWidth < 640;
  leftHovered.value = false;
  rightHovered.value = false;
}

onMounted(() => {
  updateLayoutMode();
  window.addEventListener("resize", updateLayoutMode, { passive: true });
});
onBeforeUnmount(() => window.removeEventListener("resize", updateLayoutMode));
</script>

<template>
  <div
    class="relative grid min-h-screen overflow-x-clip transition-[grid-template-columns] duration-500 ease-[cubic-bezier(.22,1,.36,1)]"
    :style="{ gridTemplateColumns: columns }"
  >
    <slot
      name="left"
      :open="leftOpen"
      :pinned="leftPinned"
      :hover="(value: boolean) => setHovered('left', value)"
      :pin="(value: boolean) => setPinned('left', value)"
    />

    <slot />

    <slot
      name="right"
      :open="rightOpen"
      :pinned="rightPinned"
      :hover="(value: boolean) => setHovered('right', value)"
      :pin="(value: boolean) => setPinned('right', value)"
    />
  </div>
</template>
