import { Arrow, Circle, FadeIn, FadeOut, Indicate, Rectangle, Shift, Text, smooth, type Scene } from '@/animations/manim'
import type { ManimWebAnimation } from '../../types'

const C = {
  ink: '#0f172a', muted: '#64748b', line: '#94a3b8', blue: '#1d4ed8',
  orange: '#c2410c', green: '#047857', violet: '#6d28d9', red: '#be123c',
} as const

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

function frame(x: number, y: number, color: string, width = 1.02, height = 0.92) {
  return new Rectangle({ width, height, center: [x, y, 0], color, fillOpacity: 0.05, strokeWidth: 3 })
}

async function reveal(scene: Scene, ...objects: Rectangle[]) {
  scene.add(...objects)
  await scene.play(...objects.map(object => new FadeIn(object, { duration: 0.22 })))
}

// ---------------------------------------------------------------------------
// 快速排序：只完整演示一次划分，后续子区间递归执行同样的过程。

const QUICK_VALUES = [7, 2, 9, 1, 8, 3, 6, 4, 10, 5]
const QUICK_DX = 1.04
const QUICK_Y = 0.25

function quickHeading(scene: Scene, title: string, note: string) {
  scene.add(text(title, 0, 2.55, C.ink, 25, '800'), text(note, 0, -2.5, C.muted, 16, '600'))
}

function quickArray(scene: Scene, values: number[]) {
  const start = -(values.length - 1) * QUICK_DX / 2
  const cells = values.map((_, index) => new Rectangle({
    width: 1, height: 0.82, center: [start + index * QUICK_DX, QUICK_Y, 0],
    color: C.line, fillOpacity: 0.02, strokeWidth: 2,
  }))
  const items = values.map((value, index) => mono(String(value), start + index * QUICK_DX, QUICK_Y))
  scene.add(...cells, ...items, ...values.map((_, index) => mono(String(index), start + index * QUICK_DX, -0.47, C.muted, 12)))
  return { start, items }
}

function quickRange(start: number, low: number, high: number, color: string = C.violet) {
  return new Rectangle({
    width: (high - low) * QUICK_DX + 1.04, height: 1.04,
    center: [start + (low + high) * QUICK_DX / 2, QUICK_Y, 0],
    color, fillOpacity: 0.025, strokeWidth: 2.6,
  })
}

type QuickAction = {
  kind: 'start' | 'find-i' | 'find-j' | 'swap' | 'advance' | 'cross' | 'pivot'
  before: number[]
  low: number
  high: number
  i: number
  j: number
  from?: number
  to?: number
  scanned?: number[]
  nextI?: number
  nextJ?: number
}

function buildQuickActions() {
  const values = [...QUICK_VALUES]
  const actions: QuickAction[] = []
  const low = 0
  const high = values.length - 1
  const pivot = values[high]
  let i = low
  let j = high - 1
  actions.push({ kind: 'start', before: [...values], low, high, i, j })

  while (i <= j) {
    const iFrom = i
    const iScanned: number[] = []
    while (i <= j && values[i] <= pivot) {
      iScanned.push(i)
      i++
    }
    if (i <= j) iScanned.push(i)
    actions.push({ kind: 'find-i', before: [...values], low, high, i, j, from: iFrom, to: i, scanned: iScanned })

    const jFrom = j
    const jScanned: number[] = []
    while (i <= j && values[j] >= pivot) {
      jScanned.push(j)
      j--
    }
    if (i <= j) jScanned.push(j)
    actions.push({ kind: 'find-j', before: [...values], low, high, i, j, from: jFrom, to: j, scanned: jScanned })

    if (i > j) break
    actions.push({ kind: 'swap', before: [...values], low, high, i, j, nextI: i + 1, nextJ: j - 1 })
    ;[values[i], values[j]] = [values[j], values[i]]
    actions.push({ kind: 'advance', before: [...values], low, high, i, j, nextI: i + 1, nextJ: j - 1 })
    i++
    j--
  }

  actions.push({ kind: 'cross', before: [...values], low, high, i, j })
  actions.push({ kind: 'pivot', before: [...values], low, high, i, j })
  return actions
}

