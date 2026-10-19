import { Circle, Create, FadeIn, Line, Text, VGroup, type Scene } from '@/animations/manim'
import type { ManimWebAnimation } from '../../types'

/*
  VLSM 可变长子网划分：用二叉树演示。
  根节点是 /24 大块，每向下一层就有一位 0/1 决定走左子树还是右子树，
  子网前缀变长、地址块变小、可容纳主机数减半。
  每个节点同时标出十进制 IP 和二进制 IP：红色 = 网络号，黑色 = 主机号。
*/

function text(content: string, x: number, y: number, color: string = '#0f172a', size = 22) {
  return new Text({
    text: content,
    fontSize: size,
    color,
    fontFamily: 'Noto Sans SC, PingFang SC, sans-serif',
    fontWeight: '700',
  }).moveTo([x, y, 0])
}

type Node = {
  id: string
  label: string
  size: string
  netBin: string // 网络号（红色）
  hostBin: string // 主机号（黑色）
  x: number
  y: number
  color: string
}

type Edge = {
  from: string
  to: string
  bit: string
}

const NODE_RADIUS = 0.92

const BASE = '#2563eb'
const L1 = '#0ea5e9'
const L2 = '#8b5cf6'
const L3 = '#f59e0b'

// 树的每个节点（含坐标），相邻层之间留出连线和 0/1 分支标记的空间。
const NODES: Node[] = [
  { id: 'root', label: '192.168.1.0/24', size: '256 个地址', netBin: '11000000.10101000.00000001.', hostBin: '00000000', x: 0, y: 2.3, color: BASE },
  { id: 'n0', label: '192.168.1.0/25', size: '128 个地址', netBin: '11000000.10101000.00000001.0', hostBin: '0000000', x: -3.7, y: -0.1, color: L1 },
  { id: 'n1', label: '192.168.1.128/25', size: '128 个地址', netBin: '11000000.10101000.00000001.1', hostBin: '0000000', x: 3.7, y: -0.1, color: L1 },
  { id: 'n10', label: '192.168.1.128/26', size: '64 个地址', netBin: '11000000.10101000.00000001.10', hostBin: '000000', x: 0.25, y: -2.5, color: L2 },
  { id: 'n11', label: '192.168.1.192/26', size: '64 个地址', netBin: '11000000.10101000.00000001.11', hostBin: '000000', x: 5.15, y: -2.5, color: L2 },
  { id: 'n100', label: '192.168.1.128/27', size: '32 个地址', netBin: '11000000.10101000.00000001.100', hostBin: '00000', x: -1.3, y: -4.9, color: L3 },
  { id: 'n101', label: '192.168.1.160/27', size: '32 个地址', netBin: '11000000.10101000.00000001.101', hostBin: '00000', x: 3.6, y: -4.9, color: L3 },
]

const EDGES: Edge[] = [
  { from: 'root', to: 'n0', bit: '0' },
  { from: 'root', to: 'n1', bit: '1' },
  { from: 'n1', to: 'n10', bit: '0' },
  { from: 'n1', to: 'n11', bit: '1' },
  { from: 'n10', to: 'n100', bit: '0' },
  { from: 'n10', to: 'n101', bit: '1' },
]

const NODE_BY_ID = new Map(NODES.map((n) => [n.id, n]))

// 圆节点只展示最后一个八位组；前三个八位组在本例中始终相同。
function binaryLine(netBin: string, hostBin: string, cx: number, cy: number) {
  const networkTail = netBin.split('.').at(-1) || '—'
  const size = 12
  const charW = (0.6 * size) / 75
  const netW = networkTail.length * charW
  const hostW = hostBin.length * charW
  const totalW = netW + hostW
  const startX = cx - totalW / 2
  const netT = text(networkTail, startX + netW / 2, cy, '#dc2626', size)
  const hostT = text(hostBin, startX + netW + hostW / 2, cy, '#0f172a', size)
  return new VGroup(netT, hostT)
}

function nodeMob(n: Node) {
  const circle = new Circle({
    radius: NODE_RADIUS,
    color: n.color,
    fillOpacity: 0.16,
    strokeWidth: 3,
    center: [n.x, n.y, 0],
  })
  const sizeTxt = text(n.size, n.x, n.y + 0.42, '#334155', 11)
  const bin = binaryLine(n.netBin, n.hostBin, n.x, n.y + 0.06)
  const decimal = text(n.label, n.x, n.y - 0.38, '#0f172a', 10)
  return new VGroup(circle, sizeTxt, bin, decimal)
}

