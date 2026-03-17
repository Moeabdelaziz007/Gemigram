import { test } from 'node:test';
import assert from 'node:assert';
import { createStore } from 'zustand/vanilla';
import { createSessionSlice, SessionSlice } from '../lib/store/slices/sessionSlice';

test('sessionSlice initial state', () => {
  const store = createStore<SessionSlice>()((set, get) => ({
    ...createSessionSlice(set, get),
  }));

  const state = store.getState();
  assert.strictEqual(state.sessionState, 'INITIALIZING');
  assert.strictEqual(state.sessionMetadata, null);
  assert.strictEqual(state.consecutiveErrors, 0);
  assert.strictEqual(state.maxConsecutiveErrors, 3);
  assert.strictEqual(state.lastSnapshot, null);
  assert.deepStrictEqual(state.stateTransitionLog, []);
});

test('sessionSlice initSession', () => {
  const store = createStore<SessionSlice>()((set, get) => ({
    ...createSessionSlice(set, get),
  }));

  store.getState().initSession('TestAgent');
  const state = store.getState();

  assert.strictEqual(state.sessionState, 'INITIALIZING');
  assert.notStrictEqual(state.sessionMetadata, null);
  assert.strictEqual(state.sessionMetadata?.activeAgentName, 'TestAgent');
  assert.strictEqual(state.sessionMetadata?.messageCount, 0);
  assert.strictEqual(state.sessionMetadata?.handoffCount, 0);
  assert.strictEqual(state.sessionMetadata?.errorCount, 0);
  assert.deepStrictEqual(state.sessionMetadata?.activeWidgets, []);
  assert.strictEqual(state.consecutiveErrors, 0);
  assert.deepStrictEqual(state.stateTransitionLog, []);
});

test('sessionSlice transitionTo - valid transition', () => {
  const store = createStore<SessionSlice>()((set, get) => ({
    ...createSessionSlice(set, get),
  }));

  store.getState().initSession('TestAgent');
  const result = store.getState().transitionTo('CONNECTED', 'Test reason');

  assert.strictEqual(result, true);

  const state = store.getState();
  assert.strictEqual(state.sessionState, 'CONNECTED');
  assert.strictEqual(state.stateTransitionLog.length, 1);
  assert.strictEqual(state.stateTransitionLog[0].from, 'INITIALIZING');
  assert.strictEqual(state.stateTransitionLog[0].to, 'CONNECTED');
  assert.strictEqual(state.stateTransitionLog[0].reason, 'Test reason');
});

test('sessionSlice transitionTo - invalid transition', () => {
  const store = createStore<SessionSlice>()((set, get) => ({
    ...createSessionSlice(set, get),
  }));

  store.getState().initSession('TestAgent');

  // INITIALIZING -> HANDING_OFF is invalid
  const result = store.getState().transitionTo('HANDING_OFF', 'Invalid reason');

  assert.strictEqual(result, false);

  const state = store.getState();
  assert.strictEqual(state.sessionState, 'INITIALIZING'); // Should remain INITIALIZING
  assert.strictEqual(state.stateTransitionLog.length, 0); // No log entry
});

test('sessionSlice error tracking', () => {
  const store = createStore<SessionSlice>()((set, get) => ({
    ...createSessionSlice(set, get),
  }));

  store.getState().initSession('TestAgent');

  // INITIALIZING -> ERROR
  store.getState().transitionTo('ERROR', 'First error');
  let state = store.getState();

  assert.strictEqual(state.consecutiveErrors, 1);
  assert.strictEqual(state.sessionMetadata?.errorCount, 1);

  // ERROR -> RECOVERING
  store.getState().transitionTo('RECOVERING', 'Recovering');
  state = store.getState();
  assert.strictEqual(state.consecutiveErrors, 1); // should still be 1, only reset on CONNECTED

  // RECOVERING -> ERROR
  store.getState().transitionTo('ERROR', 'Second error');
  state = store.getState();
  assert.strictEqual(state.consecutiveErrors, 2);
  assert.strictEqual(state.sessionMetadata?.errorCount, 2);

  // ERROR -> RECOVERING -> INITIALIZING -> CONNECTED (resets)
  store.getState().transitionTo('RECOVERING');
  store.getState().transitionTo('INITIALIZING');
  store.getState().transitionTo('CONNECTED');

  state = store.getState();
  assert.strictEqual(state.consecutiveErrors, 0); // Reset on CONNECTED
  assert.strictEqual(state.sessionMetadata?.errorCount, 2); // Total errors remains 2
});

