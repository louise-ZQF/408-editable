import {
  Arrow,
  FadeIn,
  FadeOut,
  Indicate,
  Line,
  Rectangle,
  Text,
  VGroup,
  smooth,
  type Scene,
} from '@/animations/manim'
import type { ManimWebAnimation } from '../../types'

const C = {
  ink: '#0f172a',
  text: '#334155',
  muted: '#64748b',
  line: '#94a3b8',
  blue: '#1d4ed8',
  orange: '#c2410c',
  red: '#dc2626',
  green: '#047857',
} as const

const INITIAL_X = [-4.5, -1.8, 0.9, 3.6] as const
const INSERTED_X = [-4.6, -2.3, 0, 2.3, 4.6] as const
const NODE_Y = 0.45

type NodeVisual = {
  group: VGroup
  box: Rectangle
  value: string
  x: number
}

function label(content: string, x: number, y: number, color: string = C.ink, size = 18, weight = '700') {
  return new Text({
    text: content,
    color,
    fontSize: size,
    fontFamily: 'Noto Sans SC, PingFang SC, sans-serif',
    fontWeight: weight,
  }).moveTo([x, y, 0])
}

function mono(content: string, x: number, y: number, color: string = C.ink, size = 20) {
  return new Text({
    text: content,
    color,
    fontSize: size,
    fontFamily: 'JetBrains Mono, Menlo, monospace',
    fontWeight: '700',
  }).moveTo([x, y, 0])
}

function node(value: string, x: number, y = NODE_Y, color: string = C.ink): NodeVisual {
  const box = new Rectangle({
    width: 1.65,
    height: 0.9,
    center: [x, y, 0],
    color: C.line,
    fillOpacity: 0.04,
    strokeWidth: 2.2,
  })
  const divider = new Line({ start: [x + 0.48, y + 0.45, 0], end: [x + 0.48, y - 0.45, 0], color: C.line, strokeWidth: 2 })
  const data = mono(value, x - 0.22, y, color, 22)
  const pointer = mono('•', x + 0.66, y, C.line, 18)
  return { group: new VGroup(box, divider, data, pointer), box, value, x }
}

function link(fromX: number, toX: number, color: string = C.ink) {
  return new Arrow({
    start: [fromX + 0.68, NODE_Y, 0],
    end: [toX - 0.86, NODE_Y, 0],
    color,
    strokeWidth: 3,
    tipLength: 0.18,
    tipWidth: 0.12,
  })
}

function nullEnd(lastX: number) {
  const text = mono('NULL', lastX + 1.16, NODE_Y, C.muted, 15)
  const arrow = new Arrow({
    start: [lastX + 0.68, NODE_Y, 0],
    end: [lastX + 0.91, NODE_Y, 0],
    color: C.ink,
    strokeWidth: 3,
    tipLength: 0.16,
  })
  return { text, arrow }
}

function heading(title: string, note: string, noteColor: string = C.text) {
  return [label(title, 0, 2.55, C.ink, 27, '800'), label(note, 0, -1.7, noteColor, 17)]
}

function initialChain() {
  const nodes = ['10', '20', '40', '50'].map((value, index) => node(value, INITIAL_X[index]))
  const links = INITIAL_X.slice(0, -1).map((x, index) => link(x, INITIAL_X[index + 1]))
  const end = nullEnd(INITIAL_X[3])
  return { nodes, links, end }
}

function insertedChain() {
  const nodes = ['10', '20', '30', '40', '50'].map((value, index) => node(value, INSERTED_X[index], NODE_Y, value === '30' ? C.orange : C.ink))
  const links = INSERTED_X.slice(0, -1).map((x, index) => link(x, INSERTED_X[index + 1]))
  const end = nullEnd(INSERTED_X[4])
  return { nodes, links, end }
}

function addInitialChain(scene: Scene, title: string, note: string, noteColor: string = C.text) {
  const chain = initialChain()
  scene.add(...heading(title, note, noteColor), ...chain.nodes.map(item => item.group), ...chain.links, chain.end.arrow, chain.end.text)
  return chain
}

