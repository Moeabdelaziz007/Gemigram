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
    <div className="relative min-h-screen bg-carbon-black selection:bg-carbon-neon/20 overflow-x-hidden">
      <HeroBackground />
      
      <EnterpriseHeader onLogin={() => setIsAuthOpen(true)} />
      
      <main className="relative z-10">
        <EnterpriseHero onLogin={() => setIsAuthOpen(true)} />
        
        {/* Industry Trust Bar */}
        <section className="py-24 border-y border-white/[0.03] bg-carbon-fiber/10 relative overflow-hidden">
           <div className="absolute inset-0 opacity-[0.01] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
           <div className="container mx-auto px-6 flex flex-wrap justify-between items-center gap-12 opacity-20 grayscale hover:grayscale-0 transition-all duration-700">
             <div className="text-xl font-black tracking-[0.4em] text-white uppercase italic">ORACLE.NODE</div>
             <div className="text-xl font-black tracking-[0.4em] text-white uppercase italic">NEXUS.SPINE</div>
             <div className="text-xl font-black tracking-[0.4em] text-white uppercase italic">LATTICE.NEON</div>
             <div className="text-xl font-black tracking-[0.4em] text-white uppercase italic">VERTEX.CARBON</div>
          </div>
        </section>

        <BentoFeatures />
        
        {/* Final Interactive CTA Section */}
        <section className="py-32 relative">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto cyber-glass p-16 rounded-[3rem] border-carbon-neon/10 text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
              <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter uppercase relative z-10">
                Ready for <span className="text-carbon-neon">Sovereignty?</span>
              </h2>
              <p className="text-white/30 text-lg mb-12 max-w-xl mx-auto font-medium relative z-10">
                Join the mainnet and initialize your first neural entity in seconds. 
                Experience Zero-Friction intelligence.
              </p>
              <div className="relative z-10">
                <motion.button
                  onClick={() => setIsAuthOpen(true)}
                  whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(57,255,20,0.15)' }}
                  whileTap={{ scale: 0.95 }}
                  className="px-16 py-6 cyber-accent-button rounded-2xl text-xl font-black uppercase tracking-widest"
                >
                  Launch Terminal
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
