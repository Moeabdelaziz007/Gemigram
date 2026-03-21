'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Users, Settings, Plus, User as UserIcon, LogOut, Globe, Home } from 'lucide-react';

import Image from 'next/image';
import { GemigramLogo } from '@/components/GemigramLogo';
import { useRouter } from 'next/navigation';
import { BRAND } from '@/lib/constants/branding';
import { useUnreadNotificationsCount } from '@/lib/store/useGemigramStore';
import { useTranslation } from '@/hooks/useTranslation';
import type { User } from 'firebase/auth';

const ORBS_CONFIG = [
  {
    id: 'home',
    path: '/dashboard',
    color: 'bg-gemigram-neon',
    icon: <Home aria-hidden="true" className="h-5 w-5" />,
    label: BRAND.labels.nav.home,
  },
  {
    id: 'galaxy',
    path: '/galaxy',
    color: 'bg-gemigram-neon',
    icon: <Globe aria-hidden="true" className="h-5 w-5" />,
    label: BRAND.labels.nav.galaxy,
  },
  {
    id: 'hub',
    path: '/hub',
    color: 'bg-gemigram-neon',
    icon: <Users aria-hidden="true" className="h-5 w-5" />,
    label: BRAND.labels.nav.hub,
  },
  {
    id: 'forge',
    path: '/forge',
    color: 'bg-gemigram-neon',
    icon: <Plus aria-hidden="true" className="h-5 w-5" />,
    label: BRAND.labels.nav.forge,
  },
  {
    id: 'workspace',
    path: '/workspace',
    color: 'bg-gemigram-neon',
    icon: <LayoutDashboard aria-hidden="true" className="h-5 w-5" />,
    label: BRAND.labels.nav.workspace,
  },
  {
    id: 'marketplace',
    path: '/marketplace',
    color: 'bg-gemigram-neon',
    icon: <Globe aria-hidden="true" className="h-5 w-5" />,
    label: BRAND.labels.nav.marketplace,
  },
  {
    id: 'settings',
    path: '/settings',
    color: 'bg-white/20',
    icon: <Settings aria-hidden="true" className="h-5 w-5" />,
    label: BRAND.labels.nav.settings,
  },
  {
    id: 'about',
    path: '/about',
    color: 'bg-gemigram-neon',
    icon: <Users aria-hidden="true" className="h-5 w-5" />,
    label: BRAND.labels.nav.about,
  },
];

interface FloatingNavProps {
  currentView: string;
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
}