test('sessionSlice update metadata methods', () => {
  const store = createStore<SessionSlice>()((set, get) => ({
    ...createSessionSlice(set, get),
  }));

  store.getState().initSession('TestAgent');

  store.getState().incrementMessageCount();
  store.getState().incrementMessageCount();
  store.getState().incrementHandoffCount();
  store.getState().updateActiveWidgets(['weather', 'map']);

  const state = store.getState();
  assert.strictEqual(state.sessionMetadata?.messageCount, 2);
  assert.strictEqual(state.sessionMetadata?.handoffCount, 1);
  assert.deepStrictEqual(state.sessionMetadata?.activeWidgets, ['weather', 'map']);
});

test('sessionSlice snapshots', () => {
  const store = createStore<SessionSlice>()((set, get) => ({
    ...createSessionSlice(set, get),
  }));

  store.getState().initSession('TestAgent');
  store.getState().transitionTo('CONNECTED');
  store.getState().incrementMessageCount();

  const snapshot = store.getState().createSnapshot();

  assert.strictEqual(snapshot.state, 'CONNECTED');
  assert.strictEqual(snapshot.consecutiveErrors, 0);
  assert.strictEqual(snapshot.metadata?.messageCount, 1);

  // Verify lastSnapshot is updated
  assert.deepStrictEqual(store.getState().lastSnapshot, snapshot);

  // Transition away and alter state
  store.getState().transitionTo('ERROR');
  store.getState().incrementMessageCount();

  // Restore
  const restoreResult = store.getState().restoreFromSnapshot(snapshot);
  assert.strictEqual(restoreResult, true);

  const state = store.getState();
  // restoreFromSnapshot always sets sessionState to INITIALIZING
  assert.strictEqual(state.sessionState, 'INITIALIZING');
  assert.strictEqual(state.consecutiveErrors, 0);
  // Metadata is restored
  assert.strictEqual(state.sessionMetadata?.messageCount, 1);
});

test('sessionSlice helpers: isTransitioning and shouldTriggerReconnection', () => {
  const store = createStore<SessionSlice>()((set, get) => ({
    ...createSessionSlice(set, get),
  }));

  store.getState().initSession('TestAgent');

  assert.strictEqual(store.getState().isTransitioning(), false);
  assert.strictEqual(store.getState().shouldTriggerReconnection(), false);

  // Transition to ERROR
  store.getState().transitionTo('ERROR');
  assert.strictEqual(store.getState().isTransitioning(), false);
  assert.strictEqual(store.getState().shouldTriggerReconnection(), true); // 1 error (max is 3)

  // RECOVERING is a transitioning state
  store.getState().transitionTo('RECOVERING');
  assert.strictEqual(store.getState().isTransitioning(), true);
  assert.strictEqual(store.getState().shouldTriggerReconnection(), true);

  // Max out errors
  store.getState().transitionTo('ERROR');
  store.getState().transitionTo('RECOVERING');
  store.getState().transitionTo('ERROR');

  const state = store.getState();
  assert.strictEqual(state.consecutiveErrors, 3);
  // If consecutiveErrors >= maxConsecutiveErrors, it returns false
  assert.strictEqual(store.getState().shouldTriggerReconnection(), false);
});
