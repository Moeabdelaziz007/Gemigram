import { MemoryFragment } from "./types";
import { cosineSimilarity } from "./vector-engine";

export interface MemoryLink {
  sourceId: string;
  targetId: string;
  strength: number; // 0-1
  type: "semantic" | "temporal" | "explicit";
}

/**
 * Maps relationships between disparate memory fragments.
 * Transforms a flat list into a knowledge graph.
 */
export class MemoryGraphMapper {
  /**
   * Identifies potential links based on vector similarity or shared tags.
   */
  static identifyLinks(
    fragments: MemoryFragment[], 
    similarityThreshold: number = 0.85
  ): MemoryLink[] {
    const links: MemoryLink[] = [];

    for (let i = 0; i < fragments.length; i++) {
      for (let j = i + 1; j < fragments.length; j++) {
        const f1 = fragments[i];
        const f2 = fragments[j];

        // Semantic Linkage (Vector overlap)
        if (f1.embedding && f2.embedding) {
          const sim = cosineSimilarity(f1.embedding, f2.embedding);
          if (sim > similarityThreshold) {
            links.push({
              sourceId: f1.id,
              targetId: f2.id,
              strength: sim,
              type: "semantic"
            });
          }
        }

        // Tag Linkage (Explicit overlap)
        const commonTags = f1.metadata.tags.filter(t => f2.metadata.tags.includes(t));
        if (commonTags.length > 0) {
          links.push({
            sourceId: f1.id,
            targetId: f2.id,
            strength: Math.min(commonTags.length * 0.2, 1.0),
            type: "explicit"
          });
        }
      }
    }

    return links;
  }
}
