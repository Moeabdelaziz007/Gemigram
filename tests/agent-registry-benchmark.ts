import { test } from 'node:test';
import assert from 'node:assert';
import module from 'node:module';

// The memory tells us that t.mock.module fails with tsx, we need to use require cache interception
const originalRequire = module.Module.prototype.require;
(module.Module.prototype as any).require = function(id: string) {
  if (id === 'firebase/firestore') {
    return {
      getDocs: async () => {
        (global as any).getDocsCount = ((global as any).getDocsCount || 0) + 1;
        // Simulate network delay
        await new Promise(r => setTimeout(r, 50));
        return {
          docs: [
            { id: '1', data: () => ({ name: 'Agent 1' }) },
            { id: '2', data: () => ({ name: 'Agent 2' }) }
          ]
        };
      },
      onSnapshot: (query: any, callback: any) => {
        (global as any).onSnapshotCount = ((global as any).onSnapshotCount || 0) + 1;
        setTimeout(() => {
          callback({
            docs: [
              { id: '1', data: () => ({ name: 'Agent 1' }) },
              { id: '2', data: () => ({ name: 'Agent 2' }) }
            ]
          });
        }, 50);
        return () => {};
      },
      collection: () => ({}),
      query: () => ({}),
      orderBy: () => ({}),
      getFirestore: () => ({})
    };
  }
  // Make sure we match exactly the import in AgentRegistry.ts (`import { db } from '@/firebase';`)
  if (id === '@/firebase' || id.endsWith('/firebase')) {
    return {
      db: { type: 'mock-db' },
      app: {}
    };
  }
  return originalRequire.apply(this, arguments as any);
};

test('AgentRegistry syncWithFirestore performance benchmark', async () => {
  const { AgentRegistry } = await import('../lib/agents/AgentRegistry');
  const registry = AgentRegistry.getInstance();

  (global as any).getDocsCount = 0;
  (global as any).onSnapshotCount = 0;

  const iterations = 5;
  const startTime = Date.now();

  for (let i = 0; i < iterations; i++) {
    await registry.syncWithFirestore();
  }

  const endTime = Date.now();
  const duration = endTime - startTime;

  console.log('\n--- BENCHMARK RESULTS ---');
  console.log(`Iterations: ${iterations}`);
  console.log(`Total duration: ${duration}ms`);
  console.log(`Average per call: ${duration / iterations}ms`);
  console.log(`getDocs calls: ${(global as any).getDocsCount}`);
  console.log(`onSnapshot calls: ${(global as any).onSnapshotCount}`);
  console.log('-------------------------\n');
});
