<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { Fold, List } from '@element-plus/icons-vue'
import BrandLogo from './BrandLogo.vue'

type Side = 'left' | 'right'

const props = defineProps<{
  leftWidth: number
  rightWidth: number
  leftLabel: string
  rightLabel: string
  contextLabel?: string
}>()

const desktopQuery = '(min-width: 1200px)'
const desktop = ref(false)
const pinned = ref<Record<Side, boolean>>({ left: false, right: false })
const preview = ref<Side>()
const leftButton = ref<HTMLButtonElement>()
const rightButton = ref<HTMLButtonElement>()
const closeDelay: Partial<Record<Side, number>> = {}
let desktopMedia: MediaQueryList | undefined

const open = (side: Side) => pinned.value[side] || preview.value === side
const compactPanel = computed(() => desktop.value ? undefined : pinned.value.left ? 'left' : pinned.value.right ? 'right' : undefined)
const layoutStyle = computed(() => ({
  '--reader-left-width': `${props.leftWidth}px`,
  '--reader-right-width': `${props.rightWidth}px`,
  '--reader-left-space': desktop.value && pinned.value.left ? `${props.leftWidth}px` : '0px',
  '--reader-right-space': desktop.value && pinned.value.right ? `${props.rightWidth}px` : '0px',
}))

function hover(side: Side, value: boolean) {
  if (!desktop.value) return
  window.clearTimeout(closeDelay[side])
  if (value) {
    preview.value = side
  } else {
    // Give the pointer time to cross the toolbar border into the drawer.
    closeDelay[side] = window.setTimeout(() => {
      if (preview.value === side) preview.value = undefined
    }, 120)
  }
}

function pin(side: Side, value: boolean, restoreFocus = false) {
  pinned.value[side] = value
  preview.value = undefined
  if (value && !desktop.value) pinned.value[side === 'left' ? 'right' : 'left'] = false
  if (restoreFocus) (side === 'left' ? leftButton : rightButton).value?.focus({ preventScroll: true })
}

function closeCompact(side: Side) {
  if (!desktop.value && pinned.value[side]) pin(side, false, true)
}

function pressEscape(event: KeyboardEvent) {
  if (event.defaultPrevented || event.key !== 'Escape') return
  if (compactPanel.value) {
    pin(compactPanel.value, false, true)
    return
  }
  if (preview.value && !pinned.value[preview.value]) {
    pin(preview.value, false, true)
    return
  }
  const target = event.target
  if (!(target instanceof HTMLElement)) return
  const side = target.closest<HTMLElement>('[data-reader-drawer]')?.dataset.readerDrawer
  if (side === 'left' || side === 'right') pin(side, false, true)
  else if (target === leftButton.value && pinned.value.left) pin('left', false, true)
  else if (target === rightButton.value && pinned.value.right) pin('right', false, true)
}

function updateDesktop() {
  desktop.value = Boolean(desktopMedia?.matches)
  preview.value = undefined
  if (!desktop.value && pinned.value.left && pinned.value.right) pinned.value.right = false
}

onMounted(() => {
  desktopMedia = window.matchMedia(desktopQuery)
  updateDesktop()
  desktopMedia.addEventListener('change', updateDesktop)
  window.addEventListener('keydown', pressEscape)
})
onBeforeUnmount(() => {
  desktopMedia?.removeEventListener('change', updateDesktop)
  window.removeEventListener('keydown', pressEscape)
  for (const timer of Object.values(closeDelay)) window.clearTimeout(timer)
})
</script>

