import {
  FadeIn,
  FadeOut,
  Indicate,
  ReplacementTransform,
  Shift,
  Text,
  Transform,
  VGroup,
  linear,
  smooth,
  type Scene,
} from '@/animations/manim'
import type { ManimWebAnimation } from '../../types'
import {
  C,
  alu,
  arrow,
  box,
  busLabel,
  label,
  mono,
  wire,
  type CircuitMobject,
} from './circuit-visuals'

const M = '00011'
const M_X = -1.75
const BIT_Y = -0.58
const R_BIT_X = [-3.8, -3.15, -2.5, -1.85, -1.2] as const
const Q_BIT_X = [0.3, 0.95, 1.6, 2.25] as const
const BIT_X = [...R_BIT_X, ...Q_BIT_X] as const
const COMPARE_X = 4.25
const CONTROL_X = 6.4

type State = { r: string; q: string; counter: number }
type Operation = 'init' | 'shift' | 'decide' | 'result'
type Step = State & {
  id: string
  operation: Operation
  heading: string
  operationLine: string
  registerChange: string
  canSubtract?: boolean
}

const STEPS: Step[] = [
  {
    id: 'div-init', operation: 'init', heading: '顺序除法器：1101₂ ÷ 0011₂',
    r: '00000', q: '1101', counter: 4,
    operationLine: '除数 00011₂ → M；被除数 1101₂ → Q',
    registerChange: 'R 复位为 00000，计数器装入 4',
  },
  {
    id: 'div-r1-shift', operation: 'shift', heading: '第 1 轮：R:Q 整体左移',
    r: '00001', q: '1010', counter: 4,
    operationLine: '00000|1101  →  00001|1010',
    registerChange: 'Q 最高位 1 进入 R 最低位，Q 右端补 0',
  },
  {
    id: 'div-r1-decide', operation: 'decide', heading: '第 1 轮：判断当前 R 能不能减 M',
    r: '00001', q: '1010', counter: 3,
    canSubtract: false,
    operationLine: 'R=00001 < M=00011：不能减',
    registerChange: 'R 保持 00001，Q 最低位写 0，Cn：4 → 3',
  },
  {
    id: 'div-r2-shift', operation: 'shift', heading: '第 2 轮：R:Q 整体左移',
    r: '00011', q: '0100', counter: 3,
    operationLine: '00001|1010  →  00011|0100',
    registerChange: 'Q 最高位 1 进入 R，当前 R 恰好等于 M',
  },
  {
    id: 'div-r2-decide', operation: 'decide', heading: '第 2 轮：R 等于 M，可以减',
    r: '00000', q: '0101', counter: 2,
    canSubtract: true,
    operationLine: '00011 − 00011 = 00000',
    registerChange: 'R 写入 00000，Q 最低位写 1，Cn：3 → 2',
  },
  {
    id: 'div-r3-shift', operation: 'shift', heading: '第 3 轮：R:Q 整体左移',
    r: '00000', q: '1010', counter: 2,
    operationLine: '00000|0101  →  00000|1010',
    registerChange: 'Q 最高位 0 进入 R，Q 右端补 0',
  },
  {
    id: 'div-r3-decide', operation: 'decide', heading: '第 3 轮：判断当前 R 能不能减 M',
    r: '00000', q: '1010', counter: 1,
    canSubtract: false,
    operationLine: 'R=00000 < M=00011：不能减',
    registerChange: 'R 保持 00000，Q 最低位写 0，Cn：2 → 1',
  },
  {
    id: 'div-r4-shift', operation: 'shift', heading: '第 4 轮：R:Q 整体左移',
    r: '00001', q: '0100', counter: 1,
    operationLine: '00000|1010  →  00001|0100',
    registerChange: 'Q 最高位 1 进入 R，Q 右端补 0',
  },
  {
    id: 'div-r4-decide', operation: 'decide', heading: '第 4 轮：比较 R 与 M',
    r: '00001', q: '0100', counter: 0,
    canSubtract: false,
    operationLine: 'R=00001 < M=00011：不能减',
    registerChange: 'R 保持 00001，Q 最低位写 0，Cn：1 → 0',
  },
  {
    id: 'div-result', operation: 'result', heading: '除法完成：Q 保存商，R 保存余数',
    r: '00001', q: '0100', counter: 0,
    operationLine: 'Q = 0100₂ = 4；R = 00001₂ = 1',
    registerChange: '1101₂ ÷ 0011₂ = 0100₂ …… 0001₂',
  },
]

