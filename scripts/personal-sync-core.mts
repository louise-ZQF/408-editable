import { readFile, writeFile, rename, mkdir, copyFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { resolve, join } from 'node:path'
import { createHash } from 'node:crypto'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { contentSignature, mergeWorkspaces } from '../client/src/editor/workspaceMerge.ts'

export const root = fileURLToPath(new URL('../', import.meta.url))
export const dataDir = resolve(root, '.personal-data')
export const workspacePath = join(dataDir, 'workspace.json')
export async function readJSON(path: string, fallback: any = undefined) { try { return JSON.parse(await readFile(path, 'utf8')) } catch (error: any) { if (error.code === 'ENOENT') return fallback; throw error } }
export async function atomicJSON(path: string, data: any) { await mkdir(resolve(path, '..'), { recursive: true }); const temp = path + '.' + process.pid + '.tmp'; await writeFile(temp, JSON.stringify(data, null, 2)); await rename(temp, path) }
export function validateSnapshot(data: any) {
  if (data?.format !== '408-editable-v1' || !Number.isFinite(data.updatedAt) || !data.articles || Array.isArray(data.articles) || !data.settings || !Array.isArray(data.trash) || !data.exams || !Array.isArray(data.deletedExams) || (data.books !== null && !Array.isArray(data.books))) throw new Error('个人内容格式错误，未写入')
  function scan(value: any, depth = 0) {
    if (depth > 50) throw new Error('内容层级过深')
    if (!value || typeof value !== 'object') return
    for (const [key, child] of Object.entries(value)) { if (['__proto__', 'constructor', 'prototype'].includes(key)) throw new Error('不支持的内容字段'); scan(child, depth + 1) }
  }
  scan(data)
  for (const [id, article] of Object.entries<any>(data.articles)) {
    if (article.pointId !== id || !Array.isArray(article.subpoints)) throw new Error('文章结构错误：' + id)
    const ids = new Set<string>(), subIds = new Set<string>()
    for (const sub of article.subpoints) {
      if (typeof sub.id !== 'string' || typeof sub.title !== 'string' || subIds.has(sub.id) || !Array.isArray(sub.blocks)) throw new Error('小节结构错误')
      subIds.add(sub.id)
      for (const block of sub.blocks) {
        if (typeof block.id !== 'string' || ids.has(block.id) || !['paragraph', 'html', 'formula', 'callout', 'image', 'animation', 'embed'].includes(block.type)) throw new Error('内容编号重复或类型不支持')
        ids.add(block.id)
      }
    }
  }
  return data
}
export function fingerprint(data: any) { return createHash('sha256').update(contentSignature(data)).digest('hex') }
export async function saveCanonical(data: any) {
  validateSnapshot(data)
  const current = await readJSON(workspacePath)
  if (current && fingerprint(current) === fingerprint(data)) return current
  if (current) {
    await mkdir(join(dataDir, 'backups'), { recursive: true })
    const name = new Date().toISOString().replace(/[:.]/g, '-') + '-' + fingerprint(current).slice(0, 10) + '.json'
    await atomicJSON(join(dataDir, 'backups', name), current)
    await copyFile(workspacePath, workspacePath + '.previous')
  }
  await atomicJSON(workspacePath, data)
  return data
}
async function initialBase(incoming: any, current: any) {
  if (fingerprint(incoming) === fingerprint(current) || incoming.updatedAt === 0) return incoming
  const seeds = await readJSON(join(dataDir, 'sync-seeds.json'), [])
  const exact = seeds.find((seed: any) => fingerprint(seed) === fingerprint(incoming))
  if (exact) return exact
  const ranked = seeds.map((seed: any) => ({ seed, count: Object.keys(incoming.articles).filter(id => seed.articles[id] && JSON.stringify(seed.articles[id]) === JSON.stringify(incoming.articles[id])).length })).sort((a: any, b: any) => b.count - a.count)
  if (ranked[0]?.count >= Math.max(1, Math.floor(Object.keys(incoming.articles).length / 2))) return ranked[0].seed
  throw new Error('首次连接发现不同版本，已保留本机和浏览器内容，请先合并备份')
}
let writing: Promise<unknown> = Promise.resolve()
export function mergeIncoming(incoming: any, base?: any, legacy = false) {
  const task = writing.catch(() => {}).then(async () => {
    validateSnapshot(incoming)
    const current = await readJSON(workspacePath, incoming)
    if (base) validateSnapshot(base)
    const legacyBase = legacy ? await readJSON(join(dataDir, 'sync-legacy-base.json')) : undefined
    if (legacyBase && incoming.updatedAt < legacyBase.updatedAt) throw new Error('检测到旧页面的保存请求，已保留较新的本机内容，请刷新页面')
    const ancestor = base || legacyBase || await initialBase(incoming, current)
    let merged
    try { merged = mergeWorkspaces(ancestor, incoming, current) } catch (error) {
      await atomicJSON(join(dataDir, 'backups', 'conflict-' + [ancestor, incoming, current].map(value => fingerprint(value).slice(0, 10)).join('-') + '.json'), { base: ancestor, browser: incoming, local: current })
      throw error
    }
    const saved = await saveCanonical(merged)
    if (legacy) await atomicJSON(join(dataDir, 'sync-legacy-base.json'), incoming)
    return saved
  })
  writing = task
  return task
}
export function personalBridge() {
  return async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
    const path = req.url?.split('?')[0]
    if (!['/__editor/data', '/__editor/sync'].includes(path || '')) { next(); return }
    const host = req.headers.host || '', origin = req.headers.origin
    const localOrigin = origin === `http://${host}`
    const trustedOrigin = origin === 'https://louise-zqf.github.io'
    if (!/^(localhost|127\.0\.0\.1)(:\d+)?$/.test(host) || (origin && !localOrigin && !(trustedOrigin && path === '/__editor/sync'))) { res.statusCode = 403; res.end('Forbidden'); return }
    if (origin) { res.setHeader('Access-Control-Allow-Origin', origin); res.setHeader('Vary', 'Origin') }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    res.setHeader('Access-Control-Allow-Private-Network', 'true')
    res.setHeader('Content-Type', 'application/json; charset=utf-8'); res.setHeader('Cache-Control', 'no-store')
    if (req.method === 'OPTIONS') { res.statusCode = 204; res.end(); return }
    try {
      const config = await readJSON(join(dataDir, 'auto-sync-config.json'), { enabled: false })
      const status = await readJSON(join(dataDir, 'auto-sync-status.json'), { stage: 'waiting', message: '本机已保存，等待自动同步' })
      if (req.method === 'GET') { res.end(JSON.stringify(path === '/__editor/data' ? await readJSON(workspacePath, null) : { enabled: config.enabled, status })); return }
      if ((path === '/__editor/sync' && req.method !== 'POST') || (path === '/__editor/data' && req.method !== 'PUT')) { res.statusCode = 405; res.end('{}'); return }
      if (!req.headers['content-type']?.startsWith('application/json')) throw new Error('保存请求必须为 JSON')
      if (path === '/__editor/sync' && !config.enabled) throw new Error('这台 Mac 尚未启用自动同步服务')
      let body = ''
      for await (const chunk of req) { body += chunk; if (Buffer.byteLength(body) > 80 * 1024 * 1024) throw new Error('内容超过本机保存上限') }
      const payload = JSON.parse(body)
      const saved = await mergeIncoming(path === '/__editor/data' ? payload : payload.workspace, path === '/__editor/sync' ? payload.base : undefined, path === '/__editor/data')
      res.end(JSON.stringify({ saved: true, enabled: config.enabled, workspace: saved, status }))
    } catch (error) { res.statusCode = 409; res.end(JSON.stringify({ error: error instanceof Error ? error.message : String(error) })) }
  }
}
