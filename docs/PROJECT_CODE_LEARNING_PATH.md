# 408 电子教材项目代码学习路径

> 目标：先建立完整心智模型，再依次掌握搜索、数据组织、页面布局和交互细节。
>
> 建议节奏：每天 1.5～2 小时，持续 4～5 周。以下时间都是“专注学习时间”，不包含长时间自行扩展功能。

## 0. 先明确学习方法

这个项目不适合从 `HomePage.vue` 第一行一路读到底。更有效的方法是围绕一条真实数据流，逐层追踪：

```text
静态源数据
  ├─ knowledge-tree.ts + knowledge-articles/*.ts
  └─ public/exams/<year>/paper.json
             ↓
构建期脚本生成轻量索引
             ↓
浏览器中的 Repository / Search 模块读取数据
             ↓
Vue 页面组织状态
             ↓
组件渲染 Markdown、公式、图片、动画和交互
```

每学习一个模块，都使用下面的四步法：

1. **入口**：谁调用它？
2. **输入输出**：它接收什么，返回什么？
3. **状态变化**：数据在哪一步被过滤、转换或缓存？
4. **最小实验**：只改一个可观察值，确认自己真的理解了。

不要只读代码。每完成一个阶段，必须做文档中的“小实验”和“完成标准”。

---

## 总体时间表

| 阶段 | 内容 | 预计时间 |
| --- | --- | ---: |
| 阶段 0 | 运行项目、建立调试基线 | 1.5～2 小时 |
| 阶段 1 | 项目总体架构与三条数据链 | 5～6 小时 |
| 阶段 2 | 搜索索引、中文分词、检索与高亮 | 9～12 小时 |
| 阶段 3 | 知识、真题及二者关联的数据组织 | 10～13 小时 |
| 阶段 4 | 知识页、真题页的布局与交互 | 11～14 小时 |
| 阶段 5 | Markdown、公式、动画等渲染细节 | 4～6 小时 |
| 阶段 6 | 构建、校验、部署与综合练习 | 4～6 小时 |
| **总计** |  | **44.5～59 小时** |

如果每天学习 2 小时，约需 23～30 天；已有 Vue 3 和 TypeScript 基础时，可压缩到约 35～40 小时。

---

# 阶段 0：建立可运行、可观察的基线

预计时间：1.5～2 小时。

## 0.1 先读哪些文件

按顺序阅读：

1. `AGENTS.md`
2. `README.md`
3. 根目录 `package.json`
4. `client/package.json`
5. `client/vite.config.ts`

只需先回答：

- 为什么根目录和 `client/` 各有一个 `package.json`？
- 为什么 `npm run dev` 启动 Vite 前，要先重建真题索引和搜索索引？
- `@` 为什么可以代表 `client/src`？
- 为什么静态站点必须使用 `createWebHashHistory()`？

## 0.2 动手建立调试基线

在项目根目录执行：

```bash
npm run dev
```

然后依次访问：

- `/#/`
- `/#/knowledge`
- `/#/exams`
- `/#/search?q=索引节点`

打开浏览器开发者工具，重点观察：

- Network 中哪些 `.js` 是路由懒加载 chunk；
- `/search/*.json` 何时下载；
- `/exams/index.json` 和 `/exams/<year>/paper.json` 何时下载；
- 刷新 Hash 路由为什么不会请求一个不存在的服务器路径。

## 0.3 完成标准

不看文档，可以解释下面这条命令链：

```text
npm run dev
→ rebuild:exams
→ build-search-index.cjs
→ client 中启动 Vite
```

---

# 阶段 1：建立项目总体心智模型

预计时间：5～6 小时，建议分 3 次完成。

## 1.1 应用从哪里启动（1 小时）

按顺序阅读：

1. `client/index.html`
2. `client/src/main.ts`
3. `client/src/App.vue`
4. `client/src/router/index.ts`

阅读重点：

- `main.ts` 如何安装 Router、Element Plus 和全局样式；
- `App.vue` 的 `<RouterView />` 为什么是所有页面的出口；
- 页面组件为什么都使用动态 `import()`；
- `isNavigating` 如何通过路由守卫驱动全局加载遮罩；
- `scrollBehavior` 处理了哪两类滚动恢复。

小实验：

1. 临时在 `router.beforeEach` 和 `router.afterEach` 中打断点；
2. 从首页进入知识页；
3. 观察路由状态、页面 chunk 下载和加载遮罩出现的先后顺序；
4. 实验结束后撤销临时调试代码。

## 1.2 先认识四个页面入口（1.5 小时）

只读每个文件的 `<script setup>` 顶部、状态声明和 `onMounted`，暂时不要钻 CSS：

