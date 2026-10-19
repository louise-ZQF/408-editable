import {
  Circle,
  FadeIn,
  Indicate,
  Line,
  Rectangle,
  Text,
  Transform,
  smooth,
  type Mobject,
  type Scene,
  type Vector3Tuple,
} from '@/animations/manim'
import type { ManimWebAnimation } from '../../types'

const C = {
  ink: '#0f172a', text: '#334155', muted: '#64748b', border: '#cbd5e1',
  blue: '#1d4ed8', cyan: '#0891b2', green: '#047857', orange: '#c2410c', red: '#b91c1c',
} as const

const NOTES = [
  'CPU 地址拆成标记、组号和块内偏移；组号决定只访问哪一组',
  '组号 01 选中第 1 组，两路的标记与数据被同时读出',
  '地址标记和两路中保存的标记分别沿线路进入比较器，两路同时比较',
  '路 0 标记不同，路 1 的有效位为 1 且标记相同，因此路 1 命中',
  '比较器 1 输出 1，命中信号选通 MUX 的下方输入，路 1 数据线路导通',
  'MUX 输出路 1 的数据块，再用块内偏移 10 取出目标字节 D5',
] as const

type Frame = { elements: Mobject[]; dynamic: Mobject[]; operation: Text; note: Text }

function label(content: string, x: number, y: number, size = 16, color: string = C.text, weight = '600'): Text {
  return new Text({ text: content, fontSize: size, color, fontFamily: 'Noto Sans SC, PingFang SC, Microsoft YaHei, sans-serif', fontWeight: weight }).moveTo([x, y, 0])
}

function mono(content: string, x: number, y: number, size = 16, color: string = C.ink): Text {
  return new Text({ text: content, fontSize: size, color, fontFamily: 'JetBrains Mono, SFMono-Regular, Consolas, monospace', fontWeight: '700' }).moveTo([x, y, 0])
}

function box(x: number, y: number, width: number, height: number, color: string = C.border, fillOpacity = 0.02, strokeWidth = 2): Rectangle {
  return new Rectangle({ width, height, center: [x, y, 0], color, fillOpacity, strokeWidth })
}

function line(start: Vector3Tuple, end: Vector3Tuple, color: string = C.border, strokeWidth = 2): Line {
  return new Line({ start, end, color, strokeWidth })
}

function baseStructure(): Mobject[] {
  return [
    label('二路组相联 Cache：一次访问如何命中', 0, 4.15, 27, C.ink, '800'),
    label('同一组的两路并行比较，命中后再选择对应数据', 0, 3.72, 16, C.muted, '600'),

    label('CPU 地址', -6.7, 2.75, 16, C.ink, '800'),
    box(-3.9, 2.75, 4.9, 0.82, C.blue, 0.025, 2.2),
    line([-5.25, 2.34, 0], [-5.25, 3.16, 0], C.border, 1.3),
    line([-3.3, 2.34, 0], [-3.3, 3.16, 0], C.border, 1.3),
    label('标记', -6.18, 3.35, 13, C.blue, '800'),
    label('组号', -4.28, 3.35, 13, C.cyan, '800'),
    label('块内偏移', -2.24, 3.35, 13, C.orange, '800'),

    box(-3.85, 0.38, 5.45, 3.35, C.border, 0.015, 2),
    label('第 1 组', -3.85, 1.78, 17, C.ink, '800'),
    label('有效位', -5.7, 1.31, 13, C.muted, '700'),
    label('标记', -4.65, 1.31, 13, C.muted, '700'),
    label('数据块', -2.83, 1.31, 13, C.muted, '700'),
    line([-6.25, 1.02, 0], [-1.45, 1.02, 0], C.border, 1.3),
    line([-6.25, 0.02, 0], [-1.45, 0.02, 0], C.border, 1.3),
    label('路 0', -6.65, 0.53, 14, C.text, '800'),
    label('路 1', -6.65, -0.47, 14, C.text, '800'),
    mono('1', -5.7, 0.53, 16), mono('0x19', -4.65, 0.53, 16), mono('A0 A1 A2 A3', -2.82, 0.53, 14),
    mono('1', -5.7, -0.47, 16), mono('0x2A', -4.65, -0.47, 16), mono('D3 D4 D5 D6', -2.82, -0.47, 14),

    label('比较器 0', 0.05, 2.03, 13, C.text, '800'),
    new Circle({ radius: 0.43, center: [0.05, 1.48, 0], color: C.border, fillOpacity: 0.02, strokeWidth: 2 }),
    label('＝', 0.05, 1.48, 22, C.ink, '800'),
    label('比较器 1', 0.05, -1.02, 13, C.text, '800'),
    new Circle({ radius: 0.43, center: [0.05, -1.57, 0], color: C.border, fillOpacity: 0.02, strokeWidth: 2 }),
    label('＝', 0.05, -1.57, 22, C.ink, '800'),
    line([-4.15, 0.53, 0], [-4.15, 1.48, 0], C.border, 1.7),
    line([-4.15, 1.48, 0], [-0.38, 1.48, 0], C.border, 1.7),
    line([-4.15, -0.47, 0], [-4.15, -1.57, 0], C.border, 1.7),
    line([-4.15, -1.57, 0], [-0.38, -1.57, 0], C.border, 1.7),

    label('两路数据块', 1.72, 1.12, 13, C.text, '800'),
    line([-1.45, 0.53, 0], [1.65, 0.48, 0], C.border, 2),
    line([-1.45, -0.47, 0], [1.65, -0.2, 0], C.border, 2),

    label('命中选择', 2.72, 1.1, 14, C.text, '800'), box(2.72, 0.15, 2.15, 1.55, C.border, 0.02, 2),
    label('MUX', 2.72, 0.15, 18, C.ink, '800'),
    line([0.48, 1.48, 0], [2.72, 1.48, 0], C.border, 1.7),
    line([2.72, 1.48, 0], [2.72, 0.93, 0], C.border, 1.7),
    line([0.48, -1.57, 0], [2.72, -1.57, 0], C.border, 1.7),
    line([2.72, -1.57, 0], [2.72, -0.63, 0], C.border, 1.7),
    line([3.8, 0.15, 0], [5.25, 0.15, 0], C.border, 2),
    box(6.15, 0.15, 1.8, 0.82, C.green, 0.025, 2.2),
    label('CPU 数据', 6.15, 0.78, 14, C.green, '800'),

    line([-7.2, -2.35, 0], [7.2, -2.35, 0], C.border, 1.2),
  ]
}

