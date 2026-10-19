import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const tcpHeaderArticle: KnowledgeArticleData = {
  pointId: 'kp-tcp-header',
  subpoints: [
    {
      id: 'tcp-features',
      title: 'TCP 的特点',
      blocks: [
        {
          id: 'kb-tcp-ft-1',
          type: 'paragraph',
          text: 'TCP（Transmission Control Protocol）是传输层面向连接的可靠传输协议，和 UDP 并列。它的 5 个特点：',
        },
        {
          id: 'kb-tcp-ft-2',
          type: 'paragraph',
          text: '**① 面向连接**：通信前必须先通过三次握手建立连接，通信结束后四次挥手释放。连接是一对一的，一条 TCP 连接只能是两个端点之间的通信（不支持广播、多播）。',
        },
        {
          id: 'kb-tcp-ft-3',
          type: 'paragraph',
          text: '**② 可靠交付**：保证应用进程收到的数据无差错、不丢失、不重复、按序到达。通过序号、确认、重传、校验、窗口等机制联合实现。',
        },
        {
          id: 'kb-tcp-ft-4',
          type: 'paragraph',
          text: '**③ 全双工通信**：通信双方可以在同一条连接上同时发送和接收数据。双方各自维护发送缓冲区和接收缓冲区，数据可以两个方向独立流动。',
        },
        {
          id: 'kb-tcp-ft-5',
          type: 'paragraph',
          text: '**④ 面向字节流**：TCP 把应用层数据看作一串连续的字节流。应用一次给 100 字节还是 10 次 10 字节，对 TCP 没有区别，TCP 会按自己的节奏（MSS、窗口）封装成若干报文段发出。',
        },
        {
          id: 'kb-tcp-ft-6',
          type: 'paragraph',
          text: '**⑤ 一对一连接**：TCP 的连接由"源 IP + 源端口 + 目的 IP + 目的端口"四元组唯一确定，两端各有且仅有一个对端。UDP 则是无连接，可以一对多。',
        },
        {
          id: 'kb-tcp-ft-7',
          type: 'callout',
          title: '易错点：面向字节流 vs 面向报文',
          text: 'UDP 是面向报文的：应用层给多少，UDP 就给多少封装成一个 UDP 数据报，不合并也不拆分。TCP 是面向字节流的：应用交下来的是字节流，TCP 可能拆分、合并、分包，只要字节序号对得上就可以。所以接收方 TCP 提交给应用的数据边界和发送方 write 调用的次数没有任何对应关系。',
          tone: 'orange',
        },
      ],
    },
    {
      id: 'tcp-header-structure',
      title: 'TCP 首部结构',
      blocks: [
        {
          id: 'kb-tcp-hdr-1',
          type: 'paragraph',
          text: 'TCP 报文段由**首部**和**数据**两部分组成。首部最小 20 字节、最大 60 字节，其中选项最多 40 字节，用 0 填充补齐到 4 字节整数倍。',
        },
        {
          id: 'kb-tcp-hdr-2',
          type: 'html',
          html: `<svg viewBox="0 0 820 380" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { font-family: system-ui, sans-serif; }
    .hdr { font-size: 13px; font-weight: 700; text-anchor: middle; fill: #1e293b; }
    .bit { font-size: 10px; fill: #64748b; text-anchor: middle; }
    .fld { font-size: 11px; font-weight: 700; text-anchor: middle; }
    .small { font-size: 9px; fill: #475569; text-anchor: middle; }
    .basic { fill: #dbeafe; stroke: #3b82f6; stroke-width: 1.4; }
    .seq   { fill: #bfdbfe; stroke: #2563eb; stroke-width: 1.4; }
    .ack   { fill: #bbf7d0; stroke: #16a34a; stroke-width: 1.4; }
    .flag  { fill: #fef3c7; stroke: #d97706; stroke-width: 1.4; }
    .win   { fill: #fce7f3; stroke: #db2777; stroke-width: 1.4; }
    .cs    { fill: #fed7aa; stroke: #ea580c; stroke-width: 1.4; }
    .opt   { fill: #e2e8f0; stroke: #64748b; stroke-width: 1.4; }
  </style>

  <g font-size="10" fill="#64748b" text-anchor="middle">
    <text x="24" y="20">0</text>
    <text x="124" y="20">15</text>
    <text x="176" y="20">16</text>
    <text x="276" y="20">31</text>
    <text x="328" y="20">32</text>
    <text x="428" y="20">47</text>
    <text x="480" y="20">48</text>
    <text x="580" y="20">63</text>
    <text x="632" y="20">64</text>
    <text x="732" y="20">79</text>
    <text x="744" y="20">95</text>
    <text x="788" y="20">127</text>
  </g>

  <rect x="16" y="28" width="388" height="42" rx="3" class="basic"/>
  <rect x="404" y="28" width="380" height="42" rx="3" class="basic"/>
  <text x="210" y="46" class="fld">源端口（16 bit）</text>
  <text x="210" y="60" class="small">发送方端口号</text>
  <text x="594" y="46" class="fld">目的端口（16 bit）</text>
  <text x="594" y="60" class="small">接收方端口号</text>

  <rect x="16" y="70" width="768" height="44" rx="3" class="seq"/>
  <text x="400" y="89" class="fld" fill="#1e40af">序号 seq（32 bit）</text>
  <text x="400" y="103" class="small" fill="#1e40af">本报文段数据第一个字节的编号</text>

  <rect x="16" y="114" width="768" height="44" rx="3" class="ack"/>
  <text x="400" y="133" class="fld" fill="#166534">确认号 ack（32 bit）</text>
  <text x="400" y="147" class="small" fill="#166534">期望收到的下一个字节序号</text>

  <rect x="16" y="158" width="80" height="46" rx="3" class="basic"/>
  <rect x="96" y="158" width="108" height="46" rx="3" class="basic"/>
  <rect x="204" y="158" width="580" height="46" rx="3" class="flag"/>
  <text x="56" y="177" class="fld">数据偏移</text>
  <text x="56" y="191" class="small">首部长度/4</text>
  <text x="150" y="177" class="fld">保留位</text>
  <text x="150" y="191" class="small">6 bit 置 0</text>
  <text x="494" y="175" class="fld" fill="#92400e">U A P R S F （每个 1 bit）</text>
  <text x="494" y="189" class="small" fill="#92400e">URG  ACK  PSH  RST  SYN  FIN</text>

  <rect x="16" y="204" width="280" height="46" rx="3" class="win"/>
  <rect x="296" y="204" width="260" height="46" rx="3" class="cs"/>
  <rect x="556" y="204" width="228" height="46" rx="3" class="cs"/>
  <text x="156" y="223" class="fld" fill="#9d174d">窗口 rwnd（16 bit）</text>
  <text x="156" y="237" class="small" fill="#9d174d">接收方允许再发送的字节数</text>
  <text x="426" y="223" class="fld" fill="#9a3412">校验和（16 bit）</text>
  <text x="426" y="237" class="small" fill="#9a3412">伪首部+首部+数据</text>
  <text x="670" y="223" class="fld" fill="#9a3412">紧急指针（16 bit）</text>
  <text x="670" y="237" class="small" fill="#9a3412">URG=1 时有效</text>

  <rect x="16" y="250" width="300" height="46" rx="3" class="opt"/>
  <rect x="316" y="250" width="160" height="46" rx="3" class="opt"/>
  <rect x="476" y="250" width="308" height="46" rx="3" class="basic"/>
  <text x="166" y="269" class="fld">选项（可变）</text>
  <text x="166" y="283" class="small">MSS、窗口扩大因子、时间戳</text>
  <text x="396" y="269" class="fld">填充</text>
  <text x="396" y="283" class="small">补到 4 字节整数倍</text>
  <text x="630" y="269" class="fld">数据（可变长）</text>
  <text x="630" y="283" class="small">0 ~ MSS 字节</text>
</svg>`,
        },
        {
          id: 'kb-tcp-hdr-fields',
          type: 'paragraph',
          text: '**源/目的端口**（各 16 bit）：标识发送和接收的应用进程。加上 IP 首部的源/目的 IP 地址，构成唯一标识一条连接的"四元组"。',
        },
        {
          id: 'kb-tcp-hdr-seq',
          type: 'paragraph',
          text: '**序号 seq**（32 bit）：TCP 按字节编号。seq 字段的值是本报文段所携带数据部分第一个字节的编号。建立连接时双方各自随机选一个初始序号 ISN。',
        },
        {
          id: 'kb-tcp-hdr-acknum',
          type: 'paragraph',
          text: '**确认号 ack**（32 bit）："期望收到对方下一个报文段数据部分第一个字节的序号"。ack-1 及之前的所有字节均已正确收到。ACK 标志为 1 时该字段才有效。',
        },
        {
          id: 'kb-tcp-hdr-offset',
          type: 'paragraph',
          text: '**数据偏移**（4 bit）：即 TCP 首部长度除以 4。范围 5 到 15，对应首部长度 20 到 60 字节。因为可选项长度可变，接收方用这个字段定位数据部分的起始位置。',
        },
        {
          id: 'kb-tcp-hdr-window',
          type: 'paragraph',
          text: '**窗口 rwnd**（16 bit）：接收方告诉发送方"我还能收多少字节"，以本报文段的确认号为起点计算。窗口字段用于流量控制，发送方不能发送超过 rwnd 的数据。',
        },
        {
          id: 'kb-tcp-hdr-checksum',
          type: 'paragraph',
          text: '**校验和**（16 bit）：和 UDP 一样，TCP 的校验覆盖"伪首部 + TCP 首部 + TCP 数据"。不同的是，TCP 校验和在 IPv4 下是强制的。',
        },
        {
          id: 'kb-tcp-hdr-urgptr',
          type: 'paragraph',
          text: '**紧急指针**（16 bit）：仅在 URG=1 时有效，指向本报文段中紧急数据最后一个字节的偏移量。可让接收方优先处理紧急数据。',
        },
        {
          id: 'kb-tcp-hdr-options',
          type: 'paragraph',
          text: '**选项**（0 到 40 字节，4 字节对齐）：常用选项包括 MSS（最大报文段长度）、窗口扩大因子（让 rwnd 字段左移）、时间戳（用于 RTT 估算）、SACK（选择性确认）等。填充用 0 补齐到 4 字节整数倍。',
        },
        {
          id: 'kb-tcp-flag-urg',
          type: 'paragraph',
          text: '**URG**（紧急位）：URG=1 表示本报文段含有紧急数据，紧急指针字段有效。TCP 把紧急数据插到本报文段数据部分最前面，发送方应绕过发送缓冲优先发送。',
        },
        {
          id: 'kb-tcp-flag-ack',
          type: 'paragraph',
          text: '**ACK**（确认位）：ACK=1 表示确认号字段有效。连接一旦建立，所有报文段的 ACK 必须为 1。ACK 可以捎带——如果本端也有数据要发，就合并在同一个报文段里。',
        },
        {
          id: 'kb-tcp-flag-psh',
          type: 'paragraph',
          text: '**PSH**（推送位）：PSH=1 表示希望接收方一收到就立刻将数据提交给应用进程，不要在缓冲里攒着。常用于交互式应用。',
        },
        {
          id: 'kb-tcp-flag-rst',
          type: 'paragraph',
          text: '**RST**（复位位）：RST=1 表示出现严重错误（如端口没人监听、连接异常），必须立刻释放连接重新来过。RST 不需要确认，不需要挥手。',
        },
        {
          id: 'kb-tcp-flag-syn',
          type: 'paragraph',
          text: '**SYN**（同步位）：SYN=1 表示连接请求或连接接受报文段。SYN 即使不携带数据也要消耗一个序号。\n\n三次握手中：\n\n1. 第一次：只有 SYN=1。\n2. 第二次：SYN=1 且 ACK=1。\n3. 第三次：只有 ACK=1，可以携带用户数据。',
        },
        {
          id: 'kb-tcp-flag-fin',
          type: 'paragraph',
          text: '**FIN**（终止位）：FIN=1 表示发送方数据已发完，请求关闭本方向发送通道。FIN 即使不携带数据也要消耗一个序号。\n\n四次挥手：\n\n1. 主动方发 FIN。\n2. 被动方回 ACK。\n3. 被动方发 FIN。\n4. 主动方回 ACK。',
        },
        {
          id: 'kb-tcp-flag-pure-ack',
          type: 'callout',
          title: '纯 ACK 不占序号',
          text: '只有 SYN 和 FIN 即使不带数据也各占 1 个序号。一个纯 ACK（只置 ACK=1，不携带数据，也没有 SYN/FIN）不消耗任何序号，下一次再发seq还是不变，它的 seq 只是登记下一个待发字节的编号，对方无须再对它确认。',
          tone: 'orange',
        },
      ],
    },
  ],
}