type Frame = {
  elements: CircuitMobject[]
  bits: Text[]
  mValue: Text
  counterValue: Text
}

function stateBits(state: State): string[] {
  return `${state.r}${state.q}`.split('')
}

function createBits(state: State, color: string = C.ink): Text[] {
  return stateBits(state).map((bit, index) => mono(bit, BIT_X[index], BIT_Y, color, 22))
}

function registerStructure(): CircuitMobject[] {
  return [
    box(-2.5, -0.2, 3.65, 1.16, C.line, 0.02, 2.4),
    box(1.28, -0.2, 3, 1.16, C.line, 0.02, 2.4),
    label('R 余数寄存器', -2.5, 0.1, C.text, 15, '800'),
    label('Q 被除数 / 商寄存器', 1.28, 0.1, C.text, 15, '800'),
  ]
}

function buildFrame(state: State, heading: string, showValues = true): Frame {
  const bits = showValues ? createBits(state) : []
  const mValue = mono(showValues ? M : '', M_X, 2.94, C.ink, 22)
  const counterValue = mono(showValues ? String(state.counter) : '', CONTROL_X, 2.8, C.ink, 19)

  const elements: CircuitMobject[] = [
    label(heading, 0, 4.1, C.ink, 24, '800'),

    // M 位于 ALU 的第二输入正上方，只沿竖直数据线进入。
    box(M_X, 3.15, 2.65, 1.05, C.border, 0.035, 2),
    label('M 除数寄存器', M_X, 3.43, C.muted, 15, '700'),
    mValue,
    alu('5 位加 / 减 ALU', -2.6, 1.58, 3.1, 1.48),
    arrow([M_X, 2.62, 0], [M_X, 2.32, 0]),
    busLabel('M', M_X + 0.28, 2.48),

    ...registerStructure(),
    ...bits,

    // R 反馈沿固定折线路径返回 ALU，最后一段垂直进入第一输入。
    wire([-2.5, -0.79, 0], [-2.5, -1.12, 0]),
    wire([-2.5, -1.12, 0], [-6.5, -1.12, 0]),
    wire([-6.5, -1.12, 0], [-6.5, 2.65, 0]),
    wire([-6.5, 2.65, 0], [-3.45, 2.65, 0]),
    arrow([-3.45, 2.65, 0], [-3.45, 2.32, 0]),
    busLabel('R', -5.98, 2.92),

    // ALU 结果沿竖直写回通路进入 R。
    arrow([-2.6, 0.83, 0], [-2.6, 0.39, 0]),
    busLabel('R 写回', -2.05, 0.67),

    // 无符号比较器先判断 R 能不能减 M，再把判断结果交给控制器。
    box(COMPARE_X, 1.38, 1.9, 1.18, C.cyan, 0.05, 2.4),
    label('无符号比较器', COMPARE_X, 1.62, C.cyan, 15, '800'),
    mono('R ≥ M ?', COMPARE_X, 1.16, C.text, 17, '700'),
    wire([-0.42, 3.15, 0], [COMPARE_X, 3.15, 0]),
    arrow([COMPARE_X, 3.15, 0], [COMPARE_X, 1.99, 0]),
    busLabel('M', 2.0, 3.42),
    wire([-1.2, -0.79, 0], [-1.2, -1.5, 0]),
    wire([-1.2, -1.5, 0], [COMPARE_X, -1.5, 0]),
    arrow([COMPARE_X, -1.5, 0], [COMPARE_X, 0.77, 0]),
    busLabel('R', 1.05, -1.76),
    arrow([5.22, 1.38, 0], [5.48, 1.38, 0]),
    busLabel('能减？', 5.35, 1.68),

    // 控制器与计数器。
    box(CONTROL_X, 3.05, 1.8, 1.05, C.border, 0.035, 2),
    label('Cn 计数器', CONTROL_X, 3.34, C.muted, 15, '700'),
    counterValue,
    box(CONTROL_X, 1.38, 1.8, 1.18, C.line, 0.035, 2.4),
    label('控制逻辑', CONTROL_X, 1.38, C.ink, 17, '800'),
    arrow([CONTROL_X, 2.0, 0], [CONTROL_X, 2.5, 0]),
    busLabel('计数', CONTROL_X + 0.42, 2.25),

    // 控制器发出移位和 Q 最低位写入信号。
    arrow([CONTROL_X - 0.92, -0.2, 0], [2.82, -0.2, 0]),
    busLabel('SHIFT / Q 写入', 4.1, 0.3),

    // 只有比较器给出“能减”后，控制器才向 ALU 发出 SUB。
    wire([CONTROL_X, 1.98, 0], [CONTROL_X, 2.17, 0]),
    wire([CONTROL_X, 2.17, 0], [-0.94, 2.17, 0]),
    arrow([-0.94, 2.17, 0], [-1.06, 2.17, 0]),
    busLabel('SUB', 2.55, 2.43),

    // 左移时 Q 右端由固定 0 源补入。
    label('右端补 0', 3.08, -0.94, C.muted, 13, '700'),
    mono('0', 3.08, BIT_Y, C.blue, 21),
    arrow([2.82, BIT_Y, 0], [2.68, BIT_Y, 0]),

    wire([-7.15, -2.12, 0], [7.15, -2.12, 0], false, C.border),
  ]

  return { elements, bits, mValue, counterValue }
}

