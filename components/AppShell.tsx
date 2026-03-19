'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FloatingNav } from './ui/FloatingNav';
import { Flame, Sparkles, Cloud, Signal, Activity } from 'lucide-react';
import { GemigramLogo } from './GemigramLogo';
import { useAuth } from './Providers';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';
import { useSystemTelemetry } from '../hooks/useSystemTelemetry';
import { BRAND } from '@/lib/constants/branding';
import { useVisualTier } from '@/lib/hooks/useVisualTier';
import { useGemigramStore } from '../lib/store/useGemigramStore';

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const { user, login, logout } = useAuth();
  const [time, setTime] = useState(new Date());
  const pathname = usePathname();
  const { tier, allowMotion, allowAmbientMotion, isMobile } = useVisualTier();
  const telemetry = useSystemTelemetry();
  const { linkType } = useGemigramStore();

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
    if (path.includes('/marketplace')) return 'marketplace';
    if (path.includes('/about')) return 'about';
    return 'home';
  };

  const isLandingPage = pathname === '/';
  const currentView = getCurrentView();
  const viewLabels: Record<string, string> = BRAND.labels.views;
  const shellGlassClass = isMobile ? 'glass-subtle' : 'glass-strong';

  if (isLandingPage) {
    return <div className="min-h-screen w-full overflow-x-hidden bg-black">{children}</div>;
  }

  return (
    <div 
      className="safe-x flex h-[100dvh] w-full overflow-hidden bg-theme-primary font-sans text-white selection:bg-gemigram-neon/30"
      data-visual-tier={tier}
    >
      <FloatingNav currentView={currentView} user={user} onLogin={login} onLogout={logout} />

      <div className="relative flex min-w-0 flex-1 flex-col">
        <header className={`safe-top z-[80] shrink-0 border-b border-gemigram-neon/[0.06] px-4 py-3 sm:px-6 md:px-8 ${shellGlassClass}`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-gemigram-neon/30 bg-gemigram-neon/10">
                  <GemigramLogo size={14} />
                </div>
                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-[10px] font-black uppercase tracking-[0.2em] text-gemigram-neon leading-none">{BRAND.product.name}</span>
                  <span className="truncate text-[8px] font-mono uppercase tracking-[0.1em] text-white/30">{BRAND.product.systemVersion}</span>
                </div>
              </div>

              <div className="hidden h-6 w-px bg-white/5 lg:block" />

              <div className="hidden items-center gap-5 lg:flex">
                <div className="group flex cursor-pointer items-center gap-2">
                  <Cloud className="h-3.5 w-3.5 text-gemigram-neon/50 transition-colors group-hover:text-gemigram-neon" />
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-white/40 transition-colors group-hover:text-white">Weather</span>
                    <span className="text-[10px] font-mono font-bold text-white">
                      {telemetry.weather.temp}°C · {telemetry.weather.condition}
                    </span>
                  </div>
                </div>

                <div className="group flex cursor-pointer items-center gap-2 border-l border-white/5 pl-5">
                  <Activity className={`h-3.5 w-3.5 text-gemigram-neon/50 transition-colors group-hover:text-gemigram-neon ${allowAmbientMotion ? 'animate-pulse' : ''}`} />
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-white/40 transition-colors group-hover:text-white">Network</span>
                    <span className="text-[10px] font-mono font-bold text-gemigram-neon">{telemetry.latency}ms Latency</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden flex-1 flex-col items-center xl:flex">
              <span className="mb-1 text-[9px] font-black uppercase tracking-[0.5em] text-white/20">Active_Sector</span>
              <div className="flex items-center gap-2">
                <span className={`h-1.5 w-1.5 rounded-full bg-gemigram-neon ${allowAmbientMotion ? 'animate-pulse' : ''}`} />
                <span className="text-xs font-black uppercase tracking-[0.3em] text-white">{viewLabels[currentView]}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-5">
              <div className="hidden items-center gap-2 border-r border-white/5 pr-4 md:flex">
                <button className="group relative rounded-xl p-2">
                  <div className="absolute right-1 top-1 z-10 h-2 w-2 rounded-full border-2 border-bg-primary bg-gemigram-neon" />
                  <Signal className="h-4 w-4 text-white/30 transition-colors group-hover:text-white" />
                </button>
                <button className="group rounded-xl p-2">
                  <Activity className="h-4 w-4 text-white/30 transition-colors group-hover:text-white" />
                </button>
                <div className="rounded-xl p-2"><ThemeToggle /></div>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden flex-col items-end sm:flex">
                  <span className="text-[11px] font-mono font-black tabular-nums text-white">
                    {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
                  </span>
                  <span className="text-[8px] font-mono font-bold uppercase tracking-widest leading-none text-white/20">
                    {time.toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                </div>

                <div className="group relative">
                  <motion.div
                    whileHover={allowAmbientMotion ? { scale: 1.05 } : undefined}
                    className="relative h-10 w-10 cursor-pointer overflow-hidden rounded-xl border border-gemigram-neon/30 bg-gradient-to-br from-gemigram-neon/20 to-transparent p-0.5 transition-colors hover:border-gemigram-neon"
                  >
                    <div className="h-full w-full overflow-hidden rounded-[10px] bg-black/40">
                      <img src={user?.photoURL || '/avatars/default.png'} alt="User" className="h-full w-full object-cover" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-bg-primary bg-gemigram-neon" />
                  </motion.div>

                  <div className="pointer-events-none absolute right-0 top-full mt-4 translate-y-2 opacity-0 transition-all duration-300 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 shadow-2xl z-[100]">
                    <div className={`w-64 rounded-2xl border border-white/10 p-6 backdrop-blur-3xl shadow-2xl ${isMobile ? 'glass-subtle' : 'glass-strong'}`}>
                      <div className="mb-6 flex items-center gap-4">
                        <div className="h-12 w-12 overflow-hidden rounded-full border border-gemigram-neon/30 bg-black p-0.5">
                          <img src={user?.photoURL || '/avatars/default.png'} alt="" className="h-full w-full rounded-full object-cover" />
                        </div>
                        <div className="flex min-w-0 flex-col overflow-hidden">
                          <span className="truncate text-xs font-black text-white">{user?.displayName || 'Anonymous Architect'}</span>
                          <span className="truncate text-[9px] uppercase text-gemigram-neon/60 font-mono">{user?.email || 'OFFLINE'} · {linkType || 'LOCAL'}</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/5 bg-white/5 py-2.5 text-[9px] font-black uppercase tracking-widest text-white/40 transition-all hover:bg-white/10 hover:text-white">
                          Nexus_Profile
                        </button>
                        <button
                          onClick={async () => {
                            document.body.style.filter = 'grayscale(1) brightness(0.5)';
                            document.body.style.transition = 'all 0.6s ease';
                            setTimeout(async () => {
                              await logout();
                              document.body.style.filter = '';
                            }, 600);
                          }}
                          className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 py-2.5 text-[9px] font-black uppercase tracking-widest text-red-400 transition-all hover:bg-red-500 hover:text-black"
                        >
                          Terminate_Session
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="relative z-10 flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={allowMotion ? { opacity: 0, scale: 0.985 } : false}
              animate={{ opacity: 1, scale: 1 }}
              exit={allowMotion ? { opacity: 0, scale: 1.01 } : undefined}
              transition={{ duration: allowMotion ? 0.24 : 0 }}
              className="custom-scrollbar h-full w-full overflow-x-hidden overflow-y-auto pb-nav-safe xl:pb-20"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>

        <footer className="pointer-events-none absolute bottom-6 left-1/2 z-50 hidden -translate-x-1/2 xl:flex">
          <div className={`pointer-events-auto flex items-center gap-5 rounded-full border border-gemigram-neon/[0.08] px-6 py-2.5 ${shellGlassClass}`}>
            <div className="flex items-center gap-2 border-r border-white/10 pr-5">
              <span className="text-hud">INFRA::</span>
              <div className="flex items-center gap-3">
                <Flame className="h-3.5 w-3.5 text-orange-500/50" />
                <Sparkles className="h-3.5 w-3.5 text-gemigram-neon/50" />
                <Cloud className="h-3.5 w-3.5 text-blue-400/50" />
              </div>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-[10px] font-bold tracking-[0.3em] text-white/80">GEMIGRAM_HUD_V4</span>
              <span className="text-hud">SOVEREIGN_ENGINE_ACTIVE</span>
            </div>

            <div className="flex items-center gap-2 border-l border-white/10 pl-5">
              <Activity className={`h-3 w-3 text-gemigram-neon ${allowAmbientMotion ? 'animate-pulse' : ''}`} />
              <span className="text-hud uppercase text-gemigram-neon">Sovereign_Link_Stable</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
