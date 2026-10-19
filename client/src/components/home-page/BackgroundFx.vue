<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";

/* 鼠标跟随背景：把鼠标坐标写到 CSS 变量 --mx / --my
 *  - 底层 radial-gradient 光斑跟随
 *  - 上层 grid 网格的径向 mask 跟随 */
const bgStyle = ref<Record<string, string>>({
  "--mx": "50%",
  "--my": "33%",
});
let mouseRaf = 0;
function onMouseMove(e: MouseEvent) {
  if (mouseRaf) return;
  mouseRaf = requestAnimationFrame(() => {
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    bgStyle.value = {
      "--mx": x.toFixed(2) + "%",
      "--my": y.toFixed(2) + "%",
    };
    mouseRaf = 0;
  });
}

onMounted(() => {
  window.addEventListener("mousemove", onMouseMove, { passive: true });
});
onBeforeUnmount(() => {
  if (mouseRaf) cancelAnimationFrame(mouseRaf);
  window.removeEventListener("mousemove", onMouseMove);
});
</script>

<template>
  <div class="bg-layer" :style="bgStyle" aria-hidden="true">
    <div class="bg-base"></div>
    <div class="bg-spot"></div>
    <div class="bg-grid"></div>
  </div>
</template>

<style scoped>
.bg-layer {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

/* 底层渐变背景 + 鼠标位置光晕 */
.bg-base {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(
      circle at var(--mx, 50%) var(--my, 33%),
      rgba(94, 179, 178, 0.12),
      transparent 28%
    ),
    linear-gradient(180deg, #fbfdff, #f6faff);
  transition: background 0.4s ease-out;
}

/* 鼠标附近的柔和光斑 */
.bg-spot {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    420px circle at var(--mx, 50%) var(--my, 33%),
    rgba(122, 184, 196, 0.12),
    transparent 60%
  );
  transition: background 0.2s ease-out;
}

/* 鼠标附近的网格（径向 mask 只在鼠标周围显示） */
.bg-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(122, 184, 196, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(122, 184, 196, 0.1) 1px, transparent 1px);
  background-size: 48px 48px;
  -webkit-mask-image: radial-gradient(
    circle at var(--mx, 50%) var(--my, 33%),
    black 0%,
    transparent 35%
  );
  mask-image: radial-gradient(
    circle at var(--mx, 50%) var(--my, 33%),
    black 0%,
    transparent 35%
  );
}
</style>
