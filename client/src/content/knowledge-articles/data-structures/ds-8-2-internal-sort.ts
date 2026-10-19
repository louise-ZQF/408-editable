import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'
import { directInsertionSortAnimation } from '@/animations/data-structures/sorting/sorting-animations'
import { binaryInsertionSortAnimation } from '@/animations/data-structures/sorting/sorting-animations'
import { shellSortAnimation } from '@/animations/data-structures/sorting/sorting-animations'
import { bubbleSortAnimation } from '@/animations/data-structures/sorting/sorting-animations'
import { quickSortAnimation } from '@/animations/data-structures/sorting/sorting-animations'
import { selectionSortAnimation } from '@/animations/data-structures/sorting/sorting-animations'
import { heapSortAnimation } from '@/animations/data-structures/sorting/sorting-animations'
import { mergeSortAnimation } from '@/animations/data-structures/sorting/sorting-animations'
import { radixSortAnimation } from '@/animations/data-structures/sorting/sorting-animations'

export const ds8_2InternalSortArticle: KnowledgeArticleData = {
  pointId: 'ds-8-2-internal-sort',
  subpoints: [
    {
      id: 'ds-8-2-direct-insert',
      title: '直接插入排序',
      blocks: [
        {
          id: 'kb-ds-8-2-1-1',
          type: 'paragraph',
          text: '**直接插入排序**属于**插入类排序**。把序列看成"已排好的部分"和"待插入的部分"，每趟取出待插入元素，在已排序序列中从后向前扫，找到合适位置插入，直到全部有序。',
        },
        {
          id: 'kb-ds-8-2-1-3',
          type: 'paragraph',
          text: '**性能**：**最坏与平均**情况时间复杂度为 $O(n^2)$（序列逆序时每趟都要移动大量元素）；**最好**情况为 $O(n)$（序列基本有序时每趟只比较一次、不移动）。空间 $O(1)$，**稳定**。',
        },
        {
          id: 'kb-ds-8-2-1-4',
          type: 'callout',
          title: '对基本有序序列高效',
          text: '直接插入排序对基本有序的序列效率很高（趋近 $O(n)$），因此常作为快速排序在小区间时的收尾手段。',
          tone: 'blue',
        },
        {
          id: 'kb-ds-8-2-1-5',
          type: 'animation',
          animation: directInsertionSortAnimation,
          sourceImport: { path: '@/animations/data-structures/sorting/sorting-animations', localName: 'directInsertionSortAnimation', kind: 'named' },
        },
      ],
    },
    {
      id: 'ds-8-2-binary-insert',
      title: '折半插入排序',
      blocks: [
        {
          id: 'kb-ds-8-2-2-1',
          type: 'paragraph',
          text: '**折半插入排序**属于**插入类排序**，是直接插入的改进：待插入的序列已经有序，所以用**折半查找**（二分）找插入位置，而不是从后向前逐个比较。',
        },
        {
          id: 'kb-ds-8-2-2-2',
          type: 'paragraph',
          text: String.raw`**效果**：折半查找只减少了**关键字比较次数**（从 $O(n)$ 降到 $O(\log n)$），但**元素移动次数不变**，仍要整体后移元素，所以**时间复杂度仍是 $O(n^2)$**，空间 $O(1)$，**稳定**。`,
        },
        {
          id: 'kb-ds-8-2-2-3',
          type: 'callout',
          title: '比较少但移动不减',
          text: '折半插入只优化了"比较"，没优化"移动"。移动才是 $O(n^2)$ 的来源，所以总体复杂度不变。',
          tone: 'orange',
        },
        {
          id: 'kb-ds-8-2-2-4',
          type: 'animation',
          animation: binaryInsertionSortAnimation,
          sourceImport: { path: '@/animations/data-structures/sorting/sorting-animations', localName: 'binaryInsertionSortAnimation', kind: 'named' },
        },
      ],
    },
    {
      id: 'ds-8-2-shell',
      title: '希尔排序',
      blocks: [
        {
          id: 'kb-ds-8-2-3-1',
          type: 'paragraph',
          text: '**希尔排序**（缩小增量排序）属于**插入类排序**。把相隔某个**增量**的元素看成一组做直接插入排序，每趟缩小增量，最后增量为 1 时做一次完整插入排序。这样远离正确位置的元素能直接跳到目标附近，减少总移动量。',
        },
        {
          id: 'kb-ds-8-2-3-2',
          type: 'paragraph',
          text: String.raw`**增量序列**：常用 $n/2, n/4, \dots, 1$（逐步折半）。最后一趟增量必须是 1，否则不能保证全部有序。`,
        },
        {
          id: 'kb-ds-8-2-3-3',
          type: 'paragraph',
          text: '**性能**：时间复杂度约为 $O(n^{1.3})$ 到 $O(n^2)$ 之间，具体取决于增量序列；空间 $O(1)$，**不稳定**（组内插入跨越交换，可能改变相等元素次序）。',
        },
        {
          id: 'kb-ds-8-2-3-4',
          type: 'paragraph',
          text: '以序列 (9, 8, 7, 6, 5, 4, 3, 2) 增量为 4 为例：第 1、5 个元素 (9,5) 一组，第 2、6 个 (8,4) 一组，第 3、7 个 (7,3) 一组，第 4、8 个 (6,2) 一组，各组各自做直接插入。一趟后 5、4、3、2 分别前移。',
        },
        {
          id: 'kb-ds-8-2-3-7',
          type: 'callout',
          title: '组内插入破坏稳定性',
          text: '希尔排序组内插入时，跨增量的比较和移动会破坏稳定性，它是典型的不稳定排序。',
          tone: 'blue',
        },
        {
          id: 'kb-ds-8-2-3-6',
          type: 'animation',
          animation: shellSortAnimation,
          sourceImport: { path: '@/animations/data-structures/sorting/sorting-animations', localName: 'shellSortAnimation', kind: 'named' },
        },
      ],
    },
    {
      id: 'ds-8-3-bubble',
      title: '冒泡排序',
      blocks: [
        {
          id: 'kb-ds-8-3-1-1',
          type: 'paragraph',
          text: '**冒泡排序**属于**交换类排序**。从序列一端开始，相邻两两比较，逆序就交换，一趟下来该趟范围内的最大（或最小）元素"冒泡"到正确位置。如此多趟，直到比较中不再发生交换。',
        },
        {
          id: 'kb-ds-8-3-1-2',
          type: 'paragraph',
          text: '**提前结束**：若一趟比较过程中**没有发生任何交换**，说明序列已全部有序，可以提前结束。冒泡排序对有序序列高效，靠的就是这个。',
        },
        {
          id: 'kb-ds-8-3-1-3',
          type: 'paragraph',
          text: '**性能**：**平均与最坏** $O(n^2)$（序列逆序时比较次数最多），**最好** $O(n)$（已有序，只比较一趟）。空间 $O(1)$，**稳定**。',
        },
        {
          id: 'kb-ds-8-3-1-4',
          type: 'animation',
          animation: bubbleSortAnimation,
          sourceImport: { path: '@/animations/data-structures/sorting/sorting-animations', localName: 'bubbleSortAnimation', kind: 'named' },
        },
      ],
    },
    {
      id: 'ds-8-3-quick',
      title: '快速排序',
      blocks: [
        {
          id: 'kb-ds-8-3-2-1',
          type: 'paragraph',
          text: '**快速排序**属于**交换类排序**，基于划分：每次选一个元素作为**枢轴**（基准），一趟划分后，枢轴左边的元素都不大于它、右边的都不小于它，枢轴本身落在最终正确位置。然后对左右两个子区间递归执行同样操作，直到每个区间只剩一个元素。',
        },
        {
          id: 'kb-ds-8-3-2-3',
          type: 'paragraph',
          text: '**一趟划分的结果**：枢轴元素落到最终正确位置，左边都≤枢轴，右边都≥枢轴。判断"第几趟"就是看有多少个元素已经这样落位。',
        },
        {
          id: 'kb-ds-8-3-2-4',
          type: 'callout',
          title: '枢轴选取影响性能',
          text: '枢轴越接近中位数，两边越均衡，性能越好；若枢轴总取到最值（如已排序序列取首位），退化为 $O(n^2)$。',
          tone: 'orange',
        },
        {
          id: 'kb-ds-8-3-3-1',
          type: 'paragraph',
          text: String.raw`**时间复杂度**：**平均** $O(n\log n)$，**最坏** $O(n^2)$（每次划分一边为空，退化成类似冒泡的 $n$ 趟）。**递归次数**取决于划分的均衡程度：越均衡递归层数约 $\log n$，越偏斜越接近 $n$。`,
        },
        {
          id: 'kb-ds-8-3-3-2',
          type: 'paragraph',
          text: String.raw`**空间复杂度**：主要由**递归调用栈**深度决定。平均 $O(\log n)$，最坏 $O(n)$（退化为单支递归）。`,
        },
        {
          id: 'kb-ds-8-3-3-3',
          type: 'paragraph',
          text: '**稳定性**：**不稳定**。划分过程中枢轴会与远处的元素交换，可能跨越相等元素，改变相对次序。',
        },
        {
          id: 'kb-ds-8-3-2-5',
          type: 'animation',
          animation: quickSortAnimation,
          sourceImport: { path: '@/animations/data-structures/sorting/sorting-animations', localName: 'quickSortAnimation', kind: 'named' },
        },
      ],
    },
    {
      id: 'ds-8-4-selection',
      title: '简单选择排序',
      blocks: [
        {
          id: 'kb-ds-8-4-1-1',
          type: 'paragraph',
          text: '**简单选择排序**属于**选择类排序**。每趟从未排序区域里选出**最小的元素**，放到未排序区域的头部。n 个元素做 n-1 趟即可全部有序（最后一趟剩一个元素自动就位）。',
        },
        {
          id: 'kb-ds-8-4-1-2',
          type: 'paragraph',
          text: '**性能**：无论初始序列如何，**比较次数恒为 $n(n-1)/2$**。第 1 趟比较 $n-1$ 次、第 2 趟 $n-2$ 次、…、最后一趟 1 次，求和即 $n(n-1)/2$，与初始序列无关。\n\n**移动次数很少**：最少 0 次（已有序），最多 $n-1$ 次（每趟最多交换 1 次）。空间 $O(1)$，**不稳定**（选择过程中可能跨越交换相等元素）。',
        },
        {
          id: 'kb-ds-8-4-1-3',
          type: 'callout',
          title: '比较次数与初始无关',
          text: '简单选择排序的比较次数恒为 $n(n-1)/2$，与初始序列无关；移动次数很少。',
          tone: 'blue',
        },
        {
          id: 'kb-ds-8-4-1-4',
          type: 'animation',
          animation: selectionSortAnimation,
          sourceImport: { path: '@/animations/data-structures/sorting/sorting-animations', localName: 'selectionSortAnimation', kind: 'named' },
        },
      ],
    },
    {
      id: 'ds-8-4-heap',
      title: '堆排序',
      blocks: [
        {
          id: 'kb-ds-8-4-2-1',
          type: 'paragraph',
          text: `**堆排序**属于**选择类排序**。**堆**是一棵完全二叉树。按结点与孩子的大小关系分两种：

1. **大根堆**——每个结点的值都不小于其左右孩子。
2. **小根堆**——每个结点的值都不大于其孩子。

堆用数组存储时，按完全二叉树的层序依次放入即可。下标从 1 还是从 0 起不影响堆的性质，两种约定的父、子下标换算公式不同，做题时按题目约定换算。`,
        },
        {
          id: 'kb-ds-8-4-2-2',
          type: 'html',
          html: `<svg viewBox="0 0 560 300" xmlns="http://www.w3.org/2000/svg" style="display:block;width:min(100%,600px);height:auto;margin-inline:auto">
  <style>
    text { font-family: system-ui, sans-serif; }
    .title { font-size: 19px; font-weight: 700; fill: #0f172a; text-anchor: middle; }
    .num   { font-size: 20px; font-weight: 700; fill: #ffffff; text-anchor: middle; }
    .mark  { font-size: 13.5px; fill: #64748b; }
  </style>

  <text x="280" y="24" class="title">大根堆：50 45 36 30 22 20 19</text>

  <circle cx="185" cy="70" r="26" fill="#d97706"/>
  <text x="185" y="76" class="num">50</text>

  <circle cx="105" cy="150" r="26" fill="#3b82f6"/>
  <text x="105" y="156" class="num">45</text>
  <circle cx="265" cy="150" r="26" fill="#3b82f6"/>
  <text x="265" y="156" class="num">36</text>

  <circle cx="60" cy="230" r="26" fill="#64748b"/>
  <text x="60" y="236" class="num">30</text>
  <circle cx="150" cy="230" r="26" fill="#64748b"/>
  <text x="150" y="236" class="num">22</text>
  <circle cx="225" cy="230" r="26" fill="#64748b"/>
  <text x="225" y="236" class="num">20</text>
  <circle cx="305" cy="230" r="26" fill="#64748b"/>
  <text x="305" y="236" class="num">19</text>

  <g stroke="#94a3b8" stroke-width="2">
    <line x1="185" y1="96" x2="110" y2="126"/>
    <line x1="185" y1="96" x2="260" y2="126"/>
    <line x1="105" y1="176" x2="68" y2="206"/>
    <line x1="105" y1="176" x2="145" y2="206"/>
    <line x1="265" y1="176" x2="232" y2="206"/>
    <line x1="265" y1="176" x2="300" y2="206"/>
  </g>

  <text x="280" y="274" class="mark">任一结点 ≥ 左右孩子，根为最大值</text>
</svg>`,
        },
        {
          id: 'kb-ds-8-4-2-3',
          type: 'paragraph',
          text: '**建堆**：从**最后一个非叶子结点**（即第一个有孩子结点的结点）开始，自下而上对每个结点做"下沉"调整：把父结点与其较大孩子比较，若父更小则与较大孩子交换，并继续下沉，直到满足大根堆性质。建堆复杂度 $O(n)$。',
        },
        {
          id: 'kb-ds-8-4-2-4',
          type: 'paragraph',
          text: String.raw`**堆排序**：把堆顶（最大值）与堆尾交换并弹出，再对堆顶做一次下沉调整。重复 $n-1$ 次，得到升序序列。时间复杂度**最坏、平均、最好均为 $O(n\log n)$**，空间 $O(1)$，**不稳定**。`,
        },
        {
          id: 'kb-ds-8-4-3-1',
          type: 'paragraph',
          text: '**插入**：把新元素放到堆末尾，然后自下而上"上浮"：若它比父结点大（大根堆），就与父结点交换，一路升到合适位置。插入一个元素需要从叶到根，比较次数约等于堆的高度。',
        },
        {
          id: 'kb-ds-8-4-3-2',
          type: 'paragraph',
          text: '**删除堆顶**：先用堆尾元素填补堆顶空位，再对堆顶做一次"下沉"调整（与较大孩子交换，直到比孩子大）。调整沿根到叶的路径走，比较次数约等于堆的高度。',
        },
        {
          id: 'kb-ds-8-4-4-1',
          type: 'paragraph',
          text: String.raw`堆特别适合**只找前 K 大或前 K 小**的问题：建一个含 K 个元素的小根堆（找前 K 大），遍历剩余元素，若比堆顶大就替换并下沉，最终堆里就是前 K 大的 K 个数。时间复杂度 $O(n\log K)$，无需排序整个序列。`,
        },
        {
          id: 'kb-ds-8-4-4-2',
          type: 'paragraph',
          text: `找前 K 个用哪个堆，取决于踢出谁：

1. 找前 K **大**用小根堆——堆顶是堆内最小，最小的先被踢掉。
2. 找前 K **小**用大根堆——堆顶是堆内最大，最大的先被踢掉。

这就是"取堆顶、比较、替换、下沉"的动态维护思路。`,
        },
        {
          id: 'kb-ds-8-4-2-5',
          type: 'animation',
          animation: heapSortAnimation,
          sourceImport: { path: '@/animations/data-structures/sorting/sorting-animations', localName: 'heapSortAnimation', kind: 'named' },
        },
      ],
    },
    {
      id: 'ds-8-5-merge',
      title: '归并排序',
      blocks: [
        {
          id: 'kb-ds-8-5-1-1',
          type: 'paragraph',
          text: '**归并操作**属于**归并类排序**，把两个**已经各自有序**的序列合并成一个有序序列：同时用两个指针扫两个序列，每次取较小的一个放入结果，长度之和为 $n$，最坏比较 $n-1$ 次，得到完整有序序列。',
        },
        {
          id: 'kb-ds-8-5-1-2',
          type: 'paragraph',
          text: '归并操作需要额外的辅助数组来放结果，因此一趟归并的空间开销为 $O(n)$。',
        },
        {
          id: 'kb-ds-8-5-1-3',
          type: 'callout',
          title: '比较次数上界',
          text: '归并两个长度和为 n 的有序序列，最坏需要比较 n-1 次。',
          tone: 'blue',
        },
        {
          id: 'kb-ds-8-5-2-1',
          type: 'paragraph',
          text: '**二路归并排序**：初始把每个元素看作长度为 1 的有序段，然后自底向上两两归并：第一趟合并成长度 2 的段，第二趟合并成长度 4 的段，如此倍增，直到整个序列合并为一个有序段。',
        },
        {
          id: 'kb-ds-8-5-2-2',
          type: 'html',
          html: `<svg viewBox="0 0 560 280" xmlns="http://www.w3.org/2000/svg" style="display:block;width:min(100%,600px);height:auto;margin-inline:auto">
  <style>
    text { font-family: system-ui, sans-serif; }
    .title { font-size: 19px; font-weight: 700; fill: #0f172a; text-anchor: middle; }
    .stage { font-size: 14px; font-weight: 700; fill: #334155; }
    .num   { font-size: 17px; font-weight: 700; fill: #ffffff; text-anchor: middle; }
    .mark  { font-size: 12.5px; fill: #64748b; text-anchor: middle; }
  </style>

  <text x="280" y="24" class="title">二路归并排序：15 24 5 9 31 8 20 1</text>

  <text x="16" y="58" class="stage">初始</text>
  <g>
    <rect x="150" y="42" width="40" height="28" rx="3" fill="#64748b"/><text x="170" y="60" class="num">15</text>
    <rect x="198" y="42" width="40" height="28" rx="3" fill="#64748b"/><text x="218" y="60" class="num">24</text>
    <rect x="246" y="42" width="40" height="28" rx="3" fill="#64748b"/><text x="266" y="60" class="num">5</text>
    <rect x="294" y="42" width="40" height="28" rx="3" fill="#64748b"/><text x="314" y="60" class="num">9</text>
    <rect x="342" y="42" width="40" height="28" rx="3" fill="#64748b"/><text x="362" y="60" class="num">31</text>
    <rect x="390" y="42" width="40" height="28" rx="3" fill="#64748b"/><text x="410" y="60" class="num">8</text>
    <rect x="438" y="42" width="40" height="28" rx="3" fill="#64748b"/><text x="458" y="60" class="num">20</text>
    <rect x="486" y="42" width="40" height="28" rx="3" fill="#64748b"/><text x="506" y="60" class="num">1</text>
  </g>
  <text x="560" y="60" class="mark">段长1</text>

  <text x="16" y="98" class="stage">第1趟</text>
  <g>
    <rect x="150" y="82" width="80" height="28" rx="3" fill="#3b82f6"/><text x="190" y="100" class="num">15 24</text>
    <rect x="246" y="82" width="80" height="28" rx="3" fill="#3b82f6"/><text x="286" y="100" class="num">5 9</text>
    <rect x="342" y="82" width="80" height="28" rx="3" fill="#3b82f6"/><text x="382" y="100" class="num">8 31</text>
    <rect x="438" y="82" width="80" height="28" rx="3" fill="#3b82f6"/><text x="478" y="100" class="num">1 20</text>
  </g>
  <text x="560" y="100" class="mark">段长2</text>

  <text x="16" y="138" class="stage">第2趟</text>
  <g>
    <rect x="150" y="122" width="172" height="28" rx="3" fill="#059669"/><text x="236" y="140" class="num">5 9 15 24</text>
    <rect x="342" y="122" width="172" height="28" rx="3" fill="#059669"/><text x="428" y="140" class="num">1 8 20 31</text>
  </g>
  <text x="560" y="140" class="mark">段长4</text>

  <text x="16" y="178" class="stage">第3趟</text>
  <g>
    <rect x="150" y="162" width="360" height="28" rx="3" fill="#d97706"/><text x="330" y="180" class="num">1 5 8 9 15 20 24 31</text>
  </g>
  <text x="560" y="180" class="mark">段长8</text>

  <g>
    <rect x="150" y="210" width="360" height="34" rx="3" fill="#f1f5f9"/>
    <text x="330" y="231" class="mark">归并趟数 = log2(n) = 3 趟</text>
  </g>
</svg>`,
        },
        {
          id: 'kb-ds-8-5-2-3',
          type: 'paragraph',
          text: String.raw`**复杂度**：每一趟归并比较 $O(n)$ 次，共需 $\log_2 n$ 趟，所以**最坏、平均、最好均为 $O(n\log n)$**。空间复杂度 $O(n)$（需辅助数组），**稳定**。`,
        },
        {
          id: 'kb-ds-8-5-2-4',
          type: 'paragraph',
          text: String.raw`**递归与迭代**：递归版自顶向下分治，迭代版自底向上归并，二者趟数相同，都是 $\log_2 n$ 趟，总复杂度一致。`,
        },
        {
          id: 'kb-ds-8-5-2-5',
          type: 'callout',
          title: '空间是 O(n)',
          text: String.raw`归并排序在稳定排序里时间最好（$O(n\log n)$），但代价是需要 $O(n)$ 的辅助数组，空间开销大，不是就地排序。`,
          tone: 'orange',
        },
        {
          id: 'kb-ds-8-5-1-5',
          type: 'animation',
          animation: mergeSortAnimation,
          sourceImport: { path: '@/animations/data-structures/sorting/sorting-animations', localName: 'mergeSortAnimation', kind: 'named' },
        },
      ],
    },
    {
      id: 'ds-8-6-radix',
      title: '基数排序',
      blocks: [
        {
          id: 'kb-ds-8-6-1-1',
          type: 'paragraph',
          text: '**基数排序**属于**非比较型排序**，不通过比较关键字大小，而是把关键字按位拆解，逐位进行**分配**和**收集**。**LSD**（最低位优先）：先按个位分，再按十位、百位…依次处理，每一位完成后收集，最后一位收集完即整体有序。',
        },
        {
          id: 'kb-ds-8-6-1-2',
          type: 'paragraph',
          text: `两个参数要先分清：

1. **d** 表示关键字位数，也就是分配收集的轮数。
2. **r** 表示基数，每位可能的取值个数（十进制为 10）。

分配时需要 r 个"桶"（队列），收集时依次把这些桶串起来。`,
        },
        {
          id: 'kb-ds-8-6-2-2',
          type: 'paragraph',
          text: '**每轮操作**：先分配（把当前位为某个值的元素按次序放进对应桶），再收集（从桶 0 到桶 r-1 依次出队串成新序列）。共进行 $d$ 轮，$d$ 是关键字位数。',
        },
        {
          id: 'kb-ds-8-6-2-3',
          type: 'paragraph',
          text: '**复杂度**：每轮分配收集 $O(n+r)$，共 $d$ 轮，所以时间复杂度 $O(d(n+r))$。空间 $O(r)$（$r$ 个桶），**稳定**（同一桶内保持原相对次序，收集时依次出队）。',
        },
        {
          id: 'kb-ds-8-6-2-4',
          type: 'callout',
          title: '稳定是正确性前提',
          text: '基数排序每一步都保持稳定：位权相同的元素必须顺序入队、顺序出队。如果破坏了稳定性，高位处理会把低位的次序打乱。',
          tone: 'orange',
        },
        {
          id: 'kb-ds-8-6-3-1',
          type: 'paragraph',
          text: String.raw`基数排序**适用于位数不多、基数较小**的关键字（如十进制整数、定长字符串）。$d$ 很小、$r$ 不大时，$O(d(n+r))$ 接近线性，比 $O(n\log n)$ 更优，是**非比较型排序**的代表。`,
        },
        {
          id: 'kb-ds-8-6-3-2',
          type: 'paragraph',
          text: '当关键字**位数很多**时，$d$ 增大使 $d(n+r)$ 与 $n^2$ 可比，基数排序优势丧失，反而更慢。它不比较、不交换元素，稳定性由各轮的队列次序天然保证。',
        },
        {
          id: 'kb-ds-8-6-2-5',
          type: 'animation',
          animation: radixSortAnimation,
          sourceImport: { path: '@/animations/data-structures/sorting/sorting-animations', localName: 'radixSortAnimation', kind: 'named' },
        },
      ],
    },
  ],
}
