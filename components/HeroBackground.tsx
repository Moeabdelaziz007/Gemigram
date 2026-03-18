'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { useVisualTier } from '@/lib/hooks/useVisualTier';

interface ParticleConfig {
  id: number;
  size: number;
  x: number;
  y: number;
  duration: number;
  delay: number;
  opacity: number;
}

function buildParticles(count: number): ParticleConfig[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    size: 1 + (i % 3),
    x: (i * 17) % 100,
    y: (i * 29) % 100,
    duration: 16 + (i % 4) * 4,
    delay: (i % 5) * 0.8,
    opacity: 0.08 + (i % 4) * 0.04,
  }));
}

function ParticleField({ particles, animated }: { particles: ParticleConfig[]; animated: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full will-change-transform motion-budget-accent"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            background: 'radial-gradient(circle, var(--gemigram-neon) 0%, transparent 70%)',
            boxShadow: '0 0 8px var(--gemigram-neon-glow)',
          }}
          animate={animated ? {
            y: [0, -42, 0],
            opacity: [particle.opacity, particle.opacity * 1.4, particle.opacity],
            scale: [1, 1.08, 1],
          } : { opacity: particle.opacity }}
          transition={animated ? {
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'linear',
          } : { duration: 0 }}
        />
      ))}
    </div>
  );
}

function FlowGrid({ animated }: { animated: boolean }) {
  return (
    <div
      className="absolute inset-0"
      style={{
        perspective: 900,
        transform: 'rotateX(60deg)',
      }}
    >
      <div className="absolute inset-0 grid grid-cols-8 gap-8 opacity-20 md:grid-cols-12">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="h-[1px] bg-gradient-to-r from-transparent via-gemigram-neon/20 to-transparent"
            initial={animated ? { scaleX: 0.7, opacity: 0.08 } : false}
            animate={animated ? { scaleX: [0.7, 1, 0.7], opacity: [0.08, 0.25, 0.08] } : { scaleX: 1, opacity: 0.14 }}
            transition={animated ? {
              duration: 4.5,
              repeat: Infinity,
              delay: i * 0.24,
              ease: 'easeInOut',
            } : { duration: 0 }}
          />
        ))}
      </div>
    </div>
  );
}

function FloatingShapes({ enabled }: { enabled: boolean }) {
  const shapes = ['circle', 'square'];

  if (!enabled) return null;

  return (
    <div className="absolute inset-0 overflow-hidden">
      {shapes.map((shape, i) => {
        const size = 52 + i * 20;
        const x = 18 + i * 34;
        const y = 24 + i * 22;

        return (
          <motion.div
            key={shape}
            className="absolute border border-gemigram-neon/15 motion-budget-heavy"
            style={{
              width: size,
              height: size,
              left: `${x}%`,
              top: `${y}%`,
              borderRadius: shape === 'circle' ? '50%' : '18px',
            }}
            animate={{
              y: [0, -18, 0],
              rotate: [0, 10, 0],
              scale: [1, 1.04, 1],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        );
      })}
    </div>
  );
}

export default function HeroBackground() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const { tier, allowAmbientMotion, allowHeavyEffects } = useVisualTier();
  const [windowSize, setWindowSize] = useState({ width: 1, height: 1 });

  useEffect(() => {
    if (!allowAmbientMotion) return;

    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [allowAmbientMotion, mouseX, mouseY]);

  const particles = useMemo(() => {
    if (tier === 'reduced') return buildParticles(0);
    if (tier === 'mobile') return buildParticles(8);
    return buildParticles(16);
  }, [tier]);

  const x1 = useSpring(useTransform(mouseX, [0, windowSize.width], [18, -18]), { stiffness: 40, damping: 18 });
  const y1 = useSpring(useTransform(mouseY, [0, windowSize.height], [18, -18]), { stiffness: 40, damping: 18 });
  const rotateX = useSpring(useTransform(mouseY, [0, windowSize.height], [3, -3]), { stiffness: 40, damping: 18 });
  const rotateY = useSpring(useTransform(mouseX, [0, windowSize.width], [-3, 3]), { stiffness: 40, damping: 18 });

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-[#050505] select-none pointer-events-none" data-visual-tier={tier}>
      <ParticleField particles={particles} animated={allowAmbientMotion} />
      <FlowGrid animated={allowAmbientMotion} />
      <FloatingShapes enabled={allowHeavyEffects} />

      <motion.div
        style={allowAmbientMotion ? { perspective: 900, rotateX, rotateY } : undefined}
        className="absolute inset-0 flex items-center justify-center opacity-15 md:opacity-20"
      >
        <div
          className="absolute inset-[-30%] hud-grid"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, var(--gemigram-neon-glow) 1px, transparent 0)',
            backgroundSize: tier === 'mobile' ? '48px 48px' : '40px 40px',
            maskImage: 'radial-gradient(ellipse at center, black, transparent 78%)',
          }}
        />
      </motion.div>

      <motion.div
        style={allowAmbientMotion ? { x: x1, y: y1 } : undefined}
        className={`absolute inset-[-5%] opacity-30 ${allowHeavyEffects ? 'mix-blend-screen' : ''}`}
      >
        <div className="absolute top-[10%] left-[8%] h-[38vw] w-[38vw] rounded-full bg-gemigram-neon/8 blur-[72px] md:h-[34vw] md:w-[34vw] md:blur-[88px]" />
        <div className="absolute bottom-[8%] right-[8%] h-[32vw] w-[32vw] rounded-full bg-emerald-400/8 blur-[64px] md:h-[28vw] md:w-[28vw] md:blur-[80px]" />
        {allowHeavyEffects && (
          <div className="absolute left-1/2 top-1/2 h-[42vw] w-[42vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gemigram-neon/5 blur-[96px]" />
        )}
      </motion.div>

      <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
        {allowAmbientMotion && <div className="absolute inset-0 scanline" />}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
      </div>

      {allowAmbientMotion && (
        <motion.div
          animate={{ opacity: [0.015, 0.05, 0.015] }}
          transition={{ duration: 12, repeat: Infinity, times: [0, 0.5, 1] }}
          className="absolute inset-0 bg-gemigram-neon/[0.035] pointer-events-none motion-budget-accent"
        />
      )}

      <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.03]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.82)_100%)]" />
    </div>
  );
}