function addInsertedChain(scene: Scene, title: string, note: string, noteColor: string = C.text) {
  const chain = insertedChain()
  scene.add(...heading(title, note, noteColor), ...chain.nodes.map(item => item.group), ...chain.links, chain.end.arrow, chain.end.text)
  return chain
}

function pointerTag(name: string, x: number, color: string) {
  const text = label(name, x, 1.45, color, 16, '800')
  const arrow = new Arrow({ start: [x, 1.18, 0], end: [x, 0.92, 0], color, strokeWidth: 3, tipLength: 0.15 })
  return { text, arrow }
}

function routedArrow(points: [number, number, number][], color: string) {
  const segments = points.slice(0, -2).map((point, index) => new Line({
    start: point,
    end: points[index + 1],
    color,
    strokeWidth: 3.2,
  }))
  const arrow = new Arrow({
    start: points[points.length - 2],
    end: points[points.length - 1],
    color,
    strokeWidth: 3.2,
    tipLength: 0.18,
    tipWidth: 0.12,
  })
  return new VGroup(...segments, arrow)
}

async function animateLocateP(scene: Scene) {
  const chain = addInitialChain(scene, '在结点 p（20）后插入 30', '先定位前驱 p；插入本身只修改指针')
  const p = pointerTag('p（前驱）', INITIAL_X[1], C.blue)
  scene.add(p.text, p.arrow)
  await scene.play(new FadeIn(p.text, { duration: 0.35 }), new FadeIn(p.arrow, { duration: 0.35 }))
  await scene.play(new Indicate(chain.nodes[1].box, { color: C.blue, scaleFactor: 1.06, duration: 0.65 }))
}

async function animateAllocateS(scene: Scene) {
  const chain = addInitialChain(scene, '申请新结点 s，并写入 30', 's = malloc(sizeof(LNode))；s->data = 30', C.orange)
  const p = pointerTag('p（前驱）', INITIAL_X[1], C.blue)
  const s = node('30', 0.1, -0.75, C.orange)
  const sTag = label('s（新结点）', 0.1, -1.35, C.orange, 16, '800')
  scene.add(p.text, p.arrow, s.group, sTag)
  await scene.play(new FadeIn(s.group, { duration: 0.55, shift: [0, 0.3, 0], rateFunc: smooth }), new FadeIn(sTag, { duration: 0.4 }))
  await scene.play(new Indicate(s.box, { color: C.orange, scaleFactor: 1.06, duration: 0.55 }))
}

async function animateConnectSuccessor(scene: Scene) {
  const chain = addInitialChain(scene, '第一条指针：s->next = p->next', '先让新结点接住原后继 40，原链仍然完整', C.blue)
  const p = pointerTag('p', INITIAL_X[1], C.blue)
  const s = node('30', 0.1, -0.75, C.orange)
  const sTag = label('s', 0.1, -1.35, C.orange, 16, '800')
  const successor = chain.nodes[2]
  const newLink = routedArrow([
    [0.78, -0.75, 0],
    [1.42, -0.75, 0],
    [1.42, -0.1, 0],
    [successor.x, -0.1, 0],
    [successor.x, 0, 0],
  ], C.blue)
  scene.add(p.text, p.arrow, s.group, sTag, newLink)
  await scene.play(new Indicate(chain.links[1], { color: C.blue, scaleFactor: 1.05, duration: 0.5 }))
  await scene.play(new FadeIn(newLink, { duration: 0.8 }))
  await scene.play(new Indicate(successor.box, { color: C.blue, scaleFactor: 1.05, duration: 0.5 }))
}

