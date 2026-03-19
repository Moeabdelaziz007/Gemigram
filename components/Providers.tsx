'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, type User } from 'firebase/auth';
import { auth as firebaseAuth, googleProvider } from '@/firebase';
import { fetchGoogleCloudProjects, subscribeToUnreadNotifications } from '@/lib/data-access/gemigramRepository';
import { useGemigramStore, useUnreadNotifications } from '@/lib/store/useGemigramStore';
import { SessionProvider, useSession } from "next-auth/react";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  unreadNotificationsCount: number;
  googleAccessToken: string | null;
  loadGoogleProjects: () => Promise<void>;
  session?: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [googleAccessToken, setGoogleAccessToken] = useState<string | null>(null);
  const unreadNotifications = useUnreadNotifications();

  const {
    activeProjectId,
    setAgents,
    setUnreadNotifications,
    setUserProjects,
    setActiveProjectId,
    clearUserScopedState,
    setHydratedUserId,
  } = useGemigramStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (nextUser) => {
      setUser((currentUser) => {
        const currentUserId = currentUser?.uid ?? null;
        const nextUserId = nextUser?.uid ?? null;

        if (currentUserId !== nextUserId) {
          clearUserScopedState();
          setHydratedUserId(nextUserId);
        }

        return nextUser;
      });

      if (!nextUser) {
        setGoogleAccessToken(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [clearUserScopedState, setHydratedUserId]);

  useEffect(() => {
    if (!user) {
      setAgents([]);
      setUnreadNotifications([]);
      return;
    }

    const unsubscribeNotifications = subscribeToUnreadNotifications(
      user.uid,
      setUnreadNotifications,
      (error) => console.warn('Error syncing notifications:', error),
    );

    return () => {
      unsubscribeNotifications();
      setAgents([]);
      setUnreadNotifications([]);
    };
  }, [user, setAgents, setUnreadNotifications]);

  // Sync NextAuth token to state if available
  useEffect(() => {
    if ((session as any)?.accessToken) {
      setGoogleAccessToken((session as any).accessToken as string);
    }
  }, [session]);

  const loadGoogleProjects = useCallback(async () => {
    if (!googleAccessToken) {
      return;
    }

    if (activeProjectId) {
      return;
    }

    try {
      const projects = await fetchGoogleCloudProjects(googleAccessToken);
      setUserProjects(projects);
      if (projects.length > 0) {
        setActiveProjectId(projects[0].id);
      }
    } catch (projectErr) {
      console.warn('Project discovery failed:', projectErr);
    }
  }, [activeProjectId, googleAccessToken, setActiveProjectId, setUserProjects]);

  const login = useCallback(async () => {
    try {
      const result = await signInWithPopup(firebaseAuth, googleProvider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      setGoogleAccessToken(credential?.accessToken ?? null);
    } catch (error) {
      console.error('Login Error:', error);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      clearUserScopedState();
      setHydratedUserId(null);
      setGoogleAccessToken(null);
      await firebaseAuth.signOut();
    } catch (error) {
      console.error('Logout Error:', error);
    }
  }, [clearUserScopedState, setHydratedUserId]);

  const value = useMemo(
    () => ({
      user,
      loading: loading || status === "loading",
      login,
      logout,
      unreadNotificationsCount: unreadNotifications.length,
      googleAccessToken,
      loadGoogleProjects,
      session
    }),
    [googleAccessToken, loadGoogleProjects, loading, status, login, logout, unreadNotifications.length, user, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </SessionProvider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
