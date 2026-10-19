import { FadeIn, FadeOut, Line, Rectangle, Shift, Text, VGroup, smooth, type Scene } from '@/animations/manim'
import type { ManimWebAnimation } from '../../types'

const C = { ink: '#0f172a', muted: '#64748b', line: '#94a3b8', blue: '#1d4ed8', orange: '#c2410c', green: '#047857', red: '#be123c', violet: '#6d28d9' } as const
type Point = readonly [number, number]
type NodeSpec = readonly [readonly number[], Point]
type State = { nodes: Record<string, NodeSpec>; edges: Array<readonly [string, string]>; pos: Record<number, Point>; centers: Record<string, Point> }

function text(value: string, x: number, y: number, color: string = C.ink, size = 17, weight = '700') {
  return new Text({ text: value, color, fontSize: size, fontFamily: 'Noto Sans SC, PingFang SC, sans-serif', fontWeight: weight }).moveTo([x, y, 0])
}

function note(scene: Scene, value: string, color: string) {
  const label = text(value, 0, -3.35, color, 15, '800')
  const box = new Rectangle({ width: Math.min(10.8, Math.max(5, value.length * 0.29)), height: 0.62, center: [0, -3.35, 0], color, fillOpacity: 0.015, strokeWidth: 1.8 })
  scene.add(box, label)
}

function pack(nodes: Record<string, NodeSpec>, edges: Array<readonly [string, string]>): State {
  const pos: Record<number, Point> = {}
  const centers: Record<string, Point> = {}
  Object.entries(nodes).forEach(([name, [keys, center]]) => {
    centers[name] = center
    const widths = keys.map(key => `${key}`.length === 3 ? 0.54 : 0.44)
    const total = widths.reduce((sum, width) => sum + width, 0) + 0.04 * (keys.length - 1)
    let x = center[0] - total / 2
    keys.forEach((key, index) => {
      pos[key] = [x + widths[index] / 2, center[1]]
      x += widths[index] + 0.04
    })
  })
  return { nodes, edges, pos, centers }
}

function keyBox(key: number, at: Point, color: string = C.blue) {
  const width = `${key}`.length === 3 ? 0.54 : 0.44
  return new VGroup(
    new Rectangle({ width, height: 0.46, center: [at[0], at[1], 0], color, fillOpacity: 0.02, strokeWidth: 2.1 }),
    text(`${key}`, at[0], at[1], C.ink, 13, '800'),
  )
}

function linesFor(state: State) {
  return state.edges.map(([parent, child]) => new Line({
    start: [state.centers[parent][0], state.centers[parent][1] - 0.28, 0],
    end: [state.centers[child][0], state.centers[child][1] + 0.28, 0], color: C.line, strokeWidth: 2,
  }))
}

function drawState(scene: Scene, state: State, options: { activeKeys?: number[]; activeNodes?: string[] } = {}) {
  const lines = linesFor(state)
  scene.add(...lines)
  const keys: Record<number, VGroup> = {}
  Object.entries(state.pos).forEach(([raw, at]) => {
    const key = Number(raw)
    keys[key] = keyBox(key, at, options.activeKeys?.includes(key) ? C.orange : C.blue)
    scene.add(keys[key])
  })
  const nodeFrames: Rectangle[] = []
  ;(options.activeNodes ?? []).forEach(name => {
    const nodeKeys = state.nodes[name][0]
    const points = nodeKeys.map(key => state.pos[key])
    const minX = Math.min(...points.map(point => point[0]))
    const maxX = Math.max(...points.map(point => point[0]))
    const frame = new Rectangle({ width: maxX - minX + 0.72, height: 0.68, center: [(minX + maxX) / 2, points[0][1], 0], color: C.orange, fillOpacity: 0.015, strokeWidth: 2.8 })
    nodeFrames.push(frame)
    scene.add(frame)
  })
  return { keys, lines, nodeFrames }
}

