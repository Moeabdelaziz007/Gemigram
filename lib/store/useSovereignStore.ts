import { create } from 'zustand';
import { db } from '@/firebase';
import { doc, setDoc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { Agent } from './useGemigramStore';

interface SovereignState {
  isSaving: boolean;
  error: string | null;
  
  // Explicit Cloud Actions for Agents
  saveAgent: (userId: string, agent: Agent) => Promise<void>;
  updateAgent: (userId: string, agentId: string, updates: Partial<Agent>) => Promise<void>;
  deleteAgent: (userId: string, agentId: string) => Promise<void>;
}

export const useSovereignStore = create<SovereignState>((set) => ({
  isSaving: false,
  error: null,

  saveAgent: async (userId: string, agent: Agent) => {
    try {
      set({ isSaving: true, error: null });
      const agentRef = doc(db, 'agents', agent.id);
      await setDoc(agentRef, {
        ...agent,
        ownerId: userId,
        updatedAt: Timestamp.now()
      }, { merge: true });
      set({ isSaving: false });
    } catch (error: any) {
      console.error("Error saving agent:", error);
      set({ error: error.message, isSaving: false });
      throw error;
    }
  },
  
  updateAgent: async (userId: string, agentId: string, updates: Partial<Agent>) => {
    try {
      set({ isSaving: true, error: null });
      const agentRef = doc(db, 'agents', agentId);
      await updateDoc(agentRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });
      set({ isSaving: false });
    } catch (error: any) {
      console.error("Error updating agent:", error);
      set({ error: error.message, isSaving: false });
      throw error;
    }
  },
  
  deleteAgent: async (userId: string, agentId: string) => {
    try {
      set({ isSaving: true, error: null });
      const agentRef = doc(db, 'agents', agentId);
      await deleteDoc(agentRef);
      set({ isSaving: false });
    } catch (error: any) {
      console.error("Error deleting agent:", error);
      set({ error: error.message, isSaving: false });
      throw error;
    }
  }
}));