async function quickSwap(scene: Scene, items: Text[], left: number, right: number) {
  if (left === right) {
    await scene.play(new Indicate(items[left], { color: C.violet, scaleFactor: 1.14, duration: 0.38 }))
    return
  }
  await scene.play(
    new Shift(items[left], { direction: [(right - left) * QUICK_DX, 0, 0], duration: 0.58, rateFunc: smooth }),
    new Shift(items[right], { direction: [(left - right) * QUICK_DX, 0, 0], duration: 0.58, rateFunc: smooth }),
  )
  ;[items[left], items[right]] = [items[right], items[left]]
}

function quickPointer(label: 'i' | 'j', start: number, index: number) {
  return text(label, start + index * QUICK_DX, 1.28, label === 'i' ? C.blue : C.orange, 15, '800')
}

async function renderQuickAction(scene: Scene, action: QuickAction, step: number, total: number) {
  const { before, low, high, i, j } = action
  const pivot = before[high]
  const descriptions: Record<QuickAction['kind'], [string, string]> = {
    start: [`取右端元素 ${pivot} 作为 pivot`, 'i 从最左侧开始，j 从 pivot 左侧开始'],
    'find-i': [`i 向右找偏大元素`, i <= j ? `i 停在 ${before[i]}：${before[i]} > pivot` : 'i 已经越过 j，左侧扫描结束'],
    'find-j': [`j 向左找偏小元素`, i <= j ? `j 停在 ${before[j]}：${before[j]} < pivot` : 'j 向左移动后，i 已经大于 j'],
    swap: [`交换 ${before[i]} 与 ${before[j]}`, '偏大元素移到右侧，偏小元素移到左侧；i、j 暂时停在原位'],
    advance: ['交换完成，准备继续扫描', 'i 向右移动一格，j 向左移动一格'],
    cross: [`扫描停止：i = ${i} > j = ${j}`, 'i 与 j 已经交错，不再继续交换普通元素'],
    pivot: [`pivot ${pivot} 与 i 所指元素 ${before[i]} 交换`, `pivot 固定在下标 ${i}；左右子区间再递归执行同样的划分`],
  }
  const [title, note] = descriptions[action.kind]
  quickHeading(scene, `第 ${step}/${total} 步：${title}`, note)
  const array = quickArray(scene, before)
  scene.add(quickRange(array.start, low, high))
  const pivotFrame = frame(array.start + high * QUICK_DX, QUICK_Y, C.violet)
  const pivotLabel = text('pivot', array.start + high * QUICK_DX, 1.36, C.violet, 14, '800')
  scene.add(pivotFrame, pivotLabel)

  if (action.kind === 'start') {
    scene.add(quickPointer('i', array.start, i), quickPointer('j', array.start, j))
    await scene.play(new Indicate(array.items[high], { color: C.violet, scaleFactor: 1.14, duration: 0.42 }))
    return
  }

  if (action.kind === 'find-i' || action.kind === 'find-j') {
    const active = action.kind === 'find-i' ? 'i' : 'j'
    const color = active === 'i' ? C.blue : C.orange
    const pointer = quickPointer(active, array.start, action.from!)
    const other = quickPointer(active === 'i' ? 'j' : 'i', array.start, active === 'i' ? j : i)
    scene.add(pointer, other)
    let pointerIndex = action.from!
    for (const index of action.scanned ?? []) {
      if (index !== pointerIndex) {
        await scene.play(new Shift(pointer, { direction: [(index - pointerIndex) * QUICK_DX, 0, 0], duration: 0.34, rateFunc: smooth }))
        pointerIndex = index
      }
      const check = frame(array.start + index * QUICK_DX, QUICK_Y, color)
      await reveal(scene, check)
      await scene.play(new Indicate(array.items[index], { color, scaleFactor: 1.1, duration: 0.25 }))
    }
    if (pointerIndex !== action.to) {
      await scene.play(new Shift(pointer, { direction: [(action.to! - pointerIndex) * QUICK_DX, 0, 0], duration: 0.34, rateFunc: smooth }))
    }
    return
  }

  if (action.kind === 'swap') {
    const iLabel = quickPointer('i', array.start, i)
    const jLabel = quickPointer('j', array.start, j)
    scene.add(iLabel, jLabel)
    await reveal(scene, frame(array.start + i * QUICK_DX, QUICK_Y, C.blue), frame(array.start + j * QUICK_DX, QUICK_Y, C.orange))
    await quickSwap(scene, array.items, i, j)
    return
  }

  if (action.kind === 'advance') {
    const iLabel = quickPointer('i', array.start, i)
    const jLabel = quickPointer('j', array.start, j)
    scene.add(iLabel, jLabel)
    await scene.play(
      new Shift(iLabel, { direction: [(action.nextI! - i) * QUICK_DX, 0, 0], duration: 0.34, rateFunc: smooth }),
      new Shift(jLabel, { direction: [(action.nextJ! - j) * QUICK_DX, 0, 0], duration: 0.34, rateFunc: smooth }),
    )
    return
  }

  if (action.kind === 'cross') {
    scene.add(quickPointer('i', array.start, i), quickPointer('j', array.start, j))
    await reveal(scene, frame(array.start + i * QUICK_DX, QUICK_Y, C.blue), frame(array.start + j * QUICK_DX, QUICK_Y, C.orange))
    const relation = text(`i = ${i}  >  j = ${j}`, 0, -1.35, C.red, 21, '800')
    scene.add(relation)
    await scene.play(new FadeIn(relation, { duration: 0.3 }))
    return
  }

  scene.add(quickPointer('i', array.start, i), quickPointer('j', array.start, j))
  await reveal(scene, frame(array.start + i * QUICK_DX, QUICK_Y, C.blue))
  await scene.play(
    new Shift(array.items[i], { direction: [(high - i) * QUICK_DX, 0, 0], duration: 0.62, rateFunc: smooth }),
    new Shift(array.items[high], { direction: [(i - high) * QUICK_DX, 0, 0], duration: 0.62, rateFunc: smooth }),
    new Shift(pivotFrame, { direction: [(i - high) * QUICK_DX, 0, 0], duration: 0.62, rateFunc: smooth }),
    new Shift(pivotLabel, { direction: [(i - high) * QUICK_DX, 0, 0], duration: 0.62, rateFunc: smooth }),
  )
  await reveal(scene, frame(array.start + i * QUICK_DX, QUICK_Y, C.green))
}

