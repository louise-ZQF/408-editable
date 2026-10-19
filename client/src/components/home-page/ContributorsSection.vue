<script setup lang="ts">
import { computed } from 'vue'
import { workspace } from '@/editor/store'
import { ICON_BILIBILI, ICON_DOUYIN, ICON_XHS, ICON_GITHUB } from "../icons";

type ContributorPlatform = "bilibili" | "douyin" | "xhs" | "github";

type Contributor = {
  name: string;
  platform: ContributorPlatform;
  url: string;
};

const ALL_CONTRIBUTORS: Contributor[] = [
  {
    name: "11408考研良子",
    platform: "bilibili",
    url: "https://space.bilibili.com/385409016",
  },
  {
    name: "恐惧之鲸",
    platform: "github",
    url: "https://github.com/TerrifyingWhale",
  },
  {
    name: "Spr_Aachen",
    platform: "github",
    url: "https://github.com/Spr-Aachen",
  },
  {
    name: "JustJustGood",
    platform: "bilibili",
    url: "https://space.bilibili.com/278414435",
  },
  {
    name: "Verthandii",
    platform: "github",
    url: "https://github.com/Verthandii",
  },
  {
    name: "panko12138",
    platform: "github",
    url: "https://github.com/panko12138",
  },
];

/* 共建者区域：数据源来自 @/content/contributors.ts
 * 两行数据源互不重复，按奇偶拆分 */
const PLATFORM_ICON: Record<Contributor["platform"], string> = {
  bilibili: ICON_BILIBILI,
  douyin: ICON_DOUYIN,
  xhs: ICON_XHS,
  github: ICON_GITHUB,
};

// 数据源按奇偶拆成两行
const row1Raw: Contributor[] = [];
const row2Raw: Contributor[] = [];
for (let i = 0; i < ALL_CONTRIBUTORS.length; i++) {
  if (i % 2 === 0) row1Raw.push(ALL_CONTRIBUTORS[i]);
  else row2Raw.push(ALL_CONTRIBUTORS[i]);
}

// 贡献者较少时，循环重复同一个人把行铺满，确保滚动条始终有内容可滚
const MIN_PER_ROW = 8;
function fillRow(row: Contributor[]): Contributor[] {
  if (row.length === 0) return [];
  if (row.length >= MIN_PER_ROW) return [...row];
  const out: Contributor[] = [];
  let i = 0;
  while (out.length < MIN_PER_ROW) {
    out.push(row[i % row.length]);
    i++;
  }
  return out;
}

const people = computed<Contributor[]>(() => { try { return workspace.settings.contributorsJSON.trim() ? JSON.parse(workspace.settings.contributorsJSON) : ALL_CONTRIBUTORS } catch { return ALL_CONTRIBUTORS } })
const contributorsRow1 = computed(() => fillRow(people.value.filter((_, i) => i % 2 === 0)))
const contributorsRow2 = computed(() => fillRow(people.value.filter((_, i) => i % 2 !== 0)))
</script>

<template>
  <section class="contributors-section">
    <h2 class="contributors-title">{{ workspace.settings.contributorTitle }}</h2>
    <p class="contributors-subtitle">{{ workspace.settings.contributorSubtitle }}</p>

    <div class="contributors-viewport">
      <div class="contributors-row contributors-row-left">
        <a
          v-for="(c, i) in [...contributorsRow1, ...contributorsRow1]"
          :key="'r1-' + i"
          :href="c.url"
          target="_blank"
          rel="noopener noreferrer"
          class="contributor-pill"
          :class="'platform-' + c.platform"
        >
          <span
            class="contributor-icon"
            v-html="PLATFORM_ICON[c.platform]"
          ></span>
          <span class="contributor-name">{{ c.name }}</span>
        </a>
      </div>
      <div class="contributors-row contributors-row-right">
        <a
          v-for="(c, i) in [...contributorsRow2, ...contributorsRow2]"
          :key="'r2-' + i"
          :href="c.url"
          target="_blank"
          rel="noopener noreferrer"
          class="contributor-pill"
          :class="'platform-' + c.platform"
        >
          <span
            class="contributor-icon"
            v-html="PLATFORM_ICON[c.platform]"
          ></span>
          <span class="contributor-name">{{ c.name }}</span>
        </a>
      </div>
    </div>

    <a
      href="https://github.com/liangbohan/postgraduate-exam-website/graphs/contributors"
      target="_blank"
      rel="noopener noreferrer"
      class="contributors-more"
    >
      查看全部贡献者 →
    </a>
  </section>
