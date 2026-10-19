import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'
import { redBlackInsertionAnimation } from '@/animations/data-structures/tree/red-black-tree'

export const ds7_8TreeSearchArticle: KnowledgeArticleData = {
  pointId: 'ds-7-8-tree-search',
  subpoints: [
    {
      id: 'ds-7-8-s3',
      title: '红黑树的引入',
      blocks: [
        {
          id: 'kb-ds-7-8-8',
          type: 'paragraph',
          text: '**AVL 过度追求平衡**：任何轻微失衡（平衡因子为 ±2）都要旋转，插入删除需反复调整，代价高。**红黑树**放宽平衡条件，只保证**最长路径不超过最短路径的 2 倍**，从而大幅减少插入删除的调整次数。',
        },
        {
          id: 'kb-ds-7-8-9',
          type: 'paragraph',
          text: String.raw`红黑树仍是自平衡的二叉查找树，查找复杂度保持 $O(\log_2 n)$，但在**插入删除频繁**的场景下，因旋转和维护更少，整体表现优于 AVL。`,
        },
        {
          id: 'kb-ds-7-8-10',
          type: 'paragraph',
          text: String.raw`| 对比项 | BST | AVL 树 | 红黑树 |
|---|---|---|---|
| 平衡约束 | 无 | 左右子树高差 ≤1 | 最长路径 ≤ 短路径×2 |
| 最坏查找 | $O(\log n)$ | $O(\log n)$ | $O(\log n)$ |
| 最劣形态 | 可退化为链 $O(n)$ | 保持平衡 | 保持平衡 |
| 插入/删除调整 | 无 | 频繁旋转 | 调整次数少 |
| 应用侧重 | 一般查找 | 查多改少 | 读写均衡（数据库、Java TreeMap） |`,
        },
      ],
    },
    {
      id: 'ds-7-8-s4',
      title: '红黑树的四条性质',
      blocks: [
        {
          id: 'kb-ds-7-8-13',
          type: 'paragraph',
          text: String.raw`红黑树中每个结点非红即黑。四条性质如下：

1. **左根右**：中序遍历有序，是二叉排序树，左子树关键字都小于根、右子树都大于根。
2. **不红红**：红结点的孩子不能是红结点，即红—红不能父子相邻。
3. **根叶黑**：根结点和叶子结点（外部空结点）都是黑色。
4. **黑路同**：从任一结点到其每个叶子结点的路径上，黑色结点个数相同（称该结点的黑高）。

由性质 2、3、4 推出：路径上红结点不相邻、黑结点数处处相等，故最长路径（红黑交替）不超过最短路径（全黑）的 2 倍，这就是红黑树保持 $O(\log n)$ 高度的依据。`,
        },
      ],
    },
    {
      id: 'ds-7-8-s5',
      title: '红黑树的插入调整',
      blocks: [
        {
          id: 'kb-ds-7-8-17',
          type: 'paragraph',
          text: `红黑树先按二叉排序树规则插入新结点，并把新结点染成红色：

- 父结点为黑色：插入结束。
- 父结点为红色：出现红—红冲突，按下面三类情况处理。

1. **叔叔为红色**：父结点和叔叔结点变黑，祖父结点变红，再从祖父结点继续向上检查。
2. **叔叔为黑色，插入方向为 LL 或 RR**：父结点变黑，祖父结点变红，再对祖父结点做一次旋转。LL 右旋，RR 左旋，两者互为镜像。
3. **叔叔为黑色，插入方向为 LR 或 RL**：先旋转父结点，把内侧折线转成 LL 或 RR，再按第 2 类情况变色并旋转祖父结点。LR 与 RL 互为镜像。

调整结束后，根结点必须保持黑色。下面先用同一次插入连续演示两层调整：下层遇到红叔叔，父结点和叔叔结点染黑，祖父结点染红，冲突随之移到上层；上层叔叔结点 70 为黑色，继续按 LL 调整。最后单独演示 LR。`,
        },
        {
          id: 'kb-ds-7-8-18',
          type: 'animation',
          animation: redBlackInsertionAnimation,
          sourceImport: { path: '@/animations/data-structures/tree/red-black-tree', localName: 'redBlackInsertionAnimation', kind: 'named' },
        },
      ],
    },
  ],
}
