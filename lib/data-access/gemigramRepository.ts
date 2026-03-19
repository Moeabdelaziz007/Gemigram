import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
  type QueryConstraint,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from '@/firebase';
import type { Agent } from '@/lib/store/useGemigramStore';
import type { Notification } from '@/lib/types/models';

const buildQuery = (collectionName: string, constraints: QueryConstraint[]) =>
  query(collection(db, collectionName), ...constraints);

export function subscribeToUserAgents(
  userId: string,
  onData: (agents: Agent[]) => void,
  onError?: (error: unknown) => void,
): Unsubscribe {
  const agentsQuery = buildQuery('agents', [
    where('ownerId', '==', userId),
    orderBy('name', 'asc'),
  ]);

  return onSnapshot(
    agentsQuery,
    (snapshot) => {
      onData(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Agent));
    },
    onError,
  );
}

export function subscribeToUnreadNotifications(
  userId: string,
  onData: (notifications: Notification[]) => void,
  onError?: (error: unknown) => void,
): Unsubscribe {
  const notificationsQuery = buildQuery('notifications', [
    where('userId', '==', userId),
    where('read', '==', false),
  ]);

  return onSnapshot(
    notificationsQuery,
    (snapshot) => {
      onData(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Notification));
    },
    onError,
  );
}

export async function fetchGoogleCloudProjects(accessToken: string) {
  const response = await fetch('https://cloudresourcemanager.googleapis.com/v1/projects', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Project discovery failed with status ${response.status}`);
  }

  const data = await response.json();

  return Array.isArray(data.projects)
    ? data.projects.map((project: { projectId: string; name: string }) => ({
        id: project.projectId,
        name: project.name,
      }))
    : [];
}
export async function saveAgent(agent: Agent, userId: string) {
  const agentRef = doc(db, 'agents', agent.id);
  await setDoc(agentRef, {
    ...agent,
    ownerId: userId,
    updatedAt: Timestamp.now()
  }, { merge: true });
}
