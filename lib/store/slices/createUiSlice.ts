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
  lastSyncedAt: number | null;
  setLinkType: (type: 'stateless' | 'bridge' | 'hibernating') => void;
  setVoiceProfile: (profile: Partial<UiSlice['voiceProfile']>) => void;
  setVoiceSession: (session: Partial<UiSlice['voiceSession']>) => void;
  setPendingManifest: (manifest: Partial<Agent> | null) => void;
  setLastSyncedAt: (time: number | null) => void;
}

export const INITIAL_UI_STATE = {
  linkType: 'stateless' as const,
  voiceProfile: {
    isCloned: false,
    sampleStatus: 'none' as const,
  },
  voiceSession: {
    stage: 'landing' as const,
    micPermission: 'unknown' as const,
    lastVoiceAction: 'Tap Create with Voice to start your onboarding.',
    updatedAt: null,
  },
  pendingManifest: null,
  lastSyncedAt: null,
};

export const createUiSlice: StateCreator<UiSlice> = (set) => ({
  ...INITIAL_UI_STATE,
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
  setLastSyncedAt: (time) => set({ lastSyncedAt: time }),
});
