'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Shield, Zap, Globe } from 'lucide-react';

export function EnterpriseHero({ onLogin }: { onLogin: () => void }) {
  return (
    <section className="relative min-h-[95vh] flex items-center justify-center pt-32 pb-20 overflow-hidden bg-carbon-black">
      {/* Subtle Carbon Fiber Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      
      {/* Ambient Depth Background - Enhanced with Neon Green */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[10%] left-[15%] w-[40vw] h-[40vw] bg-gradient-to-br from-neon-green/10 to-aether-neon/5 rounded-full blur-[180px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[15%] w-[35vw] h-[35vw] bg-gradient-to-tl from-electric-purple/10 to-neon-blue/5 rounded-full blur-[130px]" />
        <div className="absolute top-[50%] left-[50%] w-[30vw] h-[30vw] bg-cyber-lime/5 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full cyber-panel mb-12 border-neon-green/30 bg-gradient-to-r from-neon-green/10 to-transparent"
          >
            <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse shadow-[0_0_10px_rgba(16,255,135,0.8)]" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neon-green">
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
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-neon-green via-mint-chip to-neon-blue drop-shadow-[0_0_30px_rgba(16,255,135,0.3)]">
              Autonomous Hubs.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-white/30 max-w-2xl mx-auto mb-16 leading-relaxed font-medium"
          >
            Deploy enterprise neural entities with absolute sovereignty. 
            Native <span className="text-white/60">Gemini 2.5 Flash</span> orchestration on a zero-latency carbon spine.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-5"
          >
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: '0 0 50px rgba(16,255,135,0.3)' }}
              whileTap={{ scale: 0.98 }}
              onClick={onLogin}
              className="w-full sm:w-auto px-12 py-5 cyber-accent-button rounded-2xl text-lg font-black uppercase tracking-widest bg-gradient-to-r from-neon-green to-mint-chip border-neon-green/50 shadow-[0_0_30px_rgba(16,255,135,0.2)] hover:shadow-[0_0_50px_rgba(16,255,135,0.4)]"
            >
              Launch Terminal
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(0,240,255,0.2)' }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto px-12 py-5 cyber-panel rounded-2xl text-white/50 font-bold text-lg hover:text-white transition-all border border-white/10 hover:border-neon-blue/30"
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
