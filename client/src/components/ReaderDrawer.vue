<script setup lang="ts">
import { computed } from "vue";
import DoubleChevronIcon from "@/components/icons/DoubleChevronIcon.vue";

const props = withDefaults(
  defineProps<{
    open: boolean;
    pinned: boolean;
    side: "left" | "right";
    width: number;
    triggerLabel: string;
    pinLabel: string;
    surfaceClass?: string;
    showHeader?: boolean;
  }>(),
  {
    surfaceClass: "bg-[#f6f8fb]",
    showHeader: true,
  },
);

const emit = defineEmits<{
  hover: [value: boolean];
  pin: [value: boolean];
}>();

const isLeft = computed(() => props.side === "left");
const drawerStyle = computed(() => ({
  "--reader-drawer-width": `${props.width}px`,
}));

function handlePointerHover(event: PointerEvent, value: boolean) {
  if (event.pointerType !== "mouse") return;
  emit("hover", value);
}
</script>

<template>
  <div
    class="reader-drawer-trigger fixed inset-y-0 z-50 w-7"
    :class="isLeft ? 'left-0 cursor-e-resize' : 'right-0 cursor-w-resize'"
    :aria-label="triggerLabel"
    @pointerenter="handlePointerHover($event, true)"
    @click="emit('pin', true)"
  >
    <span
      v-if="!open"
      class="absolute top-1/2 grid h-20 w-6 -translate-y-1/2 place-items-center border border-[#cbd5e1] bg-white/95 text-[#31559e] shadow-lg backdrop-blur"
      :class="
        isLeft
          ? 'left-0 rounded-r-sm border-l-0'
          : 'right-0 rounded-l-sm border-r-0'
      "
    >
      <DoubleChevronIcon
        class="h-4 w-4"
        :class="isLeft ? '' : 'rotate-180'"
      />
    </span>
  </div>

  <aside
    class="reader-drawer sticky top-0 z-30 flex h-screen min-w-0 flex-col overflow-hidden border-[#d3dce8] transition-[opacity,transform] duration-300"
    :class="[
      surfaceClass,
      isLeft ? 'border-r' : 'border-l',
      open
        ? 'translate-x-0 opacity-100'
        : [
            'pointer-events-none opacity-0',
            isLeft ? 'max-lg:-translate-x-full' : 'max-lg:translate-x-full',
          ],
    ]"
    :style="drawerStyle"
    @pointerenter="handlePointerHover($event, true)"
    @pointerleave="handlePointerHover($event, false)"
  >
    <header
      v-if="showHeader"
      class="flex shrink-0 items-center justify-between gap-3 border-b border-[#d8e0eb] px-5 py-5"
    >
      <slot name="header" />
      <button
        type="button"
        class="grid h-9 w-9 shrink-0 place-items-center border transition"
        :class="
          pinned
            ? 'border-[#12327f] bg-[#12327f] text-white'
            : 'border-[#cbd5e1] bg-white text-slate-500 hover:border-[#12327f] hover:text-[#12327f]'
        "
        :aria-label="pinned ? `取消固定${pinLabel}` : `固定${pinLabel}`"
        :title="pinned ? '取消固定' : `固定${pinLabel}`"
        @click="emit('pin', !pinned)"
      >
        <svg
          class="reader-drawer-pin-icon h-4 w-4 transition-transform"
          :class="pinned ? '-rotate-45' : ''"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          aria-hidden="true"
        >
          <path
            d="M12 17v5M7 3h10M8 3l1 7-3 4h12l-3-4 1-7"
            stroke-linecap="square"
            stroke-linejoin="miter"
          />
        </svg>
        <DoubleChevronIcon
          class="reader-drawer-close-icon hidden h-4 w-4"
          :class="isLeft ? 'rotate-180' : ''"
        />
      </button>
    </header>

    <slot />
  </aside>
</template>

<style scoped>
@media (hover: none), (pointer: coarse) {
  .reader-drawer-pin-icon {
    display: none;
  }

  .reader-drawer-close-icon {
    display: block;
  }
}

@media (max-width: 639px) {
  .reader-drawer {
    position: fixed;
    inset-block: 0;
    width: min(var(--reader-drawer-width), 88vw);
  }

  .reader-drawer.border-r {
    left: 0;
    box-shadow: 20px 0 70px rgba(15, 23, 42, 0.18);
  }

  .reader-drawer.border-l {
    right: 0;
    box-shadow: -20px 0 70px rgba(15, 23, 42, 0.18);
  }
}
</style>
