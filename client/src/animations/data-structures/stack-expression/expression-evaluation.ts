import { FadeIn, FadeOut, Line, Rectangle, Shift, Text, VGroup, linear, smooth, type Scene } from '@/animations/manim'
import type { ManimWebAnimation } from '../../types'

const C = { ink: '#0f172a', muted: '#64748b', line: '#94a3b8', blue: '#1d4ed8', orange: '#c2410c', green: '#047857', violet: '#6d28d9', red: '#be123c' } as const
const TOKEN_X = [-4.2, -3.15, -2.1, -1.05, 0] as const
const TOKEN_Y = 1.55
const STACK_X = 2.05
const STACK_Y = [-1.2, -0.55, 0.1, 0.75] as const

function txt(value: string, x: number, y: number, color: string = C.ink, size = 18, weight = '700') {
  return new Text({ text: value, color, fontSize: size, fontFamily: 'Noto Sans SC, PingFang SC, sans-serif', fontWeight: weight }).moveTo([x, y, 0])
}

function valueBox(value: string, x: number, y: number, color: string, width = 0.75) {
  return new VGroup(
    new Rectangle({ width, height: 0.54, center: [x, y, 0], color, fillOpacity: 0.04, strokeWidth: 2.2 }),
    new Text({ text: value, color, fontSize: 22, fontFamily: 'JetBrains Mono, Menlo, monospace', fontWeight: '800' }).moveTo([x, y, 0]),
  )
}

function stackFrame(scene: Scene, color: string) {
  scene.add(
    new Line({ start: [1.35, 1.18, 0], end: [1.35, -1.55, 0], color: C.line, strokeWidth: 2.6 }),
    new Line({ start: [2.75, 1.18, 0], end: [2.75, -1.55, 0], color: C.line, strokeWidth: 2.6 }),
    new Line({ start: [1.35, -1.55, 0], end: [2.75, -1.55, 0], color: C.ink, strokeWidth: 3 }),
    txt('操作数栈', STACK_X, 1.55, color, 17, '800'), txt('栈底', STACK_X, -1.88, C.muted, 13),
  )
}

function popArea(scene: Scene, color: string) {
  scene.add(new Rectangle({ width: 2.5, height: 1.05, center: [4.35, -0.1, 0], color, fillOpacity: 0.025, strokeWidth: 2 }), txt('左操作数　运算符　右操作数', 4.35, 0.65, color, 13, '800'))
}

const POSTFIX = ['3', '4', '+', '2', '÷'] as const

function postfixBase(scene: Scene, current: number | null, stack: readonly string[], note: string, left?: string, operator?: string, right?: string) {
  scene.add(txt('后缀表达式：3  4  +  2  ÷', -2.1, 2.45, C.ink, 24, '800'))
  POSTFIX.forEach((value, index) => {
    scene.add(valueBox(value, TOKEN_X[index], TOKEN_Y, index === current ? C.orange : C.line))
    if (index === current) scene.add(new Rectangle({ width: 0.86, height: 0.68, center: [TOKEN_X[index], TOKEN_Y, 0], color: C.orange, fillOpacity: 0.06, strokeWidth: 3 }))
  })
  stackFrame(scene, C.blue); popArea(scene, C.blue)
  scene.add(...stack.map((value, index) => valueBox(value, STACK_X, STACK_Y[index], value.includes('.') ? C.green : C.blue)))
  if (left) scene.add(valueBox(left, 3.8, -0.1, C.orange, Math.max(0.75, left.length * 0.3)))
  if (operator) scene.add(txt(operator, 4.35, -0.1, C.ink, 22, '800'))
  if (right) scene.add(valueBox(right, 4.9, -0.1, C.orange, Math.max(0.75, right.length * 0.3)))
  scene.add(txt(note, 0, -2.42, C.muted, 16, '700'))
}

async function pushPostfix(scene: Scene, current: number, before: readonly string[], value: string, note: string, animate: boolean) {
  postfixBase(scene, current, before, note)
  const moving = valueBox(value, TOKEN_X[current], TOKEN_Y, C.blue)
  scene.add(moving)
  const targetY = STACK_Y[before.length]
  if (animate) await scene.play(new Shift(moving, { direction: [STACK_X - TOKEN_X[current], targetY - TOKEN_Y, 0], duration: 0.78, rateFunc: linear }))
  else moving.shift([STACK_X - TOKEN_X[current], targetY - TOKEN_Y, 0])
}

async function popRight(scene: Scene, current: number, before: readonly string[], operator: string, note: string, animate: boolean) {
  postfixBase(scene, current, before, note, undefined, operator)
  const moving = valueBox(before[before.length - 1], STACK_X, STACK_Y[before.length - 1], C.orange)
  scene.add(moving)
  if (animate) await scene.play(new Shift(moving, { direction: [4.9 - STACK_X, -0.1 - STACK_Y[before.length - 1], 0], duration: 0.72, rateFunc: linear }))
  else moving.shift([4.9 - STACK_X, -0.1 - STACK_Y[before.length - 1], 0])
}

