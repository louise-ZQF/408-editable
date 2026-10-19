import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const bridgeArticle: KnowledgeArticleData = {
  pointId: 'kp-bridge',
  subpoints: [
    {
      id: 'bridge-basics',
      title: '网桥',
      blocks: [
        {
          id: 'kb-bridge-basics-1',
          type: 'paragraph',
          text: '**网桥**工作在数据链路层，连接两个局域网段。它根据帧的目的 MAC 地址决定转发或过滤：目的地址与源地址在同一网段的帧被过滤，跨网段的帧才转发。',
        },
        {
          id: 'kb-bridge-basics-2',
          type: 'paragraph',
          text: '网桥同样维护一张**转发表**，记录每个 MAC 地址对应的端口。转发决策基于目的地址：\n\n1. 目的地址在另一端：转发。\n2. 目的地址在同端：过滤。\n3. 目的地址未知：洪泛到所有端口。',
        },
        {
          id: 'kb-bridge-basics-3',
          type: 'callout',
          title: '网桥能否连接不同规格的局域网',
          text: '能。网桥采用存储转发，先把帧完整接收并缓存，再转发到另一侧，因此可以连接不同规格的局域网：不同速率的以太网段，甚至不同 MAC 协议的局域网（如以太网与令牌环网）。集线器工作在物理层，只能再生和转发信号，连接不了不同规格的局域网。',
          tone: 'blue',
        },
      ],
    },
    {
      id: 'bridge-vs-switch',
      title: '网桥与交换机的区别',
      blocks: [
        {
          id: 'kb-bridge-vs-1',
          type: 'paragraph',
          text: '交换机本质上就是**多端口网桥**，区别在端口数量和转发方式：\n\n1. **网桥**：典型只有 2 个端口，用软件查表转发，速率较低。\n2. **交换机**：端口可达数十个，用硬件（ASIC）高速查表转发，速率可达线速。',
        },
        {
          id: 'kb-bridge-vs-3',
          type: 'callout',
          title: '网桥是少端口交换机吗',
          text: '考试中常说交换机是多端口网桥，不说网桥是少端口交换机。两者的转发原理完全相同，都基于 MAC 地址存储转发、都隔离冲突域，区别只在端口数量和转发方式。两端口网桥在功能上就等于一台两端口交换机，只是速度和查表方式不同。',
          tone: 'blue',
        },
      ],
    },
  ],
}
