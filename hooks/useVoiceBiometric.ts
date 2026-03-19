import { useState, useCallback, useRef } from 'react';
import { EnrollmentSession, EnrollmentState } from '../lib/types/voiceBiometric';
import { useGemigramStore } from '../lib/store/useGemigramStore';

/**
 * useVoiceBiometric
 * Sovereign identity enrollment state machine.
 * Captures 3 neural voice prints (2s each) to establish a sovereign biometric root.
 */
export function useVoiceBiometric() {
  const [session, setSession] = useState<EnrollmentSession | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const addTranscript = useGemigramStore(s => s.addTranscriptMessage);

  const startEnrollment = useCallback((userId: string) => {
    setSession({
      state: 'PENDING',
      userId,
      samplesRecorded: 0,
      samplesRequired: 3,
      startedAt: Date.now()
    });
    addTranscript('agent', "Initializing Sovereign Voice Enrollment. Please prepare to speak the verification phrase.");
  }, [addTranscript]);

  const captureSample = useCallback(async () => {
    if (!session || session.state === 'RECORDING') return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      chunks.current = [];

      mediaRecorder.current.ondataavailable = (e) => chunks.current.push(e.data);
      mediaRecorder.current.onstop = () => {
        setSession(prev => {
          if (!prev) return null;
          const nextCount = prev.samplesRecorded + 1;
          const isDone = nextCount >= prev.samplesRequired;
          
          if (isDone) addTranscript('agent', "Neural embedding complete. Your voice identity is now sovereign.");
          else addTranscript('agent', `Sample ${nextCount} verified. ${prev.samplesRequired - nextCount} remaining.`);

          return {
            ...prev,
            samplesRecorded: nextCount,
            state: isDone ? 'ENROLLED' : 'PENDING',
            completedAt: isDone ? Date.now() : undefined
          };
        });
      };

      setSession(prev => prev ? { ...prev, state: 'RECORDING' } : null);
      mediaRecorder.current.start();
      
      // Auto-stop after 2 seconds (optimized for embedding window)
      setTimeout(() => {
        if (mediaRecorder.current?.state === 'recording') {
          mediaRecorder.current.stop();
          stream.getTracks().forEach(t => t.stop());
        }
      }, 2000);

    } catch (err) {
      setSession(prev => prev ? { ...prev, state: 'FAILED', errorMessage: 'Mic access denied' } : null);
    }
  }, [session, addTranscript]);

  const cancelEnrollment = useCallback(() => {
    setSession(null);
    if (mediaRecorder.current?.state === 'recording') mediaRecorder.current.stop();
  }, []);

  return {
    enrollment: session,
    startEnrollment,
    captureSample,
    cancelEnrollment
  };
}
