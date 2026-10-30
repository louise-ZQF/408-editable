import { spawn } from 'node:child_process'
import { join } from 'node:path'
import { atomicJSON, dataDir, fingerprint, readJSON, saveCanonical, validateSnapshot, workspacePath } from './personal-sync-core.mts'
import { mergeWorkspaces } from '../client/src/editor/workspaceMerge.ts'

const repository = 'louise-ZQF/408-editable'
const endpoint = `repos/${repository}/contents/client/public/editor/content.json`
const statusPath = join(dataDir, 'auto-sync-status.json')
const basePath = join(dataDir, 'sync-base.json')
const gh = process.env.PERSONAL_SYNC_GH || 'gh'
function command(args, input) {
  return new Promise((resolve, reject) => {
    const child = spawn(gh, args, { stdio: ['pipe', 'pipe', 'pipe'], env: { ...process.env, GH_PROMPT_DISABLED: '1' } })
    child.stdout.setEncoding('utf8'); child.stderr.setEncoding('utf8')
    let output = '', error = ''
    const timer = setTimeout(() => { child.kill(); reject(new Error('GitHub 请求超时，本机内容已保留')) }, 45_000)
    child.stdout.on('data', chunk => { output += chunk })
    child.stderr.on('data', chunk => { error += chunk })
    child.on('error', value => { clearTimeout(timer); reject(value) })
    child.on('close', code => { clearTimeout(timer); if (code === 0) resolve(output); else reject(new Error(error.includes('409') ? 'GitHub 同时发生了更新，将重新合并后重试' : 'GitHub 暂时无法同步，本机内容已保留；稍后自动重试')) })
    child.stdin.end(input)
  })
}
async function remoteContent() {
  const meta = JSON.parse(await command(['api', endpoint + '?ref=main']))
  const text = meta.content && meta.encoding === 'base64' ? Buffer.from(meta.content, 'base64').toString('utf8') : await command(['api', '-H', 'Accept: application/vnd.github.raw+json', endpoint + '?ref=main'])
  return { sha: meta.sha, data: validateSnapshot(JSON.parse(text)) }
}
let observed = '', quietSince = Date.now(), retryAt = 0, nextRemoteRead = 0, nextDeploymentRead = 0, busy = false
async function status(value) {
  const old = await readJSON(statusPath, {})
  const next = { ...old, ...value }
  if (JSON.stringify(old) !== JSON.stringify(next)) await atomicJSON(statusPath, next)
}
async function deploymentStatus() {
  const current = await readJSON(statusPath, {})
  if (current.stage !== 'deploying' || Date.now() < nextDeploymentRead) return
  nextDeploymentRead = Date.now() + 30_000
  const runs = JSON.parse(await command(['run', 'list', '--repo', repository, '--workflow', 'deploy.yml', '--limit', '1', '--json', 'status,conclusion,headSha,url,createdAt']))
  const run = runs[0]
  if (!run || Date.parse(run.createdAt) < (current.publishedAt || 0) - 10_000) return
  if (run.status === 'completed' && run.conclusion === 'success') await status({ stage: 'deployed', message: '已自动更新到 GitHub 网站', deploymentUrl: run.url })
  else if (run.status === 'completed' && run.conclusion === 'failure') await status({ stage: 'deploying', message: '内容已同步 GitHub，网站部署失败；本机备份仍保留', deploymentUrl: run.url })
}
async function tick(force = false) {
  if (busy) return
  busy = true
  try {
    const config = await readJSON(join(dataDir, 'auto-sync-config.json'), {})
    if (!config.enabled) return
    const local = validateSnapshot(await readJSON(workspacePath))
    const hash = fingerprint(local)
    const base = validateSnapshot(await readJSON(basePath, await readJSON(join(dataDir, '..', 'client/public/editor/content.json'))))
    const changed = hash !== fingerprint(base)
    if (hash !== observed) { observed = hash; quietSince = Date.now() }
    if (!force && Date.now() < retryAt) return
    if (changed && !force && Date.now() - quietSince < (config.debounceMs || 60_000)) {
      await status({ stage: 'waiting', message: '已备份到本机，停止编辑约 1 分钟后自动同步', nextSyncAt: quietSince + (config.debounceMs || 60_000) })
      return
    }
    if (!changed && !force && Date.now() < nextRemoteRead) { await deploymentStatus(); return }
    nextRemoteRead = Date.now() + 300_000
    const remote = await remoteContent()
    let merged
    try { merged = mergeWorkspaces(base, local, remote.data) } catch (error) {
      await atomicJSON(join(dataDir, 'backups', 'github-conflict-' + [base, local, remote.data].map(value => fingerprint(value).slice(0, 10)).join('-') + '.json'), { base, local, remote: remote.data })
      throw error
    }
    if (fingerprint(merged) === fingerprint(remote.data)) {
      await atomicJSON(basePath, remote.data)
      if (fingerprint(await readJSON(workspacePath)) === hash) await saveCanonical(remote.data)
      const current = await readJSON(statusPath, {})
      if (!current.publishedAt || current.publishedAt < remote.data.updatedAt || ['error', 'conflict', 'waiting', 'publishing'].includes(current.stage)) await status({ stage: 'deploying', publishedAt: remote.data.updatedAt, lastSuccess: Date.now(), message: '内容已同步 GitHub，网站正在自动更新' })
      await deploymentStatus()
      return
    }
    const data = { ...merged, updatedAt: Math.max(Date.now(), local.updatedAt, remote.data.updatedAt) }
    await status({ stage: 'publishing', message: '本机备份已保存，正在自动提交 GitHub' })
    const result = JSON.parse(await command(['api', '--method', 'PUT', endpoint, '--input', '-'], JSON.stringify({ message: 'content: automatically sync personal textbook edits', branch: 'main', sha: remote.sha, content: Buffer.from(JSON.stringify(data)).toString('base64') })))
    await atomicJSON(basePath, data)
    if (fingerprint(await readJSON(workspacePath)) === hash) await saveCanonical(data)
    await status({ stage: 'deploying', publishedAt: data.updatedAt, lastSuccess: Date.now(), commit: result.commit.sha, commitUrl: result.commit.html_url, message: '内容已自动同步 GitHub，网站正在自动更新' })
    console.log(new Date().toISOString(), '已同步', Object.keys(data.articles).length, '篇个人修改', result.commit.sha)
    retryAt = 0
  } catch (error) {
    retryAt = Date.now() + 120_000
    await status({ stage: error?.name === 'WorkspaceConflict' || error?.path ? 'conflict' : 'error', message: error instanceof Error ? error.message : '同步失败，本机内容已保留', nextRetryAt: retryAt })
    console.error(new Date().toISOString(), error instanceof Error ? error.message : '同步失败')
  } finally { busy = false }
}

if (process.argv.includes('--once')) await tick(true)
else { await tick(); setInterval(() => { void tick() }, 10_000) }
