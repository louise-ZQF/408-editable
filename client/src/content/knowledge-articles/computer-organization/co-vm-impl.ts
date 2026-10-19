import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'
import { virtualMemoryTranslationAnimation } from '@/animations/computer-organization/vm/virtual-memory-translation'
import pageFaultFlow from '@/assets/computer-organization/vm/page-fault-flow.svg'

export const coVmImplArticle: KnowledgeArticleData = {
  pointId: 'co-vm-impl',
  subpoints: [
{
      id: 'co-vm-page',
      title: '页式虚拟存储与地址结构',
      blocks: [
        {
          id: 'kb-co-vm-page-1',
          type: 'paragraph',
          text: '**页式虚拟存储**把虚拟地址空间和物理地址空间都划分为大小固定的页。程序运行时按需加载部分页面到内存，其余页面留在磁盘。',
        },
        {
          id: 'kb-co-vm-page-2',
          type: 'paragraph',
          text: '**虚拟地址**（VA）分为**虚拟页号**（VPN）和**页内偏移**；**物理地址**（PA）分为**物理页号**（PPN）和**页内偏移**。',
        },
        
      ],
    },
    {
      id: 'co-vm-segment',
      title: '段式与段页式',
      blocks: [
        {
          id: 'kb-co-vm-segment-1',
          type: 'paragraph',
          text: '**段式虚拟存储**按程序的逻辑结构分段，每段独立编址，便于共享和保护，但段长不固定、管理复杂。\n\n**段页式**先按逻辑分段，段内再分页，兼顾段的共享保护与页的固定管理，但需要两级查表，开销更大。',
        },
        {
          id: 'kb-co-vm-segment-3',
          type: 'paragraph',
          text: '| 特点 | 页式 | 段式 |\n|---|---|---|\n| 划分单位 | 固定大小页 | 不定长段（按逻辑结构分段） |\n| 地址空间 | 一维（线性） | 二维（段号+段内偏移） |\n| 程序员视角 | 对程序员透明，无需关心分页 | 程序员可见，按段编程容易 |\n| 共享与保护 | 较难 | 方便（按段保护），更安全 |\n| 碎片 | 无外部碎片，但有内部碎片 | 有外部碎片，无内部碎片 |\n| 管理复杂度 | 简单 | 复杂 |',
        },
      ],
    },
{
      id: 'co-vm-address-translation',
      title: '地址转换',
      blocks: [
        {
          id: 'kb-co-vm-mmu-1',
          type: 'paragraph',
          text: '**MMU**（内存管理单元）负责虚拟地址到物理地址的转换，同时实施内存保护，根据页表中的保护位控制读、写、执行权限。',
        },
        {
          id: 'kb-co-vm-mmu-3',
          type: 'paragraph',
          text: '最后用 PPN 和页内偏移拼出物理地址，再访问 Cache 或主存。',
        },
        {
          id: 'kb-co-vm-pagetable-1',
          type: 'paragraph',
          text: '**页表**将虚拟页号映射为物理页号，每个进程有自己的页表，存放在内核空间。**页表项**（PTE）包含物理页号、有效位、修改位、访问位、保护位等字段。',
        },
        {
          id: 'kb-co-vm-pagetable-4',
          type: 'paragraph',
          text: '**多级页表的优点**：单级页表为 4GB 虚拟地址空间配 4KB 页面需常驻 4MB 页表，而程序实际只用一小部分地址空间；多级页表按需分配下级页表，大幅节省内存。\n\n**缺点**：访问一个页表项需要多次访存（每级一次），翻译速度变慢，常配合 TLB 缓存以抵消开销。',
        },
        {
          id: 'kb-co-vm-pagetable-6',
          type: 'html',
          html: `<svg viewBox="0 0 1100 560" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { font-family: system-ui, sans-serif; }
    .t { font-size: 15px; font-weight: 700; fill: #1e293b; text-anchor: middle; }
    .b { font-size: 12px; fill: #475569; text-anchor: middle; }
    .lbl { font-size: 13px; font-weight: 700; text-anchor: middle; }
    .used { fill: #2563eb; stroke: #1d4ed8; stroke-width: 2; }
    .free { fill: #f1f5f9; stroke: #94a3b8; stroke-width: 1.5; }
    .level2 { fill: #dcfce7; stroke: #16a34a; stroke-width: 2; }
    .addr { fill: #ffffff; stroke: #9333ea; stroke-width: 1.5; }
    .addrused { fill: #e9d5ff; stroke: #9333ea; stroke-width: 1.5; }
  </style>

  <text x="550" y="24" class="t">多级页表如何节约内存：只用到的项才分配下级页表</text>

  <!-- ===== 一级页表（竖 n×1）===== -->
  <text x="150" y="56" class="lbl" fill="#1d4ed8">一级页表（n 项）</text>
  <g>
    <rect x="120" y="70" width="60" height="34" class="used"/>
    <rect x="120" y="106" width="60" height="34" class="free"/>
    <rect x="120" y="142" width="60" height="34" class="free"/>
    <rect x="120" y="178" width="60" height="34" class="used"/>
    <rect x="120" y="214" width="60" height="34" class="free"/>
    <rect x="120" y="250" width="60" height="34" class="free"/>
    <rect x="120" y="286" width="60" height="34" class="used"/>
    <rect x="120" y="322" width="60" height="34" class="free"/>
    <rect x="120" y="358" width="60" height="34" class="free"/>
    <rect x="120" y="394" width="60" height="34" class="free"/>
  </g>

  <!-- ===== 二级页表（竖 M×1）×3 ===== -->
  <text x="440" y="56" class="lbl" fill="#15803d">二级页表（M 项）</text>
  <g>
    <rect x="350" y="70" width="60" height="34" class="level2"/>
    <rect x="350" y="106" width="60" height="34" class="level2"/>
    <rect x="350" y="142" width="60" height="34" class="level2"/>
    <text x="380" y="196" class="b">A</text>
  </g>
  <g>
    <rect x="430" y="178" width="60" height="34" class="level2"/>
    <rect x="430" y="214" width="60" height="34" class="level2"/>
    <rect x="430" y="250" width="60" height="34" class="level2"/>
    <rect x="430" y="286" width="60" height="34" class="level2"/>
    <text x="460" y="340" class="b">B</text>
  </g>
  <g>
    <rect x="390" y="358" width="60" height="34" class="level2"/>
    <rect x="390" y="394" width="60" height="34" class="level2"/>
    <rect x="390" y="430" width="60" height="34" class="level2"/>
    <text x="420" y="484" class="b">C</text>
  </g>

  <!-- 连线：蓝项 → 二级页表 -->
  <line x1="180" y1="87" x2="350" y2="87" stroke="#2563eb" stroke-width="2.5"/>
  <polygon points="350,81 362,87 350,93" fill="#2563eb"/>
  <line x1="180" y1="195" x2="430" y2="195" stroke="#2563eb" stroke-width="2.5"/>
  <polygon points="430,189 442,195 430,201" fill="#2563eb"/>
  <line x1="180" y1="303" x2="390" y2="375" stroke="#2563eb" stroke-width="2.5"/>
  <polygon points="390,369 402,375 390,381" fill="#2563eb"/>

  <!-- ===== 整个地址空间（竖 k×1）===== -->
  <text x="900" y="56" class="lbl" fill="#9333ea">整个地址空间（k 项）</text>
  <!-- 地址空间：绿色块=被使用的部分，其余白色 -->
  <g>
    <rect x="870" y="70" width="60" height="34" class="addrused"/>
    <rect x="870" y="106" width="60" height="34" class="addr"/>
    <rect x="870" y="142" width="60" height="34" class="addr"/>
    <rect x="870" y="178" width="60" height="34" class="addrused"/>
    <rect x="870" y="214" width="60" height="34" class="addr"/>
    <rect x="870" y="250" width="60" height="34" class="addr"/>
    <rect x="870" y="286" width="60" height="34" class="addrused"/>
    <rect x="870" y="322" width="60" height="34" class="addr"/>
    <rect x="870" y="358" width="60" height="34" class="addr"/>
    <rect x="870" y="394" width="60" height="34" class="addr"/>
    <rect x="870" y="430" width="60" height="34" class="addr"/>
    <rect x="870" y="466" width="60" height="34" class="addr"/>
  </g>

  <!-- 二级页表 → 地址空间 连线 -->
  <line x1="410" y1="87" x2="870" y2="87" stroke="#16a34a" stroke-width="2"/>
  <line x1="490" y1="195" x2="870" y2="195" stroke="#16a34a" stroke-width="2"/>
  <line x1="450" y1="375" x2="870" y2="303" stroke="#16a34a" stroke-width="2"/>

  <!-- 底部对比 -->
  <text x="550" y="510" class="b">一级页表：整个地址空间对应的全部页表项都要加载到内存（k 项全占）</text>
  <text x="550" y="532" class="b">多级页表：只有被使用的部分（蓝项 → 对应二级页表）才加载，其余不加载 → 节省大量内存</text>
</svg>`,
        },
        {
          id: 'kb-co-vm-mmu-7',
          type: 'paragraph',
          text: '**地址翻译过程**：\n\n1. 从 VA 提取 VPN，先查 TLB。\n2. TLB 命中：直接得到 PPN。\n3. TLB 未命中：查页表。页表命中得到 PPN 并更新 TLB；页表未命中则触发缺页中断。',
        },
        {
          id: 'kb-co-vm-mmu-6',
          type: 'animation',
          animation: virtualMemoryTranslationAnimation,
          sourceImport: {
            path: '@/animations/computer-organization/vm/virtual-memory-translation',
            localName: 'virtualMemoryTranslationAnimation',
            kind: 'named',
          },
        },
      ],
    },
{
      id: 'co-vm-tlb',
      title: 'TLB',
      blocks: [
        {
          id: 'kb-co-vm-tlb-1',
          type: 'paragraph',
          text: '**TLB**（快表）是 MMU 中的高速缓存，保存最近使用的虚拟页号到物理页号的映射，加速地址翻译。TLB 用 **SRAM** 实现，因为它在 CPU 内部、要求高速访问，且容量小（几十到几百项），不需要 DRAM 那样的大容量和刷新。',
        },
        {
          id: 'kb-co-vm-tlb-2',
          type: 'paragraph',
          text: '页表存于内存，每次地址翻译至少要访问一次内存，开销大。TLB 离 CPU 近、速度快，命中后免去查页表。',
        },
        {
          id: 'kb-co-vm-tlb-3',
          type: 'paragraph',
          text: 'TLB 与 Cache 类似，也有**直接映射、组相联、全相联**三种方式。TLB 用 VPN 查找，Cache 用主存块号查找。',
        },
        {
          id: 'kb-co-vm-tlb-4',
          type: 'callout',
          title: 'TLB 与 Cache 的分工',
          text: 'TLB 在地址翻译阶段把 VPN 换成 PPN，Cache 在物理访存阶段缓存主存块。两者都是硬件高速缓存，作用场景不同。',
          tone: 'blue',
        },
        {
          id: 'kb-co-vm-tlb-5',
          type: 'html',
          html: `<svg viewBox="0 0 900 420" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { font-family: system-ui, sans-serif; }
    .t { font-size: 15px; font-weight: 700; fill: #1e293b; text-anchor: middle; }
    .b { font-size: 12px; fill: #475569; text-anchor: middle; }
    .lbl { font-size: 13px; font-weight: 700; text-anchor: middle; }
    .tag { fill: #2563eb; stroke: #1d4ed8; stroke-width: 2; }
    .idx { fill: #059669; stroke: #047857; stroke-width: 2; }
    .off { fill: #d97706; stroke: #b45309; stroke-width: 2; }
  </style>

  <text x="450" y="24" class="t">TLB 的地址组成（虚拟地址，组相联示例）</text>

  <!-- 虚拟地址三段 -->
  <text x="450" y="56" class="lbl">虚拟地址（32 位）</text>
  <rect x="120" y="66" width="300" height="50" rx="4" class="tag"/>
  <text x="270" y="88" class="lbl" fill="#ffffff">Tag（20 位）</text>
  <text x="270" y="106" class="b" fill="#dbeafe">虚页号高位</text>
  <rect x="420" y="66" width="150" height="50" rx="4" class="idx"/>
  <text x="495" y="88" class="lbl" fill="#ffffff">TLB 组号（5 位）</text>
  <text x="495" y="106" class="b" fill="#d1fae5">组 index</text>
  <rect x="570" y="66" width="210" height="50" rx="4" class="off"/>
  <text x="675" y="88" class="lbl" fill="#ffffff">页内地址（12 位）</text>
  <text x="675" y="106" class="b" fill="#fef3c7">页内偏移</text>

  <!-- 段标注 -->
  <text x="270" y="140" class="b">用 Tag 匹配</text>
  <text x="495" y="140" class="b">选 TLB 组</text>
  <text x="675" y="140" class="b">不参与查表</text>

  <!-- TLB 查询示意 -->
  <text x="450" y="180" class="lbl" fill="#7c3aed">TLB 查询</text>
  <rect x="330" y="192" width="240" height="60" rx="6" fill="#f5f3ff" stroke="#7c3aed" stroke-width="2"/>
  <text x="450" y="216" class="b" fill="#7c3aed">用组号定位一组，组内比较 Tag</text>
  <text x="450" y="234" class="b" fill="#7c3aed">命中 → 取出 PPN；未命中 → 查页表</text>

  <!-- 结果 -->
  <text x="450" y="272" class="b">TLB 命中得到物理页框号 PPN，与页内地址拼出物理地址</text>
  <rect x="120" y="286" width="250" height="46" rx="4" class="tag"/>
  <text x="250" y="315" class="lbl" fill="#ffffff">物理页框号 PPN</text>
  <rect x="370" y="286" width="210" height="46" rx="4" class="off"/>
  <text x="475" y="315" class="lbl" fill="#ffffff">页内地址</text>

  <text x="450" y="362" class="b">物理地址 = PPN（TLB 提供） + 页内地址（原样保留）</text>
</svg>`,
        },
      ],
    },
    {
      id: 'co-vm-pagefault',
      title: '主存访问流程与页面置换',
      blocks: [
        {
          id: 'kb-co-vm-pagefault-1',
          type: 'paragraph',
          text: '访问的页面不在物理内存时触发**缺页中断**（也称缺页异常）：MMU 发现页表项有效位为 0，交由操作系统内核处理。',
        },
        {
          id: 'kb-co-vm-pagefault-8',
          type: 'paragraph',
          text: '**页故障地址**（page fault address）是触发缺页中断的那条访存指令要访问的**虚拟地址**。缺页发生时，硬件把这个地址写入专门寄存器（如 x86 的 **CR2**）。\n\n缺页处理程序据此定位不在内存的虚拟页：从磁盘调入该页、更新页表与 TLB，再重新执行触发缺页的指令。',
        },
        
        {
          id: 'kb-co-vm-pagefault-5',
          type: 'image',
          src: pageFaultFlow,
          alt: '缺页中断完整流程：CPU 发虚拟地址 → 查 TLB → 查页表有效位 → 触发缺页异常 → 换页/装入页框 → 更新页表/TLB → 重新执行本条指令 → 形成物理地址 → 访问 Cache',
          sourceImport: {
            path: '@/assets/computer-organization/vm/page-fault-flow.svg',
            localName: 'pageFaultFlow',
            kind: 'default',
          },
        },
        {
          id: 'kb-co-vm-pagefault-6',
          type: 'paragraph',
          text: '内存已满需要调入新页时，必须**置换**一个旧页。常用**页面置换算法**：\n\n- **OPT**（最优置换）：淘汰以后最久不用的页，理论最优，不可实现。\n- **FIFO**（先进先出）：可能产生 Belady 异常，增加页框反而缺页更多。\n- **LRU**（最近最久未使用）：性能好，但需硬件支持、开销大。\n- **CLOCK**（时钟置换）：用访问位近似 LRU，实用。',
        },
        {
          id: 'kb-co-vm-pagefault-7',
          type: 'paragraph',
          text: '| 算法 | 思想 | 优点 | 缺点 |\n|---|---|---|---|\n| 最优置换（OPT） | 淘汰未来最久不使用 | 缺页率最低 | 需预知未来，不可实现 |\n| 先进先出（FIFO） | 淘汰最先进入 | 实现简单 | 可能 Belady 异常 |\n| 最近最久未使用（LRU） | 淘汰最久未使用 | 性能好 | 硬件开销大 |\n| 时钟置换（CLOCK） | 访问位轮转 | 折中、实用 | 近似 LRU |',
        },
        {
          id: 'kb-co-vm-frame-1',
          type: 'paragraph',
          text: `**页框分配方式**：
- **固定分配**：平均分配、按比例分配、按优先级分配
- **可变分配**：根据进程缺页率动态调整页框数`,
        },
        {
          id: 'kb-co-vm-frame-2',
          type: 'paragraph',
          text: `**置换范围**：
- **局部置换**：只在本进程的页框内选淘汰页
- **全局置换**：从所有进程的页框中选，可能换出其他进程的页

常见组合：

- 固定分配 + 局部置换。
- 可变分配 + 全局置换。
- 可变分配 + 局部置换。`,
        },
        {
          id: 'kb-co-vm-frame-3',
          type: 'paragraph',
          text: '**页框回收**：进程撤销时，系统回收其全部页框，加入空闲页框链表。\n\n进程执行中因缺页调入新页时，也可能回收被置换页的页框：干净页直接释放，脏页需先写回磁盘。',
        },
        {
          id: 'kb-co-vm-frame-4',
          type: 'callout',
          title: '固定 vs 可变分配',
          text: '固定分配页框数不变，简单但难适应进程需求变化；可变分配按需调整，利用率高但管理复杂。局部置换与全局置换的区别在于从哪些进程的页框中选淘汰页。',
          tone: 'blue',
        },
      ],
    },
    {
      id: 'co-vm-mmap',
      title: '内存映射文件',
      blocks: [
        {
          id: 'kb-co-vm-mmap-1',
          type: 'paragraph',
          text: '**内存映射文件**（mmap）把磁盘文件的一部分直接映射到进程的虚拟地址空间，进程通过访问内存来读写文件，无需显式的 read/write 系统调用。操作系统按需从磁盘调入对应页，修改的页在写回时同步到磁盘。',
        },
        {
          id: 'kb-co-vm-mmap-2',
          type: 'paragraph',
          text: '**优点**：读写文件像访问内存一样高效，多个进程可共享同一文件映射，节省内存。\n\n**缺点**：映射的文件大小受虚拟地址空间限制，小文件映射可能不如传统 I/O 高效。\n\nmmap 常用于加载可执行文件、共享库、大数据文件处理。',
        },
      ],
    },
  ],
}
