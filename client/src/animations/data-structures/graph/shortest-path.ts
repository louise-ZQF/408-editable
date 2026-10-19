import { Arrow, Circle, FadeIn, Indicate, Rectangle, Text, Transform, VGroup, smooth, type Scene } from '@/animations/manim'
import type { ManimWebAnimation } from '../../types'

const C = { ink: '#0f172a', muted: '#64748b', line: '#94a3b8', blue: '#1d4ed8', orange: '#c2410c', green: '#047857', violet: '#6d28d9', red: '#be123c', pale: '#f8fafc' } as const
type Vertex = 'A' | 'B' | 'C' | 'D' | 'E'
type Point = readonly [number, number]
type State = { dist: Record<Vertex, string>; path: Record<Vertex, string>; done: Vertex[] }
type EdgeDef = { from: Vertex; to: Vertex; weight: number; label: Point }

const VERTICES: Vertex[] = ['A', 'B', 'C', 'D', 'E']
const POS: Record<Vertex, Point> = {
  A: [-4.65, 0.15], B: [-2.75, 1.65], C: [-2.75, -1.35], D: [-0.45, 1.4], E: [-0.45, -1.25],
}
const EDGES: EdgeDef[] = [
  { from: 'A', to: 'B', weight: 10, label: [-3.82, 1.13] },
  { from: 'A', to: 'C', weight: 3, label: [-3.82, -0.82] },
  { from: 'C', to: 'B', weight: 2, label: [-2.46, 0.14] },
  { from: 'B', to: 'D', weight: 2, label: [-1.6, 1.82] },
  { from: 'C', to: 'D', weight: 8, label: [-1.82, 0.22] },
  { from: 'C', to: 'E', weight: 4, label: [-1.58, -1.56] },
  { from: 'E', to: 'D', weight: 1, label: [-0.14, 0.1] },
]

const S0: State = { dist: { A: '0', B: '∞', C: '∞', D: '∞', E: '∞' }, path: { A: '—', B: '—', C: '—', D: '—', E: '—' }, done: [] }
const SA: State = { ...S0, done: ['A'] }
const SAB: State = { dist: { ...SA.dist, B: '10' }, path: { ...SA.path, B: 'A' }, done: ['A'] }
const SAC: State = { dist: { ...SAB.dist, C: '3' }, path: { ...SAB.path, C: 'A' }, done: ['A'] }
const SC: State = { ...SAC, done: ['A', 'C'] }
const SCB: State = { dist: { ...SC.dist, B: '5' }, path: { ...SC.path, B: 'C' }, done: ['A', 'C'] }
const SCD: State = { dist: { ...SCB.dist, D: '11' }, path: { ...SCB.path, D: 'C' }, done: ['A', 'C'] }
const SCE: State = { dist: { ...SCD.dist, E: '7' }, path: { ...SCD.path, E: 'C' }, done: ['A', 'C'] }
const SB: State = { ...SCE, done: ['A', 'C', 'B'] }
const SBD: State = { dist: { ...SB.dist, D: '7' }, path: { ...SB.path, D: 'B' }, done: ['A', 'C', 'B'] }
const SD: State = { ...SBD, done: ['A', 'C', 'B', 'D'] }
const SE: State = { ...SBD, done: ['A', 'C', 'B', 'D', 'E'] }

function text(value: string, x: number, y: number, color: string = C.ink, size = 18, weight = '700') {
  return new Text({ text: value, color, fontSize: size, fontFamily: 'Noto Sans SC, PingFang SC, sans-serif', fontWeight: weight }).moveTo([x, y, 0])
}

function node(value: Vertex, point: Point, color: string) {
  return new VGroup(
    new Circle({ radius: 0.36, center: [point[0], point[1], 0], color, fillOpacity: color === C.green ? 0.1 : 0.045, strokeWidth: 2.6 }),
    text(value, point[0], point[1], color, 18, '800'),
  )
}

