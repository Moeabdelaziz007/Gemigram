'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/Providers';
import { useRouter } from 'next/navigation';
import { useAetherStore } from '@/lib/store/useAetherStore';
import HeroBackground from '@/components/HeroBackground';
import { EnterpriseHeader } from '@/components/landing/Header';
import { EnterpriseHero } from '@/components/landing/Hero';
import { BentoFeatures } from '@/components/landing/BentoFeatures';
import { EnterpriseFooter } from '@/components/landing/Footer';
import { AuthOverlay } from '@/components/auth/AuthOverlay';
import { motion } from 'framer-motion';
import { Package, Globe, CheckCircle2 } from 'lucide-react';

export default function LandingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const voiceSession = useAetherStore((state) => state.voiceSession);
  const setVoiceSession = useAetherStore((state) => state.setVoiceSession);

  const handleVoiceLogin = () => {
    setVoiceSession({
      stage: 'forge',
      lastVoiceAction: 'Authentication requested from Create with Voice CTA.',
    });
    setIsAuthOpen(true);
  };

  useEffect(() => {
    if (!user) return;

    if (voiceSession.stage === 'workspace') {
      router.push('/workspace');
      return;
    }
    if (voiceSession.stage === 'forge') {
      router.push('/forge');
      return;
    }

    router.push('/dashboard');
  }, [user, router, voiceSession.stage]);

  if (user) return null;

  return (
    <div className="relative min-h-screen overflow-x-hidden selection:bg-gemigram-neon/20" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <HeroBackground />
      <EnterpriseHeader onLogin={handleVoiceLogin} />

      <main className="relative z-10">
        <EnterpriseHero onLogin={handleVoiceLogin} />

        <section className="relative overflow-hidden border-y border-gemigram-neon/10 bg-black/50 py-14 sm:py-16 md:py-20 lg:py-24">
          <div className="carbon-fiber pointer-events-none absolute inset-0 opacity-[0.02]" />
          <div className="page-shell flex flex-wrap items-center justify-center gap-6 text-center opacity-40 transition-all duration-700 hover:grayscale-0 sm:justify-between sm:gap-10">
            {['ORACLE.NODE', 'NEXUS.SPINE', 'LATTICE.NEON', 'VERTEX.CARBON'].map((item) => (
              <div key={item} className="cursor-default text-sm font-black uppercase italic tracking-[0.28em] text-white transition-colors hover:text-gemigram-neon sm:text-lg md:text-2xl md:tracking-[0.4em]">
                {item}
              </div>
            ))}
          </div>
        </section>

        <BentoFeatures />

        <section className="relative overflow-hidden bg-carbon-black/50 py-16 sm:py-20 lg:py-24 xl:py-28">
          <div className="pointer-events-none absolute left-0 top-1/4 h-72 w-72 rounded-full bg-neon-green/5 blur-[150px] mix-blend-screen sm:h-96 sm:w-96" />
          <div className="pointer-events-none absolute bottom-1/4 right-0 h-72 w-72 rounded-full bg-neon-blue/5 blur-[150px] mix-blend-screen sm:h-96 sm:w-96" />

          <div className="page-shell relative z-10 page-stack">
            <div className="mx-auto max-w-3xl text-center">
              <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="page-title mb-4 sm:mb-6">
                Limitless <span className="text-neon-green drop-shadow-[0_0_20px_rgba(57,255,20,0.4)]">Integrations</span>
              </motion.h2>
              <p className="page-copy text-base sm:text-lg">Connect to GitHub, access 20,000+ APIs, and integrate with external models via MCP protocol.</p>
            </div>

            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-8">
              {[
                {
                  icon: Package,
                  title: 'Model Context Protocol',
                  color: 'neon-green',
                  items: [
                    { title: 'GitHub Integration', desc: 'Repository management, PR reviews, Issues, Actions' },
                    { title: 'MCP Marketplace', desc: 'Discover & install MCP servers instantly' },
                    { title: 'JSON-RPC 2.0', desc: 'Standardized, robust protocol for AI connections' },
                  ],
                },
                {
                  icon: Globe,
                  title: 'API Marketplace',
                  color: 'neon-blue',
                  items: [
                    { title: '20,000+ APIs', desc: 'RapidAPI & APILayer seamless integration' },
                    { title: 'Secure Credentials', desc: 'Encrypted storage & robust OAuth2 flows' },
                    { title: 'Usage Tracking', desc: 'Real-time monitoring, alerts & limit management' },
                  ],
                },
              ].map((card, idx) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.15, ease: 'easeOut' }}
                  className={`group relative overflow-hidden rounded-[2rem] border p-5 glass-strong sm:p-6 md:p-8 ${card.color === 'neon-green' ? 'border-neon-green/20' : 'border-neon-blue/20'}`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${card.color === 'neon-green' ? 'from-neon-green/10' : 'from-neon-blue/10'} via-transparent to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100`} />
                  <div className="relative z-10">
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
                      <div className={`flex h-14 w-14 items-center justify-center rounded-2xl border ${card.color === 'neon-green' ? 'border-neon-green/30 bg-neon-green/10' : 'border-neon-blue/30 bg-neon-blue/10'} transition-transform duration-500 group-hover:scale-110`}>
                        <card.icon className={`h-7 w-7 ${card.color === 'neon-green' ? 'text-neon-green' : 'text-neon-blue'}`} />
                      </div>
                      <h3 className="text-2xl font-black tracking-tight text-white sm:text-3xl">{card.title}</h3>
                    </div>
                    <ul className="space-y-4 sm:space-y-5">
                      {card.items.map((item) => (
                        <li key={item.title} className="flex items-start gap-4">
                          <div className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${card.color === 'neon-green' ? 'bg-neon-green/20' : 'bg-neon-blue/20'}`}>
                            <CheckCircle2 className={`h-4 w-4 ${card.color === 'neon-green' ? 'text-neon-green' : 'text-neon-blue'}`} />
                          </div>
                          <div>
                            <div className="mb-1 text-base font-bold text-white sm:text-lg">{item.title}</div>
                            <div className="text-sm leading-relaxed text-white/50">{item.desc}</div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24 xl:py-28">
          <div className="pointer-events-none absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==')] opacity-20" />

          <div className="page-shell relative z-10">
            <div className="group relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-gemigram-neon/20 p-6 text-center transition-colors duration-500 glass-strong hover:border-gemigram-neon/40 sm:p-8 md:p-10 lg:p-14 xl:p-16">
              <div className="carbon-fiber pointer-events-none absolute inset-0 opacity-[0.03]" />
              <div className="pointer-events-none absolute left-1/2 top-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gemigram-neon/5 blur-[120px] transition-all duration-1000 group-hover:bg-gemigram-neon/10" />

              <h2 className="page-title relative z-10 mb-5 leading-[0.9] sm:mb-6 md:text-6xl xl:text-7xl">
                Ready for <span className="animate-pulse text-gemigram-neon drop-shadow-[0_0_30px_rgba(57,255,20,0.5)]">Sovereignty?</span>
              </h2>
              <p className="relative z-10 mx-auto mb-8 max-w-2xl text-sm font-bold uppercase leading-relaxed tracking-[0.18em] text-white/60 sm:mb-10 sm:text-base sm:tracking-[0.2em]">
                Join the mainnet and initialize your first neural entity in seconds.
                <br className="hidden sm:block" />
                <span className="text-white/80">Experience Zero-Friction intelligence.</span>
              </p>
              <div className="relative z-10 flex justify-center">
                <motion.button
                  onClick={() => setIsAuthOpen(true)}
                  whileHover={{ scale: 1.04, boxShadow: '0 0 80px rgba(57,255,20,0.6)' }}
                  whileTap={{ scale: 0.96 }}
                  className="inline-flex w-full max-w-xs items-center justify-center rounded-full bg-gemigram-neon px-8 py-4 text-base font-black uppercase tracking-[0.22em] text-black shadow-[0_0_50px_rgba(57,255,20,0.4)] transition-all sm:w-auto sm:max-w-none sm:px-12 sm:py-5 sm:text-lg"
                >
                  <span className="relative z-10">Launch_Terminal</span>
                </motion.button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <EnterpriseFooter />

      <AuthOverlay isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
}
