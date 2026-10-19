import type { KnowledgeArticleData } from "../types";
import { featuresArticle } from "../operating-systems/features";
import { functionsArticle } from "../operating-systems/functions";
import { classificationArticle } from "../operating-systems/classification";
import { bootArticle } from "../operating-systems/boot";
import { virtualMachineArticle } from "../operating-systems/virtual-machine";
import { processArticle } from "../operating-systems/process";
import { threadArticle } from "../operating-systems/thread";
import { scheduleArticle } from "../operating-systems/schedule";
import { syncArticle } from "../operating-systems/sync";
import { deadlockArticle } from "../operating-systems/deadlock";
import { contiguousAllocationArticle } from "../operating-systems/contiguous-allocation";
import { noncontiguousAllocationArticle } from "../operating-systems/noncontiguous-allocation";
import { fileFcbArticle } from "../operating-systems/file-fcb";
import { fileOperationsArticle } from "../operating-systems/file-operations";
import { fileLogicalArticle } from "../operating-systems/file-logical";
import { filePhysicalArticle } from "../operating-systems/file-physical";
import { directoryConceptArticle } from "../operating-systems/directory-concept";
import { filesystemSpaceArticle } from "../operating-systems/filesystem-space";
import { filesystemVfsArticle } from "../operating-systems/filesystem-vfs";
import { bufferArticle } from "../operating-systems/buffer";

export const bookId = "operating-systems";

/** 本教材（操作系统）知识正文按 pointId 索引，作为独立懒加载 chunk。 */
export const articlesByPoint: Record<string, KnowledgeArticleData> = {
  [featuresArticle.pointId]: featuresArticle,
  [functionsArticle.pointId]: functionsArticle,
  [classificationArticle.pointId]: classificationArticle,
  [bootArticle.pointId]: bootArticle,
  [virtualMachineArticle.pointId]: virtualMachineArticle,
  [processArticle.pointId]: processArticle,
  [threadArticle.pointId]: threadArticle,
  [scheduleArticle.pointId]: scheduleArticle,
  [syncArticle.pointId]: syncArticle,
  [deadlockArticle.pointId]: deadlockArticle,
  [contiguousAllocationArticle.pointId]: contiguousAllocationArticle,
  [noncontiguousAllocationArticle.pointId]: noncontiguousAllocationArticle,
  [fileFcbArticle.pointId]: fileFcbArticle,
  [fileOperationsArticle.pointId]: fileOperationsArticle,
  [fileLogicalArticle.pointId]: fileLogicalArticle,
  [filePhysicalArticle.pointId]: filePhysicalArticle,
  [directoryConceptArticle.pointId]: directoryConceptArticle,
  [filesystemSpaceArticle.pointId]: filesystemSpaceArticle,
  [filesystemVfsArticle.pointId]: filesystemVfsArticle,
  [bufferArticle.pointId]: bufferArticle,
};