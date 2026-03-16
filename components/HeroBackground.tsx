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
            className="absolute rounded-full"
            style={{
              width: size,
              height: size,
              left: `${x}%`,
              top: `${y}%`,
              background: 'radial-gradient(circle, rgba(16,255,135,0.8) 0%, transparent 70%)',
              boxShadow: '0 0 10px rgba(16,255,135,0.5)',
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [opacity, opacity * 2, opacity],
              scale: [1, 1.5, 1],
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
      {/* Layer 1: Particle Field with Neon Green */}
      <ParticleField count={80} />
      
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
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(16, 255, 135, 0.2) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
            maskImage: 'radial-gradient(ellipse at center, black, transparent 80%)'
          }}
        />
      </motion.div>

      {/* Layer 5: Dynamic Glow Blobs with Neon Green */}
      <motion.div 
        style={{ x: x1, y: y1 }}
        className="absolute inset-[-10%] opacity-30"
      >
        <div className="absolute top-[20%] left-[15%] w-[40vw] h-[40vw] bg-gradient-to-br from-gemigram-neon/20 to-emerald-500/10 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-[20%] right-[15%] w-[35vw] h-[35vw] bg-gradient-to-tl from-fuchsia-500/10 to-purple-500/5 rounded-full blur-[120px]" />
        <div className="absolute top-[60%] left-[60%] w-[25vw] h-[25vw] bg-cyan-500/10 rounded-full blur-[100px]" />
      </motion.div>

      {/* Layer 6: Digital Rain / Scanlines Area */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute inset-0 scanline" />
      </div>

      {/* Layer 7: Interactive Flash Overlay - Neon Green */}
      <motion.div
        animate={{ 
          opacity: [0, 0.05, 0],
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity,
          times: [0, 0.5, 1] 
        }}
        className="absolute inset-0 bg-gradient-to-b from-gemigram-neon/10 to-transparent pointer-events-none"
      />

      {/* Layer 8: Surface Noise */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] mix-blend-overlay" />
      
      {/* Layer 9: Vignette */}
      <div className="absolute inset-0 bg-radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.4) 100%)" />
    </div>
  );
}
