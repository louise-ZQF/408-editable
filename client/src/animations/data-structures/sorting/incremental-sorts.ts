import { FadeIn, FadeOut, Indicate, Rectangle, Shift, Text, smooth, type Scene } from '@/animations/manim'
import type { ManimWebAnimation } from '../../types'

const C = {
  ink: '#0f172a', muted: '#64748b', line: '#94a3b8', blue: '#1d4ed8',
  orange: '#c2410c', green: '#047857', violet: '#6d28d9',
} as const

const VALUES = [5, 2, 8, 1, 6, 3, 7, 4]
const DX = 1.12
const ARRAY_Y = 0.35

function text(value: string, x: number, y: number, color: string = C.ink, size = 18, weight: string | number = '700') {
  return new Text({
    text: value, color, fontSize: size,
    fontFamily: 'Noto Sans SC, PingFang SC, sans-serif', fontWeight: weight,
  }).moveTo([x, y, 0])
}

function mono(value: string, x: number, y: number, color: string = C.ink, size = 20) {
  return new Text({
    text: value, color, fontSize: size,
    fontFamily: 'JetBrains Mono, Menlo, monospace', fontWeight: '800',
  }).moveTo([x, y, 0])
}

function heading(scene: Scene, title: string, note: string) {
  scene.add(text(title, 0, 2.6, C.ink, 25, '800'), text(note, 0, -2.58, C.muted, 16, '600'))
}

function drawArray(scene: Scene, values: Array<number | string>, y = ARRAY_Y) {
  const start = -(values.length - 1) * DX / 2
  const cells = values.map((_, index) => new Rectangle({
    width: 1, height: 0.82, center: [start + index * DX, y, 0],
    color: C.line, fillOpacity: 0.025, strokeWidth: 2,
  }))
  const items = values.map((value, index) => mono(String(value), start + index * DX, y))
  const indexes = values.map((_, index) => mono(String(index), start + index * DX, y - 0.72, C.muted, 12))
  scene.add(...cells, ...items, ...indexes)
  return { start, cells, items, y }
}

function cellFrame(x: number, color: string = C.orange, y = ARRAY_Y) {
  return new Rectangle({ width: 1.02, height: 0.92, center: [x, y, 0], color, fillOpacity: 0.055, strokeWidth: 3.2 })
}

function rangeFrame(start: number, from: number, to: number, color: string = C.green, y = ARRAY_Y) {
  return new Rectangle({
    width: (to - from) * DX + 1.04, height: 1.04,
    center: [start + (from + to) * DX / 2, y, 0],
    color, fillOpacity: 0.025, strokeWidth: 2.6,
  })
}

async function reveal(scene: Scene, ...objects: Rectangle[]) {
  scene.add(...objects)
  await scene.play(...objects.map(object => new FadeIn(object, { duration: 0.24 })))
}

async function swapItems(scene: Scene, items: Text[], left: number, right: number) {
  await scene.play(
    new Indicate(items[left], { color: C.orange, scaleFactor: 1.13, duration: 0.28 }),
    new Indicate(items[right], { color: C.orange, scaleFactor: 1.13, duration: 0.28 }),
  )
  await scene.play(
    new Shift(items[left], { direction: [(right - left) * DX, 0, 0], duration: 0.62, rateFunc: smooth }),
    new Shift(items[right], { direction: [(left - right) * DX, 0, 0], duration: 0.62, rateFunc: smooth }),
  )
  ;[items[left], items[right]] = [items[right], items[left]]
}

type Step = { id: string; run: (scene: Scene) => Promise<void> }

function animation(
  id: string,
  ariaLabel: string,
  overview: string,
  note: string,
  steps: Step[],
  initialValues: number[] = VALUES,
): ManimWebAnimation {
  return {
    id,
    ariaLabel,
    initialState: {
      id: `${id}-overview`,
      render: scene => {
        heading(scene, overview, note)
        drawArray(scene, initialValues)
        scene.render()
      },
    },
    scene: { width: 1100, height: 620, frameWidth: 12, frameHeight: 6.8, backgroundColor: '#ffffff' },
    steps: steps.map(step => ({
      id: step.id,
      render: async scene => { await step.run(scene); scene.render() },
    })),
  }
}