1. `client/src/views/HomePage.vue`
2. `client/src/views/SearchPage.vue`
3. `client/src/views/KnowledgePage.vue`
4. `client/src/views/ExamPage.vue`

给每个页面写一张“输入—状态—输出”卡片：

| 页面 | 路由输入 | 关键状态 | 数据入口 | 主要输出 |
| --- | --- | --- | --- | --- |
| 首页 | 无 | 搜索词、打字机、鼠标位置 | `contributors.ts` | 导航与搜索入口 |
| 搜索页 | `q` | loading、results、page | `useSearch()` | 知识/真题搜索结果 |
| 知识页 | `bookId`、`sectionId`、`block` | book、section、articleEntries、左右栏状态 | `content`、`registry.ts` | 多篇知识文章 |
| 真题页 | year、subject、knowledgeBlockIds 等 | filters、exams、page、活动题目 | `examRepository.ts` | 连续卷面与筛选器 |

## 1.3 掌握三条核心数据链（2～2.5 小时）

### 知识链

```text
knowledge-tree.ts
  → Section.points
  → registry.ts / resolveKnowledgeArticle()
  → KnowledgePage.loadSection()
  → KnowledgeArticle.vue
  → KnowledgeMarkdown / ManimCodePlayer
```

### 真题链

```text
public/exams/<year>/paper.json
  → rebuild-exam-index.mjs
  → manifest.json + index.json
  → examRepository.ts
  → ExamPage.vue
  → ExamPaperItem.vue
```

### 搜索链

```text
知识树 + 文章 + 真题 index.json
  → build-search-index.cjs
  → public/search/*.json
  → shared.ensureCorpusLoaded()
  → useSearch()
  → searchKnowledge / searchExam
  → SearchPage.vue
```

## 1.4 当前架构中特别要知道的一点

当前 `client/src/content/knowledge-articles/registry.ts` 是**静态 import 全部文章**的总注册表。知识页和真题仓库只要引用它，就可能把大量文章代码带入同一依赖链。首页中的 `prefetchChunks()` 会在空闲时间预取知识页与真题页，以减轻第一次点击时等待 chunk 的感受。

学习时务必区分：

- **路由懒加载**：页面组件用到时才下载；
- **模块内部静态导入**：页面 chunk 一旦加载，静态依赖也必须加载；
- **fetch 静态 JSON**：代码已经运行后，再从 `public/` 获取数据；
- **预热**：提前触发上述加载，但不改变数据模型。

## 1.5 完成标准

你能在一张纸上画出上述三条数据链，并指出：

- 哪些步骤发生在 Node 构建期；
- 哪些步骤发生在浏览器运行时；
- 哪些是 TypeScript 模块导入；
- 哪些是 HTTP `fetch`；
- 哪些数据被 Promise 或 Map 缓存。

---

# 阶段 2：彻底搞懂搜索逻辑

预计时间：9～12 小时，建议分 5～6 次完成。

搜索要按照“先构建索引，再加载索引，最后查询”的顺序学习，绝对不要从搜索页面倒着猜算法。

## 2.1 先读搜索数据类型（45 分钟）

阅读：

- `client/src/search/types/index.ts`

重点理解四类数据：

1. `SearchKnowledgeDoc`：构建期的 subpoint 中间数据；
2. `SearchKnowledgeSectionDoc`：主索引单位，一个 section 一篇文档；
3. `SearchKnowledgeFragmentDoc`：section 内部用于定位最佳片段的小索引；
4. `SearchResult`：最终交给 UI 的统一结果。

必须理解的设计：

- 主索引负责回答“哪个 Section 最相关”；
- 片段索引负责回答“这个 Section 内应该高亮并跳到哪里”；
- 所以搜索结果不会因为一节中多个 block 命中而重复出现多次。

小实验：手画一个 Section，其中有两个 Point、三个 Subpoint、五个 Block，并分别写出主索引文档和片段文档大概长什么样。

## 2.2 学构建期如何抽取内容（2～2.5 小时）

阅读：

1. `scripts/build-search-index.cjs` 文件头和路径初始化；
2. 搜索 `extractSubpointText`、`extractBlockTexts`；
3. 阅读知识树到文章的映射过程；
4. 阅读“按 section 聚合 MiniSearch 文档”；
5. 阅读“构建 Section 内部片段索引文档”；
6. 阅读最终三个输出文件的写入逻辑。

重点回答：

- paragraph、formula、callout、image、html 分别如何转成可搜索纯文本？
- 为什么动画通常不直接把绘图代码全部放入搜索正文？
- `knowledgeBlockIds` 如何被用于统计关联真题数？
- `seenSubpointDocs` 为什么存在？
- 为什么主索引和片段索引使用同一套分词规范？

