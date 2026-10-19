import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const dataSignalBaudArticle: KnowledgeArticleData = {
  pointId: 'kp-data',
  subpoints: [
    {
      id: 'data-baud-rate',
      title: '码元与波特率',
      blocks: [
        {
          id: 'kb-data-baud-1',
          type: 'paragraph',
          text: '**码元**是数字通信中表示离散值的基本波形单元，一个码元可以携带 1 bit（二电平），也可以携带多 bit（多电平或多相位调制）。\n\n**波特率**是每秒传输的码元数，单位 Baud。\n\n**数据率**是每秒传输的比特数，单位 bps。',
        },
        {
          id: 'kb-data-baud-2',
          type: 'paragraph',
          text: String.raw`关系：$\text{数据率} = \text{波特率} \times \log_2 V$，其中 $V$ 为码元可取的离散电平数（或相位与振幅的组合数）。给定波特率，$V$ 越大数据率越高。给定数据率，$V$ 越大所需波特率越低。`,
        },
        {
          id: 'kb-data-baud-3',
          type: 'callout',
          title: '先确定 V',
          text: '题目给"波特率"问数据率，或给"数据率"问波特率，都是套用上述公式。先确定 $V$：看调制方式，QPSK 的 $V = 4$，16QAM 的 $V = 16$。',
          tone: 'orange',
        },
      ],
    },
    {
      id: 'data-channel',
      title: '信道',
      blocks: [
        {
          id: 'kb-data-channel-1',
          type: 'paragraph',
          text: '**信道**是信号传输的通道，一端发送、一端接收。\n\n按传输介质分为**有线信道**（双绞线、同轴电缆、光纤）和**无线信道**（无线电、微波、卫星）。一条物理链路上可以通过**复用技术**同时承载多条逻辑信道。',
        },
        {
          id: 'kb-data-channel-2',
          type: 'html',
          html: '<svg viewBox="0 0 560 170" xmlns="http://www.w3.org/2000/svg">\n  <style>text{font-family:system-ui,sans-serif;font-size:10px}</style>\n\n  <rect x="30" y="62" width="56" height="36" fill="#dbeafe" stroke="#2563eb" stroke-width="1.2" rx="4"/>\n  <text x="58" y="85" fill="#1e40af" font-weight="600" font-size="11" text-anchor="middle">发送方</text>\n\n  <rect x="474" y="62" width="56" height="36" fill="#d1fae5" stroke="#059669" stroke-width="1.2" rx="4"/>\n  <text x="502" y="85" fill="#064e3b" font-weight="600" font-size="11" text-anchor="middle">接收方</text>\n\n  <rect x="100" y="68" width="360" height="24" fill="#f1f5f9" stroke="#94a3b8" stroke-width="1.2" rx="3"/>\n  <text x="280" y="84" fill="#475569" font-weight="600" font-size="11" text-anchor="middle">信 道</text>\n\n  <polyline points="86,72 92,67 96,77 100,67 104,77 108,67 112,72" fill="none" stroke="#2563eb" stroke-width="1.2"/>\n  <polyline points="460,72 464,67 468,77 472,67 476,72" fill="none" stroke="#059669" stroke-width="1.2"/>\n\n  <line x1="260" y1="44" x2="260" y2="64" stroke="#ef4444" stroke-width="1" stroke-dasharray="4,3"/>\n  <text x="260" y="40" fill="#ef4444" font-size="10" text-anchor="middle">噪声</text>\n\n  <text x="170" y="130" fill="#6b7280" font-size="9" text-anchor="middle">有线：双绞线、同轴电缆、光纤</text>\n  <text x="390" y="130" fill="#6b7280" font-size="9" text-anchor="middle">无线：无线电、微波、卫星</text>\n  <text x="280" y="108" fill="#94a3b8" font-size="9" text-anchor="middle">信号在传输中衰减、畸变，噪声叠加</text>\n  <text x="280" y="156" fill="#6b7280" font-size="9" text-anchor="middle">一条物理链路可通过 FDM / TDM 等复用技术承载多条逻辑信道</text>\n</svg>',
        },
      ],
    },
    {
      id: 'data-bandwidth',
      title: '带宽',
      blocks: [
        {
          id: 'kb-data-bandwidth-1',
          type: 'paragraph',
          text: '**带宽**在计算机网络中有两种含义，读题时要根据上下文区分：',
        },
        {
          id: 'kb-data-bandwidth-2',
          type: 'paragraph',
          text: `1. **频带带宽**——信道能通过的频率范围，单位 **Hz**。例如电话线路的通频带为 300 到 3400 Hz，带宽为 3100 Hz。这是物理层的原始定义。

2. **数据率上限**——信道每秒能传输的最大比特数，单位 **bps**。"带宽 100 Mbps"指的就是这个含义，也是计算机网络中最常用的说法。`,
        },
        {
          id: 'kb-data-bandwidth-3',
          type: 'html',
          html: '<svg viewBox="0 0 560 200" xmlns="http://www.w3.org/2000/svg">\n  <style>text{font-family:system-ui,sans-serif;font-size:10px}</style>\n\n  <text x="280" y="16" fill="#374151" font-weight="700" font-size="12" text-anchor="middle">频带带宽（Hz）——信号能通过的频率范围</text>\n\n  <line x1="50" y1="62" x2="510" y2="62" stroke="#6b7280" stroke-width="1"/>\n  <line x1="50" y1="62" x2="50" y2="66" stroke="#6b7280" stroke-width="0.8"/>\n  <text x="50" y="79" fill="#6b7280" font-size="9" text-anchor="middle">0</text>\n\n  <rect x="50" y="38" width="130" height="24" fill="#dbeafe" fill-opacity="0.4" stroke="#2563eb" stroke-width="0.8" rx="2"/>\n  <text x="115" y="54" fill="#1e40af" font-size="9" text-anchor="middle">0~f₁</text>\n\n  <rect x="180" y="38" width="200" height="24" fill="#d1fae5" fill-opacity="0.5" stroke="#059669" stroke-width="1.2" rx="2"/>\n  <text x="280" y="54" fill="#064e3b" font-weight="600" font-size="10" text-anchor="middle">带宽 = f₂ − f₁</text>\n\n  <rect x="380" y="38" width="130" height="24" fill="#fecaca" fill-opacity="0.3" stroke="#dc2626" stroke-width="0.8" rx="2"/>\n  <text x="445" y="54" fill="#991b1b" font-size="9" text-anchor="middle">&gt;f₂</text>\n\n  <line x1="180" y1="66" x2="180" y2="70" stroke="#059669" stroke-width="0.8"/>\n  <text x="180" y="81" fill="#059669" font-size="9" text-anchor="middle">f₁</text>\n  <line x1="380" y1="66" x2="380" y2="70" stroke="#059669" stroke-width="0.8"/>\n  <text x="380" y="81" fill="#059669" font-size="9" text-anchor="middle">f₂</text>\n\n  <line x1="180" y1="72" x2="180" y2="128" stroke="#059669" stroke-width="0.6" stroke-dasharray="3,2"/>\n  <line x1="380" y1="72" x2="380" y2="128" stroke="#059669" stroke-width="0.6" stroke-dasharray="3,2"/>\n  <line x1="176" y1="128" x2="384" y2="128" stroke="#059669" stroke-width="1"/>\n  <line x1="176" y1="122" x2="176" y2="134" stroke="#059669" stroke-width="0.8"/>\n  <line x1="384" y1="122" x2="384" y2="134" stroke="#059669" stroke-width="0.8"/>\n  <text x="280" y="144" fill="#059669" font-weight="700" font-size="11" text-anchor="middle">带宽 = f₂ − f₁</text>\n\n  <line x1="30" y1="160" x2="530" y2="160" stroke="#e5e7eb" stroke-width="0.5"/>\n\n  <text x="280" y="176" fill="#374151" font-weight="700" font-size="12" text-anchor="middle">数据率（bps）——每秒能传输的最大比特数</text>\n  <text x="280" y="194" fill="#6b7280" font-size="9" text-anchor="middle">计算机网络中"带宽"多指此义，如"链路带宽 100 Mbps"</text>\n</svg>',
        },
        {
          id: 'kb-data-bandwidth-4',
          type: 'callout',
          title: '奈奎斯特和香农公式都用 Hz',
          text: '两个公式中的"带宽"均指频带带宽（Hz），代入算出数据率上限（bps）。读题先看清给的是 Hz 还是 bps。',
          tone: 'orange',
        },
      ],
    },
    {
      id: 'data-signal-types',
      title: '信号类型',
      blocks: [
        {
          id: 'kb-data-signal-1',
          type: 'paragraph',
          text: '**模拟信号**的波形连续变化，参数（幅度、频率或相位）在连续范围内取值。\n\n**数字信号**的波形离散跳变，参数只在有限个离散值之间切换。',
        },
        {
          id: 'kb-data-signal-2',
          type: 'paragraph',
          text: '**基带传输**直接将数字信号发送到信道，信号占据从零频附近开始的频带。\n\n**频带传输**将数字信号调制到高频载波上，利用模拟信道传输数字数据。',
        },
      ],
    },
    {
      id: 'data-interface',
      title: '物理层接口特性',
      blocks: [
        {
          id: 'kb-data-interface-1',
          type: 'paragraph',
          text: '物理层接口定义了 DTE 和 DCE 之间的四个特性：',
        },
        {
          id: 'kb-data-interface-2',
          type: 'paragraph',
          text: `1. **机械特性**——连接器的形状、尺寸、引脚数量和排列。

2. **电气特性**——各信号线的电压范围、传输速率上限、传输距离上限。

3. **功能特性**——每根信号线的功能定义（是数据线、控制线还是地线）。

4. **规程特性**——完成每种功能的事件发生顺序，即通信的时序关系。`,
        },
      ],
    },
  ],
}
