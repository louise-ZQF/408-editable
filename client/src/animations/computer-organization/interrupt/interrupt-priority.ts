import {
  FadeIn,
  FadeOut,
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
  blue: '#1d4ed8', cyan: '#0891b2', green: '#047857', orange: '#c2410c', purple: '#6d28d9', red: '#b91c1c',
} as const

const NOTES = [
  'A 的响应优先级最高，CPU 先执行 A；A 的屏蔽字 1111，不允许嵌套',
  'A 返回后，待处理的 B、C、D 中先响应 B，并装入 B 的屏蔽字 0100',
  'B 已重新开中断；C、D 的请求到达后，B 被打断，CPU 改为响应 C',
  'CPU 刚进入 C 的中断服务程序，装入屏蔽字 0110，并重新开中断',
  'C 刚开中断就收到 D 请求；D 的处理优先级更高，CPU 立即改为响应 D',
  'D 完成后返回 C 的断点，C 继续执行并完成',
  'C 完成后返回 B 的断点，B 继续执行；最后回到原程序',
] as const

type Frame = { elements: Mobject[]; note: Text; active: Text; activeElements: Mobject[] }

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

function priorityTable(): Mobject[] {
  return [
    box(5.45, 0.65, 3.55, 4.3, C.border, 0.02, 2),
    label('中断源', 4.7, 2.42, 15, C.ink, '800'), label('屏蔽字', 6.15, 2.42, 15, C.ink, '800'),
    line([3.82, 2.08, 0], [7.08, 2.08, 0], C.border, 1.4), line([5.35, 2.72, 0], [5.35, -1.5, 0], C.border, 1.4),
    line([3.82, 1.25, 0], [7.08, 1.25, 0], C.border, 1.2), line([3.82, 0.42, 0], [7.08, 0.42, 0], C.border, 1.2), line([3.82, -0.41, 0], [7.08, -0.41, 0], C.border, 1.2),
    label('A', 4.7, 1.67, 17, C.ink, '800'), mono('1 1 1 1', 6.15, 1.67, 16),
    label('B', 4.7, 0.84, 17, C.ink, '800'), mono('0 1 0 0', 6.15, 0.84, 16),
    label('C', 4.7, 0.01, 17, C.ink, '800'), mono('0 1 1 0', 6.15, 0.01, 16),
    label('D', 4.7, -0.82, 17, C.ink, '800'), mono('0 1 1 1', 6.15, -0.82, 16),
    label('响应优先级：A > B > C > D', 5.45, -1.88, 14, C.blue, '800'),
    label('处理优先级：A > D > C > B', 5.45, -2.32, 14, C.orange, '800'),
  ]
}

function baseStructure(): Mobject[] {
  return [
    label('多重中断：响应优先级与处理优先级', 0, 4.18, 27, C.ink, '800'),
    label('屏蔽字决定当前程序允许哪些中断源继续嵌套', 0, 3.72, 16, C.muted, '600'),
    line([-6.65, -2.55, 0], [2.95, -2.55, 0], C.ink, 2.2),
    line([-6.65, -2.55, 0], [-6.65, 2.55, 0], C.ink, 2.2),
    label('时间', 2.78, -2.9, 14, C.muted, '700'),
    label('原程序', -7.28, -2.55, 14, C.muted, '700'),
    label('A 程序', -7.28, -1.45, 14, C.blue, '800'),
    label('B 程序', -7.28, -0.35, 14, C.cyan, '800'),
    label('C 程序', -7.28, 0.75, 14, C.purple, '800'),
    label('D 程序', -7.28, 1.85, 14, C.orange, '800'),
    ...priorityTable(),
    line([-7.5, -3.3, 0], [7.35, -3.3, 0], C.border, 1.2),
  ]
}

function pathSegment(start: Vector3Tuple, end: Vector3Tuple, color: string): Line {
  return line(start, end, color, 4)
}

function stagePath(stage: number): Mobject[] {
  const items: Mobject[] = []
  if (stage >= 1) items.push(
    pathSegment([-6.0, -2.55, 0], [-6.0, -1.45, 0], C.blue),
    pathSegment([-6.0, -1.45, 0], [-4.85, -1.45, 0], C.blue),
    pathSegment([-4.85, -1.45, 0], [-4.85, -2.55, 0], C.blue),
    label('A 处理完', -4.85, -2.9, 13, C.blue, '800'),
  )
  if (stage >= 2) items.push(
    pathSegment([-4.85, -2.55, 0], [-4.85, -0.35, 0], C.cyan),
    pathSegment([-4.85, -0.35, 0], [-2.45, -0.35, 0], C.cyan),
  )
  if (stage >= 4) items.push(
    pathSegment([-2.45, -0.35, 0], [-2.45, 0.75, 0], C.purple),
    pathSegment([-2.45, 0.75, 0], [-1.85, 0.75, 0], C.purple),
  )
  if (stage >= 5) items.push(
    pathSegment([-1.85, 0.75, 0], [-1.85, 1.85, 0], C.orange),
    pathSegment([-1.85, 1.85, 0], [-0.35, 1.85, 0], C.orange),
    pathSegment([-0.35, 1.85, 0], [-0.35, 0.75, 0], C.orange),
    label('D 处理完', -0.35, -2.9, 13, C.orange, '800'),
  )
  if (stage >= 6) items.push(
    pathSegment([-0.35, 0.75, 0], [1.05, 0.75, 0], C.purple),
    pathSegment([1.05, 0.75, 0], [1.05, -0.35, 0], C.purple),
    label('C 处理完', 1.05, -2.9, 13, C.purple, '800'),
  )
  if (stage >= 7) items.push(
    pathSegment([1.05, -0.35, 0], [2.35, -0.35, 0], C.cyan),
    pathSegment([2.35, -0.35, 0], [2.35, -2.55, 0], C.cyan),
    label('B 处理完', 2.35, -2.9, 13, C.cyan, '800'),
  )
  return items
}

