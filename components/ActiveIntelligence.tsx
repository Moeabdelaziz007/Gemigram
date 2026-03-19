'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from './Providers';
import { useGemigramStore } from '@/lib/store/useGemigramStore';
import { runProactiveLoop } from '@/lib/orchestrator';
import { Sparkles, Brain, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Active Intelligence (Co-pilot)
 * Proactively suggests actions based on the current workspace state.
 */
export function ActiveIntelligence() {
  const { user } = useAuth();
  const { agents } = useGemigramStore();
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!user || agents.length === 0) return;

    const fetchSuggestion = async () => {
      try {
        const context = `User has ${agents.length} active agents. Latest activity: Workspace stabilized.`;
        const result = await runProactiveLoop(context);
        if (result) {
          setSuggestion(result);
          setIsVisible(true);
          // Hide after 10 seconds to keep it non-intrusive
          setTimeout(() => setIsVisible(false), 10000);
        }
      } catch (err) {
        console.warn('[Active_Intelligence_Offline]:', err);
      }
    };

    // Run every 2 minutes for proactive feel without spamming
    const interval = setInterval(fetchSuggestion, 120000);
    // Initial fetch after 5 seconds
    const initialTimer = setTimeout(fetchSuggestion, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(initialTimer);
    };
  }, [user, agents.length]);

  return (
    <AnimatePresence>
      {isVisible && suggestion && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-8 right-8 z-[100] max-w-sm"
        >
          <div className="p-[1px] rounded-2xl bg-gradient-to-br from-gemigram-neon/40 to-transparent backdrop-blur-3xl shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
            <div className="bg-black/80 rounded-[15px] p-5 flex flex-col gap-4 border border-white/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-gemigram-neon/10 border border-gemigram-neon/20">
                    <Sparkles className="w-4 h-4 text-gemigram-neon" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/80">Active_Intelligence</span>
                </div>
                <button onClick={() => setIsVisible(false)} className="text-white/20 hover:text-white/60 transition-colors text-xs">DISMISS</button>
              </div>

              <div className="flex gap-3">
                <Brain className="w-5 h-5 text-white/20 shrink-0 mt-1" />
                <p className="text-[11px] leading-relaxed text-white/70 italic font-medium">
                   "{suggestion.split('\n')[0].replace(/^[0-9.]+\s*/, '')}"
                </p>
              </div>

              <button className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-gemigram-neon text-black text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform">
                Execute_Suggestion
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
