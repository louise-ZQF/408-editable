import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const emailArticle: KnowledgeArticleData = {
  pointId: 'kp-email',
  subpoints: [
    {
      id: 'email-arch',
      title: '电子邮件系统的组成',
      blocks: [
        {
          id: 'kb-email-arch-1',
          type: 'paragraph',
          text: '电子邮件系统由三个主要部分组成：\n\n1. **用户代理**（MUA）：如 Outlook、Gmail App。\n2. **邮件服务器**（运行 MTA/MDA）：中转和存储邮件。\n3. **邮件传输协议**：SMTP 送信，POP3/IMAP 取信。',
        },
        {
          id: 'kb-email-arch-2',
          type: 'paragraph',
          text: `一封邮件的旅程：

1. 发送方用 MUA 写好信。
2. MUA 把邮件推给**发送方邮件服务器**（SMTP）。
3. 发送方服务器经互联网把邮件逐跳推到接收方邮件服务器（SMTP）。
4. 邮件存在接收方服务器上。
5. 接收方用 POP3 或 IMAP 从自己的服务器下载。

分工：**SMTP 负责推（Push），POP3/IMAP 负责拉（Pull）**。`,
        },
        {
          id: 'kb-email-arch-fig',
          type: 'html',
          html: `<svg viewBox="0 0 850 300" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { font-family: system-ui, sans-serif; }
    .hdr { font-size: 14px; font-weight: 700; fill: #1e293b; text-anchor: middle; }
    .dim { font-size: 10px; fill: #64748b; text-anchor: middle; }
    .lbl { font-size: 12px; font-weight: 700; fill: #0f172a; text-anchor: middle; }
    .mua { fill: #ffffff; stroke: #2563eb; stroke-width: 2; }
    .srv { fill: #fef3c7; stroke: #d97706; stroke-width: 2; }
    .push { stroke: #dc2626; stroke-width: 2.2; fill: none; }
    .pull { stroke: #059669; stroke-width: 2.2; fill: none; }
  </style>
  <defs>
    <marker id="e-push" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#dc2626"/></marker>
    <marker id="e-pull" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#059669"/></marker>
  </defs>

  <text x="390" y="22" class="hdr">电子邮件系统：发送推、接收拉</text>

  <!-- 发送方 MUA -->
  <rect x="20" y="70" width="130" height="60" rx="4" class="mua"/>
  <text x="85" y="94" class="lbl">发送方 MUA</text>
  <text x="85" y="116" class="dim">Outlook / Gmail App</text>

  <!-- 发送方服务器 -->
  <rect x="210" y="70" width="140" height="60" rx="4" class="srv"/>
  <text x="280" y="94" class="lbl" fill="#92400e">发送方邮件服务器</text>
  <text x="280" y="116" class="dim">运行 SMTP</text>

  <!-- 接收方服务器 -->
  <rect x="450" y="70" width="140" height="60" rx="4" class="srv"/>
  <text x="520" y="94" class="lbl" fill="#92400e">接收方邮件服务器</text>
  <text x="520" y="116" class="dim">运行 SMTP + POP3/IMAP</text>

  <!-- 接收方 MUA -->
  <rect x="650" y="70" width="120" height="60" rx="4" class="mua"/>
  <text x="710" y="94" class="lbl">接收方 MUA</text>
  <text x="710" y="116" class="dim">Outlook / Gmail App</text>

  <!-- MUA 推给发送方服务器 -->
  <line x1="150" y1="100" x2="210" y2="100" stroke="#dc2626" stroke-width="2.2" marker-end="url(#e-push)"/>
  <text x="180" y="90" class="dim" fill="#b91c1c">SMTP 推</text>

  <!-- 服务器间 SMTP -->
  <line x1="350" y1="100" x2="450" y2="100" stroke="#dc2626" stroke-width="2.2" marker-end="url(#e-push)"/>
  <text x="400" y="90" class="dim" fill="#b91c1c">SMTP 推（逐跳）</text>

  <!-- 接收方拉 -->
  <line x1="650" y1="120" x2="590" y2="120" stroke="#059669" stroke-width="2.2" marker-end="url(#e-pull)"/>
  <text x="620" y="145" class="dim" fill="#166534">POP3 / IMAP 拉</text>

  <!-- 底部说明 -->
  <text x="390" y="230" class="dim">发：MUA → SMTP → 发送方服务器 → SMTP → 接收方服务器（推，一直推到底）</text>
  <text x="390" y="252" class="dim">收：接收方 MUA → POP3/IMAP → 从自己的接收方服务器拉取（拉）</text>
  <text x="390" y="280" class="lbl" fill="#334155">发送全程用 SMTP（推）；接收用 POP3 或 IMAP（拉）——不是同一个协议</text>
</svg>`,
        },
        {
          id: 'kb-email-arch-3',
          type: 'callout',
          title: '发送和接收不是同一个协议',
          text: '收发邮件可不是用的同一个协议。发送用 SMTP（推），接收用 POP3 或 IMAP（拉）。',
          tone: 'orange',
        },
      ],
    },
    {
      id: 'email-smtp',
      title: 'SMTP 和 MIME',
      blocks: [
        {
          id: 'kb-email-smtp-1',
          type: 'paragraph',
          text: '**SMTP** 使用 **TCP** 端口 25（或提交端口 587），以 ASCII 明文交互。客户端先与服务器建立 TCP 连接，服务器返回 220 准备就绪，然后依次发送命令：\n\n1. HELO（打招呼）。\n2. MAIL FROM（发件人）。\n3. RCPT TO（收件人）。\n4. DATA（正文，以只含一个点的行结束）。\n5. QUIT（退出）。',
        },
        {
          id: 'kb-email-smtp-2',
          type: 'paragraph',
          text: 'SMTP 只能传输 7 位 ASCII 文本，不支持图片、中文、附件。这些非 ASCII 内容由 **MIME**（多用途互联网邮件扩展）编码后嵌入邮件体，SMTP 原封不动传输。',
        },
        {
          id: 'kb-email-mime-1',
          type: 'paragraph',
          text: '**MIME**（Multipurpose Internet Mail Extensions）打破 SMTP 只能传 7 位 ASCII 的限制：把非 ASCII 内容（中文、图片、音频、附件、二进制文件）按一定编码规则（如 **Base64**、**Quoted-Printable**）转换成 7 位 ASCII 文本，嵌入邮件体，SMTP 就能原封不动传输。接收方按同样规则解码还原成原始内容。',
        },
        {
          id: 'kb-email-mime-2',
          type: 'callout',
          title: 'MIME 不是协议',
          text: 'MIME 是一种扩展编码标准，让 7 位 ASCII 的 SMTP 能传输中文、图片、附件。它定义编码规则（Base64、QP），不是传输协议。',
          tone: 'blue',
        },
      ],
    },
    {
      id: 'email-pop3-imap',
      title: 'POP3 与 IMAP——收信协议对比',
      blocks: [
        {
          id: 'kb-email-pop3-1',
          type: 'paragraph',
          text: '**POP3**（TCP 端口 110）：非常简单的"下载-删除"模型。用户把服务器上的所有新邮件拉到本地，拉完服务器上可以删也可以保留。离线阅读能力强，但多设备同步很差：手机拉完了，电脑上就看不到了。',
        },
        {
          id: 'kb-email-pop3-2',
          type: 'paragraph',
          text: '**IMAP**（TCP 端口 143）：邮件一直留在服务器上，客户端只是远程操作（标记已读、移动到文件夹、搜索等）。天然支持多设备同步：手机、电脑、平板看到的邮件状态完全一致。缺点是需要一直在线，占用服务器存储。',
        },
        {
          id: 'kb-email-pop3-3',
          type: 'paragraph',
          text: `**三协议对比**：

| | SMTP | POP3 | IMAP |
|--|------|------|------|
| 方向 | 发送（推）| 接收（拉）| 接收（拉）|
| 端口 | 25/587 | 110 | 143 |
| 邮件存储 | 不存，只转发 | 拉完可删 | 一直留服务器 |
| 多设备 | 不需要 | 差 | 好 |
`,
        },
      ],
    },
  ],
}
