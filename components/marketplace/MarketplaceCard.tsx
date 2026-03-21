'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Download, ShieldCheck, Zap, Loader2, Check, Box } from 'lucide-react';
import type { Agent } from '@/lib/store/slices/createAgentSlice';
import { useTranslation } from '@/hooks/useTranslation';

interface MarketplaceCardProps {
  agent: Agent;
  onInstall: (agent: Agent) => void;
  isInstalled?: boolean;
  isInstalling?: boolean;
}

export const MarketplaceCard: React.FC<MarketplaceCardProps> = ({ 
  agent, 
  onInstall, 
  isInstalled = false, 
  isInstalling = false 
}) => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={!isInstalled && !isInstalling ? { scale: 1.02, boxShadow: '0 0 25px rgba(0, 255, 255, 0.2)' } : {}}
      role="article"
      aria-label={`${agent.name} - ${agent.role}`}
      className={`relative group border rounded-2xl p-6 overflow-hidden backdrop-blur-md transition-all duration-300 ${
        isInstalled 
        ? 'bg-zinc-900/30 border-white/5 opacity-80' 
        : 'glass-medium border-white/10 hover:border-gemigram-neon/50 hover:shadow-[0_0_30px_rgba(57,255,20,0.15)]'
      }`}
    >
      {/* Background Accent */}
      <div 
        aria-hidden="true"
        className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl transition-colors duration-500 ${
          isInstalled ? 'bg-zinc-800/10' : 'bg-gemigram-neon/5 group-hover:bg-gemigram-neon/20'
        }`} 
      />
      
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className={`relative w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-2xl transition-all duration-500 overflow-hidden ${
          isInstalled ? 'bg-zinc-800 grayscale' : 'bg-gradient-to-br from-zinc-900 to-black border border-white/10 group-hover:border-gemigram-neon/50'
        }`}>
          {/* Neural Pulse Layer */}
          <motion.div 
            animate={{ opacity: [0.1, 0.3, 0.1], scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute inset-0 bg-gemigram-neon/5"
          />
          
          {agent.avatarUrl ? (
            <img src={agent.avatarUrl} alt={`${agent.name} ${t('marketplace.avatar')}`} className="w-full h-full object-cover rounded-2xl relative z-10" />
          ) : (
            <Zap aria-hidden="true" className="w-8 h-8 text-gemigram-neon relative z-10" />
          )}

          {/* Icon Scanning Bar */}
          {!isInstalled && (
            <motion.div 
              animate={{ y: [-40, 40, -40] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-x-0 h-0.5 bg-gemigram-neon/40 blur-[1px] z-20"
            />
          )}
        </div>
        
        <div className="flex flex-col items-end gap-2">
          <div 
            className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-[10px] font-black text-gemigram-neon border border-gemigram-neon/20 shadow-neon-small"
            aria-label={`${t('marketplace.rating')}: ${agent.rating || '4.9'} ${t('marketplace.stars')}`}
          >
            <Star aria-hidden="true" className="w-3 h-3 fill-gemigram-neon" />
            {agent.rating || '4.9'}
          </div>
          {isInstalled && (
            <div className="text-[8px] font-black text-gemigram-neon/50 bg-gemigram-neon/5 px-2 py-0.5 rounded border border-gemigram-neon/10">
              OWNED
            </div>
          )}
        </div>
      </div>

      <div className="relative z-10">
        <h3 className={`text-xl font-bold mb-1 transition-colors ${
          isInstalled ? 'text-zinc-500' : 'text-white group-hover:text-gemigram-neon'
        }`}>
          {agent.name}
        </h3>
        <p className="text-zinc-400 text-sm mb-4 line-clamp-2 min-h-[40px]">
          {agent.role} • {t('marketplace.by')} {agent.creatorNickname || t('marketplace.sovereign_architect')}
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          <span className="px-2 py-1 bg-white/5 text-zinc-300 text-[10px] uppercase tracking-wider rounded border border-white/10">
            {agent.category || t('marketplace.general')}
          </span>
          {agent.tools?.googleSearch && (
            <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-[10px] uppercase tracking-wider rounded border border-blue-500/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              G-Search
            </span>
          )}
          {agent.aetherId === 'gws-master' && (
             <span className="px-2 py-1 bg-gemigram-neon/10 text-gemigram-neon text-[10px] uppercase tracking-wider rounded border border-gemigram-neon/30 flex items-center gap-1">
               <span className="w-1.5 h-1.5 rounded-full bg-gemigram-neon shadow-neon-small" />
               GWS_MASTER
             </span>
          )}
          {(agent.role.includes('Neural') || agent.role.includes('Astro')) && (
             <span className="px-2 py-1 bg-purple-500/10 text-purple-400 text-[10px] uppercase tracking-wider rounded border border-purple-500/30 flex items-center gap-1">
               <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
               AI_STUDIO
             </span>
          )}
        </div>

        <button
          disabled={isInstalled || isInstalling}
          onClick={() => onInstall(agent)}
          aria-label={isInstalling ? t('marketplace.installing') : isInstalled ? t('marketplace.owned') : `${t('marketplace.install')} ${agent.name}`}
          className={`w-full py-4 font-black uppercase tracking-[0.2em] text-[10px] rounded-xl flex items-center justify-center gap-3 transition-all duration-300 active:scale-95 group/btn relative overflow-hidden ${
            isInstalled 
            ? 'bg-white/5 text-white/20 cursor-default border border-white/5' 
            : 'bg-white text-black hover:bg-gemigram-neon hover:text-black hover:shadow-[0_0_30px_rgba(57,255,20,0.3)]'
          }`}
        >
          <AnimatePresence mode="wait">
            {isInstalling ? (
              <motion.div 
                key="installing"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2"
              >
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                <span>{t('marketplace.manifesting')}</span>
              </motion.div>
            ) : isInstalled ? (
              <motion.div 
                key="owned"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2"
              >
                <Check className="w-4 h-4" aria-hidden="true" />
                <span>{t('marketplace.owned')}</span>
              </motion.div>
            ) : (
              <motion.div 
                key="default"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4 group-hover/btn:translate-y-0.5 transition-transform" aria-hidden="true" />
                <span>{t('marketplace.initialize')}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* 3D Construct Overlay during installation */}
      <AnimatePresence>
        {isInstalling && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center"
          >
            <div className="relative w-20 h-20 mb-6">
               <motion.div 
                 animate={{ rotate: 360 }}
                 transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                 className="absolute inset-0 border-2 border-gemigram-neon/30 border-t-gemigram-neon rounded-full"
               />
               <motion.div 
                 animate={{ rotate: -360 }}
                 transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                 className="absolute inset-2 border border-gemigram-neon/10 border-b-gemigram-neon/50 rounded-full border-dashed"
               />
               <div className="absolute inset-0 flex items-center justify-center">
                  <Box className="w-8 h-8 text-gemigram-neon animate-pulse" />
               </div>
            </div>
            <p className="text-[10px] font-black text-gemigram-neon uppercase tracking-[0.4em] mb-2">Constructing_Neural_Bridge</p>
            <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: "100%" }}
                 transition={{ duration: 2 }}
                 className="h-full bg-gemigram-neon shadow-[0_0_10px_rgba(57,255,20,0.5)]"
               />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-4 pt-4 border-t border-zinc-800/50 flex items-center justify-between text-[10px] text-zinc-500 uppercase tracking-widest relative z-10">
        <div className="flex items-center gap-1">
          <ShieldCheck aria-hidden="true" className={`w-3 h-3 ${isInstalled ? 'text-zinc-600' : 'text-gemigram-neon'}`} />
          {t('marketplace.neural_verified')}
        </div>
        <div aria-label={`${t('marketplace.version')} 1.0.4`}>V1.0.4</div>
      </div>
    </motion.div>
  );
};
