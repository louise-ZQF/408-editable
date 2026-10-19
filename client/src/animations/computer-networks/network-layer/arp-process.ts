import { Circle, FadeIn, Indicate, Rectangle, Shift, Transform, VGroup, linear, smooth, type Scene } from '@/animations/manim'
import type { ManimWebAnimation } from '../../types'
import { NC, nHeading, nMono, nText, nWire } from '../network-visuals'

const AX = -4.35
const BX = 0
const CX = 4.35
const HOST_Y = 0.25
const LINK_Y = -0.85
const CACHE_X = -3.4

function host(name: string, ip: string, mac: string, x: number, color: string) {
  return new VGroup(
    new Rectangle({ width: 2.45, height: 1.05, color, fillOpacity: 0.05, strokeWidth: 2.4, center: [x, HOST_Y, 0] }),
    nText(name, x, HOST_Y + 0.3, NC.ink, 17, '800'),
    nMono(ip, x, HOST_Y, NC.text, 11, '600'),
    nMono(mac, x, HOST_Y - 0.3, NC.muted, 9, '600'),
    nWire([x, HOST_Y - 0.53, 0], [x, LINK_Y, 0], NC.border, 2.4),
  )
}

function cacheTable(known: boolean, emphasis: 'none' | 'query' | 'miss' | 'write' = 'none') {
  const color = emphasis === 'miss' ? NC.red : emphasis === 'write' ? NC.green : emphasis === 'query' ? NC.blue : NC.border
  return new VGroup(
    new Rectangle({ width: 4.0, height: 1.12, color, fillOpacity: emphasis === 'none' ? 0.02 : 0.06, strokeWidth: emphasis === 'none' ? 2 : 3, center: [CACHE_X, 1.52, 0] }),
    nText('A 的 ARP 缓存表', CACHE_X, 1.91, NC.ink, 14, '800'),
    nWire([CACHE_X - 2, 1.69, 0], [CACHE_X + 2, 1.69, 0], NC.border, 1.5),
    nWire([CACHE_X - 0.63, 0.95, 0], [CACHE_X - 0.63, 1.69, 0], NC.border, 1.5),
    nText('IP 地址', CACHE_X - 1.32, 1.5, NC.text, 10, '700'),
    nText('MAC 地址', CACHE_X + 0.68, 1.5, NC.text, 10, '700'),
    nMono('192.168.1.2', CACHE_X - 1.32, 1.17, NC.ink, 9),
    nMono(known ? 'BB-BB-BB-BB-BB-BB' : '无记录', CACHE_X + 0.68, 1.17, known ? NC.green : NC.red, known ? 7 : 9),
  )
}

function base(known = false, emphasis: 'none' | 'query' | 'miss' | 'write' = 'none') {
  return [
    cacheTable(known, emphasis),
    host('主机 A', '192.168.1.1', 'AA-AA-AA-AA-AA-AA', AX, NC.blue),
    host('主机 B', '192.168.1.2', 'BB-BB-BB-BB-BB-BB', BX, NC.green),
    host('主机 C', '192.168.1.3', 'CC-CC-CC-CC-CC-CC', CX, NC.violet),
    nWire([-5.55, LINK_Y, 0], [5.55, LINK_Y, 0], NC.border, 4),
  ]
}

function messageCard(title: string, sourceMac: string, destinationMac: string, query: string, x: number, y: number, color: string) {
  return new VGroup(
    new Rectangle({ width: 3.65, height: 1.5, color, fillOpacity: 0.1, strokeWidth: 2.3, center: [x, y, 0] }),
    nText('数据链路层封装 · EtherType 0x0806', x, y + 0.58, NC.blue, 9, '800'),
    nText(title, x, y + 0.3, color, 12, '800'),
    nMono(`源 MAC ${sourceMac}`, x, y + 0.02, NC.ink, 8, '600'),
    nMono(`目的 MAC ${destinationMac}`, x, y - 0.25, NC.ink, 8, '600'),
    nText(query, x, y - 0.55, NC.text, 9, '700'),
  )
}

async function chooseTarget(scene: Scene, animate: boolean) {
  scene.add(...nHeading('A 准备向 192.168.1.2 发送以太网帧', 'IP 层给出目标 IP；链路层据此查询 ARP 缓存表'), ...base(false, 'query'))
  const key = nMono('查询键：192.168.1.2', AX, 0.73, NC.blue, 13)
  scene.add(key)
  if (animate) {
    await scene.play(new Shift(key, { direction: [0, 0.44, 0], duration: 0.6, rateFunc: linear }))
    const persistent = cacheTable(false, 'query')
    scene.add(persistent)
    await scene.play(new Indicate(persistent, { color: NC.blue, scaleFactor: 1.03, duration: 0.55 }))
  }
  scene.render()
}

async function compareRow(scene: Scene, animate: boolean) {
  scene.add(...nHeading('逐行比较：表中没有可用的 IP→MAC 映射', '查询键是 192.168.1.2，但对应 MAC 一栏是“无记录”'), ...base(false, 'miss'))
  const rowFrame = new Rectangle({ width: 3.76, height: 0.42, color: NC.red, fillOpacity: 0.04, strokeWidth: 2.6, center: [CACHE_X, 1.17, 0] })
  const result = nText('查表未命中 → 需要广播 ARP', -1.1, 1.17, NC.red, 13, '800')
  scene.add(rowFrame, result)
  if (animate) await scene.play(new Indicate(rowFrame, { color: NC.red, scaleFactor: 1.04, duration: 0.6 }), new FadeIn(result, { duration: 0.35 }))
  scene.render()
}

