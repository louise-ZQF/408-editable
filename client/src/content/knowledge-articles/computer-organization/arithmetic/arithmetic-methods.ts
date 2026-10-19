import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'
import { multiplicationAnimation } from '@/animations/computer-organization/arithmetic/multiplication'
import { divisionAnimation } from '@/animations/computer-organization/arithmetic/division'
import { aluFlagsCircuitAnimation } from '@/animations/computer-organization/arithmetic/alu-flags-circuit'

export const arithmeticMethodsArticle: KnowledgeArticleData = {
  pointId: 'co-arithmetic-methods',
  subpoints: [
    {
      id: 'co-arithmetic-addsub',
      title: '定点数的加减法',
      blocks: [
        {
          id: 'kb-co-alu-3-1',
          type: 'paragraph',
          text: String.raw`**加减法共用一套电路**，由控制位 SUB 选择：

- SUB=0：B 原样进入加法器，最低位进位为 0，计算 $A + B$。
- SUB=1：每一位 B 都与 SUB 异或而被取反，最低位进位置 1，实际计算 $A + (\sim B) + 1 = A - B$。

组合输出稳定后，时钟沿才把完整结果写入目标寄存器。`,
        },
        {
          id: 'kb-co-arithmetic-methods-1-2',
          type: 'paragraph',
          text: '**单总线结构下执行一次加法或减法需要 2 个时钟周期**。加法器是**组合逻辑**，A、B 和进位从总线进入后，经过门电路延迟就能得到稳定结果 F。单总线同一时刻只能传送一个数据，所以分两拍完成：\n\n1. 第 1 个时钟周期：把 A、B 送上总线并完成运算，结果 F 先写入寄存器 C 暂存。\n2. 第 2 个时钟周期：把 C 中的数据放回总线，供后续指令读取。',
        },
        {
          id: 'kb-co-arithmetic-methods-1-1',
          type: 'animation',
          animation: aluFlagsCircuitAnimation,
          sourceImport: {
            path: '@/animations/computer-organization/arithmetic/alu-flags-circuit',
            localName: 'aluFlagsCircuitAnimation',
            kind: 'named',
          },
        },
        
      ],
    },
    {
      id: 'co-arithmetic-mul',
      title: '定点数的乘法',
      blocks: [
        {
          id: 'kb-co-alu-3-2',
          type: 'paragraph',
          text: '**顺序乘法器**复用一个 ALU，控制器直接读取乘数/乘积寄存器 $Y$ 的当前最低位：\n\n- 最低位为 1 时，ALU 把被乘数寄存器 $X$ 加到部分积寄存器 $P$。\n- 最低位为 0 时，跳过加法。\n\n随后 $C:P:Y$ 作为一个整体右移，计数器减 1。右移完成后，再读取 $Y$ 此时的最低位决定下一轮操作。',
        },
        {
          id: 'kb-co-alu-3-6',
          type: 'animation',
          animation: multiplicationAnimation,
          sourceImport: {
            path: '@/animations/computer-organization/arithmetic/multiplication',
            localName: 'multiplicationAnimation',
            kind: 'named',
          },
        },
        {
          id: 'kb-co-arithmetic-methods-1-4',
          type: 'paragraph',
          text: '**阵列乘法器**用一组与门同时产生所有部分积，再通过多个加法器阵列并行累加，是**组合逻辑**电路。它不需要像顺序乘法器那样逐位循环右移，一次组合运算就能得到乘积。$n$ 位乘法需要 $n^2$ 个与门和大量加法器，速度远快于顺序乘法器，但硬件开销大，适合追求速度的场景。',
        },
      ],
    },
    {
      id: 'co-arithmetic-div',
      title: '定点数的除法',
      blocks: [
        {
          id: 'kb-co-alu-3-3',
          type: 'paragraph',
          text: String.raw`**顺序除法器**通过左移、比较和相减逐位产生商：R:Q 先整体左移，再判断当前余数 R 能不能减除数 M。

- 若 $R \ge M$：执行 $R - M$，写商位 1。
- 若 $R < M$：R 保持不变，写商位 0。

运算结束后，Q 寄存器保存商，R 寄存器保存余数。`,
        },
        {
          id: 'kb-co-alu-3-7',
          type: 'animation',
          animation: divisionAnimation,
          sourceImport: {
            path: '@/animations/computer-organization/arithmetic/division',
            localName: 'divisionAnimation',
            kind: 'named',
          },
        },
        {
          id: 'kb-co-alu-3-9',
          type: 'paragraph',
          text: '上面介绍的是**无符号除法**。有符号与无符号的**乘法**电路可以共用（补码乘法规则一致），但**除法不能共用**：无符号除法直接比较、相减，有符号除法要考虑符号位和补码。这里只介绍无符号除法。',
        },
        {
          id: 'kb-co-alu-3-8',
          type: 'callout',
          title: '恢复余数法的硬件技巧',
          text: '教材里的恢复余数法常让 ALU 先执行 $R-M$，再根据符号位或借位判断是否够减；如果不够减，就执行 $R+M$ 把原余数恢复回来。上面的动画为了让商位的来源更直观，改写成“先比较能不能减，再决定是否相减”。两种做法在每一轮结束时得到的 R 和商位完全相同。',
          tone: 'blue',
        },
      ],
    },
  ],
}
