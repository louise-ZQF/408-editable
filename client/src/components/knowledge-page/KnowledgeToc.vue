<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from "vue";
import type { KnowledgeArticleData } from "@/content/knowledge-articles/types";

export type KnowledgeTocEntry = {
  id: string;
  title: string;
  article: KnowledgeArticleData;
};

const props = defineProps<{
  entries: KnowledgeTocEntry[];
  open: boolean;
}>();

const emit = defineEmits<{ navigate: [] }>();

const activeId = ref("");
const pendingNavigationId = ref("");
const tocElement = ref<HTMLElement | null>(null);
let observedSections: HTMLElement[] = [];
let sectionPositions: number[] = [];
let positionsDirty = true;
let resizeObserver: ResizeObserver | undefined;
let navigationUnlockTimer: number | undefined;
let updateFrame: number | undefined;

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const observedIds = computed(() =>
  props.entries.flatMap((entry) => [
    `article-${entry.id}`,
    ...entry.article.subpoints.map((subpoint) => subpoint.id),
  ]),
);

function scrollToSection(id: string) {
  const target = document.getElementById(id);
  if (!target) return;

  activeId.value = id;
  pendingNavigationId.value = id;
  const targetTop =
    window.scrollY + target.getBoundingClientRect().top - getReadingLine();
  const instant = reducedMotion() || Math.abs(targetTop - window.scrollY) < 2;
  window.scrollTo({ top: Math.max(0, targetTop), behavior: instant ? "instant" : "smooth" });
  window.clearTimeout(navigationUnlockTimer);
  if (instant) releaseNavigationLock();
  else navigationUnlockTimer = window.setTimeout(releaseNavigationLock, 750);
  emit("navigate");
}

function releaseNavigationLock() {
  if (!pendingNavigationId.value) return;
  pendingNavigationId.value = "";
  window.clearTimeout(navigationUnlockTimer);
  scheduleActiveUpdate();
}

function entryIsActive(entry: KnowledgeTocEntry) {
  return (
    activeId.value === `article-${entry.id}` ||
    entry.article.subpoints.some((subpoint) => subpoint.id === activeId.value)
  );
}

async function observeSections() {
  resizeObserver?.disconnect();
  await nextTick();

  observedSections = observedIds.value
    .map((id) => document.getElementById(id))
    .filter((section): section is HTMLElement => Boolean(section));

  activeId.value = observedSections[0]?.id ?? "";
  resizeObserver = new ResizeObserver(invalidatePositions);
  observedSections.forEach((section) => resizeObserver?.observe(section));
  const column = document.querySelector('[data-testid="knowledge-article-column"]');
  if (column) resizeObserver.observe(column);
  invalidatePositions();
}

function getReadingLine() {
  return Math.max(90, Math.min(200, window.innerHeight * 0.22));
}

function updateActiveSection() {
  updateFrame = undefined;
  if (!props.open || pendingNavigationId.value || !observedSections.length) return;

  const pageBottom = window.scrollY + window.innerHeight;
  const scrollHeight = document.documentElement.scrollHeight;
  if (pageBottom >= scrollHeight - 2) {
    activeId.value = observedSections[observedSections.length - 1].id;
    return;
  }

  const scrollY = window.scrollY;
  if (positionsDirty) {
    sectionPositions = observedSections.map((section) => scrollY + section.getBoundingClientRect().top);
    positionsDirty = false;
  }
  const readingPosition = scrollY + getReadingLine() + 2;
  let index = 0;
  while (index + 1 < sectionPositions.length && sectionPositions[index + 1] <= readingPosition) index++;
  activeId.value = observedSections[index].id;
}

function invalidatePositions() {
  positionsDirty = true;
  scheduleActiveUpdate();
}

function scheduleActiveUpdate() {
  if (!props.open || updateFrame !== undefined) return;
  updateFrame = window.requestAnimationFrame(updateActiveSection);
}

async function keepActiveItemVisible() {
  await nextTick();
  const container = tocElement.value;
  const activeLink = container?.querySelector<HTMLElement>(
    `[data-toc-id="${CSS.escape(activeId.value)}"]`,
  );
  if (!container || !activeLink) return;

  const containerRect = container.getBoundingClientRect();
  const activeRect = activeLink.getBoundingClientRect();
  const visibleTop = containerRect.top + 8;
  const visibleBottom = containerRect.bottom - 16;

  if (activeRect.top < visibleTop) {
    container.scrollBy({
      top: activeRect.top - visibleTop,
      behavior: reducedMotion() ? "instant" : "smooth",
    });
  } else if (activeRect.bottom > visibleBottom) {
    container.scrollBy({
      top: activeRect.bottom - visibleBottom,
      behavior: reducedMotion() ? "instant" : "smooth",
    });
  }
}

watch(() => props.entries, observeSections);
watch(activeId, keepActiveItemVisible);
watch(() => props.open, (open) => {
  if (open) {
    scheduleActiveUpdate();
    void keepActiveItemVisible();
  }
});
onMounted(() => {
  void observeSections();
  window.addEventListener("scroll", scheduleActiveUpdate, { passive: true });
  window.addEventListener("resize", invalidatePositions);
  window.addEventListener("wheel", releaseNavigationLock, { passive: true });
  window.addEventListener("touchstart", releaseNavigationLock, { passive: true });
  window.addEventListener("scrollend", releaseNavigationLock);
});
onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  window.removeEventListener("scroll", scheduleActiveUpdate);
  window.removeEventListener("resize", invalidatePositions);
  window.removeEventListener("wheel", releaseNavigationLock);
  window.removeEventListener("touchstart", releaseNavigationLock);
  window.removeEventListener("scrollend", releaseNavigationLock);
  window.clearTimeout(navigationUnlockTimer);
  if (updateFrame !== undefined) window.cancelAnimationFrame(updateFrame);
});
</script>

<template>
  <nav
    ref="tocElement"
    aria-label="本节内容"
    data-testid="knowledge-toc"
    class="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-24 pt-4"
  >
    <ol class="m-0 list-none space-y-5 p-0">
      <li v-for="entry in entries" :key="entry.id">
        <a
          :href="`#article-${entry.id}`"
          :data-toc-id="`article-${entry.id}`"
          :aria-current="
            activeId === `article-${entry.id}` ? 'location' : undefined
          "
          class="block rounded-lg py-2 text-[14px] font-semibold leading-6 transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-[#315bb3]"
          :class="
            entryIsActive(entry)
              ? 'text-[#12327f]'
              : 'text-slate-700 hover:text-[#071225]'
          "
          @click.prevent="scrollToSection(`article-${entry.id}`)"
        >
          {{ entry.title }}
        </a>

        <ol
          class="mb-0 ml-0 mt-2.5 list-none space-y-0.5 border-l border-[#dce3ec] p-0"
        >
          <li v-for="subpoint in entry.article.subpoints" :key="subpoint.id">
            <a
              :href="`#${subpoint.id}`"
              :data-toc-id="subpoint.id"
              :aria-current="activeId === subpoint.id ? 'location' : undefined"
              class="-ml-px block rounded-r-lg border-l-2 py-2 pl-3 pr-2 text-[13px] leading-5 transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-[#315bb3]"
              :class="
                activeId === subpoint.id
                  ? 'border-[#3f67c0] bg-[#eff5ff] font-semibold text-[#214ca4]'
                  : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-[#071225]'
              "
              @click.prevent="scrollToSection(subpoint.id)"
            >
              {{ subpoint.title }}
            </a>
          </li>
        </ol>
      </li>
    </ol>
  </nav>
</template>
