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
    <div className="flex h-[100dvh] w-full bg-theme-primary text-white overflow-hidden selection:bg-gemigram-neon/30 font-sans">
      {/* Sovereing Sidebar (Desktop) / Sidebar (Mobile) */}
      <FloatingNav 
        currentView={currentView} 
        user={user}
        onLogin={login}
        onLogout={logout}
      />

      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* iOS-Style Neural Status Bar */}
        <header className="h-14 md:h-16 px-4 md:px-6 flex items-center justify-between aether-glass border-b border-white/[0.05] z-[80] shrink-0">
          <div className="flex items-center gap-2 md:gap-4">
            <div className="flex items-center gap-2 md:hidden">
              <AetherLogo size={16} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gemigram-neon">Gemigram</span>
            </div>
            <div className="flex items-center gap-2">
              {linkType === 'bridge' ? (
                <Zap className="w-2.5 h-2.5 text-gemigram-neon animate-pulse" />
              ) : (
                <Globe className="w-2.5 h-2.5 text-white/40" />
              )}
              <span className={`text-[10px] md:text-[8px] font-mono font-bold uppercase tracking-widest text-nowrap hidden sm:inline ${linkType === 'bridge' ? 'text-gemigram-neon' : 'text-white/40'}`}>
                LINK::{linkType === 'bridge' ? 'LOCAL_SPINE' : 'CLOUD_DIRECT'}
              </span>
            </div>
          </div>

          <div className="flex-1 text-center flex flex-col items-center">
            <span className="text-hud">Sector</span>
            <span className="text-xs md:text-[13px] font-bold text-white tracking-widest">{viewLabels[currentView]}</span>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <ThemeToggle />
            
            <div className="h-4 w-[1px] bg-white/10 hidden md:block" />
            
            <div className="flex items-center gap-2 text-white/40 hidden md:flex">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <Battery className="w-3 h-3 rotate-90" />
            </div>
            
            <div className="h-4 w-[1px] bg-white/10 hidden md:block" />
            
            <span className="text-xs md:text-[12px] font-mono font-bold tabular-nums text-gemigram-neon">
              {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
            </span>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 w-full relative overflow-hidden z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full overflow-y-auto overflow-x-hidden custom-scrollbar pb-10"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Footer HUD (Desktop Only) */}
        <footer className="hidden xl:flex absolute bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
          <div className="px-6 py-2.5 rounded-full glass-medium border border-white/5 flex items-center gap-5 pointer-events-auto">
            <div className="flex items-center gap-2 pr-5 border-r border-white/10">
              <span className="text-hud">INFRA::</span>
              <div className="flex items-center gap-3">
                <Flame className="w-3.5 h-3.5 text-orange-500/50" />
                <Sparkles className="w-3.5 h-3.5 text-gemigram-neon/50" />
                <Cloud className="w-3.5 h-3.5 text-blue-400/50" />
              </div>
            </div>
            
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-bold text-white/80 tracking-[0.3em]">AETHER HUD V3</span>
              <span className="text-hud">GENESIS_RUNTIME_ACTIVE</span>
            </div>

            <div className="flex items-center gap-2 pl-5 border-l border-white/10">
              <Activity className="w-3 h-3 text-gemigram-neon animate-pulse" />
              <span className="text-hud text-gemigram-neon uppercase">Sovereign_Link_Stable</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
    </div>
  );
}
