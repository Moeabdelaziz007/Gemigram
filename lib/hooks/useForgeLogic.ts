'use client';

import { useState, useEffect, useCallback } from 'react';
import { getRecommendedSkills, synthesizeAgentMetadata } from '@/lib/agents/skills-assignment';
import { matchPersonaFromDescription, enhanceSystemPromptWithPersona } from '@/lib/persona/persona-templates';
import { useSpeechSynthesis } from './useSpeechSynthesis';
import { useSpeechRecognition } from './useSpeechRecognition';

export interface VoiceState {
  isListening: boolean;
  isSpeaking: boolean;
  currentStep: 'intro' | 'description' | 'synthesis' | 'blueprint' | 'complete';
  status: 'idle' | 'listening' | 'processing' | 'speaking' | 'complete';
}

export interface AgentFormData {
  name: string;
  description: string;
  systemPrompt: string;
  voiceName: string;
  soul: string;
  role: string;
  tools: any;
  skills: any;
  persona?: string;
  rules?: string[];
  memoryDecay?: number;
}

export function useForgeLogic() {
  const [formData, setFormData] = useState<AgentFormData>({
    name: 'Nexus_Entity',
    description: '',
    systemPrompt: '',
    voiceName: 'Zephyr',
    soul: 'Analytical',
    role: 'Synthesized Intelligence',
    tools: { webSearch: true, memoryStore: true },
    skills: { analysis: true, generation: true },
    persona: 'Analytical',
    rules: ['Always remain objective', 'Prioritize user intent'],
    memoryDecay: 0.01,
  });

  const [currentStep, setCurrentStep] = useState<VoiceState['currentStep']>('intro');
  const [status, setStatus] = useState<VoiceState['status']>('idle');
  const [showDeployment, setShowDeployment] = useState(false);
  const [transcript, setTranscript] = useState('');

  const { speak, isSpeaking } = useSpeechSynthesis();
  const { startListening, isListening } = useSpeechRecognition();

  const handleVoiceCommand = useCallback(async (command: string) => {
    if (command.trim().length === 0) return;
    
    setStatus('processing');
    setCurrentStep('synthesis');
    
    // Simulate neural extraction latency
    await new Promise(resolve => setTimeout(resolve, 2500));

    const persona = matchPersonaFromDescription(command) || 'Analytical';
    const metadata = synthesizeAgentMetadata(command);
    const recommendedSkills = getRecommendedSkills(command, metadata.suggestedRole, persona);

    setFormData(prev => ({
        ...prev,
        description: command,
        name: metadata.suggestedName || prev.name,
        role: metadata.suggestedRole || prev.role,
        persona: persona,
        rules: ['Always remain objective'],
        skills: recommendedSkills,
        tools: metadata.tools || { webSearch: true }
    }));

    setStatus('idle');
    setCurrentStep('blueprint');
    speak(`Synthesis complete. Generating blueprint for ${metadata.suggestedName || 'entity'}. Review parameters.`);
  }, [speak]);

  const initiateListening = useCallback(() => {
    startListening((text) => {
      setTranscript(prev => prev + ' ' + text);
      handleVoiceCommand(text);
    }, (err) => {
      console.error("Forge Speech Error:", err);
      if (process.env.NODE_ENV === 'development') {
        handleVoiceCommand("I want a creative writing assistant specialized in sci-fi.");
      }
    });
  }, [startListening, handleVoiceCommand]);

  const speakPrompt = useCallback((text: string) => {
    speak(text, () => {
      if (currentStep === 'description' || currentStep === 'intro') {
        setTimeout(() => initiateListening(), 100);
      }
    });
  }, [speak, currentStep, initiateListening]);

  const finalizeMaterialization = () => {
    let finalSystemPrompt = formData.systemPrompt || `You are ${formData.name}, an AI assistant.`;
    if (formData.persona) {
        finalSystemPrompt = enhanceSystemPromptWithPersona(finalSystemPrompt, formData.persona);
    }
    
    if (formData.rules && formData.rules.length > 0) {
        finalSystemPrompt += `\n\nCORE DIRECTIVES:\n${formData.rules.map(r => `- ${r}`).join('\n')}`;
    }

    setFormData(prev => ({ ...prev, systemPrompt: finalSystemPrompt }));
    setShowDeployment(true);
  };

  // Initial greeting
  useEffect(() => {
    const timer = setTimeout(() => {
      speakPrompt("Welcome to the Neural Forge. Describe the entity you wish to materialize.");
      setCurrentStep('description');
    }, 1000);
    return () => clearTimeout(timer);
  }, [speakPrompt]);

  // Sync VoiceState for component
  const voiceState: VoiceState = {
    isListening,
    isSpeaking,
    currentStep,
    status: isSpeaking ? 'speaking' : isListening ? 'listening' : status
  };

  return {
    formData,
    setFormData,
    voiceState,
    transcript,
    setTranscript,
    showDeployment,
    setShowDeployment,
    speak: speakPrompt,
    startListening: initiateListening,
    finalizeMaterialization,
    setCurrentStep,
    resynthesize: () => {
      setTranscript('');
      setCurrentStep('description');
      setStatus('idle');
    }
  };
}
