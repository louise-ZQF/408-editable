import { Arrow, Circle, FadeIn, Rectangle, Text, VGroup, type Scene } from '@/animations/manim'
import type { ManimWebAnimation } from '../../types'

const C = { ink: '#0f172a', muted: '#64748b', line: '#94a3b8', faint: '#e2e8f0', blue: '#1d4ed8', orange: '#c2410c', green: '#047857', red: '#be123c', violet: '#6d28d9' } as const
type Vertex = 'v1' | 'v2' | 'v3' | 'v4' | 'v5' | 'v6'
type Point = readonly [number, number]
type EdgeDef = { id: string; from: Vertex; to: Vertex; weight: number; label: Point }

const VERTICES: Vertex[] = ['v1', 'v2', 'v3', 'v4', 'v5', 'v6']
const POS: Record<Vertex, Point> = {
  v1: [-4.85, 0.25], v2: [-3.25, 1.65], v3: [-3.25, -1.2],
  v4: [-1.15, 1.15], v5: [-1.15, -1.4], v6: [0.75, 0.05],
}
const EDGES: EdgeDef[] = [
  { id: 'a1', from: 'v1', to: 'v2', weight: 3, label: [-4.25, 1.18] },
  { id: 'a2', from: 'v1', to: 'v3', weight: 2, label: [-4.25, -0.72] },
  { id: 'a3', from: 'v1', to: 'v4', weight: 4, label: [-2.72, 0.55] },
  { id: 'a4', from: 'v2', to: 'v4', weight: 2, label: [-2.2, 1.65] },
  { id: 'a5', from: 'v2', to: 'v5', weight: 3, label: [-2.55, 0.12] },
  { id: 'a6', from: 'v3', to: 'v5', weight: 3, label: [-2.2, -1.58] },
  { id: 'a7', from: 'v4', to: 'v6', weight: 2, label: [-0.12, 0.9] },
  { id: 'a8', from: 'v5', to: 'v6', weight: 1, label: [-0.15, -0.92] },
]

function text(value: string, x: number, y: number, color: string = C.ink, size = 18, weight = '700') {
  return new Text({ text: value, color, fontSize: size, fontFamily: 'Noto Sans SC, PingFang SC, sans-serif', fontWeight: weight }).moveTo([x, y, 0])
}

function node(value: Vertex, color: string) {
  const [x, y] = POS[value]
  return new VGroup(
    new Circle({ radius: 0.36, center: [x, y, 0], color, fillOpacity: color === C.green ? 0.09 : 0.04, strokeWidth: 2.6 }),
    text(value, x, y, color, 15, '800'),
  )
}

function edge(edgeDef: EdgeDef, color: string) {
  const [x1, y1] = POS[edgeDef.from]
  const [x2, y2] = POS[edgeDef.to]
  const dx = x2 - x1
  const dy = y2 - y1
  const length = Math.sqrt(dx * dx + dy * dy)
  const ux = dx / length
  const uy = dy / length
  return new Arrow({
    start: [x1 + ux * 0.43, y1 + uy * 0.43, 0], end: [x2 - ux * 0.45, y2 - uy * 0.45, 0],
    color, strokeWidth: color === C.line || color === C.faint ? 2 : 3.2, tipLength: 0.13,
  })
}

function drawDag(scene: Scene, options: { activeVertex?: Vertex; activeEdges?: string[]; completedVertices?: Vertex[]; removedVertices?: Vertex[]; criticalEdges?: string[]; showWeights?: boolean } = {}) {
  const activeEdges = new Set(options.activeEdges ?? [])
  const criticalEdges = new Set(options.criticalEdges ?? [])
  const removed = new Set(options.removedVertices ?? [])
  const completed = new Set(options.completedVertices ?? [])
  const edges: Record<string, Arrow> = {}
  EDGES.forEach(item => {
    const deleted = removed.has(item.from)
    const color = activeEdges.has(item.id) ? C.orange : criticalEdges.has(item.id) ? C.green : deleted ? C.faint : C.line
    edges[item.id] = edge(item, color)
    scene.add(edges[item.id])
    if (options.showWeights) scene.add(text(`${item.id} · ${item.weight}`, item.label[0], item.label[1], color === C.line ? C.muted : color, 12, '800'))
  })
  const nodes: Record<Vertex, VGroup> = {} as Record<Vertex, VGroup>
  VERTICES.forEach(vertex => {
    const color = vertex === options.activeVertex ? C.orange : completed.has(vertex) ? C.green : removed.has(vertex) ? C.muted : C.blue
    nodes[vertex] = node(vertex, color)
    scene.add(nodes[vertex])
  })
  return { nodes, edges }
}

