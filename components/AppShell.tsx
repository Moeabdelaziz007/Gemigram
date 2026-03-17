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
import { useSystemTelemetry } from '../hooks/useSystemTelemetry';

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const { user, login, logout } = useAuth();
  const [time, setTime] = useState(new Date());
  const pathname = usePathname();
  const { linkType } = useAetherStore();
  const telemetry = useSystemTelemetry();

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

  const isLandingPage = pathname === '/';
  const currentView = getCurrentView();

  const viewLabels: Record<string, string> = {
    home: 'Sovereign Core',
    workspace: 'Neural Workspace',
    hub: 'Neural Hub',
    settings: 'Config Matrix',
    forge: 'Gemi Forge',
    galaxy: 'Gemigalaxy'
  };

  // For landing page, we want a clean full-screen experience without the app sidebar/header
  if (isLandingPage) {
    return (
      <div className="min-h-screen w-full bg-black overflow-x-hidden">
        {children}
      </div>
    );
  }

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
        {/* Sovereign Intelligence Header */}
        <header className="h-14 md:h-16 px-4 md:px-8 flex items-center justify-between glass-medium border-b border-white/[0.05] z-[80] shrink-0">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gemigram-neon/10 border border-gemigram-neon/30 flex items-center justify-center">
                <AetherLogo size={14} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gemigram-neon leading-none">Gemigram</span>
                <span className="text-[8px] font-mono text-white/30 uppercase tracking-[0.1em]">OS_Sovereign.v3.0</span>
              </div>
            </div>

            <div className="h-6 w-[1px] bg-white/5 hidden lg:block" />

            {/* Smart Intelligence Tray */}
            <div className="hidden lg:flex items-center gap-6">
              <div className="flex items-center gap-2 group cursor-pointer">
                <Cloud className="w-3.5 h-3.5 text-blue-400/50 group-hover:text-blue-400 transition-colors" />
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-white/40 group-hover:text-white transition-colors">Weather</span>
                  <span className="text-[10px] font-mono font-bold text-white">
                    {telemetry.weather.temp}°C · {telemetry.weather.condition}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 group cursor-pointer border-l border-white/5 pl-6">
                <Activity className="w-3.5 h-3.5 text-gemigram-neon/50 group-hover:text-gemigram-neon transition-colors" />
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-white/40 group-hover:text-white transition-colors">Network</span>
                  <span className="text-[10px] font-mono font-bold text-gemigram-neon">{telemetry.latency}ms Latency</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 text-center hidden xl:flex flex-col items-center">
            <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.5em] mb-1">Active_Sector</span>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gemigram-neon animate-pulse" />
              <span className="text-xs font-black text-white uppercase tracking-[0.3em]">{viewLabels[currentView]}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-8">
            {/* System Tools */}
            <div className="flex items-center gap-4 border-r border-white/5 pr-6 hidden md:flex">
              <button className="relative p-2 group">
                <div className="absolute top-1 right-1 w-2 h-2 bg-gemigram-neon rounded-full border-2 border-bg-primary z-10" />
                <Signal className="w-4 h-4 text-white/30 group-hover:text-white transition-colors" />
              </button>
              <button className="p-2 group">
                <Activity className="w-4 h-4 text-white/30 group-hover:text-white transition-colors" />
              </button>
              <button className="p-2 group">
                <ThemeToggle />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-[11px] font-mono font-black tabular-nums text-white">
                  {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
                </span>
                <span className="text-[8px] font-mono font-bold text-white/20 uppercase tracking-widest leading-none">
                  {time.toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
              </div>
              
              <div className="relative group">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="h-10 w-10 rounded-xl bg-gradient-to-br from-gemigram-neon/20 to-transparent border border-gemigram-neon/30 p-0.5 relative cursor-pointer hover:border-gemigram-neon transition-colors overflow-hidden"
                >
                  <div className="w-full h-full rounded-[10px] overflow-hidden bg-black/40">
                    <img src={user?.photoURL || "/avatars/default.png"} alt="User" className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-gemigram-neon rounded-full border-2 border-bg-primary" />
                </motion.div>

                {/* Sovereign Profile HUD Overlay */}
                <div className="absolute top-full right-0 mt-4 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                  <div className="w-64 sovereign-glass border border-white/10 rounded-2xl p-6 shadow-2xl backdrop-blur-3xl">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-full border border-gemigram-neon/30 overflow-hidden bg-black p-0.5">
                        <img src={user?.photoURL || "/avatars/default.png"} alt="" className="w-full h-full rounded-full object-cover" />
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-xs font-black text-white truncate max-w-full">{user?.displayName || 'Anonymous Architect'}</span>
                        <span className="text-[9px] font-mono text-gemigram-neon/60 truncate uppercase">{user?.email || 'OFFLINE'}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <button className="w-full py-2.5 rounded-xl bg-white/5 border border-white/5 text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                        Nexus_Profile
                      </button>
                      <button 
                        onClick={async () => {
                          // Cinematic Terminate Sequence
                          document.body.style.filter = 'grayscale(1) brightness(0.5)';
                          document.body.style.transition = 'all 1s ease';
                          setTimeout(async () => {
                            await logout();
                            document.body.style.filter = '';
                          }, 1000);
                        }}
                        className="w-full py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-[9px] font-black uppercase tracking-widest text-red-400 hover:bg-red-500 hover:text-black transition-all flex items-center justify-center gap-2"
                      >
                        Terminate_Session
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
              <span className="text-[10px] font-bold text-white/80 tracking-[0.3em]">GEMIGRAM_HUD_V4</span>
              <span className="text-hud">SOVEREIGN_ENGINE_ACTIVE</span>
            </div>

            <div className="flex items-center gap-2 pl-5 border-l border-white/10">
              <Activity className="w-3 h-3 text-gemigram-neon animate-pulse" />
              <span className="text-hud text-gemigram-neon uppercase">Sovereign_Link_Stable</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
