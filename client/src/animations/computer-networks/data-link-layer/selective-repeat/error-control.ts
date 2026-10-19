import { FadeIn, Indicate, Rectangle, Shift, Text, VGroup, linear, type Scene } from '@/animations/manim'
import type { ManimWebAnimation } from '../../../types'

/*
  SR 差错控制（帧 5 丢失）——严格参照用户给定图示布局：
  两行格子：上方发送方（y=1.87），下方接收方（y=-1.87）
  上方数字标：0 1 2 3 4 5 6 7 0 1 2 3（y=2.54）
  下方数字标：0 1 2 3 4 5 6 7 0 1 2 3（y=-2.54）
  格内字母：A B C D E F G H I J K L
  发送窗口框：盖住 [E,F,G,H] 初始；随确认滑动
  接收窗口框：盖住 [E,F,G,H] 初始；随确认滑动
  中间链路：E/F/G/H 四帧前进箭头 + ACK4/ACK6/ACK7 虚线返回箭头 + F 丢失红色 ✗
  注意 manim-web y 轴向上为正！
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
  const rect = new Rectangle({
    width: SLOT_W, height: SLOT_H,
    strokeWidth: 2,
    center: [x, y, 0],
  })
  rect.setFill(fillColor, fillOp)
  rect.strokeColor = strokeColor
  rect.setStrokeWidth(2)
  rect.setStrokeOpacity(1)
  return rect
}

/* helper：一行 12 个格子的 frame（发送方或接收方）。返回 VGroup。 */
type CellStyle = { fill: string; stroke: string; fillOp: number }

function buildRow(
  y: number,
  styles: CellStyle[],
): VGroup {
  const g = new VGroup()
  for (let i = 0; i < 12; i++) {
    const x = slotX(i)
    const s = styles[i]
    g.add(slotRect(x, y, s.fill, s.fillOp, s.stroke))
    g.add(text(SLOTS[i].letter, x, y, '#0f172a', 24))
  }
  return g
}

function buildSeqRow(y: number): VGroup {
  const g = new VGroup()
  for (let i = 0; i < 12; i++) {
    g.add(text(String(SLOTS[i].seq), slotX(i), y, '#334155', 18, 400))
  }
  return g
}

/* 窗口框：覆盖 indices 范围的外框（比单个格子宽，带 margin） */
function windowFrame(y: number, startIndex: number, length: number, color: string): VGroup {
  const margin = 0.08
  const leftX = slotX(startIndex) - SLOT_W / 2 - margin
  const rightX = slotX(startIndex + length - 1) + SLOT_W / 2 + margin
  const width = rightX - leftX
  const centerX = (leftX + rightX) / 2
  return new VGroup(
    new Rectangle({
      width,
      height: SLOT_H + margin * 2,
      color,
      fillOpacity: 0,
      strokeWidth: 3.2,
      center: [centerX, y, 0],
    }),
  )
}

/* 数据帧箭头：发送方 slot i → 接收方 slot i 的平行四边形简化为 line + 端点框 */
function framePacket(slotIndex: number, label: string, lost: boolean, late: boolean, atEnd = false) {
  const x = slotX(slotIndex)
  const yTop = 1.87 - SLOT_H / 2
  const yBot = -1.87 + SLOT_H / 2
  const color = lost ? '#dc2626' : late ? '#d97706' : '#2563eb'
  const y = atEnd ? (lost ? (yTop + yBot) / 2 : yBot) : yTop
  const compact = label.match(/[EFGH]/)?.[0] ?? label
  return new VGroup(
    new Rectangle({ width: 0.82, height: 0.38, color, fillOpacity: 0.14, strokeWidth: 2.2, center: [x, y, 0] }),
    text(compact, x, y, color, 13),
  )
}

/* ACK 返回箭头：接收方 slot i → 发送方 slot i 的虚线 + 标签 */
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
  // 发送方每个 slot 的样式
  sndStyles: CellStyle[]
  // 接收方每个 slot 的样式
  rcvStyles: CellStyle[]
  sndWindow: [number, number] // [start, length]
  rcvWindow: [number, number]
  // 画面上的帧箭头
  frames: { slot: number; label: string; lost: boolean; late: boolean }[]
  // 画面上的 ACK 箭头
  acks: { slot: number; label: string }[]
}

