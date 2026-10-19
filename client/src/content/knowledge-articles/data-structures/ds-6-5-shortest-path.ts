import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'
import { dijkstraAnimation } from '@/animations/data-structures/graph/shortest-path'

export const ds6_5ShortestPathArticle: KnowledgeArticleData = {
  pointId: 'ds-6-5-shortest-path',
  subpoints: [
    {
      id: 'ds-6-5-s1',
      title: 'Dijkstra 算法',
      blocks: [
        {
          id: 'kb-ds-6-5-1',
          type: 'paragraph',
          text: '**Dijkstra 算法**求**单源**最短路径：从源点出发，维护一个**dist 数组**记录源点到各顶点的当前最短距离、一个**确定集** $S$ 记录最短距离已确定的顶点。每步从 $S$ 外选 **dist 最小**的顶点 $u$ 加入 $S$，再用 $u$ 去**松弛**（更新）它的邻点距离，重复 $n-1$ 次。',
        },
        {
          id: 'kb-ds-6-5-2',
          type: 'paragraph',
          text: String.raw`**初始化**：$dist[v_0]=0$，$dist[\text{其他}]=+\infty$；源点的前驱置空。每步"选最小"是 $O(n)$，共 $n$ 步，加上松弛更新，**总复杂度 $O(n^2)$**（邻接矩阵）。`,
        },
        {
          id: 'kb-ds-6-5-dijkstra-animation',
          type: 'animation',
          animation: dijkstraAnimation,
          sourceImport: { path: '@/animations/data-structures/graph/shortest-path', localName: 'dijkstraAnimation', kind: 'named' },
        },
      ],
    },
    {
      id: 'ds-6-5-s3',
      title: 'Floyd 算法',
      blocks: [
        {
          id: 'kb-ds-6-5-12',
          type: 'paragraph',
          text: '**Floyd 算法**求**每一对顶点间**的最短路径，采用**动态规划**思想。它用**邻接矩阵递推**：$A^{(k)}[i][j]$ 表示从 $v_i$ 到 $v_j$、且**中间顶点只允许取 $v_1$ 到 $v_k$** 时的最短距离，逐步放行更多中间顶点。',
        },
        {
          id: 'kb-ds-6-5-13',
          type: 'formula',
          formula: String.raw`A^{(k)}[i][j]=\min\Big\{A^{(k-1)}[i][j],\ A^{(k-1)}[i][k]+A^{(k-1)}[k][j]\Big\}`,
        },
        {
          id: 'kb-ds-6-5-14',
          type: 'paragraph',
          text: '外层循环对 $k$ 从 1 到 $n$，每轮用第 $k$ 个顶点作为允许的"中转点"更新整个矩阵。**时间复杂度 $O(n^3)$**，空间 $O(n^2)$。',
        },
        {
          id: 'kb-ds-6-5-16',
          type: 'paragraph',
          text: '**代码思路**：\n\n```\n// A[n][n] 初始：A[i][i]=0，有边存权值，无边为 ∞\nfor k = 1 to n:                 // 允许第 k 个顶点作为中转点\n  for i = 1 to n:\n    for j = 1 to n:\n      if A[i][j] > A[i][k] + A[k][j]:\n        A[i][j] = A[i][k] + A[k][j]   // 经 k 中转更短则更新\n```\n\n递推顺序是"外层 k、内层 i、j"，每一轮在上一轮基础上放行一个中转点，三重循环结束后 $A[i][j]$ 即 $v_i$ 到 $v_j$ 的最短距离。',
        },
        {
          id: 'kb-ds-6-5-15',
          type: 'paragraph',
          text: '**Floyd 允许负权边**，只要没有负权回路。Dijkstra 的贪心会被负权破坏，Floyd 的三重循环不受单个负权影响。\n\n**等权图可用 BFS 求最短路径**（见遍历一章）。',
        },
      ],
    },
    {
      id: 'ds-6-5-s4',
      title: 'BFS、Dijkstra、Floyd 对比',
      blocks: [
        {
          id: 'kb-ds-6-5-17',
          type: 'paragraph',
          text: String.raw`| 对比 | BFS | Dijkstra | Floyd |
|---|---|---|---|
| 适用图 | 无权 / 等权图 | 带权图，权值非负 | 带权图，允许负权（无负环） |
| 目标 | 单源最短路径 | 单源最短路径 | **每对顶点间最短路径** |
| 思路 | 逐层扩散（队列） | 贪心，每步选 dist 最小 | 动态规划，三重循环递推 |
| 复杂度 | $O(n+e)$ / $O(n^2)$ | $O(n^2)$ | $O(n^3)$ |
| 带权边 | 不行 | 可以 | 可以 |
| 负权边 | 不行 | 不行 | 可以 |
| 负回路 | 不行 | 不行 | 不行 |`,
        },
        {
          id: 'kb-ds-6-5-18',
          type: 'paragraph',
          text: '选择要点：**图无权或等权**用 BFS 最快；**单源、非负权**用 Dijkstra；**多源（每对顶点）或含负权**用 Floyd。',
        },
      ],
    },
  ],
}
