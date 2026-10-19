import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const ds6_4MstArticle: KnowledgeArticleData = {
  pointId: 'ds-6-4-mst',
  subpoints: [
    {
      id: 'ds-6-4-s1',
      title: '生成树与 MST 概念',
      blocks: [
        {
          id: 'kb-ds-6-4-1',
          type: 'paragraph',
          text: `**生成树**是连通图的一个**极小连通子图**：包含全部 $n$ 个顶点、只有 $n-1$ 条边，去掉任一条边就不连通。
          **最小生成树**（MST）是所有生成树中**各边权值之和最小**的那一棵。`,
        },
        {
          id: 'kb-ds-6-4-2',
          type: 'paragraph',
          text: '**MST 的代价唯一**：无论用哪种算法，得到的生成树总代价（权和）相同。',
        },

        {
          id: 'kb-ds-6-4-4',
          type: 'paragraph',
          text: 'MST 若出现**权值相同的边**，可能不唯一；所有边的权值互不相同时，MST 必然唯一。Prim 与 Kruskal 都基于**贪心**，只要权值组确定，最终代价就一定相同。',
        },
      ],
    },
    {
      id: 'ds-6-4-s2',
      title: 'Prim 算法',
      blocks: [
        {
          id: 'kb-ds-6-4-5',
          type: 'paragraph',
          text: String.raw`**Prim 算法**（加点）：从任一顶点出发，每次选一条连接"已在树中"与"未在树中"顶点的最小权边，把新顶点并入树中，直到全部顶点都在树里。

1. 任选一个顶点 $v_0$，把它加入树集合 $U$。
2. 在所有一端在 $U$、另一端不在 $U$ 的边中，选出**权值最小**的一条。
3. 把这条边另一端顶点并入 $U$。
4. 重复步骤 2、3，直到 $U$ 包含全部 $n$ 个顶点，此时选出的 $n-1$ 条边构成 MST。

实现上，跨集合的最小边用**数组记录各顶点到当前树的最小距离**并逐步更新，因此时间复杂度 $O(n^2)$、与边数无关，**适合稠密图**。`,
        },
        {
          id: 'kb-ds-6-4-16',
          type: 'paragraph',
          text: String.raw`| 属性 | Prim |
|---|---|
| 策略 | 加点 |
| 选边依据 | 树集到外集的最小边 |
| 判回路 | 自然避免（只连非树顶点） |
| 复杂度 | $O(n^2)$ |
| 适合 | 稠密图 |`,
        },
        {
          id: 'kb-ds-6-4-18',
          type: 'callout',
          title: 'Prim 的堆优化',
          text: String.raw`Prim 也可以用邻接表 + 堆（优先队列）实现：堆里维护未加入树集合的顶点，按各顶点到当前树的最小距离（lowcost）为键值排序，取堆顶即得距树最近的顶点，$O(\log n)$。每个顶点入堆出堆各一次、每条边更新一次 lowcost，总复杂度 $O(e \log n)$。稀疏图边数 $e$ 小时，这个版本比 $O(n^2)$ 更快。`,
          tone: 'blue',
        },
      ],
    },
    {
      id: 'ds-6-4-s3',
      title: 'Kruskal 算法',
      blocks: [
        {
          id: 'kb-ds-6-4-8',
          type: 'paragraph',
          text: String.raw`**Kruskal 算法**（加边）：把所有边按权值从小到大排序，逐条尝试，只要不成环就选，选够 $n-1$ 条边为止。

1. 把图的所有边按权值从小到大排序。
2. 从最小边开始，依次取出每条边。
3. 用**并查集**判断该边两端点是否已在同一连通分量：不在同一分量则选它，并合并两个分量；在同一分量则跳过（选了会成环）。
4. 重复直到选出 $n-1$ 条边，构成 MST。

主要开销在**排序**，时间复杂度 $O(e \log e)$，与顶点数关系小，**适合稀疏图**。`,
        },
        {
          id: 'kb-ds-6-4-17',
          type: 'paragraph',
          text: String.raw`| 属性 | Kruskal |
|---|---|
| 策略 | 加边 |
| 选边依据 | 全局按权从小到大 |
| 判回路 | 并查集判断 |
| 复杂度 | $O(e \log e)$ |
| 适合 | 稀疏图 |`,
        },
      ],
    },
  ],
}
