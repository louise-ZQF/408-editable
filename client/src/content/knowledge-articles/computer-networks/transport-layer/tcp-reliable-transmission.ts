import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const tcpReliableArticle: KnowledgeArticleData = {
  pointId: 'kp-tcp-reliable',
  subpoints: [
    {
      id: 'tcp-rel-seq',
      title: 'TCP的序号',
      blocks: [
        {
          id: 'kb-tcp-rel-seq-1',
          type: 'paragraph',
          text: 'TCP 的序号是**按字节**编号的，不是按报文段编号。每个报文段里的 seq 字段表示"本报文段携带的数据中第一个字节的编号"。确认号 ack 表示"期望收到的下一个字节的编号"，等价于"ack - 1 及之前的所有字节都已正确收到"。',
        },
        {
          id: 'kb-tcp-rel-seq-2',
          type: 'paragraph',
          text: '序号的作用在可靠传输里体现在 3 件事上：',
        },
        {
          id: 'kb-tcp-rel-seq-3',
          type: 'paragraph',
          text: '**① 去重**：网络里如果某个报文段被复制了，或超时重传又和原来的都到达，接收方可以根据序号判断"这个字节我已经收到过了"，直接丢重复的。',
        },
        {
          id: 'kb-tcp-rel-seq-4',
          type: 'paragraph',
          text: '**② 排序**：IP 网络不保证按序到达，后发的报文段可能先到。接收方把到达的字节按序号排好，缺的先留在接收缓冲里，等缺失的字节到齐了再一起交给应用，保证应用看到的是按序字节流。',
        },
        {
          id: 'kb-tcp-rel-seq-5',
          type: 'paragraph',
          text: '**③ 确认**：接收方用确认号 ack 告诉发送方"我已经收到哪了"。发送方知道哪些序号范围内的字节已经确认，就可以把这些字节从发送缓冲里清掉。',
        },
        {
          id: 'kb-tcp-rel-seq-6',
          type: 'callout',
          title: 'SYN/FIN 占序号，纯 ACK 不占',
          text: '第一次握手中的 SYN 和 FIN 即使不携带任何数据也要消耗 1 个序号。一个纯 ACK（没有数据、没有 SYN/FIN）不消耗任何序号，对方不需要对它再做确认。',
          tone: 'orange',
        },
      ],
    },
    {
      id: 'tcp-rel-cumulative-ack',
      title: '累计确认与捎带确认',
      blocks: [
        {
          id: 'kb-tcp-rel-ack-1',
          type: 'paragraph',
          text: 'TCP 的确认是累计确认：ACK n 表示 n - 1 及之前的所有字节都已正确收到。如果确认号是 2001，就意味着 1 到 2000 这 2000 个字节接收方都有了，下一个想要的是 2001 号字节。',
        },
        {
          id: 'kb-tcp-rel-ack-2',
          type: 'paragraph',
          text: '累计确认的好处：哪怕中间某些 ACK 丢了，只要后面有一个更大编号的 ACK 到达发送方，前面那些字节也就"相当于都确认了"。比如 ACK1001 丢了，但后面 ACK2001 到了，就说明 1 到 2000 都收到了，发送方不需要关心 ACK1001 到没到。',
        },
        {
          id: 'kb-tcp-rel-ack-3',
          type: 'html',
          html: `<svg viewBox="0 0 800 300" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { font-family: system-ui, sans-serif; }
    .title { font-size: 14px; font-weight: 700; fill: #0f172a; text-anchor: middle; }
    .node { font-size: 12px; font-weight: 700; text-anchor: middle; }
    .bar-text { font-size: 11px; font-weight: 700; fill: white; text-anchor: middle; }
    .ack1 { font-size: 11px; font-weight: 700; fill: #166534; text-anchor: middle; }
    .range { stroke: #dc2626; stroke-width: 1.6; fill: none; stroke-dasharray: 5,3; }
  </style>
  <defs>
    <marker id="arrR" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#1d4ed8"/></marker>
    <marker id="arrG" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#166534"/></marker>
  </defs>

  <text x="400" y="22" class="title">累计确认示意：ACK 2001 说明 1~2000 字节全部收到</text>
  <text x="120" y="46" class="node">发送方</text>
  <text x="680" y="46" class="node">接收方</text>
  <line x1="120" y1="54" x2="120" y2="270" stroke="#334155" stroke-width="1.6"/>
  <line x1="680" y1="54" x2="680" y2="270" stroke="#334155" stroke-width="1.6"/>

  <!-- 段1：1-1000 -->
  <line x1="120" y1="70" x2="680" y2="90" stroke="#1d4ed8" stroke-width="1.8" marker-end="url(#arrR)"/>
  <rect x="160" y="64" width="120" height="16" rx="3" fill="#3b82f6"/>
  <text x="220" y="76" class="bar-text">字节 1~1000</text>

  <!-- ACK1001 -->
  <line x1="680" y1="110" x2="120" y2="130" stroke="#166534" stroke-width="1.6" stroke-dasharray="6,3" marker-end="url(#arrG)"/>
  <text x="400" y="110" class="ack1">ACK=1001  ← (这个 ACK 在网络中丢失)</text>

  <!-- 段2：1001-2000 -->
  <line x1="120" y1="150" x2="680" y2="170" stroke="#1d4ed8" stroke-width="1.8" marker-end="url(#arrR)"/>
  <rect x="160" y="144" width="140" height="16" rx="3" fill="#3b82f6"/>
  <text x="230" y="156" class="bar-text">字节 1001~2000</text>

  <!-- ACK2001 -->
  <line x1="680" y1="190" x2="120" y2="210" stroke="#166534" stroke-width="2.2" marker-end="url(#arrG)"/>
  <text x="400" y="188" class="ack1" fill="#15803d" font-size="13">ACK=2001  ✓</text>

  <!-- 累计确认范围 -->
  <rect x="46" y="232" width="708" height="30" rx="4" class="range"/>
  <text x="400" y="252" font-size="12" font-weight="700" fill="#b91c1c" text-anchor="middle">
    发送方只收到 ACK2001，就已经知道 1~2000 这 2000 个字节全部被正确接收 —— 这就是累计确认
  </text>
</svg>`,
        },
        {
          id: 'kb-tcp-rel-ack-4',
          type: 'paragraph',
          text: '捎带确认（Piggybacking）：如果接收方收到对方数据后，恰好本端也有数据要反方向发，就把 ACK 字段顺带塞进自己的数据报文段里，不用单独发一个纯 ACK 报文。这样省去一个报文，提高信道利用率。',
        },
        {
          id: 'kb-tcp-rel-ack-5',
          type: 'html',
          html: `<svg viewBox="0 0 800 430" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { font-family: system-ui, sans-serif; }
    .title { font-size: 15px; font-weight: 700; fill: #0f172a; text-anchor: middle; }
    .subtitle { font-size: 12px; font-weight: 700; fill: #334155; text-anchor: middle; }
    .node { font-size: 12px; font-weight: 700; text-anchor: middle; }
    .label { font-size: 11px; font-weight: 700; fill: #1e40af; text-anchor: middle; }
    .labelG { font-size: 11px; font-weight: 700; fill: #166534; text-anchor: middle; }
    .bar { fill: #3b82f6; }
    .barAck { fill: #22c55e; }
    .barPig { fill: #8b5cf6; }
  </style>
  <defs>
    <marker id="bB" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#1d4ed8"/></marker>
    <marker id="bG" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#166534"/></marker>
    <marker id="bP" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#7c3aed"/></marker>
  </defs>

  <text x="400" y="24" class="title">捎带确认：把 ACK 塞进反向数据报文段，省掉单独的 ACK</text>

  <!-- ===== 左半：单独发 ACK（不用捎带） ===== -->
  <text x="195" y="52" class="subtitle">❌ 单独发 ACK（浪费一个报文）</text>
  <text x="70" y="70" class="node">A</text>
  <text x="330" y="70" class="node">B</text>
  <line x1="70" y1="78" x2="70" y2="220" stroke="#334155" stroke-width="1.4"/>
  <line x1="330" y1="78" x2="330" y2="220" stroke="#334155" stroke-width="1.4"/>

  <!-- A 发数据 -->
  <line x1="70" y1="90" x2="330" y2="106" stroke="#1d4ed8" stroke-width="1.6" marker-end="url(#bB)"/>
  <rect x="90" y="86" width="60" height="14" rx="3" class="bar"/>
  <text x="120" y="97" font-size="10" font-weight="700" fill="#fff" text-anchor="middle">数据</text>
  <text x="200" y="92" font-size="10" fill="#1e40af" text-anchor="middle" font-weight="700">① B 收到数据</text>

  <!-- B 回纯 ACK -->
  <line x1="330" y1="120" x2="70" y2="136" stroke="#166534" stroke-width="1.6" marker-end="url(#bG)"/>
  <rect x="90" y="132" width="46" height="14" rx="3" class="barAck"/>
  <text x="113" y="143" font-size="10" font-weight="700" fill="#fff" text-anchor="middle">ACK</text>
  <text x="200" y="128" font-size="10" fill="#166534" text-anchor="middle" font-weight="700">② B 单独回 ACK（数据没来，白发一次）</text>

  <!-- B 再发数据 -->
  <line x1="330" y1="160" x2="70" y2="176" stroke="#1d4ed8" stroke-width="1.6" marker-end="url(#bB)"/>
  <rect x="90" y="172" width="60" height="14" rx="3" class="bar"/>
  <text x="120" y="183" font-size="10" font-weight="700" fill="#fff" text-anchor="middle">数据</text>
  <text x="200" y="172" font-size="10" fill="#1e40af" text-anchor="middle" font-weight="700">③ B 有数据要发，再发一个数据报文段</text>

  <!-- ===== 右半：捎带确认 ===== -->
  <text x="605" y="52" class="subtitle">✅ 捎带确认（一个报文搞定）</text>
  <text x="470" y="70" class="node">A</text>
  <text x="730" y="70" class="node">B</text>
  <line x1="470" y1="78" x2="470" y2="220" stroke="#334155" stroke-width="1.4"/>
  <line x1="730" y1="78" x2="730" y2="220" stroke="#334155" stroke-width="1.4"/>

  <!-- A 发数据 -->
  <line x1="470" y1="90" x2="730" y2="106" stroke="#1d4ed8" stroke-width="1.6" marker-end="url(#bB)"/>
  <rect x="490" y="86" width="60" height="14" rx="3" class="bar"/>
  <text x="520" y="97" font-size="10" font-weight="700" fill="#fff" text-anchor="middle">数据</text>
  <text x="600" y="92" font-size="10" fill="#1e40af" text-anchor="middle" font-weight="700">① B 收到数据</text>

  <!-- B 反向数据 + 捎带 ACK -->
  <line x1="730" y1="120" x2="470" y2="150" stroke="#7c3aed" stroke-width="2" marker-end="url(#bP)"/>
  <rect x="490" y="136" width="78" height="16" rx="3" class="barPig"/>
  <text x="529" y="148" font-size="10" font-weight="700" fill="#fff" text-anchor="middle">数据 + ACK</text>
  <text x="600" y="130" font-size="10" fill="#7c3aed" text-anchor="middle" font-weight="700">② B 恰好有数据要发，把 ACK 捎带上</text>
  <text x="600" y="186" font-size="11" font-weight="700" fill="#7c3aed" text-anchor="middle">一个报文段 = 数据 + ACK，少发一次</text>

  <!-- 底部总结 -->
  <rect x="20" y="240" width="760" height="40" rx="5" fill="#f5f3ff" stroke="#7c3aed" stroke-width="1.4"/>
  <text x="400" y="265" font-size="12" font-weight="700" fill="#6d28d9" text-anchor="middle">
    单独发：数据、纯 ACK、数据 = 3 个报文段；捎带：数据、数据+ACK = 2 个报文段
  </text>

  <!-- 报文段示意图 -->
  <text x="400" y="315" font-size="13" font-weight="700" fill="#0f172a" text-anchor="middle">报文段内部：ACK 是首部里的一个字段，不是单独的一部分</text>
  <rect x="120" y="330" width="200" height="40" rx="4" fill="#dbeafe" stroke="#3b82f6" stroke-width="1.5"/>
  <text x="220" y="355" font-size="11" font-weight="700" fill="#1e40af" text-anchor="middle">首部（含 ACK 字段）</text>
  <rect x="320" y="330" width="360" height="40" rx="4" fill="#dcfce7" stroke="#16a34a" stroke-width="1.5"/>
  <text x="500" y="355" font-size="11" font-weight="700" fill="#166534" text-anchor="middle">数据</text>
  <text x="400" y="410" font-size="10" fill="#64748b" text-anchor="middle">接收方把 ack 字段填进自己数据报文段的首部，随反向数据一起发出，这就是捎带确认</text>
</svg>`,
        },
      ],
    },
    {
      id: 'tcp-rel-retrans',
      title: '超时重传和冗余 ACK 快重传',
      blocks: [
        {
          id: 'kb-tcp-rel-ret-1',
          type: 'paragraph',
          text: 'TCP 有两种方式触发重传：\n\n1. **超时重传**。\n2. 收到三个重复 ACK（冗余 ACK）触发**快重传**。\n\n408 只要求掌握它们的思想，不考具体 SRTT/RTTVAR 公式。',
        },
        {
          id: 'kb-tcp-rel-ret-2',
          type: 'paragraph',
          text: '**超时重传**：发送方为每一个已发出但未确认的报文段维护一个**重传计时器**。如果计时器到期了，对应的确认还没到，就判定报文段丢了，重传该报文段并把超时时间翻倍（"指数退避"）。',
        },
        {
          id: 'kb-tcp-rel-ret-3',
          type: 'paragraph',
          text: '超时重传最大的缺点：需要等到 RTO 超时才重传。RTO 通常比实际 RTT 大，经常几百毫秒，对于应用来说太慢。所以 TCP 还有一条更快的重传机制：**快重传**。',
        },
        {
          id: 'kb-tcp-rel-ret-4',
          type: 'paragraph',
          text: '**冗余 ACK**（Duplicate ACK）：接收方收到失序的报文段（比如前面缺了一段）时，不给失序段回确认，而是立刻再发一个"我还是想要那个缺失字节"的 ACK。这个 ACK 的序号和之前发过的 ACK 一样，就叫**冗余 ACK** 或**重复 ACK**。',
        },
        {
          id: 'kb-tcp-rel-ret-5',
          type: 'paragraph',
          text: '**快重传算法**：发送方一旦连续收到 3 个相同的冗余 ACK，就判定对应的报文段已经丢失，不必等待重传计时器超时，立刻重传那个缺失的报文段。',
        },
        {
          id: 'kb-tcp-rel-ret-6',
          type: 'html',
          html: `<svg viewBox="0 0 800 620" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { font-family: system-ui, sans-serif; }
    .title { font-size: 15px; font-weight: 700; fill: #0f172a; text-anchor: middle; }
    .node { font-size: 13px; font-weight: 700; text-anchor: middle; }
    .label { font-size: 12px; font-weight: 700; fill: #1e40af; text-anchor: middle; }
    .labelG { font-size: 12px; font-weight: 700; fill: #166534; text-anchor: middle; }
    .dup { font-size: 12px; font-weight: 700; fill: #dc2626; text-anchor: middle; }
  </style>
  <defs>
    <marker id="aB" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#1d4ed8"/></marker>
    <marker id="aG" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#166534"/></marker>
    <marker id="aR" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#dc2626"/></marker>
  </defs>
  <text x="400" y="26" class="title">快重传：收到 3 个冗余 ACK，不等超时立即重传</text>
  <text x="120" y="52" class="node">发送方</text>
  <text x="680" y="52" class="node">接收方</text>
  <line x1="120" y1="60" x2="120" y2="500" stroke="#334155" stroke-width="1.6"/>
  <line x1="680" y1="60" x2="680" y2="500" stroke="#334155" stroke-width="1.6"/>

  <!-- M1 -->
  <line x1="120" y1="84" x2="680" y2="104" stroke="#1d4ed8" stroke-width="1.8" marker-end="url(#aB)"/>
  <text x="400" y="76" class="label">M1（1-1000）✓</text>
  <line x1="680" y1="120" x2="120" y2="140" stroke="#166534" stroke-width="1.6" marker-end="url(#aG)"/>
  <text x="400" y="114" class="labelG">ACK 1001</text>

  <!-- M2 丢失 -->
  <line x1="120" y1="164" x2="400" y2="176" stroke="#dc2626" stroke-width="1.6" stroke-dasharray="6,3"/>
  <text x="260" y="156" class="dup">M2（1001-2000）✕ 丢失</text>

  <!-- M3 -->
  <line x1="120" y1="212" x2="680" y2="232" stroke="#1d4ed8" stroke-width="1.8" marker-end="url(#aB)"/>
  <text x="400" y="204" class="label">M3（2001-3000）失序</text>

  <!-- 冗余 ACK ① -->
  <line x1="680" y1="248" x2="120" y2="268" stroke="#dc2626" stroke-width="1.8" marker-end="url(#aR)"/>
  <text x="400" y="242" class="dup">冗余 ACK 1001 ①</text>

  <!-- M4 -->
  <line x1="120" y1="296" x2="680" y2="316" stroke="#1d4ed8" stroke-width="1.8" marker-end="url(#aB)"/>
  <text x="400" y="288" class="label">M4（3001-4000）失序</text>

  <!-- 冗余 ACK ② -->
  <line x1="680" y1="332" x2="120" y2="352" stroke="#dc2626" stroke-width="1.8" marker-end="url(#aR)"/>
  <text x="400" y="326" class="dup">冗余 ACK 1001 ②</text>

  <!-- M5 -->
  <line x1="120" y1="380" x2="680" y2="400" stroke="#1d4ed8" stroke-width="1.6" marker-end="url(#aB)"/>
  <text x="400" y="372" class="label">M5（4001-5000）失序</text>

  <!-- 冗余 ACK ③ -->
  <line x1="680" y1="416" x2="120" y2="436" stroke="#dc2626" stroke-width="2" marker-end="url(#aR)"/>
  <text x="400" y="410" class="dup">冗余 ACK 1001 ③ → 触发！</text>

  <!-- 快重传：放在竖线下方，不与发送方/接收方竖线重合 -->
  <rect x="20" y="530" width="760" height="52" rx="5" fill="#fef2f2" stroke="#dc2626" stroke-width="1.4"/>
  <text x="400" y="562" font-size="13" font-weight="700" fill="#991b1b" text-anchor="middle">
    快重传：不等 RTO 超时，立刻重传 M2（1001-2000）
  </text>
</svg>`,
        },
        
      ],
    },
  ],
}
