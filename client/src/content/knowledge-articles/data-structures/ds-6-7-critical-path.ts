import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'
import { criticalPathAnimation } from '@/animations/data-structures/graph/dag-algorithms'

export const ds6_7CriticalPathArticle: KnowledgeArticleData = {
  pointId: 'ds-6-7-critical-path',
  subpoints: [
    {
      id: 'ds-6-7-s1',
      title: 'AOE 网与关键路径',
      blocks: [
        {
          id: 'kb-ds-6-7-1',
          type: 'paragraph',
          text: '**AOE 网**（边表示活动的有向无环网）用**顶点**表示**事件**（前导活动完成、后续活动可开始的时刻），用**有向边**表示**活动**，边的权值是**活动耗时**。一个源点（入度 0，开工）和一个汇点（出度 0，完工）。',
        },
        {
          id: 'kb-ds-6-7-2',
          type: 'paragraph',
          text: '**工期**：从源点到汇点**最长路径**的长度，也就是整个工程完成所需的最短时间。**关键路径**就是源点到汇点的最长路径，**关键活动**是位于关键路径上的活动。',
        },
        {
          id: 'kb-ds-6-7-3',
          type: 'paragraph',
          text: '关键活动的**时间余量为 0**，一旦拖延，整个工期就延长。非关键活动有余量，可以在一定范围内拖延而不影响总工期。**想要缩短工期必须加快关键活动**。',
        },
      ],
    },
    {
      id: 'ds-6-7-s2',
      title: '关键路径的计算方法',
      blocks: [
        {
          id: 'kb-ds-6-7-21',
          type: 'paragraph',
          text: String.raw`| 数组 | 含义 | 求法 |
|---|---|---|
| $ve$ | 事件最早发生时间 | 每个事件取所有入边中"前驱事件的 ve 加活动耗时"的最大值，源点 ve 为 0 |
| $vl$ | 事件最迟发生时间 | 每个事件取所有出边中"后继事件的 vl 减活动耗时"的最小值，汇点 vl 等于它的 ve |
| $e$ | 活动最早开始时间 | 等于活动起点事件的最早发生时间 ve |
| $l$ | 活动最迟开始时间 | 等于活动终点事件的最迟发生时间 vl 减去活动耗时 |`,
        },
        {
          id: 'kb-ds-6-7-critical-path-animation',
          type: 'animation',
          animation: criticalPathAnimation,
          sourceImport: { path: '@/animations/data-structures/graph/dag-algorithms', localName: 'criticalPathAnimation', kind: 'named' },
        },
      ],
    },
  ],
}
