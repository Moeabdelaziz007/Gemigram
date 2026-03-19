import { GoogleGenerativeAI } from "@google/generative-ai";
import { MemoryFragment, VectorEngineParams } from "./types";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" });

/**
 * Normalizes a vector for cosine similarity
 */
export const normalize = (v: number[]): number[] => {
  const mag = Math.sqrt(v.reduce((sum, val) => sum + val * val, 0));
  return v.map((val) => val / (mag || 1));
};

/**
 * Calculates Cosine Similarity between two vectors
 */
export const cosineSimilarity = (v1: number[], v2: number[]): number => {
  return v1.reduce((sum, val, i) => sum + val * v2[i], 0);
};

/**
 * Generates an embedding for a given string
 */
export const generateEmbedding = async (text: string): Promise<number[]> => {
  const result = await embeddingModel.embedContent(text);
  return result.embedding.values;
};

/**
 * Ranks memories based on relevance to a query and time decay
 */
export const rankMemories = (
  queryEmbedding: number[],
  fragments: MemoryFragment[],
  params: VectorEngineParams = {}
): MemoryFragment[] => {
  const { topK = 5, minRelevance = 0.7, decayWeight = 0.1 } = params;
  const now = Date.now();

  return fragments
    .map((fragment) => {
      if (!fragment.embedding) return { ...fragment, relevanceScore: 0 };

      const similarity = cosineSimilarity(queryEmbedding, fragment.embedding);
      
      // Time Decay Logic: Score = Similarity * (1 / (1 + decayWeight * daysOld))
      const daysOld = (now - fragment.metadata.timestamp) / (1000 * 60 * 60 * 24);
      const recencyFactor = 1 / (1 + decayWeight * daysOld);
      
      const weightedScore = similarity * (0.8 + 0.2 * recencyFactor);

      return {
        ...fragment,
        relevanceScore: weightedScore,
      };
    })
    .filter((f) => (f.relevanceScore || 0) >= minRelevance)
    .sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0))
    .slice(0, topK);
};
