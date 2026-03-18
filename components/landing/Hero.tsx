'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Globe, Fingerprint, Mic, ArrowRight } from 'lucide-react';
import { useSystemTelemetry } from '../../hooks/useSystemTelemetry';
import { useAetherStore } from '../../lib/store/useAetherStore';
import { BRAND } from '@/lib/constants/branding';

export function EnterpriseHero({ onLogin }: { onLogin: () => void }) {
  const telemetry = useSystemTelemetry();
  const totalAgents = useAetherStore((state) => state.agents.length);

  useEffect(() => {
    // Stats are currently static or powered by telemetry hook
  }, []);

  return (
    <section className="relative flex min-h-[92vh] items-center justify-center overflow-hidden bg-carbon-black pb-14 pt-28 sm:pb-16 sm:pt-32 md:pt-36 lg:pb-20">
      <div className="pointer-events-none absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]" />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-screen" style={{ backgroundImage: "url('/hero_bg.png')" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
        <div className="absolute left-[12%] top-[10%] h-[48vw] w-[48vw] rounded-full bg-gradient-to-br from-gemigram-neon/20 to-gemigram-neon/5 blur-[160px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[12%] h-[42vw] w-[42vw] rounded-full bg-gradient-to-tl from-gemigram-neon/10 to-transparent blur-[120px]" />
      </div>

      <div className="page-shell relative z-10 flex flex-col items-center gap-12 lg:gap-16">
        <div className="relative mb-2">
          <motion.div
            animate={{ scale: [1, 1.08, 1], rotate: [0, 90, 180, 270, 360], opacity: [0.6, 0.8, 0.6] }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            className="relative h-[180px] w-[180px] rounded-full sm:h-[260px] sm:w-[260px] lg:h-[340px] lg:w-[340px] xl:h-[420px] xl:w-[420px]"
            style={{ background: 'radial-gradient(circle, var(--gemigram-neon-glow) 0%, rgba(57,255,20,0.1) 40%, transparent 70%)', filter: 'blur(20px)' }}
          >
            <div className="absolute inset-0 animate-spin rounded-full border-2 border-gemigram-neon/10 [animation-duration:8s]" />
            <div className="absolute inset-6 rounded-full border border-gemigram-neon/20 animate-spin [animation-duration:12s]" style={{ animationDirection: 'reverse' }} />
          </motion.div>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="group relative flex h-40 w-40 items-center justify-center overflow-hidden rounded-full border border-gemigram-neon/40 p-5 glass-strong sm:h-52 sm:w-52 lg:h-64 lg:w-64 lg:p-8">
              <motion.div
                animate={{ scale: [0.95, 1.05, 0.95], filter: ['hue-rotate(0deg)', 'hue-rotate(30deg)', 'hue-rotate(0deg)'], boxShadow: ['0 0 30px rgba(57,255,20,0.3)', '0 0 80px rgba(57,255,20,0.5)', '0 0 30px rgba(57,255,20,0.3)'] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="h-full w-full rounded-full bg-gradient-to-br from-gemigram-neon to-gemigram-mint opacity-90 mix-blend-screen shadow-[0_0_100px_rgba(57,255,20,0.4)]"
              />
              <div className="absolute inset-0 rounded-full bg-black/40 backdrop-blur-2xl" />
              <Fingerprint className="absolute z-10 h-20 w-20 text-white/10 transition-colors duration-1000 group-hover:text-gemigram-neon sm:h-28 sm:w-28 lg:h-36 lg:w-36" />
            </div>
          </div>
        </div>

        <div className="z-20 w-full text-center">
          <motion.h1 initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="page-hero-title neon-shimmer mb-5">
            {BRAND.product.name}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto mb-8 max-w-3xl text-xs font-bold uppercase tracking-[0.28em] text-white/40 sm:text-sm md:text-lg lg:text-xl lg:tracking-[0.35em]">
            {BRAND.product.tagline}
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto flex w-full max-w-xs flex-col items-stretch justify-center gap-3 sm:max-w-none sm:flex-row sm:items-center sm:gap-4">
            <motion.button whileHover={{ scale: 1.05, boxShadow: '0 0 80px rgba(57,255,20,0.5)' }} whileTap={{ scale: 0.95 }} onClick={onLogin} className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-gemigram-neon px-6 py-4 text-base font-black uppercase tracking-[0.16em] text-black shadow-[0_0_50px_rgba(57,255,20,0.4)] transition-all sm:w-auto sm:px-10 sm:text-lg md:px-12 md:py-5">
              <Mic className="h-5 w-5" />
              Create with Voice
              <ArrowRight className="h-5 w-5" />
            </motion.button>
            <motion.button whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.05)' }} whileTap={{ scale: 0.95 }} className="w-full rounded-full border border-white/10 bg-white/5 px-6 py-4 text-base font-black uppercase tracking-[0.16em] text-white backdrop-blur-xl transition-all sm:w-auto sm:px-10 sm:text-lg md:px-12 md:py-5">
              Explore_Mainnet
            </motion.button>
          </motion.div>

          <div className="mx-auto mt-8 max-w-3xl rounded-[1.75rem] border border-white/10 px-4 py-4 glass-medium sm:px-6 sm:py-5">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.3em] text-gemigram-neon/80">Voice Flow Preview</p>
            <div className="grid grid-cols-1 gap-3 text-left md:grid-cols-3">
              {[
                '1. Tap Create with Voice and grant mic access',
                '2. Describe your agent naturally in one sentence',
                '3. Confirm blueprint and launch into workspace',
              ].map((step) => (
                <div key={step} className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm font-medium text-white/80">
                  {step}
                </div>
              ))}
            </div>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }} className="relative w-full overflow-hidden rounded-[2rem] border border-gemigram-neon/10 p-4 shadow-[0_0_40px_rgba(0,0,0,0.5)] glass-strong sm:p-6 md:p-8 lg:p-10 xl:p-12">
          <div className="pointer-events-none absolute right-0 top-0 h-[320px] w-[320px] bg-gemigram-neon/10 blur-[120px] mix-blend-screen sm:h-[500px] sm:w-[500px]" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-[260px] w-[260px] bg-neon-blue/5 blur-[100px] mix-blend-screen sm:h-[400px] sm:w-[400px]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.8)_1px,transparent_1px)] bg-[length:24px_24px] opacity-[0.02]" />

          <div className="relative z-10 mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between md:mb-10 lg:mb-12">
            <h2 className="text-2xl font-black uppercase tracking-tighter text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] sm:text-3xl md:text-4xl">Agent_Hive</h2>
            <div className="flex gap-3 self-start sm:self-auto">
              {[1, 2].map((i) => (
                <motion.button key={i} whileHover={{ scale: 1.08, backgroundColor: 'rgba(57,255,20,0.1)' }} whileTap={{ scale: 0.92 }} className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white/50 backdrop-blur-md transition-all hover:border-gemigram-neon hover:text-gemigram-neon">
                  {i === 1 ? '<' : '>'}
                </motion.button>
              ))}
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {[1, 2, 3, 4, 5].map((i) => (
              <motion.div key={i} whileHover={{ y: -8 }} className="group relative cursor-pointer overflow-hidden rounded-[1.75rem] p-4 transition-all duration-500 glass-medium hover:border-gemigram-neon/40 sm:p-5 md:p-6">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent to-gemigram-neon/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="relative mb-5 aspect-[4/5] overflow-hidden rounded-2xl border border-white/5 bg-black/40">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(57,255,20,0.1)_0%,transparent_70%)] opacity-50" />
                  <img
                    src={`/agents/robot_${(i % 3) + 1}.png`}
                    alt={`Neural Entity ${i}`}
                    className="h-full w-full object-cover opacity-50 mix-blend-screen transition-all duration-700 group-hover:scale-110 group-hover:opacity-100"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="absolute left-0 top-0 h-1 w-full bg-gemigram-neon opacity-0 shadow-[0_0_10px_rgba(57,255,20,0.8)] group-hover:animate-[scanline_2s_linear_infinite] group-hover:opacity-100" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
                </div>

                <h4 className="mb-2 text-sm font-black uppercase tracking-widest text-white transition-colors group-hover:text-gemigram-neon">Neural_Entity_{i}</h4>
                <div className="flex items-center gap-3">
                  <div className="relative flex h-2 w-2 items-center justify-center">
                    <span className="absolute h-full w-full animate-ping rounded-full bg-gemigram-neon opacity-75" />
                    <span className="relative h-1.5 w-1.5 rounded-full bg-gemigram-neon" />
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Runtime::Active</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.8 }} className="grid w-full max-w-6xl grid-cols-1 gap-5 border-t border-white/[0.03] pt-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 lg:pt-12">
          {[
            { icon: Shield, label: 'Carbon Secure', value: 'AES-256', color: 'text-neon-green' },
            { icon: Zap, label: 'Neon Active', value: `${totalAgents} Agents`, color: 'text-cyber-lime' },
            { icon: Globe, label: 'Session Uptime', value: `${telemetry.uptime}s`, color: 'text-electric-purple' },
          ].map((item, idx) => (
            <motion.div key={idx} className="group flex flex-col items-center gap-3 text-center" whileHover={{ scale: 1.03, y: -4 }}>
              <div className="rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-3 transition-all group-hover:border-gemigram-neon/50">
                <item.icon className={`h-5 w-5 ${item.color} opacity-60 transition-opacity group-hover:opacity-100`} />
              </div>
              <span className="text-sm font-bold uppercase text-white">{item.value}</span>
              <span className="text-[8px] font-black uppercase tracking-[0.25em] text-white/20 transition-colors group-hover:text-white/50">{item.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
