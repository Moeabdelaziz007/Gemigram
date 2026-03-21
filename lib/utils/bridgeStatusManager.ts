import { fetchWithTimeout, getLocalBridgeUrl, isBridgeCheckEnabled } from '@/lib/network/runtime';

type BridgeStatus = 'bridge' | 'stateless' | 'unknown';
type StatusCallback = (status: BridgeStatus) => void;

class BridgeStatusManager {
  private status: BridgeStatus = 'unknown';
  private lastChecked: number = 0;
  private retryDelay: number = 1000;
  private subscribers: Set<StatusCallback> = new Set();
  private isProbing: boolean = false;
  private probeTimer: any = null;
  private readonly TTL = 30_000; // 30 seconds
  private readonly MAX_RETRY_DELAY = 30_000;

  constructor() {
    // Avoid SSR issues
    if (typeof window !== 'undefined') {
      // Initial probe will be triggered by first subscriber or explicit call
    }
  }

  public getStatus(): BridgeStatus {
    return this.status;
  }

  public subscribe(callback: StatusCallback): () => void {
    this.subscribers.add(callback);
    // Immediately notify with current status
    callback(this.status);
    return () => this.subscribers.delete(callback);
  }

  private notify() {
    this.subscribers.forEach(cb => cb(this.status));
  }

  public async probe(force: boolean = false): Promise<void> {
    if (!isBridgeCheckEnabled()) {
      this.updateStatus('stateless');
      return;
    }

    const now = Date.now();
    if (!force && this.isProbing) return;
    if (!force && (now - this.lastChecked < this.TTL) && this.status !== 'unknown') return;

    if (this.probeTimer) clearTimeout(this.probeTimer);
    this.isProbing = true;
    const bridgeStatusUrl = getLocalBridgeUrl('/status');

    if (!bridgeStatusUrl) {
      this.updateStatus('stateless');
      this.isProbing = false;
      return;
    }

    try {
      const response = await fetchWithTimeout(
        bridgeStatusUrl,
        { cache: 'no-store' },
        1500 // Faster probe timeout
      );

      if (response.ok) {
        this.updateStatus('bridge');
        this.retryDelay = 1000; // Reset on success
      } else {
        throw new Error('Bridge responded with error');
      }
    } catch {
      this.updateStatus('stateless');
      // Exponential backoff
      this.retryDelay = Math.min(this.retryDelay * 2, this.MAX_RETRY_DELAY);
      console.warn(`[BridgeManager] Probe failed. Retrying in ${this.retryDelay}ms`);
      
      this.probeTimer = setTimeout(() => this.probe(true), this.retryDelay);
    } finally {
      this.lastChecked = Date.now();
      this.isProbing = false;
    }
  }

  public destroy() {
    if (this.probeTimer) clearTimeout(this.probeTimer);
    this.subscribers.clear();
  }

  private updateStatus(newStatus: BridgeStatus) {
    if (this.status !== newStatus) {
      this.status = newStatus;
      this.notify();
    }
  }
}

export const bridgeStatusManager = new BridgeStatusManager();
