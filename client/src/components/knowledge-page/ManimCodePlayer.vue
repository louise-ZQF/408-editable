<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, shallowRef, watch } from "vue";
import { Scene } from "manim-web";
import type { ManimWebAnimation } from "@/animations/types";

const props = defineProps<{
  animation: ManimWebAnimation;
}>();

const firstIndex = () => (props.animation.initialState ? -1 : 0);
const current = ref(firstIndex());
const sceneHost = ref<HTMLElement | null>(null);
const sceneRef = shallowRef<Scene | null>(null);
const isRendering = ref(false);
let renderToken = 0;
const rootEl = ref<HTMLElement | null>(null);
const isFullscreen = ref(false);

const supportsFullscreen = computed(
  () =>
    typeof document !== "undefined" &&
    typeof document.documentElement.requestFullscreen === "function",
);

const stepCount = computed(() => props.animation.steps.length);
const progress = computed(() =>
  stepCount.value && current.value >= 0
    ? ((current.value + 1) / stepCount.value) * 100
    : 0,
);
const sceneAspectRatio = computed(
  () => `${props.animation.scene.width} / ${props.animation.scene.height}`,
);
const stepLabel = computed(() =>
  current.value < 0
    ? "准备开始"
    : `第 ${current.value + 1} / ${stepCount.value} 步`,
);

async function renderCurrentStep(animate = false) {
  const scene = sceneRef.value;
  const step = props.animation.steps[current.value];
  if (!scene) return;

  const token = ++renderToken;
  isRendering.value = true;
  scene.clear({ render: false });
  try {
    if (step) {
      await step.render(scene, animate);
    } else if (current.value === -1 && props.animation.initialState) {
      await props.animation.initialState.render(scene, false);
    } else {
      scene.render();
    }
  } finally {
    if (token === renderToken) isRendering.value = false;
  }
}

async function initScene() {
  if (!sceneHost.value) return;
  sceneRef.value?.dispose();
  const config = props.animation.scene;
  sceneRef.value = new Scene(sceneHost.value, {
    frameWidth: config.frameWidth,
    frameHeight: config.frameHeight,
    backgroundColor: config.backgroundColor,
  });
  // 省略 width/height 让画布跟随容器尺寸自动重绘（全屏切换时无需重建）；
  // contain 模式保证容器宽高比与画面帧不一致时信箱式留白而非裁剪内容。
  sceneRef.value.camera.aspectMode = "contain";
  await renderCurrentStep(true);
}

function next() {
  current.value = Math.min(current.value + 1, stepCount.value - 1);
}

function prev() {
  current.value = Math.max(current.value - 1, firstIndex());
}

function reset() {
  const target = firstIndex();
  if (current.value !== target) {
    current.value = target;
    return;
  }
  current.value = target;
  void renderCurrentStep(true);
}

function toggleFullscreen() {
  const el = rootEl.value;
  if (!el) return;
  if (document.fullscreenElement === el) {
    document.exitFullscreen().catch(() => {});
  } else {
    el.requestFullscreen().catch(() => {});
  }
}

function syncFullscreenState() {
  isFullscreen.value = document.fullscreenElement === rootEl.value;
}

watch(current, () => {
  void renderCurrentStep(true);
});

watch(
  () => props.animation,
  () => {
    current.value = firstIndex();
    void initScene();
  },
);

onMounted(() => {
  document.addEventListener("fullscreenchange", syncFullscreenState);
  void initScene();
});

onUnmounted(() => {
  document.removeEventListener("fullscreenchange", syncFullscreenState);
  sceneRef.value?.dispose();
  sceneRef.value = null;
});
</script>

<template>
  <div
    ref="rootEl"
    :class="
      isFullscreen
        ? 'flex h-full w-full flex-col bg-white'
        : 'overflow-hidden rounded-[4px] border border-[#d6dee9] bg-white'
    "
    :aria-label="animation.ariaLabel"
  >
    <header
      class="flex shrink-0 items-center justify-between gap-5 border-b border-[#e0e6ee] px-[clamp(14px,2vw,22px)] py-3"
    >
      <p class="m-0 text-[12px] font-semibold tracking-[.02em] text-slate-500">
        分步动画
      </p>
      <button
        v-if="supportsFullscreen"
        class="flex shrink-0 items-center gap-1.5 text-[12px] font-semibold text-slate-500 transition hover:text-[#071225]"
        type="button"
        :aria-label="isFullscreen ? '退出全屏' : '进入全屏'"
        @click="toggleFullscreen"
      >
        <svg
          v-if="isFullscreen"
          class="h-3.5 w-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M8 3v3a2 2 0 0 1-2 2H3" />
          <path d="M21 8h-3a2 2 0 0 1-2-2V3" />
          <path d="M3 16h3a2 2 0 0 1 2 2v3" />
          <path d="M16 21v-3a2 2 0 0 1 2-2h3" />
        </svg>
        <svg
          v-else
          class="h-3.5 w-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M8 3H5a2 2 0 0 0-2 2v3" />
          <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
          <path d="M3 16v3a2 2 0 0 0 2 2h3" />
          <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
        </svg>
        {{ isFullscreen ? "退出全屏" : "全屏" }}
      </button>
    </header>

    <div :class="isFullscreen ? 'min-h-0 flex-1' : 'bg-[#f7f8fa] p-2'">
      <div
        class="relative overflow-hidden"
        :class="
          isFullscreen ? 'h-full w-full' : 'w-full border border-[#e0e5eb] bg-white'
        "
        :style="isFullscreen ? undefined : { aspectRatio: sceneAspectRatio }"
        role="img"
        :aria-label="animation.ariaLabel"
      >
        <div
          ref="sceneHost"
          class="absolute inset-0 [&_canvas]:!absolute [&_canvas]:!inset-0 [&_canvas]:!h-full [&_canvas]:!w-full"
        ></div>
      </div>
    </div>

    <footer class="shrink-0 border-t border-[#d8e1ec] bg-white">
      <div
        class="flex items-center justify-between gap-4 px-[clamp(14px,2vw,22px)] py-3 max-sm:items-end"
      >
        <button
          class="text-[12px] font-semibold text-slate-400 transition hover:text-[#071225] disabled:cursor-not-allowed disabled:opacity-30"
          type="button"
          :disabled="isRendering"
          @click="reset"
        >
          重置
        </button>
        <div class="flex shrink-0 items-center gap-5 text-sm">
          <button
            class="text-[13px] font-semibold text-slate-500 transition hover:text-[#12327f] disabled:cursor-not-allowed disabled:opacity-30"
            type="button"
            :disabled="current === firstIndex() || isRendering"
            @click="prev"
          >
            ← 上一步
          </button>
          <button
            class="rounded-md bg-[#12327f] px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-[#0b2769] disabled:cursor-not-allowed disabled:opacity-30"
            type="button"
            :disabled="current === stepCount - 1 || isRendering"
            @click="next"
          >
            下一步 →
          </button>
        </div>
      </div>
      <div class="h-0.5 bg-[#e7ecf3]">
        <i
          class="block h-full bg-[#315fbd] transition-[width] duration-500 ease-out"
          :style="{ width: `${progress}%` }"
        ></i>
      </div>
    </footer>
  </div>
</template>
