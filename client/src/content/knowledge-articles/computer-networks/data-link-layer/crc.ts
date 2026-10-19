import { crcDivisionAnimation } from '@/animations/computer-networks/data-link-layer/crc-division'
import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const crcArticle: KnowledgeArticleData = {
  pointId: 'kp-crc',
  subpoints: [
    {
      id: 'crc-basics',
      title: 'CRC 的基本思路',
      blocks: [
        {
          id: 'kb-crc-basics-1',
          type: 'paragraph',
          text: String.raw`**CRC** 把数据看作一个二进制多项式，在尾部附加**校验码**（余数），使整个码字能被收发双方约定好的**生成多项式 $G(x)$** 整除。接收方做同样的模 2 除法——余数为 0 则无错，非 0 则出错。`,
        },
        {
          id: 'kb-crc-basics-2',
          type: 'paragraph',
          text: '模 2 除法的减法替换为**按位异或**（不进位不借位）。每次看当前被除数的最高位：\n\n1. 最高位是 1：商 1，异或除数。\n2. 最高位是 0：商 0，跳至下一位。',
        },
      ],
    },
    {
      id: 'crc-steps',
      title: 'CRC 计算步骤详解',
      blocks: [
        {
          id: 'kb-crc-steps-1',
          type: 'paragraph',
          text: String.raw`**例** 待发送数据 $M = 101001$（$k = 6$ 位），生成多项式 $G(x) = x^3 + x^2 + 1$（除数 $P = 1101$，$4$ 位），求 CRC 校验码。`,
        },
        {
          id: 'kb-crc-steps-2',
          type: 'paragraph',
          text: String.raw`$G(x)$ 最高次为 3，在 $M$ 后补 3 个 0，得到被除数 $2^3 M = 101001000$。`,
        },
        {
          id: 'kb-crc-steps-anim',
          type: 'animation',
          animation: crcDivisionAnimation,
          sourceImport: {
            path: '@/animations/computer-networks/data-link-layer/crc-division',
            localName: 'crcDivisionAnimation',
            kind: 'named',
          },
        },
        {
          id: 'kb-crc-steps-4',
          type: 'paragraph',
          text: String.raw`最终余数 001（3 位，与 $G(x)$ 次数一致）。发送码字 = 数据 + CRC = 101001001。接收方用 1101 除整个码字，余数为 0 则无错。`,
        },
      ],
    },
    {
      id: 'crc-detection',
      title: '接收方检错示例',
      blocks: [
        {
          id: 'kb-crc-det-1',
          type: 'paragraph',
          text: '接收方把收到的整个码字用同一个除数 1101 做模 2 除法。余数为 0 则无错，余数非 0 则出错丢弃。',
        },
        {
          id: 'kb-crc-det-2',
          type: 'paragraph',
          text: String.raw`**正确接收**：收到 $101001001$，除以 $1101$，余数 $= 0$，无错。`,
        },
        {
          id: 'kb-crc-det-3',
          type: 'paragraph',
          text: String.raw`**错误接收**：假设第 3 位翻转，收到 $1\underline{0}0001001$。用 $1101$ 做模 2 除法，余数 $\neq 0$，检错成功，丢弃该帧。`,
        },
        {
          id: 'kb-crc-det-4',
          type: 'callout',
          title: '余数非零即判错',
          text: String.raw`CRC 只看余数是否为零——是零则通过，非零则丢帧。CRC 不能纠错，不定位出错比特，需配合 ARQ 重传。`,
          tone: 'orange',
        },
      ],
    },
    {
      id: 'crc-capability',
      title: '检错能力',
      blocks: [
        {
          id: 'kb-crc-cap-1',
          type: 'paragraph',
          text: String.raw`CRC 的检错能力取决于生成多项式 $G(x)$。精心选择的 $G(x)$ 可以检测所有单比特错、双比特错、奇数个比特错，以及长度 $\leq r$ 的突发错误（$r$ 为 $G(x)$ 的次数）。`,
        },
        {
          id: 'kb-crc-cap-2',
          type: 'paragraph',
          text: String.raw`| 多项式 | 标准 | 用途 |
|--------|------|------|
| $x^{16} + x^{15} + x^2 + 1$ | CRC-16 | 一般通信 |
| $x^{16} + x^{12} + x^5 + 1$ | CRC-CCITT | HDLC、PPP |
| $x^{32} + x^{26} + x^{23} + x^{22} + x^{16} + x^{12} + x^{11} + x^{10} + x^8 + x^7 + x^5 + x^4 + x^2 + x + 1$ | CRC-32 | 以太网 |`,
        },
        {
          id: 'kb-crc-cap-3',
          type: 'callout',
          title: '什么是突发错误',
          text: String.raw`突发错误是一段连续比特在传输中同时出错（如噪声脉冲干扰导致连续多个比特翻转），而不是单个比特的孤立错误。CRC 能检测长度 $\leq r$ 的所有突发错误。例如 $G(x) = x^3 + x^2 + 1$（$r = 3$），任何连续 $\leq 3$ 个比特出错的帧都会被检出。`,
          tone: 'blue',
        },
        {
          id: 'kb-crc-cap-4',
          type: 'callout',
          title: 'CRC 只能检错不能纠错',
          text: 'CRC 判断余数是否为零来判定有无错误，不定位错误比特。数据链路层通常结合重传机制（ARQ）处理 CRC 检出的错误帧。',
          tone: 'orange',
        },
      ],
    },
  ],
}
