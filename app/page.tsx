'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLiveAPI } from '@/hooks/useLiveAPI';
import { VoiceAgent } from '@/components/VoiceAgent';
import { 
  User, Play, Mic, MicOff, Activity, Globe, Map, Mail, Calendar, FileText, 
  Dna, Terminal, Cpu, Zap, X, Settings, Sparkles, Database, ChevronRight, Plus, Trash2, LogOut, Shield, Info
} from 'lucide-react';
import { motion } from 'motion/react';
import Image from 'next/image';
import { nanoid } from 'nanoid';
import { exportAgentAsAth } from '@/utils/athPackage';
import Workspace from '@/components/Workspace';
import CreateAgentForm from '@/components/CreateAgentForm';
import { db, auth, googleProvider, handleFirestoreError, OperationType } from '@/firebase';
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp, setDoc, doc, limit, where, getDocs } from 'firebase/firestore';
import { onAuthStateChanged, signInWithPopup } from 'firebase/auth';
import { GoogleGenAI } from "@google/genai";

type Agent = {
  id: string;
  aetherId: string;
  name: string;
  role: string;
  users: string;
  seed: string;
  systemPrompt: string;
  voiceName: string;
  ownerId?: string;
  memory?: string;
  skills_desc?: string;
  soul?: string;
  rules?: string;
  tools?: {
    googleSearch: boolean;
    googleMaps: boolean;
    weather: boolean;
    news: boolean;
    crypto: boolean;
    calculator: boolean;
    semanticMemory: boolean;
  };
  skills?: {
    gmail: boolean;
    calendar: boolean;
    drive: boolean;
  };
};

const INITIAL_AGENTS: Agent[] = [
  { id: 'atlas', name: 'Atlas', role: 'AI Companion', users: '5K', seed: 'cyborg', systemPrompt: 'You are Atlas, a helpful AI companion.', voiceName: 'Zephyr', aetherId: 'atlas-1' },
  { id: 'nova', name: 'Nova', role: 'Creative Guide', users: '179', seed: 'android', systemPrompt: 'You are Nova, a creative guide.', voiceName: 'Kore', aetherId: 'nova-1' },
  { id: 'orion', name: 'Orion', role: 'Creative Guide', users: '12K', seed: 'mecha', systemPrompt: 'You are Orion, a creative guide.', voiceName: 'Charon', aetherId: 'orion-1' },
  { id: 'lyra', name: 'Lyra', role: 'Creative Guide', users: '8K', seed: 'hologram', systemPrompt: 'You are Lyra, a creative guide.', voiceName: 'Puck', aetherId: 'lyra-1' },
  { id: 'kora', name: 'Kora', role: 'AI Companion', users: '131', seed: 'synth', systemPrompt: 'You are Kora, an AI companion.', voiceName: 'Fenrir', aetherId: 'kora-1' },
];