async function renderSelectionPass(scene: Scene, before: number[], pass: number) {
  heading(scene, `第 ${pass + 1} 趟：扫描下标 ${pass}～${before.length - 1}`, '只移动 min 标记；扫描结束后最多交换一次')
  const array = drawArray(scene, before)
  if (pass > 0) scene.add(rangeFrame(array.start, 0, pass - 1, C.green))

  let min = pass
  const minFrame = cellFrame(array.start + min * DX, C.blue)
  const minLabel = text('min', array.start + min * DX, 1.32, C.blue, 15, '800')
  scene.add(minFrame, minLabel)

  for (let scan = pass + 1; scan < before.length; scan++) {
    const scanFrame = cellFrame(array.start + scan * DX, C.orange)
    const scanLabel = text('j', array.start + scan * DX, 1.32, C.orange, 15, '800')
    scene.add(scanFrame, scanLabel)
    await scene.play(
      new FadeIn(scanFrame, { duration: 0.2 }),
      new FadeIn(scanLabel, { duration: 0.2 }),
      new Indicate(array.items[scan], { color: C.orange, scaleFactor: 1.1, duration: 0.3 }),
      new Indicate(array.items[min], { color: C.blue, scaleFactor: 1.1, duration: 0.3 }),
    )
    if (before[scan] < before[min]) {
      await scene.play(new FadeOut(scanFrame, { duration: 0.16 }), new FadeOut(scanLabel, { duration: 0.16 }))
      await scene.play(
        new Shift(minFrame, { direction: [(scan - min) * DX, 0, 0], duration: 0.46, rateFunc: smooth }),
        new Shift(minLabel, { direction: [(scan - min) * DX, 0, 0], duration: 0.46, rateFunc: smooth }),
      )
      min = scan
    } else {
      await scene.play(new FadeOut(scanFrame, { duration: 0.16 }), new FadeOut(scanLabel, { duration: 0.16 }))
    }
  }

  if (min !== pass) await swapItems(scene, array.items, pass, min)
  await reveal(scene, rangeFrame(array.start, 0, pass, C.green))
}

function buildSelectionSteps() {
  const values = [...VALUES]
  const steps: Step[] = []
  for (let pass = 0; pass < values.length - 1; pass++) {
    const before = [...values]
    steps.push({ id: `selection-pass-${pass + 1}`, run: scene => renderSelectionPass(scene, before, pass) })
    let min = pass
    for (let scan = pass + 1; scan < values.length; scan++) if (values[scan] < values[min]) min = scan
    ;[values[pass], values[min]] = [values[min], values[pass]]
  }
  return steps
}

export const selectionSortAnimation = animation(
  'selection-sort',
  '简单选择排序完整执行七趟，每趟等速扫描最小值并最多交换一次的逐步动画',
  '简单选择排序',
  '每一趟选出无序区的最小值，并放到无序区左端',
  buildSelectionSteps(),
)

async function renderBubblePass(scene: Scene, before: number[], pass: number) {
  const end = before.length - 1 - pass
  heading(scene, `第 ${pass + 1} 趟：比较下标 0～${end}`, '相邻元素逆序就交换，本趟最大值最终到达右端')
  const values = [...before]
  const array = drawArray(scene, values)
  if (end < values.length - 1) scene.add(rangeFrame(array.start, end + 1, values.length - 1, C.green))
  let swapped = false

  for (let left = 0; left < end; left++) {
    const pair = rangeFrame(array.start, left, left + 1, C.orange)
    await reveal(scene, pair)
    await scene.play(
      new Indicate(array.items[left], { color: C.orange, scaleFactor: 1.1, duration: 0.28 }),
      new Indicate(array.items[left + 1], { color: C.orange, scaleFactor: 1.1, duration: 0.28 }),
    )
    if (values[left] > values[left + 1]) {
      await swapItems(scene, array.items, left, left + 1)
      ;[values[left], values[left + 1]] = [values[left + 1], values[left]]
      swapped = true
    }
    await scene.play(new FadeOut(pair, { duration: 0.16 }))
  }
  await reveal(scene, rangeFrame(array.start, swapped ? end : 0, values.length - 1, C.green))
}

