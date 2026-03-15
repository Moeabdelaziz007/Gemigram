import { AgentManifest } from './AgentRegistry';

export interface AgentCandidate {
  agent: AgentManifest;
  confidence: number;
  latencyMs: number;
  load: number; // 0 to 1
  continuityBonus: number; // 0 or 1
}

export class GravityRouter {
  private static CAPABILITY_WEIGHT = 0.35;
  private static CONFIDENCE_WEIGHT = 0.25;
  private static LATENCY_WEIGHT = 0.15;
  private static LOAD_WEIGHT = 0.15;
  private static CONTINUITY_WEIGHT = 0.10;

  private static MAX_LATENCY_MS = 500.0;

  static calculateScore(candidate: AgentCandidate): number {
    const normalizedLatency = Math.min(candidate.latencyMs / this.MAX_LATENCY_MS, 1.0);
    
    // Formula: score = 0.35*capability + 0.25*confidence - 0.15*latency - 0.15*load + 0.10*continuity
    // We assume capability match is 1 if they are in the candidate list
    const score = 
      (this.CAPABILITY_WEIGHT * 1.0) +
      (this.CONFIDENCE_WEIGHT * candidate.confidence) -
      (this.LATENCY_WEIGHT * normalizedLatency) -
      (this.LOAD_WEIGHT * candidate.load) +
      (this.CONTINUITY_WEIGHT * candidate.continuityBonus);

    return Math.max(0, Math.min(1, score));
  }

  static selectBestAgent(candidates: AgentCandidate[]): AgentManifest | null {
    if (candidates.length === 0) return null;

    const scored = candidates.map(c => ({
      candidate: c,
      score: this.calculateScore(c)
    }));

    scored.sort((a, b) => b.score - a.score);
    return scored[0].candidate.agent;
  }
}