type TransitionOptions = {
  message: string; color: string; added?: { key: number; from: Point }; removed?: number[]; activeNodes?: string[]; activeKeys?: number[]
}

async function transitionState(scene: Scene, oldState: State, newState: State, options: TransitionOptions, animate: boolean) {
  note(scene, options.message, options.color)
  if (!animate) {
    drawState(scene, newState, { activeKeys: options.activeKeys })
    return
  }
  const old = drawState(scene, oldState, { activeNodes: options.activeNodes, activeKeys: options.activeKeys })
  const moving: Record<number, VGroup> = { ...old.keys }
  if (options.added) {
    moving[options.added.key] = keyBox(options.added.key, options.added.from, C.orange)
    scene.add(moving[options.added.key])
    await scene.play(new FadeIn(moving[options.added.key], { duration: 0.35 }))
  }
  const animations: Array<Shift | FadeOut> = Object.entries(newState.pos).flatMap(([raw, target]) => {
    const key = Number(raw)
    const mob = moving[key]
    if (!mob) return []
    const source = oldState.pos[key] ?? options.added?.from
    if (!source) return []
    return [new Shift(mob, { direction: [target[0] - source[0], target[1] - source[1], 0], duration: 1.25, rateFunc: smooth })]
  })
  ;(options.removed ?? []).forEach(key => { if (moving[key]) animations.push(new FadeOut(moving[key], { duration: 0.45 })) })
  old.lines.forEach(line => animations.push(new FadeOut(line, { duration: 0.4 })))
  old.nodeFrames.forEach(frame => animations.push(new FadeOut(frame, { duration: 0.3 })))
  await scene.play(...animations)
  const newLines = linesFor(newState)
  scene.add(...newLines)
  await scene.play(...newLines.map(line => new FadeIn(line, { duration: 0.45 })))
}

const S0 = pack({
  root: [[30, 60, 90, 120], [0, 2.35]],
  a: [[5, 10], [-4.6, 0.55]], b: [[35, 40], [-2.3, 0.55]], c: [[65, 70], [0, 0.55]], d: [[95, 100], [2.3, 0.55]], e: [[125, 126, 128, 135], [4.6, 0.55]],
}, [['root', 'a'], ['root', 'b'], ['root', 'c'], ['root', 'd'], ['root', 'e']])

const S1 = pack({ ...S0.nodes, e: [[125, 126, 128, 132, 135], [4.6, 0.55]] }, S0.edges)

const S2 = pack({
  root: [[30, 60, 90, 120, 128], [0, 2.35]],
  a: [[5, 10], [-4.9, 0.55]], b: [[35, 40], [-2.7, 0.55]], c: [[65, 70], [-0.5, 0.55]], d: [[95, 100], [1.6, 0.55]], e1: [[125, 126], [3.45, 0.55]], e2: [[132, 135], [5.1, 0.55]],
}, [['root', 'a'], ['root', 'b'], ['root', 'c'], ['root', 'd'], ['root', 'e1'], ['root', 'e2']])

const S3 = pack({
  root: [[90], [0, 3.1]], left: [[30, 60], [-2.75, 1.55]], right: [[120, 128], [2.75, 1.55]],
  a: [[5, 10], [-4.8, -0.05]], b: [[35, 40], [-3, -0.05]], c: [[65, 70], [-1.2, -0.05]], d: [[95, 100], [1.2, -0.05]], e1: [[125, 126], [2.95, -0.05]], e2: [[132, 135], [4.55, -0.05]],
}, [['root', 'left'], ['root', 'right'], ['left', 'a'], ['left', 'b'], ['left', 'c'], ['right', 'd'], ['right', 'e1'], ['right', 'e2']])

