export interface MemoryFragment {
  id: string;
  content: string;
  embedding?: number[];
  metadata: {
    originId: string; // Message ID or Session ID
    timestamp: number;
    importance: number; // 1-10
    tags: string[];
    userId: string;
    agentId: string;
  };
  relevanceScore?: number;
}

export interface RetrievalResult {
  fragments: MemoryFragment[];
  contextString: string;
  totalTokens: number;
}

export interface VectorEngineParams {
  topK?: number;
  minRelevance?: number;
  decayWeight?: number;
}