/* helper：默认灰色填充，未确认 */
function defaultStyles(): { snd: CellStyle[]; rcv: CellStyle[] } {
  const snd = Array.from({ length: 12 }, () => ({ fill: '#f1f5f9', stroke: '#94a3b8', fillOp: 0.4 }))
  const rcv = Array.from({ length: 12 }, () => ({ fill: '#f1f5f9', stroke: '#94a3b8', fillOp: 0.4 }))
  return { snd, rcv }
}

/* 初始：0~3 在发送方和接收方都已确认 */
const STEP1: StepState = (() => {
  const { snd, rcv } = defaultStyles()
  for (let i = 0; i < 4; i++) {
    snd[i] = { fill: '#10b981', stroke: '#059669', fillOp: 0.26 }
    rcv[i] = { fill: '#10b981', stroke: '#059669', fillOp: 0.26 }
  }
  for (let i = 4; i < 8; i++) {
    snd[i] = { fill: '#3b82f6', stroke: '#2563eb', fillOp: 0.22 }
    rcv[i] = { fill: '#e2e8f0', stroke: '#94a3b8', fillOp: 0.22 } // 接收方窗口内尚未到
  }
  return {
    id: 's1',
    heading: '初始：3bit 序号，Wt = Wr = 4',
    sndStyles: snd,
    rcvStyles: rcv,
    sndWindow: [4, 4],
    rcvWindow: [4, 4],
    frames: [],
    acks: [],
  }
})()

const STEP2: StepState = (() => {
  const { snd, rcv } = defaultStyles()
  for (let i = 0; i < 4; i++) {
    snd[i] = { fill: '#10b981', stroke: '#059669', fillOp: 0.26 }
    rcv[i] = { fill: '#10b981', stroke: '#059669', fillOp: 0.26 }
  }
  for (let i = 4; i < 8; i++) {
    snd[i] = { fill: '#3b82f6', stroke: '#2563eb', fillOp: 0.22 }
    rcv[i] = { fill: '#e2e8f0', stroke: '#94a3b8', fillOp: 0.22 }
  }
  return {
    id: 's2',
    heading: '连续发出帧 4、5、6、7（E、F、G、H）',
    sndStyles: snd,
    rcvStyles: rcv,
    sndWindow: [4, 4],
    rcvWindow: [4, 4],
    frames: [
      { slot: 4, label: '帧 E(4)', lost: false, late: false },
      { slot: 5, label: '帧 F(5)', lost: false, late: false },
      { slot: 6, label: '帧 G(6)', lost: false, late: false },
      { slot: 7, label: '帧 H(7)', lost: false, late: false },
    ],
    acks: [],
  }
})()

const STEP3: StepState = (() => {
  const { snd, rcv } = defaultStyles()
  for (let i = 0; i < 4; i++) {
    snd[i] = { fill: '#10b981', stroke: '#059669', fillOp: 0.26 }
    rcv[i] = { fill: '#10b981', stroke: '#059669', fillOp: 0.26 }
  }
  // E(4) 到达
  snd[4] = { fill: '#3b82f6', stroke: '#2563eb', fillOp: 0.22 }
  rcv[4] = { fill: '#10b981', stroke: '#059669', fillOp: 0.26 }
  // F(5) 丢失：接收方仍是灰色（未到）
  snd[5] = { fill: '#3b82f6', stroke: '#2563eb', fillOp: 0.22 }
  rcv[5] = { fill: '#e2e8f0', stroke: '#94a3b8', fillOp: 0.22 }
  // G(6)、H(7) 失序到达，缓存——用黄色高亮（接收方有，失序，不交付）
  snd[6] = { fill: '#3b82f6', stroke: '#2563eb', fillOp: 0.22 }
  rcv[6] = { fill: '#fbbf24', stroke: '#d97706', fillOp: 0.36 }
  snd[7] = { fill: '#3b82f6', stroke: '#2563eb', fillOp: 0.22 }
  rcv[7] = { fill: '#fbbf24', stroke: '#d97706', fillOp: 0.36 }
  return {
    id: 's3',
    heading: 'F(5) 丢失；E、G、H 到达接收方',
    sndStyles: snd,
    rcvStyles: rcv,
    sndWindow: [4, 4],
    rcvWindow: [4, 4],
    frames: [
      { slot: 4, label: '帧 E(4)', lost: false, late: false },
      { slot: 5, label: '帧 F(5)', lost: true, late: false },
      { slot: 6, label: '帧 G(缓存)', lost: false, late: true },
      { slot: 7, label: '帧 H(缓存)', lost: false, late: true },
    ],
    acks: [],
  }
})()