构建产物：

- `client/public/search/search-index.json`：轻量真题数据；
- `client/public/search/minisearch-index.json`：Section 主索引；
- `client/public/search/minisearch-fragment-index.json`：内部片段索引。

注意：这些是生成物，不应把它们当作业务源文件学习或手工编辑。

小实验：

```bash
npm run build:search-index
```

记录脚本输出的 Section 数、片段数和文件体积。然后在一篇文章正文中临时加入一个独特词，重建索引，用 `rg` 确认生成物中能检出；实验后撤销正文修改并再重建一次。

## 2.3 学 Segmentit 与 MiniSearch 怎样配合（2 小时）

阅读：

1. `client/src/search/408-terms.txt`
2. `client/public/search/synonyms.json`
3. `client/src/search/shared.ts`：
   - `normalizeIo()`
   - `withBase()`
   - `loadExam408Dict()`
   - `createSearchTokenizer()`
   - `loadSegmentit()`
   - `buildSynonymLookup()`
   - `ensureCorpusLoaded()`
   - `warmSearch()`

要区分三个概念：

- **领域词典**：影响中文如何切词，例如把专业术语看成一个整体；
- **同义词**：查询时扩充召回，例如不同叫法指向相同概念；
- **MiniSearch**：保存倒排索引，并负责 BM25 类相关性评分和排序。

`ensureCorpusLoaded()` 是首次搜索延迟的关键入口。它并行完成：

1. 下载轻量搜索语料；
2. 下载 Section 索引；
3. 下载片段索引；
4. 下载同义词；
5. 动态导入 Segmentit 并加载 408 词典；
6. 使用 `MiniSearch.loadJSON()` 恢复两个索引；
7. 建立真题“年份-题号”Map。

`corpusPromise`、`segmentPromise` 和 `dictPromise` 保证同一页面会话中不重复执行。`warmSearch()` 只是提前启动这条 Promise，不会产生另一份索引。

小实验：在 Network 开启 Disable cache，首次进入首页后观察搜索 JSON 和 Segmentit chunk；再执行一次搜索，确认没有重复请求。

## 2.4 学查询评分与 Section 内最佳命中（1.5～2 小时）

阅读：

- `client/src/search/composables/searchKnowledge.ts`

按调用顺序追踪：

```text
searchKnowledge(query)
→ expandWithSynonyms()
→ sectionIndex.search()
→ 按 MiniSearch 分数取 topK
→ findBestFragments()
→ 为每个 Section 选择最高分片段
→ 决定 snippet、blockId、anchor、matchField
→ 转换为 SearchResult
```

主索引字段权重：

| 字段 | 权重 |
| --- | ---: |
| Section 标题 | 3 |
| Point 标题 | 2.5 |
| Subpoint 标题 | 2 |
| 正文 | 1 |

片段索引中标题权重为 2，正文为 1。MiniSearch 返回已按相关性排序的片段，因此同一 Section 第一次出现的片段就是用于展示和跳转的最佳片段。

重点理解：**主索引分数决定结果列表顺序，片段索引分数决定该结果内部展示哪段文字。** 两者不要混为一谈。

小实验：选择一个 Section 标题和正文都包含的词，分别修改标题/正文权重，使用 `npm run debug:search -w client` 或页面搜索观察结果变化；之后还原权重。

## 2.5 学真题精确搜索和总协调器（1～1.5 小时）

阅读：

1. `client/src/search/composables/searchExam.ts`
2. `client/src/search/composables/useSearch.ts`

理解：

- `searchExam()` 目前不是全文真题检索，而是解析“2020.5”“20年第5题”一类精确题号；
- `useSearch()` 负责防抖、并发序列号、过期结果丢弃和结果合并；
- `searchSeq` 解决用户快速输入时旧请求后返回、覆盖新结果的问题；
- `dispose()` 负责组件卸载后的定时器清理；
- 空查询和单字符查询为什么直接返回空结果。

## 2.6 学搜索 UI（1.5～2 小时）

按顺序阅读：

1. `client/src/views/HomePage.vue` 的 `query`、`submit()` 和 `warmSearch()`；
2. `client/src/views/SearchPage.vue` 的 `run()`、`runLiveSearch()`、两个 `watch()` 和分页；
3. `KnowledgePage.vue` 中左栏搜索历史、建议、键盘导航；
4. `ExamPage.vue` 中搜索框的回车跳转逻辑。

注意当前有两种搜索体验：

