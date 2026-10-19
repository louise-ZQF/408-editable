import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const memory_hierarchyArticle: KnowledgeArticleData = {
  pointId: 'co-memory-hierarchy',
  subpoints: [
    {
      id: 'co-mem-hierarchy',
      title: '存储系统的层次结构',
      blocks: [
        {
          id: 'kb-co-memory-hierarchy-1-1',
          type: 'paragraph',
          text: '存储层次从**寄存器**到容量大但速度慢的**辅助存储**，容量递增、速度递减、价格递减。依据是**局部性原理**（时间局部性、空间局部性）。',
        },
        {
          id: 'kb-co-memory-hierarchy-1-6',
          type: 'html',
          html: `<svg viewBox="0 0 820 330" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { font-family: system-ui, sans-serif; }
    .title { font-size: 20px; font-weight: 700; fill: #1e293b; text-anchor: middle; }
    .side { font-size: 15px; fill: #475569; text-anchor: middle; }
    .layer-name { font-size: 17px; font-weight: 700; fill: #ffffff; text-anchor: middle; }
    .layer-ex { font-size: 13px; fill: #f1f5f9; text-anchor: middle; }
    .note { font-size: 14px; fill: #334155; text-anchor: middle; }
  </style>
  <text x="410" y="26" class="title">存储器的层次结构</text>
  <text x="76" y="96" class="side">速度 更快</text>
  <text x="76" y="120" class="side">容量 更小</text>
  <text x="76" y="144" class="side">价格 更高</text>
  <text x="744" y="96" class="side">速度 更慢</text>
  <text x="744" y="120" class="side">容量 更大</text>
  <text x="744" y="144" class="side">价格 更低</text>

  <rect x="330" y="48" width="160" height="54" rx="6" fill="#2563eb"/>
  <text x="410" y="72" class="layer-name">寄存器 Regs</text>
  <text x="410" y="92" class="layer-ex">0.2~1 ns</text>

  <rect x="280" y="106" width="260" height="54" rx="6" fill="#059669"/>
  <text x="410" y="130" class="layer-name">Cache（SRAM）</text>
  <text x="410" y="150" class="layer-ex">0.5~20 ns</text>

  <rect x="230" y="164" width="360" height="54" rx="6" fill="#d97706"/>
  <text x="410" y="188" class="layer-name">主存 RAM（DRAM）</text>
  <text x="410" y="208" class="layer-ex">50~100 ns</text>

  <rect x="180" y="222" width="460" height="54" rx="6" fill="#7c3aed"/>
  <text x="410" y="246" class="layer-name">外存（磁盘 / SSD）</text>
  <text x="410" y="266" class="layer-ex">100 μs ~ 15 ms</text>

  <text x="410" y="304" class="note">上一层存储器作为下一层的高速缓存</text>
</svg>`,
        }
      ],
    },
    {
      id: 'co-ram-rom-flash',
      title: 'RAM、ROM 与 Flash',
      blocks: [
        {
          id: 'kb-co-memory-hierarchy-6-1',
          type: 'paragraph',
          text: '**RAM**（随机存取存储器）：可读可写，按地址随机访问，访问时间与位置无关。\n\n**易失性**：断电后数据丢失。\n\n半导体 RAM 按存储原理分 **SRAM 和 DRAM** 两种，用作 Cache 和主存。',
        },
        {
          id: 'kb-co-memory-hierarchy-6-2',
          type: 'paragraph',
          text: '**ROM**（只读存储器）：内容出厂后一般不修改，**非易失性**：断电后数据保留。\n\n按写入方式分：\n\n- **MROM**：掩膜只读，出厂固定。\n- **PROM**：可编程一次。\n- **EPROM**：紫外光可擦除重写。\n- **EEPROM**：电可擦除。\n\nROM 用于存放固件、启动程序（BIOS）。\n\n光盘也属于非易失存储介质：\n\n- **CD-ROM**：只读光盘，用激光读出，出厂刻好不可改写。\n- **CD-R**：可写一次。\n- **CD-RW**：可反复擦写。\n\n它们都属于**光存储**，靠激光读写盘面上的凹坑与平坦区域，非易失、容量大、适合分发数据。',
        },
        {
          id: 'kb-co-memory-hierarchy-6-3',
          type: 'paragraph',
          text: '**Flash**（闪存）：**非易失**但可**电擦写**，介于 ROM 与 RAM 之间：断电像 ROM 一样保留数据，需要时又像 RAM 一样可改写。\n\n特点：\n\n- 按**块擦除**，不能逐字节擦。\n- 写前必须先擦。\n- 擦写次数有限（寿命）。\n- 读写速度远快于机械硬盘，但慢于 RAM。\n\n用于 U 盘、SSD、SD 卡。\n\n三类介质的对比：\n\n- **RAM**：易失，快且贵。\n- **ROM**：只读，不可改。\n- **Flash**：非易失、可改写、容量大成本低，是当前外存的主流介质。',
        },
      ],
    },
  ],
}
