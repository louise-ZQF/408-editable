import {
  Arrow,
  Circle,
  Create,
  DashedLine,
  DoubleArrow,
  FadeIn,
  Indicate,
  Line,
  Polygon,
  Rectangle,
  Shift,
  Text,
  Transform,
  linear,
  smooth,
  type Mobject,
  type Scene,
  type Vector3Tuple,
} from '@/animations/manim'
import type { ManimWebAnimation } from '../../types'

/**
 * 这份动画刻意保留了参考图的“原始数据通路”布局。
 *
 * 写这种图最稳妥的方式不是凭感觉摆坐标，而是把参考图的像素坐标映射到
 * Manim Web 的世界坐标。SOURCE_* 是参考图尺寸，FRAME_* 是画布坐标尺寸。
 * 后面所有 px()/linePx()/rectPx() 都可以直接使用参考图里的像素位置。
 */
const SOURCE_WIDTH = 1530
const SOURCE_HEIGHT = 758
const FRAME_WIDTH = 17.2
const FRAME_HEIGHT = 8.52

const COLOR = {
  ink: '#111827',
  line: '#334155',
  muted: '#64748b',
  paper: '#ffffff',
  active: '#2563eb',
  control: '#7c3aed',
  data: '#0891b2',
  result: '#ea580c',
  success: '#15803d',
} as const

// px：把参考图的像素坐标 (x, y) 转换为 Manim 世界坐标 [x, y, 0]
// 原点在左上角 → 转换后原点在画布中心；Y 轴翻转（像素向下为正，Manim 向上为正）
function px(x: number, y: number): Vector3Tuple {
  return [
    (x / SOURCE_WIDTH - 0.5) * FRAME_WIDTH,
    (0.5 - y / SOURCE_HEIGHT) * FRAME_HEIGHT,
    0,
  ]
}

// pixelVector：计算两个像素坐标之间的方向向量（用于 Shift 动画）
// 返回 [dx, dy, 0]，表示从起点到终点的位移量
function pixelVector(fromX: number, fromY: number, toX: number, toY: number): Vector3Tuple {
  const start = px(fromX, fromY)
  const end = px(toX, toY)
  return [end[0] - start[0], end[1] - start[1], 0]
}

// textPx：在像素坐标 (x, y) 处创建宋体文本（默认 15px、黑色、400 字重）
function textPx(
  content: string,
  x: number,
  y: number,
  size = 15,
  color: string = COLOR.ink,
  weight = '400',
  family = 'Noto Serif SC, Songti SC, STSong, SimSun, serif',
): Text {
  return new Text({
    text: content,
    fontSize: size,
    color,
    fontFamily: family,
    fontWeight: weight,
  }).moveTo(px(x, y))
}

// monoPx：在像素坐标 (x, y) 处创建等宽字体文本（JetBrains Mono）
// 默认蓝色、15px、700 字重，用于显示数值（如 0100H、A102H）
function monoPx(content: string, x: number, y: number, color: string = COLOR.active, size = 15): Text {
  return textPx(content, x, y, size, color, '700', 'JetBrains Mono, SFMono-Regular, Consolas, monospace')
}

// linePx：在两个像素坐标之间画一条直线（无箭头），用于总线/连线
function linePx(x1: number, y1: number, x2: number, y2: number, color: string = COLOR.line, strokeWidth = 1.7): Line {
  return new Line({ start: px(x1, y1), end: px(x2, y2), color, strokeWidth })
}

// arrowPx：在两个像素坐标之间画一条带箭头的线，用于表示数据流向
function arrowPx(x1: number, y1: number, x2: number, y2: number, color: string = COLOR.line, strokeWidth = 1.7): Arrow {
  return new Arrow({
    start: px(x1, y1),
    end: px(x2, y2),
    color,
    strokeWidth,
    tipLength: 0.12,
    tipWidth: 0.07,
  })
}

// doubleArrowPx：画一条双向箭头线，用于双向数据总线（如 MDR ↔ 主存）
function doubleArrowPx(x1: number, y1: number, x2: number, y2: number, color: string = COLOR.line, strokeWidth = 1.7): DoubleArrow {
  return new DoubleArrow({
    start: px(x1, y1),
    end: px(x2, y2),
    color,
    strokeWidth,
    tipLength: 0.12,
    tipWidth: 0.07,
  })
}

// dashedPx：画一条虚线，用于控制信号线（如 PCin、IRin、MAR Src 等）
function dashedPx(x1: number, y1: number, x2: number, y2: number, color: string = COLOR.line): DashedLine {
  return new DashedLine({
    start: px(x1, y1),
    end: px(x2, y2),
    color,
    strokeWidth: 1.35,
    dashLength: 0.09,
    dashRatio: 0.55,
  })
}

// pathPx：按一组像素坐标点画折线路径（不闭合的多边形）
// 用于需要拐弯的连线（如 PC → ALU 的多段路径）
function pathPx(points: Array<[number, number]>, color: string = COLOR.line, strokeWidth = 1.7): Polygon {
  return new Polygon({
    vertices: points.map(([x, y]) => px(x, y)),
    closed: false,
    color,
    strokeWidth,
  })
}

// rectPx：用像素坐标的左上角 (left,top) 和右下角 (right,bottom) 创建矩形
// 自动计算宽高和中心点，用于绘制 PC、IR、MAR、MDR、主存等方框器件
function rectPx(
  left: number,
  top: number,
  right: number,
  bottom: number,
  color: string = COLOR.line,
  fillOpacity = 0,
  strokeWidth = 1.7,
): Rectangle {
  return new Rectangle({
    width: ((right - left) / SOURCE_WIDTH) * FRAME_WIDTH,
    height: ((bottom - top) / SOURCE_HEIGHT) * FRAME_HEIGHT,
    center: px((left + right) / 2, (top + bottom) / 2),
    color,
    fillOpacity,
    strokeWidth,
  })
}

// muxPx：创建多路选择器（MUX）的梯形形状
// 左边竖直、右边上下各缩进 20px，形成梯形外观
function muxPx(left: number, top: number, right: number, bottom: number): Polygon {
  return new Polygon({
    vertices: [
      px(left, top),
      px(right, top + 20),
      px(right, bottom - 20),
      px(left, bottom),
    ],
    color: COLOR.line,
    fillOpacity: 0,
    strokeWidth: 1.7,
  })
}