- 首页和搜索页走统一全文搜索；
- 知识页左栏会先给当前书目的本地标题建议，也可以跳到全站搜索页；
- 真题页输入框还承担列表关键词状态，但按 Enter 会跳往全站搜索页。

这部分读完后，应能解释三处搜索框“看起来相似，但组件内状态并不完全相同”的原因。

## 2.7 搜索阶段完成标准

不看代码，能完整讲清一次“索引节点”查询：

1. 首页何时开始预热；
2. 浏览器下载了哪些文件；
3. Segmentit 怎样分词；
4. 同义词在哪一步加入；
5. 哪个索引决定 Section 排名；
6. 哪个索引决定 Section 内高亮片段；
7. `route#anchor` 如何跳到知识正文；
8. 快速连续输入为何不会显示过期结果。

---

# 阶段 3：搞懂数据怎样组织

预计时间：10～13 小时，建议分成“知识”“真题”“关联”三部分。

## 3.1 先学全局类型（1 小时）

阅读：

1. `client/src/types.ts`
2. `client/src/content/knowledge-articles/types.ts`
3. `client/src/animations/types.ts`

画出这两个结构：

```text
Book
└─ Chapter
   └─ Section
      └─ KnowledgePoint
```

```text
KnowledgeArticleData
└─ subpoints[]
   └─ blocks[]
      ├─ paragraph
      ├─ html
      ├─ formula
      ├─ callout
      ├─ image
      └─ animation
```

关键认知：

- `KnowledgePoint` 是目录和文章注册的最小元数据单元；
- `KnowledgeSubpoint` 是正文中的小标题；
- `KnowledgeArticleBlock` 是能与真题精确关联的最小内容单元；
- 真题的 `knowledgeBlockIds` 引用的是 `kb-*` Block ID，不是 Point ID。

## 3.2 学知识树（1～1.5 小时）

阅读：

- `client/src/content/knowledge-tree.ts`

不要全文逐字读。选“计算机网络”一本书，沿着一条路径读：

```text
computer-network
→ chapter-architecture
→ section-layering
→ kp-layering
```

然后在文件底部找到：

- 四本书怎样汇总到 `knowledgeBooks`；
- `allKnowledgePoints` 如何生成；
- 同一文章如何被不同书或 Section 复用。

需要回答：

- URL 为什么只包含 `bookId` 和 `sectionId`；
- 一个 Section 有多个 Point 时，正文为何会连续渲染多篇文章；
- 左侧目录为什么只有“章 → 节”两层，而 Point 不作为第三层目录。

## 3.3 学一篇文章的真实格式（1.5～2 小时）

先读简单文章：

- `client/src/content/knowledge-articles/computer-networks/network-architecture/protocol-service-interface.ts`

再读复杂文章：

- `client/src/content/knowledge-articles/computer-networks/network-architecture/tcp-ip-osi.ts`
- `client/src/content/knowledge-articles/computer-organization/co-vm-impl.ts`
- `client/src/content/knowledge-articles/data-structures/ds-8-2-internal-sort.ts`

对比它们如何使用：

- Markdown 段落和表格；
- KaTeX 行内/块级公式；
- inline SVG HTML；
- 静态图片导入；
- `ManimWebAnimation` 动画导入；
- 全局唯一的 `kb-*` ID。

## 3.4 学文章注册表（1～1.5 小时）

阅读：

- `client/src/content/knowledge-articles/registry.ts`

只需要重点读：

1. 顶部 import 模式；
2. `KnowledgeArticleRegistration`；
3. `knowledgeArticleRegistry` 中两三个注册项；
4. Block ID 重复检查；
5. `getKnowledgeArticleRegistration()`；
6. `findSubpointLocationByBlockId()`；
7. `findPointIdByBlockId()`；
8. `resolveKnowledgeArticle()` 的兜底逻辑。

理解它承担两个方向的映射：

- Point ID → 文章；
- Block ID → Point/Subpoint，用于真题跳回知识页。

## 3.5 学内容统一出口（45 分钟）

阅读：

- `client/src/content/index.ts`

这里是页面与数据层之间的门面：

- 知识页通过它读取书、定位 Point、生成知识页链接；
- 真题能力转发给 `examRepository`；
- 页面不需要知道真题 JSON 的具体目录。

请区分 `content` 对象、`knowledgeBooks` 静态导出和 `examRepository` 之间的职责。

## 3.6 学真题静态数据（2～2.5 小时）

按顺序阅读：

1. `client/public/exams/2009/paper.json` 中一道选择题；
2. 同文件中一道综合题；
3. `client/public/exams/manifest.json`；
4. `client/public/exams/index.json` 的一条记录；
5. `scripts/rebuild-exam-index.mjs`；
6. `client/src/services/examRepository.ts`。

