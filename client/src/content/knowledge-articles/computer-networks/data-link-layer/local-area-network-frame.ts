import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const lanFrameArticle: KnowledgeArticleData = {
  pointId: 'kp-local-area-network-frame',
  subpoints: [
    {
      id: 'ethernet-frame',
      title: '以太网 MAC 帧',
      blocks: [
        {
          id: 'kb-lan-frame-mac-1',
          type: 'paragraph',
          text: '以太网 MAC 帧是数据链路层在以太网中传输的帧格式。在物理层传输时，MAC 帧前后还要加上**前导码**（7 字节同步信号）和**帧首定界符**（1 字节 10101011）来同步时钟。',
        },
        {
          id: 'kb-lan-frame-mac-2',
          type: 'paragraph',
          text: `| 字段 | 字节数 | 说明 |
|------|--------|------|
| 目的地址 | 6 | 接收方 MAC 地址 |
| 源地址 | 6 | 发送方 MAC 地址 |
| 类型/长度 | 2 | ≤1500 为长度，≥1536 为上层协议类型 |
| 数据 | 46 到 1500 | 上层数据，不足 46 字节需填充 |
| FCS | 4 | CRC-32 检验，覆盖除前导码和帧首定界符外的全部字段 |`,
        },
        {
          id: 'kb-lan-frame-mac-5',
          type: 'html',
          html: `<svg viewBox="0 0 500 96" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { font-family: system-ui, sans-serif; }
    .hdr { font-size: 13px; font-weight: 700; fill: #1e293b; }
    .dim { font-size: 10px; fill: #64748b; }
    .lbl { font-size: 11px; font-weight: 700; fill: #1e293b; text-anchor: middle; }
  </style>

  <text x="16" y="18" class="hdr">标准以太网帧</text>

  <rect x="16" y="28" width="98" height="44" rx="3" fill="#dbeafe" stroke="#3b82f6" stroke-width="1.5"/>
  <text x="65" y="46" class="lbl">目的 MAC</text>
  <text x="65" y="60" class="dim" text-anchor="middle">6 字节</text>

  <rect x="120" y="28" width="98" height="44" rx="3" fill="#dbeafe" stroke="#3b82f6" stroke-width="1.5"/>
  <text x="169" y="46" class="lbl">源 MAC</text>
  <text x="169" y="60" class="dim" text-anchor="middle">6 字节</text>

  <rect x="224" y="28" width="60" height="44" rx="3" fill="#dbeafe" stroke="#3b82f6" stroke-width="1.5"/>
  <text x="254" y="46" class="lbl">类型</text>
  <text x="254" y="60" class="dim" text-anchor="middle">2</text>

  <rect x="290" y="28" width="120" height="44" rx="3" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.5"/>
  <text x="350" y="46" class="lbl" fill="#64748b">数据</text>
  <text x="350" y="60" class="dim" text-anchor="middle">46~1500 字节</text>

  <rect x="416" y="28" width="56" height="44" rx="3" fill="#fef3c7" stroke="#d97706" stroke-width="1.5"/>
  <text x="444" y="46" class="lbl" fill="#92400e">FCS</text>
  <text x="444" y="60" class="dim" text-anchor="middle">4</text>
</svg>`,
        },
        {
          id: 'kb-lan-frame-mac-3',
          type: 'paragraph',
          text: '**最短帧长**为 64 字节（目的地址 6 + 源地址 6 + 类型 2 + 数据 46 + FCS 4 = 64）。数据不足 46 字节时用填充补齐，这是 CSMA/CD 冲突检测所必需的，过短的帧无法在发送完成前检测到冲突。',
        },
        {
          id: 'kb-lan-frame-mac-4',
          type: 'paragraph',
          text: '**最长数据字段**为 1500 字节，即以太网的 MTU。超过 MTU 的数据需要由网络层的 IP 分片处理。',
        },
      ],
    },
    {
      id: 'wireless-frame',
      title: '802.11 无线帧',
      blocks: [
        {
          id: 'kb-lan-frame-wireless-1',
          type: 'paragraph',
          text: '802.11 数据帧有**三个地址字段**（地址 1、地址 2、地址 3），用于标识这一跳无线链路的收发方以及最终的源/目的地址。每个地址的含义由帧控制字段中的 **To DS** 和 **From DS** 两个比特决定。',
        },
        {
          id: 'kb-lan-frame-wireless-2',
          type: 'html',
          html: `<svg viewBox="0 0 680 480" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { font-family: system-ui, sans-serif; }
    .hdr { font-size: 18px; font-weight: 700; fill: #1e293b; }
    .fld { font-size: 14px; font-weight: 700; text-anchor: middle; }
    .val { font-size: 13px; font-weight: 600; text-anchor: middle; }
    .dim { font-size: 12px; fill: #64748b; text-anchor: middle; }
    .box { fill: #dbeafe; stroke: #3b82f6; stroke-width: 2; }
    .ap  { fill: #fef3c7; stroke: #d97706; stroke-width: 2; }
    .ext { fill: #dcfce7; stroke: #16a34a; stroke-width: 2; }
    .a1 { fill: #dbeafe; stroke: #2563eb; stroke-width: 2; }
    .a2 { fill: #fef3c7; stroke: #d97706; stroke-width: 2; }
    .a3 { fill: #dcfce7; stroke: #16a34a; stroke-width: 2; }
    .frame-num { font-size: 16px; font-weight: 700; fill: #ffffff; text-anchor: middle; }
    .frame-lbl { font-size: 13px; font-weight: 600; fill: #1e293b; text-anchor: middle; }
  </style>

  <!-- ========== 拓扑部分 ========== -->
  <text x="340" y="26" class="hdr">A → AP → B：两跳无线传输</text>

  <!-- A 站 -->
  <rect x="40" y="44" width="64" height="44" rx="4" class="box"/>
  <text x="72" y="72" class="hdr">A</text>

  <!-- AP -->
  <rect x="308" y="44" width="68" height="44" rx="4" class="ap"/>
  <text x="342" y="72" class="hdr">AP</text>

  <!-- B 站 -->
  <rect x="572" y="44" width="64" height="44" rx="4" class="ext"/>
  <text x="604" y="72" class="hdr">B</text>

  <!-- ① 帧：A → AP -->
  <line x1="104" y1="66" x2="300" y2="66" stroke="#2563eb" stroke-width="2.5" marker-end="url(#arrow-blue)"/>
  <defs>
    <marker id="arrow-blue" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="#2563eb"/>
    </marker>
    <marker id="arrow-orange" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="#d97706"/>
    </marker>
  </defs>
  <!-- 圆圈 ① -->
  <circle cx="200" cy="66" r="13" fill="#2563eb"/>
  <text x="200" y="71" class="frame-num">①</text>
  <text x="200" y="100" class="frame-lbl">帧 ①：A 发往 AP</text>

  <!-- ② 帧：AP → B -->
  <line x1="376" y1="66" x2="564" y2="66" stroke="#d97706" stroke-width="2.5" marker-end="url(#arrow-orange)"/>
  <!-- 圆圈 ② -->
  <circle cx="470" cy="66" r="13" fill="#d97706"/>
  <text x="470" y="71" class="frame-num">②</text>
  <text x="470" y="100" class="frame-lbl">帧 ②：AP 发往 B</text>

  <!-- ========== 帧 ① 结构 ========== -->
  <text x="16" y="135" class="hdr">帧 ①：A → AP（To DS = 1，From DS = 0）</text>

  <rect x="16" y="148" width="648" height="72" rx="4" fill="none" stroke="#cbd5e1" stroke-width="1"/>

  <!-- Addr1 = AP -->
  <rect x="22" y="154" width="200" height="60" rx="3" class="a1"/>
  <text x="122" y="176" class="fld" fill="#1e40af">地址 1（RA）</text>
  <text x="122" y="196" class="val" fill="#1e40af">接收方 = AP</text>
  <text x="122" y="208" class="dim">这一跳发给谁</text>

  <!-- Addr2 = A -->
  <rect x="228" y="154" width="200" height="60" rx="3" class="a2"/>
  <text x="328" y="176" class="fld" fill="#92400e">地址 2（TA）</text>
  <text x="328" y="196" class="val" fill="#92400e">发送方 = A</text>
  <text x="328" y="208" class="dim">这一跳谁发的</text>

  <!-- Addr3 = B -->
  <rect x="434" y="154" width="224" height="60" rx="3" class="a3"/>
  <text x="546" y="176" class="fld" fill="#166534">地址 3（DA）</text>
  <text x="546" y="196" class="val" fill="#166534">最终目的 = B</text>
  <text x="546" y="208" class="dim">AP 收到后转发</text>

  <!-- ========== 帧 ② 结构 ========== -->
  <text x="16" y="265" class="hdr">帧 ②：AP → B（To DS = 0，From DS = 1）</text>

  <rect x="16" y="278" width="648" height="72" rx="4" fill="none" stroke="#cbd5e1" stroke-width="1"/>

  <!-- Addr1 = B -->
  <rect x="22" y="284" width="200" height="60" rx="3" class="a1"/>
  <text x="122" y="306" class="fld" fill="#1e40af">地址 1（RA）</text>
  <text x="122" y="326" class="val" fill="#1e40af">接收方 = B</text>
  <text x="122" y="338" class="dim">这一跳发给谁</text>

  <!-- Addr2 = AP -->
  <rect x="228" y="284" width="200" height="60" rx="3" class="a2"/>
  <text x="328" y="306" class="fld" fill="#92400e">地址 2（TA）</text>
  <text x="328" y="326" class="val" fill="#92400e">发送方 = AP</text>
  <text x="328" y="338" class="dim">这一跳谁发的</text>

  <!-- Addr3 = A -->
  <rect x="434" y="284" width="224" height="60" rx="3" class="a3"/>
  <text x="546" y="306" class="fld" fill="#166534">地址 3（SA）</text>
  <text x="546" y="326" class="val" fill="#166534">原始来源 = A</text>
  <text x="546" y="338" class="dim">数据真正的发出者</text>

</svg>`,
        },
        {
          id: 'kb-lan-frame-wireless-4',
          type: 'paragraph',
          text: '地址 1 和地址 2 永远描述**这一跳无线链路**的接收方和发送方。地址 3 描述端到端的最终目的或原始来源：\n\n1. To DS = 1：地址 3 是最终目的（DA）。\n2. From DS = 1：地址 3 是原始源（SA）。',
        },
      ],
    },
    {
      id: 'mac-address',
      title: 'MAC 地址',
      blocks: [
        {
          id: 'kb-lan-frame-macaddr-1',
          type: 'paragraph',
          text: '**MAC 地址**（即硬件地址、物理地址）长 48 bit，前 24 bit 是厂商标识符，后 24 bit 由厂商自行分配。\n\n1. 地址第一位为 0：单播地址。\n2. 地址第一位为 1：组播地址。\n3. 全 1（FF-FF-FF-FF-FF-FF）：广播地址。',
        },
      ],
    },
  ],
}
