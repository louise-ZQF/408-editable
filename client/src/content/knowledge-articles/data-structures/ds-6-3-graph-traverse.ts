import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const ds6_3GraphTraverseArticle: KnowledgeArticleData = {
  pointId: 'ds-6-3-graph-traverse',
  subpoints: [
    {
      id: 'ds-6-3-s1',
      title: '图的深度优先搜索 DFS',
      blocks: [
        {
          id: 'kb-ds-6-3-19',
          type: 'paragraph',
          text: '**代码思路**（用栈，递归或显式栈实现）：\n\n```\nvisited[n] 初始化为 false\nDFS(v):\n  visited[v] = true              // 访问并标记\n  for 每个邻接点 w of v:\n    if !visited[w]:\n      DFS(w)                     // 递归深入，一条道走到黑\n```\n\n从某顶点出发，访问并标记后对其一个**未访问的邻接顶点**递归 DFS，递归返回后再访问下一个未访问邻接顶点。一次 DFS 只访问到起点所在的连通分量，孤立顶点需另起一次遍历。',
        },
        {
          id: 'kb-ds-6-3-18',
          type: 'paragraph',
          text: String.raw`| 属性 | DFS |
|---|---|
| 辅助结构 | 栈（递归） |
| 访问策略 | 一条道走到黑再回溯 |
| 邻接矩阵复杂度 | $O(n^2)$ |
| 邻接表复杂度 | $O(n+e)$ |
| 等权最短路径 | 不行 |`,
        },
      ],
    },
    {
      id: 'ds-6-3-s2',
      title: '图的广度优先搜索 BFS',
      blocks: [
        {
          id: 'kb-ds-6-3-20',
          type: 'paragraph',
          text: '**代码思路**（用队列，逐层扩散）：\n\n```\nvisited[n] 初始化为 false\nBFS(v):\n  visited[v] = true; 入队 v\n  while 队列非空:\n    u = 队头出队\n    for 每个邻接点 w of u:\n      if !visited[w]:\n        visited[w] = true; 入队 w\n```\n\n从起点出发，先访问它的**所有邻接顶点**（第 1 层），再依次访问这些顶点的未访问邻接顶点（第 2 层），依此类推。队列保证先访问的先扩展，形成逐层向外推进；入队时即标记，避免重复入队。',
        },
        {
          id: 'kb-ds-6-3-8',
          type: 'paragraph',
          text: String.raw`| 属性 | BFS |
|---|---|
| 辅助结构 | 队列 |
| 访问策略 | 逐层向外扩散 |
| 邻接矩阵复杂度 | $O(n^2)$ |
| 邻接表复杂度 | $O(n+e)$ |
| 等权最短路径 | 可以 |`,
        },
      ],
    },
    {
      id: 'ds-6-3-s3',
      title: '图的遍历与连通分量',
      blocks: [
        {
          id: 'kb-ds-6-3-9',
          type: 'paragraph',
          text: '对**非连通图**，一次 DFS（或 BFS）只能访问到**一个连通分量**内的顶点。要遍历整个图，必须对每个未访问的顶点再启动一次遍历。**调用遍历的次数 = 图（无向图）的连通分量个数**。',
        },
        {
          id: 'kb-ds-6-3-10',
          type: 'paragraph',
          text: '对有向图，一次遍历访问到的是从起点可达的顶点，因此遍历次数与不可达顶点的分布有关，不等于强连通分量个数。',
        },
        {
          id: 'kb-ds-6-3-11',
          type: 'paragraph',
          text: '遍历得到的边构成**生成森林**。对连通图，遍历恰好得到一棵生成树；对非连通图，得生成森林，树的棵数等于连通分量个数。',
        },
      ],
    },
  ],
}
