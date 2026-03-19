'use client';

import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Maximize2, MoreHorizontal } from 'lucide-react';

interface LiquidWidgetProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

/**
 * Sovereign Liquid Widget
 * A draggable, springy container for dashboard interaction.
 */
export function LiquidWidget({ title, children, icon }: LiquidWidgetProps) {
  
  // Spring configuration for 'liquid' feel
  const springConfig = { damping: 20, stiffness: 150 };
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  return (
    <motion.div 
      drag
      dragConstraints={{ top: -500, bottom: 500, left: -500, right: 500 }} // Placeholder
      dragElastic={0.1}
      whileHover={{ scale: 1.02 }}
      whileDrag={{ scale: 1.05, zIndex: 50, shadow: '0 20px 50px rgba(0,0,0,0.5)' }}
      style={{ x: springX, y: springY }}
      className="inline-block p-[1px] rounded-2xl bg-gradient-to-br from-white/10 to-transparent backdrop-blur-3xl border border-white/5 pointer-events-auto"
    >
      <div className="w-64 min-h-[160px] bg-black/60 rounded-[15px] overflow-hidden flex flex-col group">
        {/* Header - Drag Handle */}
        <div className="p-3 flex items-center justify-between border-b border-white/5 bg-white/5">
          <div className="flex items-center gap-2">
            {icon ? (
              <div className="text-gemigram-neon">{icon}</div>
            ) : (
              <div className="w-1.5 h-1.5 rounded-full bg-gemigram-neon shadow-[0_0_8px_#3D83D9]" />
            )}
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">
              {title}
            </span>
          </div>
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Maximize2 className="w-3 h-3 text-white/20 hover:text-white/60 cursor-pointer" />
            <MoreHorizontal className="w-3 h-3 text-white/20 hover:text-white/60 cursor-pointer" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 text-[11px] text-white/40 leading-relaxed">
          {children}
        </div>

        {/* Footer Sparkle */}
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-gemigram-neon/10 to-transparent" />
      </div>
    </motion.div>
  );
}
