'use client';

import React from 'react';
import { Fingerprint, Github, Twitter, Linkedin } from 'lucide-react';
import Link from 'next/link';
import { BRAND } from '@/lib/constants/branding';

export function EnterpriseFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-gemigram-neon/10 bg-black pb-20 pt-16 sm:pt-20 lg:pt-24 xl:pt-28">
      <div className="pointer-events-none absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.05]" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-[420px] w-[420px] rounded-full bg-gemigram-neon/5 blur-[150px]" />

      <div className="page-shell relative z-10 page-stack">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4 md:gap-12 lg:gap-16">
          <div className="md:col-span-1">
            <Link href="/" className="group mb-8 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-gemigram-neon/20 bg-gemigram-neon/10 transition-all duration-500 group-hover:bg-gemigram-neon group-hover:text-black">
                <Fingerprint className="h-7 w-7" />
              </div>
              <span className="text-3xl font-black uppercase tracking-tighter text-white">
                {BRAND.product.name.slice(0, 4)}<span className="text-gemigram-neon">{BRAND.product.name.slice(4)}</span>
              </span>
            </Link>
            <p className="mb-8 text-[11px] font-black uppercase leading-relaxed tracking-[0.2em] text-white/40 sm:tracking-[0.3em]">
              {BRAND.product.tagline}.
              <br />
              Carbon secure. Neon powered.
            </p>
            <div className="flex gap-3 sm:gap-4">
              {[Github, Twitter, Linkedin].map((Icon, i) => (
                <Link key={i} href="#" className="group flex h-11 w-11 items-center justify-center rounded-xl border border-white/5 text-white/20 transition-all hover:border-gemigram-neon/50 hover:bg-gemigram-neon/5 hover:text-gemigram-neon sm:h-12 sm:w-12">
                  <Icon size={18} className="transition-transform group-hover:scale-110" />
                </Link>
              ))}
            </div>
          </div>

          {[
            { title: 'Framework', links: ['Neural Core', 'Synergy SDK', 'Vertex Bridge', 'Carbon Logic'] },
            { title: 'Network', links: ['Marketplace', 'Developers', 'Enterprise', 'Mainnet Status'] },
            { title: 'Governance', links: ['Neural Protocol', 'Data Sovereignty', 'Compliance', 'Security Audit'] },
          ].map((col, idx) => (
            <div key={idx}>
              <h4 className="mb-6 text-[10px] font-black uppercase tracking-[0.35em] text-white/80 sm:mb-8 sm:tracking-[0.4em]">{col.title}</h4>
              <ul className="space-y-4 sm:space-y-5 md:space-y-6">
                {col.links.map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-sm font-bold uppercase tracking-widest text-white/20 transition-colors hover:text-gemigram-neon">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-6 border-t border-white/5 pt-8 sm:pt-10 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-8">
            <div className="flex flex-col gap-2">
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-white/20 sm:tracking-[0.4em]">© 2026 {BRAND.product.platformName}. Developed by Moe_Abdelaziz.</p>
              <p className="text-[8px] font-mono uppercase tracking-[0.2em] text-white/10">Architecture_v3.2_Omega_Core</p>
            </div>
            <div className="flex w-fit items-center gap-3 rounded-full border border-gemigram-neon/10 bg-gemigram-neon/5 px-5 py-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-gemigram-neon shadow-[0_0_15px_rgba(57,255,20,0.8)]" />
              <span className="text-[10px] font-black uppercase tracking-[0.28em] text-gemigram-neon sm:tracking-[0.4em]">Sector_Mainnet_Stable</span>
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6 md:gap-8">
            <Link href="https://github.com/Moeabdelaziz007/Gemigram" target="_blank" className="w-fit rounded-lg border border-white/5 px-4 py-2 text-[9px] font-black uppercase tracking-[0.35em] text-white/20 transition-colors hover:text-white">
              Source_Code::v2.4.0
            </Link>
            <div className="hidden h-6 w-px bg-white/5 sm:block" />
            <Link href="/privacy" className="text-[9px] font-black uppercase tracking-[0.35em] text-white/20 transition-colors hover:text-white">
              Privacy_Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
