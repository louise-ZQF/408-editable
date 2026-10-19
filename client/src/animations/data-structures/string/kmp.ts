import { FadeIn, Rectangle, Shift, Text, VGroup, linear, smooth, type Scene } from '@/animations/manim'
import type { ManimWebAnimation } from '../../types'

const C = {
  ink: '#0f172a', text: '#334155', muted: '#64748b', line: '#cbd5e1',
  blue: '#1d4ed8', orange: '#c2410c', green: '#047857',
  violet: '#6d28d9', red: '#be123c',
} as const

const CELL_W = 0.72
const CELL_H = 0.66
const PATTERN = ['A', 'B', 'A', 'B', 'A', 'B', 'C', 'A', 'A'] as const
const NEXT = ['-1', '0', '0', '1', '2', '3', '4', '0', '1'] as const
// 前两次都会在 C 处失配；第三次对齐后才完整匹配。
const MAIN = ['A', 'B', 'A', 'B', 'A', 'B', 'A', 'B', 'A', 'B', 'C', 'A', 'A'] as const
const PATTERN_START = -((PATTERN.length - 1) * CELL_W) / 2
const MAIN_START = -((MAIN.length - 1) * CELL_W) / 2
const TARGET = 6

type Cell = { group: VGroup; x: number }

function text(content: string, x: number, y: number, color: string = C.ink, size = 18, weight = '700') {
  return new Text({ text: content, color, fontSize: size, fontFamily: 'Noto Sans SC, PingFang SC, sans-serif', fontWeight: weight }).moveTo([x, y, 0])
}

function mono(content: string, x: number, y: number, color: string = C.ink, size = 20) {
  return new Text({ text: content, color, fontSize: size, fontFamily: 'JetBrains Mono, Menlo, monospace', fontWeight: '700' }).moveTo([x, y, 0])
}

function makeCells(values: readonly string[], y: number, startX: number, color: string = C.line): Cell[] {
  return values.map((value, index) => {
    const x = startX + index * CELL_W
    return {
      x,
      group: new VGroup(
        new Rectangle({ width: CELL_W - 0.035, height: CELL_H, center: [x, y, 0], color, fillOpacity: 0.025, strokeWidth: 2 }),
        mono(value, x, y),
      ),
    }
  })
}

function addCells(scene: Scene, cells: Cell[]) { scene.add(...cells.map(cell => cell.group)) }

function frame(x: number, y: number, color: string, width = CELL_W - 0.01, fillOpacity = 0.07, height = CELL_H + 0.16) {
  return new Rectangle({ width, height, center: [x, y, 0], color, fillOpacity, strokeWidth: 3 })
}

function rangeFrame(startX: number, count: number, y: number, color: string, fillOpacity = 0.04, verticalOffset = 0) {
  return frame(startX + ((count - 1) * CELL_W) / 2, y + verticalOffset, color, count * CELL_W - 0.015, fillOpacity, CELL_H + 0.03)
}

function addIndices(scene: Scene, cells: Cell[], y: number) {
  scene.add(...cells.map((cell, index) => mono(String(index), cell.x, y, C.muted, 12)))
}

function addNextHeader(scene: Scene) {
  scene.add(
    text('求字符 C 对应的 next[6]', 0, 2.75, C.ink, 25, '800'),
    text('只考察 C 前面的 ABABAB，逐渐扩大真前缀和真后缀', 0, 2.3, C.text, 16, '600'),
  )
}

function addPatternForNext(scene: Scene, targetValue = '?') {
  const pattern = makeCells(PATTERN, 1.35, PATTERN_START, C.blue)
  const shownNext = NEXT.map((value, index) => index < TARGET ? value : index === TARGET ? targetValue : '·')
  const next = makeCells(shownNext, -1.25, PATTERN_START, C.violet)
  scene.add(text('模式串 P', -4.85, 1.35, C.blue, 15, '800'), text('next', -4.85, -1.25, C.violet, 15, '800'))
  addCells(scene, pattern)
  addCells(scene, next)
  addIndices(scene, pattern, 0.88)
  scene.add(frame(pattern[TARGET].x, 1.35, C.violet, CELL_W - 0.01, 0.11))
  return { pattern, next }
}

async function showNextTarget(scene: Scene, animate: boolean) {
  addNextHeader(scene)
  const { pattern } = addPatternForNext(scene)
  const note = text('现在要求 next[6]：C 失配时，模式串指针 j 应回到哪里？', 0, -2.25, C.violet, 17, '800')
  scene.add(note)
  if (animate) await scene.play(new FadeIn(frame(pattern[TARGET].x, 1.35, C.violet, CELL_W - 0.01, 0.15), { duration: 0.42 }), new FadeIn(note, { duration: 0.42, shift: [0, 0.12, 0], rateFunc: smooth }))
}

