'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useVisualTier } from '@/lib/hooks/useVisualTier';

export default function NeuralNetworkGraph() {
  const { tier, allowMotion, allowAmbientMotion } = useVisualTier();

  const nodes = useMemo(() => {
    const count = tier === 'reduced' ? 6 : tier === 'mobile' ? 8 : 10;

    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: 28 + ((i * 31) % 220),
      y: 28 + ((i * 47) % 110),
      size: tier === 'desktop' ? 5 + (i % 3) : 4 + (i % 2),
    }));
  }, [tier]);

  const connections = useMemo(() => {
    const lines: Array<{ from: (typeof nodes)[number]; to: (typeof nodes)[number] }> = [];

    for (let i = 0; i < nodes.length; i += 1) {
      for (let j = i + 1; j < nodes.length; j += 1) {
        const threshold = tier === 'desktop' ? 84 : 70;
        if (Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y) < threshold) {
          lines.push({ from: nodes[i], to: nodes[j] });
        }
      }
    }

    return lines.slice(0, tier === 'desktop' ? 16 : 9);
  }, [nodes, tier]);

  return (
    <motion.div
      initial={allowMotion ? { opacity: 0, x: -20 } : false}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.15 }}
      className="relative overflow-hidden rounded-[24px] border border-white/5 bg-white/[0.02] p-5 glass-subtle transition-all duration-500 group hover:border-aether-neon/20 md:p-6"
      data-visual-tier={tier}
    >
      <div className="relative z-10 mb-4">
        <h3 className="mb-1 text-[11px] font-black uppercase tracking-[0.3em] text-white/60">Gemigram Neural Net</h3>
        <div className="flex gap-4">
          <p className="font-mono text-[8px] uppercase text-aether-neon/60">Nodes: 14.7B</p>
          <p className="font-mono text-[8px] uppercase text-aether-neon/60">Latency: 2.1ms</p>
        </div>
      </div>

      <div className="relative h-36 w-full md:h-40">
        <svg className="h-full w-full" viewBox="0 0 300 180" preserveAspectRatio="none">
          {connections.map((line, i) => (
            <motion.line
              key={`line-${i}`}
              x1={line.from.x}
              y1={line.from.y}
              x2={line.to.x}
              y2={line.to.y}
              stroke="#00FF41"
              strokeWidth="0.5"
              initial={allowMotion ? { pathLength: 0, opacity: 0 } : false}
              animate={allowAmbientMotion ? { pathLength: 1, opacity: [0.08, 0.22, 0.08] } : { pathLength: 1, opacity: 0.12 }}
              transition={allowAmbientMotion ? { duration: 2.6, delay: i * 0.04, repeat: Infinity } : { duration: 0 }}
            />
          ))}
          {nodes.map((node, i) => (
            <React.Fragment key={`node-${i}`}>
              <motion.circle
                cx={node.x}
                cy={node.y}
                r={node.size}
                fill="#00FF41"
                animate={allowAmbientMotion ? { opacity: [0.22, 0.7, 0.22], scale: [1, 1.08, 1] } : { opacity: 0.3, scale: 1 }}
                transition={allowAmbientMotion ? { duration: 2 + (i % 3) * 0.4, repeat: Infinity } : { duration: 0 }}
                className={tier === 'desktop' ? 'filter blur-[0.6px]' : ''}
              />
              <circle cx={node.x} cy={node.y} r={Math.max(node.size / 2.4, 1.8)} fill="white" />
            </React.Fragment>
          ))}
        </svg>
      </div>

      <div className="absolute right-2 top-2 flex items-center gap-1.5">
        <div className={`h-1.5 w-1.5 rounded-full bg-aether-neon ${allowAmbientMotion ? 'animate-pulse' : ''}`} />
        <span className="font-mono text-[6px] uppercase tracking-widest text-aether-neon">Active_Scan</span>
      </div>
    </motion.div>
  );
}
