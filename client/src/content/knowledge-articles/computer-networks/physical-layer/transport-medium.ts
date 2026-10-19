import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const transportMediumArticle: KnowledgeArticleData = {
  pointId: 'kp-transport-medium',
  subpoints: [
    {
      id: 'medium-compare',
      title: '导向传输介质对比',
      blocks: [
        {
          id: 'kb-medium-compare-1',
          type: 'paragraph',
          text: '导向传输介质引导信号沿固定路径传播，主要有三类：双绞线、同轴电缆和光纤。',
        },
        {
          id: 'kb-medium-compare-2',
          type: 'paragraph',
          text: `| 特性 | 双绞线 | 同轴电缆 | 光纤 |
|------|--------|----------|------|
| 传输信号 | 电信号 | 电信号 | 光信号 |
| 抗干扰 | 一般（屏蔽型较好） | 较好 | 极好（不受电磁干扰） |
| 传输距离 | 短（100 m 以内） | 较长 | 很远（数十 km） |
| 带宽容量 | 较低 | 中等 | 极高 |
| 成本 | 低 | 中等 | 高 |
| 双工方式 | **全双工**（不同线对收发）| **半双工**（同轴共享）| **全双工**（两根光纤各一方向） |
| 典型场景 | 100BaseT 以太网 | 有线电视 | 长途干线、WAN |`,
        },
      ],
    },
    {
      id: 'medium-fiber',
      title: '光纤',
      blocks: [
        {
          id: 'kb-medium-fiber-1',
          type: 'paragraph',
          text: '光纤利用光的**全反射**原理传输光信号。光纤由纤芯（高折射率）和包层（低折射率）组成，光线在纤芯与包层的界面上不断全反射而向前传播。\n\n光源用 LED 或激光，接收端用光电二极管。光纤一般成对使用（一根发送、一根接收），天然支持**全双工**。',
        },
        {
          id: 'kb-medium-fiber-2',
          type: 'paragraph',
          text: '**多模光纤**纤芯粗，多条入射角不同的光线同时传播。各光线的路径长度不同，导致到达时间分散（模式色散），限制了传输距离和速率，但光源和连接器成本低。\n\n**单模光纤**纤芯极细（接近波长），只允许一条光线沿轴向传播，无色散，带宽和距离远优于多模，但激光器成本高。',
        },
      ],
    },
    {
      id: 'medium-twisted-pair',
      title: '双绞线',
      blocks: [
        {
          id: 'kb-medium-tp-1',
          type: 'paragraph',
          text: '双绞线把两根绝缘铜线按一定密度绞合在一起，利用绞合抵消外部电磁干扰。\n\n双绞线分为**屏蔽双绞线**（STP）和**非屏蔽双绞线**（UTP）：\n\n1. **STP** 外部有金属屏蔽层，抗干扰优于 UTP，但成本更高、更硬更难敷设。\n2. **UTP** 是最常用的局域网介质，100 米内可支持 100 Mbps 到 10 Gbps。\n\n双绞线使用不同线对分别收和发，天然支持**全双工**，两端可同时发送。',
        },
      ],
    },
    {
      id: 'medium-coaxial',
      title: '同轴电缆',
      blocks: [
        {
          id: 'kb-medium-coax-1',
          type: 'paragraph',
          text: '同轴电缆由内导体、绝缘层、网状屏蔽层和塑料外护套组成。屏蔽层将电磁干扰反射回去，抗干扰能力强于双绞线。\n\n**基带同轴电缆**（50Ω）用于数字传输。\n\n**宽带同轴电缆**（75Ω）用于模拟传输（如有线电视）。\n\n同轴电缆所有设备共享同一根导体，只能**半双工**通信，同一时刻只能一端发送，其余端接收。',
        },
      ],
    },
    {
      id: 'medium-ethernet-naming',
      title: '判断以太网传输介质',
      blocks: [
        {
          id: 'kb-medium-naming-1',
          type: 'paragraph',
          text: '以太网标准命名格式为**速率 + Base + 介质标识**，例如 `100BaseT`、`1000BaseLX`。通过后缀即可判断所用介质，无需死记每个标准。',
        },
        {
          id: 'kb-medium-naming-2',
          type: 'paragraph',
          text: `| 后缀 | 介质 | 含义 |
|------|------|------|
| **T** | 双绞线 | Twisted Pair，如 100BaseT、1000BaseT |
| **TX** | 双绞线 | 两对 UTP |
| **T4** | 双绞线 | 四对 UTP |
| **FX** | 光纤 | Fiber，如 100BaseFX |
| **SX** | 光纤 | Short wavelength |
| **LX** | 光纤 | Long wavelength |
| **CX** | 同轴电缆 | Copper/Coax，如 1000BaseCX |
| 数字后无字母 | 粗/细同轴电缆 | 如 10Base5（粗）、10Base2（细） |`,
        },
        {
          id: 'kb-medium-naming-3',
          type: 'paragraph',
          text: '**通法**：看后缀首字母。**T** = Twisted Pair（双绞线），**F/S/L** = Fiber（光纤），**C** = Coaxial（同轴电缆）。数字部分代表速率（Mbps），Base 代表基带传输。',
        },
        {
          id: 'kb-medium-naming-4',
          type: 'paragraph',
          text: `判断以下以太网标准使用的**传输介质**和**速率**：

| 标准名 | 介质 | 速率 | 判据 |
|--------|------|------|------|
| **1000BaseT** | 双绞线 | 1000 Mbps | 后缀 T → Twisted Pair |
| **100BaseFX** | 光纤 | 100 Mbps | 后缀 FX → Fiber |
| **10Base5** | 粗同轴电缆 | 10 Mbps | 数字 5 → 500m 粗缆 |
| **1000BaseLX** | 光纤 | 1000 Mbps | 后缀 LX → Long wavelength |
| **10Base2** | 细同轴电缆 | 10 Mbps | 数字 2 → 185m 细缆 |
| **1000BaseCX** | 同轴电缆 | 1000 Mbps | 后缀 CX → Copper/Coax |
| **100BaseTX** | 双绞线 | 100 Mbps | 后缀 TX → Twisted Pair |
| **1000BaseSX** | 光纤 | 1000 Mbps | 后缀 SX → Short wavelength |

**通法**：数字即速率（Mbps），Base = 基带传输，后缀首字母定介质——T→双绞线，F/L/S→光纤，C→同轴电缆，基数→粗/细同轴。`,
        },
      ],
    },
  ],
}
