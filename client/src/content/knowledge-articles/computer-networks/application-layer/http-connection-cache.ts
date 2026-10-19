import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const httpConnectionCacheArticle: KnowledgeArticleData = {
  pointId: 'kp-http',
  subpoints: [
    {
      id: 'http-architecture',
      title: 'C/S 与 P2P 两种网络应用架构',
      blocks: [
        {
          id: 'kb-http-arch-1',
          type: 'paragraph',
          text: '网络应用（Application）运行在端系统上，通信方式决定了应用的架构。408 主要考察两种：\n\n1. **客户/服务器（C/S）架构**。\n2. **对等（P2P）架构**。',
        },
        {
          id: 'kb-http-arch-2',
          type: 'html',
          html: '<svg viewBox="0 0 860 320" xmlns="http://www.w3.org/2000/svg">\n  <style>\n    text { font-family: system-ui, sans-serif; }\n    .hdr { font-size: 14px; font-weight: 700; fill: #1e293b; text-anchor: middle; }\n    .dim { font-size: 11px; fill: #64748b; text-anchor: middle; }\n    .server { fill: #dbeafe; stroke: #2563eb; stroke-width: 2.5; }\n    .client { fill: #ffffff; stroke: #94a3b8; stroke-width: 1.6; }\n    .peer { fill: #dcfce7; stroke: #16a34a; stroke-width: 2; }\n    .lbl { font-size: 12px; font-weight: 700; fill: #0f172a; text-anchor: middle; }\n  </style>\n  <defs>\n    <marker id="c-cs" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#64748b"/></marker>\n    <marker id="c-p2p" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#16a34a"/></marker>\n  </defs>\n\n  <!-- 左：C/S -->\n  <text x="190" y="28" class="hdr">客户 / 服务器（C/S）</text>\n  <rect x="150" y="44" width="80" height="52" rx="4" class="server"/>\n  <text x="190" y="66" class="lbl" fill="#1e40af">服务器</text>\n  <text x="190" y="86" class="dim">持续运行、有固定地址</text>\n\n  <rect x="50" y="150" width="70" height="44" rx="4" class="client"/>\n  <text x="85" y="172" class="lbl">客户 A</text>\n  <rect x="155" y="170" width="70" height="44" rx="4" class="client"/>\n  <text x="190" y="192" class="lbl">客户 B</text>\n  <rect x="260" y="150" width="70" height="44" rx="4" class="client"/>\n  <text x="295" y="172" class="lbl">客户 C</text>\n\n  <line x1="160" y1="96" x2="100" y2="150" stroke="#94a3b8" stroke-width="1.8" marker-end="url(#c-cs)"/>\n  <line x1="190" y1="96" x2="190" y2="170" stroke="#94a3b8" stroke-width="1.8" marker-end="url(#c-cs)"/>\n  <line x1="220" y1="96" x2="285" y2="150" stroke="#94a3b8" stroke-width="1.8" marker-end="url(#c-cs)"/>\n\n  <text x="190" y="240" class="dim">客户之间不直接通信，所有请求都发给服务器</text>\n  <text x="190" y="260" class="dim">例子：Web（HTTP）、FTP、SMTP/IMAP、DNS</text>\n\n  <!-- 右：P2P -->\n  <text x="585" y="28" class="hdr">对等（P2P）</text>\n  <rect x="470" y="70" width="70" height="44" rx="4" class="peer"/>\n  <text x="505" y="92" class="lbl" fill="#166534">节点 1</text>\n  <rect x="550" y="140" width="70" height="44" rx="4" class="peer"/>\n  <text x="585" y="162" class="lbl" fill="#166534">节点 2</text>\n  <rect x="630" y="70" width="70" height="44" rx="4" class="peer"/>\n  <text x="665" y="92" class="lbl" fill="#166534">节点 3</text>\n\n  <line x1="505" y1="70" x2="560" y2="140" stroke="#16a34a" stroke-width="1.8" marker-end="url(#c-p2p)"/>\n  <line x1="585" y1="140" x2="640" y2="70" stroke="#16a34a" stroke-width="1.8" marker-end="url(#c-p2p)"/>\n  <line x1="505" y1="70" x2="630" y2="70" stroke="#16a34a" stroke-width="1.8" marker-end="url(#c-p2p)"/>\n\n  <text x="585" y="220" class="dim">每个节点既是客户又是服务器，相互直接共享资源</text>\n  <text x="585" y="240" class="dim">没有固定服务器，节点可随时加入/离开</text>\n  <text x="585" y="260" class="dim">例子：BitTorrent、迅雷、某些即时通信</text>\n</svg>',
        },
        {
          id: 'kb-http-arch-3',
          type: 'paragraph',
          text: '**C/S 架构**：服务器 7×24 小时持续运行、有固定 IP 地址（方便客户找到它），客户间不直接通信。\n\n好处是服务器集中管理、安全性好。缺点是服务器是瓶颈，客户多了会过载，且需要专门维护服务器。',
        },
        {
          id: 'kb-http-arch-4',
          type: 'paragraph',
          text: '**P2P 架构**：没有固定的服务器，每个节点（peer）同时充当客户和服务器，从其他节点获取资源的同时也把资源提供给别人。\n\n好处是可扩展性强：节点越多，能提供的带宽和资源也越多，不会有单点瓶颈。缺点是管理和安全困难（节点身份不可控）。',
        },
        {
          id: 'kb-http-arch-5',
          type: 'callout',
          title: 'C/S 与 P2P 的本质区别',
          text: 'C/S：有中心、客户靠服务器、客户之间不通信；P2P：无中心、节点互为服务器、可扩展但难管理。',
          tone: 'orange',
        },
      ],
    },
    {
      id: 'http-basics',
      title: 'URL 结构与 HTTP 报文格式',
      blocks: [
        {
          id: 'kb-http-basics-1',
          type: 'paragraph',
          text: '**URL**（统一资源定位符）格式：`协议://主机:端口/路径`。\n\n例如 `http://www.example.com:80/index.html`：协议是 HTTP，主机域名是 `www.example.com`（需 DNS 解析成 IP），端口是 80（HTTP 默认，可省略），路径是 /index.html。',
        },
        {
          id: 'kb-http-basics-2',
          type: 'paragraph',
          text: '**HTTP 请求报文**由三部分构成：\n\n1. **请求行**：方法 + URL + 版本，如 `GET /index.html HTTP/1.1`。\n2. **首部行**：Host、User-Agent、Connection 等键值对。\n3. **空行 + 实体体**：GET 通常为空，POST 放表单数据。',
        },
        {
          id: 'kb-http-basics-3',
          type: 'paragraph',
          text: '**HTTP 响应报文**也分三部分：\n\n1. **状态行**：版本 + 状态码 + 短语，如 `HTTP/1.1 200 OK`。\n2. **首部行**：Content-Type、Content-Length 等。\n3. **空行 + 实体体**：HTML 页面内容。',
        },
      ],
    },
    {
      id: 'http-methods-status',
      title: 'HTTP 方法与状态码',
      blocks: [
        {
          id: 'kb-http-methods-1',
          type: 'paragraph',
          text: '**HTTP 方法**：请求行第一个词，告诉服务器要对资源做什么操作。\n\n| 方法 | 含义 | 有无请求体 |\n|------|------|-----------|\n| **GET** | 获取资源（幂等）| 无 |\n| **POST** | 提交数据（处理表单/上传）| 有 |\n| **HEAD** | 只返回首部，不返回实体体 | 无 |\n| **PUT** | 上传/替换指定资源 | 有 |\n| **DELETE** | 删除指定资源 | 无 |',
        },
        {
          id: 'kb-http-methods-2',
          type: 'paragraph',
          text: '**HTTP 状态码**：响应状态行的三位数，按范围分类：\n\n| 范围 | 含义 | 常见例子 |\n|------|------|---------|\n| 1xx | 信息 | 100 Continue |\n| **2xx** | **成功** | **200 OK、204 No Content** |\n| **3xx** | **重定向** | **301 永久移动、302 临时移动、304 Not Modified** |\n| 4xx | 客户端错误 | 400 Bad Request、403 Forbidden、**404 Not Found** |\n| 5xx | 服务端错误 | 500 Internal Server Error、503 Service Unavailable |',
        },
      ],
    },
    {
      id: 'http-connections',
      title: 'http的非持续连接与持续连接',
      blocks: [
        {
          id: 'kb-http-connections-1',
          type: 'paragraph',
          text: '**非持续连接**：HTTP/1.0 默认方式。每个对象（HTML 页面 + 每个图片/CSS/JS）都单独建一条 TCP 连接，传输完立即关闭。N 个对象需要 N 次 TCP 三次握手，开销大。',
        },
        {
          id: 'kb-http-connections-2',
          type: 'paragraph',
          text: '**持续连接**：HTTP/1.1 默认方式（Connection: keep-alive）。一条 TCP 连接上可以连续请求多个对象，不用重复握手。\n\n1. **非流水线方式**：一个对象应答完再请求下一个，每个对象 1 个 RTT。\n2. **流水线方式**：可以连发多个请求不等应答，进一步减少 RTT。',
        },
        {
          id: 'kb-http-connections-pipeline',
          type: 'paragraph',
          text: '流水线仍然只在**同一条** TCP 连接上连发多个请求，不会开多条 TCP 连接。\n\n浏览器另有一种**并行连接**：同时开多条 TCP 连接，各取各的对象。\n\n流水线省 RTT 是因为省掉了"等前一个响应回来再发下一个"的等待，不是因为有并行连接。',
        },
        {
          id: 'kb-http-connections-pipeline2',
          type: 'paragraph',
          text: '**流水线的限制**：虽然流水线可以连发多个请求，但同一条 TCP 连接的实际发送速度仍受拥塞控制约束：发送方必须遵守拥塞窗口 cwnd 的逻辑，窗口内最多只能发送 cwnd 大小的数据，发完要等确认（ACK）窗口前移才能继续发下一批。所以流水线不能"无限连发"，还是要等 TCP 确认来推进窗口。',
        },
        {
          id: 'kb-http-connections-ex',
          type: 'paragraph',
          text: `**例题**：一条持续连接，某对象共 8 个（1 个 HTML + 7 个图片），采用流水线方式，在同一条 TCP 连接上连发请求。假定这条连接的拥塞窗口允许每轮 RTT 最多传输 4 个对象的响应数据（cwnd 限制的是在途字节数，这里换算成对象数便于计算）。已知 RTT = R，传输对象的时间忽略不计。问取回全部 8 个对象需要多少个 RTT？

**解析**：流水线在同一条连接上也不能违背拥塞窗口——每轮最多传 4 个对象。第 1 轮传 4 个（第 1 到第 4 个对象），等 1 个 RTT 的 ACK 窗口才前移；第 2 轮再传 4 个（第 5 到第 8 个对象），再等 1 个 RTT。共需要 **2 个 RTT** 全部取回。若不用流水线，每发 1 个等 1 个 RTT，需要 8 个 RTT。`,
        },
      ],
    },
    {
      id: 'http-cookie',
      title: 'Cookie——让无状态的 HTTP 记住状态',
      blocks: [
        {
          id: 'kb-http-cookie-1',
          type: 'paragraph',
          text: 'HTTP 本身是**无状态协议**，服务器不记得两次请求来自同一个用户。Cookie 让浏览器在请求里自动带一小段文本数据（`Cookie` 首部），服务器据此在多次请求之间识别同一个用户。',
        },
        {
          id: 'kb-http-cookie-2',
          type: 'paragraph',
          text: '**Cookie 工作四步**：\n\n1. 服务器在响应里加 `Set-Cookie` 首部。\n2. 浏览器把 Cookie 存下来。\n3. 之后每次访问该站点，浏览器在请求里自动加 `Cookie` 首部。\n4. 服务器读 Cookie 识别用户。\n\nCookie 可以设有效期（Expires/Max-Age）、域名范围（Domain）和路径范围（Path）。',
        },
        {
          id: 'kb-http-cookie-3',
          type: 'callout',
          title: 'Cookie 的经典应用',
          text: '购物车、登录态保持、用户偏好记录。Cookie 只是存在客户端的小文本文件，不是程序，不能跨域名读取其他站点的 Cookie。',
          tone: 'blue',
        },
      ],
    },
  ],
}
