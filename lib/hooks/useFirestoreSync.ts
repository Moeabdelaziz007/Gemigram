'use client';

import { useEffect, useRef } from 'react';
import { db } from '@/firebase';
import { 
  collection, 
  onSnapshot,
  query,
  where
} from 'firebase/firestore';
import { useGemigramStore } from '../store/useGemigramStore';
import { useAuth } from '@/components/Providers';

/**
 * Sovereign Firestore Synchronization Engine
 * Bridges the local Zustand store with the Firebase Cloud layer.
 * 
 * In V2, we use explicit writes via useSovereignStore to prevent sync races, 
 * while maintaining a single source of truth real-time inbound listener.
 */
export function useFirestoreSync() {
  const { user } = useAuth();
  const { setAgents } = useGemigramStore();
  const isSyncing = useRef(false);

  // 1. Inbound Sync: Listen for remote changes
  useEffect(() => {
    if (!user) return;

    isSyncing.current = true;
    
    // Listen to changes in the generic 'agents' collection owned by this user
    const agentsRef = collection(db, 'agents');
    const q = query(agentsRef, where('ownerId', '==', user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const remoteAgents = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as any[];

      // Directly apply remote authoritative state
      setAgents(remoteAgents);
      isSyncing.current = false;
    }, (error) => {
      console.error("[Sovereign_Vault_Failure]: Inbound sync error", error);
      isSyncing.current = false;
    });

    return () => unsubscribe();
  }, [user, setAgents]);

  return { isSyncing: isSyncing.current };
}
