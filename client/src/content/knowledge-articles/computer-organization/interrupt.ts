import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'
import { interruptPriorityAnimation } from '@/animations/computer-organization/interrupt/interrupt-priority'

export const interruptArticle: KnowledgeArticleData = {
  pointId: 'co-interrupt',
  subpoints: [
    {
      id: 'co-interrupt-basic',
      title: '中断的概念与分类',
      blocks: [
        {
          id: 'kb-co-interrupt-1-1',
          type: 'paragraph',
          text: '**中断**是 CPU 在正常执行程序过程中，由外部设备或软件指令触发的事件，促使 CPU 暂停当前执行，转而响应处理该事件。',
        },
        {
          id: 'kb-co-interrupt-1-5',
          type: 'paragraph',
          text: '按来源，中断分为**外部中断**和**异常**两大类。\n\n**外部中断**来自 CPU 外部（外设、时钟、外部信号），与当前执行的指令无关。\n\n**异常**（内中断）由 CPU 内部或当前指令触发，按严重程度和处理方式又分为**故障**（fault）、**终止**（abort）和**自陷**（trap）三类。',
        },
        {
          id: 'kb-co-interrupt-1-6',
          type: 'paragraph',
          text: '| 类别 | 触发条件 | 检测时机 | 处理完后回到哪 | 是否可屏蔽 | 典型例子 |\n|---|---|---|---|---|---|\n| 外部中断 | 外部设备请求（I/O、定时器、时钟） | 当前指令执行完后检测 | 回到下一条指令 | 可屏蔽（IRQ）/ 不可屏蔽（NMI） | 键盘输入、定时器到时、网络包到达 |\n| 故障 fault | CPU 内部/当前指令引发 | 指令执行过程中检测 | 回到**当前指令**重新执行 | 不可屏蔽 | 缺页、除零、越权访问、非法指令 |\n| 终止 abort | 硬件严重错误 | 指令执行过程中检测 | **不返回**，程序无法恢复 | 不可屏蔽 | 内存校验错、总线故障、硬件错误 |\n| 自陷 trap | 程序**主动**执行陷阱指令（如 INT n、系统调用） | 指令执行后（或主动触发） | 回到下一条指令 | 不可屏蔽 | 系统调用、调试断点、INT 指令 |',
        },
        {
          id: 'kb-co-interrupt-1-2',
          type: 'paragraph',
          text: '**外部中断**按可屏蔽性分：\n\n- **可屏蔽中断**（IRQ）：可通过屏蔽字或 IF 标志暂时禁止，通常是普通外设中断。\n- **不可屏蔽中断**（NMI）：无法屏蔽，用于系统级错误（电源故障、内存校验错误），优先级最高。',
        },
        {
          id: 'kb-co-interrupt-1-3',
          type: 'paragraph',
          text: '**常见的外部中断**：键盘输入、鼠标移动、定时器到时、网络数据包到达、磁盘 I/O 完成、打印机就绪。\n\n**常见的异常**：\n\n- 故障：缺页、除零、非法指令、越权访问、溢出。\n- 终止：内存校验错误、总线错误。\n- 自陷：系统调用 INT、调试断点。',
        },
        {
          id: 'kb-co-interrupt-1-4',
          type: 'callout',
          title: '故障 vs 自陷 vs 终止',
          text: '故障处理完回到当前指令重做；自陷处理完回到下一条指令；终止无法恢复不返回。检测时机：故障和终止在指令执行中，自陷在指令执行后，外部中断在指令执行完后。',
          tone: 'orange',
        },
      ],
    },
    {
      id: 'co-interrupt-process',
      title: '中断处理流程',
      blocks: [
        {
          id: 'kb-co-interrupt-2-1',
          type: 'paragraph',
          text: '完整的中断处理过程：中断触发 → 中断识别 → 屏蔽处理 → 保存断点 → 中断服务寻址 → 执行中断服务程序 → 中断返回。',
        },
        {
          id: 'kb-co-interrupt-2-2',
          type: 'paragraph',
          text: '**保存断点**由硬件自动完成（**中断隐指令**），保存 PC、PSW 等，使中断结束后能恢复下一条指令的执行。\n\n**保存现场**在中断服务程序中由软件完成，保存程序使用的通用寄存器。',
        },
        {
          id: 'kb-co-interrupt-2-4',
          type: 'paragraph',
          text: '**中断向量表**（IVT）把中断号映射到中断处理程序入口地址。中断发生时，CPU 用中断号作为表下标找到中断向量，跳转到对应处理程序。',
        },{
          id: 'kb-co-interrupt-2-7',
          type: 'paragraph',
          text: '**中断向量**是中断服务程序入口的**地址**。\n\n中断发生时，CPU 用中断号作为下标，在**中断向量表**（IVT）中找到对应表项，表项里存的就是该中断的中断向量（一个内存地址），CPU 据此跳转到中断服务程序。',
        },
        {
          id: 'kb-co-interrupt-2-8',
          type: 'html',
          html: `<svg viewBox="0 0 860 320" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { font-family: system-ui, sans-serif; }
    .title { font-size: 18px; font-weight: 700; fill: #1e293b; text-anchor: middle; }
    .lbl { font-size: 13px; font-weight: 700; fill: #334155; text-anchor: middle; }
    .vec { font-size: 12px; font-weight: 700; text-anchor: middle; }
    .note { font-size: 14px; fill: #475569; text-anchor: middle; }
  </style>
  <defs>
    <marker id="ivtArr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#2563eb"/></marker>
    <marker id="ivtArr2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#059669"/></marker>
  </defs>
  <text x="430" y="26" class="title">中断向量 = 一个特殊的数组，每个元素都是一个中断服务程序的入口地址。</text>

  <!-- 中断号 -->
  <rect x="60" y="60" width="140" height="54" rx="6" fill="#eff6ff" stroke="#2563eb" stroke-width="1.6"/>
  <text x="130" y="83" class="lbl" fill="#1d4ed8">中断号 n</text>
  <text x="130" y="103" class="vec" fill="#475569">(如 INT 21H)</text>

  <!-- 中断向量表 -->
  <rect x="320" y="50" width="200" height="180" rx="6" fill="#f8fafc" stroke="#334155" stroke-width="1.8"/>
  <text x="420" y="72" class="lbl" fill="#0f172a">中断向量表 IVT</text>
  <!-- 下标列 -->
  <rect x="320" y="84" width="40" height="26" fill="#eef2ff" stroke="#cbd5e1"/>
  <text x="340" y="102" class="vec" fill="#1d4ed8">0</text>
  <rect x="320" y="110" width="40" height="26" fill="#eef2ff" stroke="#cbd5e1"/>
  <text x="340" y="128" class="vec" fill="#1d4ed8">1</text>
  <rect x="320" y="136" width="40" height="26" fill="#eef2ff" stroke="#cbd5e1"/>
  <text x="340" y="154" class="vec" fill="#1d4ed8">n</text>
  <rect x="320" y="162" width="40" height="26" fill="#eef2ff" stroke="#cbd5e1"/>
  <text x="340" y="180" class="vec" fill="#1d4ed8">n+1</text>
  <rect x="320" y="188" width="40" height="26" fill="#eef2ff" stroke="#cbd5e1"/>
  <text x="340" y="206" class="vec" fill="#1d4ed8">n+2</text>
  <!-- 地址列 -->
  <rect x="360" y="84" width="160" height="26" fill="#ffffff" stroke="#cbd5e1"/>
  <text x="440" y="102" class="vec" fill="#64748b">0x0040</text>
  <rect x="360" y="110" width="160" height="26" fill="#ffffff" stroke="#cbd5e1"/>
  <text x="440" y="128" class="vec" fill="#64748b">0x0044</text>
  <rect x="360" y="136" width="160" height="26" fill="#dbeafe" stroke="#2563eb" stroke-width="1.8"/>
  <text x="440" y="154" class="vec" fill="#1d4ed8">0x1234</text>
  <rect x="360" y="162" width="160" height="26" fill="#ffffff" stroke="#cbd5e1"/>
  <text x="440" y="180" class="vec" fill="#64748b">0x2000</text>
  <rect x="360" y="188" width="160" height="26" fill="#ffffff" stroke="#cbd5e1"/>
  <text x="440" y="206" class="vec" fill="#64748b">0x2A00</text>

  <!-- 中断服务程序 -->
  <rect x="650" y="80" width="150" height="110" rx="6" fill="#dcfce7" stroke="#16a34a" stroke-width="1.8"/>
  <text x="725" y="120" class="lbl" fill="#15803d">中断服务程序</text>
  <text x="725" y="142" class="vec" fill="#475569">入口地址</text>
  <text x="725" y="162" class="vec" fill="#475569">0x1234</text>
  <text x="725" y="180" class="vec" fill="#475569">(ISR)</text>

  <!-- 箭头：中断号 → 向量表 -->
  <line x1="200" y1="87" x2="320" y2="87" stroke="#2563eb" stroke-width="2.2" marker-end="url(#ivtArr)"/>
  <text x="260" y="78" class="note" fill="#1d4ed8" font-size="12">查表</text>
  <!-- 箭头：向量表 → 服务程序 -->
  <line x1="520" y1="150" x2="650" y2="150" stroke="#059669" stroke-width="2.2" marker-end="url(#ivtArr2)"/>
  <text x="585" y="141" class="note" fill="#15803d" font-size="12">跳转</text>

  <text x="430" y="280" class="note" text-anchor="middle">中断向量表第 n 项存放地址 0x1234，这个地址就是中断向量，指向中断服务程序入口</text>
  <text x="430" y="302" class="note" text-anchor="middle">CPU 按中断号查表取出向量 → 跳转到该地址执行 ISR</text>
</svg>`,
        },
        {
          id: 'kb-co-interrupt-2-5',
          type: 'callout',
          title: '断点 vs 现场',
          text: '断点是中断前执行的位置（PC、PSW），由硬件保存；现场是通用寄存器的内容，由中断服务程序用软件保存。做题时注意区分两者。',
          tone: 'orange',
        },
        {
          id: 'kb-co-interrupt-2-6',
          type: 'html',
          html: `<svg viewBox="0 0 860 440" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { font-family: system-ui, sans-serif; }
    .title { font-size: 18px; font-weight: 700; fill: #1e293b; text-anchor: middle; }
    .stage-l { font-size: 15px; font-weight: 800; fill: #1d4ed8; text-anchor: middle; }
    .stage-r { font-size: 13px; font-weight: 600; fill: #334155; text-anchor: start; }
    .step { font-size: 13px; font-weight: 700; fill: #334155; text-anchor: middle; }
    .note { font-size: 14px; fill: #475569; text-anchor: middle; }
  </style>
  <text x="430" y="24" class="title">中断处理流程（10 个步骤）</text>

  <!-- 表头 -->
  <rect x="70" y="40" width="200" height="34" rx="4" fill="#eef2ff" stroke="#2563eb" stroke-width="1.5"/>
  <text x="170" y="62" class="step" fill="#1d4ed8">阶段</text>
  <rect x="270" y="40" width="520" height="34" rx="4" fill="#eef2ff" stroke="#2563eb" stroke-width="1.5"/>
  <text x="530" y="62" class="step" fill="#1d4ed8">处理步骤</text>

  <!-- 中断隐指令（合并3格，上移） -->
  <rect x="70" y="74" width="200" height="102" fill="#dbeafe" stroke="#2563eb" stroke-width="1.5"/>
  <text x="170" y="118" class="stage-l">中断隐指令</text>
  <text x="170" y="138" class="stage-l" font-size="12" fill="#475569">（硬件自动）</text>
  <rect x="270" y="74" width="520" height="34" fill="#ffffff" stroke="#cbd5e1"/>
  <text x="286" y="95" class="stage-r">① 关中断</text>
  <rect x="270" y="108" width="520" height="34" fill="#ffffff" stroke="#cbd5e1"/>
  <text x="286" y="129" class="stage-r">② 保存 PC、PSW（断点）</text>
  <rect x="270" y="142" width="520" height="34" fill="#ffffff" stroke="#cbd5e1"/>
  <text x="286" y="163" class="stage-r">③ 引出中断向量（找到服务程序入口）</text>

  <!-- 中断服务程序（合并7格，上移） -->
  <rect x="70" y="176" width="200" height="238" fill="#dcfce7" stroke="#16a34a" stroke-width="1.5"/>
  <text x="170" y="280" class="stage-l" fill="#15803d">中断服务程序</text>
  <text x="170" y="300" class="stage-l" font-size="12" fill="#475569">（软件执行）</text>
  <rect x="270" y="176" width="520" height="34" fill="#ffffff" stroke="#cbd5e1"/>
  <text x="286" y="197" class="stage-r">④ 保护现场（通用寄存器）和屏蔽字</text>
  <rect x="270" y="210" width="520" height="34" fill="#ffffff" stroke="#cbd5e1"/>
  <text x="286" y="231" class="stage-r">⑤ 开中断（允许更高优先级打断）</text>
  <rect x="270" y="244" width="520" height="34" fill="#ffffff" stroke="#cbd5e1"/>
  <text x="286" y="265" class="stage-r">⑥ 执行中断服务程序（处理中断事件）</text>
  <rect x="270" y="278" width="520" height="34" fill="#ffffff" stroke="#cbd5e1"/>
  <text x="286" y="299" class="stage-r">⑦ 关中断</text>
  <rect x="270" y="312" width="520" height="34" fill="#ffffff" stroke="#cbd5e1"/>
  <text x="286" y="333" class="stage-r">⑧ 恢复现场（通用寄存器）和屏蔽字</text>
  <rect x="270" y="346" width="520" height="34" fill="#ffffff" stroke="#cbd5e1"/>
  <text x="286" y="367" class="stage-r">⑨ 开中断</text>
  <rect x="270" y="380" width="520" height="34" fill="#ffffff" stroke="#cbd5e1"/>
  <text x="286" y="401" class="stage-r">⑩ 中断返回（IRET，恢复 PC、PSW）</text>
</svg>`,
        },
        
      ],
    },
    {
      id: 'co-interrupt-nested',
      title: '中断嵌套与中断屏蔽',
      blocks: [
        {
          id: 'kb-co-interrupt-3-1',
          type: 'paragraph',
          text: '**单重中断**：CPU 在执行中断服务程序时不响应任何新中断请求，所有中断串行处理。实现简单，进入 ISR 后关中断，处理完再开。',
        },
        {
          id: 'kb-co-interrupt-3-2',
          type: 'paragraph',
          text: '**多重中断**（中断嵌套）：允许更高优先级的中断打断当前 ISR。需要两个条件：\n\n1. 进入 ISR 后重新开中断（IF=1）。\n2. 只有更高优先级的中断才能打断。',
        },
        {
          id: 'kb-co-interrupt-3-3',
          type: 'paragraph',
          text: '**中断屏蔽字**实现多重中断的优先级控制：每个中断源对应一个屏蔽触发器，1 表示屏蔽、0 表示允许。执行某个 ISR 时，把比它优先级低的源屏蔽，让更高优先级的源能打断。',
        },
        {
          id: 'kb-co-interrupt-3-4',
          type: 'paragraph',
          text: '例如四个中断源的**响应优先级**为 A > B > C > D，通过屏蔽字把**处理优先级**调整为 A > D > C > B。执行 B 的 ISR 时装入 0100，只屏蔽 B 自身，C、D 仍可打断 B；若 C、D 同时请求，先按响应优先级进入 C，随后 D 还能继续打断 C。',
        },
        {
          id: 'kb-co-interrupt-3-5',
          type: 'callout',
          title: '响应顺序与处理顺序要分开',
          text: '中断屏蔽字不改变硬件的响应优先级，但会改变中断能否嵌套，从而改变实际处理完成的先后顺序。单重中断直接关中断，无需屏蔽字。',
          tone: 'blue',
        },
        {
          id: 'kb-co-interrupt-3-6',
          type: 'animation',
          animation: interruptPriorityAnimation,
          sourceImport: {
            path: '@/animations/computer-organization/interrupt/interrupt-priority',
            localName: 'interruptPriorityAnimation',
            kind: 'named',
          },
        },
      ],
    },
    {
      id: 'co-interrupt-privilege',
      title: '用户态与内核态',
      blocks: [
        {
          id: 'kb-co-interrupt-4-1',
          type: 'paragraph',
          text: 'CPU 执行程序时处于两种状态之一：**内核态**（核心态/管态）和**用户态**（目态）。\n\n内核态可执行所有指令、访问所有资源；用户态只能执行非特权指令、访问受限资源。两者由**程序状态字 PSW** 中的状态位区分（如 0 用户态、1 内核态）。',
        },
        {
          id: 'kb-co-interrupt-4-2',
          type: 'paragraph',
          text: '**特权指令**只能在内核态执行，如：\n\n- I/O 指令（IN/OUT，直接访问外设）。\n- 置中断屏蔽（开/关中断指令 CLI/STI）。\n- 清内存、置存储保护键。\n- 修改 PSW（切换用户态/内核态）。\n- 停机指令（HLT）。\n- 加载/重置定时器。\n- 修改页表/段表基址寄存器（如 LTR、LGDT）。\n\n**非特权指令**在用户态即可执行，如算术运算、取数存数、转移指令、访存（非 I/O）。\n\n用户态执行特权指令会触发保护异常，由系统捕获处理。',
        },
        {
          id: 'kb-co-interrupt-4-3',
          type: 'paragraph',
          text: '| 对比 | 用户态 | 内核态 |\n|---|---|---|\n| 权限 | 低，只能执行非特权指令 | 高，可执行全部指令 |\n| 资源访问 | 受限（不能直接访问硬件/内核数据） | 全部资源 |\n| 代表程序 | 用户应用程序 | 操作系统内核 |\n| 状态位 | PSW 用户态 | PSW 内核态 |',
        },
        {
          id: 'kb-co-interrupt-4-4',
          type: 'paragraph',
          text: '**用户态与内核态的转换**：\n\n- 用户态 → 内核态：通过**中断/异常/陷入**（系统调用）触发，是唯一的切换途径。\n- 内核态 → 用户态：通过中断返回（IRET）或特权指令（如修改 PSW）实现。\n\n每次系统调用、每次中断都伴随状态切换，频繁切换会带来性能开销。',
        },
      ],
    },
    {
      id: 'co-interrupt-syscall',
      title: '系统调用',
      blocks: [
        {
          id: 'kb-co-interrupt-5-1',
          type: 'paragraph',
          text: '**系统调用**是操作系统提供给应用程序使用内核服务的**接口**。应用程序在**用户态**通过**陷入指令**（trap，如 x86 的 INT n、syscall）请求内核服务，CPU 切换到**内核态**执行对应的系统调用处理程序，完成后返回用户态。\n\n系统调用是用户态进入内核态的主要途径之一。',
        },
        {
          id: 'kb-co-interrupt-5-2',
          type: 'paragraph',
          text: '**系统调用指令的特点**：\n\n1. 在用户态执行，执行后把控制交给内核，进入内核态。\n2. 指令本身不完成具体功能，只是**陷入内核**、触发状态切换的入口。\n3. 具有原子性，执行过程不可被打断。\n\n常见系统调用：进程管理（fork/exec）、内存管理（brk/mmap）、文件操作（open/read/write）、设备管理（read/write）、信息维护（getpid/time）。',
        },
        {
          id: 'kb-co-interrupt-5-3',
          type: 'paragraph',
          text: '**子程序调用**（过程调用）在**用户态**内完成，不切换状态，通过 CALL/RET 跳转。被调函数与调用者共享同一地址空间，无权限提升。\n\n**系统调用**需要**切换到内核态**，涉及状态保存与恢复、开销大，能访问内核资源。',
        },
        {
          id: 'kb-co-interrupt-5-4',
          type: 'paragraph',
          text: '| 对比 | 系统调用 | 子程序调用 |\n|---|---|---|\n| 状态 | 用户态 → 内核态 | 全程用户态 |\n| 触发 | 陷入指令（INT/syscall） | CALL 指令 |\n| 权限 | 可访问内核资源 | 只能在用户态地址空间 |\n| 开销 | 大（含状态切换） | 小 |\n| 返回 | 中断返回，恢复现场 | RET 返回 |\n| 服务对象 | 操作系统内核服务 | 用户程序内的函数 |',
        },
        {
          id: 'kb-co-interrupt-5-7',
          type: 'paragraph',
          text: '**系统调用前必须先设置参数**：用户程序执行陷入指令前，把**系统调用号**和**所需参数**放入约定位置（寄存器/参数表/栈），然后才执行陷入指令。\n\n原因：\n\n1. 陷入指令只负责"陷入内核"，本身不携带信息，内核无法知道用户要调用哪个服务、传了什么数据。\n2. 参数设置完成后，陷入指令才能把 CPU 切换到内核态，内核通过寄存器中的**系统调用号**查系统调用表定位处理程序，再读取参数执行。\n3. 参数在用户态先设置好，保证陷入后内核能立即获得完整信息。',
        },
        {
          id: 'kb-co-interrupt-5-8',
          type: 'paragraph',
          text: '**系统调用的参数传递方法**：\n\n1. **寄存器传递**：把参数放在通用寄存器中，适合参数少的情况。\n2. **参数表传递**：把参数放入内存中的一张参数表，寄存器只存放参数表的首地址，适合参数多的情况。\n3. **栈传递**：利用调用栈传递参数。\n\n系统调用号也放在寄存器中，内核据此查表定位处理程序。',
        },
        {
          id: 'kb-co-interrupt-5-10',
          type: 'html',
          html: `<svg viewBox="0 0 960 700" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { font-family: system-ui, sans-serif; }
    .title { font-size: 16px; font-weight: 700; fill: #0f172a; text-anchor: middle; }
    .box { font-size: 11.5px; font-weight: 700; fill: #ffffff; text-anchor: middle; }
    .note { font-size: 11px; fill: #64748b; text-anchor: middle; }
    .us { fill: #2563eb; }
    .us2 { fill: #7c3aed; }
    .ks { fill: #059669; }
    .tzone { font-size: 13px; font-weight: 800; }
  </style>
  <defs>
    <marker id="scD" viewBox="0 0 10 10" refX="5" refY="9" markerWidth="8" markerHeight="8" orient="auto"><path d="M0 0 L5 10 L10 0 z" fill="#334155"/></marker>
    <marker id="scA" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#334155"/></marker>
  </defs>
  <text x="480" y="26" class="title">系统调用从发出到返回的时间轴（进程申请外设I/O）</text>

  <!-- 时间轴：从上到下，底部箭头向下 -->
  <text x="48" y="60" class="tzone" fill="#64748b" text-anchor="middle">时间 ↓</text>

  <!-- 三列泳道标题 -->
  <text x="210" y="52" class="tzone" fill="#1d4ed8">用户态1</text>
  <text x="500" y="52" class="tzone" fill="#6d28d9">用户态2</text>
  <text x="790" y="52" class="tzone" fill="#15803d">内核态</text>
  <!-- 泳道分隔虚线 -->
  <line x1="340" y1="66" x2="340" y2="618" stroke="#e2e8f0" stroke-width="1.5" stroke-dasharray="5,4"/>
  <line x1="630" y1="66" x2="630" y2="618" stroke="#e2e8f0" stroke-width="1.5" stroke-dasharray="5,4"/>

  <!-- 步骤块：按时间从上到下，分列放置 -->
  <!-- ① 用户态1 -->
  <rect x="90" y="76" width="240" height="48" rx="5" class="us"/>
  <text x="210" y="94" class="box">① 进程 P 执行 read 系统调用</text>
  <text x="210" y="112" class="box">先设置系统调用号和参数</text>

  <!-- ② 用户态1 -->
  <rect x="90" y="150" width="240" height="48" rx="5" fill="#1e40af"/>
  <text x="210" y="168" class="box">② 执行陷入指令</text>
  <text x="210" y="186" class="box">(trap/syscall) 切换到内核态</text>

  <!-- ③ 内核态 -->
  <rect x="670" y="224" width="240" height="48" rx="5" class="ks"/>
  <text x="790" y="242" class="box">③ 查系统调用表</text>
  <text x="790" y="260" class="box">定位中断处理程序</text>

  <!-- ④ 内核态 -->
  <rect x="670" y="298" width="240" height="48" rx="5" class="ks"/>
  <text x="790" y="316" class="box">④ 进程 P 因等待设备 I/O</text>
  <text x="790" y="334" class="box">插入阻塞队列（睡眠）</text>

  <!-- ⑥ 用户态2 -->
  <rect x="380" y="372" width="240" height="48" rx="5" class="us2"/>
  <text x="500" y="390" class="box">⑥ 设备I/O条件已经满足</text>
  <text x="500" y="408" class="box">触发中断</text>

  <!-- 执行中断处理程序 内核态 -->
  <rect x="670" y="372" width="240" height="48" rx="5" class="ks"/>
  <text x="790" y="390" class="box">执行中断处理程序</text>
  <text x="790" y="408" class="box">读入系统缓冲区</text>

  <!-- ⑦ 内核态 -->
  <rect x="670" y="446" width="240" height="48" rx="5" class="ks"/>
  <text x="790" y="464" class="box">⑦ 字符就绪，进程 P</text>
  <text x="790" y="482" class="box">插入就绪队列（唤醒）</text>

  <!-- ⑧ 用户态1 -->
  <rect x="90" y="520" width="240" height="48" rx="5" class="us"/>
  <text x="210" y="538" class="box">⑧ 从系统调用返回</text>
  <text x="210" y="556" class="box">回到用户态，取到字符</text>

  <!-- 连接箭头 -->
  <g stroke="#334155" stroke-width="1.8" fill="none" marker-end="url(#scA)">
    <!-- ①→② 用户态1列内 -->
    <line x1="48" y1="70" x2="48" y2="610"/>
  </g>

</svg>`,
        },
      ],
    },
  ],
}
