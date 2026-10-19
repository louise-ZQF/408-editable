import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const sourceToLoadArticle: KnowledgeArticleData = {
  pointId: 'co-source-to-load',
  subpoints: [
    {
      id: 'co-language-levels',
      title: '三个级别的语言',
      blocks: [
        {
          id: 'kb-co-source-to-load-1-1',
          type: 'paragraph',
          text: '**机器语言**：计算机硬件直接理解和执行的语言，用二进制代码（0 和 1）表示。与特定计算机架构紧密相关，每条机器代码对应硬件的一个操作，对人类而言阅读和编写困难。',
        },
        {
          id: 'kb-co-source-to-load-1-2',
          type: 'paragraph',
          text: '**汇编语言**：用符号和助记符代表机器语言的指令，比机器语言更容易理解和编写，仍与特定架构紧密相关。需要**汇编器**将汇编代码转换为机器代码。',
        },
        {
          id: 'kb-co-source-to-load-1-3',
          type: 'paragraph',
          text: '**高级语言**：为方便编写和理解程序而设计，与特定硬件平台相对独立。抽象度高、语法接近自然语言或数学符号。需要**编译器**或**解释器**将高级语言代码转换为机器代码。',
        },
      ],
    },
    {
      id: 'co-source-to-execute',
      title: '从源程序到可执行程序',
      blocks: [
        {
          id: 'kb-co-source-to-load-2-1',
          type: 'paragraph',
          text: '一个高级语言源程序（如 hello.c）到最终运行，要经过**预处理 → 编译 → 汇编 → 链接 → 装入执行**五步：',
        },
        {
          id: 'kb-co-source-to-load-2-2',
          type: 'paragraph',
          text: '**① 预处理**（仅 C/C++ 等语言）：预处理器执行宏替换、文件包含、条件编译等任务，把 hello.c 变成 hello.i。',
        },
        {
          id: 'kb-co-source-to-load-2-3',
          type: 'paragraph',
          text: String.raw`**② 编译**：编译器将预处理后的源代码转换为中间代码或目标代码（通常是汇编语言代码 hello.s）。

**③ 汇编**：汇编器将汇编代码转换为机器代码，得到目标文件 hello.o。`,
        },
        {
          id: 'kb-co-source-to-load-2-4',
          type: 'paragraph',
          text: String.raw`**④ 链接**：链接器将一个或多个目标文件与所需库文件链接在一起，生成可执行文件（hello.out），确保所有函数调用都能找到内存中的正确位置。

- 静态链接：全是绝对地址。
- 动态链接：含相对地址。

**⑤ 装入执行**：操作系统加载器把可执行文件加载到内存，CPU 开始执行。`,
        },
        {
          id: 'kb-co-source-to-load-2-5',
          type: 'paragraph',
          text: '**链接方式**分三种：\n\n- **静态链接**：程序运行前把所有模块和库一次性链接成一个完整模块。\n- **装入时动态链接**：装入内存时边装入边链接，便于模块修改更新。\n- **运行时动态链接**：程序运行中需要时才链接对应模块，节省内存、可共享，如动态链接库 DLL。',
        },
        {
          id: 'kb-co-source-to-load-2-6',
          type: 'paragraph',
          text: '**装入方式**分三种：\n\n- **绝对装入**：按绝对地址直接装入，仅用于单道环境。\n- **静态重定位**：装入时一次性把逻辑地址转换为物理地址，程序运行中不能移动。\n- **动态重定位**：运行时通过重定位寄存器把逻辑地址转换为物理地址，程序可换出换入、可移动，是现代操作系统主流。',
        },
      ],
    },
    {
      id: 'co-source-memory-image',
      title: '虚拟地址空间与内存映像',
      blocks: [
        {
          id: 'kb-co-source-to-load-3-1',
          type: 'paragraph',
          text: '**虚拟地址空间**：现代操作系统为每个进程提供独立的逻辑地址空间，从 0 开始的连续地址，进程以为自己独占内存。CPU 访存时由 **MMU**（内存管理单元）把逻辑地址转换为物理地址，进程无需关心物理内存的实际布局。',
        },
        {
          id: 'kb-co-source-to-load-3-2',
          type: 'paragraph',
          text: '一个程序装入内存运行后，其**内存映像**通常由几个区域组成：\n\n- **代码段**（text）：存放程序指令，只读。\n- **数据段**（data）：存放已初始化的全局/静态变量。\n- **BSS 段**（bss）：存放未初始化的全局/静态变量。\n- **堆**（heap）：向高地址增长，存放动态分配的内存。\n- **栈**（stack）：向低地址增长，存放函数调用、局部变量。',
        },
        {
          id: 'kb-co-source-to-load-3-7',
          type: 'paragraph',
          text: '虚拟地址空间的最高地址是**内核区**，存放**操作系统内核**本身，包括：\n\n- **内核代码**：系统调用处理、进程调度、内存管理等内核函数。\n- **内核数据**：进程表、文件表、设备表等。\n- **页表**：每个进程的页表由内核维护。\n- **PCB**（进程控制块）。\n- **中断向量表**、**系统缓冲区**等。\n\n内核区对用户进程不可见、不可直接访问，用户进程只有通过**系统调用**陷入内核态才能使用这些结构。',
        },
        {
          id: 'kb-co-source-to-load-3-3',
          type: 'html',
          html: `<svg viewBox="0 0 700 520" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { font-family: system-ui, sans-serif; }
    .title { font-size: 16px; font-weight: 700; fill: #0f172a; text-anchor: middle; }
    .addr { font-size: 11px; fill: #64748b; text-anchor: middle; }
    .seg { font-size: 13px; font-weight: 700; fill: #ffffff; text-anchor: middle; }
    .note { font-size: 12px; fill: #475569; text-anchor: middle; }
    .arr { font-size: 11px; font-weight: 700; text-anchor: middle; }
  </style>
  <text x="350" y="26" class="title">程序运行的内存映像（虚拟地址空间布局）</text>

  <!-- 内核区（最高地址，紧挨栈，样式与栈一致） -->
  <rect x="140" y="40" width="240" height="70" rx="4" fill="#ed3a70ff"/>
  <text x="260" y="68" class="seg" font-size="12">内核区（操作系统内核）</text>
  <text x="260" y="88" class="seg" font-size="10">进程打开文件表、页表、PCB、</text>
  <text x="260" y="104" class="seg" font-size="10">内核数据/代码、系统缓冲区等</text>
  

  <!-- 栈（紧挨内核区下方） -->
  <rect x="140" y="110" width="240" height="80" rx="4" fill="#7c3aed"/>
  <text x="260" y="144" class="seg">栈 stack</text>
  <text x="260" y="166" class="seg" font-size="11">函数调用、局部变量、返回地址</text>
  <text x="420" y="150" class="arr" fill="#6d28d9">↓ 向低地址增长</text>

  <!-- 空区（栈堆之间） -->
  <rect x="140" y="190" width="240" height="60" fill="#f8fafc" stroke="#cbd5e1" stroke-dasharray="4,3"/>
  <text x="260" y="226" class="note">空闲区（栈与堆之间）</text>

  <!-- 堆 -->
  <rect x="140" y="250" width="240" height="70" rx="4" fill="#059669"/>
  <text x="260" y="281" class="seg">堆 heap</text>
  <text x="260" y="301" class="seg" font-size="11">动态分配的内存（malloc/new）</text>
  <text x="420" y="280" class="arr" fill="#15803d">↑ 向高地址增长</text>

  <!-- BSS -->
  <rect x="140" y="320" width="240" height="40" rx="4" fill="#d97706"/>
  <text x="260" y="345" class="seg" font-size="12">BSS 段（未初始化全局/静态变量）</text>

  <!-- 数据 -->
  <rect x="140" y="360" width="240" height="40" rx="4" fill="#d97706"/>
  <text x="260" y="385" class="seg" font-size="12">数据段 data（已初始化全局/静态变量）</text>

  <!-- 代码 -->
  <rect x="140" y="400" width="240" height="40" rx="4" fill="#2563eb"/>
  <text x="260" y="425" class="seg" font-size="12">代码段 text（程序指令，只读）</text>

  <!-- 地址标注 -->
  <text x="420" y="62" class="arr" fill="#64748b">高地址</text>
  <text x="420" y="432" class="arr" fill="#64748b">低地址</text>

  <text x="350" y="472" class="note" text-anchor="middle">内核区位于最高地址、紧挨栈，存放操作系统内核的代码与数据结构（页表、PCB、中断向量表等）</text>
  <text x="350" y="494" class="note" text-anchor="middle">用户进程虚拟地址空间从低到高：代码段 → 数据段 → BSS → 堆（↑）→ 空闲 → 栈（↓）→ 内核区</text>
</svg>`,
        },
        {
          id: 'kb-co-source-to-load-3-4',
          type: 'callout',
          title: '堆和栈的增长方向',
          text: '堆向高地址增长，栈向低地址增长，两者相向扩展，中间的空闲区供两者使用。堆满时与栈相遇表示内存耗尽。',
          tone: 'blue',
        },
        {
          id: 'kb-co-source-to-load-3-5',
          type: 'paragraph',
          text: '**按存放区域看内存映像中各区域放了什么**：\n\n| 存放区域 | 里面放什么 | 说明 |\n|---|---|---|\n| **栈 stack** | 局部变量（函数内非 static）、函数参数、返回地址 | 随函数调用分配、返回释放，向下增长 |\n| **堆 heap** | 动态分配的内存（malloc/new 得到） | 运行时分配，需手动释放，向上增长 |\n| **数据段 .data** | 已初始化的全局变量、已初始化的全局/局部 static 变量 | 编译时确定地址，生命周期贯穿整个程序 |\n| **BSS 段 .bss** | 未初始化的全局变量、未初始化的 static 变量（默认值 0） | 不占可执行文件空间，加载时清零 |\n| **只读数据段 .rodata** | 字符串常量、const 只读数据 | 只读，不可修改 |\n| **代码段 .text** | 程序指令 | 只读 |',
        },
       
      ],
    },
  ],
}
