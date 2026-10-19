import { FadeIn, Indicate, Line, Rectangle, Transform, VGroup, linear, type Scene } from '@/animations/manim'
import type { ManimWebAnimation } from '../../types'
import { NC, nHeading, nText, nWire } from '../network-visuals'

const BUS_Y = -0.1
const AX = -5.1
const BX = 5.1
const COLLISION_X = 4.25

function host(name: string, x: number, active = false) {
  return new VGroup(
    new Rectangle({ width: 0.9, height: 0.9, color: active ? NC.red : NC.ink, fillOpacity: active ? 0.12 : 0.04, strokeWidth: 2.5, center: [x, 0.85, 0] }),
    nText(name, x, 0.85, NC.ink, 22, '800'),
    nWire([x, 0.4, 0], [x, BUS_Y, 0], NC.border, 2.5),
  )
}

function base(aActive = false, bActive = false) {
  return [host('A', AX, aActive), host('B', BX, bActive), nWire([AX, BUS_Y, 0], [BX, BUS_Y, 0], NC.ink, 4)]
}

function signalBand(left: number, right: number, color: string, y = BUS_Y) {
  const width = Math.max(0.08, right - left)
  return new Rectangle({ width, height: 0.38, color, fillOpacity: 0.2, strokeWidth: 2.4, center: [(left + right) / 2, y, 0] })
}

function collisionMark() {
  return new VGroup(
    new Line({ start: [COLLISION_X - 0.23, 0.25, 0], end: [COLLISION_X + 0.23, -0.45, 0], color: NC.red, strokeWidth: 3 }),
    new Line({ start: [COLLISION_X + 0.23, 0.25, 0], end: [COLLISION_X - 0.23, -0.45, 0], color: NC.red, strokeWidth: 3 }),
    nText('碰撞', COLLISION_X, -0.72, NC.red, 14, '800'),
  )
}

async function aStarts(scene: Scene, animate: boolean) {
  scene.add(...nHeading('t = 0：A 开始发送，并且仍在持续发送', '帧不是一小块在电缆上飞行；只要 A 还没发完，信号区间的左端始终连着 A'), ...base(true, false))
  const start = signalBand(AX, animate ? AX + 0.12 : -1.2, NC.blue)
  scene.add(start, nText('A 持续输出', AX + 0.65, 0.17, NC.blue, 13, '800'))
  if (animate) await scene.play(new Transform(start, signalBand(AX, -1.2, NC.blue), { duration: 1.0, rateFunc: linear }))
  scene.render()
}

async function bStarts(scene: Scene, animate: boolean) {
  scene.add(...nHeading('接近 τ：A 的信号尚未到 B，B 监听到“空闲”', 'B 在最坏时刻开始发送；此时 A 仍未发完，蓝色信号区间仍与 A 相连'), ...base(true, true))
  const aBand = signalBand(AX, animate ? 2.9 : COLLISION_X, NC.blue)
  const bBand = signalBand(animate ? BX - 0.1 : COLLISION_X, BX, NC.red)
  scene.add(aBand, bBand, nText('A 仍在发送', AX + 1.0, 0.23, NC.blue, 13, '800'), nText('B 开始发送', BX - 0.95, -0.52, NC.red, 13, '800'))
  if (animate) {
    await scene.play(
      new Transform(aBand, signalBand(AX, COLLISION_X, NC.blue), { duration: 0.75, rateFunc: linear }),
      new Transform(bBand, signalBand(COLLISION_X, BX, NC.red), { duration: 0.75, rateFunc: linear }),
    )
  }
  scene.render()
}

async function collide(scene: Scene, animate: boolean) {
  const aBand = signalBand(AX, COLLISION_X, NC.blue)
  const bBand = signalBand(COLLISION_X, BX, NC.red)
  const mark = collisionMark()
  scene.add(...nHeading('碰撞发生：A 与 B 的信号在靠近 B 处相遇', '碰撞这一刻 A 仍在发送，所以蓝色信号必须从 A 连续延伸到碰撞点'), ...base(true, true), aBand, bBand, mark)
  const persistent = new Rectangle({ width: 1.05, height: 1.15, color: NC.red, fillOpacity: 0.03, strokeWidth: 2.5, center: [COLLISION_X, -0.1, 0] })
  scene.add(persistent)
  if (animate) await scene.play(new FadeIn(persistent, { duration: 0.25 }), new Indicate(persistent, { color: NC.red, scaleFactor: 1.08, duration: 0.55 }))
  scene.render()
}

async function returnsToA(scene: Scene, animate: boolean) {
  const aBand = signalBand(AX, COLLISION_X, NC.blue)
  const bBand = signalBand(COLLISION_X, BX, NC.red)
  const returnBand = signalBand(animate ? COLLISION_X - 0.1 : AX, COLLISION_X, NC.orange, -0.72)
  scene.add(...nHeading('碰撞信号返回 A：最迟在 2τ 时被检测', 'A 必须仍处于发送状态，才能一边发送一边检测到返回的冲突'), ...base(true, true), aBand, bBand, collisionMark(), returnBand)
  if (animate) await scene.play(new Transform(returnBand, signalBand(AX, COLLISION_X, NC.orange, -0.72), { duration: 1.15, rateFunc: linear }))
  const bracket = new VGroup(
    nWire([AX, -1.55, 0], [BX, -1.55, 0], NC.muted, 2),
    nWire([AX, -1.42, 0], [AX, -1.68, 0], NC.muted, 2),
    nWire([BX, -1.42, 0], [BX, -1.68, 0], NC.muted, 2),
    nText('最坏检测时间 = 2τ', 0, -1.9, NC.ink, 17, '800'),
    nText('发送时长 ≥ 2τ  ⇒  最短帧长 ≥ 2τ × 发送速率', 0, -2.4, NC.blue, 16, '800'),
  )
  scene.add(bracket)
  if (animate) await scene.play(new FadeIn(bracket, { duration: 0.4 }))
  scene.render()
}

export const csmaCdCollisionAnimation: ManimWebAnimation = {
  id: 'csma-cd-collision',
  ariaLabel: 'CSMA/CD 最坏情况碰撞检测动画',
  scene: { width: 940, height: 470, frameWidth: 12, frameHeight: 6, backgroundColor: '#ffffff' },
  initialState: {
    id: 'csma-overview',
    render: scene => {
      scene.add(...nHeading('CSMA/CD：为什么需要最短帧长', 'A 与 B 位于共享介质两端，单程传播时延为 τ'), ...base())
      scene.render()
    },
  },
  steps: [
    { id: 'a-starts', render: aStarts },
    { id: 'b-starts', render: bStarts },
    { id: 'collision', render: collide },
    { id: 'collision-returns', render: returnsToA },
  ],
}
