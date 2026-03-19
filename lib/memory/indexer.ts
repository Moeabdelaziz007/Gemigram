import { db } from "@/lib/firebase";
import { collection, addDoc, query, where, getDocs, limit } from "firebase/firestore";
import { generateEmbedding, rankMemories } from "./vector-engine";
import { MemoryFragment, RetrievalResult } from "./types";

const MEMORIES_COLLECTION = "memories";

/**
 * Indexes a piece of text into the long-term memory
 */
export const indexMemory = async (
  content: string,
  userId: string,
  agentId: string,
  importance: number = 5,
  tags: string[] = []
): Promise<string> => {
  const embedding = await generateEmbedding(content);

  const memory: Omit<MemoryFragment, "id"> = {
    content,
    embedding,
    metadata: {
      originId: "manual-" + Date.now(),
      timestamp: Date.now(),
      importance,
      tags,
      userId,
      agentId,
    },
  };

  const docRef = await addDoc(collection(db, MEMORIES_COLLECTION), memory);
  return docRef.id;
};

/**
 * Retrieves relevant memories for a query
 */
export const retrieveMemories = async (
  queryString: string,
  userId: string,
  agentId: string,
  maxResults: number = 10
): Promise<RetrievalResult> => {
  const queryEmbedding = await generateEmbedding(queryString);

  // Fetch candidate memories (scoped to user/agent)
  // Note: For massive scale, we'd use a dedicated Vector DB. 
  // For Gemigram's "Frugal Luxury", we fetch latest candidates and rank locally.
  const q = query(
    collection(db, MEMORIES_COLLECTION),
    where("metadata.userId", "==", userId),
    where("metadata.agentId", "==", agentId),
    limit(100) // Fetch last 100 for ranking
  );

  const snapshot = await getDocs(q);
  const candidates: MemoryFragment[] = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<MemoryFragment, "id">),
  }));

  const ranked = rankMemories(queryEmbedding, candidates, { topK: maxResults });

  const contextString = ranked.map((r) => r.content).join("\n---\n");

  return {
    fragments: ranked,
    contextString,
    totalTokens: contextString.split(/\s+/).length, // Naive token count
  };
};
