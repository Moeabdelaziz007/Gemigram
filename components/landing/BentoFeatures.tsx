'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Lock, Terminal, BarChart, Layers } from 'lucide-react';

export function BentoFeatures() {
  const features = [
    {
      title: 'Carbon Core',
      description: 'Ultra-secure L1 synapse processing for industrial applications.',
      icon: Cpu,
      className: 'md:col-span-2 md:row-span-2',
    },
    {
      title: 'Neural Lock',
      description: 'Quantum-safe cryptographic identity management.',
      icon: Lock,
      className: 'md:col-span-1 md:row-span-1 border-carbon-neon/20',
    },
    {
      title: 'Neon CLI',
      description: 'Advanced command execution with sub-ms feedback.',
      icon: Terminal,
      className: 'md:col-span-1 md:row-span-1',
    },
    {
      title: 'Carbon Logic',
      description: 'Deterministic AI logic gates for complex workflows.',
      icon: BarChart,
      className: 'md:col-span-1 md:row-span-2 border-carbon-neon/10',
    },
    {
      title: 'Graph Memory',
      description: 'Persistent associative memory structures for long-term intelligence.',
      icon: Layers,
      className: 'md:col-span-2 md:row-span-1',
    },
  ];

  return (
    <section id="features" className="py-32 bg-carbon-black relative">
       <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-24 text-center">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-4xl md:text-6xl font-black mb-6 tracking-tighter uppercase"
          >
            The <span className="text-carbon-neon">Carbon</span> Spine
          </motion.h2>
          <p className="text-white/30 max-w-2xl mx-auto text-lg font-medium">
            Next-generation infrastructure architected for neural sovereignty.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-auto gap-8 max-w-6xl mx-auto">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`cyber-glass p-12 rounded-[2rem] flex flex-col justify-between group hover:bg-carbon-neon/[0.02] transition-colors border-white/[0.03] ${feature.className}`}
            >
              <div>
                <div className="w-14 h-14 rounded-2xl cyber-panel flex items-center justify-center mb-10 border-white/5 group-hover:border-carbon-neon/30 group-hover:bg-carbon-neon/5 transition-all">
                  <feature.icon className="w-6 h-6 text-white/40 group-hover:text-carbon-neon" />
                </div>
                <h3 className="text-2xl font-black mb-4 text-white/90 uppercase tracking-tight">{feature.title}</h3>
                <p className="text-white/30 leading-relaxed font-medium">{feature.description}</p>
              </div>
              
              <div className="mt-12 flex items-center gap-4 text-[9px] font-black uppercase tracking-[0.3em] text-white/10 group-hover:text-carbon-neon/60 transition-colors">
                <span>Core Specs</span>
                <div className="h-[1px] flex-1 bg-white/5 group-hover:bg-carbon-neon/20 transition-colors" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
