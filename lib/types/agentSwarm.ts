import { AgentRole } from '@/lib/store/slices/createAgentSlice';

/**
 * 🐝 AgentSwarm Types - GemigramOS V3
 * Sovereign Intelligence Orchestration
 */

/**
 * Lifecycle state of a single agent within a swarm.
 */
export interface AgentSession {
  agentId: string;
  /** LiveKit Room ID for real-time audio/data coordination */
  liveKitRoomId: string;
  status: 'IDLE' | 'ACTIVE' | 'WAITING' | 'DONE' | 'ERROR';
  /** Goal specific to this agent instance */
  taskDescription: string;
  startedAt: number;
  completedAt?: number;
  /** JSON-stringified or descriptive results from the agent */
  outputSummary?: string;
  /** ID of another AgentSession that must complete first */
  dependsOn?: string;
}

/**
 * Orchestrator wrapper for multiple cooperating agents.
 */
export interface SwarmSession {
  /** Unique nanoid for the swarm instance */
  swarmId: string;
  /** ID of the Master/Orchestrator calling the swarm */
  orchestratorId: string;
  /** List of participating agents and their local states */
  agents: AgentSession[];
  status: 'ASSEMBLING' | 'RUNNING' | 'PARTIAL' | 'COMPLETE' | 'ABORTED';
  createdAt: number;
  completedAt?: number;
  /** Synthetic voice summary plan narrated to the user */
  voiceNarration?: string;
}

/**
 * High-level task definition sent to the Swarm Orchestrator.
 */
export interface TaskManifest {
  taskId: string;
  description: string;
  /** Suggested role to handle this task */
  assignToRole?: AgentRole;
  /** Execution deadline (default: 120000ms) */
  timeoutMs: number;
  /** List of Task IDs this task depends on */
  dependsOn?: string[];
  /** Expected JSON schema for the output */
  outputSchema?: string;
}

/**
 * Gemini Function Declaration for spawning agent swarms.
 */
export interface SpawnSwarmFunctionDeclaration {
  name: 'spawn_agent_swarm';
  description: 'Spawns a cooperating group of autonomous agents to fulfill complex concurrent tasks.';
  parameters: {
    type: 'OBJECT';
    properties: {
      tasks: {
        type: 'ARRAY';
        items: {
          type: 'OBJECT';
          properties: {
            description: { type: 'STRING' };
            role: { type: 'STRING' };
          };
          required: ['description'];
        };
      };
      urgency: {
        type: 'STRING';
        enum: ['CONCURRENT', 'SEQUENTIAL'];
      };
    };
    required: ['tasks'];
  };
}

/**
 * Final output structure when a swarm completes its cycle.
 */
export interface SwarmCompletionResult {
  swarmId: string;
  completedTasks: string[];
  failedTasks: string[];
  /** Key-value store of task IDs to their respective outputs */
  outputs: Record<string, any>;
  totalDurationMs: number;
}

/**
 * Shape of the upcoming Zustand slice for Swarm management.
 */
export interface SwarmSliceShape {
  activeSwarm: SwarmSession | null;
  swarmHistory: SwarmSession[];
  isSwarmThinking: boolean;
  spawnSwarm: (manifest: TaskManifest[]) => Promise<void>;
  abortSwarm: (swarmId: string) => void;
  updateAgentStatus: (swarmId: string, agentId: string, status: AgentSession['status']) => void;
}
