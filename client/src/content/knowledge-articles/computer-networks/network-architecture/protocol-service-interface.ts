import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const protocolServiceInterfaceArticle: KnowledgeArticleData = {
  pointId: 'kp-protocol',
  subpoints: [
    {
      id: 'psi-protocol',
      title: '协议的三要素',
      blocks: [
        {
          id: 'kb-protocol-protocol-1',
          type: 'paragraph',
          text: '**协议**（Protocol）是同一层中**对等实体**（peer entity）之间通信的规则集合，作用在**水平方向**，即两台主机同一层之间的约定。协议包含三个要素：',
        },
        {
          id: 'kb-protocol-protocol-2',
          type: 'paragraph',
          text: `1. **语法**——规定数据的格式。例如 IP 首部各字段的排列顺序、每个字段占多少比特。

2. **语义**——规定每个字段的含义。例如 TTL 字段的数值代表剩余跳数，协议号字段的值代表上层是 TCP 还是 UDP。

3. **同步**——规定通信双方事件的先后顺序。例如 TCP 三次握手必须先发 SYN、对方回复 SYN+ACK、最后发 ACK，这个顺序不能乱。`,
        },
        {
          id: 'kb-protocol-protocol-5',
          type: 'paragraph',
          text: '例如一张消息序列图：发送方发消息 1 → 接收方回确认 1 → 发送方发消息 2，问描述的是哪个要素，答案就是同步。',
        },
        {
          id: 'kb-protocol-protocol-6',
          type: 'paragraph',
          text: '对等层之间交换的数据单元叫 **PDU**（Protocol Data Unit）。不同层的 PDU 名称不同：\n\n1. 物理层：比特流。\n2. 数据链路层：帧。\n3. 网络层：分组/数据报。\n4. 传输层：报文段。',
        },
        {
          id: 'kb-protocol-protocol-7',
          type: 'html',
          html: `<svg viewBox="0 0 360 140" xmlns="http://www.w3.org/2000/svg">
  <style>text { font-family: system-ui, sans-serif; font-size: 11px; }</style>
  <text x="36" y="16" fill="#374151" font-weight="700" font-size="12">发送方</text>
  <text x="310" y="16" fill="#374151" font-weight="700" font-size="12">接收方</text>
  <line x1="36" y1="24" x2="36" y2="120" stroke="#d1d5db" stroke-width="1"/>
  <line x1="324" y1="24" x2="324" y2="120" stroke="#d1d5db" stroke-width="1"/>
  <line x1="36" y1="48" x2="324" y2="68" stroke="#2563eb" stroke-width="1.5" marker-end="url(#ab)"/>
  <text x="180" y="44" fill="#2563eb" text-anchor="middle" font-size="10">消息 1</text>
  <line x1="324" y1="76" x2="36" y2="96" stroke="#059669" stroke-width="1.5" marker-end="url(#ag)"/>
  <text x="180" y="92" fill="#059669" text-anchor="middle" font-size="10">确认 1</text>
  <line x1="36" y1="104" x2="324" y2="116" stroke="#2563eb" stroke-width="1.5" marker-end="url(#ab)"/>
  <text x="180" y="114" fill="#2563eb" text-anchor="middle" font-size="10">消息 2</text>
  <defs>
    <marker id="ab" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="#2563eb"/></marker>
    <marker id="ag" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="#059669"/></marker>
  </defs>
</svg>`,
        },
      ],
    },
    {
      id: 'psi-service',
      title: '服务',
      blocks: [
        {
          id: 'kb-protocol-service-1',
          type: 'paragraph',
          text: '**服务**（Service）描述一层能为它的直接上层完成什么功能，是**垂直关系**，即第 N 层使用第 N-1 层的服务，同时向第 N+1 层提供服务。',
        },
        {
          id: 'kb-protocol-service-2',
          type: 'paragraph',
          text: '相邻层之间通过四种**服务原语**（Service Primitive）交互：',
        },
        {
          id: 'kb-protocol-service-3',
          type: 'paragraph',
          text: `1. **请求**（Request）——上层请求下层做某件事。

2. **指示**（Indication）——下层通知上层有事件发生。

3. **响应**（Response）——上层对指示的应答。

4. **确认**（Confirm）——下层通知上层请求已完成。`,
        },
        {
          id: 'kb-protocol-service-7',
          type: 'paragraph',
          text: '只要接口不变，下层协议可以随意替换。把 IPv4 换成 IPv6，上层的 TCP 和应用层完全不用改。',
        },
      ],
    },
    {
      id: 'psi-interface',
      title: '接口',
      blocks: [
        {
          id: 'kb-protocol-interface-1',
          type: 'paragraph',
          text: '**接口**（Interface）是相邻两层之间交换信息的具体位置。上层通过**服务访问点**（SAP，Service Access Point）调用下层提供的服务。',
        },
        {
          id: 'kb-protocol-interface-2',
          type: 'paragraph',
          text: '不同层的 SAP 不同：\n\n1. 传输层的 SAP 是**端口号**。\n2. 网络层的 SAP 是 **IP 地址**。\n3. 数据链路层的 SAP 是 **MAC 地址**。',
        },
        {
          id: 'kb-protocol-interface-3',
          type: 'html',
          html: `<svg viewBox="0 0 540 200" xmlns="http://www.w3.org/2000/svg">
  <style>text { font-family: system-ui, sans-serif; font-size: 11px; }</style>
  <rect x="16" y="20" width="120" height="156" fill="#f9fafb" stroke="#d1d5db" stroke-width="1.5" rx="4"/>
  <text x="76" y="14" fill="#374151" font-weight="700" font-size="12" text-anchor="middle">主机 A</text>
  <rect x="24" y="30" width="104" height="32" fill="#dbeafe" stroke="#93c5fd" stroke-width="1" rx="3"/>
  <text x="76" y="51" fill="#1e40af" text-anchor="middle" font-weight="600">N+1 层</text>
  <line x1="76" y1="62" x2="76" y2="68" stroke="#dc2626" stroke-width="1.5" marker-end="url(#rd)"/>
  <rect x="24" y="72" width="104" height="32" fill="#d1fae5" stroke="#6ee7b7" stroke-width="1" rx="3"/>
  <text x="76" y="93" fill="#064e3b" text-anchor="middle" font-weight="600">N 层</text>
  <line x1="76" y1="104" x2="76" y2="110" stroke="#dc2626" stroke-width="1.5" marker-end="url(#rd)"/>
  <rect x="24" y="114" width="104" height="32" fill="#fef3c7" stroke="#fcd34d" stroke-width="1" rx="3"/>
  <text x="76" y="135" fill="#92400e" text-anchor="middle" font-weight="600">N-1 层</text>
  <rect x="404" y="20" width="120" height="156" fill="#f9fafb" stroke="#d1d5db" stroke-width="1.5" rx="4"/>
  <text x="464" y="14" fill="#374151" font-weight="700" font-size="12" text-anchor="middle">主机 B</text>
  <rect x="412" y="30" width="104" height="32" fill="#dbeafe" stroke="#93c5fd" stroke-width="1" rx="3"/>
  <text x="464" y="51" fill="#1e40af" text-anchor="middle" font-weight="600">N+1 层</text>
  <line x1="464" y1="62" x2="464" y2="68" stroke="#dc2626" stroke-width="1.5" marker-end="url(#rd)"/>
  <rect x="412" y="72" width="104" height="32" fill="#d1fae5" stroke="#6ee7b7" stroke-width="1" rx="3"/>
  <text x="464" y="93" fill="#064e3b" text-anchor="middle" font-weight="600">N 层</text>
  <line x1="464" y1="104" x2="464" y2="110" stroke="#dc2626" stroke-width="1.5" marker-end="url(#rd)"/>
  <rect x="412" y="114" width="104" height="32" fill="#fef3c7" stroke="#fcd34d" stroke-width="1" rx="3"/>
  <text x="464" y="135" fill="#92400e" text-anchor="middle" font-weight="600">N-1 层</text>
  <line x1="128" y1="46" x2="412" y2="46" stroke="#2563eb" stroke-width="2" stroke-dasharray="6,3"/>
  <text x="270" y="40" fill="#2563eb" text-anchor="middle" font-weight="700" font-size="10">← 协议（水平，对等实体间的通信规则）→</text>
  <line x1="128" y1="88" x2="412" y2="88" stroke="#2563eb" stroke-width="2" stroke-dasharray="6,3"/>
  <text x="270" y="102" fill="#2563eb" text-anchor="middle" font-weight="700" font-size="10">← 协议 →</text>
  <text x="270" y="140" fill="#059669" text-anchor="middle" font-weight="700" font-size="10">↑ 服务（垂直，下层为上层提供能力）↓</text>
  <defs><marker id="rd" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="#dc2626"/></marker></defs>
</svg>`,
        },
      ],
    },
    {
      id: 'psi-distinction',
      title: '协议/服务/接口三者区别',
      blocks: [
        {
          id: 'kb-protocol-triple-1',
          type: 'paragraph',
          text: '● 题意为"对等层""同一层"时，考查的是**协议**：协议是同一层中对等实体之间的通信规则。',
        },
        {
          id: 'kb-protocol-triple-2',
          type: 'paragraph',
          text: '● 题意为"某层为上层提供什么""下层向上层"时，考查的是**服务**：服务是下层向上层提供的能力。',
        },
        {
          id: 'kb-protocol-triple-3',
          type: 'paragraph',
          text: '● 题意为"相邻层边界""SAP"时，考查的是**接口**：接口是相邻两层交换信息的具体位置。',
        },
      ],
    },
  ],
}