function buildBubbleSteps() {
  const values = [...VALUES]
  const steps: Step[] = []
  for (let pass = 0; pass < values.length - 1; pass++) {
    const before = [...values]
    let swapped = false
    const end = values.length - 1 - pass
    for (let left = 0; left < end; left++) {
      if (values[left] > values[left + 1]) {
        ;[values[left], values[left + 1]] = [values[left + 1], values[left]]
        swapped = true
      }
    }
    steps.push({ id: `bubble-pass-${pass + 1}`, run: scene => renderBubblePass(scene, before, pass) })
    if (!swapped) break
  }
  return steps
}

export const bubbleSortAnimation = animation(
  'bubble-sort',
  '冒泡排序完整执行每一趟，相邻比较与交换保持同一速度直到数组有序的逐步动画',
  '冒泡排序',
  '相邻元素逆序就交换；一整趟没有交换时排序结束',
  buildBubbleSteps(),
)

type InsertionMode = 'direct' | 'binary'

function insertionPosition(values: number[], index: number, mode: InsertionMode) {
  const key = values[index]
  if (mode === 'direct') {
    let position = index
    while (position > 0 && values[position - 1] > key) position--
    return position
  }
  let low = 0
  let high = index - 1
  while (low <= high) {
    const middle = Math.floor((low + high) / 2)
    if (values[middle] <= key) low = middle + 1
    else high = middle - 1
  }
  return low
}

async function renderInsertionPass(scene: Scene, before: number[], index: number, mode: InsertionMode) {
  const keyValue = before[index]
  const position = insertionPosition(before, index, mode)
  const name = mode === 'direct' ? '直接插入' : '折半插入'
  const note = mode === 'direct'
    ? '从已排序区末尾向前比较；较大元素逐个右移'
    : '先用折半查找定位；定位后仍要把较大元素逐个右移'
  heading(scene, `第 ${index} 趟${name}：key = ${keyValue}`, note)
  const array = drawArray(scene, before)
  scene.add(rangeFrame(array.start, 0, index - 1, C.blue))

  const key = array.items[index]
  const keyFrame = cellFrame(array.start + index * DX, C.orange)
  const keyLabel = text('key', array.start + index * DX, 1.98, C.orange, 14, '800')
  scene.add(keyFrame, keyLabel)
  await scene.play(
    new Shift(key, { direction: [0, 1.18, 0], duration: 0.52, rateFunc: smooth }),
    new Shift(keyFrame, { direction: [0, 1.18, 0], duration: 0.52, rateFunc: smooth }),
  )

  if (mode === 'direct') {
    for (let cursor = index - 1; cursor >= Math.max(0, position - 1); cursor--) {
      const compareFrame = cellFrame(array.start + cursor * DX, C.blue)
      await reveal(scene, compareFrame)
      await scene.play(new Indicate(array.items[cursor], { color: C.blue, scaleFactor: 1.1, duration: 0.32 }))
      await scene.play(new FadeOut(compareFrame, { duration: 0.16 }))
      if (cursor < position) break
    }
  } else {
    let low = 0
    let high = index - 1
    while (low <= high) {
      const middle = Math.floor((low + high) / 2)
      const searchRange = rangeFrame(array.start, low, high, C.violet)
      const middleFrame = cellFrame(array.start + middle * DX, C.orange)
      await reveal(scene, searchRange, middleFrame)
      await scene.play(new Indicate(array.items[middle], { color: C.orange, scaleFactor: 1.12, duration: 0.36 }))
      await scene.play(new FadeOut(searchRange, { duration: 0.16 }), new FadeOut(middleFrame, { duration: 0.16 }))
      if (before[middle] <= keyValue) low = middle + 1
      else high = middle - 1
    }
  }

  for (let cursor = index - 1; cursor >= position; cursor--) {
    const moveFrame = cellFrame(array.start + cursor * DX, C.orange)
    await reveal(scene, moveFrame)
    await scene.play(new Shift(array.items[cursor], { direction: [DX, 0, 0], duration: 0.46, rateFunc: smooth }))
    await scene.play(new FadeOut(moveFrame, { duration: 0.14 }))
  }
  await scene.play(
    new Shift(key, { direction: [(position - index) * DX, -1.18, 0], duration: 0.62, rateFunc: smooth }),
    new Shift(keyFrame, { direction: [(position - index) * DX, -1.18, 0], duration: 0.62, rateFunc: smooth }),
    new FadeOut(keyLabel, { duration: 0.2 }),
  )
  await reveal(scene, rangeFrame(array.start, 0, index, C.green))
}

