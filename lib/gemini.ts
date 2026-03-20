/**
 * 🧬 Sovereign AI Bridge (Refactored)
 * Uses the Universal Neural Router for Multi-Model Intelligence.
 */

import { runSimpleReasoning, runNeuralIntelligence } from "./neural/client";
import { useGemigramStore } from "./store/useGemigramStore";

/**
 * Standard Reasoning Flow
 */
export const runSovereignReasoning = async (
  prompt: string,
  context?: string,
  options: { userId?: string; agentId?: string; useRAG?: boolean } = {}
) => {
  const provider = useGemigramStore.getState().activeProvider;
  
  if (options.useRAG && options.userId && options.agentId) {
    const messages = [];
    if (context) messages.push({ role: "system" as const, content: context });
    messages.push({ role: "user" as const, content: prompt });
    
    const result = await runNeuralIntelligence(
      provider,
      messages,
      options
    );
    return result.text;
  }

  return await runSimpleReasoning(prompt, context, provider);
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
