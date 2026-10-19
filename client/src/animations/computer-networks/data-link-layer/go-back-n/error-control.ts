import { FadeIn, Indicate, Rectangle, Shift, Text, VGroup, linear, type Scene } from '@/animations/manim'
import type { ManimWebAnimation } from '../../../types'

/*
  GBN 差错控制（帧 5 丢失）——与 SR 动画共享相同布局，行为不同：
  - 接收窗口 = 1，失序帧直接丢弃（不缓存）
  - 累计确认 ACK n = 期望帧 n
  - 超时后退重传窗口内所有未确认帧
*/
type Slot = { seq: number; letter: string }
const SLOTS: Slot[] = [
  { seq: 0, letter: 'A' }, { seq: 1, letter: 'B' }, { seq: 2, letter: 'C' }, { seq: 3, letter: 'D' },
  { seq: 4, letter: 'E' }, { seq: 5, letter: 'F' }, { seq: 6, letter: 'G' }, { seq: 7, letter: 'H' },
  { seq: 0, letter: 'I' }, { seq: 1, letter: 'J' }, { seq: 2, letter: 'K' }, { seq: 3, letter: 'L' },
]
const SLOT_W = 0.88
const SLOT_H = 0.54
const SLOT_GAP = 0.08
const CELL_PITCH = SLOT_W + SLOT_GAP
const TOTAL_W = 12 * SLOT_W + 11 * SLOT_GAP
const X_START = -TOTAL_W / 2 + SLOT_W / 2
function slotX(i: number) { return X_START + i * CELL_PITCH }

function text(content: string, x: number, y: number, color = '#0f172a', size = 26, weight: 400 | 700 = 700) {
  return new Text({
    text: content, fontSize: size, color,
    fontFamily: 'Noto Sans SC, PingFang SC, sans-serif', fontWeight: weight.toString(),
  }).moveTo([x, y, 0])
}

function slotRect(x: number, y: number, fillColor: string, fillOp = 0.14, strokeColor = '#64748b') {
  const rect = new Rectangle({ width: SLOT_W, height: SLOT_H, strokeWidth: 2, center: [x, y, 0] })
  rect.setFill(fillColor, fillOp)
  rect.strokeColor = strokeColor
  rect.setStrokeWidth(2)
  rect.setStrokeOpacity(1)
  return rect
}

type CellStyle = { fill: string; stroke: string; fillOp: number }

function buildRow(y: number, styles: CellStyle[]): VGroup {
  const g = new VGroup()
  for (let i = 0; i < 12; i++) {
    const x = slotX(i)
    const s = styles[i]
    g.add(slotRect(x, y, s.fill, s.fillOp, s.stroke))
    g.add(text(SLOTS[i].letter, x, y, '#0f172a', 24))
  }
  return g
}

function windowFrame(y: number, startIndex: number, length: number, color: string): VGroup {
  const margin = 0.08
  const leftX = slotX(startIndex) - SLOT_W / 2 - margin
  const rightX = slotX(startIndex + length - 1) + SLOT_W / 2 + margin
  const w = rightX - leftX
  const cx = (leftX + rightX) / 2
  return new VGroup(new Rectangle({ width: w, height: SLOT_H + margin * 2, color, fillOpacity: 0, strokeWidth: 3.2, center: [cx, y, 0] }))
}

function framePacket(slotIndex: number, label: string, lost: boolean, discarded: boolean, atEnd = false) {
  const x = slotX(slotIndex)
  const yTop = 1.87 - SLOT_H / 2
  const yBot = -1.87 + SLOT_H / 2
  const color = lost ? '#dc2626' : discarded ? '#94a3b8' : '#2563eb'
  const endY = lost ? (yTop + yBot) / 2 : yBot
  const y = atEnd ? endY : yTop
  const compact = label.match(/[EFGH]/)?.[0] ?? label
  return new VGroup(
    new Rectangle({ width: 0.82, height: 0.38, color, fillOpacity: 0.14, strokeWidth: 2.2, center: [x, y, 0] }),
    text(compact, x, y, color, 13),
  )
}

