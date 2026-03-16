'use client';

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

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
  const x1 = useSpring(useTransform(mouseX, [0, windowSize.width], [20, -20]));
  const y1 = useSpring(useTransform(mouseY, [0, windowSize.height], [20, -20]));

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-enterprise-bg select-none pointer-events-none">
      {/* Ambient Depth Layer */}
      <motion.div 
        style={{ x: x1, y: y1 }}
        className="absolute inset-[-10%] opacity-20"
      >
        <div className="absolute top-[10%] left-[10%] w-[50vw] h-[50vw] bg-blue-500/10 rounded-full blur-[160px]" />
        <div className="absolute bottom-[10%] right-[10%] w-[40vw] h-[40vw] bg-white/5 rounded-full blur-[140px]" />
      </motion.div>

      {/* Surface Texture */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] mix-blend-overlay" />
      
      {/* Floor Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-[30vh] bg-gradient-to-t from-enterprise-bg to-transparent" />
    </div>
  );
}
