'use client';

import { useEffect, useState, useCallback } from 'react';
import { useLiveAPI } from '@/hooks/useLiveAPI';
import { useGemigramStore } from '@/lib/store/useGemigramStore';
import { enhanceSystemPromptWithPersona } from '@/lib/persona/persona-templates';
import { Agent } from '@/lib/store/slices/createAgentSlice';
import { ToolResult } from '@/lib/types/live-api';

export interface VoiceState {
  isListening: boolean;
  isSpeaking: boolean;
  currentStep: 'intro' | 'description' | 'synthesis' | 'blueprint' | 'complete';
  status: 'idle' | 'listening' | 'processing' | 'speaking' | 'complete';
}

export type AgentFormData = Partial<Agent> & {
    description?: string;
    persona?: string;
    autoMaterialize?: boolean;
};

const DEFAULT_FORM_DATA: AgentFormData = {
  name: 'Nexus_Entity',
  description: '',
  systemPrompt: '',
  voiceName: 'Astraeus',
  soul: 'Analytical',
  role: 'Synthesized Intelligence',
  tools: { 
    googleSearch: true, 
    googleMaps: false,
    weather: false,
    news: false,
    crypto: false,
    calculator: false,
    semanticMemory: true 
  },
  skills: { 
    gmail: false,
    calendar: false,
    drive: false 
  },
  persona: 'Analytical',
  rules: 'Always remain objective. Prioritize user intent.',
  avatarUrl: '',
};

export function useForgeLogic() {
  const pendingManifest = useGemigramStore(state => state.pendingManifest);
  const setPendingManifest = useGemigramStore(state => state.setPendingManifest);
  
  // Local state for UI responsiveness, synced with Zustand
  const [formData, setLocalFormData] = useState<AgentFormData>((pendingManifest as AgentFormData) || DEFAULT_FORM_DATA);
  const [currentStep, setCurrentStep] = useState<VoiceState['currentStep']>('intro');
  const [status, setStatus] = useState<VoiceState['status']>('idle');
  const [showDeployment, setShowDeployment] = useState(false);
  const [transcript, setTranscript] = useState('');
  
  // Materialization logic
  const finalizeMaterialization = useCallback(() => {
    let finalSystemPrompt = formData.systemPrompt || `You are ${formData.name}, an AI assistant.`;
    if (formData.persona) {
      finalSystemPrompt = enhanceSystemPromptWithPersona(finalSystemPrompt, formData.persona);
    }
    
    if (formData.rules) {
      finalSystemPrompt += `\n\nCORE DIRECTIVES:\n${formData.rules}`;
    }

    const finalData = { ...formData, systemPrompt: finalSystemPrompt };
    setLocalFormData(finalData);
    setPendingManifest(finalData as Partial<Agent>);
    setShowDeployment(true);
  }, [formData, setPendingManifest]);

  // Handle Tool Calls or specific responses from Live API
  const onFunctionCall = useCallback((result: ToolResult) => {
    console.log("[Forge] Neural Tool Result:", result);
  }, []);

  const { connect, disconnect, isRecording, startRecording, stopRecording } = useLiveAPI(
    process.env.NEXT_PUBLIC_GEMINI_API_KEY || '', 
    onFunctionCall
  );

  const handleSynthesis = useCallback(async (userText: string) => {
    setStatus('processing');
    setCurrentStep('synthesis');
    
    try {
      const resp = await fetch('/api/forge/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userText }),
      });

      if (!resp.ok) throw new Error('Synthesis failure');
      const blueprint = await resp.json();

      const newFormData: AgentFormData = {
        ...formData,
        description: userText,
        name: blueprint.name || formData.name,
        role: blueprint.role || formData.role,
        persona: blueprint.persona || 'Analytical',
        rules: Array.isArray(blueprint.rules) ? blueprint.rules.join('. ') : (blueprint.rules || formData.rules),
        skills: { ...formData.skills, ...blueprint.skills },
        tools: { ...formData.tools, ...blueprint.tools },
        systemPrompt: blueprint.systemPrompt || formData.systemPrompt,
        avatarUrl: `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${blueprint.name || 'nexus'}`
      };

      setLocalFormData(newFormData);
      setPendingManifest(newFormData as Partial<Agent>);
      setStatus('idle');
      setCurrentStep('blueprint');
      
      // Auto-finalize for MVP flow
      setTimeout(() => finalizeMaterialization(), 1500);
    } catch (err) {
      console.error("Neural Core Error:", err);
      setStatus('idle');
    }
  }, [formData, finalizeMaterialization, setPendingManifest]);

  // Initial greeting
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentStep('description');
      setStatus('listening');
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Voice State Mapping
  const voiceState: VoiceState = {
    isListening: isRecording,
    isSpeaking: false, // Managed by LiveAPI internally
    currentStep,
    status: isRecording ? 'listening' : status
  };

  return {
    formData,
    setFormData: (data: AgentFormData) => {
        setLocalFormData(data);
        setPendingManifest(data as Partial<Agent>);
    },
    voiceState,
    transcript,
    setTranscript,
    showDeployment,
    setShowDeployment,
    connect,
    disconnect,
    startListening: startRecording,
    stopListening: stopRecording,
    finalizeMaterialization,
    setCurrentStep,
    resynthesize: () => {
      setTranscript('');
      setCurrentStep('description');
      setStatus('idle');
    },
    handleManualSubmit: handleSynthesis // For fallback/testing
  };
}