</template>

<style scoped>
/* 共建者区域：两行横向无限循环滚动
 *  - 极简、克制，蓝白配色
 *  - 第一行向左，第二行向右，错位
 *  - hover 区域暂停滚动
 *  - 左右渐隐 mask */
.contributors-section {
  position: relative;
  z-index: 1;
  max-width: 980px;
  margin: 110px auto 0;
  padding: 36px 0 28px;
  text-align: center;
}
.contributors-title {
  margin: 0 0 10px;
  font-size: 26px;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: #0b1f45;
}
.contributors-subtitle {
  margin: 0 0 24px;
  font-size: 14px;
  color: #74809a;
}

/* 滚动视口：左右渐隐 mask */
.contributors-viewport {
  position: relative;
  overflow: hidden;
  -webkit-mask-image: linear-gradient(
    to right,
    transparent,
    #000 10%,
    #000 90%,
    transparent
  );
  mask-image: linear-gradient(
    to right,
    transparent,
    #000 10%,
    #000 90%,
    transparent
  );
}

/* 两行各自横向滚动，hover 时暂停 */
.contributors-row {
  display: flex;
  gap: 14px;
  width: max-content;
  padding: 6px 0;
}
.contributors-row-left {
  animation: scroll-left 48s linear infinite;
}
.contributors-row-right {
  animation: scroll-right 56s linear infinite;
  /* 第二行错位：往右偏移半个 pill 宽度 */
  transform: translateX(40px);
}
.contributors-section:hover .contributors-row {
  animation-play-state: paused;
}
@keyframes scroll-left {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}
@keyframes scroll-right {
  from {
    transform: translateX(40px);
  }
  to {
    transform: translateX(calc(-50% + 40px));
  }
}

/* 单个 pill */
.contributor-pill {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  height: 36px;
  padding: 0 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(219, 228, 239, 0.7);
  text-decoration: none;
  color: #536987;
  font-size: 13px;
  font-weight: 500;
  flex-shrink: 0;
  transition: all 0.2s ease;
  cursor: pointer;
}
.contributor-pill:hover {
  background: #fff;
  border-color: #2d68ef;
  transform: translateY(-1px);
  color: #2259d6;
}
.contributor-icon {
  display: inline-flex;
  color: #9aa9c3;
  transition: color 0.2s ease;
}
/* hover 时恢复品牌色 */
.contributor-pill:hover .contributor-icon {
  color: #9aa9c3;
}
.contributor-pill.platform-bilibili:hover .contributor-icon {
  color: #fb7299;
}
.contributor-pill.platform-douyin:hover .contributor-icon {
  color: #000;
}
.contributor-pill.platform-xhs:hover .contributor-icon {
  color: #ff2741;
}
.contributor-pill.platform-github:hover .contributor-icon {
  color: #0b1f45;
}

/* 底部"查看全部"链接 */
.contributors-more {
  display: inline-block;
  margin-top: 24px;
  font-size: 13px;
  color: #2259d6;
  text-decoration: none;
  opacity: 0.85;
  transition: opacity 0.2s ease;
}
.contributors-more:hover {
  opacity: 1;
  text-decoration: underline;
}

@media (max-width: 640px) {
  .contributors-title {
    font-size: 22px;
  }
  .contributors-row {
    gap: 10px;
  }
  .contributor-pill {
    height: 32px;
    padding: 0 12px;
    font-size: 12px;
  }
}
</style>