const quickActions = buildQuickActions()

export const quickSortAnimation: ManimWebAnimation = {
  id: 'quick-sort',
  ariaLabel: '快速排序的一次划分：i 找偏大元素，j 找偏小元素，交换后继续扫描，i 越过 j 后 pivot 与 i 交换',
  initialState: {
    id: 'quick-sort-overview',
    render: scene => {
      quickHeading(scene, '快速排序：一次完整划分', '这次划分确定 pivot 的最终位置；左右子区间递归执行相同操作')
      quickArray(scene, QUICK_VALUES)
      scene.render()
    },
  },
  scene: { width: 1100, height: 620, frameWidth: 12, frameHeight: 6.8, backgroundColor: '#ffffff' },
  steps: quickActions.map((action, index) => ({
    id: `quick-action-${index + 1}`,
    render: async scene => { await renderQuickAction(scene, action, index + 1, quickActions.length); scene.render() },
  })),
}

// ---------------------------------------------------------------------------
// 堆排序：数组与完全二叉树同步移动。

const HEAP_VALUES = [45, 87, 78, 32, 17, 65, 53, 9]
const HEAP_DX = 1.02
const HEAP_ARRAY_Y = -2.55
const HEAP_POS: Array<readonly [number, number]> = [
  [0, 2.3], [-2.55, 1.2], [2.55, 1.2],
  [-3.85, 0.05], [-1.28, 0.05], [1.28, 0.05], [3.85, 0.05],
  [-4.5, -1.08],
]

function heapHeading(scene: Scene, title: string, note: string) {
  scene.add(text(title, 0, 3.7, C.ink, 24, '800'), text(note, 0, 3.18, C.muted, 15, '600'))
}

type HeapView = {
  start: number
  arrayLabels: Text[]
  treeLabels: Text[]
  circles: Circle[]
  edges: Record<number, Arrow>
}

function heapEdge(parent: number, child: number) {
  const [px, py] = HEAP_POS[parent]
  const [cx, cy] = HEAP_POS[child]
  const dx = cx - px
  const dy = cy - py
  const length = Math.sqrt(dx * dx + dy * dy)
  const ux = dx / length
  const uy = dy / length
  return new Arrow({
    start: [px + ux * 0.38, py + uy * 0.38, 0], end: [cx - ux * 0.38, cy - uy * 0.38, 0],
    color: C.line, strokeWidth: 2, tipLength: 0.08,
  })
}

