import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const isaArticle: KnowledgeArticleData = {
  pointId: 'co-isa',
  subpoints: [
    {
      id: 'co-isa-def',
      title: 'ISA 是什么',
      blocks: [
        {
          id: 'kb-co-isa-def-1',
          type: 'paragraph',
          text: '**ISA**（Instruction Set Architecture，指令集体系结构）是计算机体系结构中定义处理器指令集的规范。它是**硬件与软件之间的接口**，规定了处理器能够执行的指令集合、指令格式、寻址方式、寄存器组织、内存访问方式以及数据类型等。',
        },
        {
          id: 'kb-co-isa-def-2',
          type: 'paragraph',
          text: 'ISA 决定了软件如何与硬件交互，是编译器、操作系统和应用程序开发的基础。只要 ISA 相同，同一份机器码就能在不同厂家、不同微架构的处理器上运行。',
        },
        {
          id: 'kb-co-isa-def-3',
          type: 'callout',
          title: 'ISA 规定软硬件接口',
          text: 'ISA 规定程序员可见的接口：指令字格式与指令类型、通用寄存器的个数和位数、寻址方式、数据类型等。它不规定 CPU 内部如何实现，如时钟周期、加法器进位方式、Cache 大小。',
          tone: 'orange',
        },
      ],
    },
    {
      id: 'co-isa-vs-impl',
      title: 'ISA 与微架构实现的区别',
      blocks: [
        {
          id: 'kb-co-isa-vs-impl-1',
          type: 'paragraph',
          text: '**ISA** 是程序员和编译器可见的指令集规范，**微架构**是 CPU 的具体实现方式。同一 ISA 可以有多种微架构，例如 x86 ISA 下有 Intel 和 AMD 的不同实现。',
        },
        {
          id: 'kb-co-isa-vs-impl-2',
          type: 'paragraph',
          text: 'CPU 的时钟周期、主频、加法器的进位方式、数据通路的组织、Cache 大小都属于**微架构**，不是 ISA 规定的内容。判断某属性是否由 ISA 规定，就看它是不是程序员可见的接口约定。',
        },
        {
          id: 'kb-co-isa-vs-impl-3',
          type: 'paragraph',
          text: '常见 ISA 有 x86、ARM、RISC-V 等。ISA 关注指令集和寄存器等接口，指令系统本身是 ISA 的一部分，但 ISA 的范围更广，还包括寻址方式、数据类型、内存模型等。',
        },
      ],
    },
  ],
}