type TopoState = {
  removed: Vertex[]; indegree: Record<Vertex, string>; candidates: Vertex[]; output: Vertex[];
  active?: Vertex; changes?: Partial<Record<Vertex, string>>; note: string
}
const TOPO_STATES: TopoState[] = [
  { removed: [], indegree: { v1: '0', v2: '1', v3: '1', v4: '2', v5: '2', v6: '2' }, candidates: ['v1'], output: [], note: '只有 v1 的入度为 0，它是第一个候选顶点' },
  { removed: ['v1'], indegree: { v1: '—', v2: '0', v3: '0', v4: '1', v5: '2', v6: '2' }, candidates: ['v2', 'v3'], output: ['v1'], active: 'v1', changes: { v2: '1 → 0', v3: '1 → 0', v4: '2 → 1' }, note: '输出 v1，逐条删除 v1 的出边；每删一条边，对应后继顶点的入度减 1' },
  { removed: ['v1', 'v2'], indegree: { v1: '—', v2: '—', v3: '0', v4: '0', v5: '1', v6: '2' }, candidates: ['v3', 'v4'], output: ['v1', 'v2'], active: 'v2', changes: { v4: '1 → 0', v5: '2 → 1' }, note: '输出 v2：删除 v2→v4 和 v2→v5，两个弧头的入度分别减 1' },
  { removed: ['v1', 'v2', 'v3'], indegree: { v1: '—', v2: '—', v3: '—', v4: '0', v5: '0', v6: '2' }, candidates: ['v4', 'v5'], output: ['v1', 'v2', 'v3'], active: 'v3', changes: { v5: '1 → 0' }, note: '输出 v3：删除 v3→v5，v5 的入度由 1 减为 0，因此进入候选集合' },
  { removed: ['v1', 'v2', 'v3', 'v4'], indegree: { v1: '—', v2: '—', v3: '—', v4: '—', v5: '0', v6: '1' }, candidates: ['v5'], output: ['v1', 'v2', 'v3', 'v4'], active: 'v4', changes: { v6: '2 → 1' }, note: '输出 v4：删除 v4→v6，v6 的入度减为 1，暂时还不能输出' },
  { removed: ['v1', 'v2', 'v3', 'v4', 'v5'], indegree: { v1: '—', v2: '—', v3: '—', v4: '—', v5: '—', v6: '0' }, candidates: ['v6'], output: ['v1', 'v2', 'v3', 'v4', 'v5'], active: 'v5', changes: { v6: '1 → 0' }, note: '输出 v5：删除 v5→v6，v6 的入度由 1 减为 0，现在可以输出' },
  { removed: [...VERTICES], indegree: { v1: '—', v2: '—', v3: '—', v4: '—', v5: '—', v6: '—' }, candidates: [], output: [...VERTICES], active: 'v6', note: '所有顶点均已输出，得到一个合法拓扑序列' },
]

function topoPanel(scene: Scene, state: TopoState) {
  const x0 = 2.25
  const colW = 0.58
  const cells: Partial<Record<Vertex, VGroup>> = {}
  VERTICES.forEach((vertex, index) => {
    const x = x0 + index * colW
    const changed = Boolean(state.changes?.[vertex])
    const indegreeCell = new VGroup(
      new Rectangle({ width: colW - 0.04, height: 0.62, center: [x, 0.62, 0], color: changed || state.indegree[vertex] === '0' ? C.orange : C.line, fillOpacity: changed || state.indegree[vertex] === '0' ? 0.06 : 0.015, strokeWidth: changed || state.indegree[vertex] === '0' ? 2.2 : 1.5 }),
      text(state.indegree[vertex], x, 0.62, changed || state.indegree[vertex] === '0' ? C.orange : C.muted, 13, '800'),
    )
    cells[vertex] = indegreeCell
    scene.add(
      new Rectangle({ width: colW - 0.04, height: 0.62, center: [x, 1.3, 0], color: C.line, fillOpacity: 0.015, strokeWidth: 1.5 }),
      text(vertex, x, 1.3, C.ink, 12, '800'),
      indegreeCell,
    )
  })
  scene.add(text('顶点', 1.55, 1.3, C.ink, 13, '800'), text('当前入度', 1.5, 0.62, C.blue, 13, '800'))
  const list = (values: Vertex[], y: number, title: string, color: string) => {
    scene.add(text(title, 1.55, y, color, 13, '800'))
    values.forEach((value, index) => scene.add(new VGroup(
      new Rectangle({ width: 0.58, height: 0.52, center: [2.3 + index * 0.65, y, 0], color, fillOpacity: 0.04, strokeWidth: 1.8 }),
      text(value, 2.3 + index * 0.65, y, color, 12, '800'),
    )))
  }
  list(state.candidates, -0.35, '零入度候选', C.orange)
  list(state.output, -1.25, '已输出序列', C.green)
  const changes = Object.entries(state.changes ?? {}).map(([vertex, value]) => `${vertex}：${value}`).join('　')
  scene.add(
    new Rectangle({ width: 4.2, height: 0.66, center: [3.55, -2.16, 0], color: changes ? C.orange : C.line, fillOpacity: changes ? 0.045 : 0.012, strokeWidth: changes ? 2 : 1.5 }),
    text(changes || '删除出边后：弧头顶点入度减 1', 3.55, -2.16, changes ? C.orange : C.muted, 12, '800'),
  )
  return cells
}

