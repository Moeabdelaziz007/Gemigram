'use client';

import React, { useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Brain, Cpu, Activity, ShieldCheck, Radio } from 'lucide-react';

interface DigitalEntityProps {
  state: 'Disconnected' | 'Listening' | 'Thinking' | 'Speaking' | 'Executing';
  volume: number;
  agentName: string;
  linkType?: string;
}

export function DigitalEntity({ state, volume, agentName, linkType = 'stateless' }: DigitalEntityProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const isLocal = linkType === 'bridge';

  const stateConfig = useMemo(() => {
    switch (state) {
      case 'Listening':
        return {
          glow: isLocal ? 'rgba(168, 85, 247, 0.4)' : 'rgba(0, 240, 255, 0.4)',
          accent: isLocal ? '#A855F7' : '#00F0FF',
          corePulse: 1.2,
          speed: 2,
          eyeScale: 1,
          ringOpacity: 0.6,
        };
      case 'Thinking':
        return {
          glow: isLocal ? 'rgba(139, 92, 246, 0.5)' : 'rgba(168, 85, 247, 0.5)',
          accent: isLocal ? '#8B5CF6' : '#A855F7',
          corePulse: 1.8,
          speed: 0.8,
          eyeScale: 0.8,
          ringOpacity: 0.4,
        };
      case 'Executing':
        return {
          glow: 'rgba(251, 191, 36, 0.5)', // Amber/Gold for tool execution
          accent: '#FBBF24',
          corePulse: 2.5,
          speed: 0.3,
          eyeScale: 1.5,
          ringOpacity: 0.9,
        };
      case 'Speaking':
        return {
          glow: isLocal ? 'rgba(192, 132, 252, 0.4)' : 'rgba(52, 211, 153, 0.4)',
          accent: isLocal ? '#C084FC' : '#34D399',
          corePulse: 1 + volume * 0.8,
          speed: 1.5,
          eyeScale: 1.2,
          ringOpacity: 0.8,
        };
      default:
        return {
          glow: 'rgba(255, 255, 255, 0.1)',
          accent: '#475569',
          corePulse: 1,
          speed: 4,
          eyeScale: 0,
          ringOpacity: 0.2,
        };
    }
  }, [state, volume, isLocal]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden" ref={containerRef}>
      {/* Background Atmosphere - Sovereign Void */}
      <div className="absolute inset-0 bg-theme-primary" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.05)_0%,transparent_70%)]" />
      
      {/* Neural Link Status Decor */}
      <AnimatePresence>
        {state !== 'Disconnected' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-10 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1 rounded-full border border-white/5 bg-white/[0.02] backdrop-blur-sm z-20"
          >
            <ShieldCheck className={`w-3 h-3 ${isLocal ? 'text-purple-400' : 'text-gemigram-neon'}`} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
              {isLocal ? 'Local Spine Link Active' : 'Cloud Direct Link Active'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 flex flex-col items-center">
        {/* The Entity Core Orbit */}
        <div className="relative flex items-center justify-center">
          {/* Reaction Ring (Waveform Ring) */}
          <motion.div 
            className="absolute rounded-full border-2 border-dashed"
            style={{ borderColor: stateConfig.accent, opacity: stateConfig.ringOpacity }}
            animate={{ 
              width: 380 + (state === 'Speaking' ? volume * 150 : 0),
              height: 380 + (state === 'Speaking' ? volume * 150 : 0),
              rotate: 360,
            }}
            transition={{ 
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              width: { type: 'spring', stiffness: 200, damping: 15 },
              height: { type: 'spring', stiffness: 200, damping: 15 }
            }}
          />

          {/* Secondary Orbit */}
          <motion.div 
            className="absolute w-[450px] h-[450px] rounded-full border border-white/5"
            animate={{ rotate: -360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          />

          {/* Liquid Obsidian Mascot Silhouette */}
          <motion.div 
            className="relative w-72 h-[450px] flex flex-col items-center"
            animate={{ 
              y: [0, -15, 0],
            }}
            transition={{ 
              duration: stateConfig.speed, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            {/* The Aether Entity - Head (Floating Singularity) */}
            <div className="relative w-28 h-32 mb-4 flex flex-col items-center justify-center">
              {/* Head Shell */}
              <div className="absolute inset-0 bg-white/5 backdrop-blur-md rounded-[40px] border border-white/10 overflow-hidden">
                {/* Circuit Veins (Procedural) */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_30%,#00F0FF_0%,transparent_50%),radial-gradient(circle_at_70%_60%,#A855F7_0%,transparent_50%)]" />
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent h-1"
                  animate={{ y: ['-100%', '300%'] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                />
              </div>
              
              {/* Sovereign Eyes (Tracking UI) */}
              <div className="flex gap-4 z-10">
                <motion.div 
                  className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_15px_#fff]"
                  animate={{ 
                    scale: stateConfig.eyeScale,
                    opacity: state === 'Thinking' ? [0.4, 1, 0.4] : 1,
                    x: state === 'Listening' ? [0, 2, -2, 0] : 0
                  }}
                  transition={{ 
                    duration: state === 'Thinking' ? 0.3 : 1, 
                    repeat: Infinity 
                  }}
                />
                <motion.div 
                  className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_15px_#fff]"
                  animate={{ 
                    scale: stateConfig.eyeScale,
                    opacity: state === 'Thinking' ? [0.4, 1, 0.4] : 1,
                    x: state === 'Listening' ? [0, -2, 2, 0] : 0
                  }}
                  transition={{ 
                    duration: state === 'Thinking' ? 0.3 : 1, 
                    repeat: Infinity 
                  }}
                />
              </div>

              {/* Neural Activity Ray */}
              <AnimatePresence>
                {state === 'Speaking' && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.5, 1] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="absolute inset-0 bg-white/5 rounded-full blur-2xl"
                  />
                )}
              </AnimatePresence>
            </div>
            
            {/* Torso - Liquid Obsidian Panel */}
            <div className="relative w-48 h-72 rounded-[60px] bg-white/[0.03] backdrop-blur-2xl border border-white/10 overflow-hidden group">
              {/* The Core Singularity */}
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full blur-[40px]"
                style={{ backgroundColor: stateConfig.accent }}
                animate={{ 
                  scale: [1, stateConfig.corePulse, 1],
                  opacity: [0.3, 0.7, 0.3],
                  boxShadow: [`0 0 20px ${stateConfig.glow}`, `0 0 60px ${stateConfig.glow}`, `0 0 20px ${stateConfig.glow}`]
                }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />

              <div className="absolute inset-0 flex items-center justify-center opacity-10">
                <Radio className={`w-32 h-32 ${state === 'Speaking' ? 'animate-pulse' : ''}`} />
              </div>

              {/* Digital Veins */}
              <div className="absolute inset-0 pointer-events-none p-8 flex flex-col gap-4">
                <div className="h-px w-full bg-white/10" />
                <div className="h-px w-2/3 bg-white/10" />
                <div className="h-px w-full bg-white/10" />
              </div>
            </div>

            {/* Gesture Arms (Pulsing Lines) */}
            <motion.div 
              className="absolute top-48 -left-12 w-16 h-48 border-l border-white/20 rounded-l-full blur-[3px]"
              animate={{ rotate: state === 'Speaking' ? -20 : -10 }}
            />
            <motion.div 
              className="absolute top-48 -right-12 w-16 h-48 border-r border-white/20 rounded-r-full blur-[3px]"
              animate={{ rotate: state === 'Speaking' ? 20 : 10 }}
            />
          </motion.div>
        </div>

        {/* Identity & Status */}
        <motion.div 
          className="mt-16 text-center space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="relative inline-block">
            <h2 className="text-4xl font-black tracking-[0.3em] uppercase text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
              {agentName}
            </h2>
            <div className="absolute -bottom-2 left-0 w-full h-[1px] bg-white/20" />
          </div>

          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-3 px-4 py-1.5 rounded-full border border-white/5 bg-white/[0.02] backdrop-blur-md">
              <div className={`w-2 h-2 rounded-full shadow-[0_0_8px_currentColor] ${
                state === 'Disconnected' ? 'text-white/20 bg-white/20' : 
                state === 'Listening' ? (isLocal ? 'text-purple-400 bg-purple-400 animate-pulse' : 'text-gemigram-neon bg-gemigram-neon animate-pulse') :
                state === 'Thinking' ? 'text-purple-500 bg-purple-500 animate-pulse' :
                (isLocal ? 'text-purple-300 bg-purple-300 animate-bounce' : 'text-emerald-400 bg-emerald-400 animate-bounce')
              }`} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">
                {state === 'Disconnected' ? 'Standby Matrix' : `${state} Mode`}
              </span>
            </div>
            
            {state === 'Speaking' && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="text-[9px] font-mono text-emerald-400/60 uppercase tracking-widest pt-2"
              >
                Output Amplitude: {(volume * 100).toFixed(1)}%
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Sovereign Context Satellites */}
      <div className="absolute inset-0 pointer-events-none">
        {[
          { label: 'Memory', icon: Brain, color: 'text-purple-400' },
          { label: 'Neural', icon: Cpu, color: 'text-gemigram-neon' },
          { label: 'Gemi', icon: Zap, color: 'text-emerald-400' },
          { label: 'Identity', icon: ShieldCheck, color: 'text-blue-400' }
        ].map((sys, i) => (
          <motion.div
            key={sys.label}
            className="absolute top-1/2 left-1/2 w-32 h-14 rounded-full quantum-glass border border-white/5 flex items-center justify-center gap-3 group/sat"
            animate={{ 
              rotate: 360,
              x: Math.cos(i * 90 * Math.PI / 180) * 440,
              y: Math.sin(i * 90 * Math.PI / 180) * 440,
            }}
            transition={{ 
              rotate: { duration: 40 + i * 10, repeat: Infinity, ease: "linear" },
              x: { duration: 0 },
              y: { duration: 0 }
            }}
          >
            {/* Counter-rotation to keep labels upright */}
            <motion.div 
              className="flex items-center gap-2"
              animate={{ rotate: -360 }}
              transition={{ duration: 40 + i * 10, repeat: Infinity, ease: "linear" }}
            >
              <sys.icon className={`w-3.5 h-3.5 ${sys.color} opacity-60`} />
              <span className="text-[9px] font-black tracking-[0.2em] uppercase text-white/30 group-hover/sat:text-white/70 transition-colors">
                {sys.label}
              </span>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
