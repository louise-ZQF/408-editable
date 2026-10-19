import {
  Indicate,
  Line,
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
  blue: '#1d4ed8', cyan: '#0891b2', green: '#047857', orange: '#c2410c', red: '#b91c1c',
} as const

const NOTES = [
  '先拆地址：页目录号和页表索引用于查表，页内偏移始终原样保留',
  '把页目录号和页表索引拼成 TAG 0x00030005；TLB 中没有这一项',
  'MMU 先读取页目录基址寄存器，得到页目录表基址 0x1000',
  '页目录项占 4 B；先用页目录号乘以 4，得到项内偏移 0x000C',
  '再把项内偏移 0x000C 加到页目录表基址 0x1000，得到页目录项地址 0x100C',
  '访问 0x100C 的页目录项，读出真正的页表基址 0x1234',
  '页表项也占 4 B；先用页表索引乘以 4，得到项内偏移 0x0014',
  '再把项内偏移 0x0014 加到页表基址 0x1234，得到页表项地址 0x1248',
  '访问 0x1248 的页表项；有效位为 1，页面在主存，物理页号为 0x4567',
  '把物理页号与原来的页内偏移拼接，得到最终物理地址',
  '把 TAG 0x00030005 到物理页号 0x4567 的映射回填 TLB',
  '再次访问同一虚页时，TAG 在 TLB 中命中，不必再查页目录和页表',
] as const

const CALCULATIONS = [
  '等待地址进入 MMU',
  'VA = 0x0003 | 0x0005 | 0x0678',
  'TLB.lookup(0x00030005) → miss',
  '页目录基址寄存器 → 0x1000',
  '页目录项内偏移 = 0x0003 × 4 = 0x000C',
  '页目录项地址 = 0x1000 + 0x000C = 0x100C',
  '页目录项[0x0003] → 页表基址 0x1234',
  '页表项内偏移 = 0x0005 × 4 = 0x0014',
  '页表项地址 = 0x1234 + 0x0014 = 0x1248',
  '页表项[0x0005] → 有效位=1，物理页号=0x4567',
  '物理地址 = 0x4567 | 0x0678',
  'TLB[0x00030005] ← 0x4567',
  'TLB.lookup(0x00030005) → hit',
] as const

type Frame = { elements: Mobject[]; note: Text; calculation: Text }

function label(content: string, x: number, y: number, size = 17, color: string = C.text, weight = '600'): Text {
  return new Text({ text: content, fontSize: size, color, fontFamily: 'Noto Sans SC, PingFang SC, Microsoft YaHei, sans-serif', fontWeight: weight }).moveTo([x, y, 0])
}

function mono(content: string, x: number, y: number, size = 18, color: string = C.ink): Text {
  return new Text({ text: content, fontSize: size, color, fontFamily: 'JetBrains Mono, SFMono-Regular, Consolas, monospace', fontWeight: '700' }).moveTo([x, y, 0])
}

function box(x: number, y: number, width: number, height: number, color: string = C.border, fillOpacity = 0.035, strokeWidth = 2): Rectangle {
  return new Rectangle({ width, height, center: [x, y, 0], color, fillOpacity, strokeWidth })
}

function line(start: Vector3Tuple, end: Vector3Tuple, color: string = C.border, strokeWidth = 2): Line {
  return new Line({ start, end, color, strokeWidth })
}

function panel(title: string, x: number, y: number, width: number, height: number): Mobject[] {
  return [box(x, y, width, height, C.border, 0.025, 2), label(title, x, y + height / 2 - 0.34, 16, C.ink, '800'), line([x - width / 2, y + height / 2 - 0.68, 0], [x + width / 2, y + height / 2 - 0.68, 0], C.border, 1.6)]
}

function addressStrip(): Mobject[] {
  return [
    box(-3.3, 2.55, 3.25, 0.86, C.blue, 0.04, 2.4), box(0, 2.55, 3.25, 0.86, C.cyan, 0.04, 2.4), box(3.3, 2.55, 3.25, 0.86, C.orange, 0.04, 2.4),
    label('页目录号', -3.3, 2.77, 15, C.blue, '800'), label('页表索引', 0, 2.77, 15, C.cyan, '800'), label('页内偏移', 3.3, 2.77, 15, C.orange, '800'),
  ]
}

