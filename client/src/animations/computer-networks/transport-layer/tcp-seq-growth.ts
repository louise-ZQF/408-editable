import { FadeIn, Indicate, Rectangle, Shift, VGroup, linear, type Scene } from '@/animations/manim'
import type { ManimWebAnimation } from '../../types'
import { NC, nArrow, nHeading, nMono, nPacket, nText, nWire } from '../network-visuals'

type Phase = 'handshake' | 'data' | 'close'
type TcpEvent = {
  id: string
  phase: Phase
  direction: 'c2s' | 's2c'
  short: string
  wireLabel: string
  title: string
  explanation: string
}

const CX = -4.9
const SX = 4.9
const TOP = 1.25
const BOTTOM = -2.22

const EVENTS: TcpEvent[] = [
  { id: 'syn', phase: 'handshake', direction: 'c2s', short: 'SYN', wireLabel: 'SYN=1　seq=1000', title: 'C 发起连接：发送 SYN', explanation: 'SYN 用来同步 C 的初始序号 1000，并消耗这个序号；C 下次发送使用 seq=1001。' },
  { id: 'syn-ack', phase: 'handshake', direction: 's2c', short: 'SYN+ACK', wireLabel: 'SYN=1 ACK=1　seq=2000　ack_seq=1001', title: 'Si 同意连接：确认 C，并给出自己的初始序号', explanation: 'ack_seq=1001 表示已收到 C 的 SYN；Si 的 SYN 同样消耗序号 2000，所以下次 seq=2001。' },
  { id: 'ack-handshake', phase: 'handshake', direction: 'c2s', short: 'ACK', wireLabel: 'ACK=1　seq=1001　ack_seq=2001', title: 'C 返回 ACK：三次握手完成', explanation: 'ACK=1 表示 ack_seq 字段有效；纯 ACK 不携带数据，也不消耗序号。' },

  { id: 'data-1', phase: 'data', direction: 'c2s', short: '数据 1', wireLabel: 'ACK=1　seq=1001　ack_seq=2001　len=500B', title: 'C 发送第 1 个数据段', explanation: '该段承载文件字节 1001～1500；MSS=500B，因此发送后 C 的下一个 seq=1501。' },
  { id: 'ack-1', phase: 'data', direction: 's2c', short: 'ACK 1501', wireLabel: 'ACK=1　seq=2001　ack_seq=1501', title: 'Si 确认第 1 个数据段', explanation: 'ack_seq=1501 表示 1001～1500 已连续收到，并期待从 1501 开始的数据。' },
  { id: 'data-2', phase: 'data', direction: 'c2s', short: '数据 2', wireLabel: 'ACK=1　seq=1501　ack_seq=2001　len=500B', title: 'C 发送第 2 个数据段', explanation: '该段承载文件字节 1501～2000；接收窗口 1000B 等于 2 MSS，当前发送不超过窗口。' },
  { id: 'ack-2', phase: 'data', direction: 's2c', short: 'ACK 2001', wireLabel: 'ACK=1　seq=2001　ack_seq=2001', title: 'Si 确认前 1000B 文件内容', explanation: 'ack_seq=2001 表示前两个 500B 数据段已经连续收到；纯 ACK 的 seq 仍为 2001。' },
  { id: 'data-3', phase: 'data', direction: 'c2s', short: '数据 3', wireLabel: 'ACK=1　seq=2001　ack_seq=2001　len=500B', title: 'C 发送第 3 个数据段', explanation: '该段承载文件字节 2001～2500；seq 只由已发送的数据字节数推进。' },
  { id: 'ack-3', phase: 'data', direction: 's2c', short: 'ACK 2501', wireLabel: 'ACK=1　seq=2001　ack_seq=2501', title: 'Si 确认第 3 个数据段', explanation: 'Si 不封装数据，因此自己的 seq 不变；ack_seq 推进到 2501。' },
  { id: 'data-4', phase: 'data', direction: 'c2s', short: '数据 4', wireLabel: 'ACK=1　seq=2501　ack_seq=2001　len=500B', title: 'C 发送第 4 个数据段', explanation: '该段承载文件字节 2501～3000；至此 2000B 文件全部发送完毕。' },
  { id: 'ack-4', phase: 'data', direction: 's2c', short: 'ACK 3001', wireLabel: 'ACK=1　seq=2001　ack_seq=3001', title: 'Si 确认整个 2000B 文件', explanation: '从 seq=1001 开始连续收到 2000B，所以下一个期望字节编号为 3001。' },

  { id: 'fin-c', phase: 'close', direction: 'c2s', short: 'FIN', wireLabel: 'FIN=1 ACK=1　seq=3001　ack_seq=2001', title: 'C 关闭自己的发送方向', explanation: 'FIN 表示 C 不再发送数据，并像 SYN 一样消耗一个序号；C 的下一个 seq=3002。' },
  { id: 'ack-fin-c', phase: 'close', direction: 's2c', short: 'ACK 3002', wireLabel: 'ACK=1　seq=2001　ack_seq=3002', title: 'Si 确认 C 的 FIN', explanation: '确认号加 1 是因为 FIN 占用序号 3001；纯 ACK 不消耗 Si 的序号。' },
  { id: 'fin-s', phase: 'close', direction: 's2c', short: 'FIN', wireLabel: 'FIN=1 ACK=1　seq=2001　ack_seq=3002', title: 'Si 也关闭自己的发送方向', explanation: 'Si 的 FIN 使用 seq=2001，并消耗这个序号；C 下一次应确认 2002。' },
  { id: 'ack-fin-s', phase: 'close', direction: 'c2s', short: '最终 ACK', wireLabel: 'ACK=1　seq=3002　ack_seq=2002', title: 'C 返回最终 ACK：四次挥手完成', explanation: 'ack_seq=2002 确认 Si 的 FIN；纯 ACK 不再消耗新的序号。' },
]

