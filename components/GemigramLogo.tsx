'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { BRAND } from '@/lib/constants/branding';

export type LogoVariant = 'icon' | 'wordmark' | 'full' | 'favicon';

interface GemigramLogoProps {
  variant?: LogoVariant;
  size?: number;
  className?: string;
  showTagline?: boolean;
}

/**
 * 🧬 GemigramOS Sovereign Logo Component
 * Unified branding for the entire AIOS ecosystem.
 */
export function GemigramLogo({ 
  variant = 'icon', 
  size = 32, 
  className = "",
  showTagline = true 
}: GemigramLogoProps) {
  
  // Icon Only
  if (variant === 'icon' || variant === 'favicon') {
    return (
      <div 
        className={`relative flex items-center justify-center ${className}`} 
        style={{ '--logo-size': `${size}px`, width: 'var(--logo-size)', height: 'var(--logo-size)' } as React.CSSProperties}
      >
        {/* Ambient Neural Glow */}
        <motion.div
          className="absolute inset-0 bg-gemigram-neon/20 rounded-full blur-2xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Holographic Frame */}
        <div className="absolute inset-0 border border-white/10 rounded-lg backdrop-blur-[2px] z-10" />

        <motion.div
          className="relative z-20 w-full h-full p-[10%]"
          whileHover={{ scale: 1.1, rotate: 5 }}
          animate={{ 
            filter: [
              "drop-shadow(0 0 5px rgba(16, 255, 135, 0.3))",
              "drop-shadow(0 0 15px rgba(16, 255, 135, 0.6))",
              "drop-shadow(0 0 5px rgba(16, 255, 135, 0.3))"
            ]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image
            src={BRAND.assets.icon.path}
            alt={`${BRAND.product.name} Icon`}
            width={size}
            height={size}
            className="w-full h-full object-contain"
            priority
          />
        </motion.div>
      </div>
    );
  }

  // Wordmark or Full
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {variant === 'full' && (
        <GemigramLogo variant="icon" size={size} />
      )}
      
      <div className="flex flex-col justify-center">
        <motion.span 
          className="text-white font-black tracking-[0.25em] uppercase leading-none"
          style={{ fontSize: size * 0.45 }}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {BRAND.product.name}
        </motion.span>
        
        {showTagline && (
          <motion.span 
            className="text-gemigram-neon/80 font-bold tracking-[0.3em] uppercase leading-none mt-1.5"
            style={{ fontSize: size * 0.14 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {BRAND.product.tagline}
          </motion.span>
        )}
      </div>
    </div>
  );
}

export default GemigramLogo;
