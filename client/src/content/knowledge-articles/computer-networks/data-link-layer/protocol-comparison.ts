import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const protocolComparisonArticle: KnowledgeArticleData = {
  pointId: 'kp-protocol-comparison',
  subpoints: [
    {
      id: 'protocol-compare-table',
      title: '三种流量控制协议对比',
      blocks: [
        {
          id: 'kb-protocol-compare-1',
          type: 'paragraph',
          text: '停止等待、后退 N 帧和选择重传三种协议的本质区别在于：如何处理出错的帧、如何管理窗口、以及确认的范围。',
        },
        {
          id: 'kb-protocol-compare-2',
          type: 'paragraph',
          text: '| 特性 | 停止等待 | GBN | 选择重传 |\n|------|----------|-----|----------|\n| 接收窗口 | 1 | 1 | (>=1) |\n| 重传范围 | 一个帧 | 丢失帧及之后所有帧 | 仅出错的帧 |\n| 确认方式 | 逐个确认 | **累积确认** | **逐个确认** |\n| 定时器个数 | 1 | **1**（最早未确认帧） | **每帧一个** |\n| 是否缓存失序帧 | 否 | 否（直接丢弃） | 是 |\n| 信道利用率 | 最低 | 中 | 最高 |\n| 实现复杂度 | 简单 | 中等 | 复杂 |',
        },
      ],
    },
    {
      id: 'protocol-choice',
      title: '流量控制协议的选择策略',
      blocks: [
        {
          id: 'kb-protocol-choice-1',
          type: 'paragraph',
          text: '● 信道误码率低、时延小 → 停止等待即可，实现简单。',
        },
        {
          id: 'kb-protocol-choice-2',
          type: 'paragraph',
          text: '● 信道误码率低、时延大、需高吞吐 → GBN，累积确认开销小。',
        },
        {
          id: 'kb-protocol-choice-3',
          type: 'paragraph',
          text: '● 信道误码率高、时延大 → 选择重传，避免大量不必要的重传。',
        },
      ],
    },
  ],
}
