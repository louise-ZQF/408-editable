import { Marked, type TokenizerAndRendererExtension } from 'marked'
import { editableRichHTML } from './richText'

function mathHTML(latex: string, display: boolean) {
  const token = document.createElement('span')
  token.dataset.richMath = latex.trim()
  token.dataset.mathDisplay = display ? 'block' : 'inline'
  return token.outerHTML
}

// 在 Markdown 分词时识别公式，代码块和行内代码仍按原文保留。
function mathExtension(level: 'block' | 'inline'): TokenizerAndRendererExtension {
  return {
    name: `clipboardMath${level}`,
    level,
    start(source) {
      const index = level === 'block'
        ? source.search(/^(?: {0,3})(?:\$\$|\\\[)/m)
        : source.search(/\$|\\[([]/)
      return index < 0 ? undefined : index
    },
    tokenizer(source) {
      const patterns = level === 'block'
        ? [/^ {0,3}\$\$([\s\S]+?)\$\$(?:[ \t]*\n|$)/, /^ {0,3}\\\[([\s\S]+?)\\\](?:[ \t]*\n|$)/]
        : [/^\$\$([\s\S]+?)\$\$/, /^\\\[([\s\S]+?)\\\]/, /^\\\(([\s\S]+?)\\\)/, /^\$(?!\s|\$)((?:\\.|[^$\n])+?)(?<!\s)\$(?!\d)/]
      for (const [index, pattern] of patterns.entries()) {
        const match = pattern.exec(source)
        if (match) return { type: `clipboardMath${level}`, raw: match[0], latex: match[1], display: level === 'block' || index < 2 }
      }
    },
    renderer(token) { return mathHTML(token.latex, token.display) },
  }
}

const markdown = new Marked({ async: false, gfm: true, breaks: true }, { extensions: [mathExtension('block'), mathExtension('inline')] })

export function clipboardRichHTML(html: string, text: string) {
  const container = document.createElement('div')
  container.innerHTML = editableRichHTML(html)
  const formatted = container.querySelector('h1, h2, h3, h4, h5, h6, strong, b, em, i, ul, ol, table, pre, code, blockquote, a, img, math, svg, [data-rich-math]')
  if (!formatted && text) return editableRichHTML(markdown.parse(text, { async: false }))

  // 保留正文结构，去掉复制页面附带的按钮、样式和定位属性。
  for (const control of container.querySelectorAll('button, style, meta, link, noscript')) control.remove()
  for (const element of container.querySelectorAll<HTMLElement>('*')) {
    if (element.closest('[data-rich-math]')) continue
    element.removeAttribute('style')
    element.removeAttribute('class')
    element.removeAttribute('id')
  }
  return editableRichHTML(container.innerHTML)
}
