'use client';

import { useAetherStore } from '@/lib/store/useAetherStore';
import { Brain, Globe, ZoomIn, ZoomOut, Move, Network, Radio } from 'lucide-react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';

export default function GalaxyPage() {
  const { agents, setActiveAgentId, activeAgentId } = useAetherStore();
  const router = useRouter();
  const [zoom, setZoom] = useState(1);
  const [showConnections, setShowConnections] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Mouse position for parallax effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const parallaxX = useTransform(mouseX, [-0.5, 0.5], [-20, 20]);
  const parallaxY = useTransform(mouseY, [-0.5, 0.5], [-20, 20]);

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="p-8 max-w-6xl mx-auto h-full flex flex-col relative overflow-hidden"
    >
      {/* Control Panel */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-8 right-8 z-30 flex flex-col gap-2"
      >
        <button 
          onClick={() => setZoom(z => Math.min(z + 0.2, 2))}
          className="w-10 h-10 rounded-xl glass-medium border border-white/10 flex items-center justify-center hover:border-gemigram-neon/50 hover:bg-gemigram-neon/10 transition-all group"
        >
          <ZoomIn className="w-4 h-4 text-white/60 group-hover:text-gemigram-neon" />
        </button>
        <button 
          onClick={() => setZoom(z => Math.max(z - 0.2, 0.6))}
          className="w-10 h-10 rounded-xl glass-medium border border-white/10 flex items-center justify-center hover:border-gemigram-neon/50 hover:bg-gemigram-neon/10 transition-all group"
        >
          <ZoomOut className="w-4 h-4 text-white/60 group-hover:text-gemigram-neon" />
        </button>
        <button 
          onClick={() => setShowConnections(!showConnections)}
          className={`w-10 h-10 rounded-xl glass-medium border transition-all group ${showConnections ? 'border-gemigram-neon/50 bg-gemigram-neon/10' : 'border-white/10'}`}
        >
          <Network className={`w-4 h-4 ${showConnections ? 'text-gemigram-neon' : 'text-white/60 group-hover:text-white'}`} />
        </button>
        <div className="w-10 h-10 rounded-xl quantum-glass border border-white/10 flex items-center justify-center cursor-move">
          <Move className="w-4 h-4 text-white/40" />
        </div>
      </motion.div>
      <div className="relative z-20 mb-12">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-2 uppercase bg-clip-text text-transparent bg-gradient-to-r from-gemigram-neon via-white to-gemigram-neon drop-shadow-[0_0_30px_rgba(16,255,135,0.3)]">
            Gemigalaxy
          </h2>
          <p className="text-slate-500 font-mono text-[10px] uppercase tracking-[0.2em]">Sovereign Planet Architecture // Live Orchestration</p>
        </motion.div>
      </div>
      
      <div className="flex-1 relative flex items-center justify-center overflow-hidden">
        {/* Enhanced Dark Matter Background with Nebula */}
        <div className="absolute inset-0">
          {/* Base gradient */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,255,135,0.05)_0%,transparent_70%)]" />
          
          {/* Nebula Clouds - Neon Green Accent */}
          <motion.div 
            style={{ x: parallaxX, y: parallaxY }}
            className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-gradient-to-br from-gemigram-neon/5 to-transparent rounded-full blur-[100px]" 
          />
          <motion.div 
            style={{ x: useTransform(parallaxX, x => -x * 0.5), y: useTransform(parallaxY, y => -y * 0.5) }}
            className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-gradient-to-tl from-gemigram-neon/5 to-transparent rounded-full blur-[100px]" 
          />
          
          {/* Star Field */}
          <div className="absolute inset-0 opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMCIgY3k9IjEwIiByPSIxIiBmaWxsPSIjZmZmIi8+PGNpcmNsZSBjeD0iNTAiIGN5PSI4MCIgcj0iMC41IiBmaWxsPSIjZmZmIi8+PGNpcmNsZSBjeD0iMTUwIiBjeT0iMTIwIiByPSIwLjgiIGZpbGw9IiNmZmYiLz48L3N2Zz4=')] bg-repeat bg-[length:200px_200px]" />
        </div>

        {/* Central Sun (Sovereign Core) - Enhanced */}
        <motion.div 
          style={{ scale: zoom }}
          className="relative group z-30"
        >
          {/* Outer expansive glow */}
          <motion.div 
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.4, 0.8, 0.4],
              rotate: 360
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="w-64 h-64 rounded-full bg-gradient-to-br from-gemigram-neon/20 via-neon-blue/10 to-transparent blur-[80px] absolute -inset-20 mix-blend-screen pointer-events-none"
          />
          
          
          <div className="w-24 h-24 rounded-full bg-black/80 backdrop-blur-xl border-2 border-gemigram-neon/60 flex items-center justify-center relative z-10 shadow-[0_0_120px_rgba(57,255,20,0.4),inset_0_0_50px_rgba(57,255,20,0.2)] group-hover:scale-110 group-hover:border-gemigram-neon transition-all duration-700 cursor-pointer overflow-hidden">
            <motion.div
              animate={{ 
                rotate: 360,
                boxShadow: ['0 0 30px rgba(57,255,20,0.3)', '0 0 80px rgba(57,255,20,0.6)', '0 0 30px rgba(57,255,20,0.3)']
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border border-gemigram-neon/30 border-dashed"
            />
            {/* Inner scanning light */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gemigram-neon/80 blur-sm opacity-50 animate-[scanline_2s_linear_infinite]" />
            <Brain className="w-10 h-10 text-gemigram-neon drop-shadow-[0_0_20px_rgba(57,255,20,0.8)] relative z-10" />
          </div>
          
          {/* Core Labels */}
          <div className="absolute top-full mt-6 left-1/2 -translate-x-1/2 text-center whitespace-nowrap bg-black/40 backdrop-blur-md border border-gemigram-neon/20 rounded-full px-4 py-1.5 shadow-[0_0_20px_rgba(57,255,20,0.1)]">
            <motion.div 
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-[10px] font-black uppercase tracking-[0.4em] text-gemigram-neon drop-shadow-[0_0_5px_rgba(57,255,20,0.5)]"
            >
              CORE_OS_ACTIVE
            </motion.div>
          </div>
        </motion.div>

        {/* Orbital Paths - Enhanced with neon green */}
        {[200, 320, 450].map((r, i) => (
          <motion.div 
            key={i} 
            style={{ scale: zoom }}
            className="absolute border border-white/5 border-dashed rounded-full pointer-events-none" 
            initial={{ width: r*2, height: r*2 }}
            animate={{ 
              borderColor: ['rgba(16,255,135,0.05)', 'rgba(255,255,255,0.02)', 'rgba(16,255,135,0.05)']
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
        ))}

        {/* Agent Connection Lines (Synaptic Web) */}
        {showConnections && agents.length > 1 && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ scale: zoom }}>
            <defs>
              <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(16,255,135,0)" />
                <stop offset="50%" stopColor="rgba(16,255,135,0.3)" />
                <stop offset="100%" stopColor="rgba(16,255,135,0)" />
              </linearGradient>
            </defs>
            {agents.map((agent, i) => {
              const nextIndex = (i + 1) % agents.length;
              return (
                <motion.line
                  key={`connection-${i}`}
                  x1="50%"
                  y1="50%"
                  x2="50%"
                  y2="50%"
                  stroke="url(#connectionGradient)"
                  strokeWidth="1"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.2 }}
                  transition={{ duration: 1.5, delay: i * 0.2 }}
                />
              );
            })}
          </svg>
        )}

        {/* Orbiting Agent Planets - Enhanced */}
        {agents.map((agent, i) => {
          const radius = 220 + (i * 45); // Spread them out slightly more
          const duration = 25 + (i * 6); // Slightly slower for smoother tracking
          const delay = i * -4;
          
          return (
            <motion.div
              key={agent.id}
              animate={{ rotate: 360 }}
              transition={{ duration, repeat: Infinity, ease: "linear", delay }}
              className="absolute z-20 pointer-events-none"
              style={{ width: radius * 2, height: radius * 2, scale: zoom }}
            >
              <motion.div 
                animate={{ rotate: -360 }} // Counter-rotate to keep upright
                transition={{ duration, repeat: Infinity, ease: "linear", delay }}
                className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 pointer-events-auto"
              >
                <button 
                  onClick={() => {
                    setActiveAgentId(agent.id);
                    router.push('/workspace');
                  }}
                  className="group relative flex flex-col items-center"
                >
                  <motion.div 
                    whileHover={{ scale: 1.3 }}
                    className={`relative w-14 h-14 rounded-full backdrop-blur-md border-2 flex items-center justify-center transition-all duration-300 ${
                      activeAgentId === agent.id 
                        ? 'border-gemigram-neon shadow-[0_0_40px_rgba(57,255,20,0.6)] bg-gemigram-neon/20'
                        : 'border-white/10 bg-black/60 hover:border-gemigram-neon/50 hover:bg-gemigram-neon/10 hover:shadow-[0_0_20px_rgba(57,255,20,0.3)]'
                    }`}
                  >
                    {/* Pulsing ring for active agent */}
                    {activeAgentId === agent.id && (
                      <motion.div 
                        animate={{ scale: [1, 1.4, 1], opacity: [0.8, 0, 0.8] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0 rounded-full border-2 border-gemigram-neon/80"
                      />
                    )}
                    
                    <Globe className={`w-6 h-6 transition-colors duration-300 ${activeAgentId === agent.id ? 'text-gemigram-neon drop-shadow-[0_0_8px_rgba(57,255,20,1)]' : 'text-white/40 group-hover:text-gemigram-neon'}`} />
                    
                    {/* Status indicator */}
                    <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-gemigram-neon shadow-[0_0_12px_rgba(57,255,20,1)] border border-black" />

                    {/* Connection line to core on hover */}
                    <div className="absolute top-1/2 left-1/2 w-[200px] h-0.5 bg-gradient-to-r from-gemigram-neon to-transparent origin-left rotate-180 opacity-0 group-hover:opacity-30 transition-opacity duration-300 -z-10 pointer-events-none" />
                    
                    {/* Agent Label Bubble - Enhanced */}
                    <div className="absolute left-full ml-6 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0 pointer-events-none z-50">
                      <motion.div 
                        className="glass-strong p-4 border border-gemigram-neon/40 bg-black/80 rounded-2xl min-w-[180px] shadow-[0_10px_30px_rgba(0,0,0,0.8)] relative overflow-hidden"
                      >
                        <div className="absolute top-0 left-0 w-1 h-full bg-gemigram-neon" />
                        <div className="text-[8px] font-black uppercase tracking-widest text-white/50 mb-1 pl-1">Entity // {String(i+1).padStart(2, '0')}</div>
                        <div className="text-sm font-black text-white mb-1.5 pl-1 truncate drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{agent.name}</div>
                        <div className="text-[9px] text-gemigram-neon font-mono uppercase tracking-wide pl-1 truncate">{agent.role}</div>
                        
                        {/* Quick action */}
                        <div className="mt-3 pt-2 border-t border-white/10 pl-1">
                          <div className="text-[9px] text-white/40 uppercase tracking-widest font-bold">Access Terminal ↗</div>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                </button>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Enhanced Galaxy Stats Board */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="absolute bottom-12 right-12 z-20 hidden lg:block"
      >
        <div className="glass-medium p-6 border border-gemigram-neon/20 bg-black/40 rounded-[2rem] w-72 backdrop-blur-xl">
          <div className="flex items-center gap-2 mb-4">
            <Network className="w-4 h-4 text-gemigram-neon" />
            <div className="text-[10px] font-black uppercase tracking-widest text-gemigram-neon">Sync Telemetry</div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs text-white/40">Entities_Registry</span>
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-xs font-bold text-gemigram-neon"
              >
                {agents.length}
              </motion.span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-xs text-white/40">Neural_Load</span>
              <span className="text-xs font-bold text-gemigram-neon">99.8%</span>
            </div>
            
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
              <motion.div 
                initial={{ width: '0%' }}
                animate={{ width: '99.8%' }}
                transition={{ duration: 2, delay: 0.5 }}
                className="h-full bg-gemigram-neon shadow-[0_0_10px_rgba(16,255,135,0.5)]"
              />
            </div>
            
            {/* Zoom Level Indicator */}
            <div className="pt-3 border-t border-white/10">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[9px] text-white/30 uppercase">View Scale</span>
                <span className="text-[9px] font-mono text-neon-green">{(zoom * 100).toFixed(0)}%</span>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-neon-blue to-electric-purple"
                  animate={{ width: `${((zoom - 0.6) / 1.4) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 🌠 Cosmic Activity Stream - NEW SMART ADD */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-12 left-12 z-20 hidden lg:block"
      >
        <div className="glass-medium p-6 border border-white/5 bg-black/40 rounded-[2rem] w-80 backdrop-blur-xl">
          <div className="flex items-center gap-2 mb-6">
            <Radio className="w-4 h-4 text-gemigram-neon animate-pulse" />
            <div className="text-[10px] font-black uppercase tracking-widest text-white/60">Cosmic_Pulse</div>
          </div>
          
          <div className="space-y-4 font-mono">
            <ActivityItem time="01:28" text="Entity_Sovereign materialized in Alpha_Sector" />
            <ActivityItem time="01:25" text="Neural sync optimized for 12/12 agents" />
            <ActivityItem time="01:12" text="Memory pruning complete across Gemigalaxy" />
            <ActivityItem time="00:58" text="MCP Bridge: GitHub_v3 successfully linked" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function ActivityItem({ time, text }: { time: string; text: string }) {
  return (
    <div className="flex gap-3 items-start border-l border-white/5 pl-3">
      <span className="text-[8px] text-gemigram-neon font-black mt-1">{time}</span>
      <span className="text-[9px] text-white/40 leading-relaxed uppercase tracking-wider">{text}</span>
    </div>
  );
}

