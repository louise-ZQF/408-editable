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
  register,
  wire,
  type CircuitMobject,
} from './circuit-visuals'

const X = '1011'
const X_REGISTER_X = -1.82
const BIT_X = [-4.62, -3.66, -2.94, -2.22, -1.5, -0.55, 0.15, 0.85, 1.55] as const
const BIT_Y = -0.57

type State = { c: string; p: string; y: string; counter: number }
type Step = State & {
  id: string
  heading: string
  kind: 'init' | 'add' | 'shift' | 'result'
  operation: string
  registerChange: string
}

const STEPS: Step[] = [
  { id: 'mul-init', kind: 'init', heading: '顺序乘法器：1011₂ × 1101₂', c: '0', p: '0000', y: '1101', counter: 4, operation: '被乘数 1011₂ → X；乘数 1101₂ → Y', registerChange: '控制器读取 Y 的最低位：Y=1101₂，最低位是 1' },
  { id: 'mul-r1-add', kind: 'add', heading: '第 1 轮：Y 最低位为 1，P 与 X 进入 ALU', c: '0', p: '1011', y: '1101', counter: 4, operation: '0000 + 1011 = 0|1011', registerChange: 'ALU 的最高位写 C，其余四位写 P' },
  { id: 'mul-r1-shift', kind: 'shift', heading: '第 1 轮：C:P:Y 整体右移', c: '0', p: '0101', y: '1110', counter: 3, operation: '0|1011|1101  →  0|0101|1110', registerChange: '本轮读取并移出最低位 1；右移后新的最低位是 0' },
  { id: 'mul-r2-shift', kind: 'shift', heading: '第 2 轮：Y 最低位为 0，跳过 ALU 加法并右移', c: '0', p: '0010', y: '1111', counter: 2, operation: '0|0101|1110  →  0|0010|1111', registerChange: '本轮读取并移出最低位 0；右移后新的最低位是 1' },
  { id: 'mul-r3-add', kind: 'add', heading: '第 3 轮：Y 最低位为 1，P 与 X 进入 ALU', c: '0', p: '1101', y: '1111', counter: 2, operation: '0010 + 1011 = 0|1101', registerChange: 'C:P 从 0|0010 更新为 0|1101' },
  { id: 'mul-r3-shift', kind: 'shift', heading: '第 3 轮：C:P:Y 整体右移', c: '0', p: '0110', y: '1111', counter: 1, operation: '0|1101|1111  →  0|0110|1111', registerChange: '本轮读取并移出最低位 1；右移后新的最低位仍是 1' },
  { id: 'mul-r4-add', kind: 'add', heading: '第 4 轮：P+X 产生进位', c: '1', p: '0001', y: '1111', counter: 1, operation: '0110 + 1011 = 1|0001', registerChange: '结果最高位 1 进入 C，低四位 0001 进入 P' },
  { id: 'mul-r4-shift', kind: 'shift', heading: '第 4 轮：C:P:Y 整体右移', c: '0', p: '1000', y: '1111', counter: 0, operation: '1|0001|1111  →  0|1000|1111', registerChange: 'Cn 归零，控制器停止' },
  { id: 'mul-result', kind: 'result', heading: '乘法完成：乘积保存在 P:Y', c: '0', p: '1000', y: '1111', counter: 0, operation: 'P:Y = 1000|1111 = 10001111₂', registerChange: '1011₂ × 1101₂ = 143' },
]

type Frame = {
  elements: CircuitMobject[]
  bits: Text[]
  zeroSource: Text
  counterValue: Text
}

function stateBits(state: State): string[] {
  return `${state.c}${state.p}${state.y}`.split('')
}

function registerStructure(): CircuitMobject[] {
  return [
    box(-4.62, -0.35, 0.88, 1.18, C.line, 0.02, 2.4),
    box(-2.58, -0.35, 3.2, 1.18, C.line, 0.02, 2.4),
    box(0.72, -0.35, 3.4, 1.18, C.line, 0.02, 2.4),
    label('C', -4.62, -0.04, C.text, 15, '800'),
    label('乘积寄存器 P', -2.58, -0.04, C.text, 15, '800'),
    label('乘数 / 乘积寄存器 Y', 0.72, -0.04, C.text, 15, '800'),
  ]
}

function createBits(state: State, color: string = C.ink): Text[] {
  return stateBits(state).map((bit, index) => mono(bit, BIT_X[index], BIT_Y, color, 23))
}

