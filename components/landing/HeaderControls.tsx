'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Bell, Cloud, History, Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { BRAND } from '@/lib/constants/branding';
import { LandingPrimaryAction } from './LandingPrimaryAction';

interface HeaderLink {
  name: string;
  href: string;
}

export function LandingHeaderControls({ navLinks }: { navLinks: HeaderLink[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const timeLabel = useMemo(
    () =>
      new Intl.DateTimeFormat([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).format(new Date()),
    []
  );

  return (
    <>
      <div className="hidden lg:flex items-center gap-8 border-x border-white/5 px-10 mx-6">
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[12px] font-mono font-black tabular-nums text-white">{timeLabel}</span>
            <span className="text-[8px] font-mono font-black text-white/20 uppercase tracking-widest leading-none">Live</span>
          </div>
          <div className="h-4 w-[1px] bg-white/10" />
          <div className="flex items-center gap-2 cursor-default">
            <Cloud size={14} className="text-gemigram-neon/40" />
            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">24°C_NYC</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-white/20">
          <button className="hover:text-gemigram-neon transition-colors" aria-label="Notifications">
            <Bell size={14} />
          </button>
          <button className="hover:text-gemigram-neon transition-colors" aria-label="History">
            <History size={14} />
          </button>
        </div>

        <div className="flex items-center gap-2 bg-gemigram-neon/5 border border-gemigram-neon/20 px-4 py-1.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-gemigram-neon animate-pulse shadow-[0_0_8px_rgba(57,255,20,0.5)]" />
          <span className="text-[9px] font-black text-gemigram-neon uppercase tracking-[0.2em]">{`${BRAND.product.name}_Pulse_Active`}</span>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-8">
        <LandingPrimaryAction label="Access_Node" className="text-[11px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-white transition-all hover:translate-y-[-1px]" />
        <LandingPrimaryAction className="px-8 py-3 bg-gemigram-neon/10 border border-gemigram-neon text-gemigram-neon rounded-full text-[10px] font-black tracking-[0.3em] uppercase hover:bg-gemigram-neon hover:text-black transition-all">
          Initialize_Admin
        </LandingPrimaryAction>
      </div>

      <button className="md:hidden text-gemigram-neon/70" onClick={() => setIsOpen((value) => !value)} aria-label="Toggle menu">
        {isOpen ? <X /> : <Menu />}
      </button>

      {isOpen && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="absolute top-20 left-0 right-0 cyber-panel p-8 flex flex-col gap-6 md:hidden">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} onClick={() => setIsOpen(false)} className="text-sm font-bold uppercase tracking-widest text-white/70">
              {link.name}
            </Link>
          ))}
          <LandingPrimaryAction className="mt-4 px-8 py-4 cyber-accent-button rounded-xl font-black uppercase tracking-widest">
            Terminal Access
          </LandingPrimaryAction>
        </motion.div>
      )}
    </>
  );
}