function ackPacket(slotIndex: number, label: string, atEnd = false) {
  const x = slotX(slotIndex)
  const yTop = 1.87 - SLOT_H / 2
  const yBot = -1.87 + SLOT_H / 2
  return new VGroup(
    new Rectangle({ width: 0.9, height: 0.34, color: '#d97706', fillOpacity: 0.12, strokeWidth: 2, center: [x, atEnd ? yTop : yBot, 0] }),
    text(label, x, atEnd ? yTop : yBot, '#d97706', 10),
  )
}

type StepState = {
  id: string
  heading: string
  sndStyles: CellStyle[]
  rcvStyles: CellStyle[]
  sndWindow: [number, number]
  frames: { slot: number; label: string; lost: boolean; discarded: boolean }[]
  acks: { slot: number; label: string }[]
}

function defaultStyles(): { snd: CellStyle[]; rcv: CellStyle[] } {
  const snd = Array.from({ length: 12 }, () => ({ fill: '#f1f5f9', stroke: '#94a3b8', fillOp: 0.4 }))
  const rcv = Array.from({ length: 12 }, () => ({ fill: '#f1f5f9', stroke: '#94a3b8', fillOp: 0.4 }))
  return { snd, rcv }
}

/* Step 1: 0~3 已确认，发送窗口 [E,F,G,H]，接收方期望 E */
const STEP1: StepState = (() => {
  const { snd, rcv } = defaultStyles()
  for (let i = 0; i < 4; i++) {
    snd[i] = { fill: '#10b981', stroke: '#059669', fillOp: 0.26 }
    rcv[i] = { fill: '#10b981', stroke: '#059669', fillOp: 0.26 }
  }
  // rcv[4] 高亮为"期望帧"
  rcv[4] = { fill: '#3b82f6', stroke: '#2563eb', fillOp: 0.18 }
  for (let i = 4; i < 8; i++) snd[i] = { fill: '#3b82f6', stroke: '#2563eb', fillOp: 0.22 }
  return { id: 's1', heading: '初始：Wt=4，接收窗口=1，期望帧 E(4)', sndStyles: snd, rcvStyles: rcv, sndWindow: [4, 4], frames: [], acks: [] }
})()

/* Step 2: 连续发送 E,F,G,H */
const STEP2: StepState = (() => {
  const { snd, rcv } = defaultStyles()
  for (let i = 0; i < 4; i++) {
    snd[i] = { fill: '#10b981', stroke: '#059669', fillOp: 0.26 }
    rcv[i] = { fill: '#10b981', stroke: '#059669', fillOp: 0.26 }
  }
  rcv[4] = { fill: '#3b82f6', stroke: '#2563eb', fillOp: 0.18 }
  for (let i = 4; i < 8; i++) snd[i] = { fill: '#3b82f6', stroke: '#2563eb', fillOp: 0.22 }
  return {
    id: 's2', heading: '连续发送 E(4)、F(5)、G(6)、H(7)',
    sndStyles: snd, rcvStyles: rcv, sndWindow: [4, 4],
    frames: [
      { slot: 4, label: '帧 E(4)', lost: false, discarded: false },
      { slot: 5, label: '帧 F(5)', lost: false, discarded: false },
      { slot: 6, label: '帧 G(6)', lost: false, discarded: false },
      { slot: 7, label: '帧 H(7)', lost: false, discarded: false },
    ],
    acks: [],
  }
})()

