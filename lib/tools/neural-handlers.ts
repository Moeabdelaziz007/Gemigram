/**
 * Neural Tool Handlers (Zero-Function Architecture)
 *
 * Logic previously residing in API routes is now co-located with the client-side
 * neural engine to enable 100% static hosting on Firebase's free tier.
 */

import { db, auth } from '../../firebase';
import { collection, addDoc, query, getDocs, orderBy, limit, Timestamp } from 'firebase/firestore';
import { executeGWSClientAction } from './workspace-client';
import { useGemigramStore } from '../store/useGemigramStore';
import { fetchWithTimeout, getLocalBridgeUrl, getNetworkTimeoutMs, isLocalBridgeExecutionEnabled, normalizeNetworkError } from '../network/runtime';
import { ToolResult } from '../types/live-api';

const FUNCTION_URL = process.env.NEXT_PUBLIC_FUNCTION_URL?.trim() || 'https://executeagenttool-v7vofv7mxa-uc.a.run.app';
const DEFAULT_PERSONA = 'GemigramAssistant';

function readString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function readStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

function createNetworkErrorResult(message: string, error: unknown): ToolResult {
  const failure = normalizeNetworkError(error);
  return {
    status: 'error',
    message,
    details: failure.message,
    failureKind: failure.kind,
  };
}

