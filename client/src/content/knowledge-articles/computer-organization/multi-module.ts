import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const multiModuleArticle: KnowledgeArticleData = {
  pointId: 'co-multi-module',
  subpoints: [
    {
      id: 'co-multi-module-s1',
      title: '多模块存储器',
      blocks: [
        {
          id: 'kb-co-memory-hierarchy-3-1',
          type: 'paragraph',
          text: '**提高主存性能**有两个方向：\n\n**单体多字存储器**和**多体交叉存储器**提高主存的带宽和吞吐率；\n\n**位扩展、字扩展、字位扩展**扩大主存的字长或容量。',
        },
        {
          id: 'kb-co-memory-hierarchy-3-2',
          type: 'paragraph',
          text: '**单体多字存储器**：一个地址对应 $n$ 个连续的字（如 $n=4$ 时一次读出 4 个字）。它扩大一次访问的数据宽度，只能提高顺序访问效率，对多个独立地址无法提高并行性。',
        },
        {
          id: 'kb-co-memory-hierarchy-3-3',
          type: 'paragraph',
          text: '**多体交叉存储器**：用多个存储体并行工作。\n\n**高位交叉编址**（高位选体）：整个存储体连续存一段地址空间，多体串行工作，无法提升带宽，也称高位连续编址。\n\n**低位交叉编址**（低位选体）：相邻地址分散在不同存储体，多体可并行交替处理连续访存，每个存储体需配自己的地址寄存器和数据寄存器。',
        },
        {
          id: 'kb-co-memory-hierarchy-3-5',
          type: 'html',
          html: `<svg viewBox="0 0 940 520" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { font-family: 'JetBrains Mono', 'Courier New', monospace; }
    .title { font-size: 18px; font-weight: 700; fill: #1e293b; text-anchor: middle; font-family: system-ui, sans-serif; }
    .bank-name { font-size: 15px; font-weight: 700; text-anchor: middle; font-family: system-ui, sans-serif; }
  </style>

  <text x="470" y="26" class="title">低位交叉编址（低位选体）：每体后两位相同</text>
  <text x="135" y="42" class="bank-name" fill="#2563eb">M0</text>
  <rect x="60" y="52" width="150" height="40" rx="2" fill="#ffffff" stroke="#2563eb" stroke-width="2"/>
  <text x="135" y="78" text-anchor="middle"><tspan fill="#334155">000000</tspan><tspan fill="#dc2626">00</tspan>b</text>
  <rect x="60" y="94" width="150" height="40" rx="2" fill="#ffffff" stroke="#2563eb" stroke-width="2"/>
  <text x="135" y="120" text-anchor="middle"><tspan fill="#334155">000001</tspan><tspan fill="#dc2626">00</tspan>b</text>
  <rect x="60" y="136" width="150" height="40" rx="2" fill="#ffffff" stroke="#2563eb" stroke-width="2"/>
  <text x="135" y="162" text-anchor="middle"><tspan fill="#334155">000010</tspan><tspan fill="#dc2626">00</tspan>b</text>
  <rect x="60" y="178" width="150" height="40" rx="2" fill="#ffffff" stroke="#2563eb" stroke-width="2"/>
  <text x="135" y="204" text-anchor="middle"><tspan fill="#334155">000011</tspan><tspan fill="#dc2626">00</tspan>b</text>
  <text x="325" y="42" class="bank-name" fill="#059669">M1</text>
  <rect x="250" y="52" width="150" height="40" rx="2" fill="#ffffff" stroke="#059669" stroke-width="2"/>
  <text x="325" y="78" text-anchor="middle"><tspan fill="#334155">000000</tspan><tspan fill="#dc2626">01</tspan>b</text>
  <rect x="250" y="94" width="150" height="40" rx="2" fill="#ffffff" stroke="#059669" stroke-width="2"/>
  <text x="325" y="120" text-anchor="middle"><tspan fill="#334155">000001</tspan><tspan fill="#dc2626">01</tspan>b</text>
  <rect x="250" y="136" width="150" height="40" rx="2" fill="#ffffff" stroke="#059669" stroke-width="2"/>
  <text x="325" y="162" text-anchor="middle"><tspan fill="#334155">000010</tspan><tspan fill="#dc2626">01</tspan>b</text>
  <rect x="250" y="178" width="150" height="40" rx="2" fill="#ffffff" stroke="#059669" stroke-width="2"/>
  <text x="325" y="204" text-anchor="middle"><tspan fill="#334155">000011</tspan><tspan fill="#dc2626">01</tspan>b</text>
  <text x="515" y="42" class="bank-name" fill="#d97706">M2</text>
  <rect x="440" y="52" width="150" height="40" rx="2" fill="#ffffff" stroke="#d97706" stroke-width="2"/>
  <text x="515" y="78" text-anchor="middle"><tspan fill="#334155">000000</tspan><tspan fill="#dc2626">10</tspan>b</text>
  <rect x="440" y="94" width="150" height="40" rx="2" fill="#ffffff" stroke="#d97706" stroke-width="2"/>
  <text x="515" y="120" text-anchor="middle"><tspan fill="#334155">000001</tspan><tspan fill="#dc2626">10</tspan>b</text>
  <rect x="440" y="136" width="150" height="40" rx="2" fill="#ffffff" stroke="#d97706" stroke-width="2"/>
  <text x="515" y="162" text-anchor="middle"><tspan fill="#334155">000010</tspan><tspan fill="#dc2626">10</tspan>b</text>
  <rect x="440" y="178" width="150" height="40" rx="2" fill="#ffffff" stroke="#d97706" stroke-width="2"/>
  <text x="515" y="204" text-anchor="middle"><tspan fill="#334155">000011</tspan><tspan fill="#dc2626">10</tspan>b</text>
  <text x="705" y="42" class="bank-name" fill="#7c3aed">M3</text>
  <rect x="630" y="52" width="150" height="40" rx="2" fill="#ffffff" stroke="#7c3aed" stroke-width="2"/>
  <text x="705" y="78" text-anchor="middle"><tspan fill="#334155">000000</tspan><tspan fill="#dc2626">11</tspan>b</text>
  <rect x="630" y="94" width="150" height="40" rx="2" fill="#ffffff" stroke="#7c3aed" stroke-width="2"/>
  <text x="705" y="120" text-anchor="middle"><tspan fill="#334155">000001</tspan><tspan fill="#dc2626">11</tspan>b</text>
  <rect x="630" y="136" width="150" height="40" rx="2" fill="#ffffff" stroke="#7c3aed" stroke-width="2"/>
  <text x="705" y="162" text-anchor="middle"><tspan fill="#334155">000010</tspan><tspan fill="#dc2626">11</tspan>b</text>
  <rect x="630" y="178" width="150" height="40" rx="2" fill="#ffffff" stroke="#7c3aed" stroke-width="2"/>
  <text x="705" y="204" text-anchor="middle"><tspan fill="#334155">000011</tspan><tspan fill="#dc2626">11</tspan>b</text>

  <text x="470" y="250" class="title">高位交叉编址（高位选体）：每体前两位相同</text>
  <text x="135" y="266" class="bank-name" fill="#2563eb">M0</text>
  <rect x="60" y="276" width="150" height="40" rx="2" fill="#ffffff" stroke="#2563eb" stroke-width="2"/>
  <text x="135" y="302" text-anchor="middle"><tspan fill="#dc2626">00</tspan><tspan fill="#334155">000000</tspan>b</text>
  <rect x="60" y="318" width="150" height="40" rx="2" fill="#ffffff" stroke="#2563eb" stroke-width="2"/>
  <text x="135" y="344" text-anchor="middle"><tspan fill="#dc2626">00</tspan><tspan fill="#334155">000001</tspan>b</text>
  <rect x="60" y="360" width="150" height="40" rx="2" fill="#ffffff" stroke="#2563eb" stroke-width="2"/>
  <text x="135" y="386" text-anchor="middle"><tspan fill="#dc2626">00</tspan><tspan fill="#334155">000010</tspan>b</text>
  <rect x="60" y="402" width="150" height="40" rx="2" fill="#ffffff" stroke="#2563eb" stroke-width="2"/>
  <text x="135" y="428" text-anchor="middle"><tspan fill="#dc2626">00</tspan><tspan fill="#334155">000011</tspan>b</text>
  <text x="325" y="266" class="bank-name" fill="#059669">M1</text>
  <rect x="250" y="276" width="150" height="40" rx="2" fill="#ffffff" stroke="#059669" stroke-width="2"/>
  <text x="325" y="302" text-anchor="middle"><tspan fill="#dc2626">01</tspan><tspan fill="#334155">000000</tspan>b</text>
  <rect x="250" y="318" width="150" height="40" rx="2" fill="#ffffff" stroke="#059669" stroke-width="2"/>
  <text x="325" y="344" text-anchor="middle"><tspan fill="#dc2626">01</tspan><tspan fill="#334155">000001</tspan>b</text>
  <rect x="250" y="360" width="150" height="40" rx="2" fill="#ffffff" stroke="#059669" stroke-width="2"/>
  <text x="325" y="386" text-anchor="middle"><tspan fill="#dc2626">01</tspan><tspan fill="#334155">000010</tspan>b</text>
  <rect x="250" y="402" width="150" height="40" rx="2" fill="#ffffff" stroke="#059669" stroke-width="2"/>
  <text x="325" y="428" text-anchor="middle"><tspan fill="#dc2626">01</tspan><tspan fill="#334155">000011</tspan>b</text>
  <text x="515" y="266" class="bank-name" fill="#d97706">M2</text>
  <rect x="440" y="276" width="150" height="40" rx="2" fill="#ffffff" stroke="#d97706" stroke-width="2"/>
  <text x="515" y="302" text-anchor="middle"><tspan fill="#dc2626">10</tspan><tspan fill="#334155">000000</tspan>b</text>
  <rect x="440" y="318" width="150" height="40" rx="2" fill="#ffffff" stroke="#d97706" stroke-width="2"/>
  <text x="515" y="344" text-anchor="middle"><tspan fill="#dc2626">10</tspan><tspan fill="#334155">000001</tspan>b</text>
  <rect x="440" y="360" width="150" height="40" rx="2" fill="#ffffff" stroke="#d97706" stroke-width="2"/>
  <text x="515" y="386" text-anchor="middle"><tspan fill="#dc2626">10</tspan><tspan fill="#334155">000010</tspan>b</text>
  <rect x="440" y="402" width="150" height="40" rx="2" fill="#ffffff" stroke="#d97706" stroke-width="2"/>
  <text x="515" y="428" text-anchor="middle"><tspan fill="#dc2626">10</tspan><tspan fill="#334155">000011</tspan>b</text>
  <text x="705" y="266" class="bank-name" fill="#7c3aed">M3</text>
  <rect x="630" y="276" width="150" height="40" rx="2" fill="#ffffff" stroke="#7c3aed" stroke-width="2"/>
  <text x="705" y="302" text-anchor="middle"><tspan fill="#dc2626">11</tspan><tspan fill="#334155">000000</tspan>b</text>
  <rect x="630" y="318" width="150" height="40" rx="2" fill="#ffffff" stroke="#7c3aed" stroke-width="2"/>
  <text x="705" y="344" text-anchor="middle"><tspan fill="#dc2626">11</tspan><tspan fill="#334155">000001</tspan>b</text>
  <rect x="630" y="360" width="150" height="40" rx="2" fill="#ffffff" stroke="#7c3aed" stroke-width="2"/>
  <text x="705" y="386" text-anchor="middle"><tspan fill="#dc2626">11</tspan><tspan fill="#334155">000010</tspan>b</text>
  <rect x="630" y="402" width="150" height="40" rx="2" fill="#ffffff" stroke="#7c3aed" stroke-width="2"/>
  <text x="705" y="428" text-anchor="middle"><tspan fill="#dc2626">11</tspan><tspan fill="#334155">000011</tspan>b</text>
</svg>`,
        },
        {
          id: 'kb-co-memory-hierarchy-3-6',
          type: 'paragraph',
          text: '交叉编址把主存分成若干个存储体并行工作，这里取 4 个体。$2^2 = 4$，所以**选体需要 2 位二进制**。\n\n**低位交叉**（低位选体）：用地址的**最低 2 位**选体。图中每个体的地址后 2 位都相同：体 0 后两位都是 00、体 1 都是 01、体 2 都是 10、体 3 都是 11。这样**相邻地址**（间隔 1）落在不同的体，连续访存可以交给多个体并行交替处理，提高带宽。\n\n**高位交叉**（高位选体）：用地址的**最高 2 位**选体。图中每个体的地址前 2 位都相同：体 0 前两位都是 00、体 1 都是 01、体 2 都是 10、体 3 都是 11。这样**连续的一段地址**落在同一个体，多体只能串行工作，无法提升带宽，也叫高位连续编址。',
        },
        {
          id: 'kb-co-memory-hierarchy-3-7',
          type: 'html',
          html: `<svg viewBox="0 0 900 236" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { font-family: 'JetBrains Mono', 'Courier New', monospace; }
    .t { font-size: 15px; font-weight: 700; fill: #1e293b; text-anchor: middle; font-family: system-ui, sans-serif; }
    .b { font-size: 12px; fill: #475569; text-anchor: middle; font-family: system-ui, sans-serif; }
    .chip { font-size: 12px; font-weight: 700; text-anchor: middle; font-family: system-ui, sans-serif; }
  </style>
  <text x="450" y="24" class="t">低位交叉：一次访存同时读出 8 个体的数据（8B = 64bit）</text>
  <text x="100.0" y="42" class="chip" fill="#2563eb">体0</text>
  <rect x="60" y="52" width="80" height="50" rx="3" fill="#ffffff" stroke="#2563eb" stroke-width="2"/>
  <text x="100.0" y="74" text-anchor="middle"><tspan font-size="13" fill="#334155">00000</tspan><tspan font-size="13" fill="#dc2626">000</tspan></text>
  <text x="100.0" y="92" text-anchor="middle" font-size="9" fill="#94a3b8">体号=0</text>
  <text x="180.0" y="42" class="chip" fill="#059669">体1</text>
  <rect x="140" y="52" width="80" height="50" rx="3" fill="#ffffff" stroke="#059669" stroke-width="2"/>
  <text x="180.0" y="74" text-anchor="middle"><tspan font-size="13" fill="#334155">00000</tspan><tspan font-size="13" fill="#dc2626">001</tspan></text>
  <text x="180.0" y="92" text-anchor="middle" font-size="9" fill="#94a3b8">体号=1</text>
  <text x="260.0" y="42" class="chip" fill="#d97706">体2</text>
  <rect x="220" y="52" width="80" height="50" rx="3" fill="#ffffff" stroke="#d97706" stroke-width="2"/>
  <text x="260.0" y="74" text-anchor="middle"><tspan font-size="13" fill="#334155">00000</tspan><tspan font-size="13" fill="#dc2626">010</tspan></text>
  <text x="260.0" y="92" text-anchor="middle" font-size="9" fill="#94a3b8">体号=2</text>
  <text x="340.0" y="42" class="chip" fill="#7c3aed">体3</text>
  <rect x="300" y="52" width="80" height="50" rx="3" fill="#ffffff" stroke="#7c3aed" stroke-width="2"/>
  <text x="340.0" y="74" text-anchor="middle"><tspan font-size="13" fill="#334155">00000</tspan><tspan font-size="13" fill="#dc2626">011</tspan></text>
  <text x="340.0" y="92" text-anchor="middle" font-size="9" fill="#94a3b8">体号=3</text>
  <text x="420.0" y="42" class="chip" fill="#0891b2">体4</text>
  <rect x="380" y="52" width="80" height="50" rx="3" fill="#ffffff" stroke="#0891b2" stroke-width="2"/>
  <text x="420.0" y="74" text-anchor="middle"><tspan font-size="13" fill="#334155">00000</tspan><tspan font-size="13" fill="#dc2626">100</tspan></text>
  <text x="420.0" y="92" text-anchor="middle" font-size="9" fill="#94a3b8">体号=4</text>
  <text x="500.0" y="42" class="chip" fill="#dc2626">体5</text>
  <rect x="460" y="52" width="80" height="50" rx="3" fill="#ffffff" stroke="#dc2626" stroke-width="2"/>
  <text x="500.0" y="74" text-anchor="middle"><tspan font-size="13" fill="#334155">00000</tspan><tspan font-size="13" fill="#dc2626">101</tspan></text>
  <text x="500.0" y="92" text-anchor="middle" font-size="9" fill="#94a3b8">体号=5</text>
  <text x="580.0" y="42" class="chip" fill="#65a30d">体6</text>
  <rect x="540" y="52" width="80" height="50" rx="3" fill="#ffffff" stroke="#65a30d" stroke-width="2"/>
  <text x="580.0" y="74" text-anchor="middle"><tspan font-size="13" fill="#334155">00000</tspan><tspan font-size="13" fill="#dc2626">110</tspan></text>
  <text x="580.0" y="92" text-anchor="middle" font-size="9" fill="#94a3b8">体号=6</text>
  <text x="660.0" y="42" class="chip" fill="#9333ea">体7</text>
  <rect x="620" y="52" width="80" height="50" rx="3" fill="#ffffff" stroke="#9333ea" stroke-width="2"/>
  <text x="660.0" y="74" text-anchor="middle"><tspan font-size="13" fill="#334155">00000</tspan><tspan font-size="13" fill="#dc2626">111</tspan></text>
  <text x="660.0" y="92" text-anchor="middle" font-size="9" fill="#94a3b8">体号=7</text>
  <line x1="60" y1="126" x2="700" y2="126" stroke="#334155" stroke-width="3"/>
  <text x="380" y="146" class="b">64bit 存储器总线（8 字节宽）</text>
  <text x="450" y="170" class="b">连续 8 个字节地址 00000000b~00000111b，低 3 位各不相同，正好落进 8 个不同体</text>
  <text x="450" y="192" class="b">一次访存 8 个芯片同时各输出 1 字节 → 并行凑成 8B</text>
  <text x="450" y="214" class="b">若只有一个体，一次只能读 1 字节要读 8 次；低位交叉 8 体一次并行完成</text>
</svg>`,
        },
        {
          id: 'kb-co-memory-hierarchy-3-8',
          type: 'paragraph',
          text: String.raw`**例题**：用 8 个 64M×8bit 的 DRAM 芯片按交叉编址方式构成主存储器，并与宽度为 64bit 的存储器总线相连。主存每次最多读写 64bit，按字节编址。问下列地址中，与主存地址 \`0018 001DH\` 位于同一芯片中的是（ ）。

**解**：把每个 DRAM 芯片看成一个一维数组，8 个芯片就是 8 个并行的数组。低位交叉编址下，**字节地址的低 3 位 = 芯片号**（体号；$2^3 = 8$，8 个体需要 3 位选体）。

目标地址 \`0018 001DH\` 的末位 D = \`1101B\`，**最低 3 位 = \`101B\` = 5**，所以它在芯片 5。

逐项看低 3 位：

- A \`0000 01D5H\`：末位 5 = \`0101B\`，低 3 位 \`101\` = 5，同一芯片。
- B：末位 0，低 3 位 000（体 0）。
- C：末位 E，低 3 位 110（体 6）。
- D：末位 4，低 3 位 100（体 4）。

所以答案是 **A**（0000 01D5H）。`,
        },
      ],
    },
  ],
}
