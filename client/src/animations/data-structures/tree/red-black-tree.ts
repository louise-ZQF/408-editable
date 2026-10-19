import { Arrow, Circle, FadeIn, FadeOut, Rectangle, Shift, Text, Transform, smooth, type Scene } from '@/animations/manim'
import type { ManimWebAnimation } from '../../types'

const C = {
  ink: '#0f172a', muted: '#64748b', line: '#94a3b8', red: '#dc2626',
  black: '#111827', orange: '#c2410c', green: '#047857',
} as const

type Point = readonly [number, number]
type Color = 'R' | 'B'
type TreeState = {
  layout: Record<string, Point>
  colors: Record<string, Color>
  edges: Array<readonly [string, string]>
}
type NodeParts = { circle: Circle; label: Text; ring?: Circle }

function text(value: string, x: number, y: number, color: string = C.ink, size = 18, weight = '700') {
  return new Text({
    text: value, color, fontSize: size,
    fontFamily: 'Noto Sans SC, PingFang SC, sans-serif', fontWeight: weight,
  }).moveTo([x, y, 0])
}

function heading(scene: Scene, title: string, note: string, color: string = C.muted) {
  scene.add(text(title, 0, 3.42, C.ink, 23, '800'), text(note, 0, -3.52, color, 15, '700'))
}

function nodeCircle(at: Point, color: Color) {
  const fill = color === 'R' ? C.red : C.black
  return new Circle({ radius: 0.37, center: [at[0], at[1], 0], color: fill, fillOpacity: 0.96, strokeWidth: 2.2 })
}

function recolorFrame(at: Point) {
  return new Rectangle({
    width: 1.02,
    height: 1.02,
    center: [at[0], at[1], 0],
    color: C.orange,
    fillOpacity: 0.06,
    strokeWidth: 4.2,
  })
}

function rbNode(value: string, at: Point, color: Color, active = false): NodeParts {
  return {
    circle: nodeCircle(at, color),
    label: text(value, at[0], at[1], '#ffffff', 15, '800'),
    ring: active
      ? new Circle({ radius: 0.47, center: [at[0], at[1], 0], color: C.orange, fillOpacity: 0, strokeWidth: 3 })
      : undefined,
  }
}

function addNode(scene: Scene, node: NodeParts) {
  scene.add(node.circle, node.label)
  if (node.ring) scene.add(node.ring)
}

function nodeAnimations(node: NodeParts, direction: [number, number, number], duration = 1.05) {
  const animations = [
    new Shift(node.circle, { direction, duration, rateFunc: smooth }),
    new Shift(node.label, { direction, duration, rateFunc: smooth }),
  ]
  if (node.ring) animations.push(new Shift(node.ring, { direction, duration, rateFunc: smooth }))
  return animations
}

function treeEdge(state: TreeState, [parent, child]: readonly [string, string]) {
  const [px, py] = state.layout[parent]
  const [cx, cy] = state.layout[child]
  const dx = cx - px
  const dy = cy - py
  const length = Math.sqrt(dx * dx + dy * dy)
  const ux = dx / length
  const uy = dy / length
  return new Arrow({
    start: [px + ux * 0.43, py + uy * 0.43, 0], end: [cx - ux * 0.43, cy - uy * 0.43, 0],
    color: C.line, strokeWidth: 2.1, tipLength: 0.1,
  })
}

function drawTree(scene: Scene, state: TreeState, activeNodes: string[] = []) {
  const edges = state.edges.map(pair => treeEdge(state, pair))
  scene.add(...edges)
  const nodes: Record<string, NodeParts> = {}
  Object.entries(state.layout).forEach(([value, at]) => {
    nodes[value] = rbNode(value, at, state.colors[value], activeNodes.includes(value))
    addNode(scene, nodes[value])
  })
  return { nodes, edges }
}

async function showState(
  scene: Scene,
  state: TreeState,
  title: string,
  note: string,
  animate: boolean,
  activeNodes: string[],
) {
  heading(scene, title, note, C.orange)
  const tree = drawTree(scene, state, activeNodes)
  if (animate) {
    await scene.play(...activeNodes.map(value => new FadeIn(tree.nodes[value].ring!, { duration: 0.45 })))
  }
}

