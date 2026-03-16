'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Mic, MicOff, Brain, Zap, Activity,
  CheckCircle, AlertCircle, Waveform
} from 'lucide-react';
import { Agent } from '@/lib/store/useAetherStore';
import { useLiveAPI } from '@/hooks/useLiveAPI';

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
    setVoiceState(prev => ({ ...prev, isSpeaking: geminiSpeaking, status: geminiSpeaking ? 'speaking' : 'idle' }));
  }, [geminiSpeaking]);

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
        setVoiceState(prev => ({ ...prev, isListening: false, status: 'processing' }));
        handleVoiceInput(transcript);
      };
      
      recognition.onerror = (event: any) => {
        console.error('[ForgeArchitect] Speech recognition error:', event.error);
        setVoiceState(prev => ({ ...prev, isListening: false, status: 'idle', confidence: 0.5 }));
      };
      
      recognition.start();
    } else {
      console.warn('[ForgeArchitect] Speech recognition not supported');
      // Fallback: proceed with low confidence
      handleVoiceInput('');
    }
  };

  const handleGeminiResponse = (response: any) => {
    const understoodText = response.text || '';
    const confidence = response.confidence || 0.9;
    
    setVoiceState(prev => ({ ...prev, confidence }));
    fillFormField(voiceState.currentStep, understoodText);
  };

  const handleVoiceError = (error: Error) => {
    console.error('[ForgeArchitect] Voice error:', error);
    setVoiceState(prev => ({ ...prev, confidence: 0.5 }));
  };

  const handleVoiceInput = (transcript: string) => {
    fillFormField(voiceState.currentStep, transcript);
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
      promptForStep(nextStep);
    } else {
      finalizeCreation();
    }
  };

  const promptForStep = (step: string) => {
    const prompts: Record<string, string> = {
      name: 'What shall we call this entity?',
      description: 'What is its core purpose or role?',
      systemPrompt: 'How should it behave? Describe its personality.',
      soul: 'What essence drives it? Analytical, creative, mystical, or warrior?',
      voiceName: `Choose its voice: ${VOICES.join(', ')}.`,
      rules: 'Any final directives or constraints?'
    };
    
    speak(prompts[step] || 'Continue...');
  };

  const finalizeCreation = () => {
    speak(
      `Excellent. ${formData.name} is now configured.
       All parameters are set.
       Initiating materialization sequence...
       Prepare for manifestation.`
    );
    
    setVoiceState(prev => ({ ...prev, status: 'complete' }));
    
    setTimeout(() => {
      onComplete(formData);
    }, 3000);
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
      case 'speaking': return <Waveform className="w-8 h-8 animate-pulse" />;
      case 'processing': return <Brain className="w-8 h-8 animate-spin" />;
      case 'complete': return <CheckCircle className="w-8 h-8" />;
      default: return <MicOff className="w-8 h-8" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-3xl overflow-hidden">
      {/* HUD Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,240,255,0.05),transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-4xl h-[80vh] bg-[#03070C]/80 border border-white/5 rounded-[40px] shadow-2xl relative flex flex-col overflow-hidden"
      >
        {/* Header HUD */}
        <div className="px-10 py-8 border-b border-white/5 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 rounded-2xl bg-aether-neon/10 border border-aether-neon/30 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-aether-neon animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-black uppercase tracking-widest text-white">Aether Forge</h1>
              <p className="text-hud text-white/40">Voice-Only Interface</p>
            </div>
          </div>
          
          {/* Connection Status */}
          <div className="flex items-center gap-3">
            <Activity className={`w-4 h-4 ${isConnected ? 'text-green-400' : 'text-red-400'}`} />
            <span className="text-hud text-white/40">{isConnected ? 'LINKED' : 'DISCONNECTED'}</span>
          </div>
        </div>

        {/* Main Voice Interface */}
        <div className="flex-1 flex flex-col items-center justify-center p-12 relative">
          {/* Central Voice Orb */}
          <div className="relative w-64 h-64 mb-12">
            {/* Pulsing Core */}
            <motion.div 
              className={`absolute inset-0 rounded-full blur-[40px] ${getStatusColor()}`}
              animate={{ 
                scale: voiceState.isSpeaking ? [1, 1.3, 1] : [1, 1.05, 1],
                opacity: voiceState.isSpeaking ? [0.6, 1, 0.6] : 0.4
              }}
              transition={{ duration: voiceState.isSpeaking ? 1.5 : 3, repeat: Infinity }}
            />
            
            {/* Icon Container */}
            <div className="relative w-full h-full flex items-center justify-center">
              <div className={`w-32 h-32 rounded-full bg-white/5 border-2 border-white/20 flex items-center justify-center ${getStatusColor()}`}>
                {getStatusIcon()}
              </div>
            </div>
            
            {/* Confidence Ring */}
            <svg className="absolute inset-0 w-full h-full -rotate-90">
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
          <div className="text-center space-y-4">
            <motion.h2 
              key={voiceState.currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-bold text-white uppercase tracking-widest"
            >
              {voiceState.status === 'listening' && 'Listening...'}
              {voiceState.status === 'speaking' && 'Speaking...'}
              {voiceState.status === 'processing' && 'Processing...'}
              {voiceState.status === 'complete' && 'Configuration Complete'}
            </motion.h2>
            
            <p className="text-white/60 max-w-md">
              {voiceState.status === 'listening' && 'Speak clearly to configure your agent'}
              {voiceState.status === 'speaking' && 'Please listen to the instructions'}
              {voiceState.status === 'processing' && 'Analyzing voice input...'}
              {voiceState.status === 'complete' && 'Ready for materialization'}
            </p>
            
            {/* Confidence Indicator */}
            {voiceState.confidence < 0.8 && (
              <div className="flex items-center justify-center gap-2 text-yellow-400">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">Low confidence - please repeat</span>
              </div>
            )}
          </div>
        </div>

        {/* Progress Steps */}
        <div className="px-10 py-6 border-t border-white/5 bg-black/40">
          <div className="flex items-center justify-between">
            {['name', 'description', 'soul', 'voice', 'rules'].map((step, index) => {
              const steps = ['name', 'description', 'systemPrompt', 'soul', 'voiceName', 'rules'];
              const currentStepIndex = steps.indexOf(voiceState.currentStep);
              const stepIndex = steps.indexOf(step === 'voice' ? 'voiceName' : step);
              const isComplete = stepIndex < currentStepIndex;
              const isCurrent = stepIndex === currentStepIndex;
              
              return (
                <div key={step} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    isComplete ? 'bg-green-400' : isCurrent ? getStatusColor() : 'bg-white/20'
                  }`} />
                  <span className={`text-xs uppercase tracking-wider ${
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
