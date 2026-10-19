import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const ds5_6HuffmanArticle: KnowledgeArticleData = {
  pointId: 'ds-5-6-huffman',
  subpoints: [
    {
      id: 'ds-5-6-s1',
      title: 'WPL 的定义',
      blocks: [
        {
          id: 'kb-ds-5-6-1-1',
          type: 'paragraph',
          text: String.raw`**树的带权路径长度 WPL**（Weighted Path Length）是树中所有**叶子结点**的**权值**与其**到根路径长度**（边数）乘积之和。其中 $w_i$ 是第 $i$ 个叶子的权值，$l_i$ 是它到根的路径长度。`,
        },
        {
          id: 'kb-ds-5-6-1-2',
          type: 'paragraph',
          text: '$l_i$ 是**从根到该叶子的边数**（层次数减 1）。根在层次 1，叶子在层次 $k$，则其路径长度为 $k-1$。同一组权值放成不同形状的树，WPL 完全不同。',
        },
        {
          id: 'kb-ds-5-6-1-3',
          type: 'formula',
          formula: String.raw`\text{WPL} = \sum_{i=1}^{n} w_i \cdot l_i`,
        },
        {
          id: 'kb-ds-5-6-1-4',
          type: 'callout',
          title: '只算叶子',
          text: 'WPL 只统计叶子结点。在哈夫曼编码中，叶子才是"待编码字符"，内部结点是合并过程的产物，不参与 WPL 计算。',
          tone: 'orange',
        },
      ],
    },
    {
      id: 'ds-5-6-s2',
      title: '哈夫曼树的构造算法',
      blocks: [
        {
          id: 'kb-ds-5-6-2-1',
          type: 'paragraph',
          text: String.raw`**哈夫曼树**（最优二叉树）是使 WPL **最小**的二叉树。构造算法（每次取最小的两棵合并）如下：
1. 把 $n$ 个权值看成 $n$ 棵单结点二叉树（每棵只有根，权值即该权值）。
2. 任取当前森林中**权值最小的两棵**作为**左右子树**合并成一棵新树，根权值为二者之和。
3. 从森林中删除这棵被合并的两棵，把新树放入森林。
4. 重复 2、3 直到森林只剩一棵树，即为哈夫曼树。`,
        },
        {
          id: 'kb-ds-5-6-2-2',
          type: 'paragraph',
          text: '合并过程中**每次选最小的两个权值**是贪心策略：让权值越大的叶子越靠近根（路径长度越短），从而让 WPL 最小。',
        },
        {
          id: 'kb-ds-5-6-2-3',
          type: 'html',
          html: `<svg viewBox="0 0 520 270" xmlns="http://www.w3.org/2000/svg" style="display:block;width:min(100%,560px);height:auto;margin-inline:auto">
  <style>
    text { font-family: system-ui, sans-serif; }
    .t { font-size: 18px; font-weight: 700; fill: #0f172a; }
    .w { font-size: 15px; font-weight: 700; fill: #ffffff; text-anchor: middle; }
    .st { font-size: 14px; fill: #334155; text-anchor: middle; }
    .edge { stroke: #64748b; stroke-width: 1.6; }
  </style>

  <text x="260" y="22" class="t">权值 5, 7, 2, 11 构造哈夫曼树</text>
  <text x="260" y="46" class="st">先取 2、5 合并=7；再取 7、原7 合并=14；最后取 11、14 合并=25</text>

  <g class="edge" fill="none">
    <line x1="260" y1="96" x2="180" y2="150"/>
    <line x1="260" y1="96" x2="360" y2="150"/>
    <line x1="180" y1="152" x2="140" y2="196"/>
    <line x1="180" y1="152" x2="230" y2="196"/>
    <line x1="360" y1="152" x2="318" y2="196"/>
    <line x1="360" y1="152" x2="412" y2="196"/>
    <line x1="140" y1="198" x2="118" y2="240"/>
    <line x1="140" y1="198" x2="168" y2="240"/>
  </g>

  <g stroke="#111827" fill="#7c3aed">
    <circle cx="260" cy="80" r="20"/>
    <circle cx="180" cy="148" r="18" fill="#0891b2"/>
    <circle cx="360" cy="148" r="18" fill="#ea580c"/>
  </g>
  <g stroke="#111827" fill="#0891b2">
    <circle cx="140" cy="194" r="17"/>
    <circle cx="230" cy="194" r="17"/>
  </g>
  <g stroke="#111827" fill="#b45309">
    <circle cx="318" cy="194" r="16"/>
    <circle cx="412" cy="194" r="16"/>
    <circle cx="118" cy="238" r="14" fill="#7c3aed"/>
    <circle cx="168" cy="238" r="14" fill="#7c3aed"/>
  </g>

  <text x="260" y="85" class="w">25</text>
  <text x="180" y="153" class="w">14</text>
  <text x="360" y="153" class="w">11</text>
  <text x="140" y="199" class="w">7</text>
  <text x="230" y="199" class="w">7</text>
  <text x="318" y="199" class="w">5</text>
  <text x="412" y="199" class="w">11</text>
  <text x="118" y="243" class="w">2</text>
  <text x="168" y="243" class="w">5</text>

  <text x="260" y="262" class="st" fill="#7c3aed">内部结点：7、14、25；叶子：5、7、2、11</text>
</svg>`,
        },
        {
          id: 'kb-ds-5-6-2-4',
          type: 'paragraph',
          text: String.raw`上例中第 4 步合并 11 与 14（都较大），最终叶子权值 2、5 深度 3，7 深度 2，11 深度 2。$\text{WPL} = 2\times3 + 5\times3 + 7\times2 + 11\times2 = 6+15+14+22 = 57$。若两个权值同为 7 的结点左右位置互换，结构略异但 WPL 相同。`,
        },
        {
          id: 'kb-ds-5-6-2-6',
          type: 'paragraph',
          text: String.raw`**k 叉哈夫曼树与虚段**：构造 k 叉哈夫曼树（如最佳归并树）时，每次合并要取 **k 棵**，因此叶子的数量必须使"每次减少 k-1 棵"恰好减到 1，即叶子数 $n$ 需满足 $(n-1) \bmod (k-1) = 0$；不满足时就需补**虚段**（权值为 0 的叶子）凑数。补足后再按最小权值（含虚段 0）逐次取 k 棵合并，得到的归并树带权路径长度最小。`,
        },
        {
          id: 'kb-ds-5-6-2-5',
          type: 'callout',
          title: '合并顺序只影响形态',
          text: '同一组叶子权值，只要每次都取最小的两棵合并，得到的哈夫曼树的 WPL 唯一且最小；但树的形态可以不同。',
          tone: 'orange',
        },
      ],
    },
    {
      id: 'ds-5-6-3',
      title: '哈夫曼树的性质',
      blocks: [
        {
          id: 'kb-ds-5-6-3-1',
          type: 'paragraph',
          text: '**性质 1**：哈夫曼树中**所有非叶子结点都有两个**孩子，即**没有度为 1 的结点**。',
        },
        {
          id: 'kb-ds-5-6-3-2',
          type: 'paragraph',
          text: '**性质 2**：含 $n$ 个叶子结点的哈夫曼树，其**结点总数为 $2n-1$**（含 $n-1$ 个内部结点）。由二叉树性质 $n_0 = n_2 + 1$ 且哈夫曼树无度为 1 的结点，$n_0=n$，$n_2 = n-1$，总数 $= n + (n-1) = 2n-1$。',
        },
        {
          id: 'kb-ds-5-6-3-3',
          type: 'paragraph',
          text: '**性质 3**：权值越大越靠近根；**权值相等的两个叶子**合并时位置可互换。$n$ 个叶子需合并 $n-1$ 次，每次增加 1 个内部结点。',
        },
      ],
    },
    {
      id: 'ds-5-6-4',
      title: '哈夫曼编码',
      blocks: [
        {
          id: 'kb-ds-5-6-4-1',
          type: 'paragraph',
          text: '用哈夫曼树构造**哈夫曼编码**：约定左孩子路径记 0、右孩子路径记 1（或相反，不限）。每个**叶子**的编码就是根到该叶子路径上的 0/1 序列。权值即字符出现频率，频率高的字符编码短、频率低的编码长，从而**平均编码长度最短**。',
        },
        {
          id: 'kb-ds-5-6-4-6',
          type: 'html',
          html: `<svg viewBox="0 0 900 400" xmlns="http://www.w3.org/2000/svg" style="display:block;width:min(100%,900px);height:auto;margin-inline:auto">
  <style>
    text { font-family: system-ui, sans-serif; }
    .t { font-size: 17px; font-weight: 700; fill: #0f172a; text-anchor: middle; }
    .w { font-size: 14px; font-weight: 700; fill: #ffffff; text-anchor: middle; }
    .ch { font-size: 15px; font-weight: 700; fill: #ffffff; text-anchor: middle; }
    .code { font-size: 14px; font-weight: 700; fill: #0f172a; text-anchor: middle; }
    .lbl { font-size: 13px; font-weight: 700; fill: #2563eb; }
    .rbl { font-size: 13px; font-weight: 700; fill: #ea580c; }
    .edge { stroke: #64748b; stroke-width: 1.6; }
  </style>

  <text x="300" y="22" class="t">权值 A:5 B:7 C:2 D:11 的哈夫曼树编码（左 0 右 1）</text>

  <g class="edge" fill="none">
    <line x1="300" y1="96" x2="215" y2="160"/>
    <line x1="300" y1="96" x2="430" y2="160"/>
    <line x1="215" y1="162" x2="150" y2="228"/>
    <line x1="215" y1="162" x2="280" y2="228"/>
    <line x1="150" y1="230" x2="118" y2="286"/>
    <line x1="150" y1="230" x2="182" y2="286"/>
  </g>

  <g stroke="#111827" fill="#7c3aed">
    <circle cx="300" cy="80" r="20"/>
    <circle cx="215" cy="158" r="18" fill="#0891b2"/>
  </g>
  <g stroke="#111827" fill="#0891b2">
    <circle cx="150" cy="226" r="17"/>
    <circle cx="280" cy="226" r="17"/>
  </g>
  <g stroke="#111827" fill="#b45309">
    <circle cx="430" cy="158" r="18"/>
    <circle cx="118" cy="284" r="14" fill="#7c3aed"/>
    <circle cx="182" cy="284" r="14" fill="#7c3aed"/>
  </g>

  <text x="300" y="85" class="w">25</text>
  <text x="215" y="163" class="w">14</text>
  <text x="150" y="231" class="w">7</text>


  <!-- 叶子：字符 -->
  <text x="118" y="289" class="ch">C:2</text>
  <text x="182" y="289" class="ch">A:5</text>
  <text x="280" y="231" class="ch" fill="#0f172a">B:7</text>
  <text x="430" y="163" class="ch" fill="#0f172a">D:11</text>

  <!-- 边上标注 0/1 -->
  <text x="255" y="130" class="lbl">0</text>
  <text x="375" y="130" class="rbl">1</text>
  <text x="178" y="200" class="lbl">0</text>
  <text x="255" y="200" class="rbl">1</text>
  <text x="130" y="262" class="lbl">0</text>
  <text x="172" y="262" class="rbl">1</text>

  <!-- 编码结果 -->
  <text x="300" y="330" class="t">哈夫曼编码：C:2 → 000　A:5 → 001　B:7 → 01　D:11 → 1</text>

  <!-- 平均编码长度（分两行） -->
  <text x="320" y="358" class="t">平均编码长度 = WPL / 总权值 = (2×3 + 5×3 + 7×2 + 11×1) / (2 + 5 + 7 + 11)</text>
  <text x="320" y="380" class="t">平均编码长度 = 46 / 25 = 1.84</text>
</svg>`,
        },
        {
          id: 'kb-ds-5-6-4-2',
          type: 'paragraph',
          text: '**前缀编码**：任一字符的编码**都不是另一个字符编码的前缀**。哈夫曼编码天然是前缀编码（叶子无后代叶子），因此**编码可以唯一解码**，不需分隔符。',
        },
        
        {
          id: 'kb-ds-5-6-4-4',
          type: 'paragraph',
          text: String.raw`判定一组"不定长编码"是否可作为哈夫曼编码，看它是否满足**前缀条件**：任意一个编码都不能是另一个编码前缀。
          **平均编码长度** $= \frac{\sum w_i \times l_i}{\sum w_i}$（即 WPL 除以总权值）。`,
        },
        {
          id: 'kb-ds-5-6-4-5',
          type: 'callout',
          title: '0/1 左右可互换',
          text: '哈夫曼编码中 0、1 分别代表左、右，交换取 0/1 的约定会得到编码的镜像，但**平均长度不变、仍是前缀编码**。题目给的编码只要符合前缀条件和合并权值，就合法。',
          tone: 'orange',
        },
      ],
    },
  ],
}