// aluPx：创建 ALU 的专属多边形形状（V 字形缺口）
// 7 个顶点构成 ALU 的经典梯形+左侧 V 形输入口
function aluPx(): Polygon {
  return new Polygon({
    vertices: [
      px(764, 200),
      px(860, 265),
      px(860, 401),
      px(764, 466),
      px(764, 354),
      px(798, 333),
      px(764, 312),
    ],
    color: COLOR.line,
    fillOpacity: 0,
    strokeWidth: 1.8,
  })
}

type DatapathFrame = {
  elements: Mobject[]
  pc: Rectangle
  ir: Rectangle
  cu: Rectangle
  mar: Rectangle
  mdr: Rectangle
  memory: Rectangle
  alu: Polygon
  muxA: Polygon
  muxB: Polygon
  muxMar: Polygon
  regDstMux: Polygon
  writebackMux: Polygon
  gprs: Rectangle
  extender: Rectangle
  selectorOne: Rectangle
  pcIn: Text
  irIn: Text
  marSrc: Text
  aluASrc: Text
  aluBSrc: Text
  regWr: Text
  regDst: Text
  regWsrc: Text
  extOp: Text
  marInput0: Text
  aluAInput0: Text
  aluAInput1: Text
  aluBInput1: Text
  aluBInput2: Text
  regDstInput1: Text
  writebackInput1: Text
}

type DatapathSignalMode = 'base' | 'fetch' | 'shift'

/**
 * 参考图的静态底图。
 * 绘制顺序是“线在后、器件在前、文字最后”，避免总线压到框内文字。
 */
