import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const floatOpsArticle: KnowledgeArticleData = {
  pointId: 'co-ieee754-ops',
  subpoints: [
    {
      id: 'co-float-arithmetic',
      title: 'IEEE 754 浮点数加减运算',
      blocks: [
        {
          id: 'kb-co-float-4-1',
          type: 'paragraph',
          text: '浮点数加减分五步：\n\n1. 对阶：小阶向大阶看齐，尾数相应右移。\n2. 尾数加减。\n3. 规格化：左移或右移，使尾数恢复 $1.f$ 形式。\n4. 舍入：可能损失精度。\n5. 判溢出：阶码是否超出范围。',
        },
        {
          id: 'kb-co-float-4-2',
          type: 'callout',
          title: '对阶原则',
          text: '对阶时小阶向大阶看齐，因为尾数右移丢失低位比左移溢出更安全。',
          tone: 'orange',
        },
        {
          id: 'kb-co-float-4-3',
          type: 'paragraph',
          text: String.raw`**例子**：计算 IEEE 754 单精度 $12.5 + 0.75$。

① 转规格化：$12.5 = 1100.1_2 = 1.1001 \times 2^3$；$0.75 = 0.11_2 = 1.1 \times 2^{-1}$。

② 对阶：阶差 $3 - (-1) = 4$，小阶 $0.75$ 的尾数右移 4 位，$1.1 \times 2^{-1} \rightarrow 0.00011 \times 2^3$。

③ 尾数相加：$1.1001 + 0.00011 = 1.10101$。

④ 规格化：仍为 $1.10101 \times 2^3$，无需调整。

⑤ 无舍入，阶码未溢出。结果 $1.10101 \times 2^3 = 1101.01_2 = 13.25$。`,
        },
      ],
    },
    {
      id: 'co-float-rounding',
      title: '舍入',
      blocks: [
        {
          id: 'kb-co-float-5-1',
          type: 'paragraph',
          text: '尾数位数有限，运算结果超出可表示精度时，按**被舍部分**与中间值的关系舍入：\n\n1. 被舍部分首位是 0：直接舍去。\n2. 被舍部分首位是 1 且后续不全为 0（超过中间值）：末位进位。\n3. 被舍部分恰好是 1000…0（等于中间值）：舍入到末位为 0（偶数）。',
        },
        
        {
          id: 'kb-co-float-5-6',
          type: 'paragraph',
          text: String.raw`**例**：把 12.1 转成 IEEE 754 单精度。$12.1 = 1100.0001\,1001\,1001\,1001\,1001\ldots_2 = 1.100\,0001\,1001\,1001\,1001\,1001\ldots \times 2^3$。尾数保留 23 位，看被舍部分来决定舍入。`,
        },
        {
          id: 'kb-co-float-5-7',
          type: 'html',
          html: `<svg viewBox="0 0 940 300" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { font-family: system-ui, sans-serif; }
    .t { font-size: 15px; font-weight: 700; fill: #1e293b; text-anchor: middle; }
    .b { font-size: 12px; fill: #475569; text-anchor: middle; }
    .dim { font-size: 11px; fill: #64748b; text-anchor: middle; }
  </style>
  <text x="470" y="22" class="t">12.1 的浮点数表示（画到 40 位，后面还有更多位）</text>

  <g>
    <rect x="64" y="62" width="18" height="34" fill="#fee2e2" stroke="#dc2626" stroke-width="1"/>
    <text x="73.0" y="83.0" font-size="13" font-weight="700" text-anchor="middle" fill="#0f172a">0</text>
    <rect x="83" y="62" width="18" height="34" fill="#dbeafe" stroke="#2563eb" stroke-width="1"/>
    <text x="92.0" y="83.0" font-size="13" font-weight="700" text-anchor="middle" fill="#0f172a">1</text>
    <rect x="102" y="62" width="18" height="34" fill="#dbeafe" stroke="#2563eb" stroke-width="1"/>
    <text x="111.0" y="83.0" font-size="13" font-weight="700" text-anchor="middle" fill="#0f172a">0</text>
    <rect x="121" y="62" width="18" height="34" fill="#dbeafe" stroke="#2563eb" stroke-width="1"/>
    <text x="130.0" y="83.0" font-size="13" font-weight="700" text-anchor="middle" fill="#0f172a">0</text>
    <rect x="140" y="62" width="18" height="34" fill="#dbeafe" stroke="#2563eb" stroke-width="1"/>
    <text x="149.0" y="83.0" font-size="13" font-weight="700" text-anchor="middle" fill="#0f172a">0</text>
    <rect x="159" y="62" width="18" height="34" fill="#dbeafe" stroke="#2563eb" stroke-width="1"/>
    <text x="168.0" y="83.0" font-size="13" font-weight="700" text-anchor="middle" fill="#0f172a">0</text>
    <rect x="178" y="62" width="18" height="34" fill="#dbeafe" stroke="#2563eb" stroke-width="1"/>
    <text x="187.0" y="83.0" font-size="13" font-weight="700" text-anchor="middle" fill="#0f172a">0</text>
    <rect x="197" y="62" width="18" height="34" fill="#dbeafe" stroke="#2563eb" stroke-width="1"/>
    <text x="206.0" y="83.0" font-size="13" font-weight="700" text-anchor="middle" fill="#0f172a">1</text>
    <rect x="216" y="62" width="18" height="34" fill="#dbeafe" stroke="#2563eb" stroke-width="1"/>
    <text x="225.0" y="83.0" font-size="13" font-weight="700" text-anchor="middle" fill="#0f172a">0</text>
    <rect x="235" y="62" width="18" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="244.0" y="83.0" font-size="13" font-weight="700" text-anchor="middle" fill="#0f172a">1</text>
    <rect x="254" y="62" width="18" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="263.0" y="83.0" font-size="13" font-weight="700" text-anchor="middle" fill="#0f172a">0</text>
    <rect x="273" y="62" width="18" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="282.0" y="83.0" font-size="13" font-weight="700" text-anchor="middle" fill="#0f172a">0</text>
    <rect x="292" y="62" width="18" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="301.0" y="83.0" font-size="13" font-weight="700" text-anchor="middle" fill="#0f172a">0</text>
    <rect x="311" y="62" width="18" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="320.0" y="83.0" font-size="13" font-weight="700" text-anchor="middle" fill="#0f172a">0</text>
    <rect x="330" y="62" width="18" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="339.0" y="83.0" font-size="13" font-weight="700" text-anchor="middle" fill="#0f172a">0</text>
    <rect x="349" y="62" width="18" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="358.0" y="83.0" font-size="13" font-weight="700" text-anchor="middle" fill="#0f172a">1</text>
    <rect x="368" y="62" width="18" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="377.0" y="83.0" font-size="13" font-weight="700" text-anchor="middle" fill="#0f172a">1</text>
    <rect x="387" y="62" width="18" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="396.0" y="83.0" font-size="13" font-weight="700" text-anchor="middle" fill="#0f172a">0</text>
    <rect x="406" y="62" width="18" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="415.0" y="83.0" font-size="13" font-weight="700" text-anchor="middle" fill="#0f172a">0</text>
    <rect x="425" y="62" width="18" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="434.0" y="83.0" font-size="13" font-weight="700" text-anchor="middle" fill="#0f172a">1</text>
    <rect x="444" y="62" width="18" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="453.0" y="83.0" font-size="13" font-weight="700" text-anchor="middle" fill="#0f172a">1</text>
    <rect x="463" y="62" width="18" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="472.0" y="83.0" font-size="13" font-weight="700" text-anchor="middle" fill="#0f172a">0</text>
    <rect x="482" y="62" width="18" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="491.0" y="83.0" font-size="13" font-weight="700" text-anchor="middle" fill="#0f172a">0</text>
    <rect x="501" y="62" width="18" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="510.0" y="83.0" font-size="13" font-weight="700" text-anchor="middle" fill="#0f172a">1</text>
    <rect x="520" y="62" width="18" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="529.0" y="83.0" font-size="13" font-weight="700" text-anchor="middle" fill="#0f172a">1</text>
    <rect x="539" y="62" width="18" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="548.0" y="83.0" font-size="13" font-weight="700" text-anchor="middle" fill="#0f172a">0</text>
    <rect x="558" y="62" width="18" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="567.0" y="83.0" font-size="13" font-weight="700" text-anchor="middle" fill="#0f172a">0</text>
    <rect x="577" y="62" width="18" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="586.0" y="83.0" font-size="13" font-weight="700" text-anchor="middle" fill="#0f172a">1</text>
    <rect x="596" y="62" width="18" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="605.0" y="83.0" font-size="13" font-weight="700" text-anchor="middle" fill="#0f172a">1</text>
    <rect x="615" y="62" width="18" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="624.0" y="83.0" font-size="13" font-weight="700" text-anchor="middle" fill="#0f172a">0</text>
    <rect x="634" y="62" width="18" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="643.0" y="83.0" font-size="13" font-weight="700" text-anchor="middle" fill="#0f172a">0</text>
    <rect x="653" y="62" width="18" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="662.0" y="83.0" font-size="13" font-weight="700" text-anchor="middle" fill="#0f172a">1</text>
    <rect x="672" y="62" width="18" height="34" fill="#fef3c7" stroke="#d97706" stroke-width="1"/>
    <text x="681.0" y="83.0" font-size="13" font-weight="700" text-anchor="middle" fill="#0f172a">1</text>
    <rect x="691" y="62" width="18" height="34" fill="#fef3c7" stroke="#d97706" stroke-width="1"/>
    <text x="700.0" y="83.0" font-size="13" font-weight="700" text-anchor="middle" fill="#0f172a">0</text>
    <rect x="710" y="62" width="18" height="34" fill="#fef3c7" stroke="#d97706" stroke-width="1"/>
    <text x="719.0" y="83.0" font-size="13" font-weight="700" text-anchor="middle" fill="#0f172a">0</text>
    <rect x="729" y="62" width="18" height="34" fill="#fef3c7" stroke="#d97706" stroke-width="1"/>
    <text x="738.0" y="83.0" font-size="13" font-weight="700" text-anchor="middle" fill="#0f172a">1</text>
    <rect x="748" y="62" width="18" height="34" fill="#fef3c7" stroke="#d97706" stroke-width="1"/>
    <text x="757.0" y="83.0" font-size="13" font-weight="700" text-anchor="middle" fill="#0f172a">1</text>
    <rect x="767" y="62" width="18" height="34" fill="#fef3c7" stroke="#d97706" stroke-width="1"/>
    <text x="776.0" y="83.0" font-size="13" font-weight="700" text-anchor="middle" fill="#0f172a">0</text>
    <rect x="786" y="62" width="18" height="34" fill="#fef3c7" stroke="#d97706" stroke-width="1"/>
    <text x="795.0" y="83.0" font-size="13" font-weight="700" text-anchor="middle" fill="#0f172a">0</text>
    <rect x="805" y="62" width="18" height="34" fill="#fef3c7" stroke="#d97706" stroke-width="1"/>
    <text x="814.0" y="83.0" font-size="13" font-weight="700" text-anchor="middle" fill="#0f172a">1</text>
    <text x="840" y="83" font-size="20" font-weight="700" text-anchor="middle" fill="#94a3b8">…</text>
  </g>
  <line x1="672" y1="56" x2="672" y2="102" stroke="#0f172a" stroke-width="2"/>
  <text x="85"  y="120" class="dim">S=0</text>
  <text x="170" y="120" class="dim">E=130</text>
  <text x="430" y="120" class="dim">M（23 位）</text>
  <text x="770" y="120" class="dim">多余位</text>
  <text x="470" y="142" class="b">红 = 符号位　蓝 = 阶码　绿 = 尾数（保留）　橙 = 多余位（超出单精度 32 位，要舍掉）</text>

  <text x="470" y="172" class="b">被舍的多余位从 1001 1001… 开始，第一位是 1 → 至少等于中间值 0.5</text>
  <text x="470" y="190" class="b">后续 0011 0011 不全为 0 → 被舍部分 &gt; 0.5 → 必须向上进位</text>
  <text x="470" y="208" class="b">保留位末 4 位 1001 + 进位 1 = 1010 → 尾数 100 0001 1001 1001 1001 1010</text>

  <text x="470" y="238" class="t" fill="#1d4ed8">拼装机器数</text>
  <g>
    <rect x="190" y="248" width="90" height="34" fill="#fee2e2" stroke="#dc2626" stroke-width="1.5"/>
    <rect x="280" y="248" width="180" height="34" fill="#dbeafe" stroke="#2563eb" stroke-width="1.5"/>
    <rect x="460" y="248" width="250" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1.5"/>
  </g>
  <text x="235" y="270" class="b">S=0</text>
  <text x="370" y="270" class="b">E=1000 0010</text>
  <text x="585" y="270" class="b">M=100 0001 1001 1001 1001 1010</text>
  <text x="470" y="290" class="b">机器数 = 0 10000010 10000011001100110011010 = 4141 999AH</text>
</svg>`,
        },
        {
          id: 'kb-co-float-5-8',
          type: 'paragraph',
          text: '被舍部分恰好等于中间值 0.5 时，**舍入到偶数**（保留位末位为 0）。\n\n例：10.111 保留 2 位小数。第 3 位小数是 1，被舍部分 0.001 恰好等于最低保留位 0.01 的一半（中间值 0.5）。\n\n不进位得 10.11（末位 1，奇数），进位得 11.00（末位 0，偶数）。两种结果与精确值的距离相同，IEEE 就近舍入规定取偶数，所以取 11.00。',
        },
      ],
    },
  ],
}
