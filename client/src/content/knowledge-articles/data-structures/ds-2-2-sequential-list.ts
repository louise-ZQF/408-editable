import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'
import { sequentialListInsertDeleteAnimation } from '@/animations/data-structures/linear-list/sequential-list'

export const ds2_2SequentialListArticle: KnowledgeArticleData = {
  pointId: 'ds-2-2-sequential-list',
  subpoints: [
    {
      id: 'ds-2-2-s1',
      title: '顺序存储与随机存取',
      blocks: [
        {
          id: 'kb-ds-2-2-1',
          type: 'paragraph',
          text: '**顺序表**用一组**地址连续**的存储单元依次存放线性表的元素，逻辑上相邻的元素在物理上也相邻。逻辑地址相邻、物理地址也相邻，这是顺序表与链表的根本区别。',
        },
        {
          id: 'kb-ds-2-2-2',
          type: 'paragraph',
          text: String.raw`顺序表支持**随机存取**：由首地址和下标直接算出元素地址。设首地址为 $\text{LOC}(a_1)$，每个元素占 $c$ 个存储单元，则第 $i$ 个元素地址为 $\text{LOC}(a_i)=\text{LOC}(a_1)+(i-1)\times c$。只要给定 $i$，无需遍历就能 $O(1)$ 访问第 $i$ 个元素。`,
        },
        {
          id: 'kb-ds-2-2-3',
          type: 'paragraph',
          text: '**随机存取**与**顺序存取**的差别在能否直接算出地址。顺序表按下标读任意元素是 $O(1)$，称随机存取。链表要按指针逐结点访问是 $O(n)$，称顺序存取。',
        },
        {
          id: 'kb-ds-2-2-4',
          type: 'callout',
          title: '随机存取来自地址公式',
          text: String.raw`随机存取依靠 $\text{LOC}(a_1)+(i-1)\times c$ 这类地址公式直接算出地址。链表无法由序号直接算地址，只能顺序找，所以只能是顺序存取。`,
          tone: 'blue',
        },
      ],
    },
    {
      id: 'ds-2-2-s2',
      title: '顺序表的插入与删除',
      blocks: [
        {
          id: 'kb-ds-2-2-16',
          type: 'animation',
          animation: sequentialListInsertDeleteAnimation,
          sourceImport: {
            path: '@/animations/data-structures/linear-list/sequential-list',
            localName: 'sequentialListInsertDeleteAnimation',
            kind: 'named',
          },
        },
        {
          id: 'kb-ds-2-2-5',
          type: 'paragraph',
          text: '**插入**：在第 $i$ 个位置插入元素 $e$，须先让第 $i$ 到第 $n$ 个元素各后移一个位置，空出第 $i$ 个位置再写入 $e$。假定表长 $n$，需要移动 $n-i+1$ 个元素（包括原本第 $i$ 个及其后的全部元素）。',
        },
        {
          id: 'kb-ds-2-2-6',
          type: 'paragraph',
          text: String.raw`**插入的平均移动次数**：在 $n$ 个元素的表中插入，合法位置为 $1$ 到 $n+1$ 共 $n+1$ 个，各位置概率相等（$\frac{1}{n+1}$），则 $E=\frac{1}{n+1}\sum_{i=1}^{n+1}(n-i+1)=\frac{n}{2}$。平均移动 $\frac{n}{2}$ 个元素，时间复杂度 $O(n)$。`,
        },
        {
          id: 'kb-ds-2-2-7',
          type: 'paragraph',
          text: String.raw`**删除**：删除第 $i$ 个元素，须把第 $i+1$ 到第 $n$ 个元素各前移一个位置。合法删除位置为 $1$ 到 $n$ 共 $n$ 个，需移动 $n-i$ 个元素，各位置概率相等时 $E=\frac{1}{n}\sum_{i=1}^{n}(n-i)=\frac{n-1}{2}$。平均移动 $\frac{n-1}{2}$ 个元素，时间复杂度 $O(n)$。`,
        },
        {
          id: 'kb-ds-2-2-8',
          type: 'paragraph',
          text: String.raw`| 操作 | 移动的元素 | 移动数量 | 平均移动 | 时间复杂度 |
|---|---|---|---|---|
| 插入第 i 个 | 第 i 到 n 后移 | $n-i+1$ | $\frac{n}{2}$ | $O(n)$ |
| 删除第 i 个 | 第 i+1 到 n 前移 | $n-i$ | $\frac{n-1}{2}$ | $O(n)$ |`,
        },
        {
          id: 'kb-ds-2-2-9',
          type: 'callout',
          title: '插入的末尾位置仍是移动 0 个',
          text: '在表尾插入（$i=n+1$）时 $n-i+1=0$，移动 0 个元素，此时是 $O(1)$。平均仍为 $O(n)$。注意插入位置范围是 $1$ 到 $n+1$，删除是 $1$ 到 $n$，别混。',
          tone: 'orange',
        },
      ],
    },
    {
      id: 'ds-2-2-s3',
      title: '顺序表的查找',
      blocks: [
        {
          id: 'kb-ds-2-2-10',
          type: 'paragraph',
          text: '**按位序查找**（GetElem）：直接由下标公式算出第 $i$ 个元素的地址，$O(1)$，这是顺序表随机存取的体现。',
        },
        {
          id: 'kb-ds-2-2-11',
          type: 'paragraph',
          text: String.raw`**按值查找**（LocateElem）：需从头顺序扫描，第一个值等于 $e$ 的元素即找到。平均比较次数为 $\frac{n+1}{2}$（从第 1 个到第 $n$ 个各概率相等），时间复杂度 $O(n)$。`,
        },
        {
          id: 'kb-ds-2-2-12',
          type: 'callout',
          title: '按值查找不是 O(1)',
          text: '只有按位序查找是 $O(1)$ 随机存取。按值查找要顺序比较内容，是 $O(n)$。顺序表"随机存取"指的是按下标，不是按值。',
          tone: 'orange',
        },
      ],
    },
    {
      id: 'ds-2-2-s4',
      title: '顺序表的优缺点与适用场景',
      blocks: [
        {
          id: 'kb-ds-2-2-13',
          type: 'paragraph',
          text: String.raw`| 对比项 | 顺序表 |
|---|---|
| 存取方式 | 随机存取，按位序 $O(1)$ |
| 插入/删除 | 需移动大量元素，平均 $O(n)$ |
| 存储密度 | 100%，不存指针，无额外开销 |
| 扩充容量 | 难，需重新分配更大空间并拷贝 |
| 内存利用 | 需预先分配连续空间，可能浪费或不足 |`,
        },
        {
          id: 'kb-ds-2-2-14',
          type: 'paragraph',
          text: '顺序表的**优点**是随机存取快、存储密度高。**缺点**是插入删除要移动大量元素、扩容代价大。因此适合元素访问频繁、插入删除少、表长基本固定的场景。',
        },
        {
          id: 'kb-ds-2-2-15',
          type: 'callout',
          title: '存储密度',
          text: '存储密度 = 结点本身占用的数据存储量 ÷ 结点占用的总存储量。顺序表每个元素只存数据，密度为 1；链表每个结点还要存指针，密度小于 1。',
          tone: 'blue',
        },
      ],
    },
  ],
}
