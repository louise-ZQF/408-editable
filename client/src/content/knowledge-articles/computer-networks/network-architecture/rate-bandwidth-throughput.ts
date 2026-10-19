import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const rateBandwidthThroughputArticle: KnowledgeArticleData = {
  pointId: 'kp-rate',
  subpoints: [
    {
      id: 'rate-definition',
      title: '速率',
      blocks: [
        {
          id: 'kb-rate-definition-1',
          type: 'paragraph',
          text: '**速率**（Data Rate）指主机在数字信道上传输数据的速率，也称数据率或比特率，单位是 **bit/s**。',
        },
        {
          id: 'kb-rate-definition-2',
          type: 'paragraph',
          text: '题目中的 kb/s、Mb/s、Gb/s 按十进制换算：1 kb/s = $10^3$ bit/s，1 Mb/s = $10^6$ bit/s，1 Gb/s = $10^9$ bit/s。网络速率始终用 $10^3$ 进制，不要和存储容量的 1024 进制混淆。',
        },
        {
          id: 'kb-rate-definition-3',
          type: 'callout',
          title: '速率 vs 文件大小 单位不同',
          text: String.raw`题目给文件大小为 $1\ \text{MB}$（Byte），链路速率为 $10\ \text{Mb/s}$（bit），计算发送时延时必须先统一单位：$1\ \text{MB} = 8 \times 10^6\ \text{bit}$，发送时延 $= 8 \times 10^6 / 10^7 = 0.8\ \text{s}$。Byte→bit 的 $\times 8$ 换算漏掉是这类题最常犯的计算错误。`,
          tone: 'orange',
        },
      ],
    },
    {
      id: 'rate-bandwidth',
      title: '带宽',
      blocks: [
        {
          id: 'kb-rate-bandwidth-1',
          type: 'paragraph',
          text: '**带宽**（Bandwidth）有两种含义。通信领域原义指信号占用的频率范围，单位 **Hz**，奈奎斯特和香农定理中的"带宽"就是这个意思。',
        },
        {
          id: 'kb-rate-bandwidth-2',
          type: 'paragraph',
          text: '计算机网络中的带宽通常指链路单位时间内能传输的最大比特数，单位 **bit/s**。一条标称 100 Mb/s 的链路，实际吞吐量远低于此。',
        },
        {
          id: 'kb-rate-bandwidth-3',
          type: 'callout',
          title: '两种带宽的区分',
          text: '和 Hz 一起出现的带宽是频宽（奈奎斯特、香农定理），和 bit/s 一起出现的带宽是最大数据率。',
          tone: 'orange',
        },
      ],
    },
    {
      id: 'rate-throughput',
      title: '吞吐量',
      blocks: [
        {
          id: 'kb-rate-throughput-1',
          type: 'paragraph',
          text: '**吞吐量**（Throughput）是单位时间内通过某个网络或信道的实际数据量，受限于链路带宽、协议首部开销、拥塞和设备处理能力。',
        },
        {
          id: 'kb-rate-throughput-2',
          type: 'paragraph',
          text: String.raw`一条路径由多段链路组成时，路径吞吐量不超过各段链路带宽的最小值，**瓶颈链路**决定了上限。例如两段 $100\ \text{Mbps}$ 链路中间夹一段 $10\ \text{Mbps}$ 链路，最大吞吐量就是 $10\ \text{Mbps}$。`,
        },
      ],
    },
  ],
}
