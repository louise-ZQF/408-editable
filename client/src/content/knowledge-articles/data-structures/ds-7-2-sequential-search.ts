import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const ds7_2SequentialSearchArticle: KnowledgeArticleData = {
  pointId: 'ds-7-2-sequential-search',
  subpoints: [
    {
      id: 'ds-7-2-s1',
      title: '顺序查找的过程',
      blocks: [
        {
          id: 'kb-ds-7-2-1',
          type: 'paragraph',
          text: '**顺序查找**从查找表一端开始，按顺序逐个把给定值与元素的关键字比较，直至找到等于给定值的元素（查找成功）或整个表比较完仍未找到（查找失败）。它对**表是否有序没有要求**。',
        },
        {
          id: 'kb-ds-7-2-2',
          type: 'paragraph',
          text: '顺序查找既**适用于顺序存储的线性表**，也**适用于链式存储的线性链表**。因为查找过程只需要沿地址或指针逐个访问，不要求随机存取。',
        },
        {
          id: 'kb-ds-7-2-3',
          type: 'paragraph',
          text: '在线性链表上的顺序查找与顺序表一致：从头结点开始，每访问一个结点比较一次，比较到给定值相等或走到链表尾结束。时间复杂度都是 $O(n)$。',
        },
      ],
    },
    {
      id: 'ds-7-2-s2',
      title: '哨兵优化与 ASL 推导',
      blocks: [
        {
          id: 'kb-ds-7-2-4',
          type: 'paragraph',
          text: '**哨兵（监视哨）优化**：在表的**下标 0 处先存入给定值**作哨兵，然后从表尾（下标 $n$）向表头倒着查找。这样循环内每次只需做一次比较（比较关键字），不必每轮都判断"是否越界"，省去了下标越界检查，可减少约一半的比较次数。',
        },
        {
          id: 'kb-ds-7-2-5',
          type: 'paragraph',
          text: '**成功 ASL（平均查找长度）**：元素个数为 $n$，第 $i$ 个元素的比较次数是 $c_i = n - i + 1$（从表尾往回数）。若每个元素等概率 $p_i = 1/n$，则成功 ASL 为 $(n+1)/2$。',
        },
        {
          id: 'kb-ds-7-2-6',
          type: 'formula',
          formula: String.raw`ASL_{成功} = \frac{1}{n}\sum_{i=1}^{n}(n-i+1) = \frac{n+1}{2}`,
        },
        {
          id: 'kb-ds-7-2-7',
          type: 'paragraph',
          text: '**失败 ASL**：查找失败时要把整个表比较一遍，共比较 $n+1$ 次（最后那一次用于越过表尾或与哨兵相等而判定失败），故 $ASL_{失败} = n+1$。顺序表与链表都一样，失败时遍历全部元素。',
        },
      ],
    },
  ],
}
