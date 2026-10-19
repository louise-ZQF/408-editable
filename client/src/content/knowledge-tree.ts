import { reactive, watch } from 'vue'
import { workspace } from '@/editor/store'
import type { Book } from '@/types'

export const computerNetworkBook: Book = {
  id: 'computer-network',
  title: '计算机网络',
  subtitle: '408 计算机网络知识体系',
  subject: 'NETWORK',
  chapters: [
    {
      id: 'chapter-overview',
      title: '计算机网络体系结构',
      layer: 'TOP',
      sections: [
        {
          id: 'section-architecture',
          title: '网络的分层',
          points: [
            {
              id: 'kp-layering',
              title: 'TCP/IP与OSI',
              summary: '理解TCP/IP 模型与OSI 模型。',
              importance: 4,
            },{
              id: 'kp-protocol',
              title: '协议/接口/服务',
              summary: '理解协议、服务与接口的区别。',
              importance: 4,
            }
          ],
        },{
          id: 'section-performance-metrics',
          title: '网络的性能指标',
          points: [
            {
              id: 'kp-rate',
              title: '速率、带宽与吞吐量',
              summary: '用发送时延、传播时延等指标判断链路性能。',
              importance: 4,
            },
            {
              id: 'kp-delay',
              title: '时延、时延带宽积',
              summary: '理解时延带宽积的计算方法。',
              importance: 4,
            },{
              id: 'kp-utilization',
              title: 'RTT与信道利用率',
              summary: '理解信道利用率的计算方法。',
              importance: 4,
            }
          ],
        },
      ],
    },
    {
      id: 'chapter-physical',
      title: '物理层',
      layer: 'L1',
      sections: [
        {
          id: 'section-communication-basic',
          title: '通信基础',
          points: [
            {
              id: 'kp-data',
              title: '通信的基本概念',
              summary: '理解通信的基本概念。',
              importance: 5,
            },{
              id: 'kp-nyquist-shannon',
              title: '奈奎斯特定理与香农定理',
              summary: '理解奈奎斯特定理与香农定理的含义。',
              importance: 5,
            },{
              id: 'kp-switching',
              title: '电路交换、分组交换、报文交换',
              summary: '理解不同交换方式的区别。',
              importance: 5,
            },
          ],
        },
        {
          id: 'section-encoding-modulation',
          title: '编码与调制',
          points: [
            {
              id: 'kp-encoding',
              title: '信号的编码',
              summary: '用归零、曼切斯特编码等方法对信号进行编码。',
              importance: 5,
            },{
              id: 'kp-digital-analog',
              title: '数字信号与模拟信号',
              summary: '理解数字信号与模拟信号的区别。',
              importance: 5,
            },
          ],
        },
        {
          id: 'section-transport-medium',
          title: '传输介质与物理层设备',
          points: [
            {
              id: 'kp-transport-medium',
              title: '传输介质',
              summary: '理解不同的传输介质及其工作原理。',
              importance: 5,
            },{
              id: 'kp-physical-layer',
              title: '物理层设备',
              summary: '理解物理层设备的功能与作用。',
              importance: 5,
            },
          ],
        },
      ],
    },
    {
      id: 'chapter-link',
      title: '数据链路层',
      layer: 'L2',
      sections: [
        {
          id: 'section-error-control',
          title: '差错控制',
          points: [
            {
              id: 'kp-parity-check-code',
              title: '奇偶校验码',
              summary: '掌握奇偶校验码的原理与应用。',
              importance: 5,
            },
            {
              id: 'kp-crc',
              title: '循环冗余校验码',
              summary: '掌握循环冗余校验码的原理与应用。',
              importance: 5,
            },
            {
              id: 'kp-hamming-code',
              title: '海明码',
              summary: '掌握海明码的原理与应用。（包括海明距离与编码检错纠错能力）',
              importance: 5,
            },
          ],
        },
        {
          id: 'section-flow-control',
          title: '流量控制',
          points: [
            {
              id: 'kp-stop-wait-protocol',
              title: '停止等待协议',
              summary: '掌握停止等待协议的原理与应用。',
              importance: 5,
            },
            {
              id: 'kp-gbn',
              title: '后退N帧协议（GBN）',
              summary: '掌握滑动窗口、累计确认、序号空间与超时重传。',
              importance: 5,
            },
            {
              id: 'kp-selective-repeat-protocol',
              title: '选择重传协议',
              summary: '掌握选择重传协议的原理与应用。',
              importance: 5,
            },
            {
              id: 'kp-protocol-comparison',
              title: '协议对比',
              summary: '对比不同流量控制协议的优势与劣势。',
              importance: 5,
            },
          ],
        },{
          id: 'section-access-control',
          title: '介质访问控制',
          points: [
            {
              id: 'kp-multiplexing',
              title: '多路复用',
              summary: '掌握多路复用的原理与应用。',
              importance: 5,
            },
            {
              id: 'kp-aloha-protocol',
              title: 'ALOHA协议',
              summary: '掌握ALOHA协议的原理与应用。',
              importance: 5,
            },
            {
              id: 'kp-csma-protocol',
              title: 'CSMA协议',
              summary: '掌握1-坚持、非坚持、p-坚持三种CSMA策略的区别与适用场景。',
              importance: 5,
            },
            {
              id: 'kp-csma-cd-protocol',
              title: 'CSMA/CD协议',
              summary: '掌握CSMA/CD协议的原理与应用。（注意说明CSMA/CD的思路是冲突检测）',
              importance: 5,
            },
            {
              id: 'kp-csma-ca-protocol',
              title: 'CSMA/CA协议',
              summary: '掌握CSMA/CA协议的原理与应用。（注意说明CSMA/CA的思路是冲突避免）',
              importance: 5,
            },
          ],
        },{
          id: 'section-local-area-network',
          title: '局域网',
          points: [
            {
              id: 'kp-ethernet-token-ring',
              title: '以太网和令牌环网',
              summary: '分清以太网、令牌环网。并搞清楚拓扑结构，编码方式，传输介质。',
              importance: 5,
            },
            {
              id: 'kp-local-area-network-frame',
              title: '局域网帧',
              summary: '掌握局域网的帧格式。包括以太网帧，无线帧等。',
              importance: 5,
            },
            {
              id: 'kp-vlan',
              title: 'Vlan',
              summary: '掌握Vlan的原理与应用。',
              importance: 5,
            },{
              id: 'kp-hdlc-ppp',
              title: 'HDLC和PPP协议',
              summary: '掌握HDLC和PPP协议的原理与应用。',
              importance: 5,
            },
          ],
        },{
          id: 'section-link-layer-device',
          title: '数据链路层设备',
          points: [
            {
              id: 'kp-switching-device',
              title: '以太网交换机',
              summary: '掌握以太网交换机的原理与应用。',
              importance: 5,
            },
            {
              id: 'kp-bridge',
              title: '网桥',
              summary: '掌握网桥的原理与应用。',
              importance: 5,
            }
          ],
        }
      ],
    },
    {
      id: 'chapter-network',
      title: '网络层',
      layer: 'L3',
      sections: [
        {
          id: 'section-ip',
          title: 'IP 与 IP 协议',
          points: [
            {
              id: 'kp-ip-address',
              title: 'IP 地址格式与分类',
              summary: '掌握 IPv4 地址的点分十进制格式、网络号与主机号，以及 A/B/C/D/E 类分类和 CIDR 表示。',
              importance: 5,
            },
            {
              id: 'kp-subnet',
              title: '子网掩码与子网划分',
              summary: '用子网掩码区分网络号和主机号，掌握 CIDR 与从主机号借位划分子网（含 VLSM）的方法。',
              importance: 5,
            },
            {
              id: 'kp-ipv4',
              title: 'IPv4',
              summary: '掌握 IPv4 数据报首部结构、各字段功能、首部校验和与 MTU 分片计算。',
              importance: 5,
            },
            {
              id: 'kp-ipv6',
              title: 'IPv6',
              summary: '掌握 IPv6 地址表示、基本首部与 IPv4 的区别，以及过渡技术。',
              importance: 4,
            },
            {
              id: 'kp-ip-extension',
              title: '组播 · 移动 IP · SDN',
              summary: '理解 IP 组播与 IGMP、移动 IP 的代理与隧道，以及 SDN 的控制与数据平面分离和南北向接口。',
              importance: 3,
            },
          ],
        },
        {
          id: 'section-network-protocols',
          title: '网络层协议',
          points: [
            {
              id: 'kp-arp',
              title: 'ARP 地址解析',
              summary: '理解已知 IP 地址时如何获得同一链路对应的 MAC 地址。',
              importance: 4,
            },
            {
              id: 'kp-icmp',
              title: 'ICMP',
              summary: '掌握 ICMP 差错报告与询问两类报文，理解 ping 与 TTL 超时的关系。',
              importance: 4,
            },
            {
              id: 'kp-dhcp',
              title: 'DHCP',
              summary: '掌握 DHCP 动态分配 IP 地址的四步交互过程。',
              importance: 3,
            },
          ],
        },
        {
          id: 'section-routing',
          title: '路由算法',
          points: [
            {
              id: 'kp-rip',
              title: 'RIP',
              summary: '掌握 RIP 的跳数度量、距离向量原理与 16 跳不可达限制。',
              importance: 4,
            },
            {
              id: 'kp-ospf',
              title: 'OSPF',
              summary: '掌握 OSPF 的链路状态原理、Dijkstra 算法与区域划分。',
              importance: 4,
            },
            {
              id: 'kp-bgp',
              title: 'BGP',
              summary: '理解自治系统概念，分清 AS 间（eBGP）与 AS 内（iBGP），掌握 BGP 的路径向量选路。',
              importance: 4,
            },
          ],
        },
        {
          id: 'section-network-devices',
          title: '网络层设备',
          points: [
            {
              id: 'kp-router',
              title: '路由器',
              summary: '掌握路由器的分组转发与路由选择功能，理解其与交换机的区别。',
              importance: 4,
            },
          ],
        },
      ],
    },
    {
      id: 'chapter-transport',
      title: '传输层',
      layer: 'L4',
      sections: [
        {
          id: 'section-tcp',
          title: 'TCP',
          points: [
            {
              id: 'kp-tcp-header',
              title: 'TCP 结构',
              summary: '理解 TCP 首部各字段含义及报文段格式。',
              importance: 5,
            },
            {
              id: 'kp-tcp-handshake',
              title: 'TCP 连接管理',
              summary: '从序号确认关系和状态迁移理解连接建立与释放。',
              importance: 5,
            },
            {
              id: 'kp-tcp-reliable',
              title: 'TCP 可靠传输',
              summary: '理解累计确认、超时重传与冗余 ACK 机制。',
              importance: 5,
            },
            {
              id: 'kp-tcp-flow-control',
              title: 'TCP 流量控制与拥塞控制',
              summary: '理解滑动窗口机制与 rwnd 的动态调整，区分慢开始、拥塞避免、快重传与快恢复。',
              importance: 5,
            },
          ],
        },
        {
          id: 'section-udp',
          title: 'UDP',
          points: [
            {
              id: 'kp-udp-header',
              title: 'UDP 数据报',
              summary: '理解 UDP 首部各字段及与 TCP 的对比。',
              importance: 4,
            },
            {
              id: 'kp-udp-checksum',
              title: 'UDP 校验',
              summary: '理解 UDP 校验和的伪首部计算方法。',
              importance: 4,
            },
          ],
        },
      ],
    },
    {
      id: 'chapter-application',
      title: '应用层',
      layer: 'L5',
      sections: [
        {
          id: 'section-application',
          title: '应用层协议',
          points: [
            {
              id: 'kp-dns',
              title: '域名系统 DNS',
              summary: '理解 DNS 分层结构、递归与迭代查询、DNS 记录类型与缓存机制。',
              importance: 4,
            },
            {
              id: 'kp-ftp',
              title: '文件传输协议 FTP',
              summary: '掌握控制连接与数据连接的分离、主动与被动模式的区别。',
              importance: 4,
            },
            {
              id: 'kp-email',
              title: '电子邮件',
              summary: '理解 MUA → MTA → MDA 邮递流程，掌握 SMTP、POP3 与 IMAP 的职责与区别。',
              importance: 4,
            },
            {
              id: 'kp-http',
              title: '万维网与 HTTP',
              summary: '理解 URL 结构、HTTP 报文格式与状态码，区分非持续与持续连接，掌握 Web 缓存与 Cookie。',
              importance: 5,
            },
          ],
        },
      ],
    },
  ],
}