const STEP4: StepState = (() => {
  const st = STEP3
  return {
    ...st,
    id: 's4',
    heading: '接收方逐个回 ACK：ACK4 / ACK6 / ACK7',
    frames: [],
    acks: [
      { slot: 4, label: 'ACK4' },
      { slot: 6, label: 'ACK6' },
      { slot: 7, label: 'ACK7' },
    ],
  }
})()

const STEP5: StepState = (() => {
  const { snd, rcv } = defaultStyles()
  for (let i = 0; i < 4; i++) {
    snd[i] = { fill: '#10b981', stroke: '#059669', fillOp: 0.26 }
    rcv[i] = { fill: '#10b981', stroke: '#059669', fillOp: 0.26 }
  }
  // E(4) 已确认（ACK4 到了），G、H 也已确认（ACK6、ACK7 到了）
  snd[4] = { fill: '#10b981', stroke: '#059669', fillOp: 0.26 }
  rcv[4] = { fill: '#10b981', stroke: '#059669', fillOp: 0.26 }
  // F(5)：发送方超时（红色），接收方仍空
  snd[5] = { fill: '#ef4444', stroke: '#dc2626', fillOp: 0.24 }
  rcv[5] = { fill: '#e2e8f0', stroke: '#94a3b8', fillOp: 0.22 }
  // G(6) H(7) 发送方也已确认（单独的 ACK6/7）
  snd[6] = { fill: '#10b981', stroke: '#059669', fillOp: 0.26 }
  rcv[6] = { fill: '#fbbf24', stroke: '#d97706', fillOp: 0.36 }
  snd[7] = { fill: '#10b981', stroke: '#059669', fillOp: 0.26 }
  rcv[7] = { fill: '#fbbf24', stroke: '#d97706', fillOp: 0.36 }
  // 窗口滑动：发送方因为 4、6、7 已确认，但 5 未确认（窗口必须按序前移）
  // 所以发送窗口左端仍卡在 5，长度 4 → [5,6,7,8] = indices 5,6,7,8
  // 接收方同样，左端卡在 5，Wr=[5,6,7,8]（虽然 6、7 缓存了，但窗口最左端未交付 → 窗口不滑）
  return {
    id: 's5',
    heading: 'ACK4、ACK6、ACK7 到达；F(5) 等待超时',
    sndStyles: snd,
    rcvStyles: rcv,
    sndWindow: [5, 4],
    rcvWindow: [5, 4],
    frames: [],
    acks: [],
  }
})()

const STEP6: StepState = (() => {
  const st = STEP5
  return {
    ...st,
    id: 's6',
    heading: 'SR 只重传超时的帧 F(5)',
    frames: [
      { slot: 5, label: '重传 F(5)', lost: false, late: false },
    ],
    acks: [],
  }
})()

const STEP7: StepState = (() => {
  const { snd, rcv } = defaultStyles()
  for (let i = 0; i < 4; i++) {
    snd[i] = { fill: '#10b981', stroke: '#059669', fillOp: 0.26 }
    rcv[i] = { fill: '#10b981', stroke: '#059669', fillOp: 0.26 }
  }
  // 全部 4~7 确认
  for (let i = 4; i < 8; i++) {
    snd[i] = { fill: '#10b981', stroke: '#059669', fillOp: 0.26 }
    rcv[i] = { fill: '#10b981', stroke: '#059669', fillOp: 0.26 }
  }
  return {
    id: 's7',
    heading: 'F(5) 到达 → ACK5 → 窗口整体前滑 4 格',
    sndStyles: snd,
    rcvStyles: rcv,
    sndWindow: [8, 4], // I J K L = 序号 0 1 2 3
    rcvWindow: [8, 4],
    frames: [],
    acks: [
      { slot: 5, label: 'ACK5' },
    ],
  }
})()

