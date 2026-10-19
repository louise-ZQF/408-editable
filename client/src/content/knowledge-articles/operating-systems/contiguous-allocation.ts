import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const contiguousAllocationArticle: KnowledgeArticleData = {
  pointId: 'os-contiguous-alloc',
  subpoints: [
    {
      id: 'os-contiguous-single',
      title: '单一连续分配',
      blocks: [
        {
          id: 'kb-os-contiguous-single-1',
          type: 'paragraph',
          text: '**单一连续分配**把内存划分为**系统区**和**用户区**两部分：\n\n- **系统区**：只给操作系统使用。\n- **用户区**：在任一时刻只装入一道用户程序，整个用户区由该进程独占。',
        },
        {
          id: 'kb-os-contiguous-single-2',
          type: 'paragraph',
          text: '**特点**：\n\n- 无外部碎片：用户区整块给一个进程，不存在零散空闲区。\n- 有内部碎片：进程往往用不满整个用户区，剩余部分浪费。\n- 只能单道运行，内存利用率极低。',
        },
        {
          id: 'kb-os-contiguous-single-3',
          type: 'callout',
          title: '碎片角度',
          text: '单一连续分配只有内部碎片、没有外部碎片，因为内存里同时只有一个进程。',
          tone: 'blue',
        },
      ],
    },
    {
      id: 'os-contiguous-fixed',
      title: '固定分区分配',
      blocks: [
        {
          id: 'kb-os-contiguous-fixed-1',
          type: 'paragraph',
          text: '**固定分区分配**在系统启动时把内存预先划分为若干个大小固定的分区，分区在运行期间不再改变。分区可以等大。也可以按需求设成大小不等。进程装入时，为其分配一个能满足需求的空闲分区。分区不能拆分，进程也不能跨分区存放。',
        },
        {
          id: 'kb-os-contiguous-fixed-2',
          type: 'paragraph',
          text: '**特点**：\n\n- 无外部碎片：分区边界固定，不会产生零散空闲区。\n- 有内部碎片：分区大于进程实际需求，多余部分浪费。\n- 若进程比最大的分区还大，即使内存总容量足够也无法装入。\n- 系统用**分区表**记录每个分区的起址、大小与分配状态。',
        },
        {
          id: 'kb-os-contiguous-fixed-3',
          type: 'paragraph',
          text: String.raw`**内存保护**：分区分配依靠**界地址保护**防止进程越界访问。系统在 PCB 中保存进程所在分区的**基址**和**限长**（或上下界），每次访存时硬件检查 $\text{基址} \leq \text{地址} < \text{基址} + \text{限长}$，越界则触发异常。`,
        },
      ],
    },
    {
      id: 'os-contiguous-dynamic',
      title: '动态分区分配',
      blocks: [
        {
          id: 'kb-os-contiguous-dynamic-1',
          type: 'paragraph',
          text: '**动态分区分配**不预先划分分区，进程装入内存时才按需分配一个大小恰好等于进程需求的分区。分区的大小和数目都随进程创建与撤销而动态变化，系统用**空闲分区表**或**空闲分区链**记录当前的空闲区。\n\n**特点**：无内部碎片（分区大小正好等于进程大小），但频繁分配与释放后会产生大量零散小空闲区，形成**外部碎片**。可用**紧凑**（compaction）移动进程、合并空闲区来解决。',
        },
        {
          id: 'kb-os-contiguous-dynamic-2',
          type: 'paragraph',
          text: `**四种分区分配算法**：
- **首次适应**（FF）：从低地址开始顺序查找，把第一个能满足需求的空闲分区分配出去。偏向利用低地址、保留高地址的大分区，但低地址易被切成小碎片。
- **最佳适应**（BF）：选择能满足需求且剩余最小的空闲分区，尽量保留大分区。但每次切完常留下极小的"边角块"，外部碎片反而最严重，且需要遍历整个空闲区。
- **最坏适应**（WF）：选择最大的空闲分区，切完剩余分区仍较大、可继续利用，外部碎片最少。但大分区被不断分割，后续大进程可能找不到足够大的分区。
- **循环首次适应**（NF）：从上次分配结束的位置继续向后查找第一个能满足需求的空闲分区，分配更快，低地址不会被反复分割。`,
        },
        {
          id: 'kb-os-contiguous-dynamic-3',
          type: 'paragraph',
          text: `**四种算法对比**：

| 算法 | 查找方式 | 优点 | 缺点 | 外部碎片程度 |
|---|---|---|---|---|
| 首次适应 FF | 从低地址开始找第一个够用的 | 保留高地址大分区、实现简单 | 低地址被切碎 | 中 |
| 最佳适应 BF | 找剩余最小的够用分区 | 保留大分区 | 产生大量难利用的小碎片 | 最严重 |
| 最坏适应 WF | 找最大的分区 | 剩余分区仍较大 | 大分区被切碎 | 最轻 |
| 循环首次适应 NF | 从上次位置继续找 | 分配快、碎片分布均匀 | 高地址大分区可能被分割 | 中 |`,
        },
        {
          id: 'kb-os-contiguous-dynamic-4',
          type: 'paragraph',
          text: '**分区的回收与合并**：进程释放分区时，系统回收该分区，并检查其相邻分区是否空闲：\n\n- 若上、下相邻分区空闲：把它们合并成一个更大的空闲分区。\n- 若都不相邻：直接加入空闲分区表。\n\n合并相邻空闲区能减少外部碎片。',
        },
        {
          id: 'kb-os-contiguous-dynamic-5',
          type: 'callout',
          title: '伙伴系统',
          text: '伙伴系统（buddy system）把内存按 2 的幂次分级切块（如 1KB、2KB、4KB…），分配时取能满足需求的最小级别块。回收时只与大小相等、物理相邻、来自同一父块的"伙伴"合并。分配与回收开销低，但只能分配 2 的幂次大小，会产生内部碎片。',
          tone: 'blue',
        },
      ],
    },
  ],
}
