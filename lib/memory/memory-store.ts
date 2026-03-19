import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  Timestamp,
  QueryConstraint
} from 'firebase/firestore';
import { db } from '../../firebase';

/**
 * Memory Types for Agent Cognitive Architecture
 */
export type MemoryType = 'semantic' | 'episodic' | 'procedural';

/**
 * Memory Interface - No indexes required, uses Firestore queries
 */
export interface Memory {
  id?: string;
  agentId: string;
  userId: string;
  type: MemoryType;
  content: string;
  importance: number;           // 0.0 to 1.0
  decay: number;                // Decay rate per hour (0.0 to 1.0)
  createdAt: Timestamp;
  lastAccessedAt: Timestamp;
  accessCount: number;
  tags: string[];
  metadata: {
    source: 'conversation' | 'user_input' | 'agent_learning';
    context?: string;
    relatedMemories?: string[];
    [key: string]: any;
  };
}

/**
 * Create a new memory in Firestore
 */
export async function createMemory(memory: Omit<Memory, 'id' | 'createdAt' | 'lastAccessedAt'>): Promise<string> {
  try {
    const memoriesRef = collection(db, 'memories');
    const docRef = await addDoc(memoriesRef, {
      ...memory,
      createdAt: Timestamp.now(),
      lastAccessedAt: Timestamp.now(),
    });
    
    // console.log('[MemoryStore] Memory created:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('[MemoryStore] Failed to create memory:', error);
    throw new Error(`Failed to create memory: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get memory by ID
 */
export async function getMemory(memoryId: string): Promise<Memory | null> {
  try {
    const memoryRef = doc(db, 'memories', memoryId);
    const memorySnap = await getDoc(memoryRef);
    
    if (!memorySnap.exists()) {
      return null;
    }
    
    return { id: memorySnap.id, ...memorySnap.data() } as Memory;
  } catch (error) {
    console.error('[MemoryStore] Failed to get memory:', error);
    return null;
  }
}

/**
 * Update existing memory
 */
export async function updateMemory(memoryId: string, updates: Partial<Memory>): Promise<void> {
  try {
    const memoryRef = doc(db, 'memories', memoryId);
    await updateDoc(memoryRef, updates);
    // console.log('[MemoryStore] Memory updated:', memoryId);
  } catch (error) {
    console.error('[MemoryStore] Failed to update memory:', error);
    throw new Error(`Failed to update memory: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Delete memory
 */
export async function deleteMemory(memoryId: string): Promise<void> {
  try {
    const memoryRef = doc(db, 'memories', memoryId);
    await deleteDoc(memoryRef);
    // console.log('[MemoryStore] Memory deleted:', memoryId);
  } catch (error) {
    console.error('[MemoryStore] Failed to delete memory:', error);
    throw new Error(`Failed to delete memory: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get memories by agent ID with optional filtering
 */
export async function getAgentMemories(
  agentId: string,
  options?: {
    type?: MemoryType;
    limit?: number;
    minImportance?: number;
  }
): Promise<Memory[]> {
  try {
    const constraints: QueryConstraint[] = [where('agentId', '==', agentId)];
    
    if (options?.type) {
      constraints.push(where('type', '==', options.type));
    }
    
    if (options?.minImportance !== undefined) {
      constraints.push(where('importance', '>=', options.minImportance));
    }
    
    constraints.push(orderBy('createdAt', 'desc'));
    
    if (options?.limit) {
      constraints.push(limit(options.limit));
    }
    
    const memoriesRef = collection(db, 'memories');
    const q = query(memoriesRef, ...constraints);
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Memory));
  } catch (error) {
    console.error('[MemoryStore] Failed to get agent memories:', error);
    return [];
  }
}

/**
 * Search memories by content (Offloaded to Web Worker)
 */
export async function searchMemories(
  agentId: string,
  searchTerm: string,
  limitCount: number = 10
): Promise<Memory[]> {
  try {
    const memoriesRef = collection(db, 'memories');
    const q = query(
      memoriesRef,
      where('agentId', '==', agentId),
      orderBy('createdAt', 'desc'),
      limit(limitCount * 5) // Get more results for client-side filtering
    );

    const snapshot = await getDocs(q);
    const memories = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: (data.createdAt as Timestamp).toMillis(), // Convert for worker
      } as any;
    });

    // Instantiate Worker
    const worker = new Worker(new URL('../workers/cognitive-worker.ts', import.meta.url));

    const filteredMemories = await new Promise<Memory[]>((resolve) => {
      worker.onmessage = (e) => {
        if (e.data.type === 'SEARCH_RESULTS') {
          resolve(e.data.payload);
          worker.terminate();
        }
      };
      worker.postMessage({
        type: 'SEARCH_FILTER',
        payload: { memories, searchTerm }
      });
    });

    return filteredMemories.slice(0, limitCount);
  } catch (error) {
    console.error('[MemoryStore] Failed to search memories:', error);
    return [];
  }
}

/**
 * Increment access count and update last accessed time
 */
export async function recordMemoryAccess(memoryId: string): Promise<void> {
  try {
    const memory = await getMemory(memoryId);
    if (!memory) return;

    await updateMemory(memoryId, {
      accessCount: (memory.accessCount || 0) + 1,
      lastAccessedAt: Timestamp.now(),
      // Importance Reinforcement: Boost importance by 5% each access, max 1.0
      importance: Math.min(1.0, (memory.importance || 0.5) * 1.05)
    });
  } catch (error) {
    console.error('[MemoryStore] Failed to record memory access:', error);
  }
}

/**
 * Apply decay to memories based on time (Offloaded to Web Worker)
 */
export async function applyMemoryDecay(agentId: string): Promise<void> {
  try {
    const memories = await getAgentMemories(agentId);
    if (memories.length === 0) return;

    const now = Date.now();

    // Simplify memories for worker transfer
    const simplifiedMemories = memories.map(m => ({
      id: m.id,
      createdAt: m.createdAt.toMillis(),
      importance: m.importance,
      decay: m.decay,
      content: m.content,
      tags: m.tags,
      metadata: { ...m.metadata, accessCount: m.accessCount }
    }));

    const worker = new Worker(new URL('../workers/cognitive-worker.ts', import.meta.url));

    const updates = await new Promise<any[]>((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Worker timeout')), 5000);
      worker.onmessage = (e) => {
        if (e.data.type === 'DECAY_RESULTS') {
          clearTimeout(timeout);
          resolve(e.data.payload);
          worker.terminate();
        }
      };
      worker.onerror = (err) => {
        clearTimeout(timeout);
        reject(err);
      };
      worker.postMessage({
        type: 'APPLY_DECAY',
        payload: { memories: simplifiedMemories, now }
      });
    });

    // Execute updates in parallel for performance
    await Promise.all(updates.map(async (update) => {
      if (update.delete) {
        await deleteMemory(update.id);
      } else if (update.importance !== undefined) {
        await updateMemory(update.id, { importance: update.importance });
      }
    }));

    // console.log(`[MemoryStore] Decay applied to ${updates.length} memories`);
  } catch (error) {
    console.error('[MemoryStore] Failed to apply memory decay:', error);
  }
}


/**
 * Batch create multiple memories
 */
export async function batchCreateMemories(
  memories: Omit<Memory, 'id' | 'createdAt' | 'lastAccessedAt'>[]
): Promise<string[]> {
  const ids: string[] = [];
  
  for (const memory of memories) {
    try {
      const id = await createMemory(memory);
      ids.push(id);
    } catch (error) {
      console.error('[MemoryStore] Failed to create memory in batch:', error);
    }
  }
  
  return ids;
}

/**
 * Get memories by tags
 */
export async function getMemoriesByTags(
  agentId: string,
  tags: string[],
  limit: number = 20
): Promise<Memory[]> {
  try {
    const memories = await getAgentMemories(agentId, { limit: limit * 3 });
    
    // Filter by tags (at least one match)
    const filtered = memories.filter(memory =>
      memory.tags.some(tag => tags.includes(tag))
    );
    
    return filtered.slice(0, limit);
  } catch (error) {
    console.error('[MemoryStore] Failed to get memories by tags:', error);
    return [];
  }
}

/**
 * Clear all memories for an agent (cleanup)
 */
export async function clearAgentMemories(agentId: string): Promise<void> {
  try {
    const memories = await getAgentMemories(agentId);
    
    for (const memory of memories) {
      if (memory.id) {
        await deleteMemory(memory.id);
      }
    }
    
    // console.log('[MemoryStore] Cleared all memories for agent:', agentId);
  } catch (error) {
    console.error('[MemoryStore] Failed to clear agent memories:', error);
    throw error;
  }
}

export default {
  createMemory,
  getMemory,
  updateMemory,
  deleteMemory,
  getAgentMemories,
  searchMemories,
  recordMemoryAccess,
  applyMemoryDecay,
  batchCreateMemories,
  getMemoriesByTags,
  clearAgentMemories,
};
