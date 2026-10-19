import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const physicalLayerDevicesArticle: KnowledgeArticleData = {
  pointId: 'kp-physical-layer',
  subpoints: [
    {
      id: 'phy-devices-purpose',
      title: '物理层设备的功能',
      blocks: [
        {
          id: 'kb-phy-devices-purpose-1',
          type: 'paragraph',
          text: '物理层设备只处理**信号**，不处理数据内容。信号衰减后，物理层设备将衰减的信号**再生**（放大、整形）后重新发送，延长网络的物理覆盖范围。\n\n物理层设备不能隔离冲突域，也不能抑制广播。',
        },
      ],
    },
    {
      id: 'phy-devices-types',
      title: '中继器与集线器',
      blocks: [
        {
          id: 'kb-phy-devices-types-1',
          type: 'paragraph',
          text: `| 设备 | 端口数 | 工作原理 | 冲突域 |
|------|--------|----------|--------|
| **中继器** | 2 个 | 信号放大、整形后从另一端发出 | 两端属同一冲突域 |
| **集线器** | 多个 | 任一端口收到信号，**广播**到所有其他端口 | 所有端口属同一冲突域 |`,
        },
        {
          id: 'kb-phy-devices-types-2',
          type: 'paragraph',
          text: '集线器本质上是**多端口中继器**，收到信号后不加区分地转发给所有其他端口，不查看 MAC 地址，因为物理层根本不认识帧结构。\n\n集线器连接的所有主机共享同一冲突域，同一时刻只能有一台主机发送，否则碰撞。',
        },
      ],
    },
    {
      id: 'phy-devices-vs-others',
      title: '与其他层设备的分辨',
      blocks: [
        {
          id: 'kb-phy-devices-vs-1',
          type: 'paragraph',
          text: `| 设备 | 工作层 | 隔离冲突域 | 隔离广播域 |
|------|--------|-----------|-----------|
| 中继器 / 集线器 | 物理层 | ❌ 不隔离 | ❌ 不隔离 |
| 网桥 / 交换机 | 数据链路层 | ✅ 隔离 | ❌ 不隔离 |
| 路由器 | 网络层 | ✅ 隔离 | ✅ 隔离 |`,
        },
        {
          id: 'kb-phy-devices-vs-2',
          type: 'callout',
          title: '抑制广播风暴的设备',
          text: '能抑制广播风暴的只有路由器。中继器和集线器不能抑制，交换机和网桥也不能（广播帧会泛洪到所有端口）。',
          tone: 'orange',
        },
      ],
    },
  ],
}
