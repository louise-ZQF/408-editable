<script setup lang="ts">
import { workspace } from '@/editor/store'
import { ICON_GITHUB, ICON_EXTERNAL_LINK } from "../icons";

/** GitHub 仓库地址 */
const GITHUB_REPO_URL =
  "https://github.com/liangbohan/postgraduate-exam-website";
</script>

<template>
  <a
    :href="'https://github.com/' + workspace.settings.repository"
    target="_blank"
    rel="noopener noreferrer"
    class="github-repo-link mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm text-[#4f6aa0] hover:text-[#1d4ed8] hover:border-[#b9cdf0] hover:bg-white transition-all duration-200 hover:-translate-y-px hover:shadow-md"
  >
    <span
      v-html="ICON_GITHUB"
      class="inline-flex items-center justify-center"
    />
    <span>Github 开源仓库</span>
    <span
      v-html="ICON_EXTERNAL_LINK"
      class="inline-flex items-center justify-center opacity-80"
    />
  </a>
</template>
