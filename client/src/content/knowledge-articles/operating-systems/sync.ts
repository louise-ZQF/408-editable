import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const syncArticle: KnowledgeArticleData = {
  pointId: 'os-sync',
  subpoints: [
    {
      id: 'os-sync-critical',
      title: '临界区与互斥',
      blocks: [
        {
          id: 'kb-os-sync-1-1',
          type: 'paragraph',
          text: '**临界资源**：一次仅允许一个进程使用的资源，如打印机、共享变量。\n\n**临界区**：访问临界资源的那段代码。\n\n进程访问临界资源的代码分为四个区域：\n\n- **进入区**：检查是否可进入临界区，若可则设置标志。\n- **临界区**：访问临界资源。\n- **退出区**：清除标志，释放资源。\n- **剩余区**：其余代码。',
        },
        {
          id: 'kb-os-sync-1-2',
          type: 'paragraph',
          text: '进程进入临界区应遵循四条准则：\n\n- **空闲让进**：临界区空闲时允许进入。\n- **忙则等待**：临界区被占时等待。\n- **有限等待**：等待时间有限，不饥饿。\n- **让权等待**：等待时释放 CPU，不忙等。',
        },
        {
          id: 'kb-os-sync-1-3',
          type: 'paragraph',
          text: '**软件方法实现互斥（四种）**：\n\n**① 单标志法**：用共享变量 turn 表示允许进入的进程号，进程用完把 turn 让给对方。缺点：强制轮流，若对方不想进，则自己也无法进，违反"空闲让进"。\n\n```\nP0:                            P1:\nwhile (turn != 0);             while (turn != 1);\n临界区;                         临界区;\nturn = 1;                      turn = 0;\n```\n\n**② 双标志先检查法**：每个进程先检查对方标志，为 false 再置自己的标志 true 后进入。缺点：检查和置标志不是原子的，可能两个进程同时检查都为 false 而同时进入，违反"忙则等待"。\n\n```\n// flag[2] 初始为 false\nP0:                            P1:\nwhile (flag[1]);               while (flag[0]);\nflag[0] = true;                flag[1] = true;\n临界区;                         临界区;\nflag[0] = false;               flag[1] = false;\n```\n\n**③ 双标志后检查法**：先置自己的标志 true 再检查对方。缺点：可能两个进程都先置 true，然后互等对方先 false，死锁。\n\n```\nP0:                            P1:\nflag[0] = true;                flag[1] = true;\nwhile (flag[1]);               while (flag[0]);\n临界区;                         临界区;\nflag[0] = false;               flag[1] = false;\n```\n\n**④ Peterson 算法**：先置自己的标志 true，再把 turn 让给对方，最后检查对方标志为 false 或 turn 是自己的才进入。综合了双标志和单标志，能正确实现互斥、空闲让进、有限等待，但仍**忙等**（违反让权等待）。\n\n```\n// flag[2] 初始为 false，turn 任意\nP0:                                 P1:\nflag[0] = true;                     flag[1] = true;\nturn = 1;                           turn = 0;\nwhile (flag[1] && turn == 1);       while (flag[0] && turn == 0);\n临界区;                              临界区;\nflag[0] = false;                    flag[1] = false;\n```',
        },
        {
          id: 'kb-os-sync-1-4',
          type: 'paragraph',
          text: '**硬件方法实现互斥**：\n\n**① 中断屏蔽方法**：进入临界区前**关中断**，出临界区后**开中断**，保证临界区代码不被中断打断、原子执行。优点：简单高效；缺点：关中断后 CPU 不能响应其他中断（包括时钟中断），不适用于多处理器，且把关中断权力交给用户进程不安全。\n\n```\n关中断;\n临界区;\n开中断;\n```\n\n**② TestAndSet 指令（TSL）**：原子地读取并设置一个锁变量。进程循环执行 TSL，若锁为 true 则忙等，为 false 则置 true 并进入临界区，退出时置 false。优点：适用于多处理器、实现简单；缺点：**忙等**，CPU 浪费在轮询上。\n\n```\n// lock 初始为 false\nwhile (TSL(&lock));   // 原子读并置 true，返回原值\n临界区;\nlock = false;\n```\n\n**③ Swap 指令**：原子地交换两个变量的值。用 Swap 实现自旋锁，原理与 TSL 类似。优缺点与 TSL 相同。\n\n```\n// lock 初始为 false\nkey = true;\ndo {\n  Swap(&lock, &key);   // 交换 lock 与 key\n} while (key != false);\n临界区;\nlock = false;\n```',
        },
        {
          id: 'kb-os-sync-1-5',
          type: 'paragraph',
          text: '**硬件方法对比**：\n\n| 方法 | 原子性 | 多处理器 | 忙等 | 缺点 |\n|---|---|---|---|---|\n| 中断屏蔽 | 是 | 不支持 | 否 | 不能响应中断、单处理器 |\n| TSL 指令 | 是 | 支持 | 是 | 忙等轮询 |\n| Swap 指令 | 是 | 支持 | 是 | 忙等轮询 |',
        },
      ],
    },
    {
      id: 'os-sync-semaphore',
      title: '信号量与经典同步问题',
      blocks: [
        {
          id: 'kb-os-sync-2-1',
          type: 'paragraph',
          text: '**信号量**是一个整数变量，配合 P（wait）和 V（signal）两个原子操作实现同步与互斥。\n\n**整型信号量**：S 初始为资源数量，P 操作 `while(S<=0); S--`，V 操作 `S++`。\n\n**记录型信号量**：P 操作若 value≤0 则自我阻塞并加入等待队列（让权等待），V 操作唤醒队首进程。',
        },
        {
          id: 'kb-os-sync-2-4',
          type: 'paragraph',
          text: '**408 大题设计信号量的思路**：\n\n**① 找几个进程**：题目中有几个并发执行的对象，每个对象对应一个进程。\n\n**② 找互斥关系**：哪些资源/缓冲区只能被一个进程同时访问，需要互斥信号量（初值 1）。\n\n**③ 找同步关系**：哪些操作有先后依赖（如生产者放完消费者才能取），用同步信号量控制；资源数量用初值表示。\n\n**④ 列出信号量初值**：互斥信号量初值 1，同步信号量初值 = 对应资源当前可用数量。\n\n**⑤ 完成代码**：每个进程的循环里按"先 P 再 V、成对出现"的规则写代码：先申请所需资源（P），访问完释放（V）。',
        },
        {
          id: 'kb-os-sync-2-5',
          type: 'paragraph',
          text: '**例题**：只有一个盘子，能放 x 个水果，爸爸放苹果，妈妈放橘子，儿子吃苹果，女儿吃橘子。\n\n**① 四个进程**：爸爸（放苹果）、妈妈（放橘子）、儿子（吃苹果）、女儿（吃橘子）。\n\n**② 互斥关系**：盘子同一时刻只能被一个人操作，需要互斥信号量 mutex = 1。\n\n**③ 同步关系**：找出进程间有依赖的信号量。本例中：儿子/女儿吃了水果才能放 empty = x，有苹果儿子才能吃 apple = 0，有橘子女儿才能吃 orange = 0。\n\n**④ 信号量初值**：总结上述互斥与同步信号量，得出共需要四个整型信号量：mutex = 1，empty = x，apple = 0，orange = 0。\n\n**⑤ 代码**：\n\n```\n爸爸：                        妈妈：\nwhile(1) {                   while(1) {\n  P(empty);   // 申请空位        P(empty);   // 申请空位\n  P(mutex);   // 锁盘子          P(mutex);   // 锁盘子\n  放苹果;                      放橘子;\n  V(mutex);   // 解锁            V(mutex);   // 解锁\n  V(apple);   // 苹果 +1         V(orange);  // 橘子 +1\n}                             }\n\n儿子：                        女儿：\nwhile(1) {                   while(1) {\n  P(apple);   // 等苹果          P(orange);  // 等橘子\n  P(mutex);   // 锁盘子          P(mutex);   // 锁盘子\n  取苹果;                      取橘子;\n  V(mutex);   // 解锁            V(mutex);   // 解锁\n  V(empty);   // 空位 +1         V(empty);   // 空位 +1\n}                             }\n```',
        },
        {
          id: 'kb-os-sync-3-1',
          type: 'paragraph',
          text: '**生产者-消费者问题**：一组生产者向缓冲区放数据，一组消费者从缓冲区取数据，缓冲区容量为 $n$。需要三个信号量：\n\n- **mutex**：缓冲区互斥，初始 1。\n- **empty**：空槽数，初始 n。\n- **full**：满槽数，初始 0。\n\n```\n生产者：                       消费者：\nwhile(1) {                    while(1) {\n  P(empty);   // 申请空槽        P(full);    // 申请满槽\n  P(mutex);   // 进入临界区       P(mutex);\n  放入缓冲区;                  取出数据;\n  V(mutex);   // 退出临界区       V(mutex);\n  V(full);    // 增加满槽         V(empty);   // 增加空槽\n}                              }\n```',
        },
        {
          id: 'kb-os-sync-3-2',
          type: 'paragraph',
          text: '**读者-写者问题**：允许多个读者同时读，但写者必须独占。**读者优先**方案用一个计数器 count 记录读者数，读写互斥信号量 rw 初始 1，读者计数互斥 mutex 初始 1。\n\n```\n读者：                           写者：\nP(mutex);                       P(rw);\ncount++;                        写数据;\nif (count==1) P(rw);   // 第一个读者锁写  V(rw);\nV(mutex);\n读数据;\nP(mutex);\ncount--;\nif (count==0) V(rw);   // 最后一个读者解锁写\nV(mutex);\n```',
        },
        {
          id: 'kb-os-sync-3-3',
          type: 'paragraph',
          text: '**哲学家进餐问题**：5 个哲学家围桌，每两人之间一支筷子，哲学家需同时拿起左右两支筷子才能吃饭。用筷子信号量数组 chopstick[5] 各初始 1。\n\n**基本写法（可能死锁）**：\n\n```\n哲学家 i：\nP(chopstick[i]);        // 拿左筷子\nP(chopstick[(i+1)%5]);  // 拿右筷子\n吃饭;\nV(chopstick[i]);        // 放左筷子\nV(chopstick[(i+1)%5]);  // 放右筷子\n```\n\n若 5 人同时拿起左筷子，都会等右筷子，形成**死锁**。\n\n**正确写法（用信号量限制最多 4 人同时拿起筷子）**：\n\n```\n// mutex 初值 4：最多允许 4 个哲学家同时拿筷子\n哲学家 i：\nP(mutex);               // 占一个名额\nP(chopstick[i]);        // 拿左筷子\nP(chopstick[(i+1)%5]);  // 拿右筷子\nV(mutex);               // 已拿到左右筷子，释放名额\n吃饭;\nV(chopstick[i]);        // 放左筷子\nV(chopstick[(i+1)%5]);  // 放右筷子\n```\n\n其他解法：奇数号先拿左、偶数号先拿右；或用互斥量保证一次只能有一个哲学家拿筷子（拿筷子的过程用互斥保护）。',
        },
      ],
    },
    {
      id: 'os-sync-monitor',
      title: '管程',
      blocks: [
        {
          id: 'kb-os-sync-4-1',
          type: 'paragraph',
          text: '**管程**（Monitor）是定义了一个数据结构及其上操作的一组过程/函数的机制，程序员无需显式使用 P/V 操作，管程内部的变量被数据结构封装，只能在管程内部访问。由编译器保证互斥，只允许同时有一个进程进入管程，其他进程必须等待管程内部的进程访问结束后再访问管程。',
        },
        {
          id: 'kb-os-sync-4-2',
          type: 'paragraph',
          text: '管程用**条件变量**实现同步：进程在管程内发现条件不满足时，执行 **wait** 操作把自己阻塞在条件变量上并释放管程。其他进程改变条件后执行 **signal** 操作唤醒等待进程。管程的互斥由编译器/语言机制保证（不需要程序员写 P/V），同步通过条件变量实现。',
        },
        {
          id: 'kb-os-sync-4-3',
          type: 'paragraph',
          text: '**管程 vs 信号量**：\n\n| 对比 | 管程 | 信号量 |\n|---|---|---|\n| 使用方式 | 调用封装好的过程 | 自己安排 P/V 顺序 |\n| 出错概率 | 低 | 较高 |\n| 抽象层次 | 高级语言级抽象 | 系统级原语 |\n\n管程把同步机制封装在内部，程序员只需调用封装好的过程。信号量需要程序员自己正确安排 P/V 顺序，灵活但容易出错。',
        },
      ],
    },
  ],
}
