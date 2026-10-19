import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const ethernetTokenRingArticle: KnowledgeArticleData = {
  pointId: 'kp-ethernet-token-ring',
  subpoints: [
    {
      id: 'ethernet-basics',
      title: '以太网',
      blocks: [
        {
          id: 'kb-ethernet-basics-1',
          type: 'paragraph',
          text: '**以太网**是目前最普及的局域网技术，采用**总线型**逻辑拓扑（物理上多为星型，交换机为中心），介质访问控制使用 **CSMA/CD**（载波监听多点接入/碰撞检测）。编码方式为**曼彻斯特编码**，传输介质以**双绞线**和**光纤**为主。',
        },
        {
          id: 'kb-ethernet-basics-2',
          type: 'paragraph',
          text: '以太网的关键参数：\n\n1. **最短帧长** 64 字节（含目的地址、源地址、类型/长度、数据和 FCS）。\n2. **帧间间隔** 96 bit 时间。\n3. **冲突后退避**：采用二进制指数退避算法。\n\n速率从 10 Mbps 到 100 Gbps，均采用交换式组网。',
        },
        {
          id: 'kb-ethernet-basics-3',
          type: 'paragraph',
          text: `| 以太网标准 | 速率 | 介质 | 编码 |
|------------|------|------|------|
| 10Base5 | 10 Mbps | 粗同轴电缆 | 曼彻斯特 |
| 10Base2 | 10 Mbps | 细同轴电缆 | 曼彻斯特 |
| 10BaseT | 10 Mbps | 双绞线 | 曼彻斯特 |
| 100BaseTX | 100 Mbps | 双绞线 | 4B/5B + MLT-3 |
| 100BaseFX | 100 Mbps | 光纤 | 4B/5B + NRZI |
| 1000BaseT | 1000 Mbps | 双绞线 | PAM-5 |
| 1000BaseSX/LX | 1000 Mbps | 光纤 | 8B/10B |`,
        },
      ],
    },
    {
      id: 'token-ring',
      title: '令牌环网',
      blocks: [
        {
          id: 'kb-token-ring-1',
          type: 'paragraph',
          text: '**令牌环网**采用**环型拓扑**，一个称为**令牌**的特殊帧沿环单向传递。只有拿到令牌的站才能发送数据，发完后释放令牌给下一站。',
        },
        {
          id: 'kb-token-ring-2',
          type: 'paragraph',
          text: '令牌环网无冲突，因为任何时候只有一个站持有令牌。但环中某站或链路故障会导致整个环瘫痪，可靠性不如以太网。目前已被以太网广泛取代。',
        },
      ],
    },
  ],
}
