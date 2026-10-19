import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const functionsArticle: KnowledgeArticleData = {
  pointId: 'os-functions',
  subpoints: [
    {
      id: 'os-functions-main',
      title: '操作系统的四大功能',
      blocks: [
        {
          id: 'kb-os-functions-1-1',
          type: 'paragraph',
          text: '**处理机管理功能**：对处理机（CPU）进行分配和调度。\n\n主要任务：\n\n- **进程控制**：创建、撤销、阻塞、唤醒进程。\n- **进程同步**：协调并发进程的推进。\n- **进程通信**：进程间传递信息。\n- **处理机调度**：作业调度、进程调度，决定哪个进程占用 CPU。\n\n目标是让 CPU 高效工作，提高资源利用率。',
        },
        {
          id: 'kb-os-functions-1-2',
          type: 'paragraph',
          text: '**存储器管理功能**：对内存进行分配、回收与保护。\n\n主要任务：\n\n- **内存分配与回收**：为进程分配内存、回收进程释放的内存。\n- **地址映射**：把程序逻辑地址转换为物理地址。\n- **内存保护**：保证各进程只能访问自己的内存区域。\n- **内存扩充**：通过虚拟内存、请求分页把物理内存扩展成更大的逻辑内存。',
        },
        {
          id: 'kb-os-functions-1-3',
          type: 'paragraph',
          text: '**设备管理功能**：管理各种 I/O 设备。\n\n主要任务：\n\n- **设备分配**：按策略把设备分配给进程。\n- **设备处理**：设备驱动、中断处理、缓冲管理。\n- **虚拟设备**：通过 SPOOLing 把独占设备改造成共享设备。\n- **设备独立性**：用户用逻辑设备名访问，不依赖具体物理设备。',
        },
        {
          id: 'kb-os-functions-1-4',
          type: 'paragraph',
          text: '**文件管理功能**：管理外存上的文件信息。\n\n主要任务：\n\n- **文件存储空间管理**：分配和回收外存块。\n- **目录管理**：建立和维护目录，实现按名存取。\n- **文件读写与保护**：控制文件读写、访问权限校验。\n- **文件共享**：多个用户或进程共享文件。',
        },
        {
          id: 'kb-os-functions-1-5',
          type: 'paragraph',
          text: '| 功能 | 目标 | 主要子任务 |\n|---|---|---|\n| 处理机管理 | CPU 高效利用 | 进程控制、同步、通信、调度 |\n| 存储器管理 | 内存分配与保护 | 分配回收、地址映射、内存扩充 |\n| 设备管理 | 设备高效使用 | 设备分配、驱动、缓冲、SPOOLing |\n| 文件管理 | 按名存取文件 | 存储空间管理、目录、保护、共享 |',
        },
      ],
    },
  ],
}
