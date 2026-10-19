import {
  FadeIn,
  FadeOut,
  Indicate,
  Rectangle,
  Shift,
  Text,
  Transform,
  VGroup,
  linear,
  smooth,
  type Scene,
} from '@/animations/manim'
import type { ManimWebAnimation } from '../../types'

const C = {
  ink: '#0f172a',
  text: '#334155',
  muted: '#64748b',
  line: '#cbd5e1',
  blue: '#1d4ed8',
  blueFill: '#dbeafe',
  orange: '#c2410c',
  orangeFill: '#ffedd5',
  red: '#dc2626',
  green: '#047857',
} as const

const CELL_X = [-4.5, -3.05, -1.6, -0.15, 1.3, 2.75, 4.2] as const
const CELL_Y = 0.55
const VALUES_Y = 0.58
const INITIAL = ['12', '25', '38', '51', '64'] as const
const INSERTED = ['12', '25', '30', '38', '51', '64'] as const
const DELETED = ['12', '30', '38', '51', '64'] as const

type ValueMobject = Text

function label(content: string, x: number, y: number, color: string = C.ink, size = 19, weight = '700') {
  return new Text({
    text: content,
    color,
    fontSize: size,
    fontFamily: 'Noto Sans SC, PingFang SC, sans-serif',
    fontWeight: weight,
  }).moveTo([x, y, 0])
}

function mono(content: string, x: number, y: number, color: string = C.ink, size = 23) {
  return new Text({
    text: content,
    color,
    fontSize: size,
    fontFamily: 'JetBrains Mono, Menlo, monospace',
    fontWeight: '700',
  }).moveTo([x, y, 0])
}

function cell(index: number) {
  return new Rectangle({
    width: 1.34,
    height: 1.02,
    center: [CELL_X[index], CELL_Y, 0],
    color: C.line,
    fillOpacity: 0.035,
    strokeWidth: 2.2,
  })
}

function structure(heading: string, length: number | null) {
  const items: (Rectangle | Text)[] = [
    label(heading, 0, 2.45, C.ink, 27, '800'),
    label('顺序表（容量 7）', -4.1, 1.45, C.muted, 15),
    ...CELL_X.map((_, index) => cell(index)),
    ...CELL_X.map((x, index) => mono(String(index), x, -0.18, C.muted, 14)),
  ]

  if (length !== null) items.push(label(`表长 n = ${length}`, 4.05, 1.45, C.muted, 15))
  return items
}

function values(contents: readonly string[]): ValueMobject[] {
  return contents.map((content, index) => mono(content, CELL_X[index], VALUES_Y))
}

function addStatic(scene: Scene, heading: string, contents: readonly string[], length: number, note: string, noteColor: string = C.text) {
  const valueMobjects = values(contents)
  scene.add(...structure(heading, length), ...valueMobjects, label(note, 0, -1.35, noteColor, 17))
  return valueMobjects
}

async function animateLoad(scene: Scene) {
  const heading = '先把 5 个元素依次存入连续单元'
  const base = structure(heading, null)
  const valueMobjects = values(INITIAL)
  const length = label('表长 n = 5', 4.05, 1.45, C.muted, 15)
  const note = label('逻辑相邻，物理地址也相邻', 0, -1.35, C.text, 17)
  scene.add(...base, ...valueMobjects, length, note)
  await scene.play(
    ...valueMobjects.map((value, index) => new FadeIn(value, {
      duration: 0.45 + index * 0.06,
      shift: [0, 0.25, 0],
      rateFunc: smooth,
    })),
    new FadeIn(length, { duration: 0.45 }),
    new FadeIn(note, { duration: 0.45 }),
  )
}

async function animateBackwardShift(scene: Scene) {
  const valuesBefore = addStatic(
    scene,
    '在下标 i = 2 插入 30：必须从后往前移动',
    INITIAL,
    5,
    '从最后一个元素开始，逐个向后搬一格',
    C.blue,
  )
  const candidate = mono('30', CELL_X[2], 1.72, C.orange, 25)
  const condition = label('j = 5 → 4 → 3，循环条件 j > i', 0, -1.92, C.blue, 16)
  scene.add(candidate, condition)
  await scene.play(new FadeIn(candidate, { duration: 0.35 }), new FadeIn(condition, { duration: 0.35 }))

  for (let source = 4; source >= 2; source -= 1) {
    await scene.play(new Indicate(valuesBefore[source], { color: C.blue, scaleFactor: 1.18, duration: 0.38 }))
    await scene.play(new Shift(valuesBefore[source], {
      direction: [CELL_X[source + 1] - CELL_X[source], 0, 0],
      duration: 0.68,
      rateFunc: linear,
    }))
  }

  await scene.play(new Indicate(candidate, { color: C.orange, scaleFactor: 1.16, duration: 0.45 }))
}

async function animateWriteInsertedValue(scene: Scene) {
  const before = ['12', '25', '', '38', '51', '64']
  const valueMobjects = values(before)
  scene.add(
    ...structure('空位已经留出：把 30 写入下标 2', null),
    ...valueMobjects,
    label('a[i] = e，然后 n++', 0, -1.35, C.orange, 17),
  )
  const source = mono('30', CELL_X[2], 1.72, C.orange, 25)
  const nextLength = label('表长 n = 6', 4.05, 1.45, C.green, 15)
  const oldLength = label('表长 n = 5', 4.05, 1.45, C.muted, 15)
  scene.add(source)
  await scene.play(new Shift(source, {
    direction: [0, VALUES_Y - 1.72, 0],
    duration: 0.8,
    rateFunc: linear,
  }))
  valueMobjects[2] = source
  scene.add(oldLength)
  await scene.play(new Transform(oldLength, nextLength, { duration: 0.55, rateFunc: smooth }))
  await scene.play(new Indicate(source, { color: C.orange, scaleFactor: 1.2, duration: 0.5 }))
}