function buildFrame(state: State, heading: string, showValues = true): Frame {
  const bits = showValues ? createBits(state) : []
  const zeroSource = mono('0', -5.47, BIT_Y, C.blue, 22)
  const counterValue = mono(showValues ? String(state.counter) : '', 5.75, -0.45, C.ink, 18)

  const elements: CircuitMobject[] = [
    label(heading, 0, 4.08, C.ink, 25, '800'),

    // X 严格位于 ALU 第二输入正上方，数据只沿竖直线进入。
    register('被乘数寄存器 X', showValues ? X : '', X_REGISTER_X, 3.15, 2.65),
    alu('4 位 ALU', -2.6, 1.55, 3.1, 1.35),
    arrow([X_REGISTER_X, 2.62, 0], [X_REGISTER_X, 2.22, 0]),
    busLabel('X', X_REGISTER_X + 0.28, 2.42),

    ...registerStructure(),
    ...bits,

    // P 反馈到 ALU 第一输入。
    wire([-2.58, -0.95, 0], [-2.58, -1.36, 0]),
    wire([-2.58, -1.36, 0], [-6.45, -1.36, 0]),
    wire([-6.45, -1.36, 0], [-6.45, 2.75, 0]),
    wire([-6.45, 2.75, 0], [-3.38, 2.75, 0]),
    arrow([-3.38, 2.75, 0], [-3.38, 2.16, 0]),
    busLabel('P', -5.95, 2.98),

    // ALU 的五位结果拆成 C 与 P 两条写回通路。
    arrow([-2.6, 0.87, 0], [-2.6, 0.28, 0]),
    wire([-3.45, 1.05, 0], [-4.62, 1.05, 0]),
    arrow([-4.62, 1.05, 0], [-4.62, 0.28, 0]),
    busLabel('Cout', -4.12, 1.28),

    // 逻辑右移时从固定的 0 源补入 C。
    label('补零', -5.47, -0.08, C.muted, 13, '700'),
    zeroSource,
    arrow([-5.19, BIT_Y, 0], [-5.08, BIT_Y, 0]),

    // 控制器与 SHIFT 控制线。
    box(5.35, -0.18, 2.75, 1.3, C.line, 0.02, 2.4),
    label('控制逻辑', 5.35, 0.12, C.ink, 17, '800'),
    label('Cn =', 5.22, -0.45, C.text, 16, '800'),
    counterValue,
    arrow([3.96, -0.22, 0], [2.48, -0.22, 0]),
    busLabel('SHIFT', 3.2, 0.08),

    // ADD 控制线保持静态，活动时由数据动画表达，不再让整条线闪烁。
    wire([5.35, 0.69, 0], [5.35, 1.75, 0]),
    wire([5.35, 1.75, 0], [-0.92, 1.75, 0]),
    arrow([-0.92, 1.75, 0], [-1.05, 1.75, 0]),
    busLabel('ADD', 2.35, 2.02),

    wire([-7.15, -2.55, 0], [7.15, -2.55, 0], false, C.border),
  ]

  return { elements, bits, zeroSource, counterValue }
}

function finalText(step: Step): CircuitMobject[] {
  return [
    mono(step.operation, 0, -3.05, step.kind === 'add' ? C.orange : step.kind === 'shift' ? C.blue : C.ink, 20, '700'),
    label(step.registerChange, 0, -3.65, C.text, 17, '700'),
  ]
}

async function moveLinearly(scene: Scene, object: CircuitMobject, direction: [number, number, number], duration: number) {
  await scene.play(new Shift(object, { direction, duration, rateFunc: linear }))
}

