import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'
import { prefixPostfixEvaluationAnimation } from '@/animations/data-structures/stack-expression/expression-evaluation'
import { infixPostfixConversionAnimation } from '@/animations/data-structures/stack-expression/infix-postfix'

export const ds3_2StackApplicationArticle: KnowledgeArticleData = {
  pointId: 'ds-3-2-stack-application',
  subpoints: [
    {
      id: 'ds-3-2-s1',
      title: '括号匹配',
      blocks: [
        {
          id: 'kb-ds-3-2-1-1',
          type: 'paragraph',
          text: '**括号匹配**使用栈：遇到左括号 `(`、`[`、`{` 进栈；遇到右括号时，若栈空则匹配失败（右括号多余），否则弹出栈顶与当前右括号**类型比对**，类型不一致则匹配失败。',
        },
        {
          id: 'kb-ds-3-2-1-2',
          type: 'paragraph',
          text: '栈顶总是保存最近、最应该被匹配的左括号，括号严格遵守嵌套次序（`([{}])` 合法，`([)]` 非法），栈的后进先出恰好匹配这种嵌套。',
        },
        {
          id: 'kb-ds-3-2-1-3',
          type: 'callout',
          title: '三种失败情形',
          text: '右括号多（扫描遇右括号时栈空）、左括号多（扫描结束栈非空）、类型不匹配（栈顶与右括号不同类）。',
          tone: 'orange',
        },
      ],
    },
    {
      id: 'ds-3-2-s2',
      title: '中缀转后缀',
      blocks: [
        {
          id: 'kb-ds-3-2-2-4',
          type: 'animation',
          animation: infixPostfixConversionAnimation,
          sourceImport: { path: '@/animations/data-structures/stack-expression/infix-postfix', localName: 'infixPostfixConversionAnimation', kind: 'named' },
        },
        {
          id: 'kb-ds-3-2-2-1',
          type: 'paragraph',
          text: String.raw`三种表达式写法：

1. **中缀表达式**：正常书写形式，如 $a+b$，需要括号规定优先级。
2. **后缀表达式**（逆波兰式）：运算符写在运算数之后，如 $ab+$，不需要括号且无歧义。
3. **前缀表达式**：运算符写在前面，如 $+ab$。

后缀求值最方便：只需一个操作数栈。`,
        },
        {
          id: 'kb-ds-3-2-2-2',
          type: 'paragraph',
          text: String.raw`| 运算符 | 优先级 | 结合方向 | 出栈条件 |
|---|---|---|---|
| 括号 ( | 最高（入栈后视作最低） | 不参与 | 遇右括号弹出直到 ( |
| *  / | 高 | 从左到右 | 栈顶优先级 ≥ 当前时弹出 |
| +  - | 低 | 从左到右 | 栈顶优先级 ≥ 当前时弹出 |`,
        },
        {
          id: 'kb-ds-3-2-2-3',
          type: 'paragraph',
          text: '**中缀转后缀**（借助符号栈）扫描每个元素：\n\n1. 运算数：直接输出。\n2. 左括号：进栈。\n3. 右括号：依次弹出符号栈顶并输出，直到弹出匹配的左括号（左括号只弹出不输出）。\n4. 运算符：与栈顶比较，**栈顶优先级更高或同优先级时先弹出栈顶**（保证同优先级从左到右运算），再把当前运算符进栈。\n\n扫描结束，把栈中剩余运算符全部弹出输出。',
        },
        
      ],
    },
    {
      id: 'ds-3-2-s3',
      title: '后缀表达式求值',
      blocks: [
        {
          id: 'kb-ds-3-2-3-4',
          type: 'animation',
          animation: prefixPostfixEvaluationAnimation,
          sourceImport: { path: '@/animations/data-structures/stack-expression/expression-evaluation', localName: 'prefixPostfixEvaluationAnimation', kind: 'named' },
        },
        {
          id: 'kb-ds-3-2-3-1',
          type: 'paragraph',
          text: '**后缀求值**只需一个操作数栈：\n\n1. 扫描后缀表达式，遇运算数进栈。\n2. 遇运算符，弹出栈顶两个数（先弹出的作右操作数、后弹出的作左操作数），运算后把结果压回栈。\n\n扫描结束，栈中唯一的元素即结果。',
        },
        {
          id: 'kb-ds-3-2-3-2',
          type: 'paragraph',
          text: String.raw`例如后缀 $ab+c*$：$a,b$ 进栈；遇 $+$，先弹出 $b$ 作右操作数、再弹出 $a$ 作左操作数，得 $a+b$；$c$ 进栈；遇 $*$，弹出 $(a+b)$ 与 $c$，得 $(a+b) \times c$。`,
        },
        {
          id: 'kb-ds-3-2-3-3',
          type: 'callout',
          title: '后缀求值先弹出的是右操作数',
          text: '减法、除法不满足交换律：先弹出的是右操作数。例如后缀 ab- 对 a、b 弹栈时应算 a 减 b（后弹出的作左操作数），写成 a-b，不能写反。',
          tone: 'orange',
        },
      ],
    },
    {
      id: 'ds-3-2-s5',
      title: '递归调用与函数调用栈',
      blocks: [
        {
          id: 'kb-ds-3-2-5-1',
          type: 'paragraph',
          text: '函数的递归调用靠**函数调用栈**实现。每次调用函数时，系统把**返回地址**、实参、局部变量、保存的现场信息压入栈顶；函数返回时从栈顶弹出这些信息、回到调用点继续执行。后调用的函数先返回，正好符合栈的 LIFO。',
        },
        {
          id: 'kb-ds-3-2-5-4',
          type: 'html',
          html: `<svg viewBox="0 0 720 420" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { font-family: system-ui, sans-serif; }
    .title { font-size: 16px; font-weight: 700; fill: #0f172a; text-anchor: middle; }
    .fn { font-size: 14px; font-weight: 700; fill: #0f172a; text-anchor: middle; }
    .det { font-size: 11px; fill: #475569; text-anchor: middle; }
    .lbl { font-size: 13px; font-weight: 700; fill: #334155; text-anchor: middle; }
    .note { font-size: 12px; fill: #475569; text-anchor: middle; }
  </style>
  <defs>
    <marker id="fsc" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#64748b"/></marker>
  </defs>

  <text x="360" y="24" class="title">函数调用栈：递归 fact(3) 的逐层压栈</text>

  <!-- 左半：调用序列 -->
  <text x="130" y="56" class="lbl">调用序列</text>
  <rect x="60" y="70" width="140" height="46" rx="6" fill="#dbeafe" stroke="#2563eb" stroke-width="1.6"/>
  <text x="130" y="90" class="fn" fill="#1d4ed8">fact(3)</text>
  <text x="130" y="107" class="det" fill="#1d4ed8">调用 fact(2)</text>
  <line x1="130" y1="118" x2="130" y2="140" stroke="#64748b" stroke-width="2" marker-end="url(#fsc)"/>
  <rect x="60" y="142" width="140" height="46" rx="6" fill="#dcfce7" stroke="#16a34a" stroke-width="1.6"/>
  <text x="130" y="162" class="fn" fill="#15803d">fact(2)</text>
  <text x="130" y="179" class="det" fill="#15803d">调用 fact(1)</text>
  <line x1="130" y1="190" x2="130" y2="212" stroke="#64748b" stroke-width="2" marker-end="url(#fsc)"/>
  <rect x="60" y="214" width="140" height="46" rx="6" fill="#fef3c7" stroke="#d97706" stroke-width="1.6"/>
  <text x="130" y="234" class="fn" fill="#b45309">fact(1)</text>
  <text x="130" y="251" class="det" fill="#b45309">基准情形，返回 1</text>

  <!-- 右半：调用栈 -->
  <text x="430" y="56" class="lbl">调用栈（栈底 → 栈顶）</text>
  <rect x="300" y="70" width="260" height="300" rx="8" fill="#f8fafc" stroke="#334155" stroke-width="1.8"/>
  <!-- main 帧（栈底） -->
  <rect x="318" y="322" width="224" height="36" rx="4" fill="#e2e8f0" stroke="#94a3b8"/>
  <text x="430" y="336" class="fn" fill="#334155">main 调用 fact(3)</text>
  <text x="430" y="350" class="det">返回地址 main+4</text>
  <!-- fact(3) 帧 -->
  <rect x="318" y="276" width="224" height="36" rx="4" fill="#dbeafe" stroke="#2563eb"/>
  <text x="430" y="290" class="fn" fill="#1d4ed8">fact(3)</text>
  <text x="430" y="304" class="det" fill="#1d4ed8">n=3，返回地址</text>
  <!-- fact(2) 帧 -->
  <rect x="318" y="230" width="224" height="36" rx="4" fill="#dcfce7" stroke="#16a34a"/>
  <text x="430" y="244" class="fn" fill="#15803d">fact(2)</text>
  <text x="430" y="258" class="det" fill="#15803d">n=2，返回地址</text>
  <!-- fact(1) 帧（栈顶） -->
  <rect x="318" y="184" width="224" height="36" rx="4" fill="#fef3c7" stroke="#d97706" stroke-width="2.2"/>
  <text x="430" y="198" class="fn" fill="#b45309">fact(1)</text>
  <text x="430" y="212" class="det" fill="#b45309">n=1，返回地址</text>

  <!-- 栈顶 / 栈底标记 -->
  <line x1="560" y1="202" x2="612" y2="202" stroke="#d97706" stroke-width="2"/>
  <text x="620" y="206" class="lbl" fill="#b45309" text-anchor="start">栈顶</text>
  <line x1="560" y1="340" x2="612" y2="340" stroke="#94a3b8" stroke-width="2"/>
  <text x="620" y="344" class="lbl" fill="#64748b" text-anchor="start">栈底</text>

  <text x="360" y="396" class="note">每进入一层调用压入一个栈帧（函数名、参数 n、返回地址），后调用者先入栈、位于栈顶</text>
  <text x="360" y="414" class="note">fact(1) 返回后从栈顶逐层弹出，回到上一层调用点的返回地址继续执行</text>
</svg>`,
        },
        {
          id: 'kb-ds-3-2-5-2',
          type: 'paragraph',
          text: '递归每层调用占据一个**栈帧**（活动记录），因此递归深度受栈容量限制，过深可能**栈溢出**。\n\n递归代码简洁，但相比循环多出函数调用开销、空间占用大。排序、树遍历常写成递归，深层或大量递归会考虑改为**非递归**（显式用栈）实现。',
        },
        {
          id: 'kb-ds-3-2-5-3',
          type: 'callout',
          title: '递归不改变被处理数据的存取顺序',
          text: '递归的栈是"函数调用序"栈，与数据结构的栈不同。求斐波那契、汉诺塔用的是调用序；括号匹配、表达式求值是用显式栈管理中间数据，两者栈的用途要分清。',
          tone: 'blue',
        },
      ],
    },
  ],
}
