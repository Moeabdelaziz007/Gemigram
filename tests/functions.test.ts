import test from 'node:test';
import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import module from 'node:module';

// We MUST use require instead of import for modules that are mocked
// by intercepting `module.Module.prototype.require`, otherwise TSX/ESM loader
// bypasses our monkeypatch and fails with MODULE_NOT_FOUND.

const originalRequire = module.Module.prototype.require;

// Variables to track mocked interactions
let mockSpawnChild: any = null;
let mockSpawnArgs: any = null;
let shouldThrowSpawn = false;
let authShouldFail = false;

// Mock implementations
const mockAdminAuth = {
  verifyIdToken: async (token: string) => {
    if (authShouldFail || token !== 'valid-token') {
      throw new Error('Invalid token');
    }
    return { uid: 'user123' };
  }
};

const mockAdmin = {
  apps: [],
  initializeApp: () => {},
  auth: () => mockAdminAuth
};

const mockChildProcess = {
  spawn: (command: string, args: string[]) => {
    if (shouldThrowSpawn) {
      const err = new Error('Spawn failed critically');
      throw err;
    }
    mockSpawnArgs = { command, args };
    const child = new EventEmitter() as any;
    child.stdout = new EventEmitter();
    child.stderr = new EventEmitter();
    mockSpawnChild = child;
    return child;
  }
};

const mockFunctionsHttps = {
  onRequest: (opts: any, handler: any) => typeof opts === 'function' ? opts : handler
};

// Monkey-patch require BEFORE requiring any local modules
module.Module.prototype.require = function (id: string) {
  if (id === 'firebase-admin') {
    return mockAdmin;
  }
  if (id === 'child_process' || id === 'node:child_process') {
    return mockChildProcess;
  }
  if (id.includes('firebase-functions/v2/https')) {
    return mockFunctionsHttps;
  }

  return originalRequire.apply(this, arguments as any);
};

// Use require to load the module under test!
const { executeAgentTool } = require('../functions/src/index.ts');

