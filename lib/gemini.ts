/**
 * 🧬 Sovereign AI Bridge (Refactored)
 * Uses the Universal Neural Router for Multi-Model Intelligence.
 */

import { runNeuralIntelligence, runSimpleReasoning } from "./neural/client";

/**
 * Standard Reasoning Flow
 */
export const runSovereignReasoning = async (prompt: string, context?: string) => {
  return await runSimpleReasoning(prompt, context, "google");
};

export const generateText = runSovereignReasoning;

/**
 * Streaming Link for real-time agent output
 */
export const streamSovereignReasoning = async (prompt: string, onChunk: (chunk: string) => void) => {
  try {
    const text = await runSovereignReasoning(prompt);
    // Simulate streaming for UI compatibility
    const words = text.split(" ");
    for (const word of words) {
      onChunk(word + " ");
      await new Promise((resolve) => setTimeout(resolve, 20)); // Subtle micro-animation delay
    }
  } catch (error) {
    console.error("[Sovereign_Stream_Failure]:", error);
    throw error;
  }
};
