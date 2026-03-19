'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGemigramStore } from '@/lib/store/useGemigramStore';
import { Cpu, Brain, Sparkles } from 'lucide-react';

const PROVIDERS = [
  { id: 'google', name: 'Gemini 2.0', model: 'gemini-2.0-flash-exp', icon: Sparkles, color: 'text-blue-400' },
  { id: 'anthropic', name: 'Claude 3.5', model: 'claude-3-5-sonnet-20241022', icon: Brain, color: 'text-orange-400' },
  { id: 'deepseek', name: 'DeepSeek', model: 'deepseek-chat', icon: Cpu, color: 'text-cyan-400' },
] as const;

export const ModelSelector: React.FC = () => {
  const activeProvider = useGemigramStore((state) => state.activeProvider);
  const setNeuralSelection = useGemigramStore((state) => state.setNeuralSelection);
  const [isOpen, setIsOpen] = React.useState(false);

  const activeInfo = PROVIDERS.find((p) => p.id === activeProvider) || PROVIDERS[0];

  return (
    <div className="fixed top-6 left-6 z-[60]">
      <div className="relative">
        {/* Trigger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-3 px-4 py-2 rounded-full border transition-all duration-300
            ${isOpen ? 'bg-white/10 border-white/20' : 'bg-black/40 border-white/5 hover:border-white/10'}
            backdrop-blur-xl glass-light group
          `}
        >
          <activeInfo.icon className={`w-4 h-4 ${activeInfo.color} group-hover:scale-110 transition-transform`} />
          <span className="text-[11px] font-mono tracking-widest uppercase text-white/70">
            {activeInfo.name}
          </span>
          <div className={`w-1 h-1 rounded-full bg-white/20 ml-1 ${isOpen ? 'rotate-180' : ''} transition-transform`} />
        </button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              className="absolute top-12 left-0 w-48 rounded-2xl border border-white/10 bg-black/60 backdrop-blur-2xl p-2 shadow-2xl overflow-hidden"
            >
              <div className="px-3 py-2 border-b border-white/5 mb-1">
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/30">Neural Fabric</p>
              </div>
              
              {PROVIDERS.map((provider) => (
                <button
                  key={provider.id}
                  onClick={() => {
                    setNeuralSelection(provider.id, provider.model);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group
                    ${activeProvider === provider.id ? 'bg-white/5' : 'hover:bg-white/5'}
                  `}
                >
                  <provider.icon className={`w-4 h-4 ${activeProvider === provider.id ? provider.color : 'text-white/20 group-hover:text-white/40'}`} />
                  <div className="flex flex-col items-start">
                    <span className={`text-[12px] font-medium ${activeProvider === provider.id ? 'text-white' : 'text-white/50 group-hover:text-white/70'}`}>
                      {provider.name}
                    </span>
                    <span className="text-[9px] font-mono text-white/20 uppercase tracking-tighter">
                      {provider.model.split('-')[0]} // {provider.id}
                    </span>
                  </div>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
