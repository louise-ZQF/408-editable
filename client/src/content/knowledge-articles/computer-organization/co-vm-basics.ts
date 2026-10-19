import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const coVmBasicsArticle: KnowledgeArticleData = {
  pointId: 'co-vm-basics',
  subpoints: [
{
      id: 'co-vm-idea',
      title: '虚拟存储器的基本思想',
      blocks: [
        {
          id: 'kb-co-vm-idea-1',
          type: 'paragraph',
          text: '**虚拟存储器**在物理内存与磁盘之间建立抽象的、扩展的内存空间，使进程能运行在比实际主存大的地址空间。',
        },
        {
          id: 'kb-co-vm-idea-2',
          type: 'paragraph',
          text: '**逻辑地址空间与物理内存解耦**：程序看到连续完整的虚拟地址空间，虚拟地址通过页表和 TLB 映射到物理内存，不直接对应物理位置。',
        },
        {
          id: 'kb-co-vm-idea-3',
          type: 'callout',
          title: '解耦带来的收益',
          text: '有限的物理内存可以支持更大的虚拟地址空间，同时每个进程有自己的页表，实现进程间隔离与保护，还能让多个进程共享同一物理页。',
          tone: 'blue',
        },
      ],
    },
  ],
}
