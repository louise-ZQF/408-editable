import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'
import { bTreeDeletionAnimation, bTreeInsertionAnimation } from '@/animations/data-structures/tree/b-tree'

export const ds7_5BTreeArticle: KnowledgeArticleData = {
  pointId: 'ds-7-5-b-tree',
  subpoints: [
    {
      id: 'ds-7-5-s1',
      title: 'm 阶 B 树的定义',
      blocks: [
        {
          id: 'kb-ds-7-5-1',
          type: 'paragraph',
          text: String.raw`**m 阶 B 树**有以下性质：

1. **每个结点最多 $m$ 棵子树、最多 $m-1$ 个关键字**。
2. 除根结点外，每个结点**至少 $\lceil m/2 \rceil$ 棵子树、至少 $\lceil m/2 \rceil-1$ 个关键字**。
3. **根结点**至少 2 棵子树（若根非叶），根的关键字数至少 1，可以少于 $\lceil m/2 \rceil-1$。
4. 结点内关键字**递增有序且互不相等**。
5. 所有叶结点（失败结点）**位于同一层**。

归纳关键字数：任意结点**最多 $m-1$ 个**；非根结点**最少 $\lceil m/2 \rceil-1$ 个**；根结点最少 1 个。每个结点的子树数恒比关键字数多 1。

**叶结点（失败结点）**与普通树的叶子不同：普通树的叶子是存储数据的末端结点；B 树的叶结点是**查找失败时到达的空位置**（外部结点），不存关键字、全部位于同一层。真正存数据的关键字都集中在叶结点之上的结点里。`,
        },
        {
          id: 'kb-ds-7-5-32',
          type: 'html',
          html: `<svg viewBox="0 0 620 300" xmlns="http://www.w3.org/2000/svg" style="display:block;width:min(100%,620px);height:auto;margin-inline:auto">
  <style>
    text { font-family: system-ui, sans-serif; }
    .title { font-size: 20px; font-weight: 700; fill: #0f172a; text-anchor: middle; }
    .key   { font-size: 16px; font-weight: 700; fill: #1e3a8a; text-anchor: middle; }
    .lbl   { font-size: 14px; fill: #475569; text-anchor: middle; font-weight: 600; }
    .rel   { font-size: 14px; fill: #b45309; text-anchor: middle; font-weight: 700; }
  </style>

  <text x="310" y="22" class="title">5 阶 B 树：关键字与子树的大小关系</text>

  <!-- 根结点：30 | 70 -->
  <rect x="250" y="48" width="55" height="42" rx="6" fill="#dbeafe"/>
  <rect x="305" y="48" width="55" height="42" rx="6" fill="#dbeafe"/>
  <text x="277" y="75" class="key">30</text>
  <text x="332" y="75" class="key">70</text>

  <!-- 连线：30 左连左子树、30/70 之间连中子树、70 右连右子树 -->
  <g stroke="#475569" stroke-width="1.8" fill="none">
    <line x1="277" y1="90" x2="120" y2="160"/>
    <line x1="310" y1="90" x2="320" y2="160"/>
    <line x1="343" y1="90" x2="520" y2="160"/>
  </g>

  <!-- 左子树：10 | 20 -->
  <rect x="70"  y="160" width="55" height="42" rx="6" fill="#dbeafe"/>
  <rect x="125" y="160" width="55" height="42" rx="6" fill="#dbeafe"/>
  <text x="97"  y="187" class="key">10</text>
  <text x="152" y="187" class="key">20</text>

  <!-- 中子树：40 | 50 | 60 -->
  <rect x="240" y="160" width="55" height="42" rx="6" fill="#dbeafe"/>
  <rect x="295" y="160" width="55" height="42" rx="6" fill="#dbeafe"/>
  <rect x="350" y="160" width="55" height="42" rx="6" fill="#dbeafe"/>
  <text x="267" y="187" class="key">40</text>
  <text x="322" y="187" class="key">50</text>
  <text x="377" y="187" class="key">60</text>

  <!-- 右子树：80 | 90 -->
  <rect x="470" y="160" width="55" height="42" rx="6" fill="#dbeafe"/>
  <rect x="525" y="160" width="55" height="42" rx="6" fill="#dbeafe"/>
  <text x="497" y="187" class="key">80</text>
  <text x="552" y="187" class="key">90</text>

  <text x="310" y="228" class="rel">左子树（10、20）所有关键字都小于 30</text>
  <text x="310" y="254" class="rel">中子树（40、50、60）所有关键字都在 30 与 70 之间</text>
  <text x="310" y="280" class="rel">右子树（80、90）所有关键字都大于 70</text>
</svg>`,
        },
      ],
    },
    {
      id: 'ds-7-5-s3',
      title: 'B 树的查找',
      blocks: [
        {
          id: 'kb-ds-7-5-13',
          type: 'paragraph',
          text: 'B 树的查找在树内从根开始，在结点内顺序（或折半）查找给定值 K：\n\n1. 若命中该结点的某个关键字，查找成功。\n2. 否则根据 K 与结点各关键字的大小关系，**沿对应的指针下沉到下一层结点**，重复同样比较。\n\n直到找到，或下沉到叶子之下的失败外部结点（查找失败）。',
        },
        {
          id: 'kb-ds-7-5-14',
          type: 'paragraph',
          text: '**B 树的查找时间与磁盘访问次数正相关**，而磁盘访问次数正比于**树的高度**（每访问一层结点需一次磁盘读入）。因此可以**增大 B 树的阶数**让树变矮胖，从而减少磁盘 I/O 次数。',
        },
      ],
    },
    {
      id: 'ds-7-5-s4',
      title: 'B 树的插入',
      blocks: [
        {
          id: 'kb-ds-7-5-15',
          type: 'paragraph',
          text: 'B 树插入的关键字**总是插入到最底层的叶结点**：\n\n1. 先在叶结点内有序插入。\n2. 若插入后关键字数**不超过 $m-1$**，插入完成。\n3. 若**超过 $m-1$**，该结点**分裂**。',
        },
        {
          id: 'kb-ds-7-5-16',
          type: 'paragraph',
          text: String.raw`**分裂规则**：把该结点以及中位关键字一起拆成三部分，取中间位置的第 $\lceil m/2 \rceil$ 个关键字上移到父结点，左右两部分各自形成一个新结点，各含 $\lceil m/2 \rceil - 1$ 个关键字、$\lceil m/2 \rceil$ 棵子树。分裂可能自下而上地沿路径传播，若根也分裂，则树高增 1。`,
        },
        
        {
          id: 'kb-ds-7-5-insertion-animation',
          type: 'animation',
          animation: bTreeInsertionAnimation,
          sourceImport: { path: '@/animations/data-structures/tree/b-tree', localName: 'bTreeInsertionAnimation', kind: 'named' },
        },
      ],
    },
    {
      id: 'ds-7-5-s5',
      title: 'B 树的删除',
      blocks: [
        {
          id: 'kb-ds-7-5-20',
          type: 'paragraph',
          text: String.raw`删除 B 树中关键字分情况：

1. 删除**非叶结点**的关键字：先用它的**直接前驱或后继**（左子树最右叶底 / 右子树最左叶底）填补该位置，把问题转化为删除叶层的关键字。
2. 删除**叶结点**的关键字：直接按叶层删除规则处理。`,
        },
        {
          id: 'kb-ds-7-5-21',
          type: 'paragraph',
          text: String.raw`删除叶层关键字后，按结点关键字数是否低于下限分三种情况：

1. 关键字数仍 $\geq \lceil m/2 \rceil - 1$：删除完成，无需调整。
2. 低于下限，且**兄弟结点关键字足够多**：向兄弟**借一个关键字**，并把父结点中夹在两者之间的关键字下来补位。
3. 低于下限，且**兄弟关键字数也达到下限**：把本结点与兄弟**合并**，连同父结点中夹在两结点间的关键字一起并入；合并后父结点关键字减少，可能继续向更高层合并，直至根。`,
        },
        {
          id: 'kb-ds-7-5-deletion-animation',
          type: 'animation',
          animation: bTreeDeletionAnimation,
          sourceImport: { path: '@/animations/data-structures/tree/b-tree', localName: 'bTreeDeletionAnimation', kind: 'named' },
        },
      ],
    },
  ],
}
