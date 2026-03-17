import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { BRAND } from '@/lib/constants/branding';

export default function GemigramLogo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Outer Hexagon/Gem Frame (Glass Overlay) */}
      <motion.div 
        className="absolute inset-0 z-10 border border-white/10 rounded-xl backdrop-blur-[2px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />
      
      {/* Official Neural G Logo */}
      <motion.div
        className="relative z-0"
        animate={{ 
          filter: [
            "drop-shadow(0 0 8px rgba(0, 255, 65, 0.3))",
            "drop-shadow(0 0 15px rgba(0, 255, 65, 0.5))",
            "drop-shadow(0 0 8px rgba(0, 255, 65, 0.3))"
          ]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image
          src={BRAND.assets.icon.path}
          alt={`${BRAND.product.name} icon`}
          width={120}
          height={120}
          className="w-full h-full object-contain"
          priority
        />
      </motion.div>

      {/* Neural Core Pulse */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-1 h-1 bg-white rounded-full animate-ping opacity-50" />
      </div>
    </div>
  );
}
