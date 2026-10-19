import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const ds2_4DoubleCircularStaticListArticle: KnowledgeArticleData = {
  pointId: 'ds-2-4-double-circular-static-list',
  subpoints: [
    {
      id: 'ds-2-4-s1',
      title: '双链表',
      blocks: [
        {
          id: 'kb-ds-2-4-1',
          type: 'paragraph',
          text: '**双链表**每个结点含三个域：**prior**（前驱指针）、**data**（数据）、**next**（后继指针）。相比单链表，双链表多一个指针域，可**双向遍历**，删除某结点时能直接找到其前驱，不必从头找。',
        },
        {
          id: 'kb-ds-2-4-2',
          type: 'paragraph',
          text: '**双链表**的代价：每个结点多一个指针，存储密度更低；插入、删除要修改的指针更多，出错面更大。\n\n判空条件：**带头结点**的空双链表 L->next == NULL（循环表为 L->next == L）。',
        },
        {
          id: 'kb-ds-2-4-3',
          type: 'callout',
          title: '双链表比单链表多什么',
          text: '双链表能 $O(1)$ 找到某结点的前驱，用它来双向遍历、逆序处理、直接删除任意结点（不必找前驱）。代价是多一个 prior 指针。',
          tone: 'blue',
        },
      ],
    },
    {
      id: 'ds-2-4-s2',
      title: '双链表的插入与删除',
      blocks: [
        {
          id: 'kb-ds-2-4-4',
          type: 'paragraph',
          text: '在双链表结点 p 之后**插入**结点 s，需改 4 条指针，顺序如下：s->next = p->next; s->prior = p; p->next->prior = s; p->next = s。',
        },
        {
          id: 'kb-ds-2-4-5',
          type: 'paragraph',
          text: '前两步先让 s 的 prior、next 指向正确位置（挂到链上）；后两步再断开 p 与 p->next 的原有链接并接入 s。若 p 是尾结点，则 p->next 为空，`p->next->prior = s` 这一句要特判跳过。',
        },
        
        {
          id: 'kb-ds-2-4-7',
          type: 'paragraph',
          text: '**删除**双链表结点 p：直接把 p 的前驱、后继接起来：p->prior->next = p->next; p->next->prior = p->prior; free(p)。两步各改一条指针，把 p 摘出链外。',
        },
        {
          id: 'kb-ds-2-4-8',
          type: 'paragraph',
          text: '**删除易错点**：删 p 时同样要判 p 是否为尾结点，若 p->next == NULL，则 `p->next->prior` 失效，必须只执行前驱那一步（p->prior->next = NULL）再 free(p)。',
        },
        {
          id: 'kb-ds-2-4-9',
          type: 'callout',
          title: '双链表删除不用找前驱',
          text: '双链表删除任意结点 p，靠 p->prior 直接取到前驱，$O(1)$ 完成；单链表删 p 只能先找 p 的前驱（$O(n)$）或用覆盖数据的技巧。',
          tone: 'blue',
        },
      ],
    },
    {
      id: 'ds-2-4-s3',
      title: '循环链表',
      blocks: [
        {
          id: 'kb-ds-2-4-10',
          type: 'paragraph',
          text: '**循环单链表**：尾结点的 next 不再置 NULL，而是指向头结点（带头结点时）或首结点。可从任一结点出发访问整个链表；常设尾指针而非头指针，使表尾插入为 $O(1)$。判空条件：`L->next == L`。',
        },
        {
          id: 'kb-ds-2-4-11',
          type: 'paragraph',
          text: '**循环双链表**：尾结点的 next 指向头结点、头结点的 prior 指向尾结点，形成双向封闭回路。判空条件：`L->next == L`（此时也有 L->prior == L）。',
        },
        {
          id: 'kb-ds-2-4-12',
          type: 'paragraph',
          text: '**为什么设尾指针**：对循环链表，给定头指针若要在表尾插入还需 $O(n)$ 找尾；若直接用一个指向尾结点的指针 r，则 r->next 即首结点，表尾插入、首尾衔接都变 $O(1)$。',
        },
        {
          id: 'kb-ds-2-4-13',
          type: 'paragraph',
          text: String.raw`| 结构 | 尾后继 | 头前驱 | 判空条件 | 特点 |
|---|---|---|---|---|
| 单链表 | NULL | 无 | head 为空 | 只能从头向后 |
| 双链表 | NULL | NULL | head 为空 | 可双向 |
| 循环单链表 | 指向头/首 | 无 | L->next == L | 尾到尾回 |
| 循环双链表 | 指向头 | 指向尾 | L->next == L | 首尾互通 |`,
        },
        {
          id: 'kb-ds-2-4-14',
          type: 'callout',
          title: '循环链表判空',
          text: '有头结点的循环链表判空统一为 L->next == L。如果没有头结点，判空条件为 L==NULL。',
          tone: 'orange',
        },
        {
          id: 'kb-ds-2-4-18',
          type: 'callout',
          title: '尾结点的 next 指向头节点（若有）',
          text: '带头结点的循环链表，最后一个结点的 next 指向头结点，而不是指向第一个数据元素。',
          tone: 'blue',
        },
      ],
    },
    {
      id: 'ds-2-4-s4',
      title: '静态链表',
      blocks: [
        {
          id: 'kb-ds-2-4-15',
          type: 'paragraph',
          text: '**静态链表**用**一维数组**模拟链表：每个数组元素是一个结点，含数据域 data 和**游标 cursor**。游标存"下一个结点的数组下标"，作用是替代指针。\n\n静态链表适合不支持指针的语言（如早期 BASIC），或数据规模固定、需避免频繁动态分配的场景。',
        },
        {
          id: 'kb-ds-2-4-16',
          type: 'paragraph',
          text: '静态链表用 `cursor == -1`（或专门约定）表示链表结束。数组的**第 0 个元素**通常作为**头结点**，其 cursor 指向第一个数据结点。所有空闲结点通过另一条**备用结点链**组织起来，申请、释放结点时在这两条链之间移动结点。',
        },
        {
          id: 'kb-ds-2-4-17',
          type: 'paragraph',
          text: '静态链表仍是**顺序存储**的物理形态：结点物理相邻存放在数组里，但**逻辑关系由游标决定**，与下标无关。插入删除不需要移动元素，只要改游标。它的寻址方式是顺序存取（靠游标跳转），不能随机存取。',
        },
      ],
    },
  ],
}
