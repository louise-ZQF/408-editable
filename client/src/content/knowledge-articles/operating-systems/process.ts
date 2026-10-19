import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const processArticle: KnowledgeArticleData = {
  pointId: 'os-process',
  subpoints: [
    {
      id: 'os-process-pcb',
      title: '进程与 PCB',
      blocks: [
        {
          id: 'kb-os-process-1-1',
          type: 'paragraph',
          text: '**进程**是程序的一次执行过程，是系统进行资源分配和调度的基本单位。进程实体由程序段、数据段、进程控制块（PCB）三部分组成。其中 PCB 是进程存在的唯一标志，系统通过 PCB 感知进程的存在，没有 PCB 的进程在系统中不存在。',
        },
        {
          id: 'kb-os-process-1-2',
          type: 'paragraph',
          text: '**进程的特征**：\n\n- **动态性**：进程是程序的一次执行，有创建、运行、消亡的生命周期，程序是静态的。\n- **并发性**：多个进程可同时存在于内存并交替执行。\n- **独立性**：进程是独立获得资源、独立调度的基本单位。\n- **异步性**：进程按各自不可预知的速度推进。\n- **结构性**：进程由程序段、数据段、PCB 三部分组成。',
        },
        {
          id: 'kb-os-process-1-3',
          type: 'paragraph',
          text: '**PCB 的作用**：\n\n- 作为独立运行基本单位的标志。\n- 实现间断性运行：进程暂停时保存现场，恢复时根据 PCB 恢复。\n- 提供进程管理所需的信息（调度、同步、通信）。\n- 提供进程调度所需的信息（状态、优先级）。\n- 实现系统对进程的控制（挂起、唤醒）。',
        },
        {
          id: 'kb-os-process-1-4',
          type: 'html',
          html: `<svg viewBox="0 0 900 420" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { font-family: system-ui, sans-serif; }
    .title { font-size: 16px; font-weight: 700; fill: #0f172a; text-anchor: middle; }
    .box { font-size: 14px; font-weight: 700; fill: #0f172a; text-anchor: middle; }
    .lbl { font-size: 12px; fill: #334155; text-anchor: middle; }
    .sub { font-size: 11px; fill: #64748b; text-anchor: middle; }
    .note { font-size: 12px; fill: #475569; text-anchor: middle; }
  </style>
  <text x="450" y="26" class="title">进程控制块 PCB 的组成与信息</text>

  <!-- PCB 大框 -->
  <rect x="60" y="50" width="780" height="300" rx="10" fill="#f8fafc" stroke="#334155" stroke-width="2"/>
  <text x="450" y="72" class="box">进程控制块 PCB（进程存在的唯一标志）</text>

  <!-- 四类信息 -->
  <rect x="90" y="90" width="170" height="120" rx="6" fill="#dbeafe" stroke="#2563eb" stroke-width="1.6"/>
  <text x="175" y="112" class="box" font-size="13" fill="#1d4ed8">进程标识符</text>
  <text x="175" y="136" class="lbl">PID（唯一）</text>
  <text x="175" y="158" class="lbl">父进程标识符 PPID</text>
  <text x="175" y="180" class="lbl">用户标识符</text>

  <rect x="280" y="90" width="170" height="120" rx="6" fill="#dcfce7" stroke="#16a34a" stroke-width="1.6"/>
  <text x="365" y="112" class="box" font-size="13" fill="#15803d">处理机状态信息</text>
  <text x="365" y="136" class="lbl">通用寄存器值</text>
  <text x="365" y="158" class="lbl">程序计数器 PC</text>
  <text x="365" y="180" class="lbl">程序状态字 PSW</text>

  <rect x="470" y="90" width="170" height="120" rx="6" fill="#fef3c7" stroke="#d97706" stroke-width="1.6"/>
  <text x="555" y="112" class="box" font-size="13" fill="#b45309">进程调度信息</text>
  <text x="555" y="136" class="lbl">进程状态（就绪/运行/阻塞）</text>
  <text x="555" y="158" class="lbl">优先级</text>
  <text x="555" y="180" class="lbl">等待事件</text>

  <rect x="660" y="90" width="150" height="120" rx="6" fill="#f3e8ff" stroke="#9333ea" stroke-width="1.6"/>
  <text x="735" y="112" class="box" font-size="13" fill="#6d28d9">进程控制信息</text>
  <text x="735" y="136" class="lbl">程序段/数据段地址</text>
  <text x="735" y="158" class="lbl">资源清单</text>
  <text x="735" y="180" class="lbl">进程打开文件表</text>

  <!-- 三部分 -->
  <text x="450" y="240" class="box" font-size="13">进程实体 = 程序段 + 数据段 + PCB</text>
  <rect x="150" y="256" width="180" height="44" rx="6" fill="#e2e8f0" stroke="#94a3b8"/>
  <text x="240" y="283" class="lbl">程序段（指令代码）</text>
  <rect x="360" y="256" width="180" height="44" rx="6" fill="#e2e8f0" stroke="#94a3b8"/>
  <text x="450" y="283" class="lbl">数据段（全局/静态数据）</text>
  <rect x="570" y="256" width="180" height="44" rx="6" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/>
  <text x="660" y="283" class="lbl" fill="#1d4ed8">PCB（控制信息）</text>

  <text x="450" y="330" class="note" text-anchor="middle">PCB 是进程存在的唯一标志：进程创建时建立 PCB，进程终止时撤销 PCB</text>
</svg>`,
        },
        {
          id: 'kb-os-process-1-5',
          type: 'callout',
          title: 'PCB 常驻内存',
          text: '所有未被销毁的进程，其 PCB 都常驻内存。即使进程被挂起到外存，PCB 仍留在内存中。系统依靠 PCB 感知、管理进程，PCB 一旦撤销，进程就不存在了。',
          tone: 'blue',
        },
      ],
    },
    {
      id: 'os-process-state',
      title: '进程状态的转换',
      blocks: [
        {
          id: 'kb-os-process-2-2',
          type: 'paragraph',
          text: '进程在其生命周期内会经历多种状态：\n\n- **创建态**：进程正在被创建，PCB 已建立但资源未就绪。\n- **就绪态**：万事俱备只欠 CPU，等待被调度。\n- **运行态**：占用 CPU 执行。\n- **阻塞态**：等待某事件，如 I/O 完成。\n- **终止态**：进程执行结束，等待回收。\n\n引入**挂起**后，还有：\n\n- **就绪挂起**：就绪进程被调到外存。\n- **阻塞挂起**：阻塞进程被调到外存。',
        },
        {
          id: 'kb-os-process-2-3',
          type: 'html',
          html: `<svg viewBox="0 0 880 520" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { font-family: system-ui, sans-serif; }
    .title { font-size: 16px; font-weight: 700; fill: #0f172a; text-anchor: middle; }
    .state { font-size: 13px; font-weight: 700; fill: #ffffff; text-anchor: middle; }
    .lbl { font-size: 11px; fill: #475569; text-anchor: middle; }
    .note { font-size: 12px; fill: #64748b; text-anchor: middle; }
  </style>
  <defs>
    <marker id="st" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#334155"/></marker>
  </defs>
  <text x="440" y="26" class="title">进程七状态模型与转换（含挂起）</text>

  <!-- 创建态 -->
  <rect x="60" y="70" width="130" height="48" rx="6" fill="#64748b"/>
  <text x="125" y="99" class="state">创建态</text>
  <!-- 终止态 -->
  <rect x="690" y="70" width="130" height="48" rx="6" fill="#64748b"/>
  <text x="755" y="99" class="state">终止态</text>

  <!-- 就绪态 -->
  <rect x="250" y="180" width="140" height="48" rx="6" fill="#2563eb"/>
  <text x="320" y="209" class="state">就绪态</text>
  <!-- 运行态 -->
  <rect x="470" y="180" width="140" height="48" rx="6" fill="#059669"/>
  <text x="540" y="209" class="state">运行态</text>
  <!-- 阻塞态 -->
  <rect x="360" y="290" width="140" height="48" rx="6" fill="#d97706"/>
  <text x="430" y="319" class="state">阻塞态</text>

  <!-- 挂起状态（新增） -->
  <!-- 就绪挂起 -->
  <rect x="250" y="400" width="140" height="48" rx="6" fill="#93c5fd" stroke="#2563eb" stroke-width="1.5"/>
  <text x="320" y="429" class="state" fill="#1e3a8a">就绪挂起</text>
  <!-- 阻塞挂起 -->
  <rect x="470" y="400" width="140" height="48" rx="6" fill="#fdba74" stroke="#d97706" stroke-width="1.5"/>
  <text x="540" y="429" class="state" fill="#7c2d12">阻塞挂起</text>

  <!-- 转换标签 -->
  <text x="195" y="140" class="lbl">创建完成</text>
  <text x="430" y="172" class="lbl">被调度（获得 CPU）</text>
  <text x="430" y="230" class="lbl">时间片到/被抢占</text>
  <text x="565" y="268" class="lbl">请求 I/O/等待事件</text>
  <text x="700" y="160" class="lbl">运行结束/出错</text>
  <text x="424" y="252" class="lbl" fill="#15803d">I/O 完成</text>

  <!-- 转换箭头 -->
  <g stroke="#334155" stroke-width="1.8" marker-end="url(#st)">
    <!-- 创建→就绪 -->
    <line x1="190" y1="94" x2="250" y2="200"/>
    <!-- 就绪→运行 -->
    <line x1="390" y1="200" x2="470" y2="200"/>
    <!-- 运行→就绪 -->
    <line x1="470" y1="220" x2="390" y2="220"/>
    <!-- 运行→阻塞 -->
    <line x1="540" y1="228" x2="460" y2="290"/>
    <!-- 阻塞→就绪：头部指向就绪态右边缘偏左(380,228) -->
    <line x1="450" y1="290" x2="380" y2="228"/>
    <!-- 运行→终止 -->
    <line x1="610" y1="180" x2="755" y2="118"/>

    <!-- 就绪 ↔ 就绪挂起：两条垂直平行线 -->
    <!-- 挂起（就绪→就绪挂起）左线 -->
    <line x1="300" y1="228" x2="300" y2="400"/>
    <!-- 激活（就绪挂起→就绪）右线 -->
    <line x1="340" y1="400" x2="340" y2="228"/>

    <!-- 阻塞 ↔ 阻塞挂起：两条平行斜线 -->
    <!-- 挂起（阻塞→阻塞挂起）：起点沿阻塞态底边左移到(490,338)，与激活线平行 -->
    <line x1="490" y1="338" x2="480" y2="400"/>
    <!-- 激活（阻塞挂起→阻塞）：回到阻塞态(500,338) -->
    <line x1="510" y1="400" x2="500" y2="338"/>

    <!-- 阻塞挂起→就绪挂起（事件完成） -->
    <line x1="470" y1="424" x2="390" y2="424"/>
  </g>

  <!-- 挂起/激活标签（放在对应线上） -->
  <text x="286" y="318" class="lbl" fill="#1e3a8a">挂起</text>
  <text x="352" y="318" class="lbl" fill="#1e3a8a">激活</text>
  <text x="484" y="362" class="lbl" fill="#7c2d12" text-anchor="middle">挂起</text>
  <text x="504" y="366" class="lbl" fill="#7c2d12" text-anchor="middle">激活</text>
  <text x="430" y="416" class="lbl">事件完成</text>

  <text x="440" y="490" class="note" text-anchor="middle">挂起（suspend）：把进程从内存调到外存，节省内存；激活（activate）：调回内存。挂起后进程不在内存，不能被调度</text>
  <text x="440" y="510" class="note" text-anchor="middle">就绪态 ↔ 运行态可互转；阻塞态必须经就绪态才能进入运行态；阻塞挂起的事件完成后先转就绪挂起</text>
</svg>`,
        },
        {
          id: 'kb-os-process-2-4',
          type: 'callout',
          title: '阻塞必须经过就绪',
          text: '阻塞态进程等待的事件发生后，先进入就绪态排队，等被调度后才能运行。不存在"阻塞直接转运行"。',
          tone: 'blue',
        },
      ],
    },
    {
      id: 'os-process-ipc',
      title: '进程间的通信',
      blocks: [
        {
          id: 'kb-os-process-3-1',
          type: 'paragraph',
          text: '进程间通信（IPC）是进程之间交换数据的方式。常用方法：共享存储、消息传递、管道通信、信号。',
        },
        {
          id: 'kb-os-process-3-2',
          type: 'paragraph',
          text: '**共享存储**：多个进程共享一块内存区域，数据直接在共享空间读写，速度最快。但需要进程自身实现**同步互斥**（如用信号量控制访问），否则数据不一致。共享分两种：\n\n- **基于数据结构的共享**：如共享一个数组。\n- **基于存储区的共享**：共享一整块内存。',
        },
        {
          id: 'kb-os-process-3-3',
          type: 'paragraph',
          text: '**消息传递**：进程以**消息**为单位交换数据，由内核提供发送原语 send 和接收原语 receive。消息传递分两种：\n\n- **直接通信**：消息直接发到对方邮箱/进程。\n- **间接通信**：通过中间信箱转发。\n\n消息传递无需共享空间，适合分布式环境。',
        },
        {
          id: 'kb-os-process-3-4',
          type: 'paragraph',
          text: '**管道通信**：通过**管道**（一种共享文件/缓冲区）连接两个进程，一个写、一个读，数据先进先出。管道容量有限，写满阻塞写者，读空阻塞读者。',
        },
        {
          id: 'kb-os-process-3-5',
          type: 'paragraph',
          text: '**信号**：用于进程间**传递通知**，不传输大量数据，如 SIGINT（Ctrl+C 中断）、SIGKILL（终止进程）、SIGCHLD（子进程结束通知父进程）。信号由内核产生并递送给进程，进程可处理、忽略或阻塞。',
        },
        {
          id: 'kb-os-process-3-6',
          type: 'paragraph',
          text: '**四种 IPC 方式对比**：\n\n| 方式 | 数据量 | 同步机制 | 适合场景 |\n|---|---|---|---|\n| 共享存储 | 大 | 需自己加锁 | 大量数据、同机进程 |\n| 消息传递 | 中 | 内核协调 | 分布式、需要结构化 |\n| 管道通信 | 中 | 内核同步（阻塞） | 有血缘关系进程、流式数据 |\n| 信号 | 小（通知） | 内核异步递送 | 通知事件、异常处理 |',
        },
      ],
    },
  ],
}