async function showCandidate(scene: Scene, length: 1 | 2 | 3 | 4 | 5, animate: boolean) {
  addNextHeader(scene)
  const { pattern } = addPatternForNext(scene)
  const source = PATTERN.slice(0, TARGET)
  const prefix = source.slice(0, length).join('')
  const suffix = source.slice(source.length - length).join('')
  const equal = prefix === suffix
  const prefixFrame = rangeFrame(pattern[0].x, length, 1.35, C.blue, 0.045, 0.055)
  const suffixFrame = rangeFrame(pattern[TARGET - length].x, length, 1.35, C.orange, 0.035, -0.055)
  const record = length === 2 ? '，记录当前最长为 2' : length === 4 ? '，更新当前最长为 4' : '，不记录'
  const relation = text(`${prefix} ${equal ? '=' : '≠'} ${suffix}${record}`, 0, -0.2, equal ? C.green : C.red, 17, '800')
  scene.add(prefixFrame, suffixFrame, relation)
  if (animate) {
    await scene.play(new FadeIn(prefixFrame, { duration: 0.4 }), new FadeIn(suffixFrame, { duration: 0.4 }))
    await scene.play(new FadeIn(relation, { duration: 0.4, shift: [0, 0.1, 0], rateFunc: smooth }))
  }
}

async function finishNext(scene: Scene, animate: boolean) {
  addNextHeader(scene)
  const { pattern, next } = addPatternForNext(scene, '4')
  const prefixFrame = rangeFrame(pattern[0].x, 4, 1.35, C.blue, 0.045, 0.055)
  const suffixFrame = rangeFrame(pattern[2].x, 4, 1.35, C.orange, 0.035, -0.055)
  const result = text('最长相同真前后缀是 ABAB，长度为 4，所以 next[6] = 4', 0, -2.25, C.green, 18, '800')
  scene.add(prefixFrame, suffixFrame, frame(next[TARGET].x, -1.25, C.green, CELL_W - 0.01, 0.14), result)
  if (animate) await scene.play(new FadeIn(result, { duration: 0.45, shift: [0, 0.12, 0], rateFunc: smooth }))
}

function addMatchHeader(scene: Scene, subtitle: string) {
  scene.add(text('KMP 匹配 ABABABCAA', 0, 2.75, C.ink, 25, '800'), text(subtitle, 0, 2.3, C.text, 16, '600'))
}

function addMatchRows(scene: Scene, offset: number) {
  const main = makeCells(MAIN, 1.2, MAIN_START, C.blue)
  const pattern = makeCells(PATTERN, 0, MAIN_START + offset * CELL_W, C.orange)
  scene.add(text('主串 T', -5.05, 1.2, C.blue, 15, '800'), text('模式串 P', -5.05, 0, C.orange, 15, '800'))
  addCells(scene, main)
  addCells(scene, pattern)
  addIndices(scene, main, 1.68)
  return { main, pattern }
}

function addPreviousMatches(scene: Scene, main: Cell[], pattern: Cell[], count: number, mainStart = 0, patternStart = 0) {
  for (let index = 0; index < count; index += 1) {
    scene.add(
      frame(main[mainStart + index].x, 1.2, C.green, CELL_W - 0.06, 0.025),
      frame(pattern[patternStart + index].x, 0, C.green, CELL_W - 0.06, 0.025),
    )
  }
}

async function showCompare(scene: Scene, options: {
  offset: number; mainIndex: number; patternIndex: number; previous: number;
  previousMain?: number; previousPattern?: number; equal: boolean; note: string
}, animate: boolean) {
  const { offset, mainIndex, patternIndex, previous, previousMain = 0, previousPattern = 0, equal, note } = options
  addMatchHeader(scene, '每轮比较一对字符；绿色框表示已经匹配的前缀')
  const { main, pattern } = addMatchRows(scene, offset)
  addPreviousMatches(scene, main, pattern, previous, previousMain, previousPattern)
  const color = equal ? C.green : C.red
  const mainFrame = frame(main[mainIndex].x, 1.2, color, CELL_W - 0.005, 0.14)
  const patternFrame = frame(pattern[patternIndex].x, 0, color, CELL_W - 0.005, 0.14)
  const pointerI = text(`i=${mainIndex}`, main[mainIndex].x, 1.95, C.blue, 14, '800')
  const pointerJ = text(`j=${patternIndex}`, pattern[patternIndex].x, -0.55, C.orange, 14, '800')
  const explanation = text(note, 0, -1.55, color, 17, '800')
  scene.add(mainFrame, patternFrame, pointerI, pointerJ, explanation)
  if (animate) {
    await scene.play(new FadeIn(mainFrame, { duration: 0.34 }), new FadeIn(patternFrame, { duration: 0.34 }))
    await scene.play(new FadeIn(explanation, { duration: 0.4, shift: [0, 0.1, 0], rateFunc: smooth }))
  }
}

