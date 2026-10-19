import { Arrow, Circle, FadeIn, Rectangle, Text, VGroup, smooth, type Scene } from '@/animations/manim'
import type { ManimWebAnimation } from '../../types'

const C = { ink: '#0f172a', muted: '#64748b', line: '#94a3b8', blue: '#1d4ed8', orange: '#c2410c', green: '#047857', violet: '#6d28d9', red: '#be123c' } as const
const INORDER = ['D', 'B', 'E', 'A', 'F', 'C'] as const
const POSTORDER = ['D', 'E', 'B', 'F', 'C', 'A'] as const
const SEQ_X = [-2.25, -1.35, -0.45, 0.45, 1.35, 2.25] as const
const POS = {
  A: [0, 0.15], B: [-2.45, -1.35], C: [2.45, -1.35],
  D: [-3.65, -2.85], E: [-1.25, -2.85], F: [1.25, -2.85],
} as const

type Name = keyof typeof POS

function txt(value: string, x: number, y: number, color: string = C.ink, size = 18, weight = '700') {
  return new Text({ text: value, color, fontSize: size, fontFamily: 'Noto Sans SC, PingFang SC, sans-serif', fontWeight: weight }).moveTo([x, y, 0])
}

function cell(value: string, x: number, y: number, color: string = C.line) {
  return new VGroup(new Rectangle({ width: 0.74, height: 0.56, center: [x, y, 0], color, fillOpacity: 0.03, strokeWidth: 2 }), txt(value, x, y, C.ink, 19, '800'))
}

function node(value: Name, color: string = C.blue) {
  const [x, y] = POS[value]
  return new VGroup(new Circle({ radius: 0.37, center: [x, y, 0], color, fillOpacity: 0.065, strokeWidth: 2.5 }), txt(value, x, y, C.ink, 18, '800'))
}

const EDGES: [Name, Name][] = [['A', 'B'], ['A', 'C'], ['B', 'D'], ['B', 'E'], ['C', 'F']]

function edge(parent: Name, child: Name) {
  const [px, py] = POS[parent]
  const [cx, cy] = POS[child]
  const dx = cx - px
  const dy = cy - py
  const length = Math.sqrt(dx * dx + dy * dy)
  const ux = dx / length
  const uy = dy / length
  return new Arrow({ start: [px + ux * 0.42, py + uy * 0.42, 0], end: [cx - ux * 0.42, cy - uy * 0.42, 0], color: C.line, strokeWidth: 2.3, tipLength: 0.13 })
}

function sequences(scene: Scene, inorderHighlights: number[] = [], postorderHighlights: number[] = []) {
  scene.add(txt('由中序 + 后序确定二叉树', 0, 3.35, C.ink, 25, '800'), txt('中序', -3.35, 2.52, C.blue, 15, '800'), txt('后序', -3.35, 1.65, C.violet, 15, '800'))
  INORDER.forEach((value, index) => scene.add(cell(value, SEQ_X[index], 2.52, inorderHighlights.includes(index) ? C.orange : C.blue)))
  POSTORDER.forEach((value, index) => scene.add(cell(value, SEQ_X[index], 1.65, postorderHighlights.includes(index) ? C.orange : C.violet)))
  inorderHighlights.forEach(index => scene.add(new Rectangle({ width: 0.82, height: 0.66, center: [SEQ_X[index], 2.52, 0], color: C.orange, fillOpacity: 0.07, strokeWidth: 3 })))
  postorderHighlights.forEach(index => scene.add(new Rectangle({ width: 0.82, height: 0.66, center: [SEQ_X[index], 1.65, 0], color: C.orange, fillOpacity: 0.07, strokeWidth: 3 })))
}

function tree(scene: Scene, names: Name[], active?: Name) {
  EDGES.filter(([parent, child]) => names.includes(parent) && names.includes(child)).forEach(([parent, child]) => scene.add(edge(parent, child)))
  names.forEach(name => scene.add(node(name, name === active ? C.orange : name === 'A' ? C.green : C.blue)))
}

async function addActiveNode(scene: Scene, name: Name, animate: boolean) {
  const active = node(name, C.orange)
  scene.add(active)
  if (animate) await scene.play(new FadeIn(active, { duration: 0.58, shift: [0, 0.24, 0], rateFunc: smooth }))
}

async function rootA(scene: Scene, animate: boolean) {
  sequences(scene, [], [5])
  scene.add(txt('后序最后一个结点 A 是整棵树的根', 3.9, 1.65, C.orange, 16, '800'))
  await addActiveNode(scene, 'A', animate)
}

async function splitAtA(scene: Scene, animate: boolean) {
  sequences(scene, [3], [5]); tree(scene, ['A'])
  const left = new Rectangle({ width: 2.68, height: 0.72, center: [-1.35, 2.52, 0], color: C.blue, fillOpacity: 0.035, strokeWidth: 3 })
  const right = new Rectangle({ width: 1.78, height: 0.72, center: [1.8, 2.52, 0], color: C.green, fillOpacity: 0.035, strokeWidth: 3 })
  scene.add(left, right, txt('A 左边 DBE → 左子树', -2.45, 0.75, C.blue, 15, '800'), txt('A 右边 FC → 右子树', 2.45, 0.75, C.green, 15, '800'))
  if (animate) await scene.play(new FadeIn(left, { duration: 0.4 }), new FadeIn(right, { duration: 0.4 }))
}