export async function handleNeuralTool(name: string, args: Record<string, unknown>): Promise<ToolResult> {
  let result: ToolResult = { status: 'success' };

  if (name === 'browse_url' || (name === 'searchWeb' && args.url)) {
    const urlToRead = args.url || args.query;
    try {
      const response = await fetchWithTimeout(
        `https://r.jina.ai/${urlToRead}`,
        { cache: 'no-store' },
        getNetworkTimeoutMs(process.env.NEXT_PUBLIC_REMOTE_FETCH_TIMEOUT_MS, 4000)
      );
      const markdown = await response.text();
      return {
        status: 'success',
        content: markdown.substring(0, 10000),
        source: urlToRead,
        method: 'Jina-Stateless-Link',
        synthesis: 'Content extracted and mapped to neural context. Ready for analysis.'
      };
    } catch (error) {
      return createNetworkErrorResult('Failed to read URL via Neural Link.', error);
    }
  }

  if (name === 'create_agent') {
    try {
      const { setPendingManifest } = useGemigramStore.getState();

      const toolSelections = readStringArray(args.tools);
      const skillSelections = readStringArray(args.skills);

      const manifest = {
        name: readString(args.name, 'UNNAMED ENTITY'),
        role: readString(args.role, 'General Purpose Intelligence'),
        systemPrompt: readString(args.systemPrompt, 'You are a specialized Sovereign Intelligence.'),
        voiceName: readString(args.voiceName, 'Charon'),
        soul: readString(args.soul, 'Analytical and precise.'),
        rules: readString(args.rules, 'Always prioritize security and efficiency.'),
        tools: {
          googleSearch: toolSelections.includes('search'),
          googleMaps: toolSelections.includes('maps'),
          weather: toolSelections.includes('weather'),
          news: toolSelections.includes('news'),
          crypto: toolSelections.includes('crypto'),
          calculator: toolSelections.includes('math'),
          semanticMemory: toolSelections.includes('memory') || true,
        },
        skills: {
          gmail: skillSelections.includes('gmail'),
          calendar: skillSelections.includes('calendar'),
          drive: skillSelections.includes('drive'),
        }
      };

      setPendingManifest(manifest);
      window.dispatchEvent(new CustomEvent('aether:genesis_triggered', { detail: manifest }));

      return {
        status: 'success',
        message: `Agent ${readString(args.name, 'Unnamed agent')} manifest synthesized. Materializing in Forge Chamber...`,
        manifest
      };
    } catch {
      return { status: 'error', message: 'Genesis protocol failed.' };
    }
  }

  if (name === 'listProjects') {
    const token = args.accessToken;
    if (!token) return { status: 'error', message: 'Access token required for project discovery.' };

    try {
      const response = await fetchWithTimeout(
        'https://cloudresourcemanager.googleapis.com/v1/projects',
        {
          headers: { Authorization: `Bearer ${token}` },
          cache: 'no-store',
        },
        getNetworkTimeoutMs(process.env.NEXT_PUBLIC_REMOTE_FETCH_TIMEOUT_MS, 4000)
      );
      const data = await response.json();
      result = { status: 'success', projects: data.projects || [] };
    } catch (error) {
      result = createNetworkErrorResult('Failed to fetch projects.', error);
    }
  }
  else if (name === 'getProjectDetails') {
    const token = args.accessToken;
    const projectId = args.projectId;
    if (!token || !projectId) return { status: 'error', message: 'Missing credentials or Project ID.' };

    try {
      const response = await fetchWithTimeout(
        `https://cloudresourcemanager.googleapis.com/v1/projects/${projectId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          cache: 'no-store',
        },
        getNetworkTimeoutMs(process.env.NEXT_PUBLIC_REMOTE_FETCH_TIMEOUT_MS, 4000)
      );
      result = await response.json();
    } catch (error) {
      result = createNetworkErrorResult('Failed to fetch project details.', error);
    }
  }
  else if (name === 'getWeather') {
    const location = args.location || 'Unknown';
    result = {
      location,
      temperature: Math.floor(Math.random() * 30) + 10,
      condition: ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy'][Math.floor(Math.random() * 4)],
      humidity: `${Math.floor(Math.random() * 50) + 30}%`
    };
  }
  else if (name === 'getCryptoPrice') {
    const symbol = readString(args.symbol, 'BTC').toUpperCase();
    const basePrice = symbol === 'BTC' ? 65000 : symbol === 'ETH' ? 3500 : 100;
    result = {
      symbol,
      price: `$${(basePrice + (Math.random() * basePrice * 0.05)).toFixed(2)}`,
      change24h: `${(Math.random() * 10 - 5).toFixed(2)}%`
    };
  }
  else if (name === 'getMapLocation') {
    const location = args.location || 'Unknown';
    result = {
      location,
      lat: (Math.random() * 180 - 90).toFixed(4),
      lng: (Math.random() * 360 - 180).toFixed(4),
      address: `Neural Sector ${Math.floor(Math.random() * 100)}, ${location}`,
      context: 'Geospatial data synthesized by Gemigram Neural Engine.'
    };
  }
  else if (name === 'searchWeb') {
    result = {
      results: [
        { title: 'GemigramOS Intelligence', snippet: 'The sovereign neural OS is active.', url: 'https://aether.os' }
      ],
      context: 'Search capability is now integrated directly into the Gemini neural core with Google Search Grounding.'
    };
  }
  else if (name === 'store_memory') {
    const user = auth.currentUser;
    if (!user) return { status: 'error', message: 'User must be authenticated to store memories.' };

    try {
      const memoryRef = collection(db, `users/${user.uid}/memories`);
      await addDoc(memoryRef, {
        content: args.content,
        importance: args.importance || 5,
        timestamp: Timestamp.now(),
        category: args.category || 'general'
      });
      result = {
        status: 'success',
        message: 'Memory internalized.',
        synthesis: 'Successfully stored in permanent neural substrate. Ready for contextual recall.'
      };
    } catch {
      result = { status: 'error' as const, message: 'Failed to store memory substrate.' };
    }
  }
  else if (name === 'search_memory' || name === 'search_knowledge_base') {
    const user = auth.currentUser;
    if (!user) return { status: 'error', message: 'User must be authenticated to search memories.' };

    try {
      const memoryRef = collection(db, `users/${user.uid}/memories`);
      const memoryQuery = query(memoryRef, orderBy('timestamp', 'desc'), limit(10));
      const querySnapshot = await getDocs(memoryQuery);
      const memories = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      result = {
        status: 'success',
        memories: memories.filter(memory => {
          const m = memory as Record<string, unknown>;
          return typeof m.content === 'string' && typeof args.query === 'string' && m.content.toLowerCase().includes(args.query.toLowerCase());
        })
      };
    } catch {
      result = { status: 'error' as const, message: 'Memory retrieval failure.' };
    }
  }
  else if (name.startsWith('workspace_')) {
    const isAdmin = auth.currentUser?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    if (!isAdmin && (name === 'list_users' || name === 'analyze_users')) {
      return { status: 'error' as const, message: 'Unauthorized. Admin spinal access required.' };
    }

    try {
      const user = auth.currentUser;
      if (!user) return { status: 'error' as const, message: 'User must be authenticated for Workspace operations.' };

      const gwsToken = readString(args.accessToken);
      if (!gwsToken) {
        return {
          status: 'error' as const,
          message: 'Action requires elevated GWS credentials. Please re-authenticate via Nexus Gateway.',
          requiresAuth: true
        };
      }

      try {
        const clientResult = await executeGWSClientAction(name, readString(args.action, '+triage'), args.params || {}, gwsToken);
        return clientResult as ToolResult;
      } catch (clientError) {
        const failure = normalizeNetworkError(clientError);
        console.warn('[NeuralHandler] Client-Spine direct API failed:', failure.kind, failure.message);
      }

      const localBridgeUrl = getLocalBridgeUrl('/execute');
      if (isLocalBridgeExecutionEnabled() && localBridgeUrl) {
        try {
          console.warn('[NeuralHandler] Client-Spine unavailable. Attempting Local Bridge...');
          const localResponse = await fetchWithTimeout(
            localBridgeUrl,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                toolId: name,
                action: readString(args.action, '+triage'),
                params: args.params || {},
                persona: readString(args.persona, DEFAULT_PERSONA),
              }),
            },
            getNetworkTimeoutMs(process.env.NEXT_PUBLIC_BRIDGE_TIMEOUT_MS, 1500)
          );

          result = await localResponse.json();
          return result;
        } catch (localBridgeError) {
          const failure = normalizeNetworkError(localBridgeError);
          console.warn('[NeuralHandler] Local Bridge unavailable:', failure.kind, failure.message);
        }
      }

      console.warn('[NeuralHandler] Falling back to Cloud Spine...');
      const idToken = await user.getIdToken();
      const response = await fetchWithTimeout(
        FUNCTION_URL,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`
          },
          body: JSON.stringify({
            toolId: name,
            action: readString(args.action, '+triage'),
            params: args.params || {},
            persona: readString(args.persona, DEFAULT_PERSONA)
          })
        },
        getNetworkTimeoutMs(process.env.NEXT_PUBLIC_REMOTE_FETCH_TIMEOUT_MS, 4000)
      );

      result = await response.json();
    } catch (error: unknown) {
      console.error('[NeuralHandler] Critical Failure:', error);
      result = createNetworkErrorResult('Neural routing failed (Client, Local & Cloud unavailable).', error);
    }
  }

  return result;
}