重点理解为什么同一套真题有三种形态：

| 数据 | 用途 | 是否含完整答案 |
| --- | --- | --- |
| `<year>/paper.json` | 展示完整题目和解析 | 是 |
| `index.json` | 全量轻量筛选、搜索、关联统计 | 否 |
| `manifest.json` | 年份清单与总题数 | 否 |

`examRepository.ts` 按以下顺序学习：

1. `fetchJson()` 与 `withBase()`；
2. `manifestPromise`、`indexPromise`、`paperCache`；
3. `queryIndexIds()` 如何只在轻量索引上筛选；
4. `queryQuestions()` 如何按命中的年份加载完整 Paper；
5. `getQuestionsByKnowledgeBlockIds()`；
6. `getAdjacentQuestion()`；
7. `collectBlockIdsOfPoint()`；
8. `getExamFilters()`；
9. `submitAnswer()`。

小实验：选择 2010 年第 2 题，在 Network 中观察先读取 `index.json`，再按需读取 `2010/paper.json`；回到同年另一题，确认 Promise Map 缓存避免重复加载 Paper。

## 3.7 学知识与真题如何双向关联（1～1.5 小时）

完整追踪一个 `kb-*` ID：

1. 在一篇文章的 Block 中找到它；
2. 在 `public/exams/*/paper.json` 中查哪些题引用它；
3. 看 `getQuestionsByKnowledgeBlockIds()` 如何生成知识页的关联真题；
4. 看 `KnowledgeArticle.vue` 如何在 Subpoint 级去重计数；
5. 看 `ExamPaperItem.vue` 如何通过 `findSubpointLocationByBlockId()` 生成返回知识页的链接；
6. 看 `KnowledgePage.vue` 如何用 `?block=` 定位正文。

这个练习是理解整个项目最重要的一步。

## 3.8 学校验闭环（1 小时）

阅读并执行：

- `scripts/validate_knowledge_content.mjs`
- `scripts/validate_exam_content.mjs`
- `npm run validate:content`
- `npm run validate:exams`

理解校验脚本保护的约束：

- 每个 Point 必须有独立文章并注册；
- Point、Block ID 的唯一性；
- 真题字段、年份题号顺序与 ID 格式；
- `knowledgeBlockIds` 必须指向真实 Block；
- 静态图片路径不能泄漏本机路径或指向旧后端。

## 3.9 数据阶段完成标准

独立完成一个不提交的练习：

1. 在已有 Section 下新增一个临时 Point；
2. 新建文章，包含 paragraph、formula 和 callout；
3. 在 registry 注册；
4. 让一道临时真题关联其中一个 Block；
5. 重建真题与搜索索引；
6. 在知识页看到文章和关联真题数；
7. 在真题页跳回正确 Subpoint；
8. 两个校验脚本通过；
9. 完成后撤销临时内容。

---

# 阶段 4：搞懂页面布局与交互

预计时间：11～14 小时。先学页面状态，再读 Template，最后读 CSS。

## 4.1 Vue 组件阅读顺序

每个 `.vue` 文件都按这个顺序看：

1. `props`、`emits`；
2. `ref` 原始状态；
3. `computed` 派生状态；
4. 用户事件函数；
5. `watch` 和生命周期；
6. Template 中状态如何绑定；
7. 最后才看 class 和 `<style>`。

不要从几百个 Tailwind class 开始学，否则会丢失数据流。

## 4.2 知识页容器布局（2～2.5 小时）

阅读：

- `client/src/views/KnowledgePage.vue`

分五段理解：

### A. 路由与内容加载

- `bookId`、`routeContentId`；
- `findSelectedSection()`；
- `loadBook()`；
- `loadSection()`；
- 兼容旧 Point 链接并统一重定向到 Section；
- 为 Section 下每个 Point 解析文章并批量查询真题关联。

### B. 三栏 Grid

- `LEFT_DRAWER_WIDTH`、`RIGHT_DRAWER_WIDTH`；
- `leftOpen`、`rightOpen`；
- `readerColumns`；
- `gridTemplateColumns` 的 500ms transition；
- 为什么正文会随着侧栏展开平滑移动，而不是被 fixed 面板盖住。

### C. Hover、固定和移动端

- `leftHovered/rightHovered` 控制临时展开；
- `leftPinned/rightPinned` 控制固定；
- `compactLayout` 下为何不依赖 hover；
- 移动端遮罩怎样关闭两个 Drawer。

### D. 深链接定位

