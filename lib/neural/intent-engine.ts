import { runSovereignReasoning } from "../gemini";

export interface IntentResult {
  toolId: string;
  action: string;
  params: Record<string, unknown>;
  confidence: number;
}

/**
 * Advanced NLU Engine
 * Leverages LLMs to classify complex user intents into actionable tools.
 */
export class IntentEngine {
  private static SYSTEM_PROMPT = `
    You are the Gemigram Intent Engine. Your job is to parse user voice input (which may be in English, Arabic, or other languages) and map it to a specific tool and action.
    
    AVAILABLE TOOLS:
    - workspace_gmail: { actions: ["+triage", "+search", "+send", "+read"] }
    - workspace_calendar: { actions: ["+agenda", "+create", "+search"] }
    - workspace_tasks: { actions: ["+list", "+create", "+complete"] }
    - workspace_drive: { actions: ["+search", "+read", "+upload"] }
    - store_memory: { actions: ["+store"] }
    - searchWeb: { actions: ["+search"] }
    - browse_url: { actions: ["+read"] }

    Output ONLY a JSON object:
    { "toolId": "string", "action": "string", "params": {}, "confidence": 0-1 }

    Maintain high-fidelity mapping even for complex Arabic phrasing (e.g., "رتب لي موعد ف جراند نايل تاور بكرة الساعة ٤ عصرًا").
  `;

  static async classify(input: string): Promise<IntentResult> {
    try {
      const response = await runSovereignReasoning(input, this.SYSTEM_PROMPT);
      const parsed = JSON.parse(response);
      return {
        toolId: parsed.toolId || "unknown",
        action: parsed.action || "+triage",
        params: parsed.params || {},
        confidence: parsed.confidence || 0.5
      };
    } catch (error) {
      console.error("[IntentEngine_Error]:", error);
      return { toolId: "unknown", action: "+triage", params: {}, confidence: 0 };
    }
  }
}
