import { onRequest } from "firebase-functions/v2/https";
import { onDocumentWritten } from "firebase-functions/v2/firestore";
import * as admin from "firebase-admin";
import { exec } from "child_process";
import { promisify } from "util";

admin.initializeApp();

const execAsync = promisify(exec);

export const syncAdminRole = onDocumentWritten("users/{userId}", async (event) => {
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

export const executeAgentTool = onRequest(async (req, res) => {
  const { toolName, action, params } = req.body;

  // Map tool/action to gws command
  let command = "";
  switch (toolName) {
    case "workspace_email_manager":
      command = `gws gmail +${action}`;
      break;
    case "workspace_calendar_manager":
      command = `gws calendar +${action}`;
      break;
    case "workspace_tasks_manager":
      command = `gws tasks ${action}`;
      break;
    default:
      res.status(400).json({ error: "Unknown tool" });
      return;
  }

  // Add params (simplified for demo)
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      command += ` --${key} "${value}"`;
    });
  }

  try {
    const { stdout } = await execAsync(command);
    res.json(JSON.parse(stdout));
  } catch (error) {
    res.status(500).json({ error: "Execution failed", details: error });
  }
});