function edgeMob(edge: EdgeDef, color: string) {
  const [x1, y1] = POS[edge.from]
  const [x2, y2] = POS[edge.to]
  const dx = x2 - x1
  const dy = y2 - y1
  const length = Math.sqrt(dx * dx + dy * dy)
  const ux = dx / length
  const uy = dy / length
  return new Arrow({
    start: [x1 + ux * 0.42, y1 + uy * 0.42, 0], end: [x2 - ux * 0.44, y2 - uy * 0.44, 0],
    color, strokeWidth: color === C.line ? 2 : 3.2, tipLength: 0.13,
  })
}

function drawGraph(scene: Scene, state: State, options: { selected?: Vertex; activeEdge?: string; final?: boolean } = {}) {
  const treeEdges = new Set(['A-C', 'C-B', 'B-D', 'C-E'])
  const edges: Record<string, Arrow> = {}
  EDGES.forEach(edge => {
    const key = `${edge.from}-${edge.to}`
    const color = options.activeEdge === key ? C.orange : options.final && treeEdges.has(key) ? C.green : C.line
    edges[key] = edgeMob(edge, color)
    scene.add(edges[key], text(String(edge.weight), edge.label[0], edge.label[1], color === C.line ? C.muted : color, 13, '800'))
  })
  const nodes: Record<Vertex, VGroup> = {} as Record<Vertex, VGroup>
  VERTICES.forEach(vertex => {
    const color = vertex === options.selected ? C.orange : state.done.includes(vertex) ? C.green : C.blue
    nodes[vertex] = node(vertex, POS[vertex], color)
    scene.add(nodes[vertex])
  })
  scene.add(text('源点 A', -4.65, -0.52, C.green, 14, '800'))
  return { nodes, edges }
}

function table(scene: Scene, state: State, changed?: { vertex: Vertex; rows: Array<'dist' | 'path' | 'done'> }) {
  const startX = 1.3
  const colW = 0.82
  const rowY = [1.5, 0.68, -0.14, -0.96]
  const labels = ['顶点', 'dist', 'path', '是否确定']
  const cells: Record<string, VGroup> = {}
  labels.forEach((label, row) => {
    scene.add(text(label, 0.55, rowY[row], row === 0 ? C.ink : row === 3 ? C.green : row === 1 ? C.blue : C.violet, 14, '800'))
  })
  VERTICES.forEach((vertex, column) => {
    const x = startX + column * colW
    const values = [vertex, state.dist[vertex], state.path[vertex], state.done.includes(vertex) ? '是' : '否']
    values.forEach((value, row) => {
      const rowName = row === 1 ? 'dist' : row === 2 ? 'path' : row === 3 ? 'done' : 'header'
      const active = changed?.vertex === vertex && changed.rows.includes(rowName as 'dist' | 'path' | 'done')
      const color = active ? C.orange : row === 3 && value === '是' ? C.green : row === 0 ? C.ink : C.muted
      const cell = new VGroup(
        new Rectangle({ width: colW - 0.06, height: 0.68, center: [x, rowY[row], 0], color: active ? C.orange : C.line, fillOpacity: active ? 0.07 : 0.015, strokeWidth: active ? 2.4 : 1.5 }),
        text(value, x, rowY[row], color, 14, '800'),
      )
      cells[`${rowName}-${vertex}`] = cell
      scene.add(cell)
    })
  })
  scene.add(text('path 表示当前最短路上该顶点的前驱', 2.9, -1.62, C.violet, 13, '700'))
  return cells
}

function baseScene(scene: Scene, state: State, title: string, note: string, options: { selected?: Vertex; activeEdge?: string; changed?: { vertex: Vertex; rows: Array<'dist' | 'path' | 'done'> }; final?: boolean } = {}) {
  scene.add(text(title, 0, 3.05, C.ink, 23, '800'))
  const graph = drawGraph(scene, state, options)
  const cells = table(scene, state, options.changed)
  scene.add(text(note, 0, -2.83, options.activeEdge ? C.orange : C.muted, 15, '700'))
  return { ...graph, cells }
}

