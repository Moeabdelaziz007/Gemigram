'use client';

import React, { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Fingerprint, Menu, X, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export function EnterpriseHeader({ onLogin }: { onLogin: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const { scrollY } = useScroll();
  
  const headerBg = useTransform(
    scrollY,
    [0, 50],
    ['rgba(5, 5, 5, 0)', 'rgba(5, 5, 5, 0.85)']
  );
  
  const headerBorder = useTransform(
    scrollY,
    [0, 50],
    ['rgba(255, 255, 255, 0)', 'rgba(57, 255, 20, 0.1)']
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
        <Link href="/" className="flex items-center gap-3 group">
          <Fingerprint className="w-8 h-8 text-carbon-neon" />
          <span className="text-xl font-bold tracking-tight text-white uppercase">
            Gemigram
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-carbon-neon transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-6">
          <button 
            onClick={onLogin}
            className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 hover:text-white transition-colors"
          >
            Access Node
          </button>
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(57,255,20,0.1)' }}
            whileTap={{ scale: 0.98 }}
            onClick={onLogin}
            className="px-6 py-2 cyber-button rounded-full text-[10px] font-black text-white/80 tracking-[0.2em] uppercase"
          >
            Initialize Admin
          </motion.button>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-carbon-neon/70"
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
