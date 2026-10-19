import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const io_methodArticle: KnowledgeArticleData = {
  pointId: 'co-io-method',
  subpoints: [
    {
      id: 'co-io-interface',
      title: 'I/O 接口与端口',
      blocks: [
        {
          id: 'kb-co-io-method-1-1',
          type: 'paragraph',
          text: '**I/O 接口**是连接主机与外设的桥梁，负责速度匹配、数据格式转换、控制和定时、错误与状态检测。设备控制器更强调控制逻辑，I/O 接口更强调连接角色，通常可视为同一实体的不同视角。',
        },
        {
          id: 'kb-co-io-method-1-2',
          type: 'paragraph',
          text: '**I/O 端口**是接口电路中 CPU 可直接访问的寄存器，分三类：\n\n- **数据端口**：存放待传输数据。\n- **状态端口**：存放忙/闲等状态，只读。\n- **控制端口**：接收控制命令，只写。',
        },
        {
          id: 'kb-co-io-method-1-3',
          type: 'paragraph',
          text: '**统一编址**（MMIO）：I/O 端口映射到内存地址空间，用**普通内存指令**访问。编程方便，不占用独立的 I/O 地址空间。\n\n**独立编址**（PMIO）：I/O 端口地址空间与内存分离，必须用 IN/OUT 指令访问。',
        },
        {
          id: 'kb-co-io-method-1-4',
          type: 'callout',
          title: '现代架构偏好 MMIO',
          text: 'ARM、RISC-V 及多数 PCIe 设备用 MMIO；传统 x86 为兼容老设备，同时支持 MMIO 和 PMIO。',
          tone: 'blue',
        },
        {
          id: 'kb-co-io-method-1-5',
          type: 'paragraph',
          text: '| | 数据线 | 控制线 | 状态线 |\n|---|---|---|---|\n| 方向 | 双向 | 主机 → 外设（输出） | 外设 → 主机（输入） |\n| 作用 | 在接口与设备间传输数据 | 主机向设备发送控制命令（启动、停止、选择） | 设备向主机报告状态（忙/闲、就绪、出错） |\n| 对应端口 | 数据端口 | 控制端口 | 状态端口 |\n| 读 / 写 | 可读可写 | 只写 | 只读 |',
        },
      ],
    },
    {
      id: 'co-io-method-4',
      title: '四种 I/O 控制方式',
      blocks: [
        {
          id: 'kb-co-io-method-2-1',
          type: 'paragraph',
          text: '| I/O 方式 | CPU 负责数据搬运 | CPU 等待设备 | 特点 |\n|----------|----------------|-------------|------|\n| 程序查询 | 是 | 是（不断轮询） | 实现最简单，CPU 利用率最低 |\n| 程序中断 | 是 | 否 | 设备完成后主动通知 CPU |\n| DMA | 否（DMA 控制器） | 否 | CPU 只负责初始化，效率高 |\n| 通道 | 否（通道负责） | 否 | 大型机使用，可管理多个设备 |',
        },
        {
          id: 'kb-co-io-method-2-2',
          type: 'paragraph',
          text: '**程序查询方式**：CPU 不断轮询设备状态寄存器，设备就绪才传输数据。实现简单，但 CPU 大量时间在等待和轮询，利用率最低。',
        },
        {
          id: 'kb-co-io-method-2-3',
          type: 'paragraph',
          text: '**程序中断方式**：设备准备好后触发中断通知 CPU，CPU 暂停当前任务响应中断，进入中断服务程序搬运数据。CPU 不需要一直等待，但每次中断只能传输少量数据，高速设备下中断开销大。',
        },
        {
          id: 'kb-co-io-method-2-4',
          type: 'paragraph',
          text: '**DMA 方式**：DMA 控制器让数据直接在 I/O 接口和主存之间传输，CPU 只在传输前配置参数、传输结束后接收完成中断，不参与数据搬运。适合高速、大批量数据传输。',
        },
        {
          id: 'kb-co-io-method-2-5',
          type: 'paragraph',
          text: '**通道方式**：通道是专门负责 I/O 的处理器（I/O 处理机），能独立执行通道程序。CPU 只需下达一次 I/O 命令，通道负责整个 I/O 过程，可同时管理多个设备，用于大型机。',
        },
        {
          id: 'kb-co-io-method-2-6',
          type: 'callout',
          title: 'CPU 参与程度逐渐降低',
          text: '程序查询：CPU 等待+搬运；程序中断：CPU 不等待但搬运；DMA：CPU 只初始化；通道：CPU 只下达任务。',
          tone: 'orange',
        },
      ],
    },
    {
      id: 'co-io-dma',
      title: 'DMA 方式的细节',
      blocks: [
        {
          id: 'kb-co-io-method-3-1',
          type: 'paragraph',
          text: '**DMA 控制器**组成：\n\n- DR：数据寄存器。\n- MAR：内存地址寄存器，每传一次自动更新。\n- DC：数据计数器，记录剩余数据量。\n- CR：命令/状态寄存器。',
        },
        {
          id: 'kb-co-io-method-3-2',
          type: 'paragraph',
          text: 'DMA 传输分三个阶段：\n\n- **预处理**：CPU 配置 DMA 参数，包括主存地址、传输长度、方向。\n- **数据传输**：DMA 在 I/O 与主存间直接搬运，修改 MAR 和 DC。\n- **后处理**：DMA 发完成中断，CPU 检查结果。',
        },
        {
          id: 'kb-co-io-method-3-3',
          type: 'paragraph',
          text: '**DMA 与 CPU 争用总线**的处理方式：\n\n- **总线独占**：DMA 独占总线，CPU 无法访存。\n- **周期挪用**：DMA 逐个窃取总线周期，CPU 空闲时仍可访存。\n- **分时多路复用**：按预定时钟周期轮流使用。',
        },
        {
          id: 'kb-co-io-method-3-6',
          type: 'paragraph',
          text: '| 争用方式 | 总线使用权 | 对 CPU 访存的影响 | 传输效率 | 适用场景 |\n|---|---|---|---|---|\n| 总线独占 | DMA 独占总线 | CPU 完全无法访存，暂停工作 | 最高（整块连续传） | 传输周期极短、要求一次完成的场合 |\n| 周期挪用 | DMA 每传一次窃用一个总线周期 | CPU 只在被窃取的周期暂停，其余时间正常访存 | 较高 | 最常用，兼顾 DMA 与 CPU |\n| 分时多路复用 | CPU 与 DMA 按固定时间片轮流 | CPU 按预定节拍访存，受时间片限制 | 中等 | 传输不太紧急、需保证 CPU 连续性的场合 |',
        },
        {
          id: 'kb-co-io-method-3-4',
          type: 'paragraph',
          text: '当 CPU 和 DMA 都需要访问主存时，**DMA 优先**：磁盘一旦开始读写必须按时完成传送，否则缓冲区数据丢失。DMA 传输过程中，CPU 只负责初始化、检查结果，不参与数据搬运。',
        },
        {
          id: 'kb-co-io-method-3-5',
          type: 'callout',
          title: 'DMA 数据是否经过 CPU',
          text: 'DMA 数据绕过 CPU 的寄存器和执行单元，但仍经过 CPU 芯片内部的互连结构和内存控制器，只是不占用 CPU 核心计算资源。',
          tone: 'blue',
        },
      ],
    },
    {
      id: 'co-io-os',
      title: 'I/O 层次与设备分类',
      blocks: [
        {
          id: 'kb-co-io-method-4-1',
          type: 'paragraph',
          text: '**I/O 软件层次**从上到下：\n\n1. **用户层 I/O 软件**：系统调用、printf/scanf。\n2. **设备独立性软件**：设备命名、缓冲、逻辑设备到物理设备的映射。\n3. **设备驱动程序**：与设备硬件直接交互，处理设备寄存器。\n4. **中断处理程序**：响应设备中断。\n5. **硬件**。',
        },
        {
          id: 'kb-co-io-method-4-5',
          type: 'html',
          html: `<svg viewBox="0 0 200 268" xmlns="http://www.w3.org/2000/svg" style="display:block;width:min(100%,380px);height:auto;margin-inline:auto">
  <style>
    text { font-family: system-ui, sans-serif; }
    .title { font-size: 12px; font-weight: 700; fill: #0f172a; text-anchor: middle; }
    .lay   { font-size: 11px; font-weight: 700; fill: #ffffff; text-anchor: middle; }
    .sub   { font-size: 8.5px; fill: #f1f5f9; text-anchor: middle; }
    .note  { font-size: 9.5px; fill: #475569; text-anchor: middle; }
  </style>

  <text x="100" y="14" class="title">I/O 软件层次（自上而下）</text>

  <g>
    <rect x="20" y="24" width="160" height="34" rx="4" fill="#2563eb"/>
    <text x="100" y="39" class="lay">用户层 I/O 软件</text>
    <text x="100" y="51" class="sub">系统调用接口、库函数</text>
  </g>

  <g>
    <rect x="20" y="64" width="160" height="38" rx="4" fill="#059669"/>
    <text x="100" y="79" class="lay">设备独立性软件</text>
    <text x="100" y="92" class="sub">命名、缓冲、分配、逻辑映射</text>
  </g>

  <g>
    <rect x="20" y="108" width="160" height="38" rx="4" fill="#d97706"/>
    <text x="100" y="123" class="lay">设备驱动程序</text>
    <text x="100" y="136" class="sub">直接操作设备寄存器</text>
  </g>

  <g>
    <rect x="20" y="152" width="160" height="38" rx="4" fill="#7c3aed"/>
    <text x="100" y="167" class="lay">中断处理程序</text>
    <text x="100" y="180" class="sub">响应中断、保存/恢复现场</text>
  </g>

  <g>
    <rect x="20" y="196" width="160" height="34" rx="4" fill="#475569"/>
    <text x="100" y="211" class="lay">硬件</text>
    <text x="100" y="223" class="sub">I/O 设备与设备控制器</text>
  </g>

</svg>`,
        },
        {
          id: 'kb-co-io-method-4-6',
          type: 'paragraph',
          text: '**用户层 I/O 软件**：提供**系统调用接口**（read、write、open 等）和**库函数**（printf、scanf、fread 等），是应用与 I/O 系统打交道的入口。用户程序通过系统调用请求 I/O，不直接接触设备。',
        },
        {
          id: 'kb-co-io-method-4-7',
          type: 'paragraph',
          text: '**设备独立性软件**（设备无关层）实现：\n\n- **设备命名**：用逻辑设备名统一命名。\n- **设备保护**：访问权限。\n- **缓冲管理**。\n- **设备分配与回收**。\n- **逻辑设备到物理设备的映射**。\n- **SPOOLing**。\n\n它向用户提供统一的设备访问方式，屏蔽不同设备的差异，使应用与具体设备无关。',
        },
        {
          id: 'kb-co-io-method-4-8',
          type: 'paragraph',
          text: '**设备驱动程序**：每个设备类型对应一个驱动程序，它是**唯一直接操作设备硬件**（设备控制器寄存器）的软件层。驱动程序把设备独立性软件传来的逻辑 I/O 命令翻译成具体设备的命令序列，并处理设备返回的状态。驱动程序出错可能导致系统崩溃。',
        },
        {
          id: 'kb-co-io-method-4-9',
          type: 'paragraph',
          text: '**中断处理程序**：设备完成 I/O 后发中断，中断处理程序按以下顺序响应：\n\n1. 保存现场。\n2. 读取设备状态。\n3. 完成数据传输或唤醒等待进程。\n4. 恢复现场。\n\n中断处理程序与设备驱动程序紧密配合，通常视为一层。',
        },
       
        {
          id: 'kb-co-io-method-4-3',
          type: 'paragraph',
          text: '**阻塞 I/O**：进程发起 I/O 后阻塞等待，直到数据就绪才返回。期间进程不占 CPU，实现简单但效率低。\n\n**非阻塞 I/O**：进程发起 I/O 后立即返回，可继续执行其他工作，之后轮询或由事件通知结果。效率高但编程复杂（如 select/poll、epoll、异步 I/O）。',
        },
        {
          id: 'kb-co-io-method-4-4',
          type: 'paragraph',
          text: '| 对比 | 阻塞 I/O | 非阻塞 I/O |\n|---|---|---|\n| 进程是否等待 | 是，阻塞直到完成 | 否，立即返回 |\n| CPU 利用率 | 等待时不占 CPU | 可以返回本进程继续做其他事 |\n| 实现复杂度 | 简单 | 复杂（轮询/回调） |\n| 适用 | 简单程序 | 高并发、高性能场景 |',
        },
      ],
    },
  ],
}
