import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const wordLengthArticle: KnowledgeArticleData = {
  pointId: 'co-word-length',
  subpoints: [
    {
      id: 'co-word-length-types',
      title: '几类"字长"的区别',
      blocks: [
        {
          id: 'kb-co-word-length-1-1',
          type: 'paragraph',
          text: '**机器字长**：CPU 内部一次运算（如 ALU 一次运算）能处理的二进制位数，也叫 CPU 字长、运算字长。它决定运算器和寄存器的位数。',
        },
        {
          id: 'kb-co-word-length-1-2',
          type: 'paragraph',
          text: '**存储字长**：主存中一个存储单元能存放的二进制位数，即一个存储字包含多少位。它与机器字长可以不同，例如机器字长 32 位、存储字长 16 位。',
        },
        {
          id: 'kb-co-word-length-1-3',
          type: 'paragraph',
          text: '**指令字长**：一条指令的二进制位数。它由指令格式决定，定长指令集中所有指令字长相同，变长指令集则不同。指令字长通常是字节的整数倍，也可能与机器字长一致（单字长指令）或不一致。',
        },
        {
          id: 'kb-co-word-length-1-4',
          type: 'paragraph',
          text: '**数据总线宽度**：CPU 与主存之间数据总线的根数，即一个总线周期内能并行传输的数据位数。它反映数据通路带宽，不一定等于机器字长，可能数倍于存储字长（低位交叉编址一次读多个数据）。',
        },
      ],
    },
    {
      id: 'co-mar-mdr',
      title: 'MAR、MDR 位数与主存容量',
      blocks: [
        {
          id: 'kb-co-word-length-2-1',
          type: 'paragraph',
          text: '**MAR**（存储器地址寄存器）存放访问主存的**物理**地址。主存地址线根数等于 MAR 的位数，MAR 位数为 $n$ 时最多可寻址 $2^n$ 个存储单元。',
        },
        {
          id: 'kb-co-word-length-2-2',
          type: 'paragraph',
          text: '**MDR**（存储器数据寄存器）存放从主存读出的或正要写入主存的数据，位数与存储字长一致，反映一次访存能传输的数据位数。',
        },
        {
          id: 'kb-co-word-length-2-6',
          type: 'html',
          html: `<svg viewBox="0 0 760 360" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { font-family: system-ui, sans-serif; }
    .reg { font-size: 15px; font-weight: 700; fill: #1e293b; text-anchor: middle; }
    .bus { font-size: 13px; font-weight: 600; }
    .foot { font-size: 12px; fill: #475569; text-anchor: middle; }
  </style>

  <!-- CPU -->
  <rect x="100" y="40" width="380" height="140" rx="8" fill="#eff6ff" stroke="#2563eb" stroke-width="2"/>
  <text x="290" y="66" class="reg" fill="#1d4ed8">CPU</text>

  <!-- MAR -->
  <rect x="130" y="90" width="140" height="55" rx="6" fill="#ffffff" stroke="#94a3b8" stroke-width="2"/>
  <text x="200" y="125" class="reg">MAR</text>

  <!-- MDR -->
  <rect x="310" y="90" width="140" height="55" rx="6" fill="#ffffff" stroke="#94a3b8" stroke-width="2"/>
  <text x="380" y="125" class="reg">MDR</text>

  <!-- 主存 -->
  <rect x="150" y="225" width="480" height="70" rx="8" fill="#f8fafc" stroke="#0f172a" stroke-width="2"/>
  <text x="390" y="268" class="reg">主存</text>

  <!-- 地址总线：MAR → 主存 -->
  <line x1="185" y1="150" x2="185" y2="220" stroke="#2563eb" stroke-width="1.5"/>
  <line x1="196" y1="150" x2="196" y2="220" stroke="#2563eb" stroke-width="1.5"/>
  <line x1="207" y1="150" x2="207" y2="220" stroke="#2563eb" stroke-width="1.5"/>
  <line x1="218" y1="150" x2="218" y2="220" stroke="#2563eb" stroke-width="1.5"/>
  <text x="232" y="190" class="bus" fill="#2563eb">地址总线</text>

  <!-- 数据总线：主存 → MDR -->
  <line x1="356" y1="150" x2="356" y2="220" stroke="#16a34a" stroke-width="1.5"/>
  <line x1="368" y1="150" x2="368" y2="220" stroke="#16a34a" stroke-width="1.5"/>
  <line x1="380" y1="150" x2="380" y2="220" stroke="#16a34a" stroke-width="1.5"/>
  <line x1="392" y1="150" x2="392" y2="220" stroke="#16a34a" stroke-width="1.5"/>
  <text x="406" y="190" class="bus" fill="#16a34a">数据总线</text>

  <text x="390" y="330" class="foot">读主存：地址 CPU→MAR→地址总线→主存；数据 主存→数据总线→MDR→CPU</text>
</svg>`,
        },
        {
          id: 'kb-co-word-length-2-3',
          type: 'paragraph',
          text: '**主存容量** = 存储单元个数 × 每个存储单元的位数（或字节数）。按字节编址时容量用字节表示，例如 MAR 24 位、按字节编址，则主存容量最大为 $2^{24}$ 字节 = 16MB。',
        },
        {
          id: 'kb-co-word-length-2-4',
          type: 'paragraph',
          text: String.raw`例：某计算机按字节编址，主存地址空间 64MB，则需 MAR 位数 = $\log_2(64M) = 26$ 位；MDR 位数由存储字长决定，与按字节编址无关。`,
        },
        {
          id: 'kb-co-word-length-2-5',
          type: 'callout',
          title: 'MAR 位数看寻址范围',
          text: '计算 MAR 位数：先确定编址单位（字节/字），再用主存容量 ÷ 寻址单位得到可寻址单元数，取以 2 为底的对数。',
          tone: 'blue',
        },
      ],
    },
  ],
}
