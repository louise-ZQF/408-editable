import {
  FadeIn,
  FadeOut,
  Indicate,
  Line,
  Polygon,
  Rectangle,
  Shift,
  Text,
  Transform,
  linear,
  smooth,
  type Mobject,
  type Scene,
  type Vector3Tuple,
} from '@/animations/manim'
import type { ManimWebAnimation } from '../../types'

const C = {
  ink: '#0f172a', text: '#334155', muted: '#64748b', border: '#cbd5e1',
  blue: '#1d4ed8', cyan: '#0f766e', green: '#047857', orange: '#c2410c', red: '#b91c1c',
} as const

const NOTES = [
  '装入 A=0101、B=0011；B 原值和反相量 1100 在 MUX 左侧等待选择',
  'SUB=0 到达 MUX 后留在控制端，内部选通 0 号输入，也就是 B 原值',
  '被选中的 0011 从 MUX 输出；SUB 同时令最低位进位 Cin=0',
  'A 与 MUX 输出进入加法器，先保留算式 0101+0011+0，暂不直接给出答案',
  '执行二进制加法，得到 F=1000；ZF、SF 和两个进位信号随之确定',
  '先列出无符号进位标志的计算式 CF=SUB⊕Cout',
  '代入 SUB=0、Cout=0，计算出 CF=0',
  '再列出有符号溢出标志的计算式 OF=Cout⊕Cₙ₋₁',
  '代入 Cout=0、Cₙ₋₁=1，计算出 OF=1，发生有符号溢出',
  '开始减法前清除上一次的 MUX 输出、运算结果和标志位，再把 SUB 改为 1',
  'SUB=1 选通反相量 1100，并同时令 Cin=1',
  '先保留减法对应的加法算式 0101+1100+1，观察三个输入',
  '执行二进制加法，得到 1|0010，也就是 5−3=2',
  '先列出减法的进位标志计算式 CF=SUB⊕Cout',
  '代入 SUB=1、Cout=1，计算出 CF=0，表示没有借位',
  '先列出减法的溢出标志计算式 OF=Cout⊕Cₙ₋₁',
  '代入 Cout=1、Cₙ₋₁=1，计算出 OF=0，没有有符号溢出',
] as const

type Frame = {
  elements: Mobject[]
  values: Text[]
  selection: Mobject[]
  selectionKey: 'none' | 'b' | 'not-b'
  formulas: Mobject[]
  operation: Text
  note: Text
}

function label(content: string, x: number, y: number, size = 16, color: string = C.text, weight = '600'): Text {
  return new Text({ text: content, fontSize: size, color, fontFamily: 'Noto Sans SC, PingFang SC, Microsoft YaHei, sans-serif', fontWeight: weight }).moveTo([x, y, 0])
}

function mono(content: string, x: number, y: number, size = 17, color: string = C.ink): Text {
  return new Text({ text: content, fontSize: size, color, fontFamily: 'JetBrains Mono, SFMono-Regular, Consolas, monospace', fontWeight: '700' }).moveTo([x, y, 0])
}

function box(x: number, y: number, width: number, height: number, color: string = C.border, fillOpacity = 0.02, strokeWidth = 2): Rectangle {
  return new Rectangle({ width, height, center: [x, y, 0], color, fillOpacity, strokeWidth })
}

function wire(start: Vector3Tuple, end: Vector3Tuple, color: string = C.border, strokeWidth = 2): Line {
  return new Line({ start, end, color, strokeWidth })
}

function muxShape(): Mobject[] {
  return [
    new Polygon({ vertices: [[-2.35, -1.58, 0], [-2.35, 0.18, 0], [-0.9, -0.2, 0], [-0.9, -1.2, 0]], color: C.cyan, fillOpacity: 0.04, strokeWidth: 2.4 }),
    label('MUX', -1.55, -0.7, 17, C.cyan, '800'),
    label('0', -2.16, -0.2, 14, C.cyan, '800'),
    label('1', -2.16, -1.2, 14, C.cyan, '800'),
  ]
}

function adderShape(): Mobject[] {
  return [
    new Polygon({ vertices: [[0.65, -1.62, 0], [0.65, 1.62, 0], [2.85, 1.08, 0], [2.85, -1.08, 0]], color: C.blue, fillOpacity: 0.035, strokeWidth: 2.6 }),
    label('加法器', 1.75, 0.02, 21, C.blue, '800'),
  ]
}

