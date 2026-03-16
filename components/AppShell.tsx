'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FloatingNav } from './ui/FloatingNav';
import { Flame, Sparkles, Cloud, Wifi, Battery, Signal, Zap, Activity, Globe } from 'lucide-react';
import { AetherLogo } from './AetherLogo';
import { ProjectSwitcher } from './ui/ProjectSwitcher';
import { useAuth } from './Providers';
import { usePathname } from 'next/navigation';
import { useAetherStore } from '../lib/store/useAetherStore';
import { ThemeToggle } from './ThemeToggle';

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const { user, login, logout } = useAuth();
  const [time, setTime] = useState(new Date());
  const pathname = usePathname();
  const { linkType } = useAetherStore();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getCurrentView = () => {
    const path = pathname.toLowerCase();
    if (path === '/' || path === '/dashboard') return 'home';
    if (path.includes('/workspace')) return 'workspace';
    if (path.includes('/hub')) return 'hub';
    if (path.includes('/settings')) return 'settings';
    if (path.includes('/forge')) return 'forge';
    if (path.includes('/galaxy')) return 'galaxy';
    return 'home';
  };

  const currentView = getCurrentView();

  const viewLabels: Record<string, string> = {
    home: 'Sovereign Core',
    workspace: 'Neural Workspace',
    hub: 'Context Hub',
    settings: 'Config Matrix',
    forge: 'Aether Forge',
    galaxy: 'Aether Galaxy'
  };

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-carbon-black text-white overflow-hidden selection:bg-aether-neon/30 font-sans">
      {/* iOS-Style Neural Status Bar */}
      <header className="fixed top-0 left-0 w-full z-[100] px-4 md:px-6 py-2 md:py-3 flex items-center justify-between aether-glass border-b border-white/[0.05]">
        <div className="flex items-center gap-2 md:gap-4">
          <div className="flex items-center gap-2">
            <AetherLogo size={16} />
            <span className="text-[10px] md:text-[8px] font-black uppercase tracking-[0.2em] text-aether-neon">Gemigram</span>
          </div>
          <div className="h-3 md:h-4 w-[1px] bg-white/10 hidden sm:block" />
          <div className="flex items-center gap-2">
            {linkType === 'bridge' ? (
              <Zap className="w-2.5 h-2.5 text-aether-neon animate-pulse" />
            ) : (
              <Globe className="w-2.5 h-2.5 text-white/40" />
            )}
            <span className={`text-[10px] md:text-[8px] font-mono font-bold uppercase tracking-widest text-nowrap hidden sm:inline ${linkType === 'bridge' ? 'text-aether-neon' : 'text-white/40'}`}>
              LINK::{linkType === 'bridge' ? 'LOCAL_SPINE' : 'CLOUD_DIRECT'}
            </span>
          </div>
        </div>

        <div className="flex-1 text-center hidden sm:flex flex-col items-center">
          <span className="text-hud">Sector</span>
          <span className="text-xs md:text-[13px] font-bold text-white tracking-widest">{viewLabels[currentView]}</span>
        </div>

        <div className="flex items-center gap-3 md:gap-6">
          {/* Theme Toggle */}
          <ThemeToggle />
          
          <div className="h-3 md:h-4 w-[1px] bg-white/10 hidden md:block" />
          
          {/* System Status Icons */}
          <div className="flex items-center gap-1 md:gap-2 text-white/40 hidden md:flex">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <Battery className="w-3 h-3 rotate-90" />
          </div>
          
          <div className="h-3 md:h-4 w-[1px] bg-white/10 hidden md:block" />
          
          {/* Clock */}
          <span className="text-xs md:text-[12px] font-mono font-bold tabular-nums text-aether-neon">
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
          </span>
        </div>
      </header>

      {/* Floating Dock Navigation */}
      <FloatingNav 
        currentView={currentView} 
        user={user}
        onLogin={login}
        onLogout={logout}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full h-full relative overflow-hidden z-10 pt-14 md:pt-16 text-white">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full overflow-y-auto overflow-x-hidden custom-scrollbar pb-24 md:pb-32"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer - Professional HUD Branding */}
      <footer className="hidden md:flex fixed bottom-0 left-0 w-full py-6 z-50 pointer-events-none justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="px-6 py-2.5 rounded-full aether-glass border border-white/5 flex items-center gap-5 pointer-events-auto">
            <div className="flex items-center gap-2 pr-5 border-r border-white/10">
              <span className="text-hud">INFRA::</span>
              <div className="flex items-center gap-3">
                <Flame className="w-3.5 h-3.5 text-orange-500/50" />
                <Sparkles className="w-3.5 h-3.5 text-aether-neon/50" />
                <Cloud className="w-3.5 h-3.5 text-blue-400/50" />
              </div>
            </div>
            
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-bold text-white/80 tracking-[0.3em]">AETHER HUD V3</span>
              <span className="text-hud">GENESIS_RUNTIME_ACTIVE</span>
            </div>

            <div className="flex items-center gap-2 pl-5 border-l border-white/10">
              <Activity className="w-3 h-3 text-aether-neon animate-pulse" />
              <span className="text-hud text-aether-neon">SOVEREIGN_LINK_11/10</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