async function showUncleCheck(
  scene: Scene,
  state: TreeState,
  uncle: string,
  note: string,
  animate: boolean,
) {
  heading(scene, '先看叔叔的“脸色”', note, C.orange)
  const frame = recolorFrame(state.layout[uncle])
  scene.add(frame)
  drawTree(scene, state)
  if (animate) await scene.play(new FadeIn(frame, { duration: 0.5 }))
}

async function recolorState(
  scene: Scene,
  from: TreeState,
  to: TreeState,
  title: string,
  note: string,
  animate: boolean,
  changed: string[],
) {
  heading(scene, title, note, C.orange)
  const frames = changed.map(value => recolorFrame(from.layout[value]))
  scene.add(...frames)
  const tree = drawTree(scene, from)
  if (animate) {
    await scene.play(...frames.map(frame => new FadeIn(frame, { duration: 0.42 })))
    await scene.play(...changed.map(value => new Transform(
      tree.nodes[value].circle,
      nodeCircle(to.layout[value], to.colors[value]),
      { duration: 0.78, rateFunc: smooth },
    )))
  } else {
    changed.forEach(value => tree.nodes[value].circle.become(nodeCircle(to.layout[value], to.colors[value])))
  }
}

async function transitionCard(scene: Scene, title: string, note: string, animate: boolean) {
  const titleText = text(title, 0, 0.38, C.ink, 34, '800')
  const noteText = text(note, 0, -0.42, C.muted, 18, '700')
  scene.add(titleText, noteText)
  if (animate) {
    await scene.play(
      new FadeIn(titleText, { duration: 0.55 }),
      new FadeIn(noteText, { duration: 0.55 }),
    )
  }
}

async function rotateState(
  scene: Scene,
  from: TreeState,
  to: TreeState,
  title: string,
  note: string,
  animate: boolean,
  activeNodes: string[],
) {
  heading(scene, title, note, C.green)
  const tree = drawTree(scene, from, activeNodes)
  if (animate) {
    await scene.play(...tree.edges.map(edge => new FadeOut(edge, { duration: 0.26 })))
    await scene.play(...Object.keys(from.layout).flatMap(value => {
      const direction: [number, number, number] = [
        to.layout[value][0] - from.layout[value][0],
        to.layout[value][1] - from.layout[value][1],
        0,
      ]
      return nodeAnimations(tree.nodes[value], direction)
    }))
  } else {
    tree.edges.forEach(edge => { edge.opacity = 0 })
    Object.keys(from.layout).forEach(value => {
      const direction: [number, number, number] = [
        to.layout[value][0] - from.layout[value][0],
        to.layout[value][1] - from.layout[value][1],
        0,
      ]
      tree.nodes[value].circle.shift(direction)
      tree.nodes[value].label.shift(direction)
      tree.nodes[value].ring?.shift(direction)
    })
  }
  const newEdges = to.edges.map(pair => treeEdge(to, pair))
  scene.add(...newEdges)
  if (animate) await scene.play(...newEdges.map(edge => new FadeIn(edge, { duration: 0.38 })))
}