/* Step 3: F(5) 丢失；E 到达；G、H 到达但被丢弃（接收窗口=1，只收期望帧） */
const STEP3: StepState = (() => {
  const { snd, rcv } = defaultStyles()
  for (let i = 0; i < 4; i++) {
    snd[i] = { fill: '#10b981', stroke: '#059669', fillOp: 0.26 }
    rcv[i] = { fill: '#10b981', stroke: '#059669', fillOp: 0.26 }
  }
  // E(4) 到达
  snd[4] = { fill: '#3b82f6', stroke: '#2563eb', fillOp: 0.22 }
  rcv[4] = { fill: '#10b981', stroke: '#059669', fillOp: 0.26 }
  // F(5) 丢失
  snd[5] = { fill: '#3b82f6', stroke: '#2563eb', fillOp: 0.22 }
  rcv[5] = { fill: '#e2e8f0', stroke: '#94a3b8', fillOp: 0.22 }
  // G(6)、H(7) 到达但被丢弃——接收方格子保持灰色（与 SR 的黄色缓存形成对比）
  snd[6] = { fill: '#3b82f6', stroke: '#2563eb', fillOp: 0.22 }
  rcv[6] = { fill: '#e2e8f0', stroke: '#94a3b8', fillOp: 0.22 }
  snd[7] = { fill: '#3b82f6', stroke: '#2563eb', fillOp: 0.22 }
  rcv[7] = { fill: '#e2e8f0', stroke: '#94a3b8', fillOp: 0.22 }
  return {
    id: 's3', heading: 'F(5) 丢失；G、H 失序到达并被丢弃',
    sndStyles: snd, rcvStyles: rcv, sndWindow: [4, 4],
    frames: [
      { slot: 4, label: '帧 E(4)', lost: false, discarded: false },
      { slot: 5, label: '帧 F(5)', lost: true, discarded: false },
      { slot: 6, label: '帧 G(丢弃)', lost: false, discarded: true },
      { slot: 7, label: '帧 H(丢弃)', lost: false, discarded: true },
    ],
    acks: [],
  }
})()

/* Step 4: 接收方反复回 ACK5（累计确认：已收 0~4，期望 5） */
const STEP4: StepState = (() => {
  const st = STEP3
  return {
    ...st, id: 's4',
    heading: '接收方重复返回 ACK5；当前仍期望帧 5',
    frames: [],
    acks: [
      { slot: 4, label: 'ACK5' },
      { slot: 6, label: 'ACK5' },
      { slot: 7, label: 'ACK5' },
    ],
  }
})()

/* Step 5: ACK5 到达 → 窗口基址滑到 5；F 超时 → 后退重传 F、G、H */
const STEP5: StepState = (() => {
  const { snd, rcv } = defaultStyles()
  for (let i = 0; i < 4; i++) {
    snd[i] = { fill: '#10b981', stroke: '#059669', fillOp: 0.26 }
    rcv[i] = { fill: '#10b981', stroke: '#059669', fillOp: 0.26 }
  }
  snd[4] = { fill: '#10b981', stroke: '#059669', fillOp: 0.26 }
  rcv[4] = { fill: '#10b981', stroke: '#059669', fillOp: 0.26 }
  // F(5) 超时红色
  snd[5] = { fill: '#ef4444', stroke: '#dc2626', fillOp: 0.24 }
  rcv[5] = { fill: '#e2e8f0', stroke: '#94a3b8', fillOp: 0.22 }
  snd[6] = { fill: '#ef4444', stroke: '#dc2626', fillOp: 0.24 }
  rcv[6] = { fill: '#e2e8f0', stroke: '#94a3b8', fillOp: 0.22 }
  snd[7] = { fill: '#ef4444', stroke: '#dc2626', fillOp: 0.24 }
  rcv[7] = { fill: '#e2e8f0', stroke: '#94a3b8', fillOp: 0.22 }
  return {
    id: 's5', heading: 'F(5) 超时：从 F 开始重传 F、G、H',
    sndStyles: snd, rcvStyles: rcv, sndWindow: [5, 4],
    frames: [
      { slot: 5, label: '重传 F(5)', lost: false, discarded: false },
      { slot: 6, label: '重传 G(6)', lost: false, discarded: false },
      { slot: 7, label: '重传 H(7)', lost: false, discarded: false },
    ],
    acks: [],
  }
})()

/* Step 6: 全部到达，累计确认 ACK0，窗口跳到下一轮 */
const STEP6: StepState = (() => {
  const { snd, rcv } = defaultStyles()
  for (let i = 0; i < 4; i++) {
    snd[i] = { fill: '#10b981', stroke: '#059669', fillOp: 0.26 }
    rcv[i] = { fill: '#10b981', stroke: '#059669', fillOp: 0.26 }
  }
  for (let i = 4; i < 8; i++) {
    snd[i] = { fill: '#10b981', stroke: '#059669', fillOp: 0.26 }
    rcv[i] = { fill: '#10b981', stroke: '#059669', fillOp: 0.26 }
  }
  return {
    id: 's6', heading: 'F、G、H 全部到达 → 累计 ACK0，窗口滑到 [I,J,K,L]',
    sndStyles: snd, rcvStyles: rcv, sndWindow: [8, 4],
    frames: [],
    acks: [{ slot: 7, label: 'ACK0（累计确认 4~7）' }],
  }
})()

