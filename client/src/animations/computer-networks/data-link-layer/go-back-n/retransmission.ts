import { Create, FadeIn, Indicate, Line, Rectangle, Shift, Text, VGroup, linear, type Scene } from '@/animations/manim'
import type { ManimWebAnimation } from '../../../types'

type RetransmissionFrame = {
  id: string
  heading: string
  hint: string
  packets: string[]
}

function text(content: string, x: number, y: number, color = '#0f172a', size = 28) {
  return new Text({
    text: content,
    fontSize: size,
    color,
    fontFamily: 'Noto Sans SC, PingFang SC, sans-serif',
    fontWeight: '700',
  }).moveTo([x, y, 0])
}

function box(label: string, x: number, y: number, width = 1.35, color = '#183f9f') {
  const lost = label.includes('LOST')
  return new VGroup(
    new Rectangle({
      width,
      height: 0.62,
      color,
      fillOpacity: lost ? 0.12 : 0.08,
      strokeWidth: 3,
      center: [x, y, 0],
    }),
    text(label, x, y, lost ? '#9a3412' : '#0f172a', 22),
  )
}

async function renderRetransmissionFrame(scene: Scene, frame: RetransmissionFrame, stepIndex: number, animate: boolean) {
  const heading = text(stepIndex < 0 ? frame.heading : `${stepIndex + 1} / 5   ${frame.heading}`, 0, 2.48, '#0f172a', 28)
  const hint = text(frame.hint, 0, 2.02, '#64748b', 18)
  const hostA = new VGroup(
    new Rectangle({ width: 1.22, height: 0.88, color: '#183f9f', fillOpacity: 0.06, center: [-5, 0.22, 0] }),
    text('A', -5, 0.25, '#0f172a', 38),
    text('发送端', -5, -0.57, '#64748b', 17),
  )
  const hostB = new VGroup(
    new Rectangle({ width: 1.22, height: 0.88, color: '#183f9f', fillOpacity: 0.06, center: [5, 0.22, 0] }),
    text('B', 5, 0.25, '#0f172a', 38),
    text('接收端', 5, -0.57, '#64748b', 17),
  )
  const forward = new Line({ start: [-4.18, 0.78, 0], end: [4.18, 0.78, 0], color: '#94a3b8', strokeWidth: 4 })
  const backward = new Line({ start: [4.18, -1.02, 0], end: [-4.18, -1.02, 0], color: '#f59e0b', strokeWidth: 4 })
  const windowBoxes = [0, 1, 2, 3].map((value) =>
    box(String(value), -5.7 + value * 0.46, -1.92, 0.38, '#183f9f'),
  )
  const packets = frame.packets.map((packet) => {
    const isAck = packet.includes('ACK')
    const x = isAck ? 4.0 : -4.0
    const y = isAck ? -1.02 : 0.78
    const color = packet.includes('LOST') ? '#ea580c' : isAck ? '#f59e0b' : '#183f9f'
    return box(packet, x, y, packet.length > 6 ? 1.58 : 1.35, color)
  })

  scene.add(heading, hint, hostA, hostB, ...windowBoxes)
  if (animate) {
    await scene.play(new Create(forward, { duration: 0.22 }), new Create(backward, { duration: 0.22 }))
    for (let i = 0; i < packets.length; i++) {
      const label = frame.packets[i]
      scene.add(packets[i])
      await scene.play(new FadeIn(packets[i], { duration: 0.18 }))
      if (label.includes('TIMEOUT')) {
        await scene.play(new Indicate(packets[i], { color: '#ea580c', scaleFactor: 1.12, duration: 0.65 }))
      } else {
        const isAck = label.includes('ACK')
        const distance = label.includes('LOST') ? 4.0 : isAck ? -8.0 : 8.0
        await scene.play(new Shift(packets[i], { direction: [distance, 0, 0], duration: label.includes('LOST') ? 0.58 : 0.82, rateFunc: linear }))
        if (label.includes('LOST')) await scene.play(new Indicate(packets[i], { color: '#ea580c', scaleFactor: 1.15, duration: 0.42 }))
      }
    }
  } else {
    scene.add(forward, backward, ...packets)
  }
  scene.render()
}

const frames: RetransmissionFrame[] = [
  {
    id: 'send',
    heading: '连续发送 0、1、2',
    hint: '三个帧先后进入链路',
    packets: ['SEQ 0', 'SEQ 1', 'SEQ 2'],
  },
  {
    id: 'loss',
    heading: 'SEQ 1 在链路中丢失',
    hint: '后面的 SEQ 2 仍会继续传播',
    packets: ['SEQ 0', 'LOST 1', 'SEQ 2'],
  },
  {
    id: 'duplicate-ack',
    heading: 'SEQ 2 失序',
    hint: '接收方丢弃失序帧，并重复返回 ACK 0',
    packets: ['ACK 0'],
  },
  {
    id: 'timeout',
    heading: 'SEQ 1 等待超时',
    hint: '最早未确认帧的计时器到期',
    packets: ['TIMEOUT 1'],
  },
  {
    id: 'retransmit',
    heading: '从 SEQ 1 开始全部重传',
    hint: '发送方从 1 开始重传所有未确认帧：1、2、3',
    packets: ['RE 1', 'RE 2', 'RE 3'],
  },
]

export const gbnRetransmissionAnimation: ManimWebAnimation = {
  id: 'gbn-retransmission',
  ariaLabel: 'GBN 丢帧与后退重传逐步动画',
  scene: {
    width: 900,
    height: 430,
    frameWidth: 12,
    frameHeight: 6,
    backgroundColor: '#ffffff',
  },
  initialState: {
    id: 'gbn-retransmission-overview',
    render: scene => renderRetransmissionFrame(scene, {
      id: 'overview',
      heading: 'GBN 丢帧与后退重传',
      hint: '窗口覆盖 0～3；发送方可连续发出窗口内的帧',
      packets: [],
    }, -1, false),
  },
  steps: frames.map((frame, index) => ({
    id: frame.id,
    render: (scene, animate) => renderRetransmissionFrame(scene, frame, index, animate),
  })),
}
