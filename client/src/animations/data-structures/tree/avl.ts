import { Arrow, Circle, FadeIn, FadeOut, Rectangle, Shift, Text, VGroup, linear, smooth, type Scene } from '@/animations/manim'
import type { ManimWebAnimation } from '../../types'

const C = {
  ink: '#0f172a', text: '#334155', muted: '#64748b', line: '#94a3b8',
  blue: '#1d4ed8', orange: '#c2410c', green: '#047857', violet: '#6d28d9', red: '#be123c',
} as const

type Point = readonly [number, number]
type Layout = Record<string, Point>
type Edge = readonly [string, string]

const BASE: Layout = {
  '50': [0, 1.55], '30': [-2.4, 0.25], '70': [2.4, 0.25],
  '20': [-3.6, -1.05],
}
const BASE_EDGES: Edge[] = [['50', '30'], ['50', '70'], ['30', '20']]

const LL_INSERTED: Layout = { ...BASE, '10': [-4.3, -2.3] }
const LL_INSERTED_EDGES: Edge[] = [...BASE_EDGES, ['20', '10']]
const LL_RESULT: Layout = {
  '50': [0, 1.55], '20': [-2.4, 0.25], '70': [2.4, 0.25],
  '10': [-3.6, -1.05], '30': [-1.2, -1.05],
}
const LL_RESULT_EDGES: Edge[] = [['50', '20'], ['50', '70'], ['20', '10'], ['20', '30']]

const LR_INSERTED: Layout = { ...BASE, '25': [-2.8, -2.3] }
const LR_INSERTED_EDGES: Edge[] = [...BASE_EDGES, ['20', '25']]
const LR_MIDDLE: Layout = {
  '50': [0, 1.55], '30': [-2.4, 0.25], '70': [2.4, 0.25],
  '25': [-3.6, -1.05], '20': [-4.3, -2.3],
}
const LR_MIDDLE_EDGES: Edge[] = [['50', '30'], ['50', '70'], ['30', '25'], ['25', '20']]
const LR_RESULT: Layout = {
  '50': [0, 1.55], '25': [-2.4, 0.25], '70': [2.4, 0.25],
  '20': [-3.6, -1.05], '30': [-1.2, -1.05],
}
const LR_RESULT_EDGES: Edge[] = [['50', '25'], ['50', '70'], ['25', '20'], ['25', '30']]

function text(value: string, x: number, y: number, color: string = C.ink, size = 18, weight = '700') {
  return new Text({ text: value, color, fontSize: size, fontFamily: 'Noto Sans SC, PingFang SC, sans-serif', fontWeight: weight }).moveTo([x, y, 0])
}

function heading(scene: Scene, title: string, note: string, noteColor: string = C.muted) {
  scene.add(text(title, 0, 3.35, C.ink, 25, '800'), text(note, 0, -3.3, noteColor, 16, '700'))
}

function node(value: string, point: Point, color: string = C.blue) {
  return new VGroup(
    new Circle({ radius: 0.36, center: [point[0], point[1], 0], color, fillOpacity: 0.06, strokeWidth: 2.5 }),
    text(value, point[0], point[1], C.ink, 17, '800'),
  )
}

function edge(layout: Layout, [parent, child]: Edge, color: string = C.line) {
  const [px, py] = layout[parent]
  const [cx, cy] = layout[child]
  const dx = cx - px
  const dy = cy - py
  const length = Math.sqrt(dx * dx + dy * dy)
  const ux = dx / length
  const uy = dy / length
  return new Arrow({ start: [px + ux * 0.43, py + uy * 0.43, 0], end: [cx - ux * 0.43, cy - uy * 0.43, 0], color, strokeWidth: 2.25, tipLength: 0.12 })
}

function renderTree(scene: Scene, layout: Layout, edges: Edge[], options: { inserted?: string; active?: string; path?: string[]; bf?: Record<string, string> } = {}) {
  const edgeMobs = edges.map(item => edge(layout, item, options.path?.includes(item[0]) && options.path.includes(item[1]) ? C.orange : C.line))
  const nodes: Record<string, VGroup> = {}
  Object.entries(layout).forEach(([value, point]) => {
    const color = value === options.inserted ? C.orange : value === options.active ? C.red : options.path?.includes(value) ? C.orange : value === '50' ? C.green : C.blue
    nodes[value] = node(value, point, color)
  })
  scene.add(...edgeMobs, ...Object.values(nodes))
  if (options.bf) {
    Object.entries(options.bf).forEach(([value, label]) => {
      const [x, y] = layout[value]
      const labelOffsetX = x < 0 ? -0.72 : 0.72
      scene.add(text(`BF=${label}`, x + labelOffsetX, y + 0.08, Math.abs(Number(label)) >= 2 ? C.red : C.violet, 13, '800'))
    })
  }
  return { nodes, edgeMobs }
}

