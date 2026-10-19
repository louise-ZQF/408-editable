import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const virtualMachineArticle: KnowledgeArticleData = {
  pointId: 'os-vm',
  subpoints: [
    {
      id: 'os-vm-type1',
      title: '第一类虚拟机管理程序',
      blocks: [
        {
          id: 'kb-os-vm-1-1',
          type: 'paragraph',
          text: '**第一类虚拟机管理程序**（Type-1 Hypervisor，裸机型）直接运行在物理硬件之上，不依赖宿主操作系统。它本身就像一个精简的操作系统，直接管理和分配 CPU、内存、I/O 等物理资源，在其上创建和运行多个客户虚拟机。典型：KVM、VMware ESXi、Xen（裸机模式）、Microsoft Hyper-V。',
        },
        {
          id: 'kb-os-vm-1-2',
          type: 'paragraph',
          text: '**物理资源控制权**：第一类 VMM 直接控制全部物理硬件，不需要经过任何中间层。\n\n**资源分配方式**：VMM 直接向各虚拟机分配物理资源。\n\n**运行位置**：VMM 运行在**内核态**（最高特权级），直接访问硬件。',
        },
      ],
    },
    {
      id: 'os-vm-type2',
      title: '第二类虚拟机管理程序',
      blocks: [
        {
          id: 'kb-os-vm-2-1',
          type: 'paragraph',
          text: '**第二类虚拟机管理程序**（Type-2 Hypervisor，寄居型）运行在宿主操作系统之上，作为宿主机的一个普通应用程序。VMM 通过宿主操作系统的接口间接访问硬件，虚拟机是宿主机上的一个进程。典型：VirtualBox、VMware Workstation、Parallels Desktop。',
        },
        {
          id: 'kb-os-vm-2-2',
          type: 'paragraph',
          text: '**物理资源控制权**：第二类 VMM 没有直接硬件控制权，必须通过宿主操作系统申请和访问硬件。\n\n**资源分配方式**：VMM 向宿主机申请资源，由宿主操作系统分配物理资源，VMM 再转分配给虚拟机。\n\n**运行位置**：VMM 部分运行在用户态、部分运行在内核态。VMM 作为宿主机上的一个进程运行在用户态，但需要借助宿主内核的机制（如设备驱动、系统调用、中断处理）完成底层硬件访问，因此有一部分功能在宿主内核态中执行。',
        },
      ],
    },
    {
      id: 'os-vm-compare',
      title: '两类虚拟机管理程序的对比',
      blocks: [
        {
          id: 'kb-os-vm-3-1',
          type: 'paragraph',
          text: '| 对比维度 | 第一类（Type-1 裸机） | 第二类（Type-2 寄居） |\n|---|---|---|\n| 物理资源控制权 | 直接控制全部物理硬件 | 通过宿主操作系统间接控制 |\n| 资源分配方式 | VMM 直接分配物理资源 | 向宿主机申请，宿主机分配 |\n| 性能 | 高（无中间层开销） | 较低（经宿主操作系统转发） |\n| 可支持的虚拟机数量 | 多（资源由 VMM 全权管理） | 较少（受宿主机限制） |\n| 可迁移性 | 强（可整体迁移到其他物理机） | 弱（依赖具体宿主环境） |\n| 运行位置 | 内核态（直接访问硬件） | 部分用户态、部分内核态（借宿主内核访问硬件） |\n| 典型代表 | KVM、ESXi、Hyper-V | VirtualBox、VMware Workstation |',
        },
        {
          id: 'kb-os-vm-3-2',
          type: 'callout',
          title: '第一类更接近裸机',
          text: '第一类 VMM 没有宿主机这一中间层，资源管理直接高效，适合服务器虚拟化、云数据中心；第二类 VMM 部署简单、易于在个人桌面使用，但性能受宿主机影响。',
          tone: 'blue',
        },
      ],
    },
  ],
}