- `requestedBlock`；
- `scrollToRequestedBlock()`；
- 为什么要 `nextTick()` 和有限次数重试；
- 为什么目标位置使用视口中部，而不是简单 `scrollIntoView()`。

### E. 左侧搜索与书籍菜单

- 搜索历史如何进 localStorage；
- 搜索建议为何只遍历当前 Book；
- Enter、上下箭头、Escape 的键盘逻辑；
- 搜索建议和全站搜索页的分工。

小实验：在 Vue DevTools 中观察 `leftHovered`、`leftPinned`、`readerColumns`；分别用悬停、图钉和缩窄窗口改变它们。

## 4.3 左侧知识目录组件（1～1.5 小时）

阅读：

- `client/src/components/knowledge/KnowledgeSidebar.vue`

重点：

- `openChapterId` 为什么持久化到 localStorage；
- `visibleChapters` 如何同时匹配 Chapter、Section 和 Point 标题；
- 为什么侧栏打开时要同步当前 Section 所在 Chapter；
- Chapter 展开动画为什么用 grid rows/容器高度过渡，而不是立即 `v-if`；
- 点击 Chapter 只展开，点击 Section 才换路由。

## 4.4 正文渲染组件树（2 小时）

按顺序阅读：

1. `client/src/components/knowledge/KnowledgeArticle.vue`
2. `client/src/components/knowledge/KnowledgeMarkdown.vue`
3. `client/src/components/knowledge/ManimCodePlayer.vue`

组件职责：

```text
KnowledgeArticle
├─ 组织 Subpoint 标题
├─ 聚合并去重关联真题
└─ 根据 block.type 分派渲染器
   ├─ KnowledgeMarkdown
   ├─ KaTeX formula
   ├─ image / html / callout
   └─ ManimCodePlayer
```

先理解 `v-if / v-else-if` 类型分派，再理解各类型的样式。

## 4.5 右侧目录与滚动同步（1.5～2 小时）

阅读：

- `client/src/components/knowledge/KnowledgeToc.vue`

重点查找：

- `activeId`；
- 观察哪些 Article/Subpoint DOM 节点；
- 滚动时用哪个视口参考点选择当前标题；
- 点击目录后的 navigation lock；
- `scrollend` 和超时兜底怎样解除锁；
- `keepActiveItemVisible()` 如何同步右侧目录自己的滚动位置。

小实验：给 `activeId` 加 Vue DevTools 观察，缓慢滚动正文，记录标题越过参考线时 activeId 的变化；再点击目录，观察锁如何避免滚动途中跳回上一个标题。

## 4.6 真题页容器与筛选（2.5～3 小时）

阅读：

- `client/src/views/ExamPage.vue`

按顺序学习：

1. `drawerOpen/rightOpen/drawerColumns` 三栏布局；
2. 路由 query 如何初始化筛选状态；
3. `currentFilterText` 如何组合可读筛选摘要；
4. `queryPayload()` 如何把 UI 状态转换为仓库查询；
5. `load()` 如何读取结果、分页并定位指定题；
6. `scheduleLoad()` 如何给关键词筛选防抖；
7. `buildFilterQuery()` 如何保持 URL 可分享；
8. `watch()` 如何响应筛选状态和路由变化；
9. `updateActiveExam()` 如何根据滚动更新右侧当前题；
10. Book → Chapter → Section 筛选怎样转换为 Block ID 并集。

特别留意：多个 `watch` 都可能调用 `load()`。学习时要列一张表，写出每个 watcher 的触发源、是否修改路由、是否重新请求数据，避免误以为所有刷新都由同一个函数触发。

## 4.7 单道真题的交互（1.5～2 小时）

按顺序阅读：

1. `client/src/components/exams/ExamPaperItem.vue`
2. `client/src/components/exams/ExamQuestionTools.vue`
3. `client/src/components/exams/ExamMarkdown.vue`

重点：

- `selectedAnswer`、`result`、`solutionExpanded` 的状态机；
- 选择题如何计算 idle/selected/correct/wrong；
- 完整答案为什么按题加载；
- 三点菜单怎样隐藏低频操作；
- 关联知识怎样由 Block ID 去重到 Subpoint；
- 翻卡模式如何保存原答案展开状态；
- 鼠标设备 hover 翻面、触摸设备点击翻面的差异；
- Escape 如何退出卡片。

建议自己画状态转移图：

```text
未选择
→ 已选择
→ 已提交/已揭晓
→ 答案展开
→ 卡片模式（正面 ⇄ 背面）
→ 退出卡片并恢复答案状态
```

## 4.8 首页与搜索页的轻交互（1 小时）

阅读：

