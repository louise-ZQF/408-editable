import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const alohaArticle: KnowledgeArticleData = {
  pointId: 'kp-aloha-protocol',
  subpoints: [
    {
      id: 'aloha-pure',
      title: '纯 ALOHA',
      blocks: [
        {
          id: 'kb-aloha-pure-1',
          type: 'paragraph',
          text: '**纯 ALOHA**：任何站有数据就发，不等不查。发完等待确认，超时未收到确认则认为发生冲突，随机等待一段时间后重发。',
        },
      ],
    },
    {
      id: 'aloha-slotted',
      title: '时隙 ALOHA',
      blocks: [
        {
          id: 'kb-aloha-slotted-1',
          type: 'paragraph',
          text: '**时隙 ALOHA** 把时间划分为等长的时隙（每时隙 $= T$，即一帧的传输时间），各站只能在时隙的起始点发送。冲突窗口从 $2T$ 缩小为 $T$：只有两个站在同一时隙发出才会冲突。',
        },
        {
          id: 'kb-aloha-slotted-4',
          type: 'html',
          html: '<svg viewBox="0 0 560 300" xmlns="http://www.w3.org/2000/svg">\n  <style>\n    text { font-family: system-ui, sans-serif; }\n    .hdr { font-size: 13px; font-weight: 700; fill: #1e293b; }\n    .dim { font-size: 10px; fill: #64748b; }\n    .warn { font-size: 10px; fill: #dc2626; font-weight: 600; }\n    .ok { font-size: 10px; fill: #16a34a; font-weight: 600; }\n    .frm { fill: #dbeafe; stroke: #3b82f6; stroke-width: 1.3; }\n  </style>\n\n  <!-- 站标签 -->\n  <text x="30" y="65" class="hdr" text-anchor="end">站 A</text>\n  <text x="30" y="145" class="hdr" text-anchor="end">站 B</text>\n  <text x="30" y="225" class="hdr" text-anchor="end">站 C</text>\n\n  <!-- 时隙分隔线 -->\n  <line x1="120" y1="28" x2="120" y2="250" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="4,4"/>\n  <line x1="220" y1="28" x2="220" y2="250" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="4,4"/>\n  <line x1="320" y1="28" x2="320" y2="250" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="4,4"/>\n  <line x1="420" y1="28" x2="420" y2="250" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="4,4"/>\n\n  <!-- 时隙标签 -->\n  <text x="170" y="250" class="dim" text-anchor="middle">时隙 1</text>\n  <text x="270" y="250" class="dim" text-anchor="middle">时隙 2</text>\n  <text x="370" y="250" class="dim" text-anchor="middle">时隙 3</text>\n  <text x="470" y="250" class="dim" text-anchor="middle">时隙 4</text>\n\n  <!-- 站 A：时隙 2 发送 -->\n  <rect x="220" y="42" width="100" height="26" rx="3" class="frm"/>\n  <text x="270" y="59" class="hdr" fill="#1e40af" text-anchor="middle">帧 A</text>\n\n  <!-- 站 B：也在时隙 2 发送 → 冲突 -->\n  <rect x="220" y="122" width="100" height="26" rx="3" class="frm"/>\n  <text x="270" y="139" class="hdr" fill="#1e40af" text-anchor="middle">帧 B</text>\n  <text x="330" y="139" class="warn" text-anchor="start">← 同隙，冲突</text>\n\n  <!-- 站 C：时隙 3 发送，安全 -->\n  <rect x="320" y="202" width="100" height="26" rx="3" class="frm"/>\n  <text x="370" y="219" class="hdr" fill="#1e40af" text-anchor="middle">帧 C</text>\n  <text x="430" y="219" class="ok" text-anchor="start">← 异隙，无冲突</text>\n\n  <!-- 时间轴 -->\n  <line x1="100" y1="268" x2="530" y2="268" stroke="#1e293b" stroke-width="1.5"/>\n  <polygon points="538,268 527,264 527,272" fill="#1e293b"/>\n\n  <!-- 冲突窗口 bracket：仅时隙 2 -->\n  <line x1="220" y1="273" x2="220" y2="290" stroke="#dc2626" stroke-width="1"/>\n  <line x1="320" y1="273" x2="320" y2="290" stroke="#dc2626" stroke-width="1"/>\n  <line x1="220" y1="290" x2="320" y2="290" stroke="#dc2626" stroke-width="1.2"/>\n  <text x="270" y="286" class="warn" text-anchor="middle">冲突窗口 = T</text>\n</svg>',
        },
        {
          id: 'kb-aloha-slotted-5',
          type: 'paragraph',
          text: '时隙 ALOHA 的冲突窗口只有 $T$：帧 A 在某个时隙发出后，只有同一时隙内的其他帧才会与它冲突。前一隙的帧在 A 开始前已结束，后一隙的帧在 A 结束后才开始，都不会干扰 A。',
        },
      ],
    },
  ],
}
