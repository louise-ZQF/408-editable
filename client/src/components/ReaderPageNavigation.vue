<script setup lang="ts">
withDefaults(
  defineProps<{
    page: number;
    totalPages: number;
    disabled?: boolean;
  }>(),
  { disabled: false },
);

const emit = defineEmits<{ page: [page: number] }>();
</script>

<template>
  <nav class="reader-page-navigation" aria-label="前后页导航">
    <button
      type="button"
      :disabled="disabled || page <= 1"
      @click="emit('page', page - 1)"
    >
      <span aria-hidden="true">←</span> 上一页
    </button>
    <span class="reader-page-navigation__count" aria-live="polite" aria-atomic="true">
      {{ totalPages > 0 ? page : 0 }} / {{ totalPages }}
    </span>
    <button
      type="button"
      :disabled="disabled || page >= totalPages"
      @click="emit('page', page + 1)"
    >
      下一页 <span aria-hidden="true">→</span>
    </button>
  </nav>
</template>

<style scoped>
.reader-page-navigation {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 28px;
  padding: 0 8px;
}
.reader-page-navigation button {
  min-height: 44px;
  padding: 8px 12px;
  border: 1px solid #d4dce7;
  border-radius: 6px;
  background: #fff;
  color: #475569;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: color .15s, border-color .15s, background-color .15s;
}
.reader-page-navigation button:hover:enabled {
  border-color: #8ea7d9;
  background: #f7f9fc;
  color: #12327f;
}
.reader-page-navigation button:focus-visible {
  outline: 2px solid #31559e;
  outline-offset: 3px;
}
.reader-page-navigation button:disabled {
  cursor: default;
  opacity: .35;
}
.reader-page-navigation__count {
  color: #64748b;
  font-size: 13px;
  font-variant-numeric: tabular-nums;
}
</style>
