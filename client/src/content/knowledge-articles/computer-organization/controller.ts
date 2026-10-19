import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const controllerArticle: KnowledgeArticleData = {
  pointId: 'co-controller',
  subpoints: [
    {
      id: 'co-controller-func',
      title: '控制器的功能与组成',
      blocks: [
        {
          id: 'kb-co-controller-1-1',
          type: 'paragraph',
          text: '**控制器**是计算机的指挥中心，主要功能有：\n\n- **指令解码**：确定要执行的操作和操作数。\n- **生成控制信号**：驱动 ALU、寄存器、存储器按预期执行。\n- **时序控制**：按先后顺序发出信号，确保指令逻辑正确。',
        },
        {
          id: 'kb-co-controller-1-2',
          type: 'paragraph',
          text: '控制器由三个组件构成：\n\n- **指令控制器**：取指、译码、形成下一条指令地址。\n- **时序控制器**：产生时序信号，控制执行节奏。\n- **控制信号发生器**：根据译码结果产生具体控制信号。',
        },
        {
          id: 'kb-co-controller-1-3',
          type: 'callout',
          title: '控制器的工作循环',
          text: '取指令（PC 送地址、指令入 IR）→ 分析指令（译码识别操作类型、寻址方式）→ 执行指令（按正确时序发控制信号）→ 转向下一条指令（更新 PC）。',
          tone: 'blue',
        },
        {
          id: 'kb-co-controller-1-4',
          type: 'html',
          html: `<svg viewBox="0 0 920 540" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { font-family: system-ui, sans-serif; }
    .bt { font-size: 14px; font-weight: 700; text-anchor: middle; }
    .bs { font-size: 11px; text-anchor: middle; }
    .lbl { font-size: 12px; font-weight: 700; text-anchor: middle; }
    .in-lbl { font-size: 11px; font-weight: 600; }
    .note { font-size: 12px; fill: #475569; text-anchor: middle; }
  </style>
  <defs>
    <marker id="ctrlIn" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#334155"/></marker>
    <marker id="ctrlOut" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#d97706"/></marker>
  </defs>

  <text x="460" y="24" class="lbl" fill="#0f172a">控制器内部结构：取指、译码、时序、生成控制信号</text>

  <!-- 控制器外框 -->
  <rect x="40" y="44" width="840" height="340" rx="10" fill="#f8fafc" stroke="#334155" stroke-width="2"/>
  <text x="58" y="68" font-size="15" font-weight="700" fill="#0f172a">控制器 CU</text>

  <!-- 输入：指令（来自 MDR）进入 IR -->
  <line x1="340" y1="44" x2="340" y2="90" stroke="#334155" stroke-width="1.8" marker-end="url(#ctrlIn)"/>
  <text x="352" y="72" class="in-lbl" fill="#1d4ed8">指令（来自 MDR）</text>

  <!-- 输入：时钟 CLK -->
  <line x1="740" y1="44" x2="740" y2="90" stroke="#334155" stroke-width="1.8" marker-end="url(#ctrlIn)"/>
  <text x="752" y="72" class="in-lbl" fill="#7c3aed">时钟 CLK</text>

  <!-- PC 程序计数器（左上） -->
  <rect x="60" y="90" width="140" height="64" rx="6" fill="#eff6ff" stroke="#2563eb" stroke-width="1.6"/>
  <text x="130" y="112" class="bt" fill="#1d4ed8">PC</text>
  <text x="130" y="134" class="bs" fill="#334155">程序计数器</text>
  <text x="130" y="148" class="bs" fill="#334155">存下一条指令地址</text>

  <!-- PC → 主存：取指地址 -->
  <line x1="130" y1="90" x2="130" y2="62" stroke="#2563eb" stroke-width="2" marker-end="url(#ctrlIn)"/>
  <text x="142" y="78" class="in-lbl" fill="#1d4ed8" text-anchor="start">取指地址</text>

  <!-- IR 指令寄存器（PC 右侧） -->
  <rect x="230" y="90" width="220" height="64" rx="6" fill="#eff6ff" stroke="#2563eb" stroke-width="1.6"/>
  <text x="340" y="112" class="bt" fill="#1d4ed8">IR 指令寄存器</text>
  <text x="340" y="140" class="bs" fill="#334155">暂存当前指令，供译码</text>

  <!-- 指令译码器 -->
  <rect x="230" y="210" width="220" height="64" rx="6" fill="#dcfce7" stroke="#16a34a" stroke-width="1.6"/>
  <text x="340" y="232" class="bt" fill="#15803d">指令译码器 ID</text>
  <text x="340" y="258" class="bs" fill="#334155">解析操作码 / 寻址方式</text>

  <!-- 节拍发生器 -->
  <rect x="640" y="90" width="200" height="64" rx="6" fill="#f5f3ff" stroke="#7c3aed" stroke-width="1.6"/>
  <text x="740" y="112" class="bt" fill="#6d28d9">时序系统（节拍发生器）</text>
  <text x="740" y="140" class="bs" fill="#334155">CLK → T0 / T1 / T2…</text>

  <!-- 控制信号发生器 -->
  <rect x="470" y="200" width="300" height="110" rx="6" fill="#fef3c7" stroke="#d97706" stroke-width="1.6"/>
  <text x="620" y="224" class="bt" fill="#b45309">控制信号发生器</text>
  <text x="620" y="252" class="bs" fill="#334155">硬布线：组合逻辑电路</text>
  <text x="620" y="272" class="bs" fill="#334155">微程序：控制存储器 CM（μPC / μIR）</text>
  <text x="620" y="294" class="bs" fill="#334155">按指令 + 节拍产生微命令</text>

  <!-- 连线：IR → 指令译码器 -->
  <line x1="340" y1="154" x2="340" y2="210" stroke="#334155" stroke-width="2.2"/>
  <!-- 连线：指令译码器 → 控制信号发生器 -->
  <line x1="450" y1="242" x2="470" y2="242" stroke="#334155" stroke-width="2.2" marker-end="url(#ctrlIn)"/>
  <text x="460" y="232" class="in-lbl" fill="#15803d" text-anchor="middle">译码结果</text>
  <!-- 连线：节拍发生器 → 控制信号发生器 -->
  <line x1="740" y1="154" x2="740" y2="180" stroke="#7c3aed" stroke-width="1.8"/>
  <line x1="740" y1="180" x2="620" y2="180" stroke="#7c3aed" stroke-width="1.8"/>
  <line x1="620" y1="180" x2="620" y2="200" stroke="#7c3aed" stroke-width="1.8" marker-end="url(#ctrlIn)"/>
  <text x="680" y="172" class="in-lbl" fill="#6d28d9" text-anchor="middle">节拍</text>

  <!-- PC 更新：控制信号发生器 → PC（自增 / 转移） -->
  <line x1="470" y1="200" x2="470" y2="180" stroke="#d97706" stroke-width="1.6" stroke-dasharray="5,3"/>
  <line x1="470" y1="180" x2="130" y2="180" stroke="#d97706" stroke-width="1.6" stroke-dasharray="5,3"/>
  <line x1="130" y1="180" x2="130" y2="154" stroke="#d97706" stroke-width="1.6" stroke-dasharray="5,3" marker-end="url(#ctrlIn)"/>
  <text x="300" y="172" class="in-lbl" fill="#b45309" text-anchor="middle">PC 更新（自增 / 转移）</text>

  <!-- 输出：控制信号 → 数据通路 -->
  <line x1="620" y1="310" x2="620" y2="384" stroke="#d97706" stroke-width="2" stroke-dasharray="5,3"/>
  <line x1="620" y1="384" x2="620" y2="440" stroke="#d97706" stroke-width="2" stroke-dasharray="5,3" marker-end="url(#ctrlOut)"/>
  <text x="632" y="412" class="in-lbl" fill="#b45309">控制信号（微命令）</text>

</svg>`,
        },
      ],
    },
    {
      id: 'co-controller-pcir',
      title: 'PC 与 IR',
      blocks: [
        {
          id: 'kb-co-controller-2-1',
          type: 'paragraph',
          text: '**PC**（程序计数器）：存下一条待执行指令的地址，取指后自动加上指令长度。PC 的位数取决于主存地址空间大小。\n\n**IR**（指令寄存器）：暂存取出的指令，位数取决于指令字长。',
        },
        {
          id: 'kb-co-controller-2-2',
          type: 'paragraph',
          text: '**汇编程序员可见**的寄存器：通用寄存器组、程序计数器 PC、状态（标志）寄存器。\n\n**程序员不可见**的寄存器由硬件自动使用：MAR、MDR、IR（指令寄存器）、微指令寄存器等。',
        },
        {
          id: 'kb-co-controller-2-3',
          type: 'callout',
          title: 'PC 与 IR 的位数',
          text: 'PC 位数要能表示全部主存地址。定长指令字时取指后 PC 加指令字长；指令字长固定时，可把主存看作只放指令的数组，PC 就是这个数组的下标。IR 位数等于指令字长。例如主存 4GB 按字节编址、32 位定长指令字：PC = 32 位，IR = 32 位。',
          tone: 'blue',
        },
      ],
    },
    {
      id: 'co-controller-compare',
      title: '硬布线控制器与微程序控制器',
      blocks: [
        {
          id: 'kb-co-controller-compare-1',
          type: 'paragraph',
          text: '控制器按控制信号生成方式分为**硬布线控制器**和**微程序控制器**两类，一个用电路、一个用存储来实现控制逻辑。',
        },
        {
          id: 'kb-co-controller-compare-2',
          type: 'paragraph',
          text: '| 比较维度 | 硬布线控制器 | 微程序控制器 |\n|---|---|---|\n| 控制逻辑实现 | 组合逻辑电路（门电路、触发器、译码器）直接生成控制信号 | 控制信号以微指令形式存放在**控制存储器**（CM）中，取出后译码得到微命令 |\n| 本质 | 有限状态机，控制逻辑由布线固定 | 程序控制程序，每条机器指令对应一个微程序 |\n| 速度 | 快（组合逻辑直接输出） | 慢（需访问控制存储器） |\n| 灵活性 / 可修改性 | 差（改功能需改电路） | 好（改控制存储器内容即可） |\n| 设计复杂度 | 复杂指令下设计复杂、难验证 | 规整、易于设计和扩展 |\n| 典型应用 | RISC（指令精简） | CISC（指令复杂，如 x86） |\n| 关键硬件 | 逻辑门阵列、时序电路 | 控制存储器 CM、微指令寄存器 µIR、微地址寄存器 µPC |',
        },
      ],
    },
  ],
}
