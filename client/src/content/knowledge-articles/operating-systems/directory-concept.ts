import type { KnowledgeArticleData } from '@/content/knowledge-articles/types'

export const directoryConceptArticle: KnowledgeArticleData = {
  pointId: 'os-directory-concept',
  subpoints: [
    {
      id: 'os-directory-concept-basic',
      title: '目录的基本概念与结构',
      blocks: [
        {
          id: 'kb-os-directory-1-1',
          type: 'paragraph',
          text: '**目录**（文件目录）用于文件检索和管理，每个目录项记录一个文件的文件名、物理地址、属性、权限等信息。目录本身就是一种文件，系统通过目录找到文件在外存的物理位置。',
        },
        {
          id: 'kb-os-directory-1-2',
          type: 'paragraph',
          text: '**目录结构**分三级：\n\n- **单级目录**：所有文件平铺，检索简单但重名冲突、不能分组。\n- **两级目录**：主目录 + 各用户的文件目录，解决重名、用户隔离。\n- **树形目录**：多级层次，路径名定位，支持分组和共享，是现代系统主流。',
        },
        {
          id: 'kb-os-directory-1-3',
          type: 'paragraph',
          text: '**路径**分**绝对路径**和**相对路径**：\n\n- **绝对路径**：从根目录开始的完整路径，如 /usr/bin/ls。\n- **相对路径**：从当前目录开始的路径。\n\n**当前目录**（工作目录）由每个进程维护。树形目录下文件的唯一标识是绝对路径。',
        },
        {
          id: 'kb-os-directory-1-4',
          type: 'callout',
          title: '目录检索',
          text: '打开文件时按路径逐级检索目录：先查根目录找到一级子目录，再在其目录项中找下一级，直到找到目标文件，读出其物理地址。',
          tone: 'blue',
        },
      ],
    },
    {
      id: 'os-directory-concept-protect',
      title: '文件保护',
      blocks: [
        {
          id: 'kb-os-directory-2-1',
          type: 'paragraph',
          text: '**文件保护**：\n\n- **口令保护**：访问文件需口令，简单但口令易泄露。\n- **加密保护**：文件加密存储，需密钥，安全性高。\n- **访问控制**：访问控制表 ACL 记录每个用户/组的读、写、执行权限。',
        },
        {
          id: 'kb-os-directory-protect-1',
          type: 'paragraph',
          text: '**文件权限位数**：Unix/Linux 中文件权限用若干位表示，常见的是 9 位：按属主、属组、其他用户三类用户，每类各 3 位（r 读、w 写、x 执行）。权限还有 3 个特殊位：\n\n- **setuid**：执行时以属主身份运行。\n- **setgid**：执行时以属组身份运行。\n- **sticky 粘滞位**：如 /tmp，只允许文件属主删除自己的文件。\n\n9 位权限常用**八进制**表示，如 0755 对应 rwxr-xr-x。',
        },
        {
          id: 'kb-os-directory-protect-2',
          type: 'paragraph',
          text: String.raw`**例题**：某文件系统中，针对每个文件，用户类别分为 4 类：安全管理员、文件主、文件主的伙伴、其他用户；访问权限分为 5 种：完全控制、执行、修改、读取、写入。若文件控制块中用二进制位串表示文件权限，为表示不同类别用户对一个文件的访问权限，则描述文件权限的位数至少应为（ ）。

**分析**：每位表示"某用户类别是否拥有某项权限"。每类用户需要 5 位记录 5 种权限的有无，共 4 类用户。

$$位数 = 用户类别数 \times 权限种类数 = 4 \times 5 = 20$$

答案为 20 位。思路与 Unix 的 rwxrwxrwx 相同，只是扩展到 4 类用户 × 5 种权限。`,
        }
      ],
    },
  ],
}
