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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-3xl overflow-hidden selection:bg-gemigram-neon/30">
      <AnimatePresence>
        {!showDeployment ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="w-full max-w-5xl aspect-video sovereign-glass border border-white/10 rounded-[40px] shadow-2xl relative flex flex-col overflow-hidden mx-4"
          >
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

            <div className="flex-1 grid grid-cols-12 gap-8 p-12">
              {/* Left Column: Synthesis Status */}
              <div className="col-span-4 flex flex-col gap-6">
                <div className="sovereign-glass p-8 rounded-[2rem] border-white/5 bg-white/5 space-y-6">
                   <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gemigram-neon/60">Inference_Streams</h3>
                   
                   <InferenceNode label="Audio_Spectrogram" active={voiceState.status === 'listening' || voiceState.status === 'speaking'} />
                   <InferenceNode label="Semantic_Parsing" active={voiceState.status === 'processing'} />
                   <InferenceNode label="Identity_Synthesis" active={voiceState.currentStep === 'synthesis'} />
                   <InferenceNode label="Skill_Mapping" active={voiceState.currentStep === 'synthesis'} />
                </div>

                <div className="flex-1 flex flex-col items-center justify-center">
                   <motion.div 
                     animate={{ 
                       scale: voiceState.status === 'listening' ? [1, 1.2, 1] : 1,
                       rotate: voiceState.status === 'processing' ? 360 : 0
                     }}
                     transition={{ duration: 2, repeat: Infinity }}
                     className={`w-32 h-32 rounded-full border-2 flex items-center justify-center ${voiceState.status === 'listening' ? 'border-gemigram-neon text-gemigram-neon shadow-[0_0_20px_rgba(16,255,135,0.4)]' : 'border-white/10 text-white/20'}`}
                   >
                      {voiceState.status === 'processing' ? <Brain className="w-12 h-12" /> : <Mic className="w-12 h-12" />}
                   </motion.div>
                   <div className="mt-8 sovereign-glass p-4 rounded-2xl border-white/5 bg-gemigram-neon/5">
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
                         <h2 className="text-4xl font-black text-white uppercase tracking-tighter leading-none">Describe the_Entity</h2>
                         <div className="h-40 bg-white/5 rounded-[2rem] border border-white/5 p-8 font-mono text-sm text-gemigram-neon/80 italic leading-relaxed">
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
                               <div className="flex flex-wrap gap-2">
                                  {Object.entries(formData.tools).filter(([_, v]) => v).map(([t]) => (
                                    <span key={t} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-bold text-gemigram-neon uppercase tracking-widest">{t}</span>
                                  ))}
                               </div>
                            </div>
                            <div className="space-y-4">
                               <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40">Cognitive_Persona</h4>
                               <div className="p-4 bg-gemigram-neon/5 border border-gemigram-neon/20 rounded-2xl flex items-center gap-4">
                                  <Shield className="w-5 h-5 text-gemigram-neon" />
                                  <span className="text-xs font-black text-white uppercase tracking-[0.2em]">{formData.persona}</span>
                               </div>
                            </div>
                         </div>

                         <motion.button
                           whileHover={{ scale: 1.02 }}
                           whileTap={{ scale: 0.98 }}
                           onClick={finalizeMaterialization}
                           className="w-full py-6 mt-4 bg-gemigram-neon text-black font-black uppercase tracking-[0.5em] text-sm rounded-[2rem] shadow-[0_0_30px_rgba(16,255,135,0.4)] hover:shadow-[0_0_50px_rgba(16,255,135,0.6)] transition-all"
                         >
                            Initiate_Materialization
                         </motion.button>
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
