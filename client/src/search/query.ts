import { escapeRegExp, normalizeIo } from './shared'

export const MAX_SEARCH_LENGTH = 20
export const SEARCH_EXAMPLES = ['快表', '排序稳定性', 'TCP 拥塞控制']

export const SEARCH_SUBJECTS = [
  { id: 'ds', bookSubject: 'DATA_STRUCTURES', title: '数据结构' },
  { id: 'co', bookSubject: 'COMPUTER_ORGANIZATION', title: '计算机组成原理' },
  { id: 'os', bookSubject: 'OPERATING_SYSTEMS', title: '操作系统' },
  { id: 'cn', bookSubject: 'NETWORK', title: '计算机网络' },
] as const

export type SearchSubject = (typeof SEARCH_SUBJECTS)[number]['id']
export type SearchScope = 'all' | 'knowledge' | 'exam'
export type SearchFilters = { scope: SearchScope; subject: SearchSubject | '' }

export function normalizeSearch(text: string): string {
  return normalizeIo(text.normalize('NFKC')).trim().toLowerCase().replace(/\s+/g, ' ')
}

const mixedScriptBoundary = /(?<=[a-z0-9])\s*(?=\p{Script=Han})|(?<=\p{Script=Han})\s*(?=[a-z0-9])/gu

export function searchTopic(query: string): string {
  const text = normalizeSearch(query)
  const topic = text
    .replace(/[?]+$/, '')
    .trim()
    .replace(/^(?:怎么[求算]|如何(?:求|计算)|求(?=[a-z0-9\s]))\s*/u, '')
    .replace(/\s*(?:怎么算|怎么求|如何计算|怎么计算)$/u, '')
  return (topic || text).replace(mixedScriptBoundary, ' ')
}

export function phrasePattern(phrase: string): RegExp {
  const escaped = phrase.split(mixedScriptBoundary).map(escapeRegExp).join('\\s*')
  return new RegExp(/^[a-z0-9]+$/.test(phrase)
    ? `(^|[^a-z0-9])${escaped}(?=$|[^a-z0-9])`
    : escaped)
}

export function searchPhrases(query: string, synonyms: Map<string, string[]>): string[] {
  const normalized = normalizeSearch(query)
  return [...new Set([normalized, ...(synonyms.get(normalized) ?? []).map(normalizeSearch)])].filter(Boolean)
}

export function plainSearchText(text: string): string {
  return text
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\*\*|__|```[^\n]*|`/g, '')
    .replace(/^\s{0,3}(?:#{1,6}|>|[-*+])\s+/gm, '')
    .replace(/^\s*\|(?:[|:\-\s]+)\|\s*$/gm, '')
    .replace(/\|/g, ' ')
}