async function broadcast(scene: Scene, animate: boolean) {
  scene.add(...nHeading('缓存未命中：A 广播 ARP Request', '目的 MAC 必须使用 FF-FF-FF-FF-FF-FF，同一广播域内的 B、C 都会收到'), ...base(false, 'miss'))
  const packetB = messageCard('ARP Request（广播）', 'AA-AA-AA-AA-AA-AA', 'FF-FF-FF-FF-FF-FF', '谁是 192.168.1.2？', animate ? AX : BX, LINK_Y, NC.red)
  const packetC = messageCard('ARP Request（广播）', 'AA-AA-AA-AA-AA-AA', 'FF-FF-FF-FF-FF-FF', '谁是 192.168.1.2？', animate ? AX : CX, LINK_Y, NC.red)
  const radii = [0.42, 0.75, 1.08]
  const waves = radii.map(radius => new Circle({ radius: animate ? 0.16 : radius, center: [AX, HOST_Y, 0], color: NC.red, fillOpacity: 0, strokeWidth: 2.4 }))
  scene.add(packetB, packetC, ...waves)
  if (animate) {
    await scene.play(...waves.map((wave, index) => new Transform(
      wave,
      new Circle({ radius: radii[index], center: [AX, HOST_Y, 0], color: NC.red, fillOpacity: 0, strokeWidth: 2.4 }),
      { duration: 0.5 + index * 0.18, rateFunc: smooth },
    )))
    await scene.play(
      new Shift(packetB, { direction: [BX - AX, 0, 0], duration: 0.9, rateFunc: linear }),
      new Shift(packetC, { direction: [CX - AX, 0, 0], duration: 1.25, rateFunc: linear }),
    )
  }
  const bFrame = new Rectangle({ width: 2.7, height: 1.3, color: NC.green, fillOpacity: 0.02, strokeWidth: 2.6, center: [BX, HOST_Y, 0] })
  const bResult = nText('B：目标 IP 是我', BX, -1.5, NC.green, 13, '800')
  scene.add(bFrame, bResult)
  if (animate) await scene.play(new Indicate(bFrame, { color: NC.green, scaleFactor: 1.04, duration: 0.55 }), new FadeIn(bResult, { duration: 0.3 }))
  scene.render()
}

async function unicastReply(scene: Scene, animate: boolean) {
  scene.add(...nHeading('B 单播 ARP Reply 返回自己的 MAC', '应答目标明确是 A，因此目的 MAC 为 AA-AA-AA-AA-AA-AA'), ...base(false, 'miss'))
  const reply = messageCard('ARP Reply（单播）', 'BB-BB-BB-BB-BB-BB', 'AA-AA-AA-AA-AA-AA', '192.168.1.2 属于主机 B', animate ? BX : AX, LINK_Y, NC.green)
  scene.add(reply)
  if (animate) await scene.play(new Shift(reply, { direction: [AX - BX, 0, 0], duration: 0.95, rateFunc: linear }))
  const mapping = nMono('192.168.1.2 → BB-BB-BB-BB-BB-BB', AX, 0.93, NC.green, 11)
  scene.add(mapping)
  if (animate) await scene.play(new FadeIn(mapping, { duration: 0.32 }))
  scene.render()
}

async function writeCache(scene: Scene, animate: boolean) {
  const oldTable = cacheTable(false, 'write')
  scene.add(...nHeading('把应答中的映射写回缓存表', '写入后，只要缓存项有效，A 就能直接取得目的 MAC'), oldTable, ...base(false, 'none').slice(1))
  const mapping = nMono('BB-BB-BB-BB-BB-BB', CACHE_X + 0.68, animate ? 0.58 : 1.17, NC.green, 7)
  scene.add(mapping)
  if (animate) {
    await scene.play(new Shift(mapping, { direction: [0, 0.59, 0], duration: 0.65, rateFunc: smooth }))
    await scene.play(new Transform(oldTable, cacheTable(true, 'write'), { duration: 0.55, rateFunc: smooth }))
  }
  scene.render()
}

export const arpProcessAnimation: ManimWebAnimation = {
  id: 'arp-process',
  ariaLabel: 'ARP 查表、广播请求、单播应答与缓存写入动画',
  scene: { width: 980, height: 520, frameWidth: 12, frameHeight: 6.4, backgroundColor: '#ffffff' },
  initialState: {
    id: 'arp-overview',
    render: scene => {
      scene.add(...nHeading('ARP：从目标 IP 找到下一跳 MAC', 'A 先用目标 IP 查询本机 ARP 缓存表'), ...base())
      scene.render()
    },
  },
  steps: [
    { id: 'choose-query-key', render: chooseTarget },
    { id: 'cache-miss', render: compareRow },
    { id: 'broadcast-request', render: broadcast },
    { id: 'unicast-reply', render: unicastReply },
    { id: 'write-cache', render: writeCache },
  ],
}
