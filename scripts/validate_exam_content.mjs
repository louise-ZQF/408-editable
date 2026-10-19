import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const publicRoot = path.join(projectRoot, 'client/public')
const examsRoot = path.join(publicRoot, 'exams')
const manifestPath = path.join(examsRoot, 'manifest.json')
const indexPath = path.join(examsRoot, 'index.json')
const articlesRoot = path.join(projectRoot, 'client/src/content/knowledge-articles')

const EXPECTED_YEARS = Array.from({ length: 2026 - 2009 + 1 }, (_, index) => 2009 + index)
const SUBJECTS = new Set(['ds', 'co', 'os', 'cn'])
const QUESTION_TYPES = new Set(['choice', 'comprehensive'])
const PAPER_FIELDS = new Set([
  'id',
  'year',
  'number',
  'score',
  'questionType',
  'subject',
  'chapterName',
  'stem',
  'options',
  'answer',
  'explanation',
  'difficulty',
  'tags',
  'resourceLinks',
  'knowledgeBlockIds',
  'subQuestions',
])
const INDEX_FIELDS = new Set([
  'id',
  'year',
  'number',
  'type',
  'subject',
  'chapter',
  'topic',
  'stemText',
  'knowledgeBlockIds',
  'tags',
])
const SUBJECT_LABELS = {
  ds: '数据结构',
  co: '计算机组成原理',
  os: '操作系统',
  cn: '计算机网络',
}

const errors = []
const warnings = []

function fail(location, message) {
  errors.push(`${location}：${message}`)
}

function warn(location, message) {
  warnings.push(`${location}：${message}`)
}

function relative(filePath) {
  return path.relative(projectRoot, filePath)
}

function readJson(filePath) {
  if (!fs.existsSync(filePath)) {
    fail(relative(filePath), '文件不存在')
    return null
  }

  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'))
  } catch (error) {
    fail(relative(filePath), `JSON 无法解析：${error.message}`)
    return null
  }
}

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0
}

function sameStringArray(left, right) {
  return Array.isArray(left)
    && Array.isArray(right)
    && left.length === right.length
    && left.every((value, index) => value === right[index])
}

function assertStringArray(value, location, { nonEmpty = false, unique = false } = {}) {
  if (!Array.isArray(value)) {
    fail(location, '必须是字符串数组')
    return false
  }
  if (nonEmpty && value.length === 0) fail(location, '不能为空')
  for (const [index, item] of value.entries()) {
    if (!isNonEmptyString(item)) fail(`${location}[${index}]`, '必须是非空字符串')
  }
  if (unique && new Set(value).size !== value.length) fail(location, '存在重复值')
  return true
}

function assertKnownFields(record, allowedFields, location) {
  for (const key of Object.keys(record)) {
    if (!allowedFields.has(key)) fail(location, `包含未定义字段 ${key}`)
  }
}

function compareExamOrder(left, right) {
  return left.year - right.year || left.number - right.number || left.id.localeCompare(right.id)
}

function assertAscending(items, location) {
  for (let index = 1; index < items.length; index += 1) {
    if (compareExamOrder(items[index - 1], items[index]) >= 0) {
      fail(
        `${location}[${index}]`,
        `顺序错误：${items[index - 1].id} 不应排在 ${items[index].id} 前面，要求年份与题号严格升序`,
      )
    }
  }
}

function collectFiles(directory, predicate) {
  if (!fs.existsSync(directory)) return []
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name)
    if (entry.isDirectory()) return collectFiles(target, predicate)
    return entry.isFile() && predicate(target) ? [target] : []
  })
}

