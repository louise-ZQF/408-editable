import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'
import { dhcpProcessAnimation } from '@/animations/computer-networks/network-layer/dhcp-process'

export const dhcpArticle: KnowledgeArticleData = {
  pointId: 'kp-dhcp',
  subpoints: [
    {
      id: 'dhcp-purpose',
      title: 'DHCP 动态分配 IP',
      blocks: [
        {
          id: 'kb-dhcp-purpose-1',
          type: 'paragraph',
          text: '**DHCP** 为主机自动分配 IP 地址、子网掩码、默认网关和 DNS 服务器等配置，避免手工配置。主机开机后无需知道网络参数，直接从 DHCP 服务器获取。',
        },
        {
          id: 'kb-dhcp-purpose-2',
          type: 'callout',
          title: 'DHCP 是应用层协议',
          text: 'DHCP 使用 UDP，客户端端口 68、服务器端口 67。虽然服务于网络层地址配置，但协议本身位于应用层，借助广播来发现服务器。',
          tone: 'blue',
        },
      ],
    },
    {
      id: 'dhcp-process',
      title: 'DHCP四步交互',
      blocks: [
        {
          id: 'kb-dhcp-process-anim',
          type: 'animation',
          animation: dhcpProcessAnimation,
          sourceImport: {
            path: '@/animations/computer-networks/network-layer/dhcp-process',
            localName: 'dhcpProcessAnimation',
            kind: 'named',
          },
        },
        {
          id: 'kb-dhcp-process-1',
          type: 'paragraph',
          text: `1. **DHCPDISCOVER**：客户端广播（目的 MAC = FF-FF-FF-FF-FF-FF），寻找 DHCP 服务器。
2. **DHCPOFFER**：服务器**单播**应答（目的 MAC 填客户端 MAC），提供一个可用地址。
3. **DHCPREQUEST**：客户端广播（目的 MAC = FF-FF-FF-FF-FF-FF），确认选择该地址。
4. **DHCPACK**：服务器**单播**确认（目的 MAC 填客户端 MAC），地址租约生效。`,
        },
        {
          id: 'kb-dhcp-process-2',
          type: 'paragraph',
          text: '分配到的地址是**租约**形式，租期过半客户端会续租。地址可被回收后再次分配，实现地址复用。',
        },
      ],
    },
  ],
}