function heapDownArrow(parent: number, child: number) {
  const [px, py] = HEAP_POS[parent]
  const [cx, cy] = HEAP_POS[child]
  const dx = cx - px
  const dy = cy - py
  const length = Math.sqrt(dx * dx + dy * dy)
  const ux = dx / length
  const uy = dy / length
  return new Arrow({
    start: [px + ux * 0.48, py + uy * 0.48, 0], end: [cx - ux * 0.48, cy - uy * 0.48, 0],
    color: C.orange, strokeWidth: 5, tipLength: 0.17,
  })
}

function drawHeap(scene: Scene, values: number[], heapSize: number): HeapView {
  const start = -(values.length - 1) * HEAP_DX / 2
  const cells = values.map((_, index) => new Rectangle({
    width: 0.92, height: 0.72, center: [start + index * HEAP_DX, HEAP_ARRAY_Y, 0],
    color: index < heapSize ? C.line : C.green,
    fillOpacity: index < heapSize ? 0.02 : 0.06, strokeWidth: index < heapSize ? 1.8 : 2.5,
  }))
  const arrayLabels = values.map((value, index) => mono(String(value), start + index * HEAP_DX, HEAP_ARRAY_Y, index < heapSize ? C.ink : C.green, 17))
  scene.add(...cells, ...arrayLabels, ...values.map((_, index) => mono(String(index), start + index * HEAP_DX, HEAP_ARRAY_Y - 0.58, C.muted, 11)))
  scene.add(text('数组', start - 0.85, HEAP_ARRAY_Y, C.muted, 14, '800'))

  const edges: Record<number, Arrow> = {}
  for (let child = 1; child < heapSize; child++) {
    edges[child] = heapEdge(Math.floor((child - 1) / 2), child)
    scene.add(edges[child])
  }
  const circles: Circle[] = []
  const treeLabels: Text[] = []
  for (let index = 0; index < heapSize; index++) {
    const [x, y] = HEAP_POS[index]
    const circle = new Circle({ radius: 0.34, center: [x, y, 0], color: C.blue, fillOpacity: 0.08, strokeWidth: 2.2 })
    const label = mono(String(values[index]), x, y, C.ink, 16)
    circles[index] = circle
    treeLabels[index] = label
    scene.add(circle, label)
  }
  scene.add(text('完全二叉堆', 0, 2.84, C.blue, 15, '800'))
  return { start, arrayLabels, treeLabels, circles, edges }
}

async function heapSwap(scene: Scene, view: HeapView, left: number, right: number) {
  const [lx, ly] = HEAP_POS[left]
  const [rx, ry] = HEAP_POS[right]
  await scene.play(
    new Shift(view.arrayLabels[left], { direction: [(right - left) * HEAP_DX, 0, 0], duration: 0.5, rateFunc: smooth }),
    new Shift(view.arrayLabels[right], { direction: [(left - right) * HEAP_DX, 0, 0], duration: 0.5, rateFunc: smooth }),
    new Shift(view.treeLabels[left], { direction: [rx - lx, ry - ly, 0], duration: 0.5, rateFunc: smooth }),
    new Shift(view.treeLabels[right], { direction: [lx - rx, ly - ry, 0], duration: 0.5, rateFunc: smooth }),
  )
  ;[view.arrayLabels[left], view.arrayLabels[right]] = [view.arrayLabels[right], view.arrayLabels[left]]
  ;[view.treeLabels[left], view.treeLabels[right]] = [view.treeLabels[right], view.treeLabels[left]]
}

function siftDown(values: number[], heapSize: number, root: number) {
  let current = root
  while (true) {
    const left = current * 2 + 1
    const right = left + 1
    let largest = current
    if (left < heapSize && values[left] > values[largest]) largest = left
    if (right < heapSize && values[right] > values[largest]) largest = right
    if (largest === current) return
    ;[values[current], values[largest]] = [values[largest], values[current]]
    current = largest
  }
}

