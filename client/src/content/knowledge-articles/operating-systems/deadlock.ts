import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const deadlockArticle: KnowledgeArticleData = {
  pointId: 'os-deadlock',
  subpoints: [
    {
      id: 'os-deadlock-basic',
      title: '死锁的基本概念与必要条件',
      blocks: [
        {
          id: 'kb-os-deadlock-1-1',
          type: 'paragraph',
          text: '**死锁**指多个进程因竞争资源而互相等待，每个进程都持有资源又等待其他进程释放资源，导致所有进程都无法向前推进。死锁一旦发生，除非外力干预，否则这些进程永远无法执行。',
        },
        {
          id: 'kb-os-deadlock-1-2',
          type: 'paragraph',
          text: '**死锁产生的四个必要条件**（必须同时满足）：\n\n- **互斥条件**：资源一次只能被一个进程占用。\n- **占有并等待**：进程已占有资源又等待其他资源。\n- **不可剥夺**：已占有的资源不能被强行剥夺，只能主动释放。\n- **循环等待**：存在一个进程-资源循环等待链。',
        },
        {
          id: 'kb-os-deadlock-1-3',
          type: 'paragraph',
          text: '**死锁的处理策略**分三个层次：\n\n- **预防**：破坏四个必要条件之一，使死锁不可能发生，属于静态措施。\n- **避免**：在资源分配前用算法判断是否安全，不安全则不分配，属于动态措施。\n- **检测与解除**：允许死锁发生，检测到后解除。',
        },
        {
          id: 'kb-os-deadlock-1-4',
          type: 'paragraph',
          text: '**资源数判断题型**：题目常问“系统至少多少个同类资源才保证不死锁”或“多少个进程就可能导致死锁”。\n\n**通用思路**：假设最坏情况，每个进程都占满“还差一个就够用”的资源数，即每个进程占 $k-1$ 个（$k$ 为每个进程最多需要的资源数）。此时再增加 1 个资源，就一定能有一个进程凑齐 $k$ 个资源运行完，运行完释放全部资源，其余进程依次完成。',
        },
        {
          id: 'kb-os-deadlock-1-5',
          type: 'paragraph',
          text: String.raw`**最少资源数**：$n$ 个进程、每个进程最多需要 $k$ 个同类资源时，保证不死锁的最少资源数为 $n \times (k-1) + 1$。
          **原理**：$n$ 个进程各占 $k-1$ 个，共占用 $n \times (k-1)$ 个，此时每个进程都还差 1 个；再给 1 个，某个进程拿到第 $k$ 个运行完释放全部资源，系统就不会死锁。
          **例题 1**：某系统有 3 个进程，每个进程最多需要 4 台同类设备，问至少几台设备保证不死锁？
          解：$n \times (k-1) + 1 = 3 \times 3 + 1 = 10$ 台。若只有 9 台，最坏 3 个进程各占 3 台，都还差 1 台，互相等待死锁。
          **例题 2**：系统有 8 台打印机，由 $K$ 个进程竞争，每个进程最多需要 3 台，问 $K$ 最大为多少时系统不会死锁？
          解：要求 $8 \geq K \times (3-1) + 1 = 2K+1$，即 $2K \leq 7$，$K \leq 3.5$，所以 $K$ 最大为 3。若 $K=4$，则 $4 \times 2 + 1 = 9 > 8$，可能死锁。`,
        },
      ],
    },
    {
      id: 'os-deadlock-prevent',
      title: '死锁的预防',
      blocks: [
        {
          id: 'kb-os-deadlock-2-1',
          type: 'paragraph',
          text: '**预防死锁**即破坏四个必要条件之一，使死锁在系统设计层面不可能发生。',
        },
        {
          id: 'kb-os-deadlock-2-2',
          type: 'paragraph',
          text: '**① 破坏互斥条件**：让资源可以被多个进程共享使用，如把打印机改造成 SPOOLing（假脱机）虚拟设备。\n\n**原理**：互斥是很多资源固有的属性，无法真正消除，因此这条实际上很难实现。',
        },
        {
          id: 'kb-os-deadlock-2-3',
          type: 'paragraph',
          text: '**② 破坏占有并等待条件**：规定进程在运行前一次性申请它所需的全部资源，或者进程在请求新资源前必须先释放已占有的资源。\n\n**原理**：破坏该条件后，进程只有两种状态：不占有任何资源，或者已占有所需的全部资源，不会出现“占有资源又等资源”的情况。\n\n**缺点**：资源利用率低，可能长时间占有空闲资源。',
        },
        {
          id: 'kb-os-deadlock-2-4',
          type: 'paragraph',
          text: '**③ 破坏不可剥夺条件**：进程已占有的资源，若被其他进程请求，可被**强行剥夺**。\n\n**原理**：资源可剥夺后，进程无法长期独占等待，循环等待链被打破。\n\n**缺点**：实现复杂，被剥夺的进程需保存/恢复状态，降低系统效率，仅适用于可保存恢复的 CPU、内存资源，不适用于打印机等。',
        },
        {
          id: 'kb-os-deadlock-2-5',
          type: 'paragraph',
          text: '**④ 破坏循环等待条件**：采用**资源有序分配法**，给所有资源编号，进程只能按编号递增的顺序申请资源。\n\n**原理**：按序申请后不会形成环路（每个进程都申请比已持有的编号更大的资源，环路的“回边”不可能出现）。\n\n**缺点**：编号需合理设置，用户申请顺序受限制，可能导致资源浪费。',
        },
        {
          id: 'kb-os-deadlock-2-6',
          type: 'paragraph',
          text: '**预防策略总结**：\n\n| 破坏的条件 | 方法 | 缺点 |\n|---|---|---|\n| 互斥 | SPOOLing 等（共享化） | 多数资源无法共享，难实现 |\n| 占有并等待 | 一次性申请全部资源 | 资源利用率低 |\n| 不可剥夺 | 强行剥夺 | 实现复杂、开销大 |\n| 循环等待 | 资源有序分配 | 限制灵活性 |',
        },
      ],
    },
    {
      id: 'os-deadlock-avoid',
      title: '银行家算法',
      blocks: [
        {
          id: 'kb-os-deadlock-3-1',
          type: 'paragraph',
          text: '**死锁避免**在资源分配前动态判断本次分配是否安全，不安全则不分配。**银行家算法**按此思路工作：系统在每次分配资源前，检查分配后系统是否仍处于**安全状态**，只有安全才分配。',
        },
        {
          id: 'kb-os-deadlock-3-2',
          type: 'paragraph',
          text: '**安全状态与安全序列**：如果系统能按某种顺序（安全序列）为所有进程分配所需资源，使每个进程都能完成，则系统处于**安全状态**。存在安全序列则不会死锁。找不到安全序列则系统处于不安全状态，可能死锁。',
        },
        {
          id: 'kb-os-deadlock-3-3',
          type: 'paragraph',
          text: String.raw`**银行家算法的数据结构**：

- **Available**：各类可用资源数。
- **Max**：各进程最大需求矩阵。
- **Allocation**：已分配矩阵。
- **Need**：还需需求矩阵，$Need = Max - Allocation$。

**算法步骤**：

1. 进程提出请求 $Request$。
2. 若 $Request > Need$，报错。
3. 若 $Request > Available$，等待。
4. 试探性分配并更新 $Available$、$Allocation$、$Need$。
5. 执行**安全性检查**：找 $Need \leq Work$（当前可用）的未完成进程，假设它完成并回收资源（$Work += Allocation$），重复直到所有进程完成（安全）或找不到（不安全）。
6. 若安全则正式分配，否则回滚试探并让进程等待。`,
        },
        {
          id: 'kb-os-deadlock-3-4',
          type: 'paragraph',
          text: String.raw`**例题：找安全序列**。系统有 5 个进程 P0 到 P4，3 类资源 A/B/C，$Available = (3,3,2)$。各进程 Max 与 Allocation 如下，判断是否存在安全序列。
| 进程 | Max (A B C) | Allocation | Need |
|---|---|---|---|
| P0 | 7 5 3 | 0 1 0 | 7 4 3 |
| P1 | 3 2 2 | 2 0 0 | 1 2 2 |
| P2 | 9 0 2 | 3 0 2 | 6 0 0 |
| P3 | 2 2 2 | 2 1 1 | 0 1 1 |
| P4 | 4 3 3 | 0 0 2 | 4 3 1 |

$Work=(3,3,2)$。找 $Need \leq Work$：P1(1,2,2)✓，分配后 $Work=(5,3,2)$；P3(0,1,1)✓，$Work=(7,4,3)$；P4(4,3,1)✓，$Work=(7,4,5)$；P2(6,0,0)✓，$Work=(10,4,7)$；P0(7,4,3)✓。安全序列 $\langle P1,P3,P4,P2,P0 \rangle$ 存在，系统安全。`,
        },
      ],
    },
    {
      id: 'os-deadlock-detect',
      title: '死锁的检测与解除',
      blocks: [
        {
          id: 'kb-os-deadlock-4-1',
          type: 'paragraph',
          text: '**死锁检测**：允许死锁发生，但系统定期检测是否已死锁。用**资源分配图**描述进程与资源的申请/分配关系：\n\n- 进程 → 资源：申请边。\n- 资源 → 进程：分配边。\n\n若资源分配图中存在**环路**，则可能已死锁。',
        },
        {
          id: 'kb-os-deadlock-4-5',
          type: 'html',
          html: `<svg viewBox="0 0 640 340" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { font-family: system-ui, sans-serif; }
    .title { font-size: 15px; font-weight: 700; fill: #0f172a; text-anchor: middle; }
    .node { font-size: 15px; font-weight: 700; fill: #0f172a; text-anchor: middle; }
    .res  { font-size: 12px; font-weight: 700; fill: #0f172a; text-anchor: middle; }
    .leg  { font-size: 12px; fill: #475569; text-anchor: middle; }
    .note { font-size: 12px; fill: #64748b; text-anchor: middle; }
  </style>
  <defs>
    <marker id="req" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#dc2626"/></marker>
    <marker id="alc" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#2563eb"/></marker>
  </defs>

  <text x="320" y="24" class="title">资源分配图（RAG）：请求边与分配边</text>

  <!-- P1 进程 -->
  <circle cx="320" cy="72" r="30" fill="#ffffff" stroke="#334155" stroke-width="2.2"/>
  <text x="320" y="77" class="node">P1</text>

  <!-- P2 进程 -->
  <circle cx="320" cy="240" r="30" fill="#ffffff" stroke="#334155" stroke-width="2.2"/>
  <text x="320" y="245" class="node">P2</text>

  <!-- R1 资源（1 个实例） -->
  <rect x="500" y="126" width="88" height="60" rx="4" fill="#f8fafc" stroke="#0f172a" stroke-width="2"/>
  <text x="544" y="142" class="res">R1</text>
  <circle cx="544" cy="160" r="6" fill="#0f172a"/>
  <text x="544" y="178" class="res" font-size="10" fill="#64748b">1 个实例</text>

  <!-- R2 资源（1 个实例） -->
  <rect x="52" y="126" width="88" height="60" rx="4" fill="#f8fafc" stroke="#0f172a" stroke-width="2"/>
  <text x="96" y="142" class="res">R2</text>
  <circle cx="96" cy="160" r="6" fill="#0f172a"/>
  <text x="96" y="178" class="res" font-size="10" fill="#64748b">1 个实例</text>

  <!-- 请求边（虚线，P→R）：P1 请求 R1 -->
  <line x1="346" y1="86" x2="500" y2="150" stroke="#dc2626" stroke-width="2" stroke-dasharray="6 4" marker-end="url(#req)"/>
  <text x="428" y="118" class="leg" fill="#dc2626">P1 请求 R1</text>

  <!-- 分配边（实线，R→P）：R1 分配给 P2 -->
  <line x1="522" y1="184" x2="344" y2="228" stroke="#2563eb" stroke-width="2" marker-end="url(#alc)"/>
  <text x="445" y="222" class="leg" fill="#2563eb">R1 分配给 P2</text>

  <!-- 请求边：P2 请求 R2 -->
  <line x1="296" y1="230" x2="118" y2="186" stroke="#dc2626" stroke-width="2" stroke-dasharray="6 4" marker-end="url(#req)"/>
  <text x="196" y="222" class="leg" fill="#dc2626">P2 请求 R2</text>

  <!-- 分配边：R2 分配给 P1 -->
  <line x1="112" y1="128" x2="294" y2="84" stroke="#2563eb" stroke-width="2" marker-end="url(#alc)"/>
  <text x="196" y="110" class="leg" fill="#2563eb">R2 分配给 P1</text>

  <text x="200" y="296" class="note">虚线 = 请求边（P→R，进程申请资源）</text>
  <text x="440" y="296" class="note">实线 = 分配边（R→P，资源已分给进程）</text>
  <text x="320" y="320" class="note">存在环路 P1→R1→P2→R2→P1，且两类资源均为单实例，故 P1、P2 死锁</text>
</svg>`,
        },
        {
          id: 'kb-os-deadlock-4-2',
          type: 'paragraph',
          text: '**死锁检测算法**（类似银行家算法的安全性检查）：\n\n1. 维护 $Work = Available$ 和 $Finish$ 数组。\n2. 找 $Allocation$ 能被 $Work$ 满足的未完成进程，假设其完成并释放资源，重复该过程。\n3. 若最后存在 $Finish[i]=false$ 的进程，则该进程死锁。\n\n检测出死锁后，可报告死锁进程集合。',
        },
        {
          id: 'kb-os-deadlock-4-3',
          type: 'paragraph',
          text: '**死锁的解除方法**：\n\n- **① 资源剥夺法**：从死锁进程强行剥夺部分资源给其他进程，直到死锁解除。\n- **② 撤销进程法**：撤销部分或全部死锁进程，释放其资源。\n- **③ 进程回退法**：让死锁进程回退到进入死锁前的某个检查点，重新执行。\n\n**原则**：优先撤销代价最小（优先级低、执行时间短、使用资源少）的进程。',
        },
        {
          id: 'kb-os-deadlock-4-4',
          type: 'paragraph',
          text: '**三种策略对比**：\n\n| 策略 | 时机 | 资源利用率 | 实现难度 |\n|---|---|---|---|\n| 预防 | 静态设计 | 低 | 简单 |\n| 避免 | 分配时动态判断 | 中 | 需预知最大需求 |\n| 检测与解除 | 允许死锁后处理 | 高 | 复杂（检测+恢复） |',
        },
      ],
    },
  ],
}
