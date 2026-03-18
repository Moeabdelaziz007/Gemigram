'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { AuthProvider, useAuth } from '@/components/Providers';
import { AuthOverlay } from '@/components/auth/AuthOverlay';
import { useAetherStore } from '@/lib/store/useAetherStore';

interface LandingInteractiveContextValue {
  openAuth: () => void;
}

const LandingInteractiveContext = createContext<LandingInteractiveContextValue | null>(null);

function LandingInteractiveController({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const voiceSession = useAetherStore((state) => state.voiceSession);
  const setVoiceSession = useAetherStore((state) => state.setVoiceSession);

  const openAuth = useCallback(() => {
    setVoiceSession({
      stage: 'forge',
      lastVoiceAction: 'Authentication requested from Create with Voice CTA.',
    });
    setIsAuthOpen(true);
  }, [setVoiceSession]);

  useEffect(() => {
    if (!user) return;

    if (voiceSession.stage === 'workspace') {
      router.push('/workspace');
      return;
    }

    if (voiceSession.stage === 'forge') {
      router.push('/forge');
      return;
    }

    router.push('/dashboard');
  }, [router, user, voiceSession.stage]);

  const value = useMemo(() => ({ openAuth }), [openAuth]);

  return (
    <LandingInteractiveContext.Provider value={value}>
      {children}
      <AuthOverlay isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </LandingInteractiveContext.Provider>
  );
}

export function LandingInteractiveProvider({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <LandingInteractiveController>{children}</LandingInteractiveController>
    </AuthProvider>
  );
}

export function useLandingInteractive() {
  const context = useContext(LandingInteractiveContext);
  if (!context) {
    throw new Error('useLandingInteractive must be used within LandingInteractiveProvider');
  }
  return context;
}
