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
      <EnterpriseHeader onLogin={() => setIsAuthOpen(true)} />
      
      <main className="relative z-10">
        <EnterpriseHero onLogin={() => setIsAuthOpen(true)} />
        
        {/* Industry Trust Bar */}
        <section className="py-24 border-y border-gemigram-neon/10 bg-black/50 relative overflow-hidden">
           <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
           <div className="container mx-auto px-6 flex flex-wrap justify-between items-center gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
             <div className="text-2xl font-black tracking-[0.6em] text-white uppercase italic hover:text-gemigram-neon transition-colors cursor-default">ORACLE.NODE</div>
             <div className="text-2xl font-black tracking-[0.6em] text-white uppercase italic hover:text-gemigram-neon transition-colors cursor-default">NEXUS.SPINE</div>
             <div className="text-2xl font-black tracking-[0.6em] text-white uppercase italic hover:text-gemigram-neon transition-colors cursor-default">LATTICE.NEON</div>
             <div className="text-2xl font-black tracking-[0.6em] text-white uppercase italic hover:text-gemigram-neon transition-colors cursor-default">VERTEX.CARBON</div>
          </div>
        </section>

        <BentoFeatures />
        
        {/* MCP & API Marketplace Integration Showcase */}
        <section className="py-32 relative bg-carbon-black/50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-5xl md:text-7xl font-black mb-6 tracking-tighter text-white"
              >
                Limitless <span className="text-neon-green">Integrations</span>
              </motion.h2>
              <p className="text-xl text-white/40 max-w-3xl mx-auto">
                Connect to GitHub, access 20,000+ APIs, and integrate with external models via MCP protocol
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {/* MCP Integration Card */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="cyber-panel p-8 rounded-3xl border border-neon-green/20 bg-gradient-to-br from-neon-green/5 to-transparent"
              >
                <div className="flex items-center gap-4 mb-6">
                  <Package className="w-12 h-12 text-neon-green" />
                  <h3 className="text-2xl font-bold text-white">Model Context Protocol</h3>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-neon-green mt-0.5" />
                    <div>
                      <div className="text-white font-semibold">GitHub Integration</div>
                      <div className="text-white/40 text-sm">Repository management, PR reviews, Issues, Actions</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-neon-green mt-0.5" />
                    <div>
                      <div className="text-white font-semibold">MCP Marketplace</div>
                      <div className="text-white/40 text-sm">Discover & install MCP servers</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-neon-green mt-0.5" />
                    <div>
                      <div className="text-white font-semibold">JSON-RPC 2.0</div>
                      <div className="text-white/40 text-sm">Standard protocol for AI connections</div>
                    </div>
                  </li>
                </ul>
              </motion.div>
              
              {/* API Marketplace Card */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="cyber-panel p-8 rounded-3xl border border-neon-blue/20 bg-gradient-to-br from-neon-blue/5 to-transparent"
              >
                <div className="flex items-center gap-4 mb-6">
                  <Globe className="w-12 h-12 text-neon-blue" />
                  <h3 className="text-2xl font-bold text-white">API Marketplace</h3>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-neon-blue mt-0.5" />
                    <div>
                      <div className="text-white font-semibold">20,000+ APIs</div>
                      <div className="text-white/40 text-sm">RapidAPI & APILayer integration</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-neon-blue mt-0.5" />
                    <div>
                      <div className="text-white font-semibold">Secure Credentials</div>
                      <div className="text-white/40 text-sm">Encrypted storage & OAuth2</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-neon-blue mt-0.5" />
                    <div>
                      <div className="text-white font-semibold">Usage Tracking</div>
                      <div className="text-white/40 text-sm">Real-time monitoring & limits</div>
                    </div>
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Final Interactive CTA Section */}
        <section className="py-40 relative">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto sovereign-glass p-20 text-center relative overflow-hidden group">
              <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
              <div className="absolute -top-24 -left-24 w-64 h-64 bg-gemigram-neon/10 blur-[100px] rounded-full group-hover:bg-gemigram-neon/20 transition-all duration-1000" />
              
              <h2 className="text-5xl md:text-8xl font-black mb-10 tracking-tighter uppercase relative z-10 leading-none">
                Ready for <span className="text-gemigram-neon animate-pulse">Sovereignty?</span>
              </h2>
              <p className="text-white/40 text-xl mb-16 max-w-2xl mx-auto font-black uppercase tracking-[0.2em] relative z-10">
                Join the mainnet and initialize your first neural entity in seconds. <br />
                Experience Zero-Friction intelligence.
              </p>
              <div className="relative z-10">
                <motion.button
                  onClick={() => setIsAuthOpen(true)}
                  whileHover={{ scale: 1.05, boxShadow: '0 0 80px rgba(57,255,20,0.6)' }}
                  whileTap={{ scale: 0.95 }}
                  className="px-24 py-8 bg-gemigram-neon text-black rounded-full text-2xl font-black uppercase tracking-[0.3em] shadow-[0_0_50px_rgba(57,255,20,0.4)] transition-all"
                >
                  Launch_Terminal
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
