'use client';

import { useState, useCallback, useEffect } from 'react';
import { MemorySystem, SkillSystem, Memory, Skill } from '@/lib/memory/MemorySystem';

export function useMemory(agentId: string) {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load memories and skills on mount
  useEffect(() => {
    loadData();
  }, [agentId]);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [memoriesData, skillsData] = await Promise.all([
        MemorySystem.getMemories(agentId),
        SkillSystem.getSkills(agentId)
      ]);
      setMemories(memoriesData);
      setSkills(skillsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
      console.error('Error loading memory data:', err);
    } finally {
      setLoading(false);
    }
  }, [agentId]);

  const saveMemory = useCallback(
    async (
      content: string,
      category: Memory['category'],
      importance?: number,
      metadata?: Record<string, any>
    ) => {
      try {
        const id = await MemorySystem.saveMemory(
          agentId,
          content,
          category,
          importance,
          metadata
        );
        await loadData();
        return id;
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : 'Failed to save memory';
        setError(errMsg);
        throw err;
      }
    },
    [agentId, loadData]
  );

  const updateMemory = useCallback(
    async (memoryId: string, updates: Partial<Memory>) => {
      try {
        await MemorySystem.updateMemory(memoryId, updates);
        await loadData();
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : 'Failed to update memory';
        setError(errMsg);
        throw err;
      }
    },
    [loadData]
  );

  const deleteMemory = useCallback(
    async (memoryId: string) => {
      try {
        await MemorySystem.deleteMemory(memoryId);
        await loadData();
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : 'Failed to delete memory';
        setError(errMsg);
        throw err;
      }
    },
    [loadData]
  );

  const searchMemories = useCallback(
    async (searchTerm: string) => {
      try {
        const results = await MemorySystem.searchMemories(agentId, searchTerm);
        return results;
      } catch (err) {
        console.error('Search failed:', err);
        return [];
      }
    },
    [agentId]
  );

  const addSkill = useCallback(
    async (
      name: string,
      description: string,
      tool: string,
      parameters?: Record<string, any>
    ) => {
      try {
        const id = await SkillSystem.addSkill(
          agentId,
          name,
          description,
          tool,
          parameters
        );
        await loadData();
        return id;
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : 'Failed to add skill';
        setError(errMsg);
        throw err;
      }
    },
    [agentId, loadData]
  );

  const recordSkillUsage = useCallback(
    async (skillId: string, success: boolean) => {
      try {
        await SkillSystem.recordSkillUsage(skillId, success);
        await loadData();
      } catch (err) {
        console.error('Failed to record skill usage:', err);
      }
    },
    [loadData]
  );

  const deleteSkill = useCallback(
    async (skillId: string) => {
      try {
        await SkillSystem.deleteSkill(skillId);
        await loadData();
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : 'Failed to delete skill';
        setError(errMsg);
        throw err;
      }
    },
    [loadData]
  );

  return {
    memories,
    skills,
    loading,
    error,
    saveMemory,
    updateMemory,
    deleteMemory,
    searchMemories,
    addSkill,
    recordSkillUsage,
    deleteSkill,
    refetch: loadData
  };
}
