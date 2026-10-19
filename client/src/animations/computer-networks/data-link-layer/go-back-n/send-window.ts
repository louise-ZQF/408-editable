import { Create, FadeIn, Line, Rectangle, Shift, Text, VGroup, linear, type Scene } from '@/animations/manim'
import type { ManimWebAnimation } from '../../../types'

type WindowFrame = {
  id: string
  heading: string
  hint: string
  packets: string[]
  activeWindow: boolean
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

function box(label: string, x: number, y: number, width = 1.3, color = '#183f9f') {
  return new VGroup(
    new Rectangle({
      width,
      height: 0.62,
      color,
      fillOpacity: 0.09,
      strokeWidth: 3,
      center: [x, y, 0],
    }),
    text(label, x, y, '#0f172a', 23),
  )
}

async function renderWindowFrame(scene: Scene, frame: WindowFrame, stepIndex: number, animate: boolean) {
  const heading = text(`${stepIndex + 1} / 3   ${frame.heading}`, 0, 2.48, '#0f172a', 28)
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
    box(String(value), -5.7 + value * 0.46, -1.92, 0.38, frame.activeWindow ? '#183f9f' : '#94a3b8'),
  )
  const packetTargets = frame.packets.map((_, index) => -1.8 + index * 2.15)
  const packets = frame.packets.map(packet => box(packet, -4.0, 0.78, 1.35, '#183f9f'))

  scene.add(heading, hint, hostA, hostB, ...windowBoxes)
  if (animate) {
    await scene.play(new Create(forward, { duration: 0.22 }), new Create(backward, { duration: 0.22 }))
    for (let i = 0; i < packets.length; i++) {
      scene.add(packets[i])
      await scene.play(new FadeIn(packets[i], { duration: 0.18 }))
      await scene.play(new Shift(packets[i], { direction: [packetTargets[i] + 4.0, 0, 0], duration: 0.65, rateFunc: linear }))
    }
  } else {
    scene.add(forward, backward, ...frame.packets.map((packet, index) => box(packet, packetTargets[index], 0.78, 1.35, '#183f9f')))
  }
  scene.render()
}

const frames: WindowFrame[] = [
  {
    id: 'open-window',
    heading: '建立发送窗口',
    hint: '窗口覆盖 0～3，0 是最早未确认帧',
    packets: [],
    activeWindow: false,
  },
  {
    id: 'send-first',
    heading: 'SEQ 0 进入链路',
    hint: '发送方不必停下来等待 ACK',
    packets: ['SEQ 0'],
    activeWindow: true,
  },
  {
    id: 'pipeline',
    heading: 'SEQ 0、1、2 同时在途',
    hint: '窗口内连续发送，链路保持忙碌',
    packets: ['SEQ 0', 'SEQ 1', 'SEQ 2'],
    activeWindow: true,
  },
]

export const gbnWindowAnimation: ManimWebAnimation = {
  id: 'gbn-window',
  ariaLabel: 'GBN 发送窗口逐步动画',
  scene: {
    width: 900,
    height: 430,
    frameWidth: 12,
    frameHeight: 6,
    backgroundColor: '#ffffff',
  },
  initialState: { id: 'gbn-window-overview', render: scene => renderWindowFrame(scene, frames[0], 0, false) },
  steps: frames.slice(1).map((frame, index) => ({
    id: frame.id,
    render: (scene, animate) => renderWindowFrame(scene, frame, index + 1, animate),
  })),
}
