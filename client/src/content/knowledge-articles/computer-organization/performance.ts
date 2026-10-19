import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const performanceArticle: KnowledgeArticleData = {
  pointId: 'co-performance',
  subpoints: [
    {
      id: 'co-speed-metrics',
      title: '运算速度',
      blocks: [
        {
          id: 'kb-co-performance-1-1',
          type: 'paragraph',
          text: '**时钟周期**（Clock Cycle）是 CPU 执行指令的基本时间单位，由系统时钟产生的一个"高低电平"变化（脉冲）所定义。计算机内部的**晶体振荡器**（石英晶体，利用压电效应）产生规律脉冲信号，经整形和分频电路转换为方波**数字脉冲信号**，用于同步各硬件组件。',
        },
        {
          id: 'kb-co-performance-1-2',
          type: 'paragraph',
          text: '**时钟周期**是连续两个脉冲之间的时间间隔，即一个时钟脉冲的宽度。时钟周期以相邻状态单元间组合逻辑电路的最大延迟为基准确定，最慢的那一段组合逻辑决定时钟能有多快。\n\n不是所有设备都用相同时钟周期：同步设备使用相同的时钟信号，异步设备使用不同或不使用时钟信号。',
        },
        {
          id: 'kb-co-performance-1-3',
          type: 'paragraph',
          text: String.raw`**主频**（CPU Frequency）是 CPU 的时钟振荡频率，为时钟周期的倒数，单位 MHz 或 GHz。1 Hz = 每秒 1 个时钟周期，1 MHz = $10^6$ Hz，1 GHz = $10^9$ Hz。

主频与时钟周期互为倒数：主频 × 时钟周期 = 1。3.0 GHz 的 CPU 每秒经历 $3 \times 10^9$ 个时钟周期。`,
        },
        {
          id: 'kb-co-performance-1-4',
          type: 'callout',
          title: '主频与性能',
          text: '主频决定时钟振荡快慢，但 CPU 性能还取决于 CPI 和指令条数。不能仅凭主频高低判断 CPU 快慢。',
          tone: 'orange',
        },
        {
          id: 'kb-co-performance-1-5',
          type: 'paragraph',
          text: '**CPI**（Cycle Per Instruction，每条指令周期数）：一条指令所需的平均时钟周期数。\n\n三个周期的大小关系：时钟周期 < 机器周期 < 指令周期。\n\n- 时钟周期是硬件最小时间单位。\n- 机器周期由多个时钟周期组成，完成一个基本操作（如取指令、存数据）。\n- 指令周期由多个机器周期组成，完成一条指令。',
        },
        {
          id: 'kb-co-performance-1-7',
          type: 'paragraph',
          text: String.raw`**IPS**（每秒指令数）表示每秒执行的指令条数。**MIPS**（每秒百万指令数）= IPS / $10^6$，常用于衡量 CPU 性能。

**FLOPS**（每秒浮点运算次数）衡量浮点运算性能，常用于 GPU 或 AI 芯片。常用单位有 MFLOPS（$10^6$）、GFLOPS（$10^9$）、TFLOPS（$10^{12}$）、PFLOPS（$10^{15}$）、EFLOPS（$10^{18}$）、ZFLOPS（$10^{21}$）。`,
        },
      ],
    },
  ],
}
