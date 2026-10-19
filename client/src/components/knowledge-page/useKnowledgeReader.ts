import { computed, nextTick, onMounted, ref, watch } from "vue";
import { revision } from '@/editor/store';
import { flushInlineDrafts, inlineFeedback } from '@/editor/inline';
import { onBeforeRouteLeave, onBeforeRouteUpdate, useRoute, useRouter } from "vue-router";
import { content, knowledgeBooks } from "@/content";
import { getArticleForPoint } from "@/content/knowledge-articles/registry";
import type { KnowledgeArticleData } from "@/content/knowledge-articles/types";
import type { Book, ExamKnowledgeLink, KnowledgePoint, Section } from "@/types";
import type { SectionArticleEntry } from "./pageTypes";

/** 未登记独立文章的 point 的回退文章：仅展示知识点摘要。 */
function buildFallbackArticle(point: KnowledgePoint): KnowledgeArticleData {
  return {
    pointId: point.id,
    subpoints: [
      {
        id: `${point.id}-overview`,
        title: "核心概念",
        blocks: [
          {
            id: `kb-${point.id}-overview-1`,
            type: "paragraph",
            text: point.summary,
          },
        ],
      },
    ],
  };
}

export function useKnowledgeReader() {
  const route = useRoute();
  const router = useRouter();
  const book = ref<Book>();
  const section = ref<Section>();
  const articleEntries = ref<SectionArticleEntry[]>([]);
  const loading = ref(true);
  const error = ref("");

  const books = knowledgeBooks;
  const routeContentId = computed(() => String(route.params.sectionId || ""));
  const bookId = computed(() =>
    String(route.params.bookId || books[0]?.id || "computer-network"),
  );
  const requestedBlock = computed(() => String(route.query.block || ""));
  const tocEntries = computed(() =>
    articleEntries.value.map((entry) => ({
      id: entry.point.id,
      title: entry.point.title,
      article: entry.article,
    })),
  );
  const sectionExam = computed(() => {
    const blockIds = new Set<string>();
    const examIds = new Set<string>();
    for (const entry of articleEntries.value) {
      for (const link of entry.examLinks) {
        blockIds.add(link.knowledgeBlockId);
        examIds.add(link.examId);
      }
    }
    return { blockIds: Array.from(blockIds), examCount: examIds.size };
  });

  function findSelectedSection(id: string) {
    if (!book.value) return undefined;
    for (const chapter of book.value.chapters) {
      for (const candidate of chapter.sections) {
        if (
          candidate.id === id ||
          candidate.points.some((point) => point.id === id)
        )
          return candidate;
      }
    }
    return undefined;
  }

  const activeSectionId = computed(
    () =>
      findSelectedSection(routeContentId.value)?.id || section.value?.id || "",
  );

  const sections = computed(() =>
    book.value?.chapters.flatMap((chapter) => chapter.sections) ?? [],
  );
  const page = computed(() =>
    sections.value.findIndex((item) => item.id === activeSectionId.value) + 1,
  );
  const totalPages = computed(() => sections.value.length);

  function changePage(nextPage: number) {
    if (loading.value || nextPage === page.value) return;
    const target = sections.value[nextPage - 1];
    if (target) selectSection(target.id);
  }

  function scrollToRequestedBlock(retry = 0) {
    const id = requestedBlock.value;
    if (!id) return;
    const element = document.getElementById(id);
    if (element) {
      const top =
        element.getBoundingClientRect().top +
        window.scrollY -
        window.innerHeight / 2;
      document.documentElement.scrollTop = Math.max(0, top);
    } else if (retry < 5) {
      setTimeout(() => scrollToRequestedBlock(retry + 1), 100);
    }
  }

  let loadSequence = 0;
  async function loadSection(id: string, background = false) {
    const sequence = ++loadSequence;
    if (!book.value) return;
    if (!background) loading.value = true;
    error.value = "";
    try {
      const nextSection = findSelectedSection(id);
      if (!nextSection) {
        const firstSection = book.value.chapters.flatMap(chapter => chapter.sections)[0];
        if (firstSection) {
          await router.replace({
            name: "knowledge",
            params: { bookId: bookId.value, sectionId: firstSection.id },
            query: route.query,
          });
        } else { section.value = undefined; articleEntries.value = []; }
        return;
      }
      if (id !== nextSection.id) {
        await router.replace({
          name: "knowledge",
          params: { bookId: bookId.value, sectionId: nextSection.id },
          query: route.query,
        });
        return;
      }

      const nextEntries = await Promise.all(
        nextSection.points.map(async (point) => ({
          point,
          article:
            (await getArticleForPoint(point.id)) ??
            buildFallbackArticle(point),
        })),
      );
      const blockIds = nextEntries.flatMap(({ article }) =>
        article.subpoints.flatMap((subpoint) =>
          subpoint.blocks.map((block) => block.id),
        ),
      );
      let links: ExamKnowledgeLink[] = [];
      try {
        links = await content.getKnowledgeLinks(blockIds);
      } catch {
        // 真题接口不可用时仍然优先显示静态知识正文。
      }

      if (sequence !== loadSequence) return;
      section.value = nextSection;
      articleEntries.value = nextEntries.map(({ point, article }) => {
        const articleBlockIds = new Set(
          article.subpoints.flatMap((subpoint) =>
            subpoint.blocks.map((block) => block.id),
          ),
        );
        return {
          point,
          article,
          examLinks: links.filter((link) =>
            articleBlockIds.has(link.knowledgeBlockId),
          ),
        };
      });
    } catch {
      error.value = "本节内容没有加载出来，请检查知识目录与文章注册。";
    } finally {
      if (sequence === loadSequence) {
        loading.value = false;
        await nextTick();
        if (!background) scrollToRequestedBlock();
      }
    }
  }

  async function loadBook(background = false) {
    if (!background) loading.value = true;
    error.value = "";
    try {
      book.value = await content.getBook(bookId.value);
      if (!book.value) { section.value = undefined; articleEntries.value = []; loading.value = false; return; }
      if (book.value.id !== bookId.value) { await router.replace({ name: 'knowledge', params: { bookId: book.value.id } }); return; }
      if (!routeContentId.value) {
        const firstSection = book.value.chapters.flatMap(chapter => chapter.sections)[0];
        if (firstSection) {
          await router.replace({
            name: "knowledge",
            params: { bookId: bookId.value, sectionId: firstSection.id },
          });
        }
        loading.value = false;
        return;
      }
      await loadSection(routeContentId.value, background);
    } catch {
      error.value = "知识目录没有加载出来，请检查 content/knowledge-tree.ts。";
      loading.value = false;
    }
  }

  function selectSection(id: string) {
    router.push({
      name: "knowledge",
      params: { bookId: bookId.value, sectionId: id },
    });
  }

  function selectBook(id: string) {
    router.push({
      name: "knowledge",
      params: { bookId: id, sectionId: undefined },
    });
  }

  watch(loading, (isLoading) => {
    if (!isLoading && section.value && requestedBlock.value) {
      nextTick().then(() => scrollToRequestedBlock(0));
    }
  });
  watch(requestedBlock, () => {
    if (!section.value || loading.value) return;
    nextTick().then(() => scrollToRequestedBlock(0));
  });
  watch(bookId, () => void loadBook());
  watch(routeContentId, (id) => {
    if (!id || !book.value || book.value.id !== bookId.value) return;
    void loadSection(id);
  });
  watch(revision, () => void loadBook(true));
  async function saveBeforeNavigation() { try { await flushInlineDrafts() } catch (error) { inlineFeedback(error instanceof Error ? error.message : String(error), true); return false } }
  onBeforeRouteLeave(saveBeforeNavigation);
  onBeforeRouteUpdate(saveBeforeNavigation);
  onMounted(() => void loadBook());

  return {
    activeSectionId,
    articleEntries,
    book,
    bookId,
    books,
    changePage,
    error,
    loading,
    page,
    section,
    sectionExam,
    selectBook,
    selectSection,
    tocEntries,
    totalPages,
  };
}
