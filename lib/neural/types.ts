/**
 * 🧬 Neural Router Types
 * Standardized interfaces for Multi-Model Intelligence Orchestration.
 */

export type NeuralProvider = "google" | "anthropic" | "deepseek" | "openai";

export interface NeuralMessage {
  role: "user" | "assistant" | "system";
  content: string;
  name?: string;
}

export interface NeuralOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  stopSequences?: string[];
  streaming?: boolean;
  userId?: string;
  agentId?: string;
  useRAG?: boolean;
}

export interface NeuralResponse {
  id: string;
  text: string;
  model: string;
  provider: NeuralProvider;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  latencyMs?: number;
}

export interface NeuralProviderConfig {
  apiKey: string;
  baseUrl?: string;
  organizationId?: string;
}
