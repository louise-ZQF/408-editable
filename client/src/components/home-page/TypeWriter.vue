<script setup lang="ts">
import { workspace } from '@/editor/store'
import { onBeforeUnmount, onMounted, ref } from "vue";

/* 打字机副标题：循环展示多句话
 *  - 进页面先显示空 + 闪烁光标
 *  - 一个字一个字打出来（节奏 70-130ms 模拟人类打字）
 *  - 完整停留 2.5s
 *  - 倒退删除（每字 35ms）
 *  - 句间停 400ms 再打下一句 */
const ROTATING_LINES = [
  "用更少的内容，建立更清晰的知识体系",
  "开源 · 共建 · 共享，新时代的 AI 原生电子教材",
  "Less is more ：只收录 408 应试知识最小集",
  "用图像和交互式动画，帮助你快速掌握复杂的知识",
];

const typedText = ref("");
type TypePhase = "typing" | "holding" | "deleting" | "wait";
let typePhase: TypePhase = "typing";
let typeIdx = 0;
let typeChar = 0;
let typeTimer: ReturnType<typeof setTimeout> | null = null;

function scheduleType(delay: number) {
  if (typeTimer) clearTimeout(typeTimer);
  typeTimer = setTimeout(typeStep, delay);
}

function typeStep() {
  const lines = workspace.settings.lines.filter(Boolean);
  if (!lines.length) { typedText.value = ""; return }
  const full = lines[typeIdx % lines.length];
  if (typePhase === "typing") {
    typeChar += 1;
    typedText.value = full.slice(0, typeChar);
    if (typeChar >= full.length) {
      typePhase = "holding";
      scheduleType(2500);
    } else {
      scheduleType(70 + Math.random() * 60);
    }
  } else if (typePhase === "holding") {
    typePhase = "deleting";
    scheduleType(80);
  } else if (typePhase === "deleting") {
    typeChar -= 1;
    typedText.value = full.slice(0, typeChar);
    if (typeChar <= 0) {
      typeIdx = (typeIdx + 1) % workspace.settings.lines.length;
      typePhase = "wait";
      scheduleType(400);
    } else {
      scheduleType(35);
    }
  } else {
    typePhase = "typing";
    typeStep();
  }
}

onMounted(() => {
  scheduleType(220);
});
onBeforeUnmount(() => {
  if (typeTimer) clearTimeout(typeTimer);
});
</script>

<template>
  <div class="typed-wrap">
    <p class="typed-line">
      <span>{{ typedText }}</span
      ><span class="caret">|</span>
    </p>
  </div>
</template>

<style scoped>
.typed-wrap {
  min-height: calc(25px * 1.7 + 4px);
  display: flex;
  align-items: center;
  justify-content: center;
}
.typed-line {
  margin: 0;
  font-size: clamp(18px, 1.8vw, 25px);
  line-height: 1.7;
  color: #465979;
  white-space: normal;
  overflow: visible;
}
.typed-line .caret {
  display: inline-block;
  margin-left: 2px;
  color: #2c5de0;
  font-weight: 400;
  animation: caret-blink 1s steps(1, end) infinite;
}
@keyframes caret-blink {
  0%,
  50% {
    opacity: 1;
  }
  51%,
  100% {
    opacity: 0;
  }
}
</style>
