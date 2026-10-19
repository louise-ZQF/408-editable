import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'
import {
  loserTreeAnimation,
  replacementSelectionAnimation,
} from '@/animations/data-structures/sorting/sorting-animations'

export const ds8_8ExternalSortArticle: KnowledgeArticleData = {
  pointId: 'ds-8-8-external-sort',
  subpoints: [
    {
      id: 'ds-8-8-s1',
      title: '外部排序的思想',
      blocks: [
        {
          id: 'kb-ds-8-8-1-1',
          type: 'paragraph',
          text: '**外部排序**处理数据量超过内存的序列：\n\n1. 先把文件分成若干能装入内存的**归并段**，用内部排序（如归并）把每段排好写回外存。\n2. 再把这几个有序段用**多路归并**合并成更大的有序段，直到全部合成一个。',
        },
        {
          id: 'kb-ds-8-8-1-5',
          type: 'html',
          html: `<svg viewBox="0 0 760 340" xmlns="http://www.w3.org/2000/svg" style="display:block;width:min(100%,760px);height:auto;margin-inline:auto">
  <style>
    text { font-family: system-ui, sans-serif; }
    .title { font-size: 20px; font-weight: 700; fill: #0f172a; text-anchor: middle; }
    .lbl   { font-size: 14px; font-weight: 700; fill: #475569; text-anchor: middle; }
    .seg   { font-size: 15px; font-weight: 700; fill: #1e3a8a; text-anchor: middle; }
    .raw   { font-size: 14px; font-weight: 700; fill: #334155; text-anchor: middle; }
    .out   { font-size: 16px; font-weight: 700; fill: #ffffff; text-anchor: middle; }
    .cap   { font-size: 13px; fill: #64748b; text-anchor: middle; }
    .note  { font-size: 13px; fill: #b45309; text-anchor: middle; font-weight: 700; }
  </style>

  <text x="380" y="24" class="title">外部排序：分块排序 + 多路归并</text>

  <!-- 阶段标签 -->
  <text x="95" y="56" class="lbl">外存原始文件</text>
  <text x="380" y="56" class="lbl">段内排序（内存）</text>
  <text x="665" y="56" class="lbl">归并后有序文件</text>

  <!-- 左：原始无序文件 -->
  <rect x="25" y="76" width="140" height="120" rx="8" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.5"/>
  <text x="95" y="104" class="raw">15 24 5</text>
  <text x="95" y="128" class="raw">9 31 8</text>
  <text x="95" y="152" class="raw">20 1 46</text>
  <text x="95" y="176" class="raw">32 78 4</text>

  <!-- 中间：4 个归并段 -->
  <rect x="300" y="76" width="160" height="26" rx="5" fill="#dbeafe"/>
  <text x="380" y="93" class="seg">段1：5 15 24</text>
  <rect x="300" y="110" width="160" height="26" rx="5" fill="#dbeafe"/>
  <text x="380" y="127" class="seg">段2：8 9 31</text>
  <rect x="300" y="144" width="160" height="26" rx="5" fill="#dbeafe"/>
  <text x="380" y="161" class="seg">段3：1 20 46</text>
  <rect x="300" y="178" width="160" height="26" rx="5" fill="#dbeafe"/>
  <text x="380" y="195" class="seg">段4：4 32 78</text>

  <!-- 右：归并结果 -->
  <rect x="600" y="120" width="130" height="40" rx="6" fill="#059669"/>
  <text x="665" y="145" class="out">1 4 5 8 9</text>
  <text x="665" y="165" class="note">…15 20 24 31 32 46 78</text>

  <!-- 箭头：原始 → 各段 -->
  <g stroke="#475569" stroke-width="1.8" fill="none">
    <line x1="165" y1="92" x2="296" y2="92"/>
    <line x1="165" y1="112" x2="296" y2="123"/>
    <line x1="165" y1="132" x2="296" y2="157"/>
    <line x1="165" y1="152" x2="296" y2="191"/>
  </g>

  <!-- 箭头：各段 → 归并 -->
  <g stroke="#059669" stroke-width="2" fill="none">
    <line x1="460" y1="92" x2="596" y2="130"/>
    <line x1="460" y1="123" x2="596" y2="138"/>
    <line x1="460" y1="157" x2="596" y2="146"/>
    <line x1="460" y1="191" x2="596" y2="154"/>
  </g>

  <text x="380" y="236" class="note">每段都小到能装进内存，段内用内部排序排好，写回外存</text>
  <text x="380" y="262" class="note">多路归并把 m 个有序段合成更长的段，一趟段数约变为 m/k</text>
  <text x="380" y="288" class="cap">段内排序在内存做，段与段的合并靠外存读写——外存 I/O 次数是主要开销</text>
  <text x="380" y="314" class="cap">减少趟数：增大归并路数 k，或减少初始段数 m（置换-选择生成更长的段）</text>
</svg>`,
        },
        {
          id: 'kb-ds-8-8-1-2',
          type: 'paragraph',
          text: String.raw`时间开销主要来自外存的读写次数。**每趟归并都要把每个数据读入再写出**，因此减少归并趟数是最要紧的优化点。归并趟数 $S$ 与初始归并段数 $m$、归并路数 $k$ 的关系：一趟把 $m$ 个段合并为 $m/k$ 个，需 $\log_k m$ 趟。`,
        },
        {
          id: 'kb-ds-8-8-1-6',
          type: 'html',
          html: `<svg viewBox="0 0 920 500" xmlns="http://www.w3.org/2000/svg" style="display:block;width:min(100%,920px);height:auto;margin-inline:auto">
  <style>
    text { font-family: system-ui, sans-serif; }
    .title { font-size: 20px; font-weight: 700; fill: #0f172a; text-anchor: middle; }
    .tag   { font-size: 13px; font-weight: 700; fill: #475569; }
    .seg   { font-size: 14px; font-weight: 700; fill: #ffffff; text-anchor: middle; }
    .stat  { font-size: 15px; font-weight: 700; fill: #b45309; text-anchor: middle; }
    .note  { font-size: 14px; fill: #475569; text-anchor: middle; }
  </style>

  <text x="460" y="26" class="title">例：8 个初始归并段，2 路归并，每趟读写 50 次</text>

  <!-- 左侧趟次标签 -->
  <text x="16" y="82" class="tag" text-anchor="start">初始 8 段</text>
  <text x="16" y="168" class="tag" text-anchor="start">第1趟 → 4 段</text>
  <text x="16" y="254" class="tag" text-anchor="start">第2趟 → 2 段</text>
  <text x="16" y="340" class="tag" text-anchor="start">第3趟 → 1 段</text>

  <!-- 连线：层0 → 层1 -->
  <g stroke="#94a3b8" stroke-width="1.4" fill="none">
    <line x1="194" y1="92" x2="232" y2="150"/><line x1="270" y1="92" x2="232" y2="150"/>
    <line x1="346" y1="92" x2="384" y2="150"/><line x1="422" y1="92" x2="384" y2="150"/>
    <line x1="498" y1="92" x2="536" y2="150"/><line x1="574" y1="92" x2="536" y2="150"/>
    <line x1="650" y1="92" x2="688" y2="150"/><line x1="726" y1="92" x2="688" y2="150"/>
    <!-- 连线：层1 → 层2 -->
    <line x1="232" y1="178" x2="308" y2="236"/><line x1="384" y1="178" x2="308" y2="236"/>
    <line x1="536" y1="178" x2="612" y2="236"/><line x1="688" y1="178" x2="612" y2="236"/>
    <!-- 连线：层2 → 层3 -->
    <line x1="308" y1="264" x2="460" y2="322"/><line x1="612" y1="264" x2="460" y2="322"/>
  </g>

  <!-- 层0：初始 8 段 -->
  <g>
    <rect x="162" y="64" width="64" height="28" rx="5" fill="#64748b"/><text x="194" y="82" class="seg">S1</text>
    <rect x="238" y="64" width="64" height="28" rx="5" fill="#64748b"/><text x="270" y="82" class="seg">S2</text>
    <rect x="314" y="64" width="64" height="28" rx="5" fill="#64748b"/><text x="346" y="82" class="seg">S3</text>
    <rect x="390" y="64" width="64" height="28" rx="5" fill="#64748b"/><text x="422" y="82" class="seg">S4</text>
    <rect x="466" y="64" width="64" height="28" rx="5" fill="#64748b"/><text x="498" y="82" class="seg">S5</text>
    <rect x="542" y="64" width="64" height="28" rx="5" fill="#64748b"/><text x="574" y="82" class="seg">S6</text>
    <rect x="618" y="64" width="64" height="28" rx="5" fill="#64748b"/><text x="650" y="82" class="seg">S7</text>
    <rect x="694" y="64" width="64" height="28" rx="5" fill="#64748b"/><text x="726" y="82" class="seg">S8</text>
  </g>

  <!-- 层1：4 段 -->
  <g>
    <rect x="200" y="150" width="64" height="28" rx="5" fill="#3b82f6"/><text x="232" y="168" class="seg">1,2</text>
    <rect x="352" y="150" width="64" height="28" rx="5" fill="#3b82f6"/><text x="384" y="168" class="seg">3,4</text>
    <rect x="504" y="150" width="64" height="28" rx="5" fill="#3b82f6"/><text x="536" y="168" class="seg">5,6</text>
    <rect x="656" y="150" width="64" height="28" rx="5" fill="#3b82f6"/><text x="688" y="168" class="seg">7,8</text>
  </g>

  <!-- 层2：2 段 -->
  <g>
    <rect x="276" y="236" width="64" height="28" rx="5" fill="#10b981"/><text x="308" y="254" class="seg">1-4</text>
    <rect x="580" y="236" width="64" height="28" rx="5" fill="#10b981"/><text x="612" y="254" class="seg">5-8</text>
  </g>

  <!-- 层3：1 段 -->
  <rect x="428" y="322" width="64" height="28" rx="5" fill="#059669"/><text x="460" y="340" class="seg">1-8</text>

  <text x="460" y="462" class="stat">每趟归并 = 全部数据读一遍 + 写一遍 = 50 次 I/O</text>
  <text x="460" y="486" class="note">2 路归并共 3 趟：3 × 50 = 150 次　｜　4 路归并共 2 趟：2 × 50 = 100 次</text>
</svg>`,
        },
        {
          id: 'kb-ds-8-8-1-3',
          type: 'paragraph',
          text: `减少趟数有两条路：

1. 增大归并**路数 k**：一次合并更多段。
2. 减少初始归并**段数 m**：用置换-选择生成更长的初始段。`,
        },
        {
          id: 'kb-ds-8-8-1-4',
          type: 'callout',
          title: '外部排序的时间瓶颈',
          text: String.raw`外部排序的时间瓶颈是外存读写的次数，归并趟数 $\log_k m$ 越小越好。多路归并和置换-选择都是从这趟数公式出发的优化。`,
          tone: 'blue',
        },
      ],
    },
    {
      id: 'ds-8-8-s2',
      title: '多路归并与败者树',
      blocks: [
        {
          id: 'kb-ds-8-8-2-1',
          type: 'paragraph',
          text: '**多路归并**一次从 $k$ 个有序段中各自取出当前最小元素，比较出 $k$ 个里最小的一个放入结果。每选一个元素就要比较 $k-1$ 次，归并路数越多，比较次数线性增大。',
        },
        {
          id: 'kb-ds-8-8-2-2',
          type: 'paragraph',
          text: String.raw`**败者树**把 $k-1$ 次比较降到 $\log k$ 次：锦标赛淘汰制，每次只和败者树里的胜者比较一次，快速找出 $k$ 个中的最小值。这样能在不明显增加比较开销的前提下增大归并路数。`,
        },
        {
          id: 'kb-ds-8-8-2-3',
          type: 'callout',
          title: '节点存的是段号，不是数据',
          text: '败者树的叶子结点对应各归并段，结点里保存的是段号（段的编号），不是数据元素本身。比较时按段号取出该段当前待比较的元素来比大小，选出最小者后，该段指针后移，再补进下一个元素。',
          tone: 'orange',
        },
        {
          id: 'kb-ds-8-8-2-4',
          type: 'animation',
          animation: loserTreeAnimation,
          sourceImport: {
            path: '@/animations/data-structures/sorting/sorting-animations',
            localName: 'loserTreeAnimation',
            kind: 'named',
          },
        },
      ],
    },
    {
      id: 'ds-8-8-s3',
      title: '置换-选择排序',
      blocks: [
        {
          id: 'kb-ds-8-8-3-1',
          type: 'paragraph',
          text: '**置换-选择排序**用一个能装若干元素的内存**工作区**，边读边生成初始归并段，目标是生成**更长**的初始段，从而减少段数 m。',
        },
        {
          id: 'kb-ds-8-8-3-2',
          type: 'paragraph',
          text: '工作区每次输出其中的最小元素后，从输入补一个新元素：能放入当前段就放入（不小于刚输出的元素），否则留给下一段。重复到当前段无法接收新元素为止，一段完成。这样生成的段可以比内存大小更长。',
        },
        {
          id: 'kb-ds-8-8-3-3',
          type: 'animation',
          animation: replacementSelectionAnimation,
          sourceImport: {
            path: '@/animations/data-structures/sorting/sorting-animations',
            localName: 'replacementSelectionAnimation',
            kind: 'named',
          },
        },
      ],
    },
    {
      id: 'ds-8-8-s4',
      title: '最佳归并树与虚段',
      blocks: [
        {
          id: 'kb-ds-8-8-4-1',
          type: 'paragraph',
          text: '当各归并段**长度不等**时，用带权路径长度最小（类似哈夫曼树）的方法构造**最佳归并树**，让较长的段尽量少参与归并，使总读写次数最少。',
        },
        {
          id: 'kb-ds-8-8-4-2',
          type: 'paragraph',
          text: String.raw`归并树不是满 $k$ 叉树时需要**补充虚段**（权为 0 的段）凑成满 $k$ 叉树。当初始段总数 $m$ 满足 $(m-1) \bmod (k-1) = 0$ 时刚好不补，否则需要补。`,
        },
      ],
    },
  ],
}