async function renderTopo(scene: Scene, state: TopoState, animate: boolean) {
  scene.add(text('输出零入度顶点；每删除一条出边，弧头入度减 1', 0, 3.18, C.ink, 22, '800'))
  const graph = drawDag(scene, { activeVertex: state.active, removedVertices: state.removed })
  const cells = topoPanel(scene, state)
  scene.add(text(state.note, 0, -3.18, C.muted, 15, '700'))
  if (animate && state.active) await scene.play(
    new FadeIn(graph.nodes[state.active], { duration: 0.42 }),
    ...Object.keys(state.changes ?? {}).map(vertex => new FadeIn(cells[vertex as Vertex]!, { duration: 0.42 })),
  )
}

type EventTimes = { earliest: Record<Vertex, string>; latest: Record<Vertex, string> }
const EMPTY_TIMES: EventTimes = { earliest: { v1: '—', v2: '—', v3: '—', v4: '—', v5: '—', v6: '—' }, latest: { v1: '—', v2: '—', v3: '—', v4: '—', v5: '—', v6: '—' } }
const EARLIEST: Record<Vertex, string> = { v1: '0', v2: '3', v3: '2', v4: '5', v5: '6', v6: '7' }
const LATEST: Record<Vertex, string> = { v1: '0', v2: '3', v3: '3', v4: '5', v5: '6', v6: '7' }

function timesAfter(kind: 'earliest' | 'latest', through: Vertex): EventTimes {
  const index = VERTICES.indexOf(through)
  if (kind === 'earliest') return {
    earliest: Object.fromEntries(VERTICES.map((vertex, i) => [vertex, i <= index ? EARLIEST[vertex] : '—'])) as Record<Vertex, string>,
    latest: { ...EMPTY_TIMES.latest },
  }
  const reverseOrder: Vertex[] = ['v6', 'v5', 'v4', 'v3', 'v2', 'v1']
  const computed = new Set(reverseOrder.slice(0, reverseOrder.indexOf(through) + 1))
  return { earliest: { ...EARLIEST }, latest: Object.fromEntries(VERTICES.map(vertex => [vertex, computed.has(vertex) ? LATEST[vertex] : '—'])) as Record<Vertex, string> }
}

async function renderEventTime(scene: Scene, kind: 'earliest' | 'latest', vertex: Vertex, edges: string[], formula: string, animate: boolean) {
  const times = timesAfter(kind, vertex)
  const title = kind === 'earliest' ? '正向计算事件最早发生时间：沿入边取最大值' : '反向计算事件最迟发生时间：沿出边取最小值'
  scene.add(text(title, 0, 3.18, C.ink, 21, '800'))
  const graph = drawDag(scene, { activeVertex: vertex, activeEdges: edges, completedVertices: kind === 'earliest' ? VERTICES.filter(v => times.earliest[v] !== '—') : VERTICES.filter(v => times.latest[v] !== '—'), showWeights: true })
  const cells = criticalPanel(scene, times, { changedEvent: { vertex, row: kind } })
  scene.add(text(formula, 0, -3.2, kind === 'earliest' ? C.blue : C.violet, 15, '800'))
  if (animate) await scene.play(new FadeIn(graph.nodes[vertex], { duration: 0.4 }), new FadeIn(cells[`event-${kind}-${vertex}`], { duration: 0.4 }))
}

