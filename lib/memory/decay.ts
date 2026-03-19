import { MemoryFragment } from "./types";

/**
 * Logic for temporal memory weighting.
 * Ensures that older, less important memories naturally "sink"
 * while frequently accessed or critical memories stay "afloat".
 */
export class MemoryDecay {
  private static DECAY_CONSTANT = 0.05; // Adjust for faster/slower decay

  /**
   * Calculates a relevance score (0-1) based on age and importance.
   */
  static calculateScore(fragment: MemoryFragment): number {
    const now = Date.now();
    const ageInDays = (now - fragment.metadata.timestamp) / (1000 * 60 * 60 * 24);
    
    // Halflife-style decay: S = I * e^(-k * t)
    // Where I is base importance (1-10) normalized to 0.1-1.0
    const baseImportance = fragment.metadata.importance / 10;
    const decayFactor = Math.exp(-this.DECAY_CONSTANT * ageInDays);
    
    return baseImportance * decayFactor;
  }

  /**
   * Sorts and filters a list of fragments based on active decay scores.
   */
  static rank(fragments: MemoryFragment[], threshold: number = 0.1): MemoryFragment[] {
    return fragments
      .map(f => ({
        ...f,
        relevanceScore: this.calculateScore(f)
      }))
      .filter(f => (f.relevanceScore || 0) > threshold)
      .sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
  }
}
