import { FadeIn, Rectangle, Text, type Scene } from '@/animations/manim'
import type { ManimWebAnimation } from '../../types'

// ===== 负数示例（补码）：11111010₂ = -6 =====
// 前 4 个 1 是符号扩展，不计；从第 5 位（下标 4，从左数第 5 个字符）开始算，权 -2³
const NEG_BITS = ['1', '1', '1', '1', '1', '0', '1', '0']
const NEG_POS = ['位8', '位7', '位6', '位5', '位4', '位3', '位2', '位1']
const NEG_WEIGHTS = ['2⁷', '2⁶', '2⁵', '2⁴', '-2³', '2²', '2¹', '2⁰']
const NEG_TERMS = ['', '', '', '', '位4：1 × (-2³) = -8', '位3：0 × 2² = 0', '位2：1 × 2¹ = 2', '位1：0 × 2⁰ = 0']
const NEG_SUMS = ['', '', '', '', '-8', '-8 + 0', '-8 + 0 + 2', '-8 + 0 + 2 + 0']
const NEG_START = 4 // 从左数第 5 位，符号扩展的最后一个 1

// ===== 正数示例：00000110₂ = 6 =====
// 前 5 位都是 0，从第 6 位（下标 5，从左数第 6 个字符）开始算
const POS_BITS = ['0', '0', '0', '0', '0', '1', '1', '0']
const POS_POS = ['位8', '位7', '位6', '位5', '位4', '位3', '位2', '位1']
const POS_WEIGHTS = ['2⁷', '2⁶', '2⁵', '2⁴', '2³', '2²', '2¹', '2⁰']
const POS_TERMS = ['', '', '', '', '', '位3：1 × 2² = 4', '位2：1 × 2¹ = 2', '位1：0 × 2⁰ = 0']
const POS_SUMS = ['', '', '', '', '', '4', '4 + 2', '4 + 2 + 0']
const POS_START = 5 // 从左数第 6 位，第一个 1

// ===== 坐标（8 位，居中）=====
const BIT_X = [-3.15, -2.25, -1.35, -0.45, 0.45, 1.35, 2.25, 3.15]
const Y_BITS = 1.9
const Y_POS = 1.42
const Y_WEIGHT = 0.94
const Y_ARROW = 0.35
const Y_TERM = -0.35
const Y_SUM = -1.1
const Y_RESULT = -1.9
const Y_NOTE = -2.4

// ===== 颜色 =====
const C_INK = '#1e293b'
const C_GRAY = '#94a3b8'
const C_DONE = '#059669'
const C_BLUE = '#2563eb'
const C_RED = '#dc2626'
const C_HINT = '#64748b'

function digit(text: string, x: number, y: number, color: string, size = 30) {
  return new Text({
    text,
    fontSize: size,
    color,
    fontFamily: 'JetBrains Mono, Courier New, monospace',
    fontWeight: '700',
  }).moveTo([x, y, 0])
}

function label(text: string, x: number, y: number, color: string, size = 14) {
  return new Text({
    text,
    fontSize: size,
    color,
    fontFamily: 'Noto Sans SC, PingFang SC, sans-serif',
    fontWeight: '600',
  }).moveTo([x, y, 0])
}

// 该位是否"不计"：负数符号扩展位、或正数前导 0（开始位之前的 0）
function isIgnored(i: number, isNeg: boolean): boolean {
  return isNeg ? i < NEG_START : i < POS_START
}

function bitColor(i: number, curIdx: number, isNeg: boolean): string {
  if (isIgnored(i, isNeg)) return C_GRAY // 符号扩展 / 前导 0：灰色不计
  if (i < curIdx) return C_DONE // 已处理：绿
  if (i === curIdx) return isNeg ? C_RED : C_BLUE // 当前位：负红 / 正蓝
  return C_GRAY // 未处理：灰
}

function buildHighlight(i: number, curIdx: number, isNeg: boolean): Rectangle | null {
  if (i !== curIdx || isIgnored(i, isNeg)) return null
  const c = isNeg ? C_RED : C_BLUE
  return new Rectangle({
    width: 0.7,
    height: 0.7,
    color: c,
    fillOpacity: 0.14,
    strokeWidth: 1.5,
    center: [BIT_X[i], Y_BITS, 0],
  })
}

function buildDigits(bits: string[], curIdx: number, isNeg: boolean): (Text | Rectangle)[] {
  const elems: (Text | Rectangle)[] = []
  for (let i = 0; i < 8; i++) {
    const h = buildHighlight(i, curIdx, isNeg)
    if (h) elems.push(h)
    elems.push(digit(bits[i], BIT_X[i], Y_BITS, bitColor(i, curIdx, isNeg)))
  }
  return elems
}

function buildPosLabels(posArr: string[], curIdx: number, isNeg: boolean): Text[] {
  return posArr.map((p, i) => {
    const c = bitColor(i, curIdx, isNeg)
    return label(p, BIT_X[i], Y_POS, c === C_GRAY ? C_HINT : c, 12)
  })
}

