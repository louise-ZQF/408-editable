import type { ExamQuestionType, ExamSubject } from "@/types";

export type ExamFilterSelection = {
  keyword: string;
  year?: number;
  subject: ExamSubject | "";
  questionType: ExamQuestionType | "";
  chapter: string;
  section: string;
  tag: string;
  difficulty?: number;
  knowledgeBlockId: string;
};

export type ExamFilterPatch = Partial<ExamFilterSelection>;