function baseStructure(): Mobject[] {
  return [
    label('带标志位输出的加减法器', 0, 4.12, 27, C.ink, '800'),
    label('SUB 既选择 B 或 B̅，也作为最低位进位 Cin', 0, 3.68, 16, C.muted, '600'),
    label('A', -6.7, 1.35, 22, C.ink, '800'),
    wire([-6.25, 1.35, 0], [0.65, 1.35, 0], C.ink, 2.2),
    label('B', -6.7, -0.18, 22, C.ink, '800'),
    wire([-6.25, -0.18, 0], [-2.35, -0.18, 0], C.ink, 2.2),
    wire([-5.4, -0.18, 0], [-5.4, -1.2, 0], C.ink, 1.9),
    wire([-5.4, -1.2, 0], [-4.98, -1.2, 0], C.ink, 1.9),
    new Polygon({ vertices: [[-4.98, -0.94, 0], [-4.98, -1.46, 0], [-4.35, -1.2, 0]], color: C.orange, fillOpacity: 0.025, strokeWidth: 2 }),
    box(-4.18, -1.2, 0.18, 0.18, C.orange, 0.02, 2),
    wire([-3.99, -1.2, 0], [-2.35, -1.2, 0], C.ink, 2),
    label('B̅', -4.2, -1.7, 18, C.orange, '800'),
    ...muxShape(),
    wire([-0.9, -0.7, 0], [0.65, -0.7, 0], C.ink, 2.2),
    label('SUB', -1.65, 2.82, 19, C.orange, '800'),
    wire([-1.65, 2.48, 0], [-1.65, 0.18, 0], C.orange, 2),
    wire([-1.65, 2.1, 0], [1.15, 2.1, 0], C.orange, 2),
    wire([1.15, 2.1, 0], [1.15, 1.5, 0], C.orange, 2),
    label('Cin', 1.57, 2.02, 16, C.orange, '800'),
    ...adderShape(),
    wire([2.85, 0.05, 0], [5.72, 0.05, 0], C.blue, 2.3),
    label('F', 6.05, 0.05, 19, C.blue, '800'),
    wire([2.85, 0.95, 0], [5.22, 0.95, 0], C.border, 1.8), label('ZF', 5.62, 0.95, 16, C.text, '800'),
    wire([2.85, 0.5, 0], [5.22, 0.5, 0], C.border, 1.8), label('OF', 5.62, 0.5, 16, C.text, '800'),
    wire([2.85, -0.4, 0], [5.22, -0.4, 0], C.border, 1.8), label('SF', 5.62, -0.4, 16, C.text, '800'),
    wire([2.85, -0.85, 0], [5.22, -0.85, 0], C.border, 1.8), label('CF', 5.62, -0.85, 16, C.text, '800'),
    wire([1.25, -1.42, 0], [1.25, -1.86, 0], C.border, 1.7), label('Cₙ₋₁', 0.72, -1.98, 13, C.text, '800'),
    wire([2.25, -1.28, 0], [2.25, -1.86, 0], C.border, 1.7), label('Cout', 2.72, -1.98, 13, C.text, '800'),
  ]
}

function state(stage: number) {
  const addition = stage <= 9
  const subtractResult = stage >= 13
  return {
    a: stage >= 1 ? '0101' : '',
    b: stage >= 1 ? '0011' : '',
    inverted: stage >= 1 ? '1100' : '',
    sub: stage >= 2 ? (stage >= 10 ? '1' : '0') : '',
    muxControl: stage >= 2 && stage <= 9 ? 'SUB=0' : stage >= 11 ? 'SUB=1' : '',
    selected: stage >= 3 && stage <= 9 ? '0011' : stage >= 11 ? '1100' : '',
    cin: stage >= 3 && stage <= 9 ? '0' : stage >= 11 ? '1' : '',
    result: stage >= 5 && stage <= 9 ? '1000' : subtractResult ? '0010' : '',
    zf: stage >= 5 && stage <= 9 ? '0' : subtractResult ? '0' : '',
    of: stage >= 9 && addition ? '1' : stage >= 17 ? '0' : '',
    sf: stage >= 5 && stage <= 9 ? '1' : subtractResult ? '0' : '',
    cf: stage >= 7 && addition ? '0' : stage >= 15 ? '0' : '',
    carryIntoSign: stage >= 5 && stage <= 9 ? '1' : subtractResult ? '1' : '',
    cout: stage >= 5 && stage <= 9 ? '0' : subtractResult ? '1' : '',
  }
}

function selectionFor(stage: number): { key: Frame['selectionKey']; objects: Mobject[] } {
  if (stage >= 2 && stage <= 9) return {
    key: 'b',
    objects: [
      wire([-2.26, -0.2, 0], [-1.02, -0.7, 0], C.blue, 4),
      box(-2.16, -0.2, 0.42, 0.42, C.blue, 0.06, 2.5),
    ],
  }
  if (stage >= 11) return {
    key: 'not-b',
    objects: [
      wire([-2.26, -1.2, 0], [-1.02, -0.7, 0], C.orange, 4),
      box(-2.16, -1.2, 0.42, 0.42, C.orange, 0.06, 2.5),
    ],
  }
  return { key: 'none', objects: [] }
}

function formulaObjects(stage: number): Mobject[] {
  const result: Mobject[] = []
  if (stage >= 6 && stage <= 9) result.push(
    box(-1.75, -2.38, 6, 0.55, C.green, 0.035, 2.1),
    mono('CF =', -4.05, -2.38, 15, C.green),
    mono('SUB=0', -2.75, -2.38, 14, C.green),
    mono('⊕', -1.65, -2.38, 17, C.green),
    mono('Cout=0', -0.45, -2.38, 14, C.green),
    mono(stage === 6 ? '= ?' : '= 0', 0.72, -2.38, 15, C.green),
  )
  if (stage >= 8 && stage <= 9) result.push(
    box(4.48, -2.38, 5.95, 0.55, C.red, 0.035, 2.1),
    mono('OF =', 2.05, -2.38, 15, C.red),
    mono('Cout=0', 3.35, -2.38, 14, C.red),
    mono('⊕', 4.48, -2.38, 17, C.red),
    mono('Cₙ₋₁=1', 5.55, -2.38, 14, C.red),
    mono(stage === 8 ? '= ?' : '= 1', 6.82, -2.38, 15, C.red),
  )
  if (stage >= 14) result.push(
    box(-1.75, -2.38, 6, 0.55, C.green, 0.035, 2.1),
    mono('CF =', -4.05, -2.38, 15, C.green),
    mono('SUB=1', -2.75, -2.38, 14, C.green),
    mono('⊕', -1.65, -2.38, 17, C.green),
    mono('Cout=1', -0.45, -2.38, 14, C.green),
    mono(stage === 14 ? '= ?' : '= 0', 0.72, -2.38, 15, C.green),
  )
  if (stage >= 16) result.push(
    box(4.48, -2.38, 5.95, 0.55, C.green, 0.035, 2.1),
    mono('OF =', 2.05, -2.38, 15, C.green),
    mono('Cout=1', 3.35, -2.38, 14, C.green),
    mono('⊕', 4.48, -2.38, 17, C.green),
    mono('Cₙ₋₁=1', 5.55, -2.38, 14, C.green),
    mono(stage === 16 ? '= ?' : '= 0', 6.82, -2.38, 15, C.green),
  )
  return result
}

function operation(stage: number): string {
  return [
    '等待操作数和控制信号进入电路',
    'B=0011；按位取反得到 B̅=1100',
    'SUB=0 → MUX 内部选通 0 号输入',
    'MUX 输出 0011；Cin=0',
    '0101 + 0011 + 0 = ?',
    '0101 + 0011 + 0 = 0|1000',
    'CF = SUB ⊕ Cout = ?',
    'CF = 0 ⊕ 0 = 0',
    'OF = Cout ⊕ Cₙ₋₁ = ?',
    'OF = 0 ⊕ 1 = 1',
    '清除上一次动态结果；SUB：0 → 1',
    'SUB=1 → 选通 B̅=1100；Cin=1',
    '0101 + 1100 + 1 = ?',
    '0101 + 1100 + 1 = 1|0010',
    'CF = SUB ⊕ Cout = ?',
    'CF = 1 ⊕ 1 = 0，没有借位',
    'OF = Cout ⊕ Cₙ₋₁ = ?',
    'OF = 1 ⊕ 1 = 0，没有有符号溢出',
  ][stage]
}

function buildFrame(stage: number): Frame {
  const s = state(stage)
  const selection = selectionFor(stage)
  const formulas = formulaObjects(stage)
  const values = [
    mono(s.a, -4.45, 1.41, 16, C.blue), mono(s.b, -4.45, -0.12, 16, C.blue),
    mono(s.inverted, -3.15, -1.15, 16, C.orange), mono(s.sub, -1.25, 2.82, 18, C.orange),
    mono(s.muxControl, -1.62, 0.47, 12, C.orange),
    mono(s.selected, -0.08, -0.65, 16, stage >= 11 ? C.orange : C.cyan), mono(s.cin, 1.15, 1.9, 17, C.orange),
    mono(s.result, 4.15, 0.1, 18, stage >= 13 ? C.green : C.blue), mono(s.zf, 4.72, 0.95, 15, C.green),
    mono(s.of, 4.72, 0.5, 15, s.of === '1' ? C.red : C.green), mono(s.sf, 4.72, -0.4, 15, C.text),
    mono(s.cf, 4.72, -0.85, 15, C.green), mono(s.carryIntoSign, 1.25, -1.72, 15, C.text), mono(s.cout, 2.25, -1.72, 15, C.text),
  ]
  const op = mono(operation(stage), 0, -3.05, 15, stage >= 7 ? C.orange : C.blue)
  const note = label(stage === 0 ? '点击“下一步”，观察控制信号如何选通输入并产生标志位' : NOTES[stage - 1], 0, -3.62, 15, C.text, '700')
  return {
    elements: [...baseStructure(), ...selection.objects, ...formulas, ...values, op, note], values,
    selection: selection.objects, selectionKey: selection.key, formulas, operation: op, note,
  }
}

async function movePacket(scene: Scene, content: string, from: Vector3Tuple, to: Vector3Tuple, color: string): Promise<Text> {
  const packet = mono(content, from[0], from[1], 14, color)
  scene.add(packet)
  await scene.play(new Shift(packet, { direction: [to[0] - from[0], to[1] - from[1], 0], duration: 0.72, rateFunc: linear }))
  await scene.play(new Indicate(packet, { color, scaleFactor: 1.12, duration: 0.32 }))
  return packet
}

