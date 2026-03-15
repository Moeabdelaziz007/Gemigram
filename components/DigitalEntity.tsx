'use client';

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Brain, Cpu, Activity } from 'lucide-react';

interface DigitalEntityProps {
  state: 'Disconnected' | 'Listening' | 'Thinking' | 'Speaking';
  volume: number;
  agentName: string;
}

export function DigitalEntity({ state, volume, agentName }: DigitalEntityProps) {
  // State Matrix for animations
  const [threadConfigs] = React.useState(() => Array.from({ length: 10 }).map(() => ({
    duration: 2 + Math.random() * 2,
    delay: Math.random() * 2
  })));

  const stateConfig = useMemo(() => {
    switch (state) {
      case 'Listening':
        return {
          color: 'from-cyan-400 to-blue-600',
          glow: 'shadow-[0_0_50px_rgba(34,211,238,0.4)]',
          scale: 1 + volume * 0.2,
          rotation: -5, // Leaning head
          corePulse: 1.5,
        };
      case 'Thinking':
        return {
          color: 'from-fuchsia-400 to-purple-600',
          glow: 'shadow-[0_0_60px_rgba(192,38,211,0.5)]',
          scale: 1.05,
          rotation: 0,
          corePulse: 2.5, // Heartbeat pulse
        };
      case 'Speaking':
        return {
          color: 'from-emerald-400 to-cyan-500',
          glow: 'shadow-[0_0_50px_rgba(52,211,153,0.4)]',
          scale: 1 + volume * 0.5,
          rotation: 5,
          corePulse: 1.2,
        };
      default:
        return {
          color: 'from-slate-700 to-slate-900',
          glow: 'shadow-none',
          scale: 1,
          rotation: 0,
          corePulse: 1,
        };
    }
  }, [state, volume]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 bg-[#030303]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.03)_0%,transparent_70%)]" />
      
      {/* The Entity Container */}
      <motion.div 
        className="relative z-10 flex flex-col items-center"
        animate={{ 
          scale: stateConfig.scale,
          rotate: stateConfig.rotation,
          y: [0, -10, 0]
        }}
        transition={{ 
          scale: { type: 'spring', stiffness: 300, damping: 20 },
          rotate: { type: 'spring', stiffness: 100, damping: 10 },
          y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        {/* Humanoid Silhouette (CSS/SVG Hybrid) */}
        <div className="relative w-64 h-96 flex flex-col items-center">
          {/* Head */}
          <motion.div 
            className={`w-20 h-24 rounded-full bg-gradient-to-b ${stateConfig.color} blur-[2px] opacity-80`}
            animate={{ y: [0, 2, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          
          {/* Neck */}
          <div className={`w-4 h-6 bg-gradient-to-b ${stateConfig.color} opacity-40 blur-[1px]`} />
          
          {/* Torso */}
          <motion.div 
            className={`w-40 h-56 rounded-[40px] bg-gradient-to-b ${stateConfig.color} opacity-60 blur-[3px] relative overflow-hidden`}
          >
            {/* Data Threads Effect */}
            <div className="absolute inset-0 opacity-30">
              {Array.from({ length: 10 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-px h-full bg-white"
                  style={{ left: `${i * 10}%` }}
                  animate={{ 
                    y: ['-100%', '100%'],
                    opacity: [0, 1, 0]
                  }}
                  transition={{ 
                    duration: threadConfigs[i].duration, 
                    repeat: Infinity, 
                    delay: threadConfigs[i].delay 
                  }}
                />
              ))}
            </div>

            {/* Glowing Core (Heartbeat) */}
            <motion.div 
              className="absolute top-1/3 left-1/2 -translate-x-1/2 w-16 h-16 bg-white rounded-full blur-[15px]"
              animate={{ 
                scale: [1, stateConfig.corePulse, 1],
                opacity: [0.4, 0.8, 0.4]
              }}
              transition={{ 
                duration: state === 'Thinking' ? 0.8 : 2, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            />
          </motion.div>

          {/* Arms (Abstract) */}
          <div className="absolute top-32 -left-8 w-12 h-48 bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent blur-[5px] rounded-full rotate-12" />
          <div className="absolute top-32 -right-8 w-12 h-48 bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent blur-[5px] rounded-full -rotate-12" />
        </div>

        {/* Waves for Speaking */}
        <AnimatePresence>
          {state === 'Speaking' && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {Array.from({ length: 3 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full border border-cyan-400/30"
                  initial={{ width: 100, height: 100, opacity: 0.5 }}
                  animate={{ width: 600, height: 600, opacity: 0 }}
                  transition={{ duration: 2, delay: i * 0.6, repeat: Infinity, ease: "easeOut" }}
                />
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Name Tag */}
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h2 className="text-3xl font-black tracking-[0.2em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">
            {agentName}
          </h2>
          <div className="flex items-center justify-center gap-2 mt-2">
            <div className={`w-2 h-2 rounded-full ${state !== 'Disconnected' ? 'bg-cyan-400 animate-pulse' : 'bg-red-500'}`} />
            <span className="text-xs font-mono tracking-widest text-slate-500 uppercase">{state}</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Orbiting Widgets (Satellites) */}
      <div className="absolute inset-0 pointer-events-none">
        {['Memory', 'Neural', 'Aether', 'Core'].map((label, i) => (
          <motion.div
            key={label}
            className="absolute top-1/2 left-1/2 w-32 h-16 rounded-2xl quantum-glass border border-white/10 flex items-center justify-center gap-2"
            animate={{ 
              rotate: 360,
              x: Math.cos(i * 90 * Math.PI / 180) * 350,
              y: Math.sin(i * 90 * Math.PI / 180) * 350,
            }}
            transition={{ 
              rotate: { duration: 30 + i * 5, repeat: Infinity, ease: "linear" },
              x: { duration: 0 },
              y: { duration: 0 }
            }}
          >
            {i === 0 && <Brain className="w-4 h-4 text-purple-400" />}
            {i === 1 && <Cpu className="w-4 h-4 text-cyan-400" />}
            {i === 2 && <Zap className="w-4 h-4 text-emerald-400" />}
            {i === 3 && <Activity className="w-4 h-4 text-fuchsia-400" />}
            <span className="text-[10px] font-mono tracking-widest uppercase text-white/60">{label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
