import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const fileOperationsArticle: KnowledgeArticleData = {
  pointId: 'os-file-operations',
  subpoints: [
    {
      id: 'os-file-op-basic',
      title: '文件的基本操作',
      blocks: [
  
        {
          id: 'kb-os-file-op-5',
          type: 'paragraph',
          text: `**创建文件**（creat）对目录、inode、文件数据的处理：
- **目录**：在父目录的目录文件中新增一条目录项（文件名 + inode 号）。
- **inode**：从空闲 inode 池分配一个 inode 并初始化元数据——类型、权限、属主、时间、大小置 0、数据块指针清零、链接计数置 1。
- **文件数据**：创建时不分配数据块，文件还没有数据。之后写文件时才按需分配数据块。

权限等元数据存放在 inode 里，目录项只存文件名和 inode 号。`,
        },
        {
          id: 'kb-os-file-op-6',
          type: 'paragraph',
          text: `**删除文件**（delete/unlink）对目录、inode、文件数据的处理：
- **目录**：在父目录的目录文件中删除指向该文件的目录项。
- **inode**：文件链接计数减 1。减到 0 才释放磁盘 inode（回收其索引结构）。
- **文件数据**：释放文件占用的全部数据块加入空闲块链。若文件曾被打开，还需清理内存中缓存的该文件数据（脏页先写回）。

删除文件不会删除父目录本身；有硬链接时删除一个链接只把链接计数减 1。`,
        },
        {
          id: 'kb-os-file-op-2',
          type: 'paragraph',
          text: '**打开文件的流程**：\n\n1. 用户调用 open 并按文件名查找目录，找到 FCB（或 inode）后把它调入内存。\n2. 在**系统打开文件表**中建立表项（记录 inode 指针、打开计数、读写位置）。\n3. 在当前进程的**进程打开文件表**中建立表项，指向系统表项。\n4. 返回**文件描述符**（fd，file descriptor）。\n\n此后读写直接用 fd 定位，不必再按名查找。',
        },
      ],
    },
    {
      id: 'os-file-op-tables',
      title: '进程打开文件表与系统打开文件表',
      blocks: [
        {
          id: 'kb-os-file-op-3',
          type: 'html',
          html: `<svg viewBox="0 0 940 470" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { font-family: system-ui, sans-serif; }
    .title { font-size: 15px; font-weight: 700; fill: #0f172a; text-anchor: middle; }
    .boxh  { font-size: 13px; font-weight: 700; fill: #0f172a; text-anchor: middle; }
    .row   { font-size: 12px; fill: #334155; text-anchor: middle; }
    .sub   { font-size: 11px; fill: #64748b; text-anchor: middle; }
    .note  { font-size: 12px; fill: #475569; text-anchor: middle; }
  </style>
  <defs>
    <marker id="pb" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#2563eb"/></marker>
    <marker id="po" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#d97706"/></marker>
  </defs>

  <text x="470" y="24" class="title">打开文件：进程打开文件表 → 系统打开文件表 → 文件（inode）</text>

  <!-- 进程 A -->
  <rect x="36" y="66" width="200" height="132" rx="6" fill="#f8fafc" stroke="#334155" stroke-width="2"/>
  <text x="136" y="88" class="boxh">进程 A 的进程打开文件表</text>
  <line x1="56" y1="98" x2="216" y2="98" stroke="#cbd5e1" stroke-width="1"/>
  <text x="86" y="120" class="row" text-anchor="start">fd 0</text>
  <text x="172" y="120" class="row" fill="#2563eb">→ ①</text>
  <text x="86" y="150" class="row" text-anchor="start">fd 1</text>
  <text x="172" y="150" class="row" fill="#2563eb">→ ②</text>
  <line x1="56" y1="164" x2="216" y2="164" stroke="#cbd5e1" stroke-width="1"/>
  <text x="136" y="184" class="sub">每个 fd 指向一个系统表项</text>

  <!-- 进程 B -->
  <rect x="36" y="250" width="200" height="112" rx="6" fill="#f8fafc" stroke="#334155" stroke-width="2"/>
  <text x="136" y="272" class="boxh">进程 B 的进程打开文件表</text>
  <line x1="56" y1="282" x2="216" y2="282" stroke="#cbd5e1" stroke-width="1"/>
  <text x="86" y="306" class="row" text-anchor="start">fd 0</text>
  <text x="172" y="306" class="row" fill="#2563eb">→ ①</text>
  <line x1="56" y1="320" x2="216" y2="320" stroke="#cbd5e1" stroke-width="1"/>
  <text x="136" y="342" class="sub">与进程 A 共享系统表项 ①</text>

  <!-- 系统打开文件表 -->
  <rect x="330" y="60" width="280" height="252" rx="6" fill="#eff6ff" stroke="#2563eb" stroke-width="2"/>
  <text x="470" y="84" class="boxh" fill="#1d4ed8">系统打开文件表（全局唯一）</text>
  <rect x="352" y="100" width="236" height="64" rx="4" fill="#ffffff" stroke="#93c5fd" stroke-width="1.5"/>
  <text x="470" y="120" class="row" fill="#1d4ed8">表项 ①　文件 A</text>
  <text x="470" y="140" class="sub">打开计数 = 2　读写位置</text>
  <rect x="352" y="184" width="236" height="64" rx="4" fill="#ffffff" stroke="#93c5fd" stroke-width="1.5"/>
  <text x="470" y="204" class="row" fill="#1d4ed8">表项 ②　文件 B</text>
  <text x="470" y="224" class="sub">打开计数 = 1　读写位置</text>
  <text x="470" y="284" class="sub">每个表项记录：inode 指针、打开计数、读写位置</text>

  <!-- 文件 inode -->
  <rect x="730" y="90" width="184" height="182" rx="6" fill="#fff7ed" stroke="#d97706" stroke-width="2"/>
  <text x="822" y="114" class="boxh" fill="#b45309">文件（inode）</text>
  <rect x="752" y="128" width="140" height="52" rx="4" fill="#ffffff" stroke="#fdba74" stroke-width="1.5"/>
  <text x="822" y="148" class="row" fill="#92400e">inode A</text>
  <text x="822" y="166" class="sub">文件数据块指针</text>
  <rect x="752" y="196" width="140" height="52" rx="4" fill="#ffffff" stroke="#fdba74" stroke-width="1.5"/>
  <text x="822" y="216" class="row" fill="#92400e">inode B</text>
  <text x="822" y="234" class="sub">文件数据块指针</text>

  <!-- 连线：进程 → 系统表 -->
  <path d="M 236 128 C 280 128, 300 128, 350 124" stroke="#2563eb" stroke-width="2" fill="none" marker-end="url(#pb)"/>
  <path d="M 236 150 C 280 180, 300 200, 350 206" stroke="#2563eb" stroke-width="2" fill="none" marker-end="url(#pb)"/>
  <path d="M 236 300 C 280 210, 300 160, 350 140" stroke="#2563eb" stroke-width="2" fill="none" marker-end="url(#pb)"/>

  <!-- 连线：系统表 → inode -->
  <path d="M 588 132 C 650 132, 690 140, 750 150" stroke="#d97706" stroke-width="2" fill="none" marker-end="url(#po)"/>
  <path d="M 588 216 C 650 216, 690 218, 750 220" stroke="#d97706" stroke-width="2" fill="none" marker-end="url(#po)"/>

  <text x="470" y="404" class="note">进程 A 与进程 B 打开同一个文件：各自的 fd 0 都指向系统表项 ①，共享同一读写位置</text>
  <text x="470" y="428" class="note">进程 A 的 fd 1 打开另一文件：独立系统表项 ②，读写位置与文件 A 互不影响</text>
  <text x="470" y="452" class="note">关闭时对应 fd 引用的系统表项打开计数减 1，减到 0 才真正关闭文件</text>
</svg>`,
        },
        {
          id: 'kb-os-file-op-4',
          type: 'callout',
          title: '共享与独立',
          text: '两个进程打开同一文件时，若各自的 fd 指向同一个系统表项，则共享读写位置；若指向不同表项，则各自维护读写位置、互不影响。系统表项打开计数减到 0 才真正关闭文件。',
          tone: 'blue',
        },
      ],
    },
  ],
}
