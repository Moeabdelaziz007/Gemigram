'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Cpu, HardDrive, Network, Zap, Settings, Volume2 } from 'lucide-react';
import { DigitalEntity } from './DigitalEntity';
import type { Agent, TranscriptMessage } from '../lib/store/useAetherStore';

interface SovereignDashboardProps {
  activeAgent: Agent | null;
  volume: number;
  status: string;
  linkType: string;
  transcript: TranscriptMessage[];
}

export function SovereignDashboard({ 
  activeAgent, 
  volume, 
  status, 
  linkType,
  transcript 
}: SovereignDashboardProps) {
  return (
    <div className="relative w-full h-full flex flex-col gap-6 p-6 overflow-hidden bg-industrial selection:bg-gemigram-neon/20">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-[20%] left-[30%] w-[40vw] h-[40vw] bg-gemigram-neon/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-[20%] right-[30%] w-[40vw] h-[40vw] bg-fuchsia-500/5 rounded-full blur-[150px]" />
      </div>

      <div className="grid grid-cols-12 gap-6 h-full relative z-10">
        {/* LEFT COLUMN: Telemetry & System Health */}
        <div className="col-span-3 flex flex-col gap-6">
          <div className="sovereign-glass p-8 rounded-[2.5rem] border border-white/5 flex flex-col gap-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mb-2">System_Telemetry</h3>
            
            <TelemetryItem 
              icon={Cpu} 
              label="Neural_Core_Load" 
              value={42} 
              color="gemigram-neon" 
            />
            <TelemetryItem 
              icon={HardDrive} 
              label="Synaptic_Buffer" 
              value={68} 
              color="blue-400" 
            />
            <TelemetryItem 
              icon={Network} 
              label="Network_Bandwidth" 
              value={12} 
              color="fuchsia-500" 
            />
          </div>

          <div className="sovereign-glass p-8 rounded-[2.5rem] border border-white/5 flex-1 overflow-hidden flex flex-col">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mb-6">Data_Streams</h3>
            <div className="flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
              {transcript.slice(-5).map((msg, i) => (
                <div key={i} className="flex flex-col gap-1 border-b border-white/5 pb-4">
                  <span className={`text-[8px] font-black uppercase tracking-widest ${msg.role === 'user' ? 'text-gemigram-neon' : 'text-blue-400'}`}>
                    {msg.role === 'user' ? 'Input' : 'Entity'}
                  </span>
                  <p className="text-[11px] text-white/60 leading-relaxed truncate">{msg.content}</p>
                </div>
              ))}
              {transcript.length === 0 && (
                <div className="text-[10px] text-white/20 font-mono italic">Waiting for telemetry signal...</div>
              )}
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: The Neural Hub */}
        <div className="col-span-6 flex flex-col items-center justify-center relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 text-center">
            <span className="text-[9px] font-black uppercase tracking-[1em] text-white/20 mb-2 block">Sovereign_Active</span>
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter neon-shimmer">{activeAgent?.name || 'Null_Signature'}</h2>
          </div>

          {/* Curved Neural Interface Container */}
          <div className="relative w-full aspect-square flex items-center justify-center">
            {/* Curvilinear accent borders matching reference image */}
            <div className="absolute inset-0 border-[40px] border-white/5 rounded-full pointer-events-none opacity-40 mix-blend-overlay" />
            <div className="absolute inset-10 border-[1px] border-gemigram-neon/20 rounded-full animate-spin [animation-duration:20s]" />
            <div className="absolute inset-20 border-[1px] border-white/10 rounded-full animate-spin [animation-duration:30s] direction-reverse" />
            
            <DigitalEntity 
              state={status as any}
              volume={volume}
              agentName={activeAgent?.name}
              linkType={linkType}
            />
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-12 bg-black/40 backdrop-blur-xl px-12 py-6 rounded-full border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
             <div className="flex flex-col items-center">
                <span className="text-[8px] font-black text-white/30 uppercase tracking-widest mb-1">Latency</span>
                <span className="text-xs font-mono font-bold text-gemigram-neon">42ms</span>
             </div>
             <div className="w-[1px] h-8 bg-white/10" />
             <div className="flex flex-col items-center">
                <span className="text-[8px] font-black text-white/30 uppercase tracking-widest mb-1">Stability</span>
                <span className="text-xs font-mono font-bold text-gemigram-neon">99.8%</span>
             </div>
             <div className="w-[1px] h-8 bg-white/10" />
             <div className="flex flex-col items-center">
                <span className="text-[8px] font-black text-white/30 uppercase tracking-widest mb-1">Orchestrator</span>
                <span className="text-xs font-mono font-bold text-gemigram-neon">Stable</span>
             </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Voice Synthesis & Controls */}
        <div className="col-span-3 flex flex-col gap-6">
          <div className="sovereign-glass p-8 rounded-[2.5rem] border border-white/5 flex flex-col gap-8">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Voice_Synthesis</h3>
              <Settings className="w-4 h-4 text-white/20 hover:text-white transition-colors cursor-pointer" />
            </div>

            <div className="flex flex-col gap-8">
              <SynthesisSlider label="Pitch_Calibration" value={72} color="gemigram-neon" />
              <SynthesisSlider label="Timbre_Resonance" value={45} color="gemigram-neon" />
              <SynthesisSlider label="Semantic_Density" value={88} color="gemigram-neon" />
              <SynthesisSlider label="Neural_Filter" value={24} color="gemigram-neon" />
            </div>

            <div className="mt-4 pt-8 border-t border-white/5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Realtime_Output</span>
                <Zap className="w-3 h-3 text-gemigram-neon animate-pulse" />
              </div>
              <div className="h-24 bg-black/40 rounded-2xl border border-white/5 flex items-end justify-center p-4 gap-1">
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: volume > 0 ? [10, Math.random() * 40 + 20, 10] : 10 }}
                    transition={{ duration: 0.15, repeat: Infinity }}
                    className="w-1.5 bg-gemigram-neon rounded-full"
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="sovereign-glass p-8 rounded-[2.5rem] border border-white/5 flex-1 relative overflow-hidden group cursor-pointer hover:border-gemigram-neon/20 transition-all">
             <div className="absolute inset-0 bg-gemigram-neon/5 opacity-0 group-hover:opacity-100 transition-opacity" />
             <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mb-4">Entity_Identity</h3>
             <div className="aspect-square rounded-3xl bg-white/5 border border-white/5 overflow-hidden mb-4 p-4">
                <img src="/avatars/default.png" className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all" alt="" />
             </div>
             <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-white uppercase">{activeAgent?.role || 'Sovereign_Agent'}</span>
                <span className="text-[9px] font-mono text-white/30 truncate">{activeAgent?.id}</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TelemetryItem({ icon: Icon, label, value, color }: { icon: any, label: string, value: number, color: string }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon className={`w-4 h-4 text-${color}`} />
          <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">{label}</span>
        </div>
        <span className="text-[10px] font-mono font-bold text-white">{value}%</span>
      </div>
      <div className="telemetry-bar h-1.5 rounded-full overflow-hidden border border-white/10">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          className={`h-full bg-${color} shadow-[0_0_10px_rgba(0,0,0,0.5)]`}
        />
      </div>
    </div>
  );
}

function SynthesisSlider({ label, value, color }: { label: string, value: number, color: string }) {
  return (
    <div className="flex flex-col gap-3 group">
      <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-[0.2em]">
        <span className="text-white/30 group-hover:text-white/60 transition-colors">{label}</span>
        <span className="text-white group-hover:text-gemigram-neon transition-colors">{value}</span>
      </div>
      <div className="relative h-1 w-full bg-white/10 rounded-full overflow-hidden">
        <div 
          className="absolute inset-y-0 left-0 bg-gemigram-neon/50 group-hover:bg-gemigram-neon transition-colors" 
          style={{ width: `${value}%` }} 
        />
      </div>
    </div>
  );
}