async function showMatchSetup(scene: Scene, animate: boolean) {
  addMatchHeader(scene, '模式串第 0 位先与主串第 0 位对齐')
  const { main, pattern } = addMatchRows(scene, 0)
  const a = frame(main[0].x, 1.2, C.violet, CELL_W - 0.005, 0.1)
  const b = frame(pattern[0].x, 0, C.violet, CELL_W - 0.005, 0.1)
  const note = text('从 i=0、j=0 开始，逐字符比较', 0, -1.55, C.violet, 18, '800')
  scene.add(a, b, note)
  if (animate) await scene.play(new FadeIn(a, { duration: 0.4 }), new FadeIn(b, { duration: 0.4 }), new FadeIn(note, { duration: 0.4 }))
}

async function shiftAfterC(scene: Scene, animate: boolean, fromOffset: number) {
  const mismatchIndex = fromOffset + TARGET
  addMatchHeader(scene, `C 处失配：i 保持 ${mismatchIndex}，j 从 6 回到 next[6]=4`)
  const { main, pattern } = addMatchRows(scene, fromOffset)
  const mainMatched = rangeFrame(main[fromOffset].x, TARGET, 1.2, C.green, 0.025)
  const patternMatched = rangeFrame(pattern[0].x, TARGET, 0, C.green, 0.025)
  const mainMismatch = frame(main[mismatchIndex].x, 1.2, C.red, CELL_W - 0.005, 0.14)
  const patternMismatch = frame(pattern[TARGET].x, 0, C.red, CELL_W - 0.005, 0.14)
  scene.add(mainMatched, patternMatched, mainMismatch, patternMismatch, text('右移 j-next[j] = 6-4 = 2 格', 0, -1.5, C.violet, 18, '800'))
  const moving = new VGroup(...pattern.map(cell => cell.group), patternMatched, patternMismatch)
  if (animate) await scene.play(new Shift(moving, { direction: [2 * CELL_W, 0, 0], duration: 1.05, rateFunc: linear }))
  else moving.shift([2 * CELL_W, 0, 0])
  const note = text(`P[4] 与 T[${mismatchIndex}] 对齐，主串位置没有后退`, 0, -2.03, C.green, 17, '800')
  scene.add(frame(main[mismatchIndex].x, 1.2, C.violet, CELL_W - 0.005, 0.08), frame(main[mismatchIndex].x, 0, C.violet, CELL_W - 0.005, 0.08), note)
  if (animate) await scene.play(new FadeIn(note, { duration: 0.4 }))
}

async function showSuccess(scene: Scene, animate: boolean) {
  addMatchHeader(scene, '第三次对齐后，模式串全部匹配')
  const { main, pattern } = addMatchRows(scene, 4)
  addPreviousMatches(scene, main, pattern, PATTERN.length, 4, 0)
  const mainRange = rangeFrame(main[4].x, PATTERN.length, 1.2, C.green, 0.06)
  const patternRange = rangeFrame(pattern[0].x, PATTERN.length, 0, C.green, 0.06)
  const note = text('匹配成功：ABABABCAA 从主串下标 4 开始', 0, -1.55, C.green, 18, '800')
  scene.add(mainRange, patternRange, note)
  if (animate) await scene.play(new FadeIn(mainRange, { duration: 0.42 }), new FadeIn(patternRange, { duration: 0.42 }), new FadeIn(note, { duration: 0.42 }))
}

type StepRenderer = (scene: Scene, animate: boolean) => Promise<void>
const compare = (offset: number, mainIndex: number, patternIndex: number, previous: number, note: string, equal = true, previousMain = offset, previousPattern = 0): StepRenderer =>
  (scene, animate) => showCompare(scene, { offset, mainIndex, patternIndex, previous, previousMain, previousPattern, equal, note }, animate)

