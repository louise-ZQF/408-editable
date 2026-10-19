import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  watch,
} from "vue";
import { useRoute, useRouter } from "vue-router";
import { content as contentApi } from "@/content";
import { findSubpointLocationByBlockId } from "@/content/knowledge-articles/registry";
import type { Exam, ExamFilters, ExamSubject } from "@/types";
import type { ExamFilterPatch, ExamFilterSelection } from "./pageTypes";

const PAGE_SIZE = 50;

export function useExamPage() {
  const route = useRoute();
  const router = useRouter();
  const filters = ref<ExamFilters>();
  const exams = ref<Exam[]>([]);
  const loading = ref(false);
  const error = ref("");
  const page = ref(1);
  const total = ref(0);
  const totalPages = ref(0);
  const activeExamId = ref("");
  const selection = reactive<ExamFilterSelection>({
    keyword: "",
    year: route.query.year ? Number(route.query.year) : undefined,
    subject: (route.query.subject as ExamSubject) || "",
    questionType:
      (route.query.questionType as ExamFilterSelection["questionType"]) || "",
    chapter: String(route.query.chapter || ""),
    section: String(route.query.section || ""),
    tag: String(route.query.tag || ""),
    difficulty: undefined,
    knowledgeBlockId: String(
      route.query.knowledgeBlockId || route.query.knowledgeBlockIds || "",
    ),
  });
  let keywordTimer: number | undefined;
  const selectedKnowledgeNames = computed(() => {
    const names = selection.knowledgeBlockId
      .split(",")
      .map((id) => findSubpointLocationByBlockId(id.trim())?.subpointTitle)
      .filter((name): name is string => Boolean(name));
    return [...new Set(names)];
  });
  const currentFilterText = computed(() => {
    const conditions = [
      selection.year ? `${selection.year} 年` : "",
      filters.value?.subjects.find((item) => item.value === selection.subject)
        ?.label || "",
      filters.value?.questionTypes.find(
        (item) => item.value === selection.questionType,
      )?.label || "",
      selection.chapter,
      selection.section,
      selection.tag,
      ...selectedKnowledgeNames.value,
      selection.keyword ? `搜索“${selection.keyword}”` : "",
    ].filter(Boolean);
    return conditions.length
      ? [...new Set(conditions)].join(" · ")
      : "全部真题";
  });
  const hasActiveFilters = computed(() =>
    Boolean(
      selection.keyword ||
      selection.year ||
      selection.subject ||
      selection.questionType ||
      selection.chapter ||
      selection.section ||
      selection.tag ||
      selection.difficulty ||
      selection.knowledgeBlockId,
    ),
  );

  function queryPayload() {
    return {
      keyword: selection.keyword || undefined,
      year: selection.year,
      subject: selection.subject || undefined,
      questionType: selection.questionType || undefined,
      chapter: selection.knowledgeBlockId
        ? undefined
        : selection.chapter || undefined,
      tag: selection.tag || undefined,
      difficulty: selection.difficulty,
      knowledgeBlockIds: selection.knowledgeBlockId || undefined,
      page: page.value,
      pageSize: PAGE_SIZE,
    };
  }

  function buildFilterQuery() {
    const query: Record<string, string> = {};
    if (selection.year != null) query.year = String(selection.year);
    if (selection.subject) query.subject = selection.subject;
    if (selection.questionType) query.questionType = selection.questionType;
    if (selection.chapter) query.chapter = selection.chapter;
    if (selection.section) query.section = selection.section;
    if (selection.tag) query.tag = selection.tag;
    if (selection.knowledgeBlockId)
      query.knowledgeBlockId = selection.knowledgeBlockId;
    if (selection.keyword) query.keyword = selection.keyword;
    return query;
  }

  /** 把当前筛选条件写回 URL（replace 不进历史栈，保留 exam 锚点） */
  function syncFiltersToUrl() {
    const next: Record<string, string> = { ...buildFilterQuery() };
    if (route.query.exam) next.exam = String(route.query.exam);
    router.replace({ query: next });
  }

  function scrollToExam(id: string, smooth = true) {
    activeExamId.value = id;
    document.getElementById(`exam-${id}`)?.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
      block: "start",
    });
    router.replace({ query: { ...buildFilterQuery(), exam: id } });
  }

  async function load(preferredId?: string) {
    loading.value = true;
    error.value = "";
    try {
      const data = await contentApi.getExams(queryPayload());
      exams.value = data.items;
      total.value = data.total;
      totalPages.value = data.totalPages;
      const requested = preferredId ?? String(route.query.exam || "");
      const target = exams.value.find((exam) => exam.id === requested);
      await nextTick();
      if (target) scrollToExam(target.id, false);
      else window.scrollTo({ top: 0 });
      activeExamId.value = target?.id || exams.value[0]?.id || "";
    } catch (reason) {
      error.value =
        reason instanceof Error
          ? reason.message
          : "真题没有加载出来，请确认后端服务已启动。";
    } finally {
      loading.value = false;
    }
  }

  function scheduleKeywordLoad() {
    window.clearTimeout(keywordTimer);
    keywordTimer = window.setTimeout(() => {
      page.value = 1;
      void load();
    }, 260);
  }

  function updateSelection(patch: ExamFilterPatch) {
    Object.assign(selection, patch);
  }

  function resetFilters() {
    Object.assign(selection, {
      keyword: "",
      year: undefined,
      subject: "",
      questionType: "",
      chapter: "",
      section: "",
      tag: "",
      difficulty: undefined,
      knowledgeBlockId: "",
    } satisfies ExamFilterSelection);
    page.value = 1;
    syncFiltersToUrl();
    void load();
  }

  function changePage(nextPage: number) {
    if (
      loading.value ||
      nextPage < 1 ||
      nextPage > totalPages.value ||
      nextPage === page.value
    ) return;
    page.value = nextPage;
    void router.replace({ query: buildFilterQuery() });
    void load("");
  }

  function openSearchPage(term: string) {
    const query = term.trim();
    if (query) router.push({ name: "search", query: { q: query } });
  }

  function updateActiveExam() {
    if (!exams.value.length) return;
    let current = exams.value[0];
    for (const exam of exams.value) {
      const element = document.getElementById(`exam-${exam.id}`);
      if (!element || element.getBoundingClientRect().top > 220) break;
      current = exam;
    }
    activeExamId.value = current.id;
  }

  watch(
    () => [
      selection.year,
      selection.subject,
      selection.questionType,
      selection.chapter,
      selection.section,
      selection.tag,
      selection.difficulty,
      selection.knowledgeBlockId,
    ],
    () => {
      page.value = 1;
      syncFiltersToUrl();
      void load();
    },
  );
  watch(() => selection.keyword, () => {
    syncFiltersToUrl();
    scheduleKeywordLoad();
  });
  watch(
    () =>
      String(
        route.query.knowledgeBlockId || route.query.knowledgeBlockIds || "",
      ),
    (value) => {
      if (value !== selection.knowledgeBlockId)
        selection.knowledgeBlockId = value;
    },
  );
  watch(
    () => [route.query.year, String(route.query.exam || "")] as const,
    ([newYear, newExam], [, oldExam]) => {
      const nextYear =
        newYear != null && !Number.isNaN(Number(newYear))
          ? Number(newYear)
          : undefined;
      if (nextYear !== selection.year) selection.year = nextYear;
      else if (newExam && newExam !== oldExam)
        nextTick(() => scrollToExam(newExam, false));
    },
  );

  onMounted(async () => {
    window.addEventListener("scroll", updateActiveExam, { passive: true });
    try {
      filters.value = await contentApi.getExamFilters();
      await load();
    } catch (reason) {
      error.value =
        reason instanceof Error ? reason.message : "无法连接真题服务。";
    }
  });
  onBeforeUnmount(() => {
    window.removeEventListener("scroll", updateActiveExam);
    window.clearTimeout(keywordTimer);
  });

  return {
    activeExamId,
    changePage,
    currentFilterText,
    error,
    exams,
    filters,
    hasActiveFilters,
    loading,
    openSearchPage,
    page,
    resetFilters,
    scrollToExam,
    selection,
    totalPages,
    updateSelection,
  };
}
