import DOMPurify from 'dompurify'
import katex from 'katex'

function clean(html: string) {
  return DOMPurify.sanitize(html, { FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input', 'textarea'], FORBID_ATTR: ['contenteditable', 'autofocus'] })
}

function recognizeTextMath(container: HTMLElement) {
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT)
  const nodes: Text[] = []
  while (walker.nextNode()) {
    const node = walker.currentNode as Text
    if (!node.parentElement?.closest('pre, code, math, svg, [data-rich-math], .katex')) nodes.push(node)
  }
  // 带格式的剪贴板和旧内容也可能直接包含公式定界符，只转换正文文本。
  const pattern = /\$\$([\s\S]+?)\$\$|\\\[([\s\S]+?)\\\]|\\\(([\s\S]+?)\\\)|(?<!\\)\$(?!\s|\$)((?:\\.|[^$\n])+?)(?<!\s)\$(?!\d)/g
  for (const node of nodes) {
    const text = node.textContent || ''
    const matches = [...text.matchAll(pattern)]
    if (!matches.length) continue
    const fragment = document.createDocumentFragment()
    let offset = 0
    for (const match of matches) {
      const index = match.index!
      fragment.append(document.createTextNode(text.slice(offset, index)))
      const token = document.createElement('span')
      token.dataset.richMath = (match[1] ?? match[2] ?? match[3] ?? match[4]).trim()
      token.dataset.mathDisplay = match[1] !== undefined || match[2] !== undefined ? 'block' : 'inline'
      fragment.append(token)
      offset = index + match[0].length
    }
    fragment.append(document.createTextNode(text.slice(offset)))
    node.replaceWith(fragment)
  }
}

// 把已排版的公式保留为独立对象，输入中文时不用接触公式源码。
export function editableRichHTML(html: string) {
  const container = document.createElement('div')
  container.innerHTML = clean(html)
  for (const formula of container.querySelectorAll('.katex-display, .katex')) {
    if (!formula.isConnected && !container.contains(formula)) continue
    if (formula.closest('[data-rich-math]')) continue
    const latex = formula.querySelector('annotation[encoding="application/x-tex"]')?.textContent
    if (!latex) continue
    const token = document.createElement('span')
    token.dataset.richMath = latex
    token.dataset.mathDisplay = formula.classList.contains('katex-display') ? 'block' : 'inline'
    formula.replaceWith(token)
  }
  return renderRichHTML(container.innerHTML)
}

export function renderRichHTML(html: string) {
  const container = document.createElement('div')
  container.innerHTML = clean(html)
  recognizeTextMath(container)
  for (const token of container.querySelectorAll<HTMLElement>('[data-rich-math]')) {
    token.classList.add('rich-math-token')
    token.innerHTML = katex.renderToString(token.dataset.richMath || '', { displayMode: token.dataset.mathDisplay === 'block', throwOnError: false, trust: false })
  }
  return container.innerHTML
}

export function serializeRichHTML(element: HTMLElement) {
  const copy = element.cloneNode(true) as HTMLElement
  for (const formula of copy.querySelectorAll('.katex-display, .katex')) {
    if (!copy.contains(formula) || formula.closest('[data-rich-math]')) continue
    const latex = formula.querySelector('annotation[encoding="application/x-tex"]')?.textContent
    if (!latex) continue
    const token = document.createElement('span')
    token.dataset.richMath = latex
    token.dataset.mathDisplay = formula.classList.contains('katex-display') ? 'block' : 'inline'
    formula.replaceWith(token)
  }
  for (const token of copy.querySelectorAll<HTMLElement>('[data-rich-math]')) {
    token.innerHTML = ''
    token.removeAttribute('contenteditable')
    token.removeAttribute('tabindex')
  }
  for (const protectedElement of copy.querySelectorAll('[contenteditable]')) protectedElement.removeAttribute('contenteditable')
  return clean(copy.innerHTML)
}