async function insertNode(scene: Scene, kind: 'LL' | 'LR', animate: boolean) {
  const value = kind === 'LL' ? '10' : '25'
  const layout = kind === 'LL' ? LL_INSERTED : LR_INSERTED
  const edges = kind === 'LL' ? LL_INSERTED_EDGES : LR_INSERTED_EDGES
  heading(scene, `${kind} 案例：按 BST 规则插入 ${value}`, `比较路径 50 → 30 → 20，${value} 成为 20 的${kind === 'LL' ? '左' : '右'}孩子`)
  const without = Object.fromEntries(Object.entries(layout).filter(([key]) => key !== value)) as Layout
  renderTree(scene, without, edges.filter(([, child]) => child !== value), { path: ['50', '30', '20'] })
  const inserted = node(value, layout[value], C.orange)
  const newEdge = edge(layout, ['20', value], C.orange)
  scene.add(newEdge, inserted)
  if (animate) await scene.play(new FadeIn(newEdge, { duration: 0.4 }), new FadeIn(inserted, { duration: 0.55, shift: [0, 0.22, 0], rateFunc: smooth }))
}

async function updateBalance(scene: Scene, kind: 'LL' | 'LR', animate: boolean) {
  const layout = kind === 'LL' ? LL_INSERTED : LR_INSERTED
  const edges = kind === 'LL' ? LL_INSERTED_EDGES : LR_INSERTED_EDGES
  const inserted = kind === 'LL' ? '10' : '25'
  heading(scene, `${kind} 案例：从插入点向上更新平衡因子`, '20 仍平衡；30 的 BF=+2，是从下向上遇到的第一个失衡结点', C.red)
  renderTree(scene, layout, edges, { inserted, active: '30', path: ['50', '30', '20', inserted], bf: { '20': kind === 'LL' ? '+1' : '-1', '30': '+2', '50': '+2' } })
  const focus = new Rectangle({ width: 5.35, height: 3.35, center: [-2.35, -0.85, 0], color: C.red, fillOpacity: 0.018, strokeWidth: 3 })
  scene.add(focus, text('最小失衡子树', -4.45, 1.02, C.red, 14, '800'))
  if (animate) await scene.play(new FadeIn(focus, { duration: 0.45 }))
}

async function identify(scene: Scene, kind: 'LL' | 'LR', animate: boolean) {
  const layout = kind === 'LL' ? LL_INSERTED : LR_INSERTED
  const edges = kind === 'LL' ? LL_INSERTED_EDGES : LR_INSERTED_EDGES
  const inserted = kind === 'LL' ? '10' : '25'
  const path = kind === 'LL' ? '30 → 20 → 10：左—左' : '30 → 20 → 25：左—右'
  heading(scene, `${kind} 案例：判断失衡类型`, `${path}，所以是 ${kind} 型`, C.orange)
  renderTree(scene, layout, edges, { inserted, active: '30', path: ['30', '20', inserted] })
  const pathBox = new Rectangle({ width: 4.4, height: 0.62, center: [2.7, 1.35, 0], color: C.orange, fillOpacity: 0.05, strokeWidth: 2.5 })
  scene.add(pathBox, text(path, 2.7, 1.35, C.orange, 15, '800'))
  if (animate) await scene.play(new FadeIn(pathBox, { duration: 0.4 }))
}

async function transition(scene: Scene, title: string, note: string, from: Layout, fromEdges: Edge[], to: Layout, toEdges: Edge[], animate: boolean, movingNames: string[]) {
  heading(scene, title, note, C.green)
  const rendered = renderTree(scene, from, fromEdges, { active: movingNames[0], path: movingNames })
  if (animate) await scene.play(...rendered.edgeMobs.map(item => new FadeOut(item, { duration: 0.32 })))
  else rendered.edgeMobs.forEach(item => { item.opacity = 0 })
  const shifts = movingNames.filter(name => from[name] && to[name]).map(name => new Shift(rendered.nodes[name], {
    direction: [to[name][0] - from[name][0], to[name][1] - from[name][1], 0], duration: 0.9, rateFunc: linear,
  }))
  if (animate) await scene.play(...shifts)
  else movingNames.filter(name => from[name] && to[name]).forEach(name => rendered.nodes[name].shift([to[name][0] - from[name][0], to[name][1] - from[name][1], 0]))
  const newEdges = toEdges.map(item => edge(to, item))
  scene.add(...newEdges)
  if (animate) await scene.play(...newEdges.map(item => new FadeIn(item, { duration: 0.42 })))
}

