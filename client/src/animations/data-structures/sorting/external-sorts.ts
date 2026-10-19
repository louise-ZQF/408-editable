import {
  FadeIn,
  FadeOut,
  Indicate,
  Line,
  Rectangle,
  Shift,
  Text,
  Transform,
  smooth,
  type Scene,
} from '@/animations/manim'
import type { ManimWebAnimation } from '../../types'

const C = {
  ink: '#0f172a', muted: '#64748b', line: '#94a3b8', blue: '#1d4ed8',
  orange: '#c2410c', green: '#047857', violet: '#6d28d9', red: '#be123c',
  paleBlue: '#eff6ff', paleViolet: '#f5f3ff', paleGreen: '#ecfdf5',
} as const

function text(value: string, x: number, y: number, color: string = C.ink, size = 18, weight: string | number = '700') {
  return new Text({
    text: value, color, fontSize: size,
    fontFamily: 'Noto Sans SC, PingFang SC, sans-serif', fontWeight: weight,
  }).moveTo([x, y, 0])
}

function mono(value: string, x: number, y: number, color: string = C.ink, size = 19) {
  return new Text({
    text: value, color, fontSize: size,
    fontFamily: 'JetBrains Mono, Menlo, monospace', fontWeight: '800',
  }).moveTo([x, y, 0])
}

function heading(scene: Scene, title: string, note: string) {
  scene.add(text(title, 0, 4.02, C.ink, 25, '800'), text(note, 0, -4.08, C.muted, 16, '600'))
}

function highlight(x: number, y: number, color: string, width = 1.05, height = 0.72) {
  return new Rectangle({ width, height, center: [x, y, 0], color, fillOpacity: 0.04, strokeWidth: 3 })
}

// ---------------------------------------------------------------------------
// 败者树：四个待归并段构成第三层；数字始终从段首向上参加比较。

type Entry = { run: number; value: number }
type LoserState = {
  headIndexes: number[]
  left: Entry | null
  right: Entry | null
  root: Entry | null
  winner: Entry | null
  leftWinner: Entry | null
  rightWinner: Entry | null
  output: number[]
}

const RUNS = [
  [10, 18, 26, 34],
  [9, 17, 30, 41],
  [20, 25, 33, 48],
  [12, 16, 28, 45],
]
const RUN_X = [-4.8, -1.6, 1.6, 4.8]
const RUN_Y = -2.25
const RUN_VALUE_GAP = 0.51
const TREE_POS = {
  left: [-3.2, -0.02] as const,
  right: [3.2, -0.02] as const,
  root: [0, 1.32] as const,
  winner: [0, 2.58] as const,
}

function entryText(entry: Entry | null) {
  return entry ? `R${entry.run} · ${entry.value}` : '—'
}

function runValueX(run: number) {
  return RUN_X[run]
}

function runValueY(valueIndex: number) {
  return -1.48 - valueIndex * RUN_VALUE_GAP
}

function treeLine(scene: Scene, start: readonly [number, number], end: readonly [number, number]) {
  scene.add(new Line({ start: [start[0], start[1], 0], end: [end[0], end[1], 0], color: C.line, strokeWidth: 2.2 }))
}

function loserNode(scene: Scene, x: number, y: number, entry: Entry | null) {
  const box = new Rectangle({
    width: 1.72, height: 0.72, center: [x, y, 0],
    color: C.orange, fillOpacity: 0, strokeWidth: 2.2,
  })
  box.setFill('#fff7ed', 0.55)
  const role = text('败者', x, y + 0.18, C.orange, 11, '800')
  const label = mono(entryText(entry), x, y - 0.12, entry ? C.ink : C.muted, 14)
  scene.add(box, role, label)
  return { box, label }
}

function drawRun(scene: Scene, run: number, headIndex: number) {
  const box = new Rectangle({
    width: 1.42, height: 2.72, center: [RUN_X[run], RUN_Y, 0],
    color: C.blue, fillOpacity: 0, strokeWidth: 2,
  })
  box.setFill(C.paleBlue, 0.48)
  const title = text(`R${run}`, RUN_X[run], -1.12, C.blue, 14, '800')
  const labels = RUNS[run].map((value, index) => mono(
    String(value),
    runValueX(run),
    runValueY(index),
    index < headIndex ? C.line : index === headIndex ? C.ink : C.muted,
    15,
  ))
  const headFrame = highlight(runValueX(run), runValueY(headIndex), C.green, 0.58, 0.42)
  scene.add(box, title, ...labels, headFrame)
  return { labels, headFrame }
}