function buildWeights(weights: string[], curIdx: number, isNeg: boolean): Text[] {
  return weights.map((w, i) => {
    const c = bitColor(i, curIdx, isNeg)
    return label(w, BIT_X[i], Y_WEIGHT, c === C_GRAY ? C_HINT : c, 13)
  })
}

function buildArrow(curIdx: number, isNeg: boolean): Text {
  const c = isNeg ? C_RED : C_BLUE
  return label('↓', BIT_X[curIdx], Y_ARROW, c, 22)
}

// 步骤：intro（箭头+从这里开始算）→ 逐步处理 → 过渡 → 正数
type Step = {
  phase: 'neg-intro' | 'neg' | 'transition' | 'pos-intro' | 'pos'
  idx: number // 当前位下标（intro 时就是开始位；transition 用 8 表示全部处理完）
}

const NEG_STEPS: Step[] = NEG_TERMS.flatMap((_, i) =>
  i >= NEG_START ? [{ phase: 'neg' as const, idx: i }] : [],
)
const POS_STEPS: Step[] = POS_TERMS.flatMap((_, i) =>
  i >= POS_START ? [{ phase: 'pos' as const, idx: i }] : [],
)

const STEPS: Step[] = [
  { phase: 'neg-intro', idx: NEG_START },
  ...NEG_STEPS,
  { phase: 'transition', idx: 8 },
  { phase: 'pos-intro', idx: POS_START },
  ...POS_STEPS,
]

async function renderStep(scene: Scene, stepIdx: number, animate: boolean) {
  const step = STEPS[stepIdx]
  const elems: (Text | Rectangle)[] = []
  const isTransition = step.phase === 'transition'
  const isNeg = step.phase === 'neg' || step.phase === 'neg-intro' || isTransition
  const bits = isNeg ? NEG_BITS : POS_BITS
  const posArr = isNeg ? NEG_POS : POS_POS
  const weights = isNeg ? NEG_WEIGHTS : POS_WEIGHTS
  const terms = isNeg ? NEG_TERMS : POS_TERMS
  const sums = isNeg ? NEG_SUMS : POS_SUMS
  const curIdx = step.idx

  // 图：位串 + 位次 + 位权（始终在中间）
  elems.push(...buildDigits(bits, curIdx, isNeg))
  elems.push(...buildPosLabels(posArr, curIdx, isNeg))
  elems.push(...buildWeights(weights, curIdx, isNeg))
  if (!isTransition) elems.push(buildArrow(curIdx, isNeg))

  if (step.phase === 'transition') {
    // 过渡页：负数位串全绿已完成，提示接下来算正数
    elems.push(label('11111010₂ = -6₁₀', 0, Y_TERM, '#0f172a', 22))
    elems.push(label('负数已算得 -6；再计算正数 00000110₂', 0, Y_SUM, C_HINT, 16))
  } else if (step.phase === 'neg-intro') {
    // 第一页：箭头已指向第 5 位的 1，文字说明从这里开始
    elems.push(label('从第 5 位开始计权', 0, Y_TERM, C_RED, 20))
    elems.push(label('前面的 4 个 1 是符号扩展，不计', 0, Y_SUM, C_HINT, 15))
    elems.push(label('11111010₂ = ?', 0, Y_RESULT, C_INK, 16))
  } else if (step.phase === 'pos-intro') {
    elems.push(label('从第一个 1 开始计权', 0, Y_TERM, C_BLUE, 20))
    elems.push(label('前面的 0 不影响数值，从第一个 1 开始', 0, Y_SUM, C_HINT, 15))
    elems.push(label('00000110₂ = ?', 0, Y_RESULT, C_INK, 16))
  } else {
    // 处理步：展开式 + 累计 + 结果
    elems.push(label(terms[curIdx], 0, Y_TERM, C_INK, 18))
    elems.push(label(`累计 = ${sums[curIdx]}`, 0, Y_SUM, C_DONE, 18))
    // 负数第三步（处理到位2，累计 -8+0+2）：此时能看到只有符号位为负
    if (isNeg && curIdx === 6) {
      elems.push(label('只有符号位是负的，后面的都是正位权', 0, Y_NOTE, C_RED, 15))
    }
    if (curIdx === 7) {
      const res = isNeg ? '11111010₂ = -6₁₀' : '00000110₂ = 6₁₀'
      elems.push(label(res, 0, Y_RESULT, '#0f172a', 22))
    }
  }

  scene.add(...elems)
  if (animate) {
    await scene.play(new FadeIn(elems[0], { duration: 0.2 }))
  }
  scene.render()
}

export const weightPositionAnimation: ManimWebAnimation = {
  id: 'weight-position',
  ariaLabel: '位权法：负数 11111010 从符号扩展的最后一个 1（第 5 位，权 -2³）开始算得 -6，正数 00000110 从第 6 位开始算得 6',
  scene: {
    width: 900,
    height: 430,
    frameWidth: 12,
    frameHeight: 6,
    backgroundColor: '#ffffff',
  },
  steps: STEPS.map((_, index) => ({
    id: `step-${index}`,
    render: (scene, animate) => renderStep(scene, index, animate),
  })),
}
