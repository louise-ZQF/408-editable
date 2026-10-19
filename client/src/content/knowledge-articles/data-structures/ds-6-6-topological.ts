import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'
import { topologicalSortAnimation } from '@/animations/data-structures/graph/dag-algorithms'

export const ds6_6TopologicalArticle: KnowledgeArticleData = {
  pointId: 'ds-6-6-topological',
  subpoints: [
    {
      id: 'ds-6-6-s1',
      title: 'AOV 网与拓扑排序过程',
      blocks: [
        {
          id: 'kb-ds-6-6-1',
          type: 'paragraph',
          text: String.raw`**AOV 网**（顶点表示活动的有向无环图）用**顶点**表示活动、**有向边**表示活动之间的**先后制约**关系：边 $\langle v_i, v_j \rangle$ 表示活动 $v_i$ 必须先于 $v_j$ 完成。`,
        },
        {
          id: 'kb-ds-6-6-2',
          type: 'paragraph',
          text: String.raw`**拓扑排序**把 AOV 网的所有顶点排成一个线性序列，满足：若存在边 $\langle v_i,v_j \rangle$，则 $v_i$ 必须**排在 $v_j$ 之前**。

算法反复执行：

1. 每次选一个入度为 0 的顶点输出。
2. 删掉它和它的出边（即让后继顶点的入度减 1）。

直到所有顶点输出，或图中无入度为 0 的顶点。`,
        },
        {
          id: 'kb-ds-6-6-topological-animation',
          type: 'animation',
          animation: topologicalSortAnimation,
          sourceImport: { path: '@/animations/data-structures/graph/dag-algorithms', localName: 'topologicalSortAnimation', kind: 'named' },
        },
        {
          id: 'kb-ds-6-6-3',
          type: 'paragraph',
          text: '**判环**：若拓扑排序结束时仍有顶点未输出，说明图中**存在有向环**。',
        },
      ],
    },
    {
      id: 'ds-6-6-s3',
      title: 'DFS 求拓扑序列',
      blocks: [
        {
          id: 'kb-ds-6-6-9',
          type: 'paragraph',
          text: '**DFS 求拓扑序列**（后序 + 栈）：\n\n1. 对图做深度优先遍历，每访问完一个顶点的所有后继后，把它压入栈顶。\n2. 遍历结束后，栈中自顶向底的顺序即是一个合法的**逆拓扑序列**。\n3. 把逆拓扑序列反转，得到正序拓扑序列。',
        },
        {
          id: 'kb-ds-6-6-12',
          type: 'callout',
          title: '两种方法都能求拓扑排序',
          text: '删边法（每轮输出入度为 0 的顶点并删去它的出边）和 DFS 法（后序压栈再反转）都可以求出拓扑排序，两者也都能判断图中是否有环。',
          tone: 'blue',
        },
      ],
    },
  ],
}
