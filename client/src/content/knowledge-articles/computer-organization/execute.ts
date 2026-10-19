import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'
import {
  executeAnimation,
  shiftImmediateAnimation,
} from '@/animations/computer-organization/execute/instruction-cycle'

export const executeArticle: KnowledgeArticleData = {
  pointId: 'co-cpu-execute',
  subpoints: [
    {
      id: 'co-execute-instruction-cycle',
      title: '指令周期',
      blocks: [
        {
          id: 'kb-co-execute-1-1',
          type: 'paragraph',
          text: '**指令周期**是 CPU 取出并执行一条指令所需的全部时间，由若干**机器周期**（节拍）组成。\n\n典型分成**取指周期**、**间址周期**、**执行周期**、**中断周期**四个子周期。**取指周期**固定存在，间址/中断周期视寻址方式和是否响应中断而定。',
        },
        
      ],
    },
    {
      id: 'co-execute-process',
      title: '单总线结构',
      blocks: [
        {
          id: 'kb-co-execute-1-2',
          type: 'html',
          html: `<svg viewBox="0 0 940 600" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { font-family: system-ui, sans-serif; }
    .title { font-size: 16px; font-weight: 700; fill: #0f172a; text-anchor: middle; }
    .reg { font-size: 12px; font-weight: 700; fill: #0f172a; text-anchor: middle; }
    .reg-sub { font-size: 9px; fill: #64748b; text-anchor: middle; }
    .bus-lbl { font-size: 12px; font-weight: 700; fill: #1d4ed8; text-anchor: middle; }
    .note { font-size: 12px; fill: #475569; text-anchor: middle; }
  </style>
  <defs>
    <marker id="exBus" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#1d4ed8"/></marker>
    <marker id="exMem" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#334155"/></marker>
  </defs>

  <text x="460" y="26" class="title">单总线数据通路：所有部件挂一条内总线</text>

  <!-- 主存（对准 MAR / MDR 上方） -->
  <rect x="260" y="40" width="196" height="48" rx="6" fill="#f1f5f9" stroke="#64748b" stroke-width="1.6"/>
  <text x="358" y="61" class="reg">主存 Memory</text>
  <text x="358" y="78" class="reg-sub">通过 MAR 送地址、MDR 传数据</text>

  <!-- 主存地址/数据连线到 MAR/MDR -->
  <line x1="307" y1="88" x2="307" y2="118" stroke="#334155" stroke-width="1.8" marker-end="url(#exMem)"/>
  <line x1="409" y1="88" x2="409" y2="118" stroke="#334155" stroke-width="1.8"/>

  <!-- 寄存器排（总线上方） -->
  <g>
    <rect x="60" y="118" width="86" height="52" rx="5" fill="#eff6ff" stroke="#2563eb" stroke-width="1.5"/>
    <text x="103" y="140" class="reg">PC</text>
    <text x="103" y="158" class="reg-sub">程序计数器</text>
    <rect x="162" y="118" width="86" height="52" rx="5" fill="#eff6ff" stroke="#2563eb" stroke-width="1.5"/>
    <text x="205" y="140" class="reg">IR</text>
    <text x="205" y="158" class="reg-sub">指令寄存器</text>
    <rect x="264" y="118" width="86" height="52" rx="5" fill="#dcfce7" stroke="#16a34a" stroke-width="1.5"/>
    <text x="307" y="140" class="reg">MAR</text>
    <text x="307" y="158" class="reg-sub">地址寄存器</text>
    <rect x="366" y="118" width="86" height="52" rx="5" fill="#dcfce7" stroke="#16a34a" stroke-width="1.5"/>
    <text x="409" y="140" class="reg">MDR</text>
    <text x="409" y="158" class="reg-sub">数据寄存器</text>
    <rect x="468" y="118" width="86" height="52" rx="5" fill="#eff6ff" stroke="#2563eb" stroke-width="1.5"/>
    <text x="511" y="140" class="reg">GPR</text>
    <text x="511" y="158" class="reg-sub">通用寄存器组</text>
  </g>

  <!-- 寄存器 → 总线 连线 -->
  <g stroke="#2563eb" stroke-width="1.4">
    <line x1="103" y1="170" x2="103" y2="196"/>
    <line x1="205" y1="170" x2="205" y2="196"/>
    <line x1="307" y1="170" x2="307" y2="196"/>
    <line x1="409" y1="170" x2="409" y2="196"/>
    <line x1="511" y1="170" x2="511" y2="196"/>
  </g>

  <!-- 内总线 -->
  <line x1="60" y1="196" x2="556" y2="196" stroke="#1d4ed8" stroke-width="4"/>
  <rect x="230" y="184" width="160" height="24" rx="4" fill="#ffffff" stroke="#1d4ed8" stroke-width="1.2"/>
  <text x="310" y="200" class="bus-lbl">内总线（单总线）</text>

  <!-- 总线 → 寄存器 连线 -->
  <g stroke="#2563eb" stroke-width="1.4" marker-end="url(#exBus)">
    <line x1="103" y1="196" x2="103" y2="222"/>
    <line x1="205" y1="196" x2="205" y2="222"/>
    <line x1="307" y1="196" x2="307" y2="222"/>
    <line x1="409" y1="196" x2="409" y2="222"/>
    <line x1="511" y1="196" x2="511" y2="222"/>
  </g>

  <!-- ALU 区：Y 在左、ALU 居中、Z 在右 -->
  <rect x="80" y="280" width="86" height="60" rx="5" fill="#fef3c7" stroke="#d97706" stroke-width="1.8"/>
  <text x="123" y="305" class="reg" fill="#b45309">Y 暂存器</text>
  <text x="123" y="325" class="reg-sub">锁存 ALU 输入</text>
  <line x1="123" y1="196" x2="123" y2="280" stroke="#d97706" stroke-width="2" marker-end="url(#exBus)"/>

  <rect x="230" y="280" width="130" height="60" rx="6" fill="#dbeafe" stroke="#2563eb" stroke-width="1.8"/>
  <text x="295" y="305" class="reg" fill="#1d4ed8">ALU</text>
  <text x="295" y="325" class="reg-sub">算术 / 逻辑运算</text>
  <line x1="295" y1="196" x2="295" y2="280" stroke="#334155" stroke-width="2" marker-end="url(#exMem)"/>
  <line x1="166" y1="310" x2="230" y2="310" stroke="#d97706" stroke-width="2" marker-end="url(#exMem)"/>

  <rect x="420" y="280" width="86" height="60" rx="5" fill="#fef3c7" stroke="#d97706" stroke-width="1.8"/>
  <text x="463" y="305" class="reg" fill="#b45309">Z 暂存器</text>
  <text x="463" y="325" class="reg-sub">锁存 ALU 输出</text>
  <line x1="360" y1="310" x2="420" y2="310" stroke="#334155" stroke-width="2" marker-end="url(#exMem)"/>
  <line x1="463" y1="280" x2="463" y2="196" stroke="#d97706" stroke-width="2" marker-end="url(#exBus)"/>

  <text x="460" y="372" class="note" text-anchor="middle">同一时刻总线只允许一路数据，一次传送占一个时钟周期，单总线因此慢</text>
  <text x="460" y="394" class="note" text-anchor="middle">ALU 的 A 端直接取自总线、B 端经暂存器 Y；ALU 结果先送 Z 暂存器，再由 Zout 送上总线</text>
</svg>`,
        },
        {
          id: 'kb-co-execute-1-3',
          type: 'callout',
          title: '为什么 ALU 需要 Y 和 Z 暂存器',
          text: 'ALU 有两个输入端，但内总线同一时刻只能送一路数据。先把一个操作数锁存进 Y，再让另一个操作数经总线到 A 端；ALU 结果先放 Z，再经 Zout 送总线，避免与总线上的数据冲突。',
          tone: 'blue',
        },
        {
          id: 'kb-co-execute-1-4',
          type: 'paragraph',
          text: '**取指周期**从 PC 开始，把指令从主存取到 IR。单总线结构下一个节拍只能完成一次总线传送，取指需要 4 个节拍：\n\n1. T1 `PC→MAR`（PCout、MARin）。\n2. T2 读主存（MemR）。\n3. T3 `MDR←主存`（MDRinE）。\n4. T4 `IR←MDR`（MDRout、IRin）。\n\nMDR 是内外总线的中转站，取指结束后 PC 自增。',
        },
        {
          id: 'kb-co-execute-1-5',
          type: 'paragraph',
          text: '**执行周期**的节拍数随指令类型不同。以 `ADD Rd, Rs` 为例需要 4 个节拍：\n\n1. T1 `Y←Rs`：锁存第一个操作数。\n2. T2 `A←Rd` 并启动 ALU（Rdout、ALUop）。\n3. T3 结果入 `Z←A+B`。\n4. T4 `Rd←Z`（Zout、Rdin）。\n\n若指令要访存，还需插入 MAR→主存→MDR→目标寄存器等节拍。',
        },
      ],
    },
    {
      id: 'co-execute-example',
      title: 'CPU综合电路设计',
      blocks: [
        {
          id: 'kb-co-execute-2-1',
          type: 'paragraph',
          text: '以一道数据通路综合题为例，展示**一条指令从取指到执行完成**的全过程。该机为 16 位定长指令字，含 R 型（运算）、I 型（立即数）、M 型（访存）三种格式，取指周期完成 PC 增量。图中①和②为多路选择器（MUX），IR.rs、IR.rt 为 IR 中的寄存器编号字段。',
        },
        {
          id: 'kb-co-execute-2-2-intro',
          type: 'paragraph',
          text: '下面演示的是**取指过程**：CPU 从 `PC=0100H` 出发，将地址送入 MAR，从主存取出指令 `A102H` 并写入 IR，同时通过 ALU 计算 `PC+2`，把 PC 更新为 `0102H`。',
        },
        {
          id: 'kb-co-execute-2-2',
          type: 'animation',
          animation: executeAnimation,
          sourceImport: {
            path: '@/animations/computer-organization/execute/instruction-cycle',
            localName: 'executeAnimation',
            kind: 'named',
          },
        },
        {
          id: 'kb-co-execute-2-3-intro',
          type: 'paragraph',
          text: '下面演示的是**左移指令 `0000 0000 0100 0010` 的执行过程**。该指令译码为 `rt=0000`、`num=0100`、`op1=0010`，含义是把 `R0` 左移 4 位后写回 `R0`，即 `R[0] ← R[0] << 4`。',
        },
        {
          id: 'kb-co-execute-2-3',
          type: 'animation',
          animation: shiftImmediateAnimation,
          sourceImport: {
            path: '@/animations/computer-organization/execute/instruction-cycle',
            localName: 'shiftImmediateAnimation',
            kind: 'named',
          },
        },
      ],
    },
  ],
}
