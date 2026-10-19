/**
 * 调试启动器：用 jiti 显式配 @/ alias 后加载 debug-search.ts。
 * 用法：npm run debug:search -- "查询词" [topK]
 */
import { createJiti } from 'jiti'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const jiti = createJiti(import.meta.url, {
  alias: {
    '@': join(__dirname, '..', 'src'),
  },
})

await jiti.import('./debug-search.ts')
