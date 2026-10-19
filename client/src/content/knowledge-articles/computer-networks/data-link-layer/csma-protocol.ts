import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const csmaArticle: KnowledgeArticleData = {
  pointId: 'kp-csma-protocol',
  subpoints: [
    {
      id: 'csma-1-persistent',
      title: '1-坚持 CSMA',
      blocks: [
        {
          id: 'kb-csma-1p-1',
          type: 'paragraph',
          text: '**1-坚持 CSMA**（1-persistent CSMA）：发送前先监听。\n\n1. 信道空闲：立即发送。\n2. 信道忙：持续监听，一旦空闲立即发送。\n\n多个站同时等待信道时，空闲瞬间会同时发出，必然冲突。1-坚持最激进，适合轻负载。',
        },
      ],
    },
    {
      id: 'csma-nonpersistent',
      title: '非坚持 CSMA',
      blocks: [
        {
          id: 'kb-csma-np-1',
          type: 'paragraph',
          text: '**非坚持 CSMA**（Non-persistent CSMA）：发送前先监听。\n\n1. 信道空闲：立即发送。\n2. 信道忙：随机等待一段时间后再重新监听。\n\n多个等待站因等待时间不同而错开，冲突概率降低，但可能浪费空闲时间。非坚持适合重负载。',
        },
      ],
    },
    {
      id: 'csma-p-persistent',
      title: 'p-坚持 CSMA',
      blocks: [
        {
          id: 'kb-csma-pp-1',
          type: 'paragraph',
          text: '**p-坚持 CSMA**（p-persistent CSMA）适用于**时隙信道**。发送前先监听：\n\n1. 信道忙：持续监听直到空闲。\n2. 信道空闲：以概率 $p$ 在本时隙发送，以概率 $1-p$ 推迟到下一时隙再做决定。\n\n$p$ 太大接近 1-坚持，$p$ 太小信道空转，p-坚持是前两者的折中。',
        },
      ],
    },
    {
      id: 'csma-comparison',
      title: '三种 CSMA 比较',
      blocks: [
        {
          id: 'kb-csma-comp-1',
          type: 'html',
          html: '<table style="width:100%;border-collapse:collapse;font-size:13px;font-family:system-ui,sans-serif;margin:0;"><thead><tr style="background:#f1f5f9;"><th style="padding:6px 10px;text-align:left;border:1px solid #e2e8f0;">策略</th><th style="padding:6px 10px;text-align:center;border:1px solid #e2e8f0;">信道忙时的行为</th><th style="padding:6px 10px;text-align:center;border:1px solid #e2e8f0;">信道闲时的行为</th><th style="padding:6px 10px;text-align:center;border:1px solid #e2e8f0;">冲突风险</th><th style="padding:6px 10px;text-align:center;border:1px solid #e2e8f0;">适用场景</th></tr></thead><tbody><tr><td style="padding:5px 10px;border:1px solid #e2e8f0;font-weight:700;">1-坚持</td><td style="padding:5px 10px;text-align:center;border:1px solid #e2e8f0;">持续监听，一旦空闲立即发</td><td style="padding:5px 10px;text-align:center;border:1px solid #e2e8f0;">立即发（概率 1）</td><td style="padding:5px 10px;text-align:center;border:1px solid #e2e8f0;">高（多站同时扑上）</td><td style="padding:5px 10px;text-align:center;border:1px solid #e2e8f0;">轻负载</td></tr><tr style="background:#f8fafc;"><td style="padding:5px 10px;border:1px solid #e2e8f0;font-weight:700;">非坚持</td><td style="padding:5px 10px;text-align:center;border:1px solid #e2e8f0;">不等了，随机等一段再听</td><td style="padding:5px 10px;text-align:center;border:1px solid #e2e8f0;">立即发</td><td style="padding:5px 10px;text-align:center;border:1px solid #e2e8f0;">低（等待时间不同，错开）</td><td style="padding:5px 10px;text-align:center;border:1px solid #e2e8f0;">重负载</td></tr><tr><td style="padding:5px 10px;border:1px solid #e2e8f0;font-weight:700;">p-坚持</td><td style="padding:5px 10px;text-align:center;border:1px solid #e2e8f0;">持续监听直到空闲</td><td style="padding:5px 10px;text-align:center;border:1px solid #e2e8f0;">以 p 概率发，1−p 推迟</td><td style="padding:5px 10px;text-align:center;border:1px solid #e2e8f0;">中（p 控制）</td><td style="padding:5px 10px;text-align:center;border:1px solid #e2e8f0;">时隙信道，中等负载</td></tr></tbody></table>',
        },
      ],
    },
  ],
}
