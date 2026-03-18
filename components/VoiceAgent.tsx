'use client';

import dynamic from 'next/dynamic';
import { useVoiceAgentLogic } from '@/lib/hooks/useVoiceAgentLogic';
import { useAetherStore, Agent } from '../lib/store/useAetherStore';
import { WidgetRenderer } from './WidgetRenderer';
import { Mic, MicOff, Activity, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useMemo } from 'react';
import { useVisualTier } from '@/lib/hooks/useVisualTier';

const SovereignDashboard = dynamic(
  () => import('./SovereignDashboard').then((mod) => mod.SovereignDashboard),
  {
    ssr: false,
    loading: () => <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,255,135,0.05),transparent_60%)]" />,
  }
);

export function VoiceAgent({ activeAgent, googleAccessToken }: { activeAgent: Agent; googleAccessToken?: string }) {
  const setVoiceSession = useAetherStore((state) => state.setVoiceSession);
  const { tier, allowMotion, allowAmbientMotion, isMobile } = useVisualTier();

  const {
    isConnected,
    isRecording,
    logs,
    volume,
    agentStatus,
    activeWidget,
    transcript,
    linkType,
    showLogs,
    setShowLogs,
    toggleConnection,
    startRecording,
    stopRecording,
  } = useVoiceAgentLogic({ activeAgent, googleAccessToken });

  useEffect(() => {
    setVoiceSession({
      stage: 'workspace',
      lastVoiceAction: isConnected
        ? isRecording
          ? 'You are live. Keep speaking naturally.'
          : 'Tap the mic to start your next voice turn.'
        : 'Use Establish Link to reconnect your voice channel.',
    });
  }, [isConnected, isRecording, setVoiceSession]);

  const voiceActionPrompt = useMemo(() => {
    if (!isConnected) return 'Voice link is offline. Re-establish to continue voice-first flow.';
    if (isRecording) return 'Listening now. Share your request in one sentence.';
    return 'Connection is active. Tap mic for your next voice action.';
  }, [isConnected, isRecording]);

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-[#030303]" data-visual-tier={tier}>
      <SovereignDashboard
        activeAgent={activeAgent}
        volume={volume}
        status={agentStatus}
        linkType={linkType}
        transcript={transcript}
      />

      <div className="absolute bottom-36 left-1/2 z-[105] w-[min(92vw,52rem)] -translate-x-1/2 md:bottom-40">
        <div className={`flex items-center justify-between gap-4 rounded-2xl border border-white/12 px-4 py-4 md:px-5 ${isMobile ? 'glass-subtle' : 'glass-medium'}`}>
          <div>
            <p className="font-bold text-[10px] uppercase tracking-[0.25em] text-gemigram-neon/80">Voice Link Status · {agentStatus}</p>
            <p className="text-sm text-white/85">{voiceActionPrompt}</p>
          </div>
          {!isConnected && (
            <button
              onClick={toggleConnection}
              className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-gemigram-neon/30 bg-gemigram-neon/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-gemigram-neon"
            >
              <RotateCcw className={`h-3.5 w-3.5 ${allowAmbientMotion ? 'animate-spin-slow' : ''}`} />
              Re-establish voice link
            </button>
          )}
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 z-[100] flex -translate-x-1/2 items-center gap-4 md:bottom-12 md:gap-6">
        <motion.button
          whileHover={allowAmbientMotion ? { scale: 1.04 } : undefined}
          whileTap={allowMotion ? { scale: 0.96 } : undefined}
          onClick={toggleConnection}
          className={`rounded-2xl px-6 py-4 text-[10px] font-black uppercase tracking-[0.24em] transition-all md:px-8 ${
            isConnected
              ? 'border border-red-500/30 bg-red-500/20 text-red-500'
              : 'border border-gemigram-neon/30 bg-gemigram-neon/20 text-gemigram-neon'
          }`}
        >
          {isConnected ? 'Kill_Link' : 'Establish_Link'}
        </motion.button>

        <motion.button
          whileHover={allowAmbientMotion ? { scale: 1.06 } : undefined}
          whileTap={allowMotion ? { scale: 0.94 } : undefined}
          onClick={() => (isRecording ? stopRecording() : startRecording())}
          disabled={!isConnected}
          className={`flex h-14 w-14 items-center justify-center rounded-2xl transition-all md:h-16 md:w-16 ${
            !isConnected
              ? 'bg-white/5 text-white/20'
              : isRecording
                ? 'border border-red-500/40 bg-red-500 text-white'
                : 'border border-white/10 bg-white/10 text-white'
          } ${isRecording && allowAmbientMotion ? 'animate-pulse' : ''}`}
        >
          {isRecording ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
        </motion.button>

        <button
          onClick={() => setShowLogs(!showLogs)}
          className={`rounded-xl border px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] ${showLogs ? 'border-gemigram-neon/30 text-gemigram-neon' : 'border-white/10 text-white/60'}`}
        >
          Logs
        </button>
      </div>

      <AnimatePresence>
        {activeWidget && (
          <div className="pointer-events-none absolute inset-x-0 bottom-36 z-[110] flex justify-center px-4 md:bottom-40 md:px-6">
            <motion.div
              initial={allowMotion ? { opacity: 0, y: 40, scale: 0.96 } : false}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={allowMotion ? { opacity: 0, y: 24, scale: 0.98 } : undefined}
              className={`pointer-events-auto w-full max-w-2xl rounded-[28px] border border-gemigram-neon/20 p-5 shadow-2xl md:p-8 ${isMobile ? 'glass-subtle' : 'glass-medium'}`}
            >
              <WidgetRenderer data={activeWidget} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showLogs && (
          <motion.div
            initial={allowMotion ? { x: '-100%' } : false}
            animate={{ x: 0 }}
            exit={allowMotion ? { x: '-100%' } : undefined}
            className={`absolute left-0 top-0 bottom-0 z-20 flex ${isMobile ? 'w-[88vw] max-w-sm' : 'w-80'} flex-col border-r border-white/10 p-6 md:p-8 ${isMobile ? 'glass-subtle' : 'glass-medium'}`}
          >
            <h3 className="mb-6 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 md:mb-8">
              <Activity className={`h-4 w-4 ${allowAmbientMotion ? 'animate-pulse' : ''}`} /> Neural Logs
            </h3>
            <div className="custom-scrollbar flex flex-1 flex-col-reverse overflow-y-auto pr-2">
              <div className="flex flex-col gap-3">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className={`font-mono text-[10px] leading-relaxed ${
                      log.type === 'system'
                        ? 'text-slate-500'
                        : log.type === 'user'
                          ? 'text-emerald-400'
                          : log.type === 'tool'
                            ? 'text-fuchsia-400'
                            : 'text-cyan-400'
                    }`}
                  >
                    <span className="mr-2 opacity-30">[{log.timestamp}]</span>
                    {log.text}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}
