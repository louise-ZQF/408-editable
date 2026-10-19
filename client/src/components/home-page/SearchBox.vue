<script setup lang="ts">
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { warmSearch } from "@/search/shared";

const router = useRouter();
const query = ref("");

/** 输入字符上限：超过自动截断到前 20 字 */
const MAX_QUERY_LEN = 20;
watch(query, (v) => {
  if (v && v.length > MAX_QUERY_LEN) {
    query.value = v.slice(0, MAX_QUERY_LEN);
  }
});

function onSearchKeydown(e: KeyboardEvent) {
  if (e.key === "Enter") {
    e.preventDefault();
    submit();
  }
}

function submit() {
  const q = query.value.trim();
  if (!q) return;
  router.push({ name: "search", query: { q } });
}
</script>

<template>
  <form
    class="h-[78px] mt-[38px] mx-auto w-full max-w-[920px] border border-[#dbe4ef] rounded-[28px] flex items-center px-[14px] pl-7 bg-white/94 shadow-[0_18px_45px_rgba(52,87,150,0.1)]"
    @pointerenter="warmSearch"
    @submit.prevent="submit"
  >
    <input
      v-model="query"
      :maxlength="MAX_QUERY_LEN"
      name="q"
      placeholder="搜索知识点或章节（如 CPU 流水线 / GBN / 中断隐指令）"
      autocomplete="off"
      class="flex-1 border-0 outline-0 bg-transparent text-xl text-[#0b1f45] placeholder:text-[#9aa9c3]"
      @focus="warmSearch"
      @keydown="onSearchKeydown"
    />
    <button
      type="submit"
      class="search-btn w-[52px] h-[52px] border-0 rounded-full bg-gradient-to-b from-[#2d68ef] to-[#2455da] text-white text-2xl cursor-pointer"
    >
      →
    </button>
  </form>
</template>

<style scoped>
.search-btn {
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease;
}
.search-btn:hover {
  transform: scale(1.06);
  box-shadow: 0 8px 18px rgba(45, 104, 239, 0.32);
}
.search-btn:active {
  transform: scale(0.96);
}
</style>
