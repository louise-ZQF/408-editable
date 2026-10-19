import type { Plugin } from 'vite'
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync, copyFileSync } from 'node:fs'
import { resolve } from 'node:path'

export function personalFiles(): Plugin {
  return {
    name: 'personal-editor-files',
    configureServer(server) {
      server.middlewares.use('/__editor/data', async (req, res) => {
        const host = req.headers.host || ''
        const origin = req.headers.origin
        if (!/^(localhost|127\.0\.0\.1)(:\d+)?$/.test(host) || (origin && new URL(origin).host !== host)) { res.statusCode = 403; res.end('Forbidden'); return }
        const path = resolve(import.meta.dirname, '../.personal-data/workspace.json')
        res.setHeader('Content-Type', 'application/json; charset=utf-8')
        res.setHeader('Cache-Control', 'no-store')
        if (req.method === 'GET') { res.end(existsSync(path) ? readFileSync(path, 'utf8') : 'null'); return }
        if (req.method !== 'PUT') { res.statusCode = 405; res.end('{}'); return }
        try {
          let body = ''; for await (const chunk of req) { body += chunk; if (Buffer.byteLength(body) > 80 * 1024 * 1024) throw new Error('文件太大') }
          const data = JSON.parse(body)
          if (data.format !== '408-editable-v1' || !Number.isFinite(data.updatedAt)) throw new Error('数据格式错误')
          mkdirSync(resolve(path, '..'), { recursive: true })
          if (existsSync(path)) copyFileSync(path, path + '.previous')
          writeFileSync(path + '.tmp', JSON.stringify(data, null, 2)); renameSync(path + '.tmp', path)
          res.end('{"saved":true}')
        } catch { res.statusCode = 400; res.end('{"error":"保存失败"}') }
      })
    },
  }
}