async function animateSiftDown(scene: Scene, values: number[], heapSize: number, root: number, view: HeapView) {
  let current = root
  while (true) {
    const children = [current * 2 + 1, current * 2 + 2].filter(index => index < heapSize)
    const rings = [current, ...children].map(index => {
      const [x, y] = HEAP_POS[index]
      return new Circle({ radius: 0.44, center: [x, y, 0], color: index === current ? C.blue : C.orange, fillOpacity: 0, strokeWidth: 3 })
    })
    scene.add(...rings)
    await scene.play(...rings.map(ring => new FadeIn(ring, { duration: 0.2 })))
    let largest = current
    for (const child of children) {
      await scene.play(new Indicate(view.treeLabels[child], { color: C.orange, scaleFactor: 1.12, duration: 0.28 }))
      if (values[child] > values[largest]) largest = child
    }
    if (largest === current) {
      const compared = [current, ...children]
      const comparedX = compared.map(index => HEAP_POS[index][0])
      const comparedY = compared.map(index => HEAP_POS[index][1])
      const minX = Math.min(...comparedX)
      const maxX = Math.max(...comparedX)
      const minY = Math.min(...comparedY)
      const maxY = Math.max(...comparedY)
      const subtreeFrame = new Rectangle({
        width: maxX - minX + 1.05,
        height: maxY - minY + 0.95,
        center: [(minX + maxX) / 2, (minY + maxY) / 2, 0],
        color: C.orange, fillOpacity: 0.018, strokeWidth: 2.6,
      })
      const labelX = minX < -3.4 ? maxX + 0.74 : minX - 0.74
      const noSwapLabel = text('无需交换', labelX, (minY + maxY) / 2, C.orange, 15, '800')
      scene.add(subtreeFrame, noSwapLabel)
      await scene.play(
        new FadeIn(subtreeFrame, { duration: 0.24 }),
        new FadeIn(noSwapLabel, { duration: 0.24 }),
      )
      return
    }
    await scene.play(...rings.map(ring => new FadeOut(ring, { duration: 0.14 })))
    const downArrow = heapDownArrow(current, largest)
    scene.add(downArrow)
    await scene.play(new FadeIn(downArrow, { duration: 0.24 }))
    await heapSwap(scene, view, current, largest)
    await scene.play(new FadeOut(downArrow, { duration: 0.16 }))
    ;[values[current], values[largest]] = [values[largest], values[current]]
    current = largest
  }
}

type HeapRecord =
  | { phase: 'build'; before: number[]; root: number; order: number }
  | { phase: 'extract'; before: number[]; end: number; order: number }
  | { phase: 'adjust'; before: number[]; end: number; order: number }

function buildHeapRecords() {
  const values = [...HEAP_VALUES]
  const records: HeapRecord[] = []
  let order = 1
  for (let root = Math.floor(values.length / 2) - 1; root >= 0; root--) {
    records.push({ phase: 'build', before: [...values], root, order: order++ })
    siftDown(values, values.length, root)
  }
  for (let end = values.length - 1; end > 0; end--) {
    records.push({ phase: 'extract', before: [...values], end, order: order++ })
    ;[values[0], values[end]] = [values[end], values[0]]
    records.push({ phase: 'adjust', before: [...values], end, order: order++ })
    siftDown(values, end, 0)
  }
  return records
}

async function renderHeapRecord(scene: Scene, record: HeapRecord) {
  const values = [...record.before]
  if (record.phase === 'build') {
    heapHeading(scene, `建堆第 ${4 - record.root} 步：调整下标 ${record.root}`, '数组下标关系与树中父子关系一一对应')
    const view = drawHeap(scene, values, values.length)
    await animateSiftDown(scene, values, values.length, record.root, view)
    return
  }

  const pass = HEAP_VALUES.length - record.end
  if (record.phase === 'extract') {
    const heapSize = record.end + 1
    heapHeading(scene, `排序第 ${pass} 趟①：堆顶换到无序区末尾`, `只交换下标 0 与 ${record.end}，本步不调整剩余堆`)
    const view = drawHeap(scene, values, heapSize)
    await reveal(scene,
      frame(view.start, HEAP_ARRAY_Y, C.orange, 0.94, 0.76),
      frame(view.start + record.end * HEAP_DX, HEAP_ARRAY_Y, C.orange, 0.94, 0.76),
    )
    await heapSwap(scene, view, 0, record.end)
    ;[values[0], values[record.end]] = [values[record.end], values[0]]
    const removed = [view.circles[record.end], view.treeLabels[record.end], view.edges[record.end]]
      .filter((object): object is Circle | Text | Arrow => object !== undefined)
    await scene.play(...removed.map(object => new FadeOut(object, { duration: 0.28 })))
    await reveal(scene, new Rectangle({
      width: (HEAP_VALUES.length - record.end) * HEAP_DX,
      height: 0.84,
      center: [view.start + (record.end + HEAP_VALUES.length - 1) * HEAP_DX / 2, HEAP_ARRAY_Y, 0],
      color: C.green, fillOpacity: 0.025, strokeWidth: 2.7,
    }))
    return
  }

  heapHeading(scene, `排序第 ${pass} 趟②：向下调整剩余堆`, '从新的堆顶开始，只在剩余无序区中恢复大根堆')
  const view = drawHeap(scene, values, record.end)
  await animateSiftDown(scene, values, record.end, 0, view)
  const sortedStart = record.end === 1 ? 0 : record.end
  await reveal(scene, new Rectangle({
    width: (HEAP_VALUES.length - sortedStart) * HEAP_DX,
    height: 0.84,
    center: [view.start + (sortedStart + HEAP_VALUES.length - 1) * HEAP_DX / 2, HEAP_ARRAY_Y, 0],
    color: C.green, fillOpacity: 0.025, strokeWidth: 2.7,
  }))
}