async function popLeft(scene: Scene, current: number, remaining: readonly string[], right: string, operator: string, note: string, animate: boolean) {
  postfixBase(scene, current, remaining, note, undefined, operator, right)
  const moving = valueBox(remaining[remaining.length - 1], STACK_X, STACK_Y[remaining.length - 1], C.orange)
  scene.add(moving)
  if (animate) await scene.play(new Shift(moving, { direction: [3.8 - STACK_X, -0.1 - STACK_Y[remaining.length - 1], 0], duration: 0.72, rateFunc: linear }))
  else moving.shift([3.8 - STACK_X, -0.1 - STACK_Y[remaining.length - 1], 0])
}

async function calculate(scene: Scene, current: number, left: string, operator: string, right: string, result: string, note: string, animate: boolean) {
  postfixBase(scene, current, [], note, left, operator, right)
  const resultBox = valueBox(result, STACK_X, STACK_Y[0], C.green, result.length > 2 ? 1.05 : 0.75)
  scene.add(resultBox)
  if (animate) await scene.play(new FadeIn(resultBox, { duration: 0.58, shift: [0, 0.22, 0], rateFunc: smooth }))
}

async function finishPostfix(scene: Scene, animate: boolean) {
  postfixBase(scene, null, ['3.5'], '扫描结束：操作数栈中唯一的元素 3.5 就是结果')
  const result = valueBox('3.5', STACK_X, STACK_Y[0], C.green, 1.05)
  scene.add(result, txt('结果', STACK_X, 0.2, C.green, 17, '800'))
  if (animate) await scene.play(new FadeIn(result, { duration: 0.45 }))
}

async function prefix(scene: Scene) {
  scene.add(txt('前缀表达式：÷  +  3  4  2', -2.1, 2.45, C.ink, 24, '800'))
  const values = ['÷', '+', '3', '4', '2']
  values.forEach((value, index) => scene.add(valueBox(value, TOKEN_X[index], TOKEN_Y, C.line)))
  stackFrame(scene, C.violet); popArea(scene, C.violet)
  scene.add(txt('前缀从右向左扫描；遇运算符时，先弹出的数作左操作数', 0, -2.42, C.violet, 16, '800'))
  const result = valueBox('3.5', STACK_X, STACK_Y[0], C.green, 1.05)
  await scene.play(new FadeIn(result, { duration: 0.55, shift: [0, 0.2, 0], rateFunc: smooth }))
}

type Step = { id: string; render: (scene: Scene, animate: boolean) => Promise<void> }
const steps: Step[] = [
  { id: 'postfix-push-3', render: (s, a) => pushPostfix(s, 0, [], '3', '扫描 3：操作数直接压栈', a) },
  { id: 'postfix-push-4', render: (s, a) => pushPostfix(s, 1, ['3'], '4', '扫描 4：操作数继续压栈', a) },
  { id: 'postfix-plus-pop-right', render: (s, a) => popRight(s, 2, ['3', '4'], '+', '遇到 +：先弹出 4，放到普通算式的右侧', a) },
  { id: 'postfix-plus-pop-left', render: (s, a) => popLeft(s, 2, ['3'], '4', '+', '再弹出 3，放到普通算式的左侧', a) },
  { id: 'postfix-plus-calculate', render: (s, a) => calculate(s, 2, '3', '+', '4', '7', '计算 3 + 4 = 7，再把结果 7 压回栈', a) },
  { id: 'postfix-push-2', render: (s, a) => pushPostfix(s, 3, ['7'], '2', '继续扫描 2：操作数压栈', a) },
  { id: 'postfix-divide-pop-right', render: (s, a) => popRight(s, 4, ['7', '2'], '÷', '遇到 ÷：先弹出 2，作为右操作数', a) },
  { id: 'postfix-divide-pop-left', render: (s, a) => popLeft(s, 4, ['7'], '2', '÷', '再弹出 7，作为左操作数；顺序不能颠倒', a) },
  { id: 'postfix-divide-calculate', render: (s, a) => calculate(s, 4, '7', '÷', '2', '3.5', '计算 7 ÷ 2 = 3.5，再把结果压回栈', a) },
  { id: 'postfix-finish', render: finishPostfix },
]

export const prefixPostfixEvaluationAnimation: ManimWebAnimation = {
  id: 'prefix-postfix-evaluation', ariaLabel: '后缀表达式逐次扫描压栈弹出左右操作数并求值的分步动画',
  initialState: {
    id: 'expression-evaluation-overview',
    render: scene => {
      postfixBase(scene, null, [], '从左向右扫描 3 4 + 2 ÷：操作数入栈，运算符弹出两个操作数计算')
      scene.render()
    },
  },
  scene: { width: 1100, height: 620, frameWidth: 12, frameHeight: 6.8, backgroundColor: '#ffffff' },
  steps: steps.map(step => ({ id: step.id, render: async (scene, animate) => { await step.render(scene, animate); scene.render() } })),
}
