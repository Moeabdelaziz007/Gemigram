'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutDashboard, Users, Settings, Plus, User, LogOut, Bell, Globe } from 'lucide-react';
import { db } from '@/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import Image from 'next/image';

const ORBS_CONFIG = [
  {
    id: 'workspace',
    color: 'bg-cyan-500',
    shadow: 'shadow-[0_0_30px_rgba(0,240,255,0.6)]',
    icon: <LayoutDashboard className="w-6 h-6 text-white" />,
    position: 'top-8 left-8',
    label: 'Neural Workspace'
  },
  {
    id: 'hub',
    color: 'bg-purple-500',
    shadow: 'shadow-[0_0_30px_rgba(168,85,247,0.6)]',
    icon: <Users className="w-6 h-6 text-white" />,
    position: 'top-8 right-8',
    label: 'Agents Hub'
  },
  {
    id: 'settings',
    color: 'bg-orange-500',
    shadow: 'shadow-[0_0_30px_rgba(249,115,22,0.6)]',
    icon: <Settings className="w-6 h-6 text-white" />,
    position: 'bottom-24 right-8',
    label: 'Settings'
  },
  {
    id: 'forge',
    color: 'bg-emerald-500',
    shadow: 'shadow-[0_0_30px_rgba(16,185,129,0.6)]',
    icon: <Plus className="w-6 h-6 text-white" />,
    position: 'bottom-24 left-8',
    label: 'Aether Forge'
  },
  {
    id: 'galaxy',
    color: 'bg-blue-500',
    shadow: 'shadow-[0_0_30px_rgba(59,130,246,0.6)]',
    icon: <Globe className="w-6 h-6 text-white" />,
    position: 'bottom-24 left-1/2 -translate-x-1/2',
    label: 'Aether Galaxy'
  }
];

interface FloatingNavProps {
  currentView: 'home' | 'workspace' | 'hub' | 'settings' | 'forge' | 'galaxy';
  onNavigate: (view: 'home' | 'workspace' | 'hub' | 'settings' | 'forge' | 'galaxy') => void;
  user: any;
  onLogin: () => void;
  onLogout: () => void;
}

export function FloatingNav({ currentView, onNavigate, user, onLogin, onLogout }: FloatingNavProps) {
  const [expandingOrb, setExpandingOrb] = useState<string | null>(null);
  const [unreadNotifications, setUnreadNotifications] = useState<any[]>([]);
  const [randomOffsets] = useState(() => ORBS_CONFIG.map(() => ({
    duration: 6 + Math.random() * 2,
    delay: Math.random() * 2
  })));

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', user.uid),
      where('read', '==', false)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUnreadNotifications(notifs);
    });

    return () => unsubscribe();
  }, [user]);

  const handleNavigate = (id: string) => {
    if (currentView === id) return;
    setExpandingOrb(id);
    setTimeout(() => {
      onNavigate(id);
      setTimeout(() => setExpandingOrb(null), 400);
    }, 400);
  };

  const orbs = ORBS_CONFIG;

  return (
    <>
      {/* Expanding Background Overlay */}
      <AnimatePresence>
        {expandingOrb && (
            <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 150 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className={`fixed z-[100] w-10 h-10 rounded-full pointer-events-none ${
              ORBS_CONFIG.find(o => o.id === expandingOrb)?.color
            } ${ORBS_CONFIG.find(o => o.id === expandingOrb)?.position}`}
            style={{ transformOrigin: 'center' }}
          />
        )}
      </AnimatePresence>

      {/* Floating Orbs */}
      <div className="fixed inset-0 pointer-events-none z-[90]">
        {ORBS_CONFIG.map((orb, i) => {
          const isActive = currentView === orb.id;
          const hasNotification = orb.id === 'workspace' && unreadNotifications.length > 0;
          const orbColor = hasNotification ? 'bg-red-500' : orb.color;
          const orbShadow = hasNotification ? 'shadow-[0_0_40px_rgba(239,68,68,0.8)]' : orb.shadow;

          return (
            <motion.div
              key={orb.id}
              className={`absolute ${orb.position} pointer-events-auto group`}
              animate={{
                y: [0, -10, 0, 10, 0],
                x: [0, 5, 0, -5, 0],
              }}
              transition={{
                duration: randomOffsets[i].duration,
                repeat: Infinity,
                ease: "easeInOut",
                times: [0, 0.25, 0.5, 0.75, 1]
              }}
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleNavigate(orb.id)}
                className={`relative w-14 h-14 rounded-full flex items-center justify-center quantum-glass backdrop-blur-3xl border border-white/20 transition-all duration-300 ${
                  isActive || hasNotification ? orbShadow : 'hover:' + orbShadow
                }`}
              >
                {/* Pulsing effect for notifications */}
                {hasNotification && (
                  <motion.div 
                    className="absolute inset-0 rounded-full bg-red-500"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                )}
                
                <div className={`absolute inset-0 rounded-full opacity-40 blur-md transition-colors duration-500 ${orbColor}`} />
                <div className="relative z-10">
                  {hasNotification ? <Bell className="w-6 h-6 text-white animate-bounce" /> : orb.icon}
                </div>
                
                {hasNotification && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 border-2 border-[#030303] flex items-center justify-center">
                    <span className="text-[8px] font-bold text-white">{unreadNotifications.length}</span>
                  </div>
                )}
              </motion.button>

              <div className={`absolute top-1/2 -translate-y-1/2 ${orb.position.includes('right') ? 'right-full mr-4' : 'left-full ml-4'} px-3 py-1.5 rounded-xl quantum-glass opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap`}>
                <span className="text-sm font-medium text-white">
                  {hasNotification ? 'New Event Triggered!' : orb.label}
                </span>
              </div>
            </motion.div>
          );
        })}

        {/* User Orb */}
        <motion.div
          className="absolute top-8 left-1/2 -translate-x-1/2 pointer-events-auto group"
          animate={{ y: [0, -5, 0, 5, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        >
          {user ? (
            <div className="relative flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="relative w-12 h-12 rounded-full overflow-hidden quantum-glass border border-white/20 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all"
              >
                {user.photoURL ? (
                  <Image 
                    src={user.photoURL} 
                    alt="User" 
                    fill
                    className="object-cover" 
                    referrerPolicy="no-referrer" 
                  />
                ) : (
                  <User className="w-5 h-5 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onLogout}
                className="w-10 h-10 rounded-full flex items-center justify-center quantum-glass border border-white/20 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/50 transition-all opacity-0 group-hover:opacity-100"
              >
                <LogOut className="w-4 h-4" />
              </motion.button>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onLogin}
              className="px-6 py-2 rounded-full quantum-glass border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:shadow-[0_0_20px_rgba(0,240,255,0.2)] transition-all font-medium text-sm"
            >
              Enter System
            </motion.button>
          )}
        </motion.div>
      </div>
    </>
  );
}
