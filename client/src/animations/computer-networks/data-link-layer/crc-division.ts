import { FadeIn, Indicate, Line, Rectangle, Text, type Scene } from '@/animations/manim'
import type { ManimWebAnimation } from '../../types'

// ===== CRC 除法数据 =====
const DIVIDEND = [1, 0, 1, 0, 0, 1, 0, 0, 0]
const DIVISOR = [1, 1, 0, 1]
const QUOTIENT = [1, 1, 0, 1, 0, 1]

type Round = {
  quotIndex: number
  divisorPos: number
  result: number[]
  isLast: boolean
}

const ROUNDS: Round[] = [
  { quotIndex: 0, divisorPos: 0, result: [0, 1, 1, 1, 0], isLast: false },
  { quotIndex: 1, divisorPos: 1, result: [0, 0, 1, 1, 1], isLast: false },
  { quotIndex: 3, divisorPos: 3, result: [0, 0, 1, 1, 0], isLast: false },
  { quotIndex: 5, divisorPos: 5, result: [0, 0, 0, 1], isLast: true },
]

// ===== 坐标 =====
const COL_SP = 0.45
const ROW_SP = 0.5
const COL0 = -1.8
const Y_HEADING = 2.75
const Y_QUOT = 2.2
const Y_DIVD = 1.65
const Y_ROUND0 = 1.1
const BRACKET_X = -2.05
const DIVISOR_RIGHT_X = -2.2

function colX(i: number) { return COL0 + i * COL_SP }
function roundDivY(r: number) { return Y_ROUND0 - r * 2 * ROW_SP }
function roundResY(r: number) { return Y_ROUND0 - r * 2 * ROW_SP - ROW_SP }

// ===== 颜色 =====
const C_INK = '#1e293b'
const C_GRAY = '#cbd5e1'
const C_BLUE = '#2563eb'
const C_GREEN = '#059669'
const C_LINE = '#334155'
const C_HINT = '#64748b'

// ===== 辅助 =====
function digit(text: string, x: number, y: number, color: string, weight: string) {
  return new Text({
    text,
    fontSize: 22,
    color,
    fontFamily: 'JetBrains Mono, Courier New, monospace',
    fontWeight: weight,
  }).moveTo([x, y, 0])
}

function headingText(content: string) {
  return new Text({
    text: content,
    fontSize: 16,
    color: C_HINT,
    fontFamily: 'Noto Sans SC, PingFang SC, sans-serif',
    fontWeight: '600',
  }).moveTo([0, Y_HEADING, 0])
}

function hline(x1: number, x2: number, y: number) {
  return new Line({ start: [x1, y, 0], end: [x2, y, 0], color: C_LINE, strokeWidth: 2 })
}

function vline(x: number, y1: number, y2: number) {
  return new Line({ start: [x, y1, 0], end: [x, y2, 0], color: C_LINE, strokeWidth: 2 })
}

// ===== 构建元素 =====
function buildBracket(): Line[] {
  return [
    hline(BRACKET_X, 2.05, Y_QUOT - 0.28),
    vline(BRACKET_X, Y_QUOT - 0.28, Y_DIVD - 0.15),
  ]
}

function buildDivisorLeft(): Text[] {
  return DIVISOR.map((d, i) => digit(String(d), DIVISOR_RIGHT_X - (3 - i) * 0.3, Y_DIVD, C_INK, '700'))
}

function buildDividend(): Text[] {
  return DIVIDEND.map((d, i) => digit(String(d), colX(i), Y_DIVD, C_INK, '700'))
}

function buildQuotBit(qIdx: number): Text {
  const bit = QUOTIENT[qIdx]
  const color = bit === 0 ? C_GRAY : C_INK
  const weight = bit === 0 ? '600' : '700'
  return digit(String(bit), colX(qIdx), Y_QUOT, color, weight)
}

function buildRound(roundIdx: number): (Text | Line)[] {
  const round = ROUNDS[roundIdx]
  const elems: (Text | Line)[] = []

  for (let i = 0; i < 4; i++) {
    elems.push(digit(String(DIVISOR[i]), colX(round.divisorPos + i), roundDivY(roundIdx), C_BLUE, '700'))
  }

  elems.push(hline(colX(round.divisorPos) - 0.12, colX(round.divisorPos + 3) + 0.12, roundDivY(roundIdx) - 0.2))

  for (let i = 0; i < round.result.length; i++) {
    const pos = round.divisorPos + i
    const val = round.result[i]
    let color = C_INK
    let weight = '600'
    if (round.isLast && i >= round.result.length - 3) {
      color = C_GREEN
      weight = '700'
    }
    elems.push(digit(String(val), colX(pos), roundResY(roundIdx), color, weight))
  }

  return elems
}

