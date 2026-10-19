import { FadeIn, FadeOut, Line, Rectangle, Shift, Text, VGroup, linear, smooth, type Scene } from '@/animations/manim'
import type { ManimWebAnimation } from '../../types'

const C = { ink: '#0f172a', muted: '#64748b', line: '#94a3b8', blue: '#1d4ed8', orange: '#c2410c', green: '#047857', violet: '#6d28d9', red: '#be123c' } as const
const TOKEN_X = [-4.4, -3.35, -2.3, -1.25, -0.2, 0.85, 1.9, 2.95, 4] as const
const OUT_X = [-4, -3.05, -2.1, -1.15, -0.2, 0.75, 1.7] as const
const STACK_Y = [-1.3, -0.7, -0.1] as const

function text(value: string, x: number, y: number, color: string = C.ink, size = 18, weight = '700') {
  return new Text({ text: value, color, fontSize: size, fontFamily: 'Noto Sans SC, PingFang SC, sans-serif', fontWeight: weight }).moveTo([x, y, 0])
}

function box(value: string, x: number, y: number, color: string, width = 0.68) {
  return new VGroup(
    new Rectangle({ width, height: 0.55, center: [x, y, 0], color, fillOpacity: 0.035, strokeWidth: 2 }),
    new Text({ text: value, color, fontSize: 21, fontFamily: 'JetBrains Mono, Menlo, monospace', fontWeight: '800' }).moveTo([x, y, 0]),
  )
}

function input(scene: Scene, values: readonly string[], title: string, current: number | null) {
  scene.add(text(title, 0, 2.65, C.ink, 25, '800'))
  values.forEach((value, index) => scene.add(box(value, TOKEN_X[index], 1.7, index === current ? C.orange : C.line)))
  if (current !== null) scene.add(new Rectangle({ width: 0.82, height: 0.7, center: [TOKEN_X[current], 1.7, 0], color: C.orange, fillOpacity: 0.06, strokeWidth: 3 }))
}

function stackFrame(scene: Scene, title = '操作符栈') {
  scene.add(
    new Line({ start: [3.7, 0.9, 0], end: [3.7, -1.7, 0], color: C.line, strokeWidth: 2.5 }),
    new Line({ start: [5, 0.9, 0], end: [5, -1.7, 0], color: C.line, strokeWidth: 2.5 }),
    new Line({ start: [3.7, -1.7, 0], end: [5, -1.7, 0], color: C.ink, strokeWidth: 3 }),
    text(title, 4.35, 1.15, C.blue, 16, '800'),
  )
}

function addInfixState(scene: Scene, current: number | null, output: readonly string[], stack: readonly string[], note: string) {
  const values = ['A', '*', '(', 'B', '+', 'C', ')', '-', 'D'] as const
  input(scene, values, '中缀 A * ( B + C ) - D  →  后缀', current)
  stackFrame(scene)
  scene.add(text('后缀输出', -1.2, 0.72, C.green, 16, '800'), text(note, -0.4, -2.4, C.muted, 16, '700'))
  const out = output.map((value, index) => box(value, OUT_X[index], 0.05, C.green))
  const stackItems = stack.map((value, index) => box(value, 4.35, STACK_Y[index], value === '(' ? C.violet : C.blue))
  scene.add(...out, ...stackItems)
  return { values, out, stackItems }
}

type InfixAction = {
  id: string; current: number; beforeOut: string[]; beforeStack: string[];
  kind: 'output' | 'push' | 'pop' | 'discard'; value: string; note: string
}

