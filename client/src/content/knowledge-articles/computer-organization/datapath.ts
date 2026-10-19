import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const datapathArticle: KnowledgeArticleData = {
  pointId: 'co-datapath',
  subpoints: [
    {
      id: 'co-datapath-composition',
      title: '数据通路的组成',
      blocks: [
        {
          id: 'kb-co-datapath-1-1',
          type: 'paragraph',
          text: 'CPU 分为**数据通路**和**控制器**两部分。\n\n**数据通路**是指令执行过程中数据经过的路径，是指令的**执行部件**。\n\n**控制器**对指令解码并生成控制信号，是指令的**控制部件**。',
        },
        {
          id: 'kb-co-datapath-1-4',
          type: 'paragraph',
          text: '| | 数据通路 Datapath | 控制器 Control Unit |\n|---|---|---|\n| 包含的部件 | ALU、通用寄存器组、程序计数器 PC、暂存器、多路选择器、三态门、MAR/MDR、流水段寄存器 | IR（指令寄存器）、指令译码器、时序系统（节拍发生器）、控制信号发生器（硬布线电路或微程序控制存储器） |\n| 元件类型 | 组合逻辑元件 + 时序逻辑元件 | 以时序逻辑元件为主，输出控制信号 |\n| 作用 | 执行指令：数据的流动与加工 | 控制指令：生成控制信号、决定节拍 |\n| 与指令执行的关系 | 数据实际经过的路径 | 指挥数据通路按序完成各操作 |',
        },
        {
          id: 'kb-co-datapath-1-2',
          type: 'paragraph',
          text: '数据通路的元件分**组合逻辑元件**和**时序逻辑元件**。\n\n组合逻辑元件输出只取决于当前输入，如 ALU、译码器、多路选择器、三态门。\n\n时序逻辑元件有状态存储功能，须在时钟节拍下工作，如寄存器、存储器。',
        },
        {
          id: 'kb-co-datapath-1-3',
          type: 'callout',
          title: '寄存器是时序元件',
          text: '通用寄存器组、程序计数器、状态寄存器等都属时序逻辑元件，它们存储状态，须由时钟同步。',
          tone: 'blue',
        },
      ],
    },
  ],
}
