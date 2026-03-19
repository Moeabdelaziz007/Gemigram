import { StateCreator } from 'zustand';

// ─── Session States ─────────────────────────────────────────
export type SessionState =
  | 'INITIALIZING'
  | 'CONNECTED'
  | 'HANDING_OFF'
  | 'RESTARTING'
  | 'ERROR'
  | 'RECOVERING'
  | 'SHUTDOWN';

export interface SessionMetadata {
  sessionId: string;
  activeAgentName: string;
  startedAt: number;
  messageCount: number;
  handoffCount: number;
  errorCount: number;
  lastActivity: number;
  activeWidgets: string[];
}

export interface CognitiveSlice {
  // Session State
  sessionState: SessionState;
  sessionMetadata: SessionMetadata | null;
  consecutiveErrors: number;
  
  // Telemetry Metrics
  micLevel: number;
  speakerLevel: number;
  latencyMs: number;
  isVisionActive: boolean;
  tokensUsed: number;
  tokenBudget: number;

  // Neural Selection
  activeProvider: "google" | "anthropic" | "deepseek" | "openai";
  activeModel: string;

  // Actions
  setSessionState: (state: SessionState) => void;
  updateSessionMetadata: (meta: Partial<SessionMetadata>) => void;
  setNeuralSelection: (provider: "google" | "anthropic" | "deepseek" | "openai", model: string) => void;
  setMicLevel: (level: number) => void;
  setSpeakerLevel: (level: number) => void;
  setLatencyMs: (ms: number) => void;
  setVisionActive: (active: boolean) => void;
  trackTokenUsage: (tokens: number) => void;
  resetCognitive: () => void;
}

const INITIAL_STATE = {
  sessionState: 'INITIALIZING' as SessionState,
  sessionMetadata: null,
  consecutiveErrors: 0,
  micLevel: 0,
  speakerLevel: 0,
  latencyMs: 0,
  isVisionActive: false,
  tokensUsed: 0,
  tokenBudget: 1_000_000,
  activeProvider: "google" as const,
  activeModel: "gemini-2.0-flash-exp",
};

export const createCognitiveSlice: StateCreator<CognitiveSlice> = (set, get) => ({
  ...INITIAL_STATE,

  setSessionState: (state) => set({ sessionState: state }),
  
  updateSessionMetadata: (meta) => set((state) => ({
    sessionMetadata: state.sessionMetadata 
      ? { ...state.sessionMetadata, ...meta, lastActivity: Date.now() } 
      : null
  })),

  setNeuralSelection: (provider, model) => set({ activeProvider: provider, activeModel: model }),

  setMicLevel: (level) => set({ micLevel: Math.max(0, Math.min(1, level)) }),
  setSpeakerLevel: (level) => set({ speakerLevel: Math.max(0, Math.min(1, level)) }),
  setLatencyMs: (ms) => set({ latencyMs: Math.max(0, ms) }),
  setVisionActive: (active) => set({ isVisionActive: active }),

  trackTokenUsage: (tokens: number) => {
    const { tokensUsed } = get();
    set({ tokensUsed: tokensUsed + tokens });
  },

  resetCognitive: () => set(INITIAL_STATE),
});
