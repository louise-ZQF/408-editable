import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const ds7_6BPlusTreeArticle: KnowledgeArticleData = {
  pointId: 'ds-7-6-b-plus-tree',
  subpoints: [
    {
      id: 'ds-7-6-s1',
      title: 'B+ 树的结构',
      blocks: [
        {
          id: 'kb-ds-7-6-1',
          type: 'paragraph',
          text: String.raw`**B+ 树**是 B 树的变体，其结构与 B 树有两处不同：

1. **非叶结点只作索引**：每个非叶结点含若干关键字 $K_1<K_2<\cdots<K_m$，它们是子树中关键字的分界值，仅用于路由，不存放实际记录。
2. **所有关键字都集中出现在最底层的叶结点中**：叶结点保存全部关键字及其对应记录的指针，各叶结点按关键字从小到大排列，并通过顺序指针连成链表。

**结点关键字个数**：$m$ 阶 B+ 树中，**关键字数与子树指针数一对一**（$n$ 个关键字对应 $n$ 棵子树，与 B 树"子树数 = 关键字数 + 1"不同），所以关键字个数范围与子树个数范围一致：

1. **根结点**：若为非叶根，至少 2 棵子树、至多 m 棵，即 **2 到 m 个关键字**；若整棵树只有一个叶结点作根，则 **1 到 m 个关键字**。
2. **非根结点**：分支结点和叶结点都至少有 $\lceil m/2 \rceil$ 棵子树、至多 m 棵，即 **$\lceil m/2 \rceil$ 到 m 个关键字**。`,
        },
        {
          id: 'kb-ds-7-6-2',
          type: 'paragraph',
          text: '**叶结点**：保存全部关键字及其对应的记录的指针，各叶结点按关键字**从小到大排列**，并且**通过顺序指针连成链表**。这样既能从根索引快速定位到某个关键字所在叶，又能沿叶的链式指针顺序扫描全部关键字。',
        },
        {
          id: 'kb-ds-7-6-4',
          type: 'html',
          html: `<svg viewBox="0 0 620 300" xmlns="http://www.w3.org/2000/svg" style="display:block;width:min(100%,620px);height:auto;margin-inline:auto">
  <style>
    text { font-family: system-ui, sans-serif; }
    .title { font-size: 20px; font-weight: 700; fill: #0f172a; text-anchor: middle; }
    .key   { font-size: 16px; font-weight: 700; fill: #ffffff; text-anchor: middle; }
    .lbl   { font-size: 14px; fill: #475569; text-anchor: middle; font-weight: 600; }
    .rel   { font-size: 14px; fill: #b45309; text-anchor: middle; font-weight: 700; }
  </style>

  <defs>
    <marker id="bpArr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#6d28d9"/>
    </marker>
  </defs>

  <text x="310" y="22" class="title">B+ 树（5 阶）：非叶只作索引，叶结点含全部关键字并链成表</text>

  <!-- 根：索引结点 30 | 70（绿色，只作索引；2 个关键字对应 2 个指针，一对一） -->
  <rect x="250" y="48" width="55" height="42" rx="6" fill="#059669"/>
  <rect x="305" y="48" width="55" height="42" rx="6" fill="#059669"/>
  <text x="277" y="75" class="key">30</text>
  <text x="332" y="75" class="key">70</text>

  <!-- 连线：根 2 个关键字各自引出一条指针，一对一连到 2 个叶结点 -->
  <g stroke="#475569" stroke-width="1.8" fill="none">
    <line x1="277" y1="90" x2="120" y2="160"/>
    <line x1="332" y1="90" x2="470" y2="160"/>
  </g>

  <!-- 左叶：10 | 20 | 30（紫色，含全部关键字，30 与索引重复） -->
  <rect x="40"  y="160" width="55" height="42" rx="6" fill="#7c3aed"/>
  <rect x="95"  y="160" width="55" height="42" rx="6" fill="#7c3aed"/>
  <rect x="150" y="160" width="55" height="42" rx="6" fill="#7c3aed"/>
  <text x="67"  y="187" class="key">10</text>
  <text x="122" y="187" class="key">20</text>
  <text x="177" y="187" class="key">30</text>

  <!-- 右叶：40 | 50 | 60 | 70 -->
  <rect x="390" y="160" width="55" height="42" rx="6" fill="#7c3aed"/>
  <rect x="445" y="160" width="55" height="42" rx="6" fill="#7c3aed"/>
  <rect x="500" y="160" width="55" height="42" rx="6" fill="#7c3aed"/>
  <rect x="555" y="160" width="55" height="42" rx="6" fill="#7c3aed"/>
  <text x="417" y="187" class="key">40</text>
  <text x="472" y="187" class="key">50</text>
  <text x="527" y="187" class="key">60</text>
  <text x="582" y="187" class="key">70</text>

  <!-- 叶间横向箭头：链成有序链表 -->
  <line x1="195" y1="181" x2="380" y2="181" stroke="#6d28d9" stroke-width="2.2" marker-end="url(#bpArr)"/>

  <text x="310" y="228" class="rel">非叶结点（30、70）只作索引，不存放记录</text>
  <text x="310" y="252" class="rel">每个索引关键字对应一个指针：30 → 左叶（10、20、30），70 → 右叶（40、50、60、70）</text>
  <text x="310" y="276" class="rel">叶结点用横向箭头连成链表，可沿链顺序扫描全部关键字</text>
</svg>`,
        },
        {
          id: 'kb-ds-7-6-5',
          type: 'paragraph',
          text: '上图为 5 阶 B+ 树。根结点 30、70 只作索引，不存放记录，每个索引关键字对应一个指针（一对一）：30 指向左叶（10、20、30），70 指向右叶（40、50、60、70）。\n\n真正存放全部关键字 10 到 70 的是叶结点（紫色），两叶用横向箭头连成有序链表，可沿链顺序扫描。索引里的 30、70 在对应叶结点中重复出现，因此叶层包含全部关键字。',
        },
        {
          id: 'kb-ds-7-6-7',
          type: 'paragraph',
          text: String.raw`| 对比项 | B 树 | B+ 树 |
|---|---|---|
| 关键字存放层 | 全部结点（含非叶和叶）都存关键字 | 只有最底层叶结点存全部关键字与记录指针 |
| 非叶结点的作用 | 本身也是查找命中点 | 只作索引折半路由，不存记录 |
| 根结点关键字个数 | 1 到 m-1 | 非叶根 2 到 m；整树仅一个叶结点作根时 1 到 m |
| 非根结点关键字个数 | ⌈m/2⌉-1 到 m-1 | 分支结点与叶结点均 ⌈m/2⌉ 到 m |
| 相邻叶/结点链接 | 无指针链接 | 叶结点用顺序指针链成链表，便于区间扫描 |
| 查找成功位置 | 可在任意层命中 | 必须找到对应的叶结点 |
| 遍历方式 | 中序遍历整棵树 | 沿叶子的链式指针顺序遍历 |
| 存储记录密度 | 中间层也存数据，叶较少 | 只存索引，非叶能容纳更多索引项，树更矮 |`,
        },
      ],
    },
    {
      id: 'ds-7-6-s3',
      title: 'B+ 树的应用',
      blocks: [
        {
          id: 'kb-ds-7-6-10',
          type: 'paragraph',
          text: 'B+ 树的"叶层存全部关键字且链式有序"特性，使其特别适合**文件系统的目录索引**和**数据库索引**：既可通过索引字段快速定位单个记录，又能方便地**顺序遍历**相邻记录、支持范围查询。',
        },
        {
          id: 'kb-ds-7-6-11',
          type: 'paragraph',
          text: '相比之下，B 树关键字分散在各层，一次区间查询要从根不断下沉、反复中序跨层扫描，不利于连续读多行；B+ 树把所有关键字集中在叶层并链成链表，一次定位后沿链表即可顺序读出多个相邻关键字对应的记录，磁盘读取也更连续。',
        },
      ],
    },
  ],
}
