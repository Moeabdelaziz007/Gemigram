'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, Zap, ShieldCheck, Database, 
  Cpu, Brain, Globe, MessageSquare, 
  ChevronRight, Sparkles, Server, Network,
  Smartphone
} from 'lucide-react';

interface SovereignDashboardProps {
  user: any;
  agents: any[];
  onStartForge: () => void;
  onSelectAgent: (id: string) => void;
}

export default function SovereignDashboard({ user, agents, onStartForge, onSelectAgent }: SovereignDashboardProps) {
  const [pulse, setPulse] = useState(72);
  const [neuralLoad, setNeuralLoad] = useState(24);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(prev => Math.max(60, Math.min(95, prev + (Math.random() * 10 - 5))));
      setNeuralLoad(prev => Math.max(10, Math.min(80, prev + (Math.random() * 6 - 3))));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { label: 'Performance', value: '98%', icon: Zap, color: 'text-aether-neon' },
    { label: 'Storage', value: '1.2 PB', icon: Database, color: 'text-fuchsia-400' },
    { label: 'Threads', value: '512', icon: Cpu, color: 'text-amber-400' },
    { label: 'Connections', value: '8', icon: Network, color: 'text-emerald-400' },
  ];

  const systems = [
    { name: 'Gemini 2.0 Omni', status: 'Operational', latency: '12ms', health: 98 },
    { name: 'Firebase Substrate', status: 'Active', latency: '8ms', health: 100 },
    { name: 'GWS Workspace Bridge', status: 'Secure', latency: '24ms', health: 95 },
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
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-[0.2em] text-white">Dashboard</h1>
          </div>
          <p className="text-white/40 font-mono text-xs md:text-[10px] uppercase tracking-widest pl-1 hidden sm:block">
            Node: {user?.uid?.slice(0, 8) || 'GUEST-01'} • Status: Active
          </p>
        </div>

        <div className="flex items-center gap-3">
          <motion.button 
            onClick={onStartForge}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl bg-white text-black font-bold text-xs md:text-[10px] uppercase tracking-widest hover:bg-aether-neon transition-all flex items-center gap-2 whitespace-nowrap"
          >
            <Sparkles className="w-3 md:w-3.5 h-3 md:h-3.5" />
            <span className="hidden sm:inline">Create Agent</span>
            <span className="sm:hidden">New</span>
          </motion.button>
        </div>
      </div>

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
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Agents Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/60 flex items-center gap-2">
              <Brain className="w-4 h-4 text-aether-neon" />
              Manifested Entities ({agents.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {agents.length > 0 ? (
              agents.map((agent) => (
                <button
                  key={agent.id}
                  onClick={() => onSelectAgent(agent.id)}
                  className="quantum-glass p-6 border border-white/5 rounded-[32px] text-left hover:border-aether-neon/30 transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-aether-neon/5 blur-[50px] -mr-16 -mt-16 group-hover:bg-aether-neon/10 transition-all" />
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-aether-neon/40 group-hover:bg-aether-neon/10 transition-all">
                      <MessageSquare className="w-6 h-6 text-white/60 group-hover:text-aether-neon" />
                    </div>
                    <span className="text-[8px] font-mono p-1 px-2 rounded-md bg-white/5 text-white/40 group-hover:text-aether-neon group-hover:bg-aether-neon/10 border border-white/5 uppercase transition-all">
                      v2.0.{agent.id.slice(-2)}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-aether-neon transition-colors">{agent.name}</h3>
                  <p className="text-[9px] text-white/40 uppercase tracking-widest mt-1 mb-4 line-clamp-1">{agent.description}</p>
                  <div className="flex items-center gap-4">
                    <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                      <div 
                        className="bg-aether-neon h-full rounded-full transition-all duration-1000" 
                        style={{ width: `${60 + Math.random() * 30}%` }}
                      />
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white transition-all transform group-hover:translate-x-1" />
                  </div>
                </button>
              ))
            ) : (
              <div className="md:col-span-2 quantum-glass border border-dashed border-white/10 rounded-[32px] p-12 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center border border-white/5">
                  <Server className="w-8 h-8 text-white/10" />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/60">No Intelligence Manifested</p>
                  <p className="text-[10px] font-mono text-white/20 uppercase">Initiate forge to generate your first entity</p>
                </div>
                <button 
                  onClick={onStartForge}
                  className="mt-6 px-8 py-3 rounded-xl bg-white text-black font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
                >
                  Enter Forge Chamber
                </button>
              </div>
            )}
          </div>
        </div>

        {/* System Health Column */}
        <div className="space-y-6">
          <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/60 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Core Infrastructure
          </h2>

          <div className="quantum-glass border border-white/5 rounded-[32px] overflow-hidden">
            <div className="p-6 space-y-6">
              {systems.map((sys) => (
                <div key={sys.name} className="space-y-2">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-black uppercase tracking-widest text-white/70">{sys.name}</span>
                    <span className="font-mono text-emerald-400">{sys.status}</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${sys.health}%` }}
                      className="h-full bg-emerald-500/50"
                    />
                  </div>
                  <div className="flex items-center justify-between text-[8px] font-mono text-white/20 uppercase tracking-tighter">
                    <span>Performance: {sys.health}%</span>
                    <span>Load: {100 - sys.health} ms</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-white/[0.02] p-6 border-t border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Neural Pulse</span>
                <span className="text-[9px] font-mono text-aether-neon">{pulse.toFixed(0)} BPM</span>
              </div>
              <div className="flex items-end gap-1 h-12">
                {Array.from({ length: 24 }).map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ 
                      height: [
                        '20%', 
                        `${20 + Math.random() * 80}%`, 
                        '20%'
                      ] 
                    }}
                    transition={{ 
                      duration: 0.8 + Math.random(), 
                      repeat: Infinity,
                      delay: i * 0.05
                    }}
                    className="flex-1 bg-aether-neon/20 rounded-t-sm"
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="quantum-glass p-6 border border-white/5 rounded-[32px] flex items-center justify-between group overflow-hidden relative">
            <div className="absolute inset-0 bg-aether-neon/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 group-hover:bg-aether-neon/20 group-hover:border-aether-neon/30 transition-all">
                <Smartphone className="w-5 h-5 text-cyan-400 group-hover:text-aether-neon" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-white">Device Deployment</p>
                <p className="text-[9px] font-mono text-white/30 uppercase">Sovereign Link // Mobilize Agent</p>
              </div>
            </div>
            <button 
              onClick={() => {
                alert('Install via Browser Menu: "Add to Home Screen" to deploy this agent as a standalone entity.');
              }}
              className="relative z-10 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-white/60 hover:bg-white hover:text-black transition-all"
            >
              Deploy App
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