function drawLoserTree(scene: Scene, state: LoserState) {
  treeLine(scene, [RUN_X[0], RUN_Y + 1.36], [TREE_POS.left[0] - 0.42, TREE_POS.left[1] - 0.36])
  treeLine(scene, [RUN_X[1], RUN_Y + 1.36], [TREE_POS.left[0] + 0.42, TREE_POS.left[1] - 0.36])
  treeLine(scene, [RUN_X[2], RUN_Y + 1.36], [TREE_POS.right[0] - 0.42, TREE_POS.right[1] - 0.36])
  treeLine(scene, [RUN_X[3], RUN_Y + 1.36], [TREE_POS.right[0] + 0.42, TREE_POS.right[1] - 0.36])
  treeLine(scene, [TREE_POS.left[0], TREE_POS.left[1] + 0.36], [TREE_POS.root[0] - 0.42, TREE_POS.root[1] - 0.36])
  treeLine(scene, [TREE_POS.right[0], TREE_POS.right[1] + 0.36], [TREE_POS.root[0] + 0.42, TREE_POS.root[1] - 0.36])
  treeLine(scene, [TREE_POS.root[0], TREE_POS.root[1] + 0.36], [TREE_POS.winner[0], TREE_POS.winner[1] - 0.34])

  const runs = RUNS.map((_, run) => drawRun(scene, run, state.headIndexes[run]))
  const left = loserNode(scene, ...TREE_POS.left, state.left)
  const right = loserNode(scene, ...TREE_POS.right, state.right)
  const root = loserNode(scene, ...TREE_POS.root, state.root)

  const pendingLeft = state.leftWinner ? text(`${entryText(state.leftWinner)} ↑`, -1.58, 0.64, C.green, 14, '800') : null
  const pendingRight = state.rightWinner ? text(`${entryText(state.rightWinner)} ↑`, 1.58, 0.64, C.green, 14, '800') : null
  if (pendingLeft) scene.add(pendingLeft)
  if (pendingRight) scene.add(pendingRight)

  const winnerBox = new Rectangle({
    width: 2.55, height: 0.68, center: [TREE_POS.winner[0], TREE_POS.winner[1], 0],
    color: C.green, fillOpacity: 0, strokeWidth: 2.4,
  })
  winnerBox.setFill(C.paleGreen, 0.62)
  const winnerLabel = text(
    state.winner ? `总胜者  ${entryText(state.winner)}` : '总胜者',
    TREE_POS.winner[0], TREE_POS.winner[1], state.winner ? C.green : C.muted, 16, '800',
  )
  scene.add(winnerBox, winnerLabel)

  scene.add(text('当前归并段', -5.78, 3.18, C.green, 14, '800'))
  state.output.forEach((value, index) => scene.add(mono(String(value), -4.55 + index * 0.72, 3.18, C.green, 18)))
  scene.add(text('4 个竖列分别是 R0、R1、R2、R3 待归并段', 0, -3.78, C.blue, 13, '700'))
  return { runs, left, right, root, winnerLabel, pendingLeft, pendingRight }
}

const emptyLoserState: LoserState = {
  headIndexes: [0, 0, 0, 0], left: null, right: null, root: null,
  winner: null, leftWinner: null, rightWinner: null, output: [],
}
const leftLoserState: LoserState = {
  ...emptyLoserState,
  left: { run: 0, value: 10 }, leftWinner: { run: 1, value: 9 },
}
const rightLoserState: LoserState = {
  ...leftLoserState,
  right: { run: 2, value: 20 }, rightWinner: { run: 3, value: 12 },
}
const builtLoserState: LoserState = {
  ...rightLoserState,
  root: { run: 3, value: 12 }, winner: { run: 1, value: 9 },
  leftWinner: null, rightWinner: null,
}
const refilledLoserState: LoserState = {
  ...builtLoserState,
  headIndexes: [0, 1, 0, 0], winner: null, output: [9],
}
const replayedLeftState: LoserState = {
  ...refilledLoserState,
  left: { run: 1, value: 17 }, leftWinner: { run: 0, value: 10 },
}

const after9State: LoserState = {
  ...replayedLeftState,
  root: { run: 3, value: 12 }, winner: { run: 0, value: 10 }, leftWinner: null,
}
const after10State: LoserState = {
  ...after9State,
  headIndexes: [1, 1, 0, 0],
  left: { run: 0, value: 18 }, root: { run: 1, value: 17 }, winner: { run: 3, value: 12 },
  output: [9, 10],
}
const after12State: LoserState = {
  ...after10State,
  headIndexes: [1, 1, 0, 1],
  right: { run: 2, value: 20 }, root: { run: 1, value: 17 }, winner: { run: 3, value: 16 },
  output: [9, 10, 12],
}
const after16State: LoserState = {
  ...after12State,
  headIndexes: [1, 1, 0, 2],
  right: { run: 3, value: 28 }, root: { run: 2, value: 20 }, winner: { run: 1, value: 17 },
  output: [9, 10, 12, 16],
}
const after17State: LoserState = {
  ...after16State,
  headIndexes: [1, 2, 0, 2],
  left: { run: 1, value: 30 }, root: { run: 2, value: 20 }, winner: { run: 0, value: 18 },
  output: [9, 10, 12, 16, 17],
}

type LoserAction = 'left' | 'right' | 'root' | 'refill' | 'replay-left' | 'replay-root' | 'next-10' | 'next-12' | 'next-16' | 'next-17'

function tokenFromRun(run: number, headIndex: number, color: string) {
  return mono(String(RUNS[run][headIndex]), runValueX(run), runValueY(headIndex), color, 17)
}

