import { db } from '@/firebase';
import { collection, onSnapshot, query, orderBy, Unsubscribe } from 'firebase/firestore';

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
  private unsubscribeSnapshot: Unsubscribe | null = null;
  private syncPromise: Promise<void> | null = null;

  private constructor() {}

  public static getInstance(): AgentRegistry {
    if (!AgentRegistry.instance) {
      AgentRegistry.instance = new AgentRegistry();
    }
    return AgentRegistry.instance;
  }

  async syncWithFirestore(): Promise<void> {
    if (this.syncPromise) {
      return this.syncPromise;
    }

    this.syncPromise = new Promise((resolve) => {
      try {
        const q = query(collection(db, 'agents'), orderBy('name', 'asc'));
        let isFirstSnapshot = true;

        this.unsubscribeSnapshot = onSnapshot(
          q,
          (snapshot) => {
            snapshot.docs.forEach(doc => {
              const data = doc.data() as AgentManifest;
              this.agents.set(doc.id, { ...data, id: doc.id });
            });

            if (isFirstSnapshot) {
              isFirstSnapshot = false;
              resolve();
            }
          },
          (error) => {
            console.error("Failed to sync AgentRegistry:", error);
            if (isFirstSnapshot) {
              resolve(); // Resolve even on error to unblock caller, though error is logged
            }
          }
        );
      } catch (error) {
        console.error("Failed to setup sync AgentRegistry:", error);
        resolve();
      }
    });

    return this.syncPromise;
  }

  unsubscribe(): void {
    if (this.unsubscribeSnapshot) {
      this.unsubscribeSnapshot();
      this.unsubscribeSnapshot = null;
      this.syncPromise = null;
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
