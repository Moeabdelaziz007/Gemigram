import { NeuralRouter } from "./router";
import { NeuralMessage, NeuralOptions, NeuralResponse, NeuralProvider } from "./types";

const router = new NeuralRouter();

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
    // 🚀 Spark Plan Bypass: Execute locally on the Neural-Spine
    return await router.generate(provider, messages, options);
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
