import type { KnowledgeArticleData } from "../types";
import { ds1_1BasicsArticle } from "../data-structures/ds-1-1-basics";
import { ds1_2TimeComplexityArticle } from "../data-structures/ds-1-2-time-complexity";
import { ds1_3SpaceComplexityArticle } from "../data-structures/ds-1-3-space-complexity";
import { ds2_1ConceptArticle } from "../data-structures/ds-2-1-concept";
import { ds2_2SequentialListArticle } from "../data-structures/ds-2-2-sequential-list";
import { ds2_3SinglyLinkedListArticle } from "../data-structures/ds-2-3-singly-linked-list";
import { ds2_4DoubleCircularStaticListArticle } from "../data-structures/ds-2-4-double-circular-static-list";
import { ds2_5ApplicationArticle } from "../data-structures/ds-2-5-application";
import { ds3_1StackArticle } from "../data-structures/ds-3-1-stack";
import { ds3_2StackApplicationArticle } from "../data-structures/ds-3-2-stack-application";
import { ds3_3QueueArticle } from "../data-structures/ds-3-3-queue";
import { ds3_4QueueApplicationArticle } from "../data-structures/ds-3-4-queue-application";
import { ds3_5MatrixCompressionArticle } from "../data-structures/ds-3-5-matrix-compression";
import { ds4_1StringBasicArticle } from "../data-structures/ds-4-1-string-basic";
import { ds4_2KmpArticle } from "../data-structures/ds-4-2-kmp";
import { ds4_3KmpImprovedArticle } from "../data-structures/ds-4-3-kmp-improved";
import { ds5_1TreeConceptArticle } from "../data-structures/ds-5-1-tree-concept";
import { ds5_2BinaryTreeConceptArticle } from "../data-structures/ds-5-2-binary-tree-concept";
import { ds5_3BinaryTreeStoreTraverseArticle } from "../data-structures/ds-5-3-binary-tree-store-traverse";
import { ds5_4ThreadedBinaryTreeArticle } from "../data-structures/ds-5-4-threaded-binary-tree";
import { ds5_5TreeForestArticle } from "../data-structures/ds-5-5-tree-forest";
import { ds5_6HuffmanArticle } from "../data-structures/ds-5-6-huffman";
import { ds5_7BstArticle } from "../data-structures/ds-5-7-bst";
import { ds5_8AvlArticle } from "../data-structures/ds-5-8-avl";
import { ds6_1GraphConceptArticle } from "../data-structures/ds-6-1-graph-concept";
import { ds6_2GraphStoreArticle } from "../data-structures/ds-6-2-graph-store";
import { ds6_3GraphTraverseArticle } from "../data-structures/ds-6-3-graph-traverse";
import { ds6_4MstArticle } from "../data-structures/ds-6-4-mst";
import { ds6_5ShortestPathArticle } from "../data-structures/ds-6-5-shortest-path";
import { ds6_6TopologicalArticle } from "../data-structures/ds-6-6-topological";
import { ds6_7CriticalPathArticle } from "../data-structures/ds-6-7-critical-path";
import { ds7_2SequentialSearchArticle } from "../data-structures/ds-7-2-sequential-search";
import { ds7_3BinarySearchArticle } from "../data-structures/ds-7-3-binary-search";
import { ds7_4BlockSearchArticle } from "../data-structures/ds-7-4-block-search";
import { ds7_5BTreeArticle } from "../data-structures/ds-7-5-b-tree";
import { ds7_6BPlusTreeArticle } from "../data-structures/ds-7-6-b-plus-tree";
import { ds7_7HashArticle } from "../data-structures/ds-7-7-hash";
import { ds7_8TreeSearchArticle } from "../data-structures/ds-7-8-tree-search";
import { ds8_1SortConceptArticle } from "../data-structures/ds-8-1-sort-concept";
import { ds8_2InternalSortArticle } from "../data-structures/ds-8-2-internal-sort";
import { ds8_7SortComparisonArticle } from "../data-structures/ds-8-7-sort-comparison";
import { ds8_8ExternalSortArticle } from "../data-structures/ds-8-8-external-sort";

export const bookId = "data-structures";

