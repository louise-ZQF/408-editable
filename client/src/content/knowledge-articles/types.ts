import type { ManimWebAnimation } from '@/animations/types'

export type KnowledgeSourceImport = {
  path: string
  localName: string
  kind: 'default' | 'named'
  importedName?: string
}

type KnowledgeArticleBlockContent =
  | {
      type: 'paragraph'
      /** Markdown source rendered by KnowledgeMarkdown. */
      text: string
    }
  | {
      type: 'html'
      html: string
    }
  | {
      type: 'formula'
      formula: string
      caption?: string
    }
  | {
      type: 'callout'
      title: string
      text: string
      tone?: 'blue' | 'orange'
    }
  | {
      type: 'image'
      src: string
      alt: string
      caption?: string
      fullWidth?: boolean
      sourceImport?: KnowledgeSourceImport
    }
  | { type: 'embed'; title: string; html: string }
  | {
      type: 'animation'
      animation: ManimWebAnimation
      sourceImport?: KnowledgeSourceImport
    }

export type KnowledgeArticleBlock = KnowledgeArticleBlockContent & {
  id: string
}

export type KnowledgeSubpoint = {
  id: string
  title: string
  blocks: KnowledgeArticleBlock[]
}

export type KnowledgeArticleData = {
  pointId: string
  subpoints: KnowledgeSubpoint[]
}
