import { Arrow, Circle, Indicate, Line, Rectangle, Shift, Text, VGroup, linear, type Scene } from '@/animations/manim'
import type { ManimWebAnimation } from '../../types'

const C = { ink: '#0f172a', muted: '#64748b', line: '#94a3b8', blue: '#1d4ed8', orange: '#c2410c', green: '#047857', violet: '#6d28d9', red: '#be123c' } as const
const X = [-4.65, -3.1, -1.55, 0, 1.55, 3.1, 4.65] as const
const Y = 0.25

function label(value: string, x: number, y: number, color: string = C.ink, size = 18, weight = '700') {
  return new Text({ text: value, color, fontSize: size, fontFamily: 'Noto Sans SC, PingFang SC, sans-serif', fontWeight: weight }).moveTo([x, y, 0])
}

function node(value: string, x: number) {
  const circle = new Circle({ radius: 0.36, center: [x, Y, 0], color: C.line, fillOpacity: 0.06, strokeWidth: 2.4 })
  return { group: new VGroup(circle, label(value, x, Y, C.ink, 18, '800')), circle }
}

function linearList(scene: Scene, count = 7) {
  const nodes = X.slice(0, count).map((x, i) => node(String(i + 1), x))
  for (let i = 0; i < nodes.length - 1; i += 1) scene.add(new Arrow({ start: [X[i] + 0.42, Y, 0], end: [X[i + 1] - 0.42, Y, 0], color: C.line, strokeWidth: 2.3, tipLength: 0.13 }))
  scene.add(...nodes.map(item => item.group), new Arrow({ start: [X[count - 1] + 0.42, Y, 0], end: [5.4, Y, 0], color: C.line, strokeWidth: 2.3, tipLength: 0.13 }), label('NULL', 5.7, Y, C.muted, 14))
  return nodes
}

function cycleList(scene: Scene) {
  const nodes = X.slice(0, 5).map((x, i) => node(String.fromCharCode(65 + i), x))
  for (let i = 0; i < 4; i += 1) scene.add(new Arrow({ start: [X[i] + 0.42, Y, 0], end: [X[i + 1] - 0.42, Y, 0], color: C.line, strokeWidth: 2.3, tipLength: 0.13 }))
  scene.add(
    ...nodes.map(item => item.group),
    new Line({ start: [X[4], -0.16, 0], end: [X[4], -1.05, 0], color: C.violet, strokeWidth: 2.4 }),
    new Line({ start: [X[4], -1.05, 0], end: [X[2], -1.05, 0], color: C.violet, strokeWidth: 2.4 }),
    new Arrow({ start: [X[2], -1.05, 0], end: [X[2], -0.2, 0], color: C.violet, strokeWidth: 2.4, tipLength: 0.14 }),
    label('环入口', X[2], -1.45, C.violet, 15),
  )
  return nodes
}

function pointer(name: string, x: number, above: boolean, color: string) {
  const y1 = above ? 1.65 : -1.55
  const y2 = above ? 0.72 : -0.25
  return new VGroup(label(name, x, y1, color, 16, '800'), new Arrow({ start: [x, y1 - (above ? 0.25 : -0.25), 0], end: [x, y2, 0], color, strokeWidth: 2.8, tipLength: 0.16 }))
}

function heading(scene: Scene, title: string, note: string) {
  scene.add(label(title, 0, 2.55, C.ink, 25, '800'), label(note, 0, -2.45, C.muted, 16, '600'))
}

async function detectCycle(scene: Scene) {
  heading(scene, '判断链表是否存在环', 'slow 每次走 1 步，fast 每次走 2 步；能相遇就说明有环')
  const nodes = cycleList(scene)
  const slow = pointer('slow', X[0], true, C.blue)
  const fast = pointer('fast', X[0], false, C.orange)
  let slowX: number = X[0]
  let fastX: number = X[0]
  scene.add(slow, fast)
  for (const [slowIndex, fastIndex] of [[1, 2], [2, 4], [3, 3]]) {
    await scene.play(
      new Shift(slow, { direction: [X[slowIndex] - slowX, 0, 0], duration: 0.75, rateFunc: linear }),
      new Shift(fast, { direction: [X[fastIndex] - fastX, 0, 0], duration: 0.75, rateFunc: linear }),
    )
    slowX = X[slowIndex]
    fastX = X[fastIndex]
  }
  await scene.play(new Indicate(nodes[3].circle, { color: C.red, scaleFactor: 1.25, duration: 0.65 }))
  scene.add(label('相遇：有环', X[3], 1.85, C.red, 18, '800'))
}

async function returnSlowToHead(scene: Scene) {
  heading(scene, '寻找环的入口：先让 slow 回到表头', 'fast 留在第一次相遇点 D；这一步只移动 slow')
  cycleList(scene)
  const slow = pointer('slow', X[3], true, C.blue)
  const fast = pointer('fast', X[3], false, C.orange)
  scene.add(slow, fast, label('第一次相遇点', X[3], 1.9, C.red, 16, '800'))
  await scene.play(new Shift(slow, { direction: [X[0] - X[3], 0, 0], duration: 1.05, rateFunc: linear }))
  scene.add(label('slow 回到 head', X[0], 1.9, C.blue, 18, '800'), label('fast 保持不动', X[3], -1.85, C.orange, 16, '800'))
}

