---
name: firestore-agent-sync
description: Activates when the user asks to sync agents to Firestore, fix real-time listeners, implement persistent memory, repair data subscriptions, or when Firestore permission errors appear. Always scope to authenticated user.
---

# Skill: Firestore Agent Sync

## Goal
Reliable, real-time Firestore sync using onSnapshot — never polling.

## Standard Pattern
```typescript
useEffect(() => {
  if (!hydratedUserId) return;
  const unsubscribe = onSnapshot(
    collection(db, `users/${hydratedUserId}/agents`),
    (snapshot) => {
      const agents = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Agent));
      setAgents(agents);
    },
    (error) => {
      console.error('Firestore sync error:', error); // only in dev
      setSessionState('ERROR');
    }
  );
  return () => unsubscribe(); // always cleanup
}, [hydratedUserId]);
```

## Instructions
1. Always use `onSnapshot` — never `getDocs()` for live data
2. Always return `unsubscribe` from useEffect cleanup
3. Always scope to `hydratedUserId` — never read unauthenticated
4. Batch multiple field updates with `updateDoc` + `serverTimestamp()`
5. Memory system: use `getAgentMemories()` from `lib/memory/memory-store.ts`

## Constraints
- Never expose Firebase keys client-side
- Never write without authenticated hydratedUserId
- Never use polling — always event-driven