async function renderLoserStep(scene: Scene, action: LoserAction) {
  const configs: Record<LoserAction, { before: LoserState; title: string; note: string }> = {
    left: { before: emptyLoserState, title: '第 1 层：从 R0、R1 的段首取数比较', note: '10 输，左侧结点保存 R0·10；较小的 R1·9 继续向上' },
    right: { before: leftLoserState, title: '第 1 层：从 R2、R3 的段首取数比较', note: '20 输，右侧结点保存 R2·20；较小的 R3·12 继续向上' },
    root: { before: rightLoserState, title: '第 2 层：两个胜者继续比较', note: '12 输，根结点保存 R3·12；R1·9 成为总胜者' },
    refill: { before: builtLoserState, title: '输出总胜者 9，R1 的段首向后移动', note: '9 来自 R1；输出后直接在 R1 中选择下一个待归并记录 17' },
    'replay-left': { before: refilledLoserState, title: 'R1·17 沿原路径重赛第 1 层', note: '17 与原败者 10 比：17 输并留在左结点，R0·10 继续向上' },
    'replay-root': { before: replayedLeftState, title: 'R0·10 沿原路径重赛第 2 层', note: '10 与根中的 12 比：12 仍是败者，新总胜者变为 R0·10' },
    'next-10': { before: after9State, title: '继续归并：输出 10，R0 段首移动到 18', note: '18 先与 17 比，再由 17 与 12 比；下一位输出 12' },
    'next-12': { before: after10State, title: '继续归并：输出 12，R3 段首移动到 16', note: '16 先与 20 比，再与 17 比；下一位输出 16' },
    'next-16': { before: after12State, title: '继续归并：输出 16，R3 段首移动到 28', note: '28 输给 20，20 再输给 17；下一位输出 17' },
    'next-17': { before: after16State, title: '继续归并：输出 17，R1 段首移动到 30', note: '30 输给 18，18 战胜 20；当前归并段已得到 9、10、12、16、17' },
  }
  const config = configs[action]
  heading(scene, config.title, config.note)
  const view = drawLoserTree(scene, config.before)

  if (action === 'left' || action === 'right') {
    const runs = action === 'left' ? [0, 1] : [2, 3]
    const target = action === 'left' ? TREE_POS.left : TREE_POS.right
    const node = action === 'left' ? view.left : view.right
    const loser: Entry = action === 'left' ? { run: 0, value: 10 } : { run: 2, value: 20 }
    const winner: Entry = action === 'left' ? { run: 1, value: 9 } : { run: 3, value: 12 }
    const moving = runs.map((run, index) => tokenFromRun(run, 0, index === 0 ? C.blue : C.orange))
    scene.add(...moving)
    await scene.play(
      new Shift(moving[0], { direction: [target[0] - 0.43 - runValueX(runs[0]), target[1] - runValueY(0), 0], duration: 0.55, rateFunc: smooth }),
      new Shift(moving[1], { direction: [target[0] + 0.43 - runValueX(runs[1]), target[1] - runValueY(0), 0], duration: 0.55, rateFunc: smooth }),
    )
    await scene.play(new Transform(node.label, mono(entryText(loser), target[0], target[1] - 0.12, C.ink, 14), { duration: 0.35 }))
    const winnerTargetX = action === 'left' ? -1.58 : 1.58
    const winnerToken = text(`${entryText(winner)} ↑`, target[0] + 0.43, target[1], C.green, 14, '800')
    scene.add(winnerToken)
    await scene.play(
      new Shift(winnerToken, { direction: [winnerTargetX - target[0] - 0.43, 0.66, 0], duration: 0.42, rateFunc: smooth }),
      ...moving.map(item => new FadeOut(item, { duration: 0.18 })),
    )
    return
  }

  if (action === 'root') {
    const left = view.pendingLeft!
    const right = view.pendingRight!
    await scene.play(
      new Shift(left, { direction: [1.06, 0.68, 0], duration: 0.48, rateFunc: smooth }),
      new Shift(right, { direction: [-1.06, 0.68, 0], duration: 0.48, rateFunc: smooth }),
    )
    await scene.play(
      new Transform(view.root.label, mono('R3 · 12', TREE_POS.root[0], TREE_POS.root[1] - 0.12, C.ink, 14), { duration: 0.34 }),
      new Transform(view.winnerLabel, text('总胜者  R1 · 9', 0, TREE_POS.winner[1], C.green, 16, '800'), { duration: 0.42 }),
      new FadeOut(left, { duration: 0.16 }),
      new FadeOut(right, { duration: 0.16 }),
    )
    return
  }

  if (action === 'refill') {
    const output = mono('9', TREE_POS.winner[0], TREE_POS.winner[1], C.green, 18)
    scene.add(output)
    await scene.play(new Shift(output, { direction: [-4.55, 0.6, 0], duration: 0.58, rateFunc: smooth }))
    await scene.play(
      new Shift(view.runs[1].headFrame, { direction: [0, runValueY(1) - runValueY(0), 0], duration: 0.42, rateFunc: smooth }),
      new Indicate(view.runs[1].labels[1], { color: C.green, scaleFactor: 1.14, duration: 0.42 }),
      new Transform(view.winnerLabel, text('等待 R1 重赛', 0, TREE_POS.winner[1], C.violet, 16, '800'), { duration: 0.4 }),
    )
    return
  }

  if (action === 'replay-left') {
    const challenger = tokenFromRun(1, 1, C.violet)
    scene.add(challenger)
    await scene.play(new Shift(challenger, {
      direction: [TREE_POS.left[0] + 0.42 - runValueX(1), TREE_POS.left[1] - runValueY(1), 0],
      duration: 0.5, rateFunc: smooth,
    }))
    await scene.play(new Indicate(view.left.label, { color: C.orange, scaleFactor: 1.12, duration: 0.3 }))
    const upward = text('R0 · 10 ↑', TREE_POS.left[0] - 0.34, TREE_POS.left[1], C.green, 14, '800')
    scene.add(upward)
    await scene.play(
      new Transform(view.left.label, mono('R1 · 17', TREE_POS.left[0], TREE_POS.left[1] - 0.12, C.ink, 14), { duration: 0.36 }),
      new Shift(upward, { direction: [1.96, 0.66, 0], duration: 0.4, rateFunc: smooth }),
      new FadeOut(challenger, { duration: 0.16 }),
    )
    return
  }

  if (action === 'replay-root') {
    const challenger = view.pendingLeft!
    await scene.play(new Shift(challenger, { direction: [1.06, 0.68, 0], duration: 0.48, rateFunc: smooth }))
    await scene.play(new Indicate(view.root.label, { color: C.orange, scaleFactor: 1.12, duration: 0.3 }))
    await scene.play(
      new Transform(view.winnerLabel, text('总胜者  R0 · 10', 0, TREE_POS.winner[1], C.green, 16, '800'), { duration: 0.4 }),
      new FadeOut(challenger, { duration: 0.16 }),
    )
    return
  }

  const rounds = {
    'next-10': { after: after10State, run: 0, from: 0, to: 1, side: 'left' as const, pairWinner: { run: 1, value: 17 } },
    'next-12': { after: after12State, run: 3, from: 0, to: 1, side: 'right' as const, pairWinner: { run: 3, value: 16 } },
    'next-16': { after: after16State, run: 3, from: 1, to: 2, side: 'right' as const, pairWinner: { run: 2, value: 20 } },
    'next-17': { after: after17State, run: 1, from: 1, to: 2, side: 'left' as const, pairWinner: { run: 0, value: 18 } },
  }
  const round = rounds[action]
  const outputValue = config.before.winner!.value
  const outputX = -4.55 + config.before.output.length * 0.72
  const output = mono(String(outputValue), TREE_POS.winner[0], TREE_POS.winner[1], C.green, 18)
  scene.add(output)
  await scene.play(new Shift(output, { direction: [outputX, 3.18 - TREE_POS.winner[1], 0], duration: 0.5, rateFunc: smooth }))
  await scene.play(
    new Shift(view.runs[round.run].headFrame, { direction: [0, runValueY(round.to) - runValueY(round.from), 0], duration: 0.38, rateFunc: smooth }),
    new Indicate(view.runs[round.run].labels[round.to], { color: C.green, scaleFactor: 1.12, duration: 0.38 }),
    new Transform(view.winnerLabel, text('沿原路径重赛', 0, TREE_POS.winner[1], C.violet, 16, '800'), { duration: 0.35 }),
  )

  const pairPos = round.side === 'left' ? TREE_POS.left : TREE_POS.right
  const pairNode = round.side === 'left' ? view.left : view.right
  const newHead = tokenFromRun(round.run, round.to, C.violet)
  scene.add(newHead)
  await scene.play(new Shift(newHead, {
    direction: [pairPos[0] - runValueX(round.run), pairPos[1] - runValueY(round.to), 0],
    duration: 0.46, rateFunc: smooth,
  }))
  await scene.play(new Indicate(pairNode.label, { color: C.orange, scaleFactor: 1.1, duration: 0.28 }))
  const nextPair = round.side === 'left' ? round.after.left : round.after.right
  await scene.play(
    new Transform(pairNode.label, mono(entryText(nextPair), pairPos[0], pairPos[1] - 0.12, C.ink, 14), { duration: 0.34 }),
    new FadeOut(newHead, { duration: 0.16 }),
  )

  const upward = text(`${entryText(round.pairWinner)} ↑`, pairPos[0], pairPos[1], C.green, 14, '800')
  scene.add(upward)
  const upwardTargetX = round.side === 'left' ? -0.52 : 0.52
  await scene.play(new Shift(upward, {
    direction: [upwardTargetX - pairPos[0], TREE_POS.root[1] - pairPos[1], 0],
    duration: 0.44, rateFunc: smooth,
  }))
  await scene.play(new Indicate(view.root.label, { color: C.orange, scaleFactor: 1.1, duration: 0.28 }))
  await scene.play(
    new Transform(view.root.label, mono(entryText(round.after.root), TREE_POS.root[0], TREE_POS.root[1] - 0.12, C.ink, 14), { duration: 0.34 }),
    new Transform(view.winnerLabel, text(`总胜者  ${entryText(round.after.winner)}`, 0, TREE_POS.winner[1], C.green, 16, '800'), { duration: 0.38 }),
    new FadeOut(upward, { duration: 0.16 }),
  )
}

