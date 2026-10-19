#!/usr/bin/env node
/**
 * 由 client/public/exams/{year}/paper.json 重建静态真题索引：
 *   client/public/exams/manifest.json —— 年份 + 资源位置
 *   client/public/exams/index.json    —— 轻量筛选/搜索索引（不含答案/解析/图片）
 *
 * paper.json 是唯一事实来源。编辑某年 paper.json 后无需手工同步
 * manifest.json / index.json，直接运行本脚本（或走 `npm run build`）即可。
 * 可重复执行，产物与 validate_exam_content.mjs 的校验规则保持一致。
 * 运行：node scripts/rebuild-exam-index.mjs
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const examsRoot = path.join(projectRoot, "client/public/exams");
const manifestPath = path.join(examsRoot, "manifest.json");
const indexPath = path.join(examsRoot, "index.json");

const SUBJECT_LABELS = {
  ds: "数据结构",
  co: "计算机组成原理",
  os: "操作系统",
  cn: "计算机网络",
};
const MANIFEST_VERSION = 1;

function listYears() {
  if (!existsSync(examsRoot)) {
    console.error(`未找到题库目录：${path.relative(projectRoot, examsRoot)}`);
    process.exit(1);
  }
  return readdirSync(examsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && /^\d{4}$/.test(entry.name))
    .map((entry) => Number(entry.name))
    .sort((left, right) => left - right);
}

function buildIndexRow(question, year) {
  const id = question.id || `exam-${year}-${question.number}`;
  return {
    id,
    year,
    number: question.number,
    type:
      question.questionType === "comprehensive" ? "comprehensive" : "choice",
    subject: question.subject,
    chapter: question.chapterName,
    topic: SUBJECT_LABELS[question.subject] || question.subject,
    stemText: question.stem ?? "",
    knowledgeBlockIds: Array.isArray(question.knowledgeBlockIds)
      ? question.knowledgeBlockIds
      : [],
    tags: Array.isArray(question.tags) ? question.tags : [],
  };
}

function main() {
  const years = listYears();
  if (!years.length) {
    console.error(
      `未在 ${path.relative(projectRoot, examsRoot)} 找到任何年份目录。`,
    );
    process.exit(1);
  }

  const manifestYears = [];
  const indexRows = [];
  let totalQuestions = 0;

  for (const year of years) {
    const paperPath = path.join(examsRoot, String(year), "paper.json");
    if (!existsSync(paperPath)) {
      console.error(
        `缺少 ${path.relative(projectRoot, paperPath)}，已跳过该年份。`,
      );
      process.exitCode = 1;
      continue;
    }
    const paper = JSON.parse(readFileSync(paperPath, "utf8"));
    const questions = Array.isArray(paper.questions) ? paper.questions : [];

    const rows = questions.map((question) => buildIndexRow(question, year));
    rows.sort((left, right) => left.number - right.number);
    for (const row of rows) indexRows.push(row);

    manifestYears.push({
      year,
      questionCount: rows.length,
      path: `/exams/${year}/paper.json`,
    });
    totalQuestions += rows.length;
  }

  indexRows.sort(
    (left, right) => left.year - right.year || left.number - right.number,
  );

  writeFileSync(
    manifestPath,
    JSON.stringify(
      { version: MANIFEST_VERSION, totalQuestions, years: manifestYears },
      null,
      2,
    ) + "\n",
  );
  writeFileSync(indexPath, JSON.stringify(indexRows, null, 2) + "\n");

  console.log("================ 真题索引重建完成 ================");
  console.log(`年份：${manifestYears.length}`);
  console.log(`题目总数：${totalQuestions}`);
  console.log(
    `产物：${path.relative(projectRoot, manifestPath)}、${path.relative(projectRoot, indexPath)}`,
  );
}

main();
