import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'
import { avlAdjustmentAnimation } from '@/animations/data-structures/tree/avl'

export const ds5_8AvlArticle: KnowledgeArticleData = {
  pointId: 'ds-5-8-avl',
  subpoints: [
    {
      id: 'ds-5-8-s1',
      title: '平衡二叉树 AVL 的定义',
      blocks: [
        {
          id: 'kb-ds-5-8-1-1',
          type: 'paragraph',
          text: String.raw`**平衡二叉树**（AVL）首先是 **二叉排序树（BST）**，在此基础上额外要求：**任一结点的左右子树高度差不超过 1**。定义"平衡因子" $BF = \text{左子树高度} - \text{右子树高度}$，AVL 中每个结点恒有 $BF \in \{-1, 0, 1\}$。`,
        },
      ],
    },
    {
      id: 'ds-5-8-2',
      title: '平衡二叉树的调整',
      blocks: [

        {
          id: 'kb-ds-5-8-2-1',
          type: 'paragraph',
          text: String.raw`
- **LL 型**（插在失衡结点 A 的**左孩子的左子树**）：对 **A 右旋**（以 A 为轴右转）。
- **RR 型**（插在 A 的**右孩子的右子树**）：对 **A 左旋**。
- **LR 型**（插在 A 的**左孩子的右子树**）：先对**左孩子左旋**、再对 **A 右旋**。
- **RL 型**（插在 A 的**右孩子的左子树**）：先对**右孩子右旋**、再对 **A 左旋**。`,
        },

        { id: 'kb-ds-5-8-2-5', type: 'animation', animation: avlAdjustmentAnimation, sourceImport: { path: '@/animations/data-structures/tree/avl', localName: 'avlAdjustmentAnimation', kind: 'named' } },

        

        {
          id: 'kb-ds-5-8-3-1',
          type: 'paragraph',
          text: '**插入过程**：\n\n1. 先按 BST 规则把新结点作为叶子插入。\n2. 从插入位置向上回溯，找**最近的失衡结点**。\n3. 对该失衡结点做一次旋转（或双旋）调整，树即恢复平衡。\n\n因为插入只影响祖先结点的平衡因子，且旋转降低了以失衡结点为根的子树高度，所以只需调整一次。',
        },

        

        {
          id: 'kb-ds-5-8-4-1',
          type: 'paragraph',
          text: '**删除过程**：\n\n1. 按 BST 删除规则删结点（叶子直接删、单孩子顶替、双孩子用中序前驱/后继替代）。\n2. 从删除点向上回溯，检查每个祖先结点的平衡因子。\n3. 对失衡结点做调整。',
        },

      ],
    },
    {
      id: 'ds-5-8-5',
      title: '平衡二叉树最少节点的计算',
      blocks: [
        {
          id: 'kb-ds-5-8-5-1',
          type: 'paragraph',
          text: String.raw`记 $N_h$ 为**高度为 $h$ 的 AVL 树中最少的结点数**（$N_0=0,\ N_1=1$）。根结点的两棵子树中，较矮那棵至少有 $N_{h-2}$ 个结点，较高那棵至少有 $N_{h-1}$ 个结点（让两子树高度差取最大 1），再加根结点，得到递推关系（见下式）。由 $N_h$ 可判断"给定高度至少需要多少结点"，或反过来求"给定结点数能造出的 AVL 最大高度"。`,
        },
        {
          id: 'kb-ds-5-8-5-3',
          type: 'formula',
          formula: String.raw`N_h = N_{h-1} + N_{h-2} + 1,\quad N_0=0,\ N_1=1`,
        },
      ],
    },
  ],
}
