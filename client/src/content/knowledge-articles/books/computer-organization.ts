import type { KnowledgeArticleData } from "../types";
import { von_neumannArticle } from "../computer-organization/von-neumann";
import { sourceToLoadArticle } from "../computer-organization/source-to-load";
import { isaArticle } from "../computer-organization/isa";
import { performanceArticle } from "../computer-organization/performance";
import { wordLengthArticle } from "../computer-organization/word-length";
import { base_conversionArticle } from "../computer-organization/number-representation/base-conversion";
import { codeArticle } from "../computer-organization/number-representation/code";
import { ieee754Article } from "../computer-organization/floating-point/ieee754";
import { floatOpsArticle } from "../computer-organization/floating-point/ops";
import { aluArticle } from "../computer-organization/arithmetic/alu";
import { arithmeticMethodsArticle } from "../computer-organization/arithmetic/arithmetic-methods";
import { memory_hierarchyArticle } from "../computer-organization/memory-hierarchy";
import { sramDramArticle } from "../computer-organization/sram-dram";
import { multiModuleArticle } from "../computer-organization/multi-module";
import { memoryExpandArticle } from "../computer-organization/memory-expand";
import { coCacheBasicsArticle } from "../computer-organization/co-cache-basics";
import { coCacheReplaceWriteArticle } from "../computer-organization/co-cache-replace-write";
import { coCachePerformanceArticle } from "../computer-organization/co-cache-performance";
import { coVmBasicsArticle } from "../computer-organization/co-vm-basics";
import { coVmImplArticle } from "../computer-organization/co-vm-impl";
import { coExternalHddArticle } from "../computer-organization/co-external-hdd";
import { coExternalSsdArticle } from "../computer-organization/co-external-ssd";
import { instruction_formatArticle } from "../computer-organization/instruction-format";
import { addressingArticle } from "../computer-organization/addressing";
import { alignmentArticle } from "../computer-organization/alignment";
import { datapathArticle } from "../computer-organization/datapath";
import { executeArticle } from "../computer-organization/execute";
import { controllerArticle } from "../computer-organization/controller";
import { pipelineArticle } from "../computer-organization/pipeline";
import { multicoreArticle } from "../computer-organization/multicore";
import { busArticle } from "../computer-organization/bus";
import { io_methodArticle } from "../computer-organization/io-method";
import { interruptArticle } from "../computer-organization/interrupt";

export const bookId = "computer-organization";

/** 本教材（计算机组成原理）知识正文按 pointId 索引，作为独立懒加载 chunk。 */
export const articlesByPoint: Record<string, KnowledgeArticleData> = {
  [von_neumannArticle.pointId]: von_neumannArticle,
  [sourceToLoadArticle.pointId]: sourceToLoadArticle,
  [isaArticle.pointId]: isaArticle,
  [performanceArticle.pointId]: performanceArticle,
  [wordLengthArticle.pointId]: wordLengthArticle,
  [base_conversionArticle.pointId]: base_conversionArticle,
  [codeArticle.pointId]: codeArticle,
  [ieee754Article.pointId]: ieee754Article,
  [floatOpsArticle.pointId]: floatOpsArticle,
  [aluArticle.pointId]: aluArticle,
  [arithmeticMethodsArticle.pointId]: arithmeticMethodsArticle,
  [memory_hierarchyArticle.pointId]: memory_hierarchyArticle,
  [sramDramArticle.pointId]: sramDramArticle,
  [multiModuleArticle.pointId]: multiModuleArticle,
  [memoryExpandArticle.pointId]: memoryExpandArticle,
  [coCacheBasicsArticle.pointId]: coCacheBasicsArticle,
  [coCacheReplaceWriteArticle.pointId]: coCacheReplaceWriteArticle,
  [coCachePerformanceArticle.pointId]: coCachePerformanceArticle,
  [coVmBasicsArticle.pointId]: coVmBasicsArticle,
  [coVmImplArticle.pointId]: coVmImplArticle,
  [coExternalHddArticle.pointId]: coExternalHddArticle,
  [coExternalSsdArticle.pointId]: coExternalSsdArticle,
  [instruction_formatArticle.pointId]: instruction_formatArticle,
  [addressingArticle.pointId]: addressingArticle,
  [alignmentArticle.pointId]: alignmentArticle,
  [datapathArticle.pointId]: datapathArticle,
  [executeArticle.pointId]: executeArticle,
  [controllerArticle.pointId]: controllerArticle,
  [pipelineArticle.pointId]: pipelineArticle,
  [multicoreArticle.pointId]: multicoreArticle,
  [busArticle.pointId]: busArticle,
  [io_methodArticle.pointId]: io_methodArticle,
  [interruptArticle.pointId]: interruptArticle,
};