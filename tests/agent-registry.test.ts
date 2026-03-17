import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';
import { AgentRegistry, AgentManifest } from '../lib/agents/AgentRegistry';

describe('AgentRegistry', () => {
  let registry: AgentRegistry;

  const mockAgent1: AgentManifest = {
    id: 'agent-1',
    name: 'Test Agent 1',
    role: 'tester',
    systemPrompt: 'You are a test agent',
    voiceName: 'echo',
    capabilities: ['search', 'calculate']
  };

  const mockAgent2: AgentManifest = {
    id: 'agent-2',
    name: 'Test Agent 2',
    role: 'writer',
    systemPrompt: 'You are a writer agent',
    voiceName: 'alloy',
    capabilities: ['write', 'search']
  };

  beforeEach(() => {
    registry = AgentRegistry.getInstance();
    // Clean up any existing agents before each test
    registry.listAgents().forEach(agent => registry.unregisterAgent(agent.id));
  });

  it('should be a singleton', () => {
    const instance1 = AgentRegistry.getInstance();
    const instance2 = AgentRegistry.getInstance();
    assert.strictEqual(instance1, instance2);
  });

  it('should register and retrieve an agent', () => {
    registry.registerAgent(mockAgent1);

    const retrievedAgent = registry.getAgent('agent-1');
    assert.deepStrictEqual(retrievedAgent, mockAgent1);
  });

  it('should list all registered agents', () => {
    registry.registerAgent(mockAgent1);
    registry.registerAgent(mockAgent2);

    const agents = registry.listAgents();
    assert.strictEqual(agents.length, 2);
    assert.ok(agents.some(a => a.id === 'agent-1'));
    assert.ok(agents.some(a => a.id === 'agent-2'));
  });

  it('should unregister an agent', () => {
    registry.registerAgent(mockAgent1);
    assert.strictEqual(registry.listAgents().length, 1);

    const result = registry.unregisterAgent('agent-1');
    assert.strictEqual(result, true);
    assert.strictEqual(registry.listAgents().length, 0);
    assert.strictEqual(registry.getAgent('agent-1'), undefined);
  });

  it('should return false when unregistering non-existent agent', () => {
    const result = registry.unregisterAgent('non-existent');
    assert.strictEqual(result, false);
  });

  it('should find agents by capability', () => {
    registry.registerAgent(mockAgent1); // capabilities: ['search', 'calculate']
    registry.registerAgent(mockAgent2); // capabilities: ['write', 'search']

    const searchAgents = registry.findAgentsByCapability('search');
    assert.strictEqual(searchAgents.length, 2);

    const calculateAgents = registry.findAgentsByCapability('calculate');
    assert.strictEqual(calculateAgents.length, 1);
    assert.strictEqual(calculateAgents[0].id, 'agent-1');

    const codeAgents = registry.findAgentsByCapability('code');
    assert.strictEqual(codeAgents.length, 0);
  });
});
