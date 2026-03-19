import { auth } from "../../firebase";
import { fetchWithTimeout } from "../network/runtime";

/**
 * Unified Google Workspace Client for Agentic Execution.
 */
export class GoogleWorkspaceClient {
  private static GMAIL_API = "https://gmail.googleapis.com/gmail/v1/users/me";
  private static CALENDAR_API = "https://www.googleapis.com/calendar/v3";

  static async getAccessToken(): Promise<string | null> {
    const user = auth.currentUser as unknown as { accessToken?: string } | null;
    return user?.accessToken || null;
  }

  /**
   * Gmail: Search and read threads.
   */
  static async searchGmail(query: string): Promise<unknown> {
    const token = await this.getAccessToken();
    if (!token) throw new Error("Authentication required.");

    const response = await fetchWithTimeout(`${this.GMAIL_API}/messages?q=${encodeURIComponent(query)}&maxResults=5`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.json();
  }

  /**
   * Calendar: List events.
   */
  static async listEvents(): Promise<unknown> {
    const token = await this.getAccessToken();
    if (!token) throw new Error("Authentication required.");

    const response = await fetchWithTimeout(`${this.CALENDAR_API}/calendars/primary/events?maxResults=10`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.json();
  }

  /**
   * Calendar: Quick add event.
   */
  static async createQuickEvent(text: string): Promise<unknown> {
    const token = await this.getAccessToken();
    if (!token) throw new Error("Authentication required.");

    const response = await fetchWithTimeout(`${this.CALENDAR_API}/calendars/primary/events/quickAdd?text=${encodeURIComponent(text)}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.json();
  }
}
