'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useGemigramStore } from '@/lib/store/useGemigramStore';
import { useAuth } from '@/components/Providers';
import { Wifi, WifiOff, Database, Zap, RefreshCcw } from 'lucide-react';

export function HUD() {
  const { user } = useAuth();
  const lastSyncedAt = useGemigramStore((state) => state.lastSyncedAt);
  const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;

  const getSyncLabel = () => {
    if (!lastSyncedAt) return 'Sync: Pending';
    const secondsAgo = Math.floor((Date.now() - lastSyncedAt) / 1000);
    if (secondsAgo < 5) return 'Sync: Just Now';
    if (secondsAgo < 60) return `Sync: ${secondsAgo}s ago`;
    return `Sync: ${Math.floor(secondsAgo / 60)}m ago`;
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-[9997] overflow-hidden">
      {/* Top Left - Firebase/Auth Status */}
      <motion.div 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="absolute top-6 left-6 flex items-center gap-4 pointer-events-auto"
      >
        <div className="px-3 py-1.5 rounded-sm border border-white/5 bg-black/40 backdrop-blur-md flex items-center gap-2 group transition-all hover:bg-black/60 cursor-help">
          <Database className={`w-3 h-3 ${user ? 'text-gemigram-neon' : 'text-white/20'}`} />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
            Vault: {user ? 'Sovereign' : 'Ephemeral'}
          </span>
        </div>
        
        <div className="px-3 py-1.5 rounded-sm border border-white/5 bg-black/40 backdrop-blur-md flex items-center gap-2 group">
          <RefreshCcw className={`w-3 h-3 text-gemigram-neon/40 group-hover:rotate-180 transition-transform duration-500`} />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
            {getSyncLabel()}
          </span>
        </div>

        <div className="px-3 py-1.5 rounded-sm border border-white/5 bg-black/40 backdrop-blur-md flex items-center gap-2">
          {isOnline ? (
            <Wifi className="w-3 h-3 text-emerald-400" />
          ) : (
            <WifiOff className="w-3 h-3 text-red-500" />
          )}
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
            {isOnline ? 'Link: OK' : 'Offline'}
          </span>
        </div>
      </motion.div>

      {/* Top Right - Active Intelligence (Gemini Free + ADK) */}
      <motion.div 
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="absolute top-6 right-6 flex items-center gap-4 pointer-events-auto"
      >
        <div className="px-4 py-1.5 rounded-sm border border-white/5 bg-black/40 backdrop-blur-md flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-gemigram-neon animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">
            Flash 2.0 // ADK-Direct
          </span>
        </div>
      </motion.div>

      {/* Aesthetic Borders */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gemigram-neon/20 to-transparent" />
    </div>
  );
}