- `HomePage.vue` 中打字机、鼠标 RAF、`warmSearch()`、`prefetchChunks()`；
- `SearchPage.vue` 中实时搜索、防抖、URL 同步、分页和点击跳转。

理解为什么鼠标移动使用 `requestAnimationFrame`：高频 pointer/mousemove 不应每次都立即触发响应式更新和重绘。

## 4.9 页面交互阶段完成标准

可以独立解释并定位下面四类问题：

1. 知识页侧栏展开后正文为什么跟着移动；
2. 点击目录后 active 标题为什么可能跳回上一项；
3. 真题筛选变化为什么会重新加载列表；
4. 从搜索结果跳转后，知识页和真题页分别如何定位目标内容。

---

# 阶段 5：渲染 Markdown、公式、图片和动画

预计时间：4～6 小时。

## 5.1 Markdown 与安全（1～1.5 小时）

对照阅读：

- `KnowledgeMarkdown.vue`
- `ExamMarkdown.vue`

共同流水线：

```text
Markdown 源字符串
→ marked.parse()
→ 修正资源路径（真题组件）
→ DOMPurify.sanitize()
→ 找出 LaTeX 定界符并用 KaTeX 渲染
→ v-html 输出
```

重点理解：

- 为什么必须先清洗再 `v-html`；
- 为什么禁止 script、iframe、style 和交互表单；
- `$...$`、`$$...$$`、`\(...\)`、`\[...\]` 如何区分；
- `<br>` 为什么要在提取公式文本时转换成换行；
- 真题图片为什么要拼接 `BASE_URL`。

## 5.2 Tailwind、Element Plus 与 CSS Layer（1 小时）

阅读：

1. `client/src/styles/main.css`
2. `client/src/styles/element-plus.css`
3. `client/src/main.ts`

理解 layer 顺序：

```text
theme → base → element-plus → components → utilities
```

这决定了：

- Tailwind Preflight 何时生效；
- Element Plus 基础样式处于哪层；
- 项目对 EL 组件的覆盖为何放在 components 层；
- Tailwind utilities 为什么可以对局部元素做最终微调。

同时理解三种样式位置：

- `main.css`：极少量全局基础；
- Vue Template class：页面和组件布局主力；
- `<style scoped>`：复杂伪元素、深层 Markdown DOM、动画 keyframes。

## 5.3 Manim-web 分步动画（2～3 小时）

按顺序阅读：

1. `client/src/animations/types.ts`
2. `client/src/animations/manim.ts`
3. `client/src/animations/SafariSafeText.ts`
4. 一个简单动画：`client/src/animations/data-structures/linear-list/sequential-list.ts`
5. 一个复杂动画：`client/src/animations/computer-organization/execute/instruction-cycle.ts`
6. `ManimCodePlayer.vue`

重点理解：

- `scene` 配置决定逻辑画布；
- `initialState` 是进入时已经可见的基础图；
- `steps[]` 每次点击如何重新构造当前完整状态；
- `current = -1` 的含义；
- Scene 为什么在每步前清空；
- `renderToken` 怎样避免异步动画结束顺序错乱；
- reset、prev、next 如何驱动同一个状态机；
- Safari 字体问题为何需要安全文本封装。

小实验：复制一个只有三个对象的极小动画，在三个步骤中依次高亮、移动、保持最终状态。要求上一步、下一步、重置都可逆且没有对象闪烁消失。

## 5.4 完成标准

你可以从一个 `animation` Block 开始，一直追踪到浏览器 Canvas 上绘制完成，并解释每一层的职责。

---

# 阶段 6：构建、校验、部署与综合练习

预计时间：4～6 小时。

## 6.1 完整构建链（1～1.5 小时）

再次阅读根 `package.json`，然后运行：

```bash
npm run build
```

按顺序理解：

1. 重建真题 index/manifest；
2. 校验知识内容；
3. 校验真题内容；
4. 生成搜索索引；
5. `vue-tsc -b` 做类型检查；
6. Vite 打包；
7. `closeBundle` 写入 `.nojekyll`、`404.html` 和词典副本。

## 6.2 静态部署约束（1 小时）

重点复习：

- `createWebHashHistory()`；
- `VITE_BASE_PATH`；
- `withBase()`；
- `%BASE_URL%`；
- `build.sourcemap: true`；
- public 静态资源与打包 import 资源的差异。

自己回答这个常见故障：为什么本机 `fetch('/exams/index.json')` 正常，而部署到 `/postgraduate-exam-website/` 后会 404？项目现在哪里修复了这个问题？

## 6.3 综合练习：加入一个“最近浏览”功能（2～3.5 小时）

这是一个合适的结业练习，因为会同时碰到数据、路由、状态和 UI，但不需要改核心数据模型。

