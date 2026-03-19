'use client';

import { useEffect, useRef } from 'react';
import { db } from '@/firebase';
import { 
  doc, 
  setDoc, 
  onSnapshot, 
  collection, 
  query, 
  where,
  Timestamp,
  getDocs,
  writeBatch
} from 'firebase/firestore';
import { useGemigramStore } from '../store/useGemigramStore';
import { useAuth } from '@/components/Providers';

/**
 * Sovereign Firestore Synchronization Engine
 * Bridges the local Zustand store with the Firebase Cloud layer.
 */
export function useFirestoreSync() {
  const { user } = useAuth();
  const { agents, setAgents, lastSyncedAt, setLastSyncedAt } = useGemigramStore();
  const syncInProgress = useRef(false);

  // 1. Inbound Sync: Listen for remote changes
  useEffect(() => {
    if (!user) return;

    // Standardize to top-level agents collection with ownerId
    const agentsRef = collection(db, 'agents');
    const q = query(agentsRef, where('ownerId', '==', user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (syncInProgress.current) return;

      const remoteAgents = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as any[];

      if (remoteAgents.length > 0) {
        setAgents(remoteAgents);
      }
    });

    return () => unsubscribe();
  }, [user, setAgents]);

  // 2. Outbound Sync: Push local changes to cloud
  useEffect(() => {
    if (!user || agents.length === 0) return;

    const pushToCloud = async () => {
      if (syncInProgress.current) return;
      syncInProgress.current = true;
      try {
        const batch = writeBatch(db);
        let hasChanges = false;
        
        agents.forEach((agent) => {
          // Standardize to top-level agents collection
          const agentRef = doc(db, 'agents', agent.id);
          batch.set(agentRef, {
            ...agent,
            ownerId: user.uid,
            updatedAt: Timestamp.now()
          }, { merge: true });
          hasChanges = true;
        });

        if (hasChanges) {
          await batch.commit();
          setLastSyncedAt(Date.now());
          console.log(`[Sovereign_Vault]: Pushed ${agents.length} agents to the cloud.`);
        }
      } catch (error) {
        console.error("[Sovereign_Vault_Failure]:", error);
      } finally {
        syncInProgress.current = false;
      }
    };

    const timer = setTimeout(pushToCloud, 3000); 
    return () => clearTimeout(timer);
  }, [agents, user, setLastSyncedAt]);

  return { isSyncing: syncInProgress.current };
}
