import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface TranscriptMessage {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: number;
}

export interface ProjectMetadata {
  id: string;
  name: string;
}

export interface Agent {
  id: string;
  aetherId: string;
  name: string;
  role: string;
  users: string;
  seed: string;
  systemPrompt: string;
  voiceName: string;
  ownerId?: string;
  memory?: string;
  skills_desc?: string;
  soul?: string;
  rules?: string;
  tools?: {
    googleSearch: boolean;
    googleMaps: boolean;
    weather: boolean;
    news: boolean;
    crypto: boolean;
    calculator: boolean;
    semanticMemory: boolean;
  };
  skills?: {
    gmail: boolean;
    calendar: boolean;
    drive: boolean;
  };
  avatarUrl?: string;
}

export interface WorkingBufferState {
  transcript: TranscriptMessage[];
  streamingBuffer: string;
  isInterrupted: boolean;
  contextUsage: number; // 0 to 1
  activeProjectId: string | null;
  userProjects: ProjectMetadata[];
  agents: Agent[];
  activeAgentId: string | null;
  linkType: 'stateless' | 'bridge' | 'hibernating';
  voiceProfile: {
    isCloned: boolean;
    sampleStatus: 'none' | 'recording' | 'processing' | 'ready';
    cloneId?: string;
  };
  pendingManifest: Partial<Agent> | null;
  voiceSession: {
    stage: 'landing' | 'forge' | 'workspace';
    micPermission: 'unknown' | 'granted' | 'denied';
    lastVoiceAction: string;
    updatedAt: number | null;
  };
}

export interface WorkingBufferActions {
  addTranscriptMessage: (role: 'user' | 'agent', content: string) => void;
  setStreamingBuffer: (buffer: string) => void;
  setInterrupted: (interrupted: boolean) => void;
  setContextUsage: (usage: number) => void;
  clearTranscript: () => void;
  setActiveProjectId: (id: string | null) => void;
  setUserProjects: (projects: ProjectMetadata[]) => void;
  setAgents: (agents: Agent[]) => void;
  setActiveAgentId: (id: string | null) => void;
  hydrateAgent: (agent: Agent) => void;
  setLinkType: (type: 'stateless' | 'bridge' | 'hibernating') => void;
  setVoiceProfile: (profile: Partial<WorkingBufferState['voiceProfile']>) => void;
  setPendingManifest: (manifest: Partial<Agent> | null) => void;
  setVoiceSession: (session: Partial<WorkingBufferState['voiceSession']>) => void;
}

export type AetherState = WorkingBufferState & WorkingBufferActions;

export const useAetherStore = create<AetherState>()(
  persist(
    (set) => ({
      activeProjectId: null,
      userProjects: [],
      transcript: [],
      streamingBuffer: '',
      isInterrupted: false,
      contextUsage: 0,
      agents: [],
      activeAgentId: null,
      linkType: 'stateless',
      voiceProfile: {
        isCloned: false,
        sampleStatus: 'none',
      },
      pendingManifest: null,
      voiceSession: {
        stage: 'landing',
        micPermission: 'unknown',
        lastVoiceAction: 'Tap Create with Voice to start your onboarding.',
        updatedAt: null,
      },

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
      setActiveProjectId: (id) => set({ activeProjectId: id }),
      setUserProjects: (projects) => set({ userProjects: projects }),
      setAgents: (agents) => set({ agents }),
      setActiveAgentId: (id) => set({ activeAgentId: id }),
      hydrateAgent: (agent) => set((state) => ({
        agents: [...state.agents.filter(a => a.id !== agent.id), agent],
        activeAgentId: agent.id
      })),
      setLinkType: (type) => set({ linkType: type }),
      setVoiceProfile: (profile) => set((state) => ({ 
        voiceProfile: { ...state.voiceProfile, ...profile } 
      })),
      setPendingManifest: (manifest) => set({ pendingManifest: manifest }),
      setVoiceSession: (session) => set((state) => ({
        voiceSession: {
          ...state.voiceSession,
          ...session,
          updatedAt: Date.now(),
        }
      })),
    }),
    {
      name: 'aether-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
