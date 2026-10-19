import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'
import { kmpAnimation } from '@/animations/data-structures/string/kmp'

export const ds4_2KmpArticle: KnowledgeArticleData = {
  pointId: 'ds-4-2-kmp',
  subpoints: [
    {
      id: 'ds-4-2-s1',
      title: 'KMP 的思想',
      blocks: [
        {
          id: 'kb-ds-4-2-1-5',
          type: 'animation',
          animation: kmpAnimation,
          sourceImport: { path: '@/animations/data-structures/string/kmp', localName: 'kmpAnimation', kind: 'named' },
        },
        {
          id: 'kb-ds-4-2-1-1',
          type: 'paragraph',
          text: '**KMP 算法**（Knuth–Morris–Pratt）用已经匹配的部分，避免主串指针回溯。当模式串与主串某处失配时，主串指针不退回本趟起点，而是让模式串向右滑动到合适位置继续匹配。',
        },
        {
          id: 'kb-ds-4-2-1-2',
          type: 'paragraph',
          text: '若已匹配的部分内存在**相等的真前后缀**，则模式串可以整体滑到"前后缀对齐"的位置，主串指针不动。这个滑动量只由模式串自身决定，与主串无关，因此可以**预先求出**。',
        },
        {
          id: 'kb-ds-4-2-1-3',
          type: 'paragraph',
          text: '与 **BF 算法**（Brute Force，暴力匹配）相比，KMP 在失配后主串指针 i **只增不减**，模式串指针 j 由 next 数组决定跳到 next[j]，从而把最坏时间降到 $O(n + m)$，其中 $n$ 为主串长、$m$ 为模式串长。',
        },
        {
          id: 'kb-ds-4-2-1-4',
          type: 'callout',
          title: 'KMP 加速的本质',
          text: 'KMP 不是减少匹配趟数，而是每趟失配时不重复比较已匹配且能确认相等的前后缀部分。滑动量由 next 数组给出，与主串内容无关。',
          tone: 'blue',
        },
      ],
    },
    {
      id: 'ds-4-2-s2',
      title: 'next 数组的定义与手算',
      blocks: [
        {
          id: 'kb-ds-4-2-2-1',
          type: 'paragraph',
          text: '**next 数组**：next[j] 表示当模式串第 j 位（下标从 0 开始）与主串失配时，模式串下一步应指向的位置。**约定 next[0] = -1**；对 j > 0，**next[j] 等于模式串前 j 个字符（下标 0 到 j-1）的最长相等真前后缀的长度**。',
        },
        {
          id: 'kb-ds-4-2-2-2',
          type: 'paragraph',
          text: '**手算规则**：next[0] = -1。对 j ≥ 1，看模式串前 j 个字符（不含当前字符 t[j]），找其中**最长的相等真前缀和后缀**，其长度就是 next[j]；若不存在相等真前后缀，则 next[j] = 0。',
        },
        {
          id: 'kb-ds-4-2-2-3',
          type: 'paragraph',
          text: String.raw`**例**：模式串 $T=\text{"abaabc"}$（下标 0 起，长度 6），逐步求 next：

| 下标 j | 字符 t[j] | 前 j 个字符 | 最长相等真前后缀 | 长度 | next[j] |
|---|---|---|---|---|---|
| 0 | a | — | — | — | **-1** |
| 1 | b | a | 无 | 0 | 0 |
| 2 | a | ab | 无 | 0 | 0 |
| 3 | a | aba | a | 1 | 1 |
| 4 | b | abaa | a | 1 | 1 |
| 5 | c | abaab | ab | 2 | 2 |

**答**：next = {-1, 0, 0, 1, 1, 2}。`,
        },
        {
          id: 'kb-ds-4-2-2-4',
          type: 'paragraph',
          text: String.raw`**例**：模式串 $T=\text{"aaaab"}$，逐步求 next：

| 下标 j | 字符 t[j] | 前 j 个字符 | 最长相等真前后缀 | 长度 | next[j] |
|---|---|---|---|---|---|
| 0 | a | — | — | — | **-1** |
| 1 | a | a | 无 | 0 | 0 |
| 2 | a | aa | a | 1 | 1 |
| 3 | a | aaa | aa | 2 | 2 |
| 4 | b | aaaa | aaa | 3 | 3 |

**答**：next = {-1, 0, 1, 2, 3}。`,
        },
      ],
    },
    {
      id: 'ds-4-2-s3',
      title: 'KMP 匹配过程',
      blocks: [
        {
          id: 'kb-ds-4-2-3-1',
          type: 'paragraph',
          text: `**KMP 匹配流程**（下标 0 起）：主串 $S$ 与模式串 $T$ 各设指针 i、j。逐字符比较：

1. 若 s[i] 与 t[j] 相等，则 i、j 同时加 1。
2. 若失配且 j = 0，则 i 加 1（j 保持 0，从当前位置重新比）。
3. 否则失配时 j = next[j]，i **不变**；若 next[j] = -1，则 j 回到 0、i 加 1。

当 j 超过模式串长度 m 时匹配成功。`,
        },
        {
          id: 'kb-ds-4-2-3-2',
          type: 'html',
          html: `<svg viewBox="0 0 620 230" xmlns="http://www.w3.org/2000/svg" style="display:block;width:min(100%,620px);height:auto;margin-inline:auto">
  <style>
    text { font-family: system-ui, sans-serif; }
    .pos  { font-size: 15px; fill: #64748b; text-anchor: middle; font-weight: 600; }
    .lbl  { font-size: 15px; fill: #475569; text-anchor: end; font-weight: 700; }
    .nxt  { font-size: 15px; fill: #b45309; text-anchor: middle; font-weight: 700; }
  </style>

  <g>
    <text x="50" y="60" class="lbl">主串</text>
    <text x="50" y="170" class="lbl">模式</text>
    <text x="50" y="210" class="lbl">next</text>
  </g>

  <g>
    <text x="90"  y="24" class="pos">0</text>
    <text x="170" y="24" class="pos">1</text>
    <text x="250" y="24" class="pos">2</text>
    <text x="330" y="24" class="pos">3</text>
    <text x="410" y="24" class="pos">4</text>
    <text x="490" y="24" class="pos">5</text>
  </g>

  <g>
    <rect x="64"  y="34" width="52" height="42" rx="6" fill="#e0e7ff"/>
    <text x="90"  y="60" class="pos">a</text>
    <rect x="144" y="34" width="52" height="42" rx="6" fill="#e0e7ff"/>
    <text x="170" y="60" class="pos">b</text>
    <rect x="224" y="34" width="52" height="42" rx="6" fill="#e0e7ff"/>
    <text x="250" y="60" class="pos">a</text>
    <rect x="304" y="34" width="52" height="42" rx="6" fill="#e0e7ff"/>
    <text x="330" y="60" class="pos">a</text>
    <rect x="384" y="34" width="52" height="42" rx="6" fill="#e0e7ff"/>
    <text x="410" y="60" class="pos">b</text>
    <rect x="464" y="34" width="52" height="42" rx="6" fill="#fecaca"/>
    <text x="490" y="60" class="pos">a</text>
  </g>

  <g>
    <rect x="64"  y="144" width="52" height="42" rx="6" fill="#d1fae5"/>
    <text x="90"  y="170" class="pos">a</text>
    <rect x="144" y="144" width="52" height="42" rx="6" fill="#d1fae5"/>
    <text x="170" y="170" class="pos">b</text>
    <rect x="224" y="144" width="52" height="42" rx="6" fill="#d1fae5"/>
    <text x="250" y="170" class="pos">a</text>
    <rect x="304" y="144" width="52" height="42" rx="6" fill="#d1fae5"/>
    <text x="330" y="170" class="pos">a</text>
    <rect x="384" y="144" width="52" height="42" rx="6" fill="#d1fae5"/>
    <text x="410" y="170" class="pos">b</text>
    <rect x="464" y="144" width="52" height="42" rx="6" fill="#fbbf24"/>
    <text x="490" y="170" class="pos">c</text>
  </g>

  <g>
    <text x="90"  y="210" class="nxt">-1</text>
    <text x="170" y="210" class="nxt">0</text>
    <text x="250" y="210" class="nxt">0</text>
    <text x="330" y="210" class="nxt">1</text>
    <text x="410" y="210" class="nxt">1</text>
    <text x="490" y="210" class="nxt">2</text>
  </g>
</svg>`,
        },
        {
          id: 'kb-ds-4-2-3-3',
          type: 'paragraph',
          text: '图中前 5 位（下标 0 到 4）a、b、a、a、b 都匹配成功，第 6 位（下标 5）失配：主串该位是 a，模式串第 6 位是 c。此时 j=5，模式串按 **next[5]=2** 滑动，模式串下标 2 与主串当前位对齐，主串指针 i 不动，继续比较。',
        },
        {
          id: 'kb-ds-4-2-3-4',
          type: 'paragraph',
          text: String.raw`**例**：主串 $S=\text{"abaabaabcabaabc"}$，模式串 $T=\text{"abaabc"}$，其 next 数组为 {-1,0,0,1,1,2}（下标 0 起）。用 KMP 统计匹配成功前的逐字符比较次数。

**解**（逐次比较如下表）：

| 次序 | 比较 s[i] 与 t[j] | 结果 | i、j 变化 |
|---|---|---|---|
| 1-5 | a、b、a、a、b 依次相等 | 成功 | i=5，j=5 |
| 6 | t[5]=c 对 s[5]=a | 失配 | j 跳 next[5]=2，i 不变 |
| 7 | t[2]=a 对 s[5]=a | 成功 | i=6，j=3 |
| 8 | t[3]=a 对 s[6]=a | 成功 | i=7，j=4 |
| 9 | t[4]=b 对 s[7]=b | 成功 | i=8，j=5 |
| 10 | t[5]=c 对 s[8]=c | 成功 | j=6 越界，匹配成功 |

**答**：共比较 **10** 次，模式串首次出现在主串下标 3 处。`,
        },
        {
          id: 'kb-ds-4-2-3-5',
          type: 'callout',
          title: '统计比较次数要逐字符加一',
          text: 'KMP 每次失配主串指针不回退，统计比较次数只要顺着 i 一路数过去，把匹配成功和失配的每一次字符比较都累加即可，失配那次也要计入。',
          tone: 'blue',
        },
      ],
    },
    {
      id: 'ds-4-2-s4',
      title: '失配滑动与复杂度',
      blocks: [
        {
          id: 'kb-ds-4-2-4-1',
          type: 'paragraph',
          text: String.raw`**例**：已知 $S=\text{"abaabaabacacaabaabcc"}$、$T=\text{"abaabc"}$。采用 KMP 匹配，首次失配发生在 $S[5]\neq T[5]$（下标从 0 起），求失配后主串指针 i 与模式串指针 j 的值。
          **解**
          1. T="abaabc" 的 next 数组为 {-1,0,0,1,1,2}（下标 0 起）。
          2. 失配位置是下标 5，应取 next[5]=2。
          3. 失配后 j 跳到 2；主串指针 i **保持 5 不变**。
          **答**：失配后 i=5、j=2。`,
        },
        {
          id: 'kb-ds-4-2-4-2',
          type: 'paragraph',
          text: String.raw`KMP 的时间复杂度为 $O(n+m)$：求 next 数组扫描模式串一遍为 $O(m)$，匹配过程主串指针最多前进 $n$ 次为 $O(n)$，两者相加。BF 是 $O(n\times m)$，这是 KMP 的改进所在。`,
        },
        {
          id: 'kb-ds-4-3-3-4',
          type: 'paragraph',
          text: String.raw`**滑动距离**：模式串失配在位置 j 时，向右滑动的距离为 $j-\text{nextval}[j]$。以 T="aabaab"（nextval = {-1,-1,1,-1,-1,1}）为例：j=1 滑 2，j=2 滑 1，j=3 滑 4，j=4 滑 5，j=5 滑 4。**最长滑动距离为 5**，发生在下标 4 失配时（nextval[4]=-1，模式串整体右移 5 位）。`,
        },
        {
          id: 'kb-ds-4-3-3-5',
          type: 'callout',
          title: '滑动距离 = j − nextval[j]',
          text: '求最长滑动距离，要把每个失配位置都算一遍取最大，不能只看 nextval 的最大值。nextval[j]=-1 往往意味着该位失配会让模式串滑动最远。',
          tone: 'orange',
        },
        {
          id: 'kb-ds-4-2-4-3',
          type: 'callout',
          title: 'next 数组下标从 0 开始、next[0] = -1',
          text: '本约定下 next[0] = -1，其余 next[j] 等于前 j 个字符的最长相等真前后缀长度。失配时 j 跳到 next[j]；若 next[j] = -1 则模式串整体右移、j 回到 0 且主串指针前进。做题先看题干下标约定是否一致。',
          tone: 'orange',
        },
      ],
    },
  ],
}
