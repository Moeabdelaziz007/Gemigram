'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Lock, Terminal, BarChart, Layers } from 'lucide-react';
import { BRAND } from '@/lib/constants/branding';

export function BentoFeatures() {
  const features = [
    {
      title: `${BRAND.product.name} Core`,
      description: 'Ultra-secure L1 synapse processing for industrial applications.',
      icon: Cpu,
      className: 'md:col-span-2 md:row-span-2',
    },
    {
      title: `${BRAND.product.name} Lock`,
      description: 'Quantum-safe cryptographic identity management.',
      icon: Lock,
      className: 'md:col-span-1 md:row-span-1 border-gemigram-neon/20',
    },
    {
      title: `${BRAND.product.name} CLI`,
      description: 'Advanced command execution with sub-ms feedback.',
      icon: Terminal,
      className: 'md:col-span-1 md:row-span-1',
    },
    {
      title: `${BRAND.product.name} Logic`,
      description: 'Deterministic AI logic gates for complex workflows.',
      icon: BarChart,
      className: 'md:col-span-1 md:row-span-2 border-gemigram-neon/10',
    },
    {
      title: `${BRAND.product.name} Spine`,
      description: 'Zero-latency Bi-Directional PCM streaming for sub-millisecond AI response.',
      icon: Layers,
      className: 'md:col-span-2 md:row-span-1',
    },
  ];

  return (
    <section id="features" className="relative bg-carbon-black py-16 sm:py-20 lg:py-24 xl:py-28">
      <div className="pointer-events-none absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02]" />

      <div className="page-shell relative z-10 page-stack">
        <div className="mx-auto max-w-2xl text-center">
          <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="page-title mb-4">
            The <span className="text-gemigram-neon">{BRAND.product.name}</span> Spine
          </motion.h2>
          <p className="page-copy">Next-generation infrastructure architected for neural sovereignty.</p>
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 md:grid-cols-3 md:grid-rows-auto md:gap-6 lg:gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: idx * 0.1 }}
              className={`flex flex-col justify-between rounded-[1.75rem] p-5 transition-all duration-700 sovereign-glass hover:border-gemigram-neon/40 sm:p-6 md:p-8 ${feature.className}`}
            >
              <div>
                <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/5 bg-white/5 transition-all duration-500 group-hover:bg-gemigram-neon group-hover:text-black group-hover:shadow-[0_0_30px_rgba(57,255,20,0.4)] sm:h-16 sm:w-16">
                  <feature.icon className="h-7 w-7" />
                </div>
                <h3 className="mb-4 text-2xl font-black uppercase tracking-tighter text-white transition-colors duration-500 group-hover:text-gemigram-neon sm:text-3xl">
                  {feature.title}
                </h3>
                <p className="text-xs font-bold uppercase leading-relaxed tracking-widest text-white/40 transition-colors group-hover:text-white/60">
                  {feature.description}
                </p>
              </div>

              <div className="mt-8 flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-white/10 transition-colors group-hover:text-gemigram-neon/40 sm:mt-12">
                <span>Access_Status::Enabled</span>
                <div className="h-px flex-1 bg-white/5 transition-colors group-hover:bg-gemigram-neon/10" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