type ActivityId = EdgeDef['id']
type ActivityState = {
  id: ActivityId
  computed: ActivityId[]
  formula: string
}

const ACTIVITY_EARLIEST: Record<ActivityId, number> = { a1: 0, a2: 0, a3: 0, a4: 3, a5: 3, a6: 2, a7: 5, a8: 6 }
const ACTIVITY_LATEST: Record<ActivityId, number> = { a1: 0, a2: 1, a3: 1, a4: 3, a5: 3, a6: 3, a7: 5, a8: 6 }
const ACTIVITY_IDS: ActivityId[] = EDGES.map(item => item.id)
const ACTIVITY_STATES: ActivityState[] = [
  { id: 'a1', computed: ['a1'], formula: 'a1：活动最早 = 0；活动最迟 = 3 - 3 = 0' },
  { id: 'a2', computed: ['a1', 'a2'], formula: 'a2：活动最早 = 0；活动最迟 = 3 - 2 = 1' },
  { id: 'a3', computed: ['a1', 'a2', 'a3'], formula: 'a3：活动最早 = 0；活动最迟 = 5 - 4 = 1' },
  { id: 'a4', computed: ['a1', 'a2', 'a3', 'a4'], formula: 'a4：活动最早 = 3；活动最迟 = 5 - 2 = 3' },
  { id: 'a5', computed: ['a1', 'a2', 'a3', 'a4', 'a5'], formula: 'a5：活动最早 = 3；活动最迟 = 6 - 3 = 3' },
  { id: 'a6', computed: ['a1', 'a2', 'a3', 'a4', 'a5', 'a6'], formula: 'a6：活动最早 = 2；活动最迟 = 6 - 3 = 3' },
  { id: 'a7', computed: ['a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7'], formula: 'a7：活动最早 = 5；活动最迟 = 7 - 2 = 5' },
  { id: 'a8', computed: [...ACTIVITY_IDS], formula: 'a8：活动最早 = 6；活动最迟 = 7 - 1 = 6' },
]

type CriticalPanelOptions = {
  changedEvent?: { vertex: Vertex; row: 'earliest' | 'latest' }
  activityComputed?: ActivityId[]
  activeActivity?: ActivityId
  slackComputed?: ActivityId[]
  activeSlack?: ActivityId
  showSlack?: boolean
}

function criticalPanel(scene: Scene, times: EventTimes, options: CriticalPanelOptions = {}) {
  const cells: Record<string, VGroup> = {}
  const addCell = (key: string, value: string, x: number, y: number, width: number, color: string, active: boolean) => {
    const cell = new VGroup(
      new Rectangle({ width, height: 0.48, center: [x, y, 0], color: active ? C.orange : C.line, fillOpacity: active ? 0.07 : 0.012, strokeWidth: active ? 2.1 : 1.25 }),
      text(value, x, y, value === '—' ? C.muted : active ? C.orange : color, 9, '800'),
    )
    cells[key] = cell
    scene.add(cell)
  }

  const eventRows = [
    { key: 'header', name: '顶点', y: 1.72, color: C.ink },
    { key: 'earliest', name: '事件最早', y: 1.17, color: C.blue },
    { key: 'latest', name: '事件最迟', y: 0.62, color: C.violet },
  ] as const
  eventRows.forEach(row => scene.add(text(row.name, 1.22, row.y, row.color, 10, '800')))
  VERTICES.forEach((vertex, index) => {
    const x = 2.02 + index * 0.58
    const values = [vertex, times.earliest[vertex], times.latest[vertex]]
    eventRows.forEach((row, rowIndex) => addCell(
      `event-${row.key}-${vertex}`,
      values[rowIndex], x, row.y, 0.54, row.color,
      options.changedEvent?.vertex === vertex && options.changedEvent.row === row.key,
    ))
  })

  const activityRows = [
    { key: 'header', name: '活动', y: 0.02, color: C.ink },
    { key: 'earliest', name: '活动最早', y: -0.53, color: C.blue },
    { key: 'latest', name: '活动最迟', y: -1.08, color: C.violet },
  ] as const
  activityRows.forEach(row => scene.add(text(row.name, 1.22, row.y, row.color, 10, '800')))
  ACTIVITY_IDS.forEach((id, index) => {
    const x = 2.02 + index * 0.48
    const computed = options.activityComputed?.includes(id) ?? false
    const values = [id, computed ? `${ACTIVITY_EARLIEST[id]}` : '—', computed ? `${ACTIVITY_LATEST[id]}` : '—']
    activityRows.forEach((row, rowIndex) => addCell(
      `activity-${row.key}-${id}`,
      values[rowIndex], x, row.y, 0.455, row.color,
      options.activeActivity === id && rowIndex > 0,
    ))
  })

  if (options.showSlack) {
    scene.add(text('时间余量', 1.22, -1.72, C.green, 10, '800'))
    ACTIVITY_IDS.forEach((id, index) => {
      const x = 2.02 + index * 0.48
      const computed = options.slackComputed?.includes(id) ?? false
      addCell(`slack-${id}`, computed ? `${ACTIVITY_LATEST[id] - ACTIVITY_EARLIEST[id]}` : '—', x, -1.72, 0.455, C.green, options.activeSlack === id)
    })
  }
  return cells
}