function buildDatapath(signalMode: DatapathSignalMode = 'base'): DatapathFrame {
  const elements: Mobject[] = []
  const fetchSignalsActive = signalMode === 'fetch'
  const shiftSignalsActive = signalMode === 'shift'
  const signalsActive = signalMode !== 'base'
  const signalColor = signalsActive ? COLOR.control : COLOR.ink
  const signalWeight = signalsActive ? '700' : '400'

  // 左侧：目的寄存器选择、寄存器堆输入和写回线。
  const regWrValue = fetchSignalsActive ? 'RegWr = 0' : shiftSignalsActive ? 'RegWr = 1' : 'RegWr'
  const regWr = textPx(regWrValue, 238, 123, 14, signalColor, signalWeight)
  const aluAInput0 = textPx('0', 639, 225, 15, fetchSignalsActive ? COLOR.control : COLOR.ink, fetchSignalsActive ? '700' : '400')
  const aluAInput1 = textPx('1', 639, 280, 15, shiftSignalsActive ? COLOR.control : COLOR.ink, shiftSignalsActive ? '700' : '400')
  const aluBInput1 = textPx('1', 639, 400, 15, fetchSignalsActive ? COLOR.control : COLOR.ink, fetchSignalsActive ? '700' : '400')
  const aluBInput2 = textPx('2', 639, 441, 15, shiftSignalsActive ? COLOR.control : COLOR.ink, shiftSignalsActive ? '700' : '400')
  const marInput0 = textPx('0', 1010, 250, 15, fetchSignalsActive ? COLOR.control : COLOR.ink, fetchSignalsActive ? '700' : '400')
  const regDstInput1 = textPx('1', 136, 365, 15, shiftSignalsActive ? COLOR.control : COLOR.ink, shiftSignalsActive ? '700' : '400')
  const writebackInput1 = textPx('1', 548, 561, 15, shiftSignalsActive ? COLOR.control : COLOR.ink, shiftSignalsActive ? '700' : '400')

  elements.push(
    arrowPx(34, 315, 120, 315),
    arrowPx(32, 366, 120, 366),
    arrowPx(181, 340, 322, 340),
    pathPx([[241, 142], [241, 280], [322, 280]]),
    arrowPx(241, 280, 322, 280),
    pathPx([[241, 361], [241, 592], [502, 592]]),
    arrowPx(241, 361, 322, 361),
  )

  // IR.rs / IR.rt 字段先经过图中的 ①、②，再选择寄存器堆端口。
  elements.push(
    dashedPx(339, 142, 339, 179),
    dashedPx(390, 142, 390, 179),
    dashedPx(459, 142, 459, 179),
    dashedPx(510, 142, 510, 179),
    arrowPx(362, 219, 362, 259),
    arrowPx(483, 219, 483, 259),
  )

  // GPRs 的两条读总线。
  elements.push(
    arrowPx(523, 280, 623, 280),
    arrowPx(523, 361, 623, 361),
  )

  // PC 同时连接 ALU A 端和 MAR 输入选择器。
  elements.push(
    pathPx([[764, 139], [583, 139], [583, 225], [623, 225]]),
    pathPx([[844, 139], [905, 139]]),
    // PC 左侧是统一输出节点：向上、向右送 MAR MUX，同时向左分支送 MUXA。
    pathPx([[764, 139], [730, 139], [730, 80], [945, 80], [945, 250]]),
    arrowPx(583, 225, 623, 225),
    arrowPx(945, 250, 995, 250),
  )

  // ALU A/B 输入多路选择器及其输入。
  elements.push(
    arrowPx(684, 250, 764, 250),
    arrowPx(684, 401, 764, 401),
    arrowPx(563, 401, 623, 401),
    pathPx([[463, 501], [563, 501], [563, 421], [623, 421]]),
    arrowPx(563, 421, 623, 421),
  )

  // ALU 结果：一路回写 PC，一路可作为访存地址。
  elements.push(
    // ALU上去给PC的线
    pathPx([ [905, 333], [905, 139]]),
    // ALU出来的线
    pathPx([[860, 333], [928, 333], [928, 305], [995, 305]]),
    arrowPx(928, 305, 995, 305),
  )

  // MAR / MDR / 主存外部总线。
  elements.push(
    arrowPx(1056, 280, 1186, 280),
    arrowPx(1267, 280, 1398, 280),
    arrowPx(1267, 481, 1398, 481),
    arrowPx(1398, 481, 1267, 481),
  )

  // MDR 与 CPU 内部数据总线；IR 的竖线同时承担 IR 输入/输出通路。
  elements.push(
    // MDR -> 扩展器
    pathPx([[1186, 481], [530, 481], [530, 362]]),
    arrowPx(530, 481, 1186, 481),
    pathPx([[1227, 502], [1227, 571], [1126, 571], [1126, 129]]),
    pathPx([[1126, 160], [1126, 129]]),
    pathPx([[1126, 611], [1126, 129]]),
    arrowPx(1126, 611, 563, 611),
  )

  // 扩展器与写回选择器。
  elements.push(
    arrowPx(291, 501, 362, 501),
    // 下面两个是MUX的上两根线
    pathPx([[905, 310], [905, 561], [563, 561]]),
    arrowPx(565, 561, 563, 561),
    pathPx([[463, 501], [563, 501], [563, 481]]),
    
    pathPx([[502, 592], [241, 592]]),
  )

  // IR → CU → 主存控制总线。
  elements.push(
    arrowPx(1166, 109, 1247, 109),
    arrowPx(1327, 109, 1398, 109),
  )

  // 虚线控制信号。
  elements.push(
    dashedPx(150, 241, 150, 280),
    dashedPx(654, 145, 654, 190),
    dashedPx(654, 462, 654, 730),
    dashedPx(824, 466, 824, 730),
    dashedPx(1036, 341, 1036, 444),
    dashedPx(533, 653, 533, 728),
    dashedPx(415, 522, 415, 655),
    dashedPx(804, 38, 804, 118),
    dashedPx(1126, 38, 1126, 88),
    dashedPx(1287, 88, 1287, 38),
  )

  // 器件轮廓。
  const regDstMux = muxPx(120, 280, 181, 401)
  const writebackMux = muxPx(502, 532, 563, 653)
  const muxA = muxPx(623, 190, 684, 311)
  const muxB = muxPx(623, 341, 684, 462)
  const muxMar = muxPx(995, 220, 1056, 341)
  const alu = aluPx()
  const pc = rectPx(764, 118, 845, 159)
  const ir = rectPx(1086, 88, 1166, 129)
  const cu = rectPx(1247, 88, 1327, 129)
  const mar = rectPx(1186, 259, 1267, 300)
  const mdr = rectPx(1186, 461, 1267, 502)
  const memory = rectPx(1398, 79, 1479, 602, COLOR.line, 0.015)
  const gprs = rectPx(322, 259, 523, 381)
  const extender = rectPx(362, 481, 463, 522)
  const selectorOne = rectPx(322, 179, 402, 219)
  const selectorTwo = rectPx(442, 179, 523, 219)
  const circleOne = new Circle({ radius: 0.18, center: px(362, 199), color: COLOR.line, strokeWidth: 1.5 })
  const circleTwo = new Circle({ radius: 0.18, center: px(483, 199), color: COLOR.line, strokeWidth: 1.5 })

  elements.push(
    regDstMux,
    writebackMux,
    muxA,
    muxB,
    muxMar,
    alu,
    pc,
    ir,
    cu,
    mar,
    mdr,
    memory,
    gprs,
    extender,
    selectorOne,
    selectorTwo,
    circleOne,
    circleTwo,
  )

  // 器件内部文字。
  elements.push(
    textPx('0', 65, 315),
    textPx('IR.rt', 51, 365),
    textPx('0', 136, 315),
    regDstInput1,
    textPx('M\nU\nX', 163, 340, 14),
    regWr,

    textPx('IR.rt', 339, 123, 13),
    textPx('15', 389, 123, 13),
    textPx('IR.rs', 459, 123, 13),
    textPx('0', 510, 123, 13),
    textPx('1', 362, 199, 14),
    textPx('2', 483, 199, 14),
    textPx('Ra', 362, 280, 14),
    textPx('Rb', 483, 280, 14),
    textPx('GPRs\n通用寄存器组', 422, 335, 15),
    textPx('bus A', 567, 264, 14),
    textPx('bus B', 567, 346, 14),
    textPx('2', 560, 400, 14),

    aluAInput0,
    aluAInput1,
    textPx('M\nU\nX', 666, 251, 14),
    textPx('0', 639, 360),
    aluBInput1,
    aluBInput2,
    textPx('M\nU\nX', 666, 402, 14),
    textPx('A', 779, 249, 14),
    textPx('B', 779, 401, 14),
    textPx('A\nL\nU', 824, 333, 15),

    textPx('PC', 804, 139, 15),
    marInput0,
    textPx('1', 1010, 305),
    textPx('M\nU\nX', 1037, 281, 14),
    textPx('MAR', 1227, 280, 15),
    textPx('MDR', 1227, 481, 15),
    textPx('IR', 1126, 109, 15),
    textPx('CU', 1287, 109, 15),
    textPx('C Bus', 1361, 94, 14),
    textPx('A Bus', 1328, 264, 14),
    textPx('主\n存\n储\n器', 1438, 340, 18),

    textPx('IR11-0', 260, 501, 13),
    textPx('12', 337, 500, 13),
    textPx('扩展器', 412, 501, 14),
    textPx('16', 498, 500, 13),
    textPx('M\nU\nX', 524, 592, 14),
    writebackInput1,
    textPx('0', 548, 612),
  )

  // 控制信号文字保留原图位置。
  const pcIn = textPx('PCin', 804, 24, 14)
  const irIn = textPx('IRin', 1126, 24, 14)
  const marSrc = textPx(fetchSignalsActive ? 'MARSrc = 0' : 'MAR Src', 1036, 429, 14, fetchSignalsActive ? signalColor : COLOR.ink, fetchSignalsActive ? signalWeight : '400')
  const aluASrcValue = fetchSignalsActive ? 'ALUASrc = 0' : shiftSignalsActive ? 'ALUASrc = 1' : 'ALUA Src'
  const aluASrc = textPx(aluASrcValue, 654, 73, 14, signalColor, signalWeight)
  const aluBSrcValue = fetchSignalsActive ? 'ALUBSrc = 1' : shiftSignalsActive ? 'ALUBSrc = 2' : 'ALUB Src'
  const aluBSrc = textPx(aluBSrcValue, 654, 708, 14, signalColor, signalWeight)
  const regDst = shiftSignalsActive
    ? textPx('RegDst = 1', 150, 202, 14, COLOR.control, '700')
    : textPx('RegDst', 150, 202, 14)
  const regWsrc = shiftSignalsActive
    ? textPx('RegWSrc = 1', 533, 741, 14, COLOR.control, '700')
    : textPx('RegWSrc', 533, 741, 14)
  const extOp = shiftSignalsActive
    ? textPx('ExtOp = 0', 415, 642, 14, COLOR.control, '700')
    : textPx('ExtOp', 415, 642, 14)
  elements.push(
    regDst,
    pcIn,
    irIn,
    marSrc,
    aluASrc,
    aluBSrc,
    textPx('ALUCtr', 824, 708, 14),
    regWsrc,
    extOp,
    textPx('控制信号', 1287, 24, 14),
  )

  return {
    elements,
    pc,
    ir,
    cu,
    mar,
    mdr,
    memory,
    alu,
    muxA,
    muxB,
    muxMar,
    regDstMux,
    writebackMux,
    gprs,
    extender,
    selectorOne,
    pcIn,
    irIn,
    marSrc,
    aluASrc,
    aluBSrc,
    regWr,
    regDst,
    regWsrc,
    extOp,
    marInput0,
    aluAInput0,
    aluAInput1,
    aluBInput1,
    aluBInput2,
    regDstInput1,
    writebackInput1,
  }
}

