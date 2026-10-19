import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const multicoreArticle: KnowledgeArticleData = {
  pointId: 'co-multicore',
  subpoints: [
    {
      id: 'co-flynn',
      title: '弗林分类法',
      blocks: [
        {
          id: 'kb-co-multicore-1-1',
          type: 'paragraph',
          text: '**弗林分类法**根据计算机中**指令流**和**数据流**的数量，把体系结构分为四类：SISD、SIMD、MISD、MIMD。',
        },
        {
          id: 'kb-co-multicore-1-2',
          type: 'paragraph',
          text: '**SISD**（单指令流单数据流）：每个指令部件每次译码一条指令，只对一份数据操作。传统单核处理器属于此类。',
        },
        {
          id: 'kb-co-multicore-1-3',
          type: 'paragraph',
          text: '**SIMD**（单指令流多数据流）：多个处理单元在同一时刻执行同一条指令，但分别处理不同数据，实现数据级并行。适合矩阵、向量、图像等重复计算。',
        },
        {
          id: 'kb-co-multicore-1-4',
          type: 'paragraph',
          text: '**MISD**（多指令流单数据流）：多个处理单元对同一份数据执行不同指令，实际中非常罕见，个别容错系统采用。\n\n**MIMD**（多指令流多数据流）：多个处理单元对不同的数据执行不同的指令，现代多核处理器是典型代表。',
        },
        {
          id: 'kb-co-multicore-1-6',
          type: 'html',
          html: `<svg viewBox="0 0 820 280" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { font-family: system-ui, sans-serif; }
    .title { font-size: 18px; font-weight: 700; fill: #1e293b; text-anchor: middle; }
    .cell { font-size: 15px; font-weight: 700; fill: #ffffff; text-anchor: middle; }
    .lbl { font-size: 13px; fill: #334155; text-anchor: middle; }
  </style>
  <text x="410" y="26" class="title">弗林分类法</text>

  <text x="215" y="58" class="lbl">单指令流</text>
  <text x="605" y="58" class="lbl">多指令流</text>
  <text x="60" y="120" class="lbl">单数据流</text>
  <text x="60" y="230" class="lbl">多数据流</text>

  <rect x="140" y="76" width="150" height="70" rx="8" fill="#2563eb"/>
  <text x="215" y="105" class="cell">SISD</text>
  <text x="215" y="128" class="cell" font-size="12">单核处理器</text>

  <rect x="530" y="76" width="150" height="70" rx="8" fill="#d97706"/>
  <text x="605" y="105" class="cell">MISD</text>
  <text x="605" y="128" class="cell" font-size="12">罕见（容错）</text>

  <rect x="140" y="186" width="150" height="70" rx="8" fill="#059669"/>
  <text x="215" y="215" class="cell">SIMD</text>
  <text x="215" y="238" class="cell" font-size="12">GPU、向量运算</text>

  <rect x="530" y="186" width="150" height="70" rx="8" fill="#7c3aed"/>
  <text x="605" y="215" class="cell">MIMD</text>
  <text x="605" y="238" class="cell" font-size="12">多核处理器</text>
</svg>`,
        },
      ],
    },
    {
      id: 'co-multicore-core',
      title: '多核与超线程',
      blocks: [
        {
          id: 'kb-co-multicore-2-1',
          type: 'paragraph',
          text: '**物理核心**是 CPU 芯片上实际存在的独立硬件处理单元，每个核心有独立的运算电路和缓存，能独立执行指令。',
        },
        {
          id: 'kb-co-multicore-2-2',
          type: 'paragraph',
          text: '**逻辑核心**是通过**超线程**（Hyper-Threading）在物理核心上虚拟出的逻辑处理单元。每个逻辑核心有独立的寄存器集合，共享物理核心的执行单元和缓存。',
        },
        {
          id: 'kb-co-multicore-2-3',
          type: 'paragraph',
          text: '超线程让一个物理核心同时执行多个线程，提高 CPU 利用率。性能并不翻倍，因共享执行资源，实际提升通常只有 20% 到 30%。',
        },
        {
          id: 'kb-co-multicore-2-4',
          type: 'paragraph',
          text: '**共享内存多处理机**中多个处理器共享同一物理内存空间，处理器通过读写共享内存通信和同步，通过互连网络（总线、交叉开关）连接。',
        },
        {
          id: 'kb-co-multicore-2-5',
          type: 'callout',
          title: '物理核心 vs 逻辑核心',
          text: '物理核心是真实硬件，逻辑核心是操作系统层面识别的虚拟处理单元。超线程把"房子"隔成"房间"，但总资源不变。',
          tone: 'orange',
        },
      ],
    },
  ],
}
