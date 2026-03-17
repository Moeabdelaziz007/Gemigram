import { db } from '@/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

export interface AgentManifest {
  id: string;
  name: string;
  role: string;
  systemPrompt: string;
  voiceName: string;
  capabilities: string[];
  tools?: Record<string, boolean>;
}

export class AgentRegistry {
  private static instance: AgentRegistry;
  private agents: Map<string, AgentManifest> = new Map();

  private constructor() {}

  public static getInstance(): AgentRegistry {
    if (!AgentRegistry.instance) {
      AgentRegistry.instance = new AgentRegistry();
    }
    return AgentRegistry.instance;
  }

  async syncWithFirestore(): Promise<void> {
    try {
      const q = query(collection(db, 'agents'), orderBy('name', 'asc'));
      const snapshot = await getDocs(q);
      snapshot.docs.forEach(doc => {
        const data = doc.data() as AgentManifest;
        this.agents.set(doc.id, { ...data, id: doc.id });
      });
    } catch (error) {
      console.error("Failed to sync AgentRegistry:", error);
    }
  }

  registerAgent(agent: AgentManifest): void {
    this.agents.set(agent.id, agent);
  }

  unregisterAgent(id: string): boolean {
    return this.agents.delete(id);
  }

  getAgent(id: string): AgentManifest | undefined {
    return this.agents.get(id);
  }

  listAgents(): AgentManifest[] {
    return Array.from(this.agents.values());
  }

  findAgentsByCapability(capability: string): AgentManifest[] {
    return this.listAgents().filter(a => a.capabilities.includes(capability));
  }
}
