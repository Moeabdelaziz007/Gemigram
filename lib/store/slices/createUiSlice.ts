import { StateCreator } from 'zustand';
import { Agent } from './createAgentSlice';

export interface UiSlice {
  linkType: 'stateless' | 'bridge' | 'hibernating';
  voiceProfile: {
    isCloned: boolean;
    sampleStatus: 'none' | 'recording' | 'processing' | 'ready';
    cloneId?: string;
  };
  voiceSession: {
    stage: 'landing' | 'forge' | 'workspace';
    micPermission: 'unknown' | 'granted' | 'denied';
    lastVoiceAction: string;
    updatedAt: number | null;
  };
  pendingManifest: Partial<Agent> | null;
  setLinkType: (type: 'stateless' | 'bridge' | 'hibernating') => void;
  setVoiceProfile: (profile: Partial<UiSlice['voiceProfile']>) => void;
  setVoiceSession: (session: Partial<UiSlice['voiceSession']>) => void;
  setPendingManifest: (manifest: Partial<Agent> | null) => void;
}

export const createUiSlice: StateCreator<UiSlice> = (set) => ({
  linkType: 'stateless',
  voiceProfile: {
    isCloned: false,
    sampleStatus: 'none',
  },
  voiceSession: {
    stage: 'landing',
    micPermission: 'unknown',
    lastVoiceAction: 'Tap Create with Voice to start your onboarding.',
    updatedAt: null,
  },
  pendingManifest: null,
  setLinkType: (type) => set({ linkType: type }),
  setVoiceProfile: (profile) => set((state) => ({ 
    voiceProfile: { ...state.voiceProfile, ...profile } 
  })),
  setVoiceSession: (session) => set((state) => ({
    voiceSession: {
      ...state.voiceSession,
      ...session,
      updatedAt: Date.now(),
    }
  })),
  setPendingManifest: (manifest) => set({ pendingManifest: manifest }),
});