async function animateLocateDelete(scene: Scene) {
  const valueMobjects = addStatic(
    scene,
    '删除下标 i = 1 的元素 25',
    INSERTED,
    6,
    '先定位待删元素，再让后继元素依次向前覆盖',
    C.red,
  )
  const target = new Rectangle({
    width: 1.18,
    height: 0.86,
    center: [CELL_X[1], CELL_Y, 0],
    color: C.red,
    fillOpacity: 0.08,
    strokeWidth: 3,
  })
  scene.add(target)
  await scene.play(new FadeIn(target, { duration: 0.4 }))
  await scene.play(new Indicate(valueMobjects[1], { color: C.red, scaleFactor: 1.22, duration: 0.65 }))
}

async function animateForwardCover(scene: Scene) {
  const valueMobjects = addStatic(
    scene,
    '从待删位置开始，用后一个元素向前覆盖',
    INSERTED,
    6,
    'j = 1 → 2 → 3 → 4，循环条件 j < n - 1',
    C.blue,
  )
  const target = valueMobjects[1]
  await scene.play(new FadeOut(target, { duration: 0.4, shift: [0, -0.25, 0], rateFunc: smooth }))

  for (let source = 2; source < INSERTED.length; source += 1) {
    await scene.play(new Indicate(valueMobjects[source], { color: C.blue, scaleFactor: 1.16, duration: 0.34 }))
    await scene.play(new Shift(valueMobjects[source], {
      direction: [CELL_X[source - 1] - CELL_X[source], 0, 0],
      duration: 0.62,
      rateFunc: linear,
    }))
  }
}

async function animateFinishDelete(scene: Scene) {
  const valueMobjects = values(DELETED)
  scene.add(
    ...structure('删除完成：有效元素仍连续存放', null),
    ...valueMobjects,
    label('n--，尾部旧单元不再属于顺序表', 0, -1.35, C.green, 17),
  )
  const oldLength = label('表长 n = 6', 4.05, 1.45, C.muted, 15)
  const nextLength = label('表长 n = 5', 4.05, 1.45, C.green, 15)
  scene.add(oldLength)
  await scene.play(new Transform(oldLength, nextLength, { duration: 0.55, rateFunc: smooth }))
  await scene.play(...valueMobjects.map(value => new Indicate(value, { color: C.green, scaleFactor: 1.08, duration: 0.65 })))
}

const STEPS = [
  { id: 'sequential-list-load', render: animateLoad },
  { id: 'sequential-list-shift-backward', render: animateBackwardShift },
  { id: 'sequential-list-write', render: animateWriteInsertedValue },
  { id: 'sequential-list-locate-delete', render: animateLocateDelete },
  { id: 'sequential-list-cover-forward', render: animateForwardCover },
  { id: 'sequential-list-delete-finish', render: animateFinishDelete },
] as const

function renderStatic(scene: Scene, index: number) {
  if (index === 0) addStatic(scene, '先把 5 个元素依次存入连续单元', INITIAL, 5, '逻辑相邻，物理地址也相邻')
  if (index === 1) addStatic(scene, '在下标 i = 2 插入 30：必须从后往前移动', ['12', '25', '', '38', '51', '64'], 5, '从最后一个元素开始，逐个向后搬一格', C.blue)
  if (index === 2) addStatic(scene, '空位已经留出：把 30 写入下标 2', INSERTED, 6, 'a[i] = e，然后 n++', C.orange)
  if (index === 3) addStatic(scene, '删除下标 i = 1 的元素 25', INSERTED, 6, '先定位待删元素，再让后继元素依次向前覆盖', C.red)
  if (index === 4) addStatic(scene, '从待删位置开始，用后一个元素向前覆盖', DELETED, 6, 'j = 1 → 2 → 3 → 4，循环条件 j < n - 1', C.blue)
  if (index === 5) addStatic(scene, '删除完成：有效元素仍连续存放', DELETED, 5, 'n--，尾部旧单元不再属于顺序表', C.green)
}

export const sequentialListInsertDeleteAnimation: ManimWebAnimation = {
  id: 'sequential-list-insert-delete',
  ariaLabel: '顺序表从后向前移动完成插入、从前向后覆盖完成删除的分步动画',
  initialState: {
    id: 'sequential-list-empty-structure',
    render: scene => {
      scene.add(...structure('顺序表的插入与删除', null), label('元素按下标连续存放，插入和删除都需要移动后续元素', 0, -1.35, C.muted, 17))
      scene.render()
    },
  },
  scene: { width: 1000, height: 500, frameWidth: 12, frameHeight: 6, backgroundColor: '#ffffff' },
  steps: STEPS.map((step, index) => ({
    id: step.id,
    render: async (scene, animate) => {
      if (animate) await step.render(scene)
      else renderStatic(scene, index)
      scene.render()
    },
  })),
}