const KMP_STEPS: { id: string; render: StepRenderer }[] = [
  { id: 'next-target-c', render: showNextTarget },
  { id: 'next-candidate-0-5', render: (scene, animate) => showCandidate(scene, 1, animate) },
  { id: 'next-candidate-01-45', render: (scene, animate) => showCandidate(scene, 2, animate) },
  { id: 'next-candidate-012-345', render: (scene, animate) => showCandidate(scene, 3, animate) },
  { id: 'next-candidate-0123-2345', render: (scene, animate) => showCandidate(scene, 4, animate) },
  { id: 'next-candidate-01234-12345', render: (scene, animate) => showCandidate(scene, 5, animate) },
  { id: 'next-six-result', render: finishNext },
  { id: 'match-setup', render: showMatchSetup },
  ...[0, 1, 2, 3, 4, 5].map(index => ({ id: `match-first-${index}`, render: compare(0, index, index, index, `T[${index}] = P[${index}]，继续比较`) })),
  { id: 'match-first-c-mismatch', render: compare(0, 6, 6, 6, 'T[6]=A，P[6]=C：第一次在 C 处失配', false) },
  { id: 'match-first-shift', render: (scene, animate) => shiftAfterC(scene, animate, 0) },
  { id: 'match-second-a', render: compare(2, 6, 4, 4, '已知前 4 位 ABAB 对齐；继续比较 T[6]=P[4]=A', true, 2) },
  { id: 'match-second-b', render: compare(2, 7, 5, 5, 'T[7]=P[5]=B，下一位再次轮到 C', true, 2) },
  { id: 'match-second-c-mismatch', render: compare(2, 8, 6, 6, 'T[8]=A，P[6]=C：第二次在 C 处失配', false, 2) },
  { id: 'match-second-shift', render: (scene, animate) => shiftAfterC(scene, animate, 2) },
  { id: 'match-third-a', render: compare(4, 8, 4, 4, '保留 ABAB；T[8]=P[4]=A', true, 4) },
  { id: 'match-third-b', render: compare(4, 9, 5, 5, 'T[9]=P[5]=B', true, 4) },
  { id: 'match-third-c', render: compare(4, 10, 6, 6, 'T[10]=P[6]=C，这一次 C 匹配成功', true, 4) },
  { id: 'match-third-a-7', render: compare(4, 11, 7, 7, 'T[11]=P[7]=A', true, 4) },
  { id: 'match-third-a-8', render: compare(4, 12, 8, 8, 'T[12]=P[8]=A，模式串全部匹配', true, 4) },
  { id: 'match-success', render: showSuccess },
]

async function nextval(scene: Scene, animate: boolean) {
  scene.add(text('nextval：跳过必然再次失配的相同字符', 0, 2.5, C.ink, 23, '800'))
  const pattern = makeCells(['A', 'A', 'A', 'B'], 1.25, -1.08, C.blue)
  const next = makeCells(['-1', '0', '1', '2'], 0, -1.08, C.violet)
  const nextvalCells = makeCells(['-1', '-1', '-1', '2'], -1.25, -1.08, C.green)
  scene.add(text('模式串', -3.65, 1.25, C.blue, 15), text('next', -3.65, 0, C.violet, 15), text('nextval', -3.65, -1.25, C.green, 15))
  addCells(scene, pattern); addCells(scene, next); addCells(scene, nextvalCells)
  const note = text('P[j] = P[next[j]] 时，继承 nextval[next[j]]，跳过重复比较', 0, -2.35, C.green, 16, '800')
  scene.add(frame(pattern[1].x, 1.25, C.red), frame(pattern[0].x, 1.25, C.red), note)
  if (animate) await scene.play(new FadeIn(note, { duration: 0.45, shift: [0, 0.12, 0], rateFunc: smooth }))
}

export const kmpAnimation: ManimWebAnimation = {
  id: 'kmp-match-and-next',
  ariaLabel: '逐步求ABABABCAA中C的next值并完成两次失配滑动的KMP匹配动画',
  initialState: {
    id: 'kmp-overview',
    render: scene => {
      const pattern = makeCells(PATTERN, 0.4, PATTERN_START, C.blue)
      scene.add(text('KMP：模式串 ABABABCAA', 0, 2.2, C.ink, 27, '800'), text('先求 C 对应的 next[6]，再按 next 值移动模式串', 0, -0.75, C.muted, 17, '600'))
      addCells(scene, pattern); addIndices(scene, pattern, -0.08); scene.render()
    },
  },
  scene: { width: 1100, height: 680, frameWidth: 12, frameHeight: 7.4, backgroundColor: '#ffffff' },
  steps: KMP_STEPS.map(step => ({ id: step.id, render: async (scene, animate) => { await step.render(scene, animate); scene.render() } })),
}

export const kmpImprovedAnimation: ManimWebAnimation = {
  id: 'kmp-nextval', ariaLabel: 'KMP改进nextval跳过重复失配字符的动画',
  initialState: { id: 'nextval-overview', render: scene => { const pattern = makeCells(['A', 'A', 'A', 'B'], 0, -1.08, C.blue); scene.add(text('KMP 改进：消除重复失配', 0, 2, C.ink, 27, '800')); addCells(scene, pattern); scene.render() } },
  scene: { width: 1100, height: 650, frameWidth: 12, frameHeight: 7, backgroundColor: '#ffffff' },
  steps: [{ id: 'nextval-build', render: async (scene, animate) => { await nextval(scene, animate); scene.render() } }],
}
