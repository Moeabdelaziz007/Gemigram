'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Shield, Zap, Globe, Users, Cpu, Network } from 'lucide-react';

export function EnterpriseHero({ onLogin }: { onLogin: () => void }) {
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState({ agents: 0, latency: 0, uptime: 0 });

  useEffect(() => {
    setMounted(true);
    // Animate counter for stats
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    let step = 0;
    
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      setStats({
        agents: Math.floor(2847 * easeOut),
        latency: Math.floor(12 * easeOut),
        uptime: Math.floor(99.99 * easeOut)
      });
      
      if (step >= steps) clearInterval(timer);
    }, interval);
    
    return () => clearInterval(timer);
  }, []);
  return (
    <section className="relative min-h-[95vh] flex items-center justify-center pt-32 pb-20 overflow-hidden bg-carbon-black">
      {/* Subtle Carbon Fiber Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      
      {/* Ambient Depth Background - Fixed with Cinematic Asset */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-screen" style={{ backgroundImage: "url('/hero_bg.png')" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
        <div className="absolute top-[10%] left-[15%] w-[40vw] h-[40vw] bg-gradient-to-br from-gemigram-neon/20 to-gemigram-neon/5 rounded-full blur-[180px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[15%] w-[35vw] h-[35vw] bg-gradient-to-tl from-gemigram-neon/10 to-transparent rounded-full blur-[130px]" />
        <div className="absolute top-[50%] left-[50%] w-[30vw] h-[30vw] bg-gemigram-neon/10 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center">
        {/* Animated Central Core (Orb/Brain) - Matching reference image 2 */}
        <div className="relative mb-20">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 90, 180, 270, 360],
              opacity: [0.6, 0.8, 0.6]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="w-[450px] h-[450px] md:w-[600px] md:h-[600px] rounded-full relative"
            style={{
              background: 'radial-gradient(circle, rgba(16,255,135,0.4) 0%, rgba(16,255,135,0.1) 40%, transparent 70%)',
              filter: 'blur(30px)'
            }}
          >
            {/* Spinning Energy Rings */}
            <div className="absolute inset-0 border-4 border-gemigram-neon/10 rounded-full animate-spin [animation-duration:8s]" />
            <div className="absolute inset-10 border-2 border-gemigram-neon/20 rounded-full animate-spin [animation-duration:12s] direction-reverse" />
          </motion.div>
          
          {/* Internal Neural Hub (Glassy Center) */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-64 md:w-80 md:h-80 rounded-full glass-strong border border-gemigram-neon/40 flex items-center justify-center p-8 overflow-hidden relative group">
               <motion.div 
                 animate={{ 
                    scale: [0.9, 1.1, 0.9],
                    filter: ['hue-rotate(0deg)', 'hue-rotate(90deg)', 'hue-rotate(0deg)'],
                    boxShadow: ['0 0 50px rgba(57,255,20,0.5)', '0 0 150px rgba(57,255,20,0.8)', '0 0 50px rgba(57,255,20,0.5)']
                 }}
                 transition={{ duration: 3, repeat: Infinity }}
                 className="w-full h-full rounded-full bg-gradient-to-br from-gemigram-neon to-gemigram-mint mix-blend-screen opacity-90 shadow-[0_0_100px_rgba(57,255,20,0.4)]" 
               />
               <div className="absolute inset-0 bg-black/40 backdrop-blur-3xl rounded-full" />
               {/* Mascot Silhouette - Sharpened */}
               <Fingerprint className="absolute w-40 h-40 text-white/10 group-hover:text-gemigram-neon transition-colors duration-1000 z-10" />
            </div>
          </div>
        </div>

        {/* Brand Typography - Matching reference image 2 */}
        <div className="text-center z-20">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-8xl md:text-[12rem] font-black tracking-[-0.05em] leading-[0.8] mb-6 neon-shimmer uppercase"
          >
            Gemigram
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl md:text-2xl text-white/40 font-bold uppercase tracking-[0.4em] mb-12"
          >
            The Voice-Native AI Social Nexus
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row items-center justify-center gap-8"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 80px rgba(57,255,20,0.5)' }}
              whileTap={{ scale: 0.95 }}
              onClick={onLogin}
              className="px-20 py-8 bg-gemigram-neon text-black rounded-full text-2xl font-black uppercase tracking-[0.2em] shadow-[0_0_50px_rgba(57,255,20,0.4)] transition-all"
            >
              Initialize_System
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.05)' }}
              whileTap={{ scale: 0.95 }}
              className="px-16 py-8 border border-white/10 text-white rounded-full text-xl font-black uppercase tracking-[0.2em] transition-all backdrop-blur-xl"
            >
              Explore_Mainnet
            </motion.button>
          </motion.div>
        </div>

        {/* Agent Hive Preview - The grid of bots in reference image 2 */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="w-full mt-40 glass-medium border border-white/5 rounded-[3rem] p-12 overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gemigram-neon/5 blur-[100px] pointer-events-none" />
          
          <div className="flex justify-between items-center mb-16">
            <h2 className="text-3xl font-black uppercase tracking-tighter text-white">Agent_Hive</h2>
            <div className="flex gap-4">
               {[1,2].map(i => <div key={i} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/30">{"< >"[i-1]}</div>)}
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="sovereign-glass p-6 group hover:border-gemigram-neon/40 transition-all cursor-pointer relative overflow-hidden">
                <div className="aspect-[4/5] rounded-2xl bg-white/5 mb-6 overflow-hidden relative">
                   <img 
                    src={`/agents/robot_${(i % 3) + 1}.png`} 
                    alt="" 
                    className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110" 
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60" />
                </div>
                <h4 className="text-sm font-black text-white/90 mb-2 uppercase tracking-widest group-hover:text-gemigram-neon transition-colors">Neural_Entity_{i}</h4>
                <div className="flex items-center gap-2">
                   <span className="w-1 h-1 rounded-full bg-gemigram-neon shadow-[0_0_5px_rgba(57,255,20,0.8)]" />
                   <p className="text-[9px] text-white/20 font-black leading-relaxed uppercase tracking-[0.2em]">Runtime::Active</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Global Trust Indicators */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mt-32 max-w-6xl mx-auto border-t border-white/[0.03] pt-16"
        >
          {[
            { icon: Shield, label: 'Carbon Secure', value: 'AES-256', color: 'text-neon-green' },
            { icon: Activity, label: 'L1 Latency', value: `${stats.latency}ms`, color: 'text-neon-blue' },
            { icon: Zap, label: 'Neon Realtime', value: '12ms', color: 'text-cyber-lime' },
            { icon: Globe, label: 'Edge Distributed', value: '14 PoPs', color: 'text-electric-purple' },
          ].map((item, idx) => (
            <motion.div 
              key={idx} 
              className="flex flex-col items-center gap-3 group cursor-default"
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className={`p-3 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 group-hover:border-gemigram-neon/50 transition-all`}>
                <item.icon className={`w-5 h-5 ${item.color} opacity-60 group-hover:opacity-100 transition-opacity`} />
              </div>
              <span className="text-sm font-bold text-white uppercase">{item.value}</span>
              <span className="text-[8px] font-black uppercase tracking-[0.25em] text-white/20 group-hover:text-white/50 transition-colors">
                {item.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
