'use client';

import React from 'react';
import { Fingerprint, Github, Twitter, Linkedin } from 'lucide-react';
import Link from 'next/link';
import { BRAND } from '@/lib/constants/branding';

export function EnterpriseFooter() {
  return (
    <footer className="pt-40 pb-20 bg-black border-t border-gemigram-neon/10 relative overflow-hidden">
      {/* Background Matrix Effect */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gemigram-neon/5 blur-[150px] rounded-full" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-4 mb-8 group">
              <div className="w-12 h-12 rounded-xl bg-gemigram-neon/10 border border-gemigram-neon/20 flex items-center justify-center group-hover:bg-gemigram-neon group-hover:text-black transition-all duration-500">
                <Fingerprint className="w-7 h-7" />
              </div>
              <span className="text-3xl font-black tracking-tighter text-white uppercase">
                {BRAND.product.name.slice(0, 4)}<span className="text-gemigram-neon">{BRAND.product.name.slice(4)}</span>
              </span>
            </Link>
            <p className="text-white/40 text-[11px] font-black leading-relaxed mb-10 uppercase tracking-[0.3em]">
              {BRAND.product.tagline}. <br />
              Carbon secure. Neon powered.
            </p>
            <div className="flex gap-4">
              {[Github, Twitter, Linkedin].map((Icon, i) => (
                <Link key={i} href="#" className="w-12 h-12 flex items-center justify-center border border-white/5 rounded-xl text-white/20 hover:text-gemigram-neon hover:border-gemigram-neon/50 hover:bg-gemigram-neon/5 transition-all group">
                  <Icon size={20} className="group-hover:scale-110 transition-transform" />
                </Link>
              ))}
            </div>
          </div>

          {[
            { title: 'Framework', links: ['Neural Core', 'Synergy SDK', 'Vertex Bridge', 'Carbon Logic'] },
            { title: 'Network', links: ['Marketplace', 'Developers', 'Enterprise', 'Mainnet Status'] },
            { title: 'Governance', links: ['Neural Protocol', 'Data Sovereignty', 'Compliance', 'Security Audit'] }
          ].map((col, idx) => (
            <div key={idx}>
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] mb-10 text-white/80">{col.title}</h4>
              <ul className="space-y-6">
                {col.links.map(item => (
                  <li key={item}>
                    <Link href="#" className="text-sm font-bold text-white/20 hover:text-gemigram-neon transition-colors uppercase tracking-widest">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex flex-col gap-2">
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">
                © 2026 {BRAND.product.platformName}. Developed by Moe_Abdelaziz.
              </p>
              <p className="text-[8px] font-mono text-white/10 uppercase tracking-[0.2em]">Architecture_v3.2_Omega_Core</p>
            </div>
            <div className="flex items-center gap-4 px-6 py-2 rounded-full border border-gemigram-neon/10 bg-gemigram-neon/5">
               <span className="w-2 h-2 rounded-full bg-gemigram-neon shadow-[0_0_15px_rgba(57,255,20,0.8)] animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gemigram-neon">Sector_Mainnet_Stable</span>
            </div>
          </div>
          
          <div className="flex items-center gap-8">
            <Link href="https://github.com/Moeabdelaziz007/Gemigram" target="_blank" className="text-[9px] font-black uppercase tracking-[0.5em] text-white/20 hover:text-white transition-colors border border-white/5 px-4 py-2 rounded-lg">
              Source_Code::v2.4.0
            </Link>
            <div className="h-6 w-px bg-white/5" />
            <Link href="/privacy" className="text-[9px] font-black uppercase tracking-[0.5em] text-white/20 hover:text-white">
              Privacy_Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
