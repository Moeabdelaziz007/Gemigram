'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function GemigramLogo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Outer Hexagon/Gem Frame */}
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(0,255,65,0.3)]">
        <motion.path
          d="M50 5 L90 27.5 L90 72.5 L50 95 L10 72.5 L10 27.5 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-aether-neon/30"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />

        {/* Inner Gem Structure */}
        <motion.path
          d="M50 20 L80 37.5 L80 62.5 L50 80 L20 62.5 L20 37.5 Z"
          fill="currentColor"
          className="text-aether-neon/10"
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [0.95, 1.05, 0.95]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Neural Core */}
        <motion.circle
          cx="50" cy="50" r="8"
          fill="currentColor"
          className="text-aether-neon"
          animate={{ r: [6, 10, 6] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />

        {/* Connecting Synapses */}
        {[0, 60, 120, 180, 240, 300].map((angle, i) => (
          <motion.line
            key={i}
            x1="50" y1="50"
            x2={50 + Math.cos(angle * Math.PI / 180) * 35}
            y2={50 + Math.sin(angle * Math.PI / 180) * 35}
            stroke="currentColor"
            strokeWidth="1"
            className="text-aether-neon/40"
            animate={{ opacity: [0.1, 0.8, 0.1] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
          />
        ))}
      </svg>

      {/* Branding Overlay Text (Hidden by default, used if parent prefers) */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-1 h-1 bg-white rounded-full animate-ping" />
      </div>
    </div>
  );
}
