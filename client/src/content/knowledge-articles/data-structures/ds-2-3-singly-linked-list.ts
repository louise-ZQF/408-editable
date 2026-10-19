import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'
import { singlyLinkedListInsertDeleteAnimation } from '@/animations/data-structures/linear-list/singly-linked-list'

export const ds2_3SinglyLinkedListArticle: KnowledgeArticleData = {
  pointId: 'ds-2-3-singly-linked-list',
  subpoints: [
    {
      id: 'ds-2-3-s1',
      title: '头指针与头结点',
      blocks: [
        {
          id: 'kb-ds-2-3-1',
          type: 'paragraph',
          text: '**单链表**通过指针把各结点串联起来。每个结点由两部分组成：\n\n1. **数据域 data**：存元素。\n2. **指针域 next**：存后继结点地址。\n\n结点通过链地址（而非物理相邻）建立逻辑关系。',
        },
        {
          id: 'kb-ds-2-3-2',
          type: 'html',
          html: `<svg viewBox="0 0 720 190" xmlns="http://www.w3.org/2000/svg" style="display:block;width:min(100%,720px);height:auto;margin-inline:auto">
  <style>
    text { font-family: system-ui, sans-serif; }
    .title { font-size: 20px; font-weight: 700; fill: #0f172a; text-anchor: middle; }
    .data  { font-size: 17px; font-weight: 700; fill: #ffffff; text-anchor: middle; }
    .hdata { font-size: 15px; fill: #ffffff; text-anchor: middle; }
    .hd    { font-size: 17px; font-weight: 700; fill: #0f172a; text-anchor: middle; }
    .cap   { font-size: 14px; fill: #475569; text-anchor: middle; }
  </style>

  <text x="360" y="24" class="title">带头结点的单链表（data + next）</text>

  <text x="40" y="52" class="cap">头指针</text>
  <rect x="26" y="58" width="26" height="26" rx="3" fill="#ffffff" stroke="#0f172a" stroke-width="2"/>
  <text x="39" y="75" class="hd">L</text>

  <rect x="92" y="54" width="48" height="36" rx="4" fill="#64748b"/>
  <rect x="140" y="54" width="26" height="36" rx="4" fill="#475569"/>
  <text x="116" y="76" class="data">∧</text>
  <text x="153" y="76" class="hdata"> </text>
  <text x="116" y="106" class="cap">头结点</text>

  <rect x="228" y="54" width="36" height="36" rx="4" fill="#2563eb"/>
  <rect x="264" y="54" width="26" height="36" rx="4" fill="#1e40af"/>
  <text x="246" y="76" class="data">a1</text>
  <text x="277" y="76" class="data">•</text>

  <rect x="350" y="54" width="36" height="36" rx="4" fill="#2563eb"/>
  <rect x="386" y="54" width="26" height="36" rx="4" fill="#1e40af"/>
  <text x="368" y="76" class="data">a2</text>
  <text x="399" y="76" class="data">•</text>

  <rect x="470" y="54" width="36" height="36" rx="4" fill="#2563eb"/>
  <rect x="506" y="54" width="26" height="36" rx="4" fill="#1e40af"/>
  <text x="488" y="76" class="data">…</text>
  <text x="519" y="76" class="data">•</text>

  <rect x="590" y="54" width="36" height="36" rx="4" fill="#2563eb"/>
  <rect x="626" y="54" width="26" height="36" rx="4" fill="#1e40af"/>
  <text x="608" y="76" class="data">an</text>
  <text x="639" y="76" class="data">∧</text>

  <text x="277" y="110" class="cap">next 指向后继</text>
  <text x="56" y="122" class="cap">head 指向首结点</text>

  <defs>
    <marker id="nhead" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#0f172a"/>
    </marker>
  </defs>

  <line x1="52" y1="71" x2="90" y2="71" stroke="#0f172a" stroke-width="2.5" marker-end="url(#nhead)"/>
  <line x1="166" y1="72" x2="226" y2="72" stroke="#0f172a" stroke-width="2.5" marker-end="url(#nhead)"/>
  <line x1="290" y1="72" x2="348" y2="72" stroke="#0f172a" stroke-width="2.5" marker-end="url(#nhead)"/>
  <line x1="412" y1="72" x2="468" y2="72" stroke="#0f172a" stroke-width="2.5" marker-end="url(#nhead)"/>
  <line x1="532" y1="72" x2="588" y2="72" stroke="#0f172a" stroke-width="2.5" marker-end="url(#nhead)"/>
</svg>`,
        },
        {
          id: 'kb-ds-2-3-3',
          type: 'paragraph',
          text: '**头指针** L 指向链表第一个结点，用于标识整个链表，一个链表只有一个头指针。\n\n**头结点**是首元素结点之前的"哨兵"结点：其 data 域不存数据或存长度，next 域指向第一个数据结点。头结点可有可无。',
        },
        {
          id: 'kb-ds-2-3-4',
          type: 'paragraph',
          text: '引入头结点的好处是统一**空表与非空表**的处理。带头结点时，空表的 L->next=NULL，插入、删除操作无需对第一个结点单独特判，代码更统一。',
        },
        {
          id: 'kb-ds-2-3-5',
          type: 'callout',
          title: '不带头结点第一个结点特判',
          text: '不带头结点时，第一个结点就是元素结点，对表头的插入、删除要单独修改头指针。带头结点后，头指针指向固定的头结点，不再需要这种特判。',
          tone: 'orange',
        },
      ],
    },
    {
      id: 'ds-2-3-s2',
      title: '用头插法或尾插法建立单链表',
      blocks: [
        {
          id: 'kb-ds-2-3-6',
          type: 'paragraph',
          text: '**头插法**：每读入一个元素，都作为新结点插入到表头（头结点之后），新结点 next = 头结点.next，头结点.next = 新结点。**输出顺序与输入顺序相反**（逆序）。',
        },
        {
          id: 'kb-ds-2-3-7',
          type: 'paragraph',
          text: '**尾插法**：额外用一个尾指针 r 始终指向当前最后一个结点，每读入一个元素接到 r 之后并更新 r。**输出顺序与输入顺序相同**（正序）。尾指针 r 初始化指向头结点，结束时令最后一个结点的 next 置 NULL。',
        },
        {
          id: 'kb-ds-2-3-8',
          type: 'paragraph',
          text: String.raw`| 建表方式 | 插入位置 | 结点顺序 | 是否需要尾指针 |
|---|---|---|---|
| 头插法 | 每次都插在头结点之后 | 与输入逆序 | 否 |
| 尾插法 | 每次都接在表尾 | 与输入正序 | 是 |`,
        },
      ],
    },
    {
      id: 'ds-2-3-s3',
      title: '单链表的查找',
      blocks: [
        {
          id: 'kb-ds-2-3-9',
          type: 'paragraph',
          text: '**按序号查找**：从第一个结点起挨个找，第 $i$ 次找到第 $i$ 个结点。链表不能随机存取，无论找哪个序号都必须从头遍历，最坏 $O(n)$。',
        },
        {
          id: 'kb-ds-2-3-10',
          type: 'paragraph',
          text: '**按值查找**：从头遍历，比较各结点 data 是否等于给定值，返回第一个匹配的结点，最坏 $O(n)$。',
        },
       
      ],
    },
    {
      id: 'ds-2-3-s4',
      title: '单链表的插入与删除',
      blocks: [
        {
          id: 'kb-ds-2-3-19',
          type: 'animation',
          animation: singlyLinkedListInsertDeleteAnimation,
          sourceImport: {
            path: '@/animations/data-structures/linear-list/singly-linked-list',
            localName: 'singlyLinkedListInsertDeleteAnimation',
            kind: 'named',
          },
        },
        {
          id: 'kb-ds-2-3-12',
          type: 'paragraph',
          text: '**后插**：在已知结点 p 之后插入新结点 s，只需两行：s->next = p->next; p->next = s。已拿到 p 时插入本身是 $O(1)$；若还要先找 p，查找是 $O(n)$。',
        },
        {
          id: 'kb-ds-2-3-13',
          type: 'paragraph',
          text: '**前插**：已知结点 p，想在 p 之前插入 s，不必从头找 p 的前驱，用"**交换数据**"技巧：先把 s 插在 p 之后，再交换 s 与 p 两个结点的 data。这样仍是 $O(1)$。',
        },
        {
          id: 'kb-ds-2-3-14',
          type: 'paragraph',
          text: '**删除后继**：已知结点 p，删除其后继 q 只需 p->next = q->next; free(q)，$O(1)$。\n\n**删除 p 自身**：用"覆盖数据"技巧，令 q=p->next，把 q 的 data 拷给 p，再令 p->next = q->next 并 free(q)，借后继之身删掉 p，也是 $O(1)$。',
        },
        {
          id: 'kb-ds-2-3-15',
          type: 'paragraph',
          text: String.raw`| 操作 | 已定位到 p | 需要找前驱 | 时间复杂度 |
|---|---|---|---|
| 在 p 后插 | 直接改两指针 | 不需要 | $O(1)$ |
| 在 p 前插 | 交换数据技巧 | 不需要 | $O(1)$ |
| 删 p 的后继 | 直接改指针 | 不需要 | $O(1)$ |
| 删 p 自身 | 覆盖数据技巧 | 不需要 | $O(1)$ |`,
        },
        {
          id: 'kb-ds-2-3-16',
          type: 'callout',
          title: '插入先改 s->next 后改 p->next',
          text: '在 p 后插入，第一行必须先让 s->next = p->next，第二行再 p->next = s。顺序写反会先切断链、丢掉 p 的原后继。',
          tone: 'orange',
        },
      ],
    },
    {
      id: 'ds-2-3-s5',
      title: '单链表与顺序表的对比',
      blocks: [
        {
          id: 'kb-ds-2-3-17',
          type: 'paragraph',
          text: String.raw`| 对比项 | 顺序表 | 单链表 |
|---|---|---|
| 存储方式 | 地址连续 | 结点离散，靠指针链接 |
| 存取方式 | 随机存取，按位序 $O(1)$ | 顺序存取，按位序 $O(n)$ |
| 插入/删除 | 需移动元素，平均 $O(n)$ | 指针改向即可，$O(1)$（已知位置） |
| 存储密度 | 高（=1，不存指针） | 低（每结点存 data+next） |
| 容量扩展 | 难，需重新分配 | 易，动态申请结点 |
| 时间开销 | 查找快、插入删慢 | 插入删快、查找慢 |
| 空间开销 | 分配连续空间，可能浪费 | 指针占用额外空间 |`,
        },
        {
          id: 'kb-ds-2-3-18',
          type: 'paragraph',
          text: '选型取决于操作特征：\n\n1. **频繁按位置访问**：用顺序表。\n2. **频繁插入删除**：用链表。\n3. **表长动态变化大、难以预先确定**：用链表。\n4. **表长基本固定且访问多**：用顺序表。',
        },
      ],
    },
  ],
}
