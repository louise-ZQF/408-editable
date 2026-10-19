import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'
import { arpProcessAnimation } from '@/animations/computer-networks/network-layer/arp-process'

export const arpArticle: KnowledgeArticleData = {
  pointId: 'kp-arp',
  subpoints: [
    {
      id: 'arp-purpose',
      title: 'ARP 协议细节',
      blocks: [
        {
          id: 'kb-arp-purpose-1',
          type: 'paragraph',
          text: '发送方知道下一跳的 IP 地址，但封装数据链路层帧时必须知道对应的 MAC 地址。**ARP** 把同一个局域网内的 IP 地址映射到对应的 MAC 地址。',
        },
        {
          id: 'kb-arp-purpose-2',
          type: 'callout',
          title: 'ARP 只作用于同一链路',
          text: 'ARP 只能在同一个局域网内工作，不能跨路由器解析。跨网络的数据要先通过 ARP 找到下一跳路由器接口的 MAC 地址，再由路由器转发。',
          tone: 'orange',
        },
        {
          id: 'kb-arp-purpose-3',
          type: 'callout',
          title: 'ARP 运行在哪一层、用什么封装',
          text: 'ARP 属于网络层协议，但它的报文要放进以太网帧的数据部分才能上链路。以太网帧通过类型字段（0x0806）标识载荷是 ARP 报文，接收方据此把帧交给网络层的 ARP 模块处理。因此 ARP 介于网络层与链路层之间。',
          tone: 'blue',
        },
        {
          id: 'kb-arp-process-1',
          type: 'paragraph',
          text: '**ARP 的解析分两个过程**：\n\n- **请求广播**：发送方把 ARP 请求帧的目的 MAC 填成广播地址（全 1），在局域网内广播"谁的 IP 是 xxx，请回复你的 MAC"。\n- **应答单播**：目标主机收到后，把 ARP 应答单播回发送方，告诉它自己的 MAC 地址。\n\n下面的动画演示这两个过程。',
        },
        {
          id: 'kb-arp-process-anim',
          type: 'animation',
          animation: arpProcessAnimation,
          sourceImport: {
            path: '@/animations/computer-networks/network-layer/arp-process',
            localName: 'arpProcessAnimation',
            kind: 'named',
          },
        },
      ],
    },
    {
      id: 'arp-default-gateway',
      title: 'ARP 寻找默认网关',
      blocks: [
        {
          id: 'kb-arp-gateway-1',
          type: 'paragraph',
          text: '当主机要访问**外部网络**（目的 IP 不在本局域网内）时，它不能把链路层帧直接送到目的主机，因为跨网段的主机不在同一条链路上，MAC 层够不着。此时主机把数据报交给**默认网关**（default gateway，通常是连接本局域网的路由器接口 IP）。',
        },
        {
          id: 'kb-arp-gateway-2',
          type: 'paragraph',
          text: '但要封装以太网帧，主机仍然必须知道**默认网关的 MAC 地址**。于是它对默认网关的 IP 发起 ARP 请求，解析出网关接口的 MAC。\n\n帧的目的 MAC 填网关 MAC，IP 首部的目的 IP 始终是最终目的地，保持不变。',
        },
        {
          id: 'kb-arp-gateway-3',
          type: 'html',
          html: `<svg viewBox="0 0 760 300" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { font-family: system-ui, sans-serif; }
    .hdr { font-size: 14px; font-weight: 700; fill: #1e293b; }
    .dim { font-size: 11px; fill: #64748b; }
    .pk  { font-size: 12px; font-weight: 600; fill: #0f172a; }
    .lan { fill: #f1f5f9; stroke: #94a3b8; stroke-width: 2; }
    .dev { fill: #ffffff; stroke: #2563eb; stroke-width: 2; }
  </style>
  <defs>
    <marker id="arr-g" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="#dc2626"/>
    </marker>
    <marker id="arr-b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="#2563eb"/>
    </marker>
  </defs>

  <text x="380" y="24" class="hdr" text-anchor="middle">H1 访问 Internet：ARP 解析默认网关的 MAC</text>

  <!-- H1 -->
  <rect x="30" y="70" width="150" height="90" rx="4" class="dev"/>
  <text x="105" y="96" class="pk" text-anchor="middle">主机 H1</text>
  <text x="105" y="118" class="dim" text-anchor="middle">IP 166.1.0.1</text>
  <text x="105" y="136" class="dim" text-anchor="middle">MAC AA:BB:CC:DD:EE:11</text>

  <!-- 局域网 -->
  <rect x="200" y="30" width="540" height="150" rx="8" class="lan"/>
  <text x="470" y="52" class="dim" text-anchor="middle">局域网 166.1.0.0/17</text>

  <!-- 路由器 -->
  <rect x="360" y="80" width="160" height="80" rx="4" fill="#fef3c7" stroke="#d97706" stroke-width="2.5"/>
  <text x="440" y="106" class="pk" fill="#92400e" text-anchor="middle">路由器 R（默认网关）</text>
  <text x="440" y="128" class="dim" fill="#92400e" text-anchor="middle">B2 口 IP 166.1.5</text>
  <text x="440" y="146" class="dim" fill="#92400e" text-anchor="middle">MAC AA:BB:CC:DD:EE:B2</text>

  <!-- Internet -->
  <rect x="640" y="80" width="80" height="80" rx="4" class="dev"/>
  <text x="680" y="112" class="pk" text-anchor="middle">Internet</text>
  <text x="680" y="132" class="dim" text-anchor="middle">目的 IP X.X.X.X</text>

  <!-- ARP 请求：H1 → 默认网关 -->
  <path d="M 180 115 C 240 140, 320 145, 358 128" stroke="#dc2626" stroke-width="2.5" fill="none" stroke-dasharray="6 4" marker-end="url(#arr-g)"/>
  <text x="250" y="166" class="dim" fill="#dc2626" text-anchor="middle">① ARP 请求：谁是 166.1.5？</text>

  <!-- ARP 应答 -->
  <path d="M 360 100 C 300 88, 230 92, 182 102" stroke="#16a34a" stroke-width="2.5" fill="none" stroke-dasharray="6 4"/>
  <text x="250" y="82" class="dim" fill="#16a34a" text-anchor="middle">② 应答：166.1.5 的 MAC = AA:BB:CC:DD:EE:B2</text>

  <!-- 数据报转发 -->
  <path d="M 520 120 L 640 120" stroke="#2563eb" stroke-width="2.5" fill="none" marker-end="url(#arr-b)"/>
  <text x="580" y="108" class="dim" fill="#2563eb" text-anchor="middle">③ 帧交给网关，路由器再转发</text>

  <text x="380" y="220" class="dim" text-anchor="middle">帧：目的 MAC = 网关 MAC（AA:BB:CC:DD:EE:B2），目的 IP = X.X.X.X（保持不变）</text>
  <text x="380" y="240" class="dim" text-anchor="middle">路由器收到后剥掉链路层帧，按目的 IP 查路由表，再封装发往下一跳</text>
</svg>`,
        },
        {
          id: 'kb-arp-gateway-4',
          type: 'callout',
          title: '判断ARP的目标',
          text: '先判断目的 IP 是否与本机在同一子网：在同一子网就 ARP 目的主机，不在同一子网就 ARP 默认网关。',
          tone: 'orange',
        },
      ],
    },
  ],
}
