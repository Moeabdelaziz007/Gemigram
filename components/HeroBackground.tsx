'use client';

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useState, useMemo } from "react";

// Particle System Component
function ParticleField({ count = 50 }: { count?: number }) {
  const particles = useMemo(() => Array.from({ length: count }), [count]);
  
  return (
    <div className="absolute inset-0 overflow-hidden">
      {particles.map((_, i) => {
        const size = Math.random() * 3 + 1;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;
        const opacity = Math.random() * 0.3 + 0.1;
        
        return (
          <motion.div
            key={i}
            className="absolute rounded-full will-change-transform"
            style={{
              width: size,
              height: size,
              left: `${x}%`,
              top: `${y}%`,
              background: 'radial-gradient(circle, var(--gemigram-neon) 0%, transparent 70%)',
              boxShadow: '0 0 10px var(--gemigram-neon-glow)',
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [opacity, opacity * 2, opacity],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration,
              repeat: Infinity,
              delay,
              ease: 'linear',
            }}
          />
        );
      })}
    </div>
  );
}

// Flowing Grid Lines Component
function FlowGrid() {
  return (
    <motion.div
      className="absolute inset-0"
      style={{
        perspective: 1000,
        rotateX: 60,
      }}
    >
      <div className="absolute inset-0 grid grid-cols-12 gap-8 opacity-20">
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="h-[1px] bg-gradient-to-r from-transparent via-gemigram-neon/30 to-transparent"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 0.3 }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.2,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}

// Floating Geometric Shapes
function FloatingShapes() {
  const shapes = ['circle', 'square', 'triangle'];
  
  return (
    <div className="absolute inset-0 overflow-hidden">
      {shapes.map((shape, i) => {
        const size = 60 + i * 20;
        const x = 20 + i * 30;
        const y = 30 + i * 20;
        
        return (
          <motion.div
            key={shape}
            className="absolute border border-gemigram-neon/20"
            style={{
              width: size,
              height: shape === 'triangle' ? size : size,
              left: `${x}%`,
              top: `${y}%`,
              borderRadius: shape === 'circle' ? '50%' : shape === 'square' ? '0' : '0',
              transform: shape === 'triangle' ? 'rotate(45deg)' : 'none',
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 180, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8 + i * 2,
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

  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Gentle Ambient Movement
  const x1 = useSpring(useTransform(mouseX, [0, windowSize.width], [30, -30]));
  const y1 = useSpring(useTransform(mouseY, [0, windowSize.height], [30, -30]));
  const rotateX = useSpring(useTransform(mouseY, [0, windowSize.height], [5, -5]));
  const rotateY = useSpring(useTransform(mouseX, [0, windowSize.width], [-5, 5]));

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-[#050505] select-none pointer-events-none">
      {/* Layer 1: Particle Field with Neon Green - Optimized count */}
      <ParticleField count={30} />
      
      {/* Layer 2: Flowing Grid Lines */}
      <FlowGrid />
      
      {/* Layer 3: Floating Geometric Shapes */}
      <FloatingShapes />
      
      {/* Layer 4: HUD Grid Layer - Enhanced */}
      <motion.div 
        style={{ 
          perspective: 1000,
          rotateX,
          rotateY,
        }}
        className="absolute inset-0 flex items-center justify-center opacity-20"
      >
        <div 
          className="absolute inset-[-50%] hud-grid"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, var(--gemigram-neon-glow) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
            maskImage: 'radial-gradient(ellipse at center, black, transparent 80%)'
          }}
        />
      </motion.div>

      {/* Layer 5: Dynamic Glow Blobs with Neon Green - Optimized with will-change */}
      <motion.div 
        style={{ x: x1, y: y1 }}
        className="absolute inset-[-10%] opacity-40 mix-blend-screen will-change-transform"
      >
        <div className="absolute top-[10%] left-[10%] w-[50vw] h-[50vw] bg-gemigram-neon/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[10%] w-[45vw] h-[45vw] bg-emerald-500/10 rounded-full blur-[100px]" />
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-gemigram-neon/5 rounded-full blur-[180px]" />
      </motion.div>

      {/* Layer 6: Digital Rain / Scanlines Area */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
        <div className="absolute inset-0 scanline" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
      </div>

      {/* Layer 7: Interactive Flash Overlay - Neon Green */}
      <motion.div
        animate={{ 
          opacity: [0.02, 0.08, 0.02],
        }}
        transition={{ 
          duration: 10, 
          repeat: Infinity,
          times: [0, 0.5, 1] 
        }}
        className="absolute inset-0 bg-gemigram-neon/5 pointer-events-none"
      />

      {/* Layer 8: Surface Noise */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] mix-blend-overlay" />
      
      {/* Layer 9: Vignette - Industrial Strong */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
    </div>
  );
}