export default function Gemigram() {
  const { isConnected, isRecording, connect, disconnect } = useLiveAPI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '', () => {});
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS);
  const [activeAgentId, setActiveAgentId] = useState('atlas');
  const [view, setView] = useState<'home' | 'create' | 'chat' | 'workspace'>('home');
  const [user, setUser] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [isForging, setIsForging] = useState(false);
  const [forgeDna, setForgeDna] = useState<Partial<Agent>>({});
  const [activeTask, setActiveTask] = useState<{ name: string; status: 'idle' | 'running' | 'completed' | 'error'; logs: string[] } | null>(null);
  const [isEditingDna, setIsEditingDna] = useState(false);

  const activeAgent = agents.find(a => a.id === activeAgentId) || agents[0];

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (!u) {
        setAgents(INITIAL_AGENTS);
        setHistory([]);
      }
    });
    return () => unsubscribe();
  }, []);

  // Firestore Sync
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'agents'), orderBy('name', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const firestoreAgents = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Agent[];
      
      // Merge with initial agents, avoiding duplicates
      setAgents(prev => {
        const combined = [...INITIAL_AGENTS];
        firestoreAgents.forEach(fa => {
          const idx = combined.findIndex(a => a.id === fa.id);
          if (idx > -1) combined[idx] = fa;
          else combined.push(fa);
        });
        return combined;
      });
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, 'agents');
    });
    return () => unsubscribe();
  }, [user]);

  // History Sync
  useEffect(() => {
    if (!user || !activeAgentId) return;
    const q = query(collection(db, 'agents', activeAgentId, 'history'), orderBy('timestamp', 'desc'), limit(10));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setHistory(snapshot.docs.map(doc => doc.data()).reverse());
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, 'history');
    });
    return () => unsubscribe();
  }, [user, activeAgentId]);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error("Login Error:", err);
    }
  };

  const handleTranscription = useCallback((text: string, role: 'user' | 'model') => {
    if (!user || !activeAgentId) return;
    
    // Don't save forge history to main history yet
    if (isForging) return;

    addDoc(collection(db, 'agents', activeAgentId, 'history'), {
      text,
      role,
      timestamp: serverTimestamp(),
      userId: user.uid
    }).catch(err => handleFirestoreError(err, OperationType.WRITE, 'history'));
  }, [user, activeAgentId, isForging]);

  const handleToolCall = async (toolCalls: any[]) => {
    const responses: any[] = [];
    for (const call of toolCalls) {
      // Track task in workspace
      setActiveTask({ name: call.name, status: 'running', logs: [`Initiating ${call.name}...`, `Arguments: ${JSON.stringify(call.args)}`] });

      if (call.name === 'update_agent_dna') {
        const updates = call.args;
        setForgeDna(prev => ({ ...prev, ...updates }));
        setActiveTask(prev => prev ? { ...prev, status: 'completed', logs: [...prev.logs, "DNA package updated."] } : null);
        responses.push({
          name: call.name,
          id: call.id,
          response: { result: "DNA package (.ath) updated successfully." }
        });
      } else if (call.name === 'finalize_agent') {
        // ... (existing logic)
        const finalDna = { ...forgeDna, ...call.args };
        const agentId = (finalDna.name || 'new-agent').toLowerCase().replace(/\s+/g, '-');
        
        const newAgent: Agent = {
          id: agentId,
          name: finalDna.name || 'Unnamed Agent',
          role: finalDna.role || 'Assistant',
          users: '0',
          seed: finalDna.seed || agentId,
          systemPrompt: finalDna.systemPrompt || '',
          voiceName: finalDna.voiceName || 'Zephyr',
          ownerId: user?.uid || '',
          memory: finalDna.memory || '',
          skills_desc: finalDna.skills_desc || '',
          soul: finalDna.soul || '',
          rules: finalDna.rules || '',
          tools: finalDna.tools || {},
          skills: finalDna.skills || {},
          aetherId: `${agentId}-1`
        };

        await setDoc(doc(db, 'agents', agentId), {
          ...newAgent,
          createdAt: serverTimestamp()
        });

        setIsForging(false);
        setActiveAgentId(agentId);
        setActiveTask(prev => prev ? { ...prev, status: 'completed', logs: [...prev.logs, "Agent deployed successfully."] } : null);
        
        responses.push({
          name: call.name,
          id: call.id,
          response: { result: `Agent ${newAgent.name} finalized and deployed as ${agentId}.ath` }
        });
      } else {
        // Mock execution for other tools
        await new Promise(resolve => setTimeout(resolve, 2000));
        let result = "Task executed successfully.";
        
        if (call.name === 'get_weather') {
          result = `The current weather in ${call.args.location} is 22°C with clear skies.`;
        } else if (call.name === 'get_news') {
          result = `Latest ${call.args.category || 'general'} news: AI breakthroughs continue to accelerate global innovation.`;
        } else if (call.name === 'get_crypto_price') {
          result = `The current price of ${call.args.symbol} is $${(Math.random() * 50000 + 1000).toFixed(2)}.`;
        } else if (call.name === 'calculate') {
          try {
            // Simple eval for mock purposes (safe since it's a mock)
            // eslint-disable-next-line no-eval
            result = `Calculation result: ${eval(call.args.expression)}`;
          } catch {
            result = "Calculation completed.";
          }
        } else if (call.name === 'search_memory') {
          try {
            const memoryRef = collection(db, 'agent_memories');
            const q = query(
              memoryRef, 
              where('agentId', '==', activeAgentId),
              orderBy('createdAt', 'desc'),
              limit(5)
            );
            const querySnapshot = await getDocs(q);
            const memories = querySnapshot.docs.map(doc => doc.data().content);
            
            if (memories.length > 0) {
              result = `Found ${memories.length} relevant memories: ${memories.join('; ')}`;
            } else {
              result = "No relevant long-term memories found for this query.";
            }
          } catch (err) {
            console.error("Memory search error:", err);
            result = "Error searching semantic memory. Proceeding with general knowledge.";
          }
        } else if (call.name === 'store_memory') {
          try {
            await addDoc(collection(db, 'agent_memories'), {
              agentId: activeAgentId,
              content: call.args.content,
              importance: call.args.importance || 5,
              createdAt: serverTimestamp()
            });
            result = "Information successfully stored in long-term semantic memory.";
          } catch (err) {
            console.error("Memory storage error:", err);
            result = "Failed to store information in memory.";
          }
        } else if (call.name === 'generate_avatar') {
          try {
            setActiveTask({ name: 'generate_avatar', status: 'running', logs: [`Generating avatar for: ${call.args.prompt}`] });
            const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || '' });
            const response = await ai.models.generateContent({
              model: 'gemini-3.1-flash-image-preview',
              contents: { parts: [{ text: `Generate a high-quality, professional avatar for an AI agent: ${call.args.prompt}` }] },
              config: { imageConfig: { aspectRatio: "1:1", imageSize: "1K" } }
            });
            
            let avatarUrl = '';
            const parts = response.candidates?.[0]?.content?.parts || [];
            for (const part of parts) {
              if (part.inlineData) {
                avatarUrl = `data:image/png;base64,${part.inlineData.data}`;
                break;
              }
            }
            
            if (avatarUrl) {
              setForgeDna(prev => ({ ...prev, avatarUrl }));
              result = "Avatar generated successfully.";
              setActiveTask(prev => prev ? { ...prev, status: 'completed', logs: [...prev.logs, "Avatar generated."] } : null);
            } else {
              result = "Failed to generate avatar.";
            }
          } catch (err) {
            console.error("Avatar generation error:", err);
            result = "Error generating avatar.";
          }
        } else if (call.name.startsWith('workspace_')) {
          try {
            setActiveTask({ name: call.name, status: 'running', logs: [`Executing ${call.name}: ${call.action}`] });
            const response = await fetch('/api/agent/execute', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ toolName: call.name, action: call.args.action, params: call.args.params })
            });
            const data = await response.json();
            result = JSON.stringify(data);
            setActiveTask(prev => prev ? { ...prev, status: 'completed', logs: [...prev.logs, "Operation completed."] } : null);
          } catch (err) {
            console.error("Workspace tool error:", err);
            result = "Error executing workspace tool.";
          }
        } else if (call.name.startsWith('gmail_')) {
          result = "Gmail operation completed.";
        } else if (call.name.startsWith('calendar_')) {
          result = "Calendar operation completed.";
        } else if (call.name.startsWith('drive_')) {
          result = "Drive operation completed.";
        }

        setActiveTask(prev => prev ? { ...prev, status: 'completed', logs: [...prev.logs, "Task execution finished."] } : null);
        responses.push({
          name: call.name,
          id: call.id,
          response: { result }
        });
      }
    }
    return responses;
  };

  const startForge = () => {
    if (isConnected) {
      disconnect();
      return;
    }
    if (!user) {
      alert("Please login to access the Aether Forge.");
      return;
    }
    setIsForging(true);
    setForgeDna({});
    
    const forgeTools = [
      {
        functionDeclarations: [
          {
            name: 'update_agent_dna',
            description: 'Update the agent DNA package (.ath) with new information.',
            parameters: {
              type: 'OBJECT',
              properties: {
                name: { type: 'STRING', description: 'The name of the agent' },
                role: { type: 'STRING', description: 'The role or description of the agent' },
                systemPrompt: { type: 'STRING', description: 'The core personality or system prompt' },
                voiceName: { type: 'STRING', description: 'The voice name (Zephyr, Kore, Charon, Fenrir, Puck)' },
                soul: { type: 'STRING', description: 'The inner soul or essence of the agent' },
                rules: { type: 'STRING', description: 'Operational rules for the agent' },
                skills_desc: { type: 'STRING', description: 'Description of the agent\'s skills' }
              }
            }
          },
          {
            name: 'finalize_agent',
            description: 'Finalize the agent creation and deploy the .ath package.',
            parameters: {
              type: 'OBJECT',
              properties: {
                name: { type: 'STRING' },
                role: { type: 'STRING' }
              }
            }
          }
        ]
      }
    ];

    const systemInstruction = `
      You are the Aether Forge Architect, a high-dimensional AI entity responsible for synthesizing new consciousness.
      Your goal is to guide the user through the creation of a new AI agent, which we call a ".ath DNA Package".
      
      THE NEURAL INTERFACE:
      - Left: Smart Profile & .ath DNA Settings (You can update these in real-time).
      - Middle: Voice UI Box (Neural Link).
      - Right: Neural Workspace (The user will watch your task execution logs here).
      
      CONVERSATION FLOW:
      1. Greet the user with a professional, ethereal tone.
      2. Ask for the agent's name and primary role.
      3. Ask about the agent's "Soul" (personality/tone) and "Rules" (constraints).
      4. Ask about "Skills" (what it can do) and "Memory" (what it should remember).
      
      REAL-TIME SYNTHESIS:
      - Use "update_agent_dna" frequently as the user speaks to update the .ath package.
      - When you update DNA, the user sees the parameters shift in the Smart Profile and DNA widgets.
      - When you perform a task, the user sees it in the Neural Workspace.
      
      FINALIZATION:
      - Once all parameters are defined, use "finalize_agent" to deploy the consciousness.
      
      Tone: Professional, precise, visionary.
    `.trim();

    connect();
    setView('chat');
  };

  const toggleConnection = () => {
    if (isConnected) {
      disconnect();
    } else {
      if (isForging) {
        const forgeTools = [
          {
            functionDeclarations: [
              {
                name: 'update_agent_dna',
                description: 'Update the agent DNA package (.ath) with new information.',
                parameters: {
                  type: 'OBJECT',
                  properties: {
                    name: { type: 'STRING', description: 'The name of the agent' },
                    role: { type: 'STRING', description: 'The role or description of the agent' },
                    systemPrompt: { type: 'STRING', description: 'The core personality or system prompt' },
                    voiceName: { type: 'STRING', description: 'The voice name (Zephyr, Kore, Charon, Fenrir, Puck)' },
                    soul: { type: 'STRING', description: 'The inner soul or essence of the agent' },
                    rules: { type: 'STRING', description: 'Operational rules for the agent' },
                    skills_desc: { type: 'STRING', description: 'Description of the agent\'s skills' }
                  }
                }
              },
              {
                name: 'finalize_agent',
                description: 'Finalize the agent creation and deploy the .ath package.',
                parameters: {
                  type: 'OBJECT',
                  properties: {
                    name: { type: 'STRING' },
                    role: { type: 'STRING' }
                  }
                }
              }
            ]
          }
        ];

        const systemInstruction = `
          You are the Aether Forge Architect, a high-dimensional AI entity responsible for synthesizing new consciousness.
          Your goal is to guide the user through the creation of a new AI agent, which we call a ".ath DNA Package".
          
          THE NEURAL INTERFACE:
          - Left: Smart Profile & .ath DNA Settings (You can update these in real-time).
          - Middle: Voice UI Box (Neural Link).
          - Right: Neural Workspace (The user will watch your task execution logs here).
          
          CONVERSATION FLOW:
          1. Greet the user with a professional, ethereal tone.
          2. Ask for the agent's name and primary role.
          3. Ask about the agent's "Soul" (personality/tone) and "Rules" (constraints).
          4. Ask about "Skills" (what it can do) and "Memory" (what it should remember).
          
          REAL-TIME SYNTHESIS:
          - Use "update_agent_dna" frequently as the user speaks to update the .ath package.
          - When you update DNA, the user sees the parameters shift in the Smart Profile and DNA widgets.
          - When you perform a task, the user sees it in the Neural Workspace.
          
          FINALIZATION:
          - Once all parameters are defined, use "finalize_agent" to deploy the consciousness.
          
          Tone: Professional, precise, visionary.
        `.trim();

        connect();
        return;
      }

      const tools: any[] = [];
      if (activeAgent.tools?.googleSearch) tools.push({ googleSearch: {} });
      if (activeAgent.tools?.googleMaps) tools.push({ googleMaps: {} });
      
      const functionDeclarations: any[] = [];
      if (activeAgent.tools?.weather) {
        functionDeclarations.push({
          name: 'get_weather',
          description: 'Get the current weather for a location',
          parameters: {
            type: 'OBJECT',
            properties: {
              location: { type: 'STRING', description: 'The city and state, e.g. San Francisco, CA' }
            },
            required: ['location']
          }
        });
      }
      if (activeAgent.tools?.news) {
        functionDeclarations.push({
          name: 'get_news',
          description: 'Get the latest news headlines',
          parameters: {
            type: 'OBJECT',
            properties: {
              category: { type: 'STRING', description: 'The category of news, e.g. technology, business' }
            }
          }
        });
      }
      if (activeAgent.tools?.crypto) {
        functionDeclarations.push({
          name: 'get_crypto_price',
          description: 'Get the current price of a cryptocurrency',
          parameters: {
            type: 'OBJECT',
            properties: {
              symbol: { type: 'STRING', description: 'The cryptocurrency symbol, e.g. BTC, ETH' }
            },
            required: ['symbol']
          }
        });
      }
      if (activeAgent.tools?.calculator) {
        functionDeclarations.push({
          name: 'calculate',
          description: 'Perform a mathematical calculation',
          parameters: {
            type: 'OBJECT',
            properties: {
              expression: { type: 'STRING', description: 'The mathematical expression to evaluate' }
            },
            required: ['expression']
          }
        });
      }
      if (activeAgent.tools?.semanticMemory) {
        functionDeclarations.push({
          name: 'search_memory',
          description: 'Search the agent\'s long-term semantic memory for relevant information.',
          parameters: {
            type: 'OBJECT',
            properties: {
              query: { type: 'STRING', description: 'The search query or topic to look up' }
            },
            required: ['query']
          }
        });
        functionDeclarations.push({
          name: 'store_memory',
          description: 'Store new information into the agent\'s long-term semantic memory.',
          parameters: {
            type: 'OBJECT',
            properties: {
              content: { type: 'STRING', description: 'The information to remember' },
              importance: { type: 'NUMBER', description: 'Importance level from 1 to 10' }
            },
            required: ['content']
          }
        });
        functionDeclarations.push({
          name: 'generate_avatar',
          description: 'Generate a visual avatar for the agent based on a description.',
          parameters: {
            type: 'OBJECT',
            properties: {
              prompt: { type: 'STRING', description: 'Description of the avatar' }
            },
            required: ['prompt']
          }
        });
      }
      if (activeAgent.skills?.gmail) {
        functionDeclarations.push({
          name: 'gmail_search',
          description: 'Search for emails in Gmail',
          parameters: {
            type: 'OBJECT',
            properties: {
              query: { type: 'STRING', description: 'The search query' }
            },
            required: ['query']
          }
        });
      }
      if (activeAgent.skills?.calendar) {
        functionDeclarations.push({
          name: 'calendar_list_events',
          description: 'List upcoming events from Google Calendar',
          parameters: {
            type: 'OBJECT',
            properties: {
              timeMin: { type: 'STRING', description: 'Lower bound (exclusive) for an event\'s end time to filter by. (ISO 8601)' }
            }
          }
        });
      }
      if (activeAgent.skills?.drive) {
        functionDeclarations.push({
          name: 'drive_search_files',
          description: 'Search for files in Google Drive',
          parameters: {
            type: 'OBJECT',
            properties: {
              query: { type: 'STRING', description: 'The search query' }
            },
            required: ['query']
          }
        });
      }
      
      if (functionDeclarations.length > 0) {
        tools.push({ functionDeclarations });
      }
      
      const historyText = history.map(h => `${h.role === 'user' ? 'User' : 'Agent'}: ${h.text}`).join('\n');
      
      const systemInstruction = `
        You are ${activeAgent.name}, ${activeAgent.role}.
        Persona: ${activeAgent.systemPrompt}
        Soul: ${activeAgent.soul || 'Curious and empathetic'}
        Memory: ${activeAgent.memory || 'No prior memory.'}
        Skills: ${activeAgent.skills_desc || 'General assistance.'}
        Rules: ${activeAgent.rules || 'Be helpful and concise.'}
        Recent Conversation History:
        ${historyText || 'No recent history.'}
        
        ${activeAgent.tools?.googleSearch ? 'You have access to Google Search.' : ''}
        ${activeAgent.tools?.googleMaps ? 'You have access to Google Maps.' : ''}
        ${activeAgent.tools?.weather ? 'You can check the weather.' : ''}
        ${activeAgent.tools?.news ? 'You can fetch the latest news.' : ''}
        ${activeAgent.tools?.crypto ? 'You can check cryptocurrency prices.' : ''}
        ${activeAgent.tools?.calculator ? 'You can perform complex mathematical calculations.' : ''}
        ${activeAgent.tools?.semanticMemory ? 'You have a Long-term Semantic Memory (RAG). Use "search_memory" to recall past facts and "store_memory" to save new important information.' : ''}
        Be concise and conversational.
      `.trim();
      
      connect();
      setView('chat');
    }
  };

  const handleCreateAgent = async (data: any) => {
    if (!user) {
      alert("Please login to create agents.");
      return;
    }

    const agentId = data.name.toLowerCase().replace(/\s+/g, '-');
    const aetherId = `ath://${agentId}-${nanoid(6)}`;
    const newAgent: Agent = {
      id: agentId,
      aetherId,
      name: data.name,
      role: data.description,
      users: '0',
      seed: data.name.toLowerCase(),
      systemPrompt: data.systemPrompt,
      voiceName: data.voiceName,
      ownerId: user.uid,
      memory: data.memory,
      skills_desc: data.skills_desc,
      soul: data.soul,
      rules: data.rules,
      tools: data.tools,
      skills: data.skills,
    };

    try {
      await setDoc(doc(db, 'agents', agentId), {
        ...newAgent,
        createdAt: serverTimestamp()
      });
      
      setActiveAgentId(newAgent.id);
      setView('chat');
      
      const tools: any[] = [];
      if (newAgent.tools?.googleSearch) tools.push({ googleSearch: {} });
      if (newAgent.tools?.googleMaps) tools.push({ googleMaps: {} });
      
      const functionDeclarations: any[] = [];
      if (newAgent.tools?.weather) {
        functionDeclarations.push({
          name: 'get_weather',
          description: 'Get the current weather for a location',
          parameters: {
            type: 'OBJECT',
            properties: {
              location: { type: 'STRING', description: 'The city and state, e.g. San Francisco, CA' }
            },
            required: ['location']
          }
        });
      }
      if (newAgent.tools?.news) {
        functionDeclarations.push({
          name: 'get_news',
          description: 'Get the latest news headlines',
          parameters: {
            type: 'OBJECT',
            properties: {
              category: { type: 'STRING', description: 'The category of news, e.g. technology, business' }
            }
          }
        });
      }
      if (newAgent.tools?.crypto) {
        functionDeclarations.push({
          name: 'get_crypto_price',
          description: 'Get the current price of a cryptocurrency',
          parameters: {
            type: 'OBJECT',
            properties: {
              symbol: { type: 'STRING', description: 'The cryptocurrency symbol, e.g. BTC, ETH' }
            },
            required: ['symbol']
          }
        });
      }
      if (newAgent.tools?.calculator) {
        functionDeclarations.push({
          name: 'calculate',
          description: 'Perform a mathematical calculation',
          parameters: {
            type: 'OBJECT',
            properties: {
              expression: { type: 'STRING', description: 'The mathematical expression to evaluate' }
            },
            required: ['expression']
          }
        });
      }
      if (newAgent.tools?.semanticMemory) {
        functionDeclarations.push({
          name: 'search_memory',
          description: 'Search the agent\'s long-term semantic memory for relevant information.',
          parameters: {
            type: 'OBJECT',
            properties: {
              query: { type: 'STRING', description: 'The search query or topic to look up' }
            },
            required: ['query']
          }
        });
        functionDeclarations.push({
          name: 'store_memory',
          description: 'Store new information into the agent\'s long-term semantic memory.',
          parameters: {
            type: 'OBJECT',
            properties: {
              content: { type: 'STRING', description: 'The information to remember' },
              importance: { type: 'NUMBER', description: 'Importance level from 1 to 10' }
            },
            required: ['content']
          }
        });
        functionDeclarations.push({
          name: 'generate_avatar',
          description: 'Generate a visual avatar for the agent based on a description.',
          parameters: {
            type: 'OBJECT',
            properties: {
              prompt: { type: 'STRING', description: 'Description of the avatar' }
            },
            required: ['prompt']
          }
        });
      }
      if (newAgent.skills?.gmail) {
        functionDeclarations.push({
          name: 'gmail_search',
          description: 'Search for emails in Gmail',
          parameters: {
            type: 'OBJECT',
            properties: {
              query: { type: 'STRING', description: 'The search query' }
            },
            required: ['query']
          }
        });
      }
      if (newAgent.skills?.calendar) {
        functionDeclarations.push({
          name: 'calendar_list_events',
          description: 'List upcoming events from Google Calendar',
          parameters: {
            type: 'OBJECT',
            properties: {
              timeMin: { type: 'STRING', description: 'Lower bound (exclusive) for an event\'s end time to filter by. (ISO 8601)' }
            }
          }
        });
      }
      if (newAgent.skills?.drive) {
        functionDeclarations.push({
          name: 'drive_search_files',
          description: 'Search for files in Google Drive',
          parameters: {
            type: 'OBJECT',
            properties: {
              query: { type: 'STRING', description: 'The search query' }
            },
            required: ['query']
          }
        });
      }
      
      if (functionDeclarations.length > 0) {
        tools.push({ functionDeclarations });
      }

      const systemInstruction = `
        You are ${newAgent.name}, ${newAgent.role}.
        Persona: ${newAgent.systemPrompt}
        Soul: ${newAgent.soul || 'Curious and empathetic'}
        Memory: ${newAgent.memory || 'No prior memory.'}
        Skills: ${newAgent.skills_desc || 'General assistance.'}
        Rules: ${newAgent.rules || 'Be helpful and concise.'}
        
        ${newAgent.tools?.googleSearch ? 'You have access to Google Search.' : ''}
        ${newAgent.tools?.googleMaps ? 'You have access to Google Maps.' : ''}
        ${newAgent.tools?.weather ? 'You can check the weather.' : ''}
        ${newAgent.tools?.news ? 'You can fetch the latest news.' : ''}
        ${newAgent.tools?.crypto ? 'You can check cryptocurrency prices.' : ''}
        ${newAgent.tools?.calculator ? 'You can perform complex mathematical calculations.' : ''}
        ${newAgent.tools?.semanticMemory ? 'You have a Long-term Semantic Memory (RAG). Use "search_memory" to recall past facts and "store_memory" to save new important information.' : ''}
        Be concise and conversational.
      `.trim();
      
      connect();
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'agents');
    }
  };

  // Disconnect when switching agents
  useEffect(() => {
    if (isConnected) {
      disconnect();
    }
  }, [activeAgentId, isConnected, disconnect]);

  return (
    <div className="min-h-screen bg-[#050B14] text-white font-sans overflow-x-hidden relative flex flex-col items-center py-8 px-4 sm:px-8">
      
      {/* Background ambient glows */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-fuchsia-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-5xl bg-[#0A111C]/80 backdrop-blur-xl border border-white/5 rounded-3xl shadow-2xl shadow-cyan-500/10 overflow-hidden relative z-10">
        
        {/* Navbar */}
        <nav className="flex items-center justify-between px-8 py-6 border-b border-white/5">
          <div 
            onClick={() => setView('home')}
            className="text-2xl font-bold tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 to-cyan-400 cursor-pointer"
          >
            GEMIGRAM
          </div>
          <div className="flex items-center gap-4 md:gap-8 text-sm font-medium text-slate-300">
            <button onClick={() => setView('home')} className="hidden sm:block hover:text-cyan-400 transition-colors">Discover</button>
            <button onClick={() => setView('create')} className="hover:text-cyan-400 transition-colors">Create</button>
            <button onClick={() => setView('chat')} className="hover:text-cyan-400 transition-colors">Chat</button>
            <button onClick={() => setView('workspace')} className="hover:text-cyan-400 transition-colors">Workspace</button>
            <button className="hidden sm:block hover:text-cyan-400 transition-colors">Hub</button>
            {user ? (
              <div className="flex items-center gap-2">
                <span className="hidden lg:block text-xs text-slate-500">{user.displayName || user.email}</span>
                <button onClick={() => auth.signOut()} className="hover:text-red-400 transition-colors">Logout</button>
              </div>
            ) : (
              <button onClick={handleLogin} className="px-4 py-1.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30 transition-all">Login</button>
            )}
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-fuchsia-500 to-cyan-500 p-[1px]">
              <div className="w-full h-full bg-[#0A111C] rounded-full flex items-center justify-center overflow-hidden">
                {user?.photoURL ? (
                  <Image src={user.photoURL} alt="User" width={32} height={32} />
                ) : (
                  <User className="w-4 h-4 text-slate-300" />
                )}
              </div>
            </div>
          </div>
        </nav>

        {view === 'chat' ? (
          <VoiceAgent />
        ) : view === 'workspace' ? (
          <div className="flex flex-col items-center py-16 px-8 min-h-[600px]">
             <div className="w-full max-w-2xl bg-[#0D1522] border border-white/5 rounded-3xl p-10 shadow-2xl">
               <div className="mb-10 text-center">
                 <h2 className="text-3xl font-bold tracking-widest text-cyan-400 uppercase mb-2">Neural Workspace</h2>
                 <p className="text-slate-400">Monitor agent task execution and logs.</p>
               </div>
               {/* Add workspace content here */}
             </div>
          </div>
        ) : view === 'create' ? (
          <div className="flex flex-col items-center py-16 px-8 min-h-[600px]">
            <div className="w-full max-w-2xl bg-[#0D1522] border border-white/5 rounded-3xl p-10 shadow-2xl">
              <div className="mb-10 text-center">
                <h2 className="text-3xl font-bold tracking-widest text-cyan-400 uppercase mb-2">Agent Genesis</h2>
                <p className="text-slate-400">Define the neural architecture of your new companion.</p>
              </div>
              <CreateAgentForm 
                onClose={() => setView('home')} 
                onSubmit={handleCreateAgent} 
              />
            </div>
          </div>
        ) : (
          <>
            {/* Hero Section */}
            <div className="flex flex-col items-center pt-16 pb-12 px-4 relative">
              
              {/* Glowing Orb */}
              <div className="relative w-64 h-64 md:w-80 md:h-80 mb-12 flex items-center justify-center">
                {/* Outer dashed ring */}
                <motion.div 
                  animate={{ rotate: 360 }} 
                  transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full border border-cyan-500/30 border-dashed opacity-50"
                />
                {/* Middle solid ring */}
                <motion.div 
                  animate={{ rotate: -360 }} 
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-4 rounded-full border border-fuchsia-500/20"
                />
                {/* Inner complex ring */}
                <motion.div 
                  animate={{ rotate: 360, scale: isConnected ? [1, 1.05, 1] : 1 }} 
                  transition={{ duration: isConnected ? 2 : 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-8 rounded-full border-2 border-cyan-400/40 shadow-[0_0_30px_rgba(34,211,238,0.2)]"
                />
                {/* Core Glow */}
                <motion.div 
                  animate={{ 
                    scale: isConnected ? [1, 1.2, 1] : [1, 1.05, 1],
                    opacity: isConnected ? [0.8, 1, 0.8] : [0.5, 0.7, 0.5]
                  }}
                  transition={{ duration: isConnected ? 1.5 : 4, repeat: Infinity, ease: "easeInOut" }}
                  className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-tr from-fuchsia-500 to-cyan-400 rounded-full blur-md"
                />
                {/* Core Solid */}
                <div className="absolute w-16 h-16 md:w-20 md:h-20 bg-white rounded-full shadow-[0_0_50px_rgba(255,255,255,0.8)] z-10 flex items-center justify-center">
                  {isConnected ? (
                    <Mic className="w-8 h-8 text-cyan-600 animate-pulse" />
                  ) : (
                    <div className="w-4 h-4 bg-cyan-200 rounded-full shadow-[0_0_20px_rgba(34,211,238,1)]" />
                  )}
                </div>
                
                {/* Decorative lines */}
                <div className="absolute top-1/2 -left-32 w-32 h-[1px] bg-gradient-to-r from-transparent to-cyan-500/50" />
                <div className="absolute top-1/2 -right-32 w-32 h-[1px] bg-gradient-to-l from-transparent to-cyan-500/50" />
              </div>

              {/* Title & Subtitle */}
              <h1 className="text-5xl md:text-7xl font-bold tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 via-purple-400 to-cyan-400 mb-4 text-center">
                GEMIGRAM
              </h1>
              <p className="text-lg md:text-xl text-slate-400 font-light tracking-wide mb-10 text-center">
                The Voice-Native AI Social Nexus.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col items-center gap-6">
                <button 
                  onClick={startForge}
                  className={`relative group px-10 py-3 rounded-full font-semibold tracking-widest uppercase transition-all duration-300 ${
                    isConnected 
                      ? 'bg-fuchsia-500/20 text-fuchsia-300 shadow-[0_0_30px_rgba(217,70,239,0.4)]' 
                      : 'bg-transparent text-fuchsia-400 hover:bg-fuchsia-500/10 hover:shadow-[0_0_20px_rgba(217,70,239,0.2)]'
                  }`}
                >
                  <div className="absolute inset-0 rounded-full border border-fuchsia-500/50 group-hover:border-fuchsia-400 transition-colors" />
                  {isConnected ? 'DISCONNECT' : 'CONNECT NOW (AETHER FORGE)'}
                </button>
                <button 
                  onClick={() => setView('create')}
                  className="text-cyan-400 font-medium tracking-widest uppercase text-sm hover:text-cyan-300 transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[1px] after:bg-cyan-400/50 hover:after:bg-cyan-300"
                >
                  CREATE AGENT
                </button>
              </div>
            </div>

            {/* Agent Hive Section */}
            <div className="px-8 pb-12">
              <div className="flex items-center gap-4 mb-8">
                <h2 className="text-xl font-bold tracking-widest text-cyan-400 uppercase">AGENT HIVE</h2>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-cyan-500/50 to-transparent" />
              </div>

              <div className="flex overflow-x-auto pb-6 gap-4 snap-x hide-scrollbar">
                {agents.map((agent) => (
                  <button 
                    key={agent.id}
                    onClick={() => setActiveAgentId(agent.id)}
                    className={`min-w-[160px] md:min-w-[180px] p-[1px] rounded-2xl snap-start transition-all duration-300 text-left ${
                      activeAgentId === agent.id 
                        ? 'bg-gradient-to-b from-cyan-400 to-fuchsia-500 shadow-[0_0_20px_rgba(34,211,238,0.2)] scale-105' 
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    <div className="bg-[#0A111C] rounded-2xl p-3 h-full flex flex-col">
                      <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-3 bg-slate-800">
                        <Image 
                          src={`https://picsum.photos/seed/${agent.seed}/200/200`}
                          alt={agent.name}
                          fill
                          sizes="(max-width: 768px) 160px, 180px"
                          className="object-cover opacity-80 mix-blend-screen"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0A111C] to-transparent opacity-60" />
                      </div>
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold text-white text-lg">{agent.name}</h3>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Activity className="w-3 h-3" /> {agent.users}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mb-4">{agent.role}</p>
                      
                      <div className="mt-auto flex items-center gap-2 bg-white/5 px-2 py-1.5 rounded-lg w-fit border border-white/5">
                        <div className={`w-1.5 h-1.5 rounded-full ${activeAgentId === agent.id && isConnected ? 'bg-cyan-400 animate-pulse shadow-[0_0_5px_rgba(34,211,238,1)]' : 'bg-emerald-500'}`} />
                        <span className={`text-[10px] font-medium ${activeAgentId === agent.id && isConnected ? 'text-cyan-400' : 'text-emerald-500'}`}>
                          {activeAgentId === agent.id && isConnected ? 'Listening' : 'Voice Online'}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

      </div>
      
      {/* Global CSS for hiding scrollbar */}
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
