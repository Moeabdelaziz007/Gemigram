'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Fingerprint, Mail, ShieldCheck, ChevronRight, Globe } from 'lucide-react';
import { useAuth } from '@/components/Providers';

export function AuthOverlay({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await login();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
          />
          
              className="absolute top-8 right-8 text-white/10 hover:text-gemigram-neon transition-colors"
            >
              <X size={20} />
            </button>

            <div className="text-center mb-12 relative z-10">
              <div className="w-20 h-20 cyber-button rounded-3xl flex items-center justify-center mx-auto mb-8 border-gemigram-neon/20 shadow-[0_0_30px_rgba(16,255,135,0.05)] relative overflow-hidden">
                <Fingerprint className="w-10 h-10 text-gemigram-neon" />
                {/* Industrial Scanning Bar */}
                <motion.div 
                  className="absolute left-0 right-0 h-0.5 bg-gemigram-neon/50 shadow-[0_0_10px_#10ff87]"
                  animate={{ top: ['0%', '100%', '0%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              </div>
              <h2 className="text-4xl font-black mb-3 tracking-tighter uppercase glitch-text">Access Node</h2>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Authorized Biometric Protocol</p>
            </div>

            <div className="space-y-5 mb-10 relative z-10">
              <motion.button
                whileHover={{ scale: 1.01, boxShadow: '0 0 30px rgba(255,255,255,0.05)' }}
                whileTap={{ scale: 0.99 }}
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full py-5 cyber-button rounded-2xl flex items-center justify-center gap-4 hover:border-white/20 transition-all"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
                <span className="font-bold text-white/60 tracking-tight">{loading ? 'Verifying...' : 'Workspace Auth'}</span>
              </motion.button>

              <div className="flex items-center gap-4 my-8">
                <div className="h-px flex-1 bg-white/5" />
                <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white/10">Neural Spine ID</span>
                <div className="h-px flex-1 bg-white/5" />
              </div>

              <div className="cyber-panel p-1.5 rounded-2xl flex items-center gap-3 border-white/5 focus-within:border-gemigram-neon/30 transition-colors">
                <div className="p-3 bg-gemigram-neon/10 rounded-xl">
                  <Mail className="w-4 h-4 text-gemigram-neon/60" />
                </div>
                <input 
                  type="email" 
                  placeholder="admin@gemigram.ai" 
                  className="bg-transparent border-none outline-none text-sm p-2 flex-1 text-white placeholder:text-white/10 font-bold uppercase tracking-widest"
                />
              </div>
              
              <motion.button
                whileHover={{ scale: 1.01, boxShadow: '0 0 30px rgba(57,255,20,0.1)' }}
                whileTap={{ scale: 0.99 }}
                className="w-full py-5 cyber-accent-button rounded-2xl font-black flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-[10px]"
              >
                <span>Initialize Command</span>
                <ChevronRight size={14} />
              </motion.button>
            </div>

            <div className="grid grid-cols-2 gap-4 relative z-10">
              <div className="cyber-panel px-5 py-4 rounded-2xl border-white/5 flex items-center gap-4">
                 <ShieldCheck className="w-5 h-5 text-gemigram-neon/20" />
                 <span className="text-[9px] uppercase font-black tracking-widest text-white/20">Secure-Spine</span>
              </div>
              <div className="cyber-panel px-5 py-4 rounded-2xl border-white/5 flex items-center gap-4">
                 <Globe className="w-5 h-5 text-gemigram-neon/20" />
                 <span className="text-[9px] uppercase font-black tracking-widest text-white/20">Mainnet v2</span>
              </div>
            </div>

            <p className="mt-12 text-center text-[9px] text-white/10 leading-relaxed max-w-[80%] mx-auto font-bold uppercase tracking-widest">
              Gemigram Sovereign Intelligence Protocol · Deployment v2.5.0
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