const loserActions: LoserAction[] = ['left', 'right', 'root', 'refill', 'replay-left', 'replay-root', 'next-10', 'next-12', 'next-16', 'next-17']

export const loserTreeAnimation: ManimWebAnimation = {
  id: 'loser-tree',
  ariaLabel: '三层败者树从四个竖向待归并段的段首向上取数，连续输出9、10、12、16、17并沿胜者路径重赛',
  initialState: {
    id: 'loser-tree-initial',
    render: scene => {
      heading(scene, '败者树：从待归并段的段首向上比赛', '底部是 4 个有序待归并段；先比较 R0、R1 的段首记录')
      drawLoserTree(scene, emptyLoserState)
      scene.render()
    },
  },
  scene: { width: 1280, height: 820, frameWidth: 14, frameHeight: 9, backgroundColor: '#ffffff' },
  steps: loserActions.map((action, index) => ({
    id: `loser-tree-${index + 1}`,
    render: async scene => { await renderLoserStep(scene, action); scene.render() },
  })),
}

// ---------------------------------------------------------------------------
// 置换选择：沿用原演示的数据；一次点击完整展示一次“选最小、输出、补入、判断”。

type MemoryItem = { value: number; frozen: boolean }
type ReplacementState = { memory: MemoryItem[]; input: number[]; output: number[] }
type ReplacementAction =
  | { kind: 'cycle'; before: ReplacementState; index: number; outputValue: number; inputValue: number; frozen: boolean }
  | { kind: 'end'; before: ReplacementState }
  | { kind: 'thaw'; before: ReplacementState }
  | { kind: 'next-run'; before: ReplacementState; index: number; value: number }

