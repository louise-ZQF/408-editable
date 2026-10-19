import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const nyquistShannonArticle: KnowledgeArticleData = {
  pointId: 'kp-nyquist-shannon',
  subpoints: [
    {
      id: 'nyquist-limit',
      title: '无噪声信道的码元上限',
      blocks: [
        {
          id: 'kb-nyquist-limit-1',
          type: 'paragraph',
          text: '奈奎斯特定理讨论理想低通信道。带宽限制了每秒可以可靠传输的码元数，而每个码元携带的信息量由离散电平数决定。',
        },
        {
          id: 'kb-nyquist-limit-2',
          type: 'formula',
          formula: String.raw`C\ [\text{bps}] = 2 \times W\ [\text{Hz}] \times \log_2 V`,
        },
        {
          id: 'kb-nyquist-limit-3',
          type: 'paragraph',
          text: '$W$ 是信道带宽，$V$ 是码元可取的离散电平数。',
        },
      ],
    },
    {
      id: 'shannon-limit',
      title: '有噪声信道的容量上限',
      blocks: [
        {
          id: 'kb-shannon-limit-1',
          type: 'paragraph',
          text: '香农定理把噪声影响纳入计算。信噪比越高，信道容量越大；但容量随信噪比按对数增长，不能靠无限提高功率线性换取速率。',
        },
        {
          id: 'kb-shannon-limit-2',
          type: 'formula',
          formula: String.raw`C\ [\text{bps}] = W\ [\text{Hz}] \times \log_2 (1 + S/N)`,
        },
        {
          id: 'kb-shannon-limit-3',
          type: 'paragraph',
          text: String.raw`若题目给的是分贝，先用 $S/N = 10^{\text{dB}/10}$ 转为数值比。`,
        },
      ],
    },
    {
      id: 'nyquist-shannon-choice',
      title: '取两个约束中的较小值',
      blocks: [
        {
          id: 'kb-nyquist-shannon-choice-1',
          type: 'paragraph',
          text: '真实信道既有带宽限制，也有噪声限制。题目同时给出电平数和信噪比时，应分别计算奈奎斯特上限与香农上限，最终速率不能超过其中较小者。',
        }
      ],
    },
  ],
}
