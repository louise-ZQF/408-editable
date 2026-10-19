import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const switchingDeviceArticle: KnowledgeArticleData = {
  pointId: 'kp-switching-device',
  subpoints: [
    {
      id: 'switch-basics',
      title: '以太网交换机',
      blocks: [
        {
          id: 'kb-switch-basics-1',
          type: 'paragraph',
          text: '**以太网交换机**工作在数据链路层，根据帧的目的 MAC 地址进行转发。它维护一张**MAC 地址表**，记录每个 MAC 地址对应的端口。\n\n交换机收到帧时查表：\n\n1. 目的地址在表中：只往对应端口转发。\n2. 目的地址不在表中：向除入端口外的所有端口**洪泛**。',
        },
        {
          id: 'kb-switch-basics-2',
          type: 'paragraph',
          text: '交换机通过**自学习**构建 MAC 地址表：收到一个帧，就把源 MAC 地址和入端口的对应关系写入表中。这个表项有老化时间，过期未刷新的表项自动删除。',
        },
        {
          id: 'kb-switch-basics-3',
          type: 'html',
          html: `<svg viewBox="0 0 800 520" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { font-family: system-ui, sans-serif; }
    .hdr { font-size: 18px; font-weight: 700; fill: #1e293b; }
    .sub { font-size: 13px; fill: #64748b; }
    .lbl { font-size: 13px; font-weight: 600; fill: #1e293b; }
    .dim { font-size: 12px; fill: #64748b; }
    .tbl-hdr { font-size: 12px; font-weight: 700; fill: #334155; }
    .tbl-cell { font-size: 13px; font-weight: 600; fill: #1e293b; }
    .host { fill: #e2e8f0; stroke: #64748b; stroke-width: 2; }
    .port { fill: #f8fafc; stroke: #94a3b8; stroke-width: 1.5; }
    .port-lbl { font-size: 12px; font-weight: 700; fill: #334155; text-anchor: middle; }
    .port-mac { font-size: 12px; font-weight: 600; fill: #475569; text-anchor: middle; }
    .cache { fill: #ffffff; stroke: #94a3b8; stroke-width: 1.5; }
    .table { fill: #ffffff; stroke: #94a3b8; stroke-width: 1.5; }
  </style>

  <defs>
    <marker id="arr-blue" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="#3b82f6"/>
    </marker>
    <marker id="arr-gray" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="#94a3b8"/>
    </marker>
    <marker id="arr-green" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="#16a34a"/>
    </marker>
    <marker id="arr-orange" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="#d97706"/>
    </marker>
  </defs>

  <text x="400" y="30" class="hdr" text-anchor="middle">交换机用交换表存储转发</text>
  <text x="400" y="50" class="sub" text-anchor="middle">帧先完整接收（存储），再查表决定转发方向</text>

  <!-- 主机 A -->
  <rect x="24" y="120" width="96" height="44" rx="4" class="host"/>
  <text x="72" y="147" class="lbl" text-anchor="middle">主机 A</text>
  <text x="72" y="178" class="port-mac">AAAAH</text>

  <!-- 主机 B -->
  <rect x="660" y="120" width="96" height="44" rx="4" class="host"/>
  <text x="708" y="147" class="lbl" text-anchor="middle">主机 B</text>
  <text x="708" y="178" class="port-mac">BBBBH</text>

  <!-- 主机 C -->
  <rect x="660" y="320" width="96" height="44" rx="4" class="host"/>
  <text x="708" y="347" class="lbl" text-anchor="middle">主机 C</text>
  <text x="708" y="378" class="port-mac">CCCCH</text>

  <!-- 交换机主体 -->
  <rect x="170" y="90" width="440" height="330" rx="8" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="390" y="115" class="lbl" text-anchor="middle">以太网交换机（数据链路层）</text>

  <!-- 端口 1 -->
  <rect x="180" y="168" width="60" height="26" rx="3" class="port"/>
  <text x="210" y="186" class="port-lbl">端口1</text>

  <!-- 帧缓存 -->
  <rect x="252" y="138" width="110" height="90" rx="4" class="cache"/>
  <text x="307" y="164" class="lbl" text-anchor="middle">帧缓存</text>
  <text x="307" y="184" class="dim" text-anchor="middle">完整接收</text>
  <text x="307" y="200" class="dim" text-anchor="middle">CRC 校验</text>

  <!-- 交换表 -->
  <rect x="372" y="120" width="184" height="200" rx="4" class="table"/>
  <text x="464" y="140" class="lbl" text-anchor="middle">交换表（MAC 地址表）</text>
  <line x1="372" y1="148" x2="556" y2="148" stroke="#e2e8f0" stroke-width="1"/>
  <text x="406" y="166" class="tbl-hdr">MAC 地址</text>
  <text x="528" y="166" class="tbl-hdr">端口</text>
  <line x1="372" y1="174" x2="556" y2="174" stroke="#e2e8f0" stroke-width="1"/>

  <!-- A 行（绿色：刚学到） -->
  <rect x="376" y="180" width="176" height="28" fill="#dcfce7"/>
  <text x="406" y="200" class="tbl-cell" fill="#166534">AAAAH</text>
  <text x="528" y="200" class="tbl-cell" fill="#166534">1</text>

  <!-- B 行（蓝色：查表命中） -->
  <rect x="376" y="214" width="176" height="28" fill="#dbeafe"/>
  <text x="406" y="234" class="tbl-cell" fill="#1e40af">BBBBH</text>
  <text x="528" y="234" class="tbl-cell" fill="#1e40af">2</text>

  <!-- 端口 2 -->
  <rect x="566" y="168" width="60" height="26" rx="3" class="port"/>
  <text x="596" y="186" class="port-lbl">端口2</text>

  <!-- 端口 3 -->
  <rect x="566" y="330" width="60" height="26" rx="3" class="port"/>
  <text x="596" y="348" class="port-lbl">端口3</text>

  <!-- 帧：A → 端口1 -->
  <line x1="120" y1="142" x2="180" y2="180" stroke="#3b82f6" stroke-width="2.5" marker-end="url(#arr-blue)"/>
  <text x="118" y="112" class="lbl" fill="#1e40af">帧：源 AAAAH 目的 BBBBH</text>

  <!-- ① 自学习 -->
  <text x="196" y="240" class="lbl" fill="#1e40af">① 自学习</text>
  <text x="196" y="256" class="dim" fill="#1e40af">源 AAAAH → 端口1</text>

  <!-- 端口1 → 缓存 -->
  <line x1="240" y1="190" x2="252" y2="190" stroke="#94a3b8" stroke-width="2"/>

  <!-- 缓存 → 交换表（查表） -->
  <line x1="362" y1="180" x2="372" y2="180" stroke="#94a3b8" stroke-width="2" marker-end="url(#arr-gray)"/>
  <text x="367" y="170" class="dim" text-anchor="middle">②查表</text>

  <!-- 交换表 → 端口2（命中）：从端口2正下方垂直指上来 -->
  <path d="M 552 228 L 596 228 L 596 202" stroke="#16a34a" stroke-width="2" fill="none" marker-end="url(#arr-green)"/>
  <text x="600" y="222" class="lbl" fill="#166534">②命中</text>

  <!-- 端口2 → 主机 B（转发） -->
  <line x1="626" y1="190" x2="660" y2="142" stroke="#16a34a" stroke-width="2.5" marker-end="url(#arr-green)"/>
  <text x="642" y="160" class="lbl" fill="#166534">③转发</text>

  <!-- 未命中 → 洪泛（目的地址查不到时，向除入端口外所有端口转发） -->
  <path d="M 464 320 L 464 350 L 566 350" stroke="#d97706" stroke-width="2" fill="none" stroke-dasharray="6 4" marker-end="url(#arr-orange)"/>
  <text x="458" y="340" class="dim" fill="#92400e" text-anchor="end">未命中 → 洪泛</text>

  <!-- 端口3 → 主机 C -->
  <line x1="626" y1="352" x2="660" y2="342" stroke="#d97706" stroke-width="2" marker-end="url(#arr-orange)"/>

  <!-- 底部总结 -->
  <text x="400" y="452" class="sub" text-anchor="middle">① 帧到达端口 1，交换机把源 MAC（AAAAH）与入端口写入交换表——自学习（表中绿色条目）</text>
  <text x="400" y="474" class="sub" text-anchor="middle">② 查表找到目的 MAC（BBBBH）对应的端口 2，命中则只往该端口转发</text>
  <text x="400" y="496" class="sub" text-anchor="middle">③ 目的地址查不到时（如表中还没有 CCCCH），向除入端口外的所有端口洪泛</text>
</svg>`,
        },
      ],
    },
    {
      id: 'switch-forwarding',
      title: '交换机的三种转发方式',
      blocks: [
        {
          id: 'kb-switch-fwd-1',
          type: 'paragraph',
          text: `1. **直通式**——收到目的地址（前 6 字节）后立即开始转发。时延最小，但坏帧也会被转发出去。

2. **存储转发**——收完整个帧、CRC 校验通过后再转发。坏帧被丢弃，可靠但时延较大。

3. **无碎片式**——收到前 64 字节后开始转发。过滤掉了冲突碎片（冲突产生的帧均短于 64 字节），时延介于前两者之间。`,
        },
        {
          id: 'kb-switch-fwd-3',
          type: 'html',
          html: `<svg viewBox="0 0 760 440" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { font-family: system-ui, sans-serif; }
    .hdr { font-size: 18px; font-weight: 700; fill: #1e293b; }
    .lbl { font-size: 14px; font-weight: 700; fill: #1e293b; }
    .sub { font-size: 12px; fill: #64748b; }
    .ax  { font-size: 12px; font-weight: 600; fill: #334155; text-anchor: middle; }
    .tick { stroke: #94a3b8; stroke-width: 1.5; }
    .note { font-size: 12px; fill: #475569; }
  </style>

  <text x="380" y="26" class="hdr" text-anchor="middle">三种转发方式的时延对比</text>
  <text x="380" y="46" class="sub" text-anchor="middle">横轴：帧到达交换机的接收进度，T 表示整帧接收完成</text>

  <!-- 时间轴 -->
  <line x1="160" y1="78" x2="620" y2="78" stroke="#94a3b8" stroke-width="2"/>
  <line x1="160" y1="72" x2="160" y2="84" class="tick"/>
  <text x="160" y="98" class="ax">0</text>
  <text x="160" y="114" class="note" text-anchor="middle">帧开始到达</text>
  <line x1="220" y1="72" x2="220" y2="84" class="tick"/>
  <text x="220" y="98" class="ax">前 6 字节</text>
  <line x1="350" y1="72" x2="350" y2="84" class="tick"/>
  <text x="350" y="98" class="ax">前 64 字节</text>
  <line x1="620" y1="72" x2="620" y2="84" class="tick"/>
  <text x="620" y="98" class="ax">T（整帧）</text>

  <!-- 直通式 -->
  <text x="16" y="168" class="lbl">直通式</text>
  <text x="16" y="188" class="sub">时延最小</text>
  <rect x="160" y="140" width="60" height="36" rx="4" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>
  <text x="190" y="163" class="note" text-anchor="middle" fill="#166534" font-size="11">目的地址</text>
  <path d="M220,151 L220,165 L233,158 Z" fill="#16a34a"/>
  <text x="238" y="162" class="note" fill="#166534">转发</text>

  <!-- 无碎片式 -->
  <text x="16" y="258" class="lbl">无碎片式</text>
  <text x="16" y="278" class="sub">时延中等</text>
  <rect x="160" y="230" width="190" height="36" rx="4" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
  <text x="255" y="253" class="note" text-anchor="middle" fill="#92400e">前 64 字节</text>
  <path d="M350,241 L350,255 L363,248 Z" fill="#d97706"/>
  <text x="368" y="252" class="note" fill="#92400e">转发</text>

  <!-- 存储转发 -->
  <text x="16" y="348" class="lbl">存储转发</text>
  <text x="16" y="368" class="sub">时延最大</text>
  <rect x="160" y="320" width="460" height="36" rx="4" fill="#dbeafe" stroke="#3b82f6" stroke-width="2"/>
  <text x="390" y="343" class="note" text-anchor="middle" fill="#1e40af">整个帧 + CRC 校验</text>
  <path d="M620,331 L620,345 L633,338 Z" fill="#3b82f6"/>
  <text x="638" y="342" class="note" fill="#1e40af">转发</text>

  <text x="380" y="404" class="note" text-anchor="middle">等待接收的部分越长，转发时延越大：直通式（6 字节）&lt; 无碎片式（64 字节）&lt; 存储转发（整帧）。</text>
  <text x="380" y="422" class="note" text-anchor="middle">存储转发收完整帧并做 CRC 校验，时延最大但能丢弃坏帧；直通式时延最小，坏帧也会被转发出去。</text>
</svg>`,
        },
        {
          id: 'kb-switch-fwd-2',
          type: 'callout',
          title: '交换机能否连接不同规格的以太网',
          text: '能，但取决于转发方式。存储转发式交换机先把帧完整接收并缓存，再按目标端口的速率转发，因此可以连接不同速率的以太网段，实际中 10 Mbps、100 Mbps、1000 Mbps 端口混插很常见。直通式交换机只检查目的地址就开始转发、不做缓存，无法适配不同速率。',
          tone: 'blue',
        },
      ],
    },
    {
      id: 'switch-vs-hub',
      title: '交换机与集线器的区别',
      blocks: [
        {
          id: 'kb-switch-vs-hub-1',
          type: 'paragraph',
          text: `| 特性 | 交换机 | 集线器 |
|------|--------|--------|
| 工作层次 | **数据链路层** | 物理层 |
| 转发依据 | MAC 地址 | 无（信号广播到所有端口） |
| 冲突域 | 每个端口一个冲突域 | 所有端口共享一个冲突域 |
| 广播域 | **所有端口一个广播域** | 所有端口一个广播域 |
| 带宽 | 独享（每端口独立带宽） | 共享（所有端口平分带宽） |
| 双工方式 | **全双工** | 半双工 |`,
        },
        {
          id: 'kb-switch-vs-hub-2',
          type: 'callout',
          title: '全双工 + 每端口独立带宽',
          text: '交换机端口以全双工工作，同一时刻能同时发送和接收，链路上没有冲突，因此不需要 CSMA/CD。每个端口独立独占端口带宽，多个端口同时全速传输时，交换机总吞吐量等于各端口吞吐量之和（如 8 个 100 Mb/s 端口同时传输，总吞吐量可达 800 Mb/s）。',
          tone: 'orange',
        },
      ],
    },
  ],
}
