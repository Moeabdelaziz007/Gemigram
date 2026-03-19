'use client';

import { motion } from "framer-motion";
import { Cpu, Terminal, Zap, ShieldCheck } from "lucide-react";

const HEARTBEATS = [
  { id: 1, agent: "Atlas", action: "Neural Sync Complete", time: "just now", icon: Zap },
  { id: 2, agent: "System", action: "gws: Gmail Indexing", time: "2m ago", icon: Terminal },
  { id: 3, agent: "Nova", action: "Memory Consolidation", time: "5m ago", icon: Cpu },
  { id: 4, agent: "Sovereign", action: "Protocol V2.0 Active", time: "12m ago", icon: ShieldCheck },
  { id: 5, agent: "Orion", action: "Grounding: Google Search", time: "15m ago", icon: Zap },
];

export default function NeuralPulse() {
  return (
    <div className="w-full max-w-sm glass-medium rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
      <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
        <span className="text-[10px] uppercase tracking-widest font-black text-gemigram-neon opacity-60">Neural Pulse</span>
        <div className="flex gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-gemigram-neon animate-pulse shadow-[0_0_8px_var(--gemigram-neon)]" />
          <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
        </div>
      </div>
      
      <div className="h-48 overflow-hidden relative">
        <motion.div
          animate={{ y: ["0%", "-50%"] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="flex flex-col"
        >
          {[...HEARTBEATS, ...HEARTBEATS].map((beat, i) => (
            <div 
              key={`${beat.id}-${i}`} 
              className="px-4 py-3 border-b border-white/[0.03] flex items-center gap-3 group hover:bg-white/[0.02] transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-aether-carbon flex items-center justify-center border border-white/5 group-hover:border-aether-neon/30 transition-colors">
                <beat.icon className="w-4 h-4 text-aether-neon opacity-50 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                  <span className="text-xs font-bold text-white/90">{beat.agent}</span>
                  <span className="text-[10px] text-white/30">{beat.time}</span>
                </div>
                <p className="text-[11px] text-white/50 truncate font-mono">{beat.action}</p>
              </div>
            </div>
          ))}
        </motion.div>
        
        {/* Shading Overlays */}
        <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-aether-carbon/80 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-aether-carbon/80 to-transparent pointer-events-none" />
      </div>
    </div>
  );
}
