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
      
      {/* Ambient Depth Background - Enhanced with Neon Green */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[10%] left-[15%] w-[40vw] h-[40vw] bg-gradient-to-br from-neon-green/10 to-aether-neon/5 rounded-full blur-[180px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[15%] w-[35vw] h-[35vw] bg-gradient-to-tl from-electric-purple/10 to-neon-blue/5 rounded-full blur-[130px]" />
        <div className="absolute top-[50%] left-[50%] w-[30vw] h-[30vw] bg-cyber-lime/5 rounded-full blur-[100px]" />
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
            <div className="w-64 h-64 md:w-80 md:h-80 rounded-full glass-strong border border-gemigram-neon/40 flex items-center justify-center p-8 overflow-hidden">
               <motion.div 
                 animate={{ 
                    filter: ['hue-rotate(0deg)', 'hue-rotate(45deg)', 'hue-rotate(0deg)'],
                    boxShadow: ['0 0 50px rgba(16,255,135,0.5)', '0 0 100px rgba(16,255,135,0.8)', '0 0 50px rgba(16,255,135,0.5)']
                 }}
                 transition={{ duration: 4, repeat: Infinity }}
                 className="w-full h-full rounded-full bg-gradient-to-br from-gemigram-neon to-fuchsia-500/20 mix-blend-screen opacity-80" 
               />
               {/* Mascot Silhouette */}
               <img src="/avatars/mascot_silhouette.png" className="absolute w-40 h-40 opacity-40 mix-blend-overlay" alt="" />
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
            className="flex items-center justify-center gap-8"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 60px rgba(16,255,135,0.4)' }}
              onClick={onLogin}
              className="px-16 py-6 bg-gemigram-neon text-black rounded-full text-xl font-black uppercase tracking-widest shadow-[0_0_30px_rgba(16,255,135,0.2)]"
            >
              Construct_Self
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
              <div key={i} className="glass-subtle rounded-3xl p-6 border border-white/5 group hover:border-gemigram-neon/30 transition-all cursor-pointer">
                <div className="aspect-square rounded-2xl bg-white/5 mb-6 overflow-hidden">
                   <img src={`/agents/robot_${i}.png`} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all scale-110" />
                </div>
                <h4 className="text-sm font-black text-white mb-2 uppercase tracking-widest">Robot_AI_{i}</h4>
                <p className="text-[10px] text-white/20 font-bold leading-relaxed uppercase">Neural_Signature::Active</p>
              </div>
            ))}
          </div>
        </motion.div>
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
                <div className={`p-3 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 group-hover:border-${item.color.split('-')[1]}-500/50 transition-all`}>
                  <item.icon className={`w-5 h-5 ${item.color} opacity-60 group-hover:opacity-100 transition-opacity`} />
                </div>
                <span className="text-sm font-bold text-white">{item.value}</span>
                <span className="text-[8px] font-black uppercase tracking-[0.25em] text-white/20 group-hover:text-white/50 transition-colors">
                  {item.label}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* Active Agents Counter */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="mt-16 p-6 cyber-panel rounded-2xl border border-neon-green/20 bg-gradient-to-br from-neon-green/5 to-transparent"
          >
            <div className="flex items-center justify-center gap-8">
              <div className="text-center">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-neon-green" />
                  <span className="text-xs font-black uppercase tracking-widest text-white/40">Active Agents</span>
                </div>
                <div className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-neon-green to-mint-chip">
                  {mounted ? stats.agents.toLocaleString() : '0'}
                </div>
              </div>
              <div className="w-px h-16 bg-gradient-to-b from-transparent via-neon-green/50 to-transparent" />
              <div className="text-center">
                <div className="flex items-center gap-2 mb-2">
                  <Cpu className="w-4 h-4 text-neon-blue" />
                  <span className="text-xs font-black uppercase tracking-widest text-white/40">Network Load</span>
                </div>
                <div className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-electric-purple">
                  2.4K
                </div>
              </div>
              <div className="w-px h-16 bg-gradient-to-b from-transparent via-neon-blue/50 to-transparent" />
              <div className="text-center">
                <div className="flex items-center gap-2 mb-2">
                  <Network className="w-4 h-4 text-electric-purple" />
                  <span className="text-xs font-black uppercase tracking-widest text-white/40">Uptime</span>
                </div>
                <div className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-electric-purple to-pink-500">
                  {mounted ? stats.uptime.toFixed(2) : '0'}%
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
