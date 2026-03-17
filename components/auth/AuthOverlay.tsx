'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Fingerprint, Mail, ShieldCheck, Globe, ChevronRight, Loader2, Sparkles, Lock, Shield } from 'lucide-react';
import { useAuth } from '@/components/Providers';

type AuthMode = 'login' | 'signup' | 'scanning';

export function AuthOverlay({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { login } = useAuth();
  const [mode, setMode] = useState<AuthMode>('login');
  const [scanProgress, setScanProgress] = useState(0);
  const [authStatus, setAuthStatus] = useState('Standby');

  const handleGoogleLogin = async () => {
    setMode('scanning');
    setAuthStatus('Initializing Biometric Uplink...');
    
    // Fake scanning delay for immersion
    let progress = 0;
    const interval = setInterval(() => {
      progress += 2;
      setScanProgress(progress);
      if (progress === 30) setAuthStatus('Analyzing Neural Signature...');
      if (progress === 60) setAuthStatus('Verifying Genesis Credentials...');
      if (progress === 90) setAuthStatus('Sovereign Link Established.');
      
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(async () => {
          try {
            await login();
            onClose();
          } catch (err) {
            setMode('login');
            setAuthStatus('Authentication Failed');
          }
        }, 500);
      }
    }, 40);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-2xl"
          />

          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 40, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.9, y: 40, filter: 'blur(10px)' }}
            className="w-full max-w-lg sovereign-glass border border-white/10 rounded-[3rem] p-12 relative overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.8)]"
          >
            {/* Dynamic Background Glow */}
            <motion.div 
              animate={{ 
                scale: mode === 'scanning' ? [1, 1.5, 1] : 1,
                opacity: mode === 'scanning' ? [0.1, 0.3, 0.1] : 0.05
              }}
              className="absolute -top-32 -left-32 w-96 h-96 bg-gemigram-neon blur-[120px] rounded-full pointer-events-none" 
            />
            
            <button 
              onClick={onClose}
              className="absolute top-10 right-10 text-white/20 hover:text-gemigram-neon transition-all hover:rotate-90 z-20 group"
            >
              <X size={24} className="group-hover:scale-110" />
            </button>

            <AnimatePresence mode="wait">
              {mode === 'scanning' ? (
                <motion.div 
                  key="scanning"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex flex-col items-center py-10"
                >
                  <div className="relative w-40 h-40 mb-12 flex items-center justify-center">
                    {/* Pulsing Rings */}
                    <motion.div 
                       animate={{ scale: [1, 1.4, 1], opacity: [0.1, 0.3, 0.1] }}
                       transition={{ duration: 2, repeat: Infinity }}
                       className="absolute inset-0 border border-gemigram-neon rounded-full"
                    />
                    <motion.div 
                       animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
                       transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                       className="absolute inset-4 border border-gemigram-neon/50 rounded-full"
                    />
                    
                    {/* The Fingerprint Scanner */}
                    <div className="relative z-10 w-24 h-24 rounded-2xl bg-gemigram-neon/10 border border-gemigram-neon/30 flex items-center justify-center overflow-hidden">
                      <Fingerprint className="w-12 h-12 text-gemigram-neon" />
                      {/* Scanning Bar */}
                      <motion.div 
                        animate={{ y: [-50, 50, -50] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-x-0 h-1 bg-gemigram-neon shadow-[0_0_15px_rgba(57,255,20,1)] z-20"
                      />
                    </div>
                  </div>

                  <div className="text-center space-y-4">
                    <h3 className="text-2xl font-black uppercase tracking-[0.3em] text-white">Authenticating</h3>
                    <div className="flex flex-col items-center gap-2">
                       <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full bg-gemigram-neon" 
                            style={{ width: `${scanProgress}%` }}
                          />
                       </div>
                       <span className="text-[10px] font-mono text-gemigram-neon uppercase tracking-widest">{authStatus}</span>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className="flex flex-col items-center text-center mb-12 relative z-10">
                    <div className="w-20 h-20 rounded-3xl bg-gemigram-neon/5 border border-gemigram-neon/20 flex items-center justify-center mb-8 relative group">
                      <Shield className="w-10 h-10 text-gemigram-neon group-hover:scale-110 transition-transform" />
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border border-gemigram-neon/20 rounded-3xl border-dashed"
                      />
                    </div>
                    <h2 className="text-4xl font-black uppercase tracking-tighter text-white mb-3">
                      {mode === 'login' ? 'Nexus_Access' : 'Neural_Genesis'}
                    </h2>
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gemigram-neon shadow-neon">
                      Sovereign Identity Protocol
                    </p>
                  </div>

                  <div className="space-y-8 relative z-10">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center ml-4">
                        <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30">Sector_ID</label>
                        <Mail className="w-3 h-3 text-white/10" />
                      </div>
                      <input 
                        type="email" 
                        placeholder="identity@gemigram.io"
                        className="w-full px-8 py-5 rounded-2xl bg-white/[0.03] border border-white/5 focus:border-gemigram-neon/40 focus:bg-white/[0.05] outline-none transition-all placeholder:text-white/10 text-sm font-bold tracking-tight"
                      />
                    </div>

                    <div className="space-y-3">
                       <div className="flex justify-between items-center ml-4">
                        <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30">Access_Key</label>
                        <Lock className="w-3 h-3 text-white/10" />
                      </div>
                      <input 
                        type="password" 
                        placeholder="••••••••••••"
                        className="w-full px-8 py-5 rounded-2xl bg-white/[0.03] border border-white/5 focus:border-gemigram-neon/40 focus:bg-white/[0.05] outline-none transition-all placeholder:text-white/10 text-sm font-bold tracking-tight"
                      />
                    </div>

                    <button 
                      onClick={handleGoogleLogin}
                      className="w-full py-6 rounded-3xl bg-gemigram-neon text-black font-black uppercase tracking-[0.2em] text-sm shadow-[0_0_50px_rgba(57,255,20,0.3)] hover:shadow-[0_0_80px_rgba(57,255,20,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 group"
                    >
                      Initialize_Uplink
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <div className="flex items-center gap-6 py-2">
                      <div className="h-px flex-1 bg-white/5" />
                      <span className="text-[8px] font-black uppercase tracking-[0.5em] text-white/10">External_Gateway</span>
                      <div className="h-px flex-1 bg-white/5" />
                    </div>

                    <button 
                      onClick={handleGoogleLogin}
                      className="w-full py-6 rounded-3xl bg-white/[0.03] border border-white/10 text-white font-black uppercase tracking-[0.2em] text-[10px] hover:bg-white/[0.06] hover:border-white/20 transition-all flex items-center justify-center gap-4"
                    >
                      <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5 invert opacity-50" alt="Google" />
                      Google_Genesis (One-Click)
                    </button>
                  </div>

                  <div className="mt-12 pt-8 border-t border-white/5 flex flex-col gap-6">
                    <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-[0.3em] text-white/20">
                      <div className="flex items-center gap-2">
                         <ShieldCheck className="w-3 h-3 text-gemigram-neon/40" />
                         <span>End-to-End Encryption</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <Globe className="w-3 h-3 text-gemigram-neon/40" />
                         <span>Global Mainnet v3.0</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                      className="text-center text-[11px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-gemigram-neon transition-colors group"
                    >
                      {mode === 'login' ? 'New Architect? ' : 'Existing Identity? '}
                      <span className="text-gemigram-neon group-hover:underline decoration-gemigram-neon/30 underline-offset-8 transition-all">
                        {mode === 'login' ? 'Create_Neural_ID' : 'Login_to_Nexus'}
                      </span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
