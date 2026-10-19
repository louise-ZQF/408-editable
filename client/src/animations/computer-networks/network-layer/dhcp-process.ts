import { Circle, FadeIn, Indicate, Rectangle, Shift, Transform, VGroup, linear, smooth, type Scene } from '@/animations/manim'
import type { ManimWebAnimation } from '../../types'
import { NC, nHeading, nMono, nText, nWire } from '../network-visuals'

const CLIENT_X = -4.8
const SERVER_X = 4.8
const NODE_Y = 0.55
const CARD_LEFT = -1.4
const CARD_RIGHT = 1.4

function client(ip = '0.0.0.0', state = '尚未获得租约') {
  return new VGroup(
    new Rectangle({ width: 2.7, height: 1.55, color: NC.blue, fillOpacity: 0.05, strokeWidth: 2.4, center: [CLIENT_X, NODE_Y, 0] }),
    nText('客户端 C', CLIENT_X, NODE_Y + 0.46, NC.ink, 18, '800'),
    nMono('MAC CC-CC-CC-CC-CC-CC', CLIENT_X, NODE_Y + 0.08, NC.text, 10, '600'),
    nMono(`IP ${ip}`, CLIENT_X, NODE_Y - 0.27, ip === '0.0.0.0' ? NC.red : NC.green, 12),
    nText(state, CLIENT_X, NODE_Y - 0.59, NC.muted, 11, '700'),
  )
}

function server() {
  return new VGroup(
    new Rectangle({ width: 2.8, height: 1.55, color: NC.green, fillOpacity: 0.05, strokeWidth: 2.4, center: [SERVER_X, NODE_Y, 0] }),
    nText('DHCP 服务器 S', SERVER_X, NODE_Y + 0.46, NC.ink, 18, '800'),
    nMono('MAC AA-AA-AA-AA-AA-AA', SERVER_X, NODE_Y + 0.08, NC.text, 10, '600'),
    nMono('IP 192.168.1.254', SERVER_X, NODE_Y - 0.27, NC.green, 11),
    nText('地址池 .100 — .200', SERVER_X, NODE_Y - 0.59, NC.muted, 11, '700'),
  )
}

function base(ip = '0.0.0.0', state = '尚未获得租约') {
  return [
    client(ip, state),
    server(),
    nWire([CLIENT_X + 1.35, NODE_Y, 0], [SERVER_X - 1.4, NODE_Y, 0], NC.border, 3),
  ]
}

type Exchange = {
  id: string
  title: string
  subtitle: string
  message: string
  mode: string
  sourceMac: string
  destinationMac: string
  sourceIp: string
  destinationIp: string
  from: number
  to: number
  color: string
  final?: boolean
}

const EXCHANGES: Exchange[] = [
  {
    id: 'discover', title: 'DHCPDISCOVER：客户端广播寻找服务器', subtitle: '客户端还没有 IP，因此二层和三层目的地址都使用广播地址',
    message: 'DHCPDISCOVER', mode: '广播', sourceMac: 'CC-CC-CC-CC-CC-CC', destinationMac: 'FF-FF-FF-FF-FF-FF', sourceIp: '0.0.0.0', destinationIp: '255.255.255.255', from: CARD_LEFT, to: CARD_RIGHT, color: NC.red,
  },
  {
    id: 'offer', title: 'DHCPOFFER：服务器提供 192.168.1.100', subtitle: '服务器直接单播 OFFER；若广播标志置位，也可以广播发送',
    message: 'DHCPOFFER　yiaddr=.100', mode: '单播', sourceMac: 'AA-AA-AA-AA-AA-AA', destinationMac: 'CC-CC-CC-CC-CC-CC', sourceIp: '192.168.1.254', destinationIp: '192.168.1.100', from: CARD_RIGHT, to: CARD_LEFT, color: NC.orange,
  },
  {
    id: 'request', title: 'DHCPREQUEST：客户端广播确认选择 .100', subtitle: '广播让所有 DHCP 服务器都知道客户端选择了哪一个 OFFER',
    message: 'DHCPREQUEST　请求 .100', mode: '广播', sourceMac: 'CC-CC-CC-CC-CC-CC', destinationMac: 'FF-FF-FF-FF-FF-FF', sourceIp: '0.0.0.0', destinationIp: '255.255.255.255', from: CARD_LEFT, to: CARD_RIGHT, color: NC.violet,
  },
  {
    id: 'ack', title: 'DHCPACK：服务器确认租约', subtitle: '服务器单播 ACK；客户端收到报文后才把 .100 写入本机配置',
    message: 'DHCPACK　租约生效', mode: '单播', sourceMac: 'AA-AA-AA-AA-AA-AA', destinationMac: 'CC-CC-CC-CC-CC-CC', sourceIp: '192.168.1.254', destinationIp: '192.168.1.100', from: CARD_RIGHT, to: CARD_LEFT, color: NC.green, final: true,
  },
]

