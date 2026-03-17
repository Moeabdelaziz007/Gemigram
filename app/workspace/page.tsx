'use client';

import { useWorkspaceLogic } from '@/lib/hooks/useWorkspaceLogic';
import { VoiceAgent } from '@/components/VoiceAgent';
import { Activity, AlertCircle, Cpu } from 'lucide-react';

import { motion } from 'framer-motion';

export default function WorkspacePage() {
  const { 
    user, 
    googleAccessToken, 
    activeAgent, 
    isLoading, 
    hasError, 
    errorDetails, 
    router 
  } = useWorkspaceLogic();

  if (!user) return null;


  // Loading State
  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-theme-primary">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6"
        >
          <div className="relative w-24 h-24 mx-auto">
            <div className="absolute inset-0 rounded-full border-2 border-neon-green/20" />
            <div className="absolute inset-2 rounded-full border-2 border-neon-blue/30" />
            <div className="absolute inset-4 rounded-full border-2 border-electric-purple/40" />
            <motion.div 
              className="absolute inset-0 rounded-full border-t-2 border-neon-green"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
          <div className="space-y-2">
            <p className="text-white/60 font-medium">Initializing Neural Interface</p>
            <p className="text-[10px] uppercase tracking-widest text-white/30">Synchronizing Agent Matrix...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  // Error State
  if (hasError) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-theme-primary p-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full glass-medium border-red-500/20 bg-gradient-to-br from-red-500/5 to-transparent rounded-2xl p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <AlertCircle className="w-6 h-6 text-red-400" />
            <h2 className="text-xl font-bold text-white">Neural Link Failure</h2>
          </div>
          <p className="text-white/60 mb-6">{errorDetails || 'Failed to initialize workspace environment.'}</p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full px-6 py-3 bg-gradient-to-r from-red-500/20 to-red-500/10 border border-red-500/30 rounded-xl text-red-400 font-bold uppercase tracking-widest hover:bg-red-500/20 transition-all"
          >
            Reinitialize System
          </button>
        </motion.div>
      </div>
    );
  }

  // No Agents State
  if (!activeAgent) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-theme-primary p-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full text-center space-y-6"
        >
          <Cpu className="w-16 h-16 mx-auto text-white/10" />
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">No Active Agent</h2>
            <p className="text-white/60">Create your first Sovereign Intelligence to begin.</p>
          </div>
          <button 
            onClick={() => router.push('/forge')}
            className="px-8 py-3 bg-gradient-to-r from-neon-green to-mint-chip rounded-xl text-black font-bold uppercase tracking-widest hover:shadow-[0_0_30px_rgba(16,255,135,0.3)] transition-all"
          >
            Navigate to Forge
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full bg-theme-primary overflow-hidden">
      {/* Ambient Background Grid */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
      
      {/* Neon Green Accent Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-neon-green/5 to-transparent rounded-full blur-[120px] pointer-events-none" />
      
      {/* Status Bar */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-0 left-0 right-0 z-50 px-6 py-4 border-b border-white/5 glass-medium"
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neon-green/5 border border-neon-green/20">
              <Activity className="w-3.5 h-3.5 text-neon-green animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-widest text-neon-green">Active Session</span>
            </div>
            <div className="text-xs text-white/40">
              <span className="text-white/60 font-medium">{activeAgent.name}</span>
              <span className="mx-2">·</span>
              <span>{activeAgent.role}</span>
            </div>
          </div>
          <div className="text-[10px] uppercase tracking-widest text-white/30">
            Workspace Terminal
          </div>
        </div>
      </motion.div>

      {/* Main VoiceAgent Component */}
      <div className="pt-16 h-full">
        <VoiceAgent activeAgent={activeAgent} googleAccessToken={googleAccessToken} />
      </div>
    </div>
  );
}