async function renderStep(scene: Scene, stage: number, animate: boolean): Promise<void> {
  const previousStage = animate ? stage - 1 : stage
  const frame = buildFrame(previousStage)
  scene.add(...frame.elements)
  if (animate) {
    const target = buildFrame(stage)
    const moving: Text[] = []
    const formulaInputStage = stage === 6 || stage === 8 || stage === 14 || stage === 16
    if (formulaInputStage) {
      const newFormula = target.formulas.slice(frame.formulas.length)
      const skeleton = [newFormula[0], newFormula[1], newFormula[3], newFormula[5]]
      scene.add(...skeleton)
      await scene.play(...skeleton.map(item => new FadeIn(item, { duration: 0.36 })))
    }
    if (stage === 2) moving.push(await movePacket(scene, 'SUB=0', [-1.25, 2.82, 0], [-1.62, 0.47, 0], C.orange))
    if (stage === 3) moving.push(await movePacket(scene, '0011', [-2.08, -0.2, 0], [-0.08, -0.65, 0], C.cyan))
    if (stage === 4) {
      moving.push(await movePacket(scene, '0101', [-4.45, 1.41, 0], [0.9, 0.62, 0], C.blue))
      moving.push(await movePacket(scene, '0011', [-0.08, -0.65, 0], [0.9, -0.62, 0], C.cyan))
    }
    if (stage === 5) moving.push(await movePacket(scene, '1000', [1.75, 0.02, 0], [4.15, 0.1, 0], C.blue))
    if (stage === 6) {
      moving.push(await movePacket(scene, 'SUB=0', [-1.25, 2.82, 0], [-2.75, -2.38, 0], C.green))
      moving.push(await movePacket(scene, 'Cout=0', [2.25, -1.72, 0], [-0.45, -2.38, 0], C.green))
    }
    if (stage === 8) {
      moving.push(await movePacket(scene, 'Cout=0', [2.25, -1.72, 0], [3.35, -2.38, 0], C.red))
      moving.push(await movePacket(scene, 'Cₙ₋₁=1', [1.25, -1.72, 0], [5.55, -2.38, 0], C.red))
    }
    if (stage === 11) moving.push(await movePacket(scene, 'SUB=1', [-1.25, 2.82, 0], [-1.62, 0.47, 0], C.orange))
    if (stage === 12) {
      moving.push(await movePacket(scene, '0101', [-4.45, 1.41, 0], [0.9, 0.62, 0], C.blue))
      moving.push(await movePacket(scene, '1100', [-0.08, -0.65, 0], [0.9, -0.62, 0], C.orange))
    }
    if (stage === 13) moving.push(await movePacket(scene, '0010', [1.75, 0.02, 0], [4.15, 0.1, 0], C.green))
    if (stage === 14) {
      moving.push(await movePacket(scene, 'SUB=1', [-1.25, 2.82, 0], [-2.75, -2.38, 0], C.green))
      moving.push(await movePacket(scene, 'Cout=1', [2.25, -1.72, 0], [-0.45, -2.38, 0], C.green))
    }
    if (stage === 16) {
      moving.push(await movePacket(scene, 'Cout=1', [2.25, -1.72, 0], [3.35, -2.38, 0], C.green))
      moving.push(await movePacket(scene, 'Cₙ₋₁=1', [1.25, -1.72, 0], [5.55, -2.38, 0], C.green))
    }

    if (frame.selectionKey !== target.selectionKey) {
      if (frame.selection.length) await scene.play(...frame.selection.map(item => new FadeOut(item, { duration: 0.28 })))
      if (target.selection.length) {
        scene.add(...target.selection)
        await scene.play(...target.selection.map(item => new FadeIn(item, { duration: 0.38 })))
      }
    }
    if (!formulaInputStage && target.formulas.length < frame.formulas.length) {
      await scene.play(...frame.formulas.map(item => new FadeOut(item, { duration: 0.3 })))
    } else if (!formulaInputStage && target.formulas.length > frame.formulas.length) {
      const additions = target.formulas.slice(frame.formulas.length)
      scene.add(...additions)
      await scene.play(...additions.map(item => new FadeIn(item, { duration: 0.4 })))
    } else if (!formulaInputStage && target.formulas.length) {
      await scene.play(...frame.formulas.map((item, index) => new Transform(item, target.formulas[index], { duration: 0.42, rateFunc: smooth })))
    }
    await scene.play(
      ...frame.values.map((item, index) => new Transform(item, target.values[index], { duration: 0.48, rateFunc: smooth })),
      new Transform(frame.operation, target.operation, { duration: 0.42, rateFunc: smooth }),
      new Transform(frame.note, target.note, { duration: 0.42, rateFunc: smooth }),
    )
    if (moving.length && !formulaInputStage) scene.remove(...moving)
    if (stage === 2 && target.selection.length) await scene.play(new Indicate(target.selection[1], { color: C.blue, scaleFactor: 1.2, duration: 0.5 }))
    if (stage === 11 && target.selection.length) await scene.play(new Indicate(target.selection[1], { color: C.orange, scaleFactor: 1.2, duration: 0.5 }))
    if (stage === 7 || stage === 15) await scene.play(new Indicate(frame.values[11], { color: C.green, scaleFactor: 1.28, duration: 0.5 }))
    if (stage === 9 || stage === 17) await scene.play(new Indicate(frame.values[9], { color: stage === 9 ? C.red : C.green, scaleFactor: 1.28, duration: 0.5 }))
  }
  scene.render()
}

export const aluFlagsCircuitAnimation: ManimWebAnimation = {
  id: 'alu-add-sub-flags-circuit',
  ariaLabel: 'SUB 进入 MUX 后选通 B 或 B 反相量，使同一加法器完成加减法，并分步计算 CF 与 OF 的动画',
  initialState: { id: 'alu-circuit-overview', render: scene => { scene.add(...buildFrame(0).elements); scene.render() } },
  scene: { width: 1440, height: 860, frameWidth: 16, frameHeight: 9.6, backgroundColor: '#ffffff' },
  steps: NOTES.map((_, index) => ({ id: `alu-flags-${index + 1}`, render: (scene, animate) => renderStep(scene, index + 1, animate) })),
}