async function animateInitialization(scene: Scene, frame: Frame, step: Step) {
  // 第 0 状态已经展示同一套空电路；点击第一步时只装载数据，结构本身保持稳定。
  scene.add(...frame.elements)

  // 两个操作数先出现在电路外，随后分别进入各自的寄存器。
  const xSourceLabel = label('被乘数', -5.25, 3.47, C.muted, 15, '700')
  const xPacket = mono(X, -5.25, 3.02, C.blue, 23)
  const ySourceLabel = label('乘数', 3.05, 3.47, C.muted, 15, '700')
  const ySourceX = [2.5, 2.86, 3.22, 3.58]
  const yPacketBits = step.y.split('').map((bit, index) => mono(bit, ySourceX[index], 3.02, C.blue, 23))
  scene.add(xSourceLabel, xPacket, ySourceLabel, ...yPacketBits)
  await scene.play(
    new FadeIn(xSourceLabel, { duration: 0.35 }),
    new FadeIn(xPacket, { duration: 0.35 }),
    new FadeIn(ySourceLabel, { duration: 0.35 }),
    ...yPacketBits.map(bit => new FadeIn(bit, { duration: 0.35 })),
  )

  // 被乘数 1011 进入 X；X 正好位于 ALU 第二输入的上方。
  await moveLinearly(scene, xPacket, [X_REGISTER_X - (-5.25), 2.95 - 3.02, 0], 1.05)
  await scene.play(new Indicate(xPacket, { color: C.blue, scaleFactor: 1.12, duration: 0.55 }))

  // 乘数 1101 的四个位逐个对准 Y 寄存器的四个触发器。
  await scene.play(
    ...yPacketBits.map((bit, index) => new Shift(bit, {
      direction: [BIT_X[index + 5] - ySourceX[index], BIT_Y - 3.02, 0],
      duration: 1.2,
      rateFunc: linear,
    })),
    new FadeOut(xSourceLabel, { duration: 0.55 }),
    new FadeOut(ySourceLabel, { duration: 0.55 }),
  )

  // 复位部分积寄存器，并把运算位数 4 装入计数器。
  const resetBits = `${step.c}${step.p}`.split('').map((bit, index) => mono(bit, BIT_X[index], BIT_Y, C.ink, 23))
  const counterValue = mono(String(step.counter), 5.75, -0.45, C.ink, 18)
  scene.add(...resetBits, counterValue)
  await scene.play(
    ...resetBits.map(bit => new FadeIn(bit, { duration: 0.55, shift: [0, 0.2, 0] })),
    new FadeIn(counterValue, { duration: 0.55, shift: [0, 0.2, 0] }),
  )
  frame.bits = [...resetBits, ...yPacketBits]
  frame.counterValue = counterValue

  // 控制器直接读取 Y 的当前最低位，不维护重复的采样状态。
  const lowestBit = frame.bits[8]
  await scene.play(new Indicate(lowestBit, { color: C.orange, scaleFactor: 1.35, duration: 0.75 }))
}

async function animateAdd(scene: Scene, frame: Frame, previous: State, step: Step) {
  // 控制器直接读取 Y 寄存器当前最右侧的最低位。
  await scene.play(new Indicate(frame.bits[8], { color: C.orange, scaleFactor: 1.28, duration: 0.7 }))

  // 从 P 与 X 的原始数字复制数据。源寄存器内容始终保留，不会消失。
  const pPacketBits = previous.p.split('').map((bit, index) => mono(bit, BIT_X[index + 1], BIT_Y, C.orange, 22))
  const pPacket = new VGroup(...pPacketBits)
  const xPacket = mono(X, X_REGISTER_X, 2.95, C.orange, 21)
  scene.add(pPacket, xPacket)

  // P 严格沿原图反馈回路进入 ALU 第一输入。
  await moveLinearly(scene, pPacket, [0, -0.79, 0], 0.34)
  await moveLinearly(scene, pPacket, [-3.87, 0, 0], 0.78)
  await moveLinearly(scene, pPacket, [0, 4.11, 0], 0.82)
  await moveLinearly(scene, pPacket, [3.07, 0, 0], 0.62)
  await moveLinearly(scene, pPacket, [0, -0.7, 0], 0.5)

  // X 从 ALU 第二输入正上方垂直落下。
  await moveLinearly(scene, xPacket, [0, -0.75, 0], 0.56)
  await scene.play(
    new Indicate(pPacket, { color: C.orange, scaleFactor: 1.08, duration: 0.45 }),
    new Indicate(xPacket, { color: C.orange, scaleFactor: 1.08, duration: 0.45 }),
  )

  // 两个操作数在 ALU 内汇合，连续变形成五位输出 C|P。
  const resultValues = `${step.c}${step.p}`.split('')
  const resultStartX = [-3.32, -2.96, -2.6, -2.24, -1.88]
  const resultBits = resultValues.map((bit, index) => mono(bit, resultStartX[index], 0.72, C.orange, 22))
  const resultGroup = new VGroup(...resultBits)
  await scene.play(
    new ReplacementTransform(pPacket, resultGroup, { duration: 0.88, rateFunc: smooth }),
    new FadeOut(xPacket, { duration: 0.6, shift: [0, -0.25, 0], rateFunc: smooth }),
  )

  // Cout 是结果最高位：它进入 C；剩余四位逐个进入 P。
  const oldCP = frame.bits.slice(0, 5)
  await scene.play(
    ...resultBits.map((bit, index) => new Shift(bit, {
      direction: [BIT_X[index] - resultStartX[index], BIT_Y - 0.72, 0],
      duration: 1.08,
      rateFunc: linear,
    })),
    ...oldCP.map(bit => new FadeOut(bit, { duration: 0.78, shift: [0, -0.22, 0], rateFunc: smooth })),
  )
  frame.bits.splice(0, 5, ...resultBits)
  await scene.play(new Indicate(frame.bits[0], { color: C.orange, scaleFactor: 1.3, duration: 0.62 }))
}

