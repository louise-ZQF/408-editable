import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'
import { rebuildBinaryTreeAnimation } from '@/animations/data-structures/tree/rebuild-from-traversals'

export const ds5_3BinaryTreeStoreTraverseArticle: KnowledgeArticleData = {
  pointId: 'ds-5-3-binary-tree-store-traverse',
  subpoints: [
    {
      id: 'ds-5-3-s1',
      title: '二叉树的存储结构',
      blocks: [
        {
          id: 'kb-ds-5-3-1-1',
          type: 'paragraph',
          text: String.raw`**顺序存储**：用一维数组存储**完全二叉树**。结点编号为 $i$（从 1 起）时，存于下标 $i$，左孩子 $2i$、右孩子 $2i+1$、双亲 $\lfloor i/2 \rfloor$。对**完全二叉树**无空间浪费；对一般二叉树会留下大量空位，除非补空结点把它改造为完全二叉树。`,
        },
        {
          id: 'kb-ds-5-3-1-2',
          type: 'paragraph',
          text: '**顺序存储的缺点**：非完全二叉树浪费空间严重。例如一棵只有右孩子的斜树，用数组需把每个空左孩子都补上，代价巨大。因此实际中一般二叉树多用链式存储。',
        },
        {
          id: 'kb-ds-5-3-1-3',
          type: 'paragraph',
          text: '**二叉链表**：每个结点含**数据域**、**左孩子指针 Lchild**、**右孩子指针 Rchild**。含 $n$ 个结点的二叉树共有 $2n$ 个指针域，其中用到 $n-1$ 个（边数），**空指针域有 $n+1$ 个**，这个数量是线索二叉树的基础。',
        },
        {
          id: 'kb-ds-5-3-1-4',
          type: 'paragraph',
          text: String.raw`| 存储方式 | 结构 | 空间 | 定位孩子/双亲 | 适用 |
|----------|------|------|----------------|------|
| 顺序存储 | 数组 + 编号公式 | 完全二叉树省、其它浪费 | 双亲孩子都易 | 完全二叉树 |
| 二叉链表 | data, Lchild, Rchild | $n+1$ 个空链域 | 双亲需遍历 | 一般二叉树 |
| 三叉链表 | data, Lchild, Rchild, Parent | 更多空链域 | 双亲可直接找 | 需频繁找双亲 |`,
        },
        {
          id: 'kb-ds-5-3-1-5',
          type: 'callout',
          title: 'n 个结点二叉树的空链域',
          text: '二叉链表 n 个结点 2n 个指针域用掉 n-1 个，空链域恒为 n+1。这个数字后面线索化时正好对应前驱后继线索的数量。',
          tone: 'blue',
        },
      ],
    },
    {
      id: 'ds-5-3-s2',
      title: '二叉树的先序、中序、后序与层次遍历',
      blocks: [
        {
          id: 'kb-ds-5-3-2-1',
          type: 'paragraph',
          text: '遍历即按某次序访问每个结点恰一次。二叉树遍历分**深度优先**（递归式，含先序、中序、后序）与**广度优先**（层次）。先、中、后序都按递归定义在左右子树上推进。',
        },
        {
          id: 'kb-ds-5-3-2-2',
          type: 'paragraph',
          text: '**先序遍历**（根左右）：访问根 → 先序遍历左子树 → 先序遍历右子树。\n\n**中序遍历**（左根右）：中序遍历左子树 → 访问根 → 中序遍历右子树。\n\n**后序遍历**（左右根）：后序遍历左子树 → 后序遍历右子树 → 访问根。',
        },
        {
          id: 'kb-ds-5-3-2-3',
          type: 'paragraph',
          text: '**层次遍历**（广度优先）：从根开始**自上而下、自左至右**一层层访问，用**队列**实现：根入队，出队访问之，再依次入其左、右孩子，循环直至队空。',
        },
        {
          id: 'kb-ds-5-3-2-4',
          type: 'html',
          html: `<svg viewBox="0 0 640 300" xmlns="http://www.w3.org/2000/svg" style="display:block;width:min(100%,640px);height:auto;margin-inline:auto">
  <style>
    text { font-family: system-ui, sans-serif; }
    .t { font-size: 18px; font-weight: 700; fill: #0f172a; }
    .nd { font-size: 16px; font-weight: 700; fill: #0f172a; text-anchor: middle; }
    .seq { font-size: 14px; fill: #0f172a; }
    .tag { font-size: 14px; font-weight: 700; fill: #1e3a8a; }
    .edge { stroke: #64748b; stroke-width: 1.6; }
  </style>

  <text x="24" y="24" class="t">先序 A-B-D-E-C-F-G　中序 D-B-E-A-F-C-G　后序 D-E-B-F-G-C-A　层次 A-B-C-D-E-F-G</text>

  <g class="edge" fill="none">
    <line x1="300" y1="78" x2="210" y2="128"/>
    <line x1="300" y1="78" x2="392" y2="128"/>
    <line x1="210" y1="130" x2="150" y2="178"/>
    <line x1="210" y1="130" x2="270" y2="178"/>
    <line x1="392" y1="130" x2="348" y2="178"/>
    <line x1="392" y1="130" x2="448" y2="178"/>
  </g>

  <g stroke="#1e40af" fill="#dbeafe">
    <circle cx="300" cy="66" r="20" stroke-width="2"/>
    <circle cx="210" cy="126" r="18" stroke-width="2"/>
    <circle cx="392" cy="126" r="18" stroke-width="2"/>
    <circle cx="150" cy="176" r="16" stroke-width="2"/>
    <circle cx="270" cy="176" r="16" stroke-width="2"/>
    <circle cx="348" cy="176" r="16" stroke-width="2"/>
    <circle cx="448" cy="176" r="16" stroke-width="2"/>
  </g>

  <text x="300" y="71" class="nd">A</text>
  <text x="210" y="131" class="nd">B</text>
  <text x="392" y="131" class="nd">C</text>
  <text x="150" y="181" class="nd">D</text>
  <text x="270" y="181" class="nd">E</text>
  <text x="348" y="181" class="nd">F</text>
  <text x="448" y="181" class="nd">G</text>

  <g>
    <text x="24" y="224" class="tag">先序</text><text x="72" y="224" class="seq">根左右 → A B D E C F G</text>
    <text x="24" y="248" class="tag">中序</text><text x="72" y="248" class="seq">左根右 → D B E A F C G</text>
    <text x="24" y="272" class="tag">后序</text><text x="72" y="272" class="seq">左右根 → D E B F G C A</text>
  </g>
</svg>`,
        },
        {
          id: 'kb-ds-5-3-2-5',
          type: 'callout',
          title: '遍历方向看根的位置',
          text: '先/中/后序的区别只在根何时被访问。用"根的位置"记：先序根最先、中序根居中、后序根最后，左右子树次序不变。',
          tone: 'blue',
        },
      ],
    },
    {
      id: 'ds-5-3-s3',
      title: '由遍历序列还原二叉树',
      blocks: [
        { id: 'kb-ds-5-3-3-7', type: 'animation', animation: rebuildBinaryTreeAnimation, sourceImport: { path: '@/animations/data-structures/tree/rebuild-from-traversals', localName: 'rebuildBinaryTreeAnimation', kind: 'named' } },
        {
          id: 'kb-ds-5-3-3-1',
          type: 'paragraph',
          text: '**先序 + 中序**、**后序 + 中序**、**层次 + 中序**都能唯一确定一棵二叉树。原理一致：中序序列把树分成左、根、右三段，配合另一序列定根，递归切分即可。',
        },
        {
          id: 'kb-ds-5-3-3-2',
          type: 'paragraph',
          text: '**先序 + 后序**不能唯一确定二叉树：当结点只有一个孩子时，无法判定它是左孩子还是右孩子。**先序 + 层次**也不能唯一确定。',
        },
        {
          id: 'kb-ds-5-3-3-3',
          type: 'paragraph',
          text: String.raw`| 两序列组合 | 能否唯一确定 | 说明 |
|------|------|------|
| 先序 + 中序 | 能 | 先序定根、中序分左右 |
| 后序 + 中序 | 能 | 后序定根（最后一个）、中序分左右 |
| 层次 + 中序 | 能 | 层次首元素定根 |
| 先序 + 后序 | **不能** | 当只有单孩子时无法判左右 |
| 先序（或后序）+ 层次 | 不能 | 信息不足 |`,
        },
        {
          id: 'kb-ds-5-3-3-4',
          type: 'paragraph',
          text: '还原步骤（以先序 + 中序为例）：\n\n1. 取先序序列首元素为根。\n2. 在中序序列中定位根，其左侧为左子树中序、右侧为右子树中序。\n3. 按左、右子树长度在先序序列中切出左右子树的先序。\n4. 递归重复。',
        },
        {
          id: 'kb-ds-5-3-3-5',
          type: 'paragraph',
          text: '还原的应用：求树的**深度**、**结点数**、**叶子数**、**某遍历序列**。例如知道先序与中序后，后序序列可唯一推出。',
        },
        {
          id: 'kb-ds-5-3-3-6',
          type: 'callout',
          title: '重建需要中序',
          text: '只要想唯一还原二叉树，就必须有中序序列参与（先/后/层次任一 + 中序）。先序+后序看似能定根，却判不清单孩子结点左右，故不唯一。',
          tone: 'orange',
        },
        {
          id: 'kb-ds-5-3-4-7',
          type: 'callout',
          title: '层序定根、中序分左右',
          text: '层次 + 中序还原时，层次序列从头依次取根，中序把左右子树分开；每步根都是从层序中新取的一个。层序与中序相同时，可推出每层只有一个结点的退化情形。',
          tone: 'blue',
        },
        {
          id: 'kb-ds-5-3-5-5',
          type: 'callout',
          title: '先序=中序 / 后序=中序',
          text: '先序与中序序列相同时，树是没有左孩子的右斜树；后序与中序相同时，树是没有右孩子的左斜树。',
          tone: 'orange',
        },
      ],
    },
  ],
}