async function rootB(scene: Scene, animate: boolean) {
  sequences(scene, [0, 1, 2], [0, 1, 2]); tree(scene, ['A'])
  scene.add(edge('A', 'B'), txt('左子树后序 D E B：最后的 B 是左子树根', -2.2, 0.75, C.orange, 15, '800'))
  await addActiveNode(scene, 'B', animate)
}

async function splitAtB(scene: Scene, animate: boolean) {
  sequences(scene, [1], [2]); tree(scene, ['A', 'B'])
  const dFrame = new Rectangle({ width: 0.82, height: 0.66, center: [SEQ_X[0], 2.52, 0], color: C.blue, fillOpacity: 0.06, strokeWidth: 3 })
  const eFrame = new Rectangle({ width: 0.82, height: 0.66, center: [SEQ_X[2], 2.52, 0], color: C.green, fillOpacity: 0.06, strokeWidth: 3 })
  scene.add(dFrame, eFrame, txt('D 在 B 左边', -3.65, -1.95, C.blue, 15, '800'), txt('E 在 B 右边', -1.25, -1.95, C.green, 15, '800'))
  if (animate) await scene.play(new FadeIn(dFrame, { duration: 0.4 }), new FadeIn(eFrame, { duration: 0.4 }))
}

async function addD(scene: Scene, animate: boolean) {
  sequences(scene, [0], [0]); tree(scene, ['A', 'B']); scene.add(edge('B', 'D'), txt('D 只有一个结点，成为 B 的左孩子', -2.45, 0.75, C.blue, 15, '800')); await addActiveNode(scene, 'D', animate)
}

async function addE(scene: Scene, animate: boolean) {
  sequences(scene, [2], [1]); tree(scene, ['A', 'B', 'D']); scene.add(edge('B', 'E'), txt('E 只有一个结点，成为 B 的右孩子', -2.45, 0.75, C.green, 15, '800')); await addActiveNode(scene, 'E', animate)
}

async function rootC(scene: Scene, animate: boolean) {
  sequences(scene, [4, 5], [3, 4]); tree(scene, ['A', 'B', 'D', 'E']); scene.add(edge('A', 'C'), txt('右子树后序 F C：最后的 C 是右子树根', 2.2, 0.75, C.orange, 15, '800')); await addActiveNode(scene, 'C', animate)
}

async function splitAtC(scene: Scene, animate: boolean) {
  sequences(scene, [5], [4]); tree(scene, ['A', 'B', 'C', 'D', 'E'])
  const fFrame = new Rectangle({ width: 0.82, height: 0.66, center: [SEQ_X[4], 2.52, 0], color: C.blue, fillOpacity: 0.06, strokeWidth: 3 })
  scene.add(fFrame, txt('中序 F C：F 在 C 左边，所以 F 是左孩子', 2.25, 0.75, C.blue, 15, '800'))
  if (animate) await scene.play(new FadeIn(fFrame, { duration: 0.4 }))
}

async function addF(scene: Scene, animate: boolean) {
  sequences(scene, [4], [3]); tree(scene, ['A', 'B', 'C', 'D', 'E']); scene.add(edge('C', 'F'), txt('F 只有一个结点，成为 C 的左孩子', 2.45, 0.75, C.green, 15, '800')); await addActiveNode(scene, 'F', animate)
}

async function finish(scene: Scene, animate: boolean) {
  sequences(scene); tree(scene, ['A', 'B', 'C', 'D', 'E', 'F'])
  const note = txt('构造完成：后序定根，中序划分左右子树，然后递归', 0, -3.55, C.green, 17, '800')
  scene.add(note)
  if (animate) await scene.play(new FadeIn(note, { duration: 0.45 }))
}

const steps = [rootA, splitAtA, rootB, splitAtB, addD, addE, rootC, splitAtC, addF, finish]

export const rebuildBinaryTreeAnimation: ManimWebAnimation = {
  id: 'rebuild-binary-tree-from-traversals',
  ariaLabel: '由中序与后序序列分步找根划分区间并构造层次分明二叉树的动画',
  initialState: { id: 'rebuild-overview', render: scene => { scene.add(txt('由遍历序列确定二叉树', 0, 2, C.ink, 27, '800'), txt('后序末尾确定根结点，中序序列划分左右子树', 0, 0, C.muted, 19)); scene.render() } },
  scene: { width: 1100, height: 760, frameWidth: 12, frameHeight: 8.3, backgroundColor: '#ffffff' },
  steps: steps.map((render, index) => ({ id: `rebuild-step-${index + 1}`, render: async (scene, animate) => { await render(scene, animate); scene.render() } })),
}
