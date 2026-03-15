'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Users, Settings, Plus, User, LogOut, Bell, Globe, Home, ChevronRight } from 'lucide-react';
import { db } from '@/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import Image from 'next/image';
import { AetherLogo } from '@/components/AetherLogo';
import { useRouter } from 'next/navigation';

const ORBS_CONFIG = [
  {
    id: 'home',
    path: '/dashboard',
    color: 'bg-aether-neon',
    shadow: 'shadow-[0_0_20px_rgba(0,242,255,0.3)]',
    icon: <Home className="w-5 h-5" />,
    label: 'Home'
  },
  {
    id: 'workspace',
    path: '/workspace',
    color: 'bg-blue-500',
    shadow: 'shadow-[0_0_20px_rgba(59,130,246,0.3)]',
    icon: <LayoutDashboard className="w-5 h-5" />,
    label: 'Workspace'
  },
  {
    id: 'hub',
    path: '/hub',
    color: 'bg-purple-500',
    shadow: 'shadow-[0_0_20px_rgba(168,85,247,0.3)]',
    icon: <Users className="w-5 h-5" />,
    label: 'Agents'
  },
  {
    id: 'forge',
    path: '/forge',
    color: 'bg-emerald-500',
    shadow: 'shadow-[0_0_20px_rgba(16,185,129,0.3)]',
    icon: <Plus className="w-5 h-5" />,
    label: 'Create'
  },
  {
    id: 'galaxy',
    path: '/galaxy',
    color: 'bg-cyan-500',
    shadow: 'shadow-[0_0_20px_rgba(34,211,238,0.3)]',
    icon: <Globe className="w-5 h-5" />,
    label: 'Gallery'
  },
  {
    id: 'settings',
    path: '/settings',
    color: 'bg-gray-500',
    shadow: 'shadow-[0_0_20px_rgba(107,114,128,0.3)]',
    icon: <Settings className="w-5 h-5" />,
    label: 'Settings'
  }
];

interface FloatingNavProps {
  currentView: 'home' | 'workspace' | 'hub' | 'settings' | 'forge' | 'galaxy';
  user: any;
  onLogin: () => void;
  onLogout: () => void;
}

export function FloatingNav({ currentView, user, onLogin, onLogout }: FloatingNavProps) {
  const [expandingOrb, setExpandingOrb] = useState<string | null>(null);
  const [unreadNotifications, setUnreadNotifications] = useState<any[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
        const notifs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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
    setMobileMenuOpen(false);
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
            className="fixed z-[100] w-10 h-10 rounded-full bg-aether-black/90 backdrop-blur-2xl pointer-events-none left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          />
        )}
      </AnimatePresence>

      {/* Bottom Navigation Dock (Desktop & Tablet) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[90] hidden md:flex items-center gap-2 px-6 py-4 rounded-full quantum-glass"
      >
        {ORBS_CONFIG.map((orb, index) => {
          const isActive = currentView === orb.id;
          const hasNotif = orb.id === 'workspace' && unreadNotifications.length > 0;

          return (
            <motion.button
              key={orb.id}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleNavigate(orb.id, orb.path)}
              className={`relative px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 ${
                isActive
                  ? 'bg-white/15 text-aether-neon border border-aether-neon/50 shadow-lg'
                  : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
              title={orb.label}
            >
              {orb.icon}
              <span className="text-sm font-semibold hidden lg:inline">{orb.label}</span>
              {hasNotif && (
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 rounded-full bg-red-500 ml-1"
                />
              )}
            </motion.button>
          );
        })}

        {/* User Profile Inline */}
        <div className="ml-4 pl-4 border-l border-white/10">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end">
                <span className="text-xs font-semibold text-white">{user.displayName || 'User'}</span>
                <span className="text-[10px] text-white/50">Active</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onLogout}
                className="w-9 h-9 rounded-full overflow-hidden border border-white/20 hover:border-red-400/50 transition-colors"
              >
                {user.photoURL ? (
                  <Image 
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    width={36}
                    height={36}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full bg-aether-neon/20 flex items-center justify-center">
                    <User className="w-4 h-4 text-aether-neon" />
                  </div>
                )}
              </motion.button>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onLogin}
              className="px-4 py-2 rounded-lg bg-aether-neon text-black font-semibold text-sm hover:bg-white transition-all"
            >
              Sign In
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Mobile Top Navigation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="md:hidden fixed top-14 right-6 z-[90]"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="w-10 h-10 rounded-lg quantum-glass flex items-center justify-center"
          title="Menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </motion.button>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-12 right-0 w-48 rounded-lg quantum-glass mt-2 overflow-hidden"
            >
              {ORBS_CONFIG.map((orb) => {
                const isActive = currentView === orb.id;
                return (
                  <motion.button
                    key={orb.id}
                    whileHover={{ x: 4 }}
                    onClick={() => handleNavigate(orb.id, orb.path)}
                    className={`w-full px-4 py-3 flex items-center gap-3 text-left transition-all border-b border-white/5 last:border-b-0 ${
                      isActive ? 'bg-white/10 text-aether-neon' : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {orb.icon}
                    <span className="font-medium text-sm">{orb.label}</span>
                  </motion.button>
                );
              })}
              
              {/* Mobile User Section */}
              <div className="border-t border-white/5 p-3">
                {user ? (
                  <motion.button
                    whileHover={{ x: 4 }}
                    onClick={onLogout}
                    className="w-full px-3 py-2 flex items-center gap-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-all text-sm font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={onLogin}
                    className="w-full px-3 py-2 bg-aether-neon text-black rounded-lg font-semibold text-sm hover:bg-white transition-all"
                  >
                    Sign In
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
