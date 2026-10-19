# 知识文章目录

静态知识文章按“408 书目 / 章节 / KnowledgePoint 文件”组织。

```text
knowledge-articles/
├── data-structures/
├── computer-organization/
├── operating-systems/
└── computer-networks/
    ├── network-architecture/
    ├── physical-layer/
    ├── data-link-layer/
    ├── network-layer/
    ├── transport-layer/
    └── application-layer/
```

每个 `.ts` 文件只导出一个 `KnowledgeArticleData`，也就是一个知识点页面。
页面模板由 `KnowledgeArticle.vue` 统一负责；新增文章后，只需在
`registry.ts` 中登记一次。

每个内容块还必须填写全局唯一且稳定的 `kb-*` ID。后端选择题或综合题小问通过
`knowledgeBlockId` 精确引用它；关联规则和示例见 `blueprint/CONTENT_AUTHORING_GUIDE.md`。