// activeRouteSegments：把一组折线坐标转换成“普通线段 + 最后一段箭头”。
function activeRouteSegments(points: Array<[number, number]>, color: string = COLOR.active) {
  return points.slice(1).map((point, index) => {
    const previous = points[index]
    const isLast = index === points.length - 2
    return isLast
      ? arrowPx(previous[0], previous[1], point[0], point[1], color, 3.4)
      : linePx(previous[0], previous[1], point[0], point[1], color, 3.4)
  })
}

// addActiveRoute：前进/后退到某个稳定步骤时，直接显示已经走过的路径。
function addActiveRoute(scene: Scene, points: Array<[number, number]>, color: string = COLOR.active) {
  scene.add(...activeRouteSegments(points, color))
}

// drawActiveRoute：执行当前步骤时，沿路径逐段播放 Create。
async function drawActiveRoute(scene: Scene, points: Array<[number, number]>, color: string = COLOR.active) {
  const segments = activeRouteSegments(points, color)
  scene.add(...segments)
  for (const segment of segments) {
    await scene.play(new Create(segment, { duration: 0.34, rateFunc: linear }))
  }
}

// movePacket：让一个数据包（Mobject）沿一组像素坐标点逐段移动
// 每段播放 Shift 动画，模拟数据在总线上流动的效果
async function movePacket(scene: Scene, packet: Mobject, points: Array<[number, number]>, duration = 0.42) {
  for (let index = 1; index < points.length; index += 1) {
    const [fromX, fromY] = points[index - 1]
    const [toX, toY] = points[index]
    await scene.play(new Shift(packet, {
      direction: pixelVector(fromX, fromY, toX, toY),
      duration,
      rateFunc: linear,
    }))
  }
}

const PC_TO_MAR: Array<[number, number]> = [
  [764, 139], [730, 139], [730, 80], [945, 80], [945, 250], [995, 250], [1056, 280], [1186, 280],
]
const PC_TO_ALU_A: Array<[number, number]> = [
  [764, 139], [730, 139], [583, 139], [583, 225], [623, 225], [684, 250], [764, 250],
]
const TWO_TO_ALU_B: Array<[number, number]> = [
  [563, 401], [623, 401], [684, 401], [764, 401],
]
const MAR_TO_MEMORY: Array<[number, number]> = [[1267, 280], [1398, 280]]
const ALU_TO_PC: Array<[number, number]> = [[860, 333], [905, 333], [905, 139], [845, 139]]
const MEMORY_TO_MDR: Array<[number, number]> = [[1398, 481], [1267, 481], [1227, 481]]
const MDR_TO_IR: Array<[number, number]> = [
  [1227, 481], [1227, 571], [1126, 571], [1126, 129], [1126, 109],
]
const MDR_TO_IR_VISIBLE: Array<[number, number]> = [
  [1227, 502], [1227, 571], [1126, 571], [1126, 129],
]

const FETCH_STEPS = [
  {
    id: 'fetch-control-signals',
    caption: '取指阶段置 MARSrc=0、ALUASrc=0、ALUBSrc=1、RegWr=0。',
  },
  {
    id: 'fetch-pc-to-mar',
    caption: 'PC 的输出分成两路：一路送 MAR，另一路送 ALU 的 A 端。',
  },
  {
    id: 'fetch-prepare-alu',
    caption: 'ALUASrc=0 选择 PC，ALUBSrc=1 选择常数 2。',
  },
  {
    id: 'fetch-read-and-add',
    caption: 'MAR 按 0100H 访问主存；与此同时，ALU 计算 0100H+2=0102H。',
  },
  {
    id: 'fetch-update-pc',
    caption: 'PCin 有效，ALU 的结果 0102H 写回 PC。',
  },
  {
    id: 'fetch-memory-to-mdr',
    caption: '主存从 0100H 读出指令 A102H，经外部数据总线送入 MDR。',
  },
  {
    id: 'fetch-mdr-to-ir',
    caption: 'IRin 有效，MDR 中的 A102H 经内部总线写入 IR。取指结束。',
  },
] as const

type FetchStableState = {
  pcState?: Text
  marState?: Text
  aluAState?: Text
  aluBState?: Text
  aluResult?: Text
  memoryAddress?: Text
  mdrState?: Text
  irState?: Text
}

// 将参考图原有的控制信号名原位改成“信号 = 取值”。
// selectedInput 是被这个控制信号选中的 MUX 输入编号，二者同时高亮。
async function setFetchSignal(
  scene: Scene,
  label: Text,
  content: string,
  x: number,
  y: number,
  selectedInput?: Mobject,
  controlledUnit?: Mobject,
) {
  const valueLabel = textPx(content, x, y, 14, COLOR.control, '700')
  await scene.play(new Transform(label, valueLabel, { duration: 0.42, rateFunc: smooth }))

  const indications = [new Indicate(label, { color: COLOR.control, scaleFactor: 1.08, duration: 0.5 })]
  if (selectedInput) {
    indications.push(new Indicate(selectedInput, { color: COLOR.control, scaleFactor: 1.35, duration: 0.5 }))
  }
  if (controlledUnit) {
    indications.push(new Indicate(controlledUnit, { color: COLOR.control, scaleFactor: 1.04, duration: 0.5 }))
  }
  await scene.play(...indications)
}

