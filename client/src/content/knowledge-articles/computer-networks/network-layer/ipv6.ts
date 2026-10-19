import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const ipv6Article: KnowledgeArticleData = {
  pointId: 'kp-ipv6',
  subpoints: [
    {
      id: 'ipv6-address',
      title: 'IPv6 地址与表示',
      blocks: [
        {
          id: 'kb-ipv6-address-1',
          type: 'paragraph',
          text: 'IPv6 地址长 **128 位**，用**冒号十六进制**表示，分为 8 组、每组 16 位：`2001:0db8:0000:0000:0000:ff00:0042:8329`。',
        },
        {
          id: 'kb-ipv6-address-2',
          type: 'paragraph',
          text: '**压缩规则**：\n\n1. 每组前导 0 可省略。\n2. 连续的全 0 组可用 `::` 代替一次（如 `2001:db8::ff00:42:8329`）。',
        },
      ],
    },
    {
      id: 'ipv6-basic-header',
      title: 'IPv6 基本首部固定 40 字节',
      blocks: [
        {
          id: 'kb-ipv6-header-1',
          type: 'html',
          html: `<svg viewBox="0 0 740 360" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { font-family: system-ui, sans-serif; }
    .field { font-size: 12px; font-weight: 700; fill: #0f172a; text-anchor: middle; }
    .desc { font-size: 10px; fill: #334155; text-anchor: middle; }
    .dim  { font-size: 11px; fill: #64748b; }
  </style>

  <rect x="20" y="40" width="200" height="52" fill="#dbeafe" stroke="#2563eb" stroke-width="1.5"/>
  <text x="120" y="60" class="field">版本（4 bit）</text>
  <text x="120" y="78" class="desc">固定 6</text>
  <rect x="220" y="40" width="200" height="52" fill="#dbeafe" stroke="#2563eb" stroke-width="1.5"/>
  <text x="320" y="60" class="field">流量类型（8 bit）</text>
  <text x="320" y="78" class="desc">类似区分服务</text>
  <rect x="420" y="40" width="280" height="52" fill="#dbeafe" stroke="#2563eb" stroke-width="1.5"/>
  <text x="560" y="60" class="field">流标签（20 bit）</text>
  <text x="560" y="78" class="desc">标识同一数据流</text>

  <rect x="20" y="92" width="200" height="52" fill="#dcfce7" stroke="#16a34a" stroke-width="1.5"/>
  <text x="120" y="112" class="field">载荷长度（16 bit）</text>
  <text x="120" y="130" class="desc">扩展首部+数据的字节数</text>
  <rect x="220" y="92" width="200" height="52" fill="#fef3c7" stroke="#d97706" stroke-width="1.5"/>
  <text x="320" y="112" class="field">下一个首部（8 bit）</text>
  <text x="320" y="130" class="desc">TCP/UDP/ICMP/扩展首部</text>
  <rect x="420" y="92" width="280" height="52" fill="#f1f5f9" stroke="#64748b" stroke-width="1.5"/>
  <text x="560" y="112" class="field">跳数限制（8 bit）</text>
  <text x="560" y="130" class="desc">类似 TTL，每跳减 1</text>

  <rect x="20" y="144" width="680" height="52" fill="#dbeafe" stroke="#2563eb" stroke-width="1.5"/>
  <text x="360" y="164" class="field">源地址（128 bit）</text>
  <text x="360" y="182" class="desc">16 字节</text>

  <rect x="20" y="196" width="680" height="52" fill="#dbeafe" stroke="#2563eb" stroke-width="1.5"/>
  <text x="360" y="216" class="field">目的地址（128 bit）</text>
  <text x="360" y="234" class="desc">16 字节</text>

  <rect x="20" y="260" width="680" height="60" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4 3"/>
  <text x="360" y="294" class="field" fill="#475569">扩展首部 + 上层数据</text>

  <text x="377" y="340" class="dim" text-anchor="middle">固定 40 字节：版本/流量类型/流标签 4 字节 + 载荷长度/下一个首部/跳数限制 4 字节 + 源/目的地址 32 字节</text>
</svg>`,
        },
      ],
    },
    {
      id: 'ipv6-vs-ipv4',
      title: '与 IPv4 的区别',
      blocks: [
        {
          id: 'kb-ipv6-diff-1',
          type: 'paragraph',
          text: `| 对比项 | IPv4 | IPv6 |
|--------|------|------|
| 地址长度 | 32 位 | 128 位 |
| 首部 | 20 字节固定 + 选项 | 40 字节基本首部 |
| 分片 | 中间路由器可分片 | 只有源主机可分片，用扩展首部 |
| 校验和 | 有首部校验和 | 无校验和，交给上层 |
| 地址配置 | 多为 DHCP | 支持无状态自动配置 |
| 广播 | 有广播地址 | 无广播，用组播代替 |`,
        },
        {
          id: 'kb-ipv6-diff-2',
          type: 'callout',
          title: 'IPv6 为什么去掉首部校验和',
          text: 'IPv6 首部不再做校验和，因为链路层已有 CRC 校验，且去掉校验和能减少每跳处理开销，加快转发。',
          tone: 'blue',
        },
      ],
    },
    {
      id: 'ipv6-transition',
      title: '过渡技术',
      blocks: [
        {
          id: 'kb-ipv6-transition-1',
          type: 'paragraph',
          text: 'IPv4 到 IPv6 的过渡主要靠两种技术：\n\n1. **双协议栈**：设备同时支持两种协议，按目的地址选择。\n2. **隧道**：把 IPv6 数据报封装在 IPv4 数据报中穿越 IPv4 网络。',
        },
      ],
    },
  ],
}
