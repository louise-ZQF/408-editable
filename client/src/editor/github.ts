import { markPublished, snapshot, unpublished, workspace } from './store'

export async function publishToGitHub(token: string) {
  if (!token.trim()) throw new Error('请填写仅授权本仓库的 GitHub 令牌；令牌只在当前页面内存中使用')
  const { repository, branch } = workspace.settings
  if (!/^[\w.-]+\/[\w.-]+$/.test(repository) || !/^[\w./-]+$/.test(branch)) throw new Error('仓库或分支格式错误')
  const base = `https://api.github.com/repos/${repository}`
  const headers = { Authorization: `Bearer ${token.trim()}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' }
  const data = snapshot()
  const publishedTime = data.updatedAt
  const path = '/contents/client/public/editor/content.json'
  const existing = await fetch(`${base}${path}?ref=${encodeURIComponent(branch)}`, { headers, cache: 'no-store' })
  let sha: string | undefined
  if (existing.ok) {
    const remote = await existing.json(); sha = remote.sha
    {
      const published = remote.content ? JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(remote.content.replace(/\s/g, '')), c => c.charCodeAt(0)))) : await fetch(`${base}${path}?ref=${encodeURIComponent(branch)}`, { headers: { ...headers, Accept: 'application/vnd.github.raw+json' }, cache: 'no-store' }).then(async r => { if (!r.ok) throw new Error('无法验证 GitHub 上的当前版本'); return r.json() })
      if (published.updatedAt > data.updatedAt) throw new Error('GitHub 上有更新的版本。请先导出当前备份并重新载入网站，避免覆盖其他设备的修改。')
    }
  } else if (existing.status !== 404) throw new Error('无法读取仓库，请检查令牌、仓库名称与网络')
  const bytes = new TextEncoder().encode(JSON.stringify(data))
  let binary = ''; for (const b of bytes) binary += String.fromCharCode(b)
  const result = await fetch(`${base}${path}`, {
    method: 'PUT', headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'content: publish personal 408 textbook edits', branch, sha, content: btoa(binary) }),
  })
  if (!result.ok) {
    if (result.status === 409 || result.status === 422) throw new Error('仓库出现并发修改，请刷新 GitHub 同步状态后重试，当前内容仍保存在本机')
    throw new Error('发布失败，请确认令牌对本仓库拥有 Contents: Read and write 权限')
  }
  const saved = await result.json()
  await markPublished(publishedTime)
  if (workspace.updatedAt === data.updatedAt) unpublished.value = false
  return saved.commit.html_url as string
}