function baseStructure(): Mobject[] {
  return [
    label('两级页表的地址翻译', 0, 4.03, 27, C.ink, '800'),
    label('页目录项给出页表基址；页表项直接给出物理页号', 0, 3.58, 16, C.muted, '600'),
    box(-7.05, 2.55, 1.15, 0.86, C.border, 0.04, 2), label('CPU', -7.05, 2.55, 16, C.ink, '800'), line([-6.45, 2.55, 0], [-4.95, 2.55, 0], C.border, 2.2), ...addressStrip(),
    ...panel('TLB', -5.65, 0.45, 3.2, 2.55),
    label('TAG', -6.38, 0.82, 14, C.muted, '700'), label('有效位', -5.52, 0.82, 13, C.muted, '700'), label('物理页号', -4.67, 0.82, 13, C.muted, '700'),
    line([-7.05, 0.54, 0], [-4.25, 0.54, 0], C.border, 1.4), line([-5.94, 1.05, 0], [-5.94, -0.75, 0], C.border, 1.2), line([-5.08, 1.05, 0], [-5.08, -0.75, 0], C.border, 1.2),
    box(-1.9, 0.45, 3.55, 2.55, C.border, 0.025, 2), label('页目录表', -2.5, 1.37, 16, C.ink, '800'), line([-3.68, 1.02, 0], [-0.12, 1.02, 0], C.border, 1.6),
    label('页目录项地址', -2.72, 0.82, 13, C.muted, '700'), label('页表基址', -1.08, 0.82, 13, C.muted, '700'),
    line([-3.5, 0.54, 0], [-0.3, 0.54, 0], C.border, 1.4), line([-1.9, 1.05, 0], [-1.9, -0.75, 0], C.border, 1.2),
    box(3.55, 0.45, 6.65, 2.55, C.border, 0.025, 2), label('页表', 2.45, 1.37, 16, C.ink, '800'), line([0.22, 1.02, 0], [6.88, 1.02, 0], C.border, 1.6),
    label('页表项地址', 1.12, 0.82, 13, C.muted, '700'), label('有效位', 2.5, 0.82, 13, C.muted, '700'), label('访问位', 3.45, 0.82, 13, C.muted, '700'), label('修改位', 4.4, 0.82, 13, C.muted, '700'), label('物理页号', 5.75, 0.82, 13, C.muted, '700'),
    line([0.47, 0.54, 0], [6.63, 0.54, 0], C.border, 1.4), line([1.82, 1.05, 0], [1.82, -0.75, 0], C.border, 1.2), line([2.97, 1.05, 0], [2.97, -0.75, 0], C.border, 1.2), line([3.93, 1.05, 0], [3.93, -0.75, 0], C.border, 1.2), line([4.9, 1.05, 0], [4.9, -0.75, 0], C.border, 1.2),
    box(0, -1.27, 11.2, 0.6, C.border, 0.025, 1.6),
    label('物理地址', -5.6, -2.28, 16, C.ink, '800'), box(-1.3, -2.28, 5.5, 0.88, C.green, 0.035, 2.3), box(3.05, -2.28, 3.2, 0.88, C.orange, 0.035, 2.3),
    label('物理页号', -1.3, -2.06, 14, C.green, '800'), label('页内偏移', 3.05, -2.06, 14, C.orange, '800'), line([-7.45, -3.08, 0], [7.45, -3.08, 0], C.border, 1.3),
  ]
}

