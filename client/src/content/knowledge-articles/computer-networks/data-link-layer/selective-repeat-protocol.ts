import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'
import { srErrorControlAnimation } from '@/animations/computer-networks/data-link-layer/selective-repeat/error-control'

export const selectiveRepeatArticle: KnowledgeArticleData = {
  pointId: 'kp-selective-repeat-protocol',
  subpoints: [
    {
      id: 'sr-numbering',
      title: '帧编号与窗口大小',
      blocks: [
        {
          id: 'kb-sr-num-1',
          type: 'paragraph',
          text: '选择重传同样为帧分配序号。序号字段 n bit，可用序号 $2^n$ 个（0 到 $2^n-1$），序号循环使用。',
        },
        {
          id: 'kb-sr-num-2',
          type: 'paragraph',
          text: String.raw`选择重传中，发送窗口 $W_s$ 必须大于等于接收窗口 $W_r$（$W_s \geq W_r$），否则接收窗口大于发送窗口，接收方预留的缓存用不上。实际通常取 $W_s = W_r$。两个窗口之和不能超过序号空间总大小：$W_s + W_r \leq 2^n$。`,
        },
        {
          id: 'kb-sr-num-3',
          type: 'paragraph',
          text: String.raw`**例** 序号字段 3 bit（序号 0 到 7，共 8 个），通常取 $W_s = W_r = 4$。若误取 $W_s = W_r = 5$，则 $W_s + W_r = 10 > 8$，超过序号空间，旧帧重传会和下一轮新帧共享同一个序号，接收方无法区分。`,
        },
        {
          id: 'kb-sr-num-4',
          type: 'paragraph',
          text: String.raw`$W_s + W_r \leq 2^n$ 这一约束，是 SR 与 GBN 最根本的公式区别。

GBN 接收窗口恒为 1，发送窗口可达 $2^n - 1$。

SR 两个窗口之和受序号空间限制，通常各取 $2^{n-1}$。`,
        },
        {
          id: 'kb-sr-num-5',
          type: 'formula',
          formula: String.raw`W_s \geq W_r,\quad W_s + W_r \leq 2^n`,
        },
      ],
    },
    {
      id: 'sr-sender',
      title: 'SR 协议的发送逻辑',
      blocks: [
        {
          id: 'kb-sr-snd-1',
          type: 'paragraph',
          text: String.raw`发送方维护发送窗口 $[snd_{base},\ snd_{base}+W_s-1]$。只要窗口内还有未发送的序号，就可以把新帧送到链路上，与 GBN 一样支持流水线发送。`,
        },
        {
          id: 'kb-sr-snd-2',
          type: 'paragraph',
          text: '**每个帧独立启动定时器**。GBN 只有一个定时器（最早未确认帧的），但 SR 窗口内每个发出的帧都有自己的计时器。这样某个帧超时，只影响它自己，其他帧即使在后面也可以照常确认。',
        },
        {
          id: 'kb-sr-snd-3',
          type: 'paragraph',
          text: String.raw`收到 ACK n 时：

1. $n$ 落在窗口内：标记该帧已确认。
2. $n$ 恰好等于 $snd_{base}$（窗口最左端的帧终于确认）：窗口前端向前滑动，直到遇到下一个未确认的序号为止。

滑动可能一次前进多格，也可能只前进一格，取决于哪些帧先收到确认。`,
        },
        {
          id: 'kb-sr-snd-4',
          type: 'paragraph',
          text: '帧 n 超时只重传帧 n。发送方不后退，不重传窗口内其他已发送帧，只重传出错的那一个帧。',
        },
      ],
    },
    {
      id: 'sr-receiver',
      title: 'SR 协议的接收逻辑',
      blocks: [
        {
          id: 'kb-sr-rcv-1',
          type: 'paragraph',
          text: String.raw`接收方维护接收窗口 $[rcv_{base},\ rcv_{base}+W_r-1]$。$W_r > 1$ 是接收方有缓存能力的直接体现。

GBN $W_r = 1$，只能按序接收。SR $W_r$ 与发送窗口等大，允许失序帧暂存。`,
        },
        {
          id: 'kb-sr-rcv-2',
          type: 'paragraph',
          text: '接收方对每个到达的帧依次处理：',
        },
        {
          id: 'kb-sr-rcv-3',
          type: 'paragraph',
          text: String.raw`1. 序号落在接收窗口内。若等于窗口最左端（$rcv_{base}$），接收成功并窗口前移；若大于 $rcv_{base}$（失序到达），缓存该帧，不交付上层，等待前面的帧补齐。

2. 序号小于 $rcv_{base}$（已交付过）。帧是过期重复，丢弃即可，但仍回一个对应 ACK，告诉发送方它早已收到，避免发送方等不到确认误判。

3. 序号落在窗口之外且不是过期帧。这种情况不应发生，属于异常，直接丢弃。

4. 帧在传播过程中损坏。返回 **NAK** 主动否认该帧，发送方收到后立即重传该帧。`,
        },
        {
          id: 'kb-sr-rcv-4',
          type: 'paragraph',
          text: '**SR 使用逐个确认**，不是累计确认。每个帧独立回 ACK n，ACK n 的含义是"帧 n 已正确收到"。与 GBN 累计确认（ACK n = 期望帧 n）的语义完全不同，考试中必须看清上下文。',
        },
        {
          id: 'kb-sr-rcv-5',
          type: 'paragraph',
          text: '当接收窗口最左端的序号终于到达（或重传到位）后，接收方把连续已确认的一串帧一次性向上层交付，并把接收窗口前移到下一个未收到的序号，可能一次滑动多格。',
        },
      ],
    },
    {
      id: 'sr-error',
      title: 'SR 协议的差错控制',
      blocks: [
        {
          id: 'kb-sr-err-1',
          type: 'paragraph',
          text: String.raw`下图用 3 bit 序号、$W_s = W_r = 4$、帧 F（序号 5）丢失的场景演示 SR 的差错处理流程。重点理解：

1. G、H 失序到达时**缓存**不丢弃。
2. F 超时时**只重传 F**。
3. 重传的 F 到齐后，缓存的 G、H 才连同 F 一起交付。`,
        },
        {
          id: 'kb-sr-err-anim',
          type: 'animation',
          animation: srErrorControlAnimation,
          sourceImport: {
            path: '@/animations/computer-networks/data-link-layer/selective-repeat/error-control',
            localName: 'srErrorControlAnimation',
            kind: 'named',
          },
        },
      ],
    },
  ],
}
