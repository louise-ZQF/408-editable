import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const sramDramArticle: KnowledgeArticleData = {
  pointId: 'co-sram-dram',
  subpoints: [
    {
      id: 'co-sram-intro',
      title: 'SRAM 的简介',
      blocks: [
        {
          id: 'kb-co-memory-hierarchy-2-1',
          type: 'paragraph',
          text: '**半导体随机访问存储器**使用硅材料制造，晶体管是基本器件。\n\n**随机访问**指可通过地址直接访问任意位置，访问时间基本相同，区别于磁带等顺序存储。\n\n半导体 RAM 分 **SRAM 和 DRAM** 两种。',
        },
        {
          id: 'kb-co-memory-hierarchy-2-2',
          type: 'paragraph',
          text: '**SRAM**（静态随机存取存储器）：用触发器（锁存器）构成存储单元，1 bit 需 4 到 6 个晶体管。读出时数据不受破坏，为**非破坏性读出**，**不需要刷新**。速度快、成本高、集成度低，用于 Cache（L1/L2/L3）、寄存器文件及嵌入式高速缓存。',
        },
      ],
    },
    {
      id: 'co-dram-intro',
      title: 'DRAM 的简介',
      blocks: [
        {
          id: 'kb-co-memory-hierarchy-2-3',
          type: 'paragraph',
          text: '**DRAM**（动态随机存储器）：用 1 个晶体管 + 1 个电容（1T1C）构成存储单元。电容电荷会泄漏，读出是**破坏性读出**（读出后需恢复），因此需**周期性刷新**。容量大、成本低、速度较慢，用于主存。',
        },
        {
          id: 'kb-co-memory-hierarchy-2-4',
          type: 'callout',
          title: 'SRAM vs DRAM',
          text: 'SRAM：快、贵、不需刷新、容量小 → 做 Cache；DRAM：慢、便宜、需刷新、容量大 → 做主存。',
          tone: 'orange',
        },
        {
          id: 'kb-co-memory-hierarchy-6-4',
          type: 'paragraph',
          text: '| 特性 | SRAM | DRAM |\n|---|---|---|\n| 存储原理 | 触发器锁存 | 电容存储电荷 |\n| 晶体管 / 位 | 4 到 6 个 | 1 个晶体管 + 1 电容 |\n| 读出方式 | 非破坏性读出 | 破坏性读出，需恢复 |\n| 需刷新 | 否 | 是（约 2ms 内刷一遍） |\n| 速度 | 快 | 慢 |\n| 集成度 / 容量 | 低 | 高 |\n| 成本 | 高 | 低 |\n| 典型用途 | Cache、寄存器文件 | 主存 |',
        },
      ],
    },
    {
      id: 'co-dram-refresh',
      title: 'DRAM 的刷新',
      blocks: [
        {
          id: 'kb-co-memory-hierarchy-6-5',
          type: 'paragraph',
          text: 'DRAM 靠电容存电荷表示 0/1，电荷会随泄漏逐渐流失，因此必须在规定时间内（刷新周期，约 2ms）对每个存储单元重新充一次电，称为**刷新**。DRAM 按**行**组织，刷新也按行进行，一次刷新一行。',
        },
        {
          id: 'kb-co-memory-hierarchy-6-6',
          type: 'paragraph',
          text: '三种刷新方式：\n\n- **集中刷新**：在刷新周期内暂停一切读写，集中逐行刷新全部行。控制简单，但存在较长的**死区**。\n- **分散刷新**：把刷新分散到每个存储周期内，读/写后紧跟刷新一行。基本无死区，但每个存储周期拉长，存取速度约降一半。\n- **异步刷新**：每隔固定时间（如每 15.6μs）刷新一行，把刷新平均分散到整个周期内。死区小、速度损失小，是实际最常用的方式。',
        },
        {
          id: 'kb-co-memory-hierarchy-6-11',
          type: 'html',
          html: `<svg viewBox="0 0 900 430" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { font-family: system-ui, sans-serif; }
    .t { font-size: 15px; font-weight: 700; fill: #1e293b; text-anchor: middle; }
    .b { font-size: 12px; fill: #475569; text-anchor: middle; }
    .rw { fill: #dbeafe; stroke: #2563eb; stroke-width: 1.5; }
    .rf { fill: #fef3c7; stroke: #d97706; stroke-width: 1.5; }
    .tl { stroke: #94a3b8; stroke-width: 2.5; }
  </style>

  <!-- ===== 集中刷新：时间轴末尾抢着刷 ===== -->
  <text x="450" y="24" class="t">① 集中刷新</text>
  <line x1="40" y1="62" x2="860" y2="62" class="tl"/>
  <polygon points="860,56 872,62 860,68" fill="#94a3b8"/>
  <text x="60" y="50" class="b">开始</text>
  <text x="830" y="50" class="b">刷新周期结束</text>
  <!-- 正常读写段 -->
  <rect x="60" y="52" width="620" height="20" class="rw"/>
  <text x="370" y="48" class="b">正常读/写（占大部分时间）</text>
  <!-- 末尾集中刷新段 -->
  <rect x="690" y="52" width="150" height="20" class="rf"/>
  <text x="765" y="92" class="b" fill="#b45309">末尾集中刷全部行</text>
  <text x="450" y="110" class="b">前面一直正常读写，到刷新周期快结束时暂停一切访问、集中刷一遍 → 死区 = 整段刷新时间</text>

  <!-- ===== 分散刷新：每次读写后刷一下 ===== -->
  <text x="450" y="148" class="t">② 分散刷新</text>
  <line x1="40" y1="186" x2="860" y2="186" class="tl"/>
  <polygon points="860,180 872,186 860,192" fill="#94a3b8"/>
  <!-- 交替：读写-刷新-读写-刷新... -->
  <rect x="60" y="176" width="90" height="20" class="rw"/>
  <rect x="152" y="176" width="30" height="20" class="rf"/>
  <rect x="184" y="176" width="90" height="20" class="rw"/>
  <rect x="276" y="176" width="30" height="20" class="rf"/>
  <rect x="308" y="176" width="90" height="20" class="rw"/>
  <rect x="400" y="176" width="30" height="20" class="rf"/>
  <rect x="432" y="176" width="90" height="20" class="rw"/>
  <rect x="524" y="176" width="30" height="20" class="rf"/>
  <rect x="556" y="176" width="90" height="20" class="rw"/>
  <rect x="648" y="176" width="30" height="20" class="rf"/>
  <rect x="680" y="176" width="90" height="20" class="rw"/>
  <rect x="772" y="176" width="30" height="20" class="rf"/>
  <text x="450" y="216" class="b">每个读/写周期后紧跟刷新一行，交替进行 → 几乎无死区，但每个存储周期拉长、速度约降一半</text>

  <!-- ===== 异步刷新：每隔固定时间刷一下 ===== -->
  <text x="450" y="254" class="t">③ 异步刷新</text>
  <line x1="40" y1="292" x2="860" y2="292" class="tl"/>
  <polygon points="860,286 872,292 860,298" fill="#94a3b8"/>
  <!-- 大部分读写，每隔一段插一个刷新 -->
  <rect x="60" y="282" width="90" height="20" class="rw"/>
  <rect x="152" y="282" width="90" height="20" class="rw"/>
  <rect x="244" y="282" width="30" height="20" class="rf"/>
  <rect x="276" y="282" width="90" height="20" class="rw"/>
  <rect x="368" y="282" width="90" height="20" class="rw"/>
  <rect x="460" y="282" width="30" height="20" class="rf"/>
  <rect x="492" y="282" width="90" height="20" class="rw"/>
  <rect x="584" y="282" width="90" height="20" class="rw"/>
  <rect x="676" y="282" width="30" height="20" class="rf"/>
  <rect x="708" y="282" width="90" height="20" class="rw"/>
  <text x="450" y="322" class="b">大多数时间正常读写，每隔固定时间（如 15.6μs）刷一行 → 死区小、速度损失小，实际最常用</text>

  <!-- 图例 -->
  <rect x="300" y="356" width="18" height="20" class="rw"/>
  <text x="328" y="370" class="b">正常读/写</text>
  <rect x="450" y="356" width="18" height="20" class="rf"/>
  <text x="478" y="370" class="b">刷新一行</text>
  <text x="450" y="402" class="b">时间轴 = 一个刷新周期（约 2ms）；刷新一行所需时间 = 一个存储周期</text>
</svg>`,
        },
        {
          id: 'kb-co-memory-hierarchy-6-7',
          type: 'paragraph',
          text: '**死区**（死时间）：刷新期间无法进行正常读写访问的时间。\n\n- 集中刷新：死区最长，等于整段集中刷新的时间。\n- 分散刷新：几乎无死区，但存取速度下降。\n- 异步刷新：死区分散成多个很短的片段，每段只有一个存储周期。',
        },
        {
          id: 'kb-co-memory-hierarchy-6-8',
          type: 'paragraph',
          text: '**按行刷新**：每次刷新一行，刷新一行所需时间等于一个存储周期。**例题**：某 DRAM 芯片有 1024 行，存储周期为 0.5μs，采用集中刷新，要求 2ms 内刷完所有行。问刷新全部行需要多少时间？刷新产生的死区占多少比例？\n\n**解**：刷新全部行的时间 = 1024 × 0.5μs = 512μs。死区比例 = 512μs ÷ 2000μs = 25.6%。',
        },
      ],
    },
    {
      id: 'co-dram-address',
      title: 'DRAM 地址线复用',
      blocks: [
        {
          id: 'kb-co-memory-hierarchy-6-9',
          type: 'paragraph',
          text: 'DRAM 芯片容量大、引脚有限，采用**地址线复用**：把地址分成**行地址**和**列地址**两部分，分两次从同一组地址线上送入芯片。先用 **RAS**（行选通）锁存行地址，再用 **CAS**（列选通）锁存列地址，由行、列共同选中一个存储单元。这样地址线根数减半，引脚少、封装小。',
        },
        {
          id: 'kb-co-memory-hierarchy-6-10',
          type: 'paragraph',
          text: '**例题**：某 DRAM 芯片容量为 1M×4 位，采用地址线复用。问芯片需要几根地址线？需要哪两根选通信号？\n\n**解**：1M = $2^{20}$ 个存储单元，本来需要 20 根地址线；地址线复用后行、列各 10 位。',
        },
      ],
    },
  ],
}