export const dataStructuresBook: Book = {
  id: 'data-structures',
  title: '数据结构',
  subtitle: '408 数据结构知识体系',
  subject: 'DATA_STRUCTURES',
  chapters: [
    {
      id: 'ds-chapter-1',
      title: '绪论',
      layer: 'DS',
      sections: [
        {
          id: 'ds-section-1',
          title: '数据结构基本概念',
          points: [
            { id: 'ds-1-1-basics', title: '数据结构基本概念', summary: '理解数据、数据元素、数据项，逻辑结构与存储结构，抽象数据类型。', importance: 4 },
          ],
        },
        {
          id: 'ds-section-1-2',
          title: '算法与空间复杂度',
          points: [
            { id: 'ds-1-2-time-complexity', title: '算法与时间复杂度', summary: '掌握算法特性、时间复杂度分析方法与大 O 记号、常见量级。', importance: 5 },
            { id: 'ds-1-3-space-complexity', title: '空间复杂度', summary: '掌握空间复杂度的分析方法，区分时间与空间复杂度。', importance: 4 },
          ],
        },
      ],
    },
    {
      id: 'ds-chapter-2',
      title: '线性表',
      layer: 'DS',
      sections: [
        {
          id: 'ds-section-2',
          title: '线性表的概念',
          points: [
            { id: 'ds-2-1-concept', title: '线性表的基本概念', summary: '掌握线性表的定义、逻辑结构、基本操作。', importance: 4 },
            { id: 'ds-2-2-sequential-list', title: '顺序表', summary: '掌握顺序表的存储结构、插入删除查找的时间复杂度及适用场景。', importance: 5 },
            { id: 'ds-2-3-singly-linked-list', title: '单链表', summary: '掌握单链表的建立、插入、删除、查找，头结点与头指针。', importance: 5 },
            { id: 'ds-2-4-double-circular-static-list', title: '双链表、循环链表与静态链表', summary: '掌握双链表、循环链表、静态链表的结构与操作。', importance: 4 },
          ],
        },
        {
          id: 'ds-section-2-2',
          title: '线性表的应用',
          points: [
            { id: 'ds-2-5-application', title: '线性表的应用', summary: '掌握有序表合并、逆置、删除重复元素等典型应用。', importance: 4 },
          ],
        },
      ],
    },
    {
      id: 'ds-chapter-3',
      title: '栈、队列与数组',
      layer: 'DS',
      sections: [
        {
          id: 'ds-section-3',
          title: '栈',
          points: [
            { id: 'ds-3-1-stack', title: '栈的基本概念与实现', summary: '掌握栈的后进先出特性、顺序栈与链栈、共享栈。', importance: 5 },
            { id: 'ds-3-2-stack-application', title: '栈的应用', summary: '掌握括号匹配、表达式求值（中缀转后缀）、递归的栈实现。', importance: 5 },
          ],
        },
        {
          id: 'ds-section-3-2',
          title: '队列',
          points: [
            { id: 'ds-3-3-queue', title: '队列的基本概念与实现', summary: '掌握队列的先进先出特性、顺序队列、循环队列与链队列。', importance: 5 },
            { id: 'ds-3-4-queue-application', title: '队列的应用', summary: '掌握层次遍历、缓冲区等队列应用场景。', importance: 3 },
          ],
        },
        {
          id: 'ds-section-3-3',
          title: '特殊矩阵的压缩存储',
          points: [
            { id: 'ds-3-5-matrix-compression', title: '特殊矩阵的压缩存储', summary: '掌握对称矩阵、三角矩阵、三对角矩阵与稀疏矩阵的压缩存储及下标换算。', importance: 4 },
          ],
        },
      ],
    },
    {
      id: 'ds-chapter-4',
      title: '串与 KMP',
      layer: 'DS',
      sections: [
        {
          id: 'ds-section-4',
          title: '串与 KMP',
          points: [
            { id: 'ds-4-1-string-basic', title: '串的基本概念与朴素匹配', summary: '掌握串的定义、存储结构与朴素模式匹配。', importance: 3 },
            { id: 'ds-4-2-kmp', title: 'KMP 算法', summary: '掌握 next 数组的求法、KMP 匹配过程与时间复杂度。', importance: 5 },
            { id: 'ds-4-3-kmp-improved', title: 'KMP 算法的改进', summary: '掌握 nextval 数组的求法及其与 next 数组的区别。', importance: 4 },
          ],
        },
      ],
    },
    {
      id: 'ds-chapter-5',
      title: '树与二叉树',
      layer: 'DS',
      sections: [
        {
          id: 'ds-section-5',
          title: '树与二叉树的基本概念',
          points: [
            { id: 'ds-5-1-tree-concept', title: '树的基本概念', summary: '掌握树的定义、基本术语（度、深度、层次）与性质。', importance: 4 },
            { id: 'ds-5-2-binary-tree-concept', title: '二叉树的概念与性质', summary: '掌握二叉树的五种形态、性质、完全二叉树与满二叉树。', importance: 5 },
          ],
        },
        {
          id: 'ds-section-5-2',
          title: '树与二叉树的存储',
          points: [
            { id: 'ds-5-3-binary-tree-store-traverse', title: '二叉树的存储', summary: '掌握顺序存储与链式存储结构。', importance: 5 },
            { id: 'ds-5-4-threaded-binary-tree', title: '线索二叉树', summary: '掌握线索化的思想、线索二叉树的构造与找前驱后继。', importance: 4 },
            { id: 'ds-5-5-tree-forest', title: '树与森林', summary: '掌握树/森林的存储结构、树转二叉树、森林转二叉树及遍历对应关系。', importance: 4 },
          ],
        },
        {
          id: 'ds-section-5-3',
          title: '树与二叉树的应用',
          points: [
            { id: 'ds-5-6-huffman', title: '哈夫曼树与哈夫曼编码', summary: '掌握 WPL 计算、哈夫曼树构造、哈夫曼编码与前缀编码。', importance: 5 },
            { id: 'ds-5-7-bst', title: '二叉排序树', summary: '掌握 BST 的查找、插入、删除与平均查找长度。', importance: 5 },
            { id: 'ds-5-8-avl', title: '平衡二叉树', summary: '掌握 AVL 树的平衡因子、LL/RR/LR/RL 四种调整与查找效率。', importance: 5 },
          ],
        },
      ],
    },
    {
      id: 'ds-chapter-6',
      title: '图',
      layer: 'DS',
      sections: [
        {
          id: 'ds-section-6',
          title: '图的概念',
          points: [
            { id: 'ds-6-1-graph-concept', title: '图的基本概念', summary: '掌握图的定义、有向/无向、度、连通性、简单图等术语。', importance: 4 },
          ],
        },
        {
          id: 'ds-section-6-2',
          title: '图的存储结构',
          points: [
            { id: 'ds-6-2-graph-store', title: '图的存储结构', summary: '掌握邻接矩阵、邻接表、十字链表、邻接多重表及时空开销。', importance: 5 },
            { id: 'ds-6-3-graph-traverse', title: '图的遍历', summary: '掌握深度优先 DFS 与广度优先 BFS，时间复杂度与生成树。', importance: 5 },
          ],
        },
        {
          id: 'ds-section-6-3',
          title: '图的应用',
          points: [
            { id: 'ds-6-4-mst', title: '最小生成树', summary: '掌握 Prim 与 Kruskal 算法、适用场景与代价唯一性。', importance: 5 },
            { id: 'ds-6-5-shortest-path', title: '最短路径', summary: '掌握 Dijkstra 单源最短路径与 Floyd 各顶点间最短路径。', importance: 5 },
            { id: 'ds-6-6-topological', title: '拓扑排序', summary: '掌握 AOV 网、拓扑排序的过程与唯一性判断。', importance: 4 },
            { id: 'ds-6-7-critical-path', title: '关键路径', summary: '掌握 AOE 网、事件最早最迟发生时间、活动时间余量与关键路径。', importance: 4 },
          ],
        },
      ],
    },
    {
      id: 'ds-chapter-7',
      title: '查找',
      layer: 'DS',
      sections: [
        {
          id: 'ds-section-7-1',
          title: '顺序查找法',
          points: [
            { id: 'ds-7-2-sequential-search', title: '顺序查找', summary: '掌握顺序查找的 ASL 计算与哨兵优化。', importance: 4 },
          ],
        },
        {
          id: 'ds-section-7-2',
          title: '折半查找法',
          points: [
            { id: 'ds-7-3-binary-search', title: '折半查找', summary: '掌握折半查找的过程、判定树、ASL 与适用条件。', importance: 5 },
          ],
        },
        {
          id: 'ds-section-7-3',
          title: '分块查找',
          points: [
            { id: 'ds-7-4-block-search', title: '分块查找', summary: '掌握分块查找的索引表、ASL 与块大小选择。', importance: 4 },
          ],
        },
        {
          id: 'ds-section-7-4',
          title: 'B树和B+树',
          points: [
            { id: 'ds-7-5-b-tree', title: 'B 树', summary: '掌握 m 阶 B 树的定义、性质、查找、插入与删除。', importance: 5 },
            { id: 'ds-7-6-b-plus-tree', title: 'B+ 树', summary: '掌握 B+ 树的结构、与 B 树的区别及应用。', importance: 4 },
          ],
        },
        {
          id: 'ds-section-7-5',
          title: '散列表',
          points: [
            { id: 'ds-7-7-hash', title: '散列表', summary: '掌握散列函数、冲突处理（开放定址、链地址）与 ASL、装填因子。', importance: 5 },
          ],
        },
        {
          id: 'ds-section-7-6',
          title: '树形查找',
          points: [
            { id: 'ds-5-7-bst', title: '二叉排序树', summary: '掌握 BST 的查找、插入、删除与平均查找长度。', importance: 5 },
            { id: 'ds-5-8-avl', title: '平衡二叉树', summary: '掌握 AVL 树的平衡因子、LL/RR/LR/RL 四种调整与查找效率。', importance: 5 },
            { id: 'ds-7-8-tree-search', title: '红黑树', summary: '掌握红黑树的引入、五条性质与查找复杂度。', importance: 4 },
          ],
        },
      ],
    },
    {
      id: 'ds-chapter-8',
      title: '排序',
      layer: 'DS',
      sections: [
        {
          id: 'ds-section-8-1',
          title: '排序的基本概念',
          points: [
            { id: 'ds-8-1-sort-concept', title: '排序的基本概念', summary: '掌握排序的稳定性、内部/外部排序、评价指标。', importance: 3 },
          ],
        },
        {
          id: 'ds-section-8-2',
          title: '内部排序',
          points: [
            { id: 'ds-8-2-internal-sort', title: '内部排序', summary: '掌握各类内部排序算法的过程、复杂度与稳定性。', importance: 5 },
            { id: 'ds-8-7-sort-comparison', title: '排序算法的比较', summary: '掌握各排序算法的时间、空间、稳定性对比与选型。', importance: 5 },
          ],
        },
        {
          id: 'ds-section-8-3',
          title: '外部排序',
          points: [
            { id: 'ds-8-8-external-sort', title: '外部排序', summary: '掌握外部排序的多路归并、败者树、置换-选择与最佳归并树。', importance: 4 },
          ],
        },
      ],
    },
  ],
}

