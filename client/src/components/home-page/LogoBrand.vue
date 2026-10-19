<script setup lang="ts">
import { workspace } from '@/editor/store'
import beta from "./beta.vue";
</script>

<template>
  <div class="inline-flex items-center gap-[14px] mt-[22px]">
    <svg
      class="logo-svg h-14 w-16 overflow-visible"
      viewBox="0 0 34 28"
      aria-hidden="true"
    >
      <path
        d="M6 14 26 5M6 14l20 9"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        opacity=".72"
      />
      <circle class="logo-dot logo-dot-1" cx="6" cy="14" r="4" fill="#1d4ed8" />
      <circle class="logo-dot logo-dot-2" cx="26" cy="5" r="4" fill="#38bdf8" />
      <circle
        class="logo-dot logo-dot-3"
        cx="26"
        cy="23"
        r="4"
        fill="#06b6d4"
      />
    </svg>
    <div
      class="brand-text text-[34px] font-extrabold tracking-[-1px] font-mono"
    >
      {{ workspace.settings.title }}
    </div>
    <beta />
  </div>
</template>

<style scoped>
.logo-svg {
  color: #2c5de0;
}
.logo-dot {
  transform-origin: center;
  animation: logo-pulse 2.4s ease-in-out infinite;
}
.logo-dot-1 {
  animation-delay: 0s;
}
.logo-dot-2 {
  animation-delay: 0.3s;
}
.logo-dot-3 {
  animation-delay: 0.6s;
}
@keyframes logo-pulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.55;
    transform: scale(0.85);
  }
}

/* "408 简纲" 渐变流动 */
.brand-text {
  background: linear-gradient(
    90deg,
    #16a7d2 0%,
    #1557b8 25%,
    #2c5de0 50%,
    #16a7d2 75%,
    #1557b8 100%
  );
  background-size: 300% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: gradient-flow 5s linear infinite;
}
@keyframes gradient-flow {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 300% 50%;
  }
}
</style>
