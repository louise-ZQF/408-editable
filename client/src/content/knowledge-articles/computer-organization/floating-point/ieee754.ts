import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const ieee754Article: KnowledgeArticleData = {
  pointId: 'co-ieee754',
  subpoints: [
    {
      id: 'co-float-ieee',
      title: 'IEEE 754 浮点数表示',
      blocks: [
        {
          id: 'kb-co-float-2-1',
          type: 'paragraph',
          text: '**IEEE 754 标准**定义浮点数表示和算术，最常见的是**单精度**和**双精度**。\n\n浮点数按符号位、阶码（指数）、尾数（有效数字）三部分存储。正常值的阶码不能全 0 或全 1。',
        },
        {
          id: 'kb-co-float-2-2',
          type: 'paragraph',
          text: '**符号位**（最高位）标志正负。\n\n**指数部分**（单精度 8 位、双精度 11 位）用**移码/偏置**表示：单精度偏置 127，双精度偏置 1023。\n\n**尾数部分**（单精度 23 位、双精度 52 位）规格化后隐含"1."，即 $1.f$。',
        },
        {
          id: 'kb-co-float-2-5',
          type: 'html',
          html: `<svg viewBox="0 0 820 210" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { font-family: system-ui, sans-serif; }
    .t { font-size: 15px; font-weight: 700; fill: #1e293b; text-anchor: middle; }
    .b { font-size: 12px; fill: #475569; text-anchor: middle; }
    .dim { font-size: 11px; fill: #64748b; text-anchor: middle; }
  </style>
  <text x="410" y="26" class="t">IEEE 754 单精度（32 位）布局</text>

  <g>
    <rect x="74" y="55" width="20" height="34" fill="#fee2e2" stroke="#dc2626" stroke-width="1"/>
    <text x="84" y="76" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">31</text>
    <rect x="95" y="55" width="20" height="34" fill="#dbeafe" stroke="#2563eb" stroke-width="1"/>
    <text x="105" y="76" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">30</text>
    <rect x="116" y="55" width="20" height="34" fill="#dbeafe" stroke="#2563eb" stroke-width="1"/>
    <text x="126" y="76" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">29</text>
    <rect x="137" y="55" width="20" height="34" fill="#dbeafe" stroke="#2563eb" stroke-width="1"/>
    <text x="147" y="76" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">28</text>
    <rect x="158" y="55" width="20" height="34" fill="#dbeafe" stroke="#2563eb" stroke-width="1"/>
    <text x="168" y="76" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">27</text>
    <rect x="179" y="55" width="20" height="34" fill="#dbeafe" stroke="#2563eb" stroke-width="1"/>
    <text x="189" y="76" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">26</text>
    <rect x="200" y="55" width="20" height="34" fill="#dbeafe" stroke="#2563eb" stroke-width="1"/>
    <text x="210" y="76" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">25</text>
    <rect x="221" y="55" width="20" height="34" fill="#dbeafe" stroke="#2563eb" stroke-width="1"/>
    <text x="231" y="76" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">24</text>
    <rect x="242" y="55" width="20" height="34" fill="#dbeafe" stroke="#2563eb" stroke-width="1"/>
    <text x="252" y="76" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">23</text>
    <rect x="263" y="55" width="20" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="273" y="76" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">22</text>
    <rect x="284" y="55" width="20" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="294" y="76" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">21</text>
    <rect x="305" y="55" width="20" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="315" y="76" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">20</text>
    <rect x="326" y="55" width="20" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="336" y="76" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">19</text>
    <rect x="347" y="55" width="20" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="357" y="76" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">18</text>
    <rect x="368" y="55" width="20" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="378" y="76" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">17</text>
    <rect x="389" y="55" width="20" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="399" y="76" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">16</text>
    <rect x="410" y="55" width="20" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="420" y="76" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">15</text>
    <rect x="431" y="55" width="20" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="441" y="76" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">14</text>
    <rect x="452" y="55" width="20" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="462" y="76" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">13</text>
    <rect x="473" y="55" width="20" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="483" y="76" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">12</text>
    <rect x="494" y="55" width="20" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="504" y="76" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">11</text>
    <rect x="515" y="55" width="20" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="525" y="76" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">10</text>
    <rect x="536" y="55" width="20" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="546" y="76" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">9</text>
    <rect x="557" y="55" width="20" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="567" y="76" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">8</text>
    <rect x="578" y="55" width="20" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="588" y="76" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">7</text>
    <rect x="599" y="55" width="20" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="609" y="76" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">6</text>
    <rect x="620" y="55" width="20" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="630" y="76" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">5</text>
    <rect x="641" y="55" width="20" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="651" y="76" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">4</text>
    <rect x="662" y="55" width="20" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="672" y="76" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">3</text>
    <rect x="683" y="55" width="20" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="693" y="76" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">2</text>
    <rect x="704" y="55" width="20" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="714" y="76" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">1</text>
    <rect x="725" y="55" width="20" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="735" y="76" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">0</text>
  </g>

  <!-- 说明 -->
  <text x="410" y="126" class="b">红色格 = 符号位 S（1 位）　蓝色格 = 阶码 E（8 位）　绿色格 = 尾数 M（23 位）</text>
  <text x="410" y="150" class="dim">位号 31 是符号位，位号 30～23 是阶码（移码，偏置 127），位号 22～0 是尾数（规格化隐含 1.）</text>
  <text x="410" y="172" class="dim">正常值公式：(-1)^S × 1.M × 2^(E-127)</text>
</svg>`,
        },
        {
          id: 'kb-co-float-2-3',
          type: 'paragraph',
          text: String.raw`单精度：1 符号位 + 8 阶码 + 23 尾数；双精度：1 符号位 + 11 阶码 + 52 尾数。正常值计算公式：$(-1)^s \times 1.f \times 2^{E - bias}$。`,
        },
        {
          id: 'kb-co-float-2-7',
          type: 'paragraph',
          text: String.raw`| 项目 | 单精度 | 双精度 |
|---|---|---|
| 总位数 | 32 | 64 |
| 符号位 | 1 | 1 |
| 阶码位数 | 8 | 11 |
| 尾数位数 | 23 | 52 |
| 偏置 bias | 127 | 1023 |
| 真指数范围 | -126 到 127 | -1022 到 1023 |
| 绝对值最小的正常值 | $2^{-126} \approx 1.18 \times 10^{-38}$ | $2^{-1022} \approx 2.2 \times 10^{-308}$ |
| 绝对值最大的正常值 | $(2-2^{-23}) \times 2^{127} \approx 3.4 \times 10^{38}$ | $(2-2^{-52}) \times 2^{1023} \approx 1.8 \times 10^{308}$ |
| 十进制精度 | 约 7 位 | 约 16 位 |`,
        },
        {
          id: 'kb-co-float-2-6',
          type: 'paragraph',
          text: String.raw`**真值转浮点**（13.25）：

① $13.25 = 1101.01_2$

② 规格化后为 $1.10101 \times 2^3$

③ 阶码 $E = 3 + 127 = 130 = 1000\,0010_2$

④ 尾数 $M = 1010\,1000\,0000\,0000\,0000\,000$（23 位）

机器数 \`0 10000010 10101000000000000000000\` = \`4154 0000H\`。

**浮点转真值**（\`3EC0 0000H\`）：机器数 \`0 01111101 10000000000000000000000\`，阶码 $E=125$，真阶 $=125-127=-2$，尾数 $1.1_2 = 1.5$，真值 $= 1.5 \times 2^{-2} = 0.375$。`,
        },
      ],
    },
    {
      id: 'co-float-special',
      title: '正常值、非正常值与特殊值',
      blocks: [
        {
          id: 'kb-co-float-3-1',
          type: 'paragraph',
          text: String.raw`IEEE 浮点数分为**正常值**、**非正常值**和**特殊值**三类。

**正常值**：阶码不能全 0 或全 1，值为 $(-1)^s \times 1.f \times 2^{E-bias}$。

阶码全 0 时为零或非正常值，阶码全 1 时为无穷大或 NaN。`,
        },
        {
          id: 'kb-co-float-3-4',
          type: 'paragraph',
          text: String.raw`| 阶码 | 尾数 | 类别 | 值 |
|---|---|---|---|
| 全 0 | 全 0 | 零 | $\pm 0$ |
| 全 0 | 非 0 | 非正常值 | $(-1)^s \times 0.f \times 2^{-126}$ |
| 全 1 | 全 0 | 无穷大 | $\pm \infty$ |
| 全 1 | 非 0 | NaN | 非数 |`,
        },
        {
          id: 'kb-co-float-3-2',
          type: 'paragraph',
          text: String.raw`**非正常值**（Denormalized）：阶码全为 0，表示接近 0 的极小值，值为 $(-1)^s \times 0.f \times 2^{-126}$。

它填充最小正常值到 0 之间的区间，使精度连续下降。`,
        },
        {
          id: 'kb-co-float-3-6',
          type: 'html',
          html: `<svg viewBox="0 0 820 360" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { font-family: system-ui, sans-serif; }
    .t { font-size: 15px; font-weight: 700; fill: #1e293b; text-anchor: middle; }
    .b { font-size: 12px; fill: #475569; text-anchor: middle; }
    .dim { font-size: 11px; fill: #64748b; text-anchor: middle; }
  </style>
  <text x="410" y="22" class="t">32 位单精度绝对值最大 / 最小的正常值</text>

  <text x="410" y="50" class="t" fill="#1d4ed8">绝对值最小的正常值 = 2⁻¹²⁶ ≈ 1.18×10⁻³⁸</text>
  <g>
    <rect x="74" y="62" width="20" height="34" fill="#fee2e2" stroke="#dc2626" stroke-width="1"/>
    <text x="84" y="85" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">0</text>
    <rect x="95" y="62" width="20" height="34" fill="#dbeafe" stroke="#2563eb" stroke-width="1"/>
    <text x="105" y="85" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">0</text>
    <rect x="116" y="62" width="20" height="34" fill="#dbeafe" stroke="#2563eb" stroke-width="1"/>
    <text x="126" y="85" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">0</text>
    <rect x="137" y="62" width="20" height="34" fill="#dbeafe" stroke="#2563eb" stroke-width="1"/>
    <text x="147" y="85" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">0</text>
    <rect x="158" y="62" width="20" height="34" fill="#dbeafe" stroke="#2563eb" stroke-width="1"/>
    <text x="168" y="85" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">0</text>
    <rect x="179" y="62" width="20" height="34" fill="#dbeafe" stroke="#2563eb" stroke-width="1"/>
    <text x="189" y="85" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">0</text>
    <rect x="200" y="62" width="20" height="34" fill="#dbeafe" stroke="#2563eb" stroke-width="1"/>
    <text x="210" y="85" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">0</text>
    <rect x="221" y="62" width="20" height="34" fill="#dbeafe" stroke="#2563eb" stroke-width="1"/>
    <text x="231" y="85" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">0</text>
    <rect x="242" y="62" width="20" height="34" fill="#dbeafe" stroke="#2563eb" stroke-width="1"/>
    <text x="252" y="85" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">1</text>
    <rect x="263" y="62" width="20" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="273" y="85" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">0</text>
    <rect x="284" y="62" width="20" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="294" y="85" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">0</text>
    <rect x="305" y="62" width="20" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="315" y="85" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">0</text>
    <rect x="326" y="62" width="20" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="336" y="85" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">0</text>
    <rect x="347" y="62" width="20" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="357" y="85" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">0</text>
    <rect x="368" y="62" width="20" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="378" y="85" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">0</text>
    <rect x="389" y="62" width="20" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="399" y="85" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">0</text>
    <rect x="410" y="62" width="20" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="420" y="85" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">0</text>
    <rect x="431" y="62" width="20" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="441" y="85" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">0</text>
    <rect x="452" y="62" width="20" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="462" y="85" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">0</text>
    <rect x="473" y="62" width="20" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="483" y="85" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">0</text>
    <rect x="494" y="62" width="20" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="504" y="85" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">0</text>
    <rect x="515" y="62" width="20" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="525" y="85" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">0</text>
    <rect x="536" y="62" width="20" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="546" y="85" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">0</text>
    <rect x="557" y="62" width="20" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="567" y="85" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">0</text>
    <rect x="578" y="62" width="20" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="588" y="85" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">0</text>
    <rect x="599" y="62" width="20" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="609" y="85" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">0</text>
    <rect x="620" y="62" width="20" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="630" y="85" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">0</text>
    <rect x="641" y="62" width="20" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="651" y="85" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">0</text>
    <rect x="662" y="62" width="20" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="672" y="85" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">0</text>
    <rect x="683" y="62" width="20" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="693" y="85" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">0</text>
    <rect x="704" y="62" width="20" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="714" y="85" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">0</text>
    <rect x="725" y="62" width="20" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="735" y="85" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">0</text>
  </g>
  <text x="410" y="122" class="b">S=0 正数；E=0000 0001=1（最小合法阶码，全 0 是非正常值）→ 真阶 1-127=-126</text>
  <text x="410" y="140" class="b">M 全 0 → 隐含 1.0 → 值 = 1.0 × 2⁻¹²⁶</text>

  <text x="410" y="178" class="t" fill="#15803d">绝对值最大的正常值 = (2-2⁻²³) × 2¹²⁷ ≈ 3.4×10³⁸</text>
  <g>
    <rect x="74" y="200" width="20" height="34" fill="#fee2e2" stroke="#dc2626" stroke-width="1"/>
    <text x="84" y="223" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">0</text>
    <rect x="95" y="200" width="20" height="34" fill="#dbeafe" stroke="#2563eb" stroke-width="1"/>
    <text x="105" y="223" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">1</text>
    <rect x="116" y="200" width="20" height="34" fill="#dbeafe" stroke="#2563eb" stroke-width="1"/>
    <text x="126" y="223" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">1</text>
    <rect x="137" y="200" width="20" height="34" fill="#dbeafe" stroke="#2563eb" stroke-width="1"/>
    <text x="147" y="223" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">1</text>
    <rect x="158" y="200" width="20" height="34" fill="#dbeafe" stroke="#2563eb" stroke-width="1"/>
    <text x="168" y="223" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">1</text>
    <rect x="179" y="200" width="20" height="34" fill="#dbeafe" stroke="#2563eb" stroke-width="1"/>
    <text x="189" y="223" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">1</text>
    <rect x="200" y="200" width="20" height="34" fill="#dbeafe" stroke="#2563eb" stroke-width="1"/>
    <text x="210" y="223" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">1</text>
    <rect x="221" y="200" width="20" height="34" fill="#dbeafe" stroke="#2563eb" stroke-width="1"/>
    <text x="231" y="223" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">1</text>
    <rect x="242" y="200" width="20" height="34" fill="#dbeafe" stroke="#2563eb" stroke-width="1"/>
    <text x="252" y="223" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">0</text>
    <rect x="263" y="200" width="20" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="273" y="223" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">1</text>
    <rect x="284" y="200" width="20" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="294" y="223" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">1</text>
    <rect x="305" y="200" width="20" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="315" y="223" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">1</text>
    <rect x="326" y="200" width="20" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="336" y="223" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">1</text>
    <rect x="347" y="200" width="20" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="357" y="223" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">1</text>
    <rect x="368" y="200" width="20" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="378" y="223" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">1</text>
    <rect x="389" y="200" width="20" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="399" y="223" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">1</text>
    <rect x="410" y="200" width="20" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="420" y="223" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">1</text>
    <rect x="431" y="200" width="20" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="441" y="223" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">1</text>
    <rect x="452" y="200" width="20" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="462" y="223" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">1</text>
    <rect x="473" y="200" width="20" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="483" y="223" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">1</text>
    <rect x="494" y="200" width="20" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="504" y="223" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">1</text>
    <rect x="515" y="200" width="20" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="525" y="223" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">1</text>
    <rect x="536" y="200" width="20" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="546" y="223" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">1</text>
    <rect x="557" y="200" width="20" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="567" y="223" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">1</text>
    <rect x="578" y="200" width="20" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="588" y="223" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">1</text>
    <rect x="599" y="200" width="20" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="609" y="223" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">1</text>
    <rect x="620" y="200" width="20" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="630" y="223" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">1</text>
    <rect x="641" y="200" width="20" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="651" y="223" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">1</text>
    <rect x="662" y="200" width="20" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="672" y="223" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">1</text>
    <rect x="683" y="200" width="20" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="693" y="223" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">1</text>
    <rect x="704" y="200" width="20" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="714" y="223" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">1</text>
    <rect x="725" y="200" width="20" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="735" y="223" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">1</text>
  </g>
  <text x="410" y="260" class="b">E=1111 1110=254（最大合法阶码，全 1 是无穷/NaN）→ 真阶 254-127=127</text>
  <text x="410" y="278" class="b">M 全 1 → 隐含 1.111…1 = 2-2⁻²³ → 值 = (2-2⁻²³) × 2¹²⁷</text>

  <text x="410" y="310" class="b">为什么这样最大/最小：阶码决定指数范围（越大值越大），尾数决定精度（越接近 1 值越大）</text>
  <text x="410" y="330" class="b">所以最小 = 阶码最小 + 尾数全 0；最大 = 阶码最大 + 尾数全 1；符号位只改变正负</text>
</svg>`,
        },
        {
          id: 'kb-co-float-3-5',
          type: 'paragraph',
          text: String.raw`**范围计算**（单精度）：

最小正常值 $= 1.0 \times 2^{-126} \approx 1.18 \times 10^{-38}$（阶码 1，尾数全 0）。

最大正常值 $= (2 - 2^{-23}) \times 2^{127} \approx 3.4 \times 10^{38}$（阶码 254，尾数全 1）。`,
        },
        {
          id: 'kb-co-float-3-7',
          type: 'html',
          html: `<svg viewBox="0 0 820 210" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { font-family: system-ui, sans-serif; }
    .t { font-size: 15px; font-weight: 700; fill: #1e293b; text-anchor: middle; }
    .b { font-size: 12px; fill: #475569; text-anchor: middle; }
    .dim { font-size: 11px; fill: #64748b; text-anchor: middle; }
  </style>
  <text x="410" y="22" class="t">绝对值最小的非正常值 = 2⁻¹⁴⁹ ≈ 1.4×10⁻⁴⁵</text>
  <g>
    <rect x="74" y="40" width="20" height="34" fill="#fee2e2" stroke="#dc2626" stroke-width="1"/>
    <text x="84" y="63" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">0</text>
    <rect x="95" y="40" width="20" height="34" fill="#dbeafe" stroke="#2563eb" stroke-width="1"/>
    <text x="105" y="63" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">0</text>
    <rect x="116" y="40" width="20" height="34" fill="#dbeafe" stroke="#2563eb" stroke-width="1"/>
    <text x="126" y="63" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">0</text>
    <rect x="137" y="40" width="20" height="34" fill="#dbeafe" stroke="#2563eb" stroke-width="1"/>
    <text x="147" y="63" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">0</text>
    <rect x="158" y="40" width="20" height="34" fill="#dbeafe" stroke="#2563eb" stroke-width="1"/>
    <text x="168" y="63" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">0</text>
    <rect x="179" y="40" width="20" height="34" fill="#dbeafe" stroke="#2563eb" stroke-width="1"/>
    <text x="189" y="63" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">0</text>
    <rect x="200" y="40" width="20" height="34" fill="#dbeafe" stroke="#2563eb" stroke-width="1"/>
    <text x="210" y="63" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">0</text>
    <rect x="221" y="40" width="20" height="34" fill="#dbeafe" stroke="#2563eb" stroke-width="1"/>
    <text x="231" y="63" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">0</text>
    <rect x="242" y="40" width="20" height="34" fill="#dbeafe" stroke="#2563eb" stroke-width="1"/>
    <text x="252" y="63" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">0</text>
    <rect x="263" y="40" width="20" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="273" y="63" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">0</text>
    <rect x="284" y="40" width="20" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="294" y="63" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">0</text>
    <rect x="305" y="40" width="20" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="315" y="63" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">0</text>
    <rect x="326" y="40" width="20" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="336" y="63" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">0</text>
    <rect x="347" y="40" width="20" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="357" y="63" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">0</text>
    <rect x="368" y="40" width="20" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="378" y="63" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">0</text>
    <rect x="389" y="40" width="20" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="399" y="63" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">0</text>
    <rect x="410" y="40" width="20" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="420" y="63" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">0</text>
    <rect x="431" y="40" width="20" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="441" y="63" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">0</text>
    <rect x="452" y="40" width="20" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="462" y="63" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">0</text>
    <rect x="473" y="40" width="20" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="483" y="63" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">0</text>
    <rect x="494" y="40" width="20" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="504" y="63" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">0</text>
    <rect x="515" y="40" width="20" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="525" y="63" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">0</text>
    <rect x="536" y="40" width="20" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="546" y="63" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">0</text>
    <rect x="557" y="40" width="20" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="567" y="63" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">0</text>
    <rect x="578" y="40" width="20" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="588" y="63" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">0</text>
    <rect x="599" y="40" width="20" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="609" y="63" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">0</text>
    <rect x="620" y="40" width="20" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="630" y="63" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">0</text>
    <rect x="641" y="40" width="20" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="651" y="63" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">0</text>
    <rect x="662" y="40" width="20" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="672" y="63" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">0</text>
    <rect x="683" y="40" width="20" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="693" y="63" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">0</text>
    <rect x="704" y="40" width="20" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="714" y="63" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">0</text>
    <rect x="725" y="40" width="20" height="34" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
    <text x="735" y="63" font-size="14" font-weight="700" text-anchor="middle" fill="#0f172a">1</text>
  </g>
  <text x="410" y="100" class="b">S=0；E 全 0 → 非正常值公式：(-1)⁰ × 0.M × 2⁻¹²⁶</text>
  <text x="410" y="118" class="b">M 只有最低位（位 0）是 1，其余全 0 → M = 2⁻²³</text>
  <text x="410" y="136" class="b">值 = 2⁻²³ × 2⁻¹²⁶ = 2⁻¹⁴⁹ ≈ 1.4×10⁻⁴⁵</text>
  <text x="410" y="158" class="b">为什么最小：尾数最低位为 1 已是最小非零尾数，阶码固定 -126，再小就下溢为 0</text>
</svg>`,
        },
      ],
    },
  ],
}