// 底部只放当前一步的一句解释，不额外占用电路区域。
async function addStepCaption(scene: Scene, index: number, animate: boolean) {
  const divider = linePx(70, 775, 1460, 775, '#cbd5e1', 1.25)
  const caption = textPx(
    `第 ${index + 1} 步　${FETCH_STEPS[index].caption}`,
    SOURCE_WIDTH / 2,
    810,
    15,
    COLOR.ink,
    '600',
    'Noto Sans SC, PingFang SC, sans-serif',
  )
  scene.add(divider, caption)
  if (animate) {
    await scene.play(new FadeIn(caption, { duration: 0.34, shift: [0, -0.08, 0], rateFunc: smooth }))
  }
}

// 直接建立某一步结束后的稳定画面，供“后退”和页面重渲染使用。
function addStableFetchState(scene: Scene, index: number): FetchStableState {
  const state: FetchStableState = {}
  if (index < 0) return state

  state.pcState = monoPx(index >= 4 ? 'PC = 0102H' : 'PC = 0100H', 804, 177, index >= 4 ? COLOR.control : COLOR.active, 14)
  scene.add(state.pcState)

  if (index >= 1) {
    addActiveRoute(scene, PC_TO_MAR, COLOR.active)
    addActiveRoute(scene, PC_TO_ALU_A, COLOR.active)
    state.marState = monoPx('MAR = 0100H', 1227, 322, COLOR.active, 13)
    state.aluAState = monoPx('0100H', 733, 232, COLOR.active, 13)
    scene.add(state.marState, state.aluAState)
  }
  if (index >= 2) {
    addActiveRoute(scene, TWO_TO_ALU_B, COLOR.control)
    state.aluBState = monoPx('2', 733, 383, COLOR.control, 14)
    scene.add(state.aluBState)
  }
  if (index >= 3) {
    addActiveRoute(scene, MAR_TO_MEMORY, COLOR.data)
    state.memoryAddress = monoPx('地址 0100H', 1338, 242, COLOR.data, 13)
    scene.add(state.memoryAddress)
    if (index < 4) {
      state.aluResult = monoPx('0102H', 885, 352, COLOR.control, 14)
      scene.add(state.aluResult)
    }
  }
  if (index >= 4) addActiveRoute(scene, ALU_TO_PC, COLOR.control)
  if (index >= 5) {
    addActiveRoute(scene, MEMORY_TO_MDR, COLOR.data)
    state.mdrState = monoPx('MDR = A102H', 1227, 528, COLOR.data, 13)
    scene.add(state.mdrState)
  }
  if (index >= 6) {
    addActiveRoute(scene, MDR_TO_IR_VISIBLE, COLOR.active)
    state.irState = monoPx('IR = A102H', 1126, 153, COLOR.active, 14)
    scene.add(state.irState)
  }
  return state
}

async function animateControlSignals(scene: Scene, frame: DatapathFrame) {
  await setFetchSignal(scene, frame.marSrc, 'MARSrc = 0', 1036, 429, frame.marInput0, frame.muxMar)
  await setFetchSignal(scene, frame.aluASrc, 'ALUASrc = 0', 654, 73, frame.aluAInput0, frame.muxA)
  await setFetchSignal(scene, frame.aluBSrc, 'ALUBSrc = 1', 654, 708, frame.aluBInput1, frame.muxB)
  await setFetchSignal(scene, frame.regWr, 'RegWr = 0', 238, 123)

  const pcState = monoPx('PC = 0100H', 804, 177, COLOR.active, 14)
  scene.add(pcState)
  await scene.play(
    new FadeIn(pcState, { duration: 0.35 }),
    new Indicate(frame.pc, { color: COLOR.active, scaleFactor: 1.08, duration: 0.55 }),
  )
}

async function animatePcToMar(scene: Scene, frame: DatapathFrame) {
  await drawActiveRoute(scene, PC_TO_MAR, COLOR.active)
  await drawActiveRoute(scene, PC_TO_ALU_A, COLOR.active)

  const pcAddress = monoPx('0100H', 764, 139, COLOR.active, 14)
  const pcOperand = monoPx('0100H', 764, 139, COLOR.active, 14)
  scene.add(pcAddress, pcOperand)
  await scene.play(
    new FadeIn(pcAddress, { duration: 0.25 }),
    new FadeIn(pcOperand, { duration: 0.25 }),
  )
  await movePacket(scene, pcAddress, PC_TO_MAR, 0.38)
  await movePacket(scene, pcOperand, PC_TO_ALU_A, 0.32)
  await scene.play(
    new Indicate(frame.mar, { color: COLOR.active, scaleFactor: 1.08, duration: 0.5 }),
    new Indicate(frame.muxA, { color: COLOR.active, scaleFactor: 1.05, duration: 0.5 }),
  )
  const marState = monoPx('MAR = 0100H', 1227, 322, COLOR.active, 13)
  const aluAState = monoPx('0100H', 733, 232, COLOR.active, 13)
  await scene.play(
    new Transform(pcAddress, marState, { duration: 0.4, rateFunc: smooth }),
    new Transform(pcOperand, aluAState, { duration: 0.4, rateFunc: smooth }),
  )
}

async function animatePrepareAlu(scene: Scene, frame: DatapathFrame) {
  await drawActiveRoute(scene, TWO_TO_ALU_B, COLOR.control)

  const increment = monoPx('2', 563, 401, COLOR.control, 15)
  scene.add(increment)
  await scene.play(new FadeIn(increment, { duration: 0.25 }))
  await movePacket(scene, increment, TWO_TO_ALU_B, 0.42)
  await scene.play(
    new Transform(increment, monoPx('2', 733, 383, COLOR.control, 14), { duration: 0.35, rateFunc: smooth }),
    new Indicate(frame.alu, { color: COLOR.control, scaleFactor: 1.04, duration: 0.5 }),
  )
}