const STEPS: StepState[] = [STEP1, STEP2, STEP3, STEP4, STEP5, STEP6]

async function renderStep(scene: Scene, state: StepState, stepIndex: number, animate: boolean) {
  const heading = text(`${stepIndex + 1} / ${STEPS.length}   ${state.heading}`, 0, 3.22, '#0f172a', 28)
  const lblSender = text('发送方', -TOTAL_W / 2 - 1.05, 1.87, '#1e40af', 24)
  const lblRcver = text('接收方', -TOTAL_W / 2 - 1.05, -1.87, '#1e40af', 24)
  const seqLabel = (content: string, x: number, y: number) => text(content, x, y, '#334155', 18, 400)
  const seqTop = new VGroup(...SLOTS.map((s, i) => seqLabel(String(s.seq), slotX(i), 2.54)))
  const seqBot = new VGroup(...SLOTS.map((s, i) => seqLabel(String(s.seq), slotX(i), -2.54)))
  const seqArrowTop = text('帧序号（3bit）→', -TOTAL_W / 2 - 0.6, 2.54, '#64748b', 18, 400)
  const seqArrowBot = text('帧序号（3bit）→', -TOTAL_W / 2 - 0.6, -2.54, '#64748b', 18, 400)

  const visibleState = animate && stepIndex > 0 ? STEPS[stepIndex - 1] : state
  const sndRow = buildRow(1.87, visibleState.sndStyles)
  const rcvRow = buildRow(-1.87, visibleState.rcvStyles)
  const sndWin = windowFrame(1.87, visibleState.sndWindow[0], visibleState.sndWindow[1], '#2563eb')

  const framePackets = state.frames.map(f => framePacket(f.slot, f.label, f.lost, f.discarded, !animate))
  const ackPackets = state.acks.map(a => ackPacket(a.slot, a.label, !animate))

  scene.add(heading, lblSender, lblRcver, seqTop, seqBot, seqArrowTop, seqArrowBot, sndRow, rcvRow, sndWin)
  if (animate) {
    scene.add(...framePackets, ...ackPackets)
    for (let i = 0; i < framePackets.length; i++) {
      const f = state.frames[i]
      const distance = f.lost ? -1.6 : -3.2
      await scene.play(new Shift(framePackets[i], { direction: [0, distance, 0], duration: f.lost ? 0.55 : 0.72, rateFunc: linear }))
      if (f.lost || f.discarded) await scene.play(new Indicate(framePackets[i], { color: f.lost ? '#dc2626' : '#94a3b8', scaleFactor: 1.12, duration: 0.38 }))
    }
    for (const ack of ackPackets) await scene.play(new Shift(ack, { direction: [0, 3.2, 0], duration: 0.65, rateFunc: linear }))
    const finalRows = [buildRow(1.87, state.sndStyles), buildRow(-1.87, state.rcvStyles), windowFrame(1.87, state.sndWindow[0], state.sndWindow[1], '#2563eb')]
    await scene.play(...finalRows.map(row => new FadeIn(row, { duration: 0.3 })))
  } else {
    scene.add(...framePackets, ...ackPackets)
  }
  scene.render()
}

export const gbnErrorControlAnimation: ManimWebAnimation = {
  id: 'gbn-error-control',
  ariaLabel: '后退N帧差错控制（帧 5 丢失 → 后退重传 F、G、H）',
  scene: { width: 980, height: 560, frameWidth: 14, frameHeight: 7, backgroundColor: '#ffffff' },
  initialState: { id: 'gbn-overview', render: scene => renderStep(scene, STEP1, 0, false) },
  steps: STEPS.slice(1).map((s, i) => ({ id: s.id, render: (scene, animate) => renderStep(scene, s, i + 1, animate) })),
}
