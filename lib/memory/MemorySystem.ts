import { db, auth } from '@/firebase';
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';

export interface Memory {
  id: string;
  userId: string;
  agentId: string;
  content: string;
  category: 'context' | 'preference' | 'skill' | 'interaction';
  timestamp: Timestamp;
  importance: number; // 1-10 scale
  relatedMemories?: string[];
  metadata?: Record<string, any>;
}

export interface Skill {
  id: string;
  userId: string;
  agentId: string;
  name: string;
  description: string;
  tool: string; // Tool identifier (e.g., 'repo-analyzer', 'code-executor')
  parameters?: Record<string, any>;
  successCount: number;
  failureCount: number;
  lastUsed?: Timestamp;
  enabled: boolean;
  createdAt: Timestamp;
}

export class MemorySystem {
  static async saveMemory(
    agentId: string,
    content: string,
    category: Memory['category'],
    importance: number = 5,
    metadata?: Record<string, any>
  ): Promise<string> {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error('User not authenticated');

      const memoryRef = await addDoc(collection(db, 'memories'), {
        userId,
        agentId,
        content,
        category,
        importance: Math.min(10, Math.max(1, importance)),
        metadata,
        timestamp: serverTimestamp(),
        relatedMemories: []
      });

      return memoryRef.id;
    } catch (error) {
      console.error('Error saving memory:', error);
      throw error;
    }
  }

  static async getMemories(
    agentId: string,
    category?: Memory['category'],
    limit: number = 50
  ): Promise<Memory[]> {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error('User not authenticated');

      let constraints = [
        where('userId', '==', userId),
        where('agentId', '==', agentId),
        orderBy('importance', 'desc'),
        orderBy('timestamp', 'desc')
      ];

      if (category) {
        constraints.push(where('category', '==', category));
      }

      const q = query(collection(db, 'memories'), ...constraints);
      const snapshot = await getDocs(q);

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Memory[];
    } catch (error) {
      console.error('Error fetching memories:', error);
      return [];
    }
  }

  static async updateMemory(
    memoryId: string,
    updates: Partial<Memory>
  ): Promise<void> {
    try {
      await updateDoc(doc(db, 'memories', memoryId), {
        ...updates,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating memory:', error);
      throw error;
    }
  }

  static async deleteMemory(memoryId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'memories', memoryId));
    } catch (error) {
      console.error('Error deleting memory:', error);
      throw error;
    }
  }

  static async searchMemories(
    agentId: string,
    searchTerm: string
  ): Promise<Memory[]> {
    try {
      const memories = await this.getMemories(agentId);
      return memories.filter(
        m =>
          m.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (m.metadata?.tags?.some((t: string) =>
            t.toLowerCase().includes(searchTerm.toLowerCase())
          ) ?? false)
      );
    } catch (error) {
      console.error('Error searching memories:', error);
      return [];
    }
  }

  static async getLongTermMemories(agentId: string): Promise<Memory[]> {
    return this.getMemories(agentId, 'context');
  }

  static async getPreferences(agentId: string): Promise<Memory[]> {
    return this.getMemories(agentId, 'preference');
  }
}

export class SkillSystem {
  static async addSkill(
    agentId: string,
    name: string,
    description: string,
    tool: string,
    parameters?: Record<string, any>
  ): Promise<string> {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error('User not authenticated');

      const skillRef = await addDoc(collection(db, 'skills'), {
        userId,
        agentId,
        name,
        description,
        tool,
        parameters: parameters || {},
        successCount: 0,
        failureCount: 0,
        enabled: true,
        createdAt: serverTimestamp()
      });

      return skillRef.id;
    } catch (error) {
      console.error('Error adding skill:', error);
      throw error;
    }
  }

  static async getSkills(agentId: string): Promise<Skill[]> {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error('User not authenticated');

      const q = query(
        collection(db, 'skills'),
        where('userId', '==', userId),
        where('agentId', '==', agentId),
        where('enabled', '==', true),
        orderBy('successCount', 'desc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Skill[];
    } catch (error) {
      console.error('Error fetching skills:', error);
      return [];
    }
  }

  static async recordSkillUsage(
    skillId: string,
    success: boolean
  ): Promise<void> {
    try {
      const skillDoc = doc(db, 'skills', skillId);
      const skillData = await getDocs(query(collection(db, 'skills'), where('id', '==', skillId)));
      
      if (!skillData.empty) {
        const currentData = skillData.docs[0].data();
        await updateDoc(skillDoc, {
          successCount: success ? (currentData.successCount || 0) + 1 : currentData.successCount,
          failureCount: !success ? (currentData.failureCount || 0) + 1 : currentData.failureCount,
          lastUsed: serverTimestamp()
        });
      }
    } catch (error) {
      console.error('Error recording skill usage:', error);
      throw error;
    }
  }

  static async updateSkill(
    skillId: string,
    updates: Partial<Skill>
  ): Promise<void> {
    try {
      await updateDoc(doc(db, 'skills', skillId), updates);
    } catch (error) {
      console.error('Error updating skill:', error);
      throw error;
    }
  }

  static async deleteSkill(skillId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'skills', skillId));
    } catch (error) {
      console.error('Error deleting skill:', error);
      throw error;
    }
  }
}
