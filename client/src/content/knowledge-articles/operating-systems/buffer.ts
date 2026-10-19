import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const bufferArticle: KnowledgeArticleData = {
  pointId: 'os-buffer',
  subpoints: [
    {
      id: 'os-buffer-basic',
      title: '缓冲的基本概念',
      blocks: [
        {
          id: 'kb-os-buffer-1-1',
          type: 'paragraph',
          text: '**缓冲**用于缓和 CPU 与 I/O 速度不匹配的矛盾，也用于减少 I/O 次数、提高设备利用率。\n\n缓冲区是内存中的一块区域，数据先暂存在缓冲区，再送往目的地。\n\n常用的缓冲结构有单缓冲、双缓冲、循环缓冲和缓冲池。',
        },
        
      ],
    },
    {
      id: 'os-buffer-single-double',
      title: '单缓冲与双缓冲',
      blocks: [
        {
          id: 'kb-os-buffer-2-1',
          type: 'paragraph',
          text: '**单缓冲**：系统只设置一个缓冲区。外设把数据读入缓冲区（T），再从缓冲区送入用户工作区（M），最后用户处理（C）。T 和 M 不能并行（缓冲区只有一个），但下一块的 T 可与当前块的 C 并行。每块的处理时间约为 $Max(C,T)+M$。',
        },
        {
          id: 'kb-os-buffer-2-7',
          type: 'html',
          html: `<svg viewBox="0 0 900 300" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { font-family: system-ui, sans-serif; }
    .title { font-size: 15px; font-weight: 700; fill: #0f172a; text-anchor: middle; }
    .lbl   { font-size: 12px; font-weight: 700; fill: #334155; }
    .tname { font-size: 11px; font-weight: 700; text-anchor: middle; }
    .note  { font-size: 12px; fill: #475569; text-anchor: middle; }
    .tick  { font-size: 10px; fill: #94a3b8; text-anchor: middle; }
    .t { fill: #dbeafe; stroke: #2563eb; stroke-width: 1.3; }
    .m { fill: #fef3c7; stroke: #d97706; stroke-width: 1.3; }
    .c { fill: #dcfce7; stroke: #16a34a; stroke-width: 1.3; }
  </style>
  <defs>
    <marker id="taxs" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#94a3b8"/></marker>
    <marker id="yups" viewBox="0 0 10 10" refX="5" refY="10" markerWidth="8" markerHeight="8" orient="0"><path d="M0,10 L5,0 L10,10 Z" fill="#94a3b8"/></marker>
  </defs>

  <text x="450" y="22" class="title">单缓冲时间轴（T：设备→缓冲区，M：缓冲区→工作区，C：CPU 处理）</text>

  <!-- 纵坐标：从横轴起点(180)向上，箭头朝上 -->
  <line x1="180" y1="244" x2="180" y2="66" stroke="#94a3b8" stroke-width="1.5" marker-end="url(#yups)"/>

  <!-- T 行（最上面） -->
  <text x="96" y="96" class="lbl" text-anchor="end">T（设备→缓冲）</text>
  <rect x="180" y="72" width="136" height="34" class="t"/><text x="248" y="96" class="tname" fill="#1d4ed8">T1</text>
  <rect x="384" y="72" width="136" height="34" class="t"/><text x="452" y="96" class="tname" fill="#1d4ed8">T2</text>
  <rect x="588" y="72" width="136" height="34" class="t"/><text x="656" y="96" class="tname" fill="#1d4ed8">T3</text>

  <!-- M 行 -->
  <text x="96" y="156" class="lbl" text-anchor="end">M（缓冲→工作区）</text>
  <rect x="316" y="132" width="68" height="34" class="m"/><text x="350" y="156" class="tname" fill="#b45309">M1</text>
  <rect x="520" y="132" width="68" height="34" class="m"/><text x="554" y="156" class="tname" fill="#b45309">M2</text>
  <rect x="724" y="132" width="68" height="34" class="m"/><text x="758" y="156" class="tname" fill="#b45309">M3</text>

  <!-- C 行 -->
  <text x="96" y="216" class="lbl" text-anchor="end">C（CPU）</text>
  <rect x="384" y="192" width="68" height="34" class="c"/><text x="418" y="216" class="tname" fill="#15803d">C1</text>
  <rect x="588" y="192" width="68" height="34" class="c"/><text x="622" y="216" class="tname" fill="#15803d">C2</text>
  <rect x="792" y="192" width="68" height="34" class="c"/><text x="826" y="216" class="tname" fill="#15803d">C3</text>

  <!-- 横轴 -->
  <line x1="180" y1="244" x2="860" y2="244" stroke="#94a3b8" stroke-width="1.5" marker-end="url(#taxs)"/>
  <g>
    <text x="180" y="262" class="tick">0</text>
    <text x="248" y="262" class="tick">1</text>
    <text x="316" y="262" class="tick">2</text>
    <text x="384" y="262" class="tick">3</text>
    <text x="452" y="262" class="tick">4</text>
    <text x="520" y="262" class="tick">5</text>
    <text x="588" y="262" class="tick">6</text>
    <text x="656" y="262" class="tick">7</text>
    <text x="724" y="262" class="tick">8</text>
    <text x="792" y="262" class="tick">9</text>
    <text x="860" y="262" class="tick">10</text>
  </g>

  <text x="450" y="288" class="note">单缓冲：每块周期 Max(C,T)+M——T、M 串行，下一块的 T 与当前块的 C 并行</text>
</svg>`,
        },
        {
          id: 'kb-os-buffer-2-2',
          type: 'paragraph',
          text: '**双缓冲**：设置两个缓冲区，一个被外设填入（T）时，另一个可同时被搬入用户区并处理（M+C）。T 与 M+C 完全并行，每块的处理时间约为 $MAX(T,C+M)$。双缓冲比单缓冲快，适合对实时性要求高的场合。',
        },
        {
          id: 'kb-os-buffer-2-3',
          type: 'html',
          html: `<svg viewBox="0 0 900 340" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { font-family: system-ui, sans-serif; }
    .title { font-size: 15px; font-weight: 700; fill: #0f172a; text-anchor: middle; }
    .lbl   { font-size: 12px; font-weight: 700; fill: #334155; }
    .tname { font-size: 11px; font-weight: 700; text-anchor: middle; }
    .note  { font-size: 12px; fill: #475569; text-anchor: middle; }
    .tick  { font-size: 10px; fill: #94a3b8; text-anchor: middle; }
    .t { fill: #dbeafe; stroke: #2563eb; stroke-width: 1.3; }
    .m { fill: #fef3c7; stroke: #d97706; stroke-width: 1.3; }
    .c { fill: #dcfce7; stroke: #16a34a; stroke-width: 1.3; }
  </style>
  <defs>
    <marker id="taxd" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#94a3b8"/></marker>
    <marker id="yupd" viewBox="0 0 10 10" refX="5" refY="10" markerWidth="8" markerHeight="8" orient="0"><path d="M0,10 L5,0 L10,10 Z" fill="#94a3b8"/></marker>
  </defs>

  <text x="450" y="22" class="title">双缓冲时间轴（T：设备→缓冲区，M：缓冲区→工作区，C：CPU 处理）</text>

  <!-- 纵坐标：从横轴起点(180)向上，箭头朝上 -->
  <line x1="180" y1="290" x2="180" y2="60" stroke="#94a3b8" stroke-width="1.5" marker-end="url(#yupd)"/>

  <!-- 缓冲区 1 行 -->
  <text x="96" y="92" class="lbl" text-anchor="end">缓冲区1</text>
  <rect x="180" y="68" width="136" height="36" class="t"/><text x="248" y="92" class="tname" fill="#1d4ed8">T1</text>
  <rect x="452" y="68" width="136" height="36" class="t"/><text x="520" y="92" class="tname" fill="#1d4ed8">T3</text>

  <!-- 缓冲区 2 行 -->
  <text x="96" y="152" class="lbl" text-anchor="end">缓冲区2</text>
  <rect x="316" y="128" width="136" height="36" class="t"/><text x="384" y="152" class="tname" fill="#1d4ed8">T2</text>
  <rect x="588" y="128" width="136" height="36" class="t"/><text x="656" y="152" class="tname" fill="#1d4ed8">T4</text>

  <!-- M 行 -->
  <text x="96" y="212" class="lbl" text-anchor="end">M（缓冲→工作区）</text>
  <rect x="316" y="188" width="68" height="36" class="m"/><text x="350" y="212" class="tname" fill="#b45309">M1</text>
  <rect x="452" y="188" width="68" height="36" class="m"/><text x="486" y="212" class="tname" fill="#b45309">M2</text>
  <rect x="588" y="188" width="68" height="36" class="m"/><text x="622" y="212" class="tname" fill="#b45309">M3</text>
  <rect x="724" y="188" width="68" height="36" class="m"/><text x="758" y="212" class="tname" fill="#b45309">M4</text>

  <!-- C 行 -->
  <text x="96" y="272" class="lbl" text-anchor="end">C（CPU）</text>
  <rect x="384" y="248" width="68" height="36" class="c"/><text x="418" y="272" class="tname" fill="#15803d">C1</text>
  <rect x="520" y="248" width="68" height="36" class="c"/><text x="554" y="272" class="tname" fill="#15803d">C2</text>
  <rect x="656" y="248" width="68" height="36" class="c"/><text x="690" y="272" class="tname" fill="#15803d">C3</text>
  <rect x="792" y="248" width="68" height="36" class="c"/><text x="826" y="272" class="tname" fill="#15803d">C4</text>

  <!-- 横轴 -->
  <line x1="180" y1="290" x2="860" y2="290" stroke="#94a3b8" stroke-width="1.5" marker-end="url(#taxd)"/>
  <g>
    <text x="180" y="308" class="tick">0</text>
    <text x="248" y="308" class="tick">1</text>
    <text x="316" y="308" class="tick">2</text>
    <text x="384" y="308" class="tick">3</text>
    <text x="452" y="308" class="tick">4</text>
    <text x="520" y="308" class="tick">5</text>
    <text x="588" y="308" class="tick">6</text>
    <text x="656" y="308" class="tick">7</text>
    <text x="724" y="308" class="tick">8</text>
    <text x="792" y="308" class="tick">9</text>
    <text x="860" y="308" class="tick">10</text>
  </g>

  <text x="450" y="332" class="note">双缓冲：每块周期 MAX(T,C+M)——两个缓冲区交替，一个被 T 填入时另一个被 M+C 处理</text>
</svg>`,
        },
        {
          id: 'kb-os-buffer-2-8',
          type: 'callout',
          title: '画时间轴图的要点',
          text: '① T 和 M 不能并行：把数据读入缓冲区的同时，不能从里面取数据。② M 和 C 不能并行：CPU 不能一边从缓冲区搬数据、一边分析数据。③ 缓冲区的数据必须取完了才能再使用（同一个缓冲区不能同时读写）。④ T 和 C 可以并行：可以一边分析数据，一边让设备往缓冲区输送数据。',
          tone: 'orange',
        },
        {
          id: 'kb-os-buffer-2-4',
          type: 'html',
          html: `<svg viewBox="0 0 760 250" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { font-family: system-ui, sans-serif; }
    .title { font-size: 15px; font-weight: 700; fill: #0f172a; text-anchor: middle; }
    .lbl   { font-size: 14px; font-weight: 700; fill: #0f172a; text-anchor: middle; }
    .bufe   { font-size: 12px; font-weight: 700; fill: #1d4ed8; text-anchor: middle; }
    .sub   { font-size: 11px; fill: #64748b; text-anchor: middle; }
    .note  { font-size: 12px; fill: #475569; text-anchor: middle; }
    .host  { fill: #ffffff; stroke: #334155; stroke-width: 2; }
    .buff  { fill: #dbeafe; stroke: #2563eb; stroke-width: 2; }
  </style>
  <defs>
    <marker id="sbx" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 Z" fill="#2563eb"/></marker>
  </defs>

  <text x="380" y="24" class="title">单缓冲：两台主机各一个缓冲区，连线双向，但同一时刻只能一个方向</text>

  <!-- 主机 A -->
  <rect x="40" y="60" width="260" height="130" rx="8" class="host"/>
  <text x="170" y="84" class="lbl">主机 A</text>
  <rect x="100" y="104" width="140" height="50" rx="6" class="buff"/>
  <text x="170" y="126" class="bufe">缓冲区</text>
  <text x="170" y="144" class="sub">（收发共用）</text>

  <!-- 主机 B -->
  <rect x="460" y="60" width="260" height="130" rx="8" class="host"/>
  <text x="590" y="84" class="lbl">主机 B</text>
  <rect x="520" y="104" width="140" height="50" rx="6" class="buff"/>
  <text x="590" y="126" class="bufe">缓冲区</text>
  <text x="590" y="144" class="sub">（收发共用）</text>

  <!-- 双向箭头：起点是 A 的缓冲区右边缘，终点是 B 的缓冲区左边缘 -->
  <line x1="240" y1="129" x2="520" y2="129" stroke="#2563eb" stroke-width="2.5" marker-start="url(#sbx)" marker-end="url(#sbx)"/>
  <text x="380" y="118" class="sub" fill="#1d4ed8">双向：A 放 ↔ B 取</text>

  <text x="380" y="226" class="note">两台主机都能发送和接收，但只有一个缓冲区：A 发时必须等 B 取走，B 发时必须等 A 取走——同一时刻只能一个方向，必须交替</text>
</svg>`,
        },
        {
          id: 'kb-os-buffer-2-5',
          type: 'html',
          html: `<svg viewBox="0 0 760 300" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { font-family: system-ui, sans-serif; }
    .title { font-size: 15px; font-weight: 700; fill: #0f172a; text-anchor: middle; }
    .lbl   { font-size: 14px; font-weight: 700; fill: #0f172a; text-anchor: middle; }
    .bname { font-size: 11px; font-weight: 700; text-anchor: middle; }
    .sub   { font-size: 11px; fill: #64748b; text-anchor: middle; }
    .note  { font-size: 12px; fill: #475569; text-anchor: middle; }
    .host  { fill: #ffffff; stroke: #334155; stroke-width: 2; }
    .send  { fill: #dbeafe; stroke: #2563eb; stroke-width: 2; }
    .recv  { fill: #dcfce7; stroke: #16a34a; stroke-width: 2; }
  </style>
  <defs>
    <marker id="d1x" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 Z" fill="#2563eb"/></marker>
    <marker id="d2x" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 Z" fill="#16a34a"/></marker>
  </defs>

  <text x="380" y="24" class="title">双缓冲：A 的发送缓冲与 B 的接收缓冲对接，B 的发送缓冲与 A 的接收缓冲对接</text>

  <!-- 主机 A：发送缓冲在上、接收缓冲在下 -->
  <rect x="40" y="50" width="280" height="190" rx="8" class="host"/>
  <text x="180" y="76" class="lbl">主机 A</text>
  <rect x="70" y="96" width="180" height="44" rx="6" class="send"/>
  <text x="160" y="112" class="bname" fill="#1d4ed8">发送缓冲</text>
  <text x="160" y="130" class="sub">数据 → B</text>
  <rect x="70" y="176" width="180" height="44" rx="6" class="recv"/>
  <text x="160" y="192" class="bname" fill="#15803d">接收缓冲</text>
  <text x="160" y="210" class="sub">← B 的数据</text>

  <!-- 主机 B：接收缓冲在上、发送缓冲在下（与 A 对接） -->
  <rect x="440" y="50" width="280" height="190" rx="8" class="host"/>
  <text x="580" y="76" class="lbl">主机 B</text>
  <rect x="470" y="96" width="180" height="44" rx="6" class="recv"/>
  <text x="560" y="112" class="bname" fill="#15803d">接收缓冲</text>
  <text x="560" y="130" class="sub">← A 的数据</text>
  <rect x="470" y="176" width="180" height="44" rx="6" class="send"/>
  <text x="560" y="192" class="bname" fill="#1d4ed8">发送缓冲</text>
  <text x="560" y="210" class="sub">数据 → A</text>

  <!-- 上方对接：起点 A 发送缓冲右边缘(250) ↔ 终点 B 接收缓冲左边缘(470) -->
  <line x1="250" y1="118" x2="470" y2="118" stroke="#2563eb" stroke-width="2.5" marker-start="url(#d1x)" marker-end="url(#d1x)"/>
  <text x="380" y="108" class="sub" fill="#1d4ed8">A 发 ↔ B 收</text>
  <!-- 下方对接：起点 B 发送缓冲左边缘(470) ↔ 终点 A 接收缓冲右边缘(250) -->
  <line x1="470" y1="198" x2="250" y2="198" stroke="#16a34a" stroke-width="2.5" marker-start="url(#d2x)" marker-end="url(#d2x)"/>
  <text x="380" y="222" class="sub" fill="#15803d">B 发 ↔ A 收</text>

  <text x="380" y="272" class="note">A 发送缓冲只对接 B 的接收缓冲，B 发送缓冲只对接 A 的接收缓冲——上下两条通路互相独立，可同时收发、互不等待</text>
</svg>`,
        },
        {
          id: 'kb-os-buffer-2-6',
          type: 'callout',
          title: '两种单双缓冲不是一回事',
          text: '这里"电脑的单双缓冲"是网络通信场景：每台主机配一个缓冲（单，单向交替）或发送+接收两个缓冲（双，可同时收发）。它和上面"处理数据"的单双缓冲（一个/两个缓冲区协调外设与 CPU 的数据搬移，讨论 T/M/C 的时间关系）是两个不同的概念。',
          tone: 'orange',
        },
      ],
    },
    {
      id: 'os-buffer-circular',
      title: '循环缓冲',
      blocks: [
        {
          id: 'kb-os-buffer-3-1',
          type: 'paragraph',
          text: '**循环缓冲**由多个**大小相同的缓冲区**组成一个环形队列，供生产者和消费者轮流使用。系统设置**输入指针 in**（指向生产者下次可写入的空缓冲）和**输出指针 out**（指向消费者下次可读出的满缓冲）。\n\nin 与 out 相等时缓冲队列为空，无法读。in 追上 out 时缓冲队列已满，无法写。\n\n循环缓冲在多个缓冲区之间轮流使用，缓解了单/双缓冲容量小的问题。',
        },
      ],
    },
    {
      id: 'os-buffer-pool',
      title: '缓冲池',
      blocks: [
        {
          id: 'kb-os-buffer-4-1',
          type: 'paragraph',
          text: '**缓冲池**由系统统一管理的一组缓冲区组成，供多个进程共享，比每进程各自设缓冲更节省内存、更灵活。缓冲池中的缓冲区按用途组织成几个队列，进程按需从队列中取用、用完归还。',
        },
        {
          id: 'kb-os-buffer-4-2',
          type: 'html',
          html: `<svg viewBox="0 0 760 360" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { font-family: system-ui, sans-serif; }
    .title { font-size: 15px; font-weight: 700; fill: #0f172a; text-anchor: middle; }
    .boxh  { font-size: 13px; font-weight: 700; fill: #0f172a; text-anchor: middle; }
    .row   { font-size: 12px; fill: #334155; text-anchor: middle; }
    .sub   { font-size: 11px; fill: #64748b; text-anchor: middle; }
    .note  { font-size: 12px; fill: #475569; text-anchor: middle; }
    .dev   { fill: #ffffff; stroke: #334155; stroke-width: 2; }
    .pool  { fill: #f8fafc; stroke: #2563eb; stroke-width: 2; }
    .bufc  { fill: #dbeafe; stroke: #2563eb; stroke-width: 1.6; }
    .usr   { fill: #ffffff; stroke: #16a34a; stroke-width: 2; }
  </style>
  <defs>
    <marker id="bpl" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#475569"/></marker>
    <marker id="bpr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#475569"/></marker>
  </defs>

  <text x="380" y="24" class="title">缓冲池：设备 ↔ 缓冲池（四个缓冲区）↔ 用户程序</text>

  <!-- 左边：设备 -->
  <rect x="30" y="110" width="150" height="150" rx="8" class="dev"/>
  <text x="105" y="180" class="boxh">设备</text>
  <text x="105" y="205" class="sub" text-anchor="middle">（外设）</text>

  <!-- 中间：缓冲池（大方块内含四个工作缓冲区，两列排布） -->
  <rect x="275" y="95" width="250" height="180" rx="8" class="pool"/>
  <text x="400" y="117" class="boxh" fill="#1d4ed8">缓冲池</text>
  <!-- 列标题 -->
  <text x="341" y="133" class="sub" fill="#1d4ed8" text-anchor="middle">输入侧</text>
  <text x="459" y="133" class="sub" fill="#1d4ed8" text-anchor="middle">输出侧</text>
  <!-- 左列（输入侧） -->
  <rect x="291" y="142" width="100" height="44" rx="5" class="bufc"/><text x="341" y="166" class="row" fill="#1d4ed8">收容输入</text>
  <rect x="291" y="196" width="100" height="44" rx="5" class="bufc"/><text x="341" y="220" class="row" fill="#1d4ed8">提取输入</text>
  <!-- 右列（输出侧） -->
  <rect x="409" y="142" width="100" height="44" rx="5" class="bufc"/><text x="459" y="166" class="row" fill="#1d4ed8">收容输出</text>
  <rect x="409" y="196" width="100" height="44" rx="5" class="bufc"/><text x="459" y="220" class="row" fill="#1d4ed8">提取输出</text>

  <!-- 右边：用户程序 -->
  <rect x="600" y="110" width="140" height="150" rx="8" class="usr"/>
  <text x="670" y="180" class="boxh" fill="#15803d">用户程序</text>
  <text x="670" y="205" class="sub" text-anchor="middle">（进程）</text>

  <!-- 设备 ↔ 缓冲池 -->
  <line x1="180" y1="185" x2="273" y2="185" stroke="#475569" stroke-width="2.2" marker-end="url(#bpl)"/>
  <text x="229" y="171" class="sub" text-anchor="middle">输入：设备 → 缓冲池</text>
  <line x1="273" y1="225" x2="180" y2="225" stroke="#475569" stroke-width="2.2" marker-end="url(#bpr)"/>
  <text x="229" y="243" class="sub" text-anchor="middle">输出：缓冲池 → 设备</text>

  <!-- 缓冲池 ↔ 用户程序 -->
  <line x1="527" y1="185" x2="598" y2="185" stroke="#475569" stroke-width="2.2" marker-end="url(#bpl)"/>
  <text x="560" y="171" class="sub" text-anchor="middle">取数据：缓冲池 → 用户</text>
  <line x1="598" y1="225" x2="527" y2="225" stroke="#475569" stroke-width="2.2" marker-end="url(#bpr)"/>
  <text x="560" y="243" class="sub" text-anchor="middle">写数据：用户 → 缓冲池</text>

  <text x="380" y="334" class="note">缓冲池由系统统一管理的一组缓冲区组成，供多个进程共享，进程按需取用、用完归还</text>
  <text x="380" y="356" class="note">四种工作缓冲区：收容输入、提取输入、收容输出、提取输出</text>
</svg>`,
        },
        {
          id: 'kb-os-buffer-4-3',
          type: 'paragraph',
          text: '缓冲池的**四种工作缓冲区**：\n\n- **收容输入**：从空缓冲队列取一个缓冲，把输入设备的数据收容进去，变成装输入数据的缓冲，挂入输入队列。\n- **提取输入**：从输入队列取一个缓冲，把数据提取给用户，缓冲归还空缓冲队列。\n- **收容输出**：从空缓冲队列取一个缓冲，把用户输出数据收容进去，挂入输出队列。\n- **提取输出**：从输出队列取一个缓冲，把数据送给输出设备，缓冲归还空缓冲队列。',
        },
      ],
    },
    {
      id: 'os-buffer-device-alloc',
      title: '设备分配与回收',
      blocks: [
        {
          id: 'kb-os-buffer-1-2',
          type: 'paragraph',
          text: '**设备分配**策略：\n\n- **先来先服务**：按请求到达顺序分配。\n- **优先级**：高优先级进程优先分配。\n\n**设备独立性**让用户使用**逻辑设备名**，系统通过**逻辑设备表 LUT**（logical unit table）把逻辑设备名映射到物理设备。',
        },
        {
          id: 'kb-os-buffer-5-1',
          type: 'paragraph',
          text: '**设备分配用到的数据结构**：\n\n- **设备控制表 DCT**：每台设备一张，记录设备类型、标识符、状态、设备等待队列指针，以及指向控制器控制表的指针。\n- **控制器控制表 COCT**：每个控制器一张，记录控制器状态与等待队列，以及指向通道控制表的指针。\n- **通道控制表 CHCT**：每个通道一张，记录通道状态与等待队列。\n- **系统设备表 SDT**：整个系统一张，登记系统中所有设备及其 DCT 入口，每类设备一个表项，含设备类型和 DCT 指针。',
        },
        {
          id: 'kb-os-buffer-5-2',
          type: 'paragraph',
          text: '**设备分配流程**：进程按**逻辑设备名**提出请求 → 查**系统设备表 SDT** 找到对应设备 → 查该设备的 **DCT** 判断状态：\n\n- 空闲：分配设备，并沿 DCT → COCT → CHCT 逐级分配控制器和通道。\n- 忙：把进程加入设备等待队列。\n\n**回收**时进程释放设备，系统在等待队列中选取下一个进程继续分配。',
        },
        {
          id: 'kb-os-buffer-5-3',
          type: 'callout',
          title: '逻辑设备名与物理设备名',
          text: '逻辑设备名是用户程序使用的抽象名字（如 LPT1、/dev/tty），物理设备名是设备实际编号。系统通过逻辑设备表 LUT 完成映射，更换物理设备时用户程序无需修改，这就是设备独立性。',
          tone: 'blue',
        },
      ],
    },
    {
      id: 'os-buffer-spooling',
      title: 'SPOOLing 技术',
      blocks: [
        {
          id: 'kb-os-buffer-6-1',
          type: 'paragraph',
          text: '**SPOOLing**（假脱机，Simultaneous Peripheral Operation On-Line）用磁盘上的**井**来缓冲慢速独占设备的数据，把独占设备改造成可共享的虚拟设备。它由三部分组成：\n\n- **输入井、输出井**：建立在磁盘上的缓冲区。\n- **输入缓冲区、输出缓冲区**：内存中的缓冲区。\n- **输入进程、输出进程**：系统进程。',
        },
        {
          id: 'kb-os-buffer-6-2',
          type: 'paragraph',
          text: '**SPOOLing 的工作原理**：\n\n- **输入进程**把输入设备的数据先读入内存的**输入缓冲区**，再转存入磁盘的**输入井**，用户进程需要时从输入井取数据。这模拟了**脱机输入**（输入井代替了脱机输入设备）。\n- **输出进程**把用户进程写入**输出井**的数据，通过内存的**输出缓冲区**送给输出设备。这模拟了**脱机输出**（输出井代替了脱机输出设备）。\n\n**缓冲区的作用**是缓和输入设备与输入井、输出井与输出设备之间的速度差异。',
        },
        {
          id: 'kb-os-buffer-6-5',
          type: 'html',
          html: `<svg viewBox="0 0 900 430" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { font-family: system-ui, sans-serif; }
    .title { font-size: 15px; font-weight: 700; fill: #0f172a; text-anchor: middle; }
    .boxh  { font-size: 13px; font-weight: 700; fill: #0f172a; text-anchor: middle; }
    .sub   { font-size: 11px; fill: #64748b; text-anchor: middle; }
    .role  { font-size: 12px; font-weight: 700; fill: #7c3aed; text-anchor: middle; }
    .dev   { fill: #ffffff; stroke: #334155; stroke-width: 2; }
    .buf   { fill: #dbeafe; stroke: #2563eb; stroke-width: 2; }
    .well  { fill: #fef3c7; stroke: #d97706; stroke-width: 2; }
    .usr   { fill: #dcfce7; stroke: #16a34a; stroke-width: 2; }
  </style>
  <defs>
    <marker id="spa" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#475569"/></marker>
    <marker id="spb" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#475569"/></marker>
  </defs>

  <text x="450" y="24" class="title">SPOOLing 工作原理：输入通道与输出通道</text>

  <!-- ===== 上排：输入通道 ===== -->
  <rect x="30" y="50" width="150" height="62" rx="6" class="dev"/>
  <text x="105" y="76" class="boxh">输入设备</text>
  <text x="105" y="94" class="sub" text-anchor="middle">（外设）</text>

  <rect x="250" y="50" width="180" height="62" rx="6" class="buf"/>
  <text x="340" y="76" class="boxh" fill="#1d4ed8">输入缓冲区</text>
  <text x="340" y="94" class="sub" text-anchor="middle">（内存）</text>

  <rect x="500" y="50" width="160" height="62" rx="6" class="well"/>
  <text x="580" y="76" class="boxh" fill="#b45309">输入井</text>
  <text x="580" y="94" class="sub" text-anchor="middle">（磁盘）</text>

  <!-- 输入通道箭头 -->
  <line x1="180" y1="81" x2="248" y2="81" stroke="#475569" stroke-width="2.2" marker-end="url(#spa)"/>
  <line x1="430" y1="81" x2="498" y2="81" stroke="#475569" stroke-width="2.2" marker-end="url(#spa)"/>
  <text x="450" y="36" class="role">输入进程控制</text>

  <!-- ===== 用户进程（中间偏右） ===== -->
  <rect x="700" y="150" width="170" height="80" rx="8" class="usr"/>
  <text x="785" y="184" class="boxh" fill="#15803d">用户进程</text>
  <text x="785" y="206" class="sub" text-anchor="middle">从输入井取数据</text>
  <text x="785" y="222" class="sub" text-anchor="middle">向输出井写数据</text>

  <!-- 输入井 → 用户进程 -->
  <path d="M 660 100 C 680 100, 700 120, 720 148" stroke="#475569" stroke-width="2.2" fill="none" marker-end="url(#spa)"/>
  <text x="690" y="118" class="sub" text-anchor="middle">取</text>

  <!-- 用户进程 → 输出井 -->
  <path d="M 720 232 C 690 260, 660 260, 610 318" stroke="#475569" stroke-width="2.2" fill="none" marker-end="url(#spa)"/>
  <text x="690" y="262" class="sub" text-anchor="middle">写</text>

  <!-- ===== 下排：输出通道 ===== -->
  <rect x="500" y="318" width="160" height="62" rx="6" class="well"/>
  <text x="580" y="344" class="boxh" fill="#b45309">输出井</text>
  <text x="580" y="362" class="sub" text-anchor="middle">（磁盘）</text>

  <rect x="250" y="318" width="180" height="62" rx="6" class="buf"/>
  <text x="340" y="344" class="boxh" fill="#1d4ed8">输出缓冲区</text>
  <text x="340" y="362" class="sub" text-anchor="middle">（内存）</text>

  <rect x="30" y="318" width="150" height="62" rx="6" class="dev"/>
  <text x="105" y="344" class="boxh">输出设备</text>
  <text x="105" y="362" class="sub" text-anchor="middle">（外设）</text>

  <!-- 输出通道箭头（从右往左） -->
  <line x1="498" y1="349" x2="432" y2="349" stroke="#475569" stroke-width="2.2" marker-end="url(#spb)"/>
  <line x1="248" y1="349" x2="182" y2="349" stroke="#475569" stroke-width="2.2" marker-end="url(#spb)"/>
  <text x="450" y="404" class="role">输出进程控制</text>

  <text x="450" y="422" class="sub" text-anchor="middle">输入井/输出井在磁盘上，代替脱机输入/输出设备；缓冲区在内存中，缓和设备与井之间的速度差异</text>
</svg>`,
        },
        {
          id: 'kb-os-buffer-6-3',
          type: 'paragraph',
          text: '**SPOOLing 的特点**：\n\n- 提高 **I/O 速度**：进程先与磁盘井交互，不再直接等待慢速设备。\n- 将独占设备改造成**共享设备**：多个进程可同时向井写入，由系统进程串行送到设备。\n- 实现**虚拟设备**：每个进程都像独占一台设备。\n\n数据传送由系统进程控制，用户进程只与井打交道。',
        },
        {
          id: 'kb-os-buffer-6-4',
          type: 'paragraph',
          text: '**SPOOLing 的应用**：**共享打印机**是最典型的应用，打印机是独占设备，多个进程的打印任务先进入输出井排队，SPOOLing 输出进程按顺序把各任务的打印数据送往打印机，使打印机看起来“同时”为多个进程服务。SPOOLing 也常用于共享扫描仪、传真机等慢速独占设备。',
        },
      ],
    },
  ],
}
