import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const ripArticle: KnowledgeArticleData = {
  pointId: 'kp-rip',
  subpoints: [
    {
      id: 'rip-basics',
      title: 'RIP 交换什么',
      blocks: [
        {
          id: 'kb-rip-basics-1',
          type: 'paragraph',
          text: '**RIP**（路由信息协议）是一种**距离向量**协议。每个路由器只把自己的路由表（"到某网络要走几步"）周期性地发给邻居，用 **Bellman-Ford** 思路不断更新自己的表。它基于 UDP（端口 520）传输。',
        },
        {
          id: 'kb-rip-basics-2',
          type: 'paragraph',
          text: '**RIP** 交换的就是整张路由表，本质是一张"目的网络：距离"的表。目的网络、距离、下一跳三者构成距离向量，一般认为下一跳可以省略。\n\n每 30 秒，路由器把自己的整张路由表发给相邻的路由器，邻居收到后逐条比较，保留跳数更少的路径。',
        },
        {
          id: 'kb-rip-encap',
          type: 'callout',
          title: 'RIP 运行在哪一层、用什么封装',
          text: 'RIP 使用 UDP（端口 520）封装传输：RIP 报文 → UDP 数据报 → IP 数据报 → 以太网帧。RIP 要借助 UDP 和 IP 两级封装才能上链路，这和 OSPF（直接跑在 IP 上，协议号 89）、BGP（用 TCP，端口 179）都不相同。',
          tone: 'orange',
        },
        {
          id: 'kb-rip-basics-3',
          type: 'html',
          html: `<svg viewBox="0 0 760 360" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { font-family: system-ui, sans-serif; }
    .hdr { font-size: 14px; font-weight: 700; fill: #1e293b; }
    .dim { font-size: 11px; fill: #64748b; }
    .rt   { font-size: 12px; font-weight: 600; fill: #0f172a; }
    .net  { fill: #f1f5f9; stroke: #94a3b8; stroke-width: 2; }
    .rtr  { fill: #ffffff; stroke: #2563eb; stroke-width: 2; }
  </style>
  <defs>
    <marker id="arr-rip" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="#d97706"/>
    </marker>
  </defs>

  <!-- 三个路由器 -->
  <rect x="40" y="80" width="140" height="54" rx="4" class="rtr"/>
  <text x="110" y="104" class="hdr" fill="#1e40af" text-anchor="middle">路由器 R1</text>
  <text x="110" y="124" class="dim" text-anchor="middle">距离 = 跳数</text>

  <rect x="310" y="80" width="140" height="54" rx="4" class="rtr"/>
  <text x="380" y="104" class="hdr" fill="#1e40af" text-anchor="middle">路由器 R2</text>

  <rect x="580" y="80" width="140" height="54" rx="4" class="rtr"/>
  <text x="650" y="104" class="hdr" fill="#1e40af" text-anchor="middle">路由器 R3</text>

  <!-- 网络 N -->
  <rect x="580" y="170" width="140" height="44" rx="4" class="net"/>
  <text x="650" y="197" class="hdr" fill="#334155" text-anchor="middle">网络 N（目的）</text>

  <!-- 连接 -->
  <line x1="180" y1="107" x2="310" y2="107" stroke="#94a3b8" stroke-width="2.5"/>
  <line x1="450" y1="107" x2="580" y2="107" stroke="#94a3b8" stroke-width="2.5"/>
  <line x1="650" y1="134" x2="650" y2="170" stroke="#94a3b8" stroke-width="2.5"/>

  <!-- R1 的路由表 -->
  <rect x="30" y="230" width="200" height="86" rx="4" fill="#ffffff" stroke="#d97706" stroke-width="2"/>
  <text x="130" y="250" class="hdr" fill="#92400e" text-anchor="middle">R1 的路由表</text>
  <text x="130" y="274" class="rt" text-anchor="middle">目的网络 N：距离 3 跳</text>
  <text x="130" y="296" class="rt" fill="#475569" text-anchor="middle">下一跳 → R2</text>

  <!-- R2 发路由表给 R1 -->
  <path d="M 300 100 C 230 160, 200 150, 150 180" stroke="#d97706" stroke-width="2.5" fill="none" stroke-dasharray="6 4" marker-end="url(#arr-rip)"/>
  <text x="185" y="150" class="dim" fill="#d97706" text-anchor="middle">R2 告诉 R1：</text>
  <text x="185" y="166" class="dim" fill="#d97706" text-anchor="middle">"到 N 我只要 2 跳"</text>

  <!-- R2 的路由表 -->
  <rect x="300" y="230" width="200" height="86" rx="4" fill="#ffffff" stroke="#2563eb" stroke-width="2"/>
  <text x="400" y="250" class="hdr" fill="#1e40af" text-anchor="middle">R2 的路由表</text>
  <text x="400" y="274" class="rt" text-anchor="middle">目的网络 N：距离 2 跳</text>
  <text x="400" y="296" class="rt" fill="#475569" text-anchor="middle">下一跳 → R3</text>

  <text x="380" y="348" class="dim" text-anchor="middle">R1 收到后比较：3 跳 &gt; 2 跳 + 1，于是把到 N 的路由更新为 2 跳 + 1 = 3 跳，下一跳改为 R2</text>
</svg>`,
        },
      ],
    },
    {
      id: 'rip-limits',
      title: 'RIP 的缺点与举例',
      blocks: [
        {
          id: 'kb-rip-limits-1',
          type: 'paragraph',
          text: '1. **最大跳数只有 15**：16 跳视为不可达，只适合小型网络。\n2. **收敛慢**：好消息传播快、坏消息传播慢，网络出现故障时可能长时间无法收敛，甚至发生**计数到无穷**。',
        },
        {
          id: 'kb-rip-limits-2',
          type: 'paragraph',
          text: '**计数到无穷**：假设 R1 到网络 N 原来经过 R2（2 跳），R2 到 N 经过 R3（1 跳）。某天 R2 到 R3 的链路断了，R2 发现到 N 不可达，但它仍从 R1 的定期更新里看到"R1 声称到 N 是 2 跳"，于是 R2 以为能经 R1 到 N，把自己的距离改成 3 跳并通告出去。\n\nR1 一看 R2 说 3 跳，又更新成 4 跳……双方互相把距离一点点加下去，直到超过 16 才算不可达。这个过程浪费很长时间，期间的路径根本不通。',
        },
        {
          id: 'kb-rip-limits-3',
          type: 'callout',
          title: 'RIP 适用场景',
          text: '好消息传播快，坏消息传播慢。网络故障后可能长时间无法收敛，因此 RIP 只用于规模小、拓扑稳定的网络。',
          tone: 'orange',
        },
      ],
    },
  ],
}
