import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'
import { aluFlagsCircuitAnimation } from '@/animations/computer-organization/arithmetic/alu-flags-circuit'

export const aluArticle: KnowledgeArticleData = {
  pointId: 'co-alu',
  subpoints: [
    {
      id: 'co-bitwise-ops',
      title: '位运算符号',
      blocks: [
        {
          id: 'kb-co-alu-1-5',
          type: 'paragraph',
          text: '**ALU**（算术逻辑单元）的逻辑运算按位进行，常用符号：&（与）、|（或）、~（非/取反）、^（异或）、<<（左移）、>>（右移）。运算对象是 $n$ 位二进制数，结果每一位只取决于两个操作数的对应位。',
        },
        {
          id: 'kb-co-alu-1-6',
          type: 'paragraph',
          text: '**与 &**：同 1 才 1（1&1=1，其余为 0）。\n\n**或 |**：有 1 就 1（0|0=0，其余为 1）。\n\n**异或 ^**：不同才 1（1^0=1、0^1=1，相同为 0）。\n\n**非 ~**：逐位取反（0 变 1，1 变 0）。\n\n真值表：\n\n| A | B | 与 | 或 | 异或 |\n|---|---|---|---|---|\n| 0 | 0 | 0 | 0 | 0 |\n| 0 | 1 | 0 | 1 | 1 |\n| 1 | 0 | 0 | 1 | 1 |\n| 1 | 1 | 1 | 1 | 0 |',
        },
      ],
    },
    {
      id: 'co-alu-def',
      title: '加法器电路',
      blocks: [
        {
          id: 'kb-co-alu-1-1',
          type: 'paragraph',
          text: '**ALU** 是运算器的核心，算术运算（加减乘除）和逻辑运算（与或非异或）都建立在**加法器**之上。加减乘除共用加法器电路，区别只在控制与数据如何流动。',
        },
        {
          id: 'kb-co-alu-1-2',
          type: 'paragraph',
          text: '**半加器**（Half Adder）：两个输入（加数 A、被加数 B），两个输出（和 S、进位 C）。和 S 用**异或**得到，进位 C 用**与**得到。半加器不处理来自低位的进位。',
        },
        {
          id: 'kb-co-alu-1-3',
          type: 'paragraph',
          text: String.raw`**全加器**（Full Adder）：在半加器基础上增加进位输入 $C_{in}$（来自低位的进位），由**两个半加器加一个或门**构成。三个输入 A、B、$C_{in}$，两个输出和 S、进位 $C_{out}$。

推导用到的符号：

- **⊕**：异或，不同为 1。
- **·**：与，同 1 才 1。
- **+**：或，有 1 就 1。

**逻辑推导**分三步：

1. 把 A、B 送进第一个半加器，得到中间和 $S_1 = A \oplus B$、中间进位 $C_1 = A \cdot B$。
2. 把 $S_1$ 与 $C_{in}$ 送进第二个半加器，得到和 $S = S_1 \oplus C_{in} = A \oplus B \oplus C_{in}$、进位 $C_2 = S_1 \cdot C_{in}$。
3. 用**或门**合并两个进位：$C_{out} = C_1 + C_2 = A \cdot B + (A \oplus B) \cdot C_{in}$。

进位用或门合并的原因：$C_1$ 和 $C_2$ 不可能同时为 1（A=B=1 时 $S_1=0$，所以 $C_2=0$；$C_1=1$ 时 $A \cdot B=1$），二者互斥，或门合并等价于相加。`,
        },
        {
          id: 'kb-co-alu-1-4',
          type: 'html',
          html: `<svg viewBox="0 0 840 500" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { font-family: system-ui, sans-serif; }
    .t { font-size: 14px; font-weight: 700; fill: #1e293b; text-anchor: middle; }
    .p { font-size: 12px; font-weight: 600; fill: #0f172a; text-anchor: middle; }
    .n { font-size: 11px; fill: #64748b; text-anchor: middle; }
    .g { fill: #ffffff; stroke: #2563eb; stroke-width: 1.8; }
    .fa { fill: #f8fafc; stroke: #334155; stroke-width: 1.8; }
    .cl { fill: #fff7ed; stroke: #ea580c; stroke-width: 1.8; }
  </style>

  <!-- ===== 左上：半加器 ===== -->
  <text x="205" y="22" class="t">半加器 HA</text>
  <text x="12" y="76" class="p">A</text>
  <text x="12" y="186" class="p">B</text>
  <line x1="20" y1="80" x2="190" y2="80" stroke="#334155" stroke-width="1.5"/>
  <line x1="20" y1="190" x2="190" y2="190" stroke="#334155" stroke-width="1.5"/>
  <line x1="95" y1="80" x2="95" y2="95" stroke="#334155" stroke-width="1.5"/>
  <line x1="95" y1="80" x2="95" y2="145" stroke="#334155" stroke-width="1.5"/>
  <line x1="95" y1="190" x2="95" y2="135" stroke="#334155" stroke-width="1.5"/>
  <line x1="95" y1="190" x2="95" y2="185" stroke="#334155" stroke-width="1.5"/>
  <rect x="110" y="95" width="60" height="40" rx="4" class="g"/>
  <text x="140" y="118" class="p" fill="#1d4ed8">XOR</text>
  <rect x="110" y="145" width="60" height="40" rx="4" class="g"/>
  <text x="140" y="168" class="p" fill="#1d4ed8">AND</text>
  <line x1="170" y1="115" x2="230" y2="115" stroke="#334155" stroke-width="1.5"/>
  <line x1="170" y1="165" x2="230" y2="165" stroke="#334155" stroke-width="1.5"/>
  <text x="238" y="111" class="p">S</text>
  <text x="238" y="161" class="p">C</text>
  <text x="205" y="222" class="n">和 S = A ⊕ B，进位 C = A · B</text>

  <!-- ===== 右上：全加器 ===== -->
  <text x="625" y="22" class="t">全加器 FA</text>
  <text x="528" y="101" class="p">A</text>
  <text x="528" y="136" class="p">B</text>
  <text x="522" y="171" class="p">Cin</text>
  <line x1="540" y1="105" x2="560" y2="105" stroke="#334155" stroke-width="1.5"/>
  <line x1="540" y1="140" x2="560" y2="140" stroke="#334155" stroke-width="1.5"/>
  <line x1="536" y1="175" x2="560" y2="175" stroke="#334155" stroke-width="1.5"/>
  <rect x="560" y="85" width="140" height="110" rx="6" class="fa"/>
  <text x="630" y="135" class="p">FA</text>
  <text x="630" y="160" class="n">两个半加器</text>
  <text x="630" y="176" class="n">加一个或门</text>
  <line x1="700" y1="115" x2="730" y2="115" stroke="#334155" stroke-width="1.5"/>
  <line x1="700" y1="165" x2="730" y2="165" stroke="#334155" stroke-width="1.5"/>
  <text x="738" y="111" class="p">S</text>
  <text x="742" y="161" class="p">Cout</text>
  <text x="625" y="222" class="n">和 S = A ⊕ B ⊕ Cin，进位 C = AB + Cin(A ⊕ B)</text>

  <!-- ===== 左下：串行加法器 ===== -->
  <text x="205" y="272" class="t">串行加法器：进位逐位传递</text>
  <line x1="15" y1="380" x2="35" y2="380" stroke="#334155" stroke-width="1.5"/>
  <text x="20" y="370" class="p">C₀</text>
  <g>
    <rect x="35" y="350" width="70" height="60" rx="4" class="fa"/>
    <rect x="140" y="350" width="70" height="60" rx="4" class="fa"/>
    <rect x="245" y="350" width="70" height="60" rx="4" class="fa"/>
    <rect x="350" y="350" width="70" height="60" rx="4" class="fa"/>
    <text x="70" y="386" class="p">FA0</text>
    <text x="175" y="386" class="p">FA1</text>
    <text x="280" y="386" class="p">FA2</text>
    <text x="385" y="386" class="p">FA3</text>
  </g>
  <line x1="105" y1="380" x2="140" y2="380" stroke="#334155" stroke-width="1.5"/>
  <line x1="210" y1="380" x2="245" y2="380" stroke="#334155" stroke-width="1.5"/>
  <line x1="315" y1="380" x2="350" y2="380" stroke="#334155" stroke-width="1.5"/>
  <line x1="420" y1="380" x2="445" y2="380" stroke="#334155" stroke-width="1.5"/>
  <text x="122" y="372" class="p">C₁</text>
  <text x="227" y="372" class="p">C₂</text>
  <text x="332" y="372" class="p">C₃</text>
  <text x="452" y="376" class="p">C₄</text>
  <g fill="#64748b" font-size="11" text-anchor="middle">
    <text x="70" y="344">A₀</text><text x="175" y="344">A₁</text><text x="280" y="344">A₂</text><text x="385" y="344">A₃</text>
    <text x="55" y="426">B₀</text><text x="160" y="426">B₁</text><text x="265" y="426">B₂</text><text x="370" y="426">B₃</text>
    <text x="95" y="426">S₀</text><text x="200" y="426">S₁</text><text x="305" y="426">S₂</text><text x="410" y="426">S₃</text>
  </g>
  <text x="205" y="462" class="n">低位 FA 的进位输出接到高位 FA 的进位输入，逐位传递</text>

</svg>`,
        },
      ],
    },
    {
      id: 'co-flags',
      title: '标志位',
      blocks: [
        {
          id: 'kb-co-alu-2-1',
          type: 'paragraph',
          text: '处理有符号加法时，加法器输出**标志位**。各标志都可以由加法器电路中的位信息组合得到。',
        },
        {
          id: 'kb-co-alu-2-5',
          type: 'animation',
          animation: aluFlagsCircuitAnimation,
          sourceImport: {
            path: '@/animations/computer-organization/arithmetic/alu-flags-circuit',
            localName: 'aluFlagsCircuitAnimation',
            kind: 'named',
          },
        },
        {
          id: 'kb-co-alu-2-2',
          type: 'paragraph',
          text: String.raw`
| 标志 | 名称 | 何时置 1 |
|---|---|---|
| ZF | 零标志 | 结果每一位都为 0 |
| SF | 符号标志 | 结果最高位（符号位）为 1|
| CF | 进位/借位标志 | 无符号相加超过最大值或者相减为负 |
| OF | 溢出标志 | 有符号数两个数运算后超过范围 |`,
        },
        {
          id: 'kb-co-alu-2-4',
          type: 'paragraph',
          text: String.raw`减法 $A - B$ 在硬件里变成 $A + \bar{B} + 1$（B 按位取反，最低位进位 1）。加法器最高位的进位输出 $C_{out}$ 是看符号位是否有进位。`,
        },
        {
          id: 'kb-co-alu-2-3',
          type: 'paragraph', 
          text: String.raw`计算机不做"有没有溢出"的语义判断，只看三个信号：最高位进位输出 $C_{out}$、次高位向符号位的进位 $C_{n-1}$、以及减法信号 $C_{in}$（SUB）。
          **CF（无符号溢出/借位）** 是减法信号 $C_{in}$ 与 $C_{out}$ 的异或：加法时 $C_{in}=0$，CF=$C_{out}$（有进位）；减法时 $C_{in}=1$，CF=$\overline{C_{out}}$（有借位）。
          **OF（有符号溢出）** 是 $C_{out}$ 与次高位进位 $C_{n-1}$ 的异或，$C_{out} \oplus C_{n-1} = 1$ 表示符号位被破坏，即溢出。`,
        },
      ],
    },
  ],
}
