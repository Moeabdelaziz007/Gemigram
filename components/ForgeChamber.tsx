import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Cpu, Brain, Package, Fingerprint, Database, Activity } from 'lucide-react';

interface ForgeChamberProps {
  onComplete: () => void;
}

const FORGE_STEPS = [
  { id: 'init', text: 'CALIBRATING NEURAL FREQUENCIES...', icon: Sparkles, duration: 1500 },
  { id: 'ingestion', text: 'INGESTING SEMANTIC CONTEXT...', icon: Database, duration: 2000 },
  { id: 'logic', text: 'MAPPING LOGICAL ARCHITECTURE...', icon: Cpu, duration: 1800 },
  { id: 'soul', text: 'SYNTHESIZING CONSCIOUS CORE...', icon: Brain, duration: 2500 },
  { id: 'persona', text: 'INJECTING ARCHETYPAL DIRECTIVES...', icon: Fingerprint, duration: 1500 },
  { id: 'ethical', text: 'ALIGNING MORAL CONSTRAINTS...', icon: Activity, duration: 1500 },
  { id: 'skills', text: 'ACTIVATING NEURAL SKILL BRIDGES...', icon: Cpu, duration: 2000 },
  { id: 'memory', text: 'INITIALIZING SEMANTIC MEMORY NET...', icon: Database, duration: 2500 },
  { id: 'sandbox', text: 'STABILIZING NEURAL SANDBOX...', icon: Activity, duration: 2000 },
  { id: 'identity', text: 'INSCRIBING SOVEREIGN SIGNATURE...', icon: Fingerprint, duration: 1500 },
  { id: 'package', text: 'MATERIALIZING DIGITAL ENTITY...', icon: Package, duration: 1500 },
];

// Forge Chamber internal imports
import { useGemigramStore } from '@/lib/store/useGemigramStore';
import DeployAgentButton from './DeployAgentButton';
import { AgentFormData } from '@/lib/hooks/useForgeLogic';

export default function ForgeChamber({ onComplete }: ForgeChamberProps) {
  const pendingManifest = useGemigramStore(state => state.pendingManifest);
  const setActiveAgentId = useGemigramStore(state => state.setActiveAgentId);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isFlashing, setIsFlashing] = useState(false);
  const [showDeployOption, setShowDeployOption] = useState(false);
  const [particleConfigs] = useState(() => Array.from({ length: 12 }).map(() => ({
    duration: 2 + Math.random(),
    delay: Math.random() * 2
  })));
  
  const autoDeployTimerRef = React.useRef<NodeJS.Timeout | null>(null);
  
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

  // (colorClasses was unused, removed)

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
        
        // AUTO-DEPLOY LOGIC (Shortcut Creation)
        if (pendingManifest && (pendingManifest as AgentFormData).autoMaterialize) {
          console.log('[Forge] Auto-deploying Sovereign Agent...');
          // In a real PWA context, we would trigger the install prompt or redirect
          // For now, we simulate the completion
          autoDeployTimerRef.current = setTimeout(() => {
            setActiveAgentId(agentId || '');
            onComplete();
          }, 3000);
        }
      }, 1500);
      
      return () => {
        clearTimeout(timer);
        clearTimeout(flashTimer);
        if (autoDeployTimerRef.current) clearTimeout(autoDeployTimerRef.current);
      };
    }
  }, [currentStepIndex, pendingManifest, agentId, setActiveAgentId, onComplete]);

  const currentStep = FORGE_STEPS[currentStepIndex];

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-bg-primary overflow-hidden">
      {/* Ambient Forge Glow - Intense Radial */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(142,255,113,0.12)_0%,transparent_60%)]" />
      <div className="absolute inset-0 opacity-20 carbon-fiber" />
      
      {/* The Energy Orb - Enhanced Density */}
      <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 flex items-center justify-center mb-16 px-4">
        {/* Monolith Depth */}
        <div className="absolute inset-0 rounded-full border border-white/5 bg-black/40 backdrop-blur-3xl shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]" />

        {/* Core - Radium Glow */}
        <motion.div 
          className={`absolute w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full blur-[40px] opacity-60 ${
            soulColor === 'cyan' ? 'bg-gemigram-neon' : soulColor === 'fuchsia' ? 'bg-fuchsia-400' : soulColor === 'red' ? 'bg-rose-500' : 'bg-violet-400'
          }`}
          animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0.9, 0.6] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full blur-[8px] relative z-10"
          animate={{ scale: [1, 1.15, 1], opacity: [0.9, 1, 0.9] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Rings - High Fidelity */}
        <motion.div 
          className="absolute inset-0 rounded-full border border-gemigram-neon/20 border-dashed"
          animate={{ rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="absolute inset-8 sm:inset-10 rounded-full border border-accent-purple/30"
          animate={{ rotate: -360, scale: [1, 1.08, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute inset-16 sm:inset-20 rounded-full border-[1.5px] border-gemigram-neon/15 border-dotted"
          animate={{ rotate: 180 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        />

        {/* Neural Pulse Lines */}
        <div className="absolute inset-0 overflow-hidden rounded-full opacity-30">
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gemigram-neon to-transparent -translate-y-1/2 animate-neural-scan" />
        </div>

        {/* Data Lines (Particles) */}
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gemigram-neon/60 rounded-full blur-[1px]"
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

        {/* Smart Touch Overlay */}
        <motion.div 
          className="absolute inset-0 z-10 cursor-pointer"
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            // Pulse effect to accelerate synthesis
            setCurrentStepIndex(prev => Math.min(prev + 1, FORGE_STEPS.length));
          }}
        />
        
        {/* Avatar Preview (Appears late in the process) */}
        <AnimatePresence>
          {currentStepIndex >= 9 && (pendingManifest as AgentFormData)?.avatarUrl && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              className="absolute z-20 w-32 h-32 sm:w-40 sm:h-40 rounded-3xl overflow-hidden border-2 border-gemigram-neon shadow-[0_0_30px_rgba(16,255,135,0.4)]"
            >
              <img src={(pendingManifest as AgentFormData).avatarUrl} alt="Agent Avatar" className="w-full h-full object-cover" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Text Sequence - Philosophical Branding */}
      <div className="h-24 sm:h-28 md:h-32 flex items-center justify-center relative w-full max-w-2xl px-8 z-10">
        <AnimatePresence mode="wait">
          {currentStep && (
            <motion.div
              key={currentStep.id}
              initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center text-center gap-6"
            >
              <div className="relative">
                <currentStep.icon className="w-8 h-8 md:w-10 md:h-10 text-gemigram-neon animate-pulse" />
                <div className="absolute inset-0 bg-gemigram-neon/30 blur-2xl -z-10" />
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-[0.5em] text-white px-2 uppercase mix-blend-difference">
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
                        aetherId: `gem://${agentId || 'agent'}`,
                        name: pendingManifest.name || 'Agent',
                        role: pendingManifest.role || 'Assistant',
                        users: '0',
                        seed: pendingManifest.soul || 'analytical',
                        systemPrompt: pendingManifest.systemPrompt || 'You are a helpful assistant.',
                        voiceName: pendingManifest.voiceName || 'Zephyr',
                        soul: pendingManifest.soul || 'Analytical',
                        memory: 'Sovereign memory initialized',
                        skills_desc: 'Configured skills',
                        rules: pendingManifest.rules || '',
                        tools: pendingManifest.tools || {
                          googleSearch: true,
                          googleMaps: false,
                          weather: true,
                          news: false,
                          crypto: false,
                          calculator: true,
                          semanticMemory: true,
                        },
                        skills: pendingManifest.skills || {
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
