<script setup lang="ts">
import { workspace } from '@/editor/store'
</script>
<template>
  <div class="flex justify-center gap-[18px] mt-[34px] max-md:flex-col max-md:items-center">
    <router-link
      v-if="workspace.settings.showKnowledge"
      to="/knowledge"
      class="cta-btn cta-btn-primary h-[62px] min-w-[235px] px-[34px] rounded-[999px] border border-[#3260df] inline-flex items-center justify-center gap-7 no-underline text-lg font-bold cursor-pointer bg-[#1f49ba] text-white shadow-[0_14px_28px_rgba(31,73,186,0.18)] max-md:w-full max-md:max-w-[420px]"
    >
      <span>{{ workspace.settings.knowledgeLabel }}</span>
      <span class="cta-arrow">→</span>
    </router-link>
    <router-link
      v-if="workspace.settings.showExams"
      to="/exams"
      class="cta-btn cta-btn-ghost h-[62px] min-w-[235px] px-[34px] rounded-[999px] border border-[#3260df] inline-flex items-center justify-center gap-7 no-underline text-lg font-bold cursor-pointer bg-white text-[#1845ad] max-md:w-full max-md:max-w-[420px]"
    >
      <span>{{ workspace.settings.examsLabel }}</span>
      <span class="cta-arrow">→</span>
    </router-link>
  </div>
</template>

<style scoped>
/* CTA 按钮：上浮 + 箭头位移 + 流光扫过 */
.cta-btn {
  position: relative;
  overflow: hidden;
  transition: transform 0.18s ease, box-shadow 0.18s ease,
    background-color 0.18s ease;
}
.cta-btn .cta-arrow {
  display: inline-block;
  transition: transform 0.2s ease;
}
.cta-btn:hover {
  transform: translateY(-2px);
}
.cta-btn:hover .cta-arrow {
  transform: translateX(6px);
}
.cta-btn-primary:hover {
  background-color: #1a3fa0;
  box-shadow: 0 18px 36px rgba(31, 73, 186, 0.28);
}
.cta-btn-ghost:hover {
  background-color: #f0f4ff;
  box-shadow: 0 14px 28px rgba(45, 104, 239, 0.14);
}
/* 鼠标移上去时一道流光从左到右扫过 */
.cta-btn::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    120deg,
    transparent 30%,
    rgba(255, 255, 255, 0.3) 50%,
    transparent 70%
  );
  transform: translateX(-100%);
  transition: transform 0.6s ease;
  pointer-events: none;
}
.cta-btn:hover::before {
  transform: translateX(100%);
}
</style>
