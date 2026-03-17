'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Mic, Brain, Shield, Activity,
  Terminal, Radio, Waves, Settings2, SlidersHorizontal
} from 'lucide-react';
import { CinematicDeploy } from './ui/CinematicDeploy';
import { useForgeLogic, VoiceState, AgentFormData } from '@/lib/hooks/useForgeLogic';


// Using types from useForgeLogic hook

interface ForgeArchitectProps {
  onComplete: (data: AgentFormData) => void;
  onCancel: () => void;
}

const VOICES = ['Zephyr', 'Kore', 'Charon', 'Puck', 'Fenrir'];

export default function ForgeArchitect({ onComplete, onCancel }: ForgeArchitectProps) {
  const {
    formData,
    voiceState,
    transcript,
    showDeployment,
    speak,
    startListening,
    finalizeMaterialization,
    resynthesize
  } = useForgeLogic();


  return (
    <div className="w-full h-full flex items-center justify-center relative overflow-hidden bg-black selection:bg-gemigram-neon/30">
      {/* Dynamic Background Noise */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

      <AnimatePresence mode="wait">
        {!showDeployment ? (
          <motion.div 
            key="architect"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full h-full max-w-7xl max-h-[90vh] glass-strong border border-gemigram-neon/20 rounded-[3rem] shadow-[0_0_50px_rgba(0,0,0,0.8)] relative flex flex-col overflow-hidden m-8"
          >
            {/* Ambient Lighting */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-gemigram-neon/5 blur-[150px] rounded-full pointer-events-none mix-blend-screen" />

            {/* Header HUD */}
            <div className="p-8 flex items-center justify-between border-b border-white/5 relative z-10 bg-black/40 backdrop-blur-xl">
               <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-gemigram-neon/10 border border-gemigram-neon/30 flex items-center justify-center shadow-[0_0_20px_rgba(57,255,20,0.1)]">
                    <Sparkles className="w-6 h-6 text-gemigram-neon animate-pulse" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-black text-white uppercase tracking-widest drop-shadow-md">Aether_Forge</h1>
                    <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] font-mono text-gemigram-neon/80 uppercase tracking-[0.3em]">Voice_Synthesis_Active</span>
                        <div className="flex gap-1">
                            <span className={`w-1.5 h-1.5 rounded-full ${voiceState.status === 'listening' ? 'bg-red-500 animate-pulse shadow-[0_0_8px_red]' : 'bg-white/20'}`} />
                            <span className={`w-1.5 h-1.5 rounded-full ${voiceState.status === 'processing' ? 'bg-neon-blue animate-pulse shadow-[0_0_8px_#00f0ff]' : 'bg-white/20'}`} />
                            <span className={`w-1.5 h-1.5 rounded-full ${voiceState.status === 'speaking' ? 'bg-gemigram-neon animate-pulse shadow-[0_0_8px_#39ff14]' : 'bg-white/20'}`} />
                        </div>
                    </div>
                  </div>
               </div>

               <button
                 onClick={onCancel}
                 className="px-6 py-2 border border-red-500/30 text-[10px] font-black uppercase tracking-[0.2em] text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all"
               >
                 Abort_Protocol
               </button>
            </div>

            {/* Main Interface Layout */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 relative z-10">

               {/* LEFT PANEL: Neural Node Status */}
               <div className="hidden lg:flex lg:col-span-4 border-r border-white/5 bg-black/40 backdrop-blur-md p-8 flex-col justify-between">
                    <div>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mb-8 flex items-center gap-2">
                           <Activity className="w-4 h-4 text-gemigram-neon" /> Cortex_Monitoring
                        </h3>

                        <div className="space-y-6">
                           <InferenceNode label="Acoustic_Model" active={voiceState.status === 'listening' || voiceState.status === 'speaking'} />
                           <InferenceNode label="Semantic_Parser" active={voiceState.status === 'processing'} />
                           <InferenceNode label="Persona_Mapping" active={voiceState.currentStep === 'synthesis' || voiceState.currentStep === 'blueprint'} />
                           <InferenceNode label="Skill_Extraction" active={voiceState.currentStep === 'synthesis' || voiceState.currentStep === 'blueprint'} />
                           <InferenceNode label="Memory_Imprinting" active={voiceState.currentStep === 'blueprint'} />
                        </div>
                    </div>

                    <div className="glass-medium p-6 rounded-3xl border border-white/10 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-gemigram-neon/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <h4 className="text-[8px] font-black uppercase tracking-[0.3em] text-gemigram-neon mb-4">Live_Telemetry</h4>
                        <div className="flex items-end gap-1 h-12">
                            {[...Array(16)].map((_, i) => (
                            <motion.div
                                key={i}
                                animate={{
                                height: voiceState.status === 'processing' ? [Math.random() * 40 + 10, Math.random() * 40 + 10] :
                                        voiceState.status === 'listening' ? [10, 40, 10] : 8,
                                opacity: [0.3, 0.8, 0.3]
                                }}
                                transition={{
                                duration: voiceState.status === 'processing' ? 0.2 : 1.5,
                                repeat: Infinity,
                                delay: i * 0.05
                                }}
                                className="flex-1 bg-gemigram-neon/50 rounded-t-sm"
                            />
                            ))}
                        </div>
                    </div>
               </div>

               {/* RIGHT PANEL: Voice Interaction & Blueprint */}
               <div className="col-span-1 lg:col-span-8 p-8 md:p-12 overflow-y-auto no-scrollbar relative flex flex-col items-center justify-center">

                    <AnimatePresence mode="wait">
                        {/* STATE 1: Listening / Speaking / Processing */}
                        {(voiceState.currentStep === 'intro' || voiceState.currentStep === 'description' || voiceState.currentStep === 'synthesis') && (
                            <motion.div
                                key="voice-capture"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
                                className="flex flex-col items-center text-center w-full max-w-2xl"
                            >
                                <motion.div
                                    animate={{
                                    scale: voiceState.status === 'listening' ? [1, 1.1, 1] :
                                            voiceState.status === 'processing' ? [1, 1.05, 1] : 1,
                                    rotate: voiceState.status === 'processing' ? 360 : 0,
                                    boxShadow: voiceState.status === 'listening' ? ['0 0 40px rgba(255,50,50,0.2)', '0 0 80px rgba(255,50,50,0.6)', '0 0 40px rgba(255,50,50,0.2)'] :
                                                voiceState.status === 'processing' ? ['0 0 40px rgba(0,240,255,0.2)', '0 0 80px rgba(0,240,255,0.6)', '0 0 40px rgba(0,240,255,0.2)'] : 'none'
                                    }}
                                    transition={{ duration: voiceState.status === 'processing' ? 4 : 2, repeat: Infinity, ease: "easeInOut" }}
                                    onClick={() => {
                                        if (voiceState.status === 'idle' || voiceState.status === 'listening') startListening();
                                    }}
                                    className={`w-40 h-40 rounded-full border-2 border-dashed flex items-center justify-center relative mb-12 cursor-pointer backdrop-blur-xl ${
                                        voiceState.status === 'listening' ? 'border-red-500/50 bg-red-500/5' :
                                        voiceState.status === 'processing' ? 'border-neon-blue/50 bg-neon-blue/5' :
                                        'border-gemigram-neon/30 bg-gemigram-neon/5 hover:bg-gemigram-neon/10'
                                    }`}
                                >
                                    {/* Inner Core */}
                                    <div className={`absolute inset-4 rounded-full border ${
                                        voiceState.status === 'listening' ? 'border-red-500/30' :
                                        voiceState.status === 'processing' ? 'border-neon-blue/30' :
                                        'border-gemigram-neon/20'
                                    }`} />

                                    {voiceState.status === 'processing' ? <Brain className="w-16 h-16 text-neon-blue animate-pulse" /> :
                                     voiceState.status === 'listening' ? <Mic className="w-16 h-16 text-red-500" /> :
                                     <Radio className="w-16 h-16 text-gemigram-neon" />}
                                </motion.div>

                                <div className="space-y-4 w-full">
                                    <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">
                                        {voiceState.status === 'listening' ? 'Awaiting_Input...' :
                                         voiceState.status === 'processing' ? 'Synthesizing_Entity...' :
                                         'Voice_Uplink'}
                                    </h2>
                                    <div className="h-32 w-full glass-medium rounded-3xl border border-white/5 p-6 flex items-center justify-center overflow-hidden relative">
                                        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(255,255,255,0.02),transparent)] opacity-50 animate-[scanline_2s_linear_infinite]" />
                                        <p className="text-lg md:text-xl font-mono text-white/80 text-center italic leading-relaxed drop-shadow-md z-10">
                                            {transcript || (voiceState.status === 'listening' ? "Speak clearly into the receptor..." : "Initiate neural link to begin transcription.")}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* STATE 2: Blueprint Confirmation */}
                        {voiceState.currentStep === 'blueprint' && (
                            <motion.div
                                key="blueprint-review"
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="w-full max-w-3xl space-y-10"
                            >
                                <div className="text-center space-y-2 mb-12">
                                    <h2 className="text-4xl font-black text-white uppercase tracking-tighter drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">Blueprint_Extracted</h2>
                                    <p className="text-[10px] font-mono text-gemigram-neon/80 uppercase tracking-[0.4em]">Review Synaptic Configuration</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* ID Card */}
                                    <div className="glass-medium p-8 rounded-[2.5rem] border border-white/10 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-neon-blue/10 blur-[50px] rounded-full mix-blend-screen" />
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-neon-blue/80 mb-2">Designation</p>
                                        <h3 className="text-3xl font-black text-white uppercase tracking-tighter truncate">{formData.name}</h3>
                                        <p className="text-sm font-medium text-white/50 mt-1 truncate">{formData.role}</p>
                                    </div>

                                    {/* Persona Core */}
                                    <div className="glass-medium p-8 rounded-[2.5rem] border border-white/10 relative overflow-hidden flex items-center gap-6">
                                        <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.2)]">
                                            <Shield className="w-8 h-8 text-purple-400" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-400/80 mb-1">Persona_Core</p>
                                            <p className="text-xl font-black text-white uppercase tracking-widest">{formData.persona}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Skills & Directives */}
                                <div className="glass-medium p-8 rounded-[2.5rem] border border-white/10 space-y-8">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gemigram-neon/80 mb-4 flex items-center gap-2">
                                            <Settings2 className="w-4 h-4" /> Integrated_Capabilities
                                        </p>
                                        <div className="flex flex-wrap gap-3">
                                            {Object.keys(formData.skills).map(t => (
                                                <span key={t} className="px-5 py-2 glass-strong border border-gemigram-neon/30 rounded-full text-xs font-bold text-gemigram-neon uppercase tracking-widest shadow-[0_0_15px_rgba(57,255,20,0.1)]">
                                                    {t}
                                                </span>
                                            ))}
                                            {Object.keys(formData.tools).map(t => (
                                                <span key={t} className="px-5 py-2 glass-strong border border-neon-blue/30 rounded-full text-xs font-bold text-neon-blue uppercase tracking-widest shadow-[0_0_15px_rgba(0,240,255,0.1)]">
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {formData.rules && formData.rules.length > 0 && (
                                        <div className="pt-6 border-t border-white/5">
                                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-400/80 mb-4">Hardcoded_Directives</p>
                                            <ul className="space-y-3">
                                                {formData.rules.map((rule, idx) => (
                                                    <li key={idx} className="flex items-start gap-3 text-sm text-white/70 font-mono">
                                                        <span className="text-amber-400 mt-1">▹</span> {rule}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                <div className="pt-4 flex gap-6">
                                    <button
                                        onClick={() => {
                                            resynthesize();
                                            speak("Re-initiating neural capture. Describe the entity.");
                                        }}
                                        className="px-8 py-5 glass-medium border border-white/10 text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-3"
                                    >
                                        <Radio className="w-4 h-4" /> Resynthesize
                                    </button>
                                    <button
                                        onClick={finalizeMaterialization}
                                        className="flex-1 py-5 bg-gemigram-neon text-black font-black uppercase tracking-[0.4em] text-sm rounded-2xl shadow-[0_0_40px_rgba(57,255,20,0.4)] hover:shadow-[0_0_60px_rgba(57,255,20,0.6)] hover:scale-[1.02] transition-all flex items-center justify-center gap-3 group"
                                    >
                                        <Sparkles className="w-5 h-5 group-hover:animate-spin" /> Materialize_Entity
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
               </div>
            </div>
          </motion.div>
        ) : (
          <CinematicDeploy 
            agentName={formData.name} 
            onComplete={() => onComplete(formData)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function InferenceNode({ label, active }: { label: string; active: boolean }) {
  return (
    <div className="flex items-center justify-between group py-1">
       <span className={`text-[9px] font-black uppercase tracking-[0.2em] transition-colors ${active ? 'text-gemigram-neon drop-shadow-[0_0_8px_rgba(57,255,20,0.5)]' : 'text-white/30'}`}>{label}</span>
       <div className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${active ? 'bg-gemigram-neon animate-pulse shadow-[0_0_10px_#39ff14] scale-150' : 'bg-white/10'}`} />
    </div>
  );
}
