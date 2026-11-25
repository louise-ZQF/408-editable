<script setup lang="ts">
import { Close } from '@element-plus/icons-vue'

defineProps<{
  open: boolean
  pinned: boolean
  compact: boolean
  side: 'left' | 'right'
  pinLabel: string
}>()

const emit = defineEmits<{
  hover: [value: boolean]
  pin: [value: boolean]
}>()
</script>

<template>
  <aside
    :id="`reader-drawer-${side}`"
    :data-reader-drawer="side"
    :aria-label="pinLabel"
    :aria-hidden="!open || undefined"
    :inert="!open"
    class="reader-drawer"
    :class="[`reader-drawer--${side}`, { 'is-open': open, 'is-pinned': pinned }]"
    @pointerenter="$event.pointerType === 'mouse' && emit('hover', true)"
    @pointerleave="$event.pointerType === 'mouse' && emit('hover', false)"
  >
    <header class="flex min-h-[64px] shrink-0 items-center justify-between gap-2 border-b border-[#e8edf4] px-4 py-2">
      <slot name="header" />
      <button
        type="button"
        class="drawer-pin"
        :aria-pressed="compact ? undefined : pinned"
        :aria-label="compact ? `关闭${pinLabel}` : pinned ? `取消固定${pinLabel}` : `固定${pinLabel}`"
        :title="compact ? `关闭${pinLabel}` : pinned ? '取消固定' : `固定${pinLabel}`"
        @click="emit('pin', !compact && !pinned)"
      >
        <Close v-if="compact" class="size-[17px]" aria-hidden="true" />
        <svg v-else class="size-[17px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
          <path d="M12 17v5M7 3h10M8 3l1 7-3 4h12l-3-4 1-7" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
    </header>

    <slot />
  </aside>
</template>

<style scoped>
.reader-drawer {
  position: fixed;
  inset-block: var(--reader-toolbar-height) 0;
  z-index: 45;
  display: flex;
  flex-direction: column;
  width: min(var(--drawer-width), 88vw);
  overflow: hidden;
  visibility: hidden;
  pointer-events: none;
  transform: translateX(var(--drawer-offset));
  background: #fff;
  transition: transform 230ms cubic-bezier(.2,.75,.25,1), visibility 0s linear 230ms;
}
.reader-drawer--left {
  --drawer-width: var(--reader-left-width);
  --drawer-offset: -101%;
  left: 0;
  border-right: 1px solid #e5eaf1;
}
.reader-drawer--right {
  --drawer-width: var(--reader-right-width);
  --drawer-offset: 101%;
  right: 0;
  border-left: 1px solid #e5eaf1;
}
.reader-drawer.is-open {
  visibility: visible;
  pointer-events: auto;
  transform: translateX(0);
  transition-delay: 0s;
}
.reader-drawer.is-open:not(.is-pinned) { box-shadow: 0 14px 40px #18264c19; }
.drawer-pin {
  display: grid;
  flex: none;
  width: 44px;
  height: 44px;
  place-items: center;
  border-radius: 9px;
  color: #526174;
  transition: background-color 150ms ease, color 150ms ease;
}
.drawer-pin:hover, .drawer-pin[aria-pressed='true'] { color: #214ca4; background: #edf3ff; }
.drawer-pin:focus-visible { outline: 2px solid #315bb3; outline-offset: 2px; }
</style>
