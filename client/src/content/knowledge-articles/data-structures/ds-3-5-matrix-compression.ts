import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const ds3_5MatrixCompressionArticle: KnowledgeArticleData = {
  pointId: 'ds-3-5-matrix-compression',
  subpoints: [
    {
      id: 'ds-3-5-s1',
      title: '特殊矩阵压缩存储的下标计算',
      blocks: [
        {
          id: 'kb-ds-3-5-1-1',
          type: 'paragraph',
          text: String.raw`**对称矩阵**满足 $a_{ij} = a_{ji}$，只需存储**下三角(含主对角线)**（或上三角），节省约一半空间。`,
        },
        {
          id: 'kb-ds-3-5-1-4',
          type: 'paragraph',
          text: String.raw`**对称矩阵**（存下三角(含主对角线)）求下标时数它前面的元素个数：元素 $a_{ij}$（$i \geq j$）前面有完整的 $i-1$ 行，第 1 行 1 个、第 2 行 2 个、…、第 $i-1$ 行 $i-1$ 个，共 $1+2+\cdots+(i-1)$ 个。本行内它前面还有 $j-1$ 个。所以前面一共 $1+2+\cdots+(i-1)+(j-1)$ 个元素；下标从 1 开始时，再加 1 得到存储位置。`,
        },
        {
          id: 'kb-ds-3-5-3-1',
          type: 'paragraph',
          text: String.raw`**三对角矩阵**只在**主对角线、上副对角线、下副对角线**（$|i-j| \leq 1$）上可能有非零元素，共约 $3n-2$ 个。压缩时按行优先把这三条对角线上的元素逐行存入一维数组。`,
        },
        {
          id: 'kb-ds-3-5-3-3',
          type: 'paragraph',
          text: String.raw`**三对角矩阵求下标也数它前面的元素**：第 1 行有 2 个元素、最后 1 行有 2 个、中间每行 3 个。元素 $a_{ij}$（$|i-j|\leq 1$）前面有第 1 行到第 $i-1$ 行共 $2+3(i-2)$ 个，再加本行内到它为止的 $j-i+1$ 个（本行从第 $i-1$ 列开始）。`,
        },
        {
          id: 'kb-ds-3-5-4-1',
          type: 'paragraph',
          text: String.raw`**例**：一个 $5 \times 5$ 下三角矩阵按行优先存储到一维数组（存下三角(含主对角线)，下标从 1 开始），求元素 $a_{43}$ 的下标。`,
        },
        {
          id: 'kb-ds-3-5-4-2',
          type: 'paragraph',
          text: String.raw`**解**：直接数 $a_{43}$ 前面有多少个元素。前 3 行：第 1 行 1 个、第 2 行 2 个、第 3 行 3 个，共 $1+2+3=6$ 个；第 4 行中 $a_{43}$ 之前还有 $a_{41}$、$a_{42}$ 共 2 个。所以 $a_{43}$ 前面一共 $6+2=8$ 个元素，下标为 8。`,
        },
        {
          id: 'kb-ds-3-5-4-4',
          type: 'html',
          html: `<svg viewBox="0 0 460 220" xmlns="http://www.w3.org/2000/svg" style="display:block;width:min(100%,540px);height:auto;margin-inline:auto">
  <style>
    text { font-family: system-ui, sans-serif; }
    .cell { font-size: 15px; fill: #0f172a; text-anchor: middle; }
    .hl   { font-size: 15px; font-weight: 700; fill: #1d4ed8; }
    .idx  { font-size: 14px; fill: #64748b; text-anchor: middle; }
  </style>

  <text x="105" y="18" class="idx" font-weight="700">下三角5x5</text>
  <g stroke="#334155" stroke-width="1.5" fill="#f8fafc">
    <rect x="20" y="30" width="27" height="24" fill="#dbeafe" stroke="#1e40af"/><text x="33.5" y="46" class="cell">a11</text>
    <rect x="47" y="30" width="27" height="24"/><text x="60.5" y="46" class="cell">0</text>
    <rect x="74" y="30" width="27" height="24"/><text x="87.5" y="46" class="cell">0</text>
    <rect x="101" y="30" width="27" height="24"/><text x="114.5" y="46" class="cell">0</text>
    <rect x="128" y="30" width="27" height="24"/><text x="141.5" y="46" class="cell">0</text>

    <rect x="20" y="54" width="27" height="24" fill="#dbeafe" stroke="#1e40af"/><text x="33.5" y="70" class="cell">a21</text>
    <rect x="47" y="54" width="27" height="24" fill="#dbeafe" stroke="#1e40af"/><text x="60.5" y="70" class="cell">a22</text>
    <rect x="74" y="54" width="27" height="24"/><text x="87.5" y="70" class="cell">0</text>
    <rect x="101" y="54" width="27" height="24"/><text x="114.5" y="70" class="cell">0</text>
    <rect x="128" y="54" width="27" height="24"/><text x="141.5" y="70" class="cell">0</text>

    <rect x="20" y="78" width="27" height="24" fill="#dbeafe" stroke="#1e40af"/><text x="33.5" y="94" class="cell">a31</text>
    <rect x="47" y="78" width="27" height="24" fill="#dbeafe" stroke="#1e40af"/><text x="60.5" y="94" class="cell">a32</text>
    <rect x="74" y="78" width="27" height="24" fill="#dbeafe" stroke="#1e40af"/><text x="87.5" y="94" class="cell">a33</text>
    <rect x="101" y="78" width="27" height="24"/><text x="114.5" y="94" class="cell">0</text>
    <rect x="128" y="78" width="27" height="24"/><text x="141.5" y="94" class="cell">0</text>

    <rect x="20" y="102" width="27" height="24" fill="#dbeafe" stroke="#1e40af"/><text x="33.5" y="118" class="cell">a41</text>
    <rect x="47" y="102" width="27" height="24" fill="#dbeafe" stroke="#1e40af"/><text x="60.5" y="118" class="cell">a42</text>
    <rect x="74" y="102" width="27" height="24" fill="#fef08a" stroke="#ca8a04"/><text x="87.5" y="118" class="hl">a43</text>
    <rect x="101" y="102" width="27" height="24" fill="#dbeafe" stroke="#1e40af"/><text x="114.5" y="118" class="cell">a44</text>
    <rect x="128" y="102" width="27" height="24"/><text x="141.5" y="118" class="cell">0</text>

    <rect x="20" y="126" width="27" height="24" fill="#dbeafe" stroke="#1e40af"/><text x="33.5" y="142" class="cell">a51</text>
    <rect x="47" y="126" width="27" height="24" fill="#dbeafe" stroke="#1e40af"/><text x="60.5" y="142" class="cell">a52</text>
    <rect x="74" y="126" width="27" height="24" fill="#dbeafe" stroke="#1e40af"/><text x="87.5" y="142" class="cell">a53</text>
    <rect x="101" y="126" width="27" height="24" fill="#dbeafe" stroke="#1e40af"/><text x="114.5" y="142" class="cell">a54</text>
    <rect x="128" y="126" width="27" height="24" fill="#dbeafe" stroke="#1e40af"/><text x="141.5" y="142" class="cell">a55</text>
  </g>

  <text x="87.5" y="170" class="idx">a43 是下三角第 9 个元素</text>

  <defs><marker id="arrR" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 Z" fill="#1e40af"/></marker></defs>

  <text x="300" y="28" class="idx" font-weight="700">一维数组 data[n+1]（下标1起）</text>
  <g stroke="#334155" stroke-width="1.5" fill="#f8fafc">
    <rect x="220" y="38" width="26" height="26" fill="#dbeafe" stroke="#1e40af"/><text x="233" y="55" class="cell">1</text>
    <rect x="246" y="38" width="26" height="26" fill="#dbeafe" stroke="#1e40af"/><text x="259" y="55" class="cell">2</text>
    <rect x="272" y="38" width="26" height="26" fill="#dbeafe" stroke="#1e40af"/><text x="285" y="55" class="cell">3</text>
    <rect x="298" y="38" width="26" height="26" fill="#dbeafe" stroke="#1e40af"/><text x="311" y="55" class="cell">4</text>
    <rect x="324" y="38" width="26" height="26" fill="#dbeafe" stroke="#1e40af"/><text x="337" y="55" class="cell">5</text>
  </g>
  <text x="233" y="84" class="idx">a11</text>
  <text x="259" y="84" class="idx">a21</text>
  <text x="285" y="84" class="idx">a22</text>
  <text x="311" y="84" class="idx">a31</text>
  <text x="337" y="84" class="idx">a32</text>

  <line x1="220" y1="96" x2="376" y2="96" stroke="#e2e8f0" stroke-width="1.5"/>
  <g stroke="#334155" stroke-width="1.5" fill="#f8fafc">
    <rect x="220" y="100" width="26" height="26" fill="#dbeafe" stroke="#1e40af"/><text x="233" y="117" class="cell">6</text>
    <rect x="246" y="100" width="26" height="26" fill="#dbeafe" stroke="#1e40af"/><text x="259" y="117" class="cell">7</text>
    <rect x="272" y="100" width="26" height="26" fill="#dbeafe" stroke="#1e40af"/><text x="285" y="117" class="cell">8</text>
    <rect x="298" y="100" width="26" height="26" fill="#fef08a" stroke="#ca8a04"/><text x="311" y="117" class="hl">9</text>
    <rect x="324" y="100" width="26" height="26" fill="#dbeafe" stroke="#1e40af"/><text x="337" y="117" class="cell">10</text>
  </g>
  <text x="233" y="146" class="idx">a33</text>
  <text x="259" y="146" class="idx">a41</text>
  <text x="285" y="146" class="idx">a42</text>
  <text x="311" y="146" class="idx">a43</text>
  <text x="337" y="146" class="idx">a44</text>
</svg>`,
        },
        
        {
          id: 'kb-ds-3-5-1-6',
          type: 'callout',
          title: '先确认下标从 0 还是 1 开始',
          text: '数出来"前面有多少个元素"后，下标从 0 开始就是这个数量本身，从 1 开始就是数量加 1。',
          tone: 'orange',
        },
      ],
    },
    {
      id: 'ds-3-5-s5',
      title: '稀疏矩阵与三元组表',
      blocks: [
        {
          id: 'kb-ds-3-5-5-1',
          type: 'paragraph',
          text: '**稀疏矩阵**指矩阵中非零元素的个数远小于零元素个数（通常远小于总元素数的 1/3）。压缩的方法是**只存非零元素**，不存大量的零，避免不必要的空间和时间开销。',
        },
        {
          id: 'kb-ds-3-5-5-2',
          type: 'paragraph',
          text: '**三元组表**把每个非零元素记为一个三元组 $(i, j, value)$，即"行号、列号、值"，按行优先（即先按行后按列）的顺序放在一个数组里。三元组表**节省空间但失去随机存取能力**：找某元素需顺序扫描三元组，不能像普通数组那样直接定位。',
        },
        {
          id: 'kb-ds-3-5-5-5',
          type: 'paragraph',
          text: '**三元组表**还需记录**非零元素的个数**以及矩阵的**行数和列数**。只存三元组序列本身无法知道矩阵有多大、非零元有多少，头部记下这三个量，才能正确还原矩阵并进行转置、乘法等运算。',
        },
        {
          id: 'kb-ds-3-5-5-3',
          type: 'paragraph',
          text: String.raw`| 压缩结构 | 存储方式 | 随机存取 | 适用 |
|---|---|---|---|
| 三元组表 | 存所有非零元 (i,j,v) | 否，需查找 | 非零元较分散、主要做遍历/转置 |
| 十字链表 | 每行每列双向链表链到一起 | 否 | 非零元动态增删的稀疏矩阵 |
| 行优先/列优先一维数组 | 压缩对称/三角/对角矩阵 | 是（公式换算） | 结构规则的特殊矩阵 |`,
        },
        
      ],
    },
    {
      id: 'ds-3-5-s6',
      title: '十字链表',
      blocks: [
        {
          id: 'kb-ds-3-5-6-1',
          type: 'paragraph',
          text: '**十字链表**用两个方向的链表表示稀疏矩阵：每个非零元素结点既挂在它所在**行的链表**上，又挂在它所在**列的链表**上，行列链条相互交叉成"十字"。每个结点含行号、列号、值、行指针、列指针五部分。',
        },
        {
          id: 'kb-ds-3-5-6-2',
          type: 'paragraph',
          text: '插入或删除非零元素时，只需修改该元素所在行链和列链上的指针，不需要像三元组表那样移动大量元素，因此**适合矩阵运算过程中非零元素频繁增减**的场景（如矩阵转置、乘法）。',
        },
        {
          id: 'kb-ds-3-5-6-3',
          type: 'paragraph',
          text: '行指针按列号递增指向同行下一非零元，列指针按行号递增指向同列下一非零元，外加行表头数组和列表头数组定位每行每列链表头。十字链表用空间和指针换取动态修改的灵活性。',
        },
        {
          id: 'kb-ds-3-5-6-4',
          type: 'callout',
          title: '三元组表 vs 十字链表',
          text: '两者都只存非零元，但三元组表是线性顺序存储，增删要移动元素；十字链表是链式存储，增删只改指针。静态稀疏矩阵用三元组表，非零元动态变化的矩阵用十字链表。',
          tone: 'orange',
        },
      ],
    },
  ],
}
