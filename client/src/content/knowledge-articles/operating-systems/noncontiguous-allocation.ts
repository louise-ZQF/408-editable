import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const noncontiguousAllocationArticle: KnowledgeArticleData = {
  pointId: 'os-noncontiguous-alloc',
  subpoints: [
    {
      id: 'os-noncontiguous-intro',
      title: '什么是非连续分配',
      blocks: [
        {
          id: 'kb-os-noncontiguous-1-1',
          type: 'paragraph',
          text: '**非连续分配**允许一个进程的程序和数据**分散存放**在多个不连续的内存块中，通过**地址映射机构**（页表、段表等）把分散的块组织成连续的逻辑地址空间。它解决了连续分配的两个问题：\n\n- **外部碎片**：进程不再要求占用一整块连续空间。\n- **大程序装不进**：程序可以按块装入分散的空闲区。',
        },
        {
          id: 'kb-os-noncontiguous-1-2',
          type: 'paragraph',
          text: '**非连续分配的基本方式**：\n\n- **基本分页存储管理**：把内存和进程地址空间都划分成等长页面，用页表映射。\n- **基本分段存储管理**：按程序的逻辑结构分段，用段表映射。\n- **段页式存储管理**：先分段，段内再分页。',
        },
      ],
    },
  ],
}