function buildInsertionSteps(mode: InsertionMode) {
  const values = [...VALUES]
  const steps: Step[] = []
  for (let index = 1; index < values.length; index++) {
    const before = [...values]
    const position = insertionPosition(values, index, mode)
    const key = values[index]
    for (let cursor = index; cursor > position; cursor--) values[cursor] = values[cursor - 1]
    values[position] = key
    steps.push({ id: `${mode}-insertion-pass-${index}`, run: scene => renderInsertionPass(scene, before, index, mode) })
  }
  return steps
}

export const directInsertionSortAnimation = animation(
  'direct-insertion-sort',
  '直接插入排序完整执行七次插入，逐项比较、右移并写入关键字直到数组有序的动画',
  '直接插入排序',
  '依次取出待插元素，右移较大元素，再把待插元素写入空位',
  buildInsertionSteps('direct'),
)

export const binaryInsertionSortAnimation = animation(
  'binary-insertion-sort',
  '折半插入排序完整执行七次插入，先折半定位再逐项右移直到数组有序的动画',
  '折半插入排序',
  '折半减少比较次数，不减少元素移动次数',
  buildInsertionSteps('binary'),
)

type MergeRange = { left: number; middle: number; right: number; stage: number; before: number[] }

function buildMergeRanges() {
  const values = [...VALUES]
  const ranges: MergeRange[] = []
  let stage = 1
  for (let width = 1; width < values.length; width *= 2, stage++) {
    for (let left = 0; left < values.length; left += width * 2) {
      const middle = Math.min(left + width - 1, values.length - 1)
      const right = Math.min(left + width * 2 - 1, values.length - 1)
      if (middle >= right) continue
      const before = [...values]
      const merged: number[] = []
      let i = left
      let j = middle + 1
      while (i <= middle || j <= right) {
        if (j > right || (i <= middle && values[i] <= values[j])) merged.push(values[i++])
        else merged.push(values[j++])
      }
      values.splice(left, merged.length, ...merged)
      ranges.push({ left, middle, right, stage, before })
    }
  }
  return ranges
}

async function renderMerge(scene: Scene, range: MergeRange) {
  const { left, middle, right, stage, before } = range
  heading(scene, `第 ${stage} 轮归并：合并 [${left}..${middle}] 与 [${middle + 1}..${right}]`, '每次比较两个有序段的当前元素，较小者进入临时区')
  const array = drawArray(scene, before, 0.82)
  scene.add(rangeFrame(array.start, left, middle, C.blue, 0.82), rangeFrame(array.start, middle + 1, right, C.orange, 0.82))
  const tempCells = Array.from({ length: right - left + 1 }, (_, offset) => new Rectangle({
    width: 1, height: 0.82, center: [array.start + (left + offset) * DX, -0.92, 0],
    color: C.line, fillOpacity: 0.015, strokeWidth: 1.8,
  }))
  scene.add(...tempCells, text('临时区', array.start + (left + right) * DX / 2, -1.65, C.muted, 14, '700'))

  let i = left
  let j = middle + 1
  let output = left
  const moved: Text[] = []
  while (i <= middle || j <= right) {
    const candidates: Rectangle[] = []
    if (i <= middle) candidates.push(cellFrame(array.start + i * DX, C.blue, 0.82))
    if (j <= right) candidates.push(cellFrame(array.start + j * DX, C.orange, 0.82))
    await reveal(scene, ...candidates)
    const takeLeft = j > right || (i <= middle && before[i] <= before[j])
    const source = takeLeft ? i++ : j++
    const item = array.items[source]
    await scene.play(new Indicate(item, { color: takeLeft ? C.blue : C.orange, scaleFactor: 1.1, duration: 0.28 }))
    await scene.play(new Shift(item, {
      direction: [(output - source) * DX, -1.74, 0], duration: 0.48, rateFunc: smooth,
    }))
    moved.push(item)
    output++
    await scene.play(...candidates.map(frame => new FadeOut(frame, { duration: 0.12 })))
  }
  await reveal(scene, rangeFrame(array.start, left, right, C.green, -0.92))
  await scene.play(...moved.map(item => new Shift(item, { direction: [0, 1.74, 0], duration: 0.55, rateFunc: smooth })))
  await reveal(scene, rangeFrame(array.start, left, right, C.green, 0.82))
}

