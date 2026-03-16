'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, MicOff, Send, SkipForward, ChevronLeft, Sparkles,
  Brain, Zap, CheckCircle, Clock, Activity
} from 'lucide-react';
import { useVoiceInteraction } from '../../hooks/useVoiceInteraction';
import { useTextToSpeech } from '../../lib/agents/ttsService';
import { 
  CONVERSATION_FLOW, 
  ConversationStep, 
  getNextStep, 
  getPreviousStep 
} from '../../lib/agents/conversationFlow';
import { Button } from '../ui/Button';

interface AgentFormData {
  name: string;
  description: string;
  voiceName: string;
  computeTier: 'Standard' | 'Neural' | 'Aether';
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

  // Speak Astraeus lines
  useEffect(() => {
    const message = CONVERSATION_FLOW[currentStep];
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
    speak(completionMessage.text, {}, () => {
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
                <span>Voice: {speechRecognitionSupported ? 'READY' : 'UNSUPPORTED'}</span>
              </div>
              <div className={`flex items-center gap-2 ${isSpeaking() ? 'text-fuchsia-400' : 'text-white/40'}`}>
                <Activity className="w-3 h-3" />
                <span>TTS: {isSpeaking() ? 'SPEAKING' : 'IDLE'}</span>
              </div>
            </div>

            {/* Input Controls */}
            <div className="flex items-center gap-4">
              <button
                onClick={isListening ? stopListening : startListening}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                  isListening 
                    ? 'bg-red-500/20 border-2 border-red-500 animate-pulse' 
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
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={isListening ? "Listening..." : "Type or speak your response..."}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white font-mono text-sm focus:outline-none focus:border-aether-neon/50 transition-all placeholder:text-white/20"
                  disabled={isProcessing || isListening}
                />
              </div>

              <Button
                onClick={() => handleSendMessage()}
                disabled={!userInput.trim() || isProcessing || isListening}
                leftIcon={<Send className="w-4 h-4" />}
                size="lg"
              >
                Send
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
