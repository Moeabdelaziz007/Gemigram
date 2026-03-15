'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
  };
}

export function PageHeader({
  title,
  subtitle,
  description,
  icon,
  action
}: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8 md:mb-12"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          {icon && (
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-aether-neon/10 flex items-center justify-center flex-shrink-0 border border-aether-neon/20">
              {icon}
            </div>
          )}
          <div>
            {subtitle && (
              <p className="text-xs md:text-sm font-bold uppercase tracking-widest text-aether-neon/80 mb-2">
                {subtitle}
              </p>
            )}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-2">
              {title}
            </h1>
            {description && (
              <p className="text-sm md:text-base text-white/60 max-w-2xl leading-relaxed">
                {description}
              </p>
            )}
          </div>
        </div>
        {action && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={action.onClick}
            className={`flex-shrink-0 px-4 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl font-bold text-sm md:text-base transition-all duration-300 whitespace-nowrap ${
              action.variant === 'primary'
                ? 'bg-aether-neon text-black hover:bg-white shadow-lg hover:shadow-aether-neon/50'
                : 'quantum-glass border border-white/20 text-white hover:border-aether-neon/50 hover:bg-white/5'
            }`}
          >
            {action.label}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
