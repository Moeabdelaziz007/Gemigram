'use client';

import { useWorkspaceLogic } from '@/lib/hooks/useWorkspaceLogic';
import { VoiceAgent } from '@/components/VoiceAgent';
import { Activity, AlertCircle, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WorkspacePage() {
  const { user, googleAccessToken, activeAgent, isLoading, hasError, errorDetails, router } = useWorkspaceLogic();

  if (!user) return null;

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-theme-primary px-4 py-10">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-5 text-center">
          <div className="relative mx-auto h-20 w-20 sm:h-24 sm:w-24">
            <div className="absolute inset-0 rounded-full border-2 border-neon-green/20" />
            <div className="absolute inset-2 rounded-full border-2 border-neon-blue/30" />
            <div className="absolute inset-4 rounded-full border-2 border-electric-purple/40" />
            <motion.div
              className="absolute inset-0 rounded-full border-t-2 border-neon-green"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          </div>
          <div className="space-y-2">
            <p className="text-base font-medium text-white/70">Initializing Neural Interface</p>
            <p className="text-[10px] uppercase tracking-widest text-white/30">Synchronizing Agent Matrix...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-theme-primary p-4 sm:p-6 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md rounded-2xl border border-red-500/20 bg-gradient-to-br from-red-500/5 to-transparent p-6 glass-medium sm:p-8"
        >
          <div className="mb-5 flex items-center gap-3">
            <AlertCircle className="h-6 w-6 text-red-400" />
            <h2 className="text-xl font-bold text-white">Neural Link Failure</h2>
          </div>
          <p className="mb-6 text-white/60">{errorDetails || 'Failed to initialize workspace environment.'}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full rounded-xl border border-red-500/30 bg-gradient-to-r from-red-500/20 to-red-500/10 px-6 py-3 font-bold uppercase tracking-widest text-red-400 transition-all hover:bg-red-500/20"
          >
            Reinitialize System
          </button>
        </motion.div>
      </div>
    );
  }

  if (!activeAgent) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-theme-primary p-4 sm:p-6 md:p-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md space-y-6 text-center">
          <Cpu className="mx-auto h-14 w-14 text-white/10 sm:h-16 sm:w-16" />
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">No Active Agent</h2>
            <p className="text-white/60">Create your first Sovereign Intelligence to begin.</p>
          </div>
          <button onClick={() => router.push('/forge')} className="btn-primary w-full sm:w-auto">
            Navigate to Forge
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-theme-primary">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.02]" />
      <div className="pointer-events-none absolute left-1/4 top-0 h-72 w-72 rounded-full bg-gradient-to-br from-neon-green/5 to-transparent blur-[120px] sm:h-96 sm:w-96" />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="safe-top absolute left-0 right-0 top-0 z-50 border-b border-white/5 glass-medium px-4 py-3 sm:px-6"
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <div className="inline-flex w-fit items-center gap-2 rounded-lg border border-neon-green/20 bg-neon-green/5 px-3 py-1.5">
              <Activity className="h-3.5 w-3.5 animate-pulse text-neon-green" />
              <span className="text-[9px] font-black uppercase tracking-widest text-neon-green">Active Session</span>
            </div>
            <div className="truncate text-xs text-white/40">
              <span className="font-medium text-white/70">{activeAgent.name}</span>
              <span className="mx-2">·</span>
              <span>{activeAgent.role}</span>
            </div>
          </div>
          <div className="text-[10px] uppercase tracking-widest text-white/30">Workspace Terminal</div>
        </div>
      </motion.div>

      <div className="h-full pt-20 sm:pt-24">
        <VoiceAgent activeAgent={activeAgent} googleAccessToken={googleAccessToken || undefined} />
      </div>
    </div>
  );
}