const heapRecords = buildHeapRecords()

export const heapSortAnimation: ManimWebAnimation = {
  id: 'heap-sort',
  ariaLabel: '堆排序使用八个元素同步展示数组和完全二叉堆，并把堆顶交换与剩余堆向下调整分成独立步骤',
  initialState: {
    id: 'heap-sort-overview',
    render: scene => {
      heapHeading(scene, '堆排序：数组与完全二叉堆对照', '先从最后一个非叶结点开始建大根堆，再逐个取出堆顶')
      drawHeap(scene, HEAP_VALUES, HEAP_VALUES.length)
      scene.render()
    },
  },
  scene: { width: 1200, height: 800, frameWidth: 13, frameHeight: 8.6, backgroundColor: '#ffffff' },
  steps: heapRecords.map(record => ({
    id: `heap-${record.phase}-${record.order}`,
    render: async scene => { await renderHeapRecord(scene, record); scene.render() },
  })),
}

// ---------------------------------------------------------------------------
// 基数排序：每一位都完整分配和收集。

const RADIX_VALUES = [329, 457, 657, 839, 436, 720, 355]
const RADIX_DX = 1.28
const RADIX_ARRAY_Y = 2.1
const BUCKET_X = Array.from({ length: 10 }, (_, index) => -5.4 + index * 1.2)

function radixHeading(scene: Scene, title: string, note: string) {
  scene.add(text(title, 0, 3.65, C.ink, 24, '800'), text(note, 0, 3.15, C.muted, 15, '600'))
}

function radixArray(scene: Scene, values: number[]) {
  const start = -(values.length - 1) * RADIX_DX / 2
  const cells = values.map((_, index) => new Rectangle({
    width: 1.12, height: 0.76, center: [start + index * RADIX_DX, RADIX_ARRAY_Y, 0],
    color: C.line, fillOpacity: 0.02, strokeWidth: 1.9,
  }))
  const labels = values.map((value, index) => mono(String(value), start + index * RADIX_DX, RADIX_ARRAY_Y, C.ink, 17))
  scene.add(...cells, ...labels)
  return { start, labels }
}

function drawBuckets(scene: Scene) {
  const buckets = BUCKET_X.map(x => new Rectangle({
    width: 1.02, height: 2.75, center: [x, -0.15, 0],
    color: C.line, fillOpacity: 0.012, strokeWidth: 1.6,
  }))
  scene.add(...buckets, ...BUCKET_X.map((x, digit) => text(String(digit), x, -1.82, C.muted, 14, '800')))
}

type RadixRecord = { before: number[]; divisor: number; name: string }

function buildRadixRecords() {
  const values = [...RADIX_VALUES]
  const records: RadixRecord[] = []
  for (const [divisor, name] of [[1, '个位'], [10, '十位'], [100, '百位']] as const) {
    records.push({ before: [...values], divisor, name })
    const buckets = Array.from({ length: 10 }, () => [] as number[])
    values.forEach(value => buckets[Math.floor(value / divisor) % 10].push(value))
    values.splice(0, values.length, ...buckets.flat())
  }
  return records
}

type RadixPlacement = { value: number; index: number; digit: number; x: number; y: number }

function radixPlacements(values: number[], divisor: number) {
  const counts = Array(10).fill(0) as number[]
  return values.map((value, index): RadixPlacement => {
    const digit = Math.floor(value / divisor) % 10
    const slot = counts[digit]++
    return { value, index, digit, x: BUCKET_X[digit], y: 0.82 - slot * 0.62 }
  })
}

