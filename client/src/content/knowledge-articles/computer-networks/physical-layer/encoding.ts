import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const encodingArticle: KnowledgeArticleData = {
  pointId: 'kp-encoding',
  subpoints: [
    {
      id: 'encoding-basics',
      title: '编码的目的',
      blocks: [
        {
          id: 'kb-encoding-basics-1',
          type: 'paragraph',
          text: '数字信号在信道上传输时需要进行编码，编码要解决三个问题：\n\n1. **同步**：接收方要知道每一位从何处开始。\n2. **直流分量**：避免信号长期处于同一电平导致基线漂移。\n3. **带宽效率**：用更少的信号变化传输更多比特。',
        },
      ],
    },
    {
      id: 'encoding-mnemonic',
      title: '常见的五种编码类型',
      blocks: [
        {
          id: 'kb-encoding-basics-2',
          type: 'html',
          html: '<svg viewBox="0 0 740 430" xmlns="http://www.w3.org/2000/svg">\n  <style>text{font-family:system-ui,sans-serif;font-size:9px}</style>\n\n  <text x="370" y="16" fill="#1e1e1e" font-weight="700" font-size="12" text-anchor="middle">五种编码波形（比特序列 1 0 0 1 0 1 1 0）</text>\n\n  <!-- 比特值 -->\n  <text x="165" y="40" fill="#555" font-size="10" text-anchor="middle">1</text>\n  <text x="235" y="40" fill="#555" font-size="10" text-anchor="middle">0</text>\n  <text x="305" y="40" fill="#555" font-size="10" text-anchor="middle">0</text>\n  <text x="375" y="40" fill="#555" font-size="10" text-anchor="middle">1</text>\n  <text x="445" y="40" fill="#555" font-size="10" text-anchor="middle">0</text>\n  <text x="515" y="40" fill="#555" font-size="10" text-anchor="middle">1</text>\n  <text x="585" y="40" fill="#555" font-size="10" text-anchor="middle">1</text>\n  <text x="655" y="40" fill="#555" font-size="10" text-anchor="middle">0</text>\n\n  <!-- 比特边界虚线 -->\n  <line x1="130" y1="44" x2="130" y2="400" stroke="#ccc" stroke-width="0.5" stroke-dasharray="4,4"/>\n  <line x1="200" y1="44" x2="200" y2="400" stroke="#ccc" stroke-width="0.5" stroke-dasharray="4,4"/>\n  <line x1="270" y1="44" x2="270" y2="400" stroke="#ccc" stroke-width="0.5" stroke-dasharray="4,4"/>\n  <line x1="340" y1="44" x2="340" y2="400" stroke="#ccc" stroke-width="0.5" stroke-dasharray="4,4"/>\n  <line x1="410" y1="44" x2="410" y2="400" stroke="#ccc" stroke-width="0.5" stroke-dasharray="4,4"/>\n  <line x1="480" y1="44" x2="480" y2="400" stroke="#ccc" stroke-width="0.5" stroke-dasharray="4,4"/>\n  <line x1="550" y1="44" x2="550" y2="400" stroke="#ccc" stroke-width="0.5" stroke-dasharray="4,4"/>\n  <line x1="620" y1="44" x2="620" y2="400" stroke="#ccc" stroke-width="0.5" stroke-dasharray="4,4"/>\n\n  <!-- ===== NRZ ===== -->\n  <text x="122" y="76" fill="#1e1e1e" font-weight="700" font-size="10" text-anchor="end">NRZ</text>\n  <text x="122" y="88" fill="#777" font-size="7" text-anchor="end">不归零编码</text>\n  <path d="M 130,62 L 200,62 L 200,98 L 340,98 L 340,62 L 410,62 L 410,98 L 480,98 L 480,62 L 550,62 L 550,98 L 690,98" fill="none" stroke="#1e1e1e" stroke-width="1.6"/>\n\n  <!-- ===== RZ ===== -->\n  <text x="122" y="146" fill="#1e1e1e" font-weight="700" font-size="10" text-anchor="end">RZ</text>\n  <text x="122" y="158" fill="#777" font-size="7" text-anchor="end">归零编码</text>\n  <path d="M 130,132 L 165,132 L 165,168 L 340,168 L 340,132 L 375,132 L 375,168 L 480,168 L 480,132 L 515,132 L 515,168 L 550,168 L 550,132 L 585,132 L 585,168 L 690,168" fill="none" stroke="#1e1e1e" stroke-width="1.6"/>\n\n  <!-- ===== NRZI ===== -->\n  <text x="122" y="216" fill="#1e1e1e" font-weight="700" font-size="10" text-anchor="end">NRZI</text>\n  <text x="122" y="228" fill="#777" font-size="7" text-anchor="end">反向不归零</text>\n  <path d="M 130,238 L 200,238 L 200,202 L 270,202 L 270,238 L 410,238 L 410,202 L 620,202 L 620,238 L 690,238" fill="none" stroke="#1e1e1e" stroke-width="1.6"/>\n\n  <!-- ===== 曼彻斯特 ===== -->\n  <text x="122" y="286" fill="#1e1e1e" font-weight="700" font-size="10" text-anchor="end">曼彻斯特</text>\n  <path d="M 130,272 L 165,272 L 165,308 L 200,308 L 235,308 L 235,272 L 270,272 L 270,308 L 305,308 L 305,272 L 340,272 L 375,272 L 375,308 L 410,308 L 445,308 L 445,272 L 480,272 L 515,272 L 515,308 L 550,308 L 550,272 L 585,272 L 585,308 L 620,308 L 655,308 L 655,272 L 690,272" fill="none" stroke="#1e1e1e" stroke-width="1.6"/>\n\n  <!-- ===== 差分曼彻斯特 ===== -->\n  <text x="122" y="356" fill="#1e1e1e" font-weight="700" font-size="10" text-anchor="end">差分曼彻斯特</text>\n  <path d="M 130,342 L 165,342 L 165,378 L 200,378 L 200,342 L 235,342 L 235,378 L 270,378 L 270,342 L 305,342 L 305,378 L 340,378 L 375,378 L 375,342 L 410,342 L 410,378 L 445,378 L 445,342 L 480,342 L 515,342 L 515,378 L 550,378 L 585,378 L 585,342 L 620,342 L 620,378 L 655,378 L 655,342 L 690,342" fill="none" stroke="#1e1e1e" stroke-width="1.6"/>\n\n  <!-- 图例 -->\n  <line x1="150" y1="416" x2="180" y2="416" stroke="#1e1e1e" stroke-width="1.5"/>\n  <text x="185" y="419" fill="#555" font-size="8">高电平</text>\n  <line x1="240" y1="416" x2="270" y2="416" stroke="#1e1e1e" stroke-width="1.5"/>\n  <text x="275" y="419" fill="#555" font-size="8">低/零电平</text>\n</svg>',
        },
        {
          id: 'kb-encoding-mnemonic-1',
          type: 'paragraph',
          text: '① 不归零编码：低 0 高 1，位中间不变。\n② 归零编码：低 0 高 1，位中间归零。\n③ 反向非归零编码：跳 0 不跳 1，看起点，位中间不变。\n④ 曼彻斯特编码：跳 0 反跳 1，看中间，位中间必变。\n⑤ 差分曼彻斯特编码：跳 0 不跳 1，看起点，位中间必变。',
        },
      ],
    },
  ],
}