async function renderActivity(scene: Scene, state: ActivityState, animate: boolean) {
  scene.add(text('事件时间保留在上方；继续计算活动最早和活动最迟', 0, 3.18, C.ink, 20, '800'))
  const graph = drawDag(scene, { activeEdges: [state.id], showWeights: true })
  const cells = criticalPanel(scene, { earliest: { ...EARLIEST }, latest: { ...LATEST } }, { activityComputed: state.computed, activeActivity: state.id })
  scene.add(text(state.formula, 0, -3.2, C.muted, 14, '800'))
  if (animate) await scene.play(
    new FadeIn(graph.edges[state.id], { duration: 0.4 }),
    new FadeIn(cells[`activity-earliest-${state.id}`], { duration: 0.4 }),
    new FadeIn(cells[`activity-latest-${state.id}`], { duration: 0.4 }),
  )
}

type SlackState = { id: ActivityId; computed: ActivityId[]; formula: string }
const SLACK_STATES: SlackState[] = ACTIVITY_IDS.map((id, index) => ({
  id,
  computed: ACTIVITY_IDS.slice(0, index + 1),
  formula: `${id}：时间余量 = ${ACTIVITY_LATEST[id]} - ${ACTIVITY_EARLIEST[id]} = ${ACTIVITY_LATEST[id] - ACTIVITY_EARLIEST[id]}`,
}))

async function renderSlack(scene: Scene, state: SlackState, animate: boolean) {
  scene.add(text('四组时间均已确定；计算各活动的时间余量', 0, 3.18, C.ink, 20, '800'))
  const critical = state.computed.filter(id => ACTIVITY_EARLIEST[id] === ACTIVITY_LATEST[id])
  const graph = drawDag(scene, { activeEdges: [state.id], criticalEdges: critical, showWeights: true })
  const cells = criticalPanel(scene, { earliest: { ...EARLIEST }, latest: { ...LATEST } }, {
    activityComputed: [...ACTIVITY_IDS], slackComputed: state.computed, activeSlack: state.id, showSlack: true,
  })
  scene.add(text(state.formula, 0, -3.2, ACTIVITY_EARLIEST[state.id] === ACTIVITY_LATEST[state.id] ? C.green : C.muted, 14, '800'))
  if (animate) await scene.play(new FadeIn(graph.edges[state.id], { duration: 0.4 }), new FadeIn(cells[`slack-${state.id}`], { duration: 0.4 }))
}

async function renderCriticalFinal(scene: Scene, animate: boolean) {
  const critical = ['a1', 'a4', 'a5', 'a7', 'a8']
  scene.add(text('余量为 0 的活动组成关键路径', 0, 3.18, C.ink, 22, '800'))
  const graph = drawDag(scene, { criticalEdges: critical, showWeights: true })
  criticalPanel(scene, { earliest: { ...EARLIEST }, latest: { ...LATEST } }, { activityComputed: [...ACTIVITY_IDS], slackComputed: [...ACTIVITY_IDS], showSlack: true })
  scene.add(text('关键路径：v1→v2→v4→v6；v1→v2→v5→v6　工期 = 7', 0, -3.2, C.green, 14, '800'))
  if (animate) await scene.play(...critical.map(id => new FadeIn(graph.edges[id], { duration: 0.35 })))
}

