import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const featuresArticle: KnowledgeArticleData = {
  pointId: 'os-features',
  subpoints: [
    {
      id: 'os-features-s1',
      title: '操作系统的特征',
      blocks: [
        {
          id: 'kb-os-features-1-1',
          type: 'paragraph',
          text: `**宏观并行，微观并发**：同一时间间隔内多个程序交替执行，宏观上同时进行、微观上轮流占用 CPU。\n\n**并发**是逻辑上的同时，单 CPU 上分时交替。\n\n**并行**是物理上的同时，多核同时执行。`,
        },
        {
          id: 'kb-os-features-1-2',
          type: 'paragraph',
          text: '**共享**：系统中的资源可供多个并发执行的进程共同使用。共享方式分两种：\n\n- **互斥共享**：如打印机，一个进程用完另一个才能用。\n- **同时访问**：如磁盘、可重入代码，多个进程可同时读。',
        },
        {
          id: 'kb-os-features-1-3',
          type: 'paragraph',
          text: '**虚拟**：把一个物理实体变成多个逻辑上的对应物。例如：\n\n- **虚拟内存**：把一个物理内存扩展成多个逻辑内存。\n- **虚拟处理器**：把一个 CPU 虚拟成多个逻辑 CPU（分时）。\n- **虚拟设备**：用 SPOOLing 把一个独占设备变成多个逻辑设备。',
        },
        {
          id: 'kb-os-features-1-4',
          type: 'paragraph',
          text: '**异步**：进程的执行可能走走停停，以不可预知的速度向前推进。但只要运行环境相同，多次运行结果应当一致。',
        },
        {
          id: 'kb-os-features-1-5',
          type: 'paragraph',
          text: '**并发**与**共享**是操作系统最基本的特征，两者互为存在条件。没有并发就没有共享的必要。没有共享则进程之间无法交互。',
        },
      ],
    },
  ],
}
