import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const tcpFlowControlArticle: KnowledgeArticleData = {
  pointId: 'kp-tcp-flow-control',
  subpoints: [
    {
      id: 'tcp-fc-cwnd-intro',
      title: '发送窗口由两个窗口共同决定',
      blocks: [
        {
          id: 'kb-tcp-fc-cw-1',
          type: 'paragraph',
          text: 'TCP 发送方一次能发多少，是"接收方撑得下"和"网络装得下"这两个限制里取更小的那个：',
        },
        {
          id: 'kb-tcp-fc-cw-2',
          type: 'formula',
          formula: String.raw`\text{发送窗口上限} = \min(\text{rwnd},\ \text{cwnd})`,
        },
        {
          id: 'kb-tcp-fc-cw-3',
          type: 'paragraph',
          text: '**rwnd（Receiver Window）接收窗口**：接收方根据自己接收缓冲的剩余空间，在每个 ACK 的 16 bit 窗口字段里告诉发送方"我还能收 rwnd 字节"。这是流量控制。',
        },
        {
          id: 'kb-tcp-fc-cw-4',
          type: 'paragraph',
          text: '**cwnd（Congestion Window）拥塞窗口**：发送方根据自己对网络拥塞程度的判断，动态维护的一个值，表示"我觉得我最多再发 cwnd 字节就不会把网络塞爆"。这是拥塞控制。',
        },
        {
          id: 'kb-tcp-fc-ex1-1',
          type: 'paragraph',
          text: '**例题**：主机甲向主机乙发送一个 TCP 段，序号 seq=201，数据 200 字节。乙正确收到该段后回复确认。\n\n乙的接收缓存总大小为 3000 字节，该段到达前缓存中已有 1200 字节数据未被乙的应用取走。假设 cwnd 足够大。回答：',
        },
        {
          id: 'kb-tcp-fc-ex1-2',
          type: 'paragraph',
          text: '(1) 乙回复的确认号 ack 是多少？',
        },
        {
          id: 'kb-tcp-fc-ex1-3',
          type: 'paragraph',
          text: '(2) 乙回复的窗口字段 rwnd 填多少？',
        },
        {
          id: 'kb-tcp-fc-ex1-4',
          type: 'paragraph',
          text: '(3) 甲收到确认后，发送窗口上限是多少？还能立即再发多少字节？',
        },
        {
          id: 'kb-tcp-fc-ex1-5',
          type: 'paragraph',
          text: '**解析：**',
        },
        {
          id: 'kb-tcp-fc-ex1-6',
          type: 'paragraph',
          text: '(1) 序号 201 + 数据 200 字节 = 覆盖字节 201 到 400，乙期望下一个是 401，故 ack = 401。',
        },
        {
          id: 'kb-tcp-fc-ex1-7',
          type: 'paragraph',
          text: '(2) 接收缓存已占用 = 1200 + 200 = 1400 字节，空闲 = 3000 − 1400 = 1600 字节，故 rwnd = 1600。',
        },
        {
          id: 'kb-tcp-fc-ex1-8',
          type: 'paragraph',
          text: '(3) 发送窗口上限 = min(rwnd=1600, cwnd) = 1600 字节。已发未确认字节 = 0（201 到 400 已被 ack=401 确认）。还能发 1600 字节。',
        },
      ],
    },
    {
      id: 'tcp-fc-zero-window',
      title: '零窗口与窗口探测报文段',
      blocks: [
        {
          id: 'kb-tcp-fc-0w-1',
          type: 'paragraph',
          text: '如果接收方接收缓冲已经全部占满，它在 ACK 里会把 rwnd 填为 0，这叫**零窗口通告**。发送方收到 rwnd=0 必须立刻停止发送任何数据。',
        },
        {
          id: 'kb-tcp-fc-0w-2',
          type: 'paragraph',
          text: '接收方应用读取了一些数据、释放缓冲后，要主动告诉发送方"我又有空间了"。这条通知是**纯 ACK**（窗口更新），不携带数据。',
        },
        {
          id: 'kb-tcp-fc-0w-3',
          type: 'paragraph',
          text: '如果"窗口更新"的 ACK 在网络里丢了，发送方永远以为窗口是 0，接收方永远以为自己已经通知过了，双方就死锁。TCP 专门设计了**零窗口探测报文段**（Zero Window Probe）来打破死锁。',
        },
        {
          id: 'kb-tcp-fc-0w-4',
          type: 'paragraph',
          text: '**零窗口探测的做法**：发送方维护一个坚持计时器（Persist Timer），对方通告零窗口时启动。计时器到期后发一个 1 字节的探测报文，接收方必须回 ACK。\n\n1. ACK 里窗口还是 0：坚持计时器翻倍（指数退避），最长一般 60 秒不再翻倍。\n2. 某次 ACK 里 rwnd>0：立即按新窗口继续发送。',
        },
      ],
    },
    {
      id: 'tcp-fc-algos',
      title: '拥塞控制四种算法',
      blocks: [
        {
          id: 'kb-tcp-fc-alg-1',
          type: 'paragraph',
          text: '拥塞控制看 cwnd 怎么变，考纲只要求经典的 Tahoe/Reno 四个算法：\n\n1. **慢开始**（Slow Start）。\n2. **拥塞避免**（Congestion Avoidance）。\n3. **快重传**（Fast Retransmit）。\n4. **快恢复**（Fast Recovery）。\n\n慢开始和拥塞避免是"增长阶段"，快重传和快恢复是"丢包时怎么处理"。',
        },
        {
          id: 'kb-tcp-fc-alg-2',
          type: 'paragraph',
          text: '关键参数：**ssthresh**（慢开始门限）。\n\n1. cwnd < ssthresh：走慢开始。\n2. cwnd ≥ ssthresh：走拥塞避免。',
        },
        {
          id: 'kb-tcp-fc-alg-3',
          type: 'paragraph',
          text: '**慢开始**（指数增长）：刚连接或刚从 RTO 恢复时，cwnd=1 MSS。每过一个 RTT，cwnd 翻倍（1→2→4→8→16...）。名字叫"慢开始"是因为从 1 起步，不是线性。',
        },
        {
          id: 'kb-tcp-fc-alg-4',
          type: 'paragraph',
          text: '**拥塞避免**（加法增长）：cwnd 达到 ssthresh 后放缓，每过一个 RTT 只 +1 MSS。趁网络还没丢包先保守试探。',
        },
        {
          id: 'kb-tcp-fc-alg-5',
          type: 'paragraph',
          text: '丢包时有两种处理方式：',
        },
        {
          id: 'kb-tcp-fc-alg-6',
          type: 'paragraph',
          text: '**RTO 超时**（严重丢包）时：\n\n1. ssthresh = cwnd/2（至少为 2）。\n2. cwnd = 1 MSS。\n3. 从慢开始重新跑。\n\n这是最狠的惩罚。',
        },
        {
          id: 'kb-tcp-fc-alg-7',
          type: 'paragraph',
          text: '**3 个冗余 ACK**（快重传 + 快恢复）时，网络还没彻底堵死：\n\n1. ssthresh = cwnd/2。\n2. cwnd = ssthresh。\n3. 重新进入拥塞避免（加法增长）。',
        },
        {
          id: 'kb-tcp-fc-alg-svg',
          type: 'html',
          html: `<svg viewBox="0 0 820 340" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { font-family: system-ui, sans-serif; }
    .title { font-size: 14px; font-weight: 700; fill: #0f172a; text-anchor: middle; }
    .axis { stroke: #334155; stroke-width: 2; }
    .tickT { font-size: 10px; fill: #475569; text-anchor: middle; }
    .tickY { font-size: 10px; fill: #475569; text-anchor: end; }
    .lbl { font-size: 12px; font-weight: 700; text-anchor: middle; }
    .slow { stroke: #2563eb; stroke-width: 2.4; fill: none; }
    .avoid { stroke: #059669; stroke-width: 2.4; fill: none; }
    .drop { stroke: #dc2626; stroke-width: 2; fill: none; stroke-dasharray: 4,3; }
    .sh { stroke: #7c3aed; stroke-width: 1.4; stroke-dasharray: 5,3; fill: none; }
    .dot { fill: #dc2626; }
  </style>
  <defs>
    <marker id="arrX" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#334155"/></marker>
    <marker id="arrY" viewBox="0 0 10 10" refX="5" refY="0" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 10 L5 0 L10 10 z" fill="#334155"/></marker>
  </defs>

  <text x="410" y="22" class="title">拥塞控制：RTO 超时丢包后 cwnd 的恢复过程</text>

  <line x1="60" y1="290" x2="780" y2="290" class="axis" marker-end="url(#arrX)"/>
  <line x1="60" y1="290" x2="60" y2="24" class="axis" marker-end="url(#arrY)"/>

  <text x="790" y="304" font-size="12" fill="#334155" text-anchor="start">RTT</text>
  <text x="50" y="16" font-size="12" fill="#334155" text-anchor="middle">cwnd(MSS)</text>

  <!-- x 刻度 -->
  <g>
    <text x="60"  y="305" class="tickT">0</text>
    <text x="120" y="305" class="tickT">1</text>
    <text x="180" y="305" class="tickT">2</text>
    <text x="240" y="305" class="tickT">3</text>
    <text x="300" y="305" class="tickT">4</text>
    <text x="360" y="305" class="tickT">5</text>
    <text x="420" y="305" class="tickT">6</text>
    <text x="480" y="305" class="tickT">7</text>
    <text x="540" y="305" class="tickT">8</text>
    <text x="600" y="305" class="tickT">9</text>
    <text x="660" y="305" class="tickT">10</text>
    <text x="720" y="305" class="tickT">11</text>
  </g>
  <!-- y 刻度 -->
  <g>
    <text x="54" y="294" class="tickY">0</text>
    <text x="54" y="266" class="tickY">4</text>
    <text x="54" y="238" class="tickY">8</text>
    <text x="54" y="210" class="tickY">12</text>
    <text x="54" y="182" class="tickY">16</text>
    <text x="54" y="154" class="tickY">20</text>
    <text x="54" y="126" class="tickY">24</text>
  </g>

  <!-- 慢开始：cwnd=1→2→4→8→16 -->
  <polyline points="60,284 120,278 180,266 240,242 300,194" class="slow"/>

  <line x1="60" y1="194" x2="680" y2="194" class="sh"/>
  <text x="688" y="198" font-size="11" fill="#6d28d9" font-weight="700" text-anchor="start">ssthresh=16</text>

  <text x="180" y="104" class="lbl" fill="#1d4ed8">慢开始 1→2→4→8→16</text>

  <!-- 拥塞避免：16→17→18→19→20 -->
  <polyline points="300,194 360,188 420,182 480,176 540,170" class="avoid"/>
  <text x="420" y="144" class="lbl" fill="#047857">拥塞避免 16→17→18→19→20</text>

  <!-- RTO 超时点 -->
  <circle cx="540" cy="170" r="4" class="dot"/>
  <text x="540" y="158" font-size="11" font-weight="700" fill="#b91c1c" text-anchor="middle">RTO超时</text>

  <!-- 陡降 cwnd→1 -->
  <line x1="540" y1="170" x2="540" y2="284" class="drop"/>

  <line x1="60" y1="230" x2="680" y2="230" class="sh"/>
  <text x="688" y="234" font-size="11" fill="#6d28d9" font-weight="700" text-anchor="start">ssthresh=10</text>

  <!-- 第二轮慢开始 1→2→4→8→10 -->
  <polyline points="540,284 600,278 660,266 720,242 750,230" class="slow"/>
  <text x="660" y="312" class="lbl" fill="#1d4ed8">cwnd 从 1 重新慢开始</text>
</svg>`,
        },
      ],
    },
  ],
}
