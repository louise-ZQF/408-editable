import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const ds3_1StackArticle: KnowledgeArticleData = {
  pointId: 'ds-3-1-stack',
  subpoints: [
    {
      id: 'ds-3-1-s1',
      title: '栈的定义与基本操作',
      blocks: [
        {
          id: 'kb-ds-3-1-1-1',
          type: 'paragraph',
          text: '**栈**是只允许在**一端**（栈顶）进行插入、删除操作的线性表，是一种操作受限的线性表。栈遵循**后进先出**（LIFO，Last In First Out）原则：后进入栈顶的元素先出栈。',
        },
        {
          id: 'kb-ds-3-1-1-2',
          type: 'paragraph',
          text: '栈底是栈中不允许操作的一端，栈顶是目前可操作的一端。栈为空时栈顶指针 $top$ 指向栈底；**进栈**（push）把元素压到栈顶之上，**出栈**（pop）取走栈顶元素。',
        },
        {
          id: 'kb-ds-3-1-1-3',
          type: 'paragraph',
          text: '栈的**基本操作**：`InitStack`（初始化）、`StackEmpty`（判空）、`Push`（进栈）、`Pop`（出栈）、`GetTop`（读栈顶不删除）、`DestroyStack`（销毁）。',
        },
        {
          id: 'kb-ds-3-1-1-4',
          type: 'callout',
          title: '进栈顺序确定出栈种类',
          text: '$n$ 个元素进栈、出栈的合法序列数是卡特兰数。判断"某固定进栈顺序下能否出现某个出栈序列"，直接穷举模拟即可。',
          tone: 'orange',
        },
      ],
    },
    {
      id: 'ds-3-1-s2',
      title: '顺序栈',
      blocks: [
        {
          id: 'kb-ds-3-1-2-1',
          type: 'paragraph',
          text: String.raw`**顺序栈**用一组地址连续的存储单元存放栈元素，用**栈顶指针** $top$ 指示栈顶位置。$top$ 有两种约定：

1. $top$ 指向**栈顶元素**（栈空时 $top = -1$）。
2. $top$ 指向**栈顶元素下一个位置**（栈空时 $top = 0$）。

两种约定进栈出栈代码不同，做题必须先看约定。`,
        },
        {
          id: 'kb-ds-3-1-2-2',
          type: 'formula',
          formula: String.raw`进栈：data[++top] = x \quad 出栈：x = data[top--]`,
        },
        {
          id: 'kb-ds-3-1-2-3',
          type: 'paragraph',
          text: '以上是 $top$ 指向栈顶元素（空栈 $top=-1$）的写法：进栈先自增 $top$ 再存数据，出栈先取数据再自减 $top$。若约定 $top$ 指向栈顶元素下一个位置（空栈 $top=0$），则进栈写成 `data[top++] = x`，出栈写成 `x = data[--top]`，取数和自增、自减的顺序正好相反。',
        },
        
        {
          id: 'kb-ds-3-1-2-5',
          type: 'paragraph',
          text: String.raw`**判空判满**分两种约定：

1. $top$ 指向**栈顶元素**（空栈 $top=-1$）：栈满 $top = \text{MaxSize} - 1$。
2. $top$ 指向**栈顶元素下一位置**（空栈 $top=0$）：栈满 $top = \text{MaxSize}$。

顺序栈的最大元素个数等于存储空间容量；超过容量进栈会**上溢**，对空栈出栈会**下溢**。`,
        },
      ],
    },
    {
      id: 'ds-3-1-s3',
      title: '共享栈与链栈',
      blocks: [
        {
          id: 'kb-ds-3-1-3-1',
          type: 'paragraph',
          text: '**共享栈**：用整块数组的两端各设一个栈顶指针 $top0$ 和 $top1$，两个栈从**两端向中间**增长。栈空时 $top0 = -1$、$top1 = n$；栈满条件为**两个指针相邻**，即 $top0 + 1 = top1$。共享栈能更充分地利用存储空间，减小栈上溢的概率。',
        },
        {
          id: 'kb-ds-3-1-3-2',
          type: 'paragraph',
          text: '**链栈**用单链表实现栈，栈顶是链表的**头**，进栈头插、出栈删头，均 $O(1)$。链栈不受固定容量限制，不会栈满（只有内存耗尽才无法分到结点）。\n\n代价是每个结点需额外存指针，且不能随机存取。当同时存在多个栈、各栈大小难以预估时，用链栈更合适。',
        },
        {
          id: 'kb-ds-3-1-3-3',
          type: 'callout',
          title: '顺序栈与链栈选择',
          text: '元素个数可事先估计选顺序栈（效率高）；多个栈共存、大小动态悬殊选共享栈或链栈。链栈不会上溢，本质是用指针空间换容量弹性。',
          tone: 'blue',
        },
      ],
    },
  ],
}
