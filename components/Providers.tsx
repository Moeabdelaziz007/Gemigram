'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, User } from 'firebase/auth';
import { collection, onSnapshot, query, orderBy, where } from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '@/firebase';
import { useAetherStore, Agent } from '@/lib/store/useAetherStore';
import { Notification } from '@/lib/types/models';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  unreadNotifications: Notification[];
  googleAccessToken: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [unreadNotifications, setUnreadNotifications] = useState<Notification[]>([]);
  const [googleAccessToken, setGoogleAccessToken] = useState<string | null>(null);
  
  const { setAgents, setUserProjects, setActiveProjectId } = useAetherStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
      if (!u) {
        setAgents([]);
        setGoogleAccessToken(null);
      }
    });
    return () => unsubscribe();
  }, [setAgents]);

  // Global Agent Sync
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'agents'), orderBy('name', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      try {
        const firestoreAgents = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Agent[];
        
        const owned = firestoreAgents.filter(fa => fa.ownerId === user?.uid);
        setAgents(owned.length > 0 ? owned : firestoreAgents);
      } catch (err) {
        console.warn('Error syncing agents:', err);
      }
    });
    return () => unsubscribe();
  }, [user, setAgents]);

  // Global Notification Sync
  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', user.uid),
      where('read', '==', false)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      try {
        setUnreadNotifications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification)));
      } catch (err) {
        console.warn('Error syncing notifications:', err);
      }
    });
    return () => unsubscribe();
  }, [user]);

  const login = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (credential?.accessToken) {
        setGoogleAccessToken(credential.accessToken);
        
        // Universal Project Discovery
        try {
          const response = await fetch('https://cloudresourcemanager.googleapis.com/v1/projects', {
            headers: {
              'Authorization': `Bearer ${credential.accessToken}`
            }
          });
          const data = await response.json();
          if (data.projects) {
            const projects = data.projects.map((p: any) => ({
              id: p.projectId,
              name: p.name
            }));
            setUserProjects(projects);
            if (projects.length > 0) {
              setActiveProjectId(projects[0].id);
            }
          }
        } catch (projectErr) {
          console.warn('Project discovery failed:', projectErr);
        }
      }
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  const logout = async () => {
    try {
      await auth.signOut();
      setGoogleAccessToken(null);
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, unreadNotifications, googleAccessToken }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