建议范围：

1. 用户进入 Knowledge Section 时记录 `bookId/sectionId/title/time`；
2. 用户滚动到真题时记录 `examId/year/number/time`；
3. 使用 localStorage 保存最近 10 条；
4. 首页增加一个极简的“继续学习”入口；
5. 点击后能恢复到对应 Section/Block 或 Exam；
6. 不影响搜索预热和现有侧栏状态；
7. 桌面和移动端均可用。

完成后必须执行：

```bash
npm run validate
npm run build
```

---

# 建议的 25 天安排（每天约 2 小时）

| 天数 | 学习内容 | 当天产出 |
| ---: | --- | --- |
| 1 | 环境、命令、Vite 配置 | 命令链笔记 |
| 2 | main、App、router | 应用启动图 |
| 3 | 四个 View 的入口 | 页面输入—状态—输出表 |
| 4 | 三条数据链 | 总体架构图 |
| 5 | 搜索类型 | 主索引/片段索引草图 |
| 6 | build-search-index 内容抽取 | Block 到纯文本流程 |
| 7 | Section 聚合与片段生成 | 一份手工索引样例 |
| 8 | Segmentit、词典、同义词 | 查询切词记录 |
| 9 | ensureCorpusLoaded、warmSearch | 首次加载时序图 |
| 10 | searchKnowledge | 评分与最佳片段流程图 |
| 11 | useSearch、SearchPage | 防抖与并发说明 |
| 12 | types、knowledge-tree | 知识层级图 |
| 13 | 文章 Block 格式 | 三篇文章对比表 |
| 14 | registry 与 content 门面 | 双向映射图 |
| 15 | 真题三种静态数据 | JSON 关系图 |
| 16 | examRepository | 缓存与查询时序图 |
| 17 | Block 双向关联、校验脚本 | 完整 kb-* 追踪笔记 |
| 18 | KnowledgePage 加载与路由 | loadSection 时序图 |
| 19 | 知识页三栏、hover、pin | UI 状态表 |
| 20 | KnowledgeSidebar、KnowledgeToc | 目录状态机 |
| 21 | KnowledgeArticle、Markdown | Block 渲染分派图 |
| 22 | ExamPage 筛选、路由、分页 | watcher 触发表 |
| 23 | ExamPaperItem | 作答/答案/翻卡状态图 |
| 24 | ManimCodePlayer 与动画文件 | 三步小动画 |
| 25 | 构建部署与综合复盘 | 从源数据到页面的完整讲解 |

---

# 学习时建议维护的三份笔记

## 1. 调用链笔记

格式：

```text
用户动作：点击知识搜索结果
SearchPage.goto()
→ router.push(result.route)
→ KnowledgePage route watch
→ loadSection()
→ nextTick()
→ scrollToRequestedBlock()
```

## 2. 状态表

格式：

| 状态 | 谁修改 | 谁消费 | 是否进 URL/Storage |
| --- | --- | --- | --- |
| `leftPinned` | 图钉按钮 | `leftOpen` | 否 |
| `openChapterId` | 章按钮/当前 Section 同步 | KnowledgeSidebar Template | localStorage |
| `selectedYear` | 筛选按钮/路由初始化 | `queryPayload()` | URL query |

## 3. 数据契约笔记

每遇到一个关键类型，记录：

- 谁创建；
- 谁读取；
- 稳定 ID 是什么；
- 修改后需运行哪个生成/校验脚本。

---

# 最终自测题

完成整条路线后，尝试不看源码回答：

1. 为什么知识页 URL 定位到 Section，而真题关联定位到 Block？
2. 为什么搜索要同时维护 Section 索引和 Fragment 索引？
3. `warmSearch()` 是下载索引、构建索引，还是两者都有？
4. 为什么 `paper.json` 不能直接承担所有筛选？
5. 一道真题关联同一 Subpoint 下两个 Block 时，为何只显示一道关联题？
6. 从真题如何反查到知识页正确的小标题？
7. 知识页左右栏展开时，正文为什么会移动？
8. 点击右侧目录后，如何避免滚动过程中 active 项抖动？
9. Manim-web 为什么每一步都要能完整重建当前状态？
10. GitHub Pages 二级目录下，静态 fetch 为什么必须通过 `withBase()`？
11. 新增一篇文章后，为什么需要同时修改知识树、文章文件和注册表？
12. `npm run build` 在 Vite 打包之前完成了哪些数据准备和保护？

如果这 12 题能完整回答，并能独立完成阶段 6 的综合练习，你已经不是“会改页面”，而是真正掌握了这个项目的主要架构。
