import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createSensorySlice, SensorySlice } from './slices/createSensorySlice';
import { createAgentSlice, AgentSlice, Agent } from './slices/createAgentSlice';
import { createUiSlice, UiSlice } from './slices/createUiSlice';
import { createCognitiveSlice, CognitiveSlice } from './slices/createCognitiveSlice';

import { createAuthSlice, AuthSlice } from './slices/createAuthSlice';

// Re-export Agent type for convenience
export type { Agent };

/**
 * Gemigram Global State Store
 * Centralized state management for the Gemigram AIOS.
 * Architecture: Sliced Pattern (Zustand)
 */
export interface GemigramState extends SensorySlice, AgentSlice, UiSlice, CognitiveSlice, AuthSlice {}

export const useGemigramStore = create<GemigramState>()(
  persist(
    (...a) => ({
      ...createSensorySlice(...a),
      ...createAgentSlice(...a),
      ...createUiSlice(...a),
      ...createCognitiveSlice(...a),
      ...createAuthSlice(...a),
    }),
    {
      name: 'gemigram-storage',
      storage: createJSONStorage(() => localStorage),
      // Only persist specific slices if needed
      partialize: (state) => ({
        agents: state.agents,
        mcpServers: (state as any).mcpServers,
        user: (state as any).user,
        theme: (state as any).theme,
      }),
    }
  )
);

// High-performance Selectors
export const useUnreadNotifications = () => useGemigramStore((state) => state.unreadNotifications);
export const useUnreadNotificationsCount = () => useGemigramStore((state) => state.unreadNotifications.length);
export const useOwnedAgents = () => useGemigramStore((state) => state.agents);
