import type { KnowledgeArticleData } from "@/content/knowledge-articles/types";
import type { ExamKnowledgeLink, KnowledgePoint } from "@/types";

export type SectionArticleEntry = {
  point: KnowledgePoint;
  article: KnowledgeArticleData;
  examLinks: ExamKnowledgeLink[];
};

export type KnowledgeTocEntry = {
  id: string;
  title: string;
  article: KnowledgeArticleData;
};

export type SectionExamSummary = {
  blockIds: string[];
  examCount: number;
};