async function llRotate(scene: Scene, animate: boolean) {
  await transition(scene, 'LL 案例：对失衡结点 30 做右旋', '20 上升为子树根，30 下降成为 20 的右孩子', LL_INSERTED, LL_INSERTED_EDGES, LL_RESULT, LL_RESULT_EDGES, animate, ['20', '30', '10'])
}

async function verifyLL(scene: Scene, animate: boolean) {
  heading(scene, 'LL 调整完成', '从叶子向上复查：所有结点的平衡因子都回到 -1、0、1', C.green)
  renderTree(scene, LL_RESULT, LL_RESULT_EDGES, { bf: { '10': '0', '30': '0', '20': '0', '50': '+1', '70': '0' } })
  const note = text('一次右旋完成 LL 调整', 0, -2.78, C.green, 18, '800')
  scene.add(note)
  if (animate) await scene.play(new FadeIn(note, { duration: 0.45 }))
}

async function lrLeftRotate(scene: Scene, animate: boolean) {
  await transition(scene, 'LR 案例第一旋：先把 20 向左旋', '25 上升成为 20 的双亲；把“内侧折线”拉直成 LL 形态', LR_INSERTED, LR_INSERTED_EDGES, LR_MIDDLE, LR_MIDDLE_EDGES, animate, ['20', '25'])
}

async function showLRMiddle(scene: Scene, animate: boolean) {
  heading(scene, 'LR 中间状态：第一旋还没有结束', '最小失衡根仍是 30；现在路径变成 30 → 25 → 20 的左—左形态', C.orange)
  renderTree(scene, LR_MIDDLE, LR_MIDDLE_EDGES, { active: '30', path: ['30', '25', '20'], bf: { '30': '+2', '25': '+1' } })
}

async function lrRightRotate(scene: Scene, animate: boolean) {
  await transition(scene, 'LR 案例第二旋：再对 30 做右旋', '25 上升成为子树根，20 与 30 分居左右', LR_MIDDLE, LR_MIDDLE_EDGES, LR_RESULT, LR_RESULT_EDGES, animate, ['25', '30', '20'])
}

async function verifyLR(scene: Scene, animate: boolean) {
  heading(scene, 'LR 调整完成', '两次旋转后仍保持二叉排序树次序，并恢复 AVL 平衡', C.green)
  renderTree(scene, LR_RESULT, LR_RESULT_EDGES, { bf: { '20': '0', '30': '0', '25': '0', '50': '+1', '70': '0' } })
  const note = text('先左旋孩子，再右旋失衡根', 0, -2.78, C.green, 18, '800')
  scene.add(note)
  if (animate) await scene.play(new FadeIn(note, { duration: 0.45 }))
}

const steps = [
  { id: 'avl-ll-insert', render: (scene: Scene, animate: boolean) => insertNode(scene, 'LL', animate) },
  { id: 'avl-ll-update-bf', render: (scene: Scene, animate: boolean) => updateBalance(scene, 'LL', animate) },
  { id: 'avl-ll-identify', render: (scene: Scene, animate: boolean) => identify(scene, 'LL', animate) },
  { id: 'avl-ll-right-rotate', render: llRotate },
  { id: 'avl-ll-finish', render: verifyLL },
  { id: 'avl-lr-insert', render: (scene: Scene, animate: boolean) => insertNode(scene, 'LR', animate) },
  { id: 'avl-lr-update-bf', render: (scene: Scene, animate: boolean) => updateBalance(scene, 'LR', animate) },
  { id: 'avl-lr-identify', render: (scene: Scene, animate: boolean) => identify(scene, 'LR', animate) },
  { id: 'avl-lr-left-rotate', render: lrLeftRotate },
  { id: 'avl-lr-middle', render: showLRMiddle },
  { id: 'avl-lr-right-rotate', render: lrRightRotate },
  { id: 'avl-lr-finish', render: verifyLR },
]

export const avlAdjustmentAnimation: ManimWebAnimation = {
  id: 'avl-adjustment',
  ariaLabel: '四层AVL树分别插入结点并分步完成LL单旋与LR双旋调整的动画',
  initialState: {
    id: 'avl-overview',
    render: scene => {
      heading(
        scene,
        '同一棵 AVL 树上的 LL 与 LR 调整',
        '先插入 10 形成 LL 型，再恢复初始树并插入 25 形成 LR 型',
      )
      renderTree(scene, BASE, BASE_EDGES)
      scene.render()
    },
  },
  scene: { width: 1100, height: 760, frameWidth: 12, frameHeight: 8.3, backgroundColor: '#ffffff' },
  steps: steps.map(step => ({ id: step.id, render: async (scene, animate) => { await step.render(scene, animate); scene.render() } })),
}
