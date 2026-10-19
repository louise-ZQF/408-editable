import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const tcpThreeWayHandshakeArticle: KnowledgeArticleData = {
  pointId: 'kp-tcp-handshake',
  subpoints: [
    {
      id: 'tcp-handshake-intro',
      title: '三次握手',
      blocks: [
        {
          id: 'kb-tcp-hs-1',
          type: 'paragraph',
          text: 'TCP 建立连接的过程称为三次握手，目的是让双方确认对方收发能力正常、协商初始序号 ISN 和 MSS 等选项。',
        },
        {
          id: 'kb-tcp-hs-2',
          type: 'paragraph',
          text: '**第一次**：客户端 CLOSED → SYN-SENT。发送 SYN=1, seq=x（随机 ISN），SYN 消耗 1 个序号。',
        },
        {
          id: 'kb-tcp-hs-3',
          type: 'paragraph',
          text: '**第二次**：服务端 LISTEN → SYN-RCVD。收到 SYN 后分配 TCB，回 SYN=1, ACK=1, seq=y, ack=x+1。SYN+ACK 消耗 1 个序号。',
        },
        {
          id: 'kb-tcp-hs-4',
          type: 'paragraph',
          text: '**第三次**：客户端收到 SYN+ACK 后进入 ESTABLISHED，回 ACK=1, seq=x+1, ack=y+1。这次 ACK 可携带应用数据，不带数据则不消耗序号。服务端收到后也进入 ESTABLISHED。',
        },
        {
          id: 'kb-tcp-hs-svg',
          type: 'html',
          html: `<svg viewBox="0 0 820 470" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { font-family: system-ui, sans-serif; }
    .title { font-size: 16px; font-weight: 700; fill: #0f172a; text-anchor: middle; }
    .node { font-size: 14px; font-weight: 700; fill: #0f172a; text-anchor: middle; }
    .msg { font-size: 12px; font-weight: 700; text-anchor: middle; }
    .state { font-size: 11px; font-weight: 700; fill: #0f766e; text-anchor: middle; }
    .client-bar { fill: #0ea5e9; }
    .server-bar { fill: #10b981; }
  </style>
  <defs>
    <marker id="arrBlue" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
      <path d="M0 0 L10 5 L0 10 z" fill="#2563eb"/>
    </marker>
    <marker id="arrGreen" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
      <path d="M0 0 L10 5 L0 10 z" fill="#059669"/>
    </marker>
    <marker id="arrOrange" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
      <path d="M0 0 L10 5 L0 10 z" fill="#ea580c"/>
    </marker>
  </defs>

  <text x="410" y="26" class="title">三次握手：收到后立即回复（时间 →）</text>

  <text x="100" y="52" class="node">客户端 Client</text>
  <text x="700" y="52" class="node">服务端 Server</text>
  <line x1="100" y1="62" x2="100" y2="440" stroke="#334155" stroke-width="1.8"/>
  <line x1="700" y1="62" x2="700" y2="440" stroke="#334155" stroke-width="1.8"/>

  <!-- 初始状态 -->
  <text x="100" y="80" class="state" fill="#64748b">CLOSED</text>
  <text x="700" y="80" class="state" fill="#64748b">LISTEN</text>

  <!-- 第一次握手：客户端发① -->
  <line x1="100" y1="100" x2="700" y2="160" marker-end="url(#arrBlue)" stroke="#2563eb" stroke-width="2" fill="none"/>
  <text x="400" y="116" class="msg" fill="#1e40af">① SYN=1, seq=x（占 1 个序号）</text>
  <text x="100" y="150" class="state">SYN-SENT</text>

  <!-- 服务端收到①，立即回②（起点紧贴①的终点，间隔极小） -->
  <line x1="700" y1="166" x2="100" y2="226" marker-end="url(#arrGreen)" stroke="#059669" stroke-width="2" fill="none"/>
  <text x="400" y="182" class="msg" fill="#065f46">② SYN=1, ACK=1, seq=y, ack=x+1（占 1 个序号）</text>
  <text x="700" y="214" class="state">SYN-RCVD</text>

  <!-- 客户端收到②，立即回③（起点紧贴②的终点，间隔极小） -->
  <line x1="100" y1="232" x2="700" y2="292" marker-end="url(#arrOrange)" stroke="#ea580c" stroke-width="2" fill="none"/>
  <text x="400" y="248" class="msg" fill="#c2410c">③ ACK=1, seq=x+1, ack=y+1（不占序号）</text>

  <!-- 服务端收到③ -->
  <text x="100" y="360" class="state" fill="#1e3a8a">ESTABLISHED</text>
  <text x="700" y="360" class="state" fill="#166534">ESTABLISHED</text>

  <!-- 紧贴说明 -->
  <text x="410" y="420" font-size="11" fill="#64748b" text-anchor="middle">服务端收①后立即回②；客户端收②后立即回③ —— 中间没有处理停顿</text>
</svg>`,
        },
      ],
    },
    {
      id: 'tcp-close-four-way',
      title: '四次挥手时延图',
      blocks: [
        {
          id: 'kb-tcp-close-1',
          type: 'paragraph',
          text: 'TCP 是全双工的，两个方向要分别关闭。任一方先调用 close() 主动关，发 FIN 把本方向发送通道关掉；对方 ACK 后，等自己数据也发完再发 FIN。',
        },
        {
          id: 'kb-tcp-close-2',
          type: 'paragraph',
          text: '**第一次**：主动方 ESTABLISHED → FIN-WAIT-1。发送 FIN=1, ACK=1, seq=u, ack=k（消耗 1 个序号）。',
        },
        {
          id: 'kb-tcp-close-3',
          type: 'paragraph',
          text: '**第二次**：被动方收到 FIN 后，回 ACK=1, seq=k, ack=u+1。被动方进入 CLOSE-WAIT，主动方收到后进入 FIN-WAIT-2。此后被动方还可以继续向主动方发送剩余数据。',
        },
        {
          id: 'kb-tcp-close-4',
          type: 'paragraph',
          text: '**第三次**：被动方数据发完后调 close()，发 FIN=1, ACK=1, seq=w, ack=u+1（消耗 1 个序号）。被动方进入 LAST-ACK。',
        },
        {
          id: 'kb-tcp-close-5',
          type: 'paragraph',
          text: '**第四次**：主动方收到 FIN 后，回 ACK=1, seq=u+1, ack=w+1（不占序号）。主动方进入 TIME-WAIT 等待 2MSL 后才 CLOSED。被动方收到 ACK 后直接 CLOSED。',
        },
        {
          id: 'kb-tcp-close-6',
          type: 'paragraph',
          text: '主动关闭方要等 2MSL，有两个原因：',
        },
        {
          id: 'kb-tcp-close-7',
          type: 'paragraph',
          text: '**① 保证最后一次 ACK 能到达对方**。主动方发完最后的 ACK 后，如果这个 ACK 在网络中丢失，被动方会一直停在 LAST-ACK，反复重传它的 FIN。\n\n主动方等待至少 2MSL（一个 MSL 够 FIN 传过来，一个 MSL 够 ACK 传回去），才能等到重传的 FIN 并再补一次 ACK。如果不等就直接 CLOSED，被动方永远等不到确认，无法关闭连接。',
        },
        {
          id: 'kb-tcp-close-8',
          type: 'paragraph',
          text: '**② 让本连接的所有旧报文段在网络中消失**。MSL 是报文段在网络中的最长存活时间（超过即被丢弃）。等 2MSL 可以保证上一次连接里迟到、被复制或迷路的报文段（比如某个延迟了很久的数据段）都已经在网络中消失，不会混进下一次使用同一组端口号的新连接里，避免新旧连接数据混淆。',
        },
        {
          id: 'kb-tcp-close-9',
          type: 'callout',
          title: '2MSL 速记',
          text: '等 2MSL = ① 给最后那个 ACK 留够往返时间，让被动方能重发 FIN 时能收到；② 让本连接的旧报文段全部超时消失，不给新连接"留垃圾"。主动关闭方等待，被动关闭方不用等。',
          tone: 'orange',
        },
        {
          id: 'kb-tcp-close-svg',
          type: 'html',
          html: `<svg viewBox="0 0 820 560" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { font-family: system-ui, sans-serif; }
    .title { font-size: 16px; font-weight: 700; fill: #0f172a; text-anchor: middle; }
    .node { font-size: 14px; font-weight: 700; fill: #0f172a; text-anchor: middle; }
    .msg { font-size: 12px; font-weight: 700; text-anchor: middle; }
    .state { font-size: 11px; font-weight: 700; fill: #0f766e; text-anchor: middle; }
  </style>
  <defs>
    <marker id="arrR" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#b91c1c"/></marker>
    <marker id="arrG" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#059669"/></marker>
    <marker id="arrB" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#1d4ed8"/></marker>
  </defs>

  <text x="410" y="26" class="title">四次挥手：收到后立即回复（时间 →）</text>

  <text x="100" y="52" class="node">主动方 A（客户端）</text>
  <text x="700" y="52" class="node">被动方 B（服务端）</text>
  <line x1="100" y1="62" x2="100" y2="500" stroke="#334155" stroke-width="1.8"/>
  <line x1="700" y1="62" x2="700" y2="500" stroke="#334155" stroke-width="1.8"/>

  <!-- 挥手 ①：主动方发 FIN -->
  <line x1="100" y1="90" x2="700" y2="150" marker-end="url(#arrR)" stroke="#b91c1c" stroke-width="2" fill="none"/>
  <text x="400" y="106" class="msg" fill="#b91c1c">① FIN=1, ACK=1, seq=u, ack=k（占 1 个序号）</text>
  <text x="100" y="140" class="state">FIN-WAIT-1</text>

  <!-- 被动方收①，立即回②（紧贴①终点） -->
  <line x1="700" y1="156" x2="100" y2="216" marker-end="url(#arrG)" stroke="#059669" stroke-width="2" fill="none"/>
  <text x="400" y="172" class="msg" fill="#047857">② ACK=1, seq=k, ack=u+1（不占序号）</text>
  <text x="700" y="206" class="state">CLOSE-WAIT</text>
  <text x="100" y="230" class="state">FIN-WAIT-2</text>

  <!-- 被动方继续发剩余数据（斜虚线，与①/②区分） -->
  <line x1="700" y1="244" x2="100" y2="276" stroke="#ca8a04" stroke-width="1.6" stroke-dasharray="5,3" marker-end="url(#arrG)"/>
  <text x="400" y="248" class="msg" fill="#a16207">B 继续发送剩余数据（数据发完后才 FIN）</text>

  <!-- 挥手 ③：被动方数据发完，发 FIN -->
  <line x1="700" y1="304" x2="100" y2="364" marker-end="url(#arrR)" stroke="#b91c1c" stroke-width="2" fill="none"/>
  <text x="400" y="320" class="msg" fill="#b91c1c">③ FIN=1, ACK=1, seq=w, ack=u+1（占 1 个序号）</text>
  <text x="700" y="354" class="state">LAST-ACK</text>

  <!-- 主动方收③，立即回④（紧贴③终点） -->
  <line x1="100" y1="370" x2="700" y2="430" marker-end="url(#arrB)" stroke="#1d4ed8" stroke-width="2" fill="none"/>
  <text x="400" y="386" class="msg" fill="#1d4ed8">④ ACK=1, seq=u+1, ack=w+1（不占序号）</text>

  <text x="100" y="490" class="state" fill="#7c3aed">TIME-WAIT（等 2MSL）</text>
  <text x="700" y="490" class="state" fill="#166534">CLOSED</text>

  <text x="410" y="535" font-size="11" fill="#64748b" text-anchor="middle">B 收①后立即回②；A 收③后立即回④ —— 中间没有处理停顿（②之后 B 先发完剩余数据才发③）</text>
</svg>`,
        },
      ],
    },
  ],
}
