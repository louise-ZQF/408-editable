<script setup lang="ts">
import { workspace } from '@/editor/store'
import { onMounted } from "vue";
import BackgroundFx from "@/components/home-page/BackgroundFx.vue";
import LogoBrand from "@/components/home-page/LogoBrand.vue";
import TypeWriter from "@/components/home-page/TypeWriter.vue";
import GitHubRepoLink from "@/components/home-page/GitHubRepoLink.vue";
import SearchBox from "@/components/home-page/SearchBox.vue";
import CtaButtons from "@/components/home-page/CtaButtons.vue";
import ContributorsSection from "@/components/home-page/ContributorsSection.vue";
import { warmSearch } from "@/search/shared";

onMounted(() => {
  // 首屏渲染完成后，浏览器空闲时统一预热搜索索引、并预取知识/真题页 chunk。
  // 不放在 onMounted 立即执行：搜索索引(约1.5MB json) + segmentit 分词器(3.4MB chunk)
  // 若首屏就下载会抢关键带宽；搜索框已另行在 pointerenter/focus 时触发 warmSearch，
  // 这里仅作兜底预热，保证点击搜索前索引就已就绪。
  const warmAndPrefetch = () => {
    warmSearch();
    import("@/views/KnowledgePage.vue").catch(() => {});
    import("@/views/ExamPage.vue").catch(() => {});
  };
  if ("requestIdleCallback" in window) {
    (window as any).requestIdleCallback(warmAndPrefetch, { timeout: 4000 });
  } else {
    setTimeout(warmAndPrefetch, 2500);
  }
});
</script>

<template>
  <main
    class="home-page relative min-h-screen overflow-hidden px-6 py-14 pb-18 font-sans text-[#0b1f45] md:py-16 lg:py-[56px]"
  >
    <!-- 鼠标跟随背景层（渐变底色 + 光斑 + 网格） -->
    <BackgroundFx />

    <section class="relative z-[1] w-full max-w-[980px] mx-auto text-center">
      <div class="text-sm tracking-[0.28em] text-[#5c6f94] font-bold">
        {{ workspace.settings.tagline }}
      </div>

      <LogoBrand v-if="workspace.settings.showLogo" />

      <h1 class="mt-[42px] mb-[18px] text-[clamp(63px,7vw,102px)] leading-[1.05] tracking-[-0.045em] font-[850]">
        {{ workspace.settings.headline }}
      </h1>

      <TypeWriter v-if="workspace.settings.showSubtitle" />

      <GitHubRepoLink v-if="workspace.settings.showRepo" />

      <SearchBox v-if="workspace.settings.showSearch" />

      <CtaButtons />
    </section>

    <ContributorsSection v-if="workspace.settings.showContributors" />
  </main>
</template>
