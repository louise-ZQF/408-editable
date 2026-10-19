import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const filesystemVfsArticle: KnowledgeArticleData = {
  pointId: 'os-filesystem-vfs',
  subpoints: [
    {
      id: 'os-fs-vfs-layer',
      title: '文件系统的层次结构',
      blocks: [
        {
          id: 'kb-os-filesystem-1-1',
          type: 'paragraph',
          text: '**文件系统**是操作系统中负责管理和存取文件信息的软件。它的层次结构从上到下：\n\n1. **用户接口**：open/read/write 系统调用。\n2. **文件目录系统**：目录管理、文件命名。\n3. **存取控制模块**：权限校验。\n4. **逻辑文件系统**：逻辑结构与文件组织。\n5. **物理文件系统**：物理块与设备驱动交互。\n\n**虚拟文件系统**就位于用户接口与具体文件系统之间。',
        },
        
      ],
    },
    {
      id: 'os-fs-vfs-basic',
      title: '虚拟文件系统 VFS',
      blocks: [
        {
          id: 'kb-os-filesystem-vfs-1',
          type: 'paragraph',
          text: '**虚拟文件系统**（VFS，Virtual File System）是操作系统在具体文件系统之上抽象出来的一层**统一接口**。它定义了一组通用的文件操作规范（open、read、write、close 等），把不同文件系统（ext4、NTFS、FAT、exFAT 等）的差异屏蔽掉。用户程序和上层文件系统只需面向 VFS 提供的统一接口编程，不必关心底层是哪种文件系统。',
        },
        {
          id: 'kb-os-filesystem-vfs-2',
          type: 'paragraph',
          text: '**VFS 的作用**：\n\n- 向上提供**统一的系统调用接口**，应用透明访问不同文件系统。\n- 向下支持**多种文件系统并存**，每种具体文件系统通过各自的**文件系统驱动**接入 VFS。\n- 支持**挂载**与卸载，把不同设备上的文件系统组织进同一棵目录树。\n- 统一**文件对象模型**（超级块、inode、目录项、文件对象），便于上层统一管理。',
        },
        {
          id: 'kb-os-filesystem-vfs-3',
          type: 'paragraph',
          text: '**挂载**（mount）：把某个设备上的文件系统接入当前目录树的某个目录（称为**挂载点**）的过程。挂载后，访问挂载点目录就是在访问该文件系统的根目录。挂载点中原有的内容会被新挂载的文件系统遮盖。卸载（umount）则把文件系统从目录树中摘下。挂载时系统读取文件系统的**超级块**，识别文件系统类型并建立相应的数据结构。',
        },
        {
          id: 'kb-os-filesystem-vfs-4',
          type: 'callout',
          title: 'VFS 与具体文件系统',
          text: 'VFS 是抽象层，不实际存取数据；真正读写磁盘的是挂在 VFS 下的具体文件系统驱动。应用看到的"同一个目录树"可能由多个文件系统拼成。',
          tone: 'blue',
        },
      ],
    },
  ],
}