const INITIAL_MEMORY = [17, 3, 25, 9]
const INITIAL_INPUT = [20, 6, 31, 11, 40, 2, 13]
const MEMORY_X = [-5.05, -3.72, -2.39, -1.06]
const MEMORY_Y = 1.38
const INPUT_START_X = 1.18
const INPUT_GAP = 0.7
const OUTPUT_Y = -1.68

function cloneReplacement(state: ReplacementState): ReplacementState {
  return { memory: state.memory.map(item => ({ ...item })), input: [...state.input], output: [...state.output] }
}

function buildReplacementActions() {
  const state: ReplacementState = {
    memory: INITIAL_MEMORY.map(value => ({ value, frozen: false })),
    input: [...INITIAL_INPUT],
    output: [],
  }
  const actions: ReplacementAction[] = []
  while (state.memory.some(item => !item.frozen)) {
    let selected = -1
    for (let index = 0; index < state.memory.length; index++) {
      if (state.memory[index].frozen) continue
      if (selected < 0 || state.memory[index].value < state.memory[selected].value) selected = index
    }
    const outputValue = state.memory[selected].value
    const inputValue = state.input[0]
    const frozen = inputValue < outputValue
    actions.push({ kind: 'cycle', before: cloneReplacement(state), index: selected, outputValue, inputValue, frozen })
    state.output.push(outputValue)
    state.input.shift()
    state.memory[selected] = { value: inputValue, frozen }
  }
  actions.push({ kind: 'end', before: cloneReplacement(state) })
  actions.push({ kind: 'thaw', before: cloneReplacement(state) })
  const nextRunState: ReplacementState = {
    memory: state.memory.map(item => ({ value: item.value, frozen: false })),
    input: [],
    output: [],
  }
  const nextIndex = nextRunState.memory.reduce((best, item, index, items) => item.value < items[best].value ? index : best, 0)
  actions.push({ kind: 'next-run', before: nextRunState, index: nextIndex, value: nextRunState.memory[nextIndex].value })
  return actions
}

function memoryCell(x: number, frozen: boolean) {
  const cell = new Rectangle({
    width: 1.08, height: 0.76, center: [x, MEMORY_Y, 0],
    color: frozen ? C.violet : C.blue,
    fillOpacity: 0, strokeWidth: frozen ? 2.8 : 2,
  })
  cell.setFill(frozen ? C.paleViolet : C.paleBlue, 0.58)
  return cell
}

