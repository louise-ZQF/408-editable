import { subnetVlsmAnimation } from '@/animations/computer-networks/network-layer/subnet-vlsm'

import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const subnetArticle: KnowledgeArticleData = {
  pointId: 'kp-subnet',
  subpoints: [
    {
      id: 'subnet-basics',
      title: 'CIDR 与子网掩码',
      blocks: [
        {
          id: 'kb-subnet-cidr-1',
          type: 'paragraph',
          text: 'CIDR 取消了 A/B/C 类的固定分类，用**斜杠记法**把网络前缀长度写出来：192.168.1.0/24 表示前 24 位是网络前缀，后 8 位是主机号。',
        },
        {
          id: 'kb-subnet-cidr-2',
          type: 'paragraph',
          text: 'CIDR 可以把多个连续网络**聚合**成一个更大的网络（路由聚合，route aggregation），减少路由表条目。',
        },
        {
          id: 'kb-subnet-mask-1',
          type: 'paragraph',
          text: '**子网掩码**是与 IP 地址等长的 32 位数字，网络号对应位为 1、主机号对应位为 0。把 IP 地址与子网掩码做**按位与**，得到的就是网络地址。',
        },
        {
          id: 'kb-subnet-mask-2',
          type: 'formula',
          formula: String.raw`\text{网络地址} = \text{IP 地址} \land \text{子网掩码}`,
        },
        {
          id: 'kb-subnet-mask-3',
          type: 'paragraph',
          text: '例如 IP 192.168.1.10、掩码 255.255.255.0，与运算后网络地址是 192.168.1.0。斜杠记法的 /24 与 255.255.255.0 是同一件事。',
        },
        {
          id: 'kb-subnet-host-1',
          type: 'paragraph',
          text: '一个子网能容纳的主机数由**主机号位数**决定。主机号占 $n$ 位时，理论上最多有 $2^n$ 个组合，其中两个要保留、不能分配给主机。',
        },
        {
          id: 'kb-subnet-host-2',
          type: 'formula',
          formula: String.raw`\text{可用主机数} = 2^n - 2`,
        },
        {
          id: 'kb-subnet-host-3',
          type: 'paragraph',
          text: '减去的两个是：\n\n- 主机号**全 0**：网络地址，标识子网本身。\n- 主机号**全 1**：广播地址，向子网内所有主机广播。\n\n这两个地址都不能分配给主机。',
        },
        {
          id: 'kb-subnet-host-4',
          type: 'paragraph',
          text: '例如 /24 子网的主机号占 8 位，可用主机数 = $2^8 - 2 = 254$，其中 0 保留给网络地址、255 保留给广播地址，实际可用 1 到 254。',
        },
      ],
    },
    {
      id: 'vlsm',
      title: 'VLSM 可变长子网划分',
      blocks: [
        {
          id: 'kb-subnet-vlsm-1',
          type: 'paragraph',
          text: '**VLSM**（可变长子网掩码）允许在一个网络内使用不同长度的子网掩码，把地址块按实际需求切成大小不等的子网。\n\n1. 需要主机多的子网：分配大块地址。\n2. 只需要少数地址的子网：分配小块地址。\n\n这样能节省地址空间。',
        },
        {
          id: 'kb-subnet-vlsm-anim',
          type: 'animation',
          animation: subnetVlsmAnimation,
        },
      ],
    },
  ],
}
