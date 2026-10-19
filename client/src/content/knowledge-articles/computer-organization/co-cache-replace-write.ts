import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const coCacheReplaceWriteArticle: KnowledgeArticleData = {
  pointId: 'co-cache-replace-write',
  subpoints: [
{
      id: 'co-cache-replace',
      title: 'Cache 的替换算法',
      blocks: [
        {
          id: 'kb-co-cache-replace-1',
          type: 'paragraph',
          text: '替换算法用于全相联和组相联映射：候选块全部被占用时，需要从中选一个淘汰。\n\n直接映射下主存块只对应唯一缓存块，冲突时直接覆盖，无需替换算法。',
        },
        {
          id: 'kb-co-cache-replace-2',
          type: 'paragraph',
          text: '常用算法：\n\n- **LRU**（最近最少使用）：淘汰最久未访问的块，命中率高。\n- **FIFO**（先进先出）：淘汰最先进入的块，实现简单。\n- 随机选择：实现最简，命中率不稳定。',
        },
       
      ],
    },
{
      id: 'co-cache-write',
      title: 'Cache 的写策略',
      blocks: [
        {
          id: 'kb-co-cache-write-1',
          type: 'paragraph',
          text: 'Cache 是主存的副本，写操作必须解决 Cache 与主存的数据一致性问题。写策略按命中与否分为四种。',
        },
        {
          id: 'kb-co-cache-write-2',
          type: 'paragraph',
          text: '**命中时**分两种策略：\n\n**直写法**：每次写操作同时更新 Cache 和主存，同步完成。\n\n**回写法**：只更新 Cache，当该块被替换时才写回主存，需要脏位配合。',
        },
        {
          id: 'kb-co-cache-write-3',
          type: 'paragraph',
          text: '**未命中时**分两种策略：\n\n**写分配法**：先把主存块调入 Cache，再更新 Cache。\n\n**非写分配法**：不调入 Cache，直接更新主存。',
        },
        {
          id: 'kb-co-cache-write-4',
          type: 'paragraph',
          text: '常用组合：\n\n- **直写 + 非写分配**：两者都倾向主存操作，适合写操作不频繁的场景。\n- **回写 + 写分配**：两者都倾向 Cache 操作，适合写操作频繁的场景。',
        }
      ],
    },
  ],
}
