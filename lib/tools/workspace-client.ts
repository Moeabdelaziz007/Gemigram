/**
 * 🛰️ GWS Sovereign Client (Stateless)
 * 
 * Direct client-side execution for Google Workspace tasks.
 * Bypasses backend requirements for $0 cost orchestration.
 */

export async function executeGWSClientAction(toolId: string, action: string, params: any, accessToken: string) {
  const service = toolId.replace('workspace_', '');

  const API_BASE = "https://www.googleapis.com";
  let url = "";
  let method = "GET";
  let body: any = null;

  try {
    switch (service) {
      case 'gmail':
        if (action.includes('list')) url = `${API_BASE}/gmail/v1/users/me/messages?maxResults=10`;
        if (action.includes('read')) url = `${API_BASE}/gmail/v1/users/me/messages/${params.id}`;
        break;
      case 'calendar':
        if (action.includes('list')) url = `${API_BASE}/calendar/v3/calendars/primary/events?maxResults=5`;
        break;
      case 'tasks':
        if (action.includes('list')) url = `${API_BASE}/tasks/v1/lists/@default/tasks`;
        break;
      default:
        throw new Error(`Service ${service} not supported in client-spine mode.`);
    }

    if (!url) {
        return { 
            status: "simulation", 
            message: `Action ${action} for ${service} is currently proxied through Cloud Spine.`,
            data: null 
        };
    }

    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });

    if (!response.ok) throw new Error(`GWS API Error: ${response.statusText}`);
    const data = await response.json();

    return { 
      status: "success", 
      toolId, 
      action, 
      data,
      method: "Client-Spine Direct"
    };

  } catch (err: any) {
    throw err; // Allow neural-handlers to catch and fallback
  }
}
