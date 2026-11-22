<script setup lang="ts">
import { ArrowRight, Connection, Cpu, Monitor, Share } from '@element-plus/icons-vue'
import BrandLogo from '@/components/BrandLogo.vue'
import SearchBox from '@/components/home-page/SearchBox.vue'
import ContributorsSection from '@/components/home-page/ContributorsSection.vue'
import { knowledgeBooks } from '@/content/knowledge-tree'
import { workspace } from '@/editor/store'

const subjectIcons = { DATA_STRUCTURES: Connection, COMPUTER_ORGANIZATION: Cpu, OPERATING_SYSTEMS: Monitor, NETWORK: Share }

function subjectIcon(subject: string) {
  return subjectIcons[subject as keyof typeof subjectIcons] ?? Connection
}
</script>

<template>
  <main class="home-page min-h-screen bg-[#f7f9fc] text-[#122748]">
    <header class="border-b border-[#dfe7f2] bg-white">
      <div class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 px-5 py-2.5 sm:px-8">
        <BrandLogo v-if="workspace.settings.showLogo" class="min-h-11" />
        <nav aria-label="主导航" class="flex flex-wrap items-center gap-x-4 text-sm font-semibold text-[#365181] sm:gap-x-6">
          <RouterLink v-if="workspace.settings.showKnowledge" to="/knowledge" class="home-nav">{{ workspace.settings.knowledgeLabel }}</RouterLink>
          <RouterLink v-if="workspace.settings.showExams" to="/exams" class="home-nav">{{ workspace.settings.examsLabel }}</RouterLink>
          <a v-if="workspace.settings.showRepo" :href="'https://github.com/' + workspace.settings.repository" class="home-nav" target="_blank" rel="noopener noreferrer">GitHub</a>
        </nav>
      </div>
    </header>

    <div class="mx-auto max-w-6xl px-5 py-6 sm:px-8 sm:py-10">
      <section class="home-hero rounded-3xl border border-[#d6e2f4] px-5 py-8 sm:px-12 sm:py-12">
        <p v-if="workspace.settings.tagline" class="m-0 text-sm font-semibold tracking-wide text-[#375a94]">{{ workspace.settings.tagline }}</p>
        <h1 class="mb-3 mt-2 text-balance text-[clamp(2.1rem,5vw,4rem)] font-bold leading-[1.14] tracking-tight">{{ workspace.settings.headline }}</h1>
        <p v-if="workspace.settings.showSubtitle && workspace.settings.lines.some(Boolean)" class="m-0 text-base leading-relaxed text-[#435a7f] sm:text-lg">{{ workspace.settings.lines.find(Boolean) }}</p>
        <SearchBox v-if="workspace.settings.showSearch" class="mt-6 max-w-2xl" />
      </section>

      <section v-if="workspace.settings.showKnowledge && knowledgeBooks.length" class="mt-8 sm:mt-10">
        <h2 class="mb-4 text-xl font-bold tracking-tight">按科目学习</h2>
        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <RouterLink
            v-for="book in knowledgeBooks"
            :key="book.id"
            :to="{ name: 'knowledge', params: { bookId: book.id } }"
            class="group flex min-h-24 items-center gap-3 rounded-xl border border-[#dce5f1] bg-white p-4 transition-colors hover:border-[#7d9bd2] hover:bg-[#f7faff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2855bf]"
          >
            <span class="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#e9effc] text-[#2b53ae]">
              <component :is="subjectIcon(book.subject)" class="h-5 w-5" aria-hidden="true" />
            </span>
            <span class="min-w-0 flex-1">
              <span class="block text-sm font-bold leading-snug">{{ book.title }}</span>
              <span class="mt-1 block text-xs text-[#516584]">{{ book.chapters.length }} 章</span>
            </span>
            <ArrowRight class="h-4 w-4 shrink-0 text-[#526c95] group-hover:text-[#234db4]" aria-hidden="true" />
          </RouterLink>
        </div>
      </section>
    </div>

    <ContributorsSection v-if="workspace.settings.showContributors" class="overflow-hidden" />
  </main>
</template>

<style scoped>
.home-hero {
  background:
    radial-gradient(ellipse at 100% 0, #cbdcfc 0%, transparent 52%),
    linear-gradient(130deg, #f1f6ff, #e9f1ff);
}
.home-nav {
  display: inline-flex;
  min-height: 44px;
  align-items: center;
}
.home-nav:hover { color: #234db4; }
.home-nav:focus-visible { outline: 2px solid #2855bf; outline-offset: 2px; border-radius: 3px; }
</style>
