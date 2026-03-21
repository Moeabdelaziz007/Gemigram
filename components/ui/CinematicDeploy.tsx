'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Cpu, Activity, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface CinematicDeployProps {
  agentName: string;
  onComplete: () => void;
}

export function CinematicDeploy({ agentName, onComplete }: CinematicDeployProps) {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const steps = [
    { label: 'Initializing Neural Buffer', icon: <Cpu className="w-5 h-5" /> },
    { label: 'Synthesizing Personality Core', icon: <Sparkles className="w-5 h-5" /> },
    { label: 'Encrypting Sovereign Link', icon: <ShieldCheck className="w-5 h-5" /> },
    { label: 'Syncing with Gemigalaxy', icon: <Zap className="w-5 h-5" /> },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 1000);
          return 100;
        }
        return prev + 1;
      });
    }, 40);

    const stepInterval = setInterval(() => {
      setStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(stepInterval);
    };
  }, [onComplete, steps.length]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center p-8 text-center overflow-hidden"
    >
      {/* Background Particles Simulation */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -1000],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 2 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: '100%',
            }}
            className="absolute w-1 h-32 bg-gemigram-neon/50 blur-sm"
          />
        ))}
      </div>

      <div className="relative z-10 max-w-lg w-full">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-12 relative"
        >
          <div className="w-32 h-32 rounded-full border-2 border-gemigram-neon/30 flex items-center justify-center mx-auto relative">
             <motion.div 
               animate={{ rotate: 360 }}
               transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
               className="absolute inset-0 rounded-full border-t-2 border-gemigram-neon shadow-[0_0_20px_rgba(16,255,135,0.4)]"
             />
             <Activity className="w-12 h-12 text-gemigram-neon animate-pulse" />
          </div>
        </motion.div>

        <h2 className="text-3xl font-black uppercase tracking-[0.3em] text-white mb-2">
          Materializing_{agentName}
        </h2>
        <p className="text-[10px] font-mono text-gemigram-neon/60 uppercase tracking-[0.5em] mb-12">
          Sector_Alpha_Theta_9
        </p>

        <div className="space-y-4 mb-16">
          {steps.map((s, i) => (
            <motion.div
              key={i}
              initial={{ x: -20, opacity: 0 }}
              animate={{ 
                x: 0, 
                opacity: step >= i ? 1 : 0.2,
                color: step === i ? '#10ff87' : '#fff'
              }}
              className="flex items-center gap-4 justify-center"
            >
              <div className={step > i ? 'text-gemigram-neon' : ''}>
                {step > i ? <CheckCircle2 className="w-5 h-5" /> : s.icon}
              </div>
              <span className="text-xs font-black uppercase tracking-widest">{s.label}</span>
            </motion.div>
          ))}
        </div>

        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5 relative">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-gemigram-neon shadow-[0_0_20px_rgba(16,255,135,0.6)]"
          />
        </div>
        <div className="mt-4 text-[10px] font-mono text-white/30 tracking-[1em] uppercase">
          Neural_Density::{progress}%
        </div>
      </div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
    </motion.div>
  );
}
