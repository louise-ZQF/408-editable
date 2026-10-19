import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'
import { kmpImprovedAnimation } from '@/animations/data-structures/string/kmp'

export const ds4_3KmpImprovedArticle: KnowledgeArticleData = {
  pointId: 'ds-4-3-kmp-improved',
  subpoints: [
    {
      id: 'ds-4-3-s1',
      title: '为什么要修正 next 数组',
      blocks: [
       
        {
          id: 'kb-ds-4-3-1-1',
          type: 'paragraph',
          text: '**原版 next 数组存在冗余**：当 t[j] 失配并跳到 next[j] 后，若 t[next[j]] 恰好等于 t[j]，则回跳后的比较必然再次失败，白白浪费一次。',
        },
        {
          id: 'kb-ds-4-3-1-2',
          type: 'paragraph',
          text: '**改进思路**：对 next 做一次修正，跳过这些必失败的比较：\n\n1. 若 t[j] == t[next[j]]，把 nextval[j] 设为 nextval[next[j]]。\n2. 否则 nextval[j] = next[j]。\n\n修正后的数组记作 **nextval（修正 next 数组）**，用它可进一步减少比较次数。',
        },
        {
          id: 'kb-ds-4-3-1-3',
          type: 'paragraph',
          text: '以模式串 "ababa"（下标 0 起）为例：其 next 数组为 {-1,0,0,1,2}。失配在 j=3 时 next 跳到 1，但 t[3]=b、t[1]=b 相同，跳到 1 后仍与主串失配，属于重复无谓比较；修正后 nextval[3]=0，减少了这次多余比较。',
        },
        {
          id: 'kb-ds-4-3-1-4',
          type: 'callout',
          title: 'nextval 修正的是"必失败的回跳"',
          text: '只有当回跳目标字符与失配字符相同（t[j]==t[next[j]]）时才会造成无用比较。修正让这类回跳改为跳到 nextval[next[j]]，即更早的位置，从而少一次比较。',
          tone: 'orange',
        },
      ],
    },
    {
      id: 'ds-4-3-s2',
      title: 'nextval 的求法',
      blocks: [
        {
          id: 'kb-ds-4-3-2-1',
          type: 'paragraph',
          text: String.raw`**nextval 手算规则**（在 next 基础上，下标从 0 起）：nextval[0] = -1。对 j ≥ 1，设 k = next[j]：
- 若 **t[j] == t[k]**，则 **nextval[j] = nextval[k]**（沿用更早的修正值）；
- 若 **t[j] ≠ t[k]**，则 **nextval[j] = next[j]**（保留原回跳位置）。`,
        },
        {
          id: 'kb-ds-4-3-2-2',
          type: 'paragraph',
          text: String.raw`**例**：求模式串 $T=\text{"ababa"}$ 的 nextval 数组。

**解**：先算 next 为 {-1,0,0,1,2}，再逐位判断 t[j] 与 t[next[j]] 是否相等：

| 下标 j | 字符 t[j] | next[j] | next[j] 处字符 | 是否相等 | nextval[j] |
|---|---|---|---|---|---|
| 0 | a | -1 | — | — | -1 |
| 1 | b | 0 | a | 否 | 0 |
| 2 | a | 0 | a | 是 | nextval[0]=-1 |
| 3 | b | 1 | b | 是 | nextval[1]=0 |
| 4 | a | 2 | a | 是 | nextval[2]=-1 |

**答**：nextval = {-1, 0, -1, 0, -1}。`,
        },
        {
          id: 'kb-ds-4-3-2-3',
          type: 'paragraph',
          text: String.raw`**next 与 nextval 的对比**：

| 数组 | 定义 | 失配 j 的回跳目标 | 是否有无用比较 |
|---|---|---|---|
| next | 前 j 个字符的最长相等真前后缀长度 | next[j] | 可能有（回跳字符相同） |
| nextval | 在 next 上消除相同回跳 | next 或 nextval[next[j]] | 没有（跳过必败比较） |`,
        },
        {
          id: 'kb-ds-4-3-2-4',
          type: 'callout',
          title: '先求 next 再求 nextval',
          text: 'nextval 是建立在 next 之上的第二层加工，绝不可能绕开 next 直接算出。本约定下标从 0 起，next[0] 与 nextval[0] 恒为 -1。',
          tone: 'blue',
        },
      ],
    },
  ],
}