function drawReplacement(scene: Scene, state: ReplacementState) {
  scene.add(text('内存工作区', -3.06, 2.18, C.blue, 17, '800'))
  const cells: Rectangle[] = []
  const labels: Text[] = []
  const frozenLabels: Text[] = []
  state.memory.forEach((item, index) => {
    const cell = memoryCell(MEMORY_X[index], item.frozen)
    const label = mono(String(item.value), MEMORY_X[index], MEMORY_Y, item.frozen ? C.violet : C.ink, 19)
    cells.push(cell)
    labels.push(label)
    scene.add(cell, label)
    if (item.frozen) {
      const frozenLabel = text('下一段', MEMORY_X[index], MEMORY_Y - 0.61, C.violet, 12, '700')
      frozenLabels.push(frozenLabel)
      scene.add(frozenLabel)
    }
  })

  const inputBox = new Rectangle({
    width: 5.5, height: 0.82, center: [3.3, MEMORY_Y, 0],
    color: C.line, fillOpacity: 0.02, strokeWidth: 2,
  })
  const inputLabels = state.input.map((value, index) => mono(String(value), INPUT_START_X + index * INPUT_GAP, MEMORY_Y, C.ink, 15))
  scene.add(text('输入流', 3.3, 2.18, C.blue, 17, '800'), inputBox, ...inputLabels)

  const outputBox = new Rectangle({
    width: 8.65, height: 0.86, center: [-0.25, OUTPUT_Y, 0],
    color: C.green, fillOpacity: 0, strokeWidth: 2,
  })
  outputBox.setFill(C.paleGreen, 0.34)
  scene.add(text('当前归并段', -5.55, OUTPUT_Y, C.green, 15, '800'), outputBox)
  state.output.forEach((value, index) => scene.add(mono(String(value), -4.03 + index * 1.08, OUTPUT_Y, C.green, 18)))
  return { cells, labels, inputLabels, frozenLabels }
}