function finalText(step: Step): CircuitMobject[] {
  const color = step.operation === 'decide'
    ? step.canSubtract ? C.orange : C.cyan
    : step.operation === 'shift'
      ? C.blue
      : C.ink
  return [
    mono(step.operationLine, 0, -2.78, color, 19, '700'),
    label(step.registerChange, 0, -3.48, C.text, 17, '700'),
  ]
}

async function moveLinearly(
  scene: Scene,
  object: CircuitMobject,
  direction: [number, number, number],
  duration: number,
) {
  await scene.play(new Shift(object, { direction, duration, rateFunc: linear }))
}

async function animateInitialization(scene: Scene, frame: Frame, step: Step) {
  // 第 0 状态已经展示同一套空电路；第一步只装载数据，不重画结构。
  scene.add(...frame.elements)

  const mSourceLabel = label('除数', -5.35, 3.46, C.muted, 15, '700')
  const mPacket = mono(M, -5.35, 3.02, C.blue, 22)
  const qSourceLabel = label('被除数', 2.35, 3.46, C.muted, 15, '700')
  const qSourceX = [1.55, 2.08, 2.61, 3.14]
  const qPacketBits = step.q.split('').map((bit, index) => mono(bit, qSourceX[index], 3.02, C.blue, 22))
  scene.add(mSourceLabel, mPacket, qSourceLabel, ...qPacketBits)
  await scene.play(
    new FadeIn(mSourceLabel, { duration: 0.35 }),
    new FadeIn(mPacket, { duration: 0.35 }),
    new FadeIn(qSourceLabel, { duration: 0.35 }),
    ...qPacketBits.map(bit => new FadeIn(bit, { duration: 0.35 })),
  )

  await moveLinearly(scene, mPacket, [M_X - (-5.35), 2.94 - 3.02, 0], 1.05)
  await scene.play(new Indicate(mPacket, { color: C.blue, scaleFactor: 1.12, duration: 0.5 }))

  await scene.play(
    ...qPacketBits.map((bit, index) => new Shift(bit, {
      direction: [Q_BIT_X[index] - qSourceX[index], BIT_Y - 3.02, 0],
      duration: 1.2,
      rateFunc: linear,
    })),
    new FadeOut(mSourceLabel, { duration: 0.5 }),
    new FadeOut(qSourceLabel, { duration: 0.5 }),
  )

  const resetR = step.r.split('').map((bit, index) => mono(bit, R_BIT_X[index], BIT_Y, C.ink, 22))
  const counterValue = mono(String(step.counter), CONTROL_X, 2.8, C.ink, 19)
  scene.add(...resetR, counterValue)
  await scene.play(
    ...resetR.map(bit => new FadeIn(bit, { duration: 0.55, shift: [0, 0.2, 0] })),
    new FadeIn(counterValue, { duration: 0.55, shift: [0, 0.2, 0] }),
  )

  frame.bits = [...resetR, ...qPacketBits]
  frame.mValue = mPacket
  frame.counterValue = counterValue
}

