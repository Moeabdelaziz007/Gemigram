'use client';

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Fingerprint, Menu, X, Cloud, Activity, Bell, History } from 'lucide-react';
import Link from 'next/link';

export function EnterpriseHeader({ onLogin }: { onLogin: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  const { scrollY } = useScroll();
  
  const headerBg = useTransform(
    scrollY,
    [0, 50],
    ['rgba(5, 5, 5, 0)', 'rgba(5, 5, 5, 0.85)']
  );
  
  const headerBorder = useTransform(
    scrollY,
    [0, 50],
    ['rgba(255, 255, 255, 0)', 'rgba(57, 255, 20, 0.2)']
  );

  const navLinks = [
    { name: 'Neural Hub', href: '/hub' },
    { name: 'Architecture', href: '#features' },
    { name: 'Security', href: '#security' },
    { name: 'Enterprise', href: '#enterprise' },
  ];

  return (
    <motion.header
      style={{ 
        backgroundColor: headerBg,
        borderBottom: `1px solid`,
        borderColor: headerBorder,
        backdropFilter: 'blur(16px)'
      }}
      className="fixed top-0 left-0 right-0 z-[100] h-20 flex items-center"
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group relative">
          <div className="relative">
            <Fingerprint className="w-10 h-10 text-gemigram-neon group-hover:scale-110 transition-transform duration-500" />
            <motion.div 
              className="absolute inset-0 bg-gemigram-neon/20 blur-lg rounded-full"
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          <span className="text-2xl font-black tracking-[-0.05em] text-white uppercase group-hover:tracking-wider transition-all duration-500">
            GEMIGRAM<span className="text-gemigram-neon animate-pulse">_</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden xl:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-gemigram-neon transition-all hover:scale-105"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Smart Telemetry Tray */}
        <div className="hidden lg:flex items-center gap-8 border-x border-white/5 px-10 mx-6">
           <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-[12px] font-mono font-black tabular-nums text-white">
                  {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
                </span>
                <span className="text-[8px] font-mono font-black text-white/20 uppercase tracking-widest leading-none">
                  {time.toLocaleDateString([], { day: '2-digit', month: 'short' })}
                </span>
              </div>
              <div className="h-4 w-[1px] bg-white/10" />
              <div className="flex items-center gap-2 group cursor-default">
                <Cloud size={14} className="text-gemigram-neon/40" />
                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">24°C_NYC</span>
              </div>
           </div>
           
           <div className="flex items-center gap-4 text-white/20">
              <button className="hover:text-gemigram-neon transition-colors"><Bell size={14} /></button>
              <button className="hover:text-gemigram-neon transition-colors"><History size={14} /></button>
           </div>

           <div className="flex items-center gap-2 bg-gemigram-neon/5 border border-gemigram-neon/20 px-4 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-gemigram-neon animate-pulse shadow-[0_0_8px_rgba(57,255,20,0.5)]" />
              <span className="text-[9px] font-black text-gemigram-neon uppercase tracking-[0.2em]">Neural_Pulse_Active</span>
           </div>
        </div>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-8">
          <button 
            onClick={onLogin}
            className="text-[11px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-white transition-all hover:translate-y-[-1px]"
          >
            Access_Node
          </button>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(57,255,20,0.3)' }}
            whileTap={{ scale: 0.95 }}
            onClick={onLogin}
            className="px-8 py-3 bg-gemigram-neon/10 border border-gemigram-neon text-gemigram-neon rounded-full text-[10px] font-black tracking-[0.3em] uppercase hover:bg-gemigram-neon hover:text-black transition-all"
          >
            Initialize_Admin
          </motion.button>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-gemigram-neon/70"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-20 left-0 right-0 cyber-panel p-8 flex flex-col gap-6 md:hidden"
        >
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-sm font-bold uppercase tracking-widest text-white/70"
            >
              {link.name}
            </Link>
          ))}
          <button 
            onClick={onLogin}
            className="mt-4 px-8 py-4 cyber-accent-button rounded-xl font-black uppercase tracking-widest"
          >
            Terminal Access
          </button>
        </motion.div>
      )}
    </motion.header>
  );
}
