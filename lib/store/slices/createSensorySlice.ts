import { StateCreator } from 'zustand';
import { nanoid } from 'nanoid';

export interface TranscriptMessage {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: number;
}

export interface InterruptSignal {
  tokenId: string;           // nanoid()
  interruptedAt: number;     // performance.now()
  audioFramesDropped: number;
  lastValidTranscriptChunk: string;
  resolvedAt: number | null;
}

export interface SensorySlice {
  transcript: TranscriptMessage[];
  streamingBuffer: string;
  isInterrupted: boolean;
  isThinking: boolean;
  isSpeaking: boolean;
  volume: number;
  contextUsage: number;
  unreadNotifications: any[]; // Adjust type as needed
  
  // New Interrupt Fields
  activeInterrupt: InterruptSignal | null;
  interruptHistory: InterruptSignal[];  // max 10 items

  addTranscriptMessage: (role: 'user' | 'agent', content: string) => void;
  addBulkTranscriptMessages: (messages: { role: 'user' | 'agent', content: string }[]) => void;
  setStreamingBuffer: (buffer: string) => void;
  setInterrupted: (interrupted: boolean) => void;
  setIsThinking: (thinking: boolean) => void;
  setIsSpeaking: (speaking: boolean) => void;
  setVolume: (volume: number) => void;
  setContextUsage: (usage: number) => void;
  setUnreadNotifications: (notifications: any[]) => void;
  clearTranscript: () => void;

  // New Interrupt Actions
  triggerBargein: (lastChunk: string, framesDropped?: number) => void;
  resolveInterrupt: (tokenId: string) => void;
  getInterruptContext: () => string;
}

export const INITIAL_SENSORY_STATE: Pick<SensorySlice, 'transcript' | 'streamingBuffer' | 'isInterrupted' | 'isThinking' | 'isSpeaking' | 'volume' | 'contextUsage' | 'unreadNotifications' | 'activeInterrupt' | 'interruptHistory'> = {
  transcript: [],
  streamingBuffer: '',
  isInterrupted: false,
  isThinking: false,
  isSpeaking: false,
  volume: 0,
  contextUsage: 0,
  unreadNotifications: [],
  activeInterrupt: null,
  interruptHistory: [],
};

export const createSensorySlice: StateCreator<SensorySlice> = (set, get) => ({
  ...INITIAL_SENSORY_STATE,
  addTranscriptMessage: (role, content) =>
    set((state) => {
      const newMessage = {
        id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(7),
        role,
        content,
        timestamp: Date.now(),
      };
      
      const newTranscript = [...state.transcript, newMessage].slice(-100);
      
      return { transcript: newTranscript };
    }),
  addBulkTranscriptMessages: (messages) =>
    set((state) => {
      const newMessages = messages.map(m => ({
        id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(7),
        ...m,
        timestamp: Date.now(),
      }));
      const newTranscript = [...state.transcript, ...newMessages].slice(-100);
      return { transcript: newTranscript };
    }),
  setStreamingBuffer: (buffer) => set({ streamingBuffer: buffer }),
  setInterrupted: (interrupted) => set({ isInterrupted: interrupted }),
  setIsThinking: (thinking) => set({ isThinking: thinking }),
  setIsSpeaking: (speaking) => set({ isSpeaking: speaking }),
  setVolume: (volume) => set({ volume }),
  setContextUsage: (usage) => set({ contextUsage: usage }),
  setUnreadNotifications: (notifications) => set({ unreadNotifications: notifications }),
  clearTranscript: () => set({ transcript: [] }),

  // New Interrupt Implementation
  triggerBargein: (lastChunk, framesDropped = 0) =>
    set({
      activeInterrupt: {
        tokenId: nanoid(),
        interruptedAt: performance.now(),
        audioFramesDropped: framesDropped,
        lastValidTranscriptChunk: lastChunk,
        resolvedAt: null,
      },
      isInterrupted: true
    }),

  resolveInterrupt: (tokenId) =>
    set((state) => {
      if (state.activeInterrupt?.tokenId !== tokenId) return state;

      const resolved = { ...state.activeInterrupt, resolvedAt: Date.now() };
      const newHistory = [resolved, ...state.interruptHistory].slice(0, 10);

      return {
        activeInterrupt: null,
        interruptHistory: newHistory,
        isInterrupted: false
      };
    }),

  getInterruptContext: () => {
    const active = get().activeInterrupt;
    if (!active) return '';
    return `[INTERRUPT@${Math.floor(active.interruptedAt)}ms] User barged in after: '${active.lastValidTranscriptChunk}'. Resume from this point.`;
  }
});
