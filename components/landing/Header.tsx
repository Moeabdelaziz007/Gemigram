'use client';

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Fingerprint, Menu, X, Cloud, Bell, History } from 'lucide-react';
import Link from 'next/link';
import { BRAND } from '@/lib/constants/branding';

export function EnterpriseHeader({ onLogin }: { onLogin: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const { scrollY } = useScroll();
  const headerBg = useTransform(scrollY, [0, 50], ['rgba(5, 5, 5, 0)', 'rgba(5, 5, 5, 0.85)']);
  const headerBorder = useTransform(scrollY, [0, 50], ['rgba(255, 255, 255, 0)', 'rgba(57, 255, 20, 0.2)']);

  const navLinks = [
    { name: 'Neural Hub', href: '/hub' },
    { name: 'Architecture', href: '#features' },
    { name: 'Security', href: '#security' },
    { name: 'Enterprise', href: '#enterprise' },
  ];

  return (
    <motion.header
      style={{ backgroundColor: headerBg, borderBottom: '1px solid', borderColor: headerBorder, backdropFilter: 'blur(16px)' }}
      className="safe-top safe-x fixed left-0 right-0 top-0 z-[100]"
    >
      <div className="page-shell flex min-h-[4.5rem] items-center justify-between gap-4 py-3">
        <Link href="/" className="group relative flex min-w-0 items-center gap-3">
          <div className="relative">
            <Fingerprint className="h-8 w-8 text-gemigram-neon transition-transform duration-500 group-hover:scale-110 sm:h-10 sm:w-10" />
            <motion.div className="absolute inset-0 rounded-full bg-gemigram-neon/20 blur-lg" animate={{ opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 2, repeat: Infinity }} />
          </div>
          <span className="truncate text-lg font-black uppercase tracking-[-0.05em] text-white transition-all duration-500 group-hover:tracking-wide sm:text-2xl">
            {BRAND.product.name.toUpperCase()}<span className="animate-pulse text-gemigram-neon">_</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 xl:flex">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 transition-all hover:scale-105 hover:text-gemigram-neon">
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="mx-2 hidden items-center gap-6 border-x border-white/5 px-6 lg:flex">
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-[12px] font-mono font-black tabular-nums text-white">
                {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
              </span>
              <span className="text-[8px] font-mono font-black uppercase tracking-widest leading-none text-white/20">
                {time.toLocaleDateString([], { day: '2-digit', month: 'short' })}
              </span>
            </div>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex cursor-default items-center gap-2">
              <Cloud size={14} className="text-gemigram-neon/40" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white/40">24°C_NYC</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-white/20">
            <button className="transition-colors hover:text-gemigram-neon"><Bell size={14} /></button>
            <button className="transition-colors hover:text-gemigram-neon"><History size={14} /></button>
          </div>
        </div>

        <div className="hidden items-center gap-4 md:flex lg:gap-6">
          <button onClick={onLogin} className="text-[11px] font-black uppercase tracking-[0.24em] text-white/30 transition-all hover:-translate-y-[1px] hover:text-white">
            Access_Node
          </button>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(57,255,20,0.3)' }}
            whileTap={{ scale: 0.95 }}
            onClick={onLogin}
            className="rounded-full border border-gemigram-neon bg-gemigram-neon/10 px-5 py-3 text-[10px] font-black uppercase tracking-[0.24em] text-gemigram-neon transition-all hover:bg-gemigram-neon hover:text-black sm:px-8"
          >
            Initialize_Admin
          </motion.button>
        </div>

        <button className="text-gemigram-neon/70 md:hidden" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle navigation menu">
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {isOpen && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="border-t border-white/10 bg-black/90 px-4 pb-4 pt-3 backdrop-blur-xl md:hidden">
          <div className="page-shell flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} onClick={() => setIsOpen(false)} className="rounded-xl border border-white/10 px-4 py-3 text-sm font-bold uppercase tracking-widest text-white/70">
                {link.name}
              </Link>
            ))}
            <button onClick={onLogin} className="btn-primary mt-2 w-full">Terminal Access</button>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
