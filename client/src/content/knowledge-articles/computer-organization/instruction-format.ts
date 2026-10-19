import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const instruction_formatArticle: KnowledgeArticleData = {
  pointId: 'co-instruction-format',
  subpoints: [
    {
      id: 'co-instruction-format-basic',
      title: '指令的基本格式',
      blocks: [
        {
          id: 'kb-co-instruction-format-1-1',
          type: 'paragraph',
          text: '指令的功能是对某些数据进行某种操作，因此指令包含两部分：**操作码**（opcode）和**地址码**（address）。',
        },
        {
          id: 'kb-co-instruction-format-1-4',
          type: 'paragraph',
          text: '**操作码**决定指令的类型，即进行哪种操作。\n\n**地址码**指操作的对象，可以是内存地址、寄存器编号或立即数。',
        },
        {
          id: 'kb-co-instruction-format-1-3',
          type: 'paragraph',
          text: String.raw`按地址码个数，指令分为：

- **零地址**：操作数隐含在栈中。
- **一地址**：$op(A_1) \to A_1$。
- **二地址**：$(A_1) \ op \ (A_2) \to A_1$。
- **三地址**：$(A_1) \ op \ (A_2) \to A_3$。`,
        },
        {
          id: 'kb-co-instruction-format-1-2',
          type: 'html',
          html: `<svg viewBox="0 0 900 480" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { font-family: 'JetBrains Mono', monospace; }
    .t { font-size: 15px; font-weight: 700; fill: #1e293b; text-anchor: middle; }
    .b { font-size: 12px; fill: #475569; text-anchor: middle; }
    .f { font-size: 12px; font-weight: 700; text-anchor: middle; }
  </style>
  <text x="450" y="24" class="t">下图说明了考研常见考法：以二进制格式给出指令的含义，随后要求考生进行一系列计算</text>

  <!-- R 型 -->
  <text x="60" y="56" class="b" text-anchor="end">R 型</text>
  <rect x="80" y="40" width="120" height="44" fill="#fee2e2" stroke="#dc2626" stroke-width="2"/>
  <rect x="200" y="40" width="120" height="44" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/>
  <rect x="320" y="40" width="120" height="44" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/>
  <rect x="440" y="40" width="120" height="44" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/>
  <line x1="200" y1="40" x2="200" y2="84" stroke="#94a3b8" stroke-width="1.5"/>
  <line x1="320" y1="40" x2="320" y2="84" stroke="#94a3b8" stroke-width="1.5"/>
  <line x1="440" y1="40" x2="440" y2="84" stroke="#94a3b8" stroke-width="1.5"/>
  <text x="140" y="58" class="f" fill="#7f1d1d">0000</text>
  <text x="260" y="58" class="f" fill="#1d4ed8">rt</text>
  <text x="380" y="58" class="f" fill="#1d4ed8">rs/num</text>
  <text x="500" y="58" class="f" fill="#1d4ed8">op1</text>
  <text x="140" y="78" class="b">R型标志</text>
  <text x="260" y="78" class="b">目标寄存器</text>
  <text x="380" y="78" class="b">源寄存器/数</text>
  <text x="500" y="78" class="b">运算</text>
  <text x="450" y="104" class="b">R 型：从源寄存器 rs（或立即数 num）取操作数，经 op1 指定的运算后，结果存回目标寄存器 rt</text>

  <!-- I 型 -->
  <text x="60" y="140" class="b" text-anchor="end">I 型</text>
  <rect x="80" y="124" width="120" height="44" fill="#fee2e2" stroke="#dc2626" stroke-width="2"/>
  <rect x="200" y="124" width="120" height="44" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/>
  <rect x="320" y="124" width="240" height="44" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
  <line x1="200" y1="124" x2="200" y2="168" stroke="#94a3b8" stroke-width="1.5"/>
  <line x1="320" y1="124" x2="320" y2="168" stroke="#94a3b8" stroke-width="1.5"/>
  <text x="140" y="142" class="f" fill="#7f1d1d">op2</text>
  <text x="260" y="142" class="f" fill="#1d4ed8">rt</text>
  <text x="440" y="142" class="f" fill="#b45309">imm8</text>
  <text x="140" y="162" class="b">操作码</text>
  <text x="260" y="162" class="b">目标寄存器</text>
  <text x="440" y="162" class="b">立即数 8 位</text>

  <!-- M 型 -->
  <text x="60" y="224" class="b" text-anchor="end">M 型</text>
  <rect x="80" y="208" width="120" height="44" fill="#fee2e2" stroke="#dc2626" stroke-width="2"/>
  <rect x="200" y="208" width="360" height="44" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
  <line x1="200" y1="208" x2="200" y2="252" stroke="#94a3b8" stroke-width="1.5"/>
  <text x="140" y="226" class="f" fill="#7f1d1d">op3</text>
  <text x="380" y="226" class="f" fill="#b45309">offset</text>
  <text x="140" y="246" class="b">操作码</text>
  <text x="380" y="246" class="b">偏移 12 位</text>

  <!-- 二进制指令示例 -->
  <text x="450" y="300" class="t" fill="#1d4ed8">例：下面是一个具体的R型指令</text>
  <rect x="80" y="310" width="120" height="40" fill="#fee2e2" stroke="#dc2626" stroke-width="2"/>
  <rect x="200" y="310" width="120" height="40" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/>
  <rect x="320" y="310" width="120" height="40" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/>
  <rect x="440" y="310" width="120" height="40" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/>
  <line x1="200" y1="310" x2="200" y2="350" stroke="#94a3b8" stroke-width="1.5"/>
  <line x1="320" y1="310" x2="320" y2="350" stroke="#94a3b8" stroke-width="1.5"/>
  <line x1="440" y1="310" x2="440" y2="350" stroke="#94a3b8" stroke-width="1.5"/>
  <text x="140" y="335" class="f" fill="#7f1d1d">0000</text>
  <text x="260" y="335" class="f" fill="#1d4ed8">0010</text>
  <text x="380" y="335" class="f" fill="#1d4ed8">1001</text>
  <text x="500" y="335" class="f" fill="#1d4ed8">0001</text>
  <text x="450" y="372" class="b">R 型：R型标志 0000，rt=0010(R2)，rs=1001(R9)，op1=0001(加)</text>
  <text x="450" y="392" class="b">目的：从 R9 取出操作数，与 R2 做 op1 指定的运算，结果存回 R2</text>
  <text x="450" y="412" class="b">op1 二进制含义：0001=加、0010=左移；即 op1=0001 表示 R[rt] ← R[rt] + R[rs]</text>
  <text x="450" y="432" class="b">本例：R[2] ← R[2] + R[9] = ABCD + F001 = 1ABCEH，保留低 16 位 = ABCEH，存入 R2</text>
</svg>`,
        },
        {
          id: 'kb-co-instruction-format-1-5',
          type: 'paragraph',
          text: '按**指令长度**分类：\n\n- **定长指令集**：所有指令长度相同，解码简单高效，但地址字段个数不一需填充占位。典型是 RISC（如 ARM）。\n- **变长指令集**：长度随指令不同，编码紧凑、支持复杂操作，但解码需识别边界。典型是 CISC（如 x86）。',
        },
      ],
    },
    {
      id: 'co-opcode-extension',
      title: '操作码扩展编码',
      blocks: [
        {
          id: 'kb-co-opcode-extension-1',
          type: 'paragraph',
          text: '**操作码扩展编码**让操作码本身具有层次结构：CPU 解码时发现当前操作码属于扩展前缀，就继续读后续位，直到得到完整操作码。它采用**可变长度操作码 + 定长指令字**。',
        },
        {
          id: 'kb-co-opcode-extension-2',
          type: 'paragraph',
          text: '扩展操作码必须满足**前缀码**要求：任意短操作码不能是更长操作码的前缀，否则解码会歧义。',
        },
        {
          id: 'kb-co-opcode-extension-3',
          type: 'paragraph',
          text: '**例题**：假设指令字长 16 位，操作数地址码 6 位，指令有零地址、一地址、二地址三种格式。\n\n（1）设操作码定长，零地址指令 P 种、一地址指令 Q 种，问二地址指令多少种？\n\n（2）设采用扩展操作码技术，二地址指令 X 种、零地址指令 Y 种，问一地址指令最多能有多少种？',
        },
        {
          id: 'kb-co-opcode-extension-4',
          type: 'paragraph',
          text: String.raw`**解析**（1）：操作码定长时，三种指令操作码都占 $16 - 2 \times 6 = 4$ 位，共 $2^4 = 16$ 种编码。P 种零地址 + Q 种一地址 + 二地址 = 16，所以二地址指令 = $16 - P - Q$ 种。

**解析**（2）：二地址操作码占 4 位，X 种用掉 X 个编码，剩 $16 - X$ 个前缀用于扩展。每个前缀借一地址的 6 位地址码位扩展成 10 位操作码，可容纳 $2^6 = 64$ 条一地址指令，所以一地址上限是 $(16 - X) \times 64$。但还要为零地址留空间：零地址操作码占满 16 位，每个零地址指令占一个 10 位操作码前缀再扩展 6 位，Y 种零地址需要 $\lceil Y / 64 \rceil$ 个一地址前缀，每占一个前缀就少 64 条一地址指令。故一地址最多 = $(16 - X) \times 64 - \lceil Y / 64 \rceil \times 64$ 种。`,
        },
      ],
    },
    {
      id: 'co-cisc-risc',
      title: 'CISC 与 RISC',
      blocks: [
        {
          id: 'kb-co-cisc-risc-1',
          type: 'paragraph',
          text: '**CISC**（复杂指令集计算机）：指令集复杂、指令不定长、支持多种寻址模式、用微程序控制、硬件复杂。典型是 x86 系列。',
        },
        {
          id: 'kb-co-cisc-risc-2',
          type: 'paragraph',
          text: '**RISC**（精简指令集计算机）：指令集精简、指令定长、寻址模式少、用硬布线控制、硬件精简。典型是 ARM 系列。',
        },
        {
          id: 'kb-co-cisc-risc-3',
          type: 'paragraph',
          text: '| 比较维度 | CISC | RISC |\n|------|------|------|\n| 指令系统 | 复杂、庞大 | 简单、精简 |\n| 指令数目 | 多 | 少 |\n| 指令字长 | 变长 | 定长 |\n| 访存指令 | 没有相关限制 | 只有 load/store 指令访存 |\n| 指令执行时间 | 不等，相差大 | 大多一个时钟周期内完成 |\n| 指令使用频率 | 使用频率差异大 | 常用指令高频使用 |\n| 通用寄存器数量 | 少（如 x86 8 个） | 多（如 ARM 32 个） |\n| 目标代码效率 | 高（一条指令做复杂操作） | 低（复杂操作需多条指令） |\n| 控制方式 | 微程序控制 | 硬布线控制 |\n| 指令流水线 | 难以实现流水线 | 必须实现流水线，理想 CPI=1 |',
        },
        {
          id: 'kb-co-cisc-risc-4',
          type: 'paragraph',
          text: 'RISC 采用 load/store 架构，只有加载和存储指令访问内存，运算指令都在寄存器之间进行，因此通用寄存器多（如 32 个），可减少访存次数。\n\nCISC 单条指令可同时访存和运算，对寄存器依赖小，寄存器少（如 8 个）。',
        },
      ],
    },
  ],
}
