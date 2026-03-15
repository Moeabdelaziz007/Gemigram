import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FloatingNav } from './ui/FloatingNav';
import { Flame, Sparkles, Cloud } from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
  currentView: 'home' | 'workspace' | 'hub' | 'settings' | 'forge' | 'galaxy';
  onNavigate: (view: 'home' | 'workspace' | 'hub' | 'settings' | 'forge' | 'galaxy') => void;
  user: any;
  onLogin: () => void;
  onLogout: () => void;
}

export default function AppShell({ children, currentView, onNavigate, user, onLogin, onLogout }: AppShellProps) {
  return (
    <div className="flex flex-col h-screen w-full bg-[#030303] text-white overflow-hidden selection:bg-cyan-500/30">
      {/* Background Ambient Orbs */}
      <div className="fixed top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none" />

      {/* Floating Liquid Navigation */}
      <FloatingNav 
        currentView={currentView} 
        onNavigate={onNavigate} 
        user={user}
        onLogin={onLogin}
        onLogout={onLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full h-full relative overflow-hidden z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="w-full h-full overflow-y-auto overflow-x-hidden custom-scrollbar"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 w-full py-4 z-50 pointer-events-none flex justify-center">
        <div className="px-6 py-2 rounded-full quantum-glass backdrop-blur-md border border-white/10 flex items-center gap-4 pointer-events-auto shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-2 pr-4 border-r border-white/10">
            <span className="text-xs font-medium text-slate-400">Powered by</span>
            <span className="text-xs font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
              Gemigram AIOS
            </span>
          </div>
          
          <div className="flex items-center gap-4 text-slate-400">
            <div className="flex items-center gap-1.5 hover:text-amber-400 transition-colors cursor-default" title="Firebase">
              <Flame className="w-3.5 h-3.5" />
              <span className="text-[10px] font-medium tracking-wider uppercase">Firebase</span>
            </div>
            <div className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors cursor-default" title="Google Gemini">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="text-[10px] font-medium tracking-wider uppercase">Gemini</span>
            </div>
            <div className="flex items-center gap-1.5 hover:text-blue-400 transition-colors cursor-default" title="Google Workspace">
              <Cloud className="w-3.5 h-3.5" />
              <span className="text-[10px] font-medium tracking-wider uppercase">Workspace</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
