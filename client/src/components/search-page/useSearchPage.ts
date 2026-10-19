import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useSearch } from "@/search/composables/useSearch";
import type { SearchResult } from "@/search/types";

const MAX_QUERY_LEN = 20;
const PAGE_SIZE = 10;

export function useSearchPage() {
  const route = useRoute();
  const router = useRouter();
  const loading = ref(false);
  const results = ref<SearchResult[]>([]);
  const exacts = ref<SearchResult[]>([]);
  const page = ref(1);
  const { query, search, dispose } = useSearch({ topK: 8 });

  const mergedResults = computed(() => [...exacts.value, ...results.value]);
  const total = computed(() => mergedResults.value.length);
  const totalPages = computed(() =>
    Math.max(1, Math.ceil(total.value / PAGE_SIZE)),
  );
  const pagedResults = computed(() => {
    const start = (page.value - 1) * PAGE_SIZE;
    return mergedResults.value.slice(start, start + PAGE_SIZE);
  });

  watch(query, (value) => {
    if (value.length > MAX_QUERY_LEN)
      query.value = value.slice(0, MAX_QUERY_LEN);
  });

  function clearResults() {
    results.value = [];
    exacts.value = [];
  }

  function applyResults(outcome: Awaited<ReturnType<typeof search>>) {
    if (!outcome) return;
    exacts.value = outcome.exact;
    results.value = outcome.results;
    page.value = 1;
  }

  async function runInitialSearch(value: string) {
    if (!value.trim()) {
      clearResults();
      return;
    }
    loading.value = true;
    try {
      applyResults(await search(value));
    } finally {
      loading.value = false;
    }
  }

  async function runLiveSearch() {
    if (!query.value.trim()) {
      clearResults();
      loading.value = false;
      return;
    }
    loading.value = true;
    try {
      applyResults(await search());
    } finally {
      loading.value = false;
    }
  }

  function submit() {
    const q = query.value.trim();
    if (q) router.replace({ name: "search", query: { q } });
  }

  function openResult(result: SearchResult) {
    router.push(result.route);
  }

  function goToPage(nextPage: number) {
    if (nextPage < 1 || nextPage > totalPages.value) return;
    page.value = nextPage;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  let initialized = false;
  onMounted(() => {
    const initialQuery = String(route.query.q || "").trim();
    if (!initialQuery) {
      initialized = true;
      return;
    }
    query.value = initialQuery;
    runInitialSearch(initialQuery).finally(() => {
      initialized = true;
    });
  });

  watch(query, () => {
    if (initialized) void runLiveSearch();
  });

  watch(
    () => route.query.q,
    (newQuery) => {
      if (typeof newQuery === "string" && newQuery !== query.value)
        query.value = newQuery;
    },
  );

  onBeforeUnmount(dispose);

  return {
    loading,
    page,
    pageSize: PAGE_SIZE,
    pagedResults,
    query,
    submit,
    total,
    totalPages,
    goToPage,
    openResult,
  };
}