async function renderReplacementStep(scene: Scene, action: ReplacementAction, step: number, total: number) {
  if (action.kind === 'cycle') {
    const relation = action.frozen ? '<' : '≥'
    const result = action.frozen ? '冻结，留给下一段' : '继续参加当前段'
    heading(
      scene,
      `第 ${step}/${total} 步：输出 ${action.outputValue}，再读入 ${action.inputValue}`,
      `${action.inputValue} ${relation} ${action.outputValue}：${result}`,
    )
    const view = drawReplacement(scene, action.before)
    const selectedFrame = highlight(MEMORY_X[action.index], MEMORY_Y, C.orange, 1.18, 0.88)
    scene.add(selectedFrame)
    await scene.play(
      new FadeIn(selectedFrame, { duration: 0.2 }),
      new Indicate(view.labels[action.index], { color: C.orange, scaleFactor: 1.14, duration: 0.32 }),
    )

    const movingOut = mono(String(action.outputValue), MEMORY_X[action.index], MEMORY_Y, C.orange, 19)
    scene.add(movingOut)
    const outputX = -4.03 + action.before.output.length * 1.08
    await scene.play(new Shift(movingOut, {
      direction: [outputX - MEMORY_X[action.index], OUTPUT_Y - MEMORY_Y, 0],
      duration: 0.58, rateFunc: smooth,
    }))
    await scene.play(new Transform(view.labels[action.index], mono('—', MEMORY_X[action.index], MEMORY_Y, C.muted, 19), { duration: 0.2 }))

    const movingIn = view.inputLabels[0]
    await scene.play(new Indicate(movingIn, { color: action.frozen ? C.violet : C.green, scaleFactor: 1.12, duration: 0.3 }))
    const compare = text(
      `${action.inputValue} ${relation} ${action.outputValue}  →  ${action.frozen ? '冻结' : '留在本段'}`,
      3.2, 0.33, action.frozen ? C.violet : C.green, 15, '800',
    )
    scene.add(compare)
    await scene.play(new FadeIn(compare, { duration: 0.22 }))
    await scene.play(new Shift(movingIn, {
      direction: [MEMORY_X[action.index] - INPUT_START_X, 0, 0],
      duration: 0.56, rateFunc: smooth,
    }))
    if (view.inputLabels.length > 1) {
      await scene.play(...view.inputLabels.slice(1).map(item => new Shift(item, {
        direction: [-INPUT_GAP, 0, 0], duration: 0.34, rateFunc: smooth,
      })))
    }
    await scene.play(
      new Transform(view.cells[action.index], memoryCell(MEMORY_X[action.index], action.frozen), { duration: 0.28 }),
      new Transform(movingIn, mono(String(action.inputValue), MEMORY_X[action.index], MEMORY_Y, action.frozen ? C.violet : C.ink, 19), { duration: 0.28 }),
      new FadeOut(view.labels[action.index], { duration: 0.16 }),
    )
    if (action.frozen) {
      const frozenLabel = text('下一段', MEMORY_X[action.index], MEMORY_Y - 0.61, C.violet, 12, '700')
      scene.add(frozenLabel)
      await scene.play(new FadeIn(frozenLabel, { duration: 0.2 }))
    }
    return
  }

  if (action.kind === 'end') {
    heading(scene, `第 ${step}/${total} 步：工作区全部冻结`, '当前归并段结束：3，9，17，20，25，31，40')
    const view = drawReplacement(scene, action.before)
    const frames = action.before.memory.map((_, index) => highlight(MEMORY_X[index], MEMORY_Y, C.violet, 1.18, 0.88))
    scene.add(...frames)
    await scene.play(
      ...frames.map(item => new FadeIn(item, { duration: 0.24 })),
      ...view.labels.map(item => new Indicate(item, { color: C.violet, scaleFactor: 1.08, duration: 0.34 })),
    )
    return
  }

  if (action.kind === 'thaw') {
    heading(scene, `第 ${step}/${total} 步：解冻工作区，准备下一归并段`, '仍在内存里的 2、6、11、13 全部转入下一归并段的候选集合')
    const view = drawReplacement(scene, action.before)
    await scene.play(
      ...view.cells.map((cell, index) => new Transform(cell, memoryCell(MEMORY_X[index], false), { duration: 0.36 })),
      ...view.labels.map((label, index) => new Transform(label, mono(String(action.before.memory[index].value), MEMORY_X[index], MEMORY_Y, C.ink, 19), { duration: 0.36 })),
      ...view.frozenLabels.map(label => new FadeOut(label, { duration: 0.24 })),
    )
    const next = action.before.memory.reduce((best, item, index, items) => item.value < items[best].value ? index : best, 0)
    const nextFrame = highlight(MEMORY_X[next], MEMORY_Y, C.green, 1.18, 0.88)
    scene.add(nextFrame)
    await scene.play(new FadeIn(nextFrame, { duration: 0.22 }))
    return
  }

  heading(scene, `第 ${step}/${total} 步：开始生成第二归并段`, '从仍在内存里的记录中选择最小值 2；其余记录继续留在工作区，随后也会进入第二段')
  const view = drawReplacement(scene, action.before)
  const selectedFrame = highlight(MEMORY_X[action.index], MEMORY_Y, C.green, 1.18, 0.88)
  scene.add(selectedFrame)
  await scene.play(
    new FadeIn(selectedFrame, { duration: 0.22 }),
    new Indicate(view.labels[action.index], { color: C.green, scaleFactor: 1.14, duration: 0.32 }),
  )
  const moving = mono(String(action.value), MEMORY_X[action.index], MEMORY_Y, C.green, 19)
  scene.add(moving)
  await scene.play(new Shift(moving, {
    direction: [-4.03 - MEMORY_X[action.index], OUTPUT_Y - MEMORY_Y, 0],
    duration: 0.58, rateFunc: smooth,
  }))
  await scene.play(new Transform(view.labels[action.index], mono('—', MEMORY_X[action.index], MEMORY_Y, C.muted, 19), { duration: 0.2 }))
  const remainingFrames = action.before.memory
    .map((_, index) => index)
    .filter(index => index !== action.index)
    .map(index => highlight(MEMORY_X[index], MEMORY_Y, C.blue, 1.18, 0.88))
  scene.add(...remainingFrames)
  await scene.play(...remainingFrames.map(frame => new FadeIn(frame, { duration: 0.22 })))
}

const replacementActions = buildReplacementActions()

export const replacementSelectionAnimation: ManimWebAnimation = {
  id: 'replacement-selection',
  ariaLabel: '置换选择使用四格内存工作区逐轮展示选最小、输出、补入、冻结，并在第一段结束后解冻剩余记录开始第二归并段',
  initialState: {
    id: 'replacement-selection-initial',
    render: scene => {
      heading(scene, '置换选择：边输出，边补入，不合格就冻结', '工作区已装入 17、3、25、9；先从未冻结记录中选择最小值')
      drawReplacement(scene, {
        memory: INITIAL_MEMORY.map(value => ({ value, frozen: false })),
        input: [...INITIAL_INPUT],
        output: [],
      })
      scene.render()
    },
  },
  scene: { width: 1280, height: 820, frameWidth: 14, frameHeight: 9, backgroundColor: '#ffffff' },
  steps: replacementActions.map((action, index) => ({
    id: `replacement-selection-${index + 1}`,
    render: async scene => { await renderReplacementStep(scene, action, index + 1, replacementActions.length); scene.render() },
  })),
}