async function selectVertex(scene: Scene, state: State, vertex: Vertex, note: string, animate: boolean) {
  const rendered = baseScene(scene, state, `确定顶点 ${vertex}`, note, { selected: vertex, changed: { vertex, rows: ['done'] } })
  if (animate) await scene.play(
    new FadeIn(rendered.nodes[vertex], { duration: 0.45 }),
    new FadeIn(rendered.cells[`done-${vertex}`], { duration: 0.45 }),
  )
}

async function relax(scene: Scene, state: State, edge: string, vertex: Vertex, formula: string, changed: boolean, animate: boolean) {
  const rendered = baseScene(scene, state, `检查边 ${edge.replace('-', ' → ')}`, formula, { activeEdge: edge, changed: changed ? { vertex, rows: ['dist', 'path'] } : undefined })
  if (animate) {
    await scene.play(new FadeIn(rendered.edges[edge], { duration: 0.45 }))
    if (changed) await scene.play(
      new FadeIn(rendered.cells[`dist-${vertex}`], { duration: 0.4 }),
      new FadeIn(rendered.cells[`path-${vertex}`], { duration: 0.4 }),
    )
  }
}

async function finishDijkstra(scene: Scene, animate: boolean) {
  const rendered = baseScene(scene, SE, '最短路径全部确定', '确定顺序：A → C → B → D → E；绿色边组成从 A 出发的最短路径树', { final: true })
  if (animate) await scene.play(new FadeIn(text('A→C=3　A→C→B=5　A→C→B→D=7　A→C→E=7', 0, 2.48, C.green, 15, '800'), { duration: 0.5 }))
  Object.values(rendered.nodes).forEach(item => scene.add(item))
}

const dijkstraSteps = [
  { id: 'd-select-a', render: (s: Scene, a: boolean) => selectVertex(s, SA, 'A', '未确定顶点中 dist[A]=0 最小，把 A 标记为“已确定”', a) },
  { id: 'd-relax-a-b', render: (s: Scene, a: boolean) => relax(s, SAB, 'A-B', 'B', '0 + 10 < ∞：dist[B]←10，path[B]←A', true, a) },
  { id: 'd-relax-a-c', render: (s: Scene, a: boolean) => relax(s, SAC, 'A-C', 'C', '0 + 3 < ∞：dist[C]←3，path[C]←A', true, a) },
  { id: 'd-select-c', render: (s: Scene, a: boolean) => selectVertex(s, SC, 'C', '未确定顶点中 dist[C]=3 最小，C 的最短距离从此锁定', a) },
  { id: 'd-relax-c-b', render: (s: Scene, a: boolean) => relax(s, SCB, 'C-B', 'B', 'dist[C]+2=3+2=5 < 10：dist[B]←5，path[B]←C', true, a) },
  { id: 'd-relax-c-d', render: (s: Scene, a: boolean) => relax(s, SCD, 'C-D', 'D', 'dist[C]+8=3+8=11 < ∞：dist[D]←11，path[D]←C', true, a) },
  { id: 'd-relax-c-e', render: (s: Scene, a: boolean) => relax(s, SCE, 'C-E', 'E', 'dist[C]+4=3+4=7 < ∞：dist[E]←7，path[E]←C', true, a) },
  { id: 'd-select-b', render: (s: Scene, a: boolean) => selectVertex(s, SB, 'B', '未确定顶点中 dist[B]=5 最小，把 B 标记为“已确定”', a) },
  { id: 'd-relax-b-d', render: (s: Scene, a: boolean) => relax(s, SBD, 'B-D', 'D', 'dist[B]+2=5+2=7 < 11：dist[D]←7，path[D]←B', true, a) },
  { id: 'd-select-d', render: (s: Scene, a: boolean) => selectVertex(s, SD, 'D', 'D、E 的 dist 都是 7；任选 D 先确定，不影响最终最短距离', a) },
  { id: 'd-select-e', render: (s: Scene, a: boolean) => selectVertex(s, SE, 'E', '剩余未确定顶点中 E 最小，把 E 标记为“已确定”', a) },
  { id: 'd-check-e-d', render: (s: Scene, a: boolean) => relax(s, SE, 'E-D', 'D', 'D 已经确定，不再更新；即使计算 7+1=8，也不会优于 dist[D]=7', false, a) },
  { id: 'd-finish', render: finishDijkstra },
]

