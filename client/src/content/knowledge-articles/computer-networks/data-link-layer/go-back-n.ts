import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'
import { gbnErrorControlAnimation } from '@/animations/computer-networks/data-link-layer/go-back-n/error-control'

export const goBackNArticle: KnowledgeArticleData = {
  pointId: 'kp-gbn',
  subpoints: [
    {
      id: 'gbn-numbering',
      title: '帧编号与窗口大小',
      blocks: [
        {
          id: 'kb-gbn-num-1',
          type: 'paragraph',
          text: 'GBN 为每个帧分配一个序号。若序号字段占 n bit，共有 $2^n$ 个不同序号（0 到 $2^n-1$）。序号循环使用——发完 $2^n-1$ 后下一帧又从 0 开始。',
        },
        {
          id: 'kb-gbn-num-2',
          type: 'paragraph',
          text: String.raw`发送窗口大小 $W_t$ 必须满足 $W_t \leq 2^n - 1$。留一个序号不进窗口，是为了让接收方区分上一轮迟到重传的旧帧和下一轮的新帧。如果窗口占满全部 $2^n$ 个序号，序号 0 可能同时出现在两个循环中，接收方无法分辨。`,
        },
        {
          id: 'kb-gbn-num-3',
          type: 'paragraph',
          text: '接收窗口大小始终为 1，接收方只接受当前期望序号的帧。收到的帧序号与期望序号匹配就收下并窗口前移，不匹配（失序或重复）就丢弃。接收方不缓存失序帧，必须按序交付。',
        },
        {
          id: 'kb-gbn-num-4',
          type: 'paragraph',
          text: '接收方采用累计确认：ACK n 表示期望收到帧 n，即序号 n-1 及之前所有帧均已正确收到。累计确认使发送窗口可以一次向前滑动多格，收到 ACK 5 意味着 0 到 4 号帧全部确认，窗口基序号直接跳到 5。',
        },
      ],
    },
    {
      id: 'gbn-process',
      title: '协议过程与信道利用率',
      blocks: [
        {
          id: 'kb-gbn-proc-1',
          type: 'paragraph',
          text: '发送方维护发送窗口 $[base, base+W_t-1]$。只要窗口内有未发送的序号，发送方就可以连续发出帧，不需要每发一帧就停下来等 ACK，即流水线发送，也是 GBN 相比停止等待的改进。',
        },
        {
          id: 'kb-gbn-proc-2',
          type: 'html',
          html: `<svg viewBox="0 0 530 360" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { font-family: system-ui, sans-serif; }
    .hdr { font-size: 13px; font-weight: 700; fill: #1e293b; }
    .lbl { font-size: 10px; font-weight: 600; }
    .dim { font-size: 10px; fill: #64748b; }
    .tl  { stroke: #1e293b; stroke-width: 1.5; }
    .br  { stroke-width: 1.2; fill: none; }
    .cyc { stroke: #059669; stroke-width: 1.4; stroke-dasharray: 4,3; fill: none; }
  </style>

  <line x1="100" y1="48" x2="100" y2="345" class="tl"/>
  <line x1="420" y1="48" x2="420" y2="345" class="tl"/>
  <text x="100" y="32" class="hdr" text-anchor="middle">发送方</text>
  <text x="420" y="32" class="hdr" text-anchor="middle">接收方</text>

  <polygon points="100,70 420,120 420,138 100,88" fill="#dbeafe" fill-opacity="0.6" stroke="#2563eb" stroke-width="1.5"/>
  <text x="260" y="108" class="hdr" fill="#2563eb" text-anchor="middle">帧 0</text>

  <polygon points="100,88 420,138 420,156 100,106" fill="#dbeafe" fill-opacity="0.6" stroke="#2563eb" stroke-width="1.5"/>
  <text x="260" y="126" class="hdr" fill="#2563eb" text-anchor="middle">帧 1</text>

  <polygon points="100,106 420,156 420,174 100,124" fill="#dbeafe" fill-opacity="0.6" stroke="#2563eb" stroke-width="1.5"/>
  <text x="260" y="144" class="hdr" fill="#2563eb" text-anchor="middle">帧 2</text>

  <polygon points="100,124 420,174 420,192 100,142" fill="#dbeafe" fill-opacity="0.6" stroke="#2563eb" stroke-width="1.5"/>
  <text x="260" y="162" class="hdr" fill="#2563eb" text-anchor="middle">帧 3</text>

  <line x1="84" y1="70" x2="100" y2="70" class="br" stroke="#2563eb"/>
  <line x1="84" y1="142" x2="100" y2="142" class="br" stroke="#2563eb"/>
  <line x1="84" y1="70" x2="84" y2="142" class="br" stroke="#2563eb"/>
  <text x="76" y="76" fill="#2563eb" class="lbl" text-anchor="middle" dominant-baseline="middle">窗</text>
  <text x="76" y="88" fill="#2563eb" class="lbl" text-anchor="middle" dominant-baseline="middle">口</text>
  <text x="76" y="100" fill="#2563eb" class="lbl" text-anchor="middle" dominant-baseline="middle">连</text>
  <text x="76" y="112" fill="#2563eb" class="lbl" text-anchor="middle" dominant-baseline="middle">续</text>
  <text x="76" y="124" fill="#2563eb" class="lbl" text-anchor="middle" dominant-baseline="middle">发</text>
  <text x="76" y="136" fill="#2563eb" class="lbl" text-anchor="middle" dominant-baseline="middle">送</text>

  <line x1="50" y1="70" x2="100" y2="70" class="cyc"/>
  <line x1="50" y1="192" x2="100" y2="192" class="cyc"/>
  <line x1="50" y1="70" x2="50" y2="192" class="cyc"/>
  <text x="42" y="95" fill="#059669" class="lbl" text-anchor="middle" dominant-baseline="middle">一</text>
  <text x="42" y="107" fill="#059669" class="lbl" text-anchor="middle" dominant-baseline="middle">个</text>
  <text x="42" y="119" fill="#059669" class="lbl" text-anchor="middle" dominant-baseline="middle">发</text>
  <text x="42" y="131" fill="#059669" class="lbl" text-anchor="middle" dominant-baseline="middle">送</text>
  <text x="42" y="143" fill="#059669" class="lbl" text-anchor="middle" dominant-baseline="middle">周</text>
  <text x="42" y="155" fill="#059669" class="lbl" text-anchor="middle" dominant-baseline="middle">期</text>
  <text x="42" y="173" fill="#059669" class="lbl" text-anchor="middle" dominant-baseline="middle">Ts+RTT</text>

  <polygon points="420,138 100,188 100,192 420,142" fill="#fef3c7" fill-opacity="0.7" stroke="#d97706" stroke-width="1.5"/>

  <polygon points="420,156 100,206 100,210 420,160" fill="#fef3c7" fill-opacity="0.7" stroke="#d97706" stroke-width="1.5"/>

  <polygon points="420,174 100,224 100,228 420,178" fill="#fef3c7" fill-opacity="0.7" stroke="#d97706" stroke-width="1.5"/>

  <polygon points="420,192 100,242 100,246 420,196" fill="#fef3c7" fill-opacity="0.7" stroke="#d97706" stroke-width="1.5"/>

  <polygon points="100,192 420,242 420,260 100,210" fill="#dbeafe" fill-opacity="0.6" stroke="#2563eb" stroke-width="1.5"/>
  <text x="260" y="230" class="hdr" fill="#2563eb" text-anchor="middle">帧 4</text>

  <polygon points="100,210 420,260 420,278 100,228" fill="#dbeafe" fill-opacity="0.6" stroke="#2563eb" stroke-width="1.5"/>
  <text x="260" y="248" class="hdr" fill="#2563eb" text-anchor="middle">帧 5</text>

  <line x1="260" y1="295" x2="260" y2="325" stroke="#64748b" stroke-width="1.5" stroke-dasharray="3,3"/>
  <polygon points="260,329 253,317 267,317" fill="#64748b"/>
  <text x="260" y="340" class="dim" text-anchor="middle">窗口持续滑动继续发…</text>

  <line x1="420" y1="120" x2="436" y2="120" class="br" stroke="#94a3b8"/>
  <line x1="420" y1="278" x2="436" y2="278" class="br" stroke="#94a3b8"/>
  <line x1="436" y1="120" x2="436" y2="278" class="br" stroke="#94a3b8"/>
  <text x="446" y="181" fill="#94a3b8" class="lbl" text-anchor="middle" dominant-baseline="middle">按</text>
  <text x="446" y="193" fill="#94a3b8" class="lbl" text-anchor="middle" dominant-baseline="middle">序</text>
  <text x="446" y="205" fill="#94a3b8" class="lbl" text-anchor="middle" dominant-baseline="middle">接</text>
  <text x="446" y="217" fill="#94a3b8" class="lbl" text-anchor="middle" dominant-baseline="middle">收</text>
</svg>`,
        },
        {
          id: 'kb-gbn-proc-2b',
          type: 'paragraph',
          text: String.raw`蓝色数据帧在发送侧是**一整条连续蓝块**：帧 0 的最后一位离开发送方的瞬间，帧 1 的第一位立刻进入，首尾完全衔接、不留白，这才是真正的流水线连续发送。

橙色 ACK 从接收侧每个帧接收完毕的位置立刻出发、没有停顿。发送方收到 ACK1 的瞬间窗口滑动，帧 4 的第一位立刻发出，衔接到位。

绿色虚线括号标注的"一个发送周期 = $T_s + RTT$"，就是利用率公式里分母的来源。`,
        },
        {
          id: 'kb-gbn-proc-3',
          type: 'formula',
          formula: String.raw`U = \min\!\left(1,\ \frac{W_t \times T_s}{T_s + RTT}\right)`,
        },
        {
          id: 'kb-gbn-proc-4',
          type: 'paragraph',
          text: String.raw`分子 $W_t \times T_s$ 是一个窗口内所有帧的发送时延之和，分母 $T_s + RTT$ 是第一帧发完到其 ACK 返回的时间。

1. 发送窗口足够大（$W_t \times T_s \geq T_s + RTT$）：发送方连续发送不停歇，利用率达 100%。
2. 窗口不够大：发送方发完窗口内的帧后仍要等待 ACK，利用率低于 100%。`,
        },
        {
          id: 'kb-gbn-proc-5',
          type: 'paragraph',
          text: String.raw`**例** $W_t = 4$，$T_s = 2\ \text{ms}$，$RTT = 20\ \text{ms}$。则 $U = \min(1,\ 4 \times 2 / (2+20)) = \min(1,\ 8/22) \approx 36.4\%$。虽然比停止等待高，但窗口太小仍无法填满 RTT。`,
        },
      ],
    },
    {
      id: 'gbn-error',
      title: 'GBN 协议的差错处理',
      blocks: [
        {
          id: 'kb-gbn-err-1',
          type: 'paragraph',
          text: '发送方为每个发出的帧设置超时定时器。若超时未收到 ACK，发送方后退到超时帧的序号，重发从该序号开始、窗口内所有已发送但未确认的帧，这也是"后退 N 帧"名称的由来。',
        },
        {
          id: 'kb-gbn-err-anim',
          type: 'animation',
          animation: gbnErrorControlAnimation,
          sourceImport: {
            path: '@/animations/computer-networks/data-link-layer/go-back-n/error-control',
            localName: 'gbnErrorControlAnimation',
            kind: 'named',
          },
        },
        {
          id: 'kb-gbn-err-2',
          type: 'html',
          html: `<svg viewBox="0 0 530 460" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { font-family: system-ui, sans-serif; }
    .hdr { font-size: 13px; font-weight: 700; fill: #1e293b; }
    .lbl { font-size: 10px; font-weight: 600; }
    .dim { font-size: 10px; fill: #64748b; }
    .tl  { stroke: #1e293b; stroke-width: 1.5; }
    .br  { stroke-width: 1.2; fill: none; }
  </style>

  <line x1="100" y1="48" x2="100" y2="445" class="tl"/>
  <line x1="420" y1="48" x2="420" y2="445" class="tl"/>
  <text x="100" y="32" class="hdr" text-anchor="middle">发送方</text>
  <text x="420" y="32" class="hdr" text-anchor="middle">接收方</text>

  <polygon points="100,70 420,120 420,138 100,88" fill="#dbeafe" fill-opacity="0.6" stroke="#2563eb" stroke-width="1.5"/>
  <text x="260" y="108" class="hdr" fill="#2563eb" text-anchor="middle">帧 0</text>
  <polygon points="100,88 420,138 420,156 100,106" fill="#dbeafe" fill-opacity="0.6" stroke="#2563eb" stroke-width="1.5"/>
  <text x="260" y="126" class="hdr" fill="#2563eb" text-anchor="middle">帧 1</text>
  <polygon points="100,106 420,156 420,174 100,124" fill="#dbeafe" fill-opacity="0.6" stroke="#2563eb" stroke-width="1.5"/>
  <text x="260" y="144" class="hdr" fill="#2563eb" text-anchor="middle">帧 2</text>

  <polygon points="420,138 100,188 100,192 420,142" fill="#fef3c7" fill-opacity="0.7" stroke="#d97706" stroke-width="1.5"/>

  <polygon points="420,156 260,188 260,192 420,160" fill="#fecaca" fill-opacity="0.25" stroke="#dc2626" stroke-width="1.5" stroke-dasharray="5,3"/>
  <text x="270" y="196" class="dim" fill="#dc2626" text-anchor="start">ACK2 ✗</text>

  <polygon points="420,174 300,206 300,210 420,178" fill="#fecaca" fill-opacity="0.25" stroke="#dc2626" stroke-width="1.5" stroke-dasharray="5,3"/>
  <text x="310" y="214" class="dim" fill="#dc2626" text-anchor="start">ACK3 ✗</text>

  <line x1="88" y1="268" x2="440" y2="268" stroke="#dc2626" stroke-width="1" stroke-dasharray="4,3"/>
  <text x="448" y="272" class="dim" fill="#dc2626" text-anchor="start">帧 1 超时</text>

  <polygon points="100,284 420,334 420,352 100,302" fill="#dbeafe" fill-opacity="0.6" stroke="#2563eb" stroke-width="1.5"/>
  <text x="260" y="322" class="hdr" fill="#2563eb" text-anchor="middle">重传帧 1</text>
  <polygon points="100,302 420,352 420,370 100,320" fill="#dbeafe" fill-opacity="0.6" stroke="#2563eb" stroke-width="1.5"/>
  <text x="260" y="340" class="hdr" fill="#2563eb" text-anchor="middle">重传帧 2</text>

  <polygon points="420,370 100,420 100,424 420,374" fill="#fef3c7" fill-opacity="0.7" stroke="#d97706" stroke-width="1.5"/>
  <text x="260" y="414" class="dim" fill="#d97706" text-anchor="middle">ACK3（累计确认 0~2）</text>

  <line x1="84" y1="284" x2="100" y2="284" class="br" stroke="#dc2626"/>
  <line x1="84" y1="320" x2="100" y2="320" class="br" stroke="#dc2626"/>
  <line x1="84" y1="284" x2="84" y2="320" class="br" stroke="#dc2626"/>
  <text x="76" y="287" fill="#dc2626" class="lbl" text-anchor="middle" dominant-baseline="middle" style="font-size:8px">后</text>
  <text x="76" y="297" fill="#dc2626" class="lbl" text-anchor="middle" dominant-baseline="middle" style="font-size:8px">退</text>
  <text x="76" y="307" fill="#dc2626" class="lbl" text-anchor="middle" dominant-baseline="middle" style="font-size:8px">重</text>
  <text x="76" y="317" fill="#dc2626" class="lbl" text-anchor="middle" dominant-baseline="middle" style="font-size:8px">传</text>
</svg>`,
        },
        {
          id: 'kb-gbn-err-2b',
          type: 'paragraph',
          text: '这是 ACK 丢失的场景。帧 0、1、2 都顺利到达接收方，接收方也正常回了 ACK1、ACK2、ACK3，但 ACK2 和 ACK3 在返回途中丢失（图中红色虚线中断处）。\n\n发送方只收到 ACK1，一直等不到 ACK2，超时后从帧 1 开始重传，把 1 和 2 再发一遍。接收方收到重复的帧直接丢弃，但会再回一个累计 ACK3，告诉发送方 0 到 2 号帧都已收到。',
        },
        {
          id: 'kb-gbn-err-3',
          type: 'html',
          html: `<svg viewBox="0 0 530 460" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { font-family: system-ui, sans-serif; }
    .hdr { font-size: 13px; font-weight: 700; fill: #1e293b; }
    .lbl { font-size: 10px; font-weight: 600; }
    .dim { font-size: 10px; fill: #64748b; }
    .tl  { stroke: #1e293b; stroke-width: 1.5; }
    .br  { stroke-width: 1.2; fill: none; }
  </style>

  <line x1="100" y1="48" x2="100" y2="445" class="tl"/>
  <line x1="420" y1="48" x2="420" y2="445" class="tl"/>
  <text x="100" y="32" class="hdr" text-anchor="middle">发送方</text>
  <text x="420" y="32" class="hdr" text-anchor="middle">接收方</text>

  <polygon points="100,70 420,120 420,138 100,88" fill="#dbeafe" fill-opacity="0.6" stroke="#2563eb" stroke-width="1.5"/>
  <text x="260" y="108" class="hdr" fill="#2563eb" text-anchor="middle">帧 0</text>

  <polygon points="100,88 300,118 300,136 100,106" fill="#fecaca" fill-opacity="0.3" stroke="#dc2626" stroke-width="1.5" stroke-dasharray="5,3"/>
  <text x="200" y="116" class="hdr" fill="#dc2626" text-anchor="middle">帧 1</text>
  <text x="310" y="128" class="dim" fill="#dc2626" text-anchor="start">✗ 丢失</text>

  <polygon points="100,106 420,156 420,174 100,124" fill="#dbeafe" fill-opacity="0.6" stroke="#2563eb" stroke-width="1.5"/>
  <text x="260" y="144" class="hdr" fill="#2563eb" text-anchor="middle">帧 2</text>

  <polygon points="100,124 420,174 420,192 100,142" fill="#dbeafe" fill-opacity="0.6" stroke="#2563eb" stroke-width="1.5"/>
  <text x="260" y="162" class="hdr" fill="#2563eb" text-anchor="middle">帧 3</text>

  <polygon points="420,138 100,188 100,192 420,142" fill="#fef3c7" fill-opacity="0.7" stroke="#d97706" stroke-width="1.5"/>

  <polygon points="420,174 100,224 100,228 420,178" fill="#fef3c7" fill-opacity="0.7" stroke="#d97706" stroke-width="1.5"/>
  <text x="260" y="206" class="dim" fill="#d97706" text-anchor="middle">ACK1（丢弃帧2）</text>

  <polygon points="420,192 100,242 100,246 420,196" fill="#fef3c7" fill-opacity="0.7" stroke="#d97706" stroke-width="1.5"/>
  <text x="260" y="224" class="dim" fill="#d97706" text-anchor="middle">ACK1（丢弃帧3）</text>

  <line x1="420" y1="138" x2="436" y2="138" class="br" stroke="#d97706"/>
  <line x1="420" y1="246" x2="436" y2="246" class="br" stroke="#d97706"/>
  <line x1="436" y1="138" x2="436" y2="246" class="br" stroke="#d97706"/>
  <text x="446" y="171" fill="#d97706" class="lbl" text-anchor="middle" dominant-baseline="middle">反</text>
  <text x="446" y="185" fill="#d97706" class="lbl" text-anchor="middle" dominant-baseline="middle">复</text>
  <text x="446" y="199" fill="#d97706" class="lbl" text-anchor="middle" dominant-baseline="middle">回</text>
  <text x="446" y="213" fill="#d97706" class="lbl" text-anchor="middle" dominant-baseline="middle">ACK1</text>

  <line x1="88" y1="270" x2="440" y2="270" stroke="#dc2626" stroke-width="1" stroke-dasharray="4,3"/>
  <text x="448" y="274" class="dim" fill="#dc2626" text-anchor="start">帧 1 超时</text>

  <polygon points="100,286 420,336 420,354 100,304" fill="#dbeafe" fill-opacity="0.6" stroke="#2563eb" stroke-width="1.5"/>
  <text x="260" y="324" class="hdr" fill="#2563eb" text-anchor="middle">重传帧 1</text>
  <polygon points="100,304 420,354 420,372 100,322" fill="#dbeafe" fill-opacity="0.6" stroke="#2563eb" stroke-width="1.5"/>
  <text x="260" y="342" class="hdr" fill="#2563eb" text-anchor="middle">重传帧 2</text>
  <polygon points="100,322 420,372 420,390 100,340" fill="#dbeafe" fill-opacity="0.6" stroke="#2563eb" stroke-width="1.5"/>
  <text x="260" y="360" class="hdr" fill="#2563eb" text-anchor="middle">重传帧 3</text>

  <polygon points="420,390 100,440 100,444 420,394" fill="#fef3c7" fill-opacity="0.7" stroke="#d97706" stroke-width="1.5"/>
  <text x="260" y="434" class="dim" fill="#d97706" text-anchor="middle">ACK4（累计确认 0~3）</text>

  <line x1="84" y1="70" x2="100" y2="70" class="br" stroke="#2563eb"/>
  <line x1="84" y1="142" x2="100" y2="142" class="br" stroke="#2563eb"/>
  <line x1="84" y1="70" x2="84" y2="142" class="br" stroke="#2563eb"/>

  <line x1="84" y1="286" x2="100" y2="286" class="br" stroke="#dc2626"/>
  <line x1="84" y1="340" x2="100" y2="340" class="br" stroke="#dc2626"/>
  <line x1="84" y1="286" x2="84" y2="340" class="br" stroke="#dc2626"/>
</svg>`,
        },
        {
          id: 'kb-gbn-err-3b',
          type: 'paragraph',
          text: '上图是帧 1 在传输途中丢失的情景，接收方始终没收到期望的帧 1。帧 2、帧 3 虽然都正确到达，但序号与期望不符，接收窗口为 1，直接丢弃，并反复回 ACK1。\n\n发送方因迟迟收不到 ACK2 而超时，后退到帧 1 重传 1、2、3。这次接收方按序收到，最终用一条 ACK4 累计确认全部。',
        },
        {
          id: 'kb-gbn-err-4',
          type: 'paragraph',
          text: '接收方收到失序帧时直接丢弃，不缓存。即便失序帧本身正确到达（如上面的帧 2、帧 3），只要前面的帧没到，就会被丢弃。GBN 接收方只需一个缓冲区，不排序、不暂存。',
        },
        {
          id: 'kb-gbn-err-5',
          type: 'paragraph',
          text: '一次丢帧可能导致多个已正确到达的帧被重传（因为接收方丢弃了它们）。窗口越大、误码率越高，重传代价越大。',
        },
      ],
    },
  ],
}
