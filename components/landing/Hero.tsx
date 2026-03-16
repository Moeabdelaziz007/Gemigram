'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Shield, Zap, Globe } from 'lucide-react';

export function EnterpriseHero({ onLogin }: { onLogin: () => void }) {
  return (
    <section className="relative min-h-[95vh] flex items-center justify-center pt-32 pb-20 overflow-hidden bg-carbon-black">
      {/* Subtle Carbon Fiber Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      
      {/* Ambient Depth Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[10%] left-[15%] w-[40vw] h-[40vw] bg-carbon-neon/5 rounded-full blur-[180px]" />
        <div className="absolute bottom-[10%] right-[15%] w-[35vw] h-[35vw] bg-carbon-gray/10 rounded-full blur-[130px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full cyber-panel mb-12 border-carbon-neon/20"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-carbon-neon animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
              Protocol: Neural-Local · Active Node
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.85] text-white mb-10"
          >
            Architecting <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-carbon-neon via-white/90 to-carbon-gray">
              Autonomous Hubs.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-white/30 max-w-2xl mx-auto mb-16 leading-relaxed font-medium"
          >
            Deploy enterprise neural entities with sovereign data privacy. 
            Native Gemini 1.5 Pro integration on a carbon-fiber secure spine.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-5"
          >
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(57,255,20,0.1)' }}
              whileTap={{ scale: 0.98 }}
              onClick={onLogin}
              className="w-full sm:w-auto px-12 py-5 cyber-accent-button rounded-2xl text-lg font-black uppercase tracking-widest"
            >
              Launch Terminal
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto px-12 py-5 cyber-panel rounded-2xl text-white/50 font-bold text-lg hover:text-white transition-all"
            >
              Docs & API
            </motion.button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-12 mt-32 max-w-4xl mx-auto border-t border-white/[0.03] pt-12"
          >
            {[
              { icon: Shield, label: 'Carbon Secure' },
              { icon: Activity, label: 'L1 Latency' },
              { icon: Zap, label: 'Neon Realtime' },
              { icon: Globe, label: 'Edge Distributed' },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center gap-3 group">
                <item.icon className="w-5 h-5 text-carbon-neon/30 group-hover:text-carbon-neon transition-colors" />
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 group-hover:text-white/60 transition-colors">
                  {item.label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
