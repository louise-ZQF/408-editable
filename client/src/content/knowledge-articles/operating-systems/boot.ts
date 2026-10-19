import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const bootArticle: KnowledgeArticleData = {
  pointId: 'os-boot',
  subpoints: [
    {
      id: 'os-boot-process',
      title: '操作系统的引导与启动',
      blocks: [
        {
          id: 'kb-os-boot-1-1',
          type: 'paragraph',
          text: '**第一步：加电读取 boot 程序**。计算机加电后，CPU 从固定的初始地址（通常是 ROM 的起始地址）开始取指令执行。计算机在只读存储器 ROM 中固化了一段 **boot 程序**（引导程序），boot 程序把 BIOS 的第一条指令取入指令寄存器并执行，从而启动固件。',
        },
        {
          id: 'kb-os-boot-1-2',
          type: 'paragraph',
          text: '**第二步：BIOS 执行**。BIOS（基本输入输出系统）启动后完成三件事：\n\n- **硬件自检**（POST）：检测内存、CPU 和设备是否正常。\n- **硬件初始化**：设置各硬件的工作参数。\n- **建立中断向量表**：把各类中断的处理程序入口填入内存中的中断向量表。\n\nBIOS 本身存放在 ROM 中，是固件的一部分。',
        },
        {
          id: 'kb-os-boot-1-3',
          type: 'paragraph',
          text: '**第三步：BIOS 加载主引导程序。**BIOS 按启动顺序（如硬盘、光驱、U 盘）找到可启动设备，读取该设备第一个扇区，即**主引导记录**（MBR）。MBR 中存放着磁盘引导程序和分区表，BIOS 把 MBR 中的引导程序（主引导程序）装入内存并跳转执行。',
        },
        {
          id: 'kb-os-boot-1-4',
          type: 'paragraph',
          text: '**第四步：主引导程序加载分区引导程序。**MBR 中的磁盘引导程序根据分区表找到活动分区（可引导分区），读取该分区的引导扇区，把该分区自己的**分区引导程序**加载到内存，并把控制权交给它。分区引导程序是每个分区各自带的一段引导代码，负责引导该分区内的操作系统。',
        },
        {
          id: 'kb-os-boot-1-6',
          type: 'paragraph',
          text: '**第五步：分区引导程序初始化操作系统。**分区引导程序加载**操作系统内核**到内存，并把控制权交给内核。内核完成初始化：\n\n- 建立内存管理（页表）。\n- 初始化进程管理（创建第一个进程）。\n- 初始化设备驱动。\n- 挂载根文件系统。\n\n随后内核启动第一个用户进程，完成操作系统接管，计算机进入正常运行状态。',
        },
        {
          id: 'kb-os-boot-1-5',
          type: 'paragraph',
          text: `**分区表**是 MBR 中的一张表，记录磁盘被划分成的分区信息：每个分区的起始位置、大小、类型、是否活动（可引导）。系统通过分区表知道磁盘如何组织，以及从哪个分区引导操作系统。BIOS 存放在 ROM 中，是永久固化的。
          **磁盘引导程序**（MBR 引导程序）存放在磁盘第一个扇区，负责加载操作系统。
          
`
        },
        {
          id: 'kb-os-boot-1-10',
          type: 'paragraph',
          text: `
**把硬盘制作成为启动盘的步骤**：
- 格式化硬盘
- 硬盘分区（这一步不属于物理格式化也不属于逻辑格式化）
- 逻辑格式化硬盘
- 安装操作系统
`
        },
      ],
    },
  ],
}