function activeState(stage: number): Mobject[] {
  if (stage === 0) return []
  const rows = [1.67, 0.84, 0.01, -0.82]
  const row = stage === 1 ? 0 : stage === 2 || stage === 3 || stage === 7 ? 1 : stage === 5 ? 3 : 2
  const color = [C.blue, C.cyan, C.purple, C.orange][row]
  const elements: Mobject[] = [box(5.45, rows[row], 3.25, 0.7, color, 0.035, 2.5)]
  if (stage === 3) elements.push(
    box(-0.1, 2.55, 5.45, 0.72, C.purple, 0.035, 2.4),
    label('B 被 C、D 的请求打断 → 响应优先级选择 C', -0.1, 2.55, 15, C.purple, '800'),
  )
  if (stage === 4) elements.push(
    box(-0.1, 2.55, 5.45, 0.72, C.purple, 0.035, 2.4),
    label('进入 C → 装入 0110 → 刚重新开中断', -0.1, 2.55, 15, C.purple, '800'),
  )
  if (stage === 5) elements.push(
    box(-0.1, 2.55, 5.45, 0.72, C.orange, 0.04, 2.5),
    label('D 立即打断刚开中断的 C → CPU 改为响应 D', -0.1, 2.55, 15, C.orange, '800'),
  )
  if (stage === 6) elements.push(label('D 返回 → 恢复 C 的断点', 0.35, 1.14, 13, C.purple, '800'))
  if (stage === 7) elements.push(label('C 返回 → 恢复 B 的断点', 1.58, 0.05, 13, C.cyan, '800'))
  return elements
}

function operation(stage: number): string {
  return [
    '等待中断请求',
    '响应 A → 装入屏蔽字 1111 → A 执行完毕',
    '响应 B → 装入屏蔽字 0100 → B 重新开中断',
    'C、D 请求到达 → B 被打断 → 改为响应 C',
    '进入 C → 装入屏蔽字 0110 → 重新开中断',
    'D 请求到达 → 刚开始执行的 C 被打断 → 改为响应 D',
    'D 返回 → 恢复 C 的现场 → C 完成',
    'C 返回 → 恢复 B 的现场 → B 完成',
  ][stage]
}

function buildFrame(stage: number): Frame {
  const active = mono(operation(stage), 0, -3.3, 15, stage >= 4 ? C.orange : C.blue)
  const note = label(stage === 0 ? '点击“下一步”，观察 B 如何被 C、D 分层打断' : NOTES[stage - 1], 0, -3.82, 15, C.text, '700')
  const activeElements = activeState(stage)
  return { elements: [...baseStructure(), ...stagePath(stage), ...activeElements, active, note], note, active, activeElements }
}

async function renderStep(scene: Scene, stage: number, animate: boolean): Promise<void> {
  const previousStage = animate ? stage - 1 : stage
  const frame = buildFrame(previousStage)
  scene.add(...frame.elements)
  if (animate) {
    if (frame.activeElements.length) {
      await scene.play(...frame.activeElements.map(item => new FadeOut(item, { duration: 0.28 })))
    }
    const targetActive = activeState(stage)
    const additions = [...stagePath(stage).slice(stagePath(previousStage).length), ...targetActive]
    scene.add(...additions)
    await scene.play(
      ...additions.map(item => new FadeIn(item, { duration: 0.42 })),
      new Transform(frame.active, mono(operation(stage), 0, -3.3, 15, stage >= 4 ? C.orange : C.blue), { duration: 0.4, rateFunc: smooth }),
      new Transform(frame.note, label(NOTES[stage - 1], 0, -3.82, 15, C.text, '700'), { duration: 0.4, rateFunc: smooth }),
    )
    if (targetActive.length) await scene.play(new Indicate(targetActive[0], { color: stage >= 4 ? C.orange : C.blue, scaleFactor: 1.04, duration: 0.45 }))
  }
  scene.render()
}

export const interruptPriorityAnimation: ManimWebAnimation = {
  id: 'nested-interrupt-priority',
  ariaLabel: '按照响应优先级选择中断源，并通过屏蔽字形成 A、B、C、D 多重中断嵌套的分步动画',
  initialState: { id: 'interrupt-overview', render: scene => { scene.add(...buildFrame(0).elements); scene.render() } },
  scene: { width: 1440, height: 820, frameWidth: 16, frameHeight: 9.1, backgroundColor: '#ffffff' },
  steps: NOTES.map((_, index) => ({ id: `interrupt-${index + 1}`, render: (scene, animate) => renderStep(scene, index + 1, animate) })),
}