function messageCard(exchange: Exchange, x: number) {
  return new VGroup(
    new Rectangle({ width: 4.2, height: 1.72, color: exchange.color, fillOpacity: 0.09, strokeWidth: 2.5, center: [x, NODE_Y, 0] }),
    nText(`${exchange.message}（${exchange.mode}）`, x, NODE_Y + 0.65, exchange.color, 12, '800'),
    nMono(`源 MAC ${exchange.sourceMac}`, x, NODE_Y + 0.31, NC.ink, 8),
    nMono(`目的 MAC ${exchange.destinationMac}`, x, NODE_Y + 0.02, NC.ink, 8),
    nMono(`源 IP ${exchange.sourceIp}`, x, NODE_Y - 0.29, NC.ink, 8),
    nMono(`目的 IP ${exchange.destinationIp}`, x, NODE_Y - 0.58, NC.ink, 8),
  )
}

function addressRule() {
  return new VGroup(
    new Rectangle({ width: 8.7, height: 0.78, color: NC.border, fillOpacity: 0.025, strokeWidth: 1.8, center: [0, -1.35, 0] }),
    nText('广播：目的 MAC = FF-FF-FF-FF-FF-FF，目的 IP = 255.255.255.255', -1.75, -1.35, NC.red, 10, '700'),
    nText('单播：目的 MAC/IP 明确指向客户端', 2.65, -1.35, NC.green, 11, '700'),
  )
}

async function renderExchange(scene: Scene, exchange: Exchange, animate: boolean) {
  const oldClient = client('0.0.0.0', exchange.final ? '等待 ACK' : '尚未获得租约')
  scene.add(...nHeading(exchange.title, exchange.subtitle), oldClient, server(), nWire([CLIENT_X + 1.35, NODE_Y, 0], [SERVER_X - 1.4, NODE_Y, 0], NC.border, 3), addressRule())
  const radii = [0.42, 0.76, 1.1]
  const waves = exchange.mode === '广播'
    ? radii.map(radius => new Circle({ radius: animate ? 0.16 : radius, center: [CLIENT_X, NODE_Y, 0], color: exchange.color, fillOpacity: 0, strokeWidth: 2.4 }))
    : []
  scene.add(...waves)
  const card = messageCard(exchange, animate ? exchange.from : exchange.to)
  scene.add(card)
  if (animate) {
    if (waves.length) {
      await scene.play(...waves.map((wave, index) => new Transform(
        wave,
        new Circle({ radius: radii[index], center: [CLIENT_X, NODE_Y, 0], color: exchange.color, fillOpacity: 0, strokeWidth: 2.4 }),
        { duration: 0.5 + index * 0.18, rateFunc: smooth },
      )))
    }
    await scene.play(new Shift(card, { direction: [exchange.to - exchange.from, 0, 0], duration: 1.1, rateFunc: linear }))
  }
  const destinationFrame = new Rectangle({ width: 3.05, height: 1.82, color: exchange.color, fillOpacity: 0.015, strokeWidth: 2.5, center: [exchange.to < 0 ? CLIENT_X : SERVER_X, NODE_Y, 0] })
  scene.add(destinationFrame)
  if (animate) await scene.play(new Indicate(destinationFrame, { color: exchange.color, scaleFactor: 1.03, duration: 0.5 }))
  if (exchange.final) {
    const configured = client('192.168.1.100', '租约已生效')
    if (animate) await scene.play(new Transform(oldClient, configured, { duration: 0.65, rateFunc: smooth }))
    else scene.add(configured)
  }
  scene.render()
}

export const dhcpProcessAnimation: ManimWebAnimation = {
  id: 'dhcp-process',
  ariaLabel: 'DHCP DORA 报文地址与广播单播过程动画',
  scene: { width: 980, height: 500, frameWidth: 13, frameHeight: 6.4, backgroundColor: '#ffffff' },
  initialState: {
    id: 'dhcp-overview',
    render: scene => {
      scene.add(...nHeading('DHCP：客户端从 0.0.0.0 获得租约', '报文卡片标明二层与三层的源地址、目的地址'), ...base(), addressRule())
      scene.render()
    },
  },
  steps: EXCHANGES.map(exchange => ({ id: exchange.id, render: (scene, animate) => renderExchange(scene, exchange, animate) })),
}