async function animateShift(scene: Scene, frame: Frame, previous: State, step: Step) {
  // 先发移位控制信号，寄存器尚未变化。
  const shiftLabel = label('SHIFT', 3.2, 0.08, C.blue, 15, '800')
  scene.add(shiftLabel)
  await scene.play(new Indicate(shiftLabel, { color: C.blue, scaleFactor: 1.18, duration: 0.65 }))

  const discardedLowestBit = frame.bits[8]
  const movingBits = frame.bits.slice(0, 8)
  const incomingZero = mono('0', -5.47, BIT_Y, C.blue, 23)
  scene.add(incomingZero)

  // 9 位作为同一次时钟沿上的整体移动：8 个保留位右移、最低位移出、左端补 0。
  await scene.play(
    ...movingBits.map((bit, index) => new Shift(bit, {
      direction: [BIT_X[index + 1] - BIT_X[index], 0, 0],
      duration: 1.28,
      rateFunc: linear,
    })),
    new Shift(incomingZero, {
      direction: [BIT_X[0] - (-5.47), 0, 0],
      duration: 1.28,
      rateFunc: linear,
    }),
    new FadeOut(discardedLowestBit, {
      duration: 1.28,
      shift: [0.7, 0, 0],
      rateFunc: linear,
    }),
  )
  frame.bits = [incomingZero, ...movingBits]

  const nextCounter = mono(String(step.counter), 5.75, -0.45, C.blue, 18)
  await scene.play(new Transform(frame.counterValue, nextCounter, { duration: 0.65, rateFunc: smooth }))
  // 右移完成后，直接读取 Y 新的最右侧最低位，决定下一轮操作。
  await scene.play(new Indicate(frame.bits[8], { color: C.blue, scaleFactor: 1.25, duration: 0.62 }))

  const actual = `0${stateBits(previous).slice(0, -1).join('')}`
  const expected = stateBits(step).join('')
  if (actual !== expected) throw new Error(`乘法移位状态错误：${actual} !== ${expected}`)
}

async function renderStep(scene: Scene, index: number, animate: boolean) {
  const step = STEPS[index]
  const previous = index === 0 ? step : STEPS[index - 1]
  const displayedState = animate && index > 0 ? previous : step
  const isAnimatedInitialization = animate && step.kind === 'init'
  const frame = buildFrame(displayedState, step.heading, !isAnimatedInitialization)

  if (isAnimatedInitialization) {
    await animateInitialization(scene, frame, step)
  } else {
    scene.add(...frame.elements)
  }

  if (animate && step.kind === 'add') {
    await animateAdd(scene, frame, previous, step)
  } else if (animate && step.kind === 'shift') {
    await animateShift(scene, frame, previous, step)
  } else if (animate && step.kind === 'result') {
    await scene.play(...frame.bits.slice(1).map(bit => new Indicate(bit, { color: C.green, scaleFactor: 1.14, duration: 0.8 })))
  }

  const text = finalText(step)
  scene.add(...text)
  if (animate) await scene.play(...text.map(item => new FadeIn(item, { duration: 0.42, shift: [0, -0.1, 0] })))
  scene.render()
}

export const multiplicationAnimation: ManimWebAnimation = {
  id: 'sequential-multiplication-circuit',
  ariaLabel: '通过连续数据移动展示 X、P、ALU、C 和乘数最低位控制关系的顺序乘法器动画',
  initialState: {
    id: 'mul-empty-circuit',
    render: scene => {
      const frame = buildFrame(STEPS[0], STEPS[0].heading, false)
      scene.add(...frame.elements)
      scene.render()
    },
  },
  scene: { width: 1400, height: 760, frameWidth: 16, frameHeight: 8.7, backgroundColor: '#ffffff' },
  steps: STEPS.map((step, index) => ({ id: step.id, render: (scene, animate) => renderStep(scene, index, animate) })),
}