export const computerOrganizationBook: Book = {
  id: 'computer-organization',
  title: '计算机组成原理',
  subtitle: '408 计算机组成原理知识体系',
  subject: 'COMPUTER_ORGANIZATION',
  chapters: [
    {
      id: 'co-chapter-system',
      title: '计算机系统',
      layer: 'CO',
      sections: [
        {
          id: 'co-section-organization',
          title: '计算机系统的组成',
          points: [
            { id: 'co-von-neumann', title: '计算机系统的组成', summary: '掌握存储程序思想、五大部件组成与工作过程。', importance: 4 },
          ],
        },
        {
          id: 'co-section-source-to-load',
          title: '从源代码到装入内存',
          points: [
            { id: 'co-source-to-load', title: '从源代码到装入内存', summary: '掌握三个级别语言、预处理/编译/汇编/链接/装入全过程、虚拟地址空间与内存映像。', importance: 4 },
          ],
        },
        {
          id: 'co-section-performance',
          title: '性能指标与字长',
          points: [
            { id: 'co-performance', title: '运算速度', summary: '掌握时钟周期、主频、CPI、MIPS、FLOPS 等指标。', importance: 5 },
            { id: 'co-word-length', title: '字长', summary: '掌握机器字长、存储字长、指令字长、数据总线宽度、MAR/MDR 位数与主存容量。', importance: 4 },
          ],
        },
      ],
    },
    {
      id: 'co-chapter-data',
      title: '数据的表示和运算',
      layer: 'CO',
      sections: [
        {
          id: 'co-section-number',
          title: '数制与整型编码',
          points: [
            { id: 'co-base-conversion', title: '进制转换', summary: '掌握二进制、八进制、十六进制与十进制的相互转换。', importance: 4 },
            { id: 'co-code', title: '原码、反码、补码与移码', summary: '掌握带符号数的表示与补码运算规则。', importance: 5 },
          ],
        },
        {
          id: 'co-section-arithmetic',
          title: '运算方法与运算电路',
          points: [
            { id: 'co-alu', title: '运算电路', summary: '理解 ALU 功能、位运算符号与加法器电路。', importance: 4 },
            { id: 'co-arithmetic-methods', title: '加减乘除运算方法', summary: '掌握加减法共用电路、顺序乘法器与顺序除法器的运算方法。', importance: 5 },
          ],
        },
        {
          id: 'co-section-float',
          title: '浮点数',
          points: [
            { id: 'co-ieee754', title: 'IEEE 754 标准', summary: '掌握 IEEE 754 的单双精度格式、正常值/非正常值与特殊值。', importance: 5 },
            { id: 'co-ieee754-ops', title: 'IEEE 754 的运算', summary: '掌握浮点加减运算五步与就近舍入等舍入模式。', importance: 5 },
          ],
        },
      ],
    },
    {
      id: 'co-chapter-memory',
      title: '存储系统',
      layer: 'CO',
      sections: [
        {
          id: 'co-section-memory-hierarchy',
          title: 'RAM 与 ROM',
          points: [
            { id: 'co-memory-hierarchy', title: '存储器的层次结构', summary: '理解寄存器、Cache、主存、外存的层次，以及 RAM、ROM 与 Flash 的区别。', importance: 5 },
            { id: 'co-sram-dram', title: 'SRAM 与 DRAM', summary: '掌握 SRAM 与 DRAM 的原理区别、DRAM 的刷新方式与地址线复用。', importance: 5 },
          ],
        },
        {
          id: 'co-section-main-memory',
          title: '主存',
          points: [
            { id: 'co-multi-module', title: '多模块存储器', summary: '掌握单体多字与多体交叉存储器，提高主存带宽。', importance: 5 },
            { id: 'co-memory-expand', title: '主存容量的扩展', summary: '掌握位扩展、字扩展、字位扩展的计算。', importance: 5 },
          ],
        },
        {
          id: 'co-section-cache',
          title: 'Cache 高速缓存',
          points: [
            { id: 'co-cache-basics', title: 'Cache 的基本概念', summary: '掌握局部性原理、缓存块/行概念、标记字段、地址结构与映射方式。', importance: 5 },
            { id: 'co-cache-replace-write', title: 'Cache 的替换算法与写策略', summary: '掌握 LRU/FIFO 替换与直写/回写、写分配策略。', importance: 5 },
            { id: 'co-cache-performance', title: 'Cache 的性能与命中率', summary: '掌握命中率与平均访问时间的计算。', importance: 4 },
          ],
        },
        {
          id: 'co-section-virtual-memory',
          title: '虚拟存储器',
          points: [
            { id: 'co-vm-basics', title: '虚拟存储器的基本思想', summary: '理解虚拟存储思想、页式与段式存储。', importance: 4 },
            { id: 'co-vm-impl', title: '虚拟存储器的实现', summary: '掌握 MMU 地址翻译、TLB、页表与缺页置换。', importance: 5 },
          ],
        },
        {
          id: 'co-section-external-storage',
          title: '外存',
          points: [
            { id: 'co-external-hdd', title: '机械硬盘与外存管理', summary: '掌握机械硬盘结构、CHS 地址与磁盘性能指标。', importance: 3 },
            { id: 'co-external-ssd', title: '固态硬盘与 RAID', summary: '理解固态硬盘特点与 RAID 技术。', importance: 3 },
          ],
        },
      ],
    },
    {
      id: 'co-chapter-instruction',
      title: '指令系统',
      layer: 'CO',
      sections: [
        {
          id: 'co-section-isa',
          title: 'ISA',
          points: [
            { id: 'co-isa', title: 'ISA 指令集体系结构', summary: '理解 ISA 是什么，掌握 ISA 规定的内容。', importance: 4 },
          ],
        },
        {
          id: 'co-section-instruction',
          title: '指令的格式',
          points: [
            { id: 'co-instruction-format', title: '指令的格式', summary: '掌握指令的基本格式、操作码与地址码、指令类型、操作码扩展与 CISC/RISC。', importance: 5 },
          ],
        },
        {
          id: 'co-section-addressing',
          title: '寻址',
          points: [
            { id: 'co-addressing', title: '寻址方式', summary: '掌握立即、直接、间接、寄存器、变址、基址、相对、堆栈寻址。', importance: 5 },
          ],
        },
        {
          id: 'co-section-alignment',
          title: '数据对齐与大小端',
          points: [
            { id: 'co-alignment', title: '数据对齐与大小端', summary: '掌握数据对齐因子与大小端的字节序。', importance: 4 },
          ],
        },
      ],
    },
    {
      id: 'co-chapter-cpu',
      title: '中央处理器',
      layer: 'CO',
      sections: [
        {
          id: 'co-section-cpu-core',
          title: 'CPU 的功能',
          points: [
            { id: 'co-datapath', title: '数据通路', summary: '掌握数据通路的组成、组合逻辑与时序逻辑元件、寄存器与访存通路。', importance: 4 },
            { id: 'co-controller', title: '控制器', summary: '掌握控制器组成、RTL、硬布线与微程序控制器。', importance: 4 },
            { id: 'co-cpu-execute', title: 'CPU 执行指令的过程', summary: '掌握单总线数据通路的部件组成与指令执行的节拍过程。', importance: 4 },
          ],
        },
        {
          id: 'co-section-pipeline',
          title: '指令流水线',
          points: [
            { id: 'co-pipeline', title: '指令流水线', summary: '掌握流水线的时空图、性能指标与冒险处理。', importance: 5 },
          ],
        },
        {
          id: 'co-section-multicore',
          title: '多核与多处理机',
          points: [
            { id: 'co-multicore', title: '多核与多处理机', summary: '掌握弗林分类法、物理/逻辑核心与超线程。', importance: 3 },
          ],
        },
      ],
    },
    {
      id: 'co-chapter-bus-io',
      title: '总线与输入输出系统',
      layer: 'CO',
      sections: [
        {
          id: 'co-section-bus',
          title: '总线',
          points: [
            { id: 'co-bus', title: '总线的基本概念', summary: '掌握总线分类、总线仲裁与总线定时。', importance: 4 },
          ],
        },
        {
          id: 'co-section-io',
          title: 'I/O与中断',
          points: [
            { id: 'co-io-method', title: 'I/O', summary: '掌握程序查询、中断、DMA 方式的原理与区别。', importance: 5 },
            { id: 'co-interrupt', title: '中断与异常', summary: '掌握中断分类、响应过程、中断屏蔽，用户态与内核态、系统调用。', importance: 5 },
          ],
        },
      ],
    },
  ],
}

