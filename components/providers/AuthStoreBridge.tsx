'use client';

import { useEffect } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '@/firebase';
import { useAuth } from '@/components/Providers';
import { useAetherStore, Agent } from '@/lib/store/useAetherStore';

export function AuthStoreBridge() {
  const { user, googleAccessToken } = useAuth();
  const { setAgents, setUserProjects, setActiveProjectId } = useAetherStore();

  useEffect(() => {
    if (!user) {
      setAgents([]);
      setUserProjects([]);
      setActiveProjectId(null);
      return;
    }

    const q = query(collection(db, 'agents'), orderBy('name', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      try {
        const firestoreAgents = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Agent[];

        const owned = firestoreAgents.filter((agent) => agent.ownerId === user.uid);
        setAgents(owned.length > 0 ? owned : firestoreAgents);
      } catch (error) {
        console.warn('Error syncing agents:', error);
      }
    });

    return () => unsubscribe();
  }, [setActiveProjectId, setAgents, setUserProjects, user]);

  useEffect(() => {
    if (!user || !googleAccessToken) {
      setUserProjects([]);
      setActiveProjectId(null);
      return;
    }

    let cancelled = false;

    const loadProjects = async () => {
      try {
        const response = await fetch('https://cloudresourcemanager.googleapis.com/v1/projects', {
          headers: {
            Authorization: `Bearer ${googleAccessToken}`,
          },
        });
        const data = await response.json();
        if (cancelled || !data.projects) return;

        const projects = data.projects.map((project: { projectId: string; name: string }) => ({
          id: project.projectId,
          name: project.name,
        }));

        setUserProjects(projects);
        setActiveProjectId(projects[0]?.id ?? null);
      } catch (error) {
        console.warn('Project discovery failed:', error);
      }
    };

    loadProjects();

    return () => {
      cancelled = true;
    };
  }, [googleAccessToken, setActiveProjectId, setUserProjects, user]);

  return null;
}
