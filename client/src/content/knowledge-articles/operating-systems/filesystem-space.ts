import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const filesystemSpaceArticle: KnowledgeArticleData = {
  pointId: 'os-filesystem-space',
  subpoints: [
    {
      id: 'os-fs-space-overview',
      title: '外存空间管理的任务',
      blocks: [
        {
          id: 'kb-os-filesystem-2-1',
          type: 'paragraph',
          text: '**外存空间管理**跟踪哪些磁盘块空闲、哪些已分配。常用方法：\n\n- **空闲表**：记录连续空闲块区间的起始块号和长度，适合连续分配。\n- **空闲链表**：空闲块用指针链接。\n- **位示图**：每一位表示一个块空闲与否，节省空间、便于查找。\n- **成组链接法**：把空闲块分组链接，每组的头块记录下一组的块号，适合大容量磁盘，Unix 采用。',
        },
      ],
    },
    {
      id: 'os-fs-space-free-list',
      title: '空闲表法',
      blocks: [
        {
          id: 'kb-os-filesystem-free-list-1',
          type: 'paragraph',
          text: '**空闲表法**把空闲区间的**起始块号和长度**记录在一张表中，类似动态分区分配的空闲分区表。分配时在表中找一个长度合适的空闲区间。回收时把释放的块合并到相邻空闲区间并更新表。适合连续分配方式。',
        },
        {
          id: 'kb-os-filesystem-free-list-2',
          type: 'html',
          html: `<svg viewBox="0 0 680 320" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { font-family: system-ui, sans-serif; }
    .title { font-size: 15px; font-weight: 700; fill: #0f172a; text-anchor: middle; }
    .boxh  { font-size: 13px; font-weight: 700; fill: #0f172a; text-anchor: middle; }
    .row   { font-size: 12px; fill: #334155; text-anchor: middle; }
    .sub   { font-size: 11px; fill: #64748b; text-anchor: middle; }
    .note  { font-size: 12px; fill: #475569; text-anchor: middle; }
  </style>

  <text x="340" y="24" class="title">空闲表法：记录连续空闲区间的起始块号与长度</text>

  <!-- 空闲表 -->
  <rect x="40" y="50" width="200" height="150" rx="6" fill="#f8fafc" stroke="#334155" stroke-width="2"/>
  <text x="140" y="72" class="boxh">空闲表</text>
  <line x1="60" y1="82" x2="220" y2="82" stroke="#cbd5e1" stroke-width="1"/>
  <text x="96" y="104" class="row" fill="#64748b">起始块号　长度</text>
  <text x="140" y="130" class="row" text-anchor="middle">2　4</text>
  <text x="140" y="154" class="row" text-anchor="middle">10　3</text>
  <text x="140" y="178" class="row" text-anchor="middle">20　6</text>

  <!-- 磁盘块条 -->
  <text x="400" y="72" class="boxh">磁盘块</text>
  <!-- 块 0-1 占用 -->
  <rect x="300" y="88" width="34" height="34" fill="#334155"/>
  <text x="317" y="110" class="sub" fill="#ffffff" text-anchor="middle">0</text>
  <rect x="334" y="88" width="34" height="34" fill="#334155"/>
  <text x="351" y="110" class="sub" fill="#ffffff" text-anchor="middle">1</text>
  <!-- 块 2-5 空闲 -->
  <rect x="368" y="88" width="34" height="34" fill="#dbeafe" stroke="#2563eb" stroke-width="1.5"/>
  <text x="385" y="110" class="sub" fill="#1d4ed8" text-anchor="middle">2</text>
  <rect x="402" y="88" width="34" height="34" fill="#dbeafe" stroke="#2563eb" stroke-width="1.5"/>
  <text x="419" y="110" class="sub" fill="#1d4ed8" text-anchor="middle">3</text>
  <rect x="436" y="88" width="34" height="34" fill="#dbeafe" stroke="#2563eb" stroke-width="1.5"/>
  <text x="453" y="110" class="sub" fill="#1d4ed8" text-anchor="middle">4</text>
  <rect x="470" y="88" width="34" height="34" fill="#dbeafe" stroke="#2563eb" stroke-width="1.5"/>
  <text x="487" y="110" class="sub" fill="#1d4ed8" text-anchor="middle">5</text>
  <!-- 块 6-9 占用 -->
  <rect x="504" y="88" width="34" height="34" fill="#334155"/>
  <text x="521" y="110" class="sub" fill="#ffffff" text-anchor="middle">6</text>
  <rect x="538" y="88" width="34" height="34" fill="#334155"/>
  <text x="555" y="110" class="sub" fill="#ffffff" text-anchor="middle">7</text>
  <rect x="572" y="88" width="34" height="34" fill="#334155"/>
  <text x="589" y="110" class="sub" fill="#ffffff" text-anchor="middle">8</text>
  <rect x="606" y="88" width="34" height="34" fill="#334155"/>
  <text x="623" y="110" class="sub" fill="#ffffff" text-anchor="middle">9</text>

  <!-- 图例 -->
  <rect x="340" y="140" width="18" height="18" fill="#dbeafe" stroke="#2563eb" stroke-width="1.5"/>
  <text x="366" y="154" class="sub" text-anchor="start">空闲块</text>
  <rect x="430" y="140" width="18" height="18" fill="#334155"/>
  <text x="456" y="154" class="sub" text-anchor="start">占用块</text>

  <text x="340" y="240" class="note">空闲表第 1 项"起始 2、长度 4"对应磁盘块 2~5 这段连续空闲区间</text>
  <text x="340" y="262" class="note">分配：在表中找长度合适的空闲区间；回收：合并相邻空闲区间后更新表</text>
  <text x="340" y="284" class="note">适合连续分配方式，能反映连续空闲区，但表需要维护</text>
</svg>`,
        },
      ],
    },
    {
      id: 'os-fs-space-free-chain',
      title: '空闲链表法',
      blocks: [
        {
          id: 'kb-os-filesystem-free-chain-1',
          type: 'paragraph',
          text: '**空闲链表法**把所有空闲块用指针**链接成一条链表**，链头记录第一个空闲块。分配时从链头取出若干空闲块。回收时把释放的块挂回链表。实现简单，但查找和分配需要遍历链表，效率较低。',
        },
        {
          id: 'kb-os-filesystem-free-chain-2',
          type: 'html',
          html: `<svg viewBox="0 0 680 320" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { font-family: system-ui, sans-serif; }
    .title { font-size: 15px; font-weight: 700; fill: #0f172a; text-anchor: middle; }
    .boxh  { font-size: 13px; font-weight: 700; fill: #0f172a; text-anchor: middle; }
    .row   { font-size: 12px; fill: #334155; text-anchor: middle; }
    .sub   { font-size: 11px; fill: #64748b; text-anchor: middle; }
    .note  { font-size: 12px; fill: #475569; text-anchor: middle; }
  </style>
  <defs>
    <marker id="fc" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#2563eb"/></marker>
  </defs>

  <text x="340" y="24" class="title">空闲链表法：空闲块用指针链接成链</text>

  <!-- 链头 -->
  <rect x="40" y="110" width="120" height="52" rx="6" fill="#f8fafc" stroke="#334155" stroke-width="2"/>
  <text x="100" y="132" class="boxh">链头指针</text>
  <text x="100" y="152" class="row" fill="#2563eb">→ 块 2</text>

  <!-- 空闲块 2 -->
  <rect x="210" y="96" width="90" height="80" rx="6" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/>
  <text x="255" y="120" class="boxh" fill="#1d4ed8">空闲块 2</text>
  <text x="255" y="146" class="row" fill="#1d4ed8">下一块：5</text>

  <!-- 空闲块 5 -->
  <rect x="340" y="96" width="90" height="80" rx="6" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/>
  <text x="385" y="120" class="boxh" fill="#1d4ed8">空闲块 5</text>
  <text x="385" y="146" class="row" fill="#1d4ed8">下一块：9</text>

  <!-- 空闲块 9 -->
  <rect x="470" y="96" width="90" height="80" rx="6" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/>
  <text x="515" y="120" class="boxh" fill="#1d4ed8">空闲块 9</text>
  <text x="515" y="146" class="row" fill="#1d4ed8">下一块：空</text>

  <!-- 箭头 -->
  <path d="M 160 136 L 208 136" stroke="#2563eb" stroke-width="2" fill="none" marker-end="url(#fc)"/>
  <path d="M 300 136 L 338 136" stroke="#2563eb" stroke-width="2" fill="none" marker-end="url(#fc)"/>
  <path d="M 430 136 L 468 136" stroke="#2563eb" stroke-width="2" fill="none" marker-end="url(#fc)"/>

  <text x="340" y="240" class="note">链头指向第一个空闲块，每个空闲块内保存下一空闲块地址，最后一个指向空</text>
  <text x="340" y="262" class="note">分配：从链头取块；回收：把块挂到链头</text>
  <text x="340" y="284" class="note">实现简单，但查找/分配需遍历，效率低</text>
</svg>`,
        },
      ],
    },
    {
      id: 'os-fs-space-bitmap',
      title: '位示图法',
      blocks: [
        {
          id: 'kb-os-filesystem-bitmap-1',
          type: 'paragraph',
          text: String.raw`**位示图法**用一个**位串**表示所有磁盘块：每一位对应一个块，1 表示已分配、0 表示空闲。位示图按“字”组织，字中的位号与磁盘块号按固定公式换算，如 $\text{块号} = \text{字号} \times \text{字长} + \text{位号}$。位示图占用空间小、查找空闲块快，是实际系统常用方法。`,
        },
        {
          id: 'kb-os-filesystem-bitmap-2',
          type: 'html',
          html: `<svg viewBox="0 0 680 340" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { font-family: system-ui, sans-serif; }
    .title { font-size: 15px; font-weight: 700; fill: #0f172a; text-anchor: middle; }
    .boxh  { font-size: 13px; font-weight: 700; fill: #0f172a; text-anchor: middle; }
    .row   { font-size: 12px; fill: #334155; text-anchor: middle; }
    .sub   { font-size: 11px; fill: #64748b; text-anchor: middle; }
    .note  { font-size: 12px; fill: #475569; text-anchor: middle; }
    .one   { fill: #334155; }
    .zero  { fill: #dbeafe; stroke: #2563eb; stroke-width: 1.5; }
  </style>

  <text x="340" y="24" class="title">位示图法：每一位表示一个磁盘块的空闲/占用</text>

  <!-- 位示图 4 字 × 8 位 -->
  <text x="180" y="56" class="boxh">位示图（字 0 ~ 字 3）</text>
  <g>
    <!-- 字 0 -->
    <rect x="60"  y="70" width="30" height="30" class="one"/><text x="75" y="90" class="sub" fill="#ffffff" text-anchor="middle">1</text>
    <rect x="90"  y="70" width="30" height="30" class="one"/><text x="105" y="90" class="sub" fill="#ffffff" text-anchor="middle">1</text>
    <rect x="120" y="70" width="30" height="30" class="zero"/><text x="135" y="90" class="sub" fill="#1d4ed8" text-anchor="middle">0</text>
    <rect x="150" y="70" width="30" height="30" class="zero"/><text x="165" y="90" class="sub" fill="#1d4ed8" text-anchor="middle">0</text>
    <rect x="180" y="70" width="30" height="30" class="zero"/><text x="195" y="90" class="sub" fill="#1d4ed8" text-anchor="middle">0</text>
    <rect x="210" y="70" width="30" height="30" class="one"/><text x="225" y="90" class="sub" fill="#ffffff" text-anchor="middle">1</text>
    <rect x="240" y="70" width="30" height="30" class="one"/><text x="255" y="90" class="sub" fill="#ffffff" text-anchor="middle">1</text>
    <rect x="270" y="70" width="30" height="30" class="zero"/><text x="285" y="90" class="sub" fill="#1d4ed8" text-anchor="middle">0</text>
    <!-- 字 1 -->
    <rect x="60"  y="106" width="30" height="30" class="zero"/><text x="75" y="126" class="sub" fill="#1d4ed8" text-anchor="middle">0</text>
    <rect x="90"  y="106" width="30" height="30" class="one"/><text x="105" y="126" class="sub" fill="#ffffff" text-anchor="middle">1</text>
    <rect x="120" y="106" width="30" height="30" class="one"/><text x="135" y="126" class="sub" fill="#ffffff" text-anchor="middle">1</text>
    <rect x="150" y="106" width="30" height="30" class="zero"/><text x="165" y="126" class="sub" fill="#1d4ed8" text-anchor="middle">0</text>
    <rect x="180" y="106" width="30" height="30" class="zero"/><text x="195" y="126" class="sub" fill="#1d4ed8" text-anchor="middle">0</text>
    <rect x="210" y="106" width="30" height="30" class="zero"/><text x="225" y="126" class="sub" fill="#1d4ed8" text-anchor="middle">0</text>
    <rect x="240" y="106" width="30" height="30" class="one"/><text x="255" y="126" class="sub" fill="#ffffff" text-anchor="middle">1</text>
    <rect x="270" y="106" width="30" height="30" class="zero"/><text x="285" y="126" class="sub" fill="#1d4ed8" text-anchor="middle">0</text>
    <!-- 字 2 -->
    <rect x="60"  y="142" width="30" height="30" class="zero"/><text x="75" y="162" class="sub" fill="#1d4ed8" text-anchor="middle">0</text>
    <rect x="90"  y="142" width="30" height="30" class="zero"/><text x="105" y="162" class="sub" fill="#1d4ed8" text-anchor="middle">0</text>
    <rect x="120" y="142" width="30" height="30" class="one"/><text x="135" y="162" class="sub" fill="#ffffff" text-anchor="middle">1</text>
    <rect x="150" y="142" width="30" height="30" class="zero"/><text x="165" y="162" class="sub" fill="#1d4ed8" text-anchor="middle">0</text>
    <rect x="180" y="142" width="30" height="30" class="zero"/><text x="195" y="162" class="sub" fill="#1d4ed8" text-anchor="middle">0</text>
    <rect x="210" y="142" width="30" height="30" class="zero"/><text x="225" y="162" class="sub" fill="#1d4ed8" text-anchor="middle">0</text>
    <rect x="240" y="142" width="30" height="30" class="zero"/><text x="255" y="162" class="sub" fill="#1d4ed8" text-anchor="middle">0</text>
    <rect x="270" y="142" width="30" height="30" class="zero"/><text x="285" y="162" class="sub" fill="#1d4ed8" text-anchor="middle">0</text>
    <!-- 字 3 -->
    <rect x="60"  y="178" width="30" height="30" class="zero"/><text x="75" y="198" class="sub" fill="#1d4ed8" text-anchor="middle">0</text>
    <rect x="90"  y="178" width="30" height="30" class="zero"/><text x="105" y="198" class="sub" fill="#1d4ed8" text-anchor="middle">0</text>
    <rect x="120" y="178" width="30" height="30" class="zero"/><text x="135" y="198" class="sub" fill="#1d4ed8" text-anchor="middle">0</text>
    <rect x="150" y="178" width="30" height="30" class="zero"/><text x="165" y="198" class="sub" fill="#1d4ed8" text-anchor="middle">0</text>
    <rect x="180" y="178" width="30" height="30" class="zero"/><text x="195" y="198" class="sub" fill="#1d4ed8" text-anchor="middle">0</text>
    <rect x="210" y="178" width="30" height="30" class="zero"/><text x="225" y="198" class="sub" fill="#1d4ed8" text-anchor="middle">0</text>
    <rect x="240" y="178" width="30" height="30" class="zero"/><text x="255" y="198" class="sub" fill="#1d4ed8" text-anchor="middle">0</text>
    <rect x="270" y="178" width="30" height="30" class="zero"/><text x="285" y="198" class="sub" fill="#1d4ed8" text-anchor="middle">0</text>
  </g>

  <!-- 换算公式 -->
  <rect x="360" y="70" width="270" height="90" rx="6" fill="#f8fafc" stroke="#334155" stroke-width="1.5"/>
  <text x="495" y="96" class="row" text-anchor="middle">块号 = 字号 × 字长 + 位号</text>
  <text x="495" y="120" class="sub" text-anchor="middle">如字 1 位 2 → 块号 = 1×8 + 2 = 10</text>
  <text x="495" y="144" class="sub" text-anchor="middle">该位为 0 → 块 10 空闲</text>

  <text x="340" y="250" class="note">深色 = 1（已分配），浅色 = 0（空闲）</text>
  <text x="340" y="272" class="note">分配：找为 0 的位，换算成块号分配，并置 1；回收：置 0</text>
  <text x="340" y="294" class="note">占用空间小、查找快，是实际系统常用方法</text>
</svg>`,
        },
      ],
    },
    {
      id: 'os-fs-space-group',
      title: '成组链接法',
      blocks: [
        {
          id: 'kb-os-filesystem-group-1',
          type: 'paragraph',
          text: '**成组链接法**把空闲块分成若干**组**，每组第一块记录本组空闲块数、块号以及**下一组的块号**，超级块用一个**空闲栈**记录第一组的空闲块号。\n\n- 分配时从栈顶取块；栈空则把当前组头块读入，用其中记录的下一组信息重建栈。\n- 回收时块号压栈；栈满则把栈内容写入一个新块形成新组。\n\n适合大容量磁盘，Unix 采用。',
        },
        {
          id: 'kb-os-filesystem-group-2',
          type: 'html',
          html: `<svg viewBox="0 0 800 330" xmlns="http://www.w3.org/2000/svg" style="display:block;width:min(100%,800px);height:auto;margin-inline:auto">
  <style>
    text { font-family: system-ui, sans-serif; }
    .title { font-size: 15px; font-weight: 700; fill: #0f172a; text-anchor: middle; }
    .boxh  { font-size: 13px; font-weight: 700; fill: #0f172a; text-anchor: middle; }
    .row   { font-size: 12px; fill: #334155; text-anchor: middle; }
    .cnt   { font-size: 12px; font-weight: 700; fill: #1d4ed8; text-anchor: middle; }
    .next  { font-size: 13px; font-weight: 800; fill: #b45309; text-anchor: middle; }
    .free  { font-size: 12px; fill: #334155; text-anchor: middle; }
    .note  { font-size: 12px; fill: #475569; text-anchor: middle; }
    .blk   { font-size: 12px; font-weight: 700; fill: #047857; text-anchor: middle; }
  </style>
  <defs>
    <marker id="gr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#2563eb"/></marker>
    <marker id="gr2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#d97706"/></marker>
    <marker id="gr3" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#059669"/></marker>
  </defs>

  <text x="400" y="24" class="title">成组链接法：内存空闲栈记录本组空闲盘块并指向组头块，组头块依次指向下一组</text>

  <!-- 内存·超级块空闲栈（n 行 1 列数组） -->
  <rect x="40" y="70" width="130" height="140" rx="6" fill="#eff6ff" stroke="#2563eb" stroke-width="2"/>
  <text x="105" y="60" class="boxh" fill="#1d4ed8">内存·空闲栈</text>
  <rect x="50" y="78" width="110" height="28" rx="3" fill="#dbeafe"/>
  <text x="105" y="97" class="cnt">空闲块数 = 3</text>
  <rect x="50" y="110" width="110" height="28" rx="3" fill="#fff7ed" stroke="#fdba74" stroke-width="1.5"/>
  <text x="105" y="129" class="next">2 → 下一组</text>
  <rect x="50" y="142" width="110" height="28" rx="3" fill="#ffffff"/>
  <text x="105" y="161" class="free">块 1</text>
  <rect x="50" y="174" width="110" height="28" rx="3" fill="#ffffff"/>
  <text x="105" y="193" class="free">块 4</text>

  <!-- 栈中块号对应的磁盘实际空闲盘块 1、4 -->
  <rect x="181" y="142" width="55" height="28" rx="3" fill="#ecfdf5" stroke="#059669" stroke-width="1.5"/>
  <text x="208" y="161" class="blk">空闲块 1</text>
  <rect x="181" y="174" width="55" height="28" rx="3" fill="#ecfdf5" stroke="#059669" stroke-width="1.5"/>
  <text x="208" y="193" class="blk">空闲块 4</text>

  <!-- 2 号盘块（组头块，n 行 1 列） -->
  <rect x="240" y="70" width="130" height="140" rx="6" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
  <text x="305" y="60" class="boxh" fill="#b45309">2 号盘块</text>
  <rect x="250" y="78" width="110" height="28" rx="3" fill="#fde68a"/>
  <text x="305" y="97" class="cnt" fill="#b45309">空闲块数 = 3</text>
  <rect x="250" y="110" width="110" height="28" rx="3" fill="#fff7ed" stroke="#fdba74" stroke-width="1.5"/>
  <text x="305" y="129" class="next">9 → 下一组</text>
  <rect x="250" y="142" width="110" height="28" rx="3" fill="#ffffff"/>
  <text x="305" y="161" class="free">块 5</text>
  <rect x="250" y="174" width="110" height="28" rx="3" fill="#ffffff"/>
  <text x="305" y="193" class="free">块 6</text>

  <!-- 9 号盘块（组头块） -->
  <rect x="440" y="70" width="130" height="140" rx="6" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
  <text x="505" y="60" class="boxh" fill="#b45309">9 号盘块</text>
  <rect x="450" y="78" width="110" height="28" rx="3" fill="#fde68a"/>
  <text x="505" y="97" class="cnt" fill="#b45309">空闲块数 = 2</text>
  <rect x="450" y="110" width="110" height="28" rx="3" fill="#fff7ed" stroke="#fdba74" stroke-width="1.5"/>
  <text x="505" y="129" class="next">13 → 下一组</text>
  <rect x="450" y="142" width="110" height="28" rx="3" fill="#ffffff"/>
  <text x="505" y="161" class="free">块 10</text>
  <rect x="450" y="174" width="110" height="28" rx="3" fill="#ffffff"/>
  <text x="505" y="193" class="free">块 11</text>

  <!-- 13 号盘块（组头块，末组） -->
  <rect x="640" y="70" width="130" height="140" rx="6" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
  <text x="705" y="60" class="boxh" fill="#b45309">13 号盘块</text>
  <rect x="650" y="78" width="110" height="28" rx="3" fill="#fde68a"/>
  <text x="705" y="97" class="cnt" fill="#b45309">空闲块数 = 2</text>
  <rect x="650" y="110" width="110" height="28" rx="3" fill="#f1f5f9"/>
  <text x="705" y="129" class="next" fill="#94a3b8">0（无下一组）</text>
  <rect x="650" y="142" width="110" height="28" rx="3" fill="#ffffff"/>
  <text x="705" y="161" class="free">块 14</text>
  <rect x="650" y="174" width="110" height="28" rx="3" fill="#ffffff"/>
  <text x="705" y="193" class="free">块 15</text>

  <!-- 箭头：栈"2"→2 号盘块整体；栈"块1/块4"→磁盘实际空闲盘块；2 号"9"→9 号盘块；9 号"13"→13 号盘块 -->
  <path d="M 160 124 L 238 124" stroke="#2563eb" stroke-width="2.5" fill="none" marker-end="url(#gr)"/>
  <path d="M 160 156 L 179 156" stroke="#059669" stroke-width="2.5" fill="none" marker-end="url(#gr3)"/>
  <path d="M 160 188 L 179 188" stroke="#059669" stroke-width="2.5" fill="none" marker-end="url(#gr3)"/>
  <path d="M 370 124 L 438 124" stroke="#d97706" stroke-width="2.5" fill="none" marker-end="url(#gr2)"/>
  <path d="M 570 124 L 638 124" stroke="#d97706" stroke-width="2.5" fill="none" marker-end="url(#gr2)"/>

  <text x="400" y="252" class="note">内存空闲栈：首格记当前组空闲块数，其余格记本组空闲盘块号；块 1、块 4 指向磁盘上可直接取用的实际空闲块，块 2 是下一组组头块</text>
  <text x="400" y="274" class="note">每个组头块（2、9、13 号盘块）同样：首格记本组空闲块数，第二格记再下一组的盘块号，环环相扣成链</text>
  <text x="400" y="296" class="note">末组组头块第二格为 0，表示链到此结束；回收空闲块压回栈，栈满则写入新盘块作新组头块续链</text>
</svg>`,
        },
      ],
    },
    {
      id: 'os-fs-space-summary',
      title: '方法对比与一致性',
      blocks: [
        {
          id: 'kb-os-filesystem-2-2',
          type: 'paragraph',
          text: '| 方法 | 原理 | 优点 | 缺点 |\n|---|---|---|---|\n| 空闲表 | 连续区间表 | 适合连续分配 | 分配/回收需维护表 |\n| 空闲链表 | 空闲块指针链接 | 简单 | 查找慢 |\n| 位示图 | 每块一位 | 省空间、查找快 | 大磁盘位图也大 |\n| 成组链接 | 分组 + 组头指针 | 高效、省内存 | 实现复杂 |',
        },
        {
          id: 'kb-os-filesystem-2-3',
          type: 'paragraph',
          text: '**文件系统的一致性**：系统崩溃可能导致位示图与目录不一致。**一致性检查**（如 fsck）比较目录中的分配情况与位示图，修复不一致。现代文件系统用**日志**（journal）或**写时复制**（CoW）保证一致性。',
        },
      ],
    },
  ],
}