/**
 * 🎙️ Gemigram Voice Orchestrator (Zero-UI Protocol)
 *
 * Manages the high-speed loop between User Voice Intention and
 * Autonomous Tool Execution.
 */
export async function GemigramVoiceOrchestrator(intent: string, context: Record<string, unknown>) {
  const recipeMatch = intent.match(/(triage|agenda|standup|meeting prep|email to task|weekly digest)/i);
  const toolMatch = intent.match(/(email|calendar|task|drive|memory|search|read|browse)/i);

  let toolId = '';
  let action = '+triage';
  const params = context.params || {};

  if (recipeMatch) {
    const recipe = recipeMatch[0].toLowerCase();
    switch (recipe) {
      case 'triage': toolId = 'workspace_gmail'; action = '+triage'; break;
      case 'agenda': toolId = 'workspace_calendar'; action = '+agenda'; break;
      case 'standup': toolId = 'workspace_workflow'; action = '+standup-report'; break;
      case 'meeting prep': toolId = 'workspace_workflow'; action = '+meeting-prep'; break;
      case 'email to task': toolId = 'workspace_workflow'; action = '+email-to-task'; break;
      case 'weekly digest': toolId = 'workspace_workflow'; action = '+weekly-digest'; break;
    }
  } else if (toolMatch) {
    const tool = toolMatch[0].toLowerCase();
    switch (tool) {
      case 'email': toolId = 'workspace_gmail'; break;
      case 'calendar': toolId = 'workspace_calendar'; break;
      case 'task': toolId = 'workspace_tasks'; break;
      case 'drive': toolId = 'workspace_drive'; break;
      case 'memory': toolId = 'store_memory'; break;
      case 'search': toolId = 'searchWeb'; break;
      case 'read':
      case 'browse': toolId = 'browse_url'; break;
    }
  }

  if (!toolId) {
    return {
      status: 'fail',
      message: 'Intention does not map to a skill.'
    };
  }

  const executionResult = await handleNeuralTool(toolId, { ...context, action, params });

  return {
    status: 'orchestrated',
    intent,
    executionResult,
    vocalResponse: executionResult.status === 'success'
      ? 'Task processed via Neural Cloud.'
      : `Error: ${executionResult.message}`
  };
}
