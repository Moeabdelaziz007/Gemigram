import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase';

/**
 * Agent Heartbeat System - Vital Signs Monitoring
 * 
 * Maintains agent "aliveness" by periodically updating activity timestamps
 * and monitoring health status in Firestore.
 */

interface HeartbeatConfig {
  intervalMs?: number;        // How often to send heartbeat (default: 30s)
  timeoutMs?: number;         // Time before considered offline (default: 5min)
  autoStart?: boolean;        // Start immediately (default: true)
}

/**
 * Start heartbeat monitoring for an agent
 * Updates lastActive timestamp every 30 seconds
 * 
 * @param agentId - Unique agent identifier
 * @param config - Optional configuration
 * @returns Cleanup function to stop heartbeat
 */
export async function startAgentHeartbeat(
  agentId: string, 
  config: HeartbeatConfig = {}
): Promise<() => void> {
  const {
    intervalMs = 30000,      // 30 seconds
    autoStart = true
  } = config;

  let intervalId: NodeJS.Timeout | null = null;
  let isActive = true;
  let channel: BroadcastChannel | null = null;

  const getAgentFailures = async (id: string): Promise<number> => {
    try {
      const { getDoc } = await import('firebase/firestore');
      const agentRef = doc(db, 'agents', id);
      const snap = await getDoc(agentRef);
      return snap.data()?.healthMetrics?.consecutiveFailures || 0;
    } catch {
      return 0;
    }
  };

  // Initialize BroadcastChannel for tab coordination
  if (typeof window !== 'undefined') {
    channel = new BroadcastChannel(`heartbeat-${agentId}`);
    channel.onmessage = (event) => {
      if (event.data.type === 'ALIVE' && event.data.tabId !== window.name) {
        // Another tab is already handling this agent
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
          // console.log(`[Heartbeat] Yielding ${agentId} to another tab`);
        }
      } else if (event.data.type === 'YIELDING' && event.data.agentId === agentId) {
        // Tab that was handling it is closing, take over if we are active
        if (!intervalId && isActive && !document.hidden) {
          intervalId = setInterval(sendHeartbeat, intervalMs);
          void sendHeartbeat();
        }
      }
    };
  }

  const sendHeartbeat = async () => {
    if (!isActive || (typeof document !== 'undefined' && document.hidden)) return;

    try {
      const agentRef = doc(db, 'agents', agentId);
      
      await updateDoc(agentRef, {
        lastActive: serverTimestamp(),
        heartbeatStatus: 'alive',
        healthMetrics: {
          uptime: Date.now(),
          lastCheck: serverTimestamp(),
          consecutiveFailures: 0
        }
      });

      // Broadcast presence to other tabs
      channel?.postMessage({ type: 'ALIVE', agentId, tabId: typeof window !== 'undefined' ? window.name : 'server' });
    } catch (error) {
      console.error('[Heartbeat] Failed to send pulse:', error);
      
      try {
        const agentRef = doc(db, 'agents', agentId);
        await updateDoc(agentRef, {
          heartbeatStatus: 'unreachable',
          'healthMetrics.consecutiveFailures': (await getAgentFailures(agentId)) + 1
        });
      } catch (secondaryError) {
        console.error('[Heartbeat] Failed to update status:', secondaryError);
      }
    }
  };

  const setupVisibilityListeners = () => {
    if (typeof document === 'undefined') return;
    
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
      } else if (!intervalId && isActive) {
        intervalId = setInterval(sendHeartbeat, intervalMs);
        void sendHeartbeat();
      }
    });
  };

  if (autoStart) {
    if (typeof document !== 'undefined' && !document.hidden) {
      await sendHeartbeat();
      intervalId = setInterval(sendHeartbeat, intervalMs);
    }
    setupVisibilityListeners();
  }

  return () => {
    isActive = false;
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    channel?.postMessage({ type: 'YIELDING', agentId });
    channel?.close();
  };
}

/**
 * Check if an agent is alive based on last heartbeat
 * 
 * @param agentId - Unique agent identifier  
 * @param timeoutMs - Custom timeout threshold (default: 5min)
 * @returns true if agent is alive, false otherwise
 */
export async function isAgentAlive(
  agentId: string, 
  timeoutMs: number = 300000
): Promise<boolean> {
  try {
    const { getDoc } = await import('firebase/firestore');
    const agentRef = doc(db, 'agents', agentId);
    const agentSnap = await getDoc(agentRef);

    if (!agentSnap.exists()) {
      return false;
    }

    const data = agentSnap.data();
    const lastActive = data?.lastActive?.toDate();
    
    if (!lastActive) {
      return false;
    }

    const now = new Date();
    const timeSinceActive = now.getTime() - lastActive.getTime();
    
    return timeSinceActive < timeoutMs;
  } catch (error) {
    console.error('[Heartbeat] Failed to check agent status:', error);
    return false;
  }
}

/**
 * Get detailed agent health metrics
 */
export interface AgentHealthMetrics {
  status: 'alive' | 'unreachable' | 'offline';
  lastActive: Date | null;
  uptime: number;
  consecutiveFailures: number;
  healthScore: number;  // 0-100
}

export async function getAgentHealth(agentId: string): Promise<AgentHealthMetrics> {
  try {
    const { getDoc } = await import('firebase/firestore');
    const agentRef = doc(db, 'agents', agentId);
    const agentSnap = await getDoc(agentRef);

    if (!agentSnap.exists()) {
      return {
        status: 'offline',
        lastActive: null,
        uptime: 0,
        consecutiveFailures: 0,
        healthScore: 0
      };
    }

    const data = agentSnap.data();
    const lastActive = data?.lastActive?.toDate() || null;
    const healthMetrics = data?.healthMetrics || {};
    const status = data?.heartbeatStatus || 'offline';

    // Calculate health score (0-100)
    let healthScore = 100;
    
    if (status === 'unreachable') {
      healthScore -= 50;
    } else if (status === 'offline') {
      healthScore = 0;
    }

    if (healthMetrics.consecutiveFailures > 0) {
      healthScore -= Math.min(50, healthMetrics.consecutiveFailures * 10);
    }

    if (lastActive) {
      const minutesSinceActive = (Date.now() - lastActive.getTime()) / 60000;
      if (minutesSinceActive > 5) {
        healthScore -= Math.min(50, (minutesSinceActive - 5) * 2);
      }
    }

    healthScore = Math.max(0, Math.min(100, healthScore));

    return {
      status: status as 'alive' | 'unreachable' | 'offline',
      lastActive,
      uptime: healthMetrics.uptime || 0,
      consecutiveFailures: healthMetrics.consecutiveFailures || 0,
      healthScore
    };
  } catch (error) {
    console.error('[Heartbeat] Failed to get agent health:', error);
    return {
      status: 'offline',
      lastActive: null,
      uptime: 0,
      consecutiveFailures: 0,
      healthScore: 0
    };
  }
}

/**
 * Stop all heartbeats (for cleanup on app unload)
 */
export function stopAllHeartbeats(): void {
  // console.log('[Heartbeat] Stopping all agent monitors');
  // In a real app, we'd track all intervals and clear them
  // For now, browser cleanup will handle this
}

// Auto-cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    stopAllHeartbeats();
  });
}
