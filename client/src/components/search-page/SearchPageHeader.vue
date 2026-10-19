<script setup lang="ts">
import BrandLogo from "@/components/BrandLogo.vue";
import { warmSearch } from "@/search/shared";

defineProps<{ modelValue: string }>();
const emit = defineEmits<{
  "update:modelValue": [value: string];
  submit: [];
}>();

const MAX_QUERY_LEN = 20;

function updateQuery(event: Event) {
  emit("update:modelValue", (event.target as HTMLInputElement).value);
}

function onKeydown(event: KeyboardEvent) {
  if (event.key !== "Enter") return;
  event.preventDefault();
  emit("submit");
}
</script>

<template>
  <header class="app-header">
    <div class="header-inner">
      <RouterLink to="/" class="logo-link"><BrandLogo /></RouterLink>
      <form
        class="search-form"
        @pointerenter="warmSearch"
        @submit.prevent="emit('submit')"
      >
        <span class="search-icon">
          <svg
            viewBox="0 0 20 20"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          >
            <circle cx="9" cy="9" r="6" />
            <path d="m14 14 4 4" />
          </svg>
        </span>
        <input
          :value="modelValue"
          :maxlength="MAX_QUERY_LEN"
          aria-label="搜索"
          placeholder="搜索知识点或章节"
          autocomplete="off"
          class="search-input"
          @input="updateQuery"
          @focus="warmSearch"
          @keydown="onKeydown"
        />
        <button
          v-if="modelValue"
          type="button"
          class="clear-btn"
          aria-label="清空"
          @click="emit('update:modelValue', '')"
        >
          <svg
            viewBox="0 0 16 16"
            width="12"
            height="12"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          >
            <path d="m3 3 10 10M13 3 3 13" />
          </svg>
        </button>
      </form>
      <nav class="header-nav">
        <RouterLink to="/knowledge" class="nav-link">知识简纲</RouterLink>
        <RouterLink to="/exams" class="nav-link">历年真题</RouterLink>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 50;
  height: 72px;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.92),
    rgba(244, 248, 255, 0.88)
  );
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid rgba(219, 228, 239, 0.6);
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.8) inset,
    0 4px 20px rgba(34, 89, 214, 0.04);
}
.header-inner {
  max-width: 1500px;
  height: 100%;
  margin: 0 auto;
  padding: 0 28px;
  display: grid;
  grid-template-columns: 220px 1fr 280px;
  align-items: center;
  gap: 24px;
}
.logo-link {
  display: inline-flex;
  text-decoration: none;
  transition: opacity 0.2s ease;
}
.logo-link:hover {
  opacity: 0.85;
}
.search-form {
  position: relative;
  width: 100%;
  max-width: 560px;
  height: 44px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 14px;
  border: 1.5px solid #e0e7f2;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.7);
  transition: all 0.25s ease;
}
.search-form:focus-within {
  border-color: #2259d6;
  background: #fff;
  box-shadow:
    0 0 0 4px rgba(34, 89, 214, 0.1),
    0 4px 14px rgba(34, 89, 214, 0.08);
}
.search-icon {
  display: inline-flex;
  color: #9aa9c3;
  flex-shrink: 0;
  transition: color 0.2s ease;
}
.search-form:focus-within .search-icon {
  color: #2259d6;
}
.search-input {
  flex: 1;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  font-size: 15px;
  color: #0a1d40;
}
.search-input::placeholder {
  color: #9aa9c3;
}
.clear-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border: 0;
  border-radius: 50%;
  background: #eef2f7;
  color: #7082a1;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.15s ease;
}
.clear-btn:hover {
  background: #2259d6;
  color: #fff;
  transform: rotate(90deg);
}
.header-nav {
  display: flex;
  justify-content: flex-end;
  gap: 28px;
}
.nav-link {
  position: relative;
  padding: 6px 2px;
  color: #516887;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s ease;
}
.nav-link::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 2px;
  border-radius: 1px;
  background: linear-gradient(90deg, #2259d6, #38bdf8);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.25s ease;
}
.nav-link:hover,
.nav-link.router-link-active {
  color: #2259d6;
}
.nav-link:hover::after,
.nav-link.router-link-active::after {
  transform: scaleX(1);
}
@media (max-width: 820px) {
  .app-header {
    height: auto;
  }
  .header-inner {
    grid-template-columns: 1fr;
    gap: 10px;
    padding: 12px 16px;
  }
  .header-nav {
    display: none;
  }
}
</style>
