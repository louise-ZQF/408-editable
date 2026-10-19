import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'
import { fastSlowPointersAnimation } from '@/animations/data-structures/linear-list/fast-slow-pointers'

export const ds2_5ApplicationArticle: KnowledgeArticleData = {
  pointId: 'ds-2-5-application',
  subpoints: [
    {
      id: 'ds-2-5-s1',
      title: '有序顺序表合并',
      blocks: [
        {
          id: 'kb-ds-2-5-1',
          type: 'paragraph',
          text: '两个有序顺序表 A、B 合并为有序表 C，用**归并**思路：设 $i$、$j$、$k$ 三个下标分别指向 A、B、C，每次比较 $A[i]$ 与 $B[j]$，把较小者写入 $C[k]$ 并后移对应下标，循环到某一方取完，再把另一方的剩余元素整体搬入 C。',
        },
        {
          id: 'kb-ds-2-5-2',
          type: 'paragraph',
          text: '**时空复杂度**：每个元素恰好被比较并写入一次，时间复杂度 $O(n+m)$；额外需要一个数组 C，空间复杂度 $O(n+m)$。',
        },
        {
          id: 'kb-ds-2-5-3',
          type: 'paragraph',
          text: String.raw`伪代码：
${'`'}${'`'}${'`'}
i=1; j=1; k=1
while i<=LA.len and j<=LB.len:
    if A[i] <= B[j]: C[k]=A[i]; i++
    else:            C[k]=B[j]; j++
    k++
while i<=LA.len: C[k]=A[i]; i++; k++
while j<=LB.len: C[k]=B[j]; j++; k++
${'`'}${'`'}${'`'}`,
        },
        {
          id: 'kb-ds-2-5-4',
          type: 'callout',
          title: '别漏掉剩余尾巴',
          text: '主循环以某一方耗尽而结束，必须补收另一方的剩余元素。漏掉 while 收尾会把剩余元素丢掉，这是归并类题最常见的丢分点。',
          tone: 'orange',
        },
      ],
    },
    {
      id: 'ds-2-5-s2',
      title: '单链表就地逆置',
      blocks: [
        {
          id: 'kb-ds-2-5-5',
          type: 'paragraph',
          text: '**就地逆置**要求不新开数组/链表，只原地改指针。做法是**头插法思路**：把头结点摘下来当空链，然后依次把原链表每个结点头插到新链上，头插的次序天然逆序，扫描一趟即完成逆置。',
        },
        {
          id: 'kb-ds-2-5-6',
          type: 'paragraph',
          text: String.raw`伪代码（带虚拟头结点 p）：
${'`'}${'`'}${'`'}
q = L.next; L.next = NULL   // 摘空头结点
while q != NULL:
    r = q.next              // 保存 q 的后继
    q.next = L.next         // q 头插
    L.next = q
    q = r
${'`'}${'`'}${'`'}
空间复杂度 $O(1)$，时间复杂度 $O(n)$。`,
        },
        {
          id: 'kb-ds-2-5-7',
          type: 'paragraph',
          text: '**头插法逆置的妙处**：每次把当前结点插到头结点之后，新插入的总是最靠前，遍历顺序天然倒置，一趟 $O(n)$ 完成，无需额外空间。技巧同样可用于"判断链表对称""重排链表"等问题。',
        },
        {
          id: 'kb-ds-2-5-8',
          type: 'callout',
          title: '逆置前先保存后继',
          text: '头插前必须先 r=q.next 把后继存好。因为 q.next 会被改成新链，不先备份会丢掉原链之后的结点，链表就断了。',
          tone: 'orange',
        },
      ],
    },
    {
      id: 'ds-2-5-s4',
      title: '两个有序链表的合并',
      blocks: [
        {
          id: 'kb-ds-2-5-13',
          type: 'paragraph',
          text: '**归并两个有序单链表**：用 pa、pb 分别指向两个递增链的首结点，比较二者 data，小的取下来挂到结果链 r 之后；某一方取空后，把另一方剩余结点**整体**接到 r 之后（链表可 $O(1)$ 挂整段，不必逐结点搬）。',
        },
        {
          id: 'kb-ds-2-5-14',
          type: 'paragraph',
          text: '`pa && pb` 循环不断，取出小者接入 r；循环后用 `r->next = (pa ? pa : pb)` 把剩余链整体挂上。**原地归并**时空复杂度：$O(n+m)$、$O(1)$（不新建结点，只重接指针）。',
        }
      ],
    },
    {
      id: 'ds-2-5-s5',
      title: '线性表的应用',
      blocks: [
        {
          id: 'kb-ds-2-5-25',
          type: 'animation',
          animation: fastSlowPointersAnimation,
          sourceImport: { path: '@/animations/data-structures/linear-list/fast-slow-pointers', localName: 'fastSlowPointersAnimation', kind: 'named' },
        },
        {
          id: 'kb-ds-2-5-17',
          type: 'paragraph',
          text: '线性表综合题常给一个数组或链表，要求**时间尽可能高效**（通常 $O(n)$）、空间尽量小（尽量 $O(1)$）地完成某个操作。这类题不靠背代码，按通法拆解：',
        },
        {
          id: 'kb-ds-2-5-18',
          type: 'paragraph',
          text: `**① 先定遍历方式**
数组题一般一次或两次线性扫描；链表题先想清楚是**尾插、头插还是原地改指针**，是否需要快慢指针（找中点、判环）、倒序遍历（递归或栈）。`,
        },
        {
          id: 'kb-ds-2-5-19',
          type: 'paragraph',
          text: `**② 用数据规模决定要不要辅助空间**
若题面只要求"时间尽可能高效"，通常允许**空间换时间**：开一个与值域等长的标记数组，把反复比较降到 $O(n)$。若明确要求原地、$O(1)$ 空间，才必须省掉辅助数组。`,
        },
        {
          id: 'kb-ds-2-5-21',
          type: 'paragraph',
          text: `**③ 值 ↔ 下标映射**
元素取值有界的数组（如 $1$ 到 $n$ 或 $0$ 到 $n-1$），把 A[i] 归位到下标 A[i]-1 处，一趟交换后数组自带位置信息，后续判断"缺了谁、多了谁、重复谁"都变成 $O(1)$ 查下标。`,
        },
        {
          id: 'kb-ds-2-5-22',
          type: 'paragraph',
          text: `**④ 候选 + 验证**
找"出现次数过半"这类多数问题，用计数器一趟确定候选、再一趟验证，不必排序也不用哈希。`,
        },
        {
          id: 'kb-ds-2-5-23',
          type: 'paragraph',
          text: `**⑤ 贪心思维**
每步都做当前看来最优的选择，不去回头调整。贪心成立的关键是能证明每步的局部最优最终能拼出全局最优。贪心不总是正确，但很多线性表最值题恰好满足这个性质。`,
        },
        {
          id: 'kb-ds-2-5-24',
          type: 'paragraph',
          text: `**例：跳跃游戏**
给定非负整数数组 nums，初始位于下标 0，nums[i] 表示从该位置最多能向前跳到哪一格。判断能否跳到最后一个下标。

**解**
维护**最远可达位置** reach，初始 reach = 0。从左到右遍历每个位置 $i$，若 $i >$ reach，说明中间已经断了、到不了 $i$，直接判失败；否则更新 reach = max(reach, i + nums[i])，一旦 reach ≥ n-1 即可返回成功。

每步只依据当前格子更新一次"最远能到哪"，不回头看、不回溯，这是典型的贪心：每个位置的局部最优不断推进全局的 reach。

**答**：一趟扫描 $O(n)$，只用 reach 一个变量 $O(1)$ 空间。`,
        },
        {
          id: 'kb-ds-2-5-20',
          type: 'callout',
          title: '综合题的通法',
          text: '这类题解法收敛于三种思想：多数投票（候选+验证）、原地归位（值 ↔ 下标映射）、贪心（每步做当前最优选择）。',
          tone: 'blue',
        },
      ],
    },
  ],
}
