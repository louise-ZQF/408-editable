import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const digitalAnalogArticle: KnowledgeArticleData = {
  pointId: 'kp-digital-analog',
  subpoints: [
    {
      id: 'modulation-basics',
      title: '调制的基本思路',
      blocks: [
        {
          id: 'kb-modulation-basics-1',
          type: 'paragraph',
          text: '**调制**是把数字信号（基带信号）搬移到高频载波上，使数字数据能在模拟信道（如电话线、无线电）上传输。**解调**是接收端把数字信号从载波中还原出来。调制解调器执行这两个过程。',
        },
      ],
    },
    {
      id: 'modulation-methods',
      title: '三种基本调制方式',
      blocks: [
        {
          id: 'kb-modulation-methods-1',
          type: 'paragraph',
          text: `| 调制方式 | 改变载波的哪个参数 | 特点 |
|----------|-------------------|------|
| **ASK**（幅移键控） | 幅度 | 实现简单，抗干扰差 |
| **FSK**（频移键控） | 频率 | 需要 2 个不同频率载波，抗干扰较好 |
| **PSK**（相移键控） | 相位 | 抗干扰最强，QPSK 一个码元携带 2 bit |`,
        },
      ],
    },
    {
      id: 'modulation-qam',
      title: 'QAM 正交幅度调制',
      blocks: [
        {
          id: 'kb-modulation-qam-1',
          type: 'paragraph',
          text: String.raw`**QAM** 同时改变载波的幅度和相位，相当于 ASK 和 PSK 的组合。$r$ 个相位配合 $a$ 个振幅，共 $r \times a$ 种组合，每个码元携带 $\log_2(r \times a)$ bit。例如 4 相位 + 4 振幅构成 16QAM，每个码元携带 4 bit。`,
        },
        {
          id: 'kb-modulation-qam-2',
          type: 'paragraph',
          text: '奈奎斯特公式中的 $V$ 取相位数与振幅数的乘积。题目给"QAM-64"，则 $V = 64$，每个码元携带 6 bit。',
        },
      ],
    }
  ],
}
