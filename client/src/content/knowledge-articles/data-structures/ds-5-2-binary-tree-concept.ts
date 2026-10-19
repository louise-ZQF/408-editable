import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const ds5_2BinaryTreeConceptArticle: KnowledgeArticleData = {
  pointId: 'ds-5-2-binary-tree-concept',
  subpoints: [
    {
      id: 'ds-5-2-s1',
      title: '二叉树的定义与形态',
      blocks: [
        {
          id: 'kb-ds-5-2-1-1',
          type: 'paragraph',
          text: '**二叉树**是 $n$ 个结点的有限集合，要么为空（$n=0$），要么由一个**根结点**和**两棵互不相交**、分别称为**左子树**与**右子树**的二叉树组成。每个结点最多有两个孩子，且孩子的左右次序（**左孩子、右孩子**）区分明确。',
        },
        {
          id: 'kb-ds-5-2-1-2',
          type: 'paragraph',
          text: '二叉树仍是递归定义，有五种基本形态：\n\n1. **空二叉树**\n2. **只有一个根结点**\n3. **只有左子树**\n4. **只有右子树**\n5. **左右子树都非空**\n\n区分"只有左孩子"与"只有右孩子"，是二叉树与一般树的不同之处。',
        },
        {
          id: 'kb-ds-5-2-1-3',
          type: 'paragraph',
          text: `**二叉树与度为 2 的有序树的区别**有两条：

1. 二叉树**可以为空**，度为 2 的树不能为空。
2. 二叉树区分左右孩子，即使只有一个孩子也分左右；度为 2 的树的子树无左右之分。`,
        },
        {
          id: 'kb-ds-5-2-1-4',
          type: 'callout',
          title: '空双子的左右之分',
          text: '二叉树里"只有左孩子"和"只有右孩子"是两种不同形态，度为 2 的有序树则不区分，因为它的子树没有左右概念。',
          tone: 'orange',
        },
        {
          id: 'kb-ds-5-2-1-5',
          type: 'html',
          html: `<svg viewBox="0 0 640 180" xmlns="http://www.w3.org/2000/svg" style="display:block;width:min(100%,640px);height:auto;margin-inline:auto">
  <style>
    text { font-family: system-ui, sans-serif; }
    .t { font-size: 18px; font-weight: 700; fill: #0f172a; }
    .nd { font-size: 15px; font-weight: 700; fill: #0f172a; text-anchor: middle; }
    .lab { font-size: 14px; fill: #334155; text-anchor: middle; }
    .ph { font-size: 14px; fill: #b45309; text-anchor: middle; }
  </style>
  <text x="24" y="24" class="t">二叉树的五种基本形态</text>

  <text x="70" y="70" class="lab">①空</text>
  <circle cx="70" cy="92" r="14" fill="#dbeafe" stroke="#1e40af"/>

  <text x="190" y="70" class="lab">②仅根</text>
  <circle cx="190" cy="92" r="14" fill="#dbeafe" stroke="#1e40af"/>
  <text x="190" y="97" class="nd">A</text>

  <g>
    <text x="310" y="70" class="lab">③只左子树</text>
    <circle cx="310" cy="88" r="14" fill="#dbeafe" stroke="#1e40af"/>
    <text x="310" y="93" class="nd">A</text>
    <line x1="310" y1="102" x2="310" y2="122" stroke="#64748b" stroke-width="1.6"/>
    <circle cx="310" cy="132" r="12" fill="#dbeafe" stroke="#1e40af"/>
    <text x="310" y="137" class="nd">B</text>
    <text x="330" y="120" class="ph">左（无右）</text>
  </g>

  <g>
    <text x="450" y="70" class="lab">④只右子树</text>
    <circle cx="450" cy="88" r="14" fill="#dbeafe" stroke="#1e40af"/>
    <text x="450" y="93" class="nd">A</text>
    <line x1="450" y1="102" x2="450" y2="122" stroke="#64748b" stroke-width="1.6"/>
    <circle cx="450" cy="132" r="12" fill="#dbeafe" stroke="#1e40af"/>
    <text x="450" y="137" class="nd">B</text>
    <text x="470" y="120" class="ph">右（无左）</text>
  </g>

  <g>
    <text x="580" y="70" class="lab">⑤左右都非空</text>
    <circle cx="572" cy="88" r="14" fill="#dbeafe" stroke="#1e40af"/>
    <text x="572" y="93" class="nd">A</text>
    <line x1="562" y1="102" x2="545" y2="122" stroke="#64748b" stroke-width="1.6"/>
    <line x1="582" y1="102" x2="600" y2="122" stroke="#64748b" stroke-width="1.6"/>
    <circle cx="540" cy="132" r="12" fill="#dbeafe" stroke="#1e40af"/>
    <text x="540" y="137" class="nd">B</text>
    <circle cx="608" cy="132" r="12" fill="#dbeafe" stroke="#1e40af"/>
    <text x="608" y="137" class="nd">C</text>
  </g>
</svg>`,
        },
      ],
    },
    {
      id: 'ds-5-2-s2',
      title: '满二叉树与完全二叉树',
      blocks: [
        {
          id: 'kb-ds-5-2-2-1',
          type: 'paragraph',
          text: '**满二叉树**：一棵高度为 $h$ 且含有 $2^h-1$ 个结点的二叉树。即每层都占满，叶子都在最后一层。满二叉树的结点编号从根开始**自上而下、自左至右**连续编号。',
        },
        {
          id: 'kb-ds-5-2-2-2',
          type: 'paragraph',
          text: '**完全二叉树**：高度为 $h$、有 $n$ 个结点的二叉树，当且仅当其每个结点都与高度为 $h$ 的**满二叉树**中编号 1 至 $n$ 的结点一一对应。除最后一层外每层都满，最后一层只缺右侧若干，且所有叶子都紧靠左侧连续排列。',
        },
        {
          id: 'kb-ds-5-2-2-3',
          type: 'paragraph',
          text: '完全二叉树的两个判别：**中间不缺结点**（最后一层结点从左到右连续）与**每个叶子都在靠左的位置**。满二叉树是完全二叉树的特例，反过来不成立。',
        },
        {
          id: 'kb-ds-5-2-2-4',
          type: 'paragraph',
          text: String.raw`**完全二叉树的编号性质**（编号从 1 起），编号为 $i$ 的结点：

1. 若 $i>1$，其双亲为 $\lfloor i/2 \rfloor$。
2. 若 $2i \le n$，左孩子为 $2i$；否则无左孩子。
3. 若 $2i+1 \le n$，右孩子为 $2i+1$；否则无右孩子。

这条性质让完全二叉树可以**用顺序存储（数组）**直接表示（详见存储与遍历一章）。`,
        },
        {
          id: 'kb-ds-5-2-2-5',
          type: 'callout',
          title: '完全 ≠ 满',
          text: '完全二叉树只是"最后一层前面都满 + 最后一层靠左连续"，它未必满。满二叉树必是完全二叉树，完全二叉树未必是满二叉树。',
          tone: 'blue',
        },
      ],
    },
    {
      id: 'ds-5-2-s3',
      title: '二叉树的性质',
      blocks: [
        {
          id: 'kb-ds-5-2-3-1',
          type: 'paragraph',
          text: String.raw`**性质 1**：非空二叉树的第 $i$ 层最多有 $2^{i-1}$ 个结点（$i \ge 1$）。`,
        },
        {
          id: 'kb-ds-5-2-3-4',
          type: 'paragraph',
          text: String.raw`**性质 2**：高度为 $h$ 的二叉树最多有 $2^h-1$ 个结点（$h \ge 1$）：$\sum_{i=1}^{h} 2^{i-1} = 2^h - 1$。`,
        },
        {
          id: 'kb-ds-5-2-3-2',
          type: 'paragraph',
          text: '**性质 3**：对任意非空二叉树，若叶子结点数为 $n_0$、度为 2 的结点数为 $n_2$，则 **$n_0 = n_2 + 1$**。推导：由"结点数 = 边数 + 1"可得 $n_0+n_1+n_2 = n_1+2n_2+1$，即 $n_0 = n_2+1$。此定理必须熟记。',
        },
        {
          id: 'kb-ds-5-2-3-3',
          type: 'paragraph',
          text: '**性质 4**：完全二叉树中的**叶子结点数**与**度为 2 的结点数**关系。设度为 0、1、2 的结点分别为 $n_0,n_1,n_2$，则 $n_0=n_2+1$，且完全二叉树中 $n_1$ 只能是 0 或 1（最后一层恰好只有 1 个单孩子结点），据此可反推 $n_0$。',
        },
        {
          id: 'kb-ds-5-2-3-6',
          type: 'callout',
          title: 'n0 = n2 + 1 的适用条件',
          text: String.raw`$n_0 = n_2 + 1$ 对所有非空二叉树都成立，与是否完全、是否满无关。但它对树的结点总数如何分布没有约束，只有完全二叉树才额外限制 $n_1 \in \{0,1\}$。`,
          tone: 'orange',
        },

        {
          id: 'kb-ds-5-2-4-6',
          type: 'callout',
          title: '完全二叉树度为 1 的结点个数',
          text: '完全二叉树结点总数为偶数时，度为 1 的结点必然为 1 个；为奇数时 $n_1=0$。用奇偶性先定 $n_1$，配合 $n_0=n_2+1$ 即可快速求叶子数。',
          tone: 'blue',
        },
      ],
    },
  ],
}
