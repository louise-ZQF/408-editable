import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const fileFcbArticle: KnowledgeArticleData = {
  pointId: 'os-file-fcb',
  subpoints: [
    {
      id: 'os-file-fcb-basic',
      title: '文件与文件属性',
      blocks: [
        {
          id: 'kb-os-file-1-1',
          type: 'paragraph',
          text: '**文件**是命名的相关信息的集合，是操作系统管理信息的基本单位。文件属性包括名称、类型、大小、位置、创建/修改时间、所有者、权限。文件按用途分：程序文件、数据文件、文本文件等。',
        },
      ],
    },
    {
      id: 'os-file-fcb-fcb',
      title: 'FCB 文件控制块',
      blocks: [
        {
          id: 'kb-os-file-fcb-1',
          type: 'paragraph',
          text: '**FCB**（文件控制块）是操作系统为管理文件而设置的数据结构，存放文件的全部属性与控制信息：文件名、类型、大小、物理位置（文件在外存的起始块地址）、创建/修改时间、所有者、访问权限等。\n\nFCB 实现了文件名到文件的映射。',
        },
       
      ],
    },
    {
      id: 'os-file-fcb-inode',
      title: '索引节点 inode',
      blocks: [
        {
          id: 'kb-os-file-fcb-3',
          type: 'paragraph',
          text: '**索引节点**（inode）把“文件名”与“文件描述信息”**分离存储**：目录项中只保留文件名和索引节点号，inode 保存除文件名以外的全部元数据（类型、大小、权限、物理块指针、链接计数等）。检索目录时先按名找到目录项，再据 inode 号找到对应 inode。',
        },
        {
          id: 'kb-os-file-fcb-6',
          type: 'html',
          html: `<svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { font-family: system-ui, sans-serif; }
    .title { font-size: 15px; font-weight: 700; fill: #0f172a; text-anchor: middle; }
    .boxh  { font-size: 13px; font-weight: 700; fill: #0f172a; text-anchor: middle; }
    .row   { font-size: 12px; fill: #334155; text-anchor: middle; }
    .sub   { font-size: 11px; fill: #64748b; text-anchor: middle; }
    .note  { font-size: 12px; fill: #475569; text-anchor: middle; }
  </style>
  <defs>
    <marker id="in" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#2563eb"/></marker>
    <marker id="in2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#16a34a"/></marker>
    <marker id="in3" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#d97706"/></marker>
  </defs>

  <text x="400" y="24" class="title">索引节点 inode：目录项 = 文件名 + inode 号，inode 存元数据与数据块指针</text>

  <!-- 目录 -->
  <rect x="30" y="60" width="200" height="180" rx="6" fill="#f8fafc" stroke="#334155" stroke-width="2"/>
  <text x="130" y="82" class="boxh">目录（目录项）</text>
  <rect x="44" y="96" width="172" height="42" rx="4" fill="#ffffff" stroke="#94a3b8" stroke-width="1.5"/>
  <text x="98" y="114" class="row" text-anchor="start">report.txt</text>
  <text x="98" y="132" class="sub" text-anchor="start">inode 号 12</text>
  <rect x="44" y="152" width="172" height="42" rx="4" fill="#ffffff" stroke="#94a3b8" stroke-width="1.5"/>
  <text x="98" y="170" class="row" text-anchor="start">photo.jpg</text>
  <text x="98" y="188" class="sub" text-anchor="start">inode 号 20</text>

  <!-- inode 12 -->
  <rect x="300" y="60" width="220" height="190" rx="6" fill="#eff6ff" stroke="#2563eb" stroke-width="2"/>
  <text x="410" y="82" class="boxh" fill="#1d4ed8">inode 12</text>
  <text x="410" y="104" class="row" fill="#1d4ed8">类型 / 权限 / 大小</text>
  <text x="410" y="124" class="row" fill="#1d4ed8">创建 / 修改时间</text>
  <text x="410" y="144" class="row" fill="#1d4ed8">链接计数 = 1</text>
  <line x1="320" y1="154" x2="500" y2="154" stroke="#93c5fd" stroke-width="1"/>
  <text x="410" y="170" class="row" fill="#1d4ed8">数据块指针：</text>
  <text x="410" y="188" class="row" fill="#1d4ed8">直接块 100</text>
  <text x="410" y="204" class="row" fill="#1d4ed8">直接块 101</text>
  <text x="410" y="220" class="row" fill="#1d4ed8">直接块 102</text>
  <text x="410" y="240" class="sub" fill="#1d4ed8">间接块 → 更多数据块</text>

  <!-- inode 20 -->
  <rect x="300" y="266" width="220" height="56" rx="6" fill="#dcfce7" stroke="#16a34a" stroke-width="1.6"/>
  <text x="410" y="288" class="boxh" fill="#15803d">inode 20</text>
  <text x="410" y="308" class="row" fill="#15803d">元数据 + 数据块指针</text>

  <!-- 数据块 -->
  <rect x="590" y="70" width="170" height="170" rx="6" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
  <text x="675" y="92" class="boxh" fill="#b45309">文件数据块</text>
  <rect x="604" y="102" width="54" height="38" rx="3" fill="#ffffff" stroke="#fdba74" stroke-width="1.5"/>
  <text x="631" y="126" class="row" fill="#92400e">100</text>
  <rect x="604" y="146" width="54" height="38" rx="3" fill="#ffffff" stroke="#fdba74" stroke-width="1.5"/>
  <text x="631" y="170" class="row" fill="#92400e">101</text>
  <rect x="604" y="190" width="54" height="38" rx="3" fill="#ffffff" stroke="#fdba74" stroke-width="1.5"/>
  <text x="631" y="214" class="row" fill="#92400e">102</text>

  <!-- 箭头：目录项 → inode -->
  <line x1="216" y1="117" x2="298" y2="120" stroke="#2563eb" stroke-width="2" fill="none" marker-end="url(#in)"/>
  <path d="M 216 173 C 250 230, 260 252, 298 286" stroke="#16a34a" stroke-width="2" fill="none" marker-end="url(#in2)"/>

  <!-- 箭头：inode 12 → 数据块 -->
  <path d="M 520 182 C 545 182, 560 130, 588 122" stroke="#d97706" stroke-width="2" fill="none" marker-end="url(#in3)"/>

  <text x="400" y="352" class="note">目录项只存 文件名 + inode 号；inode 集中保存文件元数据与数据块指针，目录因此很小、检索快</text>
  <text x="400" y="376" class="note">打开文件：按名检索目录项 → 由 inode 号定位 inode → 依数据块指针访问数据</text>
</svg>`,
        },
        {
          id: 'kb-os-file-fcb-4',
          type: 'paragraph',
          text: '**分离的好处**：\n\n- 目录项变小，目录检索更快。\n- 便于文件**共享**：多个目录项可以指向同一个 inode，用**链接计数**管理，引用计数减到 0 才真正删除文件。\n- 便于文件移动与重命名：只改目录项，不动 inode。',
        },
        {
          id: 'kb-os-file-fcb-5',
          type: 'callout',
          title: 'FCB 与 inode 的区别',
          text: 'FCB 把文件名和描述信息放在一起。inode 方案把文件名放到目录项，inode 只存描述信息。考题中“目录项”通常指文件名 + 索引节点号。',
          tone: 'orange',
        },
      ],
    },
    {
      id: 'os-file-fcb-softlink',
      title: '软链接符号链接',
      blocks: [
        {
          id: 'kb-os-directory-softlink-1',
          type: 'paragraph',
          text: '**软链接**（symbolic link，又称符号链接）是一个**独立的文件**，这个文件的内容保存的是目标文件的路径。访问软链接时，系统沿着里面存的路径去定位目标文件。因此软链接可以看作“指向文件路径的指针”。',
        },
        {
          id: 'kb-os-directory-softlink-2',
          type: 'paragraph',
          text: '**特点**：\n\n- 软链接有自己的 inode 和文件类型标记（link）。\n- **可以跨文件系统**：存的是路径，不依赖目标文件的 inode。\n- 目标文件被删除后，软链接仍存在但指向的路径失效，成为**悬空链接**。\n- 创建软链接**不增加**目标文件的链接计数。',
        },
        {
          id: 'kb-os-directory-softlink-3',
          type: 'callout',
          title: '软链接失效',
          text: '目标文件删除后软链接不自动删除，但访问它会报"文件不存在"。删除软链接只删除链接文件本身，不影响目标文件。',
          tone: 'orange',
        },
      ],
    },
    {
      id: 'os-file-fcb-hardlink',
      title: '硬链接',
      blocks: [
        {
          id: 'kb-os-directory-2-2',
          type: 'paragraph',
          text: '**硬链接**：多个目录项指向**同一个文件索引结点（inode）**，共享同一份文件数据。系统为 inode 维护**链接计数**（引用计数）：每增加一个目录项，计数加 1。删除一个链接只把计数减 1，计数减到 0 才真正删除文件、释放磁盘空间。硬链接不能跨文件系统（不同文件系统的 inode 相互独立）。',
        },
        {
          id: 'kb-os-directory-hardlink-1',
          type: 'html',
          html: `<svg viewBox="0 0 760 340" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { font-family: system-ui, sans-serif; }
    .title { font-size: 15px; font-weight: 700; fill: #0f172a; text-anchor: middle; }
    .boxh  { font-size: 13px; font-weight: 700; fill: #0f172a; text-anchor: middle; }
    .row   { font-size: 12px; fill: #334155; text-anchor: middle; }
    .sub   { font-size: 11px; fill: #64748b; text-anchor: middle; }
    .note  { font-size: 12px; fill: #475569; text-anchor: middle; }
  </style>
  <defs>
    <marker id="hl" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#2563eb"/></marker>
    <marker id="hl2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#d97706"/></marker>
  </defs>

  <text x="380" y="24" class="title">硬链接：多个目录项指向同一个索引结点</text>

  <!-- 目录 -->
  <rect x="40" y="66" width="220" height="150" rx="6" fill="#f8fafc" stroke="#334155" stroke-width="2"/>
  <text x="150" y="88" class="boxh">目录中的目录项</text>

  <!-- 目录项1 -->
  <rect x="60" y="104" width="180" height="42" rx="4" fill="#ffffff" stroke="#94a3b8" stroke-width="1.5"/>
  <text x="120" y="122" class="row" text-anchor="start">/home/user/a</text>
  <text x="120" y="139" class="sub" text-anchor="start">inode 号：10</text>

  <!-- 目录项2 -->
  <rect x="60" y="158" width="180" height="42" rx="4" fill="#ffffff" stroke="#94a3b8" stroke-width="1.5"/>
  <text x="120" y="176" class="row" text-anchor="start">/shared/b</text>
  <text x="120" y="193" class="sub" text-anchor="start">inode 号：10</text>

  <!-- inode -->
  <rect x="360" y="80" width="150" height="110" rx="6" fill="#eff6ff" stroke="#2563eb" stroke-width="2"/>
  <text x="435" y="104" class="boxh" fill="#1d4ed8">inode 10</text>
  <line x1="380" y1="114" x2="490" y2="114" stroke="#93c5fd" stroke-width="1"/>
  <text x="435" y="138" class="row" fill="#1d4ed8">链接计数 = 2</text>
  <text x="435" y="162" class="sub">文件属性</text>
  <text x="435" y="180" class="sub">数据块指针</text>

  <!-- 数据块 -->
  <rect x="600" y="88" width="120" height="92" rx="6" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
  <text x="660" y="112" class="boxh" fill="#b45309">数据块</text>
  <text x="660" y="136" class="sub">同一份</text>
  <text x="660" y="152" class="sub">文件数据</text>

  <!-- 连线：目录项 → inode -->
  <path d="M 240 125 L 358 125" stroke="#2563eb" stroke-width="2" fill="none" marker-end="url(#hl)"/>
  <path d="M 240 179 L 358 160" stroke="#2563eb" stroke-width="2" fill="none" marker-end="url(#hl)"/>

  <!-- 连线：inode → 数据块 -->
  <path d="M 510 135 L 598 135" stroke="#d97706" stroke-width="2" fill="none" marker-end="url(#hl2)"/>

  <text x="380" y="300" class="note">两个目录项（不同文件名、可不同目录）指向同一 inode，链接计数 = 2</text>
  <text x="380" y="322" class="note">删除其中一个链接，计数减为 1；计数为 0 时才真正删除文件</text>
</svg>`,
        },
        {
          id: 'kb-os-directory-hardlink-2',
          type: 'callout',
          title: '硬链接不能跨文件系统',
          text: 'inode 属于所在的文件系统，硬链接只在同一个文件系统内有效。跨文件系统共享只能使用软链接。',
          tone: 'blue',
        },
      ],
    },
  ],
}