export function FloatingNav({ currentView, user, onLogin, onLogout }: FloatingNavProps) {
  const [expandingOrb, setExpandingOrb] = useState<string | null>(null);
  const [activeHint, setActiveHint] = useState<string | null>(null);
  const unreadNotificationsCount = useUnreadNotificationsCount();
  const hintTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();
  const { t } = useTranslation();


  const handleNavigate = (id: string, path: string) => {
    if (currentView === id) return;
    setExpandingOrb(id);
    setTimeout(() => {
      router.push(path);
      setTimeout(() => setExpandingOrb(null), 400);
    }, 400);
  };

  const showHint = (id: string) => {
    if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
    hintTimerRef.current = setTimeout(() => setActiveHint(id), 450);
  };

  const hideHint = () => {
    if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
    setActiveHint(null);
  };

  useEffect(
    () => () => {
      if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
    },
    [],
  );

  return (
    <>
      <AnimatePresence>
        {expandingOrb && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 200 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none fixed left-1/2 top-1/2 z-[100] h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-theme-primary opacity-90 backdrop-blur-2xl"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="safe-top hidden w-20 shrink-0 flex-col border-r border-gemigram-neon/[0.06] glass-strong py-6 md:flex xl:w-64"
      >
        <div className="mb-8 px-4 xl:mb-10">
          <div className="flex items-center gap-3">
            <GemigramLogo size={28} />
            <span className="hidden text-sm font-black uppercase tracking-[0.2em] text-white xl:block">{BRAND.product.platformName}</span>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-2 px-3">
          {ORBS_CONFIG.map((orb) => {
            const isActive = currentView === orb.id;
            return (
              <div key={orb.id} className="group relative">
                <button
                  onClick={() => handleNavigate(orb.id, orb.path)}
                  title={t(`common.nav.${orb.id}`)}
                  aria-label={t(`common.nav.${orb.id}`)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex w-full items-center gap-4 rounded-2xl px-4 py-3.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gemigram-neon focus-visible:ring-offset-2 focus-visible:ring-offset-black/80 ${
                    isActive
                      ? 'border border-gemigram-neon/25 bg-gemigram-neon/10 text-gemigram-neon shadow-[0_0_25px_rgba(57,255,20,0.15)]'
                      : 'border border-transparent text-white/30 hover:border-white/[0.06] hover:bg-white/[0.04] hover:text-white'
                  }`}
                >
                  <div className={`${isActive ? 'text-gemigram-neon' : 'group-hover:text-white'} relative`}>
                    {orb.icon}
                    {orb.id === 'home' && unreadNotificationsCount > 0 && (
                      <span className="absolute -right-1.5 -top-1.5 inline-flex min-h-4 min-w-4 items-center justify-center rounded-full bg-gemigram-neon px-1 text-[9px] font-black text-black">
                        {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                      </span>
                    )}
                  </div>
                  <span className="hidden whitespace-nowrap text-[10px] font-black uppercase tracking-[0.15em] xl:block">{t(`common.nav.${orb.id}`)}</span>
                </button>
                <span className="invisible pointer-events-none absolute left-full top-1/2 ml-2 -translate-y-1/2 rounded-lg border border-white/10 bg-black/85 px-2 py-1 text-[10px] uppercase tracking-wider text-white/80 opacity-0 transition-opacity duration-200 group-hover:visible group-hover:opacity-100 xl:hidden">
                  {t(`common.nav.${orb.id}`)}
                </span>
              </div>
            );
          })}
        </nav>

        <div className="safe-bottom mt-auto w-full space-y-4 px-3 pt-4">
          {user ? (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 px-4 py-3">
                <div className="relative h-8 w-8 overflow-hidden rounded-full border border-gemigram-neon/30">
                  {user.photoURL ? (
                    <Image src={user.photoURL} alt="User" fill className="object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gemigram-neon/20">
                      <UserIcon aria-hidden="true" className="h-4 w-4 text-gemigram-neon" />
                    </div>
                  )}
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-gemigram-neon px-1 text-[8px] font-black text-black">
                      {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                    </span>
                  )}
                </div>
                <div className="hidden min-w-0 flex-col truncate xl:flex">
                  <span className="truncate text-xs font-bold text-white">{user.displayName || 'Architect'}</span>
                  <span className="mt-1 text-[8px] uppercase tracking-widest text-white/40">Sovereign_Active</span>
                </div>
              </div>
              <button
                onClick={onLogout}
                title="Terminate session"
                aria-label="Terminate session"
                className="flex items-center gap-4 rounded-2xl border border-transparent px-4 py-3 text-red-400 transition-colors hover:border-red-400/20 hover:bg-red-400/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gemigram-neon focus-visible:ring-offset-2 focus-visible:ring-offset-black/80"
              >
                <LogOut aria-hidden="true" className="h-5 w-5 shrink-0" />
                <span className="hidden text-[10px] font-black uppercase tracking-widest xl:block">{t('common.terminate_session')}</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onLogin}
              className="w-full rounded-2xl bg-gemigram-neon px-4 py-4 text-[10px] font-black uppercase tracking-widest text-black shadow-[0_0_30px_rgba(16,255,135,0.3)] transition-all hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gemigram-neon focus-visible:ring-offset-2 focus-visible:ring-offset-black/80"
            >
              {t('common.access_system')}
            </button>
          )}
        </div>
      </motion.aside>

      <motion.nav
        initial={{ y: 80 }}
        animate={{ y: 0 }}
        className="fixed-safe-bottom safe-x fixed left-3 right-3 z-[100] flex h-auto min-h-16 items-center justify-around gap-1 rounded-[2rem] border border-white/10 aether-glass px-2 py-2 md:hidden"
      >
        {ORBS_CONFIG.slice(0, 2).map((orb) => (
          <NavOrb key={orb.id} orb={orb} currentView={currentView} handleNavigate={handleNavigate} unreadNotificationsCount={unreadNotificationsCount} showHint={showHint} hideHint={hideHint} activeHint={activeHint} />
        ))}

        {/* SMART ADD BUTTON (Central Action) */}
        <div className="relative -mt-8 flex items-center justify-center">
          <motion.button
            whileTap={{ scale: 0.85, rotate: 90 }}
            onClick={() => handleNavigate('forge', '/forge')}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-gemigram-neon text-black shadow-[0_0_30px_rgba(16,255,135,0.6)] border-4 border-[#030303]"
          >
            <Plus className="h-7 w-7 stroke-[3px]" />
          </motion.button>
        </div>

      </motion.nav>
    </>
  );
}

interface NavOrbProps {
  orb: typeof ORBS_CONFIG[0];
  currentView: string;
  handleNavigate: (id: string, path: string) => void;
  unreadNotificationsCount: number;
  showHint: (id: string) => void;
  hideHint: () => void;
  activeHint: string | null;
}

function NavOrb({ orb, currentView, handleNavigate, unreadNotificationsCount, showHint, hideHint, activeHint }: NavOrbProps) {
  const isActive = currentView === orb.id;
  const { t } = useTranslation();
  
  return (
    <div className="group relative flex min-w-0 flex-1 items-center justify-center">
      <button
        onClick={() => handleNavigate(orb.id, orb.path)}
        title={t(`common.nav.${orb.id}`)}
        aria-label={t(`common.nav.${orb.id}`)}
        aria-current={isActive ? 'page' : undefined}
        onTouchStart={() => showHint(orb.id)}
        onTouchEnd={hideHint}
        onTouchCancel={hideHint}
        className={`flex min-h-[52px] w-full flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-[9px] font-black uppercase tracking-[0.12em] transition-all ${
          isActive ? 'bg-gemigram-neon/10 text-gemigram-neon' : 'text-white/40'
        }`}
      >
        <div className="relative">
          {orb.icon}
          {orb.id === 'home' && unreadNotificationsCount > 0 && (
            <span className="absolute -right-1.5 -top-1.5 inline-flex min-h-4 min-w-4 items-center justify-center rounded-full bg-gemigram-neon px-1 text-[9px] font-black text-black">
              {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
            </span>
          )}
        </div>
        <span className="truncate text-[8px] leading-none">{t(`common.nav.${orb.id}`)}</span>
      </button>
      <span
        className={`invisible pointer-events-none absolute bottom-full mb-2 rounded-lg border border-white/10 bg-black/85 px-2 py-1 text-[10px] uppercase tracking-wider text-white/80 opacity-0 transition-opacity duration-200 md:group-hover:visible md:group-hover:opacity-100 ${activeHint === orb.id ? 'visible opacity-100' : ''}`}
      >
        {t(`common.nav.${orb.id}`)}
      </span>
    </div>
  );
}
