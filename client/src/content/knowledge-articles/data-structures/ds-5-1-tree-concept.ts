import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const ds5_1TreeConceptArticle: KnowledgeArticleData = {
  pointId: 'ds-5-1-tree-concept',
  subpoints: [
    {
      id: 'ds-5-1-s1',
      title: '树的定义与递归特性',
      blocks: [
        {
          id: 'kb-ds-5-1-1-1',
          type: 'paragraph',
          text: String.raw`**树**是 $n \ge 0$ 个结点的**有限集合**。$n=0$ 称为**空树**；$n>0$ 时满足两个条件：只有一个**根结点**；除根外其余结点可划分为 $m(m>0)$ 个**互不相交**的有限集 $T_1, T_2, \dots, T_m$，其中每个子集本身又是一棵树，称为根结点的**子树**。`,
        },
        {
          id: 'kb-ds-5-1-1-2',
          type: 'paragraph',
          text: '树的定义里**子树互不相交**是前提：若两个子树有公共结点，就不成其为树，而是图。子树的数量没有上限，因此树是非线性结构，结点之间是一对多的层次关系。',
        },
        
      ],
    },
    {
      id: 'ds-5-1-s2',
      title: '树的基本术语',
      blocks: [
        {
          id: 'kb-ds-5-1-2-5',
          type: 'paragraph',
          text: String.raw`| 术语 | 含义 | 易错点 |
|------|------|--------|
| 根 | 唯一无双亲的结点 | 空树没有根 |
| 叶子 | 度为 0 的结点 | 与分支结点相对 |
| 结点的度 | 孩子个数 | 树高、边数不含叶子自身 |
| 树的度 | 所有结点度的最大值 | 不超过 m 与恰为 m 不同 |
| 深度 | 结点到根的距离 | 从上往下计数 |
| 高度 | 结点到最远叶子的路径长 | 从下往上计数 |
`,
        },
      ],
    },
    {
      id: 'ds-5-1-s3',
      title: '树的性质',
      blocks: [
        {
          id: 'kb-ds-5-1-3-1',
          type: 'paragraph',
          text: String.raw`**性质 1**：**结点数 = 度数之和 + 1**。每一条边连接一个孩子结点，所有结点的度之和等于边数；树是边数为结点数减 1 的连通图，故 $\text{边数} = \sum \text{度} = n - 1$，即 $n = \sum \text{度} + 1$。`,
        },
        {
          id: 'kb-ds-5-1-3-2',
          type: 'paragraph',
          text: String.raw`**性质 2**：度为 $m$ 的树中第 $i$ 层最多有 $m^{i-1}$ 个结点（$i \ge 1$）。第 1 层 1 个，第 2 层最多 $m$ 个，第 3 层最多 $m^2$ 个，等比递增，第 $i$ 层即 $m^{i-1}$ 个。`,
        },
        {
          id: 'kb-ds-5-1-3-3',
          type: 'paragraph',
          text: String.raw`**性质 3**：高度为 $h$ 的 $m$ 叉树**最多**有 $\frac{m^h - 1}{m - 1}$ 个结点（等比数列求和）。反之，$n$ 个结点的 $m$ 叉树，最小高度 $h$ 满足 $\frac{m^{h-1}-1}{m-1} < n \le \frac{m^h-1}{m-1}$，解不等式即可求最小高度。`,
        },
        {
          id: 'kb-ds-5-1-3-4',
          type: 'paragraph',
          text: String.raw`**性质 4**：$n$ 个结点的 $m$ 叉树中，若 $n_0$ 为叶子结点数，则 $n_0 = (m-1) n_{内} + 1$，其中 $n_{内}$ 是度为 1 或更多（分支）的结点总数。改写即 $n_0 = 1 + (m-1) \times \text{分支结点数}$。`,
        },
        {
          id: 'kb-ds-5-1-3-6',
          type: 'callout',
          title: '度数之和与边数',
          text: '求和所有结点的度等于边数的两倍是图的性质，但树是无向连通图、边数恰为结点数减 1。两式结合可得结点数等于度数之和再加 1。',
          tone: 'orange',
        },

        {
          id: 'kb-ds-5-1-4-9',
          type: 'callout',
          title: '森林树数 = 结点数 - 边数',
          text: '对任意森林，树的数量恒等于结点数减去边数。题目给边数、结点数直接相减即得树数，不用逐棵数。',
          tone: 'blue',
        },
      ],
    },
   
  ],
}
