import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const stopWaitProtocolArticle: KnowledgeArticleData = {
  pointId: 'kp-stop-wait-protocol',
  subpoints: [
    {
      id: 'stop-wait-basics',
      title: '停止等待协议',
      blocks: [
        {
          id: 'kb-stop-wait-basics-1',
          type: 'paragraph',
          text: '**停止等待协议**是最简单的可靠传输协议。发送方每发一个帧就停下来等确认，收到确认帧后才发下一帧，超时未收到确认则重发该帧。',
        },
        {
          id: 'kb-stop-wait-basics-2',
          type: 'paragraph',
          text: '发送方为每个帧编号（1 bit 即可，只有 0 和 1 交替），接收方收到重复帧时丢弃并重发确认。帧号和超时重传机制保证了不丢、不错、不乱序。',
        },
        {
          id: 'kb-stop-wait-basics-3',
          type: 'html',
          html: '<svg viewBox="0 0 530 380" xmlns="http://www.w3.org/2000/svg">\n  <style>\n    text { font-family: system-ui, sans-serif; }\n    .hdr { font-size: 13px; font-weight: 700; fill: #1e293b; }\n    .lbl { font-size: 10px; font-weight: 600; }\n    .tl  { stroke: #1e293b; stroke-width: 1.5; }\n    .br  { stroke-width: 1.2; }\n  </style>\n\n  <line x1="90" y1="48" x2="90" y2="360" class="tl"/>\n  <line x1="420" y1="48" x2="420" y2="360" class="tl"/>\n\n  <text x="90" y="32" class="hdr" text-anchor="middle">发送方</text>\n  <text x="420" y="32" class="hdr" text-anchor="middle">接收方</text>\n\n  <!-- 帧 0 -->\n  <polygon points="90,75 420,145 420,175 90,105" fill="#dbeafe" fill-opacity="0.55" stroke="#2563eb" stroke-width="1.5"/>\n  <text x="255" y="122" class="hdr" fill="#2563eb" text-anchor="middle">帧 0</text>\n\n  <!-- ACK -->\n  <polygon points="420,190 90,260 90,266 420,196" fill="#fef3c7" fill-opacity="0.65" stroke="#d97706" stroke-width="1.5"/>\n  <text x="255" y="240" class="hdr" fill="#d97706" text-anchor="middle">ACK</text>\n\n  <!-- 帧 1：收到 ACK 后立即发送，无等待 -->\n  <polygon points="90,268 420,338 420,360 90,298" fill="#dbeafe" fill-opacity="0.35" stroke="#2563eb" stroke-width="1.2"/>\n  <text x="255" y="318" class="hdr" fill="#2563eb" fill-opacity="0.7" text-anchor="middle">帧 1</text>\n\n  <!-- 发送 bracket：帧 0（蓝） -->\n  <line x1="74" y1="75" x2="90" y2="75" class="br" stroke="#2563eb"/>\n  <line x1="74" y1="105" x2="90" y2="105" class="br" stroke="#2563eb"/>\n  <text x="82" y="87" fill="#2563eb" class="lbl" text-anchor="middle">\n    <tspan x="82" dy="0">发</tspan><tspan x="82" dy="11">送</tspan>\n  </text>\n\n  <!-- 发送 bracket：帧 1（蓝） -->\n  <line x1="74" y1="268" x2="90" y2="268" class="br" stroke="#2563eb"/>\n  <line x1="74" y1="298" x2="90" y2="298" class="br" stroke="#2563eb"/>\n  <text x="82" y="280" fill="#2563eb" class="lbl" text-anchor="middle">\n    <tspan x="82" dy="0">发</tspan><tspan x="82" dy="11">送</tspan>\n  </text>\n\n  <!-- 总处理周期 bracket（深灰，文字居中于横线） -->\n  <line x1="44" y1="75" x2="60" y2="75" class="br" stroke="#334155"/>\n  <line x1="44" y1="268" x2="60" y2="268" class="br" stroke="#334155"/>\n  <text x="52" y="150" fill="#334155" class="lbl" text-anchor="middle">\n    <tspan x="52" dy="0">总</tspan>\n    <tspan x="52" dy="11">处</tspan>\n    <tspan x="52" dy="11">理</tspan>\n    <tspan x="52" dy="11">周</tspan>\n    <tspan x="52" dy="11">期</tspan>\n  </text>\n\n  <!-- 接收 bracket：帧 0（灰） -->\n  <line x1="420" y1="145" x2="436" y2="145" class="br" stroke="#94a3b8"/>\n  <line x1="420" y1="175" x2="436" y2="175" class="br" stroke="#94a3b8"/>\n  <text x="428" y="157" fill="#94a3b8" class="lbl" text-anchor="middle">\n    <tspan x="428" dy="0">接</tspan><tspan x="428" dy="11">收</tspan>\n  </text>\n</svg>',
        },
        {
          id: 'kb-stop-wait-basics-4',
          type: 'paragraph',
          text: '从时序图可见，帧 0 发完后发送方空闲等待一整个 RTT 才收到 ACK，收到 ACK 后立即发送帧 1。帧间的大段空闲就是停止等待利用率低的根本原因。',
        },
        {
          id: 'kb-stop-wait-basics-5',
          type: 'formula',
          formula: String.raw`U = \frac{T_{\text{发送}}}{T_{\text{发送}} + RTT} \approx \frac{T_s}{T_s + 2 \times T_p}`,
        },
        {
          id: 'kb-stop-wait-basics-6',
          type: 'paragraph',
          text: String.raw`$T_{\text{发送}}$ 为帧的发送时延（$\frac{\text{帧长}}{\text{数据率}}$），$T_p$ 为单程传播时延，$RTT = 2T_p$（忽略确认帧和处理时延）。分母是整个发送周期，不是单帧发送时延。`,
        },
        {
          id: 'kb-stop-wait-basics-7',
          type: 'paragraph',
          text: String.raw`**例** 帧长 $8000\ \text{bit}$，数据率 $1\ \text{Mb/s}$，$T_p = 10\ \text{ms}$。则 $T_s = 8000 / 10^6 = 8\ \text{ms}$，$U = 8 / (8 + 20) \approx 28.6\%$。`,
        },
        {
          id: 'kb-stop-wait-basics-8',
          type: 'callout',
          title: 'RTT 远大于发送时延时利用率极低',
          text: String.raw`信道利用率 $\propto$ 帧长。帧越短、距离越远，利用率越低。滑动窗口协议通过一次发多个帧来解决这个问题。`,
          tone: 'orange',
        },
      ],
    },
    {
      id: 'stop-wait-reliability',
      title: '停止等待协议的差错处理',
      blocks: [
        {
          id: 'kb-stop-wait-rel-1',
          type: 'paragraph',
          text: '停止等待协议通过超时重传和帧序号两个机制，处理三种常见的异常情况。',
        },
        {
          id: 'kb-stop-wait-rel-2',
          type: 'paragraph',
          text: '1. **帧丢失**——数据帧在传输中丢失，接收方根本没收到。发送方在发出帧后启动超时定时器，若定时器到期仍未收到 ACK，则重发该帧。定时器的时限应略大于 RTT，否则正常 ACK 还在路上就误触发重传。\n\n2. **ACK 丢失**——确认帧丢失，发送方收不到 ACK。发送方超时后重发数据帧。接收方因为已收到过该帧（重复帧），丢弃帧但重发 ACK——接收方必须确认每一个正确收到的帧，即使它是重复的，否则发送方永远收不到 ACK。\n\n3. **ACK 出错**——确认帧在传输中损坏，发送方无法辨认。发送方直接忽略此 ACK，等待超时后重发数据帧，流程同帧丢失。',
        },
        {
          id: 'kb-stop-wait-rel-3',
          type: 'paragraph',
          text: '三种情况的处理归结为同一套逻辑：发送方超时就重传。接收方靠帧序号区分新帧和重传帧（1 bit 序号，0 和 1 交替），重复帧丢弃但重发 ACK。',
        },
        {
          id: 'kb-stop-wait-rel-4',
          type: 'callout',
          title: '接收方收到重复帧时必须重发 ACK',
          text: '如果接收方收到重复帧后只丢弃不确认，发送方会反复超时重传同一个帧，协议卡死。接收方每收到一个帧都要确认，无论是不是新帧。',
          tone: 'orange',
        },
        {
          id: 'kb-stop-wait-rel-5',
          type: 'callout',
          title: '超时定时器时限不能太短',
          text: '定时器时限小于 RTT 会导致发送方刚发出帧、ACK 还在路上就误判超时，引发不必要的重传。通常取略大于最坏情况的 RTT。',
          tone: 'blue',
        },
      ],
    },
  ],
}
