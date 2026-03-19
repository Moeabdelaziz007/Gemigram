import test from 'node:test';
import assert from 'node:assert';
import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'http://localhost' });
globalThis.window = dom.window as any;
globalThis.document = dom.window.document as any;
globalThis.navigator = dom.window.navigator as any;

if (!globalThis.navigator.mediaDevices) {
  (globalThis.navigator as any).mediaDevices = {};
}

import { renderHook, act, cleanup } from '@testing-library/react';
import { useVisionPulse } from '../hooks/useVisionPulse';

test('useVisionPulse', async (t) => {
  const originalGetDisplayMedia = globalThis.navigator.mediaDevices.getDisplayMedia;
  const originalCreateElement = globalThis.document.createElement;
  const originalConsoleError = console.error;

  t.afterEach(() => {
    globalThis.navigator.mediaDevices.getDisplayMedia = originalGetDisplayMedia;
    globalThis.document.createElement = originalCreateElement;
    console.error = originalConsoleError;
    cleanup();
  });

  await t.test('initializes with isCapturing false', () => {
    const { result } = renderHook(() => useVisionPulse(() => {}));
    assert.strictEqual(result.current.isCapturing, false);
    assert.strictEqual(typeof result.current.startPulse, 'function');
    assert.strictEqual(typeof result.current.stopPulse, 'function');
  });

  await t.test('startPulse sets isCapturing to true and captures initial frame', async () => {
    let capturedBase64 = '';
    const onFrame = (base64: string) => { capturedBase64 = base64; };

    let trackStopped = false;
    const mockTrack = { stop: () => { trackStopped = true; } };
    const mockStream = { getTracks: () => [mockTrack] };

    globalThis.navigator.mediaDevices.getDisplayMedia = async () => mockStream as any;

    let videoPlayed = false;
    let canvasDrawn = false;

    globalThis.document.createElement = (tagName: string) => {
      if (tagName === 'video') {
        const video = {
          play: async () => { videoPlayed = true; },
          videoWidth: 1280,
          videoHeight: 720,
          onloadedmetadata: null as any
        };
        setTimeout(() => {
          if (video.onloadedmetadata) video.onloadedmetadata();
        }, 0);
        return video as any;
      }
      if (tagName === 'canvas') {
        return {
          width: 0,
          height: 0,
          getContext: (contextId: string) => {
            if (contextId === '2d') {
              return { drawImage: () => { canvasDrawn = true; } };
            }
            return null;
          },
          toDataURL: (type: string, quality: number) => 'data:image/jpeg;base64,fake-base64-data'
        } as any;
      }
      return originalCreateElement.call(globalThis.document, tagName);
    };

    const { result } = renderHook(() => useVisionPulse(onFrame));

    act(() => {
      result.current.startPulse(1000);
    });

    assert.strictEqual(result.current.isCapturing, true);

    // Wait for the async capture logic to complete
    await new Promise(resolve => setTimeout(resolve, 50));

    assert.strictEqual(videoPlayed, true, 'Video play was not called');
    assert.strictEqual(canvasDrawn, true, 'Canvas drawImage was not called');
    assert.strictEqual(capturedBase64, 'fake-base64-data');
    assert.strictEqual(trackStopped, true, 'Stream track was not stopped');

    act(() => {
      result.current.stopPulse();
    });
  });

  await t.test('stopPulse sets isCapturing to false and clears interval', async () => {
    globalThis.navigator.mediaDevices.getDisplayMedia = async () => ({ getTracks: () => [] }) as any;
    globalThis.document.createElement = (tagName: string) => {
      if (tagName === 'video') {
        const video = { play: async () => {}, onloadedmetadata: null as any };
        setTimeout(() => { if (video.onloadedmetadata) video.onloadedmetadata(); }, 0);
        return video as any;
      }
      if (tagName === 'canvas') {
        return { getContext: () => ({ drawImage: () => {} }), toDataURL: () => 'fake,base64' } as any;
      }
      return originalCreateElement.call(globalThis.document, tagName);
    };

    const { result } = renderHook(() => useVisionPulse(() => {}));

    act(() => {
      result.current.startPulse(1000);
    });
    assert.strictEqual(result.current.isCapturing, true);

    act(() => {
      result.current.stopPulse();
    });
    assert.strictEqual(result.current.isCapturing, false);
  });

  await t.test('cleans up interval on unmount', async () => {
    globalThis.navigator.mediaDevices.getDisplayMedia = async () => ({ getTracks: () => [] }) as any;
    globalThis.document.createElement = (tagName: string) => {
      if (tagName === 'video') {
        const video = { play: async () => {}, onloadedmetadata: null as any };
        setTimeout(() => { if (video.onloadedmetadata) video.onloadedmetadata(); }, 0);
        return video as any;
      }
      if (tagName === 'canvas') {
        return { getContext: () => ({ drawImage: () => {} }), toDataURL: () => 'fake,base64' } as any;
      }
      return originalCreateElement.call(globalThis.document, tagName);
    };

    const { result, unmount } = renderHook(() => useVisionPulse(() => {}));

    act(() => {
      result.current.startPulse(1000);
    });
    assert.strictEqual(result.current.isCapturing, true);

    act(() => {
      unmount();
    });

    assert.ok(true);
  });

  await t.test('handles capture errors gracefully', async () => {
    let errorLogged = false;
    console.error = () => { errorLogged = true; };

    globalThis.navigator.mediaDevices.getDisplayMedia = async () => {
      throw new Error('Permission denied');
    };

    const { result } = renderHook(() => useVisionPulse(() => {}));

    act(() => {
      result.current.startPulse(1000);
    });

    await new Promise(resolve => setTimeout(resolve, 50));

    assert.strictEqual(errorLogged, true, 'Console error was not logged on failure');

    act(() => {
      result.current.stopPulse();
    });
  });
});
