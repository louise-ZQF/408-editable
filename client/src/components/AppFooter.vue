<script setup lang="ts">
import { workspace } from '@/editor/store'
</script>
<template>
  <footer class="app-footer"><div class="footer-inner">
    <div class="footer-row filing-row"><span>{{ workspace.settings.title }} · 个人可编辑版</span><a href="https://github.com/liangbohan/postgraduate-exam-website" target="_blank" rel="noopener noreferrer" class="filing-link">原作：liangbohan / 408 简纲 · CC BY 4.0</a></div>
    <div class="footer-row tagline-row">{{ workspace.settings.footer }}</div>
  </div></footer>
</template>

<style scoped>
.app-footer {
  width: 100%;
  background: linear-gradient(180deg, #fbfdff, #f4f8ff);
  border-top: 1px solid #edf1f5;
  padding: 24px 20px 28px;
  font-size: 12px;
  color: #8492a9;
  text-align: center;
}
.footer-inner {
  max-width: 1080px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}
.footer-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  flex-wrap: wrap;
}

/* 联系方式行 */
.social-row {
  gap: 12px;
}
.row-label {
  letter-spacing: 0.2em;
  color: #74809a;
  margin-right: 4px;
}
.social-item {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(219, 228, 239, 0.8);
  text-decoration: none;
  color: #445675;
  transition: all 0.2s ease;
}
.social-item:hover {
  transform: translateY(-1px);
  border-color: #2d68ef;
  box-shadow: 0 4px 10px rgba(45, 104, 239, 0.12);
}
.social-item:nth-child(2) .social-icon { color: #fb7299; }   /* B站 粉 */
.social-item:nth-child(3) .social-icon { color: #000; }       /* 抖音 黑 */
.social-item:nth-child(4) .social-icon { color: #ff2741; }   /* 小红书 红 */
.social-icon {
  display: inline-flex;
  width: 16px;
  height: 16px;
  align-items: center;
  justify-content: center;
}

/* 备案信息行 */
.filing-row {
  gap: 16px;
  color: #9aa6bd;
}
.filing-link {
  color: #9aa6bd;
  text-decoration: none;
  transition: color 0.15s ease;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.filing-link:hover {
  color: #2d68ef;
}
.ga-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  border-radius: 3px;
  background: #2d68ef;
  color: #fff;
  font-size: 10px;
  font-weight: 700;
}

/* 标语行 */
.tagline-row {
  color: #b4bdce;
  font-size: 11px;
}
.dot {
  color: #cfd6e4;
}
</style>
