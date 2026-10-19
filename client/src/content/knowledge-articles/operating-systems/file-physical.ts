import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const filePhysicalArticle: KnowledgeArticleData = {
  pointId: 'os-file-physical',
  subpoints: [
    {
      id: 'os-file-phys-basic',
      title: '文件的三种物理结构',
      blocks: [
        {
          id: 'kb-os-file-1-3',
          type: 'paragraph',
          text: '**文件的物理结构**（外存视角）分三种：\n\n- **连续分配**：文件占连续磁盘块，读取快但难扩展、有外部碎片。\n- **链接分配**：文件块用指针链接，隐式链接不利于随机访问、显式链接用 FAT 表。\n- **索引分配**：每个文件建索引块，支持随机访问，多级索引可支持大文件。',
        },
        {
          id: 'kb-os-file-phys-2',
          type: 'paragraph',
          text: '**连续分配**：文件占用外存上若干**连续**的磁盘块，FCB 记录起始块号和块数。\n\n**优点**：访问速度快（顺序/随机都只需一次寻道），管理简单。\n\n**缺点**：文件扩展困难（可能因无连续空间而无法扩展）、产生**外部碎片**、需预知文件长度。',
        },
        {
          id: 'kb-os-file-phys-3',
          type: 'paragraph',
          text: '**链接分配**：文件占用若干**离散**的磁盘块，块间用指针链接。\n\n**隐式链接**：每个块末存下一块的指针，只能顺序访问、随机访问慢。一个指针坏了会断链。\n\n**显式链接**：把所有指针集中放在**文件分配表 FAT** 中，目录项记录首块号，查 FAT 可随机定位。FAT 本身需常驻内存或缓存。',
        },
        {
          id: 'kb-os-file-phys-7',
          type: 'html',
          html: `<svg viewBox="0 0 960 620" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { font-family: system-ui, sans-serif; }
    .title { font-size: 15px; font-weight: 700; fill: #0f172a; text-anchor: middle; }
    .sech  { font-size: 14px; font-weight: 700; fill: #0f172a; text-anchor: middle; }
    .boxh  { font-size: 13px; font-weight: 700; fill: #0f172a; text-anchor: middle; }
    .row   { font-size: 12px; fill: #334155; text-anchor: middle; }
    .sub   { font-size: 11px; fill: #64748b; text-anchor: middle; }
    .note  { font-size: 12px; fill: #475569; text-anchor: middle; }
    .ptr   { font-size: 10px; font-weight: 700; fill: #dc2626; text-anchor: middle; }
    .datab { fill: #f1f5f9; stroke: #94a3b8; stroke-width: 1.6; }
    .fatch { fill: #dbeafe; stroke: #2563eb; stroke-width: 1.6; }
  </style>
  <defs>
    <marker id="ilk" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#475569"/></marker>
    <marker id="ilkr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#dc2626"/></marker>
    <marker id="elk" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#2563eb"/></marker>
  </defs>

  <text x="480" y="26" class="title">链接分配：隐式链接（指针在块内）与显式链接（指针集中在 FAT）</text>

  <!-- ===================== 隐式链接（上半） ===================== -->
  <text x="480" y="54" class="sech" fill="#b45309">① 隐式链接</text>

  <!-- 目录项 -->
  <rect x="40" y="70" width="150" height="70" rx="6" fill="#f8fafc" stroke="#334155" stroke-width="2"/>
  <text x="115" y="92" class="boxh">目录项</text>
  <text x="115" y="114" class="row" text-anchor="middle">file.txt</text>
  <text x="115" y="132" class="sub" text-anchor="middle">起始块号 9</text>

  <!-- 数据块 9 -->
  <rect x="250" y="66" width="130" height="88" rx="4" class="datab"/>
  <text x="315" y="88" class="boxh">块 9</text>
  <text x="315" y="110" class="row" text-anchor="middle">数据</text>
  <line x1="258" y1="120" x2="372" y2="120" stroke="#cbd5e1" stroke-width="1"/>
  <text x="315" y="138" class="ptr">下一块：11</text>

  <!-- 数据块 11 -->
  <rect x="420" y="66" width="130" height="88" rx="4" class="datab"/>
  <text x="485" y="88" class="boxh">块 11</text>
  <text x="485" y="110" class="row" text-anchor="middle">数据</text>
  <line x1="428" y1="120" x2="542" y2="120" stroke="#cbd5e1" stroke-width="1"/>
  <text x="485" y="138" class="ptr">下一块：5</text>

  <!-- 数据块 5 -->
  <rect x="590" y="66" width="130" height="88" rx="4" class="datab"/>
  <text x="655" y="88" class="boxh">块 5</text>
  <text x="655" y="110" class="row" text-anchor="middle">数据</text>
  <line x1="598" y1="120" x2="712" y2="120" stroke="#cbd5e1" stroke-width="1"/>
  <text x="655" y="138" class="ptr">下一块：8</text>

  <!-- 数据块 8（末块） -->
  <rect x="760" y="66" width="130" height="88" rx="4" class="datab"/>
  <text x="825" y="88" class="boxh">块 8</text>
  <text x="825" y="110" class="row" text-anchor="middle">数据</text>
  <line x1="768" y1="120" x2="882" y2="120" stroke="#cbd5e1" stroke-width="1"/>
  <text x="825" y="138" class="ptr">下一块：-1（结束）</text>

  <!-- 隐式链接箭头链 -->
  <line x1="190" y1="105" x2="248" y2="105" stroke="#475569" stroke-width="2" marker-end="url(#ilk)"/>
  <line x1="380" y1="105" x2="418" y2="105" stroke="#dc2626" stroke-width="2" marker-end="url(#ilkr)"/>
  <line x1="550" y1="105" x2="588" y2="105" stroke="#dc2626" stroke-width="2" marker-end="url(#ilkr)"/>
  <line x1="720" y1="105" x2="758" y2="105" stroke="#dc2626" stroke-width="2" marker-end="url(#ilkr)"/>

  <text x="480" y="184" class="note">隐式链接：指针存在每个数据块末尾，读取须从首块沿指针链顺序找 → 只能顺序访问，随机访问慢；指针坏了会断链</text>

  <!-- ===================== 显式链接（下半） ===================== -->
  <text x="480" y="230" class="sech" fill="#1d4ed8">② 显式链接</text>

  <!-- 目录项 -->
  <rect x="40" y="250" width="150" height="70" rx="6" fill="#f8fafc" stroke="#334155" stroke-width="2"/>
  <text x="115" y="272" class="boxh">目录项</text>
  <text x="115" y="294" class="row" text-anchor="middle">file.txt</text>
  <text x="115" y="312" class="sub" text-anchor="middle">起始块号 9</text>

  <!-- 数据块 9（无指针） -->
  <rect x="250" y="246" width="130" height="78" rx="4" class="datab"/>
  <text x="315" y="272" class="boxh">块 9</text>
  <text x="315" y="296" class="row" text-anchor="middle">数据</text>
  <!-- 数据块 11 -->
  <rect x="420" y="246" width="130" height="78" rx="4" class="datab"/>
  <text x="485" y="272" class="boxh">块 11</text>
  <text x="485" y="296" class="row" text-anchor="middle">数据</text>
  <!-- 数据块 5 -->
  <rect x="590" y="246" width="130" height="78" rx="4" class="datab"/>
  <text x="655" y="272" class="boxh">块 5</text>
  <text x="655" y="296" class="row" text-anchor="middle">数据</text>
  <!-- 数据块 8 -->
  <rect x="760" y="246" width="130" height="78" rx="4" class="datab"/>
  <text x="825" y="272" class="boxh">块 8</text>
  <text x="825" y="296" class="row" text-anchor="middle">数据</text>

  <!-- 显式链接数据块链箭头 -->
  <line x1="190" y1="285" x2="248" y2="285" stroke="#475569" stroke-width="2" marker-end="url(#elk)"/>
  <line x1="380" y1="285" x2="418" y2="285" stroke="#94a3b8" stroke-width="2" marker-end="url(#elk)"/>
  <line x1="550" y1="285" x2="588" y2="285" stroke="#94a3b8" stroke-width="2" marker-end="url(#elk)"/>
  <line x1="720" y1="285" x2="758" y2="285" stroke="#94a3b8" stroke-width="2" marker-end="url(#elk)"/>

  <!-- FAT 表 -->
  <text x="480" y="356" class="boxh" fill="#1d4ed8">FAT（文件分配表）——指针集中存放</text>
  <rect x="250" y="368" width="460" height="200" rx="6" fill="#eff6ff" stroke="#2563eb" stroke-width="2"/>
  <rect x="260" y="378" width="220" height="34" class="fatch"/><text x="370" y="400" class="boxh" fill="#1d4ed8">块号</text>
  <rect x="480" y="378" width="220" height="34" class="fatch"/><text x="590" y="400" class="boxh" fill="#1d4ed8">下一块号</text>
  <line x1="260" y1="412" x2="700" y2="412" stroke="#93c5fd" stroke-width="1"/>
  <text x="370" y="446" class="row" text-anchor="middle">9</text><text x="590" y="446" class="row" text-anchor="middle">11</text>
  <line x1="260" y1="454" x2="700" y2="454" stroke="#dbeafe" stroke-width="1"/>
  <text x="370" y="480" class="row" text-anchor="middle">11</text><text x="590" y="480" class="row" text-anchor="middle">5</text>
  <line x1="260" y1="488" x2="700" y2="488" stroke="#dbeafe" stroke-width="1"/>
  <text x="370" y="514" class="row" text-anchor="middle">5</text><text x="590" y="514" class="row" text-anchor="middle">8</text>
  <line x1="260" y1="522" x2="700" y2="522" stroke="#dbeafe" stroke-width="1"/>
  <text x="370" y="556" class="row" text-anchor="middle">8</text><text x="590" y="556" class="row" text-anchor="middle">-1（EOF）</text>

  <text x="480" y="590" class="note">显式链接：所有指针集中在 FAT，目录项只记首块号；访问第 i 块时查 FAT 直接得到下一块地址 → 支持随机访问，FAT 需常驻内存或缓存</text>
</svg>`,
        },
        {
          id: 'kb-os-file-phys-8',
          type: 'callout',
          title: '隐式链接只能顺序访问',
          text: '只能按照磁盘块顺序依次访问，访问完了上一个才能访问下一个。',
          tone: 'orange',
        },
        {
          id: 'kb-os-file-phys-4',
          type: 'paragraph',
          text: '**索引分配**：为每个文件建一个**索引块**，索引块中存放该文件所有数据块的地址。访问第 i 块时先查索引块，支持**随机访问**。文件很大时可建**多级索引**（索引块里再放指向下一级索引块的指针）。缺点：索引块本身占额外空间。',
        },
        {
          id: 'kb-os-file-phys-5',
          type: 'paragraph',
          text: '**混合索引**（Unix 常用）：inode 中同时包含直接地址和间接地址。如 12 个**直接块**地址 + 1 个一级间接 + 1 个二级间接 + 1 个三级间接。小文件直接用直接块，开销小。大文件用间接块逐级扩展。这种设计兼顾小文件效率与大文件容量。',
        },
        {
          id: 'kb-os-file-phys-6',
          type: 'html',
          html: `<svg viewBox="0 0 920 460" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { font-family: system-ui, sans-serif; }
    .title { font-size: 15px; font-weight: 700; fill: #0f172a; text-anchor: middle; }
    .boxh  { font-size: 13px; font-weight: 700; fill: #0f172a; text-anchor: middle; }
    .row   { font-size: 12px; fill: #334155; text-anchor: middle; }
    .sub   { font-size: 11px; fill: #64748b; text-anchor: middle; }
    .note  { font-size: 12px; fill: #475569; text-anchor: middle; }
    .dir   { fill: #2563eb; }
    .ind1  { fill: #16a34a; }
    .ind2  { fill: #d97706; }
    .ind3  { fill: #7c3aed; }
    .data  { fill: #f1f5f9; stroke: #94a3b8; stroke-width: 1.5; }
  </style>
  <defs>
    <marker id="mx" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#475569"/></marker>
  </defs>

  <text x="460" y="24" class="title">混合索引：inode 中直接块 + 一级/二级/三级间接地址</text>

  <!-- inode -->
  <rect x="30" y="50" width="180" height="360" rx="6" fill="#eff6ff" stroke="#2563eb" stroke-width="2"/>
  <text x="120" y="72" class="boxh" fill="#1d4ed8">inode</text>
  <!-- 12 直接块 -->
  <g>
    <rect x="44" y="84" width="24" height="18" class="dir"/><text x="56" y="97" class="sub" fill="#ffffff" text-anchor="middle">0</text>
    <rect x="72" y="84" width="24" height="18" class="dir"/><text x="84" y="97" class="sub" fill="#ffffff" text-anchor="middle">1</text>
    <rect x="100" y="84" width="24" height="18" class="dir"/><text x="112" y="97" class="sub" fill="#ffffff" text-anchor="middle">2</text>
    <rect x="128" y="84" width="24" height="18" class="dir"/><text x="140" y="97" class="sub" fill="#ffffff" text-anchor="middle">3</text>
    <rect x="44" y="106" width="24" height="18" class="dir"/><text x="56" y="119" class="sub" fill="#ffffff" text-anchor="middle">4</text>
    <rect x="72" y="106" width="24" height="18" class="dir"/><text x="84" y="119" class="sub" fill="#ffffff" text-anchor="middle">5</text>
    <rect x="100" y="106" width="24" height="18" class="dir"/><text x="112" y="119" class="sub" fill="#ffffff" text-anchor="middle">6</text>
    <rect x="128" y="106" width="24" height="18" class="dir"/><text x="140" y="119" class="sub" fill="#ffffff" text-anchor="middle">7</text>
    <rect x="44" y="128" width="24" height="18" class="dir"/><text x="56" y="141" class="sub" fill="#ffffff" text-anchor="middle">8</text>
    <rect x="72" y="128" width="24" height="18" class="dir"/><text x="84" y="141" class="sub" fill="#ffffff" text-anchor="middle">9</text>
    <rect x="100" y="128" width="24" height="18" class="dir"/><text x="112" y="141" class="sub" fill="#ffffff" text-anchor="middle">10</text>
    <rect x="128" y="128" width="24" height="18" class="dir"/><text x="140" y="141" class="sub" fill="#ffffff" text-anchor="middle">11</text>
  </g>
  <text x="120" y="166" class="sub">直接块（12 个）</text>
  <line x1="44" y1="178" x2="196" y2="178" stroke="#93c5fd" stroke-width="1"/>
  <!-- 一级间接 -->
  <rect x="44" y="188" width="26" height="26" class="ind1"/><text x="57" y="205" class="sub" fill="#ffffff" text-anchor="middle">1</text>
  <text x="120" y="207" class="row" fill="#15803d" text-anchor="start">一级间接</text>
  <!-- 二级间接 -->
  <rect x="44" y="224" width="26" height="26" class="ind2"/><text x="57" y="241" class="sub" fill="#ffffff" text-anchor="middle">2</text>
  <text x="120" y="243" class="row" fill="#b45309" text-anchor="start">二级间接</text>
  <!-- 三级间接 -->
  <rect x="44" y="260" width="26" height="26" class="ind3"/><text x="57" y="277" class="sub" fill="#ffffff" text-anchor="middle">3</text>
  <text x="120" y="279" class="row" fill="#6d28d9" text-anchor="start">三级间接</text>

  <!-- 数据块：直接块指向 -->
  <g>
    <rect x="330" y="80" width="60" height="30" class="data"/><text x="360" y="99" class="sub" text-anchor="middle">数据块0</text>
    <rect x="330" y="120" width="60" height="30" class="data"/><text x="360" y="139" class="sub" text-anchor="middle">数据块11</text>
    <line x1="210" y1="93" x2="328" y2="93" stroke="#2563eb" stroke-width="1.6" marker-end="url(#mx)"/>
    <line x1="210" y1="137" x2="328" y2="135" stroke="#2563eb" stroke-width="1.6" marker-end="url(#mx)"/>
    <text x="270" y="170" class="sub">直接块：一次访盘定位</text>
  </g>

  <!-- 一级间接 -->
  <rect x="330" y="196" width="60" height="30" class="data" stroke="#16a34a" stroke-width="2"/>
  <text x="360" y="215" class="sub" text-anchor="middle">间接块1</text>
  <rect x="450" y="196" width="60" height="30" class="data"/><text x="480" y="215" class="sub" text-anchor="middle">数据块</text>
  <rect x="450" y="236" width="60" height="30" class="data"/><text x="480" y="255" class="sub" text-anchor="middle">数据块</text>
  <line x1="210" y1="201" x2="328" y2="211" stroke="#16a34a" stroke-width="1.6" marker-end="url(#mx)"/>
  <line x1="390" y1="211" x2="448" y2="211" stroke="#16a34a" stroke-width="1.4" marker-end="url(#mx)"/>
  <line x1="390" y1="224" x2="448" y2="246" stroke="#16a34a" stroke-width="1.4" marker-end="url(#mx)"/>
  <text x="540" y="215" class="sub" text-anchor="start">一级间接：两次访盘</text>

  <!-- 二级间接 -->
  <rect x="330" y="290" width="60" height="30" class="data" stroke="#d97706" stroke-width="2"/>
  <text x="360" y="309" class="sub" text-anchor="middle">间接块2</text>
  <rect x="450" y="290" width="60" height="30" class="data" stroke="#d97706" stroke-width="2"/>
  <text x="480" y="309" class="sub" text-anchor="middle">间接块</text>
  <rect x="580" y="290" width="60" height="30" class="data"/><text x="610" y="309" class="sub" text-anchor="middle">数据块</text>
  <line x1="210" y1="247" x2="328" y2="305" stroke="#d97706" stroke-width="1.6" marker-end="url(#mx)"/>
  <line x1="390" y1="305" x2="448" y2="305" stroke="#d97706" stroke-width="1.4" marker-end="url(#mx)"/>
  <line x1="510" y1="305" x2="578" y2="305" stroke="#d97706" stroke-width="1.4" marker-end="url(#mx)"/>
  <text x="540" y="270" class="sub" text-anchor="start">二级间接：三次访盘</text>

  <!-- 三级间接 -->
  <rect x="330" y="360" width="60" height="30" class="data" stroke="#7c3aed" stroke-width="2"/>
  <text x="360" y="379" class="sub" text-anchor="middle">间接块3</text>
  <rect x="450" y="360" width="60" height="30" class="data" stroke="#7c3aed" stroke-width="2"/>
  <text x="480" y="379" class="sub" text-anchor="middle">间接块</text>
  <rect x="580" y="360" width="60" height="30" class="data" stroke="#7c3aed" stroke-width="2"/>
  <text x="610" y="379" class="sub" text-anchor="middle">间接块</text>
  <rect x="710" y="360" width="60" height="30" class="data"/><text x="740" y="379" class="sub" text-anchor="middle">数据块</text>
  <line x1="210" y1="273" x2="328" y2="375" stroke="#7c3aed" stroke-width="1.6" marker-end="url(#mx)"/>
  <line x1="390" y1="375" x2="448" y2="375" stroke="#7c3aed" stroke-width="1.4" marker-end="url(#mx)"/>
  <line x1="510" y1="375" x2="578" y2="375" stroke="#7c3aed" stroke-width="1.4" marker-end="url(#mx)"/>
  <line x1="640" y1="375" x2="708" y2="375" stroke="#7c3aed" stroke-width="1.4" marker-end="url(#mx)"/>
  <text x="540" y="345" class="sub" text-anchor="start">三级间接：四次访盘</text>

  <text x="460" y="430" class="note">小文件只用到直接块，一次访盘；大文件逐级走间接块，访盘次数 = 间接级数 + 1</text>
  <text x="460" y="452" class="note">混合索引用少量间接指针支持超大文件，同时保证小文件访问开销最小</text>
</svg>`,
        },
        {
          id: 'kb-os-file-1-4',
          type: 'paragraph',
          text: '|  | 连续分配 | 链接分配 | 索引分配 |\n|---|---|---|---|\n| 访问方式 | 随机/顺序 | 顺序（隐式）/随机（显式） | 随机 |\n| 空间利用 | 有外部碎片 | 无外部碎片 | 无外部碎片 |\n| 增删记录 | 难 | 易 | 易 |\n| 额外开销 | 无 | 指针空间 | 索引块空间 |\n| 典型文件系统 | 早期 | FAT | ext、NTFS |',
        },
      ],
    },
  ],
}