const PHASE_NAMES: Record<Phase, string> = { handshake: '三次握手', data: '2000B 文件传输', close: '四次挥手' }
const PHASE_COLORS: Record<Phase, string> = { handshake: NC.violet, data: NC.blue, close: NC.orange }

function phaseEvents(phase: Phase) { return EVENTS.filter(event => event.phase === phase) }

function yFor(phase: Phase, index: number) {
  const count = phaseEvents(phase).length
  if (count === 1) return 0
  return TOP - index * ((TOP - BOTTOM) / (count - 1))
}

function lifelines(phase: Phase) {
  return [
    nText('客户端 C', CX, 1.92, NC.ink, 19, '800'),
    nMono('ISN = 1000', CX, 1.58, NC.blue, 11),
    nText('服务器 Si', SX, 1.92, NC.ink, 19, '800'),
    nMono('ISN = 2000', SX, 1.58, NC.green, 11),
    nWire([CX, TOP + 0.18, 0], [CX, BOTTOM - 0.32, 0], NC.ink, 3),
    nWire([SX, TOP + 0.18, 0], [SX, BOTTOM - 0.32, 0], NC.ink, 3),
    nText(PHASE_NAMES[phase], 0, 1.9, PHASE_COLORS[phase], 15, '800'),
  ]
}

function staticEvent(event: TcpEvent, phaseIndex: number) {
  const y = yFor(event.phase, phaseIndex)
  const startX = event.direction === 'c2s' ? CX : SX
  const endX = event.direction === 'c2s' ? SX : CX
  const color = event.direction === 'c2s' ? NC.blue : NC.green
  return new VGroup(
    nArrow([startX, y, 0], [endX, y - 0.22, 0], color, 2.3),
    nText(event.wireLabel, 0, y + 0.13, color, event.phase === 'data' ? 9 : 10, '700'),
  )
}

function legend() {
  return new VGroup(
    new Rectangle({ width: 11.0, height: 0.72, color: NC.border, fillOpacity: 0.02, strokeWidth: 1.6, center: [0, -3.02, 0] }),
    nText('SYN：同步初始序号，消耗 1 个序号', -3.9, -2.86, NC.violet, 10, '700'),
    nText('ACK：ack_seq 有效；纯 ACK 不消耗序号', -0.9, -2.86, NC.green, 10, '700'),
    nText('FIN：关闭一个方向，消耗 1 个序号', 3.55, -2.86, NC.orange, 10, '700'),
    nText('seq = 本段首字节编号　　ack_seq = 下一个期望收到的字节编号', 0, -3.18, NC.text, 10, '700'),
  )
}

function conditionPanel() {
  return new VGroup(
    nText('MSS=500B　接收窗口=1000B=2MSS　RTT=5ms　慢开始阈值=8MSS　全程无丢包/重传', 0, -2.78, NC.muted, 10, '700'),
  )
}

async function renderEvent(scene: Scene, event: TcpEvent, animate: boolean) {
  const withinPhase = phaseEvents(event.phase)
  const index = withinPhase.findIndex(item => item.id === event.id)
  scene.add(...nHeading(event.title, event.explanation), ...lifelines(event.phase), conditionPanel())
  for (let i = 0; i < index; i++) scene.add(staticEvent(withinPhase[i], i))

  const y = yFor(event.phase, index)
  const startX = event.direction === 'c2s' ? CX : SX
  const endX = event.direction === 'c2s' ? SX : CX
  const color = event.direction === 'c2s' ? NC.blue : NC.green
  if (animate) {
    const packet = nPacket(event.short, startX, y, color, 1.5)
    scene.add(packet)
    await scene.play(new Shift(packet, { direction: [endX - startX, -0.22, 0], duration: 1.0, rateFunc: linear }))
  }

  const committed = staticEvent(event, index)
  scene.add(committed)
  if (animate) {
    await scene.play(new FadeIn(committed, { duration: 0.3 }))
    const persistent = new Rectangle({ width: 5.6, height: 0.4, color, fillOpacity: 0.02, strokeWidth: 1.8, center: [0, y + 0.1, 0] })
    scene.add(persistent)
    await scene.play(new Indicate(persistent, { color, scaleFactor: 1.02, duration: 0.45 }))
  }
  scene.render()
}

export const tcpSeqGrowthAnimation: ManimWebAnimation = {
  id: 'tcp-seq-growth',
  ariaLabel: 'TCP 三次握手、2000B 文件传输与四次挥手时序动画',
  scene: { width: 1080, height: 620, frameWidth: 14, frameHeight: 7.4, backgroundColor: '#ffffff' },
  initialState: {
    id: 'tcp-overview',
    render: scene => {
      scene.add(...nHeading('TCP 完整时序：连接、传输、关闭', 'C 的 ISN=1000，Si 的 ISN=2000；连接从 C 发送 SYN 开始'), ...lifelines('handshake'), legend())
      scene.render()
    },
  },
  steps: EVENTS.map(event => ({ id: event.id, render: (scene, animate) => renderEvent(scene, event, animate) })),
}
