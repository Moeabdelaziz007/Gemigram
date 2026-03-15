import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, Sparkles, Cpu, Brain, Package } from 'lucide-react';

interface ForgeChamberProps {
  onComplete: () => void;
}

const FORGE_STEPS = [
  { id: 'init', text: 'Initiating Aether Forge...', icon: Sparkles, duration: 2000 },
  { id: 'soul', text: 'Synthesizing Persona (The Soul)...', icon: Brain, duration: 3000 },
  { id: 'limbs', text: 'Connecting Workspace APIs (The Limbs)...', icon: Cpu, duration: 2500 },
  { id: 'memory', text: 'Initializing Vector Memory (The Hippocampus)...', icon: Database, duration: 3500 },
  { id: 'package', text: 'Packaging .ath Entity...', icon: Package, duration: 2000 },
];

// Placeholder for Database icon since it's not imported from lucide-react in the array above
import { Database } from 'lucide-react';

export default function ForgeChamber({ onComplete }: ForgeChamberProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isFlashing, setIsFlashing] = useState(false);
  const [particleConfigs] = useState(() => Array.from({ length: 12 }).map(() => ({
    duration: 2 + Math.random(),
    delay: Math.random() * 2
  })));

  useEffect(() => {
    if (currentStepIndex < FORGE_STEPS.length) {
      const timer = setTimeout(() => {
        setCurrentStepIndex(prev => prev + 1);
      }, FORGE_STEPS[currentStepIndex].duration);
      return () => clearTimeout(timer);
    }
  }, [currentStepIndex]);

  useEffect(() => {
    if (currentStepIndex === FORGE_STEPS.length) {
      // Trigger birth flash
      const timer = setTimeout(() => {
        setIsFlashing(true);
      }, 0);
      
      const flashTimer = setTimeout(() => {
        onComplete();
      }, 1000); // Flash duration
      
      return () => {
        clearTimeout(timer);
        clearTimeout(flashTimer);
      };
    }
  }, [currentStepIndex, onComplete]);

  const currentStep = FORGE_STEPS[currentStepIndex];

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-[#030303] overflow-hidden">
      {/* Ambient Forge Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.1)_0%,transparent_70%)]" />
      
      {/* The Energy Orb */}
      <div className="relative w-64 h-64 md:w-96 md:h-96 flex items-center justify-center mb-16">
        {/* Core */}
        <motion.div 
          className="absolute w-24 h-24 bg-cyan-400 rounded-full blur-[20px]"
          animate={{ scale: [1, 1.5, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute w-16 h-16 bg-white rounded-full blur-[5px]"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Rings */}
        <motion.div 
          className="absolute inset-0 rounded-full border border-cyan-500/30 border-dashed"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="absolute inset-8 rounded-full border border-purple-500/40"
          animate={{ rotate: -360, scale: [1, 1.05, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute inset-16 rounded-full border-2 border-cyan-300/20 border-dotted"
          animate={{ rotate: 180 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />

        {/* Data Lines (Particles) */}
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-300 rounded-full blur-[1px]"
            initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
            animate={{ 
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
              x: Math.cos(i * 30 * Math.PI / 180) * 150,
              y: Math.sin(i * 30 * Math.PI / 180) * 150,
            }}
            transition={{ 
              duration: particleConfigs[i].duration, 
              repeat: Infinity, 
              delay: particleConfigs[i].delay,
              ease: "easeOut" 
            }}
          />
        ))}
      </div>

      {/* Text Sequence */}
      <div className="h-24 flex items-center justify-center relative w-full max-w-2xl px-8">
        <AnimatePresence mode="wait">
          {currentStep && (
            <motion.div
              key={currentStep.id}
              initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center text-center gap-4"
            >
              <currentStep.icon className="w-8 h-8 text-cyan-400 animate-pulse" />
              <h2 className="text-2xl md:text-3xl font-light tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-400">
                {currentStep.text}
              </h2>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* The Birth Flash */}
      <AnimatePresence>
        {isFlashing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeIn" }}
            className="absolute inset-0 bg-white z-50 pointer-events-none mix-blend-screen"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
