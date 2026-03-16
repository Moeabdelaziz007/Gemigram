'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Fingerprint, Mail, ShieldCheck, Globe, ChevronRight } from 'lucide-react';
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
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-md glass-medium border border-white/10 rounded-[2.5rem] p-10 relative overflow-hidden"
          >
            {/* Glow behind modal */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-gemigram-neon/5 blur-[80px] rounded-full" />
            
            <button 
              onClick={onClose}
              className="absolute top-8 right-8 text-white/10 hover:text-gemigram-neon transition-colors z-20"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center text-center mb-10 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-gemigram-neon/10 border border-gemigram-neon/20 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,255,135,0.1)]">
                <Fingerprint className="w-8 h-8 text-gemigram-neon" />
              </div>
              <h2 className="text-3xl font-black uppercase tracking-widest text-white mb-2">Access Portal</h2>
              <p className="text-hud text-gemigram-neon/60">Initialize Sovereign Identity</p>
            </div>

            <div className="space-y-6 relative z-10">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">Credential_ID</label>
                <input 
                  type="email" 
                  placeholder="user@ath.genesis"
                  className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/5 focus:border-gemigram-neon/50 focus:bg-white/10 outline-none transition-all placeholder:text-white/20 text-sm font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">Access_Cipher</label>
                <input 
                  type="password" 
                  placeholder="••••••••••••"
                  className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/5 focus:border-gemigram-neon/50 focus:bg-white/10 outline-none transition-all placeholder:text-white/20 text-sm font-medium"
                />
              </div>

              <button 
                onClick={onClose}
                className="w-full py-5 rounded-2xl bg-gemigram-neon text-black font-black uppercase tracking-widest text-xs shadow-[0_0_30px_rgba(16,255,135,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all mt-4"
              >
                Authenticate_Node
              </button>

              <div className="flex items-center gap-4 py-4">
                <div className="h-[1px] flex-1 bg-white/5" />
                <span className="text-hud uppercase">OR</span>
                <div className="h-[1px] flex-1 bg-white/5" />
              </div>

              <button 
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all flex items-center justify-center gap-3"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-4 h-4" alt="Google" />
                )}
                {loading ? 'Verifying...' : 'Genesis_Login (Google)'}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8 relative z-10">
              <div className="glass-medium px-4 py-3 rounded-xl border-white/5 flex items-center gap-3">
                 <ShieldCheck className="w-4 h-4 text-gemigram-neon/20" />
                 <span className="text-[8px] uppercase font-black tracking-widest text-white/20 text-nowrap">Secure-Spine</span>
              </div>
              <div className="glass-medium px-4 py-3 rounded-xl border-white/5 flex items-center gap-3">
                 <Globe className="w-4 h-4 text-gemigram-neon/20" />
                 <span className="text-[8px] uppercase font-black tracking-widest text-white/20 text-nowrap">Mainnet v2</span>
              </div>
            </div>

            <button 
              onClick={onClose}
              className="w-full text-center mt-6 text-hud text-white/30 hover:text-white transition-colors uppercase"
            >
              New Architect? <span className="text-gemigram-neon">Create_Nexus_ID</span>
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
