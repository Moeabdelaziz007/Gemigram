import { StateCreator } from 'zustand';

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

export interface AgentSlice {
  activeProjectId: string | null;
  userProjects: ProjectMetadata[];
  agents: Agent[];
  activeAgentId: string | null;
  setActiveProjectId: (id: string | null) => void;
  setUserProjects: (projects: ProjectMetadata[]) => void;
  setAgents: (agents: Agent[]) => void;
  setActiveAgentId: (id: string | null) => void;
  hydrateAgent: (agent: Agent) => void;
}

export const createAgentSlice: StateCreator<AgentSlice> = (set) => ({
  activeProjectId: null,
  userProjects: [],
  agents: [],
  activeAgentId: null,
  setActiveProjectId: (id) => set({ activeProjectId: id }),
  setUserProjects: (projects) => set({ userProjects: projects }),
  setAgents: (agents) => set({ agents }),
  setActiveAgentId: (id) => set({ activeAgentId: id }),
  hydrateAgent: (agent) => set((state) => ({
    agents: [...state.agents.filter(a => a.id !== agent.id), agent],
    activeAgentId: agent.id
  })),
});
