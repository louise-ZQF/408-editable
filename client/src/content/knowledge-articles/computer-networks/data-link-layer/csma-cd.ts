import { csmaCdCollisionAnimation } from '@/animations/computer-networks/data-link-layer/csma-cd-collision'

import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const csmaCdArticle: KnowledgeArticleData = {
  pointId: 'kp-csma-cd-protocol',
  subpoints: [
    {
      id: 'csma-listen-detect',
      title: '先听后发，边发边听',
      blocks: [
        {
          id: 'kb-csma-listen-detect-1',
          type: 'paragraph',
          text: '**CSMA/CD**（载波监听多点接入 / 碰撞检测）的做法：\n\n1. **发前先听**：信道空闲才发送。\n2. **发中再听**：边发送边检测是否有其他站也在发送。\n\n一旦检测到冲突，立即停止。',
        },
        {
          id: 'kb-csma-listen-detect-2',
          type: 'paragraph',
          text: '载波监听不能消灭冲突。电磁波在总线上的传播需要时间，两个站可能同时监听到空闲并开始发送，都发出去了才发现撞了。CSMA/CD 的贡献是检测冲突并迅速止损。',
        },
        {
          id: 'kb-csma-listen-detect-3',
          type: 'paragraph',
          text: String.raw`设总线上相距最远的两个站之间的**单程传播时延**为 $\tau$。

最坏情况：A 发送后经过接近 $\tau$ 的时间，信号才到达 B；而 B 在此之前监听到空闲，也发出了帧。B 的帧与 A 的帧碰撞，碰撞信号再经过 $\tau$ 时间传回 A，A 从发出到检测到冲突最长需要 $2\tau$。`,
        },
      ],
    },
    {
      id: 'csma-contention',
      title: '争用期与最短帧长',
      blocks: [
        {
          id: 'kb-csma-contention-1',
          type: 'paragraph',
          text: String.raw`争用期（冲突窗口）$= 2\tau$。一个站发出帧后，最多经过 $2\tau$ 时间就能知道是否发生了冲突。如果 $2\tau$ 内没有检测到冲突，说明信道已被本站抢占成功，后续不会再有冲突。`,
        },
        {
          id: 'kb-csma-contention-2',
          type: 'paragraph',
          text: String.raw`帧的传输时间必须 $\geq$ 争用期。如果帧太短，发送方在 $2\tau$ 之前就已经发完，碰撞信号传回来时本站早已停止，这次冲突不会被发现，帧丢失了发送方也不知道。`,
        },
        {
          id: 'kb-csma-contention-anim',
          type: 'animation',
          animation: csmaCdCollisionAnimation,
        },
        {
          id: 'kb-csma-contention-3',
          type: 'formula',
          formula: String.raw`\text{最短帧长} = 2\tau \times \text{数据率}`,
        },
        {
          id: 'kb-csma-contention-4',
          type: 'paragraph',
          text: String.raw`**例** 10 Mbps 以太网，$2\tau = 51.2\ \mu\text{s}$（最大电缆长度 2.5 km、4 个中继器下的最坏往返时延），最短帧长 $= 51.2\ \mu\text{s} \times 10\ \text{Mbps} = 512\ \text{bit} = 64\ \text{字节}$。`,
        },
        {
          id: 'kb-csma-contention-5',
          type: 'paragraph',
          text: String.raw`接收方收到任何短于 64 字节的帧，一律当作**冲突碎片**丢弃。如果上层数据不足 64 字节，MAC 层会自动填充到 64 字节。最短帧长 $= 2\tau \times$ 数据率，因此数据率越高，最短帧长越大，或 $2\tau$ 必须相应缩小（如千兆以太网将 $2\tau$ 缩至 $0.512\ \mu\text{s}$）。`,
        },
      ],
    },
    {
      id: 'csma-backoff',
      title: '冲突停发，随机重发',
      blocks: [
        {
          id: 'kb-csma-backoff-1',
          type: 'paragraph',
          text: '检测到冲突后，站点立即停止发送，并发出一个**强化碰撞信号**（jam signal，32 或 48 比特的人为干扰），确保总线上所有站都知道发生了冲突。然后进入退避流程。',
        },
        {
          id: 'kb-csma-backoff-2',
          type: 'paragraph',
          text: '退避算法采用**截断二进制指数退避**（Truncated Binary Exponential Backoff）：',
        },
        {
          id: 'kb-csma-backoff-3',
          type: 'paragraph',
          text: String.raw`1. **基本退避时间**取 $2\tau$（争用期），称为一个**时隙**（slot time）。

2. 设已冲突 $k$ 次（$k = 1, 2, 3, \ldots$），从集合 $\{0, 1, 2, \ldots, 2^{\min(k,\ 10)} - 1\}$ 中随机选一个整数 $r$。

3. 等待时间 $= r \times 2\tau$（退避 $r$ 个时隙）。

4. 重传后若再冲突，$k$ 加 1，重复步骤 2–3。

5. 冲突达到 16 次仍未成功，丢弃该帧，向高层报告错误。`,
        },
        {
          id: 'kb-csma-backoff-4',
          type: 'paragraph',
          text: String.raw`"截断"指 $k$ 超过 10 后指数不再增长，$r$ 的取值范围锁定在 $\{0, \ldots, 1023\}$。第 11–16 次冲突的退避窗口和第 10 次相同。`,
        },
        {
          id: 'kb-csma-backoff-5',
          type: 'paragraph',
          text: String.raw`退避窗口随冲突次数指数增长，越堵等得越分散，降低再次冲突的概率。两台主机第一次冲突后，各从 $\{0, 1\}$ 中随机选 $r$，避开的概率为 50%。`,
        },
        {
          id: 'kb-csma-backoff-6',
          type: 'html',
          html: '<table style="width:100%;border-collapse:collapse;font-size:13px;font-family:system-ui,sans-serif;margin:0;"><thead><tr style="background:#f1f5f9;"><th style="padding:6px 8px;text-align:center;border:1px solid #e2e8f0;">冲突次数 k</th><th style="padding:6px 8px;text-align:center;border:1px solid #e2e8f0;">r 的取值范围</th><th style="padding:6px 8px;text-align:center;border:1px solid #e2e8f0;">最大退避时隙数</th><th style="padding:6px 8px;text-align:center;border:1px solid #e2e8f0;">最大等待时间（10Mbps）</th></tr></thead><tbody><tr><td style="padding:5px 8px;text-align:center;border:1px solid #e2e8f0;">1</td><td style="padding:5px 8px;text-align:center;border:1px solid #e2e8f0;">{0, 1}</td><td style="padding:5px 8px;text-align:center;border:1px solid #e2e8f0;">1</td><td style="padding:5px 8px;text-align:center;border:1px solid #e2e8f0;">51.2 μs</td></tr><tr style="background:#f8fafc;"><td style="padding:5px 8px;text-align:center;border:1px solid #e2e8f0;">2</td><td style="padding:5px 8px;text-align:center;border:1px solid #e2e8f0;">{0, 1, 2, 3}</td><td style="padding:5px 8px;text-align:center;border:1px solid #e2e8f0;">3</td><td style="padding:5px 8px;text-align:center;border:1px solid #e2e8f0;">153.6 μs</td></tr><tr><td style="padding:5px 8px;text-align:center;border:1px solid #e2e8f0;">3</td><td style="padding:5px 8px;text-align:center;border:1px solid #e2e8f0;">{0, …, 7}</td><td style="padding:5px 8px;text-align:center;border:1px solid #e2e8f0;">7</td><td style="padding:5px 8px;text-align:center;border:1px solid #e2e8f0;">358.4 μs</td></tr><tr style="background:#f8fafc;"><td style="padding:5px 8px;text-align:center;border:1px solid #e2e8f0;">…</td><td style="padding:5px 8px;text-align:center;border:1px solid #e2e8f0;">…</td><td style="padding:5px 8px;text-align:center;border:1px solid #e2e8f0;">…</td><td style="padding:5px 8px;text-align:center;border:1px solid #e2e8f0;">…</td></tr><tr><td style="padding:5px 8px;text-align:center;border:1px solid #e2e8f0;">10</td><td style="padding:5px 8px;text-align:center;border:1px solid #e2e8f0;">{0, …, 1023}</td><td style="padding:5px 8px;text-align:center;border:1px solid #e2e8f0;">1023</td><td style="padding:5px 8px;text-align:center;border:1px solid #e2e8f0;">≈ 52.4 ms</td></tr><tr style="background:#f8fafc;"><td style="padding:5px 8px;text-align:center;border:1px solid #e2e8f0;">11–16</td><td style="padding:5px 8px;text-align:center;border:1px solid #e2e8f0;">{0, …, 1023}</td><td style="padding:5px 8px;text-align:center;border:1px solid #e2e8f0;">1023</td><td style="padding:5px 8px;text-align:center;border:1px solid #e2e8f0;">≈ 52.4 ms（截断）</td></tr><tr><td style="padding:5px 8px;text-align:center;border:1px solid #e2e8f0;">≥ 16</td><td style="padding:5px 8px;text-align:center;border:1px solid #e2e8f0;" colspan="3">丢弃帧，向上层报告错误</td></tr></tbody></table>',
        },
      ],
    },
  ],
}