// 同一次插入的连续过程：先在下层遇到红叔叔，再把冲突推到上层的 LL 情况。
// 上层叔叔结点 70 为黑色；冲突之外各条路径黑高相同。
const RED_UNCLE_CONFLICT: TreeState = {
  layout: {
    '50': [0, 2.12],
    '30': [-2.55, 1.02], '70': [2.55, 1.02],
    '20': [-3.75, -0.12], '40': [-1.35, -0.12],
    '60': [1.75, -0.12], '80': [3.35, -0.12],
    '10': [-4.48, -1.48], '25': [-3.02, -1.48],
    '5': [-5.05, -2.58],
  },
  colors: {
    '50': 'B', '30': 'R', '70': 'B', '20': 'B', '40': 'B',
    '60': 'R', '80': 'R', '10': 'R', '25': 'R', '5': 'R',
  },
  edges: [
    ['50', '30'], ['50', '70'], ['30', '20'], ['30', '40'],
    ['70', '60'], ['70', '80'], ['20', '10'], ['20', '25'], ['10', '5'],
  ],
}
const RED_UNCLE_RECOLORED: TreeState = {
  ...RED_UNCLE_CONFLICT,
  colors: { ...RED_UNCLE_CONFLICT.colors, '10': 'B', '25': 'B', '20': 'R' },
}
const LL_RECOLORED: TreeState = {
  ...RED_UNCLE_RECOLORED,
  colors: { ...RED_UNCLE_RECOLORED.colors, '30': 'B', '50': 'R' },
}
const LL_RESULT: TreeState = {
  layout: {
    '30': [0, 2.12],
    '20': [-2.55, 1.02], '50': [2.55, 1.02],
    '10': [-3.35, -0.12], '25': [-1.75, -0.12],
    '40': [1.35, -0.12], '70': [3.75, -0.12],
    '5': [-4.05, -1.48], '60': [3.02, -1.48], '80': [4.48, -1.48],
  },
  colors: { ...LL_RECOLORED.colors },
  edges: [
    ['30', '20'], ['30', '50'], ['20', '10'], ['20', '25'],
    ['10', '5'], ['50', '40'], ['50', '70'], ['70', '60'], ['70', '80'],
  ],
}

// 情况三：LR。40 是被下层变色上推的红结点，叔叔结点 70 为黑色。
const LR_CONFLICT: TreeState = {
  layout: {
    '50': [0, 2.12],
    '30': [-2.55, 1.02], '70': [2.55, 1.02],
    '20': [-3.75, -0.12], '40': [-1.35, -0.12],
    '60': [1.75, -0.12], '80': [3.35, -0.12],
    '35': [-2.08, -1.48], '45': [-0.62, -1.48],
  },
  colors: {
    '50': 'B', '30': 'R', '70': 'B', '20': 'B', '40': 'R',
    '60': 'R', '80': 'R', '35': 'B', '45': 'B',
  },
  edges: [
    ['50', '30'], ['50', '70'], ['30', '20'], ['30', '40'],
    ['70', '60'], ['70', '80'], ['40', '35'], ['40', '45'],
  ],
}
const LR_MIDDLE: TreeState = {
  layout: {
    '50': [0, 2.12],
    '40': [-2.55, 1.02], '70': [2.55, 1.02],
    '30': [-3.75, -0.12], '45': [-1.35, -0.12],
    '60': [1.75, -0.12], '80': [3.35, -0.12],
    '20': [-4.48, -1.48], '35': [-3.02, -1.48],
  },
  colors: { ...LR_CONFLICT.colors },
  edges: [
    ['50', '40'], ['50', '70'], ['40', '30'], ['40', '45'],
    ['70', '60'], ['70', '80'], ['30', '20'], ['30', '35'],
  ],
}
const LR_RECOLORED: TreeState = { ...LR_MIDDLE, colors: { ...LR_MIDDLE.colors, '40': 'B', '50': 'R' } }
const LR_RESULT: TreeState = {
  layout: {
    '40': [0, 2.12],
    '30': [-2.55, 1.02], '50': [2.55, 1.02],
    '20': [-3.35, -0.12], '35': [-1.75, -0.12],
    '45': [1.35, -0.12], '70': [3.75, -0.12],
    '60': [3.02, -1.48], '80': [4.48, -1.48],
  },
  colors: { ...LR_RECOLORED.colors },
  edges: [
    ['40', '30'], ['40', '50'], ['30', '20'], ['30', '35'],
    ['50', '45'], ['50', '70'], ['70', '60'], ['70', '80'],
  ],
}

