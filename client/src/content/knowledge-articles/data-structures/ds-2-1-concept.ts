import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const ds2_1ConceptArticle: KnowledgeArticleData = {
  pointId: 'ds-2-1-concept',
  subpoints: [
    {
      id: 'ds-2-1-s1',
      title: '线性表的定义',
      blocks: [
        {
          id: 'kb-ds-2-1-1',
          type: 'paragraph',
          text: String.raw`**线性表**是具有**相同数据类型**的 $n$ 个数据元素的有限序列，记为 $L=(a_1,a_2,\dots,a_{i-1},a_i,a_{i+1},\dots,a_n)$。当 $n=0$ 时称为**空表**，表中不含任何元素。`,
        },
        {
          id: 'kb-ds-2-1-2',
          type: 'paragraph',
          text: '线性表要求元素数据类型相同，且各元素除第一个和最后一个外，**每个元素都有且仅有一个前驱和一个后继**。这里的"前驱/后继"指逻辑上的相邻关系，与存储地址是否相邻无关。',
        },
        {
          id: 'kb-ds-2-1-3',
          type: 'paragraph',
          text: '线性表是一种**逻辑结构**。逻辑上相邻的元素，物理存储时既可以是连续的（顺序表），也可以不连续（链表）。逻辑结构相同，存储结构可以不同。',
        },
        {
          id: 'kb-ds-2-1-4',
          type: 'callout',
          title: '有限序列中的顺序',
          text: '线性表中的元素是有先后顺序的序列，$a_1$ 表示第一个元素，位置从 1 开始，各元素根据下标唯一确定。集合没有这种顺序，线性表有。',
          tone: 'orange',
        },
      ],
    },
    {
      id: 'ds-2-1-s2',
      title: '线性表的前驱与后继关系',
      blocks: [
        {
          id: 'kb-ds-2-1-5',
          type: 'paragraph',
          text: String.raw`线性表中相邻的两个元素具有**线性的逻辑关系**：对 $a_i$（$2\le i\le n$）而言，$a_{i-1}$ 是它的**直接前驱**，$a_{i+1}$ 是它的**直接后继**。`,
        },
        {
          id: 'kb-ds-2-1-6',
          type: 'paragraph',
          text: '**边界情况**：第一个元素 $a_1$ 没有前驱，是唯一没有直接前驱的元素；最后一个元素 $a_n$ 没有后继，是唯一没有直接后继的元素。',
        },
        {
          id: 'kb-ds-2-1-7',
          type: 'html',
          html: `<svg viewBox="0 0 480 150" xmlns="http://www.w3.org/2000/svg" style="display:block;width:min(100%,480px);height:auto;margin-inline:auto">
  <style>
    text { font-family: system-ui, sans-serif; }
    .label { font-size: 18px; font-weight: 700; fill: #0f172a; text-anchor: middle; }
    .ptxt  { font-size: 15px; fill: #0f172a; text-anchor: middle; }
  </style>

  <rect x="20"  y="40" width="58" height="40" rx="6" fill="#e0e7ff"/>
  <rect x="94"  y="40" width="58" height="40" rx="6" fill="#e0e7ff"/>
  <rect x="168" y="40" width="58" height="40" rx="6" fill="#dbeafe"/>
  <rect x="242" y="40" width="58" height="40" rx="6" fill="#dbeafe"/>
  <rect x="316" y="40" width="58" height="40" rx="6" fill="#e0e7ff"/>
  <rect x="390" y="40" width="58" height="40" rx="6" fill="#e0e7ff"/>

  <text x="49"   y="63" class="label">a1</text>
  <text x="123"  y="63" class="label">a2</text>
  <text x="197"  y="63" class="label">ai</text>
  <text x="271"  y="63" class="label">a(i+1)</text>
  <text x="345"  y="63" class="label">…</text>
  <text x="419"  y="63" class="label">an</text>

  <text x="49"   y="110" class="ptxt">无前驱</text>
  <text x="271"  y="110" class="ptxt">前驱</text>
  <text x="345"  y="110" class="ptxt">后继</text>
  <text x="419"  y="110" class="ptxt">无后继</text>

  <line x1="78"  y1="60" x2="92"  y2="60" stroke="#2563eb" stroke-width="2.5" marker-end="url(#arr)"/>
  <line x1="152" y1="60" x2="166" y2="60" stroke="#2563eb" stroke-width="2.5" marker-end="url(#arr)"/>
  <line x1="226" y1="60" x2="240" y2="60" stroke="#2563eb" stroke-width="2.5" marker-end="url(#arr)"/>
  <line x1="300" y1="60" x2="314" y2="60" stroke="#2563eb" stroke-width="2.5" marker-end="url(#arr)"/>
  <line x1="374" y1="60" x2="388" y2="60" stroke="#2563eb" stroke-width="2.5" marker-end="url(#arr)"/>

  <defs>
    <marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#2563eb"/>
    </marker>
  </defs>
</svg>`,
        },
      ],
    },
    {
      id: 'ds-2-1-s3',
      title: '线性表的基本操作',
      blocks: [
        {
          id: 'kb-ds-2-1-8',
          type: 'paragraph',
          text: '线性表的基本操作，是定义在逻辑结构之上的一组运算，抽象地描述了线性表能做什么。常用操作如下：',
        },
        {
          id: 'kb-ds-2-1-9',
          type: 'paragraph',
          text: String.raw`| 操作 | 作用 |
|---|---|
| InitList(&L) | 初始化，构造空的线性表 L |
| Length(L) | 求表长，返回元素个数 |
| LocateElem(L, e) | 按值查找，返回第一个值等于 e 的元素位置 |
| GetElem(L, i) | 按位序查找，返回第 i 个元素的值 |
| ListInsert(&L, i, e) | 在第 i 个位置插入元素 e |
| ListDelete(&L, i, &e) | 删除第 i 个元素，用 e 返回被删元素 |
| PrintList(L) | 输出线性表的所有元素 |
| Empty(L) | 判断是否为空表 |
| DestroyList(&L) | 销毁线性表，释放空间 |`,
        },
        {
          id: 'kb-ds-2-1-10',
          type: 'paragraph',
          text: '**按值查找**（LocateElem）按内容找位置，返回第一个值等于 e 的元素的位置（位序）。\n\n**按位序查找**（GetElem）按位置找内容，直接给定第几个位置，返回该位置的元素值。',
        },
        {
          id: 'kb-ds-2-1-11',
          type: 'callout',
          title: '& 表示引用（就地修改）',
          text: '凡是要修改线性表本身的操作（InitList、ListInsert、ListDelete、DestroyList）都带 & 引用参数，保证调用后原地生效；只读操作（Length、GetElem）不带。',
          tone: 'blue',
        },
      ],
    },
  ],
}