async function animateShift(scene: Scene, frame: Frame, previous: State, step: Step) {
  // 控制器先沿 SHIFT 线路发出一个有效脉冲，随后寄存器才在时钟沿整体移动。
  const shiftPulse = mono('1', CONTROL_X - 1.12, -0.2, C.blue, 18)
  scene.add(shiftPulse)
  await scene.play(new FadeIn(shiftPulse, { duration: 0.28 }))
  await moveLinearly(scene, shiftPulse, [-2.18, 0, 0], 0.68)
  await scene.play(new FadeOut(shiftPulse, { duration: 0.3, shift: [-0.12, 0, 0] }))

  const discardedHighBit = frame.bits[0]
  const movingBits = frame.bits.slice(1)
  const incomingZero = mono('0', 3.08, BIT_Y, C.blue, 22)
  scene.add(incomingZero)

  // R:Q 九位在同一次时钟沿整体左移：最左位移出，Q 的最高位跨入 R，右端补 0。
  await scene.play(
    new FadeOut(discardedHighBit, {
      duration: 1.3,
      shift: [-0.72, 0, 0],
      rateFunc: linear,
    }),
    ...movingBits.map((bit, index) => new Shift(bit, {
      direction: [BIT_X[index] - BIT_X[index + 1], 0, 0],
      duration: 1.3,
      rateFunc: linear,
    })),
    new Shift(incomingZero, {
      direction: [BIT_X[8] - 3.08, 0, 0],
      duration: 1.3,
      rateFunc: linear,
    }),
  )
  frame.bits = [...movingBits, incomingZero]

  // 左移完成后明确指出跨越寄存器边界的那一位，以及右端补入的 0。
  await scene.play(
    new Indicate(frame.bits[4], { color: C.blue, scaleFactor: 1.28, duration: 0.62 }),
    new Indicate(frame.bits[8], { color: C.blue, scaleFactor: 1.22, duration: 0.62 }),
  )

  const actual = `${previous.r}${previous.q}`.slice(1) + '0'
  const expected = `${step.r}${step.q}`
  if (actual !== expected) throw new Error(`除法左移状态错误：${actual} !== ${expected}`)
}

