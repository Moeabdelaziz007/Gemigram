import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Sovereign AI Bridge
 * Direct client-side integration with Google Gemini via official SDK.
 */

const getApiKey = () => {
  const key = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!key) {
    console.warn("[Sovereign_Link]: NEXT_PUBLIC_GEMINI_API_KEY is missing. Neural bridge downgraded to local-only simulations.");
  }
  return key || "";
};

const genAI = new GoogleGenerativeAI(getApiKey());

export const getGeminiModel = (modelName: string = "gemini-2.0-flash-exp") => {
  return genAI.getGenerativeModel({ model: modelName });
};

export const runSovereignReasoning = async (prompt: string, context?: string) => {
  try {
    const model = getGeminiModel();
    const fullPrompt = context ? `Context: ${context}\n\nTask: ${prompt}` : prompt;
    
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("[Sovereign_Link_Failure]:", error);
    throw error;
  }
};

export const generateText = runSovereignReasoning;

/**
 * Streaming Link for real-time agent output
 */
export const streamSovereignReasoning = async (prompt: string, onChunk: (chunk: string) => void) => {
  try {
    const model = getGeminiModel();
    const result = await model.generateContentStream(prompt);

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      onChunk(chunkText);
    }
  } catch (error) {
    console.error("[Sovereign_Stream_Failure]:", error);
    throw error;
  }
};
