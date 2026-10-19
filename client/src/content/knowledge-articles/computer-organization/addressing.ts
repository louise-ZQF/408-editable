import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const addressingArticle: KnowledgeArticleData = {
  pointId: 'co-addressing',
  subpoints: [
    {
      id: 'co-addressing-intro',
      title: '寻址方式的概念',
      blocks: [
        {
          id: 'kb-co-addressing-intro-1',
          type: 'paragraph',
          text: '**寻址方式**指指令中如何指定操作数的位置或地址。寻址方式是针对每一个操作数而言的，不是针对整条指令。',
        },
        {
          id: 'kb-co-addressing-common-10',
          type: 'paragraph',
          text: '| 寻址方式 | 特点 | 示例 | 访问内存次数 |\n|----------|------|------|------|\n| 立即寻址 | 操作数在指令中 | MOV R1, #5 | 0 |\n| 寄存器寻址 | 操作数在寄存器 | ADD R1, R2 | 0 |\n| 直接寻址 | 指令含内存地址 | MOV R1, [1000] | 1 |\n| 间接寻址 | 寄存器存操作数地址 | MOV R1, [R2] | 2（先取地址再取数据） |\n| 基址寻址 | 步骤：$EA=(BR)+A$，BR 存基地址（系统设定、基本不变），A 为指令中的偏移量；场景：程序重定位、多道程序，程序整体搬移时只改 BR，指令中的偏移不变 | MOV R1, [R2+4] | 1 |\n| 变址寻址 | 步骤：$EA=A+(IX)$，A 为指令中的基准地址，IX 存变址值（循环中自增/自减）；场景：数组/表格访问，基准地址固定，逐个处理连续元素 | MOV R1, [R2+R3] | 1 |\n| 相对寻址 | 步骤：$EA=(PC)+A$，取指后 PC 已指向下一条指令，A 为相对偏移量；场景：转移/跳转指令，代码重定位时相对位置不变 | JMP LABEL | 1 |\n| 堆栈寻址 | 栈指针访问 | PUSH R1 | 1 |\n\n基址、变址、相对寻址都是 EA = 寄存器 + 偏移，区别在谁变：\n\n- 基址寻址：由系统改基址寄存器，面向程序重定位。\n- 变址寻址：由用户改变址寄存器，面向数组循环。\n- 相对寻址：把 PC 当基址寄存器，面向跳转。\n\n按访问内存次数分：\n\n- 立即寻址、寄存器寻址：操作数在 CPU 内，不需要访问内存。\n- 直接、基址、变址、相对、堆栈寻址：访问一次内存取操作数。\n- 间接寻址：先访问内存取出地址，再访问内存取数据，共两次。',
        },
      ],
    },
    {
      id: 'co-addressing-relative',
      title: '相对寻址的细节',
      blocks: [
        {
          id: 'kb-co-addressing-relative-1',
          type: 'paragraph',
          text: '现代主流 ISA（指令集体系结构，如 x86-64、AArch64、RISC-V）中，绝大多数跳转指令（jmp、call、branch）默认采用 PC 相对寻址。',
        },
        {
          id: 'kb-co-addressing-relative-2',
          type: 'paragraph',
          text: String.raw`汇编器生成机器码时保存的偏移量为 $offset = \text{目标地址} - \text{下一条指令地址}$。CPU 执行时计算目标地址 = 下一条指令地址 + offset。`,
        },
        {
          id: 'kb-co-addressing-relative-3',
          type: 'paragraph',
          text: '例如 je 指令在 0x1000 处、长度 2 字节，下一条指令地址（RIP）= 0x1002，机器码保存偏移 0x18，则跳转目标 = 0x1002 + 0x18 = 0x101A。',
        },
        {
          id: 'kb-co-addressing-relative-4',
          type: 'callout',
          title: 'PC 取指后自动指向下一条指令',
          text: '跳转目的地址 = 下一条指令地址 + 相对偏移，而不是跳转指令本身的地址 + 相对偏移。因为 CPU 执行到跳转指令时，PC 已经指向下一条指令了。',
          tone: 'orange',
        },
      ],
    },
  ],
}
