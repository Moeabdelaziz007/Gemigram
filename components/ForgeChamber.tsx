import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Sparkles, Cpu, Brain, Package, Fingerprint, Database, Rocket, Activity } from 'lucide-react';

interface ForgeChamberProps {
  onComplete: () => void;
}

const FORGE_STEPS = [
  { id: 'init', text: 'Calibrating Aetherial Frequencies...', icon: Sparkles, duration: 2000 },
  { id: 'soul', text: 'Synthesizing Neural Persona Matrix...', icon: Brain, duration: 3000 },
  { id: 'persona', text: 'Injecting Cognitive Archetype...', icon: Fingerprint, duration: 2000 },
  { id: 'skills', text: 'Activating Occupational Skill Directives...', icon: Cpu, duration: 2500 },
  { id: 'memory', text: 'Initializing Semantic Memory Networks...', icon: Database, duration: 3500 },
  { id: 'identity', text: 'Inscribing Sovereign Digital Signature...', icon: Fingerprint, duration: 2000 },
  { id: 'package', text: 'Materializing .ath Entity...', icon: Package, duration: 2000 },
  { id: 'heartbeat', text: 'Initiating Vital Signs Monitor...', icon: Activity, duration: 1500 },
];

// Forge Chamber internal imports
import { useAetherStore } from '@/lib/store/useAetherStore';
import DeployAgentButton from './DeployAgentButton';

export default function ForgeChamber({ onComplete }: ForgeChamberProps) {
  const pendingManifest = useAetherStore(state => state.pendingManifest);
  const setActiveAgentId = useAetherStore(state => state.setActiveAgentId);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isFlashing, setIsFlashing] = useState(false);
  const [showDeployOption, setShowDeployOption] = useState(false);
  const [particleConfigs] = useState(() => Array.from({ length: 12 }).map(() => ({
    duration: 2 + Math.random(),
    delay: Math.random() * 2
  })));
  
  // Generate agent ID for deployment
  const agentId = pendingManifest?.name ? pendingManifest.name.toLowerCase().replace(/\s+/g, '-') : null;

  const soulColor = React.useMemo(() => {
    if (!pendingManifest?.soul) return 'cyan';
    const soul = pendingManifest.soul.toLowerCase();
    if (soul.includes('analytical') || soul.includes('logic')) return 'cyan';
    if (soul.includes('creative') || soul.includes('art')) return 'fuchsia';
    if (soul.includes('aggressive') || soul.includes('warrior')) return 'red';
    if (soul.includes('mystical') || soul.includes('soul')) return 'purple';
    return 'cyan';
  }, [pendingManifest]);

  const colorClasses = {
    cyan: 'bg-gemigram-neon text-gemigram-neon border-gemigram-neon/50 shadow-gemigram-neon/50',
    fuchsia: 'bg-fuchsia-400 text-fuchsia-400 border-fuchsia-500 shadow-fuchsia-500',
    red: 'bg-rose-500 text-rose-500 border-rose-600 shadow-rose-600',
    purple: 'bg-violet-500 text-violet-500 border-violet-600 shadow-violet-600'
  }[soulColor];

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
        setShowDeployOption(true);
      }, 1500); // Show deploy option after flash
      
      return () => {
        clearTimeout(timer);
        clearTimeout(flashTimer);
      };
    }
  }, [currentStepIndex]);

  const currentStep = FORGE_STEPS[currentStepIndex];

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-[#030303] overflow-hidden">
      {/* Ambient Forge Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.1)_0%,transparent_70%)]" />
      
      {/* The Energy Orb */}
      <div className="relative w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 flex items-center justify-center mb-8 sm:mb-12 md:mb-16 px-4">
        {/* Core */}
        <motion.div 
          className={`absolute w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full blur-[20px] ${soulColor === 'cyan' ? 'bg-cyan-400' : soulColor === 'fuchsia' ? 'bg-fuchsia-400' : soulColor === 'red' ? 'bg-red-400' : 'bg-purple-400'}`}
          animate={{ scale: [1, 1.5, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-full blur-[5px]"
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
          className="absolute inset-6 sm:inset-8 rounded-full border border-purple-500/40"
          animate={{ rotate: -360, scale: [1, 1.05, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute inset-12 sm:inset-16 rounded-full border-2 border-cyan-300/20 border-dotted"
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
              x: Math.cos(i * 30 * Math.PI / 180) * 120,
              y: Math.sin(i * 30 * Math.PI / 180) * 120,
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
      <div className="h-20 sm:h-24 md:h-28 flex items-center justify-center relative w-full max-w-2xl px-4 sm:px-6 md:px-8">
        <AnimatePresence mode="wait">
          {currentStep && (
            <motion.div
              key={currentStep.id}
              initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center text-center gap-2 sm:gap-3 md:gap-4"
            >
              <currentStep.icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-cyan-400 animate-pulse" />
              <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-light tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-400 px-2">
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
      
      {/* Deployment Option - Show after successful forge */}
      <AnimatePresence>
        {showDeployOption && pendingManifest && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute bottom-6 sm:bottom-8 md:bottom-12 left-0 right-0 z-40 px-4 sm:px-6 md:px-8"
          >
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col items-center gap-4 sm:gap-6">
                {/* Success Message */}
                <div className="text-center space-y-2">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white uppercase tracking-widest px-2">
                    Materialization Complete
                  </h3>
                  <p className="text-white/60 text-sm sm:text-base px-2">
                    {pendingManifest.name} has been successfully forged
                  </p>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full max-w-md mx-auto">
                  {/* Deploy as PWA Button */}
                  <div className="w-full sm:w-auto touch-target-comfortable">
                    <DeployAgentButton
                      agent={{
                        id: agentId || 'agent',
                        aetherId: `ath://${agentId || 'agent'}`,
                        name: pendingManifest.name || 'Agent',
                        role: (pendingManifest as any).description || 'Assistant',
                        users: '0',
                        seed: pendingManifest.soul || 'analytical',
                        systemPrompt: (pendingManifest as any).systemPrompt || 'You are a helpful assistant.',
                        voiceName: pendingManifest.voiceName || 'Zephyr',
                        soul: pendingManifest.soul || 'Analytical',
                        memory: 'Sovereign memory initialized',
                        skills_desc: 'Configured skills',
                        rules: '',
                        tools: {
                          googleSearch: true,
                          googleMaps: false,
                          weather: true,
                          news: false,
                          crypto: false,
                          calculator: true,
                          semanticMemory: true,
                        },
                        skills: {
                          gmail: false,
                          calendar: false,
                          drive: false,
                        }
                      }}
                    />
                  </div>
                  
                  {/* Continue to Workspace Button */}
                  <button
                    onClick={() => {
                      setActiveAgentId(agentId || '');
                      onComplete();
                    }}
                    className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all uppercase tracking-wider font-semibold text-sm sm:text-base touch-target-comfortable"
                  >
                    Continue to Workspace
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
