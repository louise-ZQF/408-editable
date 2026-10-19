import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const codeArticle: KnowledgeArticleData = {
  pointId: 'co-code',
  subpoints: [
    {
      id: 'co-code-relations',
      title: '原码、反码、补码、移码的表示',
      blocks: [
        {
          id: 'kb-co-code-3-1',
          type: 'paragraph',
          text: String.raw`带符号数在机器中有**原码、反码、补码、移码**四种表示，它们对正数的编码相同，区别只在负数。

**原码**（Sign-Magnitude）：最高位表示符号（0 正 1 负），其余位表示绝对值。原码直观，但存在 **+0 和 -0** 两种冗余表示，且加减法电路复杂。`,
        },
        {
          id: 'kb-co-code-3-2',
          type: 'paragraph',
          text: '**反码**：正数同原码；负数符号位不变、其余位取反。它仍存在 +0 和 -0 两种冗余表示，是从原码过渡到补码的中间形式，计算机中不直接用它存储。',
        },
        {
          id: 'kb-co-code-3-4',
          type: 'paragraph',
          text: '**补码**：正数同原码；负数是其原码**按位取反再加 1**，也可以理解为反码加 1。补码消灭了 +0 和 -0 两种冗余表示，$n$ 位补码的范围是 $-2^{n-1}$ 到 $2^{n-1}-1$（最小值 1000...0，最大值 0111...1）。**补码使加减法统一**：加法直接由硬件加法器完成，负数无需特殊处理，简化了硬件设计。',
        },
        {
          id: 'kb-co-code-3-6',
          type: 'paragraph',
          text: '**移码**：把补码的**符号位取反**即得移码，常用于浮点数的阶码。移码的编码随真值增大而单调增大，可直接按无符号数比较阶码大小。',
        },
      ],
    },
    {
      id: 'co-code-example',
      title: '真值和机器数',
      blocks: [
        {
          id: 'kb-co-code-3-3',
          type: 'paragraph',
          text: '**真值转机器数**：正数的原码、反码、补码都等于其二进制本身，移码为补码符号位取反；负数先写出原码，反码 = 原码数值位取反（符号位不变），补码 = 反码加 1，移码 = 补码符号位取反。\n\n**机器数转真值**：补码符号位为 0 时直接按位权相加；为 1 时先取反加 1 得绝对值，再加负号。',
        },
        {
          id: 'kb-co-code-3-7',
          type: 'html',
          html: `<svg viewBox="0 0 760 300" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { font-family: system-ui, sans-serif; }
    .hdr { font-size: 15px; font-weight: 700; fill: #1e293b; text-anchor: middle; }
    .code { font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: 700; text-anchor: middle; }
    .lab  { font-size: 13px; font-weight: 600; text-anchor: middle; }
    .dim  { font-size: 11px; fill: #64748b; text-anchor: middle; }
  </style>
  <text x="380" y="26" class="hdr">以 -6 为例（8 位）四种机器数</text>

  <rect x="60"  y="50" width="150" height="190" rx="6" fill="#f1f5f9"/>
  <rect x="230" y="50" width="150" height="190" rx="6" fill="#f1f5f9"/>
  <rect x="400" y="50" width="150" height="190" rx="6" fill="#f1f5f9"/>
  <rect x="570" y="50" width="150" height="190" rx="6" fill="#f1f5f9"/>

  <text x="135" y="78" class="lab" fill="#475569">原码</text>
  <text x="305" y="78" class="lab" fill="#475569">反码</text>
  <text x="475" y="78" class="lab" fill="#475569">补码</text>
  <text x="645" y="78" class="lab" fill="#475569">移码</text>

  <text x="135" y="122" class="code">1000 0110</text>
  <text x="305" y="122" class="code">1111 1001</text>
  <text x="475" y="122" class="code">1111 1010</text>
  <text x="645" y="122" class="code">0111 1010</text>

  <text x="135" y="160" class="dim">符号位 1 + 绝对值 6</text>
  <text x="305" y="160" class="dim">符号位不变，其余取反</text>
  <text x="475" y="160" class="dim">反码再加 1</text>
  <text x="645" y="160" class="dim">补码符号位取反</text>

  <text x="135" y="196" class="dim">-6 → 1000 0110</text>
  <text x="305" y="196" class="dim">1111 1001</text>
  <text x="475" y="196" class="dim">1111 1010</text>
  <text x="645" y="196" class="dim">0111 1010</text>
</svg>`,
        },
        {
          id: 'kb-co-code-3-8',
          type: 'paragraph',
          text: '步骤：\n\n1. 真值 -6 的原码是 1000 0110（符号位 1，绝对值 000 0110）。\n2. 反码符号位不变、数值位取反，得 1111 1001。\n3. 补码在反码基础上加 1，得 1111 1010。\n4. 移码把补码符号位取反，得 0111 1010。\n\n正数 +6 的原码、反码、补码都是 0000 0110，移码为 1000 0110。',
        },
      ],
    },
  ],
}
