import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const icmpArticle: KnowledgeArticleData = {
  pointId: 'kp-icmp',
  subpoints: [
    {
      id: 'icmp-types',
      title: '差错报告与询问',
      blocks: [
        {
          id: 'kb-icmp-types-1',
          type: 'paragraph',
          text: '**ICMP**（网际控制报文协议）用来报告差错和探测网络状态，分为两大类：**差错报告报文**和**询问报文**。',
        },
        {
          id: 'kb-icmp-types-2',
          type: 'paragraph',
          text: `| 类型 | 报文 | 触发场景 |
|------|------|---------|
| 差错报告 | 终点不可达 | 目的网络/主机/端口不可达 |
| 差错报告 | 时间超过 | TTL 减到 0 |
| 差错报告 | 参数问题 | 首部字段错误 |
| 差错报告 | 源点抑制 | 路由器拥塞（已基本废弃） |
| 询问 | 回显请求/应答 | ping |
| 询问 | 时间戳请求/应答 | 测量时延 |`,
        },
        {
          id: 'kb-icmp-types-3',
          type: 'callout',
          title: 'ping 与 TTL 超时',
          text: 'ping 发出 ICMP 回显请求。tracert 利用 TTL 逐跳加 1，让每跳路由器返回"时间超过"报文，从而还原出路径。',
          tone: 'blue',
        },
      ],
    },
    {
      id: 'icmp-encapsulation',
      title: 'ICMP 封装在 IP 数据报中',
      blocks: [
        {
          id: 'kb-icmp-encap-1',
          type: 'paragraph',
          text: 'ICMP 报文封装在 IP 数据报的数据部分传输，但它属于**网络层**协议，不能算作 IP 的上层协议。IP 数据报的协议字段为 1 时表示载荷是 ICMP。',
        },
      ],
    },
  ],
}
