import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const ds3_4QueueApplicationArticle: KnowledgeArticleData = {
  pointId: 'ds-3-4-queue-application',
  subpoints: [
    {
      id: 'ds-3-4-s1',
      title: '层次遍历与广度优先中的队列',
      blocks: [
        {
          id: 'kb-ds-3-4-1-1',
          type: 'paragraph',
          text: '**层次遍历**（树的按层遍历）用队列实现：先把根结点入队；队列非空时，出队队头结点并访问它，再把它未访问的孩子依次入队。结点按"先入先出"的顺序被访问，正好对应按层从左到右输出。',
        },
        {
          id: 'kb-ds-3-4-1-2',
          type: 'paragraph',
          text: '**广度优先搜索**（BFS，Breadth First Search）遍历图时同样用队列：从某顶点出发入队并标记，出队访问后把其所有未访问邻接顶点入队。队列保证了"距出发点距离近的顶点先被搜索"，与栈实现的深度优先恰好相反。',
        },
        {
          id: 'kb-ds-3-4-1-3',
          type: 'callout',
          title: '深度优先用栈、广度优先用队列',
          text: 'DFS（深度优先搜索）需要"后进先出"回溯，用栈；BFS 需要"先进先出"逐层展开，用队列。这一对应关系在树、图的遍历中始终成立。',
          tone: 'orange',
        },
      ],
    },
    {
      id: 'ds-3-4-s2',
      title: '生产者-消费者问题中的队列',
      blocks: [
        {
          id: 'kb-ds-3-4-2-1',
          type: 'paragraph',
          text: '操作系统用缓冲区解耦**速度不匹配**的两个设备，队列是缓冲区的天然模型：数据按到达顺序写入缓冲，设备按同样顺序读取，先到的数据先被处理，不会乱序、不会丢失。CPU 与打印机之间、CPU 与磁盘之间都靠这类缓冲区协调速率。',
        },
        {
          id: 'kb-ds-3-4-2-2',
          type: 'paragraph',
          text: '**生产者-消费者问题**：生产者进程往有界缓冲区放入数据（入队），消费者进程从缓冲区取走数据（出队）。缓冲区同时只能容纳有限个数据，靠信号量协调"缓冲区已满时生产者等待、已空时消费者等待"。',
        },
        {
          id: 'kb-ds-3-4-2-3',
          type: 'paragraph',
          text: '多个缓冲区可组成**缓冲池**统一管理，比单个缓冲区吞吐能力更强。队列在这里保证数据的 FIFO 顺序。',
        },
        {
          id: 'kb-ds-3-4-2-4',
          type: 'callout',
          title: '队列保证顺序、信号量保证互斥',
          text: '队列只负责按先来后到排列数据；生产与消费的互斥、等待唤醒由信号量（P/V 操作）完成，两者分工不同，不要混为一谈。',
          tone: 'blue',
        },
      ],
    },
    
  ],
}
