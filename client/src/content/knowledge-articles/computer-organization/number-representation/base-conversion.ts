import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'
import { weightPositionAnimation } from '@/animations/computer-organization/base-conversion/weight-position'

export const base_conversionArticle: KnowledgeArticleData = {
  pointId: 'co-base-conversion',
  subpoints: [
    {
      id: 'co-base-conversion-s1',
      title: '进制转换',
      blocks: [
        {
          id: 'kb-co-base-conversion-1-1',
          type: 'paragraph',
          text: '**十进制转二进制**：整数部分除 2 取余（从下到上），小数部分乘 2 取整（从上到下）。\n\n**二进制转八进制**：从低位起每 3 位一组。\n\n**二进制转十六进制**：从低位起每 4 位一组。',
        },
        {
          id: 'kb-co-base-conversion-1-2',
          type: 'paragraph',
          text: '**真值与机器数**：带符号数在机器中的表示称为机器数，常用原码、反码、补码、移码。真值就是带符号的实际数值。',
        },
        {
          id: 'kb-co-base-conversion-1-4',
          type: 'paragraph',
          text: '**二进制转十进制**：用**位权法**把每一位按位置加权求和。数位从右往左从 1 开始编号，第 $n$ 位的位权为 $2^{n-1}$。\n\n**正数**：直接按位权相加，最左边的 0 不影响数值。\n\n**负数补码**：符号位是最高有效位，位权为 $-2^{n-1}$；其余为 1 的位位权为正，逐位相加。',
        },
        {
          id: 'kb-co-base-conversion-1-41',
          type: 'paragraph',
          text: '下面的动画演示了如何使用位权法将二进制数转换为十进制数。',
        },
        {
          id: 'kb-co-base-conversion-1-3',
          type: 'animation',
          animation: weightPositionAnimation,
          sourceImport: {
            path: '@/animations/computer-organization/base-conversion/weight-position',
            localName: 'weightPositionAnimation',
            kind: 'named',
          },
        },
      ],
    },
    {
      id: 'co-type-conversion',
      title: '类型转换',
      blocks: [
        {
          id: 'kb-co-conversion-2-1',
          type: 'paragraph',
          text: '**整型转换**分两种情况。\n\n**宽窄不变**：位模式不变，只改变解释方式。例如 32 位 int 与 unsigned 互转，存储单元中的位不变，只是从补码解释改为无符号解释。\n\n**宽窄不一致**：短转长时，无符号数高位补 0（零扩展），有符号数按符号位扩展。长转短时高位截断，可能丢失数据。',
        },
        {
          id: 'kb-co-conversion-2-2',
          type: 'paragraph',
          text: String.raw`**整型转浮点**：可能出现精度丢失。float 尾数 23 位，能精确表示的整数范围有限；int 在该范围内转换不丢精度，超出范围且低位不全为 0 时丢精度。

**浮点转整型**：小数部分被截断，直接取整型部分的真值。浮点值超出整型范围时可能溢出或行为未定义。`,
        },
        {
          id: 'kb-co-conversion-2-4',
          type: 'paragraph',
          text: '隐式转换由编译器自动完成（如赋值、函数传参）。例如 `int a = 3.14f` 时，浮点数 3.14 转换为整数 3。\n\n显式转换（cast）由程序员指定。判断转换是否丢精度或溢出，依据是位模式不变原则。',
        },
      ],
    },
  ],
}