const topologicalSteps = TOPO_STATES.slice(1).map((state, index) => ({ id: `topo-output-${index + 1}`, render: (scene: Scene, animate: boolean) => renderTopo(scene, state, animate) }))
const criticalSteps = [
  { id: 'cp-earliest-v1', render: (s: Scene, a: boolean) => renderEventTime(s, 'earliest', 'v1', [], '源点事件最早发生时间 = 0', a) },
  { id: 'cp-earliest-v2', render: (s: Scene, a: boolean) => renderEventTime(s, 'earliest', 'v2', ['a1'], '事件最早(v2) = 0 + 3 = 3', a) },
  { id: 'cp-earliest-v3', render: (s: Scene, a: boolean) => renderEventTime(s, 'earliest', 'v3', ['a2'], '事件最早(v3) = 0 + 2 = 2', a) },
  { id: 'cp-earliest-v4', render: (s: Scene, a: boolean) => renderEventTime(s, 'earliest', 'v4', ['a3', 'a4'], '事件最早(v4) = max(0+4, 3+2) = 5', a) },
  { id: 'cp-earliest-v5', render: (s: Scene, a: boolean) => renderEventTime(s, 'earliest', 'v5', ['a5', 'a6'], '事件最早(v5) = max(3+3, 2+3) = 6', a) },
  { id: 'cp-earliest-v6', render: (s: Scene, a: boolean) => renderEventTime(s, 'earliest', 'v6', ['a7', 'a8'], '事件最早(v6) = max(5+2, 6+1) = 7；工期 = 7', a) },
  { id: 'cp-latest-v6', render: (s: Scene, a: boolean) => renderEventTime(s, 'latest', 'v6', [], '汇点事件最迟发生时间 = 事件最早发生时间 = 7', a) },
  { id: 'cp-latest-v5', render: (s: Scene, a: boolean) => renderEventTime(s, 'latest', 'v5', ['a8'], '事件最迟(v5) = 7 - 1 = 6', a) },
  { id: 'cp-latest-v4', render: (s: Scene, a: boolean) => renderEventTime(s, 'latest', 'v4', ['a7'], '事件最迟(v4) = 7 - 2 = 5', a) },
  { id: 'cp-latest-v3', render: (s: Scene, a: boolean) => renderEventTime(s, 'latest', 'v3', ['a6'], '事件最迟(v3) = 6 - 3 = 3', a) },
  { id: 'cp-latest-v2', render: (s: Scene, a: boolean) => renderEventTime(s, 'latest', 'v2', ['a4', 'a5'], '事件最迟(v2) = min(5-2, 6-3) = 3', a) },
  { id: 'cp-latest-v1', render: (s: Scene, a: boolean) => renderEventTime(s, 'latest', 'v1', ['a1', 'a2', 'a3'], '事件最迟(v1) = min(3-3, 3-2, 5-4) = 0', a) },
  ...ACTIVITY_STATES.map(state => ({ id: `cp-activity-${state.id}`, render: (s: Scene, a: boolean) => renderActivity(s, state, a) })),
  ...SLACK_STATES.map(state => ({ id: `cp-slack-${state.id}`, render: (s: Scene, a: boolean) => renderSlack(s, state, a) })),
  { id: 'cp-finish', render: renderCriticalFinal },
]

export const topologicalSortAnimation: ManimWebAnimation = {
  id: 'topological-sort', ariaLabel: '拓扑排序逐步输出零入度顶点、删除出边、更新入度与候选集合的动画',
  initialState: { id: 'topo-overview', render: scene => { renderTopo(scene, TOPO_STATES[0], false); scene.render() } },
  scene: { width: 1100, height: 720, frameWidth: 12, frameHeight: 8.2, backgroundColor: '#ffffff' },
  steps: topologicalSteps.map(step => ({ id: step.id, render: async (scene, animate) => { await step.render(scene, animate); scene.render() } })),
}

export const criticalPathAnimation: ManimWebAnimation = {
  id: 'critical-path', ariaLabel: 'AOE网正向计算事件最早发生时间、反向计算事件最迟发生时间并找出关键活动与关键路径的动画',
  initialState: {
    id: 'critical-overview',
    render: scene => {
      scene.add(text('边表示活动，权值表示耗时；时间余量为 0 的活动不能延误', 0, 3.18, C.ink, 21, '800'))
      drawDag(scene, { showWeights: true })
      criticalPanel(scene, EMPTY_TIMES)
      scene.add(text('先正向计算事件最早发生时间，再反向计算事件最迟发生时间', 0, -3.2, C.muted, 15, '700'))
      scene.render()
    },
  },
  scene: { width: 1100, height: 720, frameWidth: 12, frameHeight: 8.2, backgroundColor: '#ffffff' },
  steps: criticalSteps.map(step => ({ id: step.id, render: async (scene, animate) => { await step.render(scene, animate); scene.render() } })),
}
