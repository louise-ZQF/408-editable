import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const ds7_3BinarySearchArticle: KnowledgeArticleData = {
  pointId: 'ds-7-3-binary-search',
  subpoints: [
    {
      id: 'ds-7-3-s1',
      title: '折半查找的过程与前提',
      blocks: [
        {
          id: 'kb-ds-7-3-1',
          type: 'paragraph',
          text: '**折半查找**（二分查找）每次把查找区间对半缩小：先取中间元素跟给定值比较，相等则查找成功；给定值较大则到右半区间、较小则到左半区间继续。重复直到区间为空（查找失败）。',
        },
        {
          id: 'kb-ds-7-3-2',
          type: 'paragraph',
          text: String.raw`折半查找有两个必不可少的前提：

1. 查找表**按关键字有序**。
2. 查找表**采用顺序存储**，能在 $O(1)$ 内访问任意中间元素。`,
        },
        {
          id: 'kb-ds-7-3-15',
          type: 'paragraph',
          text: '**代码思路**：\n\n```\n// 在有序顺序表 a[low..high] 中查找 key\nlow = 1; high = n;\nwhile (low <= high) {\n  mid = (low + high) / 2;\n  if (a[mid] == key) return mid;          // 查找成功\n  else if (a[mid] < key) low = mid + 1;   // 到右半区间\n  else high = mid - 1;                    // 到左半区间\n}\nreturn 0;                                 // 查找失败\n```',
        },
        {
          id: 'kb-ds-7-3-3',
          type: 'paragraph',
          text: String.raw`复杂度为 **$O(\log_2 n)$**。每比较一次把区间缩小一半，比较次数不超过树高，时间复杂度对数级，远优于顺序查找的线性级。`,
        },
        {
          id: 'kb-ds-7-3-14',
          type: 'paragraph',
          text: '**不适合直接用折半查找的结构**：\n\n1. 有序链表：无法随机访问中间元素，不能用。\n2. 无序数组：不满足有序前提，不能用。\n3. 有序静态链表：用连续数组存放但逻辑靠 next 链接，无法直接定位中间下标对应的逻辑中间元素，不能用。\n\n静态存储 ≠ 随机存取。',
        },
      ],
    },
    {
      id: 'ds-7-3-s2',
      title: '折半判定树',
      blocks: [
        {
          id: 'kb-ds-7-3-5',
          type: 'paragraph',
          text: '**折半查找判定树**是把一次折半查找中所有可能的比较路径画成一棵二叉树：树中每个结点对应顺序表中的一个元素。用**中间位置元素作根**，左半区间元素构成左子树、右半区间元素构成右子树，递归构造得到一棵二叉树。',
        },
        {
          id: 'kb-ds-7-3-6',
          type: 'paragraph',
          text: '判定树里，比较次数按**层数**计（根是第 1 层），不是按路径长度计。查找成功时，比较次数等于目标结点所在的层数；查找失败时，等于失败结点（空指针处补的外部结点）所在层数减 1。',
        },
        {
          id: 'kb-ds-7-3-7',
          type: 'html',
          html: `<svg viewBox="0 0 460 300" xmlns="http://www.w3.org/2000/svg" style="display:block;width:min(100%,460px);height:auto;margin-inline:auto">
  <style>
    text { font-family: system-ui, sans-serif; }
    .node { font-size: 16px; font-weight: 700; fill: #ffffff; text-anchor: middle; }
    .line { stroke: #94a3b8; stroke-width: 2; fill: none; }
  </style>

  <g>
    <line x1="135" y1="52" x2="78" y2="118" class="line"/>
    <line x1="135" y1="52" x2="192" y2="118" class="line"/>
    <line x1="70" y1="146" x2="38" y2="210" class="line"/>
    <line x1="79" y1="148" x2="81" y2="208" class="line"/>
    <line x1="184" y1="146" x2="152" y2="210" class="line"/>
    <line x1="193" y1="148" x2="195" y2="208" class="line"/>
  </g>

  <g>
    <circle cx="135" cy="34" r="18" fill="#2563eb"/>
    <text x="135" y="40" class="node">7</text>
    <circle cx="78" cy="130" r="18" fill="#2563eb"/>
    <text x="78" y="136" class="node">3</text>
    <circle cx="192" cy="130" r="18" fill="#2563eb"/>
    <text x="192" y="136" class="node">11</text>
    <circle cx="30" cy="226" r="18" fill="#059669"/>
    <text x="30" y="232" class="node">1</text>
    <circle cx="82" cy="226" r="18" fill="#059669"/>
    <text x="82" y="232" class="node">5</text>
    <circle cx="144" cy="226" r="18" fill="#059669"/>
    <text x="144" y="232" class="node">9</text>
    <circle cx="196" cy="226" r="18" fill="#059669"/>
    <text x="196" y="232" class="node">13</text>
  </g>
</svg>`,
        },
        {
          id: 'kb-ds-7-3-8',
          type: 'paragraph',
          text: '上图为对关键字 1、3、5、7、9、11、13（7 个元素）构造的折半查找判定树。根为中间元素 7，左子树含 1、3、5，右子树含 9、11、13，左右子树高度均不超过 1，是二叉排序树也是平衡二叉树。\n\n查找成功时最多比较 3 次（最底层 1、5、9、13 各需 3 次），查找失败时也最多比较 3 次（比较到最底层元素的空孩子后落空）。',
        },
        {
          id: 'kb-ds-7-3-16',
          type: 'html',
          html: `<svg viewBox="0 0 560 320" xmlns="http://www.w3.org/2000/svg" style="display:block;width:min(100%,560px);height:auto;margin-inline:auto">
  <style>
    text { font-family: system-ui, sans-serif; }
    .node { font-size: 16px; font-weight: 700; fill: #ffffff; text-anchor: middle; }
    .line { stroke: #94a3b8; stroke-width: 2; fill: none; }
    .cap  { font-size: 13px; fill: #64748b; text-anchor: middle; }
  </style>

  <g class="line">
    <line x1="280" y1="60" x2="140" y2="108"/>
    <line x1="280" y1="60" x2="420" y2="108"/>
    <line x1="140" y1="140" x2="70" y2="188"/>
    <line x1="140" y1="140" x2="210" y2="188"/>
    <line x1="420" y1="140" x2="350" y2="188"/>
    <line x1="420" y1="140" x2="490" y2="188"/>
    <line x1="210" y1="220" x2="245" y2="268"/>
    <line x1="350" y1="220" x2="385" y2="268"/>
    <line x1="490" y1="220" x2="525" y2="268"/>
  </g>

  <g>
    <circle cx="280" cy="44" r="16" fill="#2563eb"/>
    <text x="280" y="50" class="node">4</text>
    <circle cx="140" cy="124" r="16" fill="#2563eb"/>
    <text x="140" y="130" class="node">1</text>
    <circle cx="420" cy="124" r="16" fill="#2563eb"/>
    <text x="420" y="130" class="node">7</text>
    <circle cx="70" cy="204" r="16" fill="#059669"/>
    <text x="70" y="210" class="node">0</text>
    <circle cx="210" cy="204" r="16" fill="#059669"/>
    <text x="210" y="210" class="node">2</text>
    <circle cx="350" cy="204" r="16" fill="#059669"/>
    <text x="350" y="210" class="node">5</text>
    <circle cx="490" cy="204" r="16" fill="#059669"/>
    <text x="490" y="210" class="node">8</text>
    <circle cx="245" cy="284" r="16" fill="#d97706"/>
    <text x="245" y="290" class="node">3</text>
    <circle cx="385" cy="284" r="16" fill="#d97706"/>
    <text x="385" y="290" class="node">6</text>
    <circle cx="525" cy="284" r="16" fill="#d97706"/>
    <text x="525" y="290" class="node">9</text>
  </g>

  <text x="280" y="312" class="cap">0~9 十个元素：根 4 左边 4 个、右边 5 个，每层都偏右</text>
</svg>`,
        },
        {
          id: 'kb-ds-7-3-17',
          type: 'paragraph',
          text: `判定树普遍**偏右**。原因在于 mid = (low + high) / 2 采用**向下取整**：

1. 区间长度为偶数时，取到的 mid 是偏左那个中间位置，左子区间比右子区间少一个元素。
2. 区间长度为奇数时，左右子区间元素一样多，这一层才平衡。

上面 10 个元素 0 到 9，根取 mid = 4，左边 0、1、2、3 共 4 个，右边 5、6、7、8、9 共 5 个，根这一层就右偏。再看左子树 0 到 3（4 个元素），mid 又取 1，左边只剩 0 一个、右边 2、3 两个，继续右偏；右子树 5 到 9（5 个元素）取 mid = 7 才左右平衡。所以整体向右倾。`,
        },
      ],
    },
  ],
}
