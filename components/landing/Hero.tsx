'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Shield, Zap, Globe, Users, Cpu, Network, Fingerprint, Mic, ArrowRight } from 'lucide-react';
import { useSystemTelemetry } from '../../hooks/useSystemTelemetry';
import { useAetherStore } from '../../lib/store/useAetherStore';
import { BRAND } from '@/lib/constants/branding';

export function EnterpriseHero({ onLogin }: { onLogin: () => void }) {
  const [mounted, setMounted] = useState(false);
  const telemetry = useSystemTelemetry();
  const { agents } = useAetherStore();
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
            className="w-[280px] h-[280px] sm:w-[450px] sm:h-[450px] lg:w-[600px] lg:h-[600px] rounded-full relative"
            style={{
              background: 'radial-gradient(circle, var(--gemigram-neon-glow) 0%, rgba(57,255,20,0.1) 40%, transparent 70%)',
              filter: 'blur(20px)'
            }}
          >
            {/* Spinning Energy Rings */}
            <div className="absolute inset-0 border-2 border-gemigram-neon/10 rounded-full animate-spin [animation-duration:8s]" />
            <div className="absolute inset-8 border border-gemigram-neon/20 rounded-full animate-spin [animation-duration:12s] direction-reverse" />
          </motion.div>
          
          {/* Internal Neural Hub (Glassy Center) */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 rounded-full glass-strong border border-gemigram-neon/40 flex items-center justify-center p-6 lg:p-8 overflow-hidden relative group">
               <motion.div 
                 animate={{ 
                    scale: [0.95, 1.05, 0.95],
                    filter: ['hue-rotate(0deg)', 'hue-rotate(30deg)', 'hue-rotate(0deg)'],
                    boxShadow: ['0 0 30px rgba(57,255,20,0.3)', '0 0 80px rgba(57,255,20,0.5)', '0 0 30px rgba(57,255,20,0.3)']
                 }}
                 transition={{ duration: 4, repeat: Infinity }}
                 className="w-full h-full rounded-full bg-gradient-to-br from-gemigram-neon to-gemigram-mint mix-blend-screen opacity-90 shadow-[0_0_100px_rgba(57,255,20,0.4)]" 
               />
               <div className="absolute inset-0 bg-black/40 backdrop-blur-2xl rounded-full" />
               {/* Mascot Silhouette - Sharpened */}
               <Fingerprint className="absolute w-24 h-24 sm:w-40 sm:h-40 text-white/10 group-hover:text-gemigram-neon transition-colors duration-1000 z-10" />
            </div>
          </div>
        </div>

        {/* Brand Typography - Matching reference image 2 */}
        <div className="text-center z-20">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-6xl sm:text-8xl lg:text-[12rem] font-black tracking-[-0.05em] leading-[0.8] mb-6 neon-shimmer uppercase"
          >
            {BRAND.product.name}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl md:text-2xl text-white/40 font-bold uppercase tracking-[0.4em] mb-12"
          >
            {BRAND.product.tagline}
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
              className="px-10 md:px-16 py-6 bg-gemigram-neon text-black rounded-full text-lg md:text-2xl font-black uppercase tracking-[0.2em] shadow-[0_0_50px_rgba(57,255,20,0.4)] transition-all inline-flex items-center gap-3"
            >
              <Mic className="w-5 h-5" />
              Create with Voice
              <ArrowRight className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.05)' }}
              whileTap={{ scale: 0.95 }}
              className="px-16 py-8 border border-white/10 text-white rounded-full text-xl font-black uppercase tracking-[0.2em] transition-all backdrop-blur-xl"
            >
              Explore_Mainnet
            </motion.button>
          </motion.div>

          <div className="mt-10 glass-medium border border-white/10 rounded-3xl px-6 py-5 max-w-3xl mx-auto">
            <p className="text-[10px] uppercase tracking-[0.3em] text-gemigram-neon/80 font-bold mb-3">Voice Flow Preview</p>
            <div className="grid md:grid-cols-3 gap-4 text-left">
              {[
                '1. Tap Create with Voice and grant mic access',
                '2. Describe your agent naturally in one sentence',
                '3. Confirm blueprint and launch into workspace'
              ].map((step) => (
                <div key={step} className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white/80 font-medium">
                  {step}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Agent Hive Preview - Enhanced */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="w-full mt-40 glass-strong border border-gemigram-neon/10 rounded-[3rem] p-12 overflow-hidden relative shadow-[0_0_40px_rgba(0,0,0,0.5)]"
        >
          {/* Enhanced background glow */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gemigram-neon/10 blur-[120px] pointer-events-none mix-blend-screen" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-neon-blue/5 blur-[100px] pointer-events-none mix-blend-screen" />
          
          {/* Subtle grid pattern overlay */}
          <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.8)_1px,transparent_1px)] bg-[length:24px_24px] pointer-events-none" />

          <div className="flex justify-between items-center mb-16 relative z-10">
            <h2 className="text-4xl font-black uppercase tracking-tighter text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">Agent_Hive</h2>
            <div className="flex gap-4">
               {[1,2].map(i => (
                 <motion.button
                   key={i}
                   whileHover={{ scale: 1.1, backgroundColor: 'rgba(57,255,20,0.1)' }}
                   whileTap={{ scale: 0.9 }}
                   className="w-12 h-12 rounded-full border border-white/20 hover:border-gemigram-neon flex items-center justify-center text-white/50 hover:text-gemigram-neon transition-all bg-black/50 backdrop-blur-md"
                 >
                   {i === 1 ? '<' : '>'}
                 </motion.button>
               ))}
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 relative z-10">
            {[1,2,3,4,5].map(i => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="glass-medium p-6 rounded-3xl group hover:border-gemigram-neon/40 transition-all duration-500 cursor-pointer relative overflow-hidden"
              >
                {/* Internal card hover effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gemigram-neon/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="aspect-[4/5] rounded-2xl bg-black/40 mb-6 overflow-hidden relative border border-white/5">
                   {/* Fallback image if actual agent images are missing */}
                   <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(57,255,20,0.1)_0%,transparent_70%)] opacity-50" />

                   <img 
                    src={`/agents/robot_${(i % 3) + 1}.png`} 
                    alt={`Neural Entity ${i}`}
                    className="w-full h-full object-cover mix-blend-screen opacity-50 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110"
                    onError={(e) => {
                      // Fallback for missing images
                      e.currentTarget.style.display = 'none';
                    }}
                   />

                   {/* Scanning line effect on hover */}
                   <div className="absolute top-0 left-0 w-full h-1 bg-gemigram-neon shadow-[0_0_10px_rgba(57,255,20,0.8)] opacity-0 group-hover:opacity-100 group-hover:animate-[scanline_2s_linear_infinite]" />

                   <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
                </div>

                <h4 className="text-sm font-black text-white mb-2 uppercase tracking-widest group-hover:text-gemigram-neon transition-colors drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Neural_Entity_{i}</h4>
                <div className="flex items-center gap-3">
                   <div className="relative flex items-center justify-center w-2 h-2">
                     <span className="absolute w-full h-full rounded-full bg-gemigram-neon opacity-75 animate-ping" />
                     <span className="relative w-1.5 h-1.5 rounded-full bg-gemigram-neon" />
                   </div>
                   <p className="text-[10px] text-white/40 font-bold uppercase tracking-[0.2em]">Runtime::Active</p>
                </div>
              </motion.div>
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
            { icon: Activity, label: 'L1 Latency', value: `${telemetry.latency}ms`, color: 'text-neon-blue' },
            { icon: Zap, label: 'Neon Active', value: `${agents.length} Agents`, color: 'text-cyber-lime' },
            { icon: Globe, label: 'Session Uptime', value: `${telemetry.uptime}s`, color: 'text-electric-purple' },
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
