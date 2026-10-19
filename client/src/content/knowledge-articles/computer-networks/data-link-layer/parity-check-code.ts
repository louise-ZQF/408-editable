import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const parityCheckCodeArticle: KnowledgeArticleData = {
  pointId: 'kp-parity-check-code',
  subpoints: [
    {
      id: 'parity-basics',
      title: '奇偶校验的基本原理',
      blocks: [
        {
          id: 'kb-parity-basics-1',
          type: 'paragraph',
          text: '在数据后面附加一个**校验位**，使整个码字中 1 的个数为奇数（奇校验）或偶数（偶校验）。接收方统计收到的码字中 1 的个数，若不符合约定则发现错误。',
        },
        {
          id: 'kb-parity-basics-2',
          type: 'paragraph',
          text: '**偶校验**：校验位取 0 或 1，补上后让码字中 1 的总数为偶数。\n\n**奇校验**：校验位取 0 或 1，补上后让码字中 1 的总数为奇数。',
        },
      ],
    },
    {
      id: 'parity-capability',
      title: '检错能力',
      blocks: [
        {
          id: 'kb-parity-cap-1',
          type: 'paragraph',
          text: '检测时统计码字中 1 的个数，能检测任意奇数个比特错误。1 位错翻转一个比特，1 的个数奇偶性改变。3 位、5 位同方向翻转同理，奇偶性必然改变。',
        },
        {
          id: 'kb-parity-cap-2',
          type: 'paragraph',
          text: '不能检测偶数个比特错误。2 位同时翻转，1 的个数变化为 ±2 或 0，奇偶性不变，校验通过但数据已经出错。',
        },
        {
          id: 'kb-parity-cap-3',
          type: 'callout',
          title: '奇偶校验无纠错能力',
          text: '发现错误后不知道哪一位错了，无法纠正。只能请求重传。适用于信道质量好、错误稀少的场景。',
          tone: 'orange',
        },
      ],
    },
  ],
}
