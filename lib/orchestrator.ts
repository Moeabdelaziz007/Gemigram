/**
 * AetherOS Free Tier Orchestrator
 * Ensures all AI inference routes through $0-cost Gemini Flash models.
 */

import { generateText } from './gemini';

export type TaskPriority = 'low' | 'medium' | 'high';

export interface OrchestratorOptions {
  priority?: TaskPriority;
  multimodal?: boolean;
}

/**
 * Routes a request to the optimal Free-Tier model.
 */
export async function runSovereignInference(prompt: string, options: OrchestratorOptions = {}) {
  // Always default to Flash 2.0 for speed and $0 cost
  const model = options.multimodal ? 'gemini-1.5-flash' : 'gemini-2.0-flash';
  
  console.log(`[Orchestrator]: Routing task to ${model} (Tier: Free)`);
  
  try {
    return await generateText(prompt, model);
  } catch (error) {
    console.error(`[Orchestrator_Error]: Inference failed on ${model}`, error);
    throw error;
  }
}

/**
 * Proactive Intelligence Loop (Stub)
 * Periodically checks workspace state and suggests next steps.
 */
export async function runProactiveLoop(context: string) {
  const prompt = `Based on this workspace context, suggest 3 proactive actions: ${context}`;
  return await runSovereignInference(prompt, { priority: 'low' });
}