function matrix(rows: string[][], y = 1.35) {
  const group = new VGroup()
  for (let row = 0; row < rows.length; row++) for (let column = 0; column < rows[row].length; column++) {
    const x = -1.65 + column * 1.1
    const yy = y - row * 0.82
    group.add(new Rectangle({ width: 1, height: 0.7, center: [x, yy, 0], color: C.line, fillOpacity: 0.02, strokeWidth: 1.7 }), text(rows[row][column], x, yy, C.ink, 16, '800'))
  }
  return group
}

async function floyd(scene: Scene) {
  scene.add(text('Floyd：逐轮开放中转顶点 k', 0, 2.65, C.ink, 24, '800'), text('D[i][j] = min(D[i][j], D[i][k] + D[k][j])', 2.8, -2.35, C.violet, 16, '800'))
  let current = matrix([['0', '4', '∞', '10'], ['∞', '0', '3', '∞'], ['∞', '∞', '0', '2'], ['∞', '∞', '∞', '0']])
  scene.add(current)
  for (const [label, rows] of [['允许 B 中转', [['0', '4', '7', '10'], ['∞', '0', '3', '∞'], ['∞', '∞', '0', '2'], ['∞', '∞', '∞', '0']]], ['允许 C 中转', [['0', '4', '7', '9'], ['∞', '0', '3', '5'], ['∞', '∞', '0', '2'], ['∞', '∞', '∞', '0']]]] as const) {
    scene.add(text(label, 3, 1, C.orange, 17, '800'))
    const next = matrix(rows.map(row => [...row]))
    await scene.play(new Transform(current, next, { duration: 0.9, rateFunc: smooth }))
    await scene.play(new Indicate(current, { color: C.green, scaleFactor: 1.03, duration: 0.5 }))
  }
}

export const dijkstraAnimation: ManimWebAnimation = {
  id: 'dijkstra',
  ariaLabel: '在有向带权图上逐轮选择最小未确定顶点，并同步更新dist、path和是否确定数组的迪杰斯特拉动画',
  initialState: {
    id: 'dijkstra-overview',
    render: scene => {
      baseScene(scene, S0, '从源点 A 求其余顶点的最短路径', 'dist[A]=0，其余为∞；path 暂为空；所有顶点尚未确定')
      scene.render()
    },
  },
  scene: { width: 1100, height: 700, frameWidth: 12, frameHeight: 7.6, backgroundColor: '#ffffff' },
  steps: dijkstraSteps.map(step => ({ id: step.id, render: async (scene, animate) => { await step.render(scene, animate); scene.render() } })),
}

export const floydAnimation: ManimWebAnimation = {
  id: 'floyd', ariaLabel: '弗洛伊德算法逐轮开放中转点并变换距离矩阵的动画',
  initialState: { id: 'f0', render: scene => { scene.add(text('Floyd 多源最短路径', 0, 2, C.ink, 27, '800')); scene.render() } },
  scene: { width: 1100, height: 650, frameWidth: 12, frameHeight: 7, backgroundColor: '#ffffff' },
  steps: [{ id: 'f-run', render: async scene => { await floyd(scene); scene.render() } }],
}
