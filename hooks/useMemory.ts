'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  getAgentMemories, 
  createMemory, 
  deleteMemory as deleteFromStore,
  Memory,
  MemoryType 
} from '@/lib/memory/memory-store';
import { useGemigramStore } from '@/lib/store/useGemigramStore';

/**
 * Hook for managing agent memories and skills
 */
export function useMemory(agentId: string) {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [skills, setSkills] = useState<any[]>([]); // Future implementation
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { sessionMetadata } = useGemigramStore();

  const fetchMemories = useCallback(async () => {
    if (!agentId) return;
    setLoading(true);
    try {
      const data = await getAgentMemories(agentId, { limit: 50 });
      setMemories(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch memories');
    } finally {
      setLoading(false);
    }
  }, [agentId]);

  useEffect(() => {
    fetchMemories();
  }, [fetchMemories]);

  const saveMemory = async (
    content: string, 
    category: MemoryType = 'semantic', 
    importance: number = 0.5,
    metadata: any = {}
  ) => {
    try {
      const userId = 'system'; // Placeholder for auth context
      await createMemory({
        agentId,
        userId,
        type: category,
        content,
        importance,
        decay: 0.05,
        accessCount: 0,
        tags: metadata.tags || [],
        metadata: {
          source: 'user_input',
          ...metadata
        }
      });
      await fetchMemories();
    } catch (err) {
      throw err;
    }
  };

  const removeMemory = async (memoryId: string) => {
    try {
      await deleteFromStore(memoryId);
      setMemories(prev => prev.filter(m => m.id !== memoryId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete memory');
    }
  };

  const addSkill = async (name: string, description: string, type: string) => {
    // Skill logic to be integrated with Procedural memory
  };

  return {
    memories,
    skills,
    loading,
    error,
    saveMemory,
    deleteMemory: removeMemory,
    addSkill,
    refreshMemories: fetchMemories
  };
}
