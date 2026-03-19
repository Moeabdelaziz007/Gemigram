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

interface GmailMessage {
  id: string;
  snippet: string;
  payload?: {
    headers?: Array<{ name: string; value: string }>;
  };
}

/**
 * Fetch latest Gmail threads with real snippets
 */
export async function fetchLatestMails(accessToken: string, limit = 5): Promise<GWSMail[]> {
  const listResponse = await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=${limit}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!listResponse.ok) throw new Error('Failed to fetch Gmail list');
  const listData = await listResponse.json();
  const messages = (listData.messages || []) as Array<{ id: string }>;

  // Fetch full details for each message to get the snippet and subject
  const fullMessages = await Promise.all(
    messages.map(async (m) => {
      const msgRes = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${m.id}?format=minimal`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      if (!msgRes.ok) return null;
      return (await msgRes.json()) as GmailMessage;
    })
  );

  return (fullMessages.filter((m) => m !== null) as GmailMessage[])
    .map((m) => ({
      id: m.id,
      snippet: m.snippet,
      subject: m.payload?.headers?.find((h: any) => h.name === 'Subject')?.value || 'No Subject',
    }));
}

interface CalendarEvent {
  id: string;
  summary?: string;
  start?: { dateTime?: string; date?: string };
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

  if (!response.ok) {
    const errorData = await response.json();
    console.warn('Calendar Fetch Error:', errorData);
    throw new Error('Failed to fetch Calendar events');
  }
  
  const data = await response.json();
  const items = (data.items || []) as CalendarEvent[];
  
  return items.map((ev) => ({
    id: ev.id,
    summary: ev.summary || 'No Title',
    start: ev.start || {},
  }));
}
