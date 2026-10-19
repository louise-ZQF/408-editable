import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const ds5_7BstArticle: KnowledgeArticleData = {
  pointId: 'ds-5-7-bst',
  subpoints: [
    {
      id: 'ds-5-7-s1',
      title: '二叉排序树的定义',
      blocks: [
        {
          id: 'kb-ds-5-7-1-1',
          type: 'paragraph',
          text: String.raw`**二叉排序树**（BST，Binary Search Tree）是满足下列性质的一棵二叉树（或空树）：
- 若左子树非空，则左子树上**所有**结点的值都**小于**根结点的值；
- 若右子树非空，则右子树上**所有**结点的值都**大于**根结点的值；
- 左、右子树各自也是二叉排序树。`,
        },
        {
          id: 'kb-ds-5-7-1-2',
          type: 'paragraph',
          text: '对 BST 作中序遍历，得到的序列是**递增有序**的。这是判断一棵树是否 BST 的常用手段。',
        },

      ],
    },
    {
      id: 'ds-5-7-2',
      title: '二叉排序树的查找过程',
      blocks: [
        {
          id: 'kb-ds-5-7-2-1',
          type: 'paragraph',
          text: '**BST 查找**从根开始：\n\n1. 若根等于关键字，查找成功。\n2. 若关键字**小于**根，转向**左子树**继续。\n3. 若关键字**大于**根，转向**右子树**继续。\n4. 直到子树为空，查找失败。\n\n整个过程是一条**从根到某叶子的路径**，比较次数等于走过的路径长度加 1。',
        },
        {
          id: 'kb-ds-5-7-2-5',
          type: 'html',
          html: `<svg viewBox="0 0 700 340" xmlns="http://www.w3.org/2000/svg" style="display:block;width:min(100%,700px);height:auto;margin-inline:auto">
  <style>
    text { font-family: system-ui, sans-serif; }
    .t { font-size: 17px; font-weight: 700; fill: #0f172a; }
    .nd { font-size: 16px; font-weight: 700; fill: #ffffff; text-anchor: middle; }
    .lg { font-size: 14px; fill: #334155; text-anchor: middle; }
    .hit { fill: #059669; stroke: #047857; stroke-width: 2.5; }
    .miss { fill: #dc2626; stroke: #991b1b; stroke-width: 2; }
    .norm { fill: #2563eb; stroke: #1e40af; stroke-width: 1.8; }
    .edge { stroke: #64748b; stroke-width: 1.6; }
    .pth { stroke: #059669; stroke-width: 2.5; }
  </style>

  <text x="330" y="24" class="t">BST 查找：找 37（成功）与找 40（失败）</text>

  <g class="edge" fill="none">
    <line x1="330" y1="86" x2="230" y2="150"/>
    <line x1="330" y1="86" x2="430" y2="150"/>
    <line x1="230" y1="152" x2="165" y2="216"/>
    <line x1="230" y1="152" x2="295" y2="216"/>
    <line x1="430" y1="152" x2="490" y2="216"/>
    <line x1="295" y1="218" x2="250" y2="282"/>
    <line x1="295" y1="218" x2="340" y2="282"/>
  </g>

  <!-- 高亮路径：45 → 24 → 37（成功），45 → 24 → 37 右空（失败） -->
  <g class="pth" fill="none">
    <line x1="330" y1="86" x2="230" y2="150"/>
    <line x1="230" y1="152" x2="295" y2="216"/>
    <line x1="295" y1="218" x2="340" y2="282"/>
  </g>

  <g stroke="#111827">
    <circle cx="330" cy="70" r="20" class="norm"/>
    <circle cx="230" cy="148" r="18" class="norm"/>
    <circle cx="430" cy="148" r="18" fill="#94a3b8" stroke="#64748b"/>
    <circle cx="165" cy="214" r="16" fill="#94a3b8" stroke="#64748b"/>
    <circle cx="295" cy="214" r="16" class="hit"/>
    <circle cx="490" cy="214" r="16" fill="#94a3b8" stroke="#64748b"/>
    <circle cx="250" cy="280" r="14" fill="#94a3b8" stroke="#64748b"/>
    <circle cx="340" cy="280" r="14" class="miss"/>
  </g>
  <text x="330" y="75" class="nd">45</text>
  <text x="230" y="153" class="nd">24</text>
  <text x="430" y="153" class="nd">53</text>
  <text x="165" y="219" class="nd">12</text>
  <text x="295" y="219" class="nd">37</text>
  <text x="490" y="219" class="nd">90</text>
  <text x="250" y="285" class="nd">30</text>
  <text x="340" y="285" class="nd">✗</text>

  <text x="330" y="318" class="lg">查 37：45 → 24 → 37，比较 3 次，命中（绿色高亮）</text>
  <text x="330" y="336" class="lg">查 40：45 → 24 → 37 → 右空，比较 3 次后落到空指针，失败（红色 ✗）</text>
</svg>`,
        },
        {
          id: 'kb-ds-5-7-2-2',
          type: 'paragraph',
          text: '查找成功时的比较次数 = 该关键字的**结点所处层次数**。查找失败的比较次数 = 沿查找路径到空指针为止经过的层次总数。',
        },
        {
          id: 'kb-ds-5-7-2-3',
          type: 'paragraph',
          text: String.raw`BST 的查找效率取决于树**是否平衡**。充分平衡的 BST 高度接近 $\lceil \log_2(n+1) \rceil$，查找接近折半查找。退化成单链的 BST（如按键值递减依次插入）高度 $n$，查找接近于顺序查找。`,
        },
        {
          id: 'kb-ds-5-7-2-4',
          type: 'callout',
          title: '查找 KEY 时比较的次数=走过的层数',
          text: '查找路径上每个结点都参与一次比较，最后查找成功或失败的那一次也计入，因此比较次数就是走过的层数。',
          tone: 'blue',
        },
      ],
    },
    {
      id: 'ds-5-7-3',
      title: '二叉排序树的插入与构造',
      blocks: [
        {
          id: 'kb-ds-5-7-3-1',
          type: 'paragraph',
          text: '**BST 插入**：新结点总是作为**叶子插入**。\n\n1. 按查找规则找插入位置：从根出发，比关键字小走左、大走右。\n2. 直到遇到空指针的位置即为插入点，在该空位挂上新结点。\n\n插入后 BST 性质保持。',
        },
        {
          id: 'kb-ds-5-7-3-2',
          type: 'paragraph',
          text: '同一组关键字，插入顺序不同，构造出的 BST 形态不同。例如 45-24-53-12-37 和 12-24-37-45-53 插出的树形态不同，但**中序遍历序列恒为有序**这一点不变。',
        },
      ],
    },
    {
      id: 'ds-5-7-4',
      title: '二叉排序树删除的三种情况',
      blocks: [
        {
          id: 'kb-ds-5-7-4-1',
          type: 'paragraph',
          text: String.raw`**删除分三种情况**：

1. **删除叶子结点**：直接删除，不影响其他结点。
2. **删除只有一棵子树的结点**：用它的子树顶替它（单孩子直接上移）。
3. **删除有两棵子树的结点**：用它的**中序前驱**（左子树中最右下结点）或**中序后继**（右子树中最左下结点）顶替它：把前驱/后继的值赋给被删结点，然后删除前驱/后继（它至多只有一棵子树，转化成了情况 1 或 2）。`,
        },
        {
          id: 'kb-ds-5-7-4-2',
          type: 'paragraph',
          text: '删除时保持 BST 性质：情况 3 用前驱/后继值替换，替换后该位置仍满足"左小右大"，而前驱/后继至多一棵子树，删除更简单。',
        },
        {
          id: 'kb-ds-5-7-4-3',
          type: 'html',
          html: `<svg viewBox="0 0 640 320" xmlns="http://www.w3.org/2000/svg" style="display:block;width:min(100%,660px);height:auto;margin-inline:auto">
  <style>
    text { font-family: system-ui, sans-serif; }
    .t { font-size: 18px; font-weight: 700; fill: #0f172a; text-anchor: middle; }
    .nd { font-size: 16px; font-weight: 700; fill: #0f172a; text-anchor: middle; }
    .lg { font-size: 14px; fill: #334155; text-anchor: start; }
    .edge { stroke: #64748b; stroke-width: 1.6; }
    .del { stroke: #dc2626; stroke-width: 3; }
  </style>

  <text x="300" y="26" class="t" text-anchor="start">三种删除情形（红圈为被删结点）</text>

  <g>
    <text x="120" y="60" class="t">①删叶子</text>
    <g class="edge" fill="none">
      <line x1="120" y1="94" x2="90" y2="128"/>
      <line x1="120" y1="94" x2="150" y2="128"/>
    </g>
    <g stroke="#1e40af" fill="#dbeafe">
      <circle cx="120" cy="80" r="16"/>
      <circle cx="90" cy="126" r="14" stroke="#dc2626"/>
      <circle cx="150" cy="126" r="14" fill="#e0e7ff"/>
    </g>
    <text x="120" y="85" class="nd">8</text>
    <text x="90" y="131" class="nd">3</text>
    <text x="150" y="131" class="nd">10</text>
  </g>

  <g>
    <text x="320" y="60" class="t">②删单孩子</text>
    <g class="edge" fill="none">
      <line x1="320" y1="94" x2="290" y2="128"/>
      <line x1="320" y1="94" x2="350" y2="128"/>
      <line x1="290" y1="130" x2="272" y2="168"/>
    </g>
    <g stroke="#1e40af" fill="#dbeafe">
      <circle cx="320" cy="80" r="16"/>
      <circle cx="290" cy="126" r="14" stroke="#dc2626"/>
      <circle cx="350" cy="126" r="14" fill="#e0e7ff"/>
      <circle cx="268" cy="166" r="13"/>
    </g>
    <text x="320" y="85" class="nd">8</text>
    <text x="290" y="131" class="nd">5</text>
    <text x="350" y="131" class="nd">10</text>
    <text x="268" y="171" class="nd">9</text>
  </g>

  <g>
    <text x="500" y="60" class="t">③删双孩子</text>
    <g class="edge" fill="none">
      <line x1="500" y1="94" x2="470" y2="130"/>
      <line x1="500" y1="94" x2="540" y2="130"/>
      <line x1="470" y1="132" x2="448" y2="168"/>
      <line x1="470" y1="132" x2="494" y2="168"/>
      <line x1="540" y1="132" x2="570" y2="168"/>
    </g>
    <g stroke="#1e40af" fill="#dbeafe">
      <circle cx="500" cy="80" r="16" stroke="#dc2626"/>
      <circle cx="470" cy="128" r="14" fill="#e0e7ff"/>
      <circle cx="540" cy="128" r="14"/>
      <circle cx="445" cy="166" r="13"/>
      <circle cx="497" cy="166" r="13" stroke="#dc2626"/>
      <circle cx="572" cy="166" r="13"/>
    </g>
    <text x="500" y="85" class="nd">44</text>
    <text x="470" y="133" class="nd">35</text>
    <text x="540" y="133" class="nd">60</text>
    <text x="445" y="171" class="nd">30</text>
    <text x="497" y="171" class="nd">40</text>
    <text x="572" y="171" class="nd">70</text>
  </g>

  <text x="236" y="220" class="lg" text-anchor="start">① 3 无孩子直接删</text>
  <text x="236" y="244" class="lg" text-anchor="start">② 5 只有右孩子 9，9 上移顶替 5</text>
  <text x="236" y="268" class="lg" text-anchor="start">③ 44 左右都有孩子，用中序后继 60 顶替 44，再删 60</text>
  <text x="236" y="292" class="lg" text-anchor="start">中序前驱/后继：左子树最右下、右子树最左下</text>
</svg>`,
        },
      ],
    },
  ],
}