<template>
  <div class="reader-layout min-h-screen bg-white text-[#101a2d]" :style="layoutStyle">
    <nav class="reader-toolbar" aria-label="阅读导航">
      <div class="reader-toolbar-inner">
        <button
          ref="leftButton" type="button" class="reader-toolbar-button justify-self-start"
          :aria-label="`悬停展开${leftLabel}`" :aria-expanded="open('left')" aria-controls="reader-drawer-left"
          @pointerenter="$event.pointerType === 'mouse' && hover('left', true)"
          @pointerleave="$event.pointerType === 'mouse' && hover('left', false)"
          @click="pin('left', !pinned.left)"
        >
          <Fold class="size-[17px]" aria-hidden="true" />
          {{ leftLabel }}
        </button>
        <div class="flex min-w-0 items-center justify-center gap-3.5">
          <BrandLogo class="min-h-11 shrink-0" />
          <span v-if="contextLabel" class="hidden truncate border-l border-slate-200 pl-3.5 text-[13px] text-slate-600 md:block">{{ contextLabel }}</span>
        </div>
        <button
          ref="rightButton" type="button" class="reader-toolbar-button justify-self-end"
          :aria-label="`悬停展开${rightLabel}`" :aria-expanded="open('right')" aria-controls="reader-drawer-right"
          @pointerenter="$event.pointerType === 'mouse' && hover('right', true)"
          @pointerleave="$event.pointerType === 'mouse' && hover('right', false)"
          @click="pin('right', !pinned.right)"
        >
          <List class="size-[17px]" aria-hidden="true" />
          {{ rightLabel }}
        </button>
      </div>
    </nav>

    <Transition>
      <div
        v-if="compactPanel" class="reader-scrim" aria-hidden="true"
        @click="pin(compactPanel, false, true)"
      />
    </Transition>

    <slot
      name="left" :open="open('left')" :pinned="pinned.left && desktop" :compact="!desktop"
      :hover="(value: boolean) => hover('left', value)"
      :pin="(value: boolean) => pin('left', value, !value && !desktop)"
      :close-on-select="() => closeCompact('left')"
    />

    <div class="reader-content" :inert="Boolean(compactPanel)">
      <slot />
    </div>

    <slot
      name="right" :open="open('right')" :pinned="pinned.right && desktop" :compact="!desktop"
      :hover="(value: boolean) => hover('right', value)"
      :pin="(value: boolean) => pin('right', value, !value && !desktop)"
      :close-on-select="() => closeCompact('right')"
    />
  </div>
</template>

<style scoped>
.reader-layout { --reader-toolbar-height: 60px; }
.reader-toolbar {
  position: sticky;
  top: 0;
  z-index: 50;
  background: #fff;
  border-bottom: 1px solid #e5eaf1;
}
.reader-toolbar-inner {
  display: grid;
  grid-template-columns: 1fr minmax(0, auto) 1fr;
  align-items: center;
  gap: 8px;
  min-height: calc(var(--reader-toolbar-height) - 1px);
  padding-inline: clamp(10px, 2.2vw, 34px);
}
.reader-toolbar-button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 44px;
  padding-inline: 10px;
  border-radius: 9px;
  color: #45556c;
  font-size: 13px;
  font-weight: 650;
  white-space: nowrap;
  transition: background-color 160ms ease, color 160ms ease;
}
.reader-toolbar-button:hover,
.reader-toolbar-button[aria-expanded='true'] { background: #edf3ff; color: #204ca7; }
.reader-toolbar-button:focus-visible { outline: 2px solid #315bb3; outline-offset: 2px; }
.reader-content {
  min-width: 0;
  padding-inline: var(--reader-left-space) var(--reader-right-space);
}
.reader-scrim {
  position: fixed;
  inset: var(--reader-toolbar-height) 0 0;
  z-index: 40;
  background: #17284238;
}
.v-enter-active, .v-leave-active { transition: opacity 180ms ease; }
.v-enter-from, .v-leave-to { opacity: 0; }
@media (max-width: 374px) {
  .reader-toolbar-inner { gap: 3px; padding-inline: 6px; }
  .reader-toolbar-button { gap: 4px; padding-inline: 6px; font-size: 12px; }
  .reader-toolbar-inner :deep(a[aria-label='返回首页']) { gap: 4px; letter-spacing: 0; }
}
</style>