/** 本教材（数据结构）知识正文按 pointId 索引，作为独立懒加载 chunk。 */
export const articlesByPoint: Record<string, KnowledgeArticleData> = {
  [ds1_1BasicsArticle.pointId]: ds1_1BasicsArticle,
  [ds1_2TimeComplexityArticle.pointId]: ds1_2TimeComplexityArticle,
  [ds1_3SpaceComplexityArticle.pointId]: ds1_3SpaceComplexityArticle,
  [ds2_1ConceptArticle.pointId]: ds2_1ConceptArticle,
  [ds2_2SequentialListArticle.pointId]: ds2_2SequentialListArticle,
  [ds2_3SinglyLinkedListArticle.pointId]: ds2_3SinglyLinkedListArticle,
  [ds2_4DoubleCircularStaticListArticle.pointId]:
    ds2_4DoubleCircularStaticListArticle,
  [ds2_5ApplicationArticle.pointId]: ds2_5ApplicationArticle,
  [ds3_1StackArticle.pointId]: ds3_1StackArticle,
  [ds3_2StackApplicationArticle.pointId]: ds3_2StackApplicationArticle,
  [ds3_3QueueArticle.pointId]: ds3_3QueueArticle,
  [ds3_4QueueApplicationArticle.pointId]: ds3_4QueueApplicationArticle,
  [ds3_5MatrixCompressionArticle.pointId]: ds3_5MatrixCompressionArticle,
  [ds4_1StringBasicArticle.pointId]: ds4_1StringBasicArticle,
  [ds4_2KmpArticle.pointId]: ds4_2KmpArticle,
  [ds4_3KmpImprovedArticle.pointId]: ds4_3KmpImprovedArticle,
  [ds5_1TreeConceptArticle.pointId]: ds5_1TreeConceptArticle,
  [ds5_2BinaryTreeConceptArticle.pointId]: ds5_2BinaryTreeConceptArticle,
  [ds5_3BinaryTreeStoreTraverseArticle.pointId]:
    ds5_3BinaryTreeStoreTraverseArticle,
  [ds5_4ThreadedBinaryTreeArticle.pointId]: ds5_4ThreadedBinaryTreeArticle,
  [ds5_5TreeForestArticle.pointId]: ds5_5TreeForestArticle,
  [ds5_6HuffmanArticle.pointId]: ds5_6HuffmanArticle,
  [ds5_7BstArticle.pointId]: ds5_7BstArticle,
  [ds5_8AvlArticle.pointId]: ds5_8AvlArticle,
  [ds6_1GraphConceptArticle.pointId]: ds6_1GraphConceptArticle,
  [ds6_2GraphStoreArticle.pointId]: ds6_2GraphStoreArticle,
  [ds6_3GraphTraverseArticle.pointId]: ds6_3GraphTraverseArticle,
  [ds6_4MstArticle.pointId]: ds6_4MstArticle,
  [ds6_5ShortestPathArticle.pointId]: ds6_5ShortestPathArticle,
  [ds6_6TopologicalArticle.pointId]: ds6_6TopologicalArticle,
  [ds6_7CriticalPathArticle.pointId]: ds6_7CriticalPathArticle,
  [ds7_2SequentialSearchArticle.pointId]: ds7_2SequentialSearchArticle,
  [ds7_3BinarySearchArticle.pointId]: ds7_3BinarySearchArticle,
  [ds7_4BlockSearchArticle.pointId]: ds7_4BlockSearchArticle,
  [ds7_5BTreeArticle.pointId]: ds7_5BTreeArticle,
  [ds7_6BPlusTreeArticle.pointId]: ds7_6BPlusTreeArticle,
  [ds7_7HashArticle.pointId]: ds7_7HashArticle,
  [ds7_8TreeSearchArticle.pointId]: ds7_8TreeSearchArticle,
  [ds8_1SortConceptArticle.pointId]: ds8_1SortConceptArticle,
  [ds8_2InternalSortArticle.pointId]: ds8_2InternalSortArticle,
  [ds8_7SortComparisonArticle.pointId]: ds8_7SortComparisonArticle,
  [ds8_8ExternalSortArticle.pointId]: ds8_8ExternalSortArticle,
};