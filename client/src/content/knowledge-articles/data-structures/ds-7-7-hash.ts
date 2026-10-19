import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const ds7_7HashArticle: KnowledgeArticleData = {
  pointId: 'ds-7-7-hash',
  subpoints: [
    {
      id: 'ds-7-7-s1',
      title: '散列函数与散列表',
      blocks: [
        {
          id: 'kb-ds-7-7-1',
          type: 'paragraph',
          text: String.raw`**散列（哈希）存储**根据关键字直接计算出存储地址，把关键字映为下标。相关概念：

1. **散列函数** $H(key)$：把关键字映射为下标的函数。
2. **散列地址**：由散列函数计算出的存储位置。
3. **散列表**（哈希表）：存放记录的连续存储空间。

查找时用同一散列函数再算一次地址，即可 $O(1)$ 平均定位。`,
        },
        {
          id: 'kb-ds-7-7-5',
          type: 'callout',
          title: '装填因子反映表的拥挤程度',
          text: String.raw`装填因子 $\alpha = \frac{\text{已存元素数}}{\text{表长}}$。$\alpha$ 越大冲突越多、ASL 越大。判断"提高散列效率的正确措施"时，凡是"增大装填因子"的项都是错的。`,
          tone: 'orange',
        },
      ],
    },
    {
      id: 'ds-7-7-s2',
      title: '开放定址法',
      blocks: [
        {
          id: 'kb-ds-7-7-6',
          type: 'paragraph',
          text: String.raw`**开放定址法**把发生冲突的地址视作可再放置的空间，当 $H(key)$ 已占用时，按某个**增量序列** $d_i$ 探测下一个地址：$H_i = (H(key) + d_i) \bmod m$，直到找到空位或查找失败。常用的增量序列有四类：

1. **线性探测（线性探测再散列）**：$d_i = 1,2,3,\dots$，逐个向后找空位。实现简单，但容易把不同散列地址的**同义词堆积**在一起，形成**堆积（聚集）现象**。
2. **平方探测（二次探测再散列）**：$d_i = 1^2, -1^2, 2^2, -2^2, \dots$，即向左右两侧逐步探测。能减少堆积，但需保证表长 $m$ 是**形如 $4k+3$ 的质数**才能充分利用所有位置；也有可能出现"还有空位却探测不到、表看似已满"的情况。
3. **再散列法（双散列）**：$d_i = i \times H_2(key)$，用第二个散列函数定增量，冲突分散更均匀。
4. **伪随机序列法**：增量由伪随机数产生。`,
        },
        {
          id: 'kb-ds-7-7-10',
          type: 'html',
          html: `<svg viewBox="0 0 560 210" xmlns="http://www.w3.org/2000/svg" style="display:block;width:min(100%,560px);height:auto;margin-inline:auto">
  <style>
    text { font-family: system-ui, sans-serif; }
    .addr { font-size: 13px; fill: #64748b; text-anchor: middle; font-weight: 600; }
    .val  { font-size: 15px; font-weight: 700; fill: #1e3a8a; text-anchor: middle; }
    .empty{ font-size: 13px; fill: #94a3b8; text-anchor: middle; }
    .lbl  { font-size: 14px; fill: #334155; text-anchor: middle; font-weight: 700; }
  </style>

  <text x="280" y="22" class="lbl">线性探测：H(22)=22%7=1，冲突向后找</text>

  <g>
    <rect x="76" y="44" width="58" height="34" rx="6" fill="#f1f5f9"/><text x="105" y="64" class="empty">空</text>
    <rect x="142" y="44" width="58" height="34" rx="6" fill="#dbeafe"/><text x="171" y="64" class="val">22</text>
    <rect x="208" y="44" width="58" height="34" rx="6" fill="#dbeafe"/><text x="237" y="64" class="val">43</text>
    <rect x="274" y="44" width="58" height="34" rx="6" fill="#dbeafe"/><text x="303" y="64" class="val">15</text>
    <rect x="340" y="44" width="58" height="34" rx="6" fill="#f1f5f9"/><text x="369" y="64" class="empty">空</text>
    <rect x="406" y="44" width="58" height="34" rx="6" fill="#f1f5f9"/><text x="435" y="64" class="empty">空</text>
    <rect x="472" y="44" width="58" height="34" rx="6" fill="#f1f5f9"/><text x="501" y="64" class="empty">空</text>
  </g>
  <g>
    <text x="105" y="92" class="addr">0</text>
    <text x="171" y="92" class="addr">1</text>
    <text x="237" y="92" class="addr">2</text>
    <text x="303" y="92" class="addr">3</text>
    <text x="369" y="92" class="addr">4</text>
    <text x="435" y="92" class="addr">5</text>
    <text x="501" y="92" class="addr">6</text>
  </g>

  <text x="280" y="126" class="lbl" font-size="14">例：H(22)=1、H(43)=1、H(15)=1</text>
  <text x="280" y="150" class="addr" font-size="13" fill="#475569" text-anchor="middle">22→①，43→①冲突→②，15→①冲突→②冲突→③</text>
  <text x="280" y="172" class="addr" font-size="13" fill="#475569" text-anchor="middle">查找成功的比较次数：22 为 1，43 为 2，15 为 3</text>
</svg>`,
        },
        {
          id: 'kb-ds-7-7-11',
          type: 'paragraph',
          text: String.raw`上图为线性探测：关键字 22、43、15 经 $H=key\bmod 7$ 都得到地址 1。22 占地址 1，43 冲突向后探测到 2，15 冲突后 2 已占、探测到 3 才得空位。关键字被探测的次数即其查找成功时的比较次数（22 比 1 次、43 比 2 次、15 比 3 次）。`,
        },
        {
          id: 'kb-ds-7-7-12',
          type: 'callout',
          title: '线性探测的堆积',
          text: '线性探测的增量总是 +1，冲突的关键字一个挨一个往后压，使同义词聚成连续区，进而连累不相干的关键字也变长，这就是堆积现象。平方探测、再散列能缓解堆积。',
        },
      ],
    },
    {
      id: 'ds-7-7-s3',
      title: '链地址法',
      blocks: [
        {
          id: 'kb-ds-7-7-13',
          type: 'paragraph',
          text: '**链地址法（拉链法）**把散列地址相同的关键字全部挂在同一个链表上，每个表位置保存一个链表的头指针（或子表）。冲突直接追加到链尾，不占用其他地址，也**不会产生堆积现象**。',
        },
        {
          id: 'kb-ds-7-7-14',
          type: 'paragraph',
          text: String.raw`链地址法的查找：先算 $H(key)$ 到对应链表头，再在链内顺序查找。

1. **查找成功**的平均长度为链内命中位置的平均。
2. **查找失败**的平均长度为各链的平均长度。

整表的地址使用由链表动态伸缩，装填因子可大于 1。`,
        },
        {
          id: 'kb-ds-7-7-15',
          type: 'html',
          html: `<svg viewBox="0 0 480 210" xmlns="http://www.w3.org/2000/svg" style="display:block;width:min(100%,480px);height:auto;margin-inline:auto">
  <style>
    text { font-family: system-ui, sans-serif; }
    .addr { font-size: 13px; fill: #64748b; text-anchor: middle; font-weight: 600; }
    .val  { font-size: 15px; font-weight: 700; fill: #1e3a8a; text-anchor: middle; }
    .head { fill: #dbeafe; }
    .link { stroke: #475569; stroke-width: 2; fill: none; }
    .lbl  { font-size: 14px; fill: #334155; text-anchor: middle; font-weight: 700; }
  </style>

  <text x="240" y="22" class="lbl">链地址法：H(key)=key%7，同义词挂一链</text>

  <g>
    <rect x="40" y="48" width="46" height="30" rx="5" fill="#f1f5f9"/><text x="63" y="68" class="addr">地址2</text>
    <rect x="40" y="94" width="46" height="30" rx="5" fill="#f1f5f9"/><text x="63" y="114" class="addr">地址1</text>
  </g>

  <g>
    <rect x="130" y="48" width="46" height="30" rx="5" fill="#dbeafe"/><text x="153" y="68" class="val">23</text>
    <rect x="130" y="94" width="46" height="30" rx="5" fill="#dbeafe"/><text x="153" y="114" class="val">15</text>
    <rect x="240" y="94" width="46" height="30" rx="5" fill="#dbeafe"/><text x="263" y="114" class="val">43</text>
  </g>

  <line x1="86" y1="63" x2="128" y2="63" class="link"/>
  <line x1="86" y1="109" x2="128" y2="109" class="link"/>
  <line x1="176" y1="109" x2="238" y2="109" class="link"/>
  <text x="240" y="180" class="addr" font-size="13" fill="#475569" text-anchor="middle">43、15 的 H 值都是 1，同一个链表</text>
</svg>`,
        },
        {
          id: 'kb-ds-7-7-16',
          type: 'paragraph',
          text: String.raw`上图为链地址法：22、43、15 的 $H=key\bmod 7$ 都等于 1，三者依次挂在地址 1 的链表上。链中位置即成功比较次数：15 在第 1 位比 1 次、22 第 2 位比 2 次、43 第 3 位比 3 次。`,
        },
        {
          id: 'kb-ds-7-7-26',
          type: 'callout',
          title: '链地址法不产生堆积',
          text: '链地址法把同义词都挂同一链，不占用相邻空位，所以不会像线性探测那样把后续无关关键字也顶出新位置，不会产生堆积。',
          tone: 'blue',
        },
      ],
    },
    {
      id: 'ds-7-7-s4',
      title: '散列表的 ASL',
      blocks: [
        {
          id: 'kb-ds-7-7-17',
          type: 'paragraph',
          text: String.raw`散列表的平均查找长度分成功与失败两种：

| 指标 | 含义 | 分母 |
|---|---|---|
| **ASL 成功** | 每个关键字查找次数的算术平均值 | 关键字个数 $n$ |
| **ASL 失败** | 每个散列地址查找失败时所需比较次数的平均值 | 散列表长度 $m$（地址空间大小） |`,
        },
        {
          id: 'kb-ds-7-7-18',
          type: 'callout',
          title: '线性探测删除元素不真删',
          text: '线性探测表中删除一个元素时不能直接置空，否则会切断后续冲突元素的探测链。删除只是做一个删除标记，该位置仍占据空间、查找时仍会经过。',
          tone: 'orange',
        },
      ],
    },
  ],
}
