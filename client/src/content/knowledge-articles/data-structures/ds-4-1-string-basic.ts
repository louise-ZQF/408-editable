import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const ds4_1StringBasicArticle: KnowledgeArticleData = {
  pointId: 'ds-4-1-string-basic',
  subpoints: [
    {
      id: 'ds-4-1-s1',
      title: '串的定义与基本术语',
      blocks: [
        {
          id: 'kb-ds-4-1-1-1',
          type: 'paragraph',
          text: String.raw`**串（string）**是由零个或多个字符组成的有限序列，也称字符串。零个字符的串称**空串（Null String）**，记作 $\phi$ 或空串符号。"abc" 通常不加双引号书写，双引号只是串的标识。`,
        },
        {
          id: 'kb-ds-4-1-1-2',
          type: 'paragraph',
          text: '**子串**是串中任意**连续**个字符组成的子序列，含子串的串称为**主串**。\n\n**空格串**与空串不同：空格串是含一个或多个空格字符的串，长度不为零，空串长度为零。\n\n**串的值**是所含字符的序列，字符在串中的序号（从 1 开始）称**位置**。',
        },
        {
          id: 'kb-ds-4-1-1-3',
          type: 'paragraph',
          text: '**字符在串中的位置**：若子串的第 1 个字符在主串中的序号为 $i$，则称该子串**在第 $i$ 个位置上**。例如主串 "abcdefg" 中，子串 "cde" 的位置为 3。子串是连续字符，与线性表中"子表"概念对应但强调连续性。',
        },
        {
          id: 'kb-ds-4-1-1-4',
          type: 'callout',
          title: '串与线性表的区别',
          text: '串是内容受限的线性表，其数据元素限定为字符。判定某个字符序列是否为某串的子串时，必须强调连续，否则容易误判。',
          tone: 'orange',
        },
      ],
    },
  ],
}
