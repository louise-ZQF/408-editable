import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const delayBandwidthProductArticle: KnowledgeArticleData = {
  pointId: 'kp-delay',
  subpoints: [
    {
      id: 'delay-components',
      title: '总时延',
      blocks: [
        {
          id: 'kb-delay-components-1',
          type: 'paragraph',
          text: String.raw`分组从源到目的地的总时延为 $\text{发送时延} + \text{传播时延} + \text{处理时延} + \text{排队时延}$。`,
        },
        {
          id: 'kb-delay-components-2',
          type: 'html',
          html: '<svg viewBox="0 0 560 340" xmlns="http://www.w3.org/2000/svg">\n  <style>text{font-family:system-ui,sans-serif;font-size:10px}</style>\n\n  <line x1="130" y1="38" x2="130" y2="306" stroke="#6b7280" stroke-width="1.2"/>\n  <line x1="430" y1="38" x2="430" y2="306" stroke="#6b7280" stroke-width="1.2"/>\n  <text x="130" y="32" fill="#374151" font-weight="600" font-size="11" text-anchor="middle">发送方</text>\n  <text x="430" y="32" fill="#374151" font-weight="600" font-size="11" text-anchor="middle">接收方</text>\n\n  <!-- ① 排队时延 -->\n  <line x1="130" y1="46" x2="114" y2="46" stroke="#d97706" stroke-width="1.2"/>\n  <line x1="130" y1="98" x2="114" y2="98" stroke="#d97706" stroke-width="1.2"/>\n  <text x="122" y="54" fill="#92400e" font-weight="600" font-size="10" text-anchor="middle">\n    <tspan x="122" dy="0">排</tspan><tspan x="122" dy="11">队</tspan><tspan x="122" dy="11">时</tspan><tspan x="122" dy="11">延</tspan>\n  </text>\n\n  <polygon points="130,98 130,170 430,218 430,146" fill="#dbeafe" fill-opacity="0.2" stroke="#2563eb" stroke-width="1"/>\n  <line x1="130" y1="98" x2="430" y2="146" stroke="#2563eb" stroke-width="0.8"/>\n  <line x1="130" y1="170" x2="430" y2="218" stroke="#2563eb" stroke-width="0.8"/>\n\n  <!-- ② 发送时延 -->\n  <line x1="130" y1="98" x2="114" y2="98" stroke="#2563eb" stroke-width="1.2"/>\n  <line x1="130" y1="170" x2="114" y2="170" stroke="#2563eb" stroke-width="1.2"/>\n  <text x="122" y="112" fill="#1e40af" font-weight="600" font-size="10" text-anchor="middle">\n    <tspan x="122" dy="0">发</tspan><tspan x="122" dy="11">送</tspan><tspan x="122" dy="11">时</tspan><tspan x="122" dy="11">延</tspan>\n  </text>\n\n  <!-- ③ 传播时延 -->\n  <line x1="130" y1="98" x2="430" y2="98" stroke="#059669" stroke-width="0.7" stroke-dasharray="4,3"/>\n  <line x1="430" y1="98" x2="446" y2="98" stroke="#059669" stroke-width="1.2"/>\n  <line x1="430" y1="146" x2="446" y2="146" stroke="#059669" stroke-width="1.2"/>\n  <text x="438" y="107" fill="#059669" font-weight="600" font-size="10" text-anchor="middle">\n    <tspan x="438" dy="0">传</tspan><tspan x="438" dy="11">播</tspan><tspan x="438" dy="11">时</tspan><tspan x="438" dy="11">延</tspan>\n  </text>\n\n  <!-- 接收 -->\n  <line x1="430" y1="146" x2="446" y2="146" stroke="#94a3b8" stroke-width="0.7"/>\n  <line x1="430" y1="218" x2="446" y2="218" stroke="#94a3b8" stroke-width="0.7"/>\n  <text x="438" y="168" fill="#64748b" font-size="9" text-anchor="middle">\n    <tspan x="438" dy="0">接</tspan><tspan x="438" dy="11">收</tspan>\n  </text>\n\n  <!-- ④ 处理时延 -->\n  <line x1="430" y1="218" x2="446" y2="218" stroke="#db2777" stroke-width="1.2"/>\n  <line x1="430" y1="270" x2="446" y2="270" stroke="#db2777" stroke-width="1.2"/>\n  <text x="438" y="229" fill="#9d174d" font-weight="600" font-size="10" text-anchor="middle">\n    <tspan x="438" dy="0">处</tspan><tspan x="438" dy="11">理</tspan><tspan x="438" dy="11">时</tspan><tspan x="438" dy="11">延</tspan>\n  </text>\n\n  <!-- 总时延 -->\n  <line x1="98" y1="46" x2="98" y2="270" stroke="#374151" stroke-width="1.2"/>\n  <line x1="92" y1="46" x2="104" y2="46" stroke="#374151" stroke-width="1"/>\n  <line x1="92" y1="270" x2="104" y2="270" stroke="#374151" stroke-width="1"/>\n  <text x="88" y="158" fill="#374151" font-weight="700" font-size="10" transform="rotate(-90,88,158)">总时延</text>\n\n  <line x1="130" y1="306" x2="130" y2="320" stroke="#6b7280" stroke-width="1" marker-end="url(#ta)"/>\n  <line x1="430" y1="306" x2="430" y2="320" stroke="#6b7280" stroke-width="1" marker-end="url(#ta)"/>\n  <text x="130" y="330" fill="#6b7280" font-size="9" text-anchor="middle">时间</text>\n  <text x="430" y="330" fill="#6b7280" font-size="9" text-anchor="middle">时间</text>\n\n  <defs><marker id="ta" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="#6b7280"/></marker></defs>\n</svg>',
        },
      ],
    },
    {
      id: 'delay-transmission-vs-propagation',
      title: '发送时延 vs 传播时延',
      blocks: [
        {
          id: 'kb-delay-transmission-1',
          type: 'paragraph',
          text: String.raw`**发送时延** $= \frac{\text{数据长度}}{\text{发送速率}}$，取决于数据量和带宽，与距离无关。

**传播时延** $= \frac{\text{链路长度}}{\text{信号速度}}$，取决于距离和介质，与数据量无关。`,
        },
        {
          id: 'kb-delay-transmission-2',
          type: 'html',
          html: '<svg viewBox="0 0 560 320" xmlns="http://www.w3.org/2000/svg">\n  <style>text{font-family:system-ui,sans-serif;font-size:9px}</style>\n\n  <!-- 左：小分组 -->\n  <text x="145" y="16" fill="#374151" font-weight="700" font-size="11" text-anchor="middle">小分组（1000 bit）</text>\n  <line x1="55" y1="34" x2="55" y2="278" stroke="#6b7280" stroke-width="1"/>\n  <line x1="235" y1="34" x2="235" y2="278" stroke="#6b7280" stroke-width="1"/>\n  <text x="55" y="28" fill="#374151" font-weight="600" font-size="10" text-anchor="middle">发送方</text>\n  <text x="235" y="28" fill="#374151" font-weight="600" font-size="10" text-anchor="middle">接收方</text>\n\n  <polygon points="55,50 55,104 235,166 235,112" fill="#dbeafe" fill-opacity="0.2" stroke="#2563eb" stroke-width="1"/>\n  <line x1="55" y1="50" x2="235" y2="112" stroke="#2563eb" stroke-width="0.8"/>\n  <line x1="55" y1="104" x2="235" y2="166" stroke="#2563eb" stroke-width="0.8"/>\n\n  <!-- 发送 y=50→104 -->\n  <line x1="55" y1="50" x2="39" y2="50" stroke="#2563eb" stroke-width="1"/>\n  <line x1="55" y1="104" x2="39" y2="104" stroke="#2563eb" stroke-width="1"/>\n  <text x="47" y="60" fill="#1e40af" font-weight="600" font-size="9" text-anchor="middle">\n    <tspan x="47" dy="0">发</tspan><tspan x="47" dy="11">送</tspan><tspan x="47" dy="11">时</tspan><tspan x="47" dy="11">延</tspan>\n  </text>\n\n  <!-- 传播 y=50→112 -->\n  <line x1="55" y1="50" x2="235" y2="50" stroke="#059669" stroke-width="0.6" stroke-dasharray="3,3"/>\n  <line x1="235" y1="50" x2="251" y2="50" stroke="#059669" stroke-width="1"/>\n  <line x1="235" y1="112" x2="251" y2="112" stroke="#059669" stroke-width="1"/>\n  <text x="243" y="60" fill="#059669" font-weight="600" font-size="9" text-anchor="middle">\n    <tspan x="243" dy="0">传</tspan><tspan x="243" dy="11">播</tspan><tspan x="243" dy="11">时</tspan><tspan x="243" dy="11">延</tspan>\n  </text>\n\n  <!-- 接收 y=112→166 -->\n  <line x1="235" y1="112" x2="251" y2="112" stroke="#94a3b8" stroke-width="0.6"/>\n  <line x1="235" y1="166" x2="251" y2="166" stroke="#94a3b8" stroke-width="0.6"/>\n  <text x="243" y="124" fill="#64748b" font-size="9" text-anchor="middle">\n    <tspan x="243" dy="0">接</tspan><tspan x="243" dy="11">收</tspan>\n  </text>\n\n  <line x1="55" y1="278" x2="55" y2="292" stroke="#6b7280" stroke-width="0.8" marker-end="url(#tb)"/>\n  <line x1="235" y1="278" x2="235" y2="292" stroke="#6b7280" stroke-width="0.8" marker-end="url(#tb)"/>\n  <text x="55" y="302" fill="#6b7280" font-size="9" text-anchor="middle">时间</text>\n  <text x="235" y="302" fill="#6b7280" font-size="9" text-anchor="middle">时间</text>\n\n  <line x1="282" y1="20" x2="282" y2="298" stroke="#d1d5db" stroke-width="0.8" stroke-dasharray="4,4"/>\n\n  <!-- 右：大文件 -->\n  <text x="420" y="16" fill="#374151" font-weight="700" font-size="11" text-anchor="middle">大文件（10⁷ bit）</text>\n  <line x1="325" y1="34" x2="325" y2="278" stroke="#6b7280" stroke-width="1"/>\n  <line x1="505" y1="34" x2="505" y2="278" stroke="#6b7280" stroke-width="1"/>\n  <text x="325" y="28" fill="#374151" font-weight="600" font-size="10" text-anchor="middle">发送方</text>\n  <text x="505" y="28" fill="#374151" font-weight="600" font-size="10" text-anchor="middle">接收方</text>\n\n  <polygon points="325,50 325,183 505,245 505,112" fill="#dbeafe" fill-opacity="0.2" stroke="#2563eb" stroke-width="1"/>\n  <line x1="325" y1="50" x2="505" y2="112" stroke="#2563eb" stroke-width="0.8"/>\n  <line x1="325" y1="183" x2="505" y2="245" stroke="#2563eb" stroke-width="0.8"/>\n\n  <!-- 发送 y=50→183 -->\n  <line x1="325" y1="50" x2="309" y2="50" stroke="#2563eb" stroke-width="1"/>\n  <line x1="325" y1="183" x2="309" y2="183" stroke="#2563eb" stroke-width="1"/>\n  <text x="317" y="100" fill="#1e40af" font-weight="600" font-size="9" text-anchor="middle">\n    <tspan x="317" dy="0">发</tspan><tspan x="317" dy="11">送</tspan><tspan x="317" dy="11">时</tspan><tspan x="317" dy="11">延</tspan>\n  </text>\n\n  <!-- 传播 y=50→112（与左面板相同） -->\n  <line x1="325" y1="50" x2="505" y2="50" stroke="#059669" stroke-width="0.6" stroke-dasharray="3,3"/>\n  <line x1="505" y1="50" x2="521" y2="50" stroke="#059669" stroke-width="1"/>\n  <line x1="505" y1="112" x2="521" y2="112" stroke="#059669" stroke-width="1"/>\n  <text x="513" y="60" fill="#059669" font-weight="600" font-size="9" text-anchor="middle">\n    <tspan x="513" dy="0">传</tspan><tspan x="513" dy="11">播</tspan><tspan x="513" dy="11">时</tspan><tspan x="513" dy="11">延</tspan>\n  </text>\n\n  <!-- 接收 y=112→245 -->\n  <line x1="505" y1="112" x2="521" y2="112" stroke="#94a3b8" stroke-width="0.6"/>\n  <line x1="505" y1="245" x2="521" y2="245" stroke="#94a3b8" stroke-width="0.6"/>\n  <text x="513" y="164" fill="#64748b" font-size="9" text-anchor="middle">\n    <tspan x="513" dy="0">接</tspan><tspan x="513" dy="11">收</tspan>\n  </text>\n\n  <line x1="325" y1="278" x2="325" y2="292" stroke="#6b7280" stroke-width="0.8" marker-end="url(#tb)"/>\n  <line x1="505" y1="278" x2="505" y2="292" stroke="#6b7280" stroke-width="0.8" marker-end="url(#tb)"/>\n  <text x="325" y="302" fill="#6b7280" font-size="9" text-anchor="middle">时间</text>\n  <text x="505" y="302" fill="#6b7280" font-size="9" text-anchor="middle">时间</text>\n\n  <defs><marker id="tb" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="#6b7280"/></marker></defs>\n</svg>',
        },
      ],
    },
    {
      id: 'delay-queueing-processing',
      title: '处理时延与排队时延',
      blocks: [
        {
          id: 'kb-delay-processing-1',
          type: 'paragraph',
          text: '**处理时延**是路由器检查首部、决定转发出口、进行差错校验的时间，通常很小。',
        },
        {
          id: 'kb-delay-processing-2',
          type: 'paragraph',
          text: String.raw`**排队时延**是分组在路由器输出队列中等待的时间，取决于流量强度 $\frac{\text{分组到达率} \times \text{分组长度}}{\text{链路速率}}$。`,
        },
      ],
    },
    {
      id: 'delay-bandwidth-product',
      title: '时延带宽积',
      blocks: [
        {
          id: 'kb-delay-bdp-1',
          type: 'paragraph',
          text: String.raw`**时延带宽积** $= \text{传播时延} \times \text{链路带宽}$，单位是 bit，表示发送端持续以最大速率发送时，单向链路中同时存在于传输途中的比特总数。`,
        },
        {
          id: 'kb-delay-bdp-2',
          type: 'paragraph',
          text: '把链路看成管道：传播时延是管道长度，带宽是管道口径，时延带宽积是管道能同时容纳的比特数。在第一个比特到达对端之前，发送端最多能发出时延带宽积那么多的比特。',
        },
      ],
    },
  ],
}
