import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const ds7_4BlockSearchArticle: KnowledgeArticleData = {
  pointId: 'ds-7-4-block-search',
  subpoints: [
    {
      id: 'ds-7-4-s1',
      title: '分块查找的思想与结构',
      blocks: [
        {
          id: 'kb-ds-7-4-1',
          type: 'paragraph',
          text: '**分块查找（索引顺序查找）**把查找表分成若干**块**，块内元素**无序**，但**块间有序**。',
        },
        {
          id: 'kb-ds-7-4-2',
          type: 'paragraph',
          text: '分块查找分两步：先在**索引表**上确定关键字的所在块，再到该**块内**顺序查找。索引表本身按块的最大关键字**有序**，可以用折半查找优化；ASL（平均查找长度）推导按顺序查找计。',
        },
        {
          id: 'kb-ds-7-4-12',
          type: 'html',
          html: `<svg viewBox="0 0 620 540" xmlns="http://www.w3.org/2000/svg" style="display:block;width:min(100%,620px);height:auto;margin-inline:auto">
  <style>
    text { font-family: system-ui, sans-serif; }
    .title { font-size: 22px; font-weight: 700; fill: #0f172a; text-anchor: middle; }
    .lbl   { font-size: 15px; fill: #475569; text-anchor: middle; }
    .idx   { font-size: 20px; font-weight: 700; fill: #1e40af; text-anchor: middle; }
    .el    { font-size: 16px; fill: #334155; text-anchor: middle; }
    .hl    { font-size: 16px; font-weight: 700; fill: #ffffff; text-anchor: middle; }
    .blk   { font-size: 15px; font-weight: 700; fill: #475569; }
    .step  { font-size: 15px; fill: #0f172a; text-anchor: middle; }
  </style>

  <defs>
    <marker id="bsArr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#334155"/>
    </marker>
  </defs>

  <text x="310" y="28" class="title">分块查找：先索引表定位块，再块内顺序查找</text>

  <text x="150" y="54" class="lbl">索引表（有序）</text>
  <text x="425" y="54" class="lbl">查找表（块内无序）</text>

  <rect x="110" y="70" width="80" height="40" fill="#dbeafe" stroke="#93c5fd"/>
  <rect x="110" y="110" width="80" height="40" fill="#dbeafe" stroke="#93c5fd"/>
  <rect x="110" y="150" width="80" height="40" fill="#dbeafe" stroke="#93c5fd"/>
  <text x="150" y="96" class="idx">22</text>
  <text x="150" y="136" class="idx">48</text>
  <text x="150" y="176" class="idx">86</text>

  <line x1="190" y1="90" x2="372" y2="83" stroke="#334155" stroke-width="1.6" marker-end="url(#bsArr)"/>
  <line x1="190" y1="130" x2="372" y2="213" stroke="#334155" stroke-width="1.6" marker-end="url(#bsArr)"/>
  <line x1="190" y1="170" x2="372" y2="343" stroke="#334155" stroke-width="1.6" marker-end="url(#bsArr)"/>

  <rect x="380" y="70" width="90" height="26" fill="#f1f5f9" stroke="#94a3b8"/>
  <rect x="380" y="96" width="90" height="26" fill="#f1f5f9" stroke="#94a3b8"/>
  <rect x="380" y="122" width="90" height="26" fill="#f1f5f9" stroke="#94a3b8"/>
  <rect x="380" y="148" width="90" height="26" fill="#f1f5f9" stroke="#94a3b8"/>
  <rect x="380" y="174" width="90" height="26" fill="#f1f5f9" stroke="#94a3b8"/>
  <rect x="380" y="200" width="90" height="26" fill="#f1f5f9" stroke="#94a3b8"/>
  <rect x="380" y="226" width="90" height="26" fill="#f1f5f9" stroke="#94a3b8"/>
  <rect x="380" y="252" width="90" height="26" fill="#f59e0b" stroke="#94a3b8"/>
  <rect x="380" y="278" width="90" height="26" fill="#f1f5f9" stroke="#94a3b8"/>
  <rect x="380" y="304" width="90" height="26" fill="#f1f5f9" stroke="#94a3b8"/>
  <rect x="380" y="330" width="90" height="26" fill="#f1f5f9" stroke="#94a3b8"/>
  <rect x="380" y="356" width="90" height="26" fill="#f1f5f9" stroke="#94a3b8"/>
  <rect x="380" y="382" width="90" height="26" fill="#f1f5f9" stroke="#94a3b8"/>
  <rect x="380" y="408" width="90" height="26" fill="#f1f5f9" stroke="#94a3b8"/>
  <rect x="380" y="434" width="90" height="26" fill="#f1f5f9" stroke="#94a3b8"/>

  <line x1="380" y1="200" x2="470" y2="200" stroke="#0f172a" stroke-width="3"/>
  <line x1="380" y1="330" x2="470" y2="330" stroke="#0f172a" stroke-width="3"/>

  <text x="425" y="89" class="el">12</text>
  <text x="425" y="115" class="el">8</text>
  <text x="425" y="141" class="el">22</text>
  <text x="425" y="167" class="el">13</text>
  <text x="425" y="193" class="el">9</text>
  <text x="425" y="219" class="el">33</text>
  <text x="425" y="245" class="el">42</text>
  <text x="425" y="271" class="hl">38</text>
  <text x="425" y="297" class="el">24</text>
  <text x="425" y="323" class="el">48</text>
  <text x="425" y="349" class="el">58</text>
  <text x="425" y="375" class="el">86</text>
  <text x="425" y="401" class="el">60</text>
  <text x="425" y="427" class="el">49</text>
  <text x="425" y="453" class="el">74</text>

  <text x="480" y="140" class="blk">第 1 块</text>
  <text x="480" y="270" class="blk">第 2 块</text>
  <text x="480" y="400" class="blk">第 3 块</text>

  <text x="310" y="480" class="step">目标：查找 38</text>
  <text x="310" y="502" class="step">① 查索引表：38 与 22 比，大；再与 48 比，小，落入第 2 块</text>
  <text x="310" y="524" class="step">② 第 2 块内顺序查找：33 → 42 → 38，命中</text>
</svg>`,
        },
        {
          id: 'kb-ds-7-4-3',
          type: 'paragraph',
          text: '索引表在内存中占额外空间，但规模通常远小于数据表，且能大幅缩小顺序查找的扫描范围。它体现了"**索引存储**"把查找范围分层缩小的思想。',
        },
        {
          id: 'kb-ds-7-4-4',
          type: 'callout',
          title: '块内无序、块间有序',
          text: '分块查找的两个"序"要分清楚：每个块内部元素无序，块与块之间按最大关键字递增有序。查找先走索引表（有序）定位块，再进块内（无序）顺序扫。',
          tone: 'orange',
        },
      ],
    },
    {
      id: 'ds-7-4-s2',
      title: '分块查找的最优情况',
      blocks: [
        {
          id: 'kb-ds-7-4-9',
          type: 'paragraph',
          text: String.raw`最优情况：当块数等于块内元素数（$b = s = \sqrt{n}$）时平均比较次数最少。对 $n$ 个元素均匀分为 $\sqrt{n}$ 块、每块 $\sqrt{n}$ 个。

简单推导：把 $n$ 个元素分成 $b$ 块、每块 $s$ 个，$n = b \cdot s$。先在索引表的 $b$ 个块里顺序定位，平均比较 $\frac{b+1}{2}$ 次；再在块内 $s$ 个元素里顺序查找，平均比较 $\frac{s+1}{2}$ 次。总平均比较次数为 $\frac{b+1}{2}+\frac{s+1}{2}=\frac{b+s}{2}+1$。$n$ 固定时 $b \cdot s$ 固定，$b$ 与 $s$ 越接近则 $b+s$ 越小，故 $b = s = \sqrt{n}$ 时总平均比较次数最少。`,
        },
      ],
    },
  ],
}