function operation(stage: number): string {
  return [
    '等待 CPU 发出地址',
    '地址 = 标记 0x2A ｜组号 01｜偏移 10',
    '组号 01 → 选中第 1 组',
    '地址标记 0x2A 与两路 Cache 标记同时进入比较器',
    '路 0：不相等；路 1：valid=1 且 tag 相等 → 命中',
    '比较器 1 输出 1 → 下方数据线路导通',
    'MUX 输出路 1 数据块；偏移 10 → 取出 D5',
  ][stage]
}

function dynamicState(stage: number): Mobject[] {
  const items: Mobject[] = []
  if (stage >= 1) items.push(
    mono('0x2A', -6.18, 2.75, 17, C.blue), mono('01', -4.28, 2.75, 17, C.cyan), mono('10', -2.24, 2.75, 17, C.orange),
  )
  if (stage >= 2) items.push(
    line([-4.28, 2.32, 0], [-4.28, 2.05, 0], C.cyan, 3.2),
    box(-3.85, 0.38, 5.65, 3.55, C.cyan, 0.018, 3),
    label('选中', -1.05, 1.82, 13, C.cyan, '800'),
  )
  if (stage >= 3) items.push(
    mono('0x2A', -0.7, 1.78, 13, C.blue), mono('0x2A', -0.7, -1.27, 13, C.blue),
    line([-5.52, 2.36, 0], [-5.52, 1.65, 0], C.blue, 2.2),
    line([-5.52, 1.65, 0], [-0.7, 1.65, 0], C.blue, 2.2),
    line([-0.7, 1.65, 0], [-0.38, 1.48, 0], C.blue, 2.2),
    line([-0.7, 1.65, 0], [-0.7, -1.27, 0], C.blue, 2.2),
    line([-0.7, -1.27, 0], [-0.38, -1.57, 0], C.blue, 2.2),
    line([-4.15, 0.53, 0], [-4.15, 1.48, 0], C.cyan, 3.4),
    line([-4.15, 1.48, 0], [-0.38, 1.48, 0], C.cyan, 3.4),
    line([-4.15, -0.47, 0], [-4.15, -1.57, 0], C.cyan, 3.4),
    line([-4.15, -1.57, 0], [-0.38, -1.57, 0], C.cyan, 3.4),
    label('Cache 标记 0x19', -2.6, 1.72, 12, C.cyan, '800'),
    label('Cache 标记 0x2A', -2.6, -1.82, 12, C.cyan, '800'),
  )
  if (stage >= 4) items.push(
    new Circle({ radius: 0.5, center: [0.05, 1.48, 0], color: C.red, fillOpacity: 0.035, strokeWidth: 2.8 }),
    label('0', 0.78, 1.48, 20, C.red, '800'),
    new Circle({ radius: 0.5, center: [0.05, -1.57, 0], color: C.green, fillOpacity: 0.04, strokeWidth: 2.9 }),
    label('1', 0.78, -1.57, 20, C.green, '800'),
    label('路 1 命中', 1.55, -1.9, 14, C.green, '800'),
  )
  if (stage >= 5) items.push(
    line([-1.45, -0.47, 0], [1.65, -0.2, 0], C.green, 4),
    line([0.48, -1.57, 0], [2.72, -1.57, 0], C.green, 3.5),
    line([2.72, -1.57, 0], [2.72, -0.63, 0], C.green, 3.5),
    box(2.72, 0.15, 2.35, 1.75, C.green, 0.035, 2.7),
    label('下方线路已导通', 1.22, -0.68, 13, C.green, '800'),
  )
  if (stage >= 6) items.push(
    line([3.8, 0.15, 0], [5.25, 0.15, 0], C.green, 3.5),
    label('MUX 选择路 1 数据块', 2.72, -0.42, 13, C.green, '800'),
    mono('D5', 6.15, 0.15, 19, C.green),
    label('偏移 10 选择块内第 3 个字节', 4.9, -0.65, 14, C.orange, '800'),
  )
  return items
}

