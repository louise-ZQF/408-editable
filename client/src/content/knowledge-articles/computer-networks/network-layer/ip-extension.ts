import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const ipExtensionArticle: KnowledgeArticleData = {
  pointId: 'kp-ip-extension',
  subpoints: [
    {
      id: 'multicast-basics',
      title: 'IP 组播',
      blocks: [
        {
          id: 'kb-ip-ext-multicast-1',
          type: 'paragraph',
          text: '**单播**是一对一，**广播**是一对全部，**组播**（多播）是一对一组。\n\n**组播**中源主机只发送一份数据，路由器把它复制后转发给加入该组的成员，适合视频会议、直播这类一对多的场景，避免源端重复发送。',
        },
        {
          id: 'kb-ip-ext-multicast-2',
          type: 'callout',
          title: '组播地址',
          text: '组播使用 D 类地址 224.0.0.0 到 239.255.255.255。源主机使用普通单播地址，组播地址只标识接收组，不标识发送者。',
          tone: 'blue',
        },
        {
          id: 'kb-ip-ext-igmp-1',
          type: 'paragraph',
          text: '**IGMP**（网际组管理协议）运行在主机和与其直连的组播路由器之间，负责管理组成员关系。它解决两个问题：\n\n1. 主机如何加入/离开一个组播组。\n2. 组播路由器如何知道自己的某条链路上有哪些组成员。',
        },
        {
          id: 'kb-ip-ext-igmp-2',
          type: 'paragraph',
          text: 'IGMP 使用三种报文：\n\n1. **成员关系查询**：组播路由器周期性地向链路询问"谁在哪个组？"。\n2. **成员关系报告**：主机应答"我在组 X"，也表示加入组 X。\n3. **离开组**：主机离开时主动通知路由器。',
        },
        {
          id: 'kb-ip-ext-igmp-3',
          type: 'paragraph',
          text: '**加入过程**：主机想收看某组播组，就主动发送一条成员关系报告报文，组播路由器收到后在自己的组播转发表中登记，并开始向该链路转发对应的组播数据。',
        },
        {
          id: 'kb-ip-ext-igmp-4',
          type: 'paragraph',
          text: '**维持与离开**：路由器定期发送查询报文。\n\n1. 链路上还有主机想接收：主机继续应答报告。\n2. 一段时间内没人应答：路由器认为链路上已无组成员，停止转发该组数据。\n\n主机离开时可主动发离开组报文，让路由器立即清除成员记录，加快收敛。',
        },
        {
          id: 'kb-ip-ext-igmp-5',
          type: 'callout',
          title: 'IGMP 与组播路由协议的分工',
          text: 'IGMP 只管本链路内的组成员关系，解决"谁要收"；真正跨路由器转发组播数据、构造组播转发树，是组播路由协议（如 PIM）的事。',
          tone: 'blue',
        },
      ],
    },
    {
      id: 'mobile-ip',
      title: '移动 IP',
      blocks: [
        {
          id: 'kb-ip-ext-mobile-1',
          type: 'paragraph',
          text: '**移动 IP** 让主机在移动后仍能用原来的 IP 地址通信，涉及三个角色：\n\n1. **移动节点**：会移动的主机。\n2. **归属代理**：移动节点原始网络中的路由器。\n3. **外部代理**：移动节点当前所在网络的路由器。',
        },
        {
          id: 'kb-ip-ext-mobile-fig',
          type: 'html',
          html: `<svg viewBox="0 0 780 400" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { font-family: system-ui, sans-serif; }
    .hdr { font-size: 14px; font-weight: 700; fill: #1e293b; }
    .lbl { font-size: 12px; font-weight: 700; fill: #0f172a; }
    .dim { font-size: 11px; fill: #475569; }
    .net { fill: #f1f5f9; stroke: #94a3b8; stroke-width: 2; }
    .dev { fill: #ffffff; stroke: #2563eb; stroke-width: 2; }
    .pk  { font-size: 11px; font-weight: 600; fill: #1e40af; font-family: monospace; }
  </style>
  <defs>
    <marker id="arr-red" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="#dc2626"/>
    </marker>
    <marker id="arr-orange" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="#d97706"/>
    </marker>
    <marker id="arr-blue" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="#2563eb"/>
    </marker>
  </defs>

  <!-- 通信对端 -->
  <rect x="20" y="40" width="150" height="56" rx="4" class="dev"/>
  <text x="95" y="62" class="lbl" text-anchor="middle">通信对端 CN</text>
  <text x="95" y="82" class="dim" text-anchor="middle">给移动节点发数据</text>

  <!-- 归属网络 -->
  <rect x="20" y="150" width="260" height="170" rx="6" class="net"/>
  <text x="150" y="174" class="lbl" fill="#1e40af" text-anchor="middle">归属网络（原籍）</text>
  <rect x="60" y="200" width="180" height="50" rx="4" class="dev"/>
  <text x="150" y="222" class="lbl" text-anchor="middle">归属代理 HA</text>
  <text x="150" y="240" class="pk" text-anchor="middle">归属地址 192.168.1.10</text>

  <!-- 外部网络 -->
  <rect x="500" y="150" width="260" height="170" rx="6" class="net"/>
  <text x="630" y="174" class="lbl" fill="#166534" text-anchor="middle">外部网络（当前所在地）</text>
  <rect x="540" y="200" width="180" height="50" rx="4" class="dev"/>
  <text x="630" y="222" class="lbl" text-anchor="middle">外部代理 FA</text>
  <text x="630" y="240" class="pk" text-anchor="middle">转交地址 9.9.9.9</text>
  <rect x="540" y="272" width="180" height="36" rx="4" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>
  <text x="630" y="295" class="lbl" fill="#166534" text-anchor="middle">移动节点 MN</text>

  <!-- 数据流 1：CN → 归属地址 -->
  <path d="M 170 68 L 360 68 L 360 205 L 240 205" stroke="#dc2626" stroke-width="2.5" fill="none" marker-end="url(#arr-red)"/>
  <text x="300" y="60" class="dim" fill="#dc2626" text-anchor="middle">数据报目的 = 归属地址</text>

  <!-- 隧道：HA → FA -->
  <path d="M 280 225 L 500 225" stroke="#d97706" stroke-width="3" fill="none" stroke-dasharray="7 4" marker-end="url(#arr-orange)"/>
  <text x="390" y="216" class="dim" fill="#d97706" text-anchor="middle">隧道（封装成目的 = 转交地址）</text>

  <!-- 数据流 3：FA → MN -->
  <line x1="630" y1="250" x2="630" y2="272" stroke="#2563eb" stroke-width="2.5" marker-end="url(#arr-blue)"/>

  <!-- 移动节点逻辑归属虚线 -->
  <path d="M 200 340 C 300 385, 500 385, 560 340" stroke="#94a3b8" stroke-width="1.5" fill="none" stroke-dasharray="4 3"/>
  <text x="380" y="388" class="dim" text-anchor="middle">移动节点逻辑上仍属于归属网络，用归属地址对外通信</text>

  <text x="390" y="30" class="hdr" text-anchor="middle">移动 IP：归属代理用隧道把数据转交给身处外部网络的移动节点</text>
</svg>`,
        },
        {
          id: 'kb-ip-ext-mobile-2',
          type: 'paragraph',
          text: '移动节点有一个固定的**归属地址**（如上图的 192.168.1.10）。移动到外地后，它从外部网络获得一个**转交地址**（如上图的 9.9.9.9），并把自己的归属地址与转交地址注册到归属代理。',
        },
        {
          id: 'kb-ip-ext-mobile-3',
          type: 'paragraph',
          text: '给移动节点发数据的主机仍把数据报发往它的归属地址。归属代理截获后，把数据报通过**隧道**转发到转交地址（外部代理），由外部代理交给移动节点。\n\n移动节点回复时可直接以归属地址作为源地址发送，通信对端全程只看到归属地址，移动对它透明。',
        },
      ],
    },
    {
      id: 'sdn',
      title: 'SDN 软件定义网络',
      blocks: [
        {
          id: 'kb-ip-ext-sdn-1',
          type: 'paragraph',
          text: '传统网络中每台路由器既参与路由计算（控制平面），又负责转发分组（数据平面）。**SDN**（软件定义网络）把两者分离：\n\n1. **控制平面**：集中到一个**远程控制器**。\n2. **数据平面**：由底层的路由器/交换机负责，只按控制器下发的**流表**转发分组。',
        },
        {
          id: 'kb-ip-ext-sdn-2',
          type: 'paragraph',
          text: '控制器掌握全网拓扑，集中计算转发路径，把规则下发给各设备。网络的策略、流量调度都变成控制器上的软件逻辑，想改网络行为就改控制器程序，不用逐台配置设备。',
        },
        {
          id: 'kb-ip-ext-sdn-3',
          type: 'paragraph',
          text: 'SDN 用两类接口连接分层：\n\n1. **南向接口**：连接控制器与底层转发设备，控制器通过它下发流表、收集设备状态。\n2. **北向接口**：连接控制器与上层的应用（如流量调度、安全策略、网络监控），应用通过它向控制器提出需求。',
        },
        {
          id: 'kb-ip-ext-sdn-4',
          type: 'callout',
          title: '南北向接口怎么记',
          text: '南向接口朝下管设备，北向接口朝上服务应用。南向常说的协议是 OpenFlow，北向常是 REST API 这类编程接口。',
          tone: 'orange',
        },
        {
          id: 'kb-ip-ext-sdn-5',
          type: 'paragraph',
          text: 'SDN 把网络的控制权从分散的设备中抽出来集中管理，转发设备变成可编程的通用硬件：控制平面集中、数据平面分布转发。',
        },
      ],
    },
  ],
}
