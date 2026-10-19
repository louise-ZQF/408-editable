# 贡献指南

感谢你愿意一起让 408 教材更薄更懂 ✨

## 我能贡献什么？

| 类型 | 去哪里改 |
| --- | --- |
| 增补 / 修正知识讲解 | `client/src/content/knowledge-articles/<book>/<chapter>/*.ts` → 改完在 `registry.ts` 登记 |
| 调整知识树结构（章节顺序 / 层级） | `client/src/content/knowledge-tree.ts` |
| 补 manim 可视化动画 | `client/src/animations/<book>/<chapter>/*.ts` |
| 新增 / 修订真题 | `client/public/exams/<year>/paper.json` → 改完跑 `npm run rebuild:exams` |
| 改搜索评分算法 | `client/src/search/composables/searchKnowledge.ts` |
| 扩 408 专业词典 / 同义词 | `client/src/search/408-terms.txt` 或 `client/public/search/synonyms.json` |
| 首页共建者名单 | `client/src/content/contributors.ts` 加一行，加完自动上滚动栏 |

## 提 PR 流程

1. **Fork 本仓库**到你自己的 GitHub 账号
2. **Clone 到本地**，进入项目根目录：
   ```bash
   git clone git@github.com:<你的用户名>/postgraduate-exam-website.git
   cd postgraduate-exam-website
   npm install
   npm run dev        # 启动开发服务器：http://localhost:5173
   ```
3. 在新分支上开发：
   ```bash
   git checkout -b feat/something
   ```
4. 完成后先跑校验，确保没破坏现有内容：
   ```bash
   npm run validate          # 校验知识树 + 文章注册 + 真题数据完整性
   npm run build             # 完整构建（含索引重建 + 类型检查 + Vite build）
   ```
5. 提交、推到你的 fork，然后在 GitHub 发起 **Pull Request**：
   - 目标分支：`liangbohan/postgraduate-exam-website` 的 `main` 分支
   - PR 描述说清楚你做了什么 / 改了哪些知识点 / 附上截图更赞

## 贡献者协议

- 你提交的所有内容默认沿用仓库协议：**知识内容 CC BY 4.0，代码 MIT**。署名会保留在 git 提交历史里，并按需求被加入首页共建者名单。
- 请确保你的贡献是原创或来自公有领域 / 允许署名转载的公开资料，不侵犯任何第三方版权。

## 不会写代码也能贡献

- **捉虫**：发现错别字、讲解不清、真题答案有疑义，直接开 Issue
- **需求**：想加某个章节的讲解或动画，开 Issue 提需求
- **分享**：把你觉得好用的学习方式写成文档 / 画图挂到 Issue 里
