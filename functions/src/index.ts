import { onRequest } from "firebase-functions/v2/https";
import { onDocumentWritten } from "firebase-functions/v2/firestore";
import * as admin from "firebase-admin";
import { spawn } from "child_process";

if (!admin.apps.length) {
    admin.initializeApp();
}

export const syncAdminRole = onDocumentWritten("users/{userId}", async (event: any) => {
  const userId = event.params.userId;
  const snapshot = event.data;

  // If document was deleted, remove admin claim
  if (!snapshot || !snapshot.after || !snapshot.after.exists) {
    try {
      await admin.auth().setCustomUserClaims(userId, { admin: false });
    } catch (error) {
      console.error(`Error removing admin claim for ${userId}:`, error);
    }
    return;
  }

  const role = snapshot.after.data().role;
  const wasAdmin = snapshot.before && snapshot.before.exists ? snapshot.before.data().role === 'admin' : false;
  const isAdmin = role === 'admin';

  // Only update claims if the role actually changed to/from admin
  if (wasAdmin !== isAdmin) {
    try {
      await admin.auth().setCustomUserClaims(userId, { admin: isAdmin });
    } catch (error) {
      console.error(`Error updating custom claim for ${userId}:`, error);
    }
  }
});

/**
 * 🛰️ GWS Bridge (Neural Connectivity Layer)
 * 
 * This function acts as the sovereign execution environment for workspace tasks.
 * It translates JSON intents into production-grade `@googleworkspace/cli` calls.
 */
export const executeAgentTool = onRequest({ timeoutSeconds: 60, memory: "256MiB" }, async (req: any, res: any) => {
  // CORS Support for Firebase Hosting
  res.set('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', 'POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(204).send('');
    return;
  }

  // Verify Authentication BEFORE any processing
  const authHeader = req.headers?.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ status: "error", message: "Unauthorized. Missing Bearer token." });
    return;
  }

  const token = authHeader.split('Bearer ')[1];
  try {
    await admin.auth().verifyIdToken(token);
  } catch (error) {
    res.status(401).json({ status: "error", message: "Unauthorized. Invalid token." });
    return;
  }

  const { toolName, action, params } = req.body;
  
  if (!toolName) {
    res.status(400).json({ status: "error", message: "Missing toolName substrate." });
    return;
  }

  let args: string[] = [];
  switch (toolName) {
    case "workspace_email_manager":
      args = ['gmail', `+${action}`];
      break;
    case "workspace_calendar_manager":
      args = ['calendar', `+${action}`];
      break;
    case "workspace_tasks_manager":
      args = ['tasks', action];
      break;
    default:
      res.status(400).json({ status: "error", message: "Unknown toolName substrate." });
      return;
  }

  // 2. Inject Parameters safely
  if (params && typeof params === 'object') {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        args.push(`--${key}`, String(value));
      }
    });
  }

  // 4. Execution via spawn (Sovereign Safety)
  try {
    const child = spawn('gws', args);
    let stdoutArr: Buffer[] = [];
    let stderrArr: Buffer[] = [];

    child.stdout.on('data', (data: Buffer) => { stdoutArr.push(data); });
    child.stderr.on('data', (data: Buffer) => { stderrArr.push(data); });

    const exitCode = await new Promise((resolve, reject) => {
      child.on('close', resolve);
      child.on('error', reject);
    });

    const stdout = Buffer.concat(stdoutArr).toString().trim();
    const stderr = Buffer.concat(stderrArr).toString().trim();

    if (exitCode !== 0) {
      console.warn(`[GWS-Bridge] Command failed with exit code ${exitCode}. Stderr: ${stderr}`);
    }

    // Try to parse as JSON, fallback to raw string
    try {
      const data = JSON.parse(stdout);
      res.json({ status: "success", toolName, action, data });
    } catch {
      res.json({ status: "success", toolName, action, rawOutput: stdout || stderr });
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[GWS-Bridge] Critical Failure:`, errorMessage);
    res.status(500).json({ 
      status: "error", 
      message: "Neural routing failed.",
      details: errorMessage 
    });
  }
});
