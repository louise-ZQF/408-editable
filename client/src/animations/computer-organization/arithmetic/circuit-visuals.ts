import { Arrow, Line, Polygon, Rectangle, Text, VGroup, type Mobject } from '@/animations/manim'

export const C = {
  ink: '#0f172a',
  text: '#334155',
  muted: '#64748b',
  line: '#475569',
  border: '#cbd5e1',
  panel: '#f8fafc',
  blue: '#1d4ed8',
  blueSoft: '#dbeafe',
  cyan: '#0891b2',
  green: '#047857',
  orange: '#c2410c',
  red: '#b91c1c',
} as const

export function label(
  content: string,
  x: number,
  y: number,
  color: string = C.text,
  size = 18,
  weight: string = '600',
): Text {
  return new Text({
    text: content,
    fontSize: size,
    color,
    fontFamily: 'Noto Sans SC, PingFang SC, Microsoft YaHei, sans-serif',
    fontWeight: weight,
  }).moveTo([x, y, 0])
}

export function mono(
  content: string,
  x: number,
  y: number,
  color: string = C.ink,
  size = 22,
  weight: string = '700',
): Text {
  return new Text({
    text: content,
    fontSize: size,
    color,
    fontFamily: 'JetBrains Mono, SFMono-Regular, Consolas, monospace',
    fontWeight: weight,
  }).moveTo([x, y, 0])
}

export function box(
  x: number,
  y: number,
  width: number,
  height: number,
  color: string = C.border,
  fillOpacity = 0.08,
  strokeWidth = 2,
): Rectangle {
  return new Rectangle({ width, height, color, fillOpacity, strokeWidth, center: [x, y, 0] })
}

export function register(
  title: string,
  value: string,
  x: number,
  y: number,
  width = 2.4,
  active = false,
  valueColor: string = C.ink,
): VGroup {
  const color = active ? C.blue : C.border
  return new VGroup(
    box(x, y, width, 1.04, color, active ? 0.1 : 0.035, active ? 3 : 2),
    label(title, x, y + 0.28, active ? C.blue : C.muted, 15, '700'),
    mono(value, x, y - 0.2, valueColor, 22),
  )
}

export function controller(
  lines: string[],
  x: number,
  y: number,
  width = 2.4,
  active = false,
): VGroup {
  const color = active ? C.orange : C.border
  const group = new VGroup(box(x, y, width, 1.18, color, active ? 0.09 : 0.035, active ? 3 : 2))
  const startY = y + ((lines.length - 1) * 0.22) / 2
  lines.forEach((line, index) => group.add(label(line, x, startY - index * 0.44, active ? C.orange : C.text, 16, '700')))
  return group
}

export function alu(
  title: string,
  x: number,
  y: number,
  width = 2.3,
  height = 1.5,
  active = false,
): VGroup {
  const halfW = width / 2
  const halfH = height / 2
  const color = active ? C.blue : C.line
  return new VGroup(
    new Polygon({
      vertices: [
        [x - halfW, y + halfH, 0],
        [x - halfW * 0.38, y + halfH, 0],
        [x - halfW * 0.16, y + halfH * 0.34, 0],
        [x + halfW * 0.16, y + halfH * 0.34, 0],
        [x + halfW * 0.38, y + halfH, 0],
        [x + halfW, y + halfH, 0],
        [x + halfW * 0.56, y - halfH, 0],
        [x - halfW * 0.56, y - halfH, 0],
      ],
      color,
      fillOpacity: active ? 0.1 : 0.035,
      strokeWidth: active ? 3 : 2,
    }),
    label(title, x, y - height * 0.12, active ? C.blue : C.ink, 17, '800'),
  )
}

export function arrow(
  start: [number, number, number],
  end: [number, number, number],
  active = false,
  color?: string,
): Arrow {
  return new Arrow({
    start,
    end,
    color: color || (active ? C.blue : C.line),
    strokeWidth: active ? 3.6 : 2.6,
    tipLength: 0.2,
    tipWidth: 0.11,
  })
}

export function wire(
  start: [number, number, number],
  end: [number, number, number],
  active = false,
  color?: string,
): Line {
  return new Line({
    start,
    end,
    color: color || (active ? C.blue : C.line),
    strokeWidth: active ? 3.4 : 2.4,
  })
}

export function panel(y = -2.75, height = 2.65): Rectangle {
  return box(0, y, 15, height, C.border, 0.035, 1.6)
}

export function busLabel(content: string, x: number, y: number, active = false): Text {
  return label(content, x, y, active ? C.blue : C.muted, 14, '700')
}

export type CircuitMobject = Mobject
