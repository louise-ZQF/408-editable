import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'
import { twoWaySetAssociativeCacheAnimation } from '@/animations/computer-organization/cache/two-way-set-associative-cache'

export const coCacheBasicsArticle: KnowledgeArticleData = {
  pointId: 'co-cache-basics',
  subpoints: [
    {
      id: 'co-cache-locality',
      title: '时间局部性原理与空间局部性原理',
      blocks: [
        {
          id: 'kb-co-cache-locality-1',
          type: 'paragraph',
          text: '**Cache** 是位于 CPU 与主存之间的高速小容量存储器，保存主存中部分内容的副本。\n\nCPU 访问数据时先查 Cache：命中就直接使用；未命中才访问主存，并把所在主存块调入 Cache。',
        },
        {
          id: 'kb-co-cache-locality-2',
          type: 'paragraph',
          text: 'Cache 能加速依赖**局部性原理**。**时间局部性**指刚访问过的数据很可能很快再被访问，常见于循环中的计数器和频繁读取的变量。',
        },
        {
          id: 'kb-co-cache-locality-3',
          type: 'paragraph',
          text: '**空间局部性**指访问某个数据后，其附近的数据也很快会被访问，常见于数组等连续存储结构的遍历。',
        },
      ],
    },
    {
      id: 'co-cache-concepts',
      title: 'Cache行',
      blocks: [
        {
          id: 'kb-co-cache-concepts-1',
          type: 'paragraph',
          text: '**缓存块**（Cache block）是 Cache 与主存交换数据的基本单元。\n\n**主存块**是主存中与缓存块大小一致的存储区域，主存与 Cache 之间的数据置换以块为单位。',
        },
        {
          id: 'kb-co-cache-concepts-2',
          type: 'paragraph',
          text: '**Cache 行**（Cache line）包含标记字段和主存块。\n\n**块内偏移**是数据在块内的位置，找到块后用它定位具体字节。',
        },
        {
          id: 'kb-co-cache-concepts-3',
          type: 'paragraph',
          text: '**块大小**决定块内偏移的位数。例如块大小为 1KB，则 $1KB = 2^{10}$，块内偏移占 10 位。典型缓存块大小是 32、64、128 字节。',
        },
        {
          id: 'kb-co-cache-structure-5',
          type: 'html',
          html: `<svg viewBox="0 0 820 150" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { font-family: system-ui, sans-serif; }
    .t { font-size: 15px; font-weight: 700; fill: #1e293b; text-anchor: middle; }
    .seg { font-size: 14px; font-weight: 700; text-anchor: middle; }
  </style>
  <text x="410" y="24" class="t">一条 Cache 行的组成</text>

  <rect x="60" y="50" width="220" height="56" rx="4" fill="#2563eb"/>
  <text x="170" y="82" class="seg" fill="#ffffff">标记字段</text>

  <rect x="290" y="50" width="470" height="56" rx="4" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>
  <text x="525" y="82" class="seg" fill="#15803d">主存块</text>
</svg>`,
        },
        {
          id: 'kb-co-cache-concepts-4',
          type: 'callout',
          title: '与页式存储的类比',
          text: 'Cache 块与主存块的对应关系类似页式存储中的页与页框：主存和 Cache 按块对应，置换以块为基本单位。',
          tone: 'blue',
        },
      ],
    },
    {
      id: 'co-cache-structure',
      title: 'Cache 的标记字段',
      blocks: [
        {
          id: 'kb-co-cache-structure-1',
          type: 'paragraph',
          text: 'Cache 存储内容分**数据**和**标记字段**两部分。',
        },
        {
          id: 'kb-co-cache-structure-2',
          type: 'paragraph',
          text: '标记字段包括：\n\n- **有效位**（valid）：标识该行是否存有有效数据。\n- **脏位**（dirty）：标识该块是否被修改过。\n- **替换位**（reference）：记录访问信息，服务于替换算法。\n- **标记**（tag）：与地址中的 tag 比较，判断是否命中。',
        },
      ],
    },
    {
      id: 'co-cache-address',
      title: 'Cache 的地址结构',
      blocks: [
        {
          id: 'kb-co-cache-address-1',
          type: 'paragraph',
          text: '给定**物理地址**访问 Cache，地址划分为三部分：**标记（tag）、块匹配字段、块内地址**。',
        },
        {
          id: 'kb-co-cache-address-2',
          type: 'paragraph',
          text: String.raw`**块内地址**确定数据在块内的偏移，位数 = $\log_2(\text{块大小})$，只用于块内寻址，与映射方式无关。`,
        },
        {
          id: 'kb-co-cache-address-3',
          type: 'paragraph',
          text: String.raw`**组号**（index）用于缩小搜索范围：

- 直接映射：组号就是 cache 块号，位数 = $\log_2(\text{cache 块数})$。
- 组相联：位数 = $\log_2(\text{cache 组数})$。
- 全相联：没有该字段，位数为 0。`,
        },
        {
          id: 'kb-co-cache-address-4',
          type: 'paragraph',
          text: '**标记**（tag）用于在候选块中判断是否真正命中，位数 = 物理地址位数 − 组号位数 − 偏移位数。\n\n**访存方法**分三步：\n\n1. 用组号找到组。\n2. 组内比较 tag。\n3. 用块内偏移取出数据。',
        },
        {
          id: 'kb-co-cache-address-6',
          type: 'html',
          html: `<svg viewBox="0 0 820 260" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { font-family: system-ui, sans-serif; }
    .title { font-size: 18px; font-weight: 700; fill: #1e293b; text-anchor: middle; }
    .seg { font-size: 16px; font-weight: 700; fill: #ffffff; text-anchor: middle; }
    .bits { font-size: 14px; font-weight: 700; fill: #1e293b; text-anchor: middle; }
    .note { font-size: 14px; fill: #334155; text-anchor: middle; }
  </style>
  <text x="410" y="24" class="title">Cache 地址结构（32 位物理地址，组相联示例）</text>
  <rect x="90" y="56" width="300" height="46" rx="4" fill="#2563eb"/>
  <text x="240" y="83" class="seg">Tag 标记</text>
  <rect x="390" y="56" width="220" height="46" rx="4" fill="#059669"/>
  <text x="500" y="83" class="seg">Index 组号</text>
  <rect x="610" y="56" width="120" height="46" rx="4" fill="#d97706"/>
  <text x="670" y="83" class="seg">Offset 偏移</text>

  <text x="240" y="126" class="bits">15 位</text>
  <text x="500" y="126" class="bits">11 位</text>
  <text x="670" y="126" class="bits">6 位</text>

  <text x="240" y="148" class="note">组内比较，判断命中</text>
  <text x="500" y="148" class="note">定位到某一组</text>
  <text x="670" y="148" class="note">块内取数据</text>

</svg>`,
        },
        {
          id: 'kb-co-cache-address-5',
          type: 'callout',
          title: 'tag 位数计算方法',
          text: '块内偏移和块号（index组号）位数可由 Cache 参数直接算出，tag 位数需要用物理地址位数减去其他两部分。',
          tone: 'orange',
        },
      ],
    },
    {
      id: 'co-cache-mapping',
      title: 'Cache 的映射方式',
      blocks: [
        {
          id: 'kb-co-cache-mapping-1',
          type: 'paragraph',
          text: 'Cache 容量远小于主存，主存中任意块都可能被调入 Cache。**映射方式**决定一个主存块能放到 Cache 的哪些位置，本质是在命中率、访问速度、硬件复杂度之间权衡。',
        },
        {
          id: 'kb-co-cache-mapping-2',
          type: 'paragraph',
          text: String.raw`**直接映射**：每个主存块只能映射到 Cache 中唯一一个块。块号 $k$ 的主存块映射到第 $k \bmod M$ 个缓存块，其中 $M$ 为缓存总块数。`,
        },
        {
          id: 'kb-co-cache-mapping-3',
          type: 'paragraph',
          text: '**全相联映射**：主存块可映射到 Cache 中任意一个块。命中率高，但访问时需并行比较所有块的标记，比较器多、硬件复杂、速度慢。',
        },
        {
          id: 'kb-co-cache-mapping-4',
          type: 'paragraph',
          text: String.raw`**组相联映射**：把缓存块分成若干组，主存块只能映射到某一组内的任意一个块。$N$ 路组相联表示每组有 $N$ 个缓存块，块号 $k$ 映射到第 $k \bmod (M / N)$ 组。`,
        },
        {
          id: 'kb-co-cache-mapping-6',
          type: 'paragraph',
          text: '| 映射方式 | 比较器个数 | 需要选择器 | 硬件复杂度 | 命中率 |\n|----------|-----------|-----------|-----------|--------|\n| 直接映射 | 1 | 否 | 低 | 低 |\n| 组相联（n 路） | n | 是 | 中 | 中 |\n| 全相联 | Cache 行数 | 是 | 高 | 高 |',
        },
        {
          id: 'kb-co-cache-mapping-11',
          type: 'paragraph',
          text: '下面是一个**二路组相联**的 Cache 电路图：每组包含 2 路，访问时需要 2 个与门和 2 个比较器并行判断。\n\n若是**全相联**，在这个例子里等价于 16 路组相联，每组比较 16 行，需要 16 个比较器，复杂度非常高。',
        },
        {
          id: 'kb-co-cache-mapping-10',
          type: 'animation',
          animation: twoWaySetAssociativeCacheAnimation,
        },
      ],
    },
  ],
}