export const mergeSortAnimation = animation(
  'merge-sort',
  '二路归并排序自底向上完成七次归并，每个元素依次进入临时区再回到原数组的动画',
  '二路归并排序',
  '有序段长度依次扩大：1 → 2 → 4 → 8',
  buildMergeRanges().map((range, index) => ({ id: `merge-${index + 1}`, run: scene => renderMerge(scene, range) })),
)

function gapInsertionPosition(values: number[], index: number, gap: number) {
  const key = values[index]
  let position = index
  while (position >= gap && values[position - gap] > key) position -= gap
  return position
}

async function renderShellInsertion(scene: Scene, before: number[], index: number, gap: number, step: number, total: number) {
  const position = gapInsertionPosition(before, index, gap)
  const keyValue = before[index]
  heading(scene, `第 ${step}/${total} 步：gap = ${gap}，插入下标 ${index}`, `只比较同组元素；本次 key = ${keyValue}`)
  const array = drawArray(scene, before)
  const groupIndexes: number[] = []
  for (let cursor = index % gap; cursor < before.length; cursor += gap) groupIndexes.push(cursor)
  const groupFrames = groupIndexes.map(cursor => cellFrame(array.start + cursor * DX, C.violet))
  scene.add(...groupFrames)

  const key = array.items[index]
  const keyFrame = cellFrame(array.start + index * DX, C.orange)
  scene.add(keyFrame, text('key', array.start + index * DX, 1.98, C.orange, 14, '800'))
  await scene.play(
    new Shift(key, { direction: [0, 1.18, 0], duration: 0.48, rateFunc: smooth }),
    new Shift(keyFrame, { direction: [0, 1.18, 0], duration: 0.48, rateFunc: smooth }),
  )
  for (let cursor = index - gap; cursor >= position; cursor -= gap) {
    const compareFrame = cellFrame(array.start + cursor * DX, C.orange)
    await reveal(scene, compareFrame)
    await scene.play(new Indicate(array.items[cursor], { color: C.orange, scaleFactor: 1.1, duration: 0.28 }))
    await scene.play(new Shift(array.items[cursor], { direction: [gap * DX, 0, 0], duration: 0.48, rateFunc: smooth }))
    await scene.play(new FadeOut(compareFrame, { duration: 0.14 }))
  }
  await scene.play(
    new Shift(key, { direction: [(position - index) * DX, -1.18, 0], duration: 0.58, rateFunc: smooth }),
    new Shift(keyFrame, { direction: [(position - index) * DX, -1.18, 0], duration: 0.58, rateFunc: smooth }),
  )
  if (gap === 1 && index === before.length - 1) await reveal(scene, rangeFrame(array.start, 0, before.length - 1, C.green))
}

function buildShellSteps() {
  const values = [...SHELL_VALUES]
  const records: Array<{ before: number[]; index: number; gap: number }> = []
  for (const gap of [4, 2, 1]) {
    for (let index = gap; index < values.length; index++) {
      const before = [...values]
      const position = gapInsertionPosition(values, index, gap)
      const key = values[index]
      for (let cursor = index; cursor > position; cursor -= gap) values[cursor] = values[cursor - gap]
      values[position] = key
      records.push({ before, index, gap })
    }
  }
  return records.map((record, index) => ({
    id: `shell-insertion-${index + 1}`,
    run: (scene: Scene) => renderShellInsertion(scene, record.before, record.index, record.gap, index + 1, records.length),
  }))
}

const SHELL_VALUES = [9, 8, 7, 6, 5, 4, 3, 2]

export const shellSortAnimation = animation(
  'shell-sort',
  '希尔排序完整执行gap为4、2、1的十七次组内插入，每次移动保持相同速度直到数组有序的动画',
  '希尔排序',
  'gap 依次取 4、2、1；同组元素分别执行插入排序',
  buildShellSteps(),
  SHELL_VALUES,
)
