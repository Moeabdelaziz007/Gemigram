/**
 * Cognitive Worker for GemigramOS
 * Offloads heavy mathematical and filtering operations from the main thread.
 */

/* eslint-disable no-restricted-globals */

interface Memory {
  id?: string;
  createdAt: { toMillis: () => number } | number;
  importance: number;
  decay: number;
  content: string;
  tags: string[];
  metadata: {
    context?: string;
    [key: string]: any;
  };
}

self.onmessage = (e: MessageEvent) => {
  const { type, payload } = e.data;

  switch (type) {
    case 'APPLY_DECAY':
      const { memories, now } = payload as { memories: Memory[], now: number };
      const updates: { id: string, importance?: number, delete?: boolean }[] = [];

      memories.forEach(memory => {
        if (!memory.id) return;
        
        const createdAt = typeof memory.createdAt === 'number' 
          ? memory.createdAt 
          : (memory.createdAt as any).seconds * 1000;
          
        const hoursSinceCreation = (now - createdAt) / (1000 * 60 * 60);
        
        // Advanced Decay: Importance decreases slower if it has high initial importance
        // factor in soul type: 'analytical' decays slower, 'creative' decays faster but fluctuates
        const soul = memory.metadata?.soul?.toLowerCase() || 'analytical';
        const soulMultiplier = soul === 'analytical' ? 0.8 : soul === 'creative' ? 1.2 : 1.0;
        
        const accessMultiplier = (memory.metadata?.accessCount || 1) * 0.15;
        const effectiveDecay = Math.max(0.005, (memory.decay - accessMultiplier) * soulMultiplier);
        
        // Exponential decay based on importance and access
        let newImportance = memory.importance * Math.exp(-effectiveDecay * hoursSinceCreation);

        // Importance Weighting & Sovereign Pattern Boost
        if (memory.tags.includes('critical') || memory.tags.includes('seed') || memory.tags.includes('sovereign')) {
          newImportance = Math.min(1.0, newImportance * 1.6);
        }

        // Garbage collection threshold
        if (newImportance < 0.03) {
          updates.push({ id: memory.id, delete: true });
        } else {
          updates.push({ id: memory.id, importance: Number(newImportance.toFixed(5)) });
        }
      });

      self.postMessage({ type: 'DECAY_RESULTS', payload: updates });
      break;

    case 'SEARCH_FILTER':
      const { memories: searchMemories, searchTerm } = payload as { memories: Memory[], searchTerm: string };
      const termLower = searchTerm.toLowerCase();
      
      // Calculate relevance scores
      const scored = searchMemories.map(memory => {
        let score = 0;
        if (memory.content.toLowerCase().includes(termLower)) score += 10;
        if (memory.tags.some(tag => tag.toLowerCase().includes(termLower))) score += 5;
        if (memory.metadata?.context?.toLowerCase().includes(termLower)) score += 3;
        
        // Factor in importance
        score *= (0.5 + memory.importance);
        
        return { ...memory, score };
      })
      .filter(m => m.score > 0)
      .sort((a, b) => b.score - a.score);

      self.postMessage({ type: 'SEARCH_RESULTS', payload: scored });
      break;


    default:
      console.warn('[CognitiveWorker] Unknown message type:', type);
  }
};
