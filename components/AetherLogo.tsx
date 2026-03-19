'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import GemigramLogoIcon from './GemigramLogo';
import { BRAND } from '@/lib/constants/branding';

export type LogoVariant = 'icon' | 'wordmark' | 'full' | 'favicon';

interface GemigramLogoProps {
  variant?: LogoVariant;
  size?: number;
  className?: string;
}

export const GemigramLogo = ({ variant = 'icon', size = 48, className = '' }: GemigramLogoProps) => {
  // Icon-only variant
  if (variant === 'icon' || variant === 'favicon') {
    return (
      <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
        {/* Neural Core Glow */}
        <motion.div
          className="absolute inset-0 bg-gemigram-neon/10 rounded-full blur-2xl"
          animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        
        <motion.div
          className="relative z-10 w-full h-full"
          animate={{ 
            filter: [
              "drop-shadow(0 0 5px rgba(16, 255, 135, 0.3))",
              "drop-shadow(0 0 12px rgba(16, 255, 135, 0.5))",
              "drop-shadow(0 0 5px rgba(16, 255, 135, 0.3))"
            ]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image
            src={BRAND.assets.icon.path}
            alt={`${BRAND.product.name} icon`}
            width={size}
            height={size}
            className="w-full h-full object-contain"
            priority
          />
        </motion.div>
      </div>
    );
  }

  // Wordmark variant
  if (variant === 'wordmark') {
    return (
      <div className={`flex items-center gap-3 ${className}`} style={{ height: size }}>
        <div style={{ width: size, height: size }}><GemigramLogoIcon className="w-full h-full" /></div>
        <div className="flex flex-col">
          <span 
            className="text-white font-black tracking-[0.3em] uppercase leading-none"
            style={{ fontSize: size * 0.3 }}
          >
            {BRAND.product.name}
          </span>
          <span 
            className="text-gemigram-neon font-bold tracking-[0.4em] uppercase leading-none mt-1"
            style={{ fontSize: size * 0.12 }}
          >
            {BRAND.product.tagline}
          </span>
        </div>
      </div>
    );
  }

  // Full variant (icon + wordmark side by side)
  return (
    <div className={`flex items-center gap-4 ${className}`} style={{ height: size }}>
      <div style={{ width: size * 0.8, height: size * 0.8 }}><GemigramLogoIcon className="w-full h-full" /></div>
      <div className="flex flex-col">
        <span 
          className="text-white font-black tracking-[0.3em] uppercase leading-none"
          style={{ fontSize: size * 0.25 }}
        >
          {BRAND.product.name}
        </span>
        <span 
          className="text-gemigram-neon font-bold tracking-[0.4em] uppercase leading-none mt-1"
          style={{ fontSize: size * 0.1 }}
        >
          {BRAND.product.tagline}
        </span>
      </div>
    </div>
  );
};

// Secondary export
export default GemigramLogo;
