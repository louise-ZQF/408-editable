import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const ds6_1GraphConceptArticle: KnowledgeArticleData = {
  pointId: 'ds-6-1-graph-concept',
  subpoints: [
    {
      id: 'ds-6-1-s1',
      title: '图的定义与分类',
      blocks: [
        {
          id: 'kb-ds-6-1-1',
          type: 'paragraph',
          text: '**图** $G$ 由顶点集 $V$ 和边集 $E$ 构成，记为 $G=(V,E)$。**顶点**是数据元素，**边**连接一对顶点，表示元素之间的多对多关系。图中任一顶点的度没有上限（树中每个非根结点只有一个父，但可有多个孩子），图是最灵活、最不受约束的关系模型。',
        },
        {
          id: 'kb-ds-6-1-2',
          type: 'paragraph',
          text: String.raw`**无向图**的边没有方向，用无序对 $(u,v)$ 表示，$u$ 与 $v$ 相互连通。**有向图**的边有方向，用**弧** $\langle u,v \rangle$ 表示：$u$ 是**弧尾**（出发端），$v$ 是**弧头**（到达端），$\langle u,v \rangle$ 与 $\langle v,u \rangle$ 是两条不同的弧。`,
        },
        {
          id: 'kb-ds-6-1-3',
          type: 'paragraph',
          text: '**简单图**：不存在顶点到自身的自环，且任意两顶点间至多有一条边。默认讨论的都是简单图。\n\n**多重图**：允许两顶点间存在多条平行边或存在自环，需要额外数据结构记录重数。',
        },
        {
          id: 'kb-ds-6-1-4',
          type: 'callout',
          title: '408 默认简单图',
          text: String.raw`除非题目明确写"多重图"或"自环"，一律按简单图处理。$\langle u,v \rangle$ 与 $\langle v,u \rangle$ 是两条方向相反的弧。`,
          tone: 'blue',
        },
        {
          id: 'kb-ds-6-1-5',
          type: 'html',
          html: `<svg viewBox="0 0 720 200" xmlns="http://www.w3.org/2000/svg" style="display:block;width:min(100%,720px);height:auto;margin-inline:auto">
  <style>
    text { font-family: system-ui, sans-serif; }
    .title { font-size: 20px; font-weight: 700; fill: #0f172a; text-anchor: middle; }
    .sub   { font-size: 17px; font-weight: 700; fill: #ffffff; text-anchor: middle; }
    .cap   { font-size: 15px; fill: #475569; text-anchor: middle; }
    .arrow { fill: #0f172a; }
  </style>

  <text x="180" y="24" class="title">无向图：4 顶点 5 条边</text>
  <text x="540" y="24" class="title">有向图：4 顶点 5 条弧</text>

  <!-- 无向图：5 条实线边 -->
  <g>
    <line x1="110" y1="150" x2="128" y2="92" stroke="#1e40af" stroke-width="2.5"/>
    <line x1="128" y1="92" x2="232" y2="92" stroke="#1e40af" stroke-width="2.5"/>
    <line x1="232" y1="92" x2="250" y2="150" stroke="#1e40af" stroke-width="2.5"/>
    <line x1="110" y1="150" x2="250" y2="150" stroke="#1e40af" stroke-width="2.5"/>
    <line x1="128" y1="92" x2="250" y2="150" stroke="#1e40af" stroke-width="2.5"/>
    <circle cx="110" cy="150" r="19" fill="#2563eb"/>
    <circle cx="128" cy="92" r="19" fill="#2563eb"/>
    <circle cx="232" cy="92" r="19" fill="#2563eb"/>
    <circle cx="250" cy="150" r="19" fill="#2563eb"/>
    <text x="110" y="155" class="sub">1</text>
    <text x="128" y="97" class="sub">2</text>
    <text x="232" y="97" class="sub">3</text>
    <text x="250" y="155" class="sub">4</text>
  </g>
  <text x="180" y="190" class="cap">(u, v) 无序，两端等价</text>

  <!-- 有向图：5 条带箭头的弧（先画顶点圆，弧线从圆边到圆边，箭头画在弧头圆边界外，避免被圆盖住） -->
  <g>
    <circle cx="478" cy="92" r="19" fill="#059669"/>
    <circle cx="508" cy="150" r="19" fill="#059669"/>
    <circle cx="602" cy="92" r="19" fill="#059669"/>
    <circle cx="632" cy="150" r="19" fill="#059669"/>
    <!-- 弧 2→1 -->
    <line x1="499.3" y1="133.1" x2="486.7" y2="108.9" stroke="#1e40af" stroke-width="2.5"/>
    <polygon points="486.7,108.9 498.5,117.4 486.9,123.4" class="arrow"/>
    <!-- 弧 1→3 -->
    <line x1="497" y1="92" x2="583" y2="92" stroke="#1e40af" stroke-width="2.5"/>
    <polygon points="583,92 570,85.5 570,98.5" class="arrow"/>
    <!-- 弧 3→4 -->
    <line x1="610.7" y1="108.9" x2="623.3" y2="133.1" stroke="#1e40af" stroke-width="2.5"/>
    <polygon points="623.3,133.1 623.1,118.6 611.5,124.6" class="arrow"/>
    <!-- 弧 4→2 -->
    <line x1="613" y1="150" x2="527" y2="150" stroke="#1e40af" stroke-width="2.5"/>
    <polygon points="527,150 540,143.5 540,156.5" class="arrow"/>
    <!-- 弧 2→3 -->
    <line x1="524.2" y1="140" x2="585.8" y2="102" stroke="#1e40af" stroke-width="2.5"/>
    <polygon points="585.8,102 571.3,103.3 578.1,114.3" class="arrow"/>
    <text x="478" y="97" class="sub">1</text>
    <text x="508" y="155" class="sub">2</text>
    <text x="602" y="97" class="sub">3</text>
    <text x="632" y="155" class="sub">4</text>
  </g>
  <text x="556" y="190" class="cap">&lt;u, v&gt; 有序，箭尾指向箭头端</text>
</svg>`,
        },
      ],
    },
    {
      id: 'ds-6-1-s3',
      title: '顶点的度',
      blocks: [
        {
          id: 'kb-ds-6-1-8',
          type: 'paragraph',
          text: '**无向图的度**：顶点 $v$ 的度为与其关联的边数，记 $TD(v)$。**有向图的度**分**入度**（指向该顶点的弧数，$ID(v)$）与**出度**（从该顶点出发的弧数，$OD(v)$），总度 $TD(v)=ID(v)+OD(v)$。',
        },
        {
          id: 'kb-ds-6-1-9',
          type: 'formula',
          formula: String.raw`\sum_{i=1}^{n}TD(v_i)=2e \quad (\text{无向图})
\qquad \sum_{i=1}^{n}ID(v_i)=\sum_{i=1}^{n}OD(v_i)=e \quad (\text{有向图})`,
        },
        {
          id: 'kb-ds-6-1-10',
          type: 'paragraph',
          text: '无向图所有顶点**度之和等于边数的 2 倍**，必为偶数，因此**度数为奇数的顶点个数必为偶数**。有向图中，所有顶点的入度之和等于出度之和，都等于弧数 $e$。',
        },
        {
          id: 'kb-ds-6-1-11',
          type: 'paragraph',
          text: '**性质题**：对无向连通图，"所有顶点的度之和为偶数"一定正确。"边数大于顶点个数减 1"不一定；"至少有一个顶点的度为 1"不一定（完全图每个顶点度数都大于 1）。只有"度之和为偶数"恒成立。',
        },
      ],
    },
    {
      id: 'ds-6-1-s5',
      title: '连通性与连通分量',
      blocks: [
        {
          id: 'kb-ds-6-1-12',
          type: 'paragraph',
          text: '**连通**：无向图中，若任意两顶点 $u$、$v$ 之间都存在路径，则该图**连通**。\n\n**连通分量**是无向图的**极大连通子图**：它本身连通，且从分量内任一顶点出发能到达的所有顶点都已包含在内，**再加入任意一个新顶点（连同与它关联的边）就不再连通**。\n\n连通图的连通分量就是它本身；非连通图有多个连通分量，任意两个分量之间没有边相通。',
        },
        {
          id: 'kb-ds-6-1-13',
          type: 'paragraph',
          text: '**强连通**：有向图中，若 $u$ 到 $v$ 和 $v$ 到 $u$ 都存在路径，则 $u$、$v$ **强连通**；任意两顶点都强连通则图**强连通**。\n\n**强连通分量**是有向图的**极大强连通子图**：它本身强连通，且**再加入任意一个新顶点（连同与它关联的弧）就不再强连通**。\n\n无向图只说"连通"，有向图才说"强连通"。',
        },
        {
          id: 'kb-ds-6-1-24',
          type: 'paragraph',
          text: String.raw`| 概念 | 适用图 | 定义 |
|---|---|---|
| **连通** | 无向图 | 任意两顶点 $u,v$ 之间都存在路径 |
| **连通分量** | 无向图 | 极大连通子图：本身连通，再加入任意新顶点（连同关联边）就不再连通 |
| **强连通** | 有向图 | 任意两顶点 $u,v$ 之间，$u\to v$ 和 $v\to u$ 都存在路径 |
| **强连通分量** | 有向图 | 极大强连通子图：本身强连通，再加入任意新顶点（连同关联弧）就不再强连通 |
| **极小连通子图** | 无向图 | 连通子图，删除任意一条边后就不再连通 |`,
        },
      ],
    },
    {
      id: 'ds-6-1-s6',
      title: '路径、回路与生成树',
      blocks: [
        {
          id: 'kb-ds-6-1-6',
          type: 'paragraph',
          text: String.raw`**无向完全图**：任意两顶点之间都有边，$n$ 个顶点的无向完全图有 $\frac{n(n-1)}{2}$ 条边。**有向完全图**：任意两顶点之间都有**方向相反**的两条弧，$n$ 个顶点的有向完全图有 $n(n-1)$ 条边。`,
        },
        {
          id: 'kb-ds-6-1-7',
          type: 'formula',
          formula: String.raw`\text{无向完全图边数}=\frac{n(n-1)}{2},\qquad \text{有向完全图边数}=n(n-1)`,
        },
        {
          id: 'kb-ds-6-1-17',
          type: 'paragraph',
          text: String.raw`**路径**是顶点序列 $v_0,v_1,\ldots,v_k$，相邻两顶点间有边。**路径长度**是路径上的边数。**回路**（环）是起点与终点相同的路径。

**简单路径**：序列中顶点不重复（不含回路）。**简单回路**：除首尾顶点相同外，其他顶点都不重复。`,
        },
        {
          id: 'kb-ds-6-1-18',
          type: 'paragraph',
          text: '**连通图的生成树**：包含图**全部 $n$ 个顶点**、只有 $n-1$ 条边的**极小连通子图**（去掉任一条边就不连通，加任意一条边就成环）。\n\n**生成森林**：非连通图的每个连通分量各取一棵生成树，合起来构成。',
        },
        {
          id: 'kb-ds-6-1-19',
          type: 'paragraph',
          text: '**网**：边带权值的图，权值可表示距离、费用、时间等。\n\n**稀疏图与稠密图**：边数远小于完全图的图为**稀疏图**，边数接近完全图的图为**稠密图**。两者没有严格的量化界限，是经验上的称呼。',
        },
        {
          id: 'kb-ds-6-1-25',
          type: 'paragraph',
          text: String.raw`| 概念 | 定义 |
|---|---|
| **路径** | 顶点序列 $v_0,v_1,\ldots,v_k$，相邻两顶点间有边 |
| **路径长度** | 路径上的边数 |
| **回路**（环） | 起点与终点是同一个顶点的路径 |
| **简单路径** | 序列中顶点不重复（不含回路） |
| **简单回路** | 除首尾顶点相同外，其他顶点都不重复 |
| **生成树** | 包含图全部 $n$ 个顶点、只有 $n-1$ 条边的极小连通子图 |
| **生成森林** | 非连通图的每个连通分量各取一棵生成树，合起来构成 |
| **网** | 边带权值的图，权值可表示距离、费用、时间等 |
| **稀疏图** | 边数远小于完全图的图 |
| **稠密图** | 边数接近完全图的图 |`,
        },
      ],
    },
  ],
}
