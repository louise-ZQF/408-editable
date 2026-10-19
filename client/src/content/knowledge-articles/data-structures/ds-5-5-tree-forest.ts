import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const ds5_5TreeForestArticle: KnowledgeArticleData = {
  pointId: 'ds-5-5-tree-forest',
  subpoints: [
    {
      id: 'ds-5-5-s1',
      title: '树的存储结构',
      blocks: [
        {
          id: 'kb-ds-5-5-1-1',
          type: 'paragraph',
          text: '**双亲表示法**：用数组存所有结点，每个结点含**数据域**和**双亲的下标**（根的双亲为 -1）。可快速找双亲 $O(1)$，但找孩子结点要**遍历整个数组**，找某结点的所有孩子 $O(n)$。',
        },
        {
          id: 'kb-ds-5-5-1-2',
          type: 'paragraph',
          text: '**孩子表示法**：每个结点含**数据域**和**孩子链表的头指针**，孩子以链表挂在该结点下。找孩子快、找双亲需遍历所有链条，较慢。',
        },
        {
          id: 'kb-ds-5-5-1-3',
          type: 'paragraph',
          text: '**孩子兄弟表示法**（二叉链表表示法）：每个结点含数据域、**长子（first-child）指针**和**下一兄弟（next-sibling）指针**。它把任意一棵树**等价地改造成一棵二叉树**，是树与二叉树互相转换的桥梁。',
        },
        {
          id: 'kb-ds-5-5-1-4',
          type: 'paragraph',
          text: String.raw`| 存储结构 | 数据域之外 | 找双亲 | 找孩子 | 能否转二叉树 |
|----------|------------|--------|--------|--------------|
| 双亲表示法 | 双亲下标 | 快 $O(1)$ | 慢 $O(n)$ | 否 |
| 孩子表示法 | 孩子链头指针 | 慢 | 快 | 否 |
| 孩子兄弟表示法 | 长子 + 兄弟指针 | 需另设 parent | 快 | 是，本质就是二叉链表 |`,
        },
        {
          id: 'kb-ds-5-5-1-5',
          type: 'callout',
          title: '孩子表示法等价于图的邻接表法',
          text: '把树看作图，就能用图的**邻接表法**表示：每个结点有一个 firstArc 指针，指向一条由 Arc 构成的链表，每个 Arc 代表一条边。',
          tone: 'blue',
        },
      ],
    },
    {
      id: 'ds-5-5-2',
      title: '树转二叉树',
      blocks: [
        {
          id: 'kb-ds-5-5-2-1',
          type: 'paragraph',
          text: '**树转二叉树的规则（左孩子右兄弟）**：把树的**第一个孩子**变成二叉树的**左孩子**，把该孩子的**下一个兄弟**变成二叉树对应结点的**右孩子**；对每个结点递归应用此规则。',
        },
        {
          id: 'kb-ds-5-5-2-3',
          type: 'html',
          html: `<svg viewBox="0 0 720 380" xmlns="http://www.w3.org/2000/svg" style="display:block;width:min(100%,720px);height:auto;margin-inline:auto">
  <style>
    text { font-family: system-ui, sans-serif; }
    .t { font-size: 18px; font-weight: 700; fill: #0f172a; }
    .nd { font-size: 16px; font-weight: 700; fill: #0f172a; text-anchor: middle; }
    .lg { font-size: 14px; fill: #334155; }
    .edge { stroke: #64748b; stroke-width: 1.6; }
    .bro { stroke: #d97706; stroke-width: 2; }
  </style>

  <!-- 左边：原树 -->
  <text x="150" y="24" class="t">原树</text>

  <g class="edge" fill="none">
    <line x1="150" y1="80" x2="90" y2="140"/>
    <line x1="150" y1="80" x2="210" y2="140"/>
    <line x1="90" y1="142" x2="50" y2="210"/>
    <line x1="90" y1="142" x2="130" y2="210"/>
    <line x1="130" y1="212" x2="110" y2="280"/>
    <line x1="130" y1="212" x2="170" y2="280"/>
  </g>
  <g class="bro" fill="none">
    <line x1="94" y1="136" x2="206" y2="142"/>
    <line x1="54" y1="206" x2="126" y2="212"/>
  </g>

  <g stroke="#1e40af" fill="#dbeafe">
    <circle cx="150" cy="66" r="18" stroke-width="2"/>
    <circle cx="90" cy="138" r="16" stroke-width="2"/>
    <circle cx="210" cy="138" r="16" stroke-width="2"/>
    <circle cx="50" cy="208" r="15" stroke-width="2"/>
    <circle cx="130" cy="208" r="15" stroke-width="2"/>
    <circle cx="110" cy="278" r="14" stroke-width="2"/>
    <circle cx="170" cy="278" r="14" stroke-width="2"/>
  </g>
  <text x="150" y="71" class="nd">A</text>
  <text x="90" y="143" class="nd">B</text>
  <text x="210" y="143" class="nd">C</text>
  <text x="50" y="213" class="nd">D</text>
  <text x="130" y="213" class="nd">E</text>
  <text x="110" y="283" class="nd">F</text>
  <text x="170" y="283" class="nd">G</text>

  <!-- 右边：转换后的二叉树 -->
  <text x="520" y="24" class="t">对应二叉树</text>
  <!-- 结构：A 左 B；B 左 D、右 C；D 右 E；E 左 F；F 右 G -->
  <g class="edge" fill="none">
    <line x1="520" y1="80" x2="430" y2="150"/>   <!-- A 左 B -->
    <line x1="430" y1="152" x2="350" y2="230"/>  <!-- B 左 D -->
    <line x1="440" y1="232" x2="420" y2="300"/>  <!-- E 左 F -->
  </g>
  <g class="bro" fill="none">
    <line x1="434" y1="148" x2="540" y2="150"/>  <!-- B 右 C（兄弟） -->
    <line x1="354" y1="226" x2="440" y2="230"/>  <!-- D 右 E（兄弟） -->
    <line x1="424" y1="296" x2="500" y2="300"/>  <!-- F 右 G（兄弟） -->
  </g>

  <g stroke="#1e40af" fill="#dbeafe">
    <circle cx="520" cy="66" r="18" stroke-width="2"/>
    <circle cx="430" cy="148" r="16" stroke-width="2" fill="#fef3c7"/>
    <circle cx="350" cy="228" r="15" stroke-width="2"/>
    <circle cx="540" cy="148" r="16" stroke-width="2" fill="#fef3c7"/>
    <circle cx="440" cy="228" r="15" stroke-width="2" fill="#fef3c7"/>
    <circle cx="420" cy="298" r="14" stroke-width="2"/>
    <circle cx="500" cy="298" r="14" stroke-width="2" fill="#fef3c7"/>
  </g>
  <text x="520" y="71" class="nd">A</text>
  <text x="430" y="153" class="nd">B</text>
  <text x="350" y="233" class="nd">D</text>
  <text x="540" y="153" class="nd">C</text>
  <text x="440" y="233" class="nd">E</text>
  <text x="420" y="303" class="nd">F</text>
  <text x="500" y="303" class="nd">G</text>

  <text x="360" y="350" class="lg" text-anchor="middle">左孩子右兄弟：第一个孩子进左子树，兄弟变右孩子</text>
  <text x="360" y="370" class="lg" text-anchor="middle">实线为"第一个孩子"边，橙线为"兄弟"边（B→C、D→E、F→G）</text>
</svg>`,
        },
      ],
    },
    {
      id: 'ds-5-5-3',
      title: '森林转二叉树',
      blocks: [
        {
          id: 'kb-ds-5-5-3-1',
          type: 'paragraph',
          text: '**森林转二叉树**：先把每棵树各自转成二叉树（左孩子右兄弟），然后把**第二棵树的根作为第一棵二叉树根结点的右子树**，第三棵根作为第二棵的右子树，依次把各树**串成一条右链**。',
        },
        
        {
          id: 'kb-ds-5-5-3-5',
          type: 'callout',
          title: '森林树数 = 右链长 + 1',
          text: '森林 m 棵树转成的二叉树，从根沿右指针能走 m-1 步，即右链上有 m-1 个结点。给你二叉树求原森林树数，数根到最右叶子的右链结点数再加 1。',
          tone: 'blue',
        },
      ],
    },
    {
      id: 'ds-5-5-4',
      title: '树、森林与二叉树的遍历关系',
      blocks: [
        {
          id: 'kb-ds-5-5-4-3',
          type: 'paragraph',
          text: String.raw`
先根遍历：先访问根结点，再依次遍历每一棵子树。
后根遍历：先依次遍历每一棵子树，最后访问根结点。
树与对应二叉树的遍历序列对应关系如下：
| 遍历对象 | 遍历方式 | 对应二叉树的遍历 |
|----------|----------|------------------|
| 树 | 先根 | 先序 |
| 树 | 后根 | 中序 |
| 森林 | 先序（每树先根） | 先序 |
| 森林 | 中序（每树后根） | 中序 |`,
        },
      ],
    },
  ],
}
