'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Users, Settings, Plus, User, LogOut, Bell, Globe, Home, ChevronRight } from 'lucide-react';
import { db } from '@/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import Image from 'next/image';
import { AetherLogo } from '@/components/AetherLogo';
import { useRouter } from 'next/navigation';
import { Notification } from '@/lib/types/models';

const ORBS_CONFIG = [
  {
    id: 'home',
    path: '/dashboard',
    color: 'bg-gemigram-neon',
    icon: <Home className="w-5 h-5" />,
    label: 'SOVEREIGN_CORE'
  },
  {
    id: 'galaxy',
    path: '/galaxy',
    color: 'bg-gemigram-neon',
    icon: <Globe className="w-5 h-5" />,
    label: 'GEMIGALAXY'
  },
  {
    id: 'hub',
    path: '/hub',
    color: 'bg-gemigram-neon',
    icon: <Users className="w-5 h-5" />,
    label: 'NEURAL_HUB'
  },
  {
    id: 'forge',
    path: '/forge',
    color: 'bg-gemigram-neon',
    icon: <Plus className="w-5 h-5" />,
    label: 'GEMI_FORGE'
  },
  {
    id: 'workspace',
    path: '/workspace',
    color: 'bg-gemigram-neon',
    icon: <LayoutDashboard className="w-5 h-5" />,
    label: 'WORKSPACE'
  },
  {
    id: 'marketplace',
    path: '/marketplace',
    color: 'bg-gemigram-neon',
    icon: <Globe className="w-5 h-5" />,
    label: 'GEMIGRAM_MARKET'
  },
  {
    id: 'settings',
    path: '/settings',
    color: 'bg-white/20',
    icon: <Settings className="w-5 h-5" />,
    label: 'CONFIG'
  }
];

interface FloatingNavProps {
  currentView: string;
  user: any;
  onLogin: () => void;
  onLogout: () => void;
}

export function FloatingNav({ currentView, user, onLogin, onLogout }: FloatingNavProps) {
  const [expandingOrb, setExpandingOrb] = useState<string | null>(null);
  const [unreadNotifications, setUnreadNotifications] = useState<Notification[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', user.uid),
      where('read', '==', false)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      try {
        const notifs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification));
        setUnreadNotifications(notifs);
      } catch (err) {
        console.warn('Notifications error:', err);
      }
    });
    return () => unsubscribe();
  }, [user]);

  const handleNavigate = (id: string, path: string) => {
    if (currentView === id) return;
    setExpandingOrb(id);
    setTimeout(() => {
      router.push(path);
      setTimeout(() => setExpandingOrb(null), 400);
    }, 400);
  };

  return (
    <>
      {/* Page Transition Overlay */}
      <AnimatePresence>
        {expandingOrb && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 200 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed z-[100] w-10 h-10 rounded-full bg-theme-primary opacity-90 backdrop-blur-2xl pointer-events-none left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          />
        )}
      </AnimatePresence>

      {/* Sovereign Sidebar (Desktop) */}
      <motion.aside
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="hidden md:flex flex-col items-center py-8 w-20 xl:w-64 bg-theme-secondary border-r border-white/5 z-[90] shrink-0"
      >
        <div className="mb-12">
          <div className="flex items-center gap-3 px-4">
            <AetherLogo size={28} />
            <span className="hidden xl:block text-sm font-black uppercase tracking-[0.2em] text-white">Gemigram AIOS</span>
          </div>
        </div>

        <nav className="flex-1 flex flex-col gap-3 w-full px-3">
          {ORBS_CONFIG.map((orb) => {
            const isActive = currentView === orb.id;
            return (
              <button
                key={orb.id}
                onClick={() => handleNavigate(orb.id, orb.path)}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all group ${
                  isActive 
                    ? 'bg-gemigram-neon/10 text-gemigram-neon border border-gemigram-neon/20 shadow-[0_0_20px_rgba(16,255,135,0.1)]' 
                    : 'text-white/40 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <div className={`${isActive ? 'text-gemigram-neon' : 'group-hover:text-white'}`}>
                  {orb.icon}
                </div>
                <span className="hidden xl:block text-[10px] font-black uppercase tracking-[0.15em] whitespace-nowrap">{orb.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="mt-auto px-3 w-full space-y-4">
          {user ? (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/5 border border-white/5">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-gemigram-neon/30">
                  {user.photoURL ? (
                    <Image src={user.photoURL} alt="User" width={32} height={32} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gemigram-neon/20 flex items-center justify-center">
                      <User className="w-4 h-4 text-gemigram-neon" />
                    </div>
                  )}
                </div>
                <div className="hidden xl:flex flex-col truncate">
                  <span className="text-xs font-bold text-white truncate">{user.displayName || 'Architect'}</span>
                  <span className="text-[8px] text-white/40 uppercase tracking-widest leading-none mt-1">Sovereign_Active</span>
                </div>
              </div>
              <button 
                onClick={onLogout}
                className="flex items-center gap-4 px-4 py-3 rounded-2xl text-red-400 hover:bg-red-400/10 transition-colors border border-transparent hover:border-red-400/20"
              >
                <LogOut className="w-5 h-5 flex-shrink-0" />
                <span className="hidden xl:block text-[10px] font-black uppercase tracking-widest">Terminate_Session</span>
              </button>
            </div>
          ) : (
            <button 
              onClick={onLogin}
              className="w-full py-4 rounded-2xl bg-gemigram-neon text-black font-black uppercase text-[10px] tracking-widest shadow-[0_0_30px_rgba(16,255,135,0.3)] hover:scale-[1.02] transition-all"
            >
              Access_System
            </button>
          )}
        </div>
      </motion.aside>

      {/* Mobile Dock (Bottom) */}
      <motion.nav
        initial={{ y: 80 }}
        animate={{ y: 0 }}
        className="md:hidden fixed bottom-6 left-6 right-6 h-16 aether-glass border border-white/10 rounded-2xl z-[100] flex items-center justify-around px-2"
      >
        {ORBS_CONFIG.slice(0, 5).map((orb) => {
          const isActive = currentView === orb.id;
          return (
            <button
              key={orb.id}
              onClick={() => handleNavigate(orb.id, orb.path)}
              className={`p-3 rounded-xl transition-all ${
                isActive ? 'text-gemigram-neon bg-gemigram-neon/10' : 'text-white/40'
              }`}
            >
              {orb.icon}
            </button>
          );
        })}
      </motion.nav>
    </>
  );
}
