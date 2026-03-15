
/**
 * Neural Tool Handlers (Zero-Function Architecture)
 * 
 * Logic previously residing in API routes is now co-located with the client-side
 * neural engine to enable 100% static hosting on Firebase's free tier.
 */

import { db, auth, googleProvider } from '../../firebase';
import { collection, addDoc, query, where, getDocs, orderBy, limit, Timestamp } from 'firebase/firestore';
import { executeGWSClientAction } from './workspace-client';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

export async function handleNeuralTool(name: string, args: any) {
  console.log(`[NeuralHandler] Executing: ${name}`, args);

  const FUNCTION_URL = "https://executeagenttool-v7vofv7mxa-uc.a.run.app"; 
  const LOCAL_BRIDGE_URL = "http://localhost:9999/execute"; // For zero-cost local execution

  let result: any = { status: "success" };

  // 🌐 Stateless Web Navigation (Jina Reader)
  if (name === 'browse_url' || (name === 'searchWeb' && args.url)) {
    const urlToRead = args.url || args.query;
    console.log(`[NeuralHandler] Stateless Browsing: ${urlToRead}`);
    try {
      const response = await fetch(`https://r.jina.ai/${urlToRead}`);
      const markdown = await response.text();
      return { 
        status: "success", 
        content: markdown.substring(0, 10000), // Cap for context window
        source: urlToRead,
        method: "Jina-Stateless-Link"
      };
    } catch (err) {
      return { status: "error", message: "Failed to read URL via Neural Link." };
    }
  }

  if (name === 'listProjects') {
    const token = args.accessToken;
    if (!token) return { status: "error", message: "Access token required for project discovery." };

    try {
      const response = await fetch('https://cloudresourcemanager.googleapis.com/v1/projects', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      result = { status: "success", projects: data.projects || [] };
    } catch (err) {
      result = { status: "error", message: "Failed to fetch projects." };
    }
  }
  else if (name === 'getProjectDetails') {
    const token = args.accessToken;
    const projectId = args.projectId;
    if (!token || !projectId) return { status: "error", message: "Missing credentials or Project ID." };

    try {
      const response = await fetch(`https://cloudresourcemanager.googleapis.com/v1/projects/${projectId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      result = await response.json();
    } catch (err) {
      result = { status: "error", message: "Failed to fetch project details." };
    }
  }
  else if (name === 'getWeather') {
    const location = args.location || 'Unknown';
    result = {
      location,
      temperature: Math.floor(Math.random() * 30) + 10,
      condition: ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy'][Math.floor(Math.random() * 4)],
      humidity: Math.floor(Math.random() * 50) + 30 + '%'
    };
  } 
  else if (name === 'getCryptoPrice') {
    const symbol = (args.symbol || 'BTC').toUpperCase();
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
      context: "Geospatial data synthesized by Aether Neural Engine."
    };
  }
  else if (name === 'searchWeb') {
    result = {
      results: [
        { title: "AetherOS Intelligence", snippet: "The sovereign neural OS is active.", url: "https://aether.os" }
      ],
      context: "Search capability is now integrated directly into the Gemini neural core with Google Search Grounding."
    };
  }
  else if (name === 'store_memory') {
    const user = auth.currentUser;
    if (!user) return { status: "error", message: "User must be authenticated to store memories." };
    
    try {
      const memoryRef = collection(db, `users/${user.uid}/memories`);
      await addDoc(memoryRef, {
        content: args.content,
        importance: args.importance || 5,
        timestamp: Timestamp.now(),
        category: args.category || 'general'
      });
      result = { status: "success", message: "Memory internalized." };
    } catch (err) {
      result = { status: "error", message: "Failed to store memory substrate." };
    }
  }
  else if (name === 'search_memory' || name === 'search_knowledge_base') {
    const user = auth.currentUser;
    if (!user) return { status: "error", message: "User must be authenticated to search memories." };

    try {
      const memoryRef = collection(db, `users/${user.uid}/memories`);
      // Simpified search for static substrate version: get last 10 relevant memories
      const q = query(memoryRef, orderBy("timestamp", "desc"), limit(10));
      const querySnapshot = await getDocs(q);
      const memories = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      result = { 
        status: "success", 
        memories: memories.filter(m => 
          (m as any).content.toLowerCase().includes(args.query.toLowerCase())
        )
      };
    } catch (err) {
      result = { status: "error", message: "Memory retrieval failure." };
    }
  }
  else if (name.startsWith('workspace_')) {
    const isAdmin = auth.currentUser?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    if (!isAdmin && (name === 'list_users' || name === 'analyze_users')) {
      return { status: "error", message: "Unauthorized. Admin spinal access required." };
    }
    
    return { 
      status: "simulation", 
      message: "Neural cloud linked. Workspace operations require Blaze plan for full cloud orchestration.",
      data: `Simulated ${name}` 
    };
  }

    // 🛡️ MOBILE-FIRST PROTOCOL: Attempt Direct Client-Side Execution
    try {
      console.log(`[NeuralHandler] Attempting Client-Spine Execution for ${name}...`);
      
      // We need a fresh token with GWS scopes if not provided
      let gwsToken = args.accessToken;
      if (!gwsToken) {
        // Fallback to scoped popup if token is missing
        const gwsResult = await signInWithPopup(auth, googleProvider);
        const credential = GoogleAuthProvider.credentialFromResult(gwsResult);
        gwsToken = credential?.accessToken;
      }

      if (gwsToken) {
        const clientResult = await executeGWSClientAction(name, args.action || '+triage', args.params || {}, gwsToken);
        console.log("[NeuralHandler] Client-Spine Execution Successful.");
        return clientResult;
      }

      // ☁️ Local/Cloud fallback if client execution is impossible (Legacy Support)
      console.warn("[NeuralHandler] Client-Spine unavailable. Attempting Local Bridge...");
      const localResponse = await fetch(LOCAL_BRIDGE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolId: name,
          action: args.action || '+triage',
          params: args.params || {},
          persona: args.persona || 'AetherAssistant'
        })
      }).catch(() => null); // Silent fail if local bridge is down

      if (localResponse && localResponse.ok) {
        result = await localResponse.json();
        console.log("[NeuralHandler] Local-Spine Execution Successful.");
        return result;
      }

      console.warn("[NeuralHandler] Local Bridge unavailable. Accessing Cloud Spine...");
      const idToken = await user.getIdToken();
      const response = await fetch(FUNCTION_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({
          toolId: name,
          action: args.action || '+triage',
          params: args.params || {},
          persona: args.persona || 'AetherAssistant'
        })
      });

      result = await response.json();
    } catch (err: any) {
      console.error("[NeuralHandler] Critical Failure:", err);
      result = { 
        status: "error", 
        message: "Neural routing failed (Client, Local & Cloud unavailable).",
        details: err.message
      };
    }
  }

  return result;
}

/**
 * 🎙️ Aether Voice Orchestrator (Zero-UI Protocol)
 * 
 * Manages the high-speed loop between User Voice Intention and 
 * Autonomous Tool Execution.
 */
export async function AetherVoiceOrchestrator(intent: string, context: any) {
  console.log(`[AetherVoice] Orchestrating Intent: ${intent}`);

  // 1. Analyze Intention (Neural Route)
  // Matching against GWS Recipes and Helpers (+ commands)
  const recipeMatch = intent.match(/(triage|agenda|standup|meeting prep|email to task|weekly digest)/i);
  const toolMatch = intent.match(/(email|calendar|task|drive|memory|search|read|browse)/i);
  
  let toolId = "";
  let action = "+triage"; // Default helper
  let params = context.params || {};

  // 2. Map high-level intent to GWS Recipes
  if (recipeMatch) {
    const recipe = recipeMatch[0].toLowerCase();
    switch(recipe) {
      case 'triage': toolId = 'workspace_gmail'; action = '+triage'; break;
      case 'agenda': toolId = 'workspace_calendar'; action = '+agenda'; break;
      case 'standup': toolId = 'workspace_workflow'; action = '+standup-report'; break;
      case 'meeting prep': toolId = 'workspace_workflow'; action = '+meeting-prep'; break;
      case 'email to task': toolId = 'workspace_workflow'; action = '+email-to-task'; break;
      case 'weekly digest': toolId = 'workspace_workflow'; action = '+weekly-digest'; break;
    }
  } else if (toolMatch) {
    const tool = toolMatch[0].toLowerCase();
    switch(tool) {
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
      status: "fail",
      message: "Intention does not map to a skill."
    };
  }

  // 3. Dispatch to Neural Handlers (The GWS Bridge)
  const executionResult = await handleNeuralTool(toolId, { ...context, action, params });

  // 4. Return Synthesis for Voice Generation
  return {
    status: "orchestrated",
    intent,
    executionResult,
    vocalResponse: executionResult.status === "success" 
      ? `Task processed via Neural Cloud.`
      : `Error: ${executionResult.message}`
  };
}