function radixEmptyArray(scene: Scene, length: number) {
  const start = -(length - 1) * RADIX_DX / 2
  const cells = Array.from({ length }, (_, index) => new Rectangle({
    width: 1.12, height: 0.76, center: [start + index * RADIX_DX, RADIX_ARRAY_Y, 0],
    color: C.line, fillOpacity: 0.02, strokeWidth: 1.9,
  }))
  scene.add(...cells)
  return start
}

async function renderRadixDistribution(scene: Scene, record: RadixRecord, pass: number) {
  radixHeading(scene, `第 ${pass} 趟（1/2）：按${record.name}分配`, `本步只入桶：读取${record.name}，并按原先后顺序放入对应桶`)
  const array = radixArray(scene, record.before)
  drawBuckets(scene)
  for (const placement of radixPlacements(record.before, record.divisor)) {
    const digitFrame = frame(array.start + placement.index * RADIX_DX, RADIX_ARRAY_Y, C.orange, 1.14, 0.78)
    await reveal(scene, digitFrame)
    await scene.play(new Shift(array.labels[placement.index], {
      direction: [placement.x - (array.start + placement.index * RADIX_DX), placement.y - RADIX_ARRAY_Y, 0],
      duration: 0.48, rateFunc: smooth,
    }))
    await scene.play(new FadeOut(digitFrame, { duration: 0.12 }))
  }
}

async function renderRadixCollection(scene: Scene, record: RadixRecord, pass: number) {
  radixHeading(scene, `第 ${pass} 趟（2/2）：按桶号收集`, '本步只收集：从 0 号桶到 9 号桶，保持每个桶内的先后顺序')
  const start = radixEmptyArray(scene, record.before.length)
  drawBuckets(scene)
  const placements = radixPlacements(record.before, record.divisor)
  const bucketItems = Array.from({ length: 10 }, () => [] as Array<{ item: Text; x: number; y: number }>)
  for (const placement of placements) {
    const item = mono(String(placement.value), placement.x, placement.y, C.ink, 17)
    bucketItems[placement.digit].push({ item, x: placement.x, y: placement.y })
    scene.add(item)
  }

  let outputIndex = 0
  for (let digit = 0; digit < 10; digit++) {
    const bucketFrame = frame(BUCKET_X[digit], -0.15, C.blue, 1.06, 2.8)
    if (bucketItems[digit].length > 0) await reveal(scene, bucketFrame)
    for (const entry of bucketItems[digit]) {
      const targetX = start + outputIndex * RADIX_DX
      await scene.play(new Shift(entry.item, {
        direction: [targetX - entry.x, RADIX_ARRAY_Y - entry.y, 0],
        duration: 0.48, rateFunc: smooth,
      }))
      outputIndex++
    }
    if (bucketItems[digit].length > 0) await scene.play(new FadeOut(bucketFrame, { duration: 0.12 }))
  }
  await reveal(scene, new Rectangle({
    width: record.before.length * RADIX_DX,
    height: 0.84,
    center: [0, RADIX_ARRAY_Y, 0],
    color: C.green, fillOpacity: 0.025, strokeWidth: 2.7,
  }))
}

const radixRecords = buildRadixRecords()

export const radixSortAnimation: ManimWebAnimation = {
  id: 'radix-sort',
  ariaLabel: '基数排序将个位、十位和百位每一趟拆成稳定分配与按桶号收集两个独立步骤',
  initialState: {
    id: 'radix-sort-overview',
    render: scene => {
      radixHeading(scene, '基数排序', '个位、十位、百位分别先分配入桶，再按桶号收集')
      radixArray(scene, RADIX_VALUES)
      drawBuckets(scene)
      scene.render()
    },
  },
  scene: { width: 1200, height: 780, frameWidth: 13, frameHeight: 8.4, backgroundColor: '#ffffff' },
  steps: radixRecords.flatMap((record, index) => [
    {
      id: `radix-distribute-${index + 1}`,
      render: async (scene: Scene) => { await renderRadixDistribution(scene, record, index + 1); scene.render() },
    },
    {
      id: `radix-collect-${index + 1}`,
      render: async (scene: Scene) => { await renderRadixCollection(scene, record, index + 1); scene.render() },
    },
  ]),
}
