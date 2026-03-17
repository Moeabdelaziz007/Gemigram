import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createSensorySlice, SensorySlice } from './slices/createSensorySlice';
import { createAgentSlice, AgentSlice } from './slices/createAgentSlice';
import { createUiSlice, UiSlice } from './slices/createUiSlice';
import { createCognitiveSlice, CognitiveSlice } from './slices/createCognitiveSlice';

export type AetherState = SensorySlice & AgentSlice & UiSlice & CognitiveSlice;

export const useAetherStore = create<AetherState>()(
  persist(
    (...a) => ({
      ...createSensorySlice(...a),
      ...createAgentSlice(...a),
      ...createUiSlice(...a),
      ...createCognitiveSlice(...a),
    }),
    {
      name: 'aether-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Re-export types for convenience
export type { TranscriptMessage } from './slices/createSensorySlice';
export type { Agent, ProjectMetadata } from './slices/createAgentSlice';
export type { SessionState, SessionMetadata } from './slices/createCognitiveSlice';
