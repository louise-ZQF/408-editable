/**
 * MiniSearch 搜索链路调试脚本。
 * 用法：npm run debug:search -- "TCP 可靠传输" 8
 */
import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import MiniSearch from 'minisearch'
import { Segment, useDefault } from 'segmentit'
import type { LoadedCorpus } from '../src/search/shared'
import type {
  SearchCorpus,
  SearchExamItem,
  SearchKnowledgeFragmentDoc,
  SearchKnowledgeSectionDoc,
} from '../src/search/types'
import { searchKnowledge } from '../src/search/composables/searchKnowledge'
import { searchExam } from '../src/search/composables/searchExam'

const here = dirname(fileURLToPath(import.meta.url))
const clientRoot = join(here, '..')

function buildSynonymLookup(groups: string[][]): Map<string, string[]> {
  const lookup = new Map<string, string[]>()
  for (const group of groups) {
    const normalized = group.map((word) => word.trim()).filter(Boolean)
    for (const word of normalized) lookup.set(word.toLowerCase(), normalized)
  }
  return lookup
}

function normalizeIo(text: string): string {
  return String(text).replace(/i\s*\/\s*o/gi, 'io')
}

async function loadCorpus(): Promise<LoadedCorpus> {
  const [corpusRaw, sectionIndexRaw, fragmentIndexRaw, synonymsRaw, dictRaw] = await Promise.all([
    readFile(join(clientRoot, 'public/search/search-index.json'), 'utf8'),
    readFile(join(clientRoot, 'public/search/minisearch-index.json'), 'utf8'),
    readFile(join(clientRoot, 'public/search/minisearch-fragment-index.json'), 'utf8'),
    readFile(join(clientRoot, 'public/search/synonyms.json'), 'utf8'),
    readFile(join(clientRoot, 'src/search/408-terms.txt'), 'utf8'),
  ])
  const corpus = JSON.parse(corpusRaw) as SearchCorpus
  const segmenter = useDefault(new Segment()) as ReturnType<typeof useDefault> & { loadDict?: (dict: string) => void }
  segmenter.loadDict?.(dictRaw)
  const tokenize = (text: string) => segmenter.doSegment(
    normalizeIo(text).normalize('NFKC').toLowerCase(),
    { simple: true },
  ).map((word) => String(word).trim()).filter((word) => /[a-z0-9\u3400-\u9fff]/i.test(word))
  const sectionIndex = MiniSearch.loadJSON<SearchKnowledgeSectionDoc>(sectionIndexRaw, {
    idField: 'sectionId',
    fields: ['sectionTitle', 'pointTitles', 'subpointTitles', 'body'],
    storeFields: [
      'sectionId', 'bookId', 'bookTitle', 'chapterTitle', 'sectionTitle',
      'pointTitles', 'subpointTitles', 'route', 'parts', 'allBlockIds', 'examCount',
    ],
    tokenize,
    processTerm: (term) => term,
    extractField: (document, fieldName) => fieldName === 'body'
      ? document.parts.flatMap((part) => part.blockTexts).join(' ')
      : document[fieldName as keyof SearchKnowledgeSectionDoc],
  })
  const fragmentIndex = MiniSearch.loadJSON<SearchKnowledgeFragmentDoc>(fragmentIndexRaw, {
    idField: 'fragmentId',
    fields: ['title', 'text'],
    storeFields: ['fragmentId', 'sectionId', 'kind', 'partIndex', 'blockIndex'],
    tokenize,
    processTerm: (term) => term,
  })
  const examYearNumberMap = new Map<string, SearchExamItem>()
  corpus.exams.forEach((exam) => examYearNumberMap.set(`${exam.year}-${exam.number}`, exam))
  return {
    sectionIndex,
    fragmentIndex,
    synonyms: buildSynonymLookup(JSON.parse(synonymsRaw) as string[][]),
    examYearNumberMap,
  }
}

const query = process.argv[2] || 'TCP 可靠传输'
const topK = Number(process.argv[3] || 8)
const startedAt = performance.now()
const corpus = await loadCorpus()
const loadedAt = performance.now()
const exact = searchExam(query, corpus)
const results = searchKnowledge(query, corpus, topK)
const finishedAt = performance.now()

console.log(`加载索引: ${(loadedAt - startedAt).toFixed(1)}ms；检索: ${(finishedAt - loadedAt).toFixed(1)}ms`)
for (const result of [...exact, ...results]) {
  console.log(`${result.score?.toFixed(2) ?? 'exact'}  ${result.title}  ${result.subtitle}`)
  if (result.snippet) console.log(`  ${result.snippet}`)
}
