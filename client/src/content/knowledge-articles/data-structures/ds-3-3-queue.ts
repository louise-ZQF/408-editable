import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const ds3_3QueueArticle: KnowledgeArticleData = {
  pointId: 'ds-3-3-queue',
  subpoints: [
    {
      id: 'ds-3-3-s1',
      title: '队列的定义与基本操作',
      blocks: [
        {
          id: 'kb-ds-3-3-1-1',
          type: 'paragraph',
          text: '**队列**是只允许在**队尾**插入、**队头**删除的线性表，遵循**先进先出**（FIFO，First In First Out）原则。队头是删除端，队尾是插入端；先入队的元素先出队。',
        },
        {
          id: 'kb-ds-3-3-1-2',
          type: 'paragraph',
          text: '**基本操作**：`InitQueue`（初始化）、`QueueEmpty`（判空）、`EnQueue`（入队）、`DeQueue`（出队）、`GetHead`（读队头不删除）。栈是 LIFO、队列是 FIFO，二者操作受限的端相反。',
        },
        {
          id: 'kb-ds-3-3-1-3',
          type: 'callout',
          title: '队头出、队尾入',
          text: '插入一律在队尾、删除一律在队头，方向不可互换。',
          tone: 'orange',
        },
      ],
    },
    {
      id: 'ds-3-3-s2',
      title: '顺序队列的假溢出',
      blocks: [
        {
          id: 'kb-ds-3-3-2-1',
          type: 'paragraph',
          text: '顺序队列用数组存元素，设**队头指针** $front$ 和**队尾指针** $rear$。入队让 $rear$ 后移一位，出队让 $front$ 后移一位。队头不断后移后，前端空出的位置无法再被利用，出现 $rear$ 已到数组末尾而队前仍有空闲的情况。此时不能入队，但队列并未满，这就是**假溢出**。',
        },
        {
          id: 'kb-ds-3-3-2-2',
          type: 'paragraph',
          text: 'front 与 rear 的初始值可以约定为 0（front 指向队头元素、rear 指向队尾元素下一位置）。为计算元素个数，需区分"数组实际容量 $n$"与"队列当前长度"。',
        },
        {
          id: 'kb-ds-3-3-2-3',
          type: 'callout',
          title: '假溢出 ≠ 真溢出',
          text: '数组尾端已满但前端还有空闲时不进队，这叫假溢出；用循环队列把数组首尾相接即可消除假溢出、复用好前端空间。',
          tone: 'blue',
        },
      ],
    },
    {
      id: 'ds-3-3-s3',
      title: '循环队列',
      blocks: [
        {
          id: 'kb-ds-3-3-3-1',
          type: 'paragraph',
          text: String.raw`**循环队列**把数组首尾逻辑上相接，即下标 $i$ 的下一个位置是 $(i+1) \% \text{MaxSize}$。入队：${'`'}rear = (rear + 1) % MaxSize${'`'}；出队：${'`'}front = (front + 1) % MaxSize${'`'}。下标如此循环，前端的空闲单元得以重新利用。`,
        },
        {
          id: 'kb-ds-3-3-3-2',
          type: 'html',
          html: `<svg viewBox="0 0 420 250" xmlns="http://www.w3.org/2000/svg" style="display:block;width:min(100%,500px);height:auto;margin-inline:auto">
  <style>
    text { font-family: system-ui, sans-serif; }
    .lab { font-size: 15px; fill: #0f172a; text-anchor: middle; }
    .idx { font-size: 14px; fill: #64748b; text-anchor: middle; }
    .em  { font-size: 14px; fill: #94a3b8; text-anchor: middle; }
  </style>

  <text x="210" y="20" class="lab" font-weight="700">循环队列（MaxSize = 8，下标取模环绕）</text>

  <g stroke="#334155" stroke-width="2">
    <rect x="20" y="40" width="35" height="120" rx="3" fill="#f1f5f9"/>
    <rect x="55" y="40" width="35" height="120" rx="0" fill="#f1f5f9"/>
    <rect x="90" y="40" width="35" height="120" rx="0" fill="#dbeafe" stroke="#1e40af" stroke-width="2"/>
    <rect x="125" y="40" width="35" height="120" rx="0" fill="#dbeafe" stroke="#1e40af" stroke-width="2"/>
    <rect x="160" y="40" width="35" height="120" rx="3" fill="#dbeafe" stroke="#1e40af" stroke-width="2"/>
  </g>

  <text x="37.5" y="70" class="idx">0</text><text x="72.5" y="70" class="idx">1</text>
  <text x="107.5" y="70" class="idx">2</text><text x="142.5" y="70" class="idx">3</text>
  <text x="177.5" y="70" class="idx">4</text>

  <text x="37.5" y="100" class="em">空</text>
  <text x="72.5" y="100" class="em">空</text>
  <text x="107.5" y="100" class="lab">A</text>
  <text x="142.5" y="100" class="lab">B</text>
  <text x="177.5" y="100" class="lab">C</text>

  <text x="38" y="140" class="idx">rear → 0</text>
  <text x="108" y="140" class="idx">front → 2</text>

  <line x1="90" y1="168" x2="236" y2="168" stroke="#1e40af" stroke-width="2"/>
  <text x="263" y="172" class="idx">下标 2 → 3 → … 循环</text>
</svg>`,
        },
        {
          id: 'kb-ds-3-3-3-3',
          type: 'paragraph',
          text: String.raw`循环队列判空为 $front = rear$。但**仅用 front = rear 无法区分队空与队满**（队满时 front 也可能等于 rear），需牺牲一个存储单元：约定**队满为** $front = (rear+1) \% \text{MaxSize}$，队列实际最多只能存 $\text{MaxSize} - 1$ 个元素。`,
        },
        {
          id: 'kb-ds-3-3-3-4',
          type: 'formula',
          formula: String.raw`元素个数 = (rear - front + \text{MaxSize}) \% \text{MaxSize}`,
        },
        {
          id: 'kb-ds-3-3-3-5',
          type: 'paragraph',
          text: String.raw`这个公式对 $rear \geq front$ 与 $rear < front$（循环环绕后 rear 到 front 前面）两种情况统一适用，是循环队列元素个数的**通用公式**。`,
        },
        {
          id: 'kb-ds-3-3-3-6',
          type: 'callout',
          title: '牺牲一个单元判满',
          text: '标准做法是队满时让 rear 多转一格不存数据作"哨兵"，因此循环队列元素个数最大为容量减 1。若题目明确采用计数法或设标志位，则按题中约定判空判满。',
          tone: 'orange',
        },
      ],
    },
    {
      id: 'ds-3-3-s4',
      title: '链队列',
      blocks: [
        {
          id: 'kb-ds-3-3-4-1',
          type: 'paragraph',
          text: '**链队列**用单链表实现队列，队头是链表的**头**、队尾是链表的**尾**。**入队**在链尾插入新结点并让队尾指针后移，**出队**删去链头结点。为 $O(1)$ 出队，需同时维护队头和队尾两个指针。',
        },
        {
          id: 'kb-ds-3-3-4-2',
          type: 'paragraph',
          text: '链队列**不会假溢出**，只有当内存耗尽、无法分配到新结点时才无法入队。适合元素个数事先难以估计的场景。出队后若队列变空，要置队尾指针为空，避免悬空指针。',
        },
        {
          id: 'kb-ds-3-3-4-3',
          type: 'callout',
          title: '循环队列 vs 链队列',
          text: '循环队列容量固定、可能队满；链队列容量动态、不会队满（受内存限制）。队尾指针只在链队列需要，循环队列用下标取模即可。',
          tone: 'blue',
        },
      ],
    },{
      id: 'ds-3-4-s3',
      title: '双端队列',
      blocks: [
        {
          id: 'kb-ds-3-4-3-1',
          type: 'paragraph',
          text: '**双端队列**（deque，double-ended queue）在**队头、队尾两端都可插入和删除**，是栈与队列的推广。若一端只插、另一端只删，退化为普通队列；若插入端或删除端只有一端受限，就是**受限双端队列**。',
        },
        {
          id: 'kb-ds-3-4-3-2',
          type: 'paragraph',
          text: '**输入受限双端队列**：只允许一端插入，两端都可删除。\n\n**输出受限双端队列**：只允许一端删除，两端都可插入。\n\n二者介于普通队列与双端队列之间。',
        },
        {
          id: 'kb-ds-3-4-3-3',
          type: 'paragraph',
          text: String.raw`| 类型 | 插入端 | 删除端 | 出队序列自由度 |
|---|---|---|---|
| 普通队列 | 仅队尾 | 仅队头 | 只能保持入序 |
| 输入受限双端队列 | 仅一端 | 两端 | 中等 |
| 输出受限双端队列 | 两端 | 仅一端 | 中等 |
| 双端队列 | 两端 | 两端 | 最高 |`,
        },
        {
          id: 'kb-ds-3-4-3-4',
          type: 'paragraph',
          text: '**判断出队序列能否出现**：给定入队顺序，模拟每次操作在允许的端口入队、出队即可。对受限双端队列，先抓住"哪端受限"：只能插入的一端决定了元素进队的唯一位置，进而约束它后续只能在允许端被取出或继续排队。',
        },
        {
          id: 'kb-ds-3-4-3-5',
          type: 'callout',
          title: '先看哪个端口受限',
          text: '做题先读清是"输入受限"还是"输出受限"，再判断每个元素进出用的是哪一端。误把受限端当自由端，序列判断必错。',
          tone: 'orange',
        },
      ],
    },
  ],
}