function committed(stage: number): Mobject[] {
  const elements: Mobject[] = []
  if (stage >= 1) elements.push(mono('0x0003', -3.3, 2.37, 18, C.blue), mono('0x0005', 0, 2.37, 18, C.cyan), mono('0x0678', 3.3, 2.37, 18, C.orange))
  if (stage >= 2) elements.push(mono('0x00030005', -6.38, 0.17, 13, C.text), label('未找到', -4.67, 0.17, 13, C.red, '800'), box(-5.65, 0.17, 2.8, 0.58, C.red, 0.025, 2.4))
  if (stage >= 3) elements.push(mono('0x1000', -0.72, 1.37, 14, C.blue), label('基址', -1.45, 1.37, 12, C.muted, '700'))
  if (stage >= 4) elements.push(mono('0x000C', -2.05, -0.43, 14, C.blue), label('项内偏移', -3.0, -0.43, 12, C.muted, '700'))
  if (stage >= 5) elements.push(mono('0x100C', -2.72, 0.17, 15, C.blue), box(-1.9, 0.17, 3.15, 0.58, C.blue, 0.025, 2.4))
  if (stage >= 6) elements.push(mono('0x1234', 5.35, 1.37, 14, C.cyan), mono('0x1234', -1.08, 0.17, 15, C.cyan), label('基址', 4.55, 1.37, 12, C.muted, '700'))
  if (stage >= 7) elements.push(mono('0x0014', 1.7, -0.43, 14, C.cyan), label('项内偏移', 0.75, -0.43, 12, C.muted, '700'))
  if (stage >= 8) elements.push(mono('0x1248', 1.12, 0.17, 15, C.cyan), box(3.55, 0.17, 6.15, 0.58, C.cyan, 0.02, 2.4))
  if (stage >= 9) elements.push(mono('1', 2.5, 0.17, 17, C.green), mono('1', 3.45, 0.17, 17, C.text), mono('0', 4.4, 0.17, 17, C.text), mono('0x4567', 5.75, 0.17, 15, C.green))
  if (stage >= 10) elements.push(mono('0x4567', -1.3, -2.47, 19, C.green), mono('0x0678', 3.05, -2.47, 19, C.orange))
  if (stage >= 11) elements.push(mono('0x00030005', -6.38, -0.42, 13, C.blue), mono('1', -5.52, -0.42, 16, C.green), mono('0x4567', -4.67, -0.42, 14, C.green), box(-5.65, -0.42, 2.8, 0.58, C.green, 0.025, 2.4))
  if (stage >= 12) elements.push(label('TAG 命中', -5.65, -0.91, 14, C.green, '800'), box(-5.65, -0.42, 2.8, 0.58, C.green, 0.04, 3.2))
  return elements
}

function buildFrame(stage: number): Frame {
  const calculation = mono(CALCULATIONS[stage], 0, -1.27, 16, stage === 2 ? C.red : stage >= 7 ? C.green : C.blue)
  const note = label(stage === 0 ? '点击“下一步”，从一条虚拟地址开始完成翻译' : NOTES[stage - 1], 0, -3.62, 15, C.text, '700')
  return { elements: [...baseStructure(), ...committed(stage), calculation, note], note, calculation }
}

async function movePacket(scene: Scene, content: string, from: Vector3Tuple, segments: Vector3Tuple[], color: string, size = 17): Promise<Text> {
  const packet = mono(content, from[0], from[1], size, color)
  scene.add(packet)
  await scene.play(new Indicate(packet, { color, scaleFactor: 1.14, duration: 0.4 }))
  let current = from
  for (const destination of segments) {
    await scene.play(new Shift(packet, { direction: [destination[0] - current[0], destination[1] - current[1], 0], duration: 0.58, rateFunc: linear }))
    current = destination
  }
  return packet
}

async function commitStep(scene: Scene, frame: Frame, stage: number, packet?: Mobject): Promise<void> {
  const additions = committed(stage).slice(committed(stage - 1).length)
  if (packet && additions.length) {
    scene.add(...additions.slice(1))
    await scene.play(new Transform(packet, additions[0], { duration: 0.45, rateFunc: smooth }))
  } else scene.add(...additions)
  await scene.play(
    new Transform(frame.calculation, mono(CALCULATIONS[stage], 0, -1.27, 16, stage === 2 ? C.red : stage >= 7 ? C.green : C.blue), { duration: 0.42, rateFunc: smooth }),
    new Transform(frame.note, label(NOTES[stage - 1], 0, -3.62, 15, C.text, '700'), { duration: 0.42, rateFunc: smooth }),
  )
}