// ===== 步骤定义 =====
type StepDef = {
  id: string
  quotBits: number
  rounds: number
  heading: string
}

const STEPS: StepDef[] = [
  { id: 'setup', quotBits: 0, rounds: 0, heading: '被除数 101001000 ÷ 除数 1101，开始模 2 除法' },
  { id: 'r1', quotBits: 1, rounds: 1, heading: '① 取 1010，最高位 1 → 商 1，异或 1101 = 0111，落位 0' },
  { id: 'r2', quotBits: 2, rounds: 2, heading: '② 取 1110，最高位 1 → 商 1，异或 1101 = 0011，落位 1' },
  { id: 's3', quotBits: 3, rounds: 2, heading: '③ 取 0111，最高位 0 → 商 0，跳过' },
  { id: 'r4', quotBits: 4, rounds: 3, heading: '④ 取 1110，最高位 1 → 商 1，异或 1101 = 0011，落位 0' },
  { id: 's5', quotBits: 5, rounds: 3, heading: '⑤ 取 0110，最高位 0 → 商 0，跳过' },
  { id: 'r6', quotBits: 6, rounds: 4, heading: '⑥ 取 1100，最高位 1 → 商 1，余数 R = 001' },
]

// ===== 渲染 =====
function buildFullState(quotBits: number, rounds: number): (Text | Line)[] {
  const elems: (Text | Line)[] = []
  elems.push(...buildBracket())
  elems.push(...buildDivisorLeft())
  elems.push(...buildDividend())
  for (let i = 0; i < quotBits; i++) elems.push(buildQuotBit(i))
  for (let i = 0; i < rounds; i++) elems.push(...buildRound(i))
  return elems
}

function buildDelta(stepIdx: number): (Text | Line)[] {
  if (stepIdx === 0) {
    return [...buildBracket(), ...buildDivisorLeft(), ...buildDividend()]
  }
  const step = STEPS[stepIdx]
  const prev = STEPS[stepIdx - 1]
  const elems: (Text | Line)[] = []
  if (step.quotBits > prev.quotBits) elems.push(buildQuotBit(prev.quotBits))
  if (step.rounds > prev.rounds) elems.push(...buildRound(prev.rounds))
  return elems
}

async function renderStep(scene: Scene, stepIdx: number, animate: boolean) {
  const step = STEPS[stepIdx]
  const oldElems = stepIdx === 0 ? [] : buildFullState(STEPS[stepIdx - 1].quotBits, STEPS[stepIdx - 1].rounds)
  const newElems = buildDelta(stepIdx)
  const heading = headingText(step.heading)
  const skipped = step.id === 's3' || step.id === 's5'
  const selectedStart = step.id === 's3' ? 2 : step.id === 's5' ? 4 : -1
  const selectedY = step.id === 's3' ? roundResY(1) : roundResY(2)
  const selection = skipped
    ? new Rectangle({
        width: COL_SP * 4 + 0.18,
        height: 0.46,
        color: C_GREEN,
        fillOpacity: 0.04,
        strokeWidth: 2.4,
        center: [colX(selectedStart + 1.5), selectedY, 0],
      })
    : null

  scene.add(...oldElems)

  if (animate) {
    await scene.play(
      new FadeIn(heading, { duration: 0.3 }),
      ...newElems.map(e => new FadeIn(e, { duration: 0.35 })),
    )
    if (selection) {
      scene.add(selection)
      await scene.play(new FadeIn(selection, { duration: 0.25 }), new Indicate(selection, { color: C_GREEN, scaleFactor: 1.04, duration: 0.55 }))
    }
  } else {
    scene.add(heading, ...newElems, ...(selection ? [selection] : []))
  }
  scene.render()
}

// ===== 导出 =====
export const crcDivisionAnimation: ManimWebAnimation = {
  id: 'crc-division',
  ariaLabel: 'CRC 模 2 除法竖式逐步动画',
  scene: {
    width: 900,
    height: 430,
    frameWidth: 12,
    frameHeight: 6,
    backgroundColor: '#ffffff',
  },
  initialState: {
    id: 'crc-overview',
    render: scene => {
      scene.add(
        headingText('CRC 模 2 除法：101001000 ÷ 1101，逐位执行异或'),
        ...buildBracket(),
        ...buildDivisorLeft(),
        ...buildDividend(),
      )
      scene.render()
    },
  },
  steps: STEPS.slice(1).map((step, index) => ({
    id: step.id,
    render: (scene, animate) => renderStep(scene, index + 1, animate),
  })),
}
