'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Mic, MicOff, Brain, Zap, Activity,
  CheckCircle, AlertCircle, Radio
} from 'lucide-react';
import { Agent } from '@/lib/store/useAetherStore';
import { getRecommendedSkills, generateSkillsConfirmation } from '@/lib/agents/skills-assignment';
import { getPersonaPrompt, matchPersonaFromDescription, enhanceSystemPromptWithPersona } from '@/lib/persona/persona-templates';

interface VoiceState {
  isListening: boolean;
  isSpeaking: boolean;
  currentStep: string;
  confidence: number;
  status: 'idle' | 'listening' | 'processing' | 'speaking' | 'complete';
}

interface AgentFormData {
  name: string;
  description: string;
  systemPrompt: string;
  voiceName: string;
  soul: string;
  rules: string;
  persona?: string;
  memoryDecay?: number;
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
    confidence: 1.0,
    status: 'idle'
  });

  // Connection status for UI display only (not using Gemini Live API here)
  const isConnected = true;

  const speakIntroduction = () => {
    const introduction = `
      Welcome to the Aether Forge. 
      I am the Architect. 
      Together, we will materialize a new Sovereign Intelligence.
      
      Tell me... what designation shall we bestow upon this entity?
    `;
    
    speak(introduction);
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = 0.9;
      utterance.rate = 1.0;
      utterance.volume = 1.0;
      
      utterance.onstart = () => {
        setVoiceState(prev => ({ ...prev, isSpeaking: true, status: 'speaking' }));
      };
      
      utterance.onend = () => {
        setVoiceState(prev => ({ ...prev, isSpeaking: false, status: 'listening' }));
        startListening();
      };
      
      speechSynthesis.speak(utterance);
    }
  };

  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => {
        setVoiceState(prev => ({ ...prev, isListening: true, status: 'listening' }));
      };
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        const confidence = event.results[0][0].confidence;
        setVoiceState(prev => ({ 
          ...prev, 
          isListening: false, 
          status: 'processing',
          confidence 
        }));
        handleVoiceInput(transcript);
      };
      
      recognition.onerror = (event: any) => {
        console.error('[ForgeArchitect] Speech recognition error:', event.error);
        setVoiceState(prev => ({ ...prev, isListening: false, status: 'idle', confidence: 0.5 }));
        // Retry on error
        setTimeout(() => startListening(), 1000);
      };
      
      recognition.start();
    } else {
      console.warn('[ForgeArchitect] Speech recognition not supported');
      handleVoiceInput('');
    }
  };

  const handleVoiceInput = (transcript: string) => {
    if (!transcript) return;
    
    // Auto-detect skills from description when user provides it
    if (voiceState.currentStep === 'description') {
      const detectedSkills = getRecommendedSkills(transcript, transcript, formData.soul);
      setFormData(prev => ({ 
        ...prev, 
        description: transcript,
        skills: { ...prev.skills, ...detectedSkills }
      }));
      
      // Auto-detect persona from description
      const detectedPersona = matchPersonaFromDescription(transcript);
      if (detectedPersona) {
        setFormData(prev => ({ ...prev, persona: detectedPersona }));
      }
    } else {
      fillFormField(voiceState.currentStep, transcript);
    }
  };

  const fillFormField = (field: string, value: string) => {
    if (!value) return;
    
    setFormData(prev => ({ ...prev, [field]: value }));
    setTimeout(() => progressToNextStep(field), 800);
  };

  const progressToNextStep = (completedField: string) => {
    const steps = ['name', 'description', 'systemPrompt', 'soul', 'voiceName', 'rules'];
    const currentIndex = steps.indexOf(completedField);
    
    if (currentIndex < steps.length - 1) {
      const nextStep = steps[currentIndex + 1];
      setVoiceState(prev => ({ ...prev, currentStep: nextStep }));
      
      // After soul selection, ask for persona
      if (completedField === 'soul') {
        setTimeout(() => {
          setVoiceState(prev => ({ ...prev, currentStep: 'persona' }));
          promptForStep('persona');
        }, 1000);
      } else {
        promptForStep(nextStep);
      }
    } else {
      finalizeCreation();
    }
  };

  const promptForStep = (step: string) => {
    const prompts: Record<string, string> = {
      name: 'What shall we call this entity?',
      description: 'What is its core purpose or role? Describe what it should do.',
      systemPrompt: 'How should it behave? Describe its personality and communication style.',
      soul: 'What essence drives it? Choose: Analytical (logical), Creative (artistic), Mystical (philosophical), Warrior (bold), or Empathetic (caring)?',
      voiceName: `Choose its voice: ${VOICES.join(', ')}.`,
      rules: 'Any final directives, constraints, or special instructions?'
    };
    
    // Add persona question after soul step
    if (step === 'persona' && formData.soul) {
      const personaPrompt = getPersonaPrompt();
      speak(personaPrompt);
      return;
    }
    
    speak(prompts[step] || 'Continue...');
  };

  const finalizeCreation = () => {
    // Enhance system prompt with persona if available
    let finalSystemPrompt = formData.systemPrompt;
    if (formData.persona) {
      finalSystemPrompt = enhanceSystemPromptWithPersona(formData.systemPrompt, formData.persona);
    }
    
    const finalData = {
      ...formData,
      systemPrompt: finalSystemPrompt
    };
    
    // Generate skills confirmation if skills were auto-detected
    const enabledSkills = Object.entries(formData.skills).filter(([_, enabled]) => enabled);
    let skillsMessage = '';
    if (enabledSkills.length > 0) {
      skillsMessage = generateSkillsConfirmation(formData.skills);
    }
    
    const finalMessage = skillsMessage 
      ? `${skillsMessage} System prompt enhanced with ${formData.persona || 'default'} persona. ${formData.name} is now configured. All parameters are set. Initiating materialization sequence... Prepare for manifestation.`
      : `System prompt enhanced with ${formData.persona || 'default'} persona. ${formData.name} is now configured. All parameters are set. Initiating materialization sequence... Prepare for manifestation.`;
    
    speak(finalMessage);
    
    setVoiceState(prev => ({ ...prev, status: 'complete' }));
    
    setTimeout(() => {
      onComplete(finalData);
    }, 4000);
  };

  const getStatusColor = () => {
    switch (voiceState.status) {
      case 'listening': return 'text-cyan-400';
      case 'speaking': return 'text-fuchsia-400';
      case 'processing': return 'text-yellow-400';
      case 'complete': return 'text-green-400';
      default: return 'text-white/40';
    }
  };

  const getStatusIcon = () => {
    switch (voiceState.status) {
      case 'listening': return <Mic className="w-8 h-8 animate-pulse" />;
      case 'speaking': return <Radio className="w-8 h-8 animate-pulse" />;
      case 'processing': return <Brain className="w-8 h-8 animate-spin" />;
      case 'complete': return <CheckCircle className="w-8 h-8" />;
      default: return <MicOff className="w-8 h-8" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/90 backdrop-blur-3xl overflow-hidden">
      {/* HUD Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,240,255,0.05),transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-4xl h-[85vh] sm:h-[80vh] bg-[#03070C]/80 border border-white/5 rounded-[32px] sm:rounded-[40px] shadow-2xl relative flex flex-col overflow-hidden mx-2 sm:mx-4"
      >
        {/* Header HUD */}
        <div className="px-4 sm:px-6 md:px-10 py-4 sm:py-6 md:py-8 border-b border-white/5 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-aether-neon/10 border border-aether-neon/30 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-aether-neon animate-pulse" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl md:text-2xl font-black uppercase tracking-widest text-white truncate">Aether Forge</h1>
              <p className="text-hud text-white/40 text-xs sm:text-sm hidden xs:block">Voice-Only Interface</p>
            </div>
          </div>
          
          {/* Connection Status */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <Activity className={`w-3 h-3 sm:w-4 sm:h-4 ${isConnected ? 'text-green-400' : 'text-red-400'}`} />
            <span className="text-hud text-white/40 text-xs sm:text-sm hidden sm:inline">{isConnected ? 'LINKED' : 'DISCONNECTED'}</span>
          </div>
        </div>

        {/* Main Voice Interface */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12 relative overflow-y-auto">
          {/* Central Voice Orb */}
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 mb-6 sm:mb-8 md:mb-12">
            {/* Pulsing Core */}
            <motion.div 
              className={`absolute inset-0 rounded-full blur-[30px] sm:blur-[40px] ${getStatusColor()}`}
              animate={{ 
                scale: voiceState.isSpeaking ? [1, 1.3, 1] : [1, 1.05, 1],
                opacity: voiceState.isSpeaking ? [0.6, 1, 0.6] : 0.4
              }}
              transition={{ duration: voiceState.isSpeaking ? 1.5 : 3, repeat: Infinity }}
            />
            
            {/* Icon Container */}
            <div className="relative w-full h-full flex items-center justify-center">
              <div className={`w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full bg-white/5 border-2 border-white/20 flex items-center justify-center ${getStatusColor()}`}>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-widest">
                    ORD
                  </div>
                  <div className="text-[8px] sm:text-[9px] md:text-[10px] font-bold text-white/60 uppercase tracking-wider mt-1">
                    Voice
                  </div>
                </div>
              </div>
            </div>
            
            {/* Confidence Ring */}
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 256 256">
              <circle
                cx="128"
                cy="128"
                r="120"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="2"
              />
              <motion.circle
                cx="128"
                cy="128"
                r="120"
                fill="none"
                stroke={voiceState.confidence > 0.8 ? '#10ff87' : '#f59e0b'}
                strokeWidth="2"
                strokeDasharray={2 * Math.PI * 120}
                initial={{ strokeDashoffset: 2 * Math.PI * 120 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 120 * (1 - voiceState.confidence) }}
                transition={{ duration: 0.5 }}
              />
            </svg>
          </div>

          {/* Status Text */}
          <div className="text-center space-y-3 sm:space-y-4 w-full max-w-md px-2">
            <motion.h2 
              key={voiceState.currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-lg sm:text-xl md:text-2xl font-bold text-white uppercase tracking-widest px-2"
            >
              {voiceState.status === 'listening' && 'Listening...'}
              {voiceState.status === 'speaking' && 'Speaking...'}
              {voiceState.status === 'processing' && 'Processing...'}
              {voiceState.status === 'complete' && 'Configuration Complete'}
            </motion.h2>
            
            <p className="text-white/60 text-sm sm:text-base max-w-md px-4">
              {voiceState.status === 'listening' && 'Speak clearly to configure your agent'}
              {voiceState.status === 'speaking' && 'Please listen to the instructions'}
              {voiceState.status === 'processing' && 'Analyzing voice input...'}
              {voiceState.status === 'complete' && 'Ready for materialization'}
            </p>
            
            {/* Confidence Indicator */}
            {voiceState.confidence < 0.8 && (
              <div className="flex items-center justify-center gap-2 text-yellow-400 px-4">
                <AlertCircle className="w-4 h-4" />
                <span className="text-xs sm:text-sm">Low confidence - please repeat</span>
              </div>
            )}
          </div>
        </div>

        {/* Progress Steps */}
        <div className="px-4 sm:px-6 md:px-10 py-4 sm:py-6 border-t border-white/5 bg-black/40 overflow-x-auto">
          <div className="flex items-center justify-start sm:justify-between min-w-max sm:min-w-0 gap-4 sm:gap-0">
            {['name', 'description', 'soul', 'persona', 'voice', 'rules'].map((step, index) => {
              const steps = ['name', 'description', 'systemPrompt', 'soul', 'persona', 'voiceName', 'rules'];
              const currentStepIndex = steps.indexOf(voiceState.currentStep);
              const stepIndex = steps.indexOf(step === 'voice' ? 'voiceName' : step);
              const isComplete = stepIndex < currentStepIndex;
              const isCurrent = stepIndex === currentStepIndex;
              
              return (
                <div key={step} className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full flex-shrink-0 ${
                    isComplete ? 'bg-green-400' : isCurrent ? getStatusColor() : 'bg-white/20'
                  }`} />
                  <span className={`text-[10px] sm:text-xs uppercase tracking-wider whitespace-nowrap ${
                    isCurrent ? 'text-white' : 'text-white/40'
                  }`}>
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
