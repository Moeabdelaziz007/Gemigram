import { test } from 'node:test';
import assert from 'node:assert';
import { createStore } from 'zustand/vanilla';
import { createTelemetrySlice, TelemetrySlice } from '../lib/store/slices/telemetrySlice';

test('telemetrySlice initial state', () => {
  const store = createStore<TelemetrySlice>()((set, get) => ({
    ...createTelemetrySlice(set, get),
  }));

  const state = store.getState();
  assert.strictEqual(state.micLevel, 0);
  assert.strictEqual(state.speakerLevel, 0);
  assert.strictEqual(state.latencyMs, 0);
  assert.strictEqual(state.isVisionActive, false);
  assert.strictEqual(state.lastVisionPulse, 0);
  assert.strictEqual(state.frustrationScore, 0);
  assert.strictEqual(state.tokenBudget, 1_000_000);
  assert.strictEqual(state.tokensUsed, 0);
});

test('telemetrySlice setMicLevel', () => {
  const store = createStore<TelemetrySlice>()((set, get) => ({
    ...createTelemetrySlice(set, get),
  }));

  // Valid level
  store.getState().setMicLevel(0.5);
  assert.strictEqual(store.getState().micLevel, 0.5);

  // Clamp below 0
  store.getState().setMicLevel(-0.1);
  assert.strictEqual(store.getState().micLevel, 0);

  // Clamp above 1
  store.getState().setMicLevel(1.5);
  assert.strictEqual(store.getState().micLevel, 1);
});

test('telemetrySlice setSpeakerLevel', () => {
  const store = createStore<TelemetrySlice>()((set, get) => ({
    ...createTelemetrySlice(set, get),
  }));

  // Valid level
  store.getState().setSpeakerLevel(0.75);
  assert.strictEqual(store.getState().speakerLevel, 0.75);

  // Clamp below 0
  store.getState().setSpeakerLevel(-0.5);
  assert.strictEqual(store.getState().speakerLevel, 0);

  // Clamp above 1
  store.getState().setSpeakerLevel(2);
  assert.strictEqual(store.getState().speakerLevel, 1);
});

test('telemetrySlice setLatencyMs', () => {
  const store = createStore<TelemetrySlice>()((set, get) => ({
    ...createTelemetrySlice(set, get),
  }));

  // Valid latency
  store.getState().setLatencyMs(150);
  assert.strictEqual(store.getState().latencyMs, 150);

  // Clamp below 0
  store.getState().setLatencyMs(-50);
  assert.strictEqual(store.getState().latencyMs, 0);
});

test('telemetrySlice setVisionActive', () => {
  const store = createStore<TelemetrySlice>()((set, get) => ({
    ...createTelemetrySlice(set, get),
  }));

  store.getState().setVisionActive(true);
  assert.strictEqual(store.getState().isVisionActive, true);

  store.getState().setVisionActive(false);
  assert.strictEqual(store.getState().isVisionActive, false);
});

test('telemetrySlice setLastVisionPulse', () => {
  const store = createStore<TelemetrySlice>()((set, get) => ({
    ...createTelemetrySlice(set, get),
  }));

  const now = Date.now();
  store.getState().setLastVisionPulse(now);
  assert.strictEqual(store.getState().lastVisionPulse, now);
});

test('telemetrySlice setFrustrationScore', () => {
  const store = createStore<TelemetrySlice>()((set, get) => ({
    ...createTelemetrySlice(set, get),
  }));

  // Valid score
  store.getState().setFrustrationScore(0.3);
  assert.strictEqual(store.getState().frustrationScore, 0.3);

  // Clamp below 0
  store.getState().setFrustrationScore(-0.2);
  assert.strictEqual(store.getState().frustrationScore, 0);

  // Clamp above 1
  store.getState().setFrustrationScore(1.1);
  assert.strictEqual(store.getState().frustrationScore, 1);
});

test('telemetrySlice trackTokenUsage', () => {
  const store = createStore<TelemetrySlice>()((set, get) => ({
    ...createTelemetrySlice(set, get),
  }));

  // Initial tracking
  store.getState().trackTokenUsage(500);
  assert.strictEqual(store.getState().tokensUsed, 500);

  // Incremental tracking
  store.getState().trackTokenUsage(1500);
  assert.strictEqual(store.getState().tokensUsed, 2000);

  // Trigger warning threshold (> 90%)
  // Original console.warn needs to be temporarily mocked or ignored, it shouldn't fail the test
  const originalWarn = console.warn;
  let warnCalled = false;
  console.warn = () => { warnCalled = true; };

  store.getState().trackTokenUsage(900_000); // Total now 902,000 > 900,000 (90%)
  assert.strictEqual(store.getState().tokensUsed, 902_000);
  assert.strictEqual(warnCalled, true);

  console.warn = originalWarn; // Restore original console.warn
});

test('telemetrySlice resetTelemetry', () => {
  const store = createStore<TelemetrySlice>()((set, get) => ({
    ...createTelemetrySlice(set, get),
  }));

  // Modify state
  store.getState().setMicLevel(0.8);
  store.getState().setLatencyMs(200);
  store.getState().setVisionActive(true);
  store.getState().trackTokenUsage(5000);

  // Reset
  store.getState().resetTelemetry();

  const state = store.getState();
  assert.strictEqual(state.micLevel, 0);
  assert.strictEqual(state.latencyMs, 0);
  assert.strictEqual(state.isVisionActive, false);
  assert.strictEqual(state.tokensUsed, 0);
  assert.strictEqual(state.tokenBudget, 1_000_000); // verify budget is intact
});
