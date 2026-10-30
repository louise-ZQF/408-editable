import { ref } from 'vue'
import type { WorkspaceData } from './store'
import { contentSignature, mergeWorkspaces } from './workspaceMerge'

export const automaticSyncEnabled = ref(false)
export const automaticSyncConnected = ref(false)
export const automaticSyncStatus = ref('尚未连接本机自动同步')
const enabledKey = '408-editable:automatic-sync'
type Adapter = { get: () => WorkspaceData; apply: (data: WorkspaceData) => Promise<void>; saveBase: (data: WorkspaceData) => Promise<void>; published: (time: number) => Promise<void>; canApply: () => boolean }
let adapter: Adapter | undefined, base: WorkspaceData | undefined, queued: WorkspaceData | undefined
let pending: { sent: WorkspaceData; canonical: WorkspaceData } | undefined
let running: Promise<void> | undefined, retryTimer: ReturnType<typeof setInterval> | undefined
function address() { return ['127.0.0.1', 'localhost'].includes(location.hostname) ? location.origin + '/__editor/sync' : 'http://127.0.0.1:5188/__editor/sync' }
function availableSite() { return ['127.0.0.1', 'localhost'].includes(location.hostname) || (location.hostname === 'louise-zqf.github.io' && location.pathname.startsWith('/408-editable/')) }
async function request(method: 'GET' | 'POST', value?: unknown) {
  const response = await fetch(address(), { method, mode: 'cors', cache: 'no-store', signal: AbortSignal.timeout(12_000), ...(value ? { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(value) } : {}) })
  const data = await response.json()
  if (!response.ok || !data.enabled) throw new Error(data.error || '本机自动同步服务未开启')
  automaticSyncConnected.value = true
  return data
}
function connectionError(error: unknown) {
  automaticSyncConnected.value = false
  automaticSyncStatus.value = error instanceof Error && /同一处|首次连接|格式|旧页面/.test(error.message) ? error.message : '已保存到浏览器，本机暂未连接；恢复后自动重试'
}
async function applyPending() {
  if (!adapter || !pending || !adapter.canApply()) return
  const item = pending
  const merged = mergeWorkspaces(item.sent, adapter.get(), item.canonical)
  pending = undefined
  base = item.canonical
  await adapter.saveBase(base)
  if (contentSignature(adapter.get()) !== contentSignature(merged)) await adapter.apply(merged)
  if (contentSignature(merged) !== contentSignature(item.canonical)) queued = merged
}
function send() {
  if (running) return running
  running = (async () => {
    while (queued && adapter && automaticSyncEnabled.value) {
      const data = JSON.parse(JSON.stringify(queued)) as WorkspaceData; queued = undefined
      try {
        const result = await request('POST', { workspace: data, base })
        base = data
        await adapter.saveBase(data)
        pending = { sent: data, canonical: result.workspace }
        automaticSyncStatus.value = result.status?.message || '已备份到本机，约 1 分钟后自动同步 GitHub'
        await applyPending()
      } catch (error) { queued = adapter.get(); connectionError(error); break }
    }
  })().finally(() => { running = undefined })
  return running
}
export async function enableAutomaticSync() {
  if (!adapter || !availableSite()) return
  automaticSyncEnabled.value = true
  try { localStorage.setItem(enabledKey, 'true') } catch { /* 当前会话仍可同步。 */ }
  automaticSyncStatus.value = '正在连接这台 Mac 的自动同步服务…'
  queued = adapter.get()
  await send()
  startPolling()
}
export function queueAutomaticSync(data: WorkspaceData) {
  if (!automaticSyncEnabled.value || !adapter) return false
  queued = data
  void send()
  return true
}
export async function initializeAutomaticSync(value: Adapter, storedBase: WorkspaceData | undefined, localAvailable: boolean) {
  adapter = value; base = storedBase
  let enabled = localAvailable
  try { enabled ||= localStorage.getItem(enabledKey) === 'true' } catch { /* 使用本机默认值。 */ }
  if (!enabled || !availableSite()) return
  await enableAutomaticSync()
}
function startPolling() {
  if (retryTimer) return
  retryTimer = setInterval(async () => {
    if (!automaticSyncEnabled.value || !adapter) return
    try {
      await applyPending()
      if (queued) await send()
      if (!automaticSyncConnected.value && !queued) { queued = adapter.get(); await send() }
      const result = await request('GET')
      automaticSyncStatus.value = result.status.message
      if (result.status.publishedAt && result.status.publishedAt >= adapter.get().updatedAt) await adapter.published(result.status.publishedAt)
    } catch (error) { connectionError(error) }
  }, 15_000)
}
