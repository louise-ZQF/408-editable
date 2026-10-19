import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const ftpArticle: KnowledgeArticleData = {
  pointId: 'kp-ftp',
  subpoints: [
    {
      id: 'ftp-overview',
      title: 'FTP 控制连接与数据连接分离',
      blocks: [
        {
          id: 'kb-ftp-overview-1',
          type: 'paragraph',
          text: '**FTP**（File Transfer Protocol，文件传输协议）在客户端和服务器之间传输文件。FTP 最显著的设计是控制命令和数据传输走两根独立的 TCP 连接：\n\n1. **控制连接**：端口 21，负责传命令和返回结果，在整个 FTP 会话期间始终保持。\n2. **数据连接**：每次传文件时按需建立，传完就关。',
        },
        {
          id: 'kb-ftp-overview-2',
          type: 'callout',
          title: 'HTTP vs FTP',
          text: 'HTTP 的命令（GET/POST）和数据走同一根连接，FTP 把命令和数据分开（两根连接），这叫"带外控制"。优点：可以中途取消文件传输而不用关闭整个会话。FTP 是有状态的（记住登录用户），HTTP 是无状态的。',
          tone: 'blue',
        },
      ],
    },
    {
      id: 'ftp-modes',
      title: 'FTP的主动模式与被动模式',
      blocks: [
        {
          id: 'kb-ftp-modes-1',
          type: 'paragraph',
          text: '**主动模式**（PORT）：客户端先开一个端口，通过控制连接把 IP 和端口告诉服务器，然后服务器从自己的端口 20 主动向该端口发起数据连接。如果客户端在防火墙/NAT 后面，服务器主动连过来会被阻挡。',
        },
        {
          id: 'kb-ftp-modes-2',
          type: 'paragraph',
          text: '**被动模式**（PASV）：客户端发送 PASV 命令，服务器开一个临时端口并把 IP 和端口告诉客户端，然后客户端主动向该临时端口发起数据连接。\n\n这种方式所有连接都由客户端发起，不受客户端防火墙限制，现代 FTP 默认都用被动模式。',
        },
        {
          id: 'kb-ftp-modes-3',
          type: 'paragraph',
          text: `**对比**：

| | 主动模式 PORT | 被动模式 PASV |
|--|-------------|-------------|
| 谁发起数据连接 | 服务器（端口 20）| 客户端 |
| 适用场景 | 客户端无防火墙 | 客户端有防火墙/NAT |
| 谁开临时端口 | 客户端 | 服务器 |
`,
        },
        {
          id: 'kb-ftp-modes-fig',
          type: 'html',
          html: `<svg viewBox="0 0 840 380" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { font-family: system-ui, sans-serif; }
    .hdr { font-size: 14px; font-weight: 700; fill: #1e293b; text-anchor: middle; }
    .dim { font-size: 10px; fill: #64748b; text-anchor: middle; }
    .lbl { font-size: 12px; font-weight: 700; fill: #0f172a; text-anchor: middle; }
    .cli { fill: #ffffff; stroke: #2563eb; stroke-width: 2; }
    .srv { fill: #fef3c7; stroke: #d97706; stroke-width: 2; }
    .ctrl { stroke: #94a3b8; stroke-width: 2; fill: none; }
    .data { stroke: #dc2626; stroke-width: 2; fill: none; }
    .conn { stroke: #059669; stroke-width: 2.2; fill: none; }
  </style>
  <defs>
    <marker id="f-ctrl" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#64748b"/></marker>
    <marker id="f-data" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#dc2626"/></marker>
    <marker id="f-conn" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#059669"/></marker>
  </defs>

  <!-- 左：主动模式 -->
  <text x="200" y="24" class="hdr">主动模式（PORT）</text>
  <rect x="40" y="40" width="120" height="70" rx="4" class="cli"/>
  <text x="100" y="68" class="lbl">客户端</text>
  <text x="100" y="90" class="dim">开临时端口 N</text>
  <text x="100" y="104" class="dim">发 PORT IP:N</text>

  <rect x="250" y="40" width="120" height="70" rx="4" class="srv"/>
  <text x="310" y="68" class="lbl" fill="#92400e">服务器</text>
  <text x="310" y="90" class="dim">端口 21（控制）</text>
  <text x="310" y="104" class="dim">端口 20（数据）</text>

  <!-- 控制连接 -->
  <line x1="160" y1="70" x2="250" y2="70" stroke="#64748b" stroke-width="2" marker-end="url(#f-ctrl)"/>
  <text x="205" y="60" class="dim" fill="#64748b">控制连接 21</text>

  <!-- 数据连接：服务器主动连客户端 -->
  <path d="M 310 95 C 310 150, 160 140, 100 115" stroke="#dc2626" stroke-width="2.2" fill="none" marker-end="url(#f-data)"/>
  <text x="205" y="150" class="dim" fill="#dc2626">服务器主动发起数据连接（20 → 客户端 N）</text>
  <text x="205" y="168" class="dim" fill="#b91c1c">✗ 客户端在防火墙/NAT 后会被阻挡</text>

  <!-- 右：被动模式 -->
  <text x="580" y="24" class="hdr">被动模式（PASV）</text>
  <rect x="420" y="200" width="120" height="70" rx="4" class="cli"/>
  <text x="480" y="228" class="lbl">客户端</text>
  <text x="480" y="250" class="dim">发 PASV 命令</text>

  <rect x="630" y="200" width="120" height="70" rx="4" class="srv"/>
  <text x="690" y="228" class="lbl" fill="#92400e">服务器</text>
  <text x="690" y="250" class="dim">端口 21（控制）</text>
  <text x="690" y="264" class="dim">开临时端口 M</text>

  <!-- 控制连接 -->
  <line x1="540" y1="230" x2="630" y2="230" stroke="#64748b" stroke-width="2" marker-end="url(#f-ctrl)"/>
  <text x="585" y="220" class="dim" fill="#64748b">控制连接 21（PASV → 服务器给 M）</text>

  <!-- 数据连接：客户端主动连服务器 -->
  <path d="M 480 275 C 480 330, 690 330, 690 270" stroke="#059669" stroke-width="2.2" fill="none" marker-end="url(#f-conn)"/>
  <text x="585" y="330" class="dim" fill="#059669">客户端主动发起数据连接（→ 服务器 M）</text>
  <text x="585" y="348" class="dim" fill="#166534">✓ 所有连接都由客户端发起，不受防火墙限制</text>
</svg>`,
        },
      ],
    },
    {
      id: 'ftp-workflow',
      title: 'FTP 工作流程',
      blocks: [
        {
          id: 'kb-ftp-workflow-1',
          type: 'paragraph',
          text: `1. 客户端 TCP 三次握手连服务器的端口 21，建立**控制连接**。
2. 服务器返回 220 就绪码，客户端发 USER 用户名和 PASS 密码进行认证。
3. 需要传文件时：客户端发 PORT 或 PASV 指定模式，双方协商数据连接的临时端口。
4. 建立**数据连接**，完成文件 LIST / GET / PUT 操作后立即关闭数据连接。
5. 控制连接继续保持。下一次传文件时再从步骤 3 重复。
6. 客户端发 QUIT 命令关闭控制连接，FTP 会话结束。`,
        },
      ],
    },
  ],
}