function collectKnowledgeBlockIds() {
  const ids = new Set()
  for (const filePath of collectFiles(articlesRoot, (target) => target.endsWith('.ts'))) {
    const source = fs.readFileSync(filePath, 'utf8')
    for (const match of source.matchAll(/\bid:\s*['"](kb-[a-z0-9]+(?:-[a-z0-9]+)*)['"]/g)) {
      ids.add(match[1])
    }
  }
  return ids
}

function collectStrings(value, result = []) {
  if (typeof value === 'string') result.push(value)
  else if (Array.isArray(value)) value.forEach((item) => collectStrings(item, result))
  else if (isPlainObject(value)) Object.values(value).forEach((item) => collectStrings(item, result))
  return result
}

function validateStaticReferences(question, location) {
  const strings = collectStrings(question)
  const urls = []

  for (const value of strings) {
    if (/file:\/\//i.test(value) || /(?:^|[\s('"])(?:\/Users\/|[A-Za-z]:\\)/.test(value)) {
      fail(location, '包含本机绝对路径或 file:// URL')
    }
    if (/localhost:3000|\/api\/exams\b/.test(value)) {
      fail(location, '仍然引用已删除的真题后端')
    }
    for (const match of value.matchAll(/!\[[^\]]*\]\(([^)\s]+)(?:\s+['"][^'"]*['"])?\)/g)) urls.push(match[1])
    for (const match of value.matchAll(/<img\b[^>]*\bsrc=['"]([^'"]+)['"][^>]*>/gi)) urls.push(match[1])
  }

  for (const url of urls) {
    if (/^(?:https?:|data:)/i.test(url)) continue
    if (!url.startsWith('/exams/')) {
      fail(location, `题库图片必须使用 /exams/... 静态路径：${url}`)
      continue
    }
    const decodedUrl = decodeURIComponent(url.split(/[?#]/, 1)[0])
    const target = path.resolve(publicRoot, `.${decodedUrl}`)
    if (!target.startsWith(`${examsRoot}${path.sep}`)) {
      fail(location, `图片路径越出 exams 目录：${url}`)
    } else if (!fs.existsSync(target) || !fs.statSync(target).isFile()) {
      warn(location, `图片文件不存在：${url}`)
    }
  }
}

function validateQuestion(question, paperYear, knowledgeBlockIds, location) {
  if (!isPlainObject(question)) {
    fail(location, '题目必须是对象')
    return
  }

  assertKnownFields(question, PAPER_FIELDS, location)

  if (!Number.isInteger(question.number) || question.number < 1) fail(`${location}.number`, '必须是正整数')
  if (question.year !== paperYear) fail(`${location}.year`, `必须等于试卷年份 ${paperYear}`)
  if (question.id !== `exam-${paperYear}-${question.number}`) {
    fail(`${location}.id`, `应为 exam-${paperYear}-${question.number}`)
  }
  if (!Number.isFinite(question.score) || question.score <= 0) fail(`${location}.score`, '必须是正数')
  if (!QUESTION_TYPES.has(question.questionType)) fail(`${location}.questionType`, '必须是 choice 或 comprehensive')
  if (!SUBJECTS.has(question.subject)) fail(`${location}.subject`, '必须是 ds、co、os 或 cn')
  if (!isNonEmptyString(question.chapterName)) fail(`${location}.chapterName`, '不能为空')
  if (!isNonEmptyString(question.stem)) fail(`${location}.stem`, '不能为空')
  if (!Number.isInteger(question.difficulty) || question.difficulty < 1 || question.difficulty > 5) {
    fail(`${location}.difficulty`, '必须是 1 到 5 的整数')
  }

  assertStringArray(question.tags, `${location}.tags`, { nonEmpty: true, unique: true })
  assertStringArray(question.resourceLinks, `${location}.resourceLinks`, { unique: true })
  if (assertStringArray(question.knowledgeBlockIds, `${location}.knowledgeBlockIds`, { nonEmpty: true, unique: true })) {
    if (question.knowledgeBlockIds.length > 4) fail(`${location}.knowledgeBlockIds`, '最多关联 4 个知识块')
    for (const blockId of question.knowledgeBlockIds) {
      if (!/^kb-[a-z0-9]+(?:-[a-z0-9]+)*$/.test(blockId)) {
        fail(`${location}.knowledgeBlockIds`, `格式错误：${blockId}`)
      } else if (!knowledgeBlockIds.has(blockId)) {
        fail(`${location}.knowledgeBlockIds`, `引用不存在的知识块：${blockId}`)
      }
    }
  }

  if (!Array.isArray(question.options)) {
    fail(`${location}.options`, '必须是数组')
  } else {
    const optionKeys = []
    for (const [index, option] of question.options.entries()) {
      const optionLocation = `${location}.options[${index}]`
      if (!isPlainObject(option)) {
        fail(optionLocation, '选项必须是对象')
        continue
      }
      if (!isNonEmptyString(option.key)) fail(`${optionLocation}.key`, '不能为空')
      if (!isNonEmptyString(option.text)) fail(`${optionLocation}.text`, '不能为空')
      if (isNonEmptyString(option.key)) optionKeys.push(option.key)
    }
    if (new Set(optionKeys).size !== optionKeys.length) fail(`${location}.options`, '选项 key 重复')
    if (question.questionType === 'choice') {
      if (question.options.length !== 4) fail(`${location}.options`, '选择题必须有 4 个选项')
      if (!isNonEmptyString(question.answer) || !optionKeys.includes(question.answer.trim())) {
        fail(`${location}.answer`, '选择题答案必须对应一个选项 key')
      }
    } else if (question.options.length !== 0) {
      fail(`${location}.options`, '综合题不应包含选择题选项')
    }
  }

  if (!isNonEmptyString(question.explanation)) fail(`${location}.explanation`, '解析不能为空')
  if (question.answer != null && typeof question.answer !== 'string') fail(`${location}.answer`, '必须是字符串')
  if (question.subQuestions != null && !Array.isArray(question.subQuestions)) {
    fail(`${location}.subQuestions`, '存在时必须是数组')
  }

  validateStaticReferences(question, location)
}

function validateIndexItem(item, location) {
  if (!isPlainObject(item)) {
    fail(location, '索引项必须是对象')
    return
  }
  assertKnownFields(item, INDEX_FIELDS, location)
  if (!isNonEmptyString(item.id)) fail(`${location}.id`, '不能为空')
  if (!Number.isInteger(item.year)) fail(`${location}.year`, '必须是整数')
  if (!Number.isInteger(item.number) || item.number < 1) fail(`${location}.number`, '必须是正整数')
  if (!QUESTION_TYPES.has(item.type)) fail(`${location}.type`, '必须是 choice 或 comprehensive')
  if (!SUBJECTS.has(item.subject)) fail(`${location}.subject`, '必须是 ds、co、os 或 cn')
  if (!isNonEmptyString(item.chapter)) fail(`${location}.chapter`, '不能为空')
  if (!isNonEmptyString(item.topic)) fail(`${location}.topic`, '不能为空')
  if (!isNonEmptyString(item.stemText)) fail(`${location}.stemText`, '不能为空')
  assertStringArray(item.knowledgeBlockIds, `${location}.knowledgeBlockIds`, { nonEmpty: true, unique: true })
  assertStringArray(item.tags, `${location}.tags`, { nonEmpty: true, unique: true })
}

const manifest = readJson(manifestPath)
const index = readJson(indexPath)
const knowledgeBlockIds = collectKnowledgeBlockIds()
const questionsById = new Map()
const allQuestions = []

if (knowledgeBlockIds.size === 0) fail(relative(articlesRoot), '没有提取到任何 kb-* 知识块 ID')

if (manifest && !isPlainObject(manifest)) fail(relative(manifestPath), '根节点必须是对象')
if (manifest && isPlainObject(manifest)) {
  if (!Number.isInteger(manifest.version) || manifest.version < 1) fail('manifest.version', '必须是正整数')
  if (!Number.isInteger(manifest.totalQuestions) || manifest.totalQuestions < 1) {
    fail('manifest.totalQuestions', '必须是正整数')
  }
  if (!Array.isArray(manifest.years)) fail('manifest.years', '必须是数组')
}

const manifestYears = Array.isArray(manifest?.years) ? manifest.years : []
const listedYears = []
for (const [indexInManifest, entry] of manifestYears.entries()) {
  const location = `manifest.years[${indexInManifest}]`
  if (!isPlainObject(entry)) {
    fail(location, '必须是对象')
    continue
  }
  if (!Number.isInteger(entry.year)) fail(`${location}.year`, '必须是整数')
  if (!Number.isInteger(entry.questionCount) || entry.questionCount < 1) {
    fail(`${location}.questionCount`, '必须是正整数')
  }
  if (entry.path !== `/exams/${entry.year}/paper.json`) {
    fail(`${location}.path`, `应为 /exams/${entry.year}/paper.json`)
  }
  listedYears.push(entry.year)
}

if (JSON.stringify(listedYears) !== JSON.stringify(EXPECTED_YEARS)) {
  fail('manifest.years', `年份必须完整且升序覆盖 ${EXPECTED_YEARS[0]}–${EXPECTED_YEARS.at(-1)}`)
}

const directoryYears = fs.existsSync(examsRoot)
  ? fs.readdirSync(examsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && /^\d{4}$/.test(entry.name))
    .map((entry) => Number(entry.name))
    .sort((left, right) => left - right)
  : []
if (JSON.stringify(directoryYears) !== JSON.stringify(EXPECTED_YEARS)) {
  fail(relative(examsRoot), `年份目录必须完整覆盖 ${EXPECTED_YEARS[0]}–${EXPECTED_YEARS.at(-1)}`)
}

for (const entry of manifestYears) {
  if (!isPlainObject(entry) || !Number.isInteger(entry.year)) continue
  const paperPath = path.join(examsRoot, String(entry.year), 'paper.json')
  const paper = readJson(paperPath)
  if (!paper) continue
  const paperLocation = relative(paperPath)

  if (!isPlainObject(paper)) {
    fail(paperLocation, '根节点必须是对象')
    continue
  }
  if (paper.year !== entry.year) fail(`${paperLocation}.year`, `必须等于 ${entry.year}`)
  if (!isNonEmptyString(paper.title)) fail(`${paperLocation}.title`, '不能为空')
  if (!Number.isInteger(paper.questionCount) || paper.questionCount < 1) {
    fail(`${paperLocation}.questionCount`, '必须是正整数')
  }
  if (!Array.isArray(paper.questions)) {
    fail(`${paperLocation}.questions`, '必须是数组')
    continue
  }
  if (paper.questionCount !== paper.questions.length) {
    fail(`${paperLocation}.questionCount`, `声明 ${paper.questionCount}，实际 ${paper.questions.length}`)
  }
  if (entry.questionCount !== paper.questions.length) {
    fail(`manifest ${entry.year}.questionCount`, `声明 ${entry.questionCount}，试卷实际 ${paper.questions.length}`)
  }

  const expectedNumbers = Array.from({ length: paper.questions.length }, (_, itemIndex) => itemIndex + 1)
  const actualNumbers = paper.questions.map((question) => question?.number)
  if (JSON.stringify(actualNumbers) !== JSON.stringify(expectedNumbers)) {
    fail(`${paperLocation}.questions`, `题号必须完整且按 1–${paper.questions.length} 升序排列`)
  }

  for (const [questionIndex, question] of paper.questions.entries()) {
    const questionLocation = `${paperLocation}#${question?.id ?? questionIndex}`
    validateQuestion(question, entry.year, knowledgeBlockIds, questionLocation)
    if (!isPlainObject(question) || !isNonEmptyString(question.id)) continue
    if (questionsById.has(question.id)) {
      fail(questionLocation, `题目 ID 与 ${questionsById.get(question.id).location} 重复`)
    } else {
      questionsById.set(question.id, { question, location: questionLocation })
      allQuestions.push(question)
    }
  }
}

assertAscending(allQuestions, 'paper questions')
if (manifest && manifest.totalQuestions !== allQuestions.length) {
  fail('manifest.totalQuestions', `声明 ${manifest.totalQuestions}，实际 ${allQuestions.length}`)
}

if (!Array.isArray(index)) {
  fail(relative(indexPath), '根节点必须是数组')
} else {
  const indexIds = new Set()
  for (const [itemIndex, item] of index.entries()) {
    const location = `${relative(indexPath)}[${itemIndex}]`
    validateIndexItem(item, location)
    if (!isPlainObject(item) || !isNonEmptyString(item.id)) continue
    if (indexIds.has(item.id)) fail(location, `索引 ID 重复：${item.id}`)
    indexIds.add(item.id)

    const paperRecord = questionsById.get(item.id)
    if (!paperRecord) {
      fail(location, `找不到对应的 paper.json 题目：${item.id}`)
      continue
    }
    const question = paperRecord.question
    const comparisons = [
      ['year', item.year, question.year],
      ['number', item.number, question.number],
      ['type', item.type, question.questionType],
      ['subject', item.subject, question.subject],
      ['chapter', item.chapter, question.chapterName],
      ['topic', item.topic, SUBJECT_LABELS[question.subject]],
      ['stemText', item.stemText, question.stem],
    ]
    for (const [field, actual, expected] of comparisons) {
      if (actual !== expected) fail(`${location}.${field}`, `与 ${paperRecord.location} 不一致`)
    }
    if (!sameStringArray(item.knowledgeBlockIds, question.knowledgeBlockIds)) {
      fail(`${location}.knowledgeBlockIds`, `与 ${paperRecord.location} 不一致`)
    }
    if (!sameStringArray(item.tags, question.tags)) {
      fail(`${location}.tags`, `与 ${paperRecord.location} 不一致`)
    }
  }

  assertAscending(index.filter(isPlainObject), relative(indexPath))
  if (index.length !== allQuestions.length) {
    fail(relative(indexPath), `索引 ${index.length} 条，试卷实际 ${allQuestions.length} 条`)
  }
  for (const [questionId, paperRecord] of questionsById) {
    if (!indexIds.has(questionId)) fail(paperRecord.location, '缺少 index.json 索引项')
  }
}

if (warnings.length > 0) {
  console.warn(`真题校验警告：共 ${warnings.length} 个问题（不影响构建）。`)
  for (const message of warnings.slice(0, 100)) console.warn(`- ${message}`)
  if (warnings.length > 100) console.warn(`- 其余 ${warnings.length - 100} 个问题已省略。`)
}

if (errors.length > 0) {
  console.error(`真题校验失败：共 ${errors.length} 个问题。`)
  for (const message of errors.slice(0, 100)) console.error(`- ${message}`)
  if (errors.length > 100) console.error(`- 其余 ${errors.length - 100} 个问题已省略。`)
  process.exitCode = 1
} else {
  console.log(
    `真题校验通过：${manifestYears.length} 年、${allQuestions.length} 道题、${knowledgeBlockIds.size} 个可引用知识块，索引与静态资源一致。`,
  )
}
