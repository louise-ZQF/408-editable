import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const dnsQueryArticle: KnowledgeArticleData = {
  pointId: 'kp-dns',
  subpoints: [
    {
      id: 'dns-overview',
      title: 'DNS 是什么',
      blocks: [
        {
          id: 'kb-dns-overview-1',
          type: 'paragraph',
          text: '**DNS**（Domain Name System，域名系统）把人类好记的域名（如 `www.example.com`）转换成机器需要的 IP 地址。它运行在 UDP 端口 53，超过 512 字节的响应改用 TCP 端口 53。\n\nDNS 属于应用层协议，为万维网、电子邮件等几乎所有互联网应用提供名字解析服务。',
        },
        {
          id: 'kb-dns-overview-2',
          type: 'paragraph',
          text: '域名空间按根、顶级域、二级域等层次组织。不同层级的域名服务器只负责自己掌握的区域，解析过程通过逐级转介找到保存最终记录的权限域名服务器。',
        },
        {
          id: 'kb-dns-overview-3',
          type: 'callout',
          title: 'DNS 为什么用 UDP',
          text: '大部分 DNS 查询只需一问一答，报文短（几十到几百字节），UDP 无连接、开销低，更适合。TCP 只在报文超长或区域传输时使用。',
          tone: 'blue',
        },
      ],
    },
    {
      id: 'dns-recursive-iterative',
      title: 'DNS的递归查询与迭代查询',
      blocks: [
        {
          id: 'kb-dns-recursive-iterative-1',
          type: 'paragraph',
          text: '递归查询要求被询问的服务器返回最终结果或错误。\n\n迭代查询允许服务器返回自己知道的最佳下一跳。\n\n主机通常向**本地域名服务器**递归查询，本地域名服务器再逐级进行迭代查询。',
        },
        {
          id: 'kb-dns-recursive-iterative-fig',
          type: 'html',
          html: `<svg viewBox="0 0 830 470" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { font-family: system-ui, sans-serif; }
    .hdr { font-size: 14px; font-weight: 700; fill: #1e293b; text-anchor: middle; }
    .node-label { font-size: 12px; font-weight: 700; fill: #0f172a; text-anchor: middle; }
    .node-sub { font-size: 10px; fill: #64748b; text-anchor: middle; }
    .lbl-r { font-size: 11px; font-weight: 700; fill: #b91c1c; text-anchor: middle; }
    .lbl-a { font-size: 10px; font-weight: 600; fill: #166534; text-anchor: middle; }
  </style>
  <defs>
    <marker id="qR" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#dc2626"/></marker>
    <marker id="aG" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#166534"/></marker>
  </defs>

  <text x="390" y="22" class="hdr">递归查询：每一级都"代劳到底"，把结果一层层传回</text>

  <!-- 主机 -->
  <rect x="20" y="70" width="150" height="46" rx="4" fill="#ffffff" stroke="#2563eb" stroke-width="2"/>
  <text x="95" y="88" class="node-label">主机</text>
  <text x="95" y="105" class="node-sub">只问一次，等最终答案</text>

  <!-- 本地 DNS -->
  <rect x="280" y="70" width="170" height="46" rx="4" fill="#ffffff" stroke="#2563eb" stroke-width="2"/>
  <text x="365" y="88" class="node-label">本地域名服务器</text>
  <text x="365" y="105" class="node-sub">代主机往上递归查</text>

  <!-- 根 DNS -->
  <rect x="590" y="60" width="170" height="46" rx="4" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
  <text x="675" y="78" class="node-label">根域名服务器</text>
  <text x="675" y="95" class="node-sub">再递归问 .com</text>

  <!-- .com -->
  <rect x="590" y="180" width="170" height="46" rx="4" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
  <text x="675" y="198" class="node-label">.com 顶级域服务器</text>
  <text x="675" y="215" class="node-sub">再递归问 example.com</text>

  <!-- 权威 -->
  <rect x="590" y="300" width="170" height="46" rx="4" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>
  <text x="675" y="318" class="node-label">example.com 权威服务器</text>
  <text x="675" y="335" class="node-sub">查到 IP，开始往回返</text>

  <!-- 请求箭头（红） -->
  <line x1="170" y1="93" x2="280" y2="93" stroke="#dc2626" stroke-width="2.2" marker-end="url(#qR)"/>
  <text x="225" y="84" class="lbl-r">递归请求</text>

  <line x1="450" y1="88" x2="590" y2="80" stroke="#dc2626" stroke-width="2.2" marker-end="url(#qR)"/>
  <text x="520" y="66" class="lbl-r">① 递归问根</text>

  <line x1="675" y1="106" x2="675" y2="180" stroke="#dc2626" stroke-width="2.2" marker-end="url(#qR)"/>
  <text x="730" y="150" class="lbl-r">② 递归问 .com</text>

  <line x1="675" y1="226" x2="675" y2="300" stroke="#dc2626" stroke-width="2.2" marker-end="url(#qR)"/>
  <text x="730" y="270" class="lbl-r">③ 递归问权威</text>

  <!-- 返回箭头（绿） -->
  <line x1="675" y1="310" x2="675" y2="236" stroke="#166534" stroke-width="2" marker-end="url(#aG)"/>
  <text x="745" y="280" class="lbl-a">返回 IP</text>

  <line x1="675" y1="190" x2="675" y2="116" stroke="#166534" stroke-width="2" marker-end="url(#aG)"/>
  <text x="745" y="160" class="lbl-a">返回 IP</text>

  <line x1="590" y1="95" x2="450" y2="105" stroke="#166534" stroke-width="2" marker-end="url(#aG)"/>
  <text x="520" y="120" class="lbl-a">返回 IP</text>

  <line x1="280" y1="108" x2="170" y2="108" stroke="#166534" stroke-width="2" marker-end="url(#aG)"/>
  <text x="225" y="124" class="lbl-a">返回最终 IP</text>

  <text x="390" y="430" font-size="11" fill="#475569" text-anchor="middle">每一级域名服务器都替下级"代劳到底"，结果沿原路一层层返回——被问的服务器必须给出最终答案</text>
</svg>`,
        },
        {
          id: 'kb-dns-recursive-iterative-fig2',
          type: 'html',
          html: `<svg viewBox="0 0 830 470" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { font-family: system-ui, sans-serif; }
    .hdr { font-size: 14px; font-weight: 700; fill: #1e293b; text-anchor: middle; }
    .node-label { font-size: 12px; font-weight: 700; fill: #0f172a; text-anchor: middle; }
    .node-sub { font-size: 10px; fill: #64748b; text-anchor: middle; }
    .lbl-i { font-size: 11px; font-weight: 700; fill: #1e40af; text-anchor: middle; }
    .lbl-a { font-size: 10px; font-weight: 600; fill: #166534; text-anchor: middle; }
  </style>
  <defs>
    <marker id="qB" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#2563eb"/></marker>
    <marker id="qR2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#dc2626"/></marker>
    <marker id="aG2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#166534"/></marker>
  </defs>

  <text x="390" y="22" class="hdr">迭代查询：被问的服务器只"指路"，本地 DNS 逐级问下去</text>

  <!-- 主机 -->
  <rect x="20" y="70" width="150" height="46" rx="4" fill="#ffffff" stroke="#2563eb" stroke-width="2"/>
  <text x="95" y="88" class="node-label">主机</text>
  <text x="95" y="105" class="node-sub">只问本地 DNS 一次（递归）</text>

  <!-- 本地 DNS -->
  <rect x="280" y="70" width="170" height="46" rx="4" fill="#ffffff" stroke="#2563eb" stroke-width="2"/>
  <text x="365" y="88" class="node-label">本地域名服务器</text>
  <text x="365" y="105" class="node-sub">自己逐级去问，别人不代劳</text>

  <!-- 根 DNS -->
  <rect x="590" y="60" width="170" height="46" rx="4" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
  <text x="675" y="78" class="node-label">根域名服务器</text>
  <text x="675" y="95" class="node-sub">只指路：去 .com</text>

  <!-- .com -->
  <rect x="590" y="180" width="170" height="46" rx="4" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
  <text x="675" y="198" class="node-label">.com 顶级域服务器</text>
  <text x="675" y="215" class="node-sub">只指路：去 example.com</text>

  <!-- 权威 -->
  <rect x="590" y="300" width="170" height="46" rx="4" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>
  <text x="675" y="318" class="node-label">example.com 权威服务器</text>
  <text x="675" y="335" class="node-sub">给最终 IP</text>

  <!-- 主机→本地（递归，红） -->
  <line x1="170" y1="93" x2="280" y2="93" stroke="#dc2626" stroke-width="2.2" marker-end="url(#qR2)"/>
  <text x="225" y="84" class="lbl-i" fill="#b91c1c">递归请求</text>
  <line x1="280" y1="108" x2="170" y2="108" stroke="#166534" stroke-width="2" marker-end="url(#aG2)"/>
  <text x="225" y="124" class="lbl-a">返回 IP</text>

  <!-- 本地→根（迭代，蓝） -->
  <line x1="450" y1="88" x2="590" y2="80" stroke="#2563eb" stroke-width="2.2" marker-end="url(#qB)"/>
  <text x="520" y="66" class="lbl-i">① 迭代问根</text>
  <line x1="590" y1="95" x2="450" y2="105" stroke="#166534" stroke-width="1.8" marker-end="url(#aG2)"/>
  <text x="520" y="122" class="lbl-a">根：去 .com</text>

  <!-- 本地→.com（迭代，蓝） -->
  <line x1="450" y1="150" x2="675" y2="180" stroke="#2563eb" stroke-width="2.2" marker-end="url(#qB)"/>
  <text x="555" y="162" class="lbl-i">② 迭代问 .com</text>
  <line x1="675" y1="195" x2="450" y2="185" stroke="#166534" stroke-width="1.8" marker-end="url(#aG2)"/>
  <text x="555" y="205" class="lbl-a">.com：去 example.com</text>

  <!-- 本地→权威（迭代，蓝） -->
  <line x1="450" y1="235" x2="675" y2="300" stroke="#2563eb" stroke-width="2.2" marker-end="url(#qB)"/>
  <text x="560" y="275" class="lbl-i">③ 迭代问权威</text>
  <line x1="675" y1="315" x2="450" y2="280" stroke="#166534" stroke-width="1.8" marker-end="url(#aG2)"/>
  <text x="560" y="318" class="lbl-a">权威：返回 IP 93.184.216.34</text>

  <text x="390" y="430" font-size="11" fill="#475569" text-anchor="middle">只有主机→本地 DNS 是递归；本地 DNS 再逐级迭代问根、.com、权威——每个被问的服务器只返回下一跳地址</text>
</svg>`,
        },
      ],
    },
  ],
}