const D0 = pack({ ...S3.nodes, e1: [[125, 126, 127], [2.95, -0.05]] }, S3.edges)
const D1_DELETE_100 = pack({ ...D0.nodes, d: [[95], [1.2, -0.05]] }, D0.edges)
const D2_BORROWED = pack({
  ...D0.nodes,
  right: [[125, 128], [2.75, 1.55]], d: [[95, 120], [1.2, -0.05]], e1: [[126, 127], [2.95, -0.05]],
}, D0.edges)
const D3_REPLACED_125 = pack({
  ...D2_BORROWED.nodes,
  right: [[120, 128], [2.75, 1.55]], d: [[95], [1.2, -0.05]],
}, D2_BORROWED.edges)
const D4_LEAF_MERGED = pack({
  root: [[90], [0, 3.1]], left: [[30, 60], [-2.75, 1.55]], right: [[128], [2.75, 1.55]],
  a: [[5, 10], [-4.8, -0.05]], b: [[35, 40], [-3, -0.05]], c: [[65, 70], [-1.2, -0.05]], dmerge: [[95, 120, 126, 127], [1.9, -0.05]], e2: [[132, 135], [4.1, -0.05]],
}, [['root', 'left'], ['root', 'right'], ['left', 'a'], ['left', 'b'], ['left', 'c'], ['right', 'dmerge'], ['right', 'e2']])
const D5_HEIGHT_DOWN = pack({
  root: [[30, 60, 90, 128], [0, 2.25]],
  a: [[5, 10], [-4.8, 0.25]], b: [[35, 40], [-3, 0.25]], c: [[65, 70], [-1.2, 0.25]], dmerge: [[95, 120, 126, 127], [1.55, 0.25]], e2: [[132, 135], [4.4, 0.25]],
}, [['root', 'a'], ['root', 'b'], ['root', 'c'], ['root', 'dmerge'], ['root', 'e2']])

async function showState(scene: Scene, state: State, message: string, color: string, animate: boolean, activeNodes: string[] = [], activeKeys: number[] = []) {
  note(scene, message, color)
  const drawn = drawState(scene, state, { activeNodes, activeKeys })
  if (animate) await scene.play(...drawn.nodeFrames.map(frame => new FadeIn(frame, { duration: 0.4 })), ...activeKeys.filter(key => drawn.keys[key]).map(key => new FadeIn(drawn.keys[key], { duration: 0.4 })))
}

const insertionSteps = [
  { id: 'btree-insert-path', render: (s: Scene, a: boolean) => showState(s, S0, '插入 132：沿根结点找到最右叶结点', C.orange, a, ['root', 'e']) },
  { id: 'btree-insert-overflow', render: (s: Scene, a: boolean) => transitionState(s, S0, S1, { message: '132 移入有序位置；叶结点变成 5 个关键字，超过上限 4', color: C.red, added: { key: 132, from: [5.25, -1.7] }, activeNodes: ['e'], activeKeys: [132] }, a) },
  { id: 'btree-split-leaf', render: (s: Scene, a: boolean) => transitionState(s, S1, S2, { message: '拆叶结点：中间关键字 128 上升，左右各留下 2 个关键字', color: C.orange, activeNodes: ['e'], activeKeys: [128] }, a) },
  { id: 'btree-split-root', render: (s: Scene, a: boolean) => transitionState(s, S2, S3, { message: '根也变成 5 个关键字：中间关键字 90 上升，树高增加 1', color: C.green, activeNodes: ['root'], activeKeys: [90] }, a) },
]

