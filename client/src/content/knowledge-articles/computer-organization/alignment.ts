import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const alignmentArticle: KnowledgeArticleData = {
  pointId: 'co-alignment',
  subpoints: [
    {
      id: 'co-alignment-basic',
      title: '数据对齐',
      blocks: [
        {
          id: 'kb-co-alignment-1-1',
          type: 'paragraph',
          text: '**数据对齐**要求变量地址是其类型大小的整数倍。存放一个 int 变量时，把内存想象成只能放 int 的数组，这个变量只能放在 0、4、8、12 等地址上（假设按字节编址）。',
        },
        {
          id: 'kb-co-alignment-1-5',
          type: 'html',
          html: `<svg viewBox="0 0 820 520" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { font-family: system-ui, sans-serif; }
    .t { font-size: 15px; font-weight: 700; fill: #1e293b; text-anchor: middle; }
    .sub { font-family: 'JetBrains Mono', 'Courier New', monospace; font-size: 13px; fill: #334155; text-anchor: middle; }
    .lbl { font-size: 14px; font-weight: 700; text-anchor: middle; }
    .off { font-size: 11px; fill: #64748b; text-anchor: end; }
    .b { font-size: 12px; fill: #475569; text-anchor: middle; }
    .mem-name { font-size: 14px; font-weight: 700; fill: #0f172a; }
    .mem-desc { font-size: 12px; fill: #475569; }
  </style>

  <text x="410" y="26" class="t">结构体对齐：struct S { char c; int i; double d; }</text>
  <text x="410" y="50" class="sub">char 1B ｜ int 4B ｜ double 8B → 结构体对齐因子 = 8</text>

  <!-- 内存竖条：16 字节，从上往下地址递增 -->
  <rect x="90" y="80" width="130" height="20" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>
  <rect x="90" y="100" width="130" height="60" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="5,3"/>
  <rect x="90" y="160" width="130" height="80" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/>
  <rect x="90" y="240" width="130" height="160" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>

  <!-- 每字节分界线 -->
  <g stroke="#e2e8f0" stroke-width="1">
    <line x1="90" y1="120" x2="220" y2="120"/>
    <line x1="90" y1="140" x2="220" y2="140"/>
    <line x1="90" y1="180" x2="220" y2="180"/>
    <line x1="90" y1="200" x2="220" y2="200"/>
    <line x1="90" y1="220" x2="220" y2="220"/>
    <line x1="90" y1="260" x2="220" y2="260"/>
    <line x1="90" y1="280" x2="220" y2="280"/>
    <line x1="90" y1="300" x2="220" y2="300"/>
    <line x1="90" y1="320" x2="220" y2="320"/>
    <line x1="90" y1="340" x2="220" y2="340"/>
    <line x1="90" y1="360" x2="220" y2="360"/>
    <line x1="90" y1="380" x2="220" y2="380"/>
  </g>

  <!-- 左侧偏移刻度 -->
  <line x1="84" y1="80" x2="84" y2="400" stroke="#cbd5e1" stroke-width="1"/>
  <g class="off">
    <text x="76" y="94">0</text>
    <text x="76" y="114">1</text>
    <text x="76" y="174">4</text>
    <text x="76" y="254">8</text>
    <text x="76" y="414">16</text>
  </g>

  <!-- 竖条内成员名 -->
  <text x="155" y="94" class="lbl" fill="#15803d">c</text>
  <text x="155" y="130" class="lbl" fill="#94a3b8">填充</text>
  <text x="155" y="200" class="lbl" fill="#1d4ed8">i</text>
  <text x="155" y="320" class="lbl" fill="#b45309">d</text>

  <!-- 右侧说明 -->
  <rect x="250" y="82" width="14" height="14" rx="3" fill="#dcfce7" stroke="#16a34a"/>
  <text x="274" y="94" class="mem-name">char c</text>
  <text x="340" y="94" class="mem-desc">偏移 0，占 1 字节（对齐因子 1）</text>

  <rect x="250" y="122" width="14" height="14" rx="3" fill="#f8fafc" stroke="#94a3b8" stroke-dasharray="3,2"/>
  <text x="274" y="134" class="mem-name">padding</text>
  <text x="340" y="134" class="mem-desc">偏移 1~3，填充 3 字节（int 对齐到 4）</text>

  <rect x="250" y="190" width="14" height="14" rx="3" fill="#dbeafe" stroke="#2563eb"/>
  <text x="274" y="202" class="mem-name">int i</text>
  <text x="340" y="202" class="mem-desc">偏移 4~7，占 4 字节（对齐因子 4）</text>

  <rect x="250" y="304" width="14" height="14" rx="3" fill="#fef3c7" stroke="#d97706"/>
  <text x="274" y="316" class="mem-name">double d</text>
  <text x="340" y="316" class="mem-desc">偏移 8~15，占 8 字节（对齐因子 8）</text>

  <text x="410" y="438" class="b">int 要求起始地址是 4 的倍数：偏移 1 不满足，所以 1~3 空出来</text>
  <text x="410" y="460" class="b">double 要求起始地址是 8 的倍数：偏移 4 不满足，所以从偏移 8 开始</text>
  <text x="410" y="482" class="b">结构体大小 = 1 + 3 + 4 + 8 = 16 字节，是 8 的倍数，末尾无需再补 padding</text>
  <text x="410" y="504" class="b">结构体对齐因子 = 8（取成员对齐因子最大值），整个结构体也按 8 对齐</text>
</svg>`,
        },
      ],
    },
    {
      id: 'co-endianness',
      title: '大小端',
      blocks: [
        {
          id: 'kb-co-endianness-1',
          type: 'paragraph',
          text: '**大小端**指多字节数据在内存中的字节序。\n\n**大端序**：高位字节存放在低地址，一个整数的第一个字节（最高有效字节）在起始地址。\n\n**小端序**：低位字节存放在低地址，最后一个字节（最低有效字节）在起始地址。',
        },
        {
          id: 'kb-co-endianness-2',
          type: 'paragraph',
          text: '例如 long a[2] = {0x76543210, 0xFEDCBA98}。\n\n小端序下，0x10 存低地址、0x76 存高地址。\n\n大端序下，0x76 存低地址、0x10 存高地址。',
        },
        {
          id: 'kb-co-endianness-6',
          type: 'html',
          html: `<svg viewBox="0 0 820 340" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { font-family: system-ui, sans-serif; }
    .t { font-size: 15px; font-weight: 700; fill: #1e293b; text-anchor: middle; }
    .b { font-size: 12px; fill: #475569; text-anchor: middle; }
    .hdr { font-size: 13px; font-weight: 700; fill: #0f172a; text-anchor: middle; }
    .addr { font-size: 12px; font-weight: 700; fill: #64748b; text-anchor: middle; }
    .val { font-size: 14px; font-weight: 700; text-anchor: middle; }
    .dir { font-size: 11px; fill: #94a3b8; text-anchor: middle; }
  </style>
  <defs>
    <marker id="down" viewBox="0 0 10 10" refX="5" refY="9" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L5 10 L10 0 z" fill="#cbd5e1"/></marker>
  </defs>

  <text x="410" y="26" class="t">大小端：0x76543210 在内存中的字节摆放</text>

  <!-- 大端（左）：4 行 1 列 -->
  <text x="210" y="56" class="b" fill="#1d4ed8">大端序：高位字节在低地址</text>
  <line x1="115" y1="100" x2="115" y2="252" stroke="#cbd5e1" stroke-width="1.5" marker-end="url(#down)"/>
  <text x="115" y="90" class="dir">低地址</text>
  <text x="115" y="272" class="dir">高地址</text>

  <rect x="130" y="72" width="60" height="24" fill="#f1f5f9" stroke="#cbd5e1"/>
  <rect x="190" y="72" width="100" height="24" fill="#f1f5f9" stroke="#cbd5e1"/>
  <text x="160" y="88" class="hdr">地址</text>
  <text x="240" y="88" class="hdr">字节</text>

  <rect x="130" y="96" width="60" height="40" fill="#ffffff" stroke="#e2e8f0"/>
  <rect x="190" y="96" width="100" height="40" fill="#fee2e2" stroke="#dc2626" stroke-width="1.5"/>
  <text x="160" y="120" class="addr">+0</text>
  <text x="240" y="120" class="val" fill="#b91c1c">76</text>

  <rect x="130" y="136" width="60" height="40" fill="#ffffff" stroke="#e2e8f0"/>
  <rect x="190" y="136" width="100" height="40" fill="#fef3c7" stroke="#d97706" stroke-width="1.5"/>
  <text x="160" y="160" class="addr">+1</text>
  <text x="240" y="160" class="val" fill="#b45309">54</text>

  <rect x="130" y="176" width="60" height="40" fill="#ffffff" stroke="#e2e8f0"/>
  <rect x="190" y="176" width="100" height="40" fill="#dbeafe" stroke="#2563eb" stroke-width="1.5"/>
  <text x="160" y="200" class="addr">+2</text>
  <text x="240" y="200" class="val" fill="#1d4ed8">32</text>

  <rect x="130" y="216" width="60" height="40" fill="#ffffff" stroke="#e2e8f0"/>
  <rect x="190" y="216" width="100" height="40" fill="#dcfce7" stroke="#16a34a" stroke-width="1.5"/>
  <text x="160" y="240" class="addr">+3</text>
  <text x="240" y="240" class="val" fill="#15803d">10</text>

  <!-- 小端（右）：4 行 1 列 -->
  <text x="610" y="56" class="b" fill="#15803d">小端序：低位字节在低地址</text>
  <line x1="515" y1="100" x2="515" y2="252" stroke="#cbd5e1" stroke-width="1.5" marker-end="url(#down)"/>
  <text x="515" y="90" class="dir">低地址</text>
  <text x="515" y="272" class="dir">高地址</text>

  <rect x="530" y="72" width="60" height="24" fill="#f1f5f9" stroke="#cbd5e1"/>
  <rect x="590" y="72" width="100" height="24" fill="#f1f5f9" stroke="#cbd5e1"/>
  <text x="560" y="88" class="hdr">地址</text>
  <text x="640" y="88" class="hdr">字节</text>

  <rect x="530" y="96" width="60" height="40" fill="#ffffff" stroke="#e2e8f0"/>
  <rect x="590" y="96" width="100" height="40" fill="#dcfce7" stroke="#16a34a" stroke-width="1.5"/>
  <text x="560" y="120" class="addr">+0</text>
  <text x="640" y="120" class="val" fill="#15803d">10</text>

  <rect x="530" y="136" width="60" height="40" fill="#ffffff" stroke="#e2e8f0"/>
  <rect x="590" y="136" width="100" height="40" fill="#dbeafe" stroke="#2563eb" stroke-width="1.5"/>
  <text x="560" y="160" class="addr">+1</text>
  <text x="640" y="160" class="val" fill="#1d4ed8">32</text>

  <rect x="530" y="176" width="60" height="40" fill="#ffffff" stroke="#e2e8f0"/>
  <rect x="590" y="176" width="100" height="40" fill="#fef3c7" stroke="#d97706" stroke-width="1.5"/>
  <text x="560" y="200" class="addr">+2</text>
  <text x="640" y="200" class="val" fill="#b45309">54</text>

  <rect x="530" y="216" width="60" height="40" fill="#ffffff" stroke="#e2e8f0"/>
  <rect x="590" y="216" width="100" height="40" fill="#fee2e2" stroke="#dc2626" stroke-width="1.5"/>
  <text x="560" y="240" class="addr">+3</text>
  <text x="640" y="240" class="val" fill="#b91c1c">76</text>

  <text x="410" y="300" class="b">大端：低地址（+0）存 0x76 高字节；小端：低地址（+0）存 0x10 低字节</text>
  <text x="410" y="322" class="b">读 0x76543210：起始字节是 0x76 还是 0x10，取决于机器字节序</text>
</svg>`,
        },
      ],
    },
  ],
}