async function animateConnectPredecessor(scene: Scene) {
  const chain = addInitialChain(scene, '第二条指针：p->next = s', '新结点已经接稳后继，现在才能改 p 的 next', C.green)
  const s = node('30', 0.1, -0.75, C.orange)
  const toSuccessor = routedArrow([
    [0.78, -0.75, 0],
    [1.42, -0.75, 0],
    [1.42, -0.1, 0],
    [INITIAL_X[2], -0.1, 0],
    [INITIAL_X[2], 0, 0],
  ], C.blue)
  const fromP = routedArrow([
    [INITIAL_X[1] + 0.68, NODE_Y, 0],
    [-0.78, NODE_Y, 0],
    [-0.78, -0.2, 0],
    [-0.72, -0.2, 0],
    [-0.72, -0.3, 0],
  ], C.green)
  scene.add(s.group, toSuccessor, fromP)
  await scene.play(new FadeIn(fromP, { duration: 0.75 }))
  await scene.play(new FadeOut(chain.links[1], { duration: 0.5, rateFunc: smooth }))
  await scene.play(new Indicate(s.box, { color: C.green, scaleFactor: 1.06, duration: 0.55 }))

  // 不为了“排整齐”移动物理结点：链式插入只改变两条 next 指针。
  // 下一学习步骤会以稳定的五结点布局重新构造已插入状态。
}

async function animateSaveQ(scene: Scene) {
  const chain = addInsertedChain(scene, '删除 40：先用 q 保存待删结点', 'q = p->next；此时 p 指向 30，q 指向 40', C.red)
  const p = pointerTag('p（前驱）', INSERTED_X[2], C.blue)
  const q = pointerTag('q（待删）', INSERTED_X[3], C.red)
  const target = new Rectangle({ width: 1.78, height: 1.03, center: [INSERTED_X[3], NODE_Y, 0], color: C.red, fillOpacity: 0.06, strokeWidth: 3 })
  scene.add(p.text, p.arrow, q.text, q.arrow, target)
  await scene.play(new FadeIn(p.text, { duration: 0.3 }), new FadeIn(p.arrow, { duration: 0.3 }))
  await scene.play(new FadeIn(q.text, { duration: 0.35 }), new FadeIn(q.arrow, { duration: 0.35 }), new FadeIn(target, { duration: 0.35 }))
  await scene.play(new Indicate(chain.nodes[3].box, { color: C.red, scaleFactor: 1.06, duration: 0.6 }))
}

async function animateBypassQ(scene: Scene) {
  const chain = addInsertedChain(scene, '跨过 q：p->next = q->next', '先建立 30 → 50，再断开通向 40 的旧指针', C.green)
  const p = pointerTag('p', INSERTED_X[2], C.blue)
  const q = pointerTag('q', INSERTED_X[3], C.red)
  const bypass = routedArrow([
    [INSERTED_X[2] + 0.68, NODE_Y, 0],
    [INSERTED_X[2] + 0.68, -0.45, 0],
    [INSERTED_X[4], -0.45, 0],
    [INSERTED_X[4], 0, 0],
  ], C.green)
  scene.add(p.text, p.arrow, q.text, q.arrow, bypass)
  await scene.play(new Indicate(chain.links[3], { color: C.green, scaleFactor: 1.04, duration: 0.45 }))
  await scene.play(new FadeIn(bypass, { duration: 0.8 }))
  await scene.play(
    new FadeOut(chain.links[2], { duration: 0.5, rateFunc: smooth }),
    new FadeOut(chain.links[3], { duration: 0.5, rateFunc: smooth }),
  )
}

async function animateFreeQ(scene: Scene) {
  const chain = addInsertedChain(scene, '释放 q，删除完成', 'free(q)；链表只改指针，不移动其他结点', C.green)
  const bypass = routedArrow([
    [INSERTED_X[2] + 0.68, NODE_Y, 0],
    [INSERTED_X[2] + 0.68, -0.45, 0],
    [INSERTED_X[4], -0.45, 0],
    [INSERTED_X[4], 0, 0],
  ], C.green)
  scene.add(bypass)
  await scene.play(new FadeOut(chain.nodes[3].group, { duration: 0.65, shift: [0, -0.35, 0], rateFunc: smooth }))
  await scene.play(new FadeOut(chain.links[2], { duration: 0.4 }), new FadeOut(chain.links[3], { duration: 0.4 }))
  // 50 的物理位置保持不变；绿色折线就是新的 30 → 50 指针。
  scene.add(bypass, chain.end.arrow, chain.end.text)
}

