'use client';

import { motion } from 'framer-motion';
import { Activity, Shield, Zap, Cpu } from 'lucide-react';

interface AgentCardProps {
  name: string;
  status: 'sleeping' | 'working' | 'connected';
  role?: string;
  color?: 'cyan' | 'purple' | 'emerald';
  onClick?: () => void;
}

export function AgentCard({ name, status, role = 'General Intelligence', color = 'cyan', onClick }: AgentCardProps) {
  const colorMap = {
    cyan: {
      gradient: 'from-cyan-500 to-blue-600',
      glow: 'rgba(6, 182, 212, 0.4)',
      text: 'text-cyan-400'
    },
    purple: {
      gradient: 'from-purple-500 to-pink-600',
      glow: 'rgba(168, 85, 247, 0.4)',
      text: 'text-purple-400'
    },
    emerald: {
      gradient: 'from-emerald-500 to-teal-600',
      glow: 'rgba(16, 185, 129, 0.4)',
      text: 'text-emerald-400'
    },
  };

  const statusColorMap = {
    sleeping: 'bg-slate-500',
    working: 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]',
    connected: 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]',
  };

  const isWorking = status === 'working' || status === 'connected';

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="relative group cursor-pointer aspect-[3/4] rounded-[3rem] sovereign-glass overflow-hidden flex flex-col p-8 transition-all duration-700 hover:shadow-[0_40px_80px_rgba(0,0,0,0.6),0_0_50px_rgba(16,255,135,0.1)] border border-white/5 hover:border-gemigram-neon/20"
    >
      {/* Background Decor */}
      <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity">
        <Cpu className="w-24 h-24 text-gemigram-neon" />
      </div>

      {/* The Core (Hex Pulse) */}
      <div className="relative w-20 h-20 mb-8 flex items-center justify-center self-center mt-4">
        <motion.div
          animate={{
            scale: isWorking ? [1, 1.2, 1] : [1, 1.05, 1],
            opacity: isWorking ? [0.4, 0.8, 0.4] : [0.2, 0.4, 0.2],
            rotate: isWorking ? 90 : 0
          }}
          transition={{
            duration: status === 'working' ? 2 : 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className={`absolute inset-0 rounded-3xl blur-2xl bg-gradient-to-br ${colorMap[color].gradient}`}
        />
        <div className={`relative z-10 w-10 h-10 rounded-2xl bg-gradient-to-br ${colorMap[color].gradient} shadow-2xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-500`}>
          <Zap className="w-5 h-5 text-white" />
        </div>
        
        {/* Waveform Visualization */}
        {isWorking && (
          <div className="absolute -bottom-6 flex items-end gap-0.5 h-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <motion.div
                key={i}
                animate={{ height: [4, 16, 4] }}
                transition={{ duration: 0.5 + i * 0.1, repeat: Infinity }}
                className={`w-1 rounded-full bg-gradient-to-t ${colorMap[color].gradient} opacity-50`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Metadata */}
      <div className="flex-1 flex flex-col">
        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-1">
          Entity Class
        </div>
        <h3 className="text-2xl font-black text-white tracking-tight mb-2 group-hover:text-cyan-400 transition-colors">
          {name}
        </h3>
        <p className="text-xs text-slate-400 font-medium leading-relaxed line-clamp-2 mb-4">
          {role}
        </p>
      </div>
      
      {/* Footer Stats */}
      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/5 backdrop-blur-md">
          <div className={`w-1.5 h-1.5 rounded-full ${statusColorMap[status]} ${status === 'working' ? 'animate-pulse' : ''}`} />
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-300">
            {status}
          </span>
        </div>
        
        <div className="flex gap-1.5">
          <div className="p-2 rounded-lg bg-white/[0.03] border border-white/5 text-slate-500 hover:text-white transition-colors">
            <Activity className="w-3 h-3" />
          </div>
          <div className="p-2 rounded-lg bg-white/[0.03] border border-white/5 text-slate-500 hover:text-white transition-colors">
            <Shield className="w-3 h-3" />
          </div>
        </div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
    </motion.div>
  );
}
