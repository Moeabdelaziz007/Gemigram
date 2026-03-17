'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/Providers';
import { useRouter } from 'next/navigation';
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

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  if (user) return null;

  return (
    <div className="relative min-h-screen selection:bg-gemigram-neon/20 overflow-x-hidden" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <HeroBackground />
      <EnterpriseHeader onLogin={() => setIsAuthOpen(true)} />
      
      <main className="relative z-10">
        <EnterpriseHero onLogin={() => setIsAuthOpen(true)} />
        
        {/* Industry Trust Bar */}
        <section className="py-24 border-y border-gemigram-neon/10 bg-black/50 relative overflow-hidden">
           <div className="absolute inset-0 opacity-[0.02] pointer-events-none carbon-fiber" />
           <div className="container mx-auto px-6 flex flex-wrap justify-between items-center gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
             <div className="text-2xl font-black tracking-[0.6em] text-white uppercase italic hover:text-gemigram-neon transition-colors cursor-default">ORACLE.NODE</div>
             <div className="text-2xl font-black tracking-[0.6em] text-white uppercase italic hover:text-gemigram-neon transition-colors cursor-default">NEXUS.SPINE</div>
             <div className="text-2xl font-black tracking-[0.6em] text-white uppercase italic hover:text-gemigram-neon transition-colors cursor-default">LATTICE.NEON</div>
             <div className="text-2xl font-black tracking-[0.6em] text-white uppercase italic hover:text-gemigram-neon transition-colors cursor-default">VERTEX.CARBON</div>
          </div>
        </section>

        <BentoFeatures />
        
        {/* MCP & API Marketplace Integration Showcase */}
        <section className="py-32 relative bg-carbon-black/50 overflow-hidden">
          {/* Subtle glowing orbs in background */}
          <div className="absolute top-1/4 left-0 w-96 h-96 bg-neon-green/5 rounded-full blur-[150px] mix-blend-screen pointer-events-none" />
          <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-neon-blue/5 rounded-full blur-[150px] mix-blend-screen pointer-events-none" />

          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center mb-20">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-5xl md:text-7xl font-black mb-6 tracking-tighter text-white"
              >
                Limitless <span className="text-neon-green drop-shadow-[0_0_20px_rgba(57,255,20,0.4)]">Integrations</span>
              </motion.h2>
              <p className="text-xl text-white/50 max-w-3xl mx-auto font-light tracking-wide">
                Connect to GitHub, access 20,000+ APIs, and integrate with external models via MCP protocol.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {/* MCP Integration Card */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="glass-strong p-10 rounded-[2.5rem] border border-neon-green/20 relative group overflow-hidden"
              >
                {/* Hover gradient sweep */}
                <div className="absolute inset-0 bg-gradient-to-br from-neon-green/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                <div className="relative z-10">
                  <div className="flex items-center gap-5 mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-neon-green/10 flex items-center justify-center border border-neon-green/30 group-hover:scale-110 transition-transform duration-500">
                      <Package className="w-8 h-8 text-neon-green" />
                    </div>
                    <h3 className="text-3xl font-black text-white tracking-tight">Model Context Protocol</h3>
                  </div>
                  <ul className="space-y-6">
                    {[
                      { title: "GitHub Integration", desc: "Repository management, PR reviews, Issues, Actions" },
                      { title: "MCP Marketplace", desc: "Discover & install MCP servers instantly" },
                      { title: "JSON-RPC 2.0", desc: "Standardized, robust protocol for AI connections" }
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-4">
                        <div className="mt-1 w-6 h-6 rounded-full bg-neon-green/20 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-4 h-4 text-neon-green" />
                        </div>
                        <div>
                          <div className="text-white font-bold text-lg mb-1">{item.title}</div>
                          <div className="text-white/50 text-sm leading-relaxed">{item.desc}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
              
              {/* API Marketplace Card */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                className="glass-strong p-10 rounded-[2.5rem] border border-neon-blue/20 relative group overflow-hidden"
              >
                {/* Hover gradient sweep */}
                <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                <div className="relative z-10">
                  <div className="flex items-center gap-5 mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-neon-blue/10 flex items-center justify-center border border-neon-blue/30 group-hover:scale-110 transition-transform duration-500">
                      <Globe className="w-8 h-8 text-neon-blue" />
                    </div>
                    <h3 className="text-3xl font-black text-white tracking-tight">API Marketplace</h3>
                  </div>
                  <ul className="space-y-6">
                    {[
                      { title: "20,000+ APIs", desc: "RapidAPI & APILayer seamless integration" },
                      { title: "Secure Credentials", desc: "Encrypted storage & robust OAuth2 flows" },
                      { title: "Usage Tracking", desc: "Real-time monitoring, alerts & limit management" }
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-4">
                        <div className="mt-1 w-6 h-6 rounded-full bg-neon-blue/20 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-4 h-4 text-neon-blue" />
                        </div>
                        <div>
                          <div className="text-white font-bold text-lg mb-1">{item.title}</div>
                          <div className="text-white/50 text-sm leading-relaxed">{item.desc}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Final Interactive CTA Section */}
        <section className="py-40 relative overflow-hidden">
          {/* Faded particle grid background */}
          <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==')] pointer-events-none" />

          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-5xl mx-auto glass-strong p-20 text-center relative overflow-hidden group rounded-[3rem] border-gemigram-neon/20 hover:border-gemigram-neon/40 transition-colors duration-500">
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none carbon-fiber" />

              {/* Dynamic glowing core */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gemigram-neon/5 blur-[120px] rounded-full group-hover:bg-gemigram-neon/10 transition-all duration-1000 pointer-events-none" />
              
              <h2 className="text-5xl md:text-8xl font-black mb-10 tracking-tighter uppercase relative z-10 leading-none">
                Ready for <span className="text-gemigram-neon animate-pulse drop-shadow-[0_0_30px_rgba(57,255,20,0.5)]">Sovereignty?</span>
              </h2>
              <p className="text-white/60 text-xl mb-16 max-w-2xl mx-auto font-bold uppercase tracking-[0.2em] relative z-10 leading-relaxed">
                Join the mainnet and initialize your first neural entity in seconds. <br />
                <span className="text-white/80">Experience Zero-Friction intelligence.</span>
              </p>
              <div className="relative z-10 flex justify-center">
                <motion.button
                  onClick={() => setIsAuthOpen(true)}
                  whileHover={{ scale: 1.05, boxShadow: '0 0 100px rgba(57,255,20,0.8)' }}
                  whileTap={{ scale: 0.95 }}
                  className="px-24 py-8 bg-gemigram-neon text-black rounded-full text-2xl font-black uppercase tracking-[0.3em] shadow-[0_0_50px_rgba(57,255,20,0.4)] transition-all relative overflow-hidden group/btn"
                >
                  <span className="relative z-10">Launch_Terminal</span>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                </motion.button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <EnterpriseFooter />

      <AuthOverlay 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
      />
    </div>
  );
}
