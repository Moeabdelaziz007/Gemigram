'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Mic, MicOff, Bot, Brain, Zap, Activity,
  CheckCircle, AlertCircle
} from 'lucide-react';
import { Agent } from '@/lib/store/useAetherStore';
import { useLiveAPI } from '@/hooks/useLiveAPI';

interface VoiceState {
  isListening: boolean;
  isSpeaking: boolean;
  currentStep: string;
  confidence: number;
}

interface AgentFormData {
  name: string;
  description: string;
  systemPrompt: string;
  voiceName: string;
  soul: string;
  rules: string;
  tools: any;
  skills: any;
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
    soul: '',
    rules: '',
    tools: {
      googleSearch: true,
      googleMaps: false,
      weather: true,
      news: false,
      crypto: false,
      calculator: true,
      semanticMemory: true,
    },
    skills: {
      gmail: false,
      calendar: false,
      drive: false,
    }
  });
  
  const [voiceState, setVoiceState] = useState<VoiceState>({
    isListening: false,
    isSpeaking: false,
    currentStep: 'name',
    confidence: 1.0
  });
  
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Initialize voice interaction with Gemini Live API
  const {
    isConnected,
    isSpeaking: geminiSpeaking,
    startSession,
    sendAudio,
    disconnect
  } = useLiveAPI({
    onMessage: handleGeminiResponse,
    onError: handleVoiceError
  });

  useEffect(() => {
    // Auto-start voice session on mount
    startSession();
    speakIntroduction();
    
    return () => {
      disconnect();
    };
  }, []);

  useEffect(() => {
    setVoiceState(prev => ({ ...prev, isSpeaking: geminiSpeaking }));
  }, [geminiSpeaking]);

  const speakIntroduction = () => {
    const introduction = `
      Welcome to the Aether Forge. 
      I am the Architect. 
      Together, we will materialize a new Sovereign Intelligence.
      
      Tell me... what designation shall we bestow upon this entity?
    `;
    
    // Speak via Gemini Live API or Web Speech API fallback
    speak(introduction);
  };

  const speak = (text: string) => {
    // Use browser's speech synthesis for feedback
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = 0.9;
      utterance.rate = 1.0;
      utterance.volume = 1.0;
      
      utterance.onstart = () => {
        setVoiceState(prev => ({ ...prev, isSpeaking: true }));
      };
      
      utterance.onend = () => {
        setVoiceState(prev => ({ ...prev, isSpeaking: false }));
      };
      
      speechSynthesis.speak(utterance);
    }
  };

  const handleGeminiResponse = (response: any) => {
    // Process Gemini's understanding of user's voice input
    const understoodText = response.text || '';
    const confidence = response.confidence || 0.9;
    
    setVoiceState(prev => ({ ...prev, confidence }));
    
    // Auto-fill form based on voice input
    fillFormField(voiceState.currentStep, understoodText);
  };

  const handleVoiceError = (error: Error) => {
    console.error('[ForgeArchitect] Voice error:', error);
    // Fallback to manual confirmation
    setVoiceState(prev => ({ ...prev, confidence: 0.5 }));
  };
      setFormData(prev => ({ ...prev, description: userValue }));
      addMessage('architect', `Directives acknowledged. To function effectively, ${formData.name} needs a personality matrix. Describe its "Soul" or temperament.`, { field: 'soul' });
    } else if (currentMsg.field === 'soul') {
      setFormData(prev => ({ ...prev, soul: userValue }));
      addMessage('architect', `Synthesis near optimal. Finally, select a vocal synthesis profile for auditory materialization.`, { 
        field: 'voiceName', 
        type: 'selection',
        options: VOICES
      });
    } else {
      // Default fallback or extension
      addMessage('architect', "Neural pathways stabilized. Initiating final genesis sequence.");
      setTimeout(() => {
        onComplete({
          ...formData,
          systemPrompt: `You are ${formData.name}, a sovereign AI architect. Your role is ${formData.description}. Personality: ${formData.soul}.`,
          rules: "Always maintain first-principles thinking. Protect user sovereignty."
        });
      }, 1500);
    }
  };

  const handleSelect = (option: string) => {
    setFormData(prev => ({ ...prev, voiceName: option }));
    addMessage('user', option);
    addMessage('architect', `Vocal profile ${option} synchronized. Preparing for final materialization...`);
    setTimeout(() => {
      onComplete({
        ...formData,
        voiceName: option,
        systemPrompt: `You are ${formData.name}, ${formData.description}. Your temperament is ${formData.soul}.`,
        rules: "Observe absolute neutrality and data integrity."
      });
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-3xl overflow-hidden">
      {/* HUD Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,242,255,0.05),transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-5xl h-[85vh] bg-[#03070C]/80 border border-white/5 rounded-[40px] shadow-2xl relative flex flex-col overflow-hidden"
      >
        {/* Header HUD */}
        <div className="px-10 py-8 border-b border-white/5 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 rounded-2xl bg-aether-neon/10 border border-aether-neon/30 flex items-center justify-center">
              <Binary className="w-6 h-6 text-aether-neon animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-[0.3em] uppercase text-white">Aether Forge</h2>
              <p className="text-[9px] font-mono text-aether-neon/50 uppercase tracking-widest flex items-center gap-2">
                 <Activity className="w-3 h-3" /> Neural Link Established • Architect Mode
              </p>
            </div>
          </div>
          <button 
            onClick={onCancel}
            className="px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white/50 border border-white/5 transition-all"
          >
            Abort Synthesis
          </button>
        </div>

        {/* Chat Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-10 custom-scrollbar flex flex-col gap-8"
        >
          <AnimatePresence mode="popLayout">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    msg.role === 'architect' ? 'bg-aether-neon/20 border border-aether-neon/40 text-aether-neon' : 'bg-white/10 text-white'
                  }`}>
                    {msg.role === 'architect' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>
                  <div className={`space-y-4 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`px-6 py-4 rounded-[24px] text-sm leading-relaxed ${
                      msg.role === 'architect' 
                      ? 'bg-white/[0.03] border border-white/5 text-cyan-50/90' 
                      : 'bg-aether-neon/10 border border-aether-neon/20 text-white shadow-[0_0_20px_rgba(0,242,255,0.05)]'
                    }`}>
                      {msg.content}
                    </div>

                    {msg.type === 'selection' && msg.options && (
                      <div className="flex flex-wrap gap-3">
                        {msg.options.map(opt => (
                          <button
                            key={opt}
                            onClick={() => handleSelect(opt)}
                            className="px-6 py-2 rounded-xl bg-black border border-white/10 hover:border-aether-neon text-[10px] font-bold uppercase tracking-widest text-white/60 hover:text-aether-neon transition-all"
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-aether-neon/20 border border-aether-neon/40 text-aether-neon flex items-center justify-center">
                  <Bot className="w-4 h-4 animate-pulse" />
                </div>
                <div className="px-6 py-4 rounded-[24px] bg-white/[0.03] border border-white/5">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-aether-neon/50 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-aether-neon/50 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-aether-neon/50 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input HUD */}
        <div className="p-10 border-t border-white/5 bg-black/20">
          <form 
            onSubmit={handleSend}
            className="relative"
          >
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Inject neural directive..."
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-8 py-6 text-white font-mono text-sm focus:outline-none focus:border-aether-neon/50 focus:ring-1 focus:ring-aether-neon/20 transition-all placeholder:text-white/10"
            />
            <button 
              type="submit"
              disabled={!input.trim()}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-aether-neon text-black rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          <div className="mt-4 flex items-center gap-6 justify-center text-[8px] font-mono text-white/20 uppercase tracking-[0.4em]">
            <span>Neural Processor 01</span>
            <span className="w-1 h-1 bg-white/20 rounded-full" />
            <span>Buffer Alpha</span>
            <span className="w-1 h-1 bg-white/20 rounded-full" />
            <span>Sovereign Link Ready</span>
          </div>
        </div>
      </motion.div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 242, 255, 0.1);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
