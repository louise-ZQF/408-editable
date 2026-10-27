import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'
import protocolMap from '@/assets/computer-networks/network-architecture/408-protocol-map.svg'

export const networkProtocolSummaryArticle: KnowledgeArticleData = {
  pointId: 'kp-network-protocol-summary',
  subpoints: [
    {
      id: 'network-protocol-summary-core-map',
      title: '408 核心协议分层图',
      blocks: [
        {
          id: 'kb-network-protocol-summary-core-map',
          type: 'image',
          src: protocolMap,
          fullWidth: true,
          alt: '408 计算机网络协议分层图：OSI 七层与五层模型对应；HTTP、FTP、SMTP、POP3、BGP 使用 TCP，DHCP、RIP 使用 UDP，DNS 使用两者；网络层包含 IPv4、IPv6、ICMP、OSPF，ARP 单列于网络层和链路层交界；数据链路层包含停止等待、GBN、SR、ALOHA、CSMA、CSMA/CD、CSMA/CA、令牌传递、PPP、以太网、无线局域网与 VLAN；物理层传输比特流。',
          caption: '按 408 复习主线重绘。点击可打开高清矢量图，放大后文字仍然清晰。',
          sourceImport: { path: '@/assets/computer-networks/network-architecture/408-protocol-map.svg', localName: 'protocolMap', kind: 'default' },
        },
        {
          id: 'kb-network-protocol-summary-core-reading',
          type: 'paragraph',
          text: '**读图要点：**OSI 的应用层、表示层、会话层合并对应五层模型的应用层。DHCP、RIP、BGP 的复习内容虽然常见于网络层章节，但按承载关系分别运行在 UDP、UDP、TCP 之上；OSPF 直接使用 IP。DNS 既使用 UDP，也使用 TCP。ARP 用于本地链路上的 IP 到 MAC 地址解析；MIME 是邮件格式扩充，不是独立的邮件传输协议。\n\n本图按公开 408 大纲中的协议主线筛选；IP 组播、移动 IP 保留为相关概念。未把 LPR、DECnet、LDAP、NetBIOS、XOT、RUDP 等扩展项目放入核心图。下方保留此前图片提取的扩展速查表，背诵优先看本图。',
        },
        {
          id: 'kb-network-protocol-summary-core-sources',
          type: 'paragraph',
          text: '**范围与协议关系核对：**[高校公开的《2025 年计算机学科专业基础考试大纲》（计算机网络部分）](https://www.uwh.edu.cn/uploads/article/20250609/660428d58334252302af691bf99e064e.pdf)；[DNS：RFC 1035 §4.2](https://www.rfc-editor.org/rfc/rfc1035#section-4.2)、[DHCP：RFC 2131 §4.1](https://www.rfc-editor.org/rfc/rfc2131.html#section-4.1)、[RIP：RFC 2453 §3.6](https://www.rfc-editor.org/rfc/rfc2453#section-3.6)、[BGP：RFC 4271 §1](https://www.rfc-editor.org/rfc/rfc4271#section-1)、[OSPF：RFC 2328 §4.3](https://www.rfc-editor.org/rfc/rfc2328.html#section-4.3)。本图是复习主线筛选，并非某一年度大纲的完整替代。',
        },
      ],
    },
    {
      id: 'network-protocol-summary-layers',
      title: '扩展速查：原图协议的层级与端口',
      blocks: [
        {
          id: 'kb-network-protocol-summary-intro',
          type: 'paragraph',
          text: '计算机网络协议汇总：按应用层、传输层、网络层和数据链路层整理常见协议的用途、默认端口、主要特点与常考点。以下内容整理自“附录 1 常见网络协议汇总”三张图片。',
        },
        {
          id: 'kb-network-protocol-summary-layers',
          type: 'paragraph',
          text: `| TCP/IP 层级 | 数据单位 | 图中协议与关系 |
| --- | --- | --- |
| 应用层 | 报文 Message | DNS、DHCP、TFTP、SNMP、RIP、FTP、SMTP、HTTP、BGP、HTTPS 等，通过下层 TCP 或 UDP 传输 |
| 传输层 | 报文段 Segment | UDP：无连接、不可靠；TCP：面向连接、可靠。端口号用于区分应用进程 |
| 网络层 | 分组 Packet（IP 数据报） | IP 提供无连接、不可靠、尽最大努力交付的数据报服务。ICMP、IGMP、OSPF 的报文直接封装在 IP 数据报中 |
| 网络接口层 | 帧 Frame | 连接局域网或广域网，承载上层 IP 数据报；ARP 用于地址解析 |`,
        },
        {
          id: 'kb-network-protocol-summary-port-map',
          type: 'paragraph',
          text: `| 图中上层协议 | 传输层协议 | 默认端口号 |
| --- | --- | --- |
| DNS | UDP / TCP | 53 |
| DHCP | UDP | 67（服务器）、68（客户端） |
| TFTP | UDP | 69 |
| SNMP | UDP | 161 |
| RIP | UDP | 520 |
| FTP | TCP | 21（控制连接）、20（主动方式数据连接） |
| SMTP | TCP | 25 |
| HTTP | TCP | 80 |
| BGP | TCP | 179 |
| HTTPS | TCP | 443 |`,
        },
        {
          id: 'kb-network-protocol-summary-ip-numbers',
          type: 'paragraph',
          text: `| IP 数据报中封装的协议 | IPv4 首部“协议”字段值 |
| --- | --- |
| ICMP | 1 |
| IGMP | 2 |
| TCP | 6 |
| UDP | 17 |
| OSPF | 89 |`,
        },
      ],
    },
    {
      id: 'network-protocol-summary-application',
      title: '应用层协议汇总',
      blocks: [
        {
          id: 'kb-network-protocol-summary-application',
          type: 'paragraph',
          text: `| 简称 | 全称 | 协议用途 | 默认端口 | 下层协议 |
| --- | --- | --- | --- | --- |
| DNS | 域名解析协议；Domain Name System | 将域名映射成 IP 地址（正向解析）；将 IP 地址映射成域名（反向解析） | 53 | UDP（常用），也可用 TCP |
| FTP | 文件传输协议；File Transfer Protocol | 在客户端和服务器之间传输文件 | 21（命令）；20（主动方式的数据连接） | TCP |
| TFTP | 简单文件传输协议；Trivial File Transfer Protocol | 在客户端和服务器之间进行简单文件传输 | 69 | UDP |
| SMTP | 简单邮件传输协议；Simple Mail Transfer Protocol | 将邮件从本地邮件客户端（用户代理）推向邮件服务器，以及在邮件服务器之间传输邮件 | 25 | TCP |
| POP3 | 邮局协议版本 3；Post Office Protocol-Version 3 | 从远程邮件服务器“拉取”邮件到本地电子邮件客户端（用户代理） | 110 | TCP |
| IMAP | 因特网报文存取协议；Internet Mail Access Protocol | 比 POP3 更强大的邮件访问协议，可以对远程邮件服务器进行操作以及获取报文部分内容 | 143 | TCP |
| MIME | 多用途网际邮件扩充；Multipurpose Internet Mail Extensions | 支持电子邮件系统传输图片、音频、视频等非 ASCII 码数据 | — | — |
| HTTP | 超文本传输协议；Hypertext Transfer Protocol | 请求网络资源，规定如何构造客户端请求并将其发送到服务器，以及服务器如何响应这些请求 | 80（HTTP）；443（HTTPS） | TCP |
| TELNET | 远程登录协议 | 在本地主机上实现远程登录 | 23 | TCP |`,
        },
      ],
    },
    {
      id: 'network-protocol-summary-transport',
      title: '传输层协议汇总',
      blocks: [
        {
          id: 'kb-network-protocol-summary-transport',
          type: 'paragraph',
          text: `| 协议 | IP 分组首部协议字段 | 功能 | 特点 | 应用场景 |
| --- | --- | --- | --- | --- |
| TCP | 6 | 复用分用、流量控制、拥塞控制、可靠传输 | 面向连接；保证可靠传输；面向字节；进行拥塞控制；支持点对点通信，不支持多播和广播；提供全双工通信 | 对可靠性要求高的应用；要求可靠传输的 HTTP、HTTPS、FTP 等协议，以及 POP3、SMTP 等邮件传输协议 |
| UDP | 17 | 复用分用、差错检测 | 无连接；不保证可靠传输；面向报文；不进行拥塞控制；支持一对一、一对多、多对一、多对多的通信方式；首部仅有 8 字节 | 对时间要求高的实时应用（如直播、电话视频）；只进行简单请求—响应通信的进程；某些路由选择更新协议（如 RIP）；需要多播的应用 |`,
        },
      ],
    },
    {
      id: 'network-protocol-summary-network',
      title: '网络层章节相关协议汇总',
      blocks: [
        {
          id: 'kb-network-protocol-summary-classification',
          type: 'callout',
          title: '章节归纳不等于实际工作层级',
          text: '本表按所在章节归纳，不代表实际工作层级。其中 DHCP、RIP 以及 BGP 为应用层协议。',
          tone: 'blue',
        },
        {
          id: 'kb-network-protocol-summary-network',
          type: 'paragraph',
          text: `| 协议 | 主要作用 | 主要特点 | 常考点 |
| --- | --- | --- | --- |
| IP：IPv4 | 屏蔽异构网络的细节，使互联的各级计算机网络形成一个通用的整体 | IP 协议的第四版，采用 32 位的 IP 地址 | 合法的 IP 地址、IPv4 的首部格式、IP 地址的分类、IP 分组分片、NAT、子网划分、路由聚合等 |
| IP：IPv6 | 屏蔽异构网络的细节，使互联的各级计算机网络形成一个通用的整体 | IP 协议的第六版，采用 128 位的 IP 地址，从根本上解决了 IPv4 地址空间不足的问题 | 相关基础概念 |
| ARP | 获取与 IP 地址对应的硬件地址 | ARP 请求分组采用广播，ARP 响应分组采用单播 | ARP 的请求与响应过程、地址映射表的建立 |
| DHCP | 动态地给主机配置 IP 地址 | 基于 C/S 模式，动态地给主机分配 IP 地址 | DHCP 的作用，封装 DHCP 报文的下层协议细节（端口、地址等） |
| ICMP | 作为 IP 协议的补充，报告传输中的差错和异常 | 基于 IP 协议传输 ICMP 报文 | ICMP 报文的类型、差错报告的类型及原因，以及 ICMP 报文的应用 |
| IGMP | 负责 IPv4 组播成员的管理 | 基于 IP 协议，IGMP 报文封装在 IP 报文中 | 大致了解 IGMP 的工作过程 |
| 路由协议：RIP | 应用于自治系统内部的路由协议 | 基于距离—向量路由算法；以跳数为度量；跳数 16 表示目标不可达；“慢收敛”；只适用于小型网络；通过 UDP 传输 | RIP 路由表的更新计算、相关的基本概念、“慢收敛”特性的理解、采用 UDP 传输 |
| 路由协议：OSPF | 应用于自治系统内部的路由协议 | 基于链路状态路由算法；每个路由器拥有全网的拓扑结构；采用 Dijkstra 算法计算最短路径；更适用于中大型网络；通过 IP 协议传输 | 相关的基本概念、结合数据结构进行图的考查、采用 IP 传输 |
| 路由协议：BGP | 应用于自治系统之间的路由协议 | 基于路径—向量算法；所得到的不一定是最佳路径；采用 TCP 进行传输 | 相关的基本概念、采用 TCP 进行传输 |`,
        },
      ],
    },
    {
      id: 'network-protocol-summary-link',
      title: '数据链路层协议汇总',
      blocks: [
        {
          id: 'kb-network-protocol-summary-windows',
          type: 'paragraph',
          text: String.raw`表中 $W_R$ 表示接收窗口大小，$W_T$ 表示发送窗口大小。`,
        },
        {
          id: 'kb-network-protocol-summary-link-reliable',
          type: 'paragraph',
          text: String.raw`| 协议 | 所属小节 | 协议特点 | 常考点 |
| --- | --- | --- | --- |
| 停止等待协议 | 流量控制和可靠传输机制 | $W_R=W_T=1$，实现简单，信道利用率低 | 工作流程、窗口大小计算、信道利用率相关计算 |
| 后退 N 帧协议（GBN） | 流量控制和可靠传输机制 | $W_R=1$，$W_T>1$，使用累积确认机制 | 工作流程、窗口大小计算、信道利用率相关计算 |
| 选择重传协议（SR） | 流量控制和可靠传输机制 | $W_R>1$，$W_T>1$，使用 NAK 帧指定需要重传的帧 | 工作流程、窗口大小计算、信道利用率相关计算 |`,
        },
        {
          id: 'kb-network-protocol-summary-link-access',
          type: 'paragraph',
          text: `| 协议 | 所属小节 | 协议特点 | 常考点 |
| --- | --- | --- | --- |
| 纯 ALOHA 协议 | 介质访问控制 | 想发就发，超时则等待随机时间后重发 | — |
| 时隙 ALOHA 协议 | 介质访问控制 | 只能在时隙开始时发送，重传策略和纯 ALOHA 类似 | — |
| CSMA 协议 | 介质访问控制 | 先听后发，超时则等待随机时间后重新侦听 | 1-坚持、非坚持、p-坚持策略的判断 |
| CSMA/CD 协议 | 介质访问控制 | 发前先听，边发边听，冲突停发，随机重发 | 争用期相关计算、工作流程中的各个时间点 |
| CSMA/CA 协议 | 介质访问控制 | 在 CSMA 的基础上加入冲突避免机制，在发送数据前等待一个 IFS 再决定是否发送 | IFS 类型判断、信道预约机制 |
| 令牌传递协议 | 介质访问控制 | 主机按顺序传递令牌，持有令牌的主机才能发送数据 | — |`,
        },
        {
          id: 'kb-network-protocol-summary-link-lan',
          type: 'paragraph',
          text: `| 协议或标准 | 所属小节 | 协议特点 | 常考点 |
| --- | --- | --- | --- |
| 以太网 802.3 标准 | 局域网 | 定义了以太网的物理层结构、数据链路层协议以及标准以太网帧的结构 | 以太网帧的结构、高速以太网 |
| 无线局域网 802.11 系列标准 | 局域网 | 定义了无线局域网的结构以及无线数据帧的结构 | 802.11 无线数据帧的地址字段含义 |
| 虚拟局域网 802.1Q 标准 | 局域网 | 定义了 VLAN 字段的结构以及 VLAN 字段在以太网帧中的位置 | 802.1Q 帧的结构以及使用场景 |
| PPP 协议 | 广域网 | 广域网中两节点之间点对点通信使用的协议 | — |`,
        },
      ],
    },
  ],
}
