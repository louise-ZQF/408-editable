<script setup lang="ts">
import { ref, watch } from 'vue'
import { Close, Search } from '@element-plus/icons-vue'
import { MAX_SEARCH_LENGTH } from '@/search/query'
import { warmSearch } from '@/search/shared'

const query = defineModel<string>({ required: true })
const emit = defineEmits<{ submit: [] }>()
const input = ref<HTMLInputElement>()

watch(query, (value) => {
  if (value.length > MAX_SEARCH_LENGTH) query.value = value.slice(0, MAX_SEARCH_LENGTH)
})

function clear() {
  query.value = ''
  input.value?.focus()
  emit('submit')
}
</script>

<template>
  <form role="search" class="search-field" @focusin="warmSearch" @pointerenter.once="warmSearch" @submit.prevent="emit('submit')">
    <Search class="search-field-icon" aria-hidden="true" />
    <input
      ref="input"
      v-model="query"
      class="search-input"
      name="q"
      aria-label="搜索"
      :maxlength="MAX_SEARCH_LENGTH"
      placeholder="搜索知识点、题干关键词或真题题号"
      autocomplete="off"
      spellcheck="false"
      enterkeyhint="search"
    />
    <button v-if="query" type="button" class="search-clear" aria-label="清空搜索" @click="clear">
      <Close aria-hidden="true" />
    </button>
    <button type="submit" class="search-btn">搜索</button>
  </form>
</template>

<style scoped>
.search-field {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  padding: 5px;
  padding-left: 14px;
  border: 1px solid #b5c6de;
  border-radius: 12px;
  background: white;
  color: #102446;
  box-shadow: 0 6px 18px #123b6810;
}
.search-field:focus-within {
  border-color: #2855bf;
  outline: 3px solid #2855bf38;
  outline-offset: 1px;
}
.search-field-icon { width: 19px; height: 19px; flex: none; color: #46618a; }
.search-input {
  flex: 1;
  min-width: 0;
  min-height: 44px;
  background: transparent;
  border: 0;
  outline: 0;
  font-size: 16px;
}
.search-input::placeholder { color: #566d8c; }
.search-clear, .search-btn {
  display: inline-grid;
  place-items: center;
  flex: none;
  min-height: 44px;
  border: 0;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}
.search-clear { width: 44px; color: #425a7d; }
.search-clear svg { width: 16px; height: 16px; }
.search-clear:hover { background: #edf2fb; }
.search-btn { min-width: 65px; padding: 0 14px; background: #234db4; color: white; }
.search-btn:hover { background: #163c9a; }
.search-clear:focus-visible, .search-btn:focus-visible {
  outline: 2px solid #2855bf;
  outline-offset: 2px;
}
@media (max-width: 420px) {
  .search-field { gap: 6px; padding-left: 10px; }
  .search-btn { min-width: 52px; padding-inline: 10px; }
}
</style>
