'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useGemigramStore } from '@/lib/store/useGemigramStore';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, MicOff, Send, SkipForward, ChevronLeft, Sparkles,
  Brain, Zap, CheckCircle, Clock, Activity
} from 'lucide-react';
import { useVoiceInteraction } from '../hooks/useVoiceInteraction';
import { useTextToSpeech } from '../lib/agents/ttsService';
import { 
  CONVERSATION_FLOW, 
  ConversationStep, 
  getNextStep, 
  getPreviousStep 
} from '../lib/agents/conversationFlow';
import { Button } from './ui/Button';

interface AgentFormData {
  name: string;
  description: string;
  voiceName: string;
  computeTier: 'Standard' | 'Neural' | 'Gemigram';
  systemPrompt: string;
  rules: string;
  soul: string;
  tools: Record<string, boolean>;
  skills: Record<string, boolean>;
}

interface ConversationalAgentCreatorProps {
  onClose: () => void;
  onSubmit: (data: AgentFormData) => void;
}

export default function ConversationalAgentCreator({ 
  onClose, 
  onSubmit 
}: ConversationalAgentCreatorProps) {
  const [currentStep, setCurrentStep] = useState<ConversationStep>('GREETING');
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState<Array<{
    speaker: 'ASTRAEUS' | 'USER';
    text: string;
    timestamp: Date;
  }>>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [agentData, setAgentData] = useState<Partial<AgentFormData>>({});
  const [micPermission, setMicPermission] = useState<'unknown' | 'granted' | 'denied'>('unknown');
  const [permissionChecked, setPermissionChecked] = useState(false);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [blueprint, setBlueprint] = useState<any>(null);
  const setVoiceSession = useGemigramStore(state => state.setVoiceSession);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Voice hooks
  const { 
    transcript, 
    isListening, 
    startListening, 
    stopListening,
    isSupported: speechRecognitionSupported 
  } = useVoiceInteraction();
  
  const { speak, cancel: cancelSpeech, isSpeaking } = useTextToSpeech();

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle transcript from voice input
  useEffect(() => {
    if (transcript && isListening === false) {
      setUserInput(transcript);
    }
  }, [transcript, isListening]);

  useEffect(() => {
    setVoiceSession({ stage: 'forge', lastVoiceAction: 'Conversational forge opened. Checking microphone permission.' });

    const checkMicPermission = async () => {
      if (!navigator?.mediaDevices?.getUserMedia) {
        setMicPermission('denied');
        setPermissionChecked(true);
        setVoiceSession({ micPermission: 'denied', lastVoiceAction: 'Microphone API not available. Use text fallback to continue.' });
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
        setMicPermission('granted');
        setPermissionChecked(true);
        setVoiceSession({ micPermission: 'granted', lastVoiceAction: 'Mic ready. Voice onboarding is active.' });
      } catch (error) {
        setMicPermission('denied');
        setPermissionChecked(true);
        setVoiceSession({ micPermission: 'denied', lastVoiceAction: 'Mic blocked. Continue with text prompts or retry permissions.' });
      }
    };

    checkMicPermission();
  }, [setVoiceSession]);

  useEffect(() => {
    if (permissionChecked && micPermission === 'granted' && speechRecognitionSupported && !isListening && !isProcessing) {
      startListening();
    }
  }, [permissionChecked, micPermission, speechRecognitionSupported, isListening, isProcessing, startListening]);

  // Speak Astraeus lines
  useEffect(() => {
    const message = CONVERSATION_FLOW[currentStep];
    
    if (currentStep === 'NEURAL_SYNTHESIS') {
      synthesizeBlueprint();
    }

    if (message.speaker === 'ASTRAEUS' && message.voicePrompt) {
      // Small delay for natural flow
      const timer = setTimeout(() => {
        speak(message.voicePrompt!, { rate: 0.95, pitch: 1.0 });
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  const handleSendMessage = async (text?: string) => {
    const inputText = text || userInput;
    if (!inputText.trim()) return;

    setIsProcessing(true);
    cancelSpeech();

    // Add user message to chat
    const newMessage = {
      speaker: 'USER' as const,
      text: inputText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setUserInput('');

    // Process response based on current step
    await processStepResponse(inputText);
  };

  const synthesizeBlueprint = async () => {
    setIsSynthesizing(true);
    try {
      const transcriptText = messages.map(m => `${m.speaker}: ${m.text}`).join('\n');
      const response = await fetch('/api/forge/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: agentData.description, 
          currentTranscript: transcriptText 
        }),
      });

      const data = await response.json();
      if (data.blueprint) {
        setBlueprint(data.blueprint);
        
        // Update agent data with blueprint results
        setAgentData(prev => ({
          ...prev,
          name: data.blueprint.name,
          systemPrompt: data.blueprint.systemPrompt,
          voiceName: data.blueprint.voiceName,
          tools: data.blueprint.tools,
          skills: data.blueprint.skills
        }));

        // Present the pitch
        const pitchMessage = {
          speaker: 'ASTRAEUS' as const,
          text: `Neural Synthesis complete. I have architected "${data.blueprint.name}", target role: ${data.blueprint.role}. I've pre-configured your entity with ${Object.values(data.blueprint.tools).filter(Boolean).length} sensory tools and ${Object.values(data.blueprint.skills).filter(Boolean).length} workspace bridges. Does this align with your vision?`,
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, pitchMessage]);
        speak(pitchMessage.text).then(() => {
          // Auto-advance to voice selection after synthesis pitch
          setTimeout(() => {
            setCurrentStep('VOICE_SELECTION');
          }, 2000);
        });
      }
    } catch (error) {
      console.error('Synthesis failed:', error);
    } finally {
      setIsSynthesizing(false);
    }
  };

  const processStepResponse = async (input: string) => {
    const message = CONVERSATION_FLOW[currentStep];
    
    // Validate input if required
    if (message.requiresInput && message.validation) {
      const result = message.validation(input);
      if (!result.valid) {
        // Show error and re-ask question
        const errorMessage = {
          speaker: 'ASTRAEUS' as const,
          text: `I need clarification: ${result.error}. ${message.text}`,
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, errorMessage]);
        speak(errorMessage.text);
        setIsProcessing(false);
        return;
      }
    }

    // Store data based on step
    storeStepData(currentStep, input);

    // Move to next step
    const next = getNextStep(currentStep);
    if (next) {
      setTimeout(() => {
        setCurrentStep(next);
        setIsProcessing(false);
      }, 1000);
    } else {
      // Final step - submit form
      finalizeCreation();
    }
  };

  const storeStepData = (step: ConversationStep, input: string) => {
    switch (step) {
      case 'ENTITY_NAME':
        setAgentData(prev => ({ ...prev, name: input }));
        break;
      case 'CORE_PURPOSE':
        setAgentData(prev => ({ ...prev, description: input }));
        break;
      case 'VOICE_SELECTION':
        setAgentData(prev => ({ ...prev, voiceName: input }));
        break;
      case 'COMPUTE_TIER':
        setAgentData(prev => ({ ...prev, computeTier: input as any }));
        break;
      case 'PERSONA_DIRECTIVE':
        setAgentData(prev => ({ ...prev, systemPrompt: input }));
        break;
      case 'ETHICAL_RULES':
        setAgentData(prev => ({ ...prev, rules: input }));
        break;
      case 'SOUL_PERSONALITY':
        setAgentData(prev => ({ ...prev, soul: input }));
        break;
      case 'TOOL_SELECTION':
        setAgentData(prev => ({ ...prev, tools: parseToolSelection(input) }));
        break;
      case 'WORKSPACE_BRIDGES':
        setAgentData(prev => ({ ...prev, skills: parseSkillSelection(input) }));
        break;
    }
  };

  const parseToolSelection = (input: string): Record<string, boolean> => {
    const lower = input.toLowerCase();
    const allTools = {
      googleSearch: true,
      googleMaps: true,
      weather: true,
      news: true,
      crypto: true,
      calculator: true,
      semanticMemory: true,
    };
    
    if (lower.includes('all')) return allTools;
    if (lower.includes('none') || lower.includes('skip')) {
      return Object.keys(allTools).reduce((acc, key) => ({ ...acc, [key]: false }), {});
    }
    
    // Parse individual tools
    return {
      googleSearch: lower.includes('search'),
      googleMaps: lower.includes('maps'),
      weather: lower.includes('weather'),
      news: lower.includes('news'),
      crypto: lower.includes('crypto') || lower.includes('chain'),
      calculator: lower.includes('calculator') || lower.includes('math'),
      semanticMemory: lower.includes('memory') || lower.includes('rag'),
    };
  };

  const parseSkillSelection = (input: string): Record<string, boolean> => {
    const lower = input.toLowerCase();
    const allSkills = { gmail: true, calendar: true, drive: true };
    
    if (lower.includes('all')) return allSkills;
    if (lower.includes('none') || lower.includes('skip')) {
      return { gmail: false, calendar: false, drive: false };
    }
    
    return {
      gmail: lower.includes('gmail'),
      calendar: lower.includes('calendar'),
      drive: lower.includes('drive'),
    };
  };

  const finalizeCreation = () => {
    // Prepare final agent data
    const finalData: AgentFormData = {
      name: agentData.name || 'Unknown',
      description: agentData.description || 'AI Assistant',
      voiceName: agentData.voiceName || 'Zephyr',
      computeTier: agentData.computeTier || 'Neural',
      systemPrompt: agentData.systemPrompt || 'You are a helpful assistant.',
      rules: agentData.rules || 'Be helpful and honest.',
      soul: agentData.soul || 'Friendly and curious.',
      tools: agentData.tools || {},
      skills: agentData.skills || {},
    };

    // Announce completion
    const completionMessage = {
      speaker: 'ASTRAEUS' as const,
      text: "Consciousness matrix initialized. Your sovereign AI entity awakens now.",
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, completionMessage]);
    speak(completionMessage.text, {}).then(() => {
      onSubmit(finalData);
    });
  };

  const handleGoBack = () => {
    const prev = getPreviousStep(currentStep);
    if (prev) {
      cancelSpeech();
      setCurrentStep(prev);
    }
  };

  const handleSkipStep = () => {
    const next = getNextStep(currentStep);
    if (next) {
      cancelSpeech();
      setCurrentStep(next);
    }
  };

  const currentMessage = CONVERSATION_FLOW[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-aether-black/90 backdrop-blur-xl">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-5xl h-[80vh] glass-strong rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col"
      >
        {/* Animated Header Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-aether-neon/50 to-transparent" />
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-aether-neon/5 blur-[100px] rounded-full" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-fuchsia-500/5 blur-[100px] rounded-full" />

        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-white/5 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-aether-neon/10 border border-aether-neon/30 flex items-center justify-center">
              <Brain className="w-6 h-6 text-aether-neon animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-[0.3em] uppercase text-white flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-aether-neon" />
                Conversational Genesis
              </h2>
              <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mt-1">
                Step: {currentStep.replace('_', ' ')}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleGoBack}
              disabled={currentStep === 'GREETING'}
              leftIcon={<ChevronLeft className="w-4 h-4" />}
            >
              Back
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkipStep}
              rightIcon={<SkipForward className="w-4 h-4" />}
            >
              Skip
            </Button>
            <button 
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
            >
              <span className="text-white/50 hover:text-white">×</span>
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-8 py-6">
          <div className="space-y-6 max-w-3xl mx-auto">
            <AnimatePresence>
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.speaker === 'USER' ? 'justify-end' : 'justify-start'}`}
              >
                  <div className={`max-w-[80%] rounded-3xl px-6 py-4 ${
                    msg.speaker === 'USER' 
                      ? 'bg-aether-neon/20 border border-aether-neon/30 text-white' 
                      : 'glass-medium border border-white/10 text-white'
                  }`}>
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                    <p className="text-[9px] font-mono text-white/30 mt-2">
                      {msg.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {/* Current Astraeus Message */}
            {currentMessage.speaker === 'ASTRAEUS' && !messages.find(m => m.text === currentMessage.text) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex justify-start"
              >
                <div className="max-w-[80%] rounded-3xl px-6 py-4 glass-medium border border-aether-neon/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-3 h-3 text-aether-neon animate-pulse" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-aether-neon">
                      Astraeus Speaking
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-white">{currentMessage.text}</p>
                  
                  {/* Neural Blueprint Visualization */}
                  {blueprint && currentStep === 'VOICE_SELECTION' && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-tighter text-white/40">Sovereign Blueprint</span>
                        <Zap className="w-3 h-3 text-aether-neon" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <p className="text-[8px] text-white/30 uppercase font-black">Core Tools</p>
                          <div className="flex flex-wrap gap-1">
                            {Object.entries(blueprint.tools).filter(([_, v]) => v).map(([k]) => (
                              <span key={k} className="px-2 py-0.5 rounded-md bg-aether-neon/10 border border-aether-neon/20 text-[8px] text-aether-neon uppercase">
                                {k}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[8px] text-white/30 uppercase font-black">Neural Skills</p>
                          <div className="flex flex-wrap gap-1">
                            {Object.entries(blueprint.skills).filter(([_, v]) => v).map(([k]) => (
                              <span key={k} className="px-2 py-0.5 rounded-md bg-fuchsia-500/10 border border-fuchsia-500/20 text-[8px] text-fuchsia-400 uppercase">
                                {k}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-2 border-t border-white/5">
                        <p className="text-[8px] text-white/30 uppercase font-black mb-1">Synthesized Persona</p>
                        <p className="text-[10px] text-white/70 italic line-clamp-2">"{blueprint.systemPrompt}"</p>
                      </div>
                    </motion.div>
                  )}

                  {/* Suggestions */}
                  {currentMessage.suggestions && currentMessage.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {currentMessage.suggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(suggestion)}
                          className="px-4 py-2 rounded-xl bg-aether-neon/10 border border-aether-neon/20 text-aether-neon text-xs font-black uppercase tracking-widest hover:bg-aether-neon/20 transition-all"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-white/5 px-8 py-6 shrink-0">
          <div className="max-w-3xl mx-auto space-y-4">
            {/* Status Indicators */}
            <div className="flex items-center justify-center gap-6 text-[9px] font-mono uppercase tracking-widest">
              <div className="flex items-center gap-2 text-white/40">
                <Clock className="w-3 h-3" />
                <span>Step {Object.keys(CONVERSATION_FLOW).indexOf(currentStep) + 1}/11</span>
              </div>
              <div className={`flex items-center gap-2 ${speechRecognitionSupported ? 'text-aether-neon' : 'text-red-400'}`}>
                <Mic className="w-3 h-3" />
                <span>Voice: {!speechRecognitionSupported ? 'UNSUPPORTED' : micPermission === 'granted' ? 'READY' : micPermission === 'denied' ? 'DENIED' : 'CHECKING'}</span>
              </div>
              <div className={`flex items-center gap-2 ${isSpeaking() ? 'text-fuchsia-400' : 'text-white/40'}`}>
                <Activity className="w-3 h-3" />
                <span>TTS: {isSpeaking() ? 'SPEAKING' : 'IDLE'}</span>
              </div>
            </div>

            {permissionChecked && micPermission === 'denied' && (
              <div className="rounded-2xl border border-amber-400/30 bg-amber-500/10 px-4 py-3 text-xs text-amber-200">
                Microphone permission is denied. You can continue typing every answer below, or enable mic permissions in your browser and press the mic button to retry.
              </div>
            )}

            {/* Input Controls */}
            <div className="flex items-center gap-4">
              <button
                onClick={isListening ? stopListening : startListening}
                disabled={!speechRecognitionSupported || micPermission === 'denied'}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                  isListening 
                    ? 'bg-red-500/20 border-2 border-red-500 animate-pulse' 
                    : micPermission === 'denied' || !speechRecognitionSupported
                    ? 'bg-white/5 border-2 border-white/10 text-white/30 cursor-not-allowed'
                    : 'bg-aether-neon/10 border-2 border-aether-neon/30 hover:bg-aether-neon/20'
                }`}
              >
                {isListening ? (
                  <MicOff className="w-6 h-6 text-red-500" />
                ) : (
                  <Mic className="w-6 h-6 text-aether-neon" />
                )}
              </button>

              <div className="flex-1 relative">
                <div className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white/40 font-mono text-sm min-h-[56px] flex items-center">
                  {isListening ? (
                    <motion.span 
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      Listening to your neural imprint...
                    </motion.span>
                  ) : isProcessing ? (
                    <span>Sequencing conscious data...</span>
                  ) : (
                    <span>Awaiting voice link...</span>
                  )}
                </div>
              </div>

              {/* Text input removed to enforce VOICE-ONLY challenge rules */}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
