'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, Zap, ShieldCheck, Database, 
  Cpu, Brain, Globe, MessageSquare, 
  ChevronRight, Sparkles, Server, Network,
  Smartphone, Search, Layers, RefreshCw, Fingerprint
} from 'lucide-react';
import { useAetherStore } from '../lib/store/useAetherStore';
import { useRouter } from 'next/navigation';

interface SovereignDashboardProps {
  user: any;
  agents: any[];
  onStartForge: () => void;
  onSelectAgent: (id: string) => void;
  googleAccessToken?: string;
}

export default function SovereignDashboard({ user, agents, onStartForge, onSelectAgent, googleAccessToken }: SovereignDashboardProps) {
  const router = useRouter();
  const [pulse, setPulse] = useState(72);
  const [neuralLoad, setNeuralLoad] = useState(24);
  const [bridgeStatus, setBridgeStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [showWizard, setShowWizard] = useState(false);
  const [isDiscovering, setIsDiscovering] = useState(false);
  
  const { 
    activeProjectId, 
    setActiveProjectId, 
    userProjects, 
    setUserProjects,
    linkType,
    setLinkType
  } = useAetherStore();

  useEffect(() => {
    const checkBridge = async () => {
      try {
        const res = await fetch('http://localhost:9999/status');
        if (res.ok) {
          setBridgeStatus('connected');
          setLinkType('bridge');
        } else {
          setBridgeStatus('disconnected');
          setLinkType('stateless');
        }
      } catch (e) {
        setBridgeStatus('disconnected');
        setLinkType('stateless');
      }
    };
    checkBridge();

    const interval = setInterval(() => {
      setPulse(prev => Math.max(60, Math.min(95, prev + (Math.random() * 10 - 5))));
      setNeuralLoad(prev => Math.max(10, Math.min(80, prev + (Math.random() * 6 - 3))));
    }, 3000);

    return () => clearInterval(interval);
  }, [setLinkType]);

  const handleDiscoverProjects = async () => {
    if (!googleAccessToken) return;
    setIsDiscovering(true);
    try {
      const res = await fetch('https://cloudresourcemanager.googleapis.com/v1/projects', {
        headers: { 'Authorization': `Bearer ${googleAccessToken}` }
      });
      const data = await res.json();
      if (data.projects) {
        const mapped = data.projects.map((p: any) => ({
          id: p.projectId,
          name: p.name
        }));
        setUserProjects(mapped);
      }
    } catch (e) {
      console.error("Project discovery failed", e);
    } finally {
      setIsDiscovering(false);
    }
  };

  const stats = [
    { label: 'Performance', value: '98%', icon: Zap, color: 'text-aether-neon' },
    { label: 'Storage', value: '1.2 PB', icon: Database, color: 'text-fuchsia-400' },
    { label: 'Threads', value: '512', icon: Cpu, color: 'text-amber-400' },
    { label: 'Neural Sync', value: 'Active', icon: Network, color: 'text-emerald-400' },
  ];

  const systems = [
    { name: 'Gemini 2.1 Omni', status: 'Operational', latency: '12ms', health: 98 },
    { name: 'Firebase Substrate', status: 'Active', latency: '8ms', health: 100 },
    { name: 'Gemigram Neural Workspace', status: bridgeStatus === 'connected' ? 'Secure' : 'Cloud Direct', latency: bridgeStatus === 'connected' ? '24ms' : '150ms', health: bridgeStatus === 'connected' ? 95 : 100 },
  ];

  return (
    <div className="p-6 lg:p-10 space-y-10 max-w-7xl mx-auto">
      {/* Header HUD */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 md:w-10 h-8 md:h-10 rounded-lg md:rounded-xl bg-aether-neon/20 flex items-center justify-center border border-aether-neon/30 flex-shrink-0">
              <Activity className="w-4 md:w-5 h-4 md:h-5 text-aether-neon animate-pulse" />
            </div>
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-[0.2em] text-white">Gemigram Dashboard</h1>
          </div>
          <p className="text-white/40 font-mono text-xs md:text-[10px] uppercase tracking-widest pl-1 hidden sm:block">
            Neural Link: {bridgeStatus === 'connected' ? 'Local Spine' : 'Cloud Direct'} • Status: Active
          </p>
        </div>

        <div className="flex items-center gap-3">
          <motion.button 
            onClick={handleDiscoverProjects}
            disabled={isDiscovering}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs md:text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2 whitespace-nowrap ${isDiscovering ? 'opacity-50' : ''}`}
          >
            <RefreshCw className={`w-3 md:w-3.5 h-3 md:h-3.5 ${isDiscovering ? 'animate-spin text-aether-neon' : ''}`} />
            {isDiscovering ? 'Scanning...' : 'Sync Projects'}
          </motion.button>
          
          <motion.button 
            onClick={onStartForge}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl bg-white text-black font-black text-xs md:text-[10px] uppercase tracking-widest hover:bg-aether-neon transition-all flex items-center gap-2 whitespace-nowrap"
          >
            <Sparkles className="w-3 md:w-3.5 h-3 md:h-3.5" />
            <span className="hidden sm:inline">Create Agent</span>
            <span className="sm:hidden">New</span>
          </motion.button>
        </div>
      </div>

      {/* Workspace Context Bar */}
      {userProjects.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="quantum-glass p-3 rounded-2xl border border-aether-neon/20 flex items-center gap-4 overflow-x-auto no-scrollbar"
        >
          <div className="flex items-center gap-2 px-3 border-r border-white/10">
            <Layers className="w-4 h-4 text-aether-neon" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white/60 whitespace-nowrap">Active Workspace:</span>
          </div>
          {userProjects.map((p) => (
            <button
              key={p.id}
              onClick={() => setActiveProjectId(p.id)}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-mono transition-all border whitespace-nowrap ${
                activeProjectId === p.id 
                  ? 'bg-aether-neon/20 border-aether-neon text-aether-neon shadow-[0_0_15px_rgba(0,255,255,0.2)]'
                  : 'bg-white/5 border-white/10 text-white/40 hover:border-white/30 hover:text-white'
              }`}
            >
              {p.name}
            </button>
          ))}
        </motion.div>
      )}

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {stats.map((stat) => (
          <motion.div 
            key={stat.label} 
            whileHover={{ y: -4 }}
            className="quantum-glass p-3 md:p-6 border border-white/5 rounded-2xl md:rounded-3xl relative overflow-hidden group cursor-pointer"
          >
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <stat.icon className="w-16 md:w-24 h-16 md:h-24" />
            </div>
            <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-white/40 mb-2 md:mb-3 line-clamp-2">{stat.label}</p>
            <div className="flex items-end justify-between">
              <span className="text-lg md:text-2xl font-bold text-white tracking-tight">{stat.value}</span>
              <stat.icon className={`w-5 h-5 ${stat.color} mb-1`} />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10">
        {/* Active Agents Column */}
        <div className="lg:col-span-2 space-y-6">
           <div className="flex items-center justify-between px-2">
            <h3 className="text-lg font-black uppercase tracking-widest text-white/80">Sovereign Entities</h3>
            <span className="text-[10px] font-mono text-aether-neon/40">{agents.length} Nodes</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {agents.map((agent) => (
              <motion.button
                key={agent.id}
                onClick={() => onSelectAgent(agent.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="quantum-glass p-6 rounded-[32px] border border-white/5 hover:border-aether-neon/30 text-left transition-all group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20">
                  <Brain className="w-12 h-12" />
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-aether-neon/20 transition-all">
                    <Fingerprint className="w-6 h-6 text-white group-hover:text-aether-neon transition-colors" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-lg group-hover:text-aether-neon transition-colors">{agent.name}</h4>
                    <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest">{agent.voiceName} Profile</p>
                  </div>
                </div>
                <p className="text-xs text-white/60 mb-6 line-clamp-2 leading-relaxed">
                  {agent.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex-1 mr-4">
                    <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                      <div 
                        className="bg-aether-neon h-full rounded-full transition-all duration-1000" 
                        style={{ width: `${60 + (agent.id.length % 30)}%` }}
                      />
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white transition-all transform group-hover:translate-x-1" />
                </div>
              </motion.button>
            ))}
            
            {agents.length === 0 && (
              <div className="col-span-full py-20 text-center space-y-4 quantum-glass rounded-[40px] border-dashed border-2 border-white/5">
                <Sparkles className="w-12 h-12 text-white/10 mx-auto" />
                <div>
                  <p className="text-white/40 font-bold uppercase tracking-widest text-xs">No Entities Materialized</p>
                  <button onClick={onStartForge} className="text-aether-neon text-[10px] font-black uppercase mt-2 hover:underline">Initiate first Forge sequence</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Status Column */}
        <div className="space-y-6">
           <div className="flex items-center justify-between px-2">
            <h3 className="text-lg font-black uppercase tracking-widest text-white/80">Neural Status</h3>
            <span className="text-[10px] font-mono text-emerald-400/60 font-bold">L-LINK: OK</span>
          </div>

          <div className="quantum-glass p-8 rounded-[40px] border border-white/5 space-y-8">
            <div className="space-y-6">
              {systems.map((sys) => (
                <div key={sys.name} className="space-y-3">
                  <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest">
                    <span className="text-white/60">{sys.name}</span>
                    <span className={sys.status === 'Operational' || sys.status === 'Active' || sys.status === 'Secure' ? 'text-aether-neon' : 'text-amber-400'}>{sys.status}</span>
                  </div>
                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${sys.health}%` }}
                      className={`h-full rounded-full ${sys.health > 90 ? 'bg-aether-neon' : 'bg-amber-400'}`}
                    />
                  </div>
                  <div className="flex justify-between text-[8px] font-mono text-white/20 uppercase tracking-[0.2em]">
                    <span>Health: {sys.health}%</span>
                    <span>Lat: {sys.latency}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Neural Pulse Visualization */}
            <div className="pt-4 border-t border-white/5">
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 mb-4">Real-time Neural Flux</p>
              <div className="h-16 flex items-end gap-1 px-2">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="flex-1 bg-aether-neon/30 rounded-t-sm"
                    animate={{ 
                      height: [
                        '20%', 
                        `${20 + ((i * 13) % 80)}%`, 
                        '20%'
                      ] 
                    }}
                    transition={{ 
                      duration: 0.8 + ((i * 3) % 10) / 10, 
                      repeat: Infinity,
                      delay: i * 0.05
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/dashboard/voicelab')}
            className="quantum-glass p-6 border border-aether-neon/20 rounded-[32px] flex items-center justify-between group overflow-hidden relative cursor-pointer"
          >
            <div className="absolute inset-0 bg-aether-neon/5 opacity-20 group-hover:opacity-40 transition-opacity pointer-events-none" />
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-aether-neon/10 flex items-center justify-center border border-aether-neon/30 group-hover:bg-aether-neon/20 group-hover:border-aether-neon/50 transition-all">
                <Fingerprint className="w-5 h-5 text-aether-neon" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-white">Neural Voice Lab</p>
                <p className="text-[9px] font-mono text-white/30 uppercase">Analyze // Tuning // Cloning</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white transition-all transform group-hover:translate-x-1" />
          </motion.div>

          <div className="quantum-glass p-6 border border-white/5 rounded-[32px] flex items-center justify-between group overflow-hidden relative">
            <div className="absolute inset-0 bg-aether-neon/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-aether-neon/30 transition-all">
                <Server className="w-5 h-5 text-white/40 group-hover:text-aether-neon" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">Core Nodes</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest">AETHER-01 OK</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sovereign Setup Wizard Overlay */}
      {showWizard && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-aether-black/90 backdrop-blur-xl"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-2xl quantum-glass border border-aether-neon/30 p-8 md:p-12 rounded-[40px] shadow-2xl shadow-aether-neon/20 overflow-hidden"
          >
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-aether-neon/10 blur-[80px] rounded-full" />
            
            <div className="relative z-10 space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-aether-neon/20 flex items-center justify-center border border-aether-neon/40">
                  <Activity className="w-8 h-8 text-aether-neon animate-pulse" />
                </div>
                <div>
                  <h2 className="text-3xl font-black uppercase tracking-tighter text-white">Sovereign Initialization</h2>
                  <p className="text-aether-neon text-xs font-mono uppercase tracking-widest mt-1">Status: Bridge Disconnected</p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-white/70 text-lg leading-relaxed font-medium">
                  Welcome to the Sovereign Intelligence Layer. To operate at <span className="text-aether-neon font-bold">$0 cost</span> and maintain data privacy, we need to ignite your <span className="text-white font-bold">Local Neural Spine</span>.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                    <Zap className="w-6 h-6 text-aether-neon" />
                    <h4 className="font-bold text-white text-sm">One-Click Ignition</h4>
                    <p className="text-xs text-white/40 leading-relaxed">Simply click the <b>AetherOS.command</b> file in your project folder to start the bridge.</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                    <ShieldCheck className="w-6 h-6 text-emerald-400" />
                    <h4 className="font-bold text-white text-sm">Secure & Private</h4>
                    <p className="text-xs text-white/40 leading-relaxed">All Workspace commands are executed locally on your machine. No data leaks to the cloud.</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 pt-6">
                <button 
                  onClick={() => window.location.reload()}
                  className="w-full sm:w-auto px-10 py-4 rounded-xl bg-aether-neon text-black font-black text-xs uppercase tracking-widest hover:bg-white transition-all shadow-lg shadow-aether-neon/30"
                >
                  Confirm Ignition
                </button>
                <button 
                  onClick={() => setShowWizard(false)}
                  className="w-full sm:w-auto px-10 py-4 rounded-xl bg-white/5 border border-white/10 text-white/40 font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
                >
                  Continue in Demo Mode
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
