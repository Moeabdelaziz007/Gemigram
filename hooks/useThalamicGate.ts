import { useRef, useCallback, useEffect } from 'react';
import { useGemigramStore } from '../lib/store/useGemigramStore';

interface ThalamicGateConfig {
  /** Silence threshold (0-1) below which we consider the user "quiet". Default: 0.02 */
  silenceThreshold?: number;
  /** Number of consecutive quiet samples before triggering intervention. Default: 45 (~4.5s at 100ms interval) */
  frustrationStreak?: number;
  /** Interval in ms between acoustic checks. Default: 100 */
  pollInterval?: number;
  /** Cooldown in ms after an intervention before another can trigger. Default: 30000 (30s) */
  cooldownMs?: number;
}

/**
 * useThalamicGate — Proactive AI Intervention System
 * 
 * Monitors the audio AnalyserNode for patterns indicating user frustration:
 * - Sustained silence (user is stuck/confused)
 * - Low-energy mumbling (sighing, breathing)
 * 
 * When detected, injects a proactive "[SYSTEM: ...]" prompt into the
 * Gemini WebSocket session so the AI reaches out first.
 * 
 * Ported from Gemigram-Voice-OS ThalamicGate (Python) and adapted for
 * the browser-native WebSocket in useLiveAPI.
 * 
 * @param analyser - The AnalyserNode from the audio context
 * @param wsRef - Reference to the active WebSocket
 * @param config - Optional tuning parameters
 */
export function useThalamicGate(
  analyser: AnalyserNode | null,
  wsRef: React.MutableRefObject<WebSocket | null>,
  config: ThalamicGateConfig = {}
) {
  const {
    silenceThreshold = 0.02,
    frustrationStreak: maxStreak = 45,
    pollInterval = 100,
    cooldownMs = 30000,
  } = config;

  const streakRef = useRef(0);
  const lastTriggerRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isActiveRef = useRef(false);

  /**
   * Compute a "need-help" score based on audio energy levels.
   * Returns 0-1 where higher values indicate more likely frustration.
   */
  const computeNeedHelpScore = useCallback((): number => {
    if (!analyser) return 0;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(dataArray);

    // Calculate RMS energy (normalized 0-1)
    const sum = dataArray.reduce((acc, val) => acc + val, 0);
    const avg = sum / dataArray.length / 255;

    // Very low energy = silence = potential frustration
    // Medium-low energy = breathing/sighing patterns
    if (avg < silenceThreshold * 0.5) {
      // Dead silence — strong indicator
      return 0.7;
    } else if (avg < silenceThreshold) {
      // Very quiet — breathing/ambient noise
      return 0.5;
    } else if (avg < silenceThreshold * 3) {
      // Soft sighing/exhalation pattern
      return 0.3;
    }

    // Normal speech energy — user is talking, no intervention needed
    return 0;
  }, [analyser, silenceThreshold]);

  /**
   * Inject a proactive intervention prompt into the Gemini session.
   */
  const triggerIntervention = useCallback(() => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;

    const now = Date.now();
    if (now - lastTriggerRef.current < cooldownMs) return;

    lastTriggerRef.current = now;

    // Inject a system-level prompt that encourages the AI to reach out
    const interventionPrompt = [
      "[SYSTEM: PROACTIVE INTERVENTION TRIGGERED.",
      "The user has been silent for an extended period.",
      "They may be confused, stuck, or need assistance.",
      "Gently reach out and offer help. Be empathetic.",
      "If screen sharing is active, reference what you can see.",
      "Keep it brief and warm — don't overwhelm them.]"
    ].join(" ");

    try {

      // Inject a system-level prompt that encourages the AI to reach out
      ws.send(JSON.stringify({
        clientContent: {
          turns: [{
            role: "user",
            parts: [{ text: interventionPrompt }]
          }],
          turnComplete: true
        }
      }));

    } catch (err) {
      console.error("Thalamic Gate: Intervention injection failed:", err);
    }
  }, [wsRef, cooldownMs]);

  /**
   * The core monitoring loop — polls audio state and manages the frustration streak.
   */
  const startMonitoring = useCallback(() => {
    if (isActiveRef.current) return;
    isActiveRef.current = true;

    intervalRef.current = setInterval(() => {
      const { isThinking, isSpeaking } = useGemigramStore.getState();
      
      // Do not intervene if the AI is currently processing or talking
      if (isThinking || isSpeaking) {
        streakRef.current = 0;
        return;
      }

      const score = computeNeedHelpScore();

      if (score > 0.5) {
        streakRef.current += 1;

        if (streakRef.current >= maxStreak) {
          triggerIntervention();
          streakRef.current = 0; // Reset after intervention
        }
      } else {
        // Decay streak gradually (don't reset instantly — brief pauses are normal)
        streakRef.current = Math.max(0, streakRef.current - 1);
      }
    }, pollInterval);
  }, [computeNeedHelpScore, triggerIntervention, maxStreak, pollInterval]);

  /**
   * Stop the monitoring loop.
   */
  const stopMonitoring = useCallback(() => {
    isActiveRef.current = false;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    streakRef.current = 0;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopMonitoring();
    };
  }, [stopMonitoring]);

  return {
    startMonitoring,
    stopMonitoring,
    /** Current frustration streak count (for debug/telemetry display) */
    getStreak: () => streakRef.current,
    /** Whether monitoring is currently active */
    isActive: () => isActiveRef.current,
  };
}
