import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const von_neumannArticle: KnowledgeArticleData = {
  pointId: 'co-von-neumann',
  subpoints: [
    {
      id: 'co-arch-levels',
      title: '软件+硬件=计算机系统',
      blocks: [
        {
          id: 'kb-co-von-neumann-1-1',
          type: 'paragraph',
          text: '计算机系统由**硬件系统**和**软件系统**组成。\n\n硬件指有形的物理设备，是计算机中实际物理装置的总称。\n\n软件指在硬件上运行的程序及相关数据、文档。',
        }
      ],
    },
    {
      id: 'co-hardware',
      title: '冯·诺依曼结构',
      blocks: [
        {
          id: 'kb-co-von-neumann-2-1',
          type: 'paragraph',
          text: '**冯·诺依曼结构**采用"**存储程序**"思想：把程序和数据一起放在存储器中，计算机按顺序逐条执行指令。\n\n指令和数据都以二进制形式存储，指令由操作码和地址码组成。**CPU** 按指令周期所处的阶段区分指令和数据。',
        },
        {
          id: 'kb-co-von-neumann-2-2',
          type: 'paragraph',
          text: '五大部件：**运算器、控制器、存储器、输入设备、输出设备**。以运算器为中心的结构后来发展为以存储器为中心，以便更好地发挥存储程序的思想。',
        },
        {
          id: 'kb-co-von-neumann-2-4',
          type: 'paragraph',
          text: '**现代计算机以存储器为中心**。\n\n早期冯·诺依曼结构以运算器为中心，输入/输出都要先经过运算器，运算器成了数据流动的瓶颈。\n\n现代计算机把存储器作为数据流动的中心：输入设备把数据送入存储器，CPU 从存储器取指令和数据运算，结果先写回存储器，再由输出设备输出。',
        },
        {
          id: 'kb-co-von-neumann-2-3',
          type: 'paragraph',
          text: String.raw`**运算器**（ALU）：负责算术运算（加、减、乘、除）和逻辑运算（与、或、非）。

**控制器**（CU）：从存储器中读取指令、解码并控制其他部件协同工作。

**存储器**（Memory）：存储程序指令和运算数据（如内存、硬盘）。

**输入设备**（Input）：接收外部数据（如键盘、鼠标）。

**输出设备**（Output）：将结果反馈给用户（如显示器、打印机）。`,
        },
      ],
    },
  ],
}