const STEPS: StepState[] = [STEP1, STEP2, STEP3, STEP4, STEP5, STEP6, STEP7]

async function renderStep(scene: Scene, state: StepState, stepIndex: number, animate: boolean) {
  const heading = text(`${stepIndex + 1} / ${STEPS.length}   ${state.heading}`, 0, 3.22, '#0f172a', 28)

  // 发送方 / 接收方 标签
  const lblSender = text('发送方', -TOTAL_W / 2 - 1.05, 1.87, '#1e40af', 24)
  const lblRcver = text('接收方', -TOTAL_W / 2 - 1.05, -1.87, '#1e40af', 24)
  const seqLabel = (content: string, x: number, y: number) => text(content, x, y, '#334155', 18, 400)

  // 序号标签行（上方 y=2.54，下方 y=-2.54）
  const seqTop = new VGroup(...SLOTS.map((s, i) => seqLabel(String(s.seq), slotX(i), 2.54)))
  const seqBot = new VGroup(...SLOTS.map((s, i) => seqLabel(String(s.seq), slotX(i), -2.54)))
  const seqArrowTop = text('帧序号（3bit）→', -TOTAL_W / 2 - 0.6, 2.54, '#64748b', 18, 400)
  const seqArrowBot = text('帧序号（3bit）→', -TOTAL_W / 2 - 0.6, -2.54, '#64748b', 18, 400)

  const visibleState = animate && stepIndex > 0 ? STEPS[stepIndex - 1] : state
  const sndRow = buildRow(1.87, visibleState.sndStyles)
  const rcvRow = buildRow(-1.87, visibleState.rcvStyles)

  const sndWin = windowFrame(1.87, visibleState.sndWindow[0], visibleState.sndWindow[1], '#2563eb')
  const rcvWin = windowFrame(-1.87, visibleState.rcvWindow[0], visibleState.rcvWindow[1], '#dc2626')

  const framePackets = state.frames.map(f => framePacket(f.slot, f.label, f.lost, f.late, !animate))
  const ackPackets = state.acks.map(a => ackPacket(a.slot, a.label, !animate))

  scene.add(heading, lblSender, lblRcver, seqTop, seqBot, seqArrowTop, seqArrowBot, sndRow, rcvRow, sndWin, rcvWin)
  if (animate) {
    scene.add(...framePackets, ...ackPackets)
    for (let i = 0; i < framePackets.length; i++) {
      const f = state.frames[i]
      await scene.play(new Shift(framePackets[i], { direction: [0, f.lost ? -1.6 : -3.2, 0], duration: f.lost ? 0.55 : 0.72, rateFunc: linear }))
      if (f.lost || f.late) await scene.play(new Indicate(framePackets[i], { color: f.lost ? '#dc2626' : '#d97706', scaleFactor: 1.1, duration: 0.38 }))
    }
    for (const ack of ackPackets) await scene.play(new Shift(ack, { direction: [0, 3.2, 0], duration: 0.65, rateFunc: linear }))
    const finalRows = [
      buildRow(1.87, state.sndStyles),
      buildRow(-1.87, state.rcvStyles),
      windowFrame(1.87, state.sndWindow[0], state.sndWindow[1], '#2563eb'),
      windowFrame(-1.87, state.rcvWindow[0], state.rcvWindow[1], '#dc2626'),
    ]
    await scene.play(...finalRows.map(row => new FadeIn(row, { duration: 0.3 })))
  } else {
    scene.add(...framePackets, ...ackPackets)
  }
  scene.render()
}

export const srErrorControlAnimation: ManimWebAnimation = {
  id: 'sr-error-control',
  ariaLabel: '选择重传差错控制（帧 5 丢失 + 只重传 F）',
  scene: {
    width: 980,
    height: 560,
    frameWidth: 14,
    frameHeight: 7,
    backgroundColor: '#ffffff',
  },
  initialState: { id: 'sr-overview', render: scene => renderStep(scene, STEP1, 0, false) },
  steps: STEPS.slice(1).map((s, i) => ({
    id: s.id,
    render: (scene, animate) => renderStep(scene, s, i + 1, animate),
  })),
}
