import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const hammingCodeArticle: KnowledgeArticleData = {
  pointId: 'kp-hamming-code',
  subpoints: [
    {
      id: 'hamming-basics',
      title: '海明码的结构',
      blocks: [
        {
          id: 'kb-hamming-basics-1',
          type: 'paragraph',
          text: '**海明码**在数据位中按规律插入校验位，能纠正单比特错误。',
        },
        {
          id: 'kb-hamming-basics-1b',
          type: 'paragraph',
          text: '校验位放在 2 的幂次位置（位号 1、2、4、8、…），数据位填入剩余位置。',
        },
        {
          id: 'kb-hamming-basics-7',
          type: 'paragraph',
          text: String.raw`**校验位数怎么定**：设数据位数为 $m$、校验位数为 $r$，码字总长 $n = m + r$。$r$ 个校验位能产生 $2^r$ 种指示状态，必须能区分"无错"和 $n$ 个"某一位出错"共 $m + r + 1$ 种情况，因此：

$$
2^r \geq m + r + 1
$$

满足该式的最小 $r$ 就是所需校验位数。

例如 $m = 4$ 时 $2^3 = 8 \geq 4 + 3 + 1 = 8$，取 $r = 3$。

$m = 8$ 时 $2^3 = 8 < 8 + 3 + 1$ 不够，需 $r = 4$（$2^4 = 16 \geq 13$）。`,
        },
        {
          id: 'kb-hamming-basics-8',
          type: 'paragraph',
          text: '除校验位占用的 2 的幂次位置外，其余位号全部是数据位，码字总长 = 数据位数 + 校验位数。例如 4 位数据配 3 位校验，得到 7 位码字。',
        },
        {
          id: 'kb-hamming-basics-9',
          type: 'callout',
          title: '标准海明码的校验能力',
          text: String.raw`标准海明码最小海明距离 $d_{\min} = 3$：可纠正 1 位错，也可检测 2 位错（但不能同时纠 1 检 2）。加一个总校验位后 $d_{\min} = 4$，才能同时纠 1 位错、检 2 位错。`,
          tone: 'orange',
        },
        {
          id: 'kb-hamming-basics-2',
          type: 'paragraph',
          text: '**7 位码字的位置分配**（4 数据位 + 3 校验位 = 7 位）：',
        },
        {
          id: 'kb-hamming-basics-3',
          type: 'paragraph',
          text: `| 位号 | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
|------|---|---|---|---|---|---|---|
| 符号 | $P_1$ | $P_2$ | $D_3$ | $P_3$ | $D_5$ | $D_6$ | $D_7$ |
| 类型 | **校验位** | **校验位** | 数据位 | **校验位** | 数据位 | 数据位 | 数据位 |`,
        },
        {
          id: 'kb-hamming-basics-4',
          type: 'paragraph',
          text: String.raw`记 $P_x$ 为位号 $x$ 的校验位，$D_x$ 为位号 $x$ 的数据位。每个校验位管辖哪些位，看位号的二进制：哪一位为 1，就受对应校验位管辖。`,
        },
        {
          id: 'kb-hamming-basics-5',
          type: 'html',
          html: `<svg viewBox="0 0 620 260" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { font-family: system-ui, -apple-system, sans-serif; }
    .lbl { font-size: 12px; fill: #64748b; font-weight: 600; }
    .num { font-size: 15px; fill: #1e293b; font-weight: 700; }
    .sym { font-size: 15px; fill: #1e293b; font-weight: 700; }
    .bin { font-family: "Courier New", monospace; font-size: 10px; fill: #64748b; }
    .tag { font-size: 13px; font-weight: 700; }
    .range { font-size: 12px; fill: #475569; font-weight: 600; }
    .desc { font-size: 11px; fill: #64748b; }
  </style>

  <text x="84" y="30" text-anchor="end" class="lbl">位号</text>
  <text x="84" y="50" text-anchor="end" class="lbl">二进制</text>
  <text x="84" y="72" text-anchor="end" class="lbl">符号</text>

  <rect x="92" y="10" width="52" height="68" rx="6" fill="#dbeafe" stroke="#93c5fd"/>
  <text x="118" y="30" text-anchor="middle" class="num">1</text>
  <text x="118" y="50" text-anchor="middle" class="bin">001</text>
  <text x="118" y="72" text-anchor="middle" class="sym">P₁</text>

  <rect x="150" y="10" width="52" height="68" rx="6" fill="#dbeafe" stroke="#93c5fd"/>
  <text x="176" y="30" text-anchor="middle" class="num">2</text>
  <text x="176" y="50" text-anchor="middle" class="bin">010</text>
  <text x="176" y="72" text-anchor="middle" class="sym">P₂</text>

  <rect x="208" y="10" width="52" height="68" rx="6" fill="#fef3c7" stroke="#fcd34d"/>
  <text x="234" y="30" text-anchor="middle" class="num">3</text>
  <text x="234" y="50" text-anchor="middle" class="bin">011</text>
  <text x="234" y="72" text-anchor="middle" class="sym">D₃</text>

  <rect x="266" y="10" width="52" height="68" rx="6" fill="#dbeafe" stroke="#93c5fd"/>
  <text x="292" y="30" text-anchor="middle" class="num">4</text>
  <text x="292" y="50" text-anchor="middle" class="bin">100</text>
  <text x="292" y="72" text-anchor="middle" class="sym">P₃</text>

  <rect x="324" y="10" width="52" height="68" rx="6" fill="#fef3c7" stroke="#fcd34d"/>
  <text x="350" y="30" text-anchor="middle" class="num">5</text>
  <text x="350" y="50" text-anchor="middle" class="bin">101</text>
  <text x="350" y="72" text-anchor="middle" class="sym">D₅</text>

  <rect x="382" y="10" width="52" height="68" rx="6" fill="#fef3c7" stroke="#fcd34d"/>
  <text x="408" y="30" text-anchor="middle" class="num">6</text>
  <text x="408" y="50" text-anchor="middle" class="bin">110</text>
  <text x="408" y="72" text-anchor="middle" class="sym">D₆</text>

  <rect x="440" y="10" width="52" height="68" rx="6" fill="#fef3c7" stroke="#fcd34d"/>
  <text x="466" y="30" text-anchor="middle" class="num">7</text>
  <text x="466" y="50" text-anchor="middle" class="bin">111</text>
  <text x="466" y="72" text-anchor="middle" class="sym">D₇</text>

  <text x="84" y="118" text-anchor="end" class="tag" fill="#2563eb">P₁ 管辖</text>
  <rect x="92" y="98" width="52" height="36" rx="4" fill="#2563eb"/>
  <rect x="150" y="98" width="52" height="36" rx="4" fill="#f1f5f9" stroke="#e2e8f0"/>
  <rect x="208" y="98" width="52" height="36" rx="4" fill="#2563eb"/>
  <rect x="266" y="98" width="52" height="36" rx="4" fill="#f1f5f9" stroke="#e2e8f0"/>
  <rect x="324" y="98" width="52" height="36" rx="4" fill="#2563eb"/>
  <rect x="382" y="98" width="52" height="36" rx="4" fill="#f1f5f9" stroke="#e2e8f0"/>
  <rect x="440" y="98" width="52" height="36" rx="4" fill="#2563eb"/>
  <text x="506" y="120" class="range">→ 位 1, 3, 5, 7</text>

  <text x="84" y="162" text-anchor="end" class="tag" fill="#059669">P₂ 管辖</text>
  <rect x="92" y="142" width="52" height="36" rx="4" fill="#f1f5f9" stroke="#e2e8f0"/>
  <rect x="150" y="142" width="52" height="36" rx="4" fill="#059669"/>
  <rect x="208" y="142" width="52" height="36" rx="4" fill="#059669"/>
  <rect x="266" y="142" width="52" height="36" rx="4" fill="#f1f5f9" stroke="#e2e8f0"/>
  <rect x="324" y="142" width="52" height="36" rx="4" fill="#f1f5f9" stroke="#e2e8f0"/>
  <rect x="382" y="142" width="52" height="36" rx="4" fill="#059669"/>
  <rect x="440" y="142" width="52" height="36" rx="4" fill="#059669"/>
  <text x="506" y="164" class="range">→ 位 2, 3, 6, 7</text>

  <text x="84" y="206" text-anchor="end" class="tag" fill="#d97706">P₃ 管辖</text>
  <rect x="92" y="186" width="52" height="36" rx="4" fill="#f1f5f9" stroke="#e2e8f0"/>
  <rect x="150" y="186" width="52" height="36" rx="4" fill="#f1f5f9" stroke="#e2e8f0"/>
  <rect x="208" y="186" width="52" height="36" rx="4" fill="#f1f5f9" stroke="#e2e8f0"/>
  <rect x="266" y="186" width="52" height="36" rx="4" fill="#d97706"/>
  <rect x="324" y="186" width="52" height="36" rx="4" fill="#d97706"/>
  <rect x="382" y="186" width="52" height="36" rx="4" fill="#d97706"/>
  <rect x="440" y="186" width="52" height="36" rx="4" fill="#d97706"/>
  <text x="506" y="208" class="range">→ 位 4, 5, 6, 7</text>

</svg>`,
        },
        {
          id: 'kb-hamming-basics-6',
          type: 'paragraph',
          text: String.raw`看位号的二进制。比如位号 6 的二进制是 110，从右到左依次是第一位、第二位、第三位：

1. 第一位是 0：不受 $P_1$ 管。
2. 第二位是 1：受 $P_2$ 管。
3. 第三位是 1：受 $P_3$ 管。`,
        },
      ],
    },
    {
      id: 'hamming-correction',
      title: '纠错——出错了怎么定位',
      blocks: [
        {
          id: 'kb-hamming-corr-1',
          type: 'paragraph',
          text: String.raw`接收方重新计算每个校验组的异或，得到**出错指示字** $S = S_3 S_2 S_1$。$S = 0$ 无错，$S \neq 0$ 时其值就是出错位的位号。`,
        },
        {
          id: 'kb-hamming-corr-2',
          type: 'html',
          html: `<svg viewBox="0 0 620 280" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { font-family: system-ui, -apple-system, sans-serif; }
    .lbl { font-size: 12px; fill: #64748b; font-weight: 600; }
    .num { font-size: 15px; fill: #1e293b; font-weight: 700; }
    .sym { font-size: 14px; fill: #1e293b; font-weight: 700; }
    .val { font-size: 18px; fill: #1e293b; font-weight: 700; }
    .err { font-size: 18px; fill: #dc2626; font-weight: 700; }
    .tag { font-size: 13px; font-weight: 700; }
    .res { font-size: 14px; font-weight: 700; }
    .desc { font-size: 12px; fill: #475569; font-weight: 600; }
    .title { font-size: 12px; fill: #64748b; font-weight: 600; }
  </style>

  <text x="300" y="22" text-anchor="middle" class="title">接收码字（位 6 发生翻转，正确值应为 0）</text>

  <text x="84" y="54" text-anchor="end" class="lbl">位号</text>
  <text x="84" y="76" text-anchor="end" class="lbl">符号</text>
  <text x="84" y="98" text-anchor="end" class="lbl">收到的</text>

  <rect x="92" y="38" width="52" height="68" rx="6" fill="#dbeafe" stroke="#93c5fd"/>
  <text x="118" y="58" text-anchor="middle" class="num">1</text>
  <text x="118" y="78" text-anchor="middle" class="sym">P₁</text>
  <text x="118" y="100" text-anchor="middle" class="val">0</text>

  <rect x="150" y="38" width="52" height="68" rx="6" fill="#dbeafe" stroke="#93c5fd"/>
  <text x="176" y="58" text-anchor="middle" class="num">2</text>
  <text x="176" y="78" text-anchor="middle" class="sym">P₂</text>
  <text x="176" y="100" text-anchor="middle" class="val">0</text>

  <rect x="208" y="38" width="52" height="68" rx="6" fill="#fef3c7" stroke="#fcd34d"/>
  <text x="234" y="58" text-anchor="middle" class="num">3</text>
  <text x="234" y="78" text-anchor="middle" class="sym">D₃</text>
  <text x="234" y="100" text-anchor="middle" class="val">1</text>

  <rect x="266" y="38" width="52" height="68" rx="6" fill="#dbeafe" stroke="#93c5fd"/>
  <text x="292" y="58" text-anchor="middle" class="num">4</text>
  <text x="292" y="78" text-anchor="middle" class="sym">P₃</text>
  <text x="292" y="100" text-anchor="middle" class="val">1</text>

  <rect x="324" y="38" width="52" height="68" rx="6" fill="#fef3c7" stroke="#fcd34d"/>
  <text x="350" y="58" text-anchor="middle" class="num">5</text>
  <text x="350" y="78" text-anchor="middle" class="sym">D₅</text>
  <text x="350" y="100" text-anchor="middle" class="val">0</text>

  <rect x="382" y="38" width="52" height="68" rx="6" fill="#fecaca" stroke="#dc2626" stroke-width="2"/>
  <text x="408" y="58" text-anchor="middle" class="num">6</text>
  <text x="408" y="78" text-anchor="middle" class="sym">D₆</text>
  <text x="408" y="100" text-anchor="middle" class="err">1</text>

  <rect x="440" y="38" width="52" height="68" rx="6" fill="#fef3c7" stroke="#fcd34d"/>
  <text x="466" y="58" text-anchor="middle" class="num">7</text>
  <text x="466" y="78" text-anchor="middle" class="sym">D₇</text>
  <text x="466" y="100" text-anchor="middle" class="val">1</text>

  <text x="84" y="142" text-anchor="end" class="tag" fill="#2563eb">S₁ 校验</text>
  <rect x="92" y="126" width="52" height="32" rx="4" fill="#2563eb"/>
  <rect x="150" y="126" width="52" height="32" rx="4" fill="#f1f5f9" stroke="#e2e8f0"/>
  <rect x="208" y="126" width="52" height="32" rx="4" fill="#2563eb"/>
  <rect x="266" y="126" width="52" height="32" rx="4" fill="#f1f5f9" stroke="#e2e8f0"/>
  <rect x="324" y="126" width="52" height="32" rx="4" fill="#2563eb"/>
  <rect x="382" y="126" width="52" height="32" rx="4" fill="#f1f5f9" stroke="#e2e8f0"/>
  <rect x="440" y="126" width="52" height="32" rx="4" fill="#2563eb"/>
  <text x="506" y="147" class="res" fill="#059669">= 0  正常</text>

  <text x="84" y="186" text-anchor="end" class="tag" fill="#059669">S₂ 校验</text>
  <rect x="92" y="170" width="52" height="32" rx="4" fill="#f1f5f9" stroke="#e2e8f0"/>
  <rect x="150" y="170" width="52" height="32" rx="4" fill="#059669"/>
  <rect x="208" y="170" width="52" height="32" rx="4" fill="#059669"/>
  <rect x="266" y="170" width="52" height="32" rx="4" fill="#f1f5f9" stroke="#e2e8f0"/>
  <rect x="324" y="170" width="52" height="32" rx="4" fill="#f1f5f9" stroke="#e2e8f0"/>
  <rect x="382" y="170" width="52" height="32" rx="4" fill="#059669"/>
  <rect x="440" y="170" width="52" height="32" rx="4" fill="#059669"/>
  <text x="506" y="191" class="res" fill="#dc2626">= 1  出错</text>

  <text x="84" y="230" text-anchor="end" class="tag" fill="#d97706">S₃ 校验</text>
  <rect x="92" y="214" width="52" height="32" rx="4" fill="#f1f5f9" stroke="#e2e8f0"/>
  <rect x="150" y="214" width="52" height="32" rx="4" fill="#f1f5f9" stroke="#e2e8f0"/>
  <rect x="208" y="214" width="52" height="32" rx="4" fill="#f1f5f9" stroke="#e2e8f0"/>
  <rect x="266" y="214" width="52" height="32" rx="4" fill="#d97706"/>
  <rect x="324" y="214" width="52" height="32" rx="4" fill="#d97706"/>
  <rect x="382" y="214" width="52" height="32" rx="4" fill="#d97706"/>
  <rect x="440" y="214" width="52" height="32" rx="4" fill="#d97706"/>
  <text x="506" y="235" class="res" fill="#dc2626">= 1  出错</text>

  <text x="300" y="270" text-anchor="middle" class="desc">S = S₃S₂S₁ = 110₂ = 6 → 位 6 出错 → 取反纠正</text>
</svg>`,
        },
        {
          id: 'kb-hamming-corr-3',
          type: 'callout',
          title: 'S 的值就是出错位号',
          text: String.raw`如果 $S = 001$（=1），说明 $P_1$ 出错，校验位自己错了，数据位没问题。如果 $S$ 指向的位号超出码字长度，说明发生了多位错误，海明码无法纠正。`,
          tone: 'orange',
        },
      ],
    },
    {
      id: 'hamming-distance',
      title: '海明距离与编码能力',
      blocks: [
        {
          id: 'kb-hamming-dist-1',
          type: 'paragraph',
          text: String.raw`**海明距离**是两个等长码字对应位不同的位数。一种编码的**最小海明距离** $d_{\min}$ 是所有码字两两之间海明距离的最小值。`,
        },
        {
          id: 'kb-hamming-dist-2',
          type: 'paragraph',
          text: String.raw`**例** 编码只有 4 个合法码字：000000、010101、101010、111111。两两比较：

000000 vs 010101 → 3 位不同（位 2、4、6）
000000 vs 101010 → 3 位不同（位 1、3、5）
000000 vs 111111 → 6 位不同
010101 vs 101010 → 6 位不同
010101 vs 111111 → 3 位不同
101010 vs 111111 → 3 位不同

最小海明距离 $d_{\min} = 3$。`,
        },
        {
          id: 'kb-hamming-dist-3',
          type: 'paragraph',
          text: String.raw`$d_{\min}$ 决定编码能力：

● 检 $c$ 位错需要 $d_{\min} \geq c + 1$

● 纠 $t$ 位错需要 $d_{\min} \geq 2t + 1$

● 同时检 $c$ 位错且纠 $t$ 位错（$c > t$）需要 $d_{\min} \geq c + t + 1$`,
        },
        {
          id: 'kb-hamming-dist-4',
          type: 'callout',
          title: '标准海明码的编码能力',
          text: String.raw`标准海明码 $d_{\min} = 3$：可纠 1 位错（$2 \times 1 + 1 = 3 \checkmark$）；可检 2 位错但不纠（$2 + 1 = 3 \checkmark$）。加一个总校验位后 $d_{\min} = 4$，可纠 1 位错同时检 2 位错。`,
          tone: 'orange',
        },
      ],
    },
  ],
}
