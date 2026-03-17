import { StateCreator } from 'zustand';
import { Agent } from './createAgentSlice';

export interface UiSlice {
  linkType: 'stateless' | 'bridge' | 'hibernating';
  voiceProfile: {
    isCloned: boolean;
    sampleStatus: 'none' | 'recording' | 'processing' | 'ready';
    cloneId?: string;
  };
  pendingManifest: Partial<Agent> | null;
  setLinkType: (type: 'stateless' | 'bridge' | 'hibernating') => void;
  setVoiceProfile: (profile: Partial<UiSlice['voiceProfile']>) => void;
  setPendingManifest: (manifest: Partial<Agent> | null) => void;
}

export const createUiSlice: StateCreator<UiSlice> = (set) => ({
  linkType: 'stateless',
  voiceProfile: {
    isCloned: false,
    sampleStatus: 'none',
  },
  pendingManifest: null,
  setLinkType: (type) => set({ linkType: type }),
  setVoiceProfile: (profile) => set((state) => ({ 
    voiceProfile: { ...state.voiceProfile, ...profile } 
  })),
  setPendingManifest: (manifest) => set({ pendingManifest: manifest }),
});
