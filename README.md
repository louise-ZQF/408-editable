# 408 简纲 · 个人可编辑版

网站：https://louise-zqf.github.io/408-editable/ 。基于 liangbohan 的 [408 简纲](https://github.com/liangbohan/postgraduate-exam-website)，保留原站四科教材、846 道真题与交互动画，增加个人内容管理。本版本由 louise-ZQF 维护，修改与原文均遵循 CC BY 4.0，原作者与许可证保留在页面和仓库中。

在知识阅读页直接点正文或标题，就能像 Word 一样输入中文、修改文字和排版，原来的公式与表格会继续显示，不用写 Markdown 或打开源码，离开文字时自动保存；段落旁可以添加文字、公式、图片、提示框和动画，也能删除、移动或撤销，目录旁可以直接改名、添加和删除书籍、章节与页面。点击「完成编辑」恢复阅读视图。右下角「内容管理」保留完整管理能力，可以添加、修改、移动、排序和删除书籍、章节、页面与文章；正文支持 Markdown、代码、公式、提示框、图片上传、HTML/SVG、原站动画及沙箱交互演示；题库支持题干、答案、选项、解析、小题与知识关联编辑，首页文字、模块、共建者与字号也可调整。删除的内容进入回收站，工作台保留最近 20 步撤销。

修改先保存在当前浏览器 IndexedDB 中；本机 `npm run dev` 运行时还会原子保存到忽略提交的 `.personal-data/workspace.json` 并保留上一版本。网页中的修改不会直接影响其他访客，需要在「备份与发布」中使用仅授权本仓库、具备 Contents 读写权限的 GitHub 细粒度令牌发布到仓库，随后 GitHub Actions 自动重建 Pages。令牌仅在页面内存使用，关闭工作台后清除，不会进入备份。也可以导出 JSON 备份交给维护者提交 `client/public/editor/content.json`。

个人修改备份保留所有修改和回收站；完整教材备份额外包含原始文章和试题。原站图片及动画引用依赖本仓库源码与资源，上传的图片数据会随 JSON 保存。跨设备同时编辑遇到冲突时保留本机副本，不自动覆盖；先备份，再载入 GitHub 发布版本。

本地运行：`npm ci`，然后 `npm run dev`。验证：`npm test`；生产构建：`VITE_BASE_PATH=/408-editable/ npm run build`。部署由 `.github/workflows/deploy.yml` 执行，构建、单元测试和浏览器测试通过后发布。

---

# 408 简纲 · AI 原生的考研电子教材

[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by/4.0/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

> 本项目所有知识内容采用 **CC BY 4.0** 协议开源：允许任何人复制、修改、分发、甚至商业使用，**唯一要求**是署名 —— 注明原作者与出处即可。代码部分沿用同样的宽松原则。

## 愿景

我们想用开源的方式，**共创、共建、共享** 一份新一代的 **AI 原生电子教材**。

- **AI原生**：所有内容通过MCP接入AI，学习者无需付费，只需要一个API-Key，就可以访问到网站的所有数据。你能想象到的所有功能都可以做。真题统计/AI出题/知识点学习等等，AI的上限在于想象力。所有人可以通过AI来参与社区，通过AI提出修改意见，通过AI贡献自己的代码。网站没有后端，只有纯页面和MCP代码。（这是未来愿景，目前还未开发）
- **可交互动画**：放弃传统教材形式的文字和图片展开，推崇使用交互式动画解释复杂概念。（目前交互式动画只覆盖率一小部分）
- **最小集原则**：Less is more —— 以真题和考试大纲为本，把无关考试的内容全部砍掉，只保留应试内容。

## 开源精神如何让社区中的每个人都受益

考研是一场孤独的长跑，但开源社区让你不必一个人走。

- **输出才是真懂**：当你为某个知识点撰写讲解、修正一处错误、补一段动画时，你会把这个知识点完整的逻辑从头到尾过一遍，在这个过程中，你可能会发现你其实并没有完全搞懂所有的逻辑。因此，你可以通过输出知识来检验、巩固自己的理解。同时，你的输出会有开源社区的反馈，大家互相反馈互相检验。
- **结识志同道合的朋友**：在社区里，你会遇到同样在备战 408 的伙伴，或是热爱开源精神的共建者，大家互相纠错、互相启发，效果远远大于单打独斗。
- **人人为我，我为人人**：如果社区中的每个人都深度参与，那么这个社区内部的成员会不断受益，最终我们每个人都会有长足的进步。

## 如何通过 GitHub 贡献

### 1. 准备

```bash
# Fork 本仓库到自己的账号下，然后克隆到本地
git clone https://github.com/<你的用户名>/postgraduate-exam-website.git
cd postgraduate-exam-website

# 安装依赖
npm install

# 本地启动开发服务器（默认 http://localhost:5173）
npm run dev
```

### 2. 选择贡献方式

| 贡献类型 | 操作位置 | 说明 |
| --- | --- | --- |
| 新增 / 修订知识点讲解 | `client/src/content/knowledge-articles/` | 按 `book/chapter/article.ts` 结构新增文件并注册到 `index.ts` |
| 新增可视化动画 | `client/src/animations/` | Manim 风格的代码动画，参考各目录下 `README.md` |
| 补充 / 修正真题 | `client/public/exams/<年份>/paper.json` | 静态题库，遵循 manifest 结构 |
| 修订搜索词典 / 同义词 | `client/public/search/408-terms.txt`、`synonyms.json` | 直接编辑文本即可 |
| 修订 UI / 交互 bug | `client/src/views/`、`client/src/components/` | Vue 3 + TypeScript |
| 修订共建者名单 | `client/src/content/contributors.ts` | 加一行即可在首页滚动栏展示 |

### 3. 校验与提交

```bash
# 校验知识树结构与文章注册
npm run validate:content

# 知识内容校验 + 前端构建
npm run build
```

构建通过后，提交并推送到自己的 Fork：

```bash
git checkout -b feat/your-topic
git add .
git commit -m "feat(knowledge): 新增 XXX 知识点讲解"
git push origin feat/your-topic
```

### 4. 发起 Pull Request

在 GitHub 上向本仓库的 `main` 分支发起 PR，在描述中说明：

- 改了什么、为什么改
- 涉及哪些知识点 / 题目 / 动画
- 是否本地构建通过

维护者会在 Review 通过后合并，你的名字会自动出现在首页共建者滚动栏。

---

## 启动

```bash
npm install
npm run dev
```

前端默认运行在 http://localhost:5173

## 常用命令

```bash
npm run build                # 知识内容校验 + 前端构建
npm run validate:content     # 校验知识树结构与文章注册
```

## 真题数据

- 静态题库：`client/public/exams/`（manifest / index / 逐年 paper + images）
- 读取入口：`client/src/services/examRepository.ts`