async function animateReadAndAdd(scene: Scene, frame: DatapathFrame) {
  await scene.play(
    new Indicate(frame.memory, { color: COLOR.data, scaleFactor: 1.02, duration: 0.65 }),
    new Indicate(frame.alu, { color: COLOR.control, scaleFactor: 1.05, duration: 0.65 }),
  )

  await drawActiveRoute(scene, MAR_TO_MEMORY, COLOR.data)
  const memoryAddress = monoPx('0100H', 1267, 280, COLOR.data, 14)
  scene.add(memoryAddress)
  await scene.play(new FadeIn(memoryAddress, { duration: 0.24 }))
  await movePacket(scene, memoryAddress, MAR_TO_MEMORY, 0.72)
  await scene.play(new Transform(
    memoryAddress,
    monoPx('地址 0100H', 1338, 242, COLOR.data, 13),
    { duration: 0.36, rateFunc: smooth },
  ))

  const aluResult = monoPx('0102H', 860, 333, COLOR.control, 14)
  scene.add(aluResult)
  await scene.play(new FadeIn(aluResult, { duration: 0.38, shift: [-0.08, 0, 0], rateFunc: smooth }))
  await scene.play(new Shift(aluResult, {
    direction: pixelVector(860, 333, 885, 352),
    duration: 0.3,
    rateFunc: smooth,
  }))
}

async function animateUpdatePc(scene: Scene, frame: DatapathFrame, state: FetchStableState) {
  await drawActiveRoute(scene, ALU_TO_PC, COLOR.control)
  const nextPc = state.aluResult || monoPx('0102H', 885, 352, COLOR.control, 14)
  if (!state.aluResult) scene.add(nextPc)
  await scene.play(new Transform(nextPc, monoPx('0102H', 860, 333, COLOR.control, 14), {
    duration: 0.3,
    rateFunc: smooth,
  }))
  await movePacket(scene, nextPc, ALU_TO_PC, 0.48)
  await scene.play(
    new Indicate(frame.pcIn, { color: COLOR.control, scaleFactor: 1.1, duration: 0.5 }),
    new Indicate(frame.pc, { color: COLOR.control, scaleFactor: 1.08, duration: 0.5 }),
  )
  const updatedPc = monoPx('PC = 0102H', 804, 177, COLOR.control, 14)
  if (state.pcState) {
    await scene.play(new Transform(state.pcState, updatedPc, { duration: 0.45, rateFunc: smooth }))
  } else {
    scene.add(updatedPc)
  }
}

async function animateMemoryToMdr(scene: Scene, frame: DatapathFrame) {
  await drawActiveRoute(scene, MEMORY_TO_MDR, COLOR.data)
  const instruction = monoPx('A102H', 1398, 481, COLOR.data, 15)
  scene.add(instruction)
  await scene.play(new FadeIn(instruction, { duration: 0.3 }))
  await movePacket(scene, instruction, MEMORY_TO_MDR, 0.58)
  await scene.play(new Indicate(frame.mdr, { color: COLOR.data, scaleFactor: 1.08, duration: 0.45 }))
  await scene.play(new Transform(
    instruction,
    monoPx('MDR = A102H', 1227, 528, COLOR.data, 13),
    { duration: 0.4, rateFunc: smooth },
  ))
}

async function animateMdrToIr(scene: Scene, frame: DatapathFrame, state: FetchStableState) {
  await drawActiveRoute(scene, MDR_TO_IR_VISIBLE, COLOR.active)
  await scene.play(new Indicate(frame.irIn, { color: COLOR.control, scaleFactor: 1.1, duration: 0.45 }))
  const instruction = state.mdrState || monoPx('MDR = A102H', 1227, 528, COLOR.data, 13)
  if (!state.mdrState) scene.add(instruction)
  await scene.play(new Transform(instruction, monoPx('A102H', 1227, 481, COLOR.data, 15), {
    duration: 0.32,
    rateFunc: smooth,
  }))
  await movePacket(scene, instruction, MDR_TO_IR, 0.4)
  await scene.play(new Indicate(frame.ir, { color: COLOR.active, scaleFactor: 1.08, duration: 0.5 }))
  const irState = monoPx('IR = A102H', 1126, 153, COLOR.active, 14)
  await scene.play(new Transform(instruction, irState, { duration: 0.42, rateFunc: smooth }))
}

async function renderFetchStep(scene: Scene, index: number, animate: boolean) {
  const displayedIndex = animate ? index - 1 : index
  const frame = buildDatapath(displayedIndex >= 0 ? 'fetch' : 'base')
  scene.add(...frame.elements)
  const state = addStableFetchState(scene, displayedIndex)
  await addStepCaption(scene, index, animate)

  if (animate) {
    if (index === 0) await animateControlSignals(scene, frame)
    else if (index === 1) await animatePcToMar(scene, frame)
    else if (index === 2) await animatePrepareAlu(scene, frame)
    else if (index === 3) await animateReadAndAdd(scene, frame)
    else if (index === 4) await animateUpdatePc(scene, frame, state)
    else if (index === 5) await animateMemoryToMdr(scene, frame)
    else if (index === 6) await animateMdrToIr(scene, frame, state)
  }
  scene.render()
}

export const executeAnimation: ManimWebAnimation = {
  id: 'instruction-cycle-datapath',
  ariaLabel: '完整 CPU 数据通路以及一次 PC 到 MAR、主存、MDR、IR，并更新 PC 的取指动画',
  initialState: {
    id: 'instruction-cycle-static-datapath',
    render: scene => {
      const frame = buildDatapath()
      scene.add(...frame.elements)
      scene.render()
    },
  },
  scene: {
    width: SOURCE_WIDTH,
    height: 840,
    frameWidth: FRAME_WIDTH,
    frameHeight: 9.45,
    backgroundColor: COLOR.paper,
  },
  steps: FETCH_STEPS.map((step, index) => ({
    id: step.id,
    render: (scene, animate) => renderFetchStep(scene, index, animate),
  })),
}

const SHIFT_INSTRUCTION = '0000 0000 0100 0010'

const SHIFT_STEPS = [
  {
    id: 'shift-decode-and-control',
    caption: '译码：rt=0000 指向 R0，num=0100 表示左移 4 位，op1=0010 表示左移；置 ALUBSrc=2、RegWSrc=1、RegDst=1、RegWr=1。',
  },
  {
    id: 'shift-read-source-register',
    caption: '读取源操作数 R[rt]：本指令的 rt=0000，因此从 R0 读出数据，经 bus A 送到 ALU 的 A 端。',
  },
  {
    id: 'shift-extend-immediate',
    caption: '取出 num=0100，经扩展器得到 0004H；ALUBSrc=2 选择扩展器输出，送到 ALU 的 B 端。',
  },
  {
    id: 'shift-run-alu',
    caption: 'ALU 按 op1=0010 执行左移：R[0] << 4，低 4 位补 0，结果等价于原值乘 16。',
  },
  {
    id: 'shift-select-writeback',
    caption: 'RegWSrc=1 选择 ALU 结果，结果沿写回通路回到通用寄存器组的写数据端。',
  },
  {
    id: 'shift-write-target-register',
    caption: 'RegDst=1 选择 IR.rt=0000，RegWr=1 使能写入：R[0] ← R[0] << 4。',
  },
] as const

