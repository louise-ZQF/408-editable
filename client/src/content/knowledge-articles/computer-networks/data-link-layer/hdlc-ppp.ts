import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const hdlcPppArticle: KnowledgeArticleData = {
  pointId: 'kp-hdlc-ppp',
  subpoints: [
    {
      id: 'hdlc',
      title: 'HDLC',
      blocks: [
        {
          id: 'kb-hdlc-1',
          type: 'paragraph',
          text: '**HDLC**（High-level Data Link Control，高级数据链路控制）是 ISO 制定的**面向比特的同步**链路层协议，主要用在点对点或多点链路上。\n\n通过帧类型（信息帧、监督帧、无编号帧）区分数据、确认和链路管理，完成差错控制与流量控制，实现**可靠的数据传输**。',
        },
        {
          id: 'kb-hdlc-2',
          type: 'paragraph',
          text: '**应用**：HDLC 是早期广域网和 ISDN 接入的主打协议，很多设备之间的专线链路也用它。\n\n**帧结构**：帧以标志字段 01111110 开始和结束。为保证透明传输，发送方在 5 个连续 1 之后插入 1 个 0，接收方删除之，这就是**零比特填充法**。',
        },
      ],
    },
    {
      id: 'ppp',
      title: 'PPP',
      blocks: [
        {
          id: 'kb-ppp-1',
          type: 'paragraph',
          text: '**PPP**（Point-to-Point Protocol，点对点协议）是目前使用最广的链路层协议，用于点对点链路（如拨号上网、家庭宽带、PPPoE 宽带拨号）。PPP 是一个**协议族**，由链路控制、网络控制、认证三部分配合工作。',
        },
        {
          id: 'kb-ppp-2',
          type: 'paragraph',
          text: '**LCP**（链路控制协议）：负责建立、配置、测试和拆除**数据链路连接**本身。拨号时先用 LCP 协商链路参数（如最大帧长、是否认证），之后才进入数据传输阶段。',
        },
        {
          id: 'kb-ppp-3',
          type: 'paragraph',
          text: '**NCP**（网络控制协议）：负责协商和配置**网络层协议**，使 PPP 能承载多种网络层协议。最典型的是 **IPCP**，用来给对端动态分配 IP 地址（拨号上网时电脑的 IP 就是由它分配的）。',
        },
        {
          id: 'kb-ppp-4',
          type: 'paragraph',
          text: '**认证协议**（可选）：LCP 建立链路后可进行身份认证，主要有 **PAP**（口令认证协议）和 **CHAP**（质询握手认证协议）。\n\n**PAP** 用明文口令、两次握手，较简单也不安全。\n\n**CHAP** 用质询-应答方式、三次握手，口令不直接在网上传输，更安全。',
        },
        {
          id: 'kb-ppp-5',
          type: 'paragraph',
          text: '**工作流程**：\n\n1. LCP 建立并配置链路。\n2. （可选）PAP/CHAP 认证。\n3. NCP 配置网络层（如分配 IP）。\n4. 数据传输。\n5. NCP 释放网络层。\n6. LCP 拆除链路。',
        },
        {
          id: 'kb-ppp-6',
          type: 'paragraph',
          text: '**PPP 的特点**：\n\n- **面向连接**：先用 LCP 建立数据链路连接，协商好参数后才传数据，结束时再拆除。\n- **不可靠**：PPP 本身不提供确认和重传机制，出错就交给上层（TCP）处理。\n- **全双工**：链路两端可以同时收发。\n- **点到点**：一条 PPP 链路只连接两端两个结点，不需要像多点链路那样寻址。\n- **能检错、不能纠错**：PPP 用 FCS（帧校验序列）能发现帧出错，但发现后只能丢弃，不能自动纠正，重传靠上层协议。\n- **两端可运行不同的网络协议**：通过 NCP 协商，PPP 可以承载 IP、IPX 等多种网络层协议，两端各自运行的网络层协议不必相同。',
        },
      ],
    },
  ],
}