const deletionSteps = [
  { id: 'btree-delete-100', render: (s: Scene, a: boolean) => transitionState(s, D0, D1_DELETE_100, { message: '先删除叶结点中的 100：结点只剩 95，低于下限 2', color: C.red, removed: [100], activeNodes: ['d'], activeKeys: [100] }, a) },
  { id: 'btree-find-lender', render: (s: Scene, a: boolean) => showState(s, D1_DELETE_100, '检查右兄弟：125、126、127 共 3 个关键字，多于下限，可以借', C.orange, a, ['d', 'e1'], [120, 125]) },
  { id: 'btree-borrow', render: (s: Scene, a: boolean) => transitionState(s, D1_DELETE_100, D2_BORROWED, { message: '借位：父分隔值 120 下移补左结点，兄弟最小关键字 125 上移到父结点', color: C.green, activeNodes: ['d', 'e1', 'right'], activeKeys: [120, 125] }, a) },
  { id: 'btree-select-125', render: (s: Scene, a: boolean) => showState(s, D2_BORROWED, '接着删除非叶关键字 125：不能直接留下空位', C.violet, a, ['right'], [125]) },
  { id: 'btree-pred-or-succ', render: (s: Scene, a: boolean) => showState(s, D2_BORROWED, '先找替代值：前驱是 120，后继是 126；两者都位于最底层叶结点', C.orange, a, ['d', 'e1'], [120, 125, 126]) },
  { id: 'btree-use-predecessor', render: (s: Scene, a: boolean) => transitionState(s, D2_BORROWED, D3_REPLACED_125, { message: '选择前驱 120：120 上移替换 125，再从原叶结点删除 120', color: C.violet, removed: [125], activeNodes: ['d', 'right'], activeKeys: [120, 125] }, a) },
  { id: 'btree-cannot-borrow', render: (s: Scene, a: boolean) => showState(s, D3_REPLACED_125, '叶结点只剩 95；右兄弟 126、127 已达下限，不能借', C.red, a, ['d', 'e1'], [120]) },
  { id: 'btree-leaf-merge', render: (s: Scene, a: boolean) => transitionState(s, D3_REPLACED_125, D4_LEAF_MERGED, { message: '不能借就合并：95、父分隔值 120、右兄弟 126、127 合成一个结点', color: C.violet, activeNodes: ['d', 'e1'], activeKeys: [120] }, a) },
  { id: 'btree-parent-underflow', render: (s: Scene, a: boolean) => showState(s, D4_LEAF_MERGED, '右侧父结点只剩 128，低于下限 2；根的另一侧也不能借', C.red, a, ['right'], [128]) },
  { id: 'btree-height-down', render: (s: Scene, a: boolean) => transitionState(s, D4_LEAF_MERGED, D5_HEIGHT_DOWN, { message: '继续合并：90 下降到新根，旧根变空，树高减少 1', color: C.green, activeNodes: ['root', 'left', 'right'], activeKeys: [90] }, a) },
]

export const bTreeInsertionAnimation: ManimWebAnimation = {
  id: 'b-tree-insertion', ariaLabel: '5阶B树插入132并逐步完成叶分裂、根分裂和树高增加的动画',
  initialState: { id: 'btree-insert-overview', render: scene => { note(scene, '5 阶 B 树：每个结点最多 4 个关键字，非根结点至少 2 个关键字', C.blue); drawState(scene, S0); scene.render() } },
  scene: { width: 1200, height: 760, frameWidth: 12.4, frameHeight: 8.2, backgroundColor: '#ffffff' },
  steps: insertionSteps.map(step => ({ id: step.id, render: async (scene, animate) => { await step.render(scene, animate); scene.render() } })),
}

export const bTreeDeletionAnimation: ManimWebAnimation = {
  id: 'b-tree-deletion', ariaLabel: '5阶B树删除100和125，逐步完成借位、前驱替换、合并和树高减少的动画',
  initialState: { id: 'btree-delete-overview', render: scene => { note(scene, '先删除 100 处理借位，再删除非叶关键字 125', C.blue); drawState(scene, D0); scene.render() } },
  scene: { width: 1200, height: 760, frameWidth: 12.4, frameHeight: 8.2, backgroundColor: '#ffffff' },
  steps: deletionSteps.map(step => ({ id: step.id, render: async (scene, animate) => { await step.render(scene, animate); scene.render() } })),
}