async function animateAlu(
  scene: Scene,
  frame: Frame,
  previous: State,
  step: Step,
) {
  const color = C.orange
  const rPacketBits = previous.r.split('').map((bit, index) => mono(bit, R_BIT_X[index], BIT_Y, color, 21))
  const rPacket = new VGroup(...rPacketBits)
  const mPacket = mono(M, M_X, 2.94, color, 21)
  scene.add(rPacket, mPacket)

  // R 沿反馈回路进入 ALU 第一输入；最后一段保持竖直。
  await moveLinearly(scene, rPacket, [0, -0.54, 0], 0.34)
  await moveLinearly(scene, rPacket, [-4, 0, 0], 0.78)
  await moveLinearly(scene, rPacket, [0, 3.77, 0], 0.82)
  await moveLinearly(scene, rPacket, [3.05, 0, 0], 0.62)
  await moveLinearly(scene, rPacket, [0, -0.42, 0], 0.44)

  // M 始终从 ALU 第二输入正上方垂直落下。
  await moveLinearly(scene, mPacket, [0, -0.72, 0], 0.54)
  await scene.play(
    new Indicate(rPacket, { color, scaleFactor: 1.08, duration: 0.42 }),
    new Indicate(mPacket, { color, scaleFactor: 1.08, duration: 0.42 }),
  )

  const resultStartX = [-3.5, -3.05, -2.6, -2.15, -1.7]
  const resultBits = step.r.split('').map((bit, index) => mono(bit, resultStartX[index], 0.65, color, 22))
  const resultGroup = new VGroup(...resultBits)
  await scene.play(
    new ReplacementTransform(rPacket, resultGroup, { duration: 0.88, rateFunc: smooth }),
    new FadeOut(mPacket, { duration: 0.6, shift: [0, -0.22, 0], rateFunc: smooth }),
  )

  const oldR = frame.bits.slice(0, 5)
  await scene.play(
    ...resultBits.map((bit, index) => new Shift(bit, {
      direction: [R_BIT_X[index] - resultStartX[index], BIT_Y - 0.65, 0],
      duration: 1.05,
      rateFunc: linear,
    })),
    ...oldR.map(bit => new FadeOut(bit, { duration: 0.76, shift: [0, -0.2, 0], rateFunc: smooth })),
  )
  frame.bits.splice(0, 5, ...resultBits)
  await scene.play(...frame.bits.slice(0, 5).map(bit => new Indicate(bit, {
    color,
    scaleFactor: 1.18,
    duration: 0.68,
  })))

  const mNumber = Number.parseInt(M, 2)
  const previousR = Number.parseInt(previous.r, 2)
  const expectedNumber = (previousR - mNumber + 32) % 32
  const expected = expectedNumber.toString(2).padStart(5, '0')
  if (expected !== step.r) throw new Error(`除法 ALU 状态错误：${expected} !== ${step.r}`)
}

async function animateCompare(scene: Scene, frame: Frame, previous: State, canSubtract: boolean) {
  // 比较器从 R、M 的可见寄存器读取无符号数，不再依赖 R 最高位或先做一次减法。
  await scene.play(
    ...frame.bits.slice(0, 5).map(bit => new Indicate(bit, { color: C.cyan, scaleFactor: 1.16, duration: 0.62 })),
    new Indicate(frame.mValue, { color: C.cyan, scaleFactor: 1.12, duration: 0.62 }),
  )

  const rPacket = mono(previous.r, -2.5, BIT_Y, C.cyan, 20)
  const mPacket = mono(M, M_X, 2.94, C.cyan, 20)
  scene.add(rPacket, mPacket)

  // R 沿下方比较通路进入比较器；M 沿上方通路进入比较器。
  await moveLinearly(scene, rPacket, [1.3, 0, 0], 0.32)
  await moveLinearly(scene, rPacket, [0, -0.92, 0], 0.42)
  await moveLinearly(scene, rPacket, [COMPARE_X - (-1.2), 0, 0], 1.05)
  await moveLinearly(scene, rPacket, [0, 2.25, 0], 0.62)

  await moveLinearly(scene, mPacket, [COMPARE_X - M_X, 0.21, 0], 1.0)
  await moveLinearly(scene, mPacket, [0, -1.55, 0], 0.62)
  await scene.play(
    new Indicate(rPacket, { color: C.cyan, scaleFactor: 1.08, duration: 0.42 }),
    new Indicate(mPacket, { color: C.cyan, scaleFactor: 1.08, duration: 0.42 }),
  )

  const decision = label(canSubtract ? '能减' : '不能减', COMPARE_X, 1.38, canSubtract ? C.green : C.cyan, 17, '800')
  await scene.play(
    new ReplacementTransform(rPacket, decision, { duration: 0.72, rateFunc: smooth }),
    new FadeOut(mPacket, { duration: 0.55, shift: [0.15, 0, 0], rateFunc: smooth }),
  )
  await moveLinearly(scene, decision, [CONTROL_X - COMPARE_X, 0, 0], 0.62)
  await scene.play(new Indicate(decision, { color: canSubtract ? C.green : C.cyan, scaleFactor: 1.16, duration: 0.45 }))
  await scene.play(new FadeOut(decision, { duration: 0.32, shift: [0.1, 0, 0] }))

  const actual = Number.parseInt(previous.r, 2) >= Number.parseInt(M, 2)
  if (actual !== canSubtract) throw new Error(`除法比较状态错误：${actual} !== ${canSubtract}`)
}

