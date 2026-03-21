import { StateCreator } from 'zustand';
import { SwarmSliceShape, SwarmSession, AgentSession, TaskManifest } from '../../types/agentSwarm';
import { nanoid } from 'nanoid';

export interface SwarmSlice extends SwarmSliceShape {
  // Swarm orchestration state
  isSwarmActive?: boolean;
}

export const createSwarmSlice: StateCreator<SwarmSlice> = (set, _get) => ({
  activeSwarm: null,
  swarmHistory: [],
  isSwarmThinking: false,

  spawnSwarm: async (manifest: TaskManifest[]) => {
    const swarmId = nanoid();
    const orchestratorId = 'master-orchestrator'; // Default for system-spawned

    const agents: AgentSession[] = manifest.map((task) => ({
      agentId: nanoid(8),
      liveKitRoomId: `room-${swarmId}-${task.taskId}`,
      status: 'IDLE',
      taskDescription: task.description,
      startedAt: Date.now(),
      dependsOn: task.dependsOn?.[0], // Simplification for MVP
    }));

    const newSwarm: SwarmSession = {
      swarmId,
      orchestratorId,
      agents,
      status: 'ASSEMBLING' as const,
      createdAt: Date.now(),
      voiceNarration: `Assembling swarm ${swarmId} to handle ${manifest.length} concurrent tasks.`
    };

    set({ activeSwarm: newSwarm, isSwarmThinking: true });

    // Simulate allocation latency
    setTimeout(() => {
      set((state) => {
        if (!state.activeSwarm) return state;
        return {
          activeSwarm: { ...state.activeSwarm, status: 'RUNNING' }
        };
      });
    }, 1500);
  },

  abortSwarm: (swarmId) => {
    set((state) => {
      if (state.activeSwarm?.swarmId !== swarmId) return state;
      const aborted: SwarmSession = { ...state.activeSwarm!, status: 'ABORTED' as const, completedAt: Date.now() };
      return {
        activeSwarm: null,
        swarmHistory: [aborted, ...state.swarmHistory].slice(0, 10),
        isSwarmThinking: false
      };
    });
  },

  updateAgentStatus: (swarmId, agentId, status) => {
    set((state) => {
      if (state.activeSwarm?.swarmId !== swarmId) return state;
      
      const newAgents = state.activeSwarm.agents.map(a => 
        a.agentId === agentId ? { ...a, status, completedAt: status === 'DONE' ? Date.now() : a.completedAt } : a
      );

      const allDone = newAgents.every(a => a.status === 'DONE');
      
      const updatedSwarm: SwarmSession = {
        ...state.activeSwarm,
        agents: newAgents,
        status: allDone ? ('COMPLETE' as const) : state.activeSwarm.status,
        completedAt: allDone ? Date.now() : undefined
      };

      if (allDone) {
        return {
          activeSwarm: null,
          swarmHistory: [updatedSwarm, ...state.swarmHistory].slice(0, 10),
          isSwarmThinking: false
        };
      }

      return { activeSwarm: updatedSwarm };
    });
  }
});
