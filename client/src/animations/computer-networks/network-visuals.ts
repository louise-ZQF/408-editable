import { Arrow, Line, Rectangle, Text, VGroup } from '@/animations/manim'

export const NC = {
  ink: '#0f172a',
  text: '#334155',
  muted: '#64748b',
  border: '#cbd5e1',
  blue: '#1d4ed8',
  cyan: '#0891b2',
  green: '#059669',
  orange: '#d97706',
  red: '#dc2626',
  violet: '#7c3aed',
  paleBlue: '#eff6ff',
  paleGreen: '#ecfdf5',
  paleOrange: '#fff7ed',
} as const

export function nText(content: string, x: number, y: number, color: string = NC.ink, size = 20, weight: string | number = '700') {
  return new Text({
    text: content,
    fontSize: size,
    color,
    fontFamily: 'Noto Sans SC, PingFang SC, sans-serif',
    fontWeight: weight,
  }).moveTo([x, y, 0])
}

export function nMono(content: string, x: number, y: number, color: string = NC.ink, size = 18, weight: string | number = '700') {
  return new Text({
    text: content,
    fontSize: size,
    color,
    fontFamily: 'JetBrains Mono, SFMono-Regular, monospace',
    fontWeight: weight,
  }).moveTo([x, y, 0])
}

export function nBox(label: string, x: number, y: number, width = 2.2, height = 0.82, color: string = NC.blue, fillOpacity = 0.06) {
  return new VGroup(
    new Rectangle({ width, height, color, fillOpacity, strokeWidth: 2.4, center: [x, y, 0] }),
    nText(label, x, y, NC.ink, 17),
  )
}

export function nPacket(label: string, x: number, y: number, color: string = NC.blue, width = 1.7) {
  return new VGroup(
    new Rectangle({ width, height: 0.62, color, fillOpacity: 0.12, strokeWidth: 2.5, center: [x, y, 0] }),
    nText(label, x, y, color, 15),
  )
}

export function nWire(start: [number, number, number], end: [number, number, number], color: string = NC.border, width = 3) {
  return new Line({ start, end, color, strokeWidth: width })
}

export function nArrow(start: [number, number, number], end: [number, number, number], color: string = NC.blue, width = 3) {
  return new Arrow({ start, end, color, strokeWidth: width })
}

export function nHeading(title: string, subtitle: string) {
  return [
    nText(title, 0, 2.72, NC.ink, 26, '800'),
    nText(subtitle, 0, 2.28, NC.muted, 16, '600'),
  ]
}
