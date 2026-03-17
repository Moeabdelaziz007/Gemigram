'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Mic, MicOff, Brain, Zap, Activity,
  CheckCircle, AlertCircle, Radio, Terminal, Shield, Cpu
} from 'lucide-react';
import { Agent } from '@/lib/store/useAetherStore';
import { getRecommendedSkills, synthesizeAgentMetadata } from '@/lib/agents/skills-assignment';
import { matchPersonaFromDescription, enhanceSystemPromptWithPersona } from '@/lib/persona/persona-templates';
import { CinematicDeploy } from './ui/CinematicDeploy';

interface VoiceState {
  isListening: boolean;
  isSpeaking: boolean;
  currentStep: 'intro' | 'description' | 'synthesis' | 'blueprint' | 'complete';
  status: 'idle' | 'listening' | 'processing' | 'speaking' | 'complete';
}

interface AgentFormData {
  name: string;
  description: string;
  systemPrompt: string;
  voiceName: string;
  soul: string;
  role: string;
  tools: any;
  skills: any;
  persona?: string;
}

interface ForgeArchitectProps {
  onComplete: (data: AgentFormData) => void;
  onCancel: () => void;
}

const VOICES = ['Zephyr', 'Kore', 'Charon', 'Puck', 'Fenrir'];

export default function ForgeArchitect({ onComplete, onCancel }: ForgeArchitectProps) {
  const [formData, setFormData] = useState<AgentFormData>({
    name: '',
    description: '',
    systemPrompt: '',
    voiceName: 'Zephyr',
    soul: 'Analytical',
    role: '',
    tools: {},
    skills: {}
  });
  
  const [voiceState, setVoiceState] = useState<VoiceState>({
    isListening: false,
    isSpeaking: false,
    currentStep: 'intro',
    status: 'idle'
  });

  const [showDeployment, setShowDeployment] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      speak("Welcome to the Neural Forge. Describe the entity you wish to materialize.");
      setVoiceState(prev => ({ ...prev, currentStep: 'description' }));
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = 0.9;
      utterance.onstart = () => setVoiceState(prev => ({ ...prev, isSpeaking: true, status: 'speaking' }));
      utterance.onend = () => {
        setVoiceState(prev => ({ ...prev, isSpeaking: false, status: 'listening' }));
        if (voiceState.currentStep === 'description') startListening();
      };
      speechSynthesis.speak(utterance);
    }
  };

  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.onstart = () => setVoiceState(prev => ({ ...prev, isListening: true, status: 'listening' }));
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setVoiceState(prev => ({ ...prev, isListening: false, status: 'processing' }));
        handleSynthesis(transcript);
      };
      recognition.onerror = () => setVoiceState(prev => ({ ...prev, isListening: false, status: 'idle' }));
      recognition.start();
    }
  };

  const handleSynthesis = (transcript: string) => {
    setVoiceState(prev => ({ ...prev, currentStep: 'synthesis' }));
    
    // Core Neural Inference
    const { suggestedName, suggestedRole, tools } = synthesizeAgentMetadata(transcript);
    const skills = getRecommendedSkills(transcript, suggestedRole);
    const persona = matchPersonaFromDescription(transcript) || 'ANALYST';
    
    setTimeout(() => {
      setFormData({
        ...formData,
        name: suggestedName,
        description: transcript,
        role: suggestedRole,
        tools,
        skills,
        persona,
        systemPrompt: `You are ${suggestedName}, a ${suggestedRole}. Purpose: ${transcript}`
      });
      setVoiceState(prev => ({ ...prev, currentStep: 'blueprint', status: 'idle' }));
      speak(`Neural Synthesis complete. I have modeled ${suggestedName}. Review the blueprint before materialization.`);
    }, 2500);
  };

  const finalizeMaterialization = () => {
    const finalSystemPrompt = enhanceSystemPromptWithPersona(formData.systemPrompt, formData.persona || 'ANALYST');
    const finalData = { ...formData, systemPrompt: finalSystemPrompt };
    
    setShowDeployment(true);
  };

  return (
    <div className="w-full h-full flex items-center justify-center relative overflow-hidden selection:bg-gemigram-neon/30">
      <AnimatePresence mode="wait">
        {!showDeployment ? (
          <motion.div 
            key="architect"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.05, y: -20, filter: 'blur(10px)' }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="w-full max-w-6xl aspect-video glass-strong border border-gemigram-neon/20 rounded-[3rem] shadow-[0_0_50px_rgba(0,0,0,0.8)] relative flex flex-col overflow-hidden mx-6 bg-black/40 backdrop-blur-2xl"
          >
            {/* Dynamic inner glow */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 right-0 w-96 h-96 bg-gemigram-neon/10 blur-[100px] rounded-full mix-blend-screen" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-neon-blue/10 blur-[100px] rounded-full mix-blend-screen" />
            </div>
            {/* HUD Content Mapping to reference image style */}
            <div className="p-8 pb-0 flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gemigram-neon/10 border border-gemigram-neon/20 flex items-center justify-center">
                    <Brain className="w-5 h-5 text-gemigram-neon animate-pulse" />
                  </div>
                  <div>
                    <h1 className="text-sm font-black uppercase tracking-[0.3em] text-white">Gemi_Forge_v4</h1>
                    <p className="text-[8px] font-mono text-white/30 uppercase tracking-[0.2em]">Sovereign_Neural_Synthesis</p>
                  </div>
               </div>
               <button onClick={onCancel} className="text-[9px] font-black text-white/20 hover:text-white uppercase tracking-widest transition-colors mb-auto">Abort_Creation</button>
            </div>

            <div className="flex-1 grid grid-cols-12 gap-10 p-12 relative z-10">
              {/* Left Column: Synthesis Status */}
              <div className="col-span-4 flex flex-col gap-6 h-full">
                <div className="glass-medium p-8 rounded-[2.5rem] border border-white/10 bg-white/5 space-y-6 shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]">
                   <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gemigram-neon/60">Inference_Streams</h3>
                   
                   <InferenceNode label="Audio_Spectrogram" active={voiceState.status === 'listening' || voiceState.status === 'speaking'} />
                   <InferenceNode label="Semantic_Parsing" active={voiceState.status === 'processing'} />
                   <InferenceNode label="Identity_Synthesis" active={voiceState.currentStep === 'synthesis'} />
                   <InferenceNode label="Skill_Mapping" active={voiceState.currentStep === 'synthesis'} />
                </div>

                <div className="flex-1 flex flex-col items-center justify-center">
                   <motion.div 
                     animate={{ 
                       scale: voiceState.status === 'listening' ? [1, 1.15, 1] : 1,
                       rotate: voiceState.status === 'processing' ? 360 : 0,
                       boxShadow: voiceState.status === 'listening' ? ['0 0 20px rgba(57,255,20,0.2)', '0 0 40px rgba(57,255,20,0.6)', '0 0 20px rgba(57,255,20,0.2)'] : 'none'
                     }}
                     transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                     className={`w-32 h-32 rounded-full border border-dashed flex items-center justify-center relative bg-black/50 backdrop-blur-md ${voiceState.status === 'listening' ? 'border-gemigram-neon text-gemigram-neon' : 'border-white/20 text-white/30'}`}
                   >
                     {/* Inner glowing ring */}
                     <div className={`absolute inset-2 rounded-full border ${voiceState.status === 'listening' ? 'border-gemigram-neon/50 bg-gemigram-neon/10' : 'border-white/5 bg-white/5'}`} />
                      {voiceState.status === 'processing' ? <Brain className="w-12 h-12" /> : <Mic className="w-12 h-12" />}
                   </motion.div>
                   <div className="mt-8 glass-medium p-5 rounded-2xl border border-white/10 bg-black/40 w-full max-w-[240px]">
                      <h4 className="text-[8px] font-black uppercase tracking-widest text-gemigram-neon mb-3">Neural_Spectral_Analysis</h4>
                      <div className="flex items-end gap-1 h-12">
                         {[...Array(12)].map((_, i) => (
                           <motion.div 
                             key={i}
                             animate={{ 
                               height: voiceState.status === 'listening' ? [10, 40, 15, 30, 10] : 8,
                               opacity: [0.3, 0.6, 0.3]
                             }}
                             transition={{ 
                               duration: 1.5, 
                               repeat: Infinity, 
                               delay: i * 0.1,
                               ease: "easeInOut"
                             }}
                             className="flex-1 bg-gemigram-neon/30 rounded-t-sm"
                           />
                         ))}
                      </div>
                   </div>
                   <p className="mt-6 text-[10px] font-black uppercase tracking-[0.5em] text-white/20 text-center">Link_Status::Synchronized</p>
                </div>
              </div>

              {/* Center Column: Live Transcription / Synthesis Results */}
              <div className="col-span-8 overflow-hidden flex flex-col pt-4">
                 <AnimatePresence mode="wait">
                    {voiceState.currentStep === 'description' && (
                      <motion.div 
                        key="desc"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                      >
                         <h2 className="text-5xl font-black text-white uppercase tracking-tighter leading-none drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">Describe the_Entity</h2>
                         <div className="h-48 glass-medium rounded-[2.5rem] border border-white/10 p-8 font-mono text-base text-gemigram-neon/80 italic leading-relaxed shadow-[inset_0_0_30px_rgba(0,0,0,0.5)] relative overflow-hidden">
                            {/* Scanning overlay */}
                            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(57,255,20,0.05),transparent)] opacity-50 animate-[scanline_3s_linear_infinite]" />
                            {voiceState.status === 'listening' ? 'Materializing voice buffer...' : 'Awaiting initialization command...'}
                         </div>
                      </motion.div>
                    )}

                    {(voiceState.currentStep === 'synthesis' || voiceState.currentStep === 'blueprint') && (
                      <motion.div 
                        key="blueprint"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                      >
                         <div className="flex items-end justify-between border-b border-white/10 pb-4">
                            <div>
                               <p className="text-[10px] font-black text-gemigram-neon uppercase tracking-widest mb-1">Entity_Designation</p>
                               <h2 className="text-5xl font-black text-white uppercase tracking-tighter">{formData.name}</h2>
                            </div>
                            <div className="text-right">
                               <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Sector_Role</p>
                               <p className="text-xl font-bold text-white/80 uppercase tracking-widest">{formData.role}</p>
                            </div>
                         </div>

                         <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-4">
                               <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40">Neural_Capabilities</h4>
                               <div className="flex flex-wrap gap-3 mt-2">
                                  {Object.entries(formData.tools).filter(([_, v]) => v).map(([t]) => (
                                    <span key={t} className="px-4 py-1.5 glass-medium border border-gemigram-neon/20 rounded-full text-[10px] font-bold text-gemigram-neon uppercase tracking-widest shadow-[0_0_10px_rgba(57,255,20,0.1)]">{t}</span>
                                  ))}
                               </div>
                            </div>
                            <div className="space-y-4">
                               <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40">Cognitive_Persona</h4>
                               <div className="p-5 glass-medium border border-neon-blue/20 rounded-2xl flex items-center gap-4 shadow-[inset_0_0_20px_rgba(0,240,255,0.05)] relative overflow-hidden">
                                  <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-neon-blue/10 to-transparent pointer-events-none" />
                                  <div className="w-10 h-10 rounded-full bg-neon-blue/10 flex items-center justify-center border border-neon-blue/30">
                                    <Shield className="w-5 h-5 text-neon-blue" />
                                  </div>
                                  <span className="text-sm font-black text-white uppercase tracking-[0.2em] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{formData.persona}</span>
                               </div>
                            </div>
                         </div>

                         <div className="pt-6">
                           <motion.button
                             whileHover={{ scale: 1.02, boxShadow: '0 0 60px rgba(57,255,20,0.6)' }}
                             whileTap={{ scale: 0.98 }}
                             onClick={finalizeMaterialization}
                             className="w-full py-6 bg-gemigram-neon text-black font-black uppercase tracking-[0.4em] text-sm rounded-[2rem] shadow-[0_0_40px_rgba(57,255,20,0.4)] transition-all relative overflow-hidden group"
                           >
                              <span className="relative z-10">Initiate_Materialization</span>
                              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                           </motion.button>
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
    <div className="flex items-center justify-between group">
       <span className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${active ? 'text-gemigram-neon' : 'text-white/20'}`}>{label}</span>
       <div className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-gemigram-neon animate-pulse shadow-[0_0_8px_#10ff87]' : 'bg-white/5'}`} />
    </div>
  );
}
