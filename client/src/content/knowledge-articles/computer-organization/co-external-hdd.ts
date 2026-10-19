import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'
import hddStructure from '@/assets/computer-organization/external-storage/hdd-structure.webp'

export const coExternalHddArticle: KnowledgeArticleData = {
  pointId: 'co-external-hdd',
  subpoints: [
{
      id: 'co-external-hdd',
      title: '磁盘的结构与磁盘地址',
      blocks: [
        {
          id: 'kb-co-memory-hierarchy-5-1',
          type: 'paragraph',
          text: `**磁盘**（HDD）用磁性介质存储数据。盘片固定在主轴上高速旋转，每个盘片有上下两个盘面，各配一个磁头；盘面划分成同心圆磁道，磁道再分成扇区。

**扇区**是磁盘最小的物理读写单位，通常为 512B 或 4KB。

**簇**（Cluster）是最小的逻辑读写单位，是操作系统与磁盘的交互单位，通常为 128KB 或 256KB。`
        },
        {
          id: 'kb-co-memory-hierarchy-5-2',
          type: 'paragraph',
          text: '**柱面**等价于**磁道**，**磁头**等价于**盘面**，具体的含义见下图。',
        },
        {
          id: 'kb-co-memory-hierarchy-5-9',
          type: 'image',
          src: hddStructure,
          alt: '机械硬盘结构：盘片、主轴、磁道、扇区与 CHS 地址（柱面号/磁头号/扇区号）',
          sourceImport: {
            path: '@/assets/computer-organization/external-storage/hdd-structure.webp',
            localName: 'hddStructure',
            kind: 'default',
          },
        },
        {
          id: 'kb-co-memory-hierarchy-5-3',
          type: 'paragraph',
          text: '磁盘地址的结构式为 [柱面/磁道号, 盘面/磁头号, 扇区号]。'
        },
      ],
    },
{
      id: 'co-external-metrics',
      title: '磁盘性能指标',
      blocks: [
        {
          id: 'kb-co-memory-hierarchy-5-4',
          type: 'paragraph',
          text: '**平均存取时间** = 寻道时间 + 旋转延迟 + 传输时间。寻道是磁头移到目标磁道，旋转延迟是目标扇区转到磁头下方，通常取旋转半圈的平均时间。',
        },
        {
          id: 'kb-co-memory-hierarchy-5-13',
          type: 'formula',
          formula: String.raw`T_{存取} = T_{寻} + T_{转} + T_{传}`,
        },
        {
          id: 'kb-co-memory-hierarchy-5-10',
          type: 'paragraph',
          text: String.raw`**例题**：某磁盘转速 7200 转/分，平均寻道时间 5ms，每磁道容量 512KB。问读一个 4KB 数据的平均存取时间。

**解**：旋转延迟 = 半圈 = $\frac{1}{2} \times \frac{60}{7200}$ s = 4.17ms。传输时间 = $\frac{4KB}{512KB} \times \frac{60}{7200}$ s = $\frac{1}{128} \times 8.33$ms ≈ 0.065ms。平均存取时间 = 5 + 4.17 + 0.065 ≈ 9.2ms。`,
        },

      ],
    },
{
      id: 'co-external-format-partition',
      title: '格式化与分区',
      blocks: [
        {
          id: 'kb-co-memory-hierarchy-5-14',
          type: 'paragraph',
          text: '**磁盘使用前要格式化**，分两级：\n\n**低级格式化**（物理格式化）：划分磁道扇区、建立扇区头。\n\n**高级格式化**（逻辑格式化）：建立文件系统、根目录、空闲空间管理结构。\n\n出厂盘通常已低级格式化，用户只需高级格式化。',
        },
        {
          id: 'kb-co-memory-hierarchy-5-15',
          type: 'paragraph',
          text: '**磁盘分区**把物理磁盘划分为多个逻辑区域，每个分区可单独建立文件系统。分区方便多系统共存、隔离数据、独立管理。\n\n**主引导记录**（MBR）存放在磁盘第一个扇区，包含引导程序和分区表。\n\n**GPT** 是新一代分区表，支持更大容量和更多分区。',
        },
      ],
    },
{
      id: 'co-external-disk-schedule',
      title: '磁盘调度算法',
      blocks: [
        {
          id: 'kb-co-memory-hierarchy-5-16',
          type: 'paragraph',
          text: '多个进程并发访问磁盘时，处理磁道访问请求的顺序决定平均寻道时间。常用**磁盘调度算法**：\n\n- **FCFS**（先来先服务）：公平，但平均寻道时间可能长。\n- **SSTF**（最短寻道优先）：选距当前磁头最近的请求，平均寻道短，但可能饥饿。\n- **SCAN**（电梯算法）：磁头沿一个方向服务到端再折返。\n- **C-SCAN**（循环扫描）：单向服务到端后直接回起点，等待更均匀。',
        },
        {
          id: 'kb-co-memory-hierarchy-5-17',
          type: 'paragraph',
          text: '| 算法 | 思想 | 优点 | 缺点 |\n|---|---|---|---|\n| FCFS | 按到达顺序 | 公平 | 寻道长 |\n| SSTF | 选最近请求 | 平均寻道短 | 可能饥饿 |\n| SCAN | 单向服务到端折返 | 无饥饿 | 两侧等待不均 |\n| C-SCAN | 单向服务回起点 | 等待均匀 | 空行程 |',
        },
      ],
    },
  ],
}
