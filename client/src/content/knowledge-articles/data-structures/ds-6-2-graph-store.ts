import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const ds6_2GraphStoreArticle: KnowledgeArticleData = {
  pointId: 'ds-6-2-graph-store',
  subpoints: [
    {
      id: 'ds-6-2-s1',
      title: '邻接矩阵',
      blocks: [
        {
          id: 'kb-ds-6-2-1',
          type: 'paragraph',
          text: String.raw`**邻接矩阵**用两个数组表示图：一个**一维数组**存所有顶点信息，一个 $n\times n$ 的**二维数组** $A$ 存边。对无权图，$A[i][j]=1$ 表示 $v_i$ 到 $v_j$ 有边，否则为 0；带权图（网）的 $A[i][j]$ 存权值，无边记为 $\infty$。`,
        },
        {
          id: 'kb-ds-6-2-2',
          type: 'paragraph',
          text: String.raw`**无向图的邻接矩阵一定是对称矩阵**（$A[i][j]=A[j][i]$），因为一条边 $(v_i,v_j)$ 同时让第 $i$ 行第 $j$ 列和 $j$ 行 $i$ 列都为 1。有向图的邻接矩阵**不一定对称**。`,
        },
        {
          id: 'kb-ds-6-2-3',
          type: 'paragraph',
          text: '**度**：无向图中，第 $i$ **行**（或第 $i$ 列，对称）元素和就是 $v_i$ 的度；有向图中，第 $i$ **行**元素和为 $v_i$ 的**出度**，第 $i$ **列**元素和为 $v_i$ 的**入度**。',
        },
        {
          id: 'kb-ds-6-2-4',
          type: 'paragraph',
          text: '**空间**：邻接矩阵占用 $O(n^2)$ 空间，与边数 $e$ 无关。判断两点是否相邻 $O(1)$，但找某顶点的所有邻边需 $O(n)$。**适合稠密图**，边多时矩阵元素不浪费。',
        },
        {
          id: 'kb-ds-6-2-5',
          type: 'html',
          html: `<svg viewBox="0 0 780 280" xmlns="http://www.w3.org/2000/svg" style="display:block;width:min(100%,780px);height:auto;margin-inline:auto">
  <style>
    text { font-family: system-ui, sans-serif; }
    .title { font-size: 22px; font-weight: 700; fill: #0f172a; text-anchor: middle; }
    .cap   { font-size: 16px; fill: #475569; text-anchor: middle; }
    .cell  { font-size: 16px; fill: #0f172a; text-anchor: middle; }
    .lbl   { font-size: 16px; font-weight: 700; fill: #334155; text-anchor: middle; }
    .vrtx  { font-size: 17px; font-weight: 700; fill: #ffffff; text-anchor: middle; }
  </style>

  <text x="235" y="30" class="title">无向图 G</text>

  <line x1="89" y1="150" x2="136" y2="150" stroke="#1e40af" stroke-width="2"/>
  <line x1="174" y1="150" x2="221" y2="150" stroke="#1e40af" stroke-width="2"/>
  <line x1="259" y1="150" x2="306" y2="150" stroke="#1e40af" stroke-width="2"/>
  <line x1="344" y1="150" x2="391" y2="150" stroke="#1e40af" stroke-width="2"/>
  <circle cx="70" cy="150" r="19" fill="#2563eb"/>
  <circle cx="155" cy="150" r="19" fill="#2563eb"/>
  <circle cx="240" cy="150" r="19" fill="#2563eb"/>
  <circle cx="325" cy="150" r="19" fill="#2563eb"/>
  <circle cx="410" cy="150" r="19" fill="#2563eb"/>
  <text x="70" y="155" class="vrtx">v0</text>
  <text x="155" y="155" class="vrtx">v1</text>
  <text x="240" y="155" class="vrtx">v2</text>
  <text x="325" y="155" class="vrtx">v3</text>
  <text x="410" y="155" class="vrtx">v4</text>
  <text x="240" y="202" class="cap">边：v0-v1、v1-v2、v2-v3、v3-v4</text>

  <text x="615" y="30" class="title">邻接矩阵（对称 5×5）</text>

  <text x="555" y="66" class="lbl">v0</text>
  <text x="595" y="66" class="lbl">v1</text>
  <text x="635" y="66" class="lbl">v2</text>
  <text x="675" y="66" class="lbl">v3</text>
  <text x="715" y="66" class="lbl">v4</text>

  <text x="528" y="100" class="lbl" text-anchor="end">v0</text>
  <text x="528" y="132" class="lbl" text-anchor="end">v1</text>
  <text x="528" y="164" class="lbl" text-anchor="end">v2</text>
  <text x="528" y="196" class="lbl" text-anchor="end">v3</text>
  <text x="528" y="228" class="lbl" text-anchor="end">v4</text>

  <g stroke="#94a3b8" stroke-width="1" fill="none">
    <rect x="535" y="80" width="200" height="160"/>
    <line x1="575" y1="80" x2="575" y2="240"/>
    <line x1="615" y1="80" x2="615" y2="240"/>
    <line x1="655" y1="80" x2="655" y2="240"/>
    <line x1="695" y1="80" x2="695" y2="240"/>
    <line x1="535" y1="112" x2="735" y2="112"/>
    <line x1="535" y1="144" x2="735" y2="144"/>
    <line x1="535" y1="176" x2="735" y2="176"/>
    <line x1="535" y1="208" x2="735" y2="208"/>
  </g>

  <text x="555" y="100" class="cell">0</text><text x="595" y="100" class="cell">1</text><text x="635" y="100" class="cell">0</text><text x="675" y="100" class="cell">0</text><text x="715" y="100" class="cell">0</text>
  <text x="555" y="132" class="cell">1</text><text x="595" y="132" class="cell">0</text><text x="635" y="132" class="cell">1</text><text x="675" y="132" class="cell">0</text><text x="715" y="132" class="cell">0</text>
  <text x="555" y="164" class="cell">0</text><text x="595" y="164" class="cell">1</text><text x="635" y="164" class="cell">0</text><text x="675" y="164" class="cell">1</text><text x="715" y="164" class="cell">0</text>
  <text x="555" y="196" class="cell">0</text><text x="595" y="196" class="cell">0</text><text x="635" y="196" class="cell">1</text><text x="675" y="196" class="cell">0</text><text x="715" y="196" class="cell">1</text>
  <text x="555" y="228" class="cell">0</text><text x="595" y="228" class="cell">0</text><text x="635" y="228" class="cell">0</text><text x="675" y="228" class="cell">1</text><text x="715" y="228" class="cell">0</text>
</svg>`,
        },
      ],
    },
    {
      id: 'ds-6-2-s2',
      title: '邻接表',
      blocks: [
        {
          id: 'kb-ds-6-2-6',
          type: 'paragraph',
          text: '**邻接表**把每个顶点建成一个**单链表**的**头结点**，头结点后面挂着该顶点的所有**邻接边结点**。整个结构由**顶点表**（依次存放所有头结点）和若干**边表**（每条链存某顶点的全部邻边）组成。',
        },
        {
          id: 'kb-ds-6-2-7',
          type: 'paragraph',
          text: '**空间复杂度**：无向图的每条边在两个端点的链表中各出现一次，需 $O(n+2e)$；有向图每条弧只出现一次，需 $O(n+e)$。邻接表**适合稀疏图**，空间正比于边数。',
        },
        {
          id: 'kb-ds-6-2-8',
          type: 'paragraph',
          text: '**度**：无向图中 $v_i$ 的度就是第 $i$ 条链表的长度；有向图中第 $i$ 条链的长度是 $v_i$ 的**出度**，而求**入度**需要遍历**所有**链（顺链找指向 $v_i$ 的边），开销大。因此求有向图入度常用**逆邻接表**（存储指向自己的邻边）或十字链表。',
        },
        
        {
          id: 'kb-ds-6-2-9',
          type: 'html',
          html: `<svg viewBox="0 0 760 340" xmlns="http://www.w3.org/2000/svg" style="display:block;width:min(100%,760px);height:auto;margin-inline:auto">
  <style>
    text { font-family: system-ui, sans-serif; }
    .title { font-size: 22px; font-weight: 700; fill: #0f172a; text-anchor: middle; }
    .cap   { font-size: 16px; fill: #475569; text-anchor: middle; }
    .vrtx  { font-size: 17px; font-weight: 700; fill: #ffffff; text-anchor: middle; }
    .edge  { font-size: 17px; font-weight: 700; fill: #ffffff; text-anchor: middle; }
    .nil   { font-size: 20px; fill: #0f172a; text-anchor: middle; }
    .hint  { font-size: 15px; fill: #64748b; text-anchor: middle; }
  </style>

  <defs>
    <marker id="adjArr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#334155"/>
    </marker>
  </defs>

  <text x="380" y="30" class="title">链 v0-v1-v2-v3-v4 的邻接表</text>
  <text x="380" y="54" class="hint">左格存顶点或边，右格（浅色）是指针域；∧ 表示空指针，e 表示边</text>

  <text x="95" y="70" class="cap">顶点表</text>
  <text x="250" y="70" class="cap">边表</text>

  <!-- v0：v0 -> e1 -> ^ -->
  <rect x="60" y="84" width="54" height="40" rx="6" fill="#2563eb"/>
  <rect x="114" y="84" width="28" height="40" fill="#bfdbfe"/>
  <text x="87" y="109" class="vrtx">v0</text>
  <line x1="128" y1="104" x2="186" y2="104" stroke="#334155" stroke-width="2" marker-end="url(#adjArr)"/>
  <rect x="190" y="84" width="54" height="40" rx="6" fill="#059669"/>
  <rect x="244" y="84" width="28" height="40" fill="#a7f3d0"/>
  <text x="217" y="109" class="edge">e1</text>
  <text x="258" y="109" class="nil">∧</text>

  <!-- v1：v1 -> e1 -> e2 -> ^ -->
  <rect x="60" y="134" width="54" height="40" rx="6" fill="#2563eb"/>
  <rect x="114" y="134" width="28" height="40" fill="#bfdbfe"/>
  <text x="87" y="159" class="vrtx">v1</text>
  <line x1="128" y1="154" x2="186" y2="154" stroke="#334155" stroke-width="2" marker-end="url(#adjArr)"/>
  <rect x="190" y="134" width="54" height="40" rx="6" fill="#059669"/>
  <rect x="244" y="134" width="28" height="40" fill="#a7f3d0"/>
  <text x="217" y="159" class="edge">e1</text>
  <line x1="258" y1="154" x2="296" y2="154" stroke="#334155" stroke-width="2" marker-end="url(#adjArr)"/>
  <rect x="300" y="134" width="54" height="40" rx="6" fill="#059669"/>
  <rect x="354" y="134" width="28" height="40" fill="#a7f3d0"/>
  <text x="327" y="159" class="edge">e2</text>
  <text x="368" y="159" class="nil">∧</text>

  <!-- v2：v2 -> e2 -> e3 -> ^ -->
  <rect x="60" y="184" width="54" height="40" rx="6" fill="#2563eb"/>
  <rect x="114" y="184" width="28" height="40" fill="#bfdbfe"/>
  <text x="87" y="209" class="vrtx">v2</text>
  <line x1="128" y1="204" x2="186" y2="204" stroke="#334155" stroke-width="2" marker-end="url(#adjArr)"/>
  <rect x="190" y="184" width="54" height="40" rx="6" fill="#059669"/>
  <rect x="244" y="184" width="28" height="40" fill="#a7f3d0"/>
  <text x="217" y="209" class="edge">e2</text>
  <line x1="258" y1="204" x2="296" y2="204" stroke="#334155" stroke-width="2" marker-end="url(#adjArr)"/>
  <rect x="300" y="184" width="54" height="40" rx="6" fill="#059669"/>
  <rect x="354" y="184" width="28" height="40" fill="#a7f3d0"/>
  <text x="327" y="209" class="edge">e3</text>
  <text x="368" y="209" class="nil">∧</text>

  <!-- v3：v3 -> e3 -> e4 -> ^ -->
  <rect x="60" y="234" width="54" height="40" rx="6" fill="#2563eb"/>
  <rect x="114" y="234" width="28" height="40" fill="#bfdbfe"/>
  <text x="87" y="259" class="vrtx">v3</text>
  <line x1="128" y1="254" x2="186" y2="254" stroke="#334155" stroke-width="2" marker-end="url(#adjArr)"/>
  <rect x="190" y="234" width="54" height="40" rx="6" fill="#059669"/>
  <rect x="244" y="234" width="28" height="40" fill="#a7f3d0"/>
  <text x="217" y="259" class="edge">e3</text>
  <line x1="258" y1="254" x2="296" y2="254" stroke="#334155" stroke-width="2" marker-end="url(#adjArr)"/>
  <rect x="300" y="234" width="54" height="40" rx="6" fill="#059669"/>
  <rect x="354" y="234" width="28" height="40" fill="#a7f3d0"/>
  <text x="327" y="259" class="edge">e4</text>
  <text x="368" y="259" class="nil">∧</text>

  <!-- v4：v4 -> e4 -> ^ -->
  <rect x="60" y="284" width="54" height="40" rx="6" fill="#2563eb"/>
  <rect x="114" y="284" width="28" height="40" fill="#bfdbfe"/>
  <text x="87" y="309" class="vrtx">v4</text>
  <line x1="128" y1="304" x2="186" y2="304" stroke="#334155" stroke-width="2" marker-end="url(#adjArr)"/>
  <rect x="190" y="284" width="54" height="40" rx="6" fill="#059669"/>
  <rect x="244" y="284" width="28" height="40" fill="#a7f3d0"/>
  <text x="217" y="309" class="edge">e4</text>
  <text x="258" y="309" class="nil">∧</text>
</svg>`,
        },
      ],
    },
    {
      id: 'ds-6-2-s3',
      title: '十字链表与邻接多重表',
      blocks: [
        {
          id: 'kb-ds-6-2-10',
          type: 'paragraph',
          text: '**十字链表**是**有向图**的链式存储，每个**顶点**一个结点，每条**弧**一个结点。弧结点同时挂在"同一个弧尾"和"同一个弧头"两条链上，因此**求入度和出度都容易**，这是它对有向图的主要优势。',
        },
        {
          id: 'kb-ds-6-2-14',
          type: 'html',
          html: `<svg viewBox="0 0 1000 640" xmlns="http://www.w3.org/2000/svg" style="display:block;width:min(100%,1000px);height:auto;margin-inline:auto">
  <style>
    text { font-family: system-ui, sans-serif; }
    .title { font-size: 22px; font-weight: 700; fill: #0f172a; text-anchor: middle; }
    .cap   { font-size: 16px; fill: #475569; text-anchor: middle; }
    .vtx   { font-size: 17px; font-weight: 700; fill: #ffffff; text-anchor: middle; }
    .fin   { font-size: 16px; font-weight: 700; fill: #9a3412; text-anchor: middle; }
    .fout  { font-size: 16px; font-weight: 700; fill: #1e3a8a; text-anchor: middle; }
    .cell  { font-size: 16px; fill: #334155; text-anchor: middle; }
    .hin   { font-size: 16px; font-weight: 700; fill: #9a3412; text-anchor: middle; }
    .tout  { font-size: 16px; font-weight: 700; fill: #1e3a8a; text-anchor: middle; }
    .leg   { font-size: 15px; fill: #334155; }
    .sf    { font-size: 15px; font-weight: 700; fill: #0f172a; text-anchor: middle; }
    .sm    { font-size: 14px; fill: #475569; text-anchor: middle; }
  </style>

  <defs>
    <marker id="coOut" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="#2563eb"/></marker>
    <marker id="coIn" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="#d97706"/></marker>
    <marker id="coDir" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="#0f172a"/></marker>
  </defs>

  <text x="500" y="28" class="title">有向图的十字链表</text>

  <line x1="114" y1="82" x2="206" y2="63" stroke="#0f172a" stroke-width="1.5" marker-end="url(#coDir)"/>
  <line x1="114" y1="98" x2="206" y2="117" stroke="#0f172a" stroke-width="1.5" marker-end="url(#coDir)"/>
  <line x1="220" y1="69" x2="220" y2="111" stroke="#0f172a" stroke-width="1.5" marker-end="url(#coDir)"/>
  <line x1="206" y1="125" x2="114" y2="98" stroke="#0f172a" stroke-width="1.5" marker-end="url(#coDir)"/>
  <circle cx="100" cy="90" r="14" fill="#2563eb"/>
  <circle cx="220" cy="55" r="14" fill="#2563eb"/>
  <circle cx="220" cy="125" r="14" fill="#2563eb"/>
  <text x="100" y="95" class="vtx">v0</text>
  <text x="220" y="60" class="vtx">v1</text>
  <text x="220" y="130" class="vtx">v2</text>
  <text x="160" y="70" class="cap">a1</text>
  <text x="158" y="90" class="cap">a2</text>
  <text x="238" y="92" class="cap">a3</text>
  <text x="158" y="128" class="cap">a4</text>

  <line x1="620" y1="72" x2="648" y2="72" stroke="#2563eb" stroke-width="2" marker-end="url(#coOut)"/>
  <text x="654" y="77" class="leg" text-anchor="start">出弧链：firstout / tlink（同弧尾，横）</text>
  <line x1="620" y1="98" x2="648" y2="98" stroke="#d97706" stroke-width="2" marker-end="url(#coIn)"/>
  <text x="654" y="103" class="leg" text-anchor="start">入弧链：firstin / hlink（同弧头，竖）</text>

  <text x="150" y="200" class="cap">顶点表</text>



  <!-- 顶点表 -->
  <rect x="90" y="210" width="40" height="40" fill="#2563eb"/>
  <rect x="130" y="210" width="40" height="40" fill="#fed7aa"/>
  <rect x="170" y="210" width="40" height="40" fill="#bfdbfe"/>
  <text x="110" y="235" class="vtx">v0</text>
  <text x="150" y="235" class="fin">a4</text>
  <text x="190" y="235" class="fout">a1</text>
  <line x1="190" y1="230" x2="646" y2="230" stroke="#2563eb" stroke-width="1.8" marker-end="url(#coOut)"/>
  <line x1="150" y1="230" x2="496" y2="386" stroke="#d97706" stroke-width="1.8" marker-end="url(#coIn)"/>

  <rect x="90" y="290" width="40" height="40" fill="#2563eb"/>
  <rect x="130" y="290" width="40" height="40" fill="#fed7aa"/>
  <rect x="170" y="290" width="40" height="40" fill="#bfdbfe"/>
  <text x="110" y="315" class="vtx">v1</text>
  <text x="150" y="315" class="fin">a1</text>
  <text x="190" y="315" class="fout">a3</text>
  <line x1="190" y1="310" x2="796" y2="310" stroke="#2563eb" stroke-width="1.8" marker-end="url(#coOut)"/>
  <line x1="150" y1="310" x2="646" y2="230" stroke="#d97706" stroke-width="1.8" marker-end="url(#coIn)"/>

  <rect x="90" y="370" width="40" height="40" fill="#2563eb"/>
  <rect x="130" y="370" width="40" height="40" fill="#fed7aa"/>
  <rect x="170" y="370" width="40" height="40" fill="#bfdbfe"/>
  <text x="110" y="395" class="vtx">v2</text>
  <text x="150" y="395" class="fin">a2</text>
  <text x="190" y="395" class="fout">a4</text>
  <line x1="190" y1="390" x2="496" y2="390" stroke="#2563eb" stroke-width="1.8" marker-end="url(#coOut)"/>
  <line x1="150" y1="390" x2="796" y2="230" stroke="#d97706" stroke-width="1.8" marker-end="url(#coIn)"/>

  <!-- 弧 a1（v0→v1） -->
  <text x="710" y="204" class="cap">a1</text>
  <rect x="650" y="210" width="30" height="40" fill="#f1f5f9" stroke="#94a3b8"/>
  <rect x="680" y="210" width="30" height="40" fill="#f1f5f9" stroke="#94a3b8"/>
  <rect x="710" y="210" width="30" height="40" fill="#fed7aa"/>
  <rect x="740" y="210" width="30" height="40" fill="#bfdbfe"/>
  <text x="665" y="235" class="cell">0</text>
  <text x="695" y="235" class="cell">1</text>
  <text x="725" y="235" class="hin">∧</text>
  <text x="755" y="235" class="tout">a2</text>
  <line x1="755" y1="230" x2="796" y2="230" stroke="#2563eb" stroke-width="1.8" marker-end="url(#coOut)"/>

  <!-- 弧 a2（v0→v2） -->
  <text x="860" y="204" class="cap">a2</text>
  <rect x="800" y="210" width="30" height="40" fill="#f1f5f9" stroke="#94a3b8"/>
  <rect x="830" y="210" width="30" height="40" fill="#f1f5f9" stroke="#94a3b8"/>
  <rect x="860" y="210" width="30" height="40" fill="#fed7aa"/>
  <rect x="890" y="210" width="30" height="40" fill="#bfdbfe"/>
  <text x="815" y="235" class="cell">0</text>
  <text x="845" y="235" class="cell">2</text>
  <text x="875" y="235" class="hin">a3</text>
  <text x="905" y="235" class="tout">∧</text>
  <line x1="875" y1="250" x2="875" y2="286" stroke="#d97706" stroke-width="1.8" marker-end="url(#coIn)"/>

  <!-- 弧 a3（v1→v2） -->
  <text x="860" y="284" class="cap">a3</text>
  <rect x="800" y="290" width="30" height="40" fill="#f1f5f9" stroke="#94a3b8"/>
  <rect x="830" y="290" width="30" height="40" fill="#f1f5f9" stroke="#94a3b8"/>
  <rect x="860" y="290" width="30" height="40" fill="#fed7aa"/>
  <rect x="890" y="290" width="30" height="40" fill="#bfdbfe"/>
  <text x="815" y="315" class="cell">1</text>
  <text x="845" y="315" class="cell">2</text>
  <text x="875" y="315" class="hin">∧</text>
  <text x="905" y="315" class="tout">∧</text>

  <!-- 弧 a4（v2→v0） -->
  <text x="560" y="364" class="cap">a4</text>
  <rect x="500" y="370" width="30" height="40" fill="#f1f5f9" stroke="#94a3b8"/>
  <rect x="530" y="370" width="30" height="40" fill="#f1f5f9" stroke="#94a3b8"/>
  <rect x="560" y="370" width="30" height="40" fill="#fed7aa"/>
  <rect x="590" y="370" width="30" height="40" fill="#bfdbfe"/>
  <text x="515" y="395" class="cell">2</text>
  <text x="545" y="395" class="cell">0</text>
  <text x="575" y="395" class="hin">∧</text>
  <text x="605" y="395" class="tout">∧</text>

  <text x="500" y="452" class="cap">弧结点结构</text>
  <g stroke="#94a3b8" stroke-width="1" fill="none">
    <rect x="150" y="462" width="700" height="60"/>
    <line x1="300" y1="462" x2="300" y2="522"/>
    <line x1="450" y1="462" x2="450" y2="522"/>
    <line x1="650" y1="462" x2="650" y2="522"/>
    <line x1="150" y1="492" x2="850" y2="492"/>
  </g>
  <text x="225" y="484" class="sf">tailvex</text>
  <text x="375" y="484" class="sf">headvex</text>
  <text x="550" y="484" class="sf">hlink</text>
  <text x="750" y="484" class="sf">tlink</text>
  <text x="225" y="512" class="sm">弧尾顶点</text>
  <text x="375" y="512" class="sm">弧头顶点</text>
  <text x="550" y="512" class="sm">下一条同弧头的弧</text>
  <text x="750" y="512" class="sm">下一条同弧尾的弧</text>

  <text x="500" y="546" class="cap">顶点结点结构</text>
  <g stroke="#94a3b8" stroke-width="1" fill="none">
    <rect x="210" y="556" width="580" height="60"/>
    <line x1="390" y1="556" x2="390" y2="616"/>
    <line x1="590" y1="556" x2="590" y2="616"/>
    <line x1="210" y1="586" x2="790" y2="586"/>
  </g>
  <text x="300" y="578" class="sf">data</text>
  <text x="490" y="578" class="sf">firstin</text>
  <text x="690" y="578" class="sf">firstout</text>
  <text x="300" y="606" class="sm">顶点数据</text>
  <text x="490" y="606" class="sm">第一条入弧</text>
  <text x="690" y="606" class="sm">第一条出弧</text>
</svg>`,
        },
        {
          id: 'kb-ds-6-2-11',
          type: 'paragraph',
          text: '**邻接多重表**是**无向图**的链式存储，每条**边**只用一个结点，同时被两个端点顶点复用。优点是**修改边（删边、改权）更快**，无需像邻接表那样在两个端点处各改一次；判断两个方向上的边是否同一条无向边也更直接。',
        },
        {
          id: 'kb-ds-6-2-15',
          type: 'html',
          html: `<svg viewBox="0 0 900 640" xmlns="http://www.w3.org/2000/svg" style="display:block;width:min(100%,900px);height:auto;margin-inline:auto">
  <style>
    text { font-family: system-ui, sans-serif; }
    .title { font-size: 22px; font-weight: 700; fill: #0f172a; text-anchor: middle; }
    .cap   { font-size: 16px; fill: #475569; text-anchor: middle; }
    .vtx   { font-size: 17px; font-weight: 700; fill: #ffffff; text-anchor: middle; }
    .fed   { font-size: 16px; font-weight: 700; fill: #1e3a8a; text-anchor: middle; }
    .cell  { font-size: 16px; fill: #334155; text-anchor: middle; }
    .ivex  { font-size: 16px; font-weight: 700; fill: #1e3a8a; text-anchor: middle; }
    .jvex  { font-size: 16px; font-weight: 700; fill: #9a3412; text-anchor: middle; }
    .leg   { font-size: 15px; fill: #334155; }
    .sf    { font-size: 15px; font-weight: 700; fill: #0f172a; text-anchor: middle; }
    .sm    { font-size: 14px; fill: #475569; text-anchor: middle; }
  </style>

  <defs>
    <marker id="amBlue" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="#2563eb"/></marker>
    <marker id="amOrange" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="#d97706"/></marker>
  </defs>

  <text x="450" y="28" class="title">无向图的邻接多重表</text>

  <line x1="135" y1="92" x2="226" y2="78" stroke="#0f172a" stroke-width="1.5"/>
  <line x1="135" y1="108" x2="226" y2="132" stroke="#0f172a" stroke-width="1.5"/>
  <line x1="240" y1="85" x2="240" y2="125" stroke="#0f172a" stroke-width="1.5"/>
  <circle cx="120" cy="100" r="15" fill="#2563eb"/>
  <circle cx="240" cy="70" r="15" fill="#2563eb"/>
  <circle cx="240" cy="140" r="15" fill="#2563eb"/>
  <text x="120" y="105" class="vtx">v0</text>
  <text x="240" y="75" class="vtx">v1</text>
  <text x="240" y="145" class="vtx">v2</text>
  <text x="180" y="172" class="cap">边 e1(v0-v1)、e2(v0-v2)、e3(v1-v2)</text>

  <line x1="660" y1="72" x2="688" y2="72" stroke="#2563eb" stroke-width="2" marker-end="url(#amBlue)"/>
  <text x="694" y="77" class="leg">ivex / ilink 端（蓝）</text>
  <line x1="660" y1="98" x2="688" y2="98" stroke="#d97706" stroke-width="2" marker-end="url(#amOrange)"/>
  <text x="694" y="103" class="leg">jvex / jlink 端（橙）</text>

  <text x="95" y="188" class="cap">顶点表</text>
  <text x="450" y="188" class="cap">边结点</text>

  <!-- 顶点 v0 -->
  <rect x="60" y="200" width="54" height="40" rx="5" fill="#2563eb"/>
  <rect x="114" y="200" width="28" height="40" fill="#bfdbfe"/>
  <text x="87" y="226" class="vtx">v0</text>
  <text x="128" y="226" class="fed">e1</text>
  <line x1="128" y1="220" x2="396" y2="220" stroke="#2563eb" stroke-width="1.8" marker-end="url(#amBlue)"/>

  <!-- 顶点 v1 -->
  <rect x="60" y="260" width="54" height="40" rx="5" fill="#2563eb"/>
  <rect x="114" y="260" width="28" height="40" fill="#bfdbfe"/>
  <text x="87" y="286" class="vtx">v1</text>
  <text x="128" y="286" class="fed">e1</text>
  <line x1="128" y1="280" x2="396" y2="220" stroke="#2563eb" stroke-width="1.8" marker-end="url(#amBlue)"/>

  <!-- 顶点 v2 -->
  <rect x="60" y="320" width="54" height="40" rx="5" fill="#2563eb"/>
  <rect x="114" y="320" width="28" height="40" fill="#bfdbfe"/>
  <text x="87" y="346" class="vtx">v2</text>
  <text x="128" y="346" class="fed">e2</text>
  <line x1="128" y1="340" x2="396" y2="280" stroke="#2563eb" stroke-width="1.8" marker-end="url(#amBlue)"/>

  <!-- 边 e1 -->
  <rect x="400" y="200" width="24" height="40" fill="#ffffff" stroke="#94a3b8"/>
  <rect x="424" y="200" width="30" height="40" fill="#bfdbfe"/>
  <rect x="454" y="200" width="28" height="40" fill="#bfdbfe"/>
  <rect x="482" y="200" width="30" height="40" fill="#fed7aa"/>
  <rect x="512" y="200" width="28" height="40" fill="#fed7aa"/>
  <text x="439" y="226" class="ivex">0</text>
  <text x="468" y="226" class="ivex">e2</text>
  <text x="497" y="226" class="jvex">1</text>
  <text x="526" y="226" class="jvex">e3</text>
  <line x1="468" y1="240" x2="468" y2="256" stroke="#2563eb" stroke-width="1.8" marker-end="url(#amBlue)"/>
  <line x1="526" y1="240" x2="526" y2="316" stroke="#d97706" stroke-width="1.8" marker-end="url(#amOrange)"/>

  <!-- 边 e2 -->
  <rect x="400" y="260" width="24" height="40" fill="#ffffff" stroke="#94a3b8"/>
  <rect x="424" y="260" width="30" height="40" fill="#bfdbfe"/>
  <rect x="454" y="260" width="28" height="40" fill="#bfdbfe"/>
  <rect x="482" y="260" width="30" height="40" fill="#fed7aa"/>
  <rect x="512" y="260" width="28" height="40" fill="#fed7aa"/>
  <text x="439" y="286" class="ivex">0</text>
  <text x="468" y="286" class="ivex">∧</text>
  <text x="497" y="286" class="jvex">2</text>
  <text x="526" y="286" class="jvex">∧</text>

  <!-- 边 e3 -->
  <rect x="400" y="320" width="24" height="40" fill="#ffffff" stroke="#94a3b8"/>
  <rect x="424" y="320" width="30" height="40" fill="#bfdbfe"/>
  <rect x="454" y="320" width="28" height="40" fill="#bfdbfe"/>
  <rect x="482" y="320" width="30" height="40" fill="#fed7aa"/>
  <rect x="512" y="320" width="28" height="40" fill="#fed7aa"/>
  <text x="439" y="346" class="ivex">1</text>
  <text x="468" y="346" class="ivex">∧</text>
  <text x="497" y="346" class="jvex">2</text>
  <text x="526" y="346" class="jvex">∧</text>

  <text x="450" y="440" class="cap">边结点结构</text>
  <g stroke="#94a3b8" stroke-width="1" fill="none">
    <rect x="55" y="450" width="790" height="60"/>
    <line x1="165" y1="450" x2="165" y2="510"/>
    <line x1="275" y1="450" x2="275" y2="510"/>
    <line x1="495" y1="450" x2="495" y2="510"/>
    <line x1="625" y1="450" x2="625" y2="510"/>
    <line x1="55" y1="480" x2="845" y2="480"/>
  </g>
  <text x="110" y="472" class="sf">mark</text>
  <text x="220" y="472" class="sf">ivex</text>
  <text x="385" y="472" class="sf">ilink</text>
  <text x="560" y="472" class="sf">jvex</text>
  <text x="735" y="472" class="sf">jlink</text>
  <text x="110" y="500" class="sm">访问标记</text>
  <text x="220" y="500" class="sm">一个端点</text>
  <text x="385" y="500" class="sm">下一条依附 ivex 的边</text>
  <text x="560" y="500" class="sm">另一个端点</text>
  <text x="735" y="500" class="sm">下一条依附 jvex 的边</text>

  <text x="450" y="550" class="cap">顶点结点结构</text>
  <g stroke="#94a3b8" stroke-width="1" fill="none">
    <rect x="270" y="560" width="360" height="60"/>
    <line x1="450" y1="560" x2="450" y2="620"/>
    <line x1="270" y1="590" x2="630" y2="590"/>
  </g>
  <text x="360" y="582" class="sf">data</text>
  <text x="540" y="582" class="sf">firstedge</text>
  <text x="360" y="610" class="sm">顶点数据</text>
  <text x="540" y="610" class="sm">第一条依附边</text>
</svg>`,
        },
        {
          id: 'kb-ds-6-2-12',
          type: 'paragraph',
          text: String.raw`| 存储结构 | 适用图 | 求无向图的度 | 求有向图的入度 | 空间 | 典型优势 |
|---|---|---|---|---|---|
| 邻接矩阵 | 稠密图 | 数第 $i$ 行 1 的个数（无向对称，行=列） | 数第 $i$ 列的 1（第 $i$ 列 = 指向 $v_i$ 的弧） | $O(n^2)$ | 判相邻 $O(1)$ |
| 邻接表 | 稀疏图 | 第 $i$ 条链的长度（一个结点 = 一个邻接点） | 扫所有链数指向 $v_i$ 的结点（第 $i$ 条链只存出边） | $O(n+e)$ | 省空间 |
| 十字链表 | 有向图 | — | 沿 firstin 链顺次计数 | $O(n+e)$ | 入出度都易求 |
| 邻接多重表 | 无向图 | 第 $i$ 条链的长度 | — | $O(n+e)$ | 改边快 |`,
        },
        {
          id: 'kb-ds-6-2-13',
          type: 'callout',
          title: '按图类型选存储',
          text: '稠密图优先邻接矩阵，稀疏图优先邻接表；有向图又频繁求入度用十字链表，无向图又经常改边用邻接多重表。',
          tone: 'orange',
        },
      ],
    },
  ],
}
