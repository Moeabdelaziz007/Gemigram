'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SoulSwapTransitionProps {
  /** Controls visibility of the transition overlay */
  isVisible: boolean;
  /** Called when the exit animation completes — use to finalize agent switch */
  onComplete?: () => void;
  /** Name of the new agent being swapped in, for display */
  targetAgentName?: string;
}

/**
 * SoulSwapTransition — Neural Flare Effect
 * 
 * A cinematic transition used when switching between agents.
 * Creates a consciousness-transfer effect with:
 * 1. Central energy orb explosion (0 → 1.2x → 20x scale)
 * 2. Full-screen white flash overlay
 * 3. 24 particle implosion (from random edges → center)
 * 4. Agent name reveal with typewriter-style appearance
 * 
 * Ported from Gemigram-Voice-OS SoulSwapAnimation.tsx
 * and enhanced for the Quantum Glass design system.
 */
export function SoulSwapTransition({ isVisible, onComplete, targetAgentName }: SoulSwapTransitionProps) {
  const [particles] = useState(() =>
    Array.from({ length: 24 }).map(() => ({
      startX: (Math.random() - 0.5) * 2000,
      startY: (Math.random() - 0.5) * 1400,
      delay: Math.random() * 0.25,
      size: 1 + Math.random() * 2,
    }))
  );

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none"
        >
          {/* Layer 1: Dark vignette backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.9, 0.9, 0] }}
            transition={{ duration: 1.6, times: [0, 0.1, 0.7, 1] }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.6)_0%,rgba(0,0,0,0.95)_70%)]"
          />

          {/* Layer 2: Central Neural Flare (cyan energy orb) */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 1.2, 25],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 1.4,
              ease: 'circIn',
              times: [0, 0.35, 1],
            }}
            className="absolute w-32 h-32 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(34,211,238,0.9) 0%, rgba(34,211,238,0.3) 40%, transparent 70%)',
              boxShadow: '0 0 120px rgba(34,211,238,0.8), 0 0 240px rgba(34,211,238,0.4), inset 0 0 60px rgba(255,255,255,0.2)',
            }}
          />

          {/* Layer 3: Secondary ring pulse */}
          <motion.div
            initial={{ scale: 0, opacity: 0, borderWidth: 3 }}
            animate={{
              scale: [0, 2, 8],
              opacity: [0, 0.6, 0],
              borderWidth: [3, 1, 0],
            }}
            transition={{
              duration: 1.2,
              delay: 0.15,
              ease: 'easeOut',
            }}
            className="absolute w-40 h-40 rounded-full border-cyan-300/60"
          />

          {/* Layer 4: Full-screen consciousness flash */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.5, 0] }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="absolute inset-0 bg-white"
          />

          {/* Layer 5: Particle implosion swarm */}
          <div className="absolute inset-0 overflow-hidden">
            {particles.map((p, i) => (
              <motion.div
                key={i}
                initial={{
                  x: p.startX,
                  y: p.startY,
                  scale: 2.5,
                  opacity: 0,
                }}
                animate={{
                  x: 0,
                  y: 0,
                  scale: 0,
                  opacity: [0, 0.8, 1, 0],
                }}
                transition={{
                  duration: 0.9,
                  delay: p.delay,
                  ease: 'easeIn',
                }}
                className="absolute top-1/2 left-1/2 rounded-full"
                style={{
                  width: p.size,
                  height: p.size,
                  background: `radial-gradient(circle, rgba(34,211,238,${0.7 + Math.random() * 0.3}) 0%, transparent 100%)`,
                  boxShadow: `0 0 ${4 + Math.random() * 8}px rgba(34,211,238,0.5)`,
                }}
              />
            ))}
          </div>

          {/* Layer 6: Agent name reveal */}
          {targetAgentName && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{
                opacity: [0, 0, 1, 1, 0],
                y: [20, 20, 0, 0, -10],
                scale: [0.8, 0.8, 1, 1, 1.05],
              }}
              transition={{
                duration: 1.6,
                times: [0, 0.4, 0.55, 0.8, 1],
              }}
              className="absolute z-10"
            >
              <span className="text-2xl font-black tracking-[0.3em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-cyan-100 drop-shadow-[0_0_20px_rgba(34,211,238,0.6)]">
                {targetAgentName}
              </span>
              <div className="mt-2 text-center">
                <span className="text-[10px] font-mono tracking-[0.5em] uppercase text-cyan-400/60">
                  Neural Link Active
                </span>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
