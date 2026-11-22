import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { findSearchResults } from '@/search/composables/useSearch'
import { MAX_SEARCH_LENGTH, SEARCH_SUBJECTS, type SearchFilters, type SearchScope, type SearchSubject } from '@/search/query'
import type { SearchResult } from '@/search/types'

export function useSearchPage() {
  const route = useRoute()
  const router = useRouter()
  const queryFromRoute = () => typeof route.query.q === 'string' ? route.query.q.slice(0, MAX_SEARCH_LENGTH) : ''
  const query = ref(queryFromRoute())
  const activeQuery = ref('')
  const results = ref<SearchResult[]>([])
  const loading = ref(false)
  const failed = ref(false)
  const filters = computed<SearchFilters>(() => ({
    scope: route.query.type === 'exam' || route.query.type === 'knowledge' ? route.query.type : 'all',
    subject: SEARCH_SUBJECTS.find((item) => item.id === route.query.subject)?.id ?? '',
  }))

  let timer: ReturnType<typeof setTimeout> | undefined
  let sequence = 0

  async function runSearch(current: string, request: number) {
    const currentFilters = filters.value
    try {
      const found = await findSearchResults(current, currentFilters)
      if (request === sequence) results.value = found
    } catch {
      if (request === sequence) failed.value = true
    } finally {
      if (request === sequence) loading.value = false
    }
  }

  function queueSearch(delay: number) {
    clearTimeout(timer)
    const request = ++sequence
    const current = query.value.trim()
    activeQuery.value = current
    results.value = []
    failed.value = false
    loading.value = !!current
    if (current) timer = setTimeout(() => { void runSearch(current, request) }, delay)
  }

  function routeQuery(scope: SearchScope, subject: SearchSubject | '') {
    return { q: query.value.trim() || undefined, type: scope === 'all' ? undefined : scope, subject: subject || undefined }
  }

  function submit() {
    const { scope, subject } = filters.value
    void router.replace({ name: 'search', query: routeQuery(scope, subject) })
    queueSearch(0)
  }

  function setFilters(scope: SearchScope, subject: SearchSubject | '') {
    if (scope === filters.value.scope && subject === filters.value.subject) return
    void router.replace({ name: 'search', query: routeQuery(scope, subject) })
  }

  watch(() => route.query.q, () => { query.value = queryFromRoute() })
  watch([query, () => filters.value.scope, () => filters.value.subject], () => queueSearch(160), { immediate: true })

  function selectQuery(value: string) {
    query.value = value
    submit()
  }

  async function saveQueryBeforeLeaving() {
    const current = query.value.trim()
    if (current !== queryFromRoute()) {
      await router.replace({ name: 'search', query: routeQuery(filters.value.scope, filters.value.subject) })
    }
  }

  onBeforeUnmount(() => {
    clearTimeout(timer)
    sequence++
  })

  return { query, activeQuery, filters, failed, loading, results, submit, setFilters, selectQuery, saveQueryBeforeLeaving }
}