const STEPS = [
  { id: 'linked-list-locate-p', animate: animateLocateP },
  { id: 'linked-list-allocate-s', animate: animateAllocateS },
  { id: 'linked-list-connect-successor', animate: animateConnectSuccessor },
  { id: 'linked-list-connect-predecessor', animate: animateConnectPredecessor },
  { id: 'linked-list-save-q', animate: animateSaveQ },
  { id: 'linked-list-bypass-q', animate: animateBypassQ },
  { id: 'linked-list-free-q', animate: animateFreeQ },
] as const

function renderStatic(scene: Scene, index: number) {
  if (index <= 3) {
    if (index === 3) addInsertedChain(scene, '第二条指针：p->next = s', '插入完成：20 → 30 → 40', C.green)
    else {
      const chain = addInitialChain(
        scene,
        index === 0 ? '在结点 p（20）后插入 30' : index === 1 ? '申请新结点 s，并写入 30' : '第一条指针：s->next = p->next',
        index === 0 ? '先定位前驱 p；插入本身只修改指针' : index === 1 ? 's = malloc(sizeof(LNode))；s->data = 30' : '先让新结点接住原后继 40，原链仍然完整',
        index === 1 ? C.orange : index === 2 ? C.blue : C.text,
      )
      if (index >= 1) scene.add(node('30', 0.1, -0.75, C.orange).group)
      if (index === 2) scene.add(routedArrow([[0.78, -0.75, 0], [1.42, -0.75, 0], [1.42, -0.1, 0], [chain.nodes[2].x, -0.1, 0], [chain.nodes[2].x, 0, 0]], C.blue))
    }
    return
  }
  const chain = addInsertedChain(
    scene,
    index === 4 ? '删除 40：先用 q 保存待删结点' : index === 5 ? '跨过 q：p->next = q->next' : '释放 q，删除完成',
    index === 4 ? 'q = p->next；此时 p 指向 30，q 指向 40' : index === 5 ? '先建立 30 → 50，再断开通向 40 的旧指针' : 'free(q)；链表只改指针，不移动其他结点',
    index === 4 ? C.red : C.green,
  )
  if (index === 4) {
    const p = pointerTag('p（前驱）', INSERTED_X[2], C.blue)
    const q = pointerTag('q（待删）', INSERTED_X[3], C.red)
    scene.add(p.text, p.arrow, q.text, q.arrow)
  }
  if (index === 5) scene.add(routedArrow([[INSERTED_X[2] + 0.68, NODE_Y, 0], [INSERTED_X[2] + 0.68, -0.45, 0], [INSERTED_X[4], -0.45, 0], [INSERTED_X[4], 0, 0]], C.green))
  if (index === 6) {
    scene.remove(chain.nodes[3].group, chain.links[2], chain.links[3])
    scene.add(routedArrow([[INSERTED_X[2] + 0.68, NODE_Y, 0], [INSERTED_X[2] + 0.68, -0.45, 0], [INSERTED_X[4], -0.45, 0], [INSERTED_X[4], 0, 0]], C.green))
  }
}

export const singlyLinkedListInsertDeleteAnimation: ManimWebAnimation = {
  id: 'singly-linked-list-insert-delete',
  ariaLabel: '单链表先连接新结点后继、再修改前驱指针，并通过保存和跨过待删结点完成删除的分步动画',
  initialState: {
    id: 'linked-list-empty-structure',
    render: scene => {
      const emptyNodes = INITIAL_X.map(x => node('', x))
      scene.add(
        ...heading('单链表的插入与删除', '插入先接后继、再接前驱；删除先保存待删结点'),
        ...emptyNodes.map(item => item.group),
        ...INITIAL_X.slice(0, -1).map((x, index) => link(x, INITIAL_X[index + 1], C.line)),
      )
      scene.render()
    },
  },
  scene: { width: 1100, height: 520, frameWidth: 12, frameHeight: 6, backgroundColor: '#ffffff' },
  steps: STEPS.map((step, index) => ({
    id: step.id,
    render: async (scene, animate) => {
      if (animate) await step.animate(scene)
      else renderStatic(scene, index)
      scene.render()
    },
  })),
}