test('executeAgentTool function', async (t) => {
  t.afterEach(() => {
    mockSpawnChild = null;
    mockSpawnArgs = null;
    shouldThrowSpawn = false;
    authShouldFail = false;
  });

  await t.test('handles CORS OPTIONS request', async () => {
    let statusCode: number | undefined;
    let sentData: any = null;
    const headers: Record<string, string> = {};

    const req = {
      method: 'OPTIONS',
      headers: {},
      body: {}
    };

    const res = {
      set: (key: string, value: string) => { headers[key] = value; },
      status: (code: number) => { statusCode = code; return res; },
      send: (data: any) => { sentData = data; }
    };

    await executeAgentTool(req, res);

    assert.equal(headers['Access-Control-Allow-Origin'], '*');
    assert.equal(headers['Access-Control-Allow-Methods'], 'POST');
    assert.equal(headers['Access-Control-Allow-Headers'], 'Content-Type, Authorization');
    assert.equal(statusCode, 204);
    assert.equal(sentData, '');
  });

  await t.test('returns 401 when auth header is missing', async () => {
    let statusCode: number | undefined;
    let jsonData: any = null;

    const req = { method: 'POST', headers: {}, body: {} };

    const res = {
      set: () => {},
      status: (code: number) => { statusCode = code; return res; },
      json: (data: any) => { jsonData = data; }
    };

    await executeAgentTool(req, res);

    assert.equal(statusCode, 401);
    assert.deepEqual(jsonData, { status: "error", message: "Unauthorized. Missing Bearer token." });
  });

  await t.test('returns 401 when token is invalid', async () => {
    let statusCode: number | undefined;
    let jsonData: any = null;

    authShouldFail = true;

    const req = { method: 'POST', headers: { authorization: 'Bearer invalid-token' }, body: {} };

    const res = {
      set: () => {},
      status: (code: number) => { statusCode = code; return res; },
      json: (data: any) => { jsonData = data; }
    };

    await executeAgentTool(req, res);

    assert.equal(statusCode, 401);
    assert.deepEqual(jsonData, { status: "error", message: "Unauthorized. Invalid token." });
  });

  await t.test('returns 400 when toolName is missing', async () => {
    let statusCode: number | undefined;
    let jsonData: any = null;

    const req = {
      method: 'POST',
      headers: { authorization: 'Bearer valid-token' },
      body: { action: 'list' }
    };

    const res = {
      set: () => {},
      status: (code: number) => { statusCode = code; return res; },
      json: (data: any) => { jsonData = data; }
    };

    const promise = executeAgentTool(req, res);
    await new Promise(r => setTimeout(r, 0));

    assert.equal(statusCode, 400);
    assert.deepEqual(jsonData, { status: "error", message: "Missing toolName substrate." });
  });

  await t.test('returns 400 when toolName is unknown', async () => {
    let statusCode: number | undefined;
    let jsonData: any = null;

    const req = {
      method: 'POST',
      headers: { authorization: 'Bearer valid-token' },
      body: { toolName: 'workspace_invalid', action: 'list' }
    };

    const res = {
      set: () => {},
      status: (code: number) => { statusCode = code; return res; },
      json: (data: any) => { jsonData = data; }
    };

    const promise = executeAgentTool(req, res);
    await new Promise(r => setTimeout(r, 0));

    assert.equal(statusCode, 400);
    assert.deepEqual(jsonData, { status: "error", message: "Unknown toolName substrate." });
  });

  await t.test('executes email manager command with JSON output', async () => {
    let statusCode: number | undefined;
    let jsonData: any = null;

    const req = {
      method: 'POST',
      headers: { authorization: 'Bearer valid-token' },
      body: {
        toolName: 'workspace_email_manager',
        action: 'send',
        params: { to: 'test@example.com', subject: 'Hello' }
      }
    };

    const res = {
      set: () => {},
      status: (code: number) => { statusCode = code; return res; },
      json: (data: any) => { jsonData = data; }
    };

    const promise = executeAgentTool(req, res);
    await new Promise(r => setTimeout(r, 0));

    assert.ok(mockSpawnChild, 'spawn should be called');
    assert.deepEqual(mockSpawnArgs, {
      command: 'gws',
      args: ['gmail', '+send', '--to', 'test@example.com', '--subject', 'Hello']
    });

    mockSpawnChild.stdout.emit('data', Buffer.from('{"id":"1234"}'));
    mockSpawnChild.emit('close', 0);

    await promise;

    assert.deepEqual(jsonData, {
      status: 'success',
      toolName: 'workspace_email_manager',
      action: 'send',
      data: { id: '1234' }
    });
  });

  await t.test('executes calendar manager command with raw string output', async () => {
    let statusCode: number | undefined;
    let jsonData: any = null;

    const req = {
      method: 'POST',
      headers: { authorization: 'Bearer valid-token' },
      body: {
        toolName: 'workspace_calendar_manager',
        action: 'agenda'
      }
    };

    const res = {
      set: () => {},
      status: (code: number) => { statusCode = code; return res; },
      json: (data: any) => { jsonData = data; }
    };

    const promise = executeAgentTool(req, res);
    await new Promise(r => setTimeout(r, 0));

    assert.ok(mockSpawnChild, 'spawn should be called');
    assert.deepEqual(mockSpawnArgs, {
      command: 'gws',
      args: ['calendar', '+agenda']
    });

    mockSpawnChild.stdout.emit('data', Buffer.from('Listed 5 items'));
    mockSpawnChild.emit('close', 0);

    await promise;

    assert.deepEqual(jsonData, {
      status: 'success',
      toolName: 'workspace_calendar_manager',
      action: 'agenda',
      rawOutput: 'Listed 5 items'
    });
  });

  await t.test('executes tasks manager command successfully', async () => {
    let statusCode: number | undefined;
    let jsonData: any = null;

    const req = {
      method: 'POST',
      headers: { authorization: 'Bearer valid-token' },
      body: {
        toolName: 'workspace_tasks_manager',
        action: 'add',
        params: { title: 'Buy milk' }
      }
    };

    const res = {
      set: () => {},
      status: (code: number) => { statusCode = code; return res; },
      json: (data: any) => { jsonData = data; }
    };

    const promise = executeAgentTool(req, res);
    await new Promise(r => setTimeout(r, 0));

    assert.ok(mockSpawnChild, 'spawn should be called');
    assert.deepEqual(mockSpawnArgs, {
      command: 'gws',
      args: ['tasks', 'add', '--title', 'Buy milk']
    });

    mockSpawnChild.stdout.emit('data', Buffer.from('{"status":"ok"}'));
    mockSpawnChild.emit('close', 0);

    await promise;

    assert.deepEqual(jsonData, {
      status: 'success',
      toolName: 'workspace_tasks_manager',
      action: 'add',
      data: { status: 'ok' }
    });
  });

  await t.test('handles non-zero exit code but still returns stdout', async () => {
    let jsonData: any = null;
    let statusCode: number | undefined;

    const req = {
        method: 'POST',
        headers: { authorization: 'Bearer valid-token' },
        body: { toolName: 'workspace_tasks_manager', action: 'list' }
    };
    const res = {
      set: () => {},
      status: (code: number) => { statusCode = code; return res; },
      json: (data: any) => { jsonData = data; }
    };

    const origWarn = console.warn;
    console.warn = () => {};

    const promise = executeAgentTool(req, res);
    await new Promise(r => setTimeout(r, 0));

    mockSpawnChild.stdout.emit('data', Buffer.from('Partial content'));
    mockSpawnChild.stderr.emit('data', Buffer.from('Some error'));
    mockSpawnChild.emit('close', 1);

    await promise;

    console.warn = origWarn;

    assert.deepEqual(jsonData, {
      status: 'success',
      toolName: 'workspace_tasks_manager',
      action: 'list',
      rawOutput: 'Partial content'
    });
  });

  await t.test('returns 500 when spawn throws exception synchronously', async () => {
    shouldThrowSpawn = true;
    let statusCode: number | undefined;
    let jsonData: any = null;

    const req = {
        method: 'POST',
        headers: { authorization: 'Bearer valid-token' },
        body: { toolName: 'workspace_email_manager', action: 'read' }
    };
    const res = {
      set: () => {},
      status: (code: number) => { statusCode = code; return res; },
      json: (data: any) => { jsonData = data; }
    };

    const origError = console.error;
    console.error = () => {};

    await executeAgentTool(req, res);

    console.error = origError;

    assert.equal(statusCode, 500);
    assert.deepEqual(jsonData, {
      status: 'error',
      message: 'Neural routing failed.',
      details: 'Spawn failed critically'
    });
  });

  await t.test('returns 500 when spawn emits error asynchronously', async () => {
    let statusCode: number | undefined;
    let jsonData: any = null;

    const req = {
        method: 'POST',
        headers: { authorization: 'Bearer valid-token' },
        body: { toolName: 'workspace_email_manager', action: 'read' }
    };
    const res = {
      set: () => {},
      status: (code: number) => { statusCode = code; return res; },
      json: (data: any) => { jsonData = data; }
    };

    const origError = console.error;
    console.error = () => {};

    const promise = executeAgentTool(req, res);
    await new Promise(r => setTimeout(r, 0));

    mockSpawnChild.emit('error', new Error('ENOENT: spawn failed'));

    await promise;

    console.error = origError;

    assert.equal(statusCode, 500);
    assert.deepEqual(jsonData, {
      status: 'error',
      message: 'Neural routing failed.',
      details: 'ENOENT: spawn failed'
    });
  });
});

module.Module.prototype.require = originalRequire;
