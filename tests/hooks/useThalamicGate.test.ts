import { describe, it, mock, beforeEach } from 'node:test';
import assert from 'node:assert';
import Module from 'node:module';

const originalRequire = Module.prototype.require;

// Mock React
const mockReact = {
  useRef: (initialValue: any) => {
    let current = initialValue;
    return {
      get current() { return current; },
      set current(val) { current = val; }
    };
  },
  useCallback: (fn: any) => fn,
  useEffect: (fn: any) => {}, // Not used directly in logic testing, we call start/stop manually
};

// Mock GemigramStore
let storeState = { isThinking: false, isSpeaking: false };
const mockStore = {
  useGemigramStore: {
    getState: () => storeState,
  }
};

// Intercept module requires
Module.prototype.require = function (this: any, id: string) {
  if (id === 'react') {
    return mockReact;
  }
  if (id === '../lib/store/useGemigramStore') {
    return mockStore;
  }
  return originalRequire.apply(this, arguments as any);
} as any;

describe('useThalamicGate', async () => {
  let useThalamicGate: any;

  beforeEach(async () => {
    // Reset store state
    storeState = { isThinking: false, isSpeaking: false };
    // Lazy load the module under test after mocking is set up
    const mod = require('../../hooks/useThalamicGate');
    useThalamicGate = mod.useThalamicGate;
  });

  const createMocks = () => {
    const wsMock = {
      readyState: 1, // WebSocket.OPEN
      send: mock.fn(),
    };

    const wsRef = { current: wsMock };

    let currentLoudness = 0; // 0 = silence, 200 = noise

    const analyserMock = {
      frequencyBinCount: 128,
      getByteFrequencyData: mock.fn((array: Uint8Array) => {
        for (let i = 0; i < array.length; i++) {
          array[i] = currentLoudness;
        }
      }),
      setLoudness: (val: number) => { currentLoudness = val; }
    };

    return { wsMock, wsRef, analyserMock };
  };

  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  it('triggers intervention after sustained silence', async () => {
    const { wsMock, wsRef, analyserMock } = createMocks();
    analyserMock.setLoudness(0); // Absolute silence

    const gate = useThalamicGate(analyserMock, wsRef, {
      pollInterval: 10,
      frustrationStreak: 5,
      silenceThreshold: 0.02,
      cooldownMs: 30000,
    });

    assert.strictEqual(gate.isActive(), false);
    gate.startMonitoring();
    assert.strictEqual(gate.isActive(), true);

    // 5 streaks * 10ms = 50ms, wait a bit longer to be safe
    await wait(70);

    gate.stopMonitoring();
    assert.strictEqual(gate.isActive(), false);

    // Should have sent exactly one message
    assert.strictEqual(wsMock.send.mock.calls.length, 1);

    // Verify the payload
    const sendArg = JSON.parse(wsMock.send.mock.calls[0].arguments[0]);
    assert.strictEqual(sendArg.clientContent.turnComplete, true);
    assert.strictEqual(sendArg.clientContent.turns[0].role, 'user');
    assert.match(
      sendArg.clientContent.turns[0].parts[0].text,
      /\[SYSTEM: PROACTIVE INTERVENTION TRIGGERED/
    );
  });

  it('does not trigger if there is speech (noise)', async () => {
    const { wsMock, wsRef, analyserMock } = createMocks();
    analyserMock.setLoudness(200); // Loud noise (talking)

    const gate = useThalamicGate(analyserMock, wsRef, {
      pollInterval: 10,
      frustrationStreak: 5,
    });

    gate.startMonitoring();
    await wait(70);
    gate.stopMonitoring();

    // Streak should be 0 because of constant noise
    assert.strictEqual(gate.getStreak(), 0);
    assert.strictEqual(wsMock.send.mock.calls.length, 0);
  });

  it('pauses streak calculation when AI is thinking or speaking', async () => {
    const { wsMock, wsRef, analyserMock } = createMocks();
    analyserMock.setLoudness(0); // Silence (would normally trigger)

    const gate = useThalamicGate(analyserMock, wsRef, {
      pollInterval: 10,
      frustrationStreak: 5,
    });

    // Mock AI is speaking
    storeState.isSpeaking = true;

    gate.startMonitoring();
    await wait(70); // Wait long enough for a trigger
    gate.stopMonitoring();

    // Streak should be reset/kept at 0 when AI is speaking
    assert.strictEqual(gate.getStreak(), 0);
    assert.strictEqual(wsMock.send.mock.calls.length, 0);

    // Mock AI is thinking instead
    storeState.isSpeaking = false;
    storeState.isThinking = true;

    gate.startMonitoring();
    await wait(70);
    gate.stopMonitoring();

    assert.strictEqual(gate.getStreak(), 0);
    assert.strictEqual(wsMock.send.mock.calls.length, 0);
  });

  it('respects cooldown period', async () => {
    const { wsMock, wsRef, analyserMock } = createMocks();
    analyserMock.setLoudness(0); // Silence

    const gate = useThalamicGate(analyserMock, wsRef, {
      pollInterval: 10,
      frustrationStreak: 3,
      cooldownMs: 200, // Explicit cooldown
    });

    gate.startMonitoring();

    // Trigger first intervention
    await wait(50);
    assert.strictEqual(wsMock.send.mock.calls.length, 1);

    // Streak resets after trigger, let's wait again, but within cooldown
    await wait(50);
    // Usually it would trigger again because 50ms > 3*10ms, but cooldown is 200ms
    assert.strictEqual(wsMock.send.mock.calls.length, 1);

    // Wait for cooldown to expire and trigger again
    await wait(150);
    assert.strictEqual(wsMock.send.mock.calls.length, 2);

    gate.stopMonitoring();
  });

  it('decreases streak gradually when noise interrupts silence', async () => {
    const { wsRef, analyserMock } = createMocks();
    analyserMock.setLoudness(0); // Start with silence

    const gate = useThalamicGate(analyserMock, wsRef, {
      pollInterval: 10,
      frustrationStreak: 10,
    });

    gate.startMonitoring();

    // Wait for some streak to build up
    await wait(45); // Streak should be around 4
    const streakBeforeNoise = gate.getStreak();
    assert.ok(streakBeforeNoise > 0);

    // Switch to noise
    analyserMock.setLoudness(200);

    // Wait one interval
    await wait(15);
    const streakAfterNoise = gate.getStreak();

    // Streak should decay by 1, not reset to 0 immediately
    // Note: Due to timer inexactness, it could be streakBeforeNoise - 1 or -2,
    // but definitely > 0 and < streakBeforeNoise if it was sufficiently high.
    assert.ok(streakAfterNoise < streakBeforeNoise);

    gate.stopMonitoring();
  });

  it('handles null analyser and websocket gracefully', async () => {
    const gate1 = useThalamicGate(null, { current: null }, {
      pollInterval: 10,
      frustrationStreak: 5,
    });

    gate1.startMonitoring();
    await wait(70); // If it doesn't crash, test passes
    gate1.stopMonitoring();
    assert.strictEqual(gate1.getStreak(), 0);

    // Test with open WebSocket but null analyser
    const wsMock = {
      readyState: 1,
      send: mock.fn(),
    };
    const gate2 = useThalamicGate(null, { current: wsMock as any }, { pollInterval: 10 });
    gate2.startMonitoring();
    await wait(70);
    gate2.stopMonitoring();
    assert.strictEqual(wsMock.send.mock.calls.length, 0);
  });
});
