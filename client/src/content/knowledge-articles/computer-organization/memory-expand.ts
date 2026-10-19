import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'
import wordBitExpansion from '@/assets/computer-organization/memory/word-bit-expansion.svg'

export const memoryExpandArticle: KnowledgeArticleData = {
  pointId: 'co-memory-expand',
  subpoints: [
    {
      id: 'co-memory-expand-s1',
      title: '主存容量的扩展',
      blocks: [
        {
          id: 'kb-co-memory-hierarchy-4-1',
          type: 'paragraph',
          text: String.raw`用多个存储芯片拼出更大的主存。

**位扩展**：增加字长。每片提供几位，多片并联（如 8 片 1 位芯片拼成 8 位字长），所有片用同一地址。`,
        },
        {
          id: 'kb-co-memory-hierarchy-4-2',
          type: 'paragraph',
          text: '**字扩展**：增加容量。每片字长相同，用高位地址选片（片选），扩展后地址空间增大。\n\n**字位扩展**：同时增加字长和容量。先位扩展拼出所需字长，再字扩展拼出所需容量。',
        },
        {
          id: 'kb-co-memory-expand-word-bit-diagram',
          type: 'image',
          src: wordBitExpansion,
          alt: 'DRAM 字位扩展连接图：高两位地址选择片组，低十四位地址按行列时序复用，四片八位芯片并联形成三十二位数据通路',
          caption: '横向四片并联完成位扩展；高两位选择纵深片组完成字扩展。DRAM 将行、列地址分时送入同一组物理地址引脚。',
          sourceImport: {
            path: '@/assets/computer-organization/memory/word-bit-expansion.svg',
            localName: 'wordBitExpansion',
            kind: 'default',
          },
        },
        {
          id: 'kb-co-memory-expand-dram-address-multiplex',
          type: 'paragraph',
          text: String.raw`**图中的地址如何拆分**：$A_{15}\sim A_{14}$ 是高 2 位，经译码后从 4 个纵深片组中选中 1 组；$A_{13}\sim A_0$ 是芯片内部的 14 位逻辑地址。

DRAM 支持**行、列地址引脚复用**，芯片不需要 14 根独立地址引脚：

1. 第一个时序：同一组 7 根物理引脚接收 $A_{13}\sim A_7$，作为行地址。
2. 第二个时序：同一组 7 根物理引脚接收 $A_6\sim A_0$，作为列地址。`,
        },
        {
          id: 'kb-co-memory-expand-ras-cas',
          type: 'callout',
          title: 'DRAM 分两次锁存地址',
          text: 'DRAM 芯片把地址分成行地址和列地址两部分，分两次从同一组物理引脚送入。先用 RAS（行选通）把行地址锁存进芯片，再用 CAS（列选通）把列地址锁存进芯片，由行、列共同选中一个存储单元。地址引脚根数因此减半，代价是需要两个选通信号分时工作。',
          tone: 'blue',
        },
        
      ],
    },
  ],
}
