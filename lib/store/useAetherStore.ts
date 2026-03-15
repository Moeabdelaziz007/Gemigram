import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface TranscriptMessage {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: number;
}

export interface WorkingBufferState {
  transcript: TranscriptMessage[];
  streamingBuffer: string;
  isInterrupted: boolean;
  contextUsage: number; // 0 to 1
}

export interface WorkingBufferActions {
  addTranscriptMessage: (role: 'user' | 'agent', content: string) => void;
  setStreamingBuffer: (buffer: string) => void;
  setInterrupted: (interrupted: boolean) => void;
  setContextUsage: (usage: number) => void;
  clearTranscript: () => void;
}

export type AetherState = WorkingBufferState & WorkingBufferActions;

export const useAetherStore = create<AetherState>()(
  persist(
    (set) => ({
      // State
      transcript: [],
      streamingBuffer: '',
      isInterrupted: false,
      contextUsage: 0,

      // Actions
      addTranscriptMessage: (role, content) =>
        set((state) => ({
          transcript: [
            ...state.transcript,
            {
              id: Math.random().toString(36).substring(7),
              role,
              content,
              timestamp: Date.now(),
            },
          ],
        })),

      setStreamingBuffer: (buffer) => set({ streamingBuffer: buffer }),
      setInterrupted: (interrupted) => set({ isInterrupted: interrupted }),
      setContextUsage: (usage) => set({ contextUsage: usage }),
      clearTranscript: () => set({ transcript: [] }),
    }),
    {
      name: 'aether-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
