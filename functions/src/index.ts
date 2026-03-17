import { onRequest } from "firebase-functions/v2/https";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

/**
 * 🛰️ GWS Bridge (Neural Connectivity Layer)
 * 
 * This function acts as the sovereign execution environment for workspace tasks.
 * It translates JSON intents into production-grade `@googleworkspace/cli` calls.
 */
export const executeAgentTool = onRequest({ timeoutSeconds: 60, memory: "256MiB" }, async (req, res) => {
  // CORS Support for Firebase Hosting
  res.set('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', 'POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(204).send('');
    return;
  }

  const { toolId, action, params, persona } = req.body;
  
  if (!toolId) {
    res.status(400).json({ status: "error", message: "Missing toolId substrate." });
    return;
  }

  console.log(`[GWS-Bridge] Persona: ${persona || 'Default'} | Executing: ${toolId} ${action}`);

  // 1. Build Command
  let baseCmd = "gws";
  let serviceName = toolId.replace('workspace_', ''); // e.g., 'workspace_gmail' -> 'gmail'
  
  // 2. Handle GWS Helper + commands vs Discovery methods
  let finalCommand = `${baseCmd} ${serviceName} ${action}`;

  // 3. Inject Parameters
  if (params && typeof params === 'object') {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        // Sanitize shell input
        const sanitizedValue = String(value).replace(/"/g, '\\"');
        finalCommand += ` --${key} "${sanitizedValue}"`;
      }
    });
  }

  // 4. Execution Loop
  try {
    const { stdout, stderr } = await execAsync(finalCommand);
    
    if (stderr && !stdout) {
      console.warn(`[GWS-Bridge] Stderr reported: ${stderr}`);
    }

    // Try to parse as JSON, fallback to raw string if requested
    try {
      const data = JSON.parse(stdout);
      res.json({ status: "success", toolId, action, data });
    } catch (e) {
      res.json({ status: "success", toolId, action, rawOutput: stdout });
    }

  } catch (error: any) {
    console.error(`[GWS-Bridge] Critical Failure:`, error);
    res.status(500).json({ 
      status: "error", 
      message: "Neural routing failed.",
      details: error.message 
    });
  }
});
