import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const tcpIpOsiArticle: KnowledgeArticleData = {
  pointId: 'kp-layering',
  subpoints: [
    {
      id: 'layering-purpose',
      title: '网络的层次化设计',
      blocks: [
        {
          id: 'kb-layering-purpose-1',
          type: 'paragraph',
          text: String.raw`计算机网络采用**分层体系结构**：每一层只解决一类通信问题，通过定义好的接口向上层提供服务，同时调用下层提供的服务。各层内部实现可以独立演进，只要对外接口不变，其他层不受影响。

分层结构类似于编程中的**接口**概念：只规定层与层之间的通信规范，不涉及层内部的实现细节。

分层并不是层数越多越好，每增加一层，数据就多一次首部封装开销。`,
        },
      ],
    },
    {
      id: 'layering-subnet-division',
      title: '资源子网与通信子网',
      blocks: [
        {
          id: 'kb-layering-subnet-1',
          type: 'paragraph',
          text: 'OSI 七层按功能可以划分为两大子网：下三层（物理层+数据链路层+网络层）构成**通信子网**，负责数据的传输与转发，由路由器、交换机等网络设备实现。',
        },
        {
          id: 'kb-layering-subnet-2',
          type: 'paragraph',
          text: '上三层（会话层+表示层+应用层）构成**资源子网**，负责数据处理和资源共享，运行在端系统上。传输层位于通信子网与资源子网的边界，屏蔽下层通信细节。',
        },
        {
          id: 'kb-layering-subnet-3',
          type: 'paragraph',
          text: 'TCP/IP 模型中，网际层+网络接口层对应通信子网，应用层+传输层对应资源子网。',
        },
        {
          id: 'kb-new-block-31',
          type: 'callout',
          title: '传输层的位置',
          text: '传输层既不属于通信子网，也不属于资源子网。',
          tone: 'orange',
        },
      ],
    },
    {
      id: 'layering-osi-model',
      title: 'OSI 七层',
      blocks: [
        {
          id: 'kb-layering-osi-1',
          type: 'paragraph',
          text: `| 层号 | 名称 | PDU | 连接类型 | 功能 | 典型协议/设备 |
|------|------|-----|----------|----------|---------------|
| 7 | 应用层 Application | 数据 | 取决于传输层 | 为用户程序提供网络服务接口 | HTTP、FTP、DNS、SMTP |
| 6 | 表示层 Presentation | 数据 | — | 格式转换、加密解密、压缩解压 | — |
| 5 | 会话层 Session | 数据 | — | 会话建立、维持、同步、释放 | — |
| 4 | 传输层 Transport | 报文段(TCP)/数据报(UDP) | TCP 面向连接，UDP 无连接 | 端到端可靠传输，第一个端到端层 | TCP、UDP |
| 3 | 网络层 Network | 分组/数据报 | IP 无连接、不可靠 | 路由选择与分组转发 | IP、ICMP、ARP |
| 2 | 数据链路层 Data Link | 帧 | 可面向连接，可无连接 | 相邻结点传输、成帧、差错检测 | CSMA/CD、PPP、Ethernet |
| 1 | 物理层 Physical | 比特流 | 不区分 | 透明传输比特，定义电气机械特性 | 中继器、集线器 |`,
        },
        {
          id: 'kb-layering-osi-8',
          type: 'html',
          html: '<svg viewBox="0 0 540 300" xmlns="http://www.w3.org/2000/svg">\n  <style>text { font-family: system-ui, sans-serif; font-size: 12px; }</style>\n  <text x="270" y="16" fill="#374151" font-weight="700" font-size="14" text-anchor="middle">OSI 七层参考模型</text>\n  <rect x="16" y="24" width="508" height="32" fill="#1a56db" opacity="0.92" rx="3"/>\n  <text x="32" y="45" fill="#fff" font-weight="600" font-size="13">7 · 应用层</text>\n  <text x="190" y="45" fill="#bfdbfe" font-size="11">Application</text>\n  <text x="508" y="45" fill="#bfdbfe" font-size="11" text-anchor="end">HTTP FTP DNS SMTP</text>\n  <rect x="16" y="56" width="508" height="32" fill="#1a56db" opacity="0.83" rx="3"/>\n  <text x="32" y="77" fill="#fff" font-weight="600" font-size="13">6 · 表示层</text>\n  <text x="190" y="77" fill="#bfdbfe" font-size="11">Presentation</text>\n  <text x="508" y="77" fill="#bfdbfe" font-size="11" text-anchor="end">加密 压缩 格式转换</text>\n  <rect x="16" y="88" width="508" height="32" fill="#1a56db" opacity="0.74" rx="3"/>\n  <text x="32" y="109" fill="#fff" font-weight="600" font-size="13">5 · 会话层</text>\n  <text x="190" y="109" fill="#bfdbfe" font-size="11">Session</text>\n  <text x="508" y="109" fill="#bfdbfe" font-size="11" text-anchor="end">建立 同步 恢复会话</text>\n  <rect x="16" y="120" width="508" height="32" fill="#1a56db" opacity="0.65" rx="3"/>\n  <text x="32" y="141" fill="#fff" font-weight="600" font-size="13">4 · 传输层</text>\n  <text x="190" y="141" fill="#bfdbfe" font-size="11">Transport</text>\n  <text x="508" y="141" fill="#bfdbfe" font-size="11" text-anchor="end">TCP UDP</text>\n  <rect x="16" y="152" width="508" height="32" fill="#1a56db" opacity="0.56" rx="3"/>\n  <text x="32" y="173" fill="#fff" font-weight="600" font-size="13">3 · 网络层</text>\n  <text x="190" y="173" fill="#bfdbfe" font-size="11">Network</text>\n  <text x="508" y="173" fill="#bfdbfe" font-size="11" text-anchor="end">IP ICMP ARP</text>\n  <rect x="16" y="184" width="508" height="32" fill="#1a56db" opacity="0.47" rx="3"/>\n  <text x="32" y="205" fill="#fff" font-weight="600" font-size="13">2 · 数据链路层</text>\n  <text x="190" y="205" fill="#bfdbfe" font-size="11">Data Link</text>\n  <text x="508" y="205" fill="#bfdbfe" font-size="11" text-anchor="end">CSMA/CD PPP Ethernet</text>\n  <rect x="16" y="216" width="508" height="32" fill="#1a56db" opacity="0.38" rx="3"/>\n  <text x="32" y="237" fill="#fff" font-weight="600" font-size="13">1 · 物理层</text>\n  <text x="190" y="237" fill="#bfdbfe" font-size="11">Physical</text>\n  <text x="508" y="237" fill="#bfdbfe" font-size="11" text-anchor="end">中继器 集线器</text>\n  <line x1="48" y1="254" x2="48" y2="278" stroke="#9ca3af" stroke-width="1.5" marker-end="url(#ga)"/>\n  <line x1="492" y1="278" x2="492" y2="254" stroke="#9ca3af" stroke-width="1.5" marker-end="url(#ga)"/>\n  <text x="120" y="274" fill="#6b7280" font-size="11" text-anchor="middle">发送端 逐层封装（加首部）</text>\n  <text x="420" y="274" fill="#6b7280" font-size="11" text-anchor="middle">接收端 逐层解封（去首部）</text>\n  <defs><marker id="ga" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#9ca3af"/></marker></defs>\n</svg>',
        },
      ],
    },
    {
      id: 'layering-tcp-ip-model',
      title: 'TCP/IP 四层',
      blocks: [
        {
          id: 'kb-layering-tcp-ip-1',
          type: 'paragraph',
          text: '**TCP/IP 模型**是互联网事实上的标准，自顶向下分为应用层、传输层、网际层（IP 层）和网络接口层。\n\nOSI 上三层合并为 TCP/IP 应用层，OSI 下两层合并为 TCP/IP 网络接口层。',
        },
        {
          id: 'kb-layering-tcp-ip-2',
          type: 'paragraph',
          text: '**应用层**涵盖 OSI 的应用层、表示层和会话层三层功能，属于资源子网。协议有 HTTP、FTP、DNS、SMTP 等，连接特性取决于底层协议。\n\nHTTP 基于 TCP，面向连接；DNS 基于 UDP，无连接。',
        },
        {
          id: 'kb-layering-tcp-ip-3',
          type: 'paragraph',
          text: '**传输层**与 OSI 传输层完全对应，属于资源子网。\n\n**TCP** 面向连接、可靠，提供确认重传、有序交付、流量和拥塞控制。**UDP** 无连接、不可靠，无确认、无重传。',
        },
        {
          id: 'kb-layering-tcp-ip-4',
          type: 'paragraph',
          text: '**网际层**对应 OSI 网络层，属于通信子网，主要协议是 **IP**，提供无连接、不可靠的尽力而为交付。配套协议有 ICMP（差错报告）、ARP（地址解析）等。',
        },
        {
          id: 'kb-layering-tcp-ip-5',
          type: 'paragraph',
          text: '**网络接口层**对应 OSI 数据链路层和物理层，属于通信子网。TCP/IP 没有定义这一层的具体协议，只规定了与底层网络的接口：任何能传 IP 分组的网络都可以接入互联网。',
        },
        {
          id: 'kb-layering-tcp-ip-6',
          type: 'html',
          html: '<svg viewBox="0 0 540 220" xmlns="http://www.w3.org/2000/svg">\n  <style>text { font-family: system-ui, sans-serif; font-size: 11px; }</style>\n  <text x="75" y="14" fill="#374151" font-weight="700" font-size="12" text-anchor="middle">OSI 七层</text>\n  <rect x="12" y="22" width="126" height="20" fill="#1a56db" opacity="0.92" rx="2"/><text x="75" y="36" fill="#fff" font-size="10" text-anchor="middle">7·应用层</text>\n  <rect x="12" y="44" width="126" height="20" fill="#1a56db" opacity="0.83" rx="2"/><text x="75" y="58" fill="#fff" font-size="10" text-anchor="middle">6·表示层</text>\n  <rect x="12" y="66" width="126" height="20" fill="#1a56db" opacity="0.74" rx="2"/><text x="75" y="80" fill="#fff" font-size="10" text-anchor="middle">5·会话层</text>\n  <rect x="12" y="88" width="126" height="20" fill="#1a56db" opacity="0.65" rx="2"/><text x="75" y="102" fill="#fff" font-size="10" text-anchor="middle">4·传输层</text>\n  <rect x="12" y="110" width="126" height="20" fill="#1a56db" opacity="0.56" rx="2"/><text x="75" y="124" fill="#fff" font-size="10" text-anchor="middle">3·网络层</text>\n  <rect x="12" y="132" width="126" height="20" fill="#1a56db" opacity="0.47" rx="2"/><text x="75" y="146" fill="#fff" font-size="10" text-anchor="middle">2·数据链路层</text>\n  <rect x="12" y="154" width="126" height="20" fill="#1a56db" opacity="0.38" rx="2"/><text x="75" y="168" fill="#fff" font-size="10" text-anchor="middle">1·物理层</text>\n  <line x1="138" y1="32" x2="202" y2="46" stroke="#9ca3af" stroke-width="1"/>\n  <line x1="138" y1="54" x2="202" y2="46" stroke="#9ca3af" stroke-width="1"/>\n  <line x1="138" y1="76" x2="202" y2="46" stroke="#9ca3af" stroke-width="1"/>\n  <line x1="138" y1="98" x2="202" y2="98" stroke="#9ca3af" stroke-width="1"/>\n  <line x1="138" y1="120" x2="202" y2="150" stroke="#9ca3af" stroke-width="1"/>\n  <line x1="138" y1="142" x2="202" y2="200" stroke="#9ca3af" stroke-width="1"/>\n  <line x1="138" y1="164" x2="202" y2="200" stroke="#9ca3af" stroke-width="1"/>\n  <text x="360" y="14" fill="#374151" font-weight="700" font-size="12" text-anchor="middle">TCP/IP 四层</text>\n  <rect x="210" y="32" width="300" height="28" fill="#059669" opacity="0.85" rx="2"/><text x="360" y="50" fill="#fff" font-weight="600" font-size="12" text-anchor="middle">应用层 Application</text>\n  <rect x="210" y="84" width="300" height="28" fill="#059669" opacity="0.70" rx="2"/><text x="360" y="102" fill="#fff" font-weight="600" font-size="12" text-anchor="middle">传输层 Transport</text>\n  <rect x="210" y="136" width="300" height="28" fill="#059669" opacity="0.55" rx="2"/><text x="360" y="154" fill="#fff" font-weight="600" font-size="12" text-anchor="middle">网际层 Internet</text>\n  <rect x="210" y="186" width="300" height="28" fill="#059669" opacity="0.40" rx="2"/><text x="360" y="204" fill="#fff" font-weight="600" font-size="12" text-anchor="middle">网络接口层 Network Access</text>\n</svg>',
        },
      ],
    },
    {
      id: 'layering-encapsulation',
      title: '数据封装',
      blocks: [
        {
          id: 'kb-layering-encapsulation-1',
          type: 'paragraph',
          text: '发送端自上而下**逐层封装**：\n\n1. 应用层产生原始数据。\n2. 传输层加上 TCP/UDP 首部，成为**报文段**。\n3. 网络层加上 IP 首部，成为**数据报**。\n4. 数据链路层加上帧头帧尾，成为**帧**。\n5. 物理层以比特流发送。',
        },
        {
          id: 'kb-layering-encapsulation-2',
          type: 'paragraph',
          text: '接收端自下而上**逐层解封**，每层去掉对应首部后交给上一层。',
        },
        {
          id: 'kb-layering-encapsulation-3',
          type: 'html',
          html: '<svg viewBox="0 0 540 150" xmlns="http://www.w3.org/2000/svg">\n  <style>text { font-family: system-ui, sans-serif; font-size: 11px; }</style>\n  <rect x="62" y="8" width="416" height="20" fill="#fef3c7" stroke="#d97706" stroke-width="1.5" rx="2"/>\n  <text x="270" y="22" fill="#92400e" text-anchor="middle" font-size="11">应用层数据</text>\n  <rect x="38" y="36" width="36" height="20" fill="#dbeafe" stroke="#2563eb" stroke-width="1.5" rx="2"/>\n  <rect x="74" y="36" width="404" height="20" fill="#fef3c7" stroke="#d97706" stroke-width="1.5" rx="2"/>\n  <text x="56" y="50" fill="#1e40af" font-size="10" text-anchor="middle">TCP</text>\n  <text x="276" y="50" fill="#92400e" text-anchor="middle" font-size="11">应用层数据</text>\n  <rect x="24" y="64" width="32" height="20" fill="#d1fae5" stroke="#059669" stroke-width="1.5" rx="2"/>\n  <rect x="56" y="64" width="36" height="20" fill="#dbeafe" stroke="#2563eb" stroke-width="1.5" rx="2"/>\n  <rect x="92" y="64" width="388" height="20" fill="#fef3c7" stroke="#d97706" stroke-width="1.5" rx="2"/>\n  <text x="40" y="78" fill="#064e3b" font-size="10" text-anchor="middle">IP</text>\n  <text x="74" y="78" fill="#1e40af" font-size="10" text-anchor="middle">TCP</text>\n  <text x="286" y="78" fill="#92400e" text-anchor="middle" font-size="11">应用层数据</text>\n  <rect x="10" y="92" width="32" height="20" fill="#fce7f3" stroke="#db2777" stroke-width="1.5" rx="2"/>\n  <rect x="42" y="92" width="32" height="20" fill="#d1fae5" stroke="#059669" stroke-width="1.5" rx="2"/>\n  <rect x="74" y="92" width="36" height="20" fill="#dbeafe" stroke="#2563eb" stroke-width="1.5" rx="2"/>\n  <rect x="110" y="92" width="370" height="20" fill="#fef3c7" stroke="#d97706" stroke-width="1.5" rx="2"/>\n  <rect x="480" y="92" width="32" height="20" fill="#fce7f3" stroke="#db2777" stroke-width="1.5" rx="2"/>\n  <text x="26" y="106" fill="#9d174d" font-size="10" text-anchor="middle">帧头</text>\n  <text x="58" y="106" fill="#064e3b" font-size="10" text-anchor="middle">IP</text>\n  <text x="92" y="106" fill="#1e40af" font-size="10" text-anchor="middle">TCP</text>\n  <text x="296" y="106" fill="#92400e" text-anchor="middle" font-size="11">应用层数据</text>\n  <text x="496" y="106" fill="#9d174d" font-size="10" text-anchor="middle">帧尾</text>\n  <text x="270" y="138" fill="#6b7280" text-anchor="middle" font-size="11">发送端每经过一层，在前面加上该层的首部</text>\n</svg>',
        },
        {
          id: 'kb-layering-encapsulation-4',
          type: 'paragraph',
          text: 'OSI 七层中，物理层和应用层不加 PDU 首部，其余五层各引入 20 B 开销。',
        },
        {
          id: 'kb-layering-encapsulation-5',
          type: 'paragraph',
          text: String.raw`发送 400 B 数据，总开销 $= 5 \times 20 = 100$ B，传输效率 $= \frac{400}{400 + 100} = 80\%$。

换成五层模型，加首部的层数变为三层，总开销 $= 3 \times 20 = 60$ B，效率 $= \frac{400}{460} \approx 87\%$。`,
        },
      ],
    },
  ],
}
