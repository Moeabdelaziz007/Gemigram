'use client';

import { useState, useEffect, useCallback } from 'react';
import { VoiceAgent } from '@/components/VoiceAgent';
import { 
  Activity, User, LogOut, Shield, Info, Plus, ChevronRight, Sparkles, Database, Cpu, Brain, Package
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { nanoid } from 'nanoid';
import CreateAgentForm from '@/components/CreateAgentForm';
import AppShell from '@/components/AppShell';
import ForgeChamber from '@/components/ForgeChamber';
import HeroBackground from '@/components/HeroBackground';
import { AgentCard } from '@/components/ui/AgentCard';
import { db, auth, googleProvider, handleFirestoreError, OperationType } from '@/firebase';
import { AgentRegistry, AgentManifest } from '@/lib/agents/AgentRegistry';
import { GravityRouter, AgentCandidate } from '@/lib/agents/GravityRouter';
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
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS);
  const [activeAgentId, setActiveAgentId] = useState('atlas');
  const [view, setView] = useState<'home' | 'workspace' | 'hub' | 'settings' | 'forge' | 'galaxy'>('home');
  const [user, setUser] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [isForging, setIsForging] = useState(false);
  const [forgeDna, setForgeDna] = useState<Partial<Agent>>({});
  const [activeTask, setActiveTask] = useState<{ name: string; status: 'idle' | 'running' | 'completed' | 'error'; logs: string[] } | null>(null);

  // Agent Registry Sync
  useEffect(() => {
    const registry = AgentRegistry.getInstance();
    registry.syncWithFirestore().then(() => {
      const manifests = registry.listAgents();
      if (manifests.length > 0) {
        // Map manifests back to local Agent type for compatibility
        const mapped = manifests.map(m => ({
          ...m,
          aetherId: `ath://${m.id}`,
          users: '0',
          seed: m.id,
        })) as Agent[];
        setAgents(prev => [...INITIAL_AGENTS, ...mapped]);
      }
    });
  }, [user]);

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

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setView('home');
    } catch (err) {
      console.error("Logout Error:", err);
    }
  };

  const handleTranscription = useCallback((text: string, role: 'user' | 'model') => {
    if (!user || !activeAgentId) return;
    if (isForging) return;

    addDoc(collection(db, 'agents', activeAgentId, 'history'), {
      text,
      role,
      timestamp: serverTimestamp(),
      userId: user.uid
    }).catch(err => handleFirestoreError(err, OperationType.WRITE, 'history'));
  }, [user, activeAgentId, isForging]);

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
      
      setActiveAgentId(agentId);
      setView('workspace');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'agents');
    }
  };

  const startForge = () => {
    if (!user) {
      alert("Please login to access the Aether Forge.");
      return;
    }
    setView('forge');
  };

  const handleForgeComplete = () => {
    setView('workspace');
  };

  return (
    <AppShell 
      currentView={view} 
      onNavigate={setView} 
      user={user} 
      onLogin={handleLogin} 
      onLogout={handleLogout}
    >
      {view === 'home' && (
        <div className="flex flex-col items-center justify-center min-h-full py-20 px-4 relative overflow-hidden">
          <HeroBackground />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center max-w-4xl mx-auto z-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4" />
              <span>Welcome to the next evolution of AI</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                Voice-Native
              </span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
                Intelligence.
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-400 font-light max-w-2xl mx-auto mb-12 leading-relaxed">
              Experience zero-latency, multimodal AI agents that live in your workspace. No chatboxes. Just pure connection.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button 
                onClick={startForge}
                className="relative group px-8 py-4 rounded-2xl bg-white text-black font-bold text-lg hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.3)]"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Enter Aether Forge <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
              
              <button 
                onClick={() => setView('workspace')}
                className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-xl"
              >
                Open Workspace
              </button>
            </div>
          </motion.div>

          {/* Decorative Elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.05)_0%,transparent_50%)] pointer-events-none" />
        </div>
      )}

      {view === 'forge' && (
        <ForgeChamber onComplete={handleForgeComplete} />
      )}

      {view === 'workspace' && (
        <div className="h-full w-full p-4 lg:p-8">
          <VoiceAgent activeAgent={activeAgent} />
        </div>
      )}

      {view === 'galaxy' && (
        <div className="p-8 max-w-6xl mx-auto h-full flex flex-col">
          <div className="mb-12">
            <h2 className="text-4xl font-bold tracking-tight mb-2">Aether Galaxy</h2>
            <p className="text-slate-400">Real-time orchestration of specialized agent planets.</p>
          </div>
          
          <div className="flex-1 relative flex items-center justify-center">
            {/* Central Sun (Aether Core) */}
            <motion.div 
              animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="w-32 h-32 rounded-full bg-cyan-500/20 blur-3xl absolute"
            />
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center relative z-10 shadow-[0_0_50px_rgba(255,255,255,0.5)]">
              <Brain className="w-8 h-8 text-black" />
            </div>

            {/* Orbiting Agents */}
            {agents.map((agent, i) => {
              const angle = (i / agents.length) * Math.PI * 2;
              const radius = 200 + (i % 2) * 50;
              return (
                <motion.div
                  key={agent.id}
                  initial={{ x: 0, y: 0 }}
                  animate={{ 
                    x: Math.cos(angle) * radius,
                    y: Math.sin(angle) * radius,
                  }}
                  className="absolute"
                >
                  <button 
                    onClick={() => {
                      setActiveAgentId(agent.id);
                      setView('workspace');
                    }}
                    className="group relative flex flex-col items-center"
                  >
                    <div className={`w-12 h-12 rounded-full bg-slate-900 border-2 flex items-center justify-center transition-all group-hover:scale-125 ${
                      activeAgentId === agent.id ? 'border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.5)]' : 'border-white/10'
                    }`}>
                      <Package className="w-5 h-5 text-white/50" />
                    </div>
                    <span className="mt-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {agent.name}
                    </span>
                  </button>
                </motion.div>
              );
            })}

            {/* Orbit Rings */}
            <div className="absolute w-[400px] h-[400px] border border-white/5 rounded-full pointer-events-none" />
            <div className="absolute w-[500px] h-[500px] border border-white/5 rounded-full pointer-events-none" />
          </div>
        </div>
      )}

      {view === 'hub' && (
        <div className="p-8 max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold tracking-tight mb-2">Agents Hub</h2>
              <p className="text-slate-400">Manage, import, and deploy your .ath entities.</p>
            </div>
            <button 
              onClick={startForge}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30 transition-all font-medium"
            >
              <Plus className="w-5 h-5" /> Create New
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {agents.map((agent, i) => (
              <AgentCard
                key={agent.id}
                name={agent.name}
                status={activeAgentId === agent.id ? 'connected' : 'sleeping'}
                color={i % 3 === 0 ? 'cyan' : i % 3 === 1 ? 'purple' : 'emerald'}
                onClick={() => {
                  setActiveAgentId(agent.id);
                  setView('workspace');
                }}
              />
            ))}
          </div>
        </div>
      )}

      {view === 'settings' && (
        <div className="p-8 max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold tracking-tight mb-2">Settings</h2>
          <p className="text-slate-400 mb-12">Configure your workspace and permissions.</p>

          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Permissions</h3>
                  <p className="text-sm text-slate-400">Manage what your agents can access.</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                  <div>
                    <p className="font-medium">Microphone Access</p>
                    <p className="text-xs text-slate-400">Required for voice interaction</p>
                  </div>
                  <div className="w-12 h-6 rounded-full bg-cyan-500 relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white shadow-sm" />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <Database className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Workspace Integrations</h3>
                  <p className="text-sm text-slate-400">Connect external services.</p>
                </div>
              </div>
              <div className="space-y-4">
                <button className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                      <span className="text-red-400 font-bold">G</span>
                    </div>
                    <span className="font-medium">Connect Google Workspace</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
