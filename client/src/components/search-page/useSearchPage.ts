import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { findSearchResults } from '@/search/composables/useSearch'
import { MAX_SEARCH_LENGTH, SEARCH_SUBJECTS, type SearchSubject } from '@/search/query'
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
  const subject = computed(() => SEARCH_SUBJECTS.find((item) => item.id === route.query.subject)?.id ?? '')

  let timer: ReturnType<typeof setTimeout> | undefined
  let sequence = 0

  async function runSearch(current: string, request: number) {
    try {
      const found = await findSearchResults(current, { scope: 'knowledge', subject: subject.value })
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

  function routeQuery(selectedSubject: SearchSubject | '') {
    return { q: query.value.trim() || undefined, subject: selectedSubject || undefined }
  }

  function submit() {
    void router.replace({ name: 'search', query: routeQuery(subject.value) })
    queueSearch(0)
  }

  function setSubject(selectedSubject: SearchSubject | '') {
    if (selectedSubject === subject.value) return
    void router.replace({ name: 'search', query: routeQuery(selectedSubject) })
  }

  watch(() => route.query.q, () => { query.value = queryFromRoute() })
  watch([query, subject], () => queueSearch(160), { immediate: true })

  function selectQuery(value: string) {
    query.value = value
    submit()
  }

  async function saveQueryBeforeLeaving() {
    const current = query.value.trim()
    if (current !== queryFromRoute()) {
      await router.replace({ name: 'search', query: routeQuery(subject.value) })
    }
  }

  onBeforeUnmount(() => {
    clearTimeout(timer)
    sequence++
  })

  return { query, activeQuery, subject, failed, loading, results, submit, setSubject, selectQuery, saveQueryBeforeLeaving }
}
