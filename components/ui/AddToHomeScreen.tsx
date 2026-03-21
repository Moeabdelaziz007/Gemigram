'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Download, X, Share2, Sparkles, Box, ShieldCheck, Zap } from 'lucide-react';
import { generateAgentAvatarUrl } from '@/lib/pwa/avatar-generator';
import { installAgentAsPWA } from '@/lib/pwa/dynamic-manifest';
import { Agent } from '@/lib/store/useGemigramStore';

interface AddToHomeScreenProps {
  agent: Agent;
  userId: string;
  onClose: () => void;
}

export function AddToHomeScreen({ agent, userId, onClose }: AddToHomeScreenProps) {
  const [isInstalling, setIsInstalling] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);
  const [materializationStep, setMaterializationStep] = useState(0);

  useEffect(() => {
    // Detect iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);
  }, []);

  const handleInstall = async () => {
    setIsInstalling(true);
    
    // Aesthetic Materialization steps
    for (let i = 1; i <= 3; i++) {
      setMaterializationStep(i);
      await new Promise(resolve => setTimeout(resolve, 800));
    }
    
    try {
      const avatarUrl = generateAgentAvatarUrl(agent.seed || agent.name || agent.id);
      const success = await installAgentAsPWA({
        agent,
        avatarUrl,
        userId,
      });
      
      if (success) {
        setInstallSuccess(true);
        setTimeout(onClose, 2500);
      }
    } catch (error) {
      console.error('[PWA] Installation failed:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
      animate={{ opacity: 1, backdropFilter: 'blur(20px)' }}
      exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 p-4"
    >
      <motion.div
        initial={{ opacity: 0, y: 100, scale: 0.9, rotateX: 20 }}
        animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
        exit={{ opacity: 0, y: 100, scale: 0.9, rotateX: 20 }}
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        className="relative w-full max-w-lg overflow-hidden rounded-[2.5rem] border border-gemigram-neon/30 bg-[#050B14]/90 p-8 shadow-[0_0_100px_rgba(16,255,135,0.2)] ring-1 ring-white/10"
        style={{ perspective: '1000px' }}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-gemigram-neon/20 to-transparent blur-[120px] rounded-full" 
          />
          <div className="carbon-fiber absolute inset-0 opacity-[0.05]" />
        </div>
        
        <button 
          onClick={onClose} 
          aria-label="Close installation prompt"
          className="absolute top-8 right-8 z-10 p-3 rounded-xl bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all border border-white/5 active:scale-90"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative z-10">
          <div className="flex flex-col items-center text-center mb-10">
            <div className="relative mb-6">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute -inset-4 border border-gemigram-neon/20 rounded-3xl" 
              />
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                className="absolute -inset-2 border border-gemigram-neon/40 rounded-2xl" 
              />
              <div className="relative h-24 w-24 overflow-hidden rounded-2xl border border-gemigram-neon/50 bg-black/60 shadow-[0_0_30px_rgba(16,255,135,0.3)]">
                <img 
                  src={generateAgentAvatarUrl(agent.seed || agent.name || agent.id, 120)} 
                  alt={agent.name}
                  className="h-full w-full object-cover grayscale-[0.5] hover:grayscale-0 transition-all duration-700"
                />
              </div>
              <motion.div 
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -bottom-2 -right-2 rounded-xl bg-gemigram-neon p-2 shadow-lg"
              >
                <Zap className="h-4 w-4 text-black" fill="currentColor" />
              </motion.div>
            </div>

            <h3 className="text-3xl font-black italic tracking-tighter text-white uppercase leading-none mb-2">
              Sovereign <span className="text-gemigram-neon">Materialization</span>
            </h3>
            <p className="text-xs font-mono text-white/40 uppercase tracking-[0.4em]">{agent.name} // {agent.role}</p>
          </div>

          <div className="space-y-8">
            {installSuccess ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-10 flex flex-col items-center justify-center text-center"
              >
                <div className="relative mb-6">
                  <motion.div
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-full bg-gemigram-neon/40 blur-xl"
                  />
                  <div className="relative w-20 h-20 rounded-full bg-gemigram-neon flex items-center justify-center border-4 border-[#050B14]">
                    <ShieldCheck className="w-10 h-10 text-black" />
                  </div>
                </div>
                <h4 className="text-2xl font-black text-white uppercase tracking-tighter mb-2 italic">Neural Link: SECURE</h4>
                <p className="text-white/40 text-[10px] font-mono uppercase tracking-[.2em]">Agent successfully projected to home screen.</p>
              </motion.div>
            ) : isInstalling ? (
              <div className="py-10 space-y-8">
                <div className="relative h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: '0%' }}
                    animate={{ width: `${(materializationStep / 3) * 100}%` }}
                    className="absolute inset-y-0 left-0 bg-gemigram-neon shadow-[0_0_10px_#10ff87]"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { icon: Box, label: 'Geometry' },
                    { icon: Sparkles, label: 'Cognition' },
                    { icon: ShieldCheck, label: 'Security' }
                  ].map((step, i) => (
                    <div key={i} className={`flex flex-col items-center gap-2 transition-opacity duration-500 ${materializationStep > i ? 'opacity-100' : 'opacity-20'}`}>
                      <step.icon className={`h-5 w-5 ${materializationStep > i ? 'text-gemigram-neon' : 'text-white'}`} />
                      <span className="text-[8px] font-mono uppercase tracking-widest">{step.label}</span>
                    </div>
                  ))}
                </div>
                <p className="text-center text-[10px] font-mono text-gemigram-neon animate-pulse uppercase tracking-[0.3em]">
                  {materializationStep === 1 ? 'Mapping Neural Topology...' : 
                   materializationStep === 2 ? 'Synthesizing Aether Backbone...' : 
                   'Initializing Protocol 11...'}
                </p>
              </div>
            ) : isIOS ? (
              <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 space-y-6">
                <div className="flex items-center gap-4 text-white/90">
                  <div className="p-3 rounded-2xl bg-gemigram-neon/10 border border-gemigram-neon/20">
                    <Smartphone className="h-6 w-6 text-gemigram-neon" />
                  </div>
                  <p className="text-sm font-bold uppercase tracking-wide">iOS Deployment Protocol</p>
                </div>
                <div className="space-y-4">
                  {[
                    { step: 1, icon: Share2, text: 'Tap the Share button in Safari navigation bar' },
                    { step: 2, icon: Download, text: 'Scroll and select "Add to Home Screen"' },
                    { step: 3, icon: ShieldCheck, text: 'Tap "Add" to finalize the link' }
                  ].map((item) => (
                    <div key={item.step} className="flex items-center gap-4 bg-black/40 p-4 rounded-2xl border border-white/5 group hover:border-gemigram-neon/30 transition-all">
                      <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-[10px] font-black font-mono border border-white/10 group-hover:text-gemigram-neon">{item.step}</div>
                      <item.icon className="w-4 h-4 text-white/30 group-hover:text-gemigram-neon" />
                      <p className="text-[11px] text-white/50 group-hover:text-white/80">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center transition-colors hover:border-gemigram-neon/20">
                    <ShieldCheck className="h-6 w-6 text-gemigram-neon/60 mx-auto mb-3" />
                    <p className="text-[10px] font-bold uppercase tracking-wider text-white/80">Encrypted Link</p>
                    <p className="text-[8px] text-white/30 uppercase mt-1">Sovereign Tunnel</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center transition-colors hover:border-gemigram-neon/20">
                    <Zap className="h-6 w-6 text-gemigram-neon/60 mx-auto mb-3" />
                    <p className="text-[10px] font-bold uppercase tracking-wider text-white/80">Zero Latency</p>
                    <p className="text-[8px] text-white/30 uppercase mt-1">Local Spine</p>
                  </div>
                </div>
                
                <button
                  onClick={handleInstall}
                  aria-label="Initiate Agent Deployment"
                  className="group relative w-full overflow-hidden rounded-2xl bg-gemigram-neon p-[1px] transition-all hover:shadow-[0_0_50px_rgba(16,255,135,0.4)] active:scale-[0.98]"
                >
                  <div className="relative flex items-center justify-center gap-4 bg-[#050B14] group-hover:bg-transparent py-5 rounded-[calc(1rem+4px)] transition-all">
                    <Download className="w-6 h-6 text-gemigram-neon group-hover:text-black transition-colors" />
                    <span className="text-sm font-black uppercase tracking-[0.3em] text-gemigram-neon group-hover:text-black transition-colors">Initiate Deployment</span>
                  </div>
                </button>
                <p className="text-[8px] text-center font-mono text-white/20 uppercase tracking-[0.2em]">Powered by Gemini Live API // Protocol V3.0</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default AddToHomeScreen;

