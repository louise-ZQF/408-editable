import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const udpChecksumArticle: KnowledgeArticleData = {
  pointId: 'kp-udp-checksum',
  subpoints: [
    {
      id: 'udp-cs-pseudo-header',
      title: '伪首部与校验和计算',
      blocks: [
        {
          id: 'kb-udp-cs-1',
          type: 'paragraph',
          text: 'UDP 的校验和覆盖三部分内容：\n\n1. **IP 伪首部**。\n2. **UDP 首部**。\n3. **UDP 数据**。\n\n伪首部是计算校验和时临时拼接在 UDP 报文前面的 12 字节内容，不随报文发送，用于让 UDP 再校验一次源 IP、目的 IP、协议号是否正确。',
        },
        {
          id: 'kb-udp-cs-2',
          type: 'html',
          html: `<svg viewBox="0 0 800 420" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { font-family: system-ui, sans-serif; }
    .hdr { font-size: 14px; font-weight: 700; fill: #1e293b; text-anchor: middle; }
    .fld { font-size: 12px; font-weight: 700; fill: #1e293b; text-anchor: middle; }
    .dim { font-size: 10px; fill: #64748b; text-anchor: middle; }
    .psrc { fill: #fef3c7; stroke: #d97706; stroke-width: 1.6; }
    .pdst { fill: #dcfce7; stroke: #16a34a; stroke-width: 1.6; }
    .pzero { fill: #e0e7ff; stroke: #6366f1; stroke-width: 1.4; }
    .pproto { fill: #fed7aa; stroke: #ea580c; stroke-width: 1.4; }
    .plen  { fill: #fce7f3; stroke: #db2777; stroke-width: 1.6; }
    .udph  { fill: #dbeafe; stroke: #3b82f6; stroke-width: 1.6; }
    .data  { fill: #f1f5f9; stroke: #94a3b8; stroke-width: 1.4; }
    .range { stroke: #dc2626; stroke-width: 2; fill: none; stroke-dasharray: 6,3; }
  </style>

  <text x="400" y="22" class="hdr">UDP 校验和计算范围（红色虚线框出的部分全部参与）</text>

  <!-- ====== 伪首部 12 字节 ====== -->
  <text x="400" y="54" class="hdr" fill="#dc2626">IP 伪首部（12 字节，仅用于校验）</text>

  <rect x="16" y="64" width="384" height="40" rx="2" class="psrc"/>
  <rect x="400" y="64" width="384" height="40" rx="2" class="pdst"/>
  <text x="208" y="84" class="fld" fill="#92400e">源 IP 地址（32 bit）</text>
  <text x="592" y="84" class="fld" fill="#166534">目的 IP 地址（32 bit）</text>

  <rect x="16" y="104" width="160" height="36" rx="2" class="pzero"/>
  <rect x="176" y="104" width="160" height="36" rx="2" class="pproto"/>
  <rect x="336" y="104" width="448" height="36" rx="2" class="plen"/>
  <text x="96" y="122" class="fld" fill="#3730a3">0（8 bit）</text>
  <text x="256" y="122" class="fld" fill="#9a3412">协议号 17（8 bit）</text>
  <text x="560" y="122" class="fld" fill="#9d174d">UDP 长度（16 bit）</text>

  <!-- ====== UDP 首部 8 字节 ====== -->
  <text x="400" y="168" class="hdr">UDP 首部（8 字节）</text>

  <rect x="16" y="178" width="192" height="38" rx="2" class="udph"/>
  <rect x="208" y="178" width="192" height="38" rx="2" class="udph"/>
  <rect x="400" y="178" width="192" height="38" rx="2" class="udph"/>
  <rect x="592" y="178" width="192" height="38" rx="2" class="udph"/>
  <text x="112" y="196" class="fld">源端口 (16)</text>
  <text x="304" y="196" class="fld">目的端口 (16)</text>
  <text x="496" y="196" class="fld">长度 (16)</text>
  <text x="688" y="196" class="fld">校验和 (16)</text>

  <!-- ====== UDP 数据 ====== -->
  <text x="400" y="242" class="hdr">UDP 数据（补齐到 16 bit 整数倍）</text>
  <rect x="16" y="252" width="768" height="46" rx="2" class="data"/>
  <text x="400" y="274" class="fld" fill="#475569">UDP 数据</text>
  <text x="400" y="290" class="dim">奇数字节时末尾补 1 字节 0（校验时加入、传输时不发送）</text>

  <!-- ====== 整体校验范围（红框） ====== -->
  <rect x="10" y="60" width="780" height="242" class="range" rx="4"/>

  <!-- ====== 步骤 ====== -->
  <rect x="16" y="318" width="768" height="88" rx="4" fill="#fef9c3" stroke="#ca8a04" stroke-width="1"/>
  <text x="400" y="338" class="hdr" fill="#854d0e">计算步骤</text>
  <text x="400" y="358" class="fld" fill="#713f12">① 把伪首部 + UDP 首部 + 数据按 16 bit 字分组，奇数字节补 0</text>
  <text x="400" y="376" class="fld" fill="#713f12">② 每 16 bit 字做二进制反码求和（相加有进位则循环加回最低位）</text>
  <text x="400" y="394" class="fld" fill="#713f12">③ 结果再取反即为校验和；全 0 可选项（表示"发送方不做校验"）</text>
</svg>`,
        },
      ],
    },
    {
      id: 'udp-cs-example',
      title: '二进制反码求和',
      blocks: [
        {
          id: 'kb-udp-cs-ex-1',
          type: 'paragraph',
          text: '假设伪首部 + UDP 首部 + 数据按 16 bit 分组得到三个字：1010101010101010、1111000011110000、0000111100001111。',
        },
        {
          id: 'kb-udp-cs-ex-2',
          type: 'paragraph',
          text: '**第一步：逐字求和**。前两个字相加 = 1 0001010110011010，最高位进位 1 循环加回低位 → 0001010110011011。再加第三字 → 0010010010101010。',
        },
        {
          id: 'kb-udp-cs-ex-3',
          type: 'paragraph',
          text: '**第二步：取反**。0010010010101010 取反 = 1101101101010101，这就是 UDP 首部校验和字段要填的值。接收方把同样的三部分相加后再与校验和相加，正确结果应是全 1（16 个 1），否则丢弃。',
        },
        {
          id: 'kb-udp-cs-ex-4',
          type: 'callout',
          title: '和 TCP 校验的区别',
          text: 'TCP 校验和使用相同的伪首部算法，只有协议号字段填 6（UDP 填 17）。TCP 校验和是强制的，UDP 校验和可选，IPv4 下允许发送方填全 0 表示跳过校验，IPv6 下 UDP 校验和强制必须计算。',
          tone: 'orange',
        },
        {
          id: 'kb-udp-cs-ex-5',
          type: 'callout',
          title: 'IPv4 UDP 校验和算出来恰好全 0 怎么办？',
          text: '二进制反码中，0 有两种表示：16 个 0（0x0000）和 16 个 1（0xFFFF）。如果发送方算出的校验和恰好是 16 个 0，必须填成 16 个 1（0xFFFF），否则接收方会误以为"发送方跳过了校验"。反过来，如果发送方不打算算校验和，校验和字段直接填全 0。',
          tone: 'orange',
        },
      ],
    },
  ],
}
