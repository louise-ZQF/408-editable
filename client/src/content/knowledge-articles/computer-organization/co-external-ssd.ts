import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const coExternalSsdArticle: KnowledgeArticleData = {
  pointId: 'co-external-ssd',
  subpoints: [
{
      id: 'co-external-ssd-raid',
      title: '固态硬盘与 RAID',
      blocks: [
        {
          id: 'kb-co-memory-hierarchy-5-6',
          type: 'paragraph',
          text: '**固态硬盘**（SSD）用闪存存储，无机械部件，读写快、访问时间在微秒级、抗震且无碎片问题，但写入寿命有限、大容量成本高。',
        },
        {
          id: 'kb-co-memory-hierarchy-5-11',
          type: 'paragraph',
          text: 'SSD 的写入单位与擦除单位不同：\n\n**页**（page）是读写的最小单位，一般 4KB 或 8KB。\n\n**块**（block）是擦除的最小单位，由多个页组成，一般几百 KB 到几 MB。\n\n写数据以页为单位，但闪存不能直接覆盖写，必须先擦除整个块再写，所以写性能受擦除块的影响。',
        },
        {
          id: 'kb-co-memory-hierarchy-5-7',
          type: 'paragraph',
          text: '**RAID** 把多块磁盘组成一个逻辑盘，数据在多个物理盘上分割交叉存储、并行访问，用于提升性能或可靠性。',
        },
        {
          id: 'kb-co-memory-hierarchy-5-12',
          type: 'paragraph',
          text: '| 目标 | 技术手段 | 典型实现 |\n|---|---|---|\n| 性能 | 条带化（striping）、Cache | RAID 0 用条带化提速 |\n| 可靠性 | 镜像（mirroring）、奇偶校验（parity） | RAID 1 镜像、RAID 5 奇偶 |\n\n| 级别 | 手段 | 主要目标 |\n|---|---|---|\n| RAID 0 | 仅条带化 | 性能（无可靠性） |\n| RAID 1 | 仅镜像 | 可靠性（容量减半） |\n| RAID 2 | 海明码 | 可靠性（已废弃） |\n| RAID 3/4 | 条带化 + 专用校验盘 | 性能 + 可靠性 |\n| RAID 5 | 条带化 + 分布式奇偶 | 性能 + 可靠性（最常用） |\n| RAID 6 | 条带化 + 双校验 | 高可靠性（容忍 2 盘坏） |\n| RAID 10 | 镜像 + 条带 | 可靠性 + 性能（贵） |',
        },
        {
          id: 'kb-co-memory-hierarchy-5-18',
          type: 'paragraph',
          text: '**磨损均衡**：闪存块擦写次数有限（约 1000 到 10 万次），频繁写同一块会提前损坏，磨损均衡让擦写尽量均匀分布到所有块。\n\n- **动态磨损均衡**：写新数据时选擦写次数少的块。\n- **静态磨损均衡**：把长期不动的冷数据搬走，腾出块供擦写循环。\n\nSSD 控制器还通过合并多个小写操作来降低**写入放大**，减少实际擦写次数。',
        },
      ],
    },
  ],
}
