# manim-web 动画目录

这里采用“一段动画一个文件”的组织方式：

```text
animations/
├── data-structures/                 # 数据结构
├── computer-organization/           # 计算机组成原理
├── operating-systems/               # 操作系统
├── computer-networks/                # 计算机网络
│   └── data-link-layer/
│       └── go-back-n/
│           ├── send-window.ts
│           └── retransmission.ts
├── types.ts
└── README.md
```

每个动画文件直接引入 `manim-web`，并导出一个 `ManimWebAnimation`：

```ts
export const exampleAnimation: ManimWebAnimation = {
  id: 'example',
  ariaLabel: '动画的无障碍说明',
  scene: {
    width: 900,
    height: 430,
    frameWidth: 12,
    frameHeight: 6,
    backgroundColor: '#ffffff',
  },
  steps: [
    {
      id: 'step-1',
      async render(scene, animate) {
        // 在这里直接写当前步骤的 manim-web 绘制与播放代码。
      },
    },
  ],
}
```

文章数据只负责引用动画：

```ts
import { exampleAnimation } from '@/animations/computer-networks/data-link-layer/example'

{
  type: 'animation',
  animation: exampleAnimation,
}
```

通用播放器 `ManimCodePlayer.vue` 只处理场景初始化、前进、后退、重置和进度条。步骤标题、公式和解释文字应使用 `Text` 等 manim-web 对象直接画进动画场景，不在播放器下方重复渲染。