function edgeParts(e: Edge) {
  const a = NODE_BY_ID.get(e.from)!
  const b = NODE_BY_ID.get(e.to)!
  const line = new Line({
    start: [a.x, a.y - NODE_RADIUS, 0],
    end: [b.x, b.y + NODE_RADIUS, 0],
    color: '#94a3b8',
    strokeWidth: 3,
  })
  const midX = (a.x + b.x) / 2
  const midY = (a.y + b.y) / 2
  const bitLabel = text(e.bit, midX, midY, '#dc2626', 24)
  return { line, bitLabel, group: new VGroup(line, bitLabel) }
}

// 每步新增哪些节点和边
const STEPS: { heading: string; hint: string; parentId: string; nodeIds: string[]; edgeIndexes: number[] }[] = [
  {
    heading: '借 1 位：/24 切成两个 /25',
    hint: '新增的网络位分别取 0 和 1；每块地址数量从 256 减半为 128',
    parentId: 'root',
    nodeIds: ['n0', 'n1'],
    edgeIndexes: [0, 1],
  },
  {
    heading: '只继续拆右侧 /25',
    hint: '192.168.1.128/25 再借 1 位，得到两个 64 地址的 /26',
    parentId: 'n1',
    nodeIds: ['n10', 'n11'],
    edgeIndexes: [2, 3],
  },
  {
    heading: '继续拆 192.168.1.128/26',
    hint: '再借 1 位，得到 .128/27 与 .160/27；未被选中的分支保持不变',
    parentId: 'n10',
    nodeIds: ['n100', 'n101'],
    edgeIndexes: [4, 5],
  },
]

async function renderStep(scene: Scene, step: (typeof STEPS)[number], index: number, animate: boolean) {
  const title = text(`${index + 1} / ${STEPS.length}  ${step.heading}`, 0, 5.1, '#0f172a', 28)
  const hint = text(step.hint, 0, 4.65, '#64748b', 15)
  const legend = text('圆内只写最后一个八位组：红色 = 网络位，黑色 = 主机位', 0, 4.27, '#475569', 14)

  // 先恢复上一步结束状态，本次只动画新分支。
  const oldNodeIds: string[] = ['root']
  const allEdgeIndexes: number[] = []
  for (let i = 0; i < index; i++) {
    oldNodeIds.push(...STEPS[i].nodeIds)
    allEdgeIndexes.push(...STEPS[i].edgeIndexes)
  }
  const oldNodes = oldNodeIds.map(id => nodeMob(NODE_BY_ID.get(id)!))
  const oldEdges = allEdgeIndexes.map(i => edgeParts(EDGES[i]).group)
  const newNodes = step.nodeIds.map(id => nodeMob(NODE_BY_ID.get(id)!))
  const newEdges = step.edgeIndexes.map(i => edgeParts(EDGES[i]))

  scene.add(title, hint, legend, ...oldEdges, ...oldNodes)
  if (animate) {
    scene.add(...newEdges.map(edge => edge.line), ...newEdges.map(edge => edge.bitLabel), ...newNodes)
    await scene.play(
      ...newEdges.map(edge => new Create(edge.line, { duration: 0.55 })),
      ...newEdges.map(edge => new FadeIn(edge.bitLabel, { duration: 0.55 })),
      ...newNodes.map(node => new FadeIn(node, { duration: 0.55 })),
    )
  } else {
    scene.add(...newEdges.map(edge => edge.group), ...newNodes)
  }
  scene.render()
}

export const subnetVlsmAnimation: ManimWebAnimation = {
  id: 'subnet-vlsm',
  ariaLabel: 'VLSM 可变长子网划分二叉树逐步动画',
  scene: {
    width: 940,
    height: 720,
    frameWidth: 15.5,
    frameHeight: 11.87,
    backgroundColor: '#ffffff',
  },
  initialState: {
    id: 'vlsm-overview',
    render: scene => {
      scene.add(
        text('VLSM：从一个 /24 地址块开始', 0, 5.1, '#0f172a', 28),
        text('每次只拆分当前选中的地址块，其他分支保持不变', 0, 4.65, '#64748b', 15),
        text('圆内只写最后一个八位组：红色 = 网络位，黑色 = 主机位', 0, 4.27, '#475569', 14),
        nodeMob(NODE_BY_ID.get('root')!),
      )
      scene.render()
    },
  },
  steps: STEPS.map((step, index) => ({
    id: `step-${index + 1}`,
    render: (scene, animate) => renderStep(scene, step, index, animate),
  })),
}