async function animateTransition(scene: Scene, frame: Frame, stage: number): Promise<void> {
  if (stage === 1) {
    const packet = await movePacket(scene, 'VA = 0x0003 | 0x0005 | 0x0678', [-6.2, 2.55, 0], [[-0.8, 2.55, 0]], C.blue, 15)
    await commitStep(scene, frame, stage)
    await scene.play(new Transform(packet, label('拆成三个字段', -0.8, 3.12, 14, C.muted, '700'), { duration: 0.5, rateFunc: smooth }))
  } else if (stage === 2) {
    const packet = await movePacket(scene, 'TAG 0x00030005', [-1.65, 2.37, 0], [[-1.65, 1.58, 0], [-5.65, 1.58, 0], [-5.65, 0.17, 0]], C.blue, 15)
    await commitStep(scene, frame, stage, packet)
  } else if (stage === 3) {
    const packet = await movePacket(scene, '0x1000', [-4.0, 1.37, 0], [[-0.72, 1.37, 0]], C.blue, 15)
    await commitStep(scene, frame, stage, packet)
  } else if (stage === 4) {
    const packet = await movePacket(scene, '0x0003 × 4', [-3.3, 2.37, 0], [[-3.3, -1.27, 0], [-2.05, -1.27, 0], [-2.05, -0.43, 0]], C.blue, 15)
    await commitStep(scene, frame, stage, packet)
  } else if (stage === 5) {
    const packet = await movePacket(scene, '0x1000 + 0x000C', [-0.72, 1.37, 0], [[-0.72, -0.9, 0], [-2.72, -0.9, 0], [-2.72, 0.17, 0]], C.blue, 14)
    await commitStep(scene, frame, stage, packet)
  } else if (stage === 6) {
    const packet = await movePacket(scene, '0x1234', [-1.08, 0.17, 0], [[-1.08, -0.9, 0], [5.35, -0.9, 0], [5.35, 1.37, 0]], C.cyan, 16)
    await commitStep(scene, frame, stage, packet)
  } else if (stage === 7) {
    const packet = await movePacket(scene, '0x0005 × 4', [0, 2.37, 0], [[0, -1.27, 0], [1.7, -1.27, 0], [1.7, -0.43, 0]], C.cyan, 15)
    await commitStep(scene, frame, stage, packet)
  } else if (stage === 8) {
    const packet = await movePacket(scene, '0x1234 + 0x0014', [5.35, 1.37, 0], [[5.35, -0.9, 0], [1.12, -0.9, 0], [1.12, 0.17, 0]], C.cyan, 14)
    await commitStep(scene, frame, stage, packet)
  } else if (stage === 9) {
    const packet = await movePacket(scene, '读取页表项 @ 0x1248', [1.12, 0.17, 0], [[1.12, -0.85, 0], [2.5, -0.85, 0], [2.5, 0.17, 0]], C.green, 14)
    await commitStep(scene, frame, stage, packet)
  } else if (stage === 10) {
    const pageNumber = await movePacket(scene, '0x4567', [5.75, 0.17, 0], [[5.75, -1.55, 0], [-1.3, -1.55, 0], [-1.3, -2.47, 0]], C.green, 16)
    const offset = await movePacket(scene, '0x0678', [3.3, 2.37, 0], [[3.3, -2.47, 0]], C.orange, 17)
    await scene.play(
      new Transform(frame.calculation, mono(CALCULATIONS[stage], 0, -1.27, 16, C.green), { duration: 0.42, rateFunc: smooth }),
      new Transform(frame.note, label(NOTES[stage - 1], 0, -3.62, 15, C.text, '700'), { duration: 0.42, rateFunc: smooth }),
    )
    await scene.play(new Indicate(pageNumber, { color: C.green, scaleFactor: 1.1, duration: 0.42 }), new Indicate(offset, { color: C.orange, scaleFactor: 1.1, duration: 0.42 }))
  } else if (stage === 11) {
    const packet = await movePacket(scene, '0x00030005 → 0x4567', [-0.2, -2.47, 0], [[-0.2, -0.95, 0], [-5.65, -0.95, 0], [-5.65, -0.42, 0]], C.green, 14)
    await commitStep(scene, frame, stage, packet)
  } else {
    const packet = await movePacket(scene, 'TAG 0x00030005', [-1.65, 2.37, 0], [[-1.65, 1.58, 0], [-5.65, 1.58, 0], [-5.65, -0.42, 0]], C.blue, 15)
    await scene.play(new Indicate(packet, { color: C.green, scaleFactor: 1.22, duration: 0.58 }))
    await commitStep(scene, frame, stage)
  }
}

async function renderStep(scene: Scene, stage: number, animate: boolean): Promise<void> {
  const frame = buildFrame(animate ? stage - 1 : stage)
  scene.add(...frame.elements)
  if (animate) await animateTransition(scene, frame, stage)
  scene.render()
}

export const virtualMemoryTranslationAnimation: ManimWebAnimation = {
  id: 'two-level-virtual-memory-translation',
  ariaLabel: '使用完整 TAG 查询 TLB，未命中后计算页目录项和页表项地址，再得到物理页号并拼接物理地址的分步动画',
  initialState: { id: 'vm-translation-overview', render: scene => { scene.add(...buildFrame(0).elements); scene.render() } },
  scene: { width: 1440, height: 820, frameWidth: 16, frameHeight: 9.1, backgroundColor: '#ffffff' },
  steps: NOTES.map((_, index) => ({ id: `vm-translation-${index + 1}`, render: (scene, animate) => renderStep(scene, index + 1, animate) })),
}
