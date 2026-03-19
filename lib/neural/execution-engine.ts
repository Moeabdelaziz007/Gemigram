import { handleNeuralTool } from "../tools/neural-handlers";
import { runSovereignReasoning } from "../gemini";
import { ToolResult } from "../types/live-api";

export interface ExecutionStep {
  toolId: string;
  args: Record<string, unknown>;
  result?: ToolResult;
}

/**
 * The Spinal Cord of GemigramOS Agents.
 * Orchestrates multiple tool calls to achieve complex objectives.
 */
export class ExecutionEngine {
  /**
   * Deconstructs a complex request into a sequence of steps and executes them.
   */
  static async executeComplexTask(goal: string): Promise<ExecutionStep[]> {
    const steps: ExecutionStep[] = [];
    let currentContext = goal;

    console.log(`[ExecutionEngine] Intent: ${goal}`);

    // Initial Decomposition (Up to 3 steps for safety/latency)
    for (let i = 0; i < 3; i++) {
        const planPrompt = `
            Task Goal: ${goal}
            Current Progress: ${JSON.stringify(steps)}
            
            Determine the NEXT logical tool call needed.
            AVAILABLE TOOLS: browse_url, create_agent, store_memory, search_memory, workspace_gmail, workspace_calendar, workspace_drive.
            
            Output ONLY a JSON object: { "toolId": "string", "args": {}, "done": boolean }
        `;

        try {
          const planRaw = await runSovereignReasoning(currentContext, planPrompt);
          const plan = JSON.parse(planRaw);

          if (plan.done || !plan.toolId) break;

          const result = await handleNeuralTool(plan.toolId, plan.args);
          steps.push({ ...plan, result });

          // Update context for next step
          currentContext += `\nStep ${i+1} Result: ${JSON.stringify(result)}`;
        } catch (error) {
          console.error('[ExecutionEngine] Step Failure:', error);
          break;
        }
    }

    return steps;
  }
}