const IR_RT_TO_RA: Array<[number, number]> = [
  [339, 142], [339, 179], [362, 199], [362, 219], [362, 259],
]
const GPR_TO_ALU_A: Array<[number, number]> = [
  [523, 280], [623, 280], [684, 250], [764, 250],
]
const IR_TO_EXTENDER: Array<[number, number]> = [
  [291, 501], [362, 501], [463, 501],
]
const EXTENDER_TO_ALU_B: Array<[number, number]> = [
  [463, 501], [563, 501], [563, 421], [623, 421], [684, 401], [764, 401],
]
const ALU_TO_WRITEBACK: Array<[number, number]> = [
  [860, 333], [905, 333], [905, 561], [563, 561],
]
const WRITEBACK_TO_GPR: Array<[number, number]> = [
  [502, 592], [241, 592], [241, 361], [322, 361],
]
const RT_TO_REGDST: Array<[number, number]> = [
  [32, 366], [120, 366], [181, 340], [322, 340],
]

type ShiftStableState = {
  aluResult?: Text
  writebackResult?: Text
}

function addShiftInstruction(scene: Scene) {
  scene.add(
    monoPx(`IR = ${SHIFT_INSTRUCTION}`, 430, 54, COLOR.active, 15),
    textPx(
      'rt=0000 → R0　　num=0100 → 4　　op1=0010 → 左移',
      430,
      88,
      13,
      COLOR.muted,
      '600',
      'Noto Sans SC, PingFang SC, sans-serif',
    ),
  )
}

function addShiftIntro(scene: Scene) {
  const divider = linePx(70, 775, 1460, 775, '#cbd5e1', 1.25)
  const caption = textPx(
    `左移指令　${SHIFT_INSTRUCTION}　目标：R[0] ← R[0] << 4`,
    SOURCE_WIDTH / 2,
    810,
    15,
    COLOR.ink,
    '600',
    'Noto Sans SC, PingFang SC, sans-serif',
  )
  scene.add(divider, caption)
}

async function addShiftStepCaption(scene: Scene, index: number, animate: boolean) {
  const divider = linePx(70, 775, 1460, 775, '#cbd5e1', 1.25)
  const caption = textPx(
    `第 ${index + 1} 步　${SHIFT_STEPS[index].caption}`,
    SOURCE_WIDTH / 2,
    810,
    14,
    COLOR.ink,
    '600',
    'Noto Sans SC, PingFang SC, sans-serif',
  )
  scene.add(divider, caption)
  if (animate) {
    await scene.play(new FadeIn(caption, { duration: 0.34, shift: [0, -0.08, 0], rateFunc: smooth }))
  }
}

function addStableShiftState(scene: Scene, index: number): ShiftStableState {
  const state: ShiftStableState = {}
  if (index < 0) return state

  addShiftInstruction(scene)

  if (index >= 1) {
    addActiveRoute(scene, IR_RT_TO_RA, COLOR.active)
    addActiveRoute(scene, GPR_TO_ALU_A, COLOR.active)
    scene.add(monoPx('R[0]', 733, 232, COLOR.active, 14))
  }
  if (index >= 2) {
    addActiveRoute(scene, IR_TO_EXTENDER, COLOR.data)
    addActiveRoute(scene, EXTENDER_TO_ALU_B, COLOR.data)
    scene.add(
      monoPx('0100', 330, 477, COLOR.data, 13),
      monoPx('0004H', 733, 383, COLOR.data, 14),
    )
  }
  if (index >= 3) {
    state.aluResult = monoPx('R[0] << 4', 890, 352, COLOR.result, 14)
    scene.add(state.aluResult)
  }
  if (index >= 4) {
    addActiveRoute(scene, ALU_TO_WRITEBACK, COLOR.result)
    addActiveRoute(scene, WRITEBACK_TO_GPR, COLOR.result)
    state.writebackResult = monoPx('R[0] << 4', 300, 565, COLOR.result, 13)
    scene.add(state.writebackResult)
  }
  if (index >= 5) {
    addActiveRoute(scene, RT_TO_REGDST, COLOR.control)
    scene.add(monoPx('R[0] ← R[0] << 4', 422, 416, COLOR.success, 14))
  }

  return state
}

async function animateShiftControls(scene: Scene, frame: DatapathFrame) {
  addShiftInstruction(scene)
  await setFetchSignal(scene, frame.aluBSrc, 'ALUBSrc = 2', 654, 708, frame.aluBInput2, frame.muxB)
  await setFetchSignal(scene, frame.regWsrc, 'RegWSrc = 1', 533, 741, frame.writebackInput1, frame.writebackMux)
  await setFetchSignal(scene, frame.regDst, 'RegDst = 1', 150, 202, frame.regDstInput1, frame.regDstMux)
  await setFetchSignal(scene, frame.regWr, 'RegWr = 1', 238, 123, undefined, frame.gprs)

  // 这两个信号是完整数据通路真正建立操作数所必需的，但不混入题目要求填写的四个答案中。
  await setFetchSignal(scene, frame.aluASrc, 'ALUASrc = 1', 654, 73, frame.aluAInput1, frame.muxA)
  await setFetchSignal(scene, frame.extOp, 'ExtOp = 0', 415, 642, undefined, frame.extender)
}

async function animateShiftReadRegister(scene: Scene, frame: DatapathFrame) {
  await drawActiveRoute(scene, IR_RT_TO_RA, COLOR.active)
  await scene.play(
    new Indicate(frame.selectorOne, { color: COLOR.active, scaleFactor: 1.06, duration: 0.45 }),
    new Indicate(frame.gprs, { color: COLOR.active, scaleFactor: 1.04, duration: 0.45 }),
  )
  await drawActiveRoute(scene, GPR_TO_ALU_A, COLOR.active)

  const value = monoPx('R[0]', 523, 280, COLOR.active, 14)
  scene.add(value)
  await scene.play(new FadeIn(value, { duration: 0.25 }))
  await movePacket(scene, value, GPR_TO_ALU_A, 0.4)
  await scene.play(
    new Transform(value, monoPx('R[0]', 733, 232, COLOR.active, 14), { duration: 0.35, rateFunc: smooth }),
    new Indicate(frame.alu, { color: COLOR.active, scaleFactor: 1.035, duration: 0.45 }),
  )
}

