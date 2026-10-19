import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'


export default defineConfig({
  plugins: [vue()],
  test: {
    include: ['test/**/*.test.ts'],
    // vitest 2.x 运行时按数组解析：每个元组为 [glob, environment]
    environmentMatchGlobs: [
      ['test/unit/**', 'node'],
      ['test/components/**', 'happy-dom'],
    ],
  },
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
})