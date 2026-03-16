'use client';

import React from 'react';
import { Fingerprint, Github, Twitter, Linkedin } from 'lucide-react';
import Link from 'next/link';

export function EnterpriseFooter() {
  return (
    <footer className="pt-32 pb-16 bg-carbon-black border-t border-white/[0.03] relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-10 group">
              <Fingerprint className="w-10 h-10 text-gemigram-neon" />
              <span className="text-2xl font-black tracking-tight text-white uppercase">
                Gemi<span className="text-gemigram-neon">gram</span>
              </span>
            </Link>
            <p className="text-white/20 text-xs font-bold leading-relaxed mb-10 uppercase tracking-widest">
              Sovereign neural intelligence. <br />
              Carbon secure. Neon powered.
            </p>
            <div className="flex gap-4">
              {[Github, Twitter, Linkedin].map((Icon, i) => (
                <Link key={i} href="#" className="p-3 cyber-panel rounded-2xl text-white/20 hover:text-gemigram-neon hover:bg-gemigram-neon/5 transition-all">
                  <Icon size={18} />
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

        <div className="pt-12 border-t border-white/[0.02] flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-12">
            <p className="text-[9px] font-black uppercase tracking-[0.5em] text-white/20">
              © 2026 Gemigram AIOS. Developed by Moe_Abdelaziz.
            </p>
            <div className="hidden md:flex items-center gap-4">
               <span className="w-1.5 h-1.5 rounded-full bg-gemigram-neon shadow-[0_0_10px_rgba(16,255,135,0.5)]" />
               <span className="text-[9px] font-black uppercase tracking-[0.5em] text-gemigram-neon">Sector_Mainnet_Stable</span>
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