async function animateShiftImmediate(scene: Scene, frame: DatapathFrame) {
  await drawActiveRoute(scene, IR_TO_EXTENDER, COLOR.data)
  const immediate = monoPx('0100', 291, 501, COLOR.data, 14)
  scene.add(immediate)
  await scene.play(new FadeIn(immediate, { duration: 0.25 }))
  await movePacket(scene, immediate, IR_TO_EXTENDER, 0.48)
  await scene.play(
    new Transform(immediate, monoPx('0004H', 463, 501, COLOR.data, 14), { duration: 0.45, rateFunc: smooth }),
    new Indicate(frame.extender, { color: COLOR.data, scaleFactor: 1.06, duration: 0.5 }),
  )

  await drawActiveRoute(scene, EXTENDER_TO_ALU_B, COLOR.data)
  await movePacket(scene, immediate, EXTENDER_TO_ALU_B, 0.36)
  await scene.play(
    new Transform(immediate, monoPx('0004H', 733, 383, COLOR.data, 14), { duration: 0.34, rateFunc: smooth }),
    new Indicate(frame.muxB, { color: COLOR.data, scaleFactor: 1.05, duration: 0.45 }),
  )
}

async function animateShiftAlu(scene: Scene, frame: DatapathFrame) {
  await scene.play(new Indicate(frame.alu, { color: COLOR.result, scaleFactor: 1.055, duration: 0.7 }))
  const result = monoPx('R[0] << 4', 824, 333, COLOR.result, 14)
  scene.add(result)
  await scene.play(new FadeIn(result, { duration: 0.35, shift: [-0.08, 0, 0], rateFunc: smooth }))
  await scene.play(new Shift(result, {
    direction: pixelVector(824, 333, 890, 352),
    duration: 0.45,
    rateFunc: smooth,
  }))
}

async function animateShiftWriteback(scene: Scene, frame: DatapathFrame, state: ShiftStableState) {
  await drawActiveRoute(scene, ALU_TO_WRITEBACK, COLOR.result)
  const result = state.aluResult || monoPx('R[0] << 4', 890, 352, COLOR.result, 14)
  if (!state.aluResult) scene.add(result)
  await scene.play(new Transform(result, monoPx('R[0] << 4', 860, 333, COLOR.result, 14), {
    duration: 0.32,
    rateFunc: smooth,
  }))
  await movePacket(scene, result, ALU_TO_WRITEBACK, 0.38)
  await scene.play(new Indicate(frame.writebackMux, { color: COLOR.result, scaleFactor: 1.07, duration: 0.45 }))
  await scene.play(new Shift(result, {
    direction: pixelVector(563, 561, 502, 592),
    duration: 0.34,
    rateFunc: smooth,
  }))

  await drawActiveRoute(scene, WRITEBACK_TO_GPR, COLOR.result)
  await movePacket(scene, result, WRITEBACK_TO_GPR, 0.34)
  await scene.play(new Indicate(frame.gprs, { color: COLOR.result, scaleFactor: 1.04, duration: 0.5 }))
  await scene.play(new Transform(result, monoPx('R[0] << 4', 300, 565, COLOR.result, 13), {
    duration: 0.35,
    rateFunc: smooth,
  }))
}

async function animateShiftDestination(scene: Scene, frame: DatapathFrame) {
  await drawActiveRoute(scene, RT_TO_REGDST, COLOR.control)
  const target = monoPx('0000', 32, 366, COLOR.control, 13)
  scene.add(target)
  await scene.play(new FadeIn(target, { duration: 0.25 }))
  await movePacket(scene, target, RT_TO_REGDST, 0.4)
  await scene.play(
    new Indicate(frame.regDstMux, { color: COLOR.control, scaleFactor: 1.07, duration: 0.45 }),
    new Indicate(frame.regWr, { color: COLOR.control, scaleFactor: 1.1, duration: 0.45 }),
    new Indicate(frame.gprs, { color: COLOR.success, scaleFactor: 1.05, duration: 0.55 }),
  )
  await scene.play(new Transform(
    target,
    monoPx('R[0] ← R[0] << 4', 422, 416, COLOR.success, 14),
    { duration: 0.5, rateFunc: smooth },
  ))
}

async function renderShiftStep(scene: Scene, index: number, animate: boolean) {
  const displayedIndex = animate ? index - 1 : index
  const frame = buildDatapath(displayedIndex >= 0 ? 'shift' : 'base')
  scene.add(...frame.elements)
  const state = addStableShiftState(scene, displayedIndex)
  await addShiftStepCaption(scene, index, animate)

  if (animate) {
    if (index === 0) await animateShiftControls(scene, frame)
    else if (index === 1) await animateShiftReadRegister(scene, frame)
    else if (index === 2) await animateShiftImmediate(scene, frame)
    else if (index === 3) await animateShiftAlu(scene, frame)
    else if (index === 4) await animateShiftWriteback(scene, frame, state)
    else if (index === 5) await animateShiftDestination(scene, frame)
  }
  scene.render()
}

export const shiftImmediateAnimation: ManimWebAnimation = {
  id: 'left-shift-immediate-datapath',
  ariaLabel: '指令 0000 0000 0100 0010 在 CPU 数据通路中完成 R0 左移 4 位并写回 R0 的逐步动画',
  initialState: {
    id: 'left-shift-immediate-static-datapath',
    render: scene => {
      const frame = buildDatapath()
      scene.add(...frame.elements)
      addShiftIntro(scene)
      scene.render()
    },
  },
  scene: {
    width: SOURCE_WIDTH,
    height: 840,
    frameWidth: FRAME_WIDTH,
    frameHeight: 9.45,
    backgroundColor: COLOR.paper,
  },
  steps: SHIFT_STEPS.map((step, index) => ({
    id: step.id,
    render: (scene, animate) => renderShiftStep(scene, index, animate),
  })),
}
