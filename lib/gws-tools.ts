/**
 * Sovereign GWS Tool-Chain
 * Bridges AetherOS agents with the Google Workspace ecosystem.
 */

export interface GWSFile {
  id: string;
  name: string;
  mimeType: string;
}

export interface GWSMail {
  id: string;
  snippet: string;
  subject?: string;
}

export interface GWSEvent {
  id: string;
  summary: string;
  start: { dateTime?: string; date?: string };
}

/**
 * Fetch files from Google Drive
 */
export async function fetchDriveFiles(accessToken: string, limit = 5): Promise<GWSFile[]> {
  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files?pageSize=${limit}&fields=files(id,name,mimeType)`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!response.ok) throw new Error('Failed to fetch Drive files');
  const data = await response.json();
  return data.files || [];
}

/**
 * Fetch latest Gmail threads
 */
export async function fetchLatestMails(accessToken: string, limit = 5): Promise<GWSMail[]> {
  const response = await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=${limit}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!response.ok) throw new Error('Failed to fetch Gmail threads');
  const data = await response.json();
  
  // Real implementation would fetch snippets for each message ID
  return (data.messages || []).map((m: any) => ({ id: m.id, snippet: 'Email snippet placeholder...' }));
}

/**
 * Fetch upcoming Calendar events
 */
export async function fetchCalendarEvents(accessToken: string, limit = 5): Promise<GWSEvent[]> {
  const now = new Date().toISOString();
  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${now}&maxResults=${limit}&singleEvents=true&orderBy=startTime`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!response.ok) throw new Error('Failed to fetch Calendar events');
  const data = await response.json();
  return data.items || [];
}
