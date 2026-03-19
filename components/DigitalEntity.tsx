'use client';

import React, { useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Brain, Cpu, ShieldCheck, Radio } from 'lucide-react';

interface DigitalEntityProps {
  state: 'Disconnected' | 'Listening' | 'Thinking' | 'Speaking' | 'Executing';
  volume: number;
  agentName: string;
  linkType?: 'stateless' | 'bridge' | 'hibernating';
}

export function DigitalEntity({ state, volume, agentName, linkType = 'stateless' }: DigitalEntityProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const isLocal = linkType === 'bridge';

  const stateConfig = useMemo(() => {
    switch (state) {
      case 'Listening':
        return {
          glow: 'var(--gemigram-glow)',
          accent: 'var(--gemigram-neon)',
          corePulse: 1.25,
          speed: 2.2,
          eyeScale: 1.1,
          ringOpacity: 0.5,
        };
      case 'Thinking':
        return {
          glow: 'rgba(157, 80, 255, 0.4)',
          accent: 'var(--accent-purple)',
          corePulse: 1.6,
          speed: 0.9,
          eyeScale: 0.85,
          ringOpacity: 0.35,
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
          glow: 'var(--gemigram-glow)',
          accent: 'var(--gemigram-neon)',
          corePulse: 1 + volume * 1.2,
          speed: 1.4,
          eyeScale: 1.25,
          ringOpacity: 0.7,
        };
      default:
        return {
          glow: 'rgba(255, 255, 255, 0.05)',
          accent: 'var(--text-tertiary)',
          corePulse: 1,
          speed: 4.5,
          eyeScale: 0,
          ringOpacity: 0.15,
        };
    }
  }, [state, volume, isLocal]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden" ref={containerRef}>
      {/* Liquid Gooey Filters */}
      <svg className="absolute w-0 h-0 invisible">
        <defs>
          <filter id="liquid-gooey">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
          <radialGradient id="obsidian-shine" cx="30%" cy="30%" r="50%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
      </svg>
      
      {/* Background Atmosphere - Sovereign Void */}
      <div className="absolute inset-0 bg-theme-primary overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_120%,var(--gemigram-neon)_0%,transparent_50%)]" />
      </div>
      
      {/* Neural Link Status Decor */}
      <AnimatePresence>
        {state !== 'Disconnected' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="absolute top-10 left-1/2 -translate-x-1/2 flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-white/10 bg-black/40 backdrop-blur-xl z-20 shadow-[0_0_30px_rgba(0,0,0,0.5)]"
          >
            <ShieldCheck className={`w-3 h-3 ${isLocal ? 'text-purple-400' : 'text-gemigram-neon'}`} />
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/60">
              {isLocal ? 'Sovereign Local Spine' : 'Direct Cloud Neural'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 flex flex-col items-center">
        {/* The Entity Core Orbit */}
        <div className="relative flex items-center justify-center">
          {/* Reaction Ring - High Precision */}
          <motion.div 
            className="absolute rounded-full border border-white/5"
            animate={{ 
              width: [380, 420, 380],
              height: [380, 420, 380],
              rotate: 360,
              opacity: stateConfig.ringOpacity
            }}
            transition={{ 
              rotate: { duration: 30, repeat: Infinity, ease: "linear" },
              width: { duration: 4, repeat: Infinity, ease: "easeInOut" },
              height: { duration: 4, repeat: Infinity, ease: "easeInOut" }
            }}
          />

          {/* Liquid Obsidian Mascot - The 11/10 Asset */}
          <motion.div 
            className="relative w-80 h-[500px] flex flex-col items-center justify-center"
            style={{ filter: "url(#liquid-gooey)" }}
            animate={{ 
              y: [0, -20, 0],
            }}
            transition={{ 
              duration: stateConfig.speed * 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            {/* The Head - Liquid Singularity */}
            <motion.div 
              className="relative w-32 h-36 mb-6 rounded-[50px] bg-black/90 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] border border-white/5 flex items-center justify-center overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #050505 0%, #1a1a1a 100%)'
              }}
            >
              {/* Internal Refraction Surface */}
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.1),transparent_60%)]" />
              
              {/* Sovereign Eyes - High Specular */}
              <div className="flex gap-6 z-10">
                <motion.div 
                  className="w-3 h-3 rounded-full bg-white shadow-[0_0_20px_#fff,0_0_40px_var(--gemigram-neon)]"
                  animate={{ 
                    scale: stateConfig.eyeScale,
                    opacity: state === 'Thinking' ? [0.4, 1, 0.4] : 1,
                  }}
                  transition={{ 
                    duration: state === 'Thinking' ? 0.3 : 2, 
                    repeat: Infinity 
                  }}
                />
                <motion.div 
                  className="w-3 h-3 rounded-full bg-white shadow-[0_0_20px_#fff,0_0_40px_var(--gemigram-neon)]"
                  animate={{ 
                    scale: stateConfig.eyeScale,
                    opacity: state === 'Thinking' ? [0.4, 1, 0.4] : 1,
                  }}
                  transition={{ 
                    duration: state === 'Thinking' ? 0.3 : 2, 
                    repeat: Infinity 
                  }}
                />
              </div>

              {/* Reactive Core Glow */}
              <AnimatePresence>
                {(state === 'Speaking' || state === 'Executing') && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--gemigram-neon)_0%,transparent_70%)] opacity-20 blur-xl"
                  />
                )}
              </AnimatePresence>
            </motion.div>
            
            {/* Torso - Liquid Volume */}
            <motion.div 
              className="relative w-56 h-80 rounded-[80px] bg-black/90 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8),inset_0_0_30px_rgba(255,255,255,0.02)] overflow-hidden flex items-center justify-center"
              animate={{
                borderRadius: state === 'Speaking' ? ["80px", "60px", "80px"] : "80px"
              }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              {/* The Singularity Light */}
              <motion.div
                className="absolute w-32 h-32 rounded-full blur-[50px]"
                style={{ backgroundColor: stateConfig.accent }}
                animate={{ 
                  scale: [1, stateConfig.corePulse, 1],
                  opacity: [0.2, 0.6, 0.2],
                }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* Mirror Shine Overlay */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.1),transparent_70%)] pointer-events-none" />

              <Radio className={`w-32 h-32 opacity-10 text-white ${state === 'Speaking' ? 'animate-pulse' : ''}`} />
            </motion.div>

            {/* Ghost Limbs (Liquid Tendrils) */}
            <motion.div 
              className="absolute top-48 -left-16 w-24 h-64 border-l-2 border-white/10 rounded-l-full blur-[4px]"
              animate={{ rotate: state === 'Speaking' ? [-15, -25, -15] : -15 }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className="absolute top-48 -right-16 w-24 h-64 border-r-2 border-white/10 rounded-r-full blur-[4px]"
              animate={{ rotate: state === 'Speaking' ? [15, 25, 15] : 15 }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
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
            <div className="flex items-center gap-3 px-4 py-1.5 rounded-full border border-white/5 glass-subtle backdrop-blur-md">
              <div className={`w-2 h-2 rounded-full shadow-[0_0_12px_currentColor] ${
                state === 'Disconnected' ? 'text-white/10 bg-white/10' : 
                state === 'Listening' ? 'text-gemigram-neon bg-gemigram-neon animate-pulse' :
                state === 'Thinking' ? 'text-purple-400 bg-purple-400 animate-pulse' :
                'text-gemigram-neon bg-gemigram-neon animate-bounce'
              }`} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">
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
