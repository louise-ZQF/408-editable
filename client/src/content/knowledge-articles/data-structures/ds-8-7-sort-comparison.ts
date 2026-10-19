import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const ds8_7SortComparisonArticle: KnowledgeArticleData = {
  pointId: 'ds-8-7-sort-comparison',
  subpoints: [
    {
      id: 'ds-8-7-s1',
      title: '各种排序算法的性质',
      blocks: [
        {
          id: 'kb-ds-8-7-1-1',
          type: 'paragraph',
          text: '下表把各排序算法的时间（最好、平均、最坏）、空间、稳定性与是否适用链表汇总在一起。',
        },
        {
          id: 'kb-ds-8-7-1-2',
          type: 'paragraph',
          text: String.raw`| 算法 | 类别 | 平均时间 | 最好时间 | 最坏时间 | 空间 | 稳定 | 适用链表 |
|------|------|----------|----------|----------|------|------|----------|
| 直接插入 | 插入 | $O(n^2)$ | $O(n)$ | $O(n^2)$ | $O(1)$ | 稳定 | ✅ |
| 折半插入 | 插入 | $O(n^2)$ | $O(n\log n)$ | $O(n^2)$ | $O(1)$ | 稳定 | ❌ |
| 希尔 | 插入 | $O(n^{1.3})$ | $O(n^{1.3})$ | $O(n^2)$ | $O(1)$ | 不稳定 | ❌ |
| 冒泡 | 交换 | $O(n^2)$ | $O(n)$ | $O(n^2)$ | $O(1)$ | 稳定 | ✅ |
| 快速 | 交换 | $O(n\log n)$ | $O(n\log n)$ | $O(n^2)$ | $O(\log n)$ 到 $O(n)$ | 不稳定 | ❌ |
| 简单选择 | 选择 | $O(n^2)$ | $O(n^2)$ | $O(n^2)$ | $O(1)$ | 不稳定 | ❌ |
| 堆 | 选择 | $O(n\log n)$ | $O(n\log n)$ | $O(n\log n)$ | $O(1)$ | 不稳定 | ❌ |
| 归并 | 归并 | $O(n\log n)$ | $O(n\log n)$ | $O(n\log n)$ | $O(n)$ | 稳定 | ✅ |
| 基数 | 非比较型排序 | $O(d(n+r))$ | $O(d(n+r))$ | $O(d(n+r))$ | $O(r)$ | 稳定 | ✅ |`,
        },
        {
          id: 'kb-ds-8-7-1-4',
          type: 'callout',
          title: '简单选择的链表说明',
          text: '简单选择排序依赖"按位置选出最小"，链表不支持随机访问，所以表中默认标记 ❌。实际上可以遍历链表找最小结点，把数据与当前头结点交换，逐位推进，也能在链表上实现简单选择排序。',
          tone: 'blue',
        },
      ],
    },
    {
      id: 'ds-8-7-s3',
      title: '排序算法的选型原则',
      blocks: [
        {
          id: 'kb-ds-8-7-3-1',
          type: 'paragraph',
          text: `- **数据规模小**：插入或简单选择实现简单，系数小。
- **数据基本有序**：直接插入最快（趋近 $O(n)$）。
- **对稳定性有要求**：只能在稳定算法里选（插入、冒泡、归并、基数）。
- **数据本身较大、交换困难**：选简单选择排序，它的交换次数最少，最多 $n-1$ 次，移动开销比其它 $O(n^2)$ 算法小得多。`,
        },
        {
          id: 'kb-ds-8-7-3-3',
          type: 'paragraph',
          text: String.raw`- **大序列且要求总体可控**：选堆或归并（保证 $O(n\log n)$）。堆不稳定，归并占 $O(n)$ 空间。
- **只找前 K**：用堆。`,
        },
      ],
    },
  ],
}