const INFIX_ACTIONS: InfixAction[] = [
  { id: 'infix-a-output', current: 0, beforeOut: [], beforeStack: [], kind: 'output', value: 'A', note: 'A 是操作数，直接送入后缀输出' },
  { id: 'infix-star-push', current: 1, beforeOut: ['A'], beforeStack: [], kind: 'push', value: '*', note: '* 是运算符，符号栈为空，直接入栈' },
  { id: 'infix-left-push', current: 2, beforeOut: ['A'], beforeStack: ['*'], kind: 'push', value: '(', note: '左括号直接入栈，暂时隔开括号内外的运算符' },
  { id: 'infix-b-output', current: 3, beforeOut: ['A'], beforeStack: ['*', '('], kind: 'output', value: 'B', note: 'B 是操作数，直接输出' },
  { id: 'infix-plus-push', current: 4, beforeOut: ['A', 'B'], beforeStack: ['*', '('], kind: 'push', value: '+', note: '栈顶是左括号，+ 直接入栈' },
  { id: 'infix-c-output', current: 5, beforeOut: ['A', 'B'], beforeStack: ['*', '(', '+'], kind: 'output', value: 'C', note: 'C 是操作数，直接输出' },
  { id: 'infix-right-pop-plus', current: 6, beforeOut: ['A', 'B', 'C'], beforeStack: ['*', '(', '+'], kind: 'pop', value: '+', note: '遇右括号：先把 + 弹出并送入后缀输出' },
  { id: 'infix-right-discard-left', current: 6, beforeOut: ['A', 'B', 'C', '+'], beforeStack: ['*', '('], kind: 'discard', value: '(', note: '再弹出左括号；括号只用于控制次序，不进入输出' },
  { id: 'infix-minus-pop-star', current: 7, beforeOut: ['A', 'B', 'C', '+'], beforeStack: ['*'], kind: 'pop', value: '*', note: '遇到 -：栈顶 * 优先级更高，先弹出 *' },
  { id: 'infix-minus-push', current: 7, beforeOut: ['A', 'B', 'C', '+', '*'], beforeStack: [], kind: 'push', value: '-', note: '高优先级运算符已经弹完，当前 - 入栈' },
  { id: 'infix-d-output', current: 8, beforeOut: ['A', 'B', 'C', '+', '*'], beforeStack: ['-'], kind: 'output', value: 'D', note: 'D 是操作数，直接输出' },
  { id: 'infix-end-pop-minus', current: 8, beforeOut: ['A', 'B', 'C', '+', '*', 'D'], beforeStack: ['-'], kind: 'pop', value: '-', note: '扫描结束，把栈中剩余的 - 弹出' },
]

async function renderInfixAction(scene: Scene, action: InfixAction, animate: boolean) {
  const state = addInfixState(scene, action.current, action.beforeOut, action.beforeStack, action.note)
  if (action.kind === 'output') {
    const moving = box(action.value, TOKEN_X[action.current], 1.7, C.green)
    scene.add(moving)
    if (animate) await scene.play(new Shift(moving, { direction: [OUT_X[action.beforeOut.length] - TOKEN_X[action.current], -1.65, 0], duration: 0.72, rateFunc: linear }))
    else moving.shift([OUT_X[action.beforeOut.length] - TOKEN_X[action.current], -1.65, 0])
  }
  if (action.kind === 'push') {
    const moving = box(action.value, TOKEN_X[action.current], 1.7, action.value === '(' ? C.violet : C.blue)
    scene.add(moving)
    if (animate) await scene.play(new Shift(moving, { direction: [4.35 - TOKEN_X[action.current], STACK_Y[action.beforeStack.length] - 1.7, 0], duration: 0.72, rateFunc: linear }))
    else moving.shift([4.35 - TOKEN_X[action.current], STACK_Y[action.beforeStack.length] - 1.7, 0])
  }
  if (action.kind === 'pop') {
    const moving = state.stackItems[state.stackItems.length - 1]
    const fromY = STACK_Y[action.beforeStack.length - 1]
    if (animate) await scene.play(new Shift(moving, { direction: [OUT_X[action.beforeOut.length] - 4.35, 0.05 - fromY, 0], duration: 0.78, rateFunc: linear }))
    else moving.shift([OUT_X[action.beforeOut.length] - 4.35, 0.05 - fromY, 0])
  }
  if (action.kind === 'discard') {
    const moving = state.stackItems[state.stackItems.length - 1]
    if (animate) await scene.play(new FadeOut(moving, { duration: 0.55, shift: [0, -0.22, 0], rateFunc: smooth }))
  }
}

type PostfixAction = { id: string; current: number; before: string[]; kind: 'push' | 'combine'; value: string; result?: string; note: string }
const POSTFIX_VALUES = ['A', 'B', 'C', '+', '*', 'D', '-'] as const
const POSTFIX_ACTIONS: PostfixAction[] = [
  { id: 'postfix-a-push', current: 0, before: [], kind: 'push', value: 'A', note: 'A 是操作数，压入表达式栈' },
  { id: 'postfix-b-push', current: 1, before: ['A'], kind: 'push', value: 'B', note: 'B 是操作数，继续压栈' },
  { id: 'postfix-c-push', current: 2, before: ['A', 'B'], kind: 'push', value: 'C', note: 'C 是操作数，继续压栈' },
  { id: 'postfix-plus-combine', current: 3, before: ['A', 'B', 'C'], kind: 'combine', value: '+', result: '(B+C)', note: '遇 +：弹出 C 作右操作数、B 作左操作数，合成 (B+C)' },
  { id: 'postfix-star-combine', current: 4, before: ['A', '(B+C)'], kind: 'combine', value: '*', result: 'A*(B+C)', note: '遇 *：弹出 (B+C) 和 A，合成 A*(B+C)' },
  { id: 'postfix-d-push', current: 5, before: ['A*(B+C)'], kind: 'push', value: 'D', note: 'D 是操作数，压入表达式栈' },
  { id: 'postfix-minus-combine', current: 6, before: ['A*(B+C)', 'D'], kind: 'combine', value: '-', result: '(A*(B+C))-D', note: '遇 -：弹出 D 和 A*(B+C)，合成最终中缀表达式' },
]

