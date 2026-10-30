const missing = Symbol('missing')

function stable(value: any): string {
  if (value === missing) return 'missing'
  if (Array.isArray(value)) return '[' + value.map(stable).join(',') + ']'
  if (value && typeof value === 'object') return '{' + Object.keys(value).sort().map(key => JSON.stringify(key) + ':' + stable(value[key])).join(',') + '}'
  return JSON.stringify(value) ?? 'undefined'
}
function same(a: any, b: any) { return stable(a) === stable(b) }
export function contentSignature(value: any) {
  const { updatedAt: _time, ...content } = value
  return stable(content)
}
export class WorkspaceConflict extends Error {
  path: string
  constructor(path: string) { super('同一处内容有不同修改，已保留两份：' + path); this.path = path }
}
function keyed(array: any[]) { return array.every(item => item && typeof item === 'object' && typeof item.id === 'string') && new Set(array.map(item => item.id)).size === array.length }
function merge(base: any, local: any, remote: any, path: string): any {
  if (same(local, remote)) return local
  if (same(local, base)) return remote
  if (same(remote, base)) return local
  if (Array.isArray(base) && Array.isArray(local) && Array.isArray(remote) && /\/(deletedExams|contentAdditions)$/.test(path)) {
    return [...new Set([...local, ...remote])].filter(value => base.includes(value) ? local.includes(value) && remote.includes(value) : true)
  }
  if (Array.isArray(base) && Array.isArray(local) && Array.isArray(remote) && keyed(base) && keyed(local) && keyed(remote)) {
    const maps = [base, local, remote].map(items => new Map(items.map(item => [item.id, item])))
    const ids = [...new Set([...local, ...remote, ...base].map(item => item.id))]
    const values = new Map(ids.map(id => [id, merge(...maps.map(map => map.has(id) ? map.get(id) : missing) as [any, any, any], path + '/' + id)]).filter(([, item]) => item !== missing) as [string, any][])
    const order = (items: any[]) => items.map(item => item.id).filter(id => values.has(id))
    const b = order(base), l = order(local), r = order(remote)
    const reordered = (items: string[]) => !same(items.filter(id => b.includes(id)), b.filter(id => items.includes(id)))
    if (reordered(l) && reordered(r) && !same(l.filter(id => r.includes(id)), r.filter(id => l.includes(id)))) throw new WorkspaceConflict(path + '/顺序')
    const result = [...(reordered(r) && !reordered(l) ? r : l)]
    for (const list of [l, r]) for (let i = 0; i < list.length; i++) {
      const id = list[i]
      if (result.includes(id)) continue
      const next = list.slice(i + 1).find(key => result.includes(key))
      result.splice(next ? result.indexOf(next) : result.length, 0, id)
    }
    return result.map(id => values.get(id))
  }
  const object = (value: any) => value !== missing && value && typeof value === 'object' && !Array.isArray(value)
  if (object(local) && object(remote) && (object(base) || base === missing)) {
    const result: Record<string, any> = {}
    for (const key of new Set([...Object.keys(base === missing ? {} : base), ...Object.keys(local), ...Object.keys(remote)])) {
      const get = (value: any) => value !== missing && Object.hasOwn(value, key) ? value[key] : missing
      const value = merge(get(base), get(local), get(remote), path + '/' + key)
      if (value !== missing) result[key] = value
    }
    return result
  }
  throw new WorkspaceConflict(path)
}
export function mergeWorkspaces<T extends { updatedAt: number }>(base: T, local: T, remote: T): T {
  const strip = (value: T) => { const { updatedAt: _time, ...content } = value; return content }
  const result = merge(strip(base), strip(local), strip(remote), '个人内容')
  const signature = stable(result)
  const updatedAt = signature === contentSignature(remote) ? remote.updatedAt : signature === contentSignature(local) ? local.updatedAt : Date.now()
  return { ...result, updatedAt }
}