function buildFrame(stage: number): Frame {
  const dynamic = dynamicState(stage)
  const operationText = mono(operation(stage), 0, -2.72, 15, stage >= 4 ? C.green : C.blue)
  const note = label(stage === 0 ? '点击“下一步”，沿着一次读取路径观察二路并行匹配' : NOTES[stage - 1], 0, -3.35, 15, C.text, '700')
  return { elements: [...baseStructure(), ...dynamic, operationText, note], dynamic, operation: operationText, note }
}

async function renderStep(scene: Scene, stage: number, animate: boolean): Promise<void> {
  const previousStage = animate ? stage - 1 : stage
  const frame = buildFrame(previousStage)
  scene.add(...frame.elements)
  if (animate) {
    const previousDynamic = dynamicState(previousStage)
    const targetDynamic = dynamicState(stage)
    const additions = targetDynamic.slice(previousDynamic.length)
    scene.add(...additions)
    await scene.play(
      ...additions.map(item => new FadeIn(item, { duration: 0.42 })),
      new Transform(frame.operation, mono(operation(stage), 0, -2.72, 15, stage >= 4 ? C.green : C.blue), { duration: 0.42, rateFunc: smooth }),
      new Transform(frame.note, label(NOTES[stage - 1], 0, -3.35, 15, C.text, '700'), { duration: 0.42, rateFunc: smooth }),
    )
    if (stage === 2) await scene.play(new Indicate(additions[1], { color: C.cyan, scaleFactor: 1.03, duration: 0.5 }))
    if (stage === 3) await scene.play(new Indicate(additions[7], { color: C.cyan, scaleFactor: 1.03, duration: 0.55 }))
    if (stage === 4) await scene.play(new Indicate(additions[2], { color: C.green, scaleFactor: 1.06, duration: 0.55 }))
    if (stage === 5) await scene.play(new Indicate(additions[0], { color: C.green, scaleFactor: 1.05, duration: 0.55 }))
    if (stage === 6) await scene.play(new Indicate(additions[2], { color: C.green, scaleFactor: 1.12, duration: 0.55 }))
  }
  scene.render()
}

export const twoWaySetAssociativeCacheAnimation: ManimWebAnimation = {
  id: 'two-way-set-associative-cache-match',
  ariaLabel: '地址拆分后定位 Cache 组，并在两路中并行比较标记、选择命中数据的分步动画',
  initialState: { id: 'cache-overview', render: scene => { scene.add(...buildFrame(0).elements); scene.render() } },
  scene: { width: 1440, height: 820, frameWidth: 16, frameHeight: 9.1, backgroundColor: '#ffffff' },
  steps: NOTES.map((_, index) => ({ id: `cache-match-${index + 1}`, render: (scene, animate) => renderStep(scene, index + 1, animate) })),
}
