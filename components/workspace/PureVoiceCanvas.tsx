'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGemigramStore } from '@/lib/store/useGemigramStore';
import type { Agent } from '@/lib/store/slices/createAgentSlice';
import { ModelSelector } from './ModelSelector';
import { useTranslation } from '../../lib/i18n/useTranslation';
import { SynthesisEngine } from '../../lib/voice/synthesis-engine';

interface PureVoiceCanvasProps {
  activeAgent: Agent;
  googleAccessToken?: string;
}

/**
 * PureVoiceCanvas
 * A high-fidelity, minimalist voice-first interface.
 * Design Principle: "Every visual element amplifies the voice — never competes with it."
 */
export const PureVoiceCanvas: React.FC<PureVoiceCanvasProps> = ({ activeAgent }) => {
  // Individual ZUSTAND Selectors for performance
  const micLevel = useGemigramStore((state) => state.micLevel);
  const isThinking = useGemigramStore((state) => state.isThinking);
  const isSpeaking = useGemigramStore((state) => state.isSpeaking);
  const sessionState = useGemigramStore((state) => state.sessionState);
  const latencyMs = useGemigramStore((state) => state.latencyMs);
  const tokensUsed = useGemigramStore((state) => state.tokensUsed);
  const tokenBudget = useGemigramStore((state) => state.tokenBudget);
  const transcript = useGemigramStore((state) => state.transcript);

  // Local state for Agent Name fade logic
  const [showAgentName, setShowAgentName] = useState(true);
  const { isRTL } = useTranslation();

  // Voice Synthesis Effect: Speak when agent adds a message
  useEffect(() => {
    const lastMsg = transcript[transcript.length - 1];
    if (lastMsg && lastMsg.role === 'agent' && !isSpeaking) {
      SynthesisEngine.speak(lastMsg.content);
    }
  }, [transcript, isSpeaking]);

  // Derived Orb State
  const orbState = useMemo(() => {
    if (sessionState === 'ERROR') return 'error';
    if (isThinking) return 'thinking';
    if (isSpeaking) return 'speaking';
    if (sessionState === 'CONNECTED' || sessionState === 'INITIALIZING') return 'listening';
    return 'idle';
  }, [sessionState, isThinking, isSpeaking]);

  // Agent Name Fade Logic: 4s of silence (micLevel near zero and not speaking)
  useEffect(() => {
    if (micLevel > 0.05 || isSpeaking) {
      setShowAgentName(true);
      return;
    }
    const timer = setTimeout(() => setShowAgentName(false), 4000);
    return () => clearTimeout(timer);
  }, [micLevel, isSpeaking]);

  // Transcript Buffer: Last 2 messages only
  const lastMessages = useMemo(() => transcript.slice(-2), [transcript]);

  // Status Color Mappers
  const getConnectionColor = () => {
    if (sessionState === 'CONNECTED') return 'bg-[#39FF14]';
    if (sessionState === 'ERROR') return 'bg-red-500';
    return 'bg-yellow-500';
  };

  const getLatencyColor = () => {
    if (latencyMs < 150) return 'bg-[#39FF14]';
    if (latencyMs < 300) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getTokenColor = () => {
    const usage = (tokensUsed / tokenBudget) * 100;
    if (usage < 70) return 'bg-[#39FF14]';
    if (usage < 90) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="fixed inset-0 bg-black flex flex-col items-center justify-center overflow-hidden z-50">
      
      {/* [0] Neural Selection Gear */}
      <ModelSelector />

      {/* [1] VoiceOrb */}
      <div className="relative flex items-center justify-center">
        {/* Glow Layer */}
        <motion.div
          animate={{
            scale: 1.0 + (micLevel * 0.4),
            boxShadow: orbState === 'listening' ? '0 0 60px rgba(57,255,20,0.25)' : 
                       orbState === 'speaking' ? '0 0 60px rgba(0,255,194,0.25)' :
                       orbState === 'thinking' ? '0 0 40px rgba(157,80,255,0.15)' :
                       '0 0 30px rgba(57,255,20,0.06)'
          }}
          transition={{ type: 'spring', stiffness: 150, damping: 20 }}
          className="absolute w-32 h-32 md:w-40 md:h-40 rounded-full blur-xl"
        />

        {/* Main Ring Container */}
        <motion.div
          aria-label={`Voice Orb: ${orbState} mode`}
          animate={{
            scale: 1.0 + (micLevel * 0.4),
            borderColor: orbState === 'listening' ? '#39FF14' :
                         orbState === 'speaking' ? '#00FFC2' :
                         orbState === 'thinking' ? '#9D50FF' :
                         orbState === 'error' ? '#ef4444' :
                         'rgba(57,255,20,0.2)'
          }}
          transition={{ type: 'spring', stiffness: 150, damping: 20 }}
          className={`relative w-32 h-32 md:w-40 md:h-40 rounded-full border-2 flex items-center justify-center
            ${orbState === 'thinking' ? 'border-dashed' : 'border-solid'}
            ${orbState === 'error' ? 'animate-pulse' : ''}
          `}
        >
          {/* Internal Thinking Rotation */}
          {orbState === 'thinking' && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
              className="absolute inset-0 rounded-full border-2 border-dashed border-[#9D50FF]/40"
            />
          )}

          {/* Core Pulse */}
          <div className="w-1 h-1 bg-white/20 rounded-full" />
        </motion.div>

        {/* [2] Agent Name */}
        <AnimatePresence>
          {showAgentName && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 0.2, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-40 md:top-48 text-[11px] tracking-[0.15em] uppercase text-white font-medium whitespace-nowrap"
            >
              {activeAgent.name || 'Sovereign Intelligence'}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* [3] Transcript Strip */}
      <div className="fixed bottom-16 left-0 right-0 flex flex-col items-center gap-2 px-6">
        <AnimatePresence mode="popLayout">
          {lastMessages.map((msg, idx) => (
            <motion.div
              key={msg.id || idx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 0.5, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.5 }}
              className="text-[13px] text-white/50 text-center max-w-md leading-relaxed"
            >
              {msg.content}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* [4] Status Dots */}
      <div className="fixed bottom-4 right-4 flex items-center gap-[6px]">
        {/* Connection Dot */}
        <Tooltip text={`Connection: ${sessionState}`}>
          <div aria-label="Connection Status" className={`w-2 h-2 rounded-full ${getConnectionColor()} transition-colors duration-500 shadow-[0_0_8px_rgba(255,255,255,0.1)]`} />
        </Tooltip>
        
        {/* Latency Dot */}
        <Tooltip text={`Latency: ${latencyMs}ms`}>
          <div aria-label="Latency Status" className={`w-2 h-2 rounded-full ${getLatencyColor()} transition-colors duration-500 shadow-[0_0_8px_rgba(255,255,255,0.1)]`} />
        </Tooltip>

        {/* Tokens Dot */}
        <Tooltip text={`Tokens: ${tokensUsed}/${tokenBudget}`}>
          <div aria-label="Token Usage" className={`w-2 h-2 rounded-full ${getTokenColor()} transition-colors duration-500 shadow-[0_0_8px_rgba(255,255,255,0.1)]`} />
        </Tooltip>
      </div>

    </div>
  );
};

// Internal Ghost Tooltip Component
const Tooltip: React.FC<{ children: React.ReactNode; text: string }> = ({ children, text }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div className="relative" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      {children}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="absolute bottom-6 right-0 bg-white/5 backdrop-blur-md border border-white/10 px-2 py-1 rounded text-[10px] text-white/70 whitespace-nowrap shadow-xl"
          >
            {text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