function addPostfixState(scene: Scene, action: PostfixAction) {
  input(scene, POSTFIX_VALUES, '后缀 A B C + * D -  →  中缀', action.current)
  scene.add(
    new Rectangle({ width: 9.2, height: 1.35, center: [0, -0.3, 0], color: C.violet, fillOpacity: 0.02, strokeWidth: 2 }),
    text('表达式栈', 0, 0.62, C.violet, 16, '800'),
    text(action.note, 0, -2.3, C.muted, 16, '700'),
  )
  const widths = action.before.map(value => Math.max(1.1, value.length * 0.21))
  const total = widths.reduce((sum, width) => sum + width, 0) + Math.max(0, widths.length - 1) * 0.25
  let cursor = -total / 2
  const stack = action.before.map((value, index) => {
    const x = cursor + widths[index] / 2
    cursor += widths[index] + 0.25
    return { value, x, mob: box(value, x, -0.3, C.violet, widths[index]) }
  })
  scene.add(...stack.map(item => item.mob))
  return stack
}

async function renderPostfixAction(scene: Scene, action: PostfixAction, animate: boolean) {
  const stack = addPostfixState(scene, action)
  if (action.kind === 'push') {
    const targetX = stack.length ? Math.min(3.7, stack[stack.length - 1].x + 1.45) : 0
    const moving = box(action.value, TOKEN_X[action.current], 1.7, C.violet)
    scene.add(moving)
    if (animate) await scene.play(new Shift(moving, { direction: [targetX - TOKEN_X[action.current], -2, 0], duration: 0.72, rateFunc: linear }))
    else moving.shift([targetX - TOKEN_X[action.current], -2, 0])
  } else {
    const right = stack[stack.length - 1]
    const left = stack[stack.length - 2]
    const resultWidth = Math.max(1.35, action.result!.length * 0.21)
    if (animate) {
      await scene.play(new Shift(right.mob, { direction: [3.75 - right.x, -0.85, 0], duration: 0.55, rateFunc: linear }))
      await scene.play(new Shift(left.mob, { direction: [2.25 - left.x, -0.85, 0], duration: 0.55, rateFunc: linear }))
      await scene.play(new FadeOut(right.mob, { duration: 0.28 }), new FadeOut(left.mob, { duration: 0.28 }))
    }
    const result = box(action.result!, 0.7, -0.3, C.orange, resultWidth)
    scene.add(result)
    if (animate) await scene.play(new FadeIn(result, { duration: 0.52, shift: [0, 0.18, 0], rateFunc: smooth }))
  }
}

const steps = [
  ...INFIX_ACTIONS.map(action => ({ id: action.id, render: (scene: Scene, animate: boolean) => renderInfixAction(scene, action, animate) })),
  ...POSTFIX_ACTIONS.map(action => ({ id: action.id, render: (scene: Scene, animate: boolean) => renderPostfixAction(scene, action, animate) })),
]

export const infixPostfixConversionAnimation: ManimWebAnimation = {
  id: 'infix-postfix-conversion',
  ariaLabel: '中缀转后缀与后缀转中缀逐字符逐次入栈出栈的分步动画',
  initialState: {
    id: 'conversion-overview',
    render: scene => {
      const values = ['A', '*', '(', 'B', '+', 'C', ')', '-', 'D'] as const
      input(scene, values, '中缀转后缀：A * ( B + C ) - D', null)
      stackFrame(scene)
      scene.add(
        text('后缀输出', -1.2, 0.72, C.green, 16, '800'),
        new Line({ start: [-4.55, -0.12, 0], end: [2.05, -0.12, 0], color: C.line, strokeWidth: 2 }),
        text('从左向右读取表达式', -0.4, -2.4, C.muted, 16, '700'),
      )
      scene.render()
    },
  },
  scene: { width: 1100, height: 650, frameWidth: 12, frameHeight: 7, backgroundColor: '#ffffff' },
  steps: steps.map(step => ({ id: step.id, render: async (scene, animate) => { await step.render(scene, animate); scene.render() } })),
}

