import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const busArticle: KnowledgeArticleData = {
  pointId: 'co-bus',
  subpoints: [
    {
      id: 'co-bus-basic',
      title: '总线的概念与分类',
      blocks: [
        {
          id: 'kb-co-bus-1-1',
          type: 'paragraph',
          text: '**总线**是一组电子导线或信号线，允许 CPU、内存、I/O 设备等不同硬件之间进行数据传输和通信。',
        },
        {
          id: 'kb-co-bus-1-2',
          type: 'paragraph',
          text: '按连接层次分：\n\n- **核内总线**：处理器核内部元件之间。\n- **系统总线**：连接 CPU、主存和 I/O 接口，通常所说的总线。\n- **通信总线**：计算机系统之间，又称外部总线。',
        },
        {
          id: 'kb-co-bus-1-3',
          type: 'paragraph',
          text: '**串行总线**：只有一条或两条数据线，按位分时传送，适合远距离（USB、PCIe、SATA）。\n\n**并行总线**：有多条数据线同时传送，效率高但易干扰，适合近距离（内存总线）。',
        },
        {
          id: 'kb-co-bus-1-4',
          type: 'callout',
          title: '串行还是并行',
          text: '现代高速通信几乎都串行（PCIe、USB、SATA、DisplayPort）；并行总线用于内存、老式设备或超短距离高速通信。',
          tone: 'orange',
        },
        {
          id: 'kb-co-bus-1-5',
          type: 'paragraph',
          text: '按定时方式分**同步总线**和**异步总线**。\n\n**同步总线**：由统一的公共时钟驱动，所有设备在时钟的上升沿或下降沿采样，传输节奏固定，适合高速、短距离、各设备存取时间接近的系统。\n\n**异步总线**：没有公共时钟，靠**握手信号**（请求 Request / 应答 Acknowledge）协调传输。',
        },
        {
          id: 'kb-co-bus-1-6',
          type: 'paragraph',
          text: '| 对比 | 同步总线 | 异步总线 |\n|---|---|---|\n| 同步方式 | 公共时钟统一驱动，按时钟沿采样 | 无统一时钟，靠握手信号协调 |\n| 握手 | 无握手信号 | 请求 / 应答握手，分不互锁、半互锁、全互锁 |\n| 速度 | 快（固定节拍） | 慢（每步等应答） |\n| 适用 | 高速短距，设备存取时间接近 | 速度差异大、距离较远的设备 |\n| 举例 | CPU-主存总线、PCI | I2C、USB 低速、异步串口 |',
        },
        {
          id: 'kb-co-bus-1-7',
          type: 'paragraph',
          text: '**异步串行通信**的字符帧格式为：起始位 + 数据位 + 校验位 + 停止位。\n\n- 空闲时数据线为高电平。\n- **起始位**是一个低电平，标志一帧开始。\n- **数据位**：低位在前，通常 5 到 8 位。\n- **校验位**：可选，奇/偶校验。\n- **停止位**：高电平（1 位或 2 位），标志一帧结束。\n\n接收方靠起始位的下降沿同步，逐位采样。',
        },
      ],
    },
    {
      id: 'co-bus-composition',
      title: '系统总线的组成',
      blocks: [
        {
          id: 'kb-co-bus-2-1',
          type: 'paragraph',
          text: '系统总线由三组线构成：\n\n- **数据总线**：双向传输数据，条数与机器字长、存储字长有关。\n- **地址总线**：单向，CPU 发出，宽度决定可寻址范围。\n- **控制总线**：传输读写信号、时钟、中断等控制信号。',
        },
        {
          id: 'kb-co-bus-2-4',
          type: 'paragraph',
          text: '| | 数据总线 | 地址总线 | 控制总线 |\n|---|---|---|---|\n| 方向 | 双向 | 单向（CPU → 其他） | 双向（读/写/时钟/中断） |\n| 宽度含义 | 一次能传多少位数据 | 可寻址空间大小 | 控制信号的种类与条数 |\n| 谁决定 | 机器字长 / 存储字长 | 主存地址空间 | 控制功能需求 |\n| 作用 | 传数据 | 传地址 | 传控制与状态 |',
        },
        {
          id: 'kb-co-bus-2-2',
          type: 'paragraph',
          text: '有些总线数据线和地址线复用，同一组引脚分时传送地址和数据。',
        },
        {
          id: 'kb-co-bus-2-3',
          type: 'html',
          html: `<svg viewBox="0 0 820 200" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { font-family: system-ui, sans-serif; }
    .title { font-size: 18px; font-weight: 700; fill: #1e293b; text-anchor: middle; }
    .box { font-size: 15px; font-weight: 700; fill: #ffffff; text-anchor: middle; }
    .sub { font-size: 13px; fill: #e2e8f0; text-anchor: middle; }
    .note { font-size: 14px; fill: #475569; text-anchor: middle; }
  </style>
  <text x="410" y="26" class="title">系统总线的组成</text>

  <rect x="60" y="56" width="220" height="60" rx="8" fill="#2563eb"/>
  <text x="170" y="84" class="box">数据总线</text>
  <text x="170" y="104" class="sub">双向，8/16/32/64 位</text>

  <rect x="300" y="56" width="220" height="60" rx="8" fill="#059669"/>
  <text x="410" y="84" class="box">地址总线</text>
  <text x="410" y="104" class="sub">单向，CPU 发出</text>

  <rect x="540" y="56" width="220" height="60" rx="8" fill="#d97706"/>
  <text x="650" y="84" class="box">控制总线</text>
  <text x="650" y="104" class="sub">读/写、时钟、中断</text>

  <text x="170" y="146" class="note">宽度决定一次传多少数据</text>
  <text x="410" y="146" class="note">宽度决定可寻址范围</text>
  <text x="650" y="146" class="note">协调传输与操作时序</text>

  <text x="410" y="186" class="title">总线带宽 = 总线位数 × 每秒传输次数（bit/s）</text>
</svg>`,
        },
      ],
    },
    {
      id: 'co-bus-architecture',
      title: '总线的架构方式',
      blocks: [
        {
          id: 'kb-co-bus-3-1',
          type: 'paragraph',
          text: '**单总线结构**：所有处理器、主存和 I/O 设备共用一条总线。结构简单、成本低，但所有设备必须轮流访问总线，有通信冲突和带宽瓶颈。',
        },
        {
          id: 'kb-co-bus-3-2',
          type: 'paragraph',
          text: '**多总线结构**：引入多条功能分化的总线，如 CPU-主存总线、I/O 总线，减轻主总线负载，提高并发性。',
        },
        {
          id: 'kb-co-bus-3-3',
          type: 'paragraph',
          text: '**分层总线结构**：把总线按速率和用途分层，各层通过桥接控制器协调，高速设备直连 CPU（内存走内存控制器、显卡走 PCIe），低速设备走 PCH/南桥。',
        },
      ],
    },
    {
      id: 'co-bus-metrics',
      title: '总线的性能指标',
      blocks: [
        {
          id: 'kb-co-bus-4-1',
          type: 'paragraph',
          text: '**总线带宽** = 总线位数 × 每秒传输次数（bit/s）。总线位数即数据总线根数（一次能并行传输的位数），每秒传输次数即总线的数据传输速率（次/秒）。\n\n例如 64 位总线每秒传输 1 亿次，带宽 = 64 × $10^8$ bit/s = 800 MB/s。',
        },
        {
          id: 'kb-co-bus-4-2',
          type: 'paragraph',
          text: '**总线传输周期**是完成一次总线数据传输所需的时间，包括申请、寻址、传输和结束阶段，可能包含多个时钟周期。每秒传输次数 = 1 / 总线传输周期。',
        },
      ],
    },
    {
      id: 'co-bus-transaction',
      title: '总线事务与突发传输',
      blocks: [
        {
          id: 'kb-co-bus-5-1',
          type: 'paragraph',
          text: '**总线事务**是总线操作的基本单位，包含请求、仲裁、寻址、传输、终止几个阶段。主设备发起事务，从设备响应。',
        },
        {
          id: 'kb-co-bus-5-2',
          type: 'paragraph',
          text: '**突发传输**（Burst）：一次总线事务中，主设备只在开始时**发送一次起始地址**，随后连续传输多个数据单元，地址按固定步长自动递增，从设备无需每次接收新地址。它减少了反复发送地址/控制所占用的时间，提高总线利用率，适合 Cache 行填充、DMA 等整块数据传输。',
        },
      ],
    },
  ],
}
