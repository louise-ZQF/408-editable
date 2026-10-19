import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const udpHeaderArticle: KnowledgeArticleData = {
  pointId: 'kp-udp-header',
  subpoints: [
    {
      id: 'udp-header-fields',
      title: 'UDP 数据报',
      blocks: [
        {
          id: 'kb-udp-hdr-1',
          type: 'paragraph',
          text: 'UDP 在 IP 之上只提供复用/解复用和可选校验。UDP 首部只有 8 字节，不到 TCP 首部（20 字节起）的一半。',
        },
        {
          id: 'kb-udp-hdr-2',
          type: 'html',
          html: `<svg viewBox="0 0 820 320" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { font-family: system-ui, sans-serif; }
    .hdr { font-size: 14px; font-weight: 700; text-anchor: middle; fill: #1e293b; }
    .fld { font-size: 12px; font-weight: 700; text-anchor: middle; fill: #1e293b; }
    .dim { font-size: 10px; fill: #64748b; text-anchor: middle; }
    .hdrbox { fill: #dbeafe; stroke: #3b82f6; stroke-width: 1.6; }
    .data { fill: #f1f5f9; stroke: #94a3b8; stroke-width: 1.4; }
    .psrc { fill: #fef3c7; stroke: #d97706; stroke-width: 1.4; }
    .pdst { fill: #dcfce7; stroke: #16a34a; stroke-width: 1.4; }
    .pz { fill: #e0e7ff; stroke: #6366f1; stroke-width: 1.4; }
    .plen { fill: #fce7f3; stroke: #db2777; stroke-width: 1.4; }
  </style>

  <text x="400" y="22" class="hdr">UDP 数据报结构（首部 8 字节 + 数据）</text>

  <!-- 比特号 -->
  <g font-size="10" fill="#64748b" text-anchor="middle">
    <text x="24" y="42">0</text><text x="216" y="42">15</text>
    <text x="288" y="42">16</text><text x="480" y="42">31</text>
    <text x="552" y="42">32</text><text x="744" y="42">47</text>
    <text x="792" y="42">63</text>
  </g>

  <!-- UDP 首部分四行各 2 字节 -->
  <rect x="16" y="50" width="384" height="42" rx="3" class="hdrbox"/>
  <rect x="400" y="50" width="384" height="42" rx="3" class="hdrbox"/>
  <text x="208" y="70" class="fld">源端口 16 bit</text>
  <text x="208" y="85" class="dim">发送方端口号</text>
  <text x="592" y="70" class="fld">目的端口 16 bit</text>
  <text x="592" y="85" class="dim">接收方端口号</text>

  <rect x="16" y="92" width="384" height="42" rx="3" class="hdrbox"/>
  <rect x="400" y="92" width="384" height="42" rx="3" class="hdrbox"/>
  <text x="208" y="112" class="fld">长度 16 bit</text>
  <text x="208" y="127" class="dim">UDP 首部 + 数据的总长度（含 8B）</text>
  <text x="592" y="112" class="fld">校验和 16 bit</text>
  <text x="592" y="127" class="dim">覆盖伪首部 + UDP 首部 + 数据</text>

  <!-- 数据 -->
  <rect x="16" y="134" width="768" height="50" rx="3" class="data"/>
  <text x="400" y="160" class="fld" fill="#475569">数据（0 ~ 65507 字节）</text>
  <text x="400" y="176" class="dim">= UDP 长度字段 - 8 字节首部</text>
</svg>`,
        },
        {
          id: 'kb-udp-hdr-3',
          type: 'paragraph',
          text: 'UDP 的端口字段 16 bit，合法端口 0 到 65535，分为三类：\n\n1. 0 到 1023：熟知端口（如 DNS=53、SNMP=161）。\n2. 1024 到 49151：登记端口。\n3. 49152 以上：临时端口。',
        },
      ],
    },
    {
      id: 'udp-features',
      title: 'UDP 的特点',
      blocks: [
        {
          id: 'kb-udp-feat-1',
          type: 'paragraph',
          text: '**① 无连接**：发送数据前不需要握手，也不维护连接状态（发送方和接收方都不用记住对方）。每个 UDP 数据报都是独立发送的，发完即走。',
        },
        {
          id: 'kb-udp-feat-2',
          type: 'paragraph',
          text: '**② 支持一对一、一对多、多对一、多对多**：TCP 只能一对一；UDP 没有连接概念，一个进程可以往任意多个目的发送，也可以接收来自多个源的数据报，天然支持组播和广播。',
        },
        {
          id: 'kb-udp-feat-3',
          type: 'paragraph',
          text: '**③ 首部开销小**：UDP 首部只有 8 字节（源端口 2 + 目的端口 2 + 长度 2 + 校验和 2），远小于 TCP 首部的 20 字节起。',
        },
        {
          id: 'kb-udp-feat-4',
          type: 'paragraph',
          text: '**④ 无拥塞控制**：UDP 不会像 TCP 那样因网络拥塞而放慢发送速度，应用想发多少就发多少。丢包时 UDP 不做重传，也不保证按序到达，可靠性完全交给上层应用。',
        },
        {
          id: 'kb-udp-feat-5',
          type: 'paragraph',
          text: '**⑤ 面向报文**：UDP 对应用层交下来的报文不合并、不拆分，一个报文就是一个 UDP 数据报原样封装发送。因此接收方收到的数据边界和发送方每次 send 调用完全一致，而 TCP 是字节流、边界不保留。',
        },
        {
          id: 'kb-udp-feat-6',
          type: 'paragraph',
          text: '**⑥ 复用与分用**：UDP 用**端口号**实现复用/分用，机制和 TCP 相同。\n\n1. 复用：发送时把源端口、目的端口写进首部。\n2. 分用：接收方根据**目的端口**把数据报交给对应的应用进程。\n\nTCP 靠四元组（源 IP、源端口、目的 IP、目的端口）精确定位唯一一条连接；UDP 只靠目的端口就能分用，因为没有连接的概念。',
        },
        {
          id: 'kb-udp-feat-7',
          type: 'callout',
          title: 'UDP vs TCP 一句话',
          text: 'TCP 面向连接、可靠、有序、有拥塞控制、一对一、字节流；UDP 无连接、不可靠、无序、无拥塞控制、支持多对多、报文边界保留。',
          tone: 'orange',
        },
      ],
    },
    {
      id: 'udp-header-scenarios',
      title: 'UDP 常见用途',
      blocks: [
        {
          id: 'kb-udp-hdr-s-1',
          type: 'paragraph',
          text: 'UDP 不需要握手、无状态、首部开销小，适合实时应用：\n\n1. DNS 查询。\n2. DHCP。\n3. SNMP 网管。\n4. HTTP/3（QUIC 基于 UDP）。\n5. 实时视频/语音、流媒体直播。\n\n这些应用丢包可以接受，但是时延抖动不能大。',
        },
      ],
    },
  ],
}
