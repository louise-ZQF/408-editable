import { describe, expect, it } from 'vitest'
import {
  escapeRegExp,
  escapeHtml,
  extractSnippet,
  highlightText,
  normalizeIo,
  withBase,
} from '@/search/shared'

describe('normalizeIo', () => {
  it('将 I/O 归一为 io', () => {
    expect(normalizeIo('I/O方式')).toBe('io方式')
  })
  it('处理大小写与空格斜杠变形', () => {
    expect(normalizeIo('i / o通道')).toBe('io通道')
    // 无斜杠的字面 IO 不转换（normalizeIo 仅处理 I/O 变形）
    expect(normalizeIo('IO设备')).toBe('IO设备')
  })
})

describe('withBase', () => {
  it('base 缺省/根路径时原样返回', () => {
    // import.meta.env 在测试中无 BASE_URL → 走 base='/' 分支原样返回
    expect(withBase('/x/y')).toBe('/x/y')
  })
  it('相对路径直接返回，不拼接', () => {
    expect(withBase('relative/path')).toBe('relative/path')
  })
  it('完整 URL 与协议相对路径直接返回', () => {
    expect(withBase('https://a.com/x')).toBe('https://a.com/x')
    expect(withBase('//cdn.com/x')).toBe('//cdn.com/x')
  })
  it('空串返回空', () => {
    expect(withBase('')).toBe('')
  })
})

describe('escapeHtml', () => {
  it('转义 & < > "', () => {
    expect(escapeHtml(`<div a="1">&</div>`)).toBe(`&lt;div a=&quot;1&quot;&gt;&amp;&lt;/div&gt;`)
  })
})

describe('escapeRegExp', () => {
  it('转义正则元字符', () => {
    expect(escapeRegExp('a.b*c')).toBe('a\\.b\\*c')
  })
})

describe('extractSnippet', () => {
  it('长度不足 maxLen 时原样返回', () => {
    expect(extractSnippet('short text', 'x')).toBe('short text')
  })
  it('以命中 token 为中心截断并加省略号', () => {
    const text = `${'前'.repeat(60)}二叉树${'后'.repeat(60)}`
    const snippet = extractSnippet(text, '二叉树', 40)
    expect(snippet).toContain('二叉树')
    expect(snippet.length).toBeLessThanOrEqual(42)
    expect(snippet.startsWith('…') && snippet.endsWith('…')).toBe(true)
  })
  it('无命中时从头开始截断', () => {
    const text = 'A'.repeat(100)
    const snippet = extractSnippet(text, '找不到', 50)
    expect(snippet.endsWith('…')).toBe(true)
  })
})

describe('highlightText', () => {
  it('对二叉树插入 <mark>', () => {
    expect(highlightText('平衡二叉树查找', '二叉树')).toBe('平衡<mark>二叉树</mark>查找')
  })
  it('io 命中 I/O（斜杠可选）', () => {
    expect(highlightText('采用I/O通道', 'IO')).toContain('<mark>I/O</mark>')
  })
  it('空文本返回空串', () => {
    expect(highlightText('', '查询')).toBe('')
  })
  it('不泄露原始 HTML（<script> 被转义为实体）', () => {
    const out = highlightText('<script>alert(1)</script>', 'script')
    // 原始尖括号标签已转义，输出不得包含可直接执行的 <script>
    expect(out).not.toContain('<script>')
    expect(out).not.toContain('</script>')
    expect(out).toContain('&lt;')
  })
})