export const operatingSystemsBook: Book = {
  id: 'operating-systems',
  title: '操作系统',
  subtitle: '408 操作系统知识体系',
  subject: 'OPERATING_SYSTEMS',
  chapters: [
    {
      id: 'os-chapter-overview',
      title: '操作系统概述',
      layer: 'OS',
      sections: [
        {
          id: 'os-section-concept',
          title: '操作系统的概念',
          points: [
            { id: 'os-features', title: '操作系统的特征', summary: '掌握并发、共享、虚拟、异步四大特征及相互关系。', importance: 4 },
            { id: 'os-functions', title: '操作系统的功能', summary: '掌握处理机管理、存储器管理、设备管理、文件管理四大功能。', importance: 4 },
          ],
        },
        {
          id: 'os-section-classification',
          title: '操作系统的分类',
          points: [
            { id: 'os-classification', title: '操作系统的分类', summary: '掌握从手工操作到批处理、分时、实时的演进，宏内核与微内核的区别。', importance: 3 },
          ],
        },
        {
          id: 'os-section-link-load',
          title: '从源代码到装入内存',
          points: [
            { id: 'co-source-to-load', title: '从源代码到装入内存', summary: '掌握三个级别语言、链接方式、装入方式、虚拟地址空间与内存映像。', importance: 4 },
          ],
        },
        {
          id: 'os-section-boot',
          title: '操作系统的加载过程',
          points: [
            { id: 'os-boot', title: '操作系统的引导与启动', summary: '掌握 BIOS/UEFI 引导、操作系统内核的加载过程。', importance: 3 },
          ],
        },
        {
          id: 'os-section-virtual-machine',
          title: '虚拟机',
          points: [
            { id: 'os-vm', title: '虚拟机', summary: '理解虚拟机的基本概念、虚拟化类型与实现层次。', importance: 3 },
          ],
        },
      ],
    },
    {
      id: 'os-chapter-process',
      title: '进程管理',
      layer: 'OS',
      sections: [
        {
          id: 'os-section-process-thread',
          title: '进程与线程',
          points: [
            { id: 'os-process', title: '进程的概念与状态', summary: '掌握进程控制块、三态模型、进程控制。', importance: 5 },
            { id: 'os-thread', title: '线程', summary: '掌握线程与进程的区别、用户级与内核级线程。', importance: 4 },
          ],
        },
        {
          id: 'os-section-schedule',
          title: 'CPU 调度算法',
          points: [
            { id: 'os-schedule', title: 'CPU 调度算法', summary: '掌握 FCFS、SJF、优先级、时间片轮转等算法与上下文切换。', importance: 5 },
          ],
        },
        {
          id: 'os-section-sync',
          title: '同步与互斥',
          points: [
            { id: 'os-sync', title: '进程同步与互斥', summary: '掌握临界区、信号量、经典同步问题（生产者消费者等）。', importance: 5 },
          ],
        },
        {
          id: 'os-section-deadlock',
          title: '死锁',
          points: [
            { id: 'os-deadlock', title: '死锁', summary: '掌握死锁产生的条件、预防、避免（银行家算法）、检测与解除。', importance: 5 },
          ],
        },
      ],
    },
    {
      id: 'os-chapter-memory',
      title: '内存管理',
      layer: 'OS',
      sections: [
        {
          id: 'os-section-memory-basic',
          title: '连续分配与非连续分配',
          points: [
            { id: 'os-contiguous-alloc', title: '连续分区分配', summary: '掌握单一连续、固定分区、动态分区分配及四种分区分配算法，区分内部碎片与外部碎片。', importance: 4 },
            { id: 'os-noncontiguous-alloc', title: '非连续分配', summary: '掌握非连续分配的概念与基本方式（分页、分段、段页式）。', importance: 3 },
          ],
        },
        {
          id: 'os-section-virtual-memory',
          title: '虚拟存储器',
          points: [
            { id: 'co-vm-basics', title: '虚拟存储器的基本思想', summary: '理解虚拟存储思想、页式与段式存储。', importance: 4 },
            { id: 'co-vm-impl', title: '虚拟存储器的实现', summary: '掌握页框分配与回收、页面置换算法（OPT/FIFO/LRU/CLOCK）、内存映射文件。', importance: 5 },
          ],
        },
      ],
    },
    {
      id: 'os-chapter-file',
      title: '文件管理',
      layer: 'OS',
      sections: [
        {
          id: 'os-section-file-basic',
          title: '文件与目录',
          points: [
            { id: 'os-file-fcb', title: 'FCB 和索引节点', summary: '掌握文件的定义与属性、FCB 的内容与作用、索引节点（inode）与目录项的分离。', importance: 4 },
            { id: 'os-file-operations', title: '文件的操作', summary: '掌握文件的基本操作与打开流程、进程打开文件表与系统打开文件表的结构。', importance: 4 },
            { id: 'os-file-logical', title: '文件的逻辑结构', summary: '掌握无结构文件、有结构文件（顺序/索引/索引顺序文件）。', importance: 3 },
            { id: 'os-file-physical', title: '文件的物理结构', summary: '掌握连续分配、链接分配、索引分配及混合索引。', importance: 4 },
            { id: 'os-directory-concept', title: '目录的概念', summary: '掌握目录的定义、目录结构（单级/两级/树形）、路径与目录检索，以及文件保护。', importance: 4 },
          ],
        },
        {
          id: 'os-section-filesystem',
          title: '文件系统',
          points: [
            { id: 'os-filesystem-space', title: '外存空间管理', summary: '掌握空闲表、空闲链表、位示图、成组链接法的原理与特点。', importance: 4 },
            { id: 'os-filesystem-vfs', title: '虚拟文件系统', summary: '掌握虚拟文件系统 VFS 的作用、概念与挂载。', importance: 4 },
          ],
        },
      ],
    },
    {
      id: 'os-chapter-io',
      title: '输入输出管理',
      layer: 'OS',
      sections: [
        {
          id: 'os-section-io',
          title: 'I/O与中断',
          points: [
            { id: 'co-io-method', title: 'I/O', summary: '掌握 I/O 层次、设备分类、阻塞/非阻塞 I/O、程序控制/中断/DMA/通道方式。', importance: 5 },
            { id: 'co-interrupt', title: '中断与异常', summary: '掌握中断分类、响应过程、中断屏蔽，用户态与内核态、系统调用。', importance: 5 },
          ],
        },
        {
          id: 'os-section-buffer',
          title: '缓冲与设备分配',
          points: [
            { id: 'os-buffer', title: '缓冲与设备分配', summary: '掌握单/双缓冲、循环缓冲、缓冲池、设备分配与回收、逻辑/物理设备名、SPOOLing 技术。', importance: 4 },
          ],
        },
        {
          id: 'os-section-external-storage',
          title: '外存',
          points: [
            { id: 'co-external-hdd', title: '机械硬盘与外存管理', summary: '掌握磁盘结构、格式化、分区、磁盘调度算法。', importance: 4 },
            { id: 'co-external-ssd', title: '固态硬盘与 RAID', summary: '理解 SSD 结构与磨损均衡、RAID 技术。', importance: 3 },
          ],
        },
      ],
    },
  ],
}

const originalKnowledgeBooks: Book[] = [
  dataStructuresBook,
  computerOrganizationBook,
  operatingSystemsBook,
  computerNetworkBook,
]

export const knowledgeBooks: Book[] = reactive(structuredClone(originalKnowledgeBooks))
export const allKnowledgePoints = reactive<import('@/types').KnowledgePoint[]>([])
watch(() => workspace.books, books => {
  knowledgeBooks.splice(0, knowledgeBooks.length, ...structuredClone(books ? JSON.parse(JSON.stringify(books)) : originalKnowledgeBooks))
}, { immediate: true, flush: 'sync' })
watch(knowledgeBooks, () => {
  allKnowledgePoints.splice(0, allKnowledgePoints.length, ...knowledgeBooks.flatMap(book => book.chapters.flatMap(chapter => chapter.sections.flatMap(section => section.points))))
}, { immediate: true, deep: true, flush: 'sync' })
