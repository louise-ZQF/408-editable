import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const ipv4Article: KnowledgeArticleData = {
  pointId: 'kp-ipv4',
  subpoints: [
    {
      id: 'ipv4-datagram',
      title: 'IPv4 数据报结构',
      blocks: [
        {
          id: 'kb-ipv4-dgram-1',
          type: 'paragraph',
          text: 'IPv4 数据报由**首部**和**数据部分**组成。首部固定部分 20 字节，后面可跟可选的选项字段；数据部分承载上层（TCP/UDP/ICMP）报文。',
        },
        {
          id: 'kb-ipv4-dgram-2',
          type: 'html',
          html: `<svg viewBox="0 0 760 470" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { font-family: system-ui, sans-serif; }
    .hdr { font-size: 14px; font-weight: 700; fill: #1e293b; }
    .dim { font-size: 11px; fill: #64748b; }
    .field { font-size: 12px; font-weight: 700; fill: #0f172a; text-anchor: middle; }
    .desc { font-size: 10px; fill: #334155; text-anchor: middle; }
    .bit { font-size: 9px; fill: #64748b; text-anchor: middle; }
  </style>

  <!-- 位标记 -->
  <text x="24" y="30" class="bit">0</text>
  <text x="184" y="30" class="bit">4</text>
  <text x="364" y="30" class="bit">8</text>
  <text x="544" y="30" class="bit">12</text>
  <text x="724" y="30" class="bit">16</text>
  <text x="370" y="42" class="bit" text-anchor="middle">31</text>

  <!-- 第一行 -->
  <rect x="20" y="46" width="84" height="44" fill="#dbeafe" stroke="#2563eb" stroke-width="1.5"/>
  <text x="62" y="64" class="field">版本</text>
  <text x="62" y="78" class="desc">4</text>
  <rect x="104" y="46" width="84" height="44" fill="#dbeafe" stroke="#2563eb" stroke-width="1.5"/>
  <text x="146" y="64" class="field">首部长度</text>
  <text x="146" y="78" class="desc">4 bit</text>
  <rect x="188" y="46" width="84" height="44" fill="#dbeafe" stroke="#2563eb" stroke-width="1.5"/>
  <text x="230" y="64" class="field">区分服务</text>
  <text x="230" y="78" class="desc">8 bit</text>
  <rect x="272" y="46" width="164" height="44" fill="#dbeafe" stroke="#2563eb" stroke-width="1.5"/>
  <text x="354" y="64" class="field">总长度</text>
  <text x="354" y="78" class="desc">16 bit</text>
  <rect x="436" y="46" width="64" height="44" fill="#dcfce7" stroke="#16a34a" stroke-width="1.5"/>
  <text x="468" y="64" class="field">标识</text>
  <text x="468" y="78" class="desc">16 bit</text>
  <rect x="500" y="46" width="104" height="44" fill="#dcfce7" stroke="#16a34a" stroke-width="1.5"/>
  <text x="552" y="64" class="field">标志 MF</text>
  <text x="552" y="78" class="desc">3 bit</text>
  <rect x="604" y="46" width="136" height="44" fill="#dcfce7" stroke="#16a34a" stroke-width="1.5"/>
  <text x="672" y="64" class="field">片偏移</text>
  <text x="672" y="78" class="desc">13 bit</text>

  <!-- 第二行 -->
  <rect x="20" y="90" width="94" height="44" fill="#dbeafe" stroke="#2563eb" stroke-width="1.5"/>
  <text x="67" y="108" class="field">生存时间 TTL</text>
  <text x="67" y="122" class="desc">8 bit</text>
  <rect x="114" y="90" width="94" height="44" fill="#dbeafe" stroke="#2563eb" stroke-width="1.5"/>
  <text x="161" y="108" class="field">协议</text>
  <text x="161" y="122" class="desc">8 bit</text>
  <rect x="208" y="90" width="164" height="44" fill="#fef3c7" stroke="#d97706" stroke-width="1.5"/>
  <text x="290" y="108" class="field">首部校验和</text>
  <text x="290" y="122" class="desc">16 bit</text>
  <rect x="372" y="90" width="176" height="44" fill="#dbeafe" stroke="#2563eb" stroke-width="1.5"/>
  <text x="460" y="108" class="field">源 IP 地址</text>
  <text x="460" y="122" class="desc">32 bit</text>
  <rect x="548" y="90" width="192" height="44" fill="#dbeafe" stroke="#2563eb" stroke-width="1.5"/>
  <text x="644" y="108" class="field">目的 IP 地址</text>
  <text x="644" y="122" class="desc">32 bit</text>

  <!-- 可选字段 -->
  <rect x="20" y="134" width="720" height="36" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1.5" stroke-dasharray="4 3"/>
  <text x="380" y="156" class="field" fill="#475569">选项（可选，最多 40 字节）</text>

  <!-- 数据部分 -->
  <rect x="20" y="170" width="720" height="150" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4 3"/>
  <text x="380" y="245" class="field" fill="#475569">数据部分（TCP / UDP / ICMP 报文）</text>

  <!-- 标注 -->
  <line x1="20" y1="320" x2="740" y2="320" stroke="#94a3b8" stroke-width="1"/>
  <text x="380" y="340" class="dim" text-anchor="middle">首部固定 20 字节 + 可选字段，最大总长度 65535 字节</text>
</svg>`,
        },
      ],
    },
    {
      id: 'ipv4-header-fields',
      title: '逐字段详解',
      blocks: [
        {
          id: 'kb-ipv4-header-fields-1',
          type: 'paragraph',
          text: '**版本**（4 bit）：IPv4 固定为 4，IPv6 为 6，路由器据此解释后面的字段。\n\n**首部长度**（4 bit）：以 4 字节为单位，最小 5（即 20 字节），有选项时更大。',
        },
        {
          id: 'kb-ipv4-header-fields-2',
          type: 'paragraph',
          text: '**区分服务**（8 bit）：早期用于区分服务等级，通常不用。\n\n**总长度**（16 bit）：整个数据报（首部+数据）的字节数，最大 65535，路由器据此判断一个帧里的数据报是否完整。',
        },
        {
          id: 'kb-ipv4-header-fields-3',
          type: 'paragraph',
          text: '**标识**（16 bit）：同一数据报分出的所有分片共用一个标识，供目的主机重组时辨认。\n\n**标志**（3 bit）：最低位 MF，MF=1 表示后面还有分片，MF=0 表示最后一个分片；中间位 DF，DF=1 禁止分片。\n\n**片偏移**（13 bit）：分片在原数据报中的偏移，以 8 字节为单位。',
        },
        {
          id: 'kb-ipv4-header-fields-4',
          type: 'callout',
          title: 'TTL 的作用',
          text: '生存时间 TTL 表示数据报最多能经过的路由器跳数，每经过一个路由器减 1，减到 0 就丢弃并向源发送 ICMP 超时报文。TTL 防止数据报在网络中无限循环。',
          tone: 'orange',
        },
        {
          id: 'kb-ipv4-header-fields-5',
          type: 'paragraph',
          text: '**协议**（8 bit）：标识数据部分交给哪个上层协议，TCP=6、UDP=17、ICMP=1。\n\n**首部校验和**（16 bit）：只校验首部。\n\n**源/目的 IP 地址**（各 32 bit）：端到端标识，不随跳数改变。',
        },
      ],
    },
    {
      id: 'ipv4-checksum',
      title: '首部校验和',
      blocks: [
        {
          id: 'kb-ipv4-checksum-1',
          type: 'paragraph',
          text: 'IPv4 的首部校验和**只校验首部**，不校验数据部分。发送方把首部按 16 位分组求和后取反填入校验和字段；接收方对首部重新求和，结果为 0 则正确，非 0 则丢弃。',
        },
        {
          id: 'kb-ipv4-checksum-2',
          type: 'callout',
          title: '为什么不校验数据',
          text: 'IP 只负责尽力而为地把数据报送到目的地，数据部分的差错由上层（TCP/UDP 的校验和或应用层）负责，IP 层只保证首部正确以便继续转发。',
          tone: 'blue',
        },
      ],
    },
    {
      id: 'ipv4-fragment',
      title: 'IPv4 分片',
      blocks: [
        {
          id: 'kb-ipv4-frag-1',
          type: 'paragraph',
          text: 'IPv4 数据报通过不同链路时会受到 MTU 限制。若数据报总长度超过下一条链路的 MTU，并且 DF 标志没有禁止分片，路由器可以把数据部分拆成多个分片。',
        },
        {
          id: 'kb-ipv4-frag-2',
          type: 'callout',
          title: '每个分片都有自己的首部',
          text: '分片后的总长度字段分别计算，不能只给第一个分片保留 IPv4 首部。',
          tone: 'blue',
        },
        {
          id: 'kb-ipv4-frag-3',
          type: 'paragraph',
          text: '片偏移字段以 8 字节为单位，因此前面的完整分片必须让数据部分对齐到 8 字节。计算单片容量时要先从 MTU 中扣除首部长度。',
        },
        {
          id: 'kb-ipv4-frag-4',
          type: 'formula',
          formula: String.raw`\text{单片数据量} = \left\lfloor \frac{MTU - \text{首部长度}}{8} \right\rfloor \times 8`,
        },
        {
          id: 'kb-ipv4-frag-5',
          type: 'paragraph',
          text: '某分片的片偏移等于它之前已经承载的数据字节数除以 8。除最后一个分片外，MF 标志为 1；最后一个分片的 MF 标志为 0。',
        },
        {
          id: 'kb-ipv4-frag-7',
          type: 'paragraph',
          text: '**例题**：一个 IPv4 数据报，首部 20 字节，数据部分 3000 字节（总长度 3020），需经过 MTU = 1500 字节的链路。求分片情况。',
        },
        {
          id: 'kb-ipv4-frag-8',
          type: 'paragraph',
          text: String.raw`**解**：每片首部 20 字节，单片最多可携带数据 $= 8 \times \lfloor (1500-20)/8 \rfloor = 8 \times 185 = 1480$ 字节。

- 第 1 片：数据 1480 字节，片偏移 0，MF=1。
- 第 2 片：数据 1480 字节，片偏移 $1480/8 = 185$，MF=1。
- 第 3 片：数据 $3000 - 2960 = 40$ 字节，片偏移 $2960/8 = 370$，MF=0（最后一片）。

三个分片的总长度分别为 1500、1500、60。接收方按标识 + 片偏移重组。`,
        },
      ],
    },
  ],
}
