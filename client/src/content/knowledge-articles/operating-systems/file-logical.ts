import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const fileLogicalArticle: KnowledgeArticleData = {
  pointId: 'os-file-logical',
  subpoints: [
    {
      id: 'os-file-logic-basic',
      title: '文件逻辑结构的分类',
      blocks: [
        {
          id: 'kb-os-file-1-2',
          type: 'paragraph',
          text: '**文件的逻辑结构**（用户视角）分两类：\n\n- **无结构文件**（流式文件）：按字节流组织，如文本。\n- **有结构文件**（记录式）：按记录组织，如定长记录、变长记录。\n\n有结构文件又分三种：\n\n- **顺序文件**：记录按序存放。\n- **索引文件**：建立索引表加速查找。\n- **索引顺序文件**：顺序文件与索引文件的折中。',
        },
        {
          id: 'kb-os-file-logic-2',
          type: 'paragraph',
          text: '**无结构文件**（流式文件）：文件由一连串字节/字符组成，没有结构，读写按字节/字符进行，如文本文件。\n\n**有结构文件**（记录式文件）：文件由一组记录组成，每条记录有若干字段。',
        },
        {
          id: 'kb-os-file-logic-3',
          type: 'paragraph',
          text: '**顺序文件**：记录按顺序排列。\n\n**定长记录**的顺序文件可通过“第 i 条记录地址 = 起始地址 + i × 记录长”直接计算，支持随机访问。\n\n**变长记录**无法直接定位，只能顺序存取，随机访问需从前向后查找。',
        },
        {
          id: 'kb-os-file-logic-4',
          type: 'paragraph',
          text: '**索引文件**：为每条记录建立一个**索引项**（记录的关键字 + 指向记录的指针），组成索引表。查找时先查索引表定位记录，再读取。索引文件支持快速随机访问，代价是额外存储索引表。',
        },
        {
          id: 'kb-os-file-logic-5',
          type: 'paragraph',
          text: '**索引顺序文件**：先按关键字把记录分成若干组，为每组建立索引项（存该组第一条记录的关键字与地址），组内记录按顺序存放。查找时先查索引表定位到组，再在组内顺序查找，是顺序文件与索引文件的折中，兼顾检索速度与空间开销。',
        },
      ],
    },
  ],
}