const steps = [
  { id: 'rb-red-uncle-conflict', render: (s: Scene, a: boolean) => showState(s, RED_UNCLE_CONFLICT, '插入 5：下层先遇到红叔叔', '5 与红父结点 10 冲突；叔叔结点 25 也是红色', a, ['5', '10', '25']) },
  { id: 'rb-red-uncle-check', render: (s: Scene, a: boolean) => showUncleCheck(s, RED_UNCLE_CONFLICT, '25', '右侧叔叔结点 25 为红色：父、叔变黑，祖父变红', a) },
  { id: 'rb-red-uncle-recolor', render: (s: Scene, a: boolean) => recolorState(s, RED_UNCLE_CONFLICT, RED_UNCLE_RECOLORED, '下层变色：父结点 10、叔叔结点 25 染黑，祖父结点 20 染红', '父、叔、祖父完成染色后，下层冲突消失；红色 20 又与上层红父结点 30 冲突', a, ['10', '25', '20']) },

  { id: 'rb-ll-conflict', render: (s: Scene, a: boolean) => showState(s, RED_UNCLE_RECOLORED, '冲突向上继续：现在进入 LL', '20 与 30 连续为红，上层叔叔结点 70 为黑色', a, ['20', '30', '70']) },
  { id: 'rb-ll-uncle-check', render: (s: Scene, a: boolean) => showUncleCheck(s, RED_UNCLE_RECOLORED, '70', '右侧叔叔结点 70 为黑色：按 LL 型变色并右旋', a) },
  { id: 'rb-ll-recolor', render: (s: Scene, a: boolean) => recolorState(s, RED_UNCLE_RECOLORED, LL_RECOLORED, 'LL 变色：叔叔结点 70 保持黑色，父结点 30 染黑，祖父结点 50 染红', '三个结点的颜色确定后，树形暂时不动', a, ['30', '50']) },
  { id: 'rb-ll-rotate', render: (s: Scene, a: boolean) => rotateState(s, LL_RECOLORED, LL_RESULT, 'LL：再对祖父结点 50 右旋', '30 上升，50 下沉；圆和数字同步移动', a, ['30', '50', '70']) },

  { id: 'rb-lr-intro', render: (s: Scene, a: boolean) => transitionCard(s, 'LR 调整', '叔叔结点为黑色，插入方向为左—右：先左旋父结点，再右旋祖父结点', a) },
  { id: 'rb-lr-conflict', render: (s: Scene, a: boolean) => showState(s, LR_CONFLICT, 'LR：叔叔结点 70 为黑色，冲突位于左—右方向', '40 是下层变色后上推的红结点，与红父结点 30 冲突', a, ['40', '30', '70']) },
  { id: 'rb-lr-first-rotate', render: (s: Scene, a: boolean) => rotateState(s, LR_CONFLICT, LR_MIDDLE, 'LR：先对父结点 30 左旋', '40 上升，把左—右折线转成左—左；颜色保持不变', a, ['30', '40']) },
  { id: 'rb-lr-recolor', render: (s: Scene, a: boolean) => recolorState(s, LR_MIDDLE, LR_RECOLORED, 'LR 变色：叔叔结点 70 保持黑色，父结点 40 染黑，祖父结点 50 染红', '三个结点的颜色确定后，再进行第二次旋转', a, ['40', '50']) },
  { id: 'rb-lr-second-rotate', render: (s: Scene, a: boolean) => rotateState(s, LR_RECOLORED, LR_RESULT, 'LR：再对祖父结点 50 右旋', '40 上升为子树根，完整 LR 调整结束', a, ['40', '50', '70']) },
]

export const redBlackInsertionAnimation: ManimWebAnimation = {
  id: 'red-black-insertion',
  ariaLabel: '红黑树同一次插入连续经历红叔叔与LL调整，并补充LR调整的分步动画',
  initialState: {
    id: 'rb-overview',
    render: scene => {
      heading(scene, '同一次插入连续触发两层调整', '插入 5 后，先处理下层红叔叔，再处理上层 LL 冲突')
      drawTree(scene, RED_UNCLE_CONFLICT)
      scene.render()
    },
  },
  scene: { width: 1180, height: 800, frameWidth: 12.6, frameHeight: 8.5, backgroundColor: '#ffffff' },
  steps: steps.map(step => ({
    id: step.id,
    render: async (scene, animate) => { await step.render(scene, animate); scene.render() },
  })),
}
