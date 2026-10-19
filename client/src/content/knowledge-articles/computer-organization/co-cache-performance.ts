import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const coCachePerformanceArticle: KnowledgeArticleData = {
  pointId: 'co-cache-performance',
  subpoints: [
{
      id: 'co-cache-performance',
      title: 'Cache 的性能与命中率',
      blocks: [
        {
          id: 'kb-co-cache-performance-4',
          type: 'paragraph',
          text: '分析 Cache 性能需要四个量：\n\n- **命中次数** $N_h$：CPU 访问 Cache 时命中的次数。\n- **缺失次数** $N_m$：未命中的次数。\n- **访问 Cache 耗时** $T_c$：访问一次 Cache 需要的时间。\n- **缺失损失时间** $T_m$：一次缺失时，除访问 Cache 外，还要额外到主存取数据所花的时间。',
        },
        {
          id: 'kb-co-cache-performance-1',
          type: 'paragraph',
          text: String.raw`无论命中还是缺失，CPU 每次访问都要**先访问 Cache**，都要花 $T_c$；只有缺失时才额外多花 $T_m$ 去主存取数据。

总访问时间 = 每次必花的 Cache 访问时间 + 缺失次数 × 缺失损失 = $N \times T_c + N_m \times T_m$。平均访问时间 = 总访问时间 ÷ 总访问次数 $N$。`,
        },
        {
          id: 'kb-co-cache-performance-2',
          type: 'formula',
          formula: String.raw`T_{avg} = \frac{N \times T_c + N_m \times T_m}{N}`,
        },
        {
          id: 'kb-co-cache-performance-3',
          type: 'paragraph',
          text: '命中率越高，平均访问时间越接近 $T_c$。提高命中率的手段包括增大 Cache 容量、提高关联度、改进替换算法。',
        },
      ],
    },
  ],
}