async function animateQWrite(scene: Scene, frame: Frame, bit: string) {
  // 比较完成后，控制器才产生商位，并把同一个数字送入 Q 最低位。
  const quotientBit = mono(bit, CONTROL_X - 1.12, BIT_Y, C.green, 22)
  scene.add(quotientBit)
  await scene.play(new FadeIn(quotientBit, { duration: 0.35, shift: [-0.15, 0, 0] }))
  const oldQ0 = frame.bits[8]
  await scene.play(
    new Shift(quotientBit, {
      direction: [Q_BIT_X[3] - (CONTROL_X - 1.12), 0, 0],
      duration: 1.05,
      rateFunc: linear,
    }),
    new FadeOut(oldQ0, { duration: 0.72, shift: [0, -0.18, 0], rateFunc: smooth }),
  )
  frame.bits.splice(8, 1, quotientBit)
  await scene.play(new Indicate(frame.bits[8], { color: C.green, scaleFactor: 1.28, duration: 0.55 }))
}

async function animateCounter(scene: Scene, frame: Frame, counter: number) {
  const nextCounter = mono(String(counter), CONTROL_X, 2.8, C.green, 19)
  await scene.play(new Transform(frame.counterValue, nextCounter, { duration: 0.65, rateFunc: smooth }))
}

async function renderStep(scene: Scene, index: number, animate: boolean) {
  const step = STEPS[index]
  const previous = index === 0 ? step : STEPS[index - 1]
  const displayedState = animate && index > 0 ? previous : step
  const animatedInitialization = animate && step.operation === 'init'
  const frame = buildFrame(displayedState, step.heading, !animatedInitialization)

  if (animatedInitialization) {
    await animateInitialization(scene, frame, step)
  } else {
    scene.add(...frame.elements)
  }

  if (animate && step.operation === 'shift') {
    await animateShift(scene, frame, previous, step)
  } else if (animate && step.operation === 'decide') {
    const canSubtract = step.canSubtract === true
    await animateCompare(scene, frame, previous, canSubtract)
    if (canSubtract) {
      await animateAlu(scene, frame, previous, step)
    } else {
      await scene.play(...frame.bits.slice(0, 5).map(bit => new Indicate(bit, {
        color: C.cyan,
        scaleFactor: 1.12,
        duration: 0.55,
      })))
    }
    await animateQWrite(scene, frame, step.q.at(-1) || '0')
    await animateCounter(scene, frame, step.counter)
  } else if (animate && step.operation === 'result') {
    await scene.play(
      ...frame.bits.slice(0, 5).map(bit => new Indicate(bit, { color: C.orange, scaleFactor: 1.15, duration: 0.72 })),
      ...frame.bits.slice(5).map(bit => new Indicate(bit, { color: C.green, scaleFactor: 1.15, duration: 0.72 })),
    )
  }

  const text = finalText(step)
  scene.add(...text)
  if (animate) await scene.play(...text.map(item => new FadeIn(item, { duration: 0.42, shift: [0, -0.1, 0] })))
  scene.render()
}

export const divisionAnimation: ManimWebAnimation = {
  id: 'compare-before-subtract-division-circuit',
  ariaLabel: '通过连续数据移动展示 M、R、Q、无符号比较器、ALU 和逐位写商的顺序除法动画',
  initialState: {
    id: 'div-empty-circuit',
    render: scene => {
      const frame = buildFrame(STEPS[0], STEPS[0].heading, false)
      scene.add(...frame.elements)
      scene.render()
    },
  },
  scene: {
    width: 1400,
    height: 780,
    frameWidth: 16,
    frameHeight: 9,
    backgroundColor: '#ffffff',
  },
  steps: STEPS.map((step, index) => ({
    id: step.id,
    render: (scene, animate) => renderStep(scene, index, animate),
  })),
}
