import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const pipelineArticle: KnowledgeArticleData = {
  pointId: 'co-pipeline',
  subpoints: [
    {
      id: 'co-pipeline-stage',
      title: '指令执行的五个阶段',
      blocks: [
        {
          id: 'kb-co-pipeline-1-1',
          type: 'paragraph',
          text: '**五阶段流水线**把指令执行分为：\n\n1. **取指 IF**：从指令存储器取指令并更新 PC。\n2. **译码 ID**：解析指令、读源寄存器、生成控制信号。\n3. **执行 EX**：ALU 计算或分支判断。\n4. **访存 MEM**：内存读写，非访存指令为空操作。\n5. **写回 WB**：结果写回寄存器。',
        },
        {
          id: 'kb-co-pipeline-1-2',
          type: 'paragraph',
          text: '每个流水段后面有一个**流水段寄存器**，锁存本段处理完的数据，供下一时钟周期给下一段使用。所有寄存器由统一时钟同步。',
        },
        {
          id: 'kb-co-pipeline-1-3',
          type: 'callout',
          title: 'MEM 和 WB 可能为空',
          text: 'IF、ID、EX 是每条指令都执行的实际操作；MEM 对非访存指令、WB 对不写回寄存器的指令（如跳转）是空操作，但阶段在结构上仍存在。',
          tone: 'blue',
        },
        {
          id: 'kb-co-pipeline-1-4',
          type: 'html',
          html: `<svg viewBox="0 0 820 300" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { font-family: system-ui, sans-serif; }
    .title { font-size: 18px; font-weight: 700; fill: #1e293b; text-anchor: middle; }
    .stage { font-size: 13px; font-weight: 700; fill: #ffffff; text-anchor: middle; }
    .stage2 { font-size: 13px; font-weight: 700; fill: #1e293b; text-anchor: middle; }
    .instr { font-size: 14px; font-weight: 700; fill: #0f172a; text-anchor: middle; }
    .clk { font-size: 12px; fill: #64748b; text-anchor: middle; }
  </style>
  <text x="410" y="26" class="title">五阶段指令流水线时空图</text>

  <text x="64" y="58" class="instr">I1</text>
  <text x="64" y="102" class="instr">I2</text>
  <text x="64" y="146" class="instr">I3</text>
  <text x="64" y="190" class="instr">I4</text>

  <rect x="110" y="40" width="110" height="34" rx="4" fill="#2563eb"/>
  <text x="165" y="62" class="stage">IF</text>
  <rect x="220" y="40" width="110" height="34" rx="4" fill="#059669"/>
  <text x="275" y="62" class="stage">ID</text>
  <rect x="330" y="40" width="110" height="34" rx="4" fill="#d97706"/>
  <text x="385" y="62" class="stage">EX</text>
  <rect x="440" y="40" width="110" height="34" rx="4" fill="#7c3aed"/>
  <text x="495" y="62" class="stage">MEM</text>
  <rect x="550" y="40" width="110" height="34" rx="4" fill="#0f766e"/>
  <text x="605" y="62" class="stage">WB</text>

  <rect x="220" y="84" width="110" height="34" rx="4" fill="#2563eb"/>
  <text x="275" y="106" class="stage">IF</text>
  <rect x="330" y="84" width="110" height="34" rx="4" fill="#059669"/>
  <text x="385" y="106" class="stage">ID</text>
  <rect x="440" y="84" width="110" height="34" rx="4" fill="#d97706"/>
  <text x="495" y="106" class="stage">EX</text>
  <rect x="550" y="84" width="110" height="34" rx="4" fill="#7c3aed"/>
  <text x="605" y="106" class="stage">MEM</text>
  <rect x="660" y="84" width="110" height="34" rx="4" fill="#0f766e"/>
  <text x="715" y="106" class="stage">WB</text>

  <rect x="330" y="128" width="110" height="34" rx="4" fill="#2563eb"/>
  <text x="385" y="150" class="stage">IF</text>
  <rect x="440" y="128" width="110" height="34" rx="4" fill="#059669"/>
  <text x="495" y="150" class="stage">ID</text>
  <rect x="550" y="128" width="110" height="34" rx="4" fill="#d97706"/>
  <text x="605" y="150" class="stage">EX</text>
  <rect x="660" y="128" width="110" height="34" rx="4" fill="#7c3aed"/>
  <text x="715" y="150" class="stage">MEM</text>
  <rect x="110" y="128" width="110" height="34" rx="4" fill="#e2e8f0"/>
  <text x="165" y="150" class="stage2">（空）</text>

  <rect x="440" y="172" width="110" height="34" rx="4" fill="#2563eb"/>
  <text x="495" y="194" class="stage">IF</text>
  <rect x="550" y="172" width="110" height="34" rx="4" fill="#059669"/>
  <text x="605" y="194" class="stage">ID</text>
  <rect x="660" y="172" width="110" height="34" rx="4" fill="#d97706"/>
  <text x="715" y="194" class="stage">EX</text>
  <rect x="110" y="172" width="110" height="34" rx="4" fill="#e2e8f0"/>
  <text x="165" y="194" class="stage2">（空）</text>
  <rect x="220" y="172" width="110" height="34" rx="4" fill="#e2e8f0"/>
  <text x="275" y="194" class="stage2">（空）</text>

  <text x="165" y="238" class="clk">T1</text>
  <text x="275" y="238" class="clk">T2</text>
  <text x="385" y="238" class="clk">T3</text>
  <text x="495" y="238" class="clk">T4</text>
  <text x="605" y="238" class="clk">T5</text>
  <text x="715" y="238" class="clk">T6</text>

  <text x="410" y="268" class="title">每条指令依次进入 IF→ID→EX→MEM→WB，不同指令在不同阶段重叠</text>
  <text x="410" y="290" class="stage2">理想情况下每个时钟周期完成一条指令</text>
</svg>`,
        },
      ],
    },
    {
      id: 'co-pipeline-concept',
      title: '流水线的概念',
      blocks: [
        {
          id: 'kb-co-pipeline-2-1',
          type: 'paragraph',
          text: '**流水线**把完整任务拆成多个连续子阶段，让不同任务在不同阶段上重叠执行。理想情况下每个时钟周期都有一条新指令进入流水线，各指令在不同阶段并行推进。流水线不缩短单条指令的执行时间，提高的是单位时间内完成的指令数。',
        },
        {
          id: 'kb-co-pipeline-2-5',
          type: 'paragraph',
          text: '**单周期处理器**：每条指令在一个时钟周期内完成，时钟周期由最慢指令决定，效率低。\n\n**多周期处理器**：把指令执行拆成多个阶段，每阶段一个时钟周期，不同阶段可并行，形成流水线。',
        },
      ],
    },
    {
      id: 'co-pipeline-hazard',
      title: '流水线的冒险',
      blocks: [
        {
          id: 'kb-co-pipeline-3-1',
          type: 'paragraph',
          text: '流水线正常工作需要满足：\n\n1. 重叠执行的指令无资源冲突。\n2. 流水线执行结果与串行执行结果相同。\n\n违背就产生**冒险**，分三类。',
        },
        {
          id: 'kb-co-pipeline-3-2',
          type: 'paragraph',
          text: '**结构冒险**：多条指令同时使用同一硬件资源。\n处理：资源重复（增加硬件资源）或流水线停顿。',
        },
        {
          id: 'kb-co-pipeline-3-3',
          type: 'paragraph',
          text: '**数据冒险**：指令依赖前一条指令的结果，但数据未就绪。分三种：\n\n- **写后读**（RAW）：下条指令的源是上条指令的目的。\n- **读后写**（WAR）：上条指令读、下条指令写同一寄存器。\n- **写后写**（WAW）：两条指令写同一寄存器。\n\n处理方式：流水线停顿、数据前推（旁路转发）、指令重排。',
        },
        {
          id: 'kb-co-pipeline-3-4',
          type: 'paragraph',
          text: '**控制冒险**：分支或跳转指令使 PC 改变，流水线已预取的后续指令可能无效。\n处理：流水线停顿、分支预测、延迟分支。',
        },
        {
          id: 'kb-co-pipeline-3-7',
          type: 'paragraph',
          text: '**冒险时停顿几个周期**，分两种情况：\n\n- **普通 RAW 数据冒险**（如 `ADD R1,R2,R3` 后紧跟 `SUB R4,R1,R5`）：有旁路转发时从 EX 段直接送，不停顿。\n- **Load-Use 冒险**（load 指令后紧跟使用其结果的指令）：load 的数据到 MEM 段末才就绪，旁路来不及，必须插入 1 个气泡，停 1 个周期。',
        },
        {
          id: 'kb-co-pipeline-3-8',
          type: 'html',
          html: `<svg viewBox="0 0 920 480" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { font-family: system-ui, sans-serif; }
    .title { font-size: 16px; font-weight: 700; fill: #0f172a; text-anchor: middle; }
    .instr { font-size: 13px; font-weight: 700; fill: #0f172a; text-anchor: end; }
    .stage { font-size: 12px; font-weight: 700; fill: #ffffff; text-anchor: middle; }
    .bubble { font-size: 12px; font-weight: 700; fill: #64748b; text-anchor: middle; }
    .clk { font-size: 12px; fill: #475569; text-anchor: middle; }
    .note { font-size: 12px; fill: #475569; text-anchor: middle; }
    .fwd { font-size: 11px; font-weight: 700; fill: #b45309; text-anchor: middle; }
    .fwd-lbl { font-size: 11px; font-weight: 700; fill: #b45309; text-anchor: start; }
  </style>
  <defs>
    <marker id="fwdArr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#d97706"/></marker>
  </defs>

  <text x="460" y="26" class="title">Load-Use 数据冒险：停顿 1 个时钟周期（插入气泡）</text>
  <text x="460" y="46" class="note" text-anchor="middle">I1 LOAD R1, [a]　→　I2 ADD R2, R1, R3：I2 的 EX 要用 R1</text>
  <text x="460" y="62" class="note" text-anchor="middle">但 load 的数据到 T4 的 MEM 末才就绪</text>

  <!-- 表头 -->
  <g class="clk">
    <text x="195" y="86">T1</text>
    <text x="285" y="86">T2</text>
    <text x="375" y="86">T3</text>
    <text x="465" y="86">T4</text>
    <text x="555" y="86">T5</text>
    <text x="645" y="86">T6</text>
    <text x="735" y="86">T7</text>
  </g>

  <!-- I1：LOAD -->
  <text x="142" y="118" class="instr">I1 LOAD</text>
  <rect x="150" y="96" width="90" height="36" rx="3" fill="#2563eb"/><text x="195" y="118" class="stage">IF</text>
  <rect x="240" y="96" width="90" height="36" rx="3" fill="#059669"/><text x="285" y="118" class="stage">ID</text>
  <rect x="330" y="96" width="90" height="36" rx="3" fill="#d97706"/><text x="375" y="118" class="stage">EX</text>
  <rect x="420" y="96" width="90" height="36" rx="3" fill="#7c3aed"/><text x="465" y="118" class="stage">MEM</text>
  <rect x="510" y="96" width="90" height="36" rx="3" fill="#0f766e"/><text x="555" y="118" class="stage">WB</text>

  <!-- MEM/WB 段寄存器标记（I1 MEM 与 WB 之间 x=510） -->
  <rect x="502" y="130" width="16" height="7" rx="1.5" fill="#b45309"/>

  <!-- I2：ADD -->
  <text x="142" y="206" class="instr">I2 ADD</text>
  <rect x="240" y="184" width="90" height="36" rx="3" fill="#2563eb"/><text x="285" y="206" class="stage">IF</text>
  <rect x="330" y="184" width="90" height="36" rx="3" fill="#059669"/><text x="375" y="206" class="stage">ID</text>
  <rect x="420" y="184" width="90" height="36" rx="3" fill="#f1f5f9" stroke="#94a3b8" stroke-dasharray="5,3"/><text x="465" y="206" class="bubble">气泡（停）</text>
  <rect x="510" y="184" width="90" height="36" rx="3" fill="#d97706"/><text x="555" y="206" class="stage">EX</text>
  <rect x="600" y="184" width="90" height="36" rx="3" fill="#0f766e"/><text x="645" y="206" class="stage">WB</text>

  <!-- I3：下一条 -->
  <text x="142" y="250" class="instr">I3</text>
  <rect x="330" y="228" width="90" height="36" rx="3" fill="#2563eb"/><text x="375" y="250" class="stage">IF</text>
  <rect x="420" y="228" width="90" height="36" rx="3" fill="#f1f5f9" stroke="#94a3b8" stroke-dasharray="5,3"/><text x="465" y="250" class="bubble">气泡（停）</text>
  <rect x="510" y="228" width="90" height="36" rx="3" fill="#059669"/><text x="555" y="250" class="stage">ID</text>
  <rect x="600" y="228" width="90" height="36" rx="3" fill="#d97706"/><text x="645" y="250" class="stage">EX</text>

  <!-- 转发箭头：从 I1 MEM 右边缘(MEM/WB 段寄存器, x=510) 垂直向下到 I2 EX 左边缘(开头, x=510) -->
  <line x1="510" y1="137" x2="510" y2="184" stroke="#d97706" stroke-width="2.5" marker-end="url(#fwdArr)"/>
  <text x="522" y="152" class="fwd-lbl">旁路转发</text>
  <text x="522" y="166" class="fwd-lbl">从 MEM/WB 段寄存器取数据</text>

  <text x="460" y="300" class="note" text-anchor="middle">T4 插入气泡：I2 停在 ID、I3 停在 IF，整个流水线推后一个周期</text>
  <text x="460" y="320" class="note" text-anchor="middle">T5 load 结果（T4 MEM 末存入 MEM/WB 段寄存器）送到 I2 的 EX 段开头，I2 继续执行</text>
  <text x="460" y="340" class="note" text-anchor="middle">结论：Load-Use 冒险停顿 1 个周期；普通 RAW 有转发时不停顿</text>
</svg>`,
        },
        {
          id: 'kb-co-pipeline-3-9',
          type: 'paragraph',
          text: '**ALU 指令**（如 ADD）的结果在 EX 段末就绪，下一条指令在下一个时钟周期的 EX 段正好要用它。两者只隔一个周期，旁路转发从 EX/MEM 段寄存器直接把结果送到 ALU 输入端，刚好来得及，不用停顿。\n\n对比 Load-Use 冒险：load 的结果要等 MEM 段末才就绪，晚了一个周期，所以来不及，必须停顿。',
        },
        {
          id: 'kb-co-pipeline-3-10',
          type: 'html',
          html: `<svg viewBox="0 0 920 450" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { font-family: system-ui, sans-serif; }
    .title { font-size: 16px; font-weight: 700; fill: #0f172a; text-anchor: middle; }
    .instr { font-size: 13px; font-weight: 700; fill: #0f172a; text-anchor: end; }
    .stage { font-size: 12px; font-weight: 700; fill: #ffffff; text-anchor: middle; }
    .clk { font-size: 12px; fill: #475569; text-anchor: middle; }
    .note { font-size: 12px; fill: #475569; text-anchor: middle; }
    .fwd-lbl { font-size: 11px; font-weight: 700; fill: #b45309; text-anchor: start; }
    .ok { font-size: 12px; font-weight: 700; fill: #15803d; text-anchor: middle; }
  </style>
  <defs>
    <marker id="fwdArr2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#d97706"/></marker>
  </defs>

  <text x="460" y="26" class="title">ALU 指令数据旁路转发：刚好来得及，不停顿</text>
  <text x="460" y="46" class="note" text-anchor="middle">I1 ADD R1, R2, R3　→　I2 SUB R4, R1, R5：SUB 的 EX 要用 R1</text>
  <text x="460" y="62" class="note" text-anchor="middle">I1 的 EX 在 T3 末就出结果，I2 的 EX 在 T4，只隔一个周期，旁路直接送</text>

  <!-- 表头 -->
  <g class="clk">
    <text x="195" y="86">T1</text>
    <text x="285" y="86">T2</text>
    <text x="375" y="86">T3</text>
    <text x="465" y="86">T4</text>
    <text x="555" y="86">T5</text>
    <text x="645" y="86">T6</text>
  </g>

  <!-- I1：ADD -->
  <text x="142" y="118" class="instr">I1 ADD</text>
  <rect x="150" y="96" width="90" height="36" rx="3" fill="#2563eb"/><text x="195" y="118" class="stage">IF</text>
  <rect x="240" y="96" width="90" height="36" rx="3" fill="#059669"/><text x="285" y="118" class="stage">ID</text>
  <rect x="330" y="96" width="90" height="36" rx="3" fill="#d97706"/><text x="375" y="118" class="stage">EX</text>
  <rect x="420" y="96" width="90" height="36" rx="3" fill="#7c3aed"/><text x="465" y="118" class="stage">MEM</text>
  <rect x="510" y="96" width="90" height="36" rx="3" fill="#0f766e"/><text x="555" y="118" class="stage">WB</text>

  <!-- EX/MEM 段寄存器标记（I1 EX 与 MEM 之间 x=420） -->
  <rect x="412" y="130" width="16" height="7" rx="1.5" fill="#b45309"/>

  <!-- I2：SUB -->
  <text x="142" y="206" class="instr">I2 SUB</text>
  <rect x="240" y="184" width="90" height="36" rx="3" fill="#2563eb"/><text x="285" y="206" class="stage">IF</text>
  <rect x="330" y="184" width="90" height="36" rx="3" fill="#059669"/><text x="375" y="206" class="stage">ID</text>
  <rect x="420" y="184" width="90" height="36" rx="3" fill="#d97706"/><text x="465" y="206" class="stage">EX</text>
  <rect x="510" y="184" width="90" height="36" rx="3" fill="#7c3aed"/><text x="555" y="206" class="stage">MEM</text>
  <rect x="600" y="184" width="90" height="36" rx="3" fill="#0f766e"/><text x="645" y="206" class="stage">WB</text>

  <!-- 转发箭头：从 I1 EX 右边缘(EX/MEM 段寄存器, x=420) 垂直向下到 I2 EX 左边缘(开头, x=420) -->
  <line x1="420" y1="137" x2="420" y2="184" stroke="#d97706" stroke-width="2.5" marker-end="url(#fwdArr2)"/>
  <text x="432" y="152" class="fwd-lbl">旁路转发</text>
  <text x="432" y="166" class="fwd-lbl">从 EX/MEM 段寄存器取数据</text>

  <!-- 无气泡标记 -->
  <rect x="330" y="240" width="180" height="28" rx="4" fill="#dcfce7" stroke="#16a34a" stroke-width="1.5"/>
  <text x="420" y="259" class="ok">无气泡：流水线连续执行</text>

  <text x="460" y="300" class="note" text-anchor="middle">I1 的 ALU 结果在 T3 时钟末写入 EX/MEM 段寄存器，T4 初经旁路送到 I2 的 EX 段开头（ALU 输入端）</text>
  <text x="460" y="320" class="note" text-anchor="middle">两者间隔正好 1 个时钟周期，转发线从 EX/MEM 段寄存器引出，无需等待 WB 写回</text>
  <text x="460" y="340" class="note" text-anchor="middle">结论：ALU 指令的 RAW 冒险靠 EX 段旁路转发即可消除，不停顿</text>
</svg>`,
        },
        {
          id: 'kb-co-pipeline-3-11',
          type: 'paragraph',
          text: '**没有数据旁路时，普通 RAW 也要停**。若 CPU 无旁路转发，`ADD R1,R2,R3` 的结果要等 **WB** 段写回寄存器堆后，后一条指令的 ID 阶段才能读到 R1。5 段流水线下需要停 3 个时钟周期（T3 到 T5，直到前一条 WB 完成）。旁路转发消除这段等待。',
        },
        {
          id: 'kb-co-pipeline-3-12',
          type: 'html',
          html: `<svg viewBox="0 0 940 450" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { font-family: system-ui, sans-serif; }
    .title { font-size: 16px; font-weight: 700; fill: #0f172a; text-anchor: middle; }
    .instr { font-size: 13px; font-weight: 700; fill: #0f172a; text-anchor: end; }
    .stage { font-size: 12px; font-weight: 700; fill: #ffffff; text-anchor: middle; }
    .bubble { font-size: 12px; font-weight: 700; fill: #94a3b8; text-anchor: middle; }
    .clk { font-size: 12px; fill: #475569; text-anchor: middle; }
    .note { font-size: 12px; fill: #475569; text-anchor: middle; }
    .lbl { font-size: 11px; font-weight: 700; fill: #b45309; text-anchor: start; }
  </style>
  <defs>
    <marker id="wback" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#d97706"/></marker>
  </defs>

  <text x="460" y="26" class="title">无数据旁路：普通 RAW 冒险也要停 3 个周期（等 WB 写回）</text>
  <text x="460" y="46" class="note" text-anchor="middle">I1 ADD R1, R2, R3　→　I2 ADD R4, R1, R5：I2 的 ID 要读 R1</text>
  <text x="460" y="62" class="note" text-anchor="middle">无转发时 R1 只能等 I1 的 WB 写回寄存器堆，I2 的 ID 推迟到 T6</text>

  <!-- 表头 T1-T9 -->
  <g class="clk">
    <text x="191" y="86">T1</text>
    <text x="273" y="86">T2</text>
    <text x="355" y="86">T3</text>
    <text x="437" y="86">T4</text>
    <text x="519" y="86">T5</text>
    <text x="601" y="86">T6</text>
    <text x="683" y="86">T7</text>
    <text x="765" y="86">T8</text>
    <text x="847" y="86">T9</text>
  </g>

  <!-- I1：ADD -->
  <text x="142" y="118" class="instr">I1 ADD</text>
  <rect x="150" y="96" width="82" height="36" rx="3" fill="#2563eb"/><text x="191" y="118" class="stage">IF</text>
  <rect x="232" y="96" width="82" height="36" rx="3" fill="#059669"/><text x="273" y="118" class="stage">ID</text>
  <rect x="314" y="96" width="82" height="36" rx="3" fill="#d97706"/><text x="355" y="118" class="stage">EX</text>
  <rect x="396" y="96" width="82" height="36" rx="3" fill="#7c3aed"/><text x="437" y="118" class="stage">MEM</text>
  <rect x="478" y="96" width="82" height="36" rx="3" fill="#0f766e"/><text x="519" y="118" class="stage">WB</text>

  <!-- I2：ADD（无旁路：T3-T5 停在 ID 前，T6 进 ID） -->
  <text x="142" y="162" class="instr">I2 ADD</text>
  <rect x="232" y="140" width="82" height="36" rx="3" fill="#2563eb"/><text x="273" y="162" class="stage">IF</text>
  <rect x="314" y="140" width="82" height="36" rx="3" fill="#f1f5f9" stroke="#94a3b8" stroke-dasharray="5,3"/><text x="355" y="162" class="bubble">停</text>
  <rect x="396" y="140" width="82" height="36" rx="3" fill="#f1f5f9" stroke="#94a3b8" stroke-dasharray="5,3"/><text x="437" y="162" class="bubble">停</text>
  <rect x="478" y="140" width="82" height="36" rx="3" fill="#f1f5f9" stroke="#94a3b8" stroke-dasharray="5,3"/><text x="519" y="162" class="bubble">停</text>
  <rect x="560" y="140" width="82" height="36" rx="3" fill="#059669"/><text x="601" y="162" class="stage">ID</text>
  <rect x="642" y="140" width="82" height="36" rx="3" fill="#d97706"/><text x="683" y="162" class="stage">EX</text>
  <rect x="724" y="140" width="82" height="36" rx="3" fill="#7c3aed"/><text x="765" y="162" class="stage">MEM</text>
  <rect x="806" y="140" width="82" height="36" rx="3" fill="#0f766e"/><text x="847" y="162" class="stage">WB</text>

  <!-- I3：下一条（随之推迟） -->
  <text x="142" y="206" class="instr">I3</text>
  <rect x="314" y="184" width="82" height="36" rx="3" fill="#2563eb"/><text x="355" y="206" class="stage">IF</text>
  <rect x="396" y="184" width="82" height="36" rx="3" fill="#f1f5f9" stroke="#94a3b8" stroke-dasharray="5,3"/><text x="437" y="206" class="bubble">停</text>
  <rect x="478" y="184" width="82" height="36" rx="3" fill="#f1f5f9" stroke="#94a3b8" stroke-dasharray="5,3"/><text x="519" y="206" class="bubble">停</text>
  <rect x="560" y="184" width="82" height="36" rx="3" fill="#f1f5f9" stroke="#94a3b8" stroke-dasharray="5,3"/><text x="601" y="206" class="bubble">停</text>
  <rect x="642" y="184" width="82" height="36" rx="3" fill="#059669"/><text x="683" y="206" class="stage">ID</text>
  <rect x="724" y="184" width="82" height="36" rx="3" fill="#d97706"/><text x="765" y="206" class="stage">EX</text>
  <rect x="806" y="184" width="82" height="36" rx="3" fill="#7c3aed"/><text x="847" y="206" class="stage">MEM</text>

  <!-- 写回箭头：I1 WB(T5 末) -> I2 ID(T6 开头) -->
  <line x1="478" y1="134" x2="560" y2="140" stroke="#d97706" stroke-width="2.5" marker-end="url(#wback)"/>
  <text x="486" y="130" class="lbl">等 WB 写回寄存器堆后</text>
  <text x="486" y="144" class="lbl">I2 的 ID 才能读到新 R1</text>

  <text x="460" y="248" class="note" text-anchor="middle">T3~T5 流水线冻结：I2 停在 ID 前、I3 停在 IF 后，共停 3 个周期</text>
  <text x="460" y="268" class="note" text-anchor="middle">T5 末 I1 在 WB 把结果写回寄存器堆，T6 起 I2 进入 ID 读到新 R1，后续指令顺延</text>
  <text x="460" y="288" class="note" text-anchor="middle">结论：无旁路转发时普通 RAW 冒险停 3 个周期；有 EX 段旁路时不停顿（见上图）</text>
</svg>`,
        },
        {
          id: 'kb-co-pipeline-3-13',
          type: 'paragraph',
          text: '**控制冒险**：跳转指令使预取的后续指令作废。跳转/分支指令在 **EX** 段计算出目标地址并更新 PC（MEM、WB 为空段），此前 IF 已预取的下一条、下下条指令全部作废，需要冲刷。\n\n分支在 EX 段解决时损失 2 个时钟周期（T2、T3 预取的指令作废，T4 起重新取目标指令）。',
        },
        {
          id: 'kb-co-pipeline-3-14',
          type: 'html',
          html: `<svg viewBox="0 0 940 470" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { font-family: system-ui, sans-serif; }
    .title { font-size: 16px; font-weight: 700; fill: #0f172a; text-anchor: middle; }
    .instr { font-size: 13px; font-weight: 700; fill: #0f172a; text-anchor: end; }
    .stage { font-size: 12px; font-weight: 700; fill: #ffffff; text-anchor: middle; }
    .void { font-size: 11px; font-weight: 700; fill: #b91c1c; text-anchor: middle; }
    .empty { font-size: 11px; font-weight: 700; fill: #94a3b8; text-anchor: middle; }
    .clk { font-size: 12px; fill: #475569; text-anchor: middle; }
    .note { font-size: 12px; fill: #475569; text-anchor: middle; }
    .lbl { font-size: 11px; font-weight: 700; fill: #b45309; text-anchor: start; }
  </style>
  <defs>
    <marker id="jmpArr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#b45309"/></marker>
  </defs>

  <text x="460" y="26" class="title">控制冒险：跳转指令在 EX 段解决，停顿 2 个周期</text>
  <text x="460" y="46" class="note" text-anchor="middle">JMP 目标：MEM / WB 为空段；T3 EX 算出目标地址并更新 PC</text>

  <!-- 表头 T1-T8 -->
  <g class="clk">
    <text x="191" y="86">T1</text>
    <text x="273" y="86">T2</text>
    <text x="355" y="86">T3</text>
    <text x="437" y="86">T4</text>
    <text x="519" y="86">T5</text>
    <text x="601" y="86">T6</text>
    <text x="683" y="86">T7</text>
    <text x="765" y="86">T8</text>
  </g>

  <!-- JMP -->
  <text x="142" y="118" class="instr">JMP</text>
  <rect x="150" y="96" width="82" height="36" rx="3" fill="#2563eb"/><text x="191" y="118" class="stage">IF</text>
  <rect x="232" y="96" width="82" height="36" rx="3" fill="#059669"/><text x="273" y="118" class="stage">ID</text>
  <rect x="314" y="96" width="82" height="36" rx="3" fill="#d97706"/><text x="355" y="118" class="stage">EX</text>
  <rect x="396" y="96" width="82" height="36" rx="3" fill="#e2e8f0" stroke="#94a3b8" stroke-dasharray="4,3"/><text x="437" y="118" class="empty">MEM 空</text>
  <rect x="478" y="96" width="82" height="36" rx="3" fill="#e2e8f0" stroke="#94a3b8" stroke-dasharray="4,3"/><text x="519" y="118" class="empty">WB 空</text>

  <!-- I2：预取的下一条，作废 -->
  <text x="142" y="162" class="instr">I2</text>
  <rect x="232" y="140" width="82" height="36" rx="3" fill="#2563eb"/><text x="273" y="162" class="stage">IF</text>
  <rect x="314" y="140" width="82" height="36" rx="3" fill="#fee2e2" stroke="#dc2626" stroke-width="2"/><text x="355" y="162" class="void">作废 ✗</text>

  <!-- I3：预取的下下条，作废 -->
  <text x="142" y="206" class="instr">I3</text>
  <rect x="314" y="184" width="82" height="36" rx="3" fill="#fee2e2" stroke="#dc2626" stroke-width="2"/><text x="355" y="206" class="void">作废 ✗</text>

  <!-- target -->
  <text x="142" y="250" class="instr">目标</text>
  <rect x="396" y="228" width="82" height="36" rx="3" fill="#2563eb"/><text x="437" y="250" class="stage">IF</text>
  <rect x="478" y="228" width="82" height="36" rx="3" fill="#059669"/><text x="519" y="250" class="stage">ID</text>
  <rect x="560" y="228" width="82" height="36" rx="3" fill="#d97706"/><text x="601" y="250" class="stage">EX</text>
  <rect x="642" y="228" width="82" height="36" rx="3" fill="#7c3aed"/><text x="683" y="250" class="stage">MEM</text>
  <rect x="724" y="228" width="82" height="36" rx="3" fill="#0f766e"/><text x="765" y="250" class="stage">WB</text>

  <!-- 跳转箭头：JMP EX(T3) -> target IF(T4) -->
  <line x1="355" y1="134" x2="437" y2="228" stroke="#b45309" stroke-width="2.2" marker-end="url(#jmpArr)"/>
  <text x="330" y="196" class="lbl">更新 PC → T4 取目标</text>

  <text x="460" y="300" class="note" text-anchor="middle">T2、T3 预取的 I2、I3 因目标地址改变全部作废（红框），需冲刷</text>
  <text x="460" y="320" class="note" text-anchor="middle">T4 起从目标地址重新取指，流水线重新填充</text>
  <text x="460" y="340" class="note" text-anchor="middle">结论：分支在 EX 段解决损失 2 个周期（若在 ID 段解决则只损失 1 个）</text>
</svg>`,
        },
        {
          id: 'kb-co-pipeline-3-6',
          type: 'callout',
          title: '停顿卡在 ID，不是 EX',
          text: '寄存器读取发生在 ID 阶段，直到要用到的数据通过了 WB 阶段写回寄存器，后续指令的 ID 才能继续，否则一直卡在这里。',
          tone: 'orange',
        },
      ],
    },
    {
      id: 'co-pipeline-advanced',
      title: '高级流水线',
      blocks: [
        {
          id: 'kb-co-pipeline-4-1',
          type: 'paragraph',
          text: '- **超标量流水线**：一个时钟周期内并行发射多条指令到多个执行单元，由硬件动态分析依赖。\n- **超流水线**：把流水段拆得更细，缩短每段时间，允许更高时钟频率。\n- **超长指令字**（VLIW）：由编译器在编译期打包多条可并行指令，硬件简化。',
        },
      ],
    },
  ],
}
