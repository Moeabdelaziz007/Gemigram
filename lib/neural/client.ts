import { NeuralMessage, NeuralOptions, NeuralResponse, NeuralProvider } from "./types";

/**
 * 🧬 Neural Client Bridge
 * Standardized client-side interface for Multi-Model Intelligence.
 */

export const runNeuralIntelligence = async (
  provider: NeuralProvider,
  messages: NeuralMessage[],
  options: NeuralOptions = {}
): Promise<NeuralResponse> => {
  try {
    const response = await fetch("/api/neural/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ provider, messages, options }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Neural link communication failure.");
    }

    return await response.json();
  } catch (error) {
    console.error(`[Neural_Client_Failure] [${provider}]:`, error);
    throw error;
  }
};

/**
 * Legacy Compatibility: Simple Prompt reasoning
 */
export const runSimpleReasoning = async (
  prompt: string,
  context?: string,
  provider: NeuralProvider = "google"
) => {
  const messages: NeuralMessage[] = [];
  if (context) {
    messages.push({ role: "system", content: `Context: ${context}` });
  }
  messages.push({ role: "user", content: prompt });

  const result = await runNeuralIntelligence(provider, messages);
  return result.text;
};