async function findEntry(scene: Scene) {
  heading(scene, '寻找环的入口：两个指针改为同速', 'slow 从表头出发，fast 从相遇点出发；两者每次都走 1 步')
  const nodes = cycleList(scene)
  const p1 = pointer('p1=head', X[0], true, C.blue)
  const p2 = pointer('p2=meet', X[3], false, C.orange)
  let p1X: number = X[0]
  let p2X: number = X[3]
  scene.add(p1, p2)
  for (const [a, b] of [[1, 4], [2, 2]]) {
    await scene.play(
      new Shift(p1, { direction: [X[a] - p1X, 0, 0], duration: 0.82, rateFunc: linear }),
      new Shift(p2, { direction: [X[b] - p2X, 0, 0], duration: 0.82, rateFunc: linear }),
    )
    p1X = X[a]
    p2X = X[b]
  }
  await scene.play(new Indicate(nodes[2].circle, { color: C.violet, scaleFactor: 1.28, duration: 0.65 }))
  scene.add(label('再次相遇：C 就是入口', X[2], 1.9, C.violet, 18, '800'))
}

async function findMiddle(scene: Scene) {
  heading(scene, '寻找链表中点', 'fast 到达表尾时，slow 恰好走完链表的一半')
  const nodes = linearList(scene)
  const slow = pointer('slow', X[0], true, C.blue)
  const fast = pointer('fast', X[0], false, C.orange)
  let slowX: number = X[0]
  let fastX: number = X[0]
  scene.add(slow, fast)
  for (const [s, f] of [[1, 2], [2, 4], [3, 6]]) {
    await scene.play(new Shift(slow, { direction: [X[s] - slowX, 0, 0], duration: 0.65, rateFunc: linear }), new Shift(fast, { direction: [X[f] - fastX, 0, 0], duration: 0.65, rateFunc: linear }))
    slowX = X[s]
    fastX = X[f]
  }
  await scene.play(new Indicate(nodes[3].circle, { color: C.green, scaleFactor: 1.28, duration: 0.65 }))
  scene.add(label('slow 指向中点', X[3], 1.9, C.green, 18, '800'))
}

async function findKth(scene: Scene) {
  heading(scene, '寻找倒数第 k 个结点（k = 3）', '先让 fast 领先 k 步，再保持间距同速前进')
  const nodes = linearList(scene)
  const slow = pointer('slow', X[0], true, C.blue)
  const fast = pointer('fast', X[0], false, C.orange)
  let slowX: number = X[0]
  let fastX: number = X[0]
  scene.add(slow, fast)
  for (const f of [1, 2, 3]) {
    await scene.play(new Shift(fast, { direction: [X[f] - fastX, 0, 0], duration: 0.4, rateFunc: linear }))
    fastX = X[f]
  }
  const gap = new Rectangle({ width: X[3] - X[0], height: 0.95, center: [(X[0] + X[3]) / 2, Y, 0], color: C.violet, fillOpacity: 0, strokeWidth: 2 })
  scene.add(gap, label('固定相隔 3 步', (X[0] + X[3]) / 2, -0.65, C.violet, 14))
  for (const [s, f] of [[1, 4], [2, 5], [3, 6]]) {
    await scene.play(new Shift(slow, { direction: [X[s] - slowX, 0, 0], duration: 0.58, rateFunc: linear }), new Shift(fast, { direction: [X[f] - fastX, 0, 0], duration: 0.58, rateFunc: linear }))
    slowX = X[s]
    fastX = X[f]
  }
  await scene.play(new Shift(slow, { direction: [X[4] - slowX, 0, 0], duration: 0.58, rateFunc: linear }), new Shift(fast, { direction: [1.2, 0, 0], duration: 0.58, rateFunc: linear }))
  await scene.play(new Indicate(nodes[4].circle, { color: C.green, scaleFactor: 1.28, duration: 0.65 }))
  scene.add(label('倒数第 3 个', X[4], 1.9, C.green, 18, '800'))
}

const steps = [detectCycle, returnSlowToHead, findEntry, findMiddle, findKth]

export const fastSlowPointersAnimation: ManimWebAnimation = {
  id: 'fast-slow-pointer-applications', ariaLabel: '快慢指针在链表中判断环、寻找环入口、中点和倒数第k个结点的连续动画',
  initialState: { id: 'fast-slow-overview', render: scene => { heading(scene, '快慢指针的四个典型应用', '两个指针以不同速度移动，位置关系直接给出环、中点和倒数结点'); cycleList(scene); scene.render() } },
  scene: { width: 1100, height: 620, frameWidth: 12, frameHeight: 6.8, backgroundColor: '#ffffff' },
  steps: steps.map((render, index) => ({ id: `fast-slow-${index + 1}`, render: async scene => { await render(scene); scene.render() } })),
}
