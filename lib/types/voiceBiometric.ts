/**
 * 🧬 VoiceBiometric Types - GemigramOS V3
 * Sovereign Identity Verification Layer
 */

/**
 * Unique voice signature derived from neural embeddings.
 */
export interface VoicePrint {
  /** Target user ID associated with this print */
  userId: string;
  /** 256-dimensional neural embedding vector */
  embeddings: Float32Array;
  /** ISO timestamp of enrollment */
  enrolledAt: number;
  /** Confidence threshold (must be > 0.85 for production verification) */
  confidence: number;
  /** Unique ID of the device used for enrollment */
  deviceId: string;
  /** Algorithm version (e.g., 'v1-conformer') */
  version: string;
}

/**
 * Result of a real-time biometric verification attempt.
 */
export interface BiometricAuthResult {
  /** Final verification status */
  verified: boolean;
  /** Matching score (0.0 - 1.0) */
  confidence: number;
  /** Measurement latency in milliseconds */
  latencyMs: number;
  /** Number of attempts in current session */
  attemptCount: number;
  /** Secondary auth method if biometric fails */
  fallback: 'google_oauth' | null;
  /** Detailed reason for rejection if applicable */
  rejectionReason?: string;
}

/**
 * States during the voice enrollment process.
 */
export type EnrollmentState = 'PENDING' | 'RECORDING' | 'PROCESSING' | 'ENROLLED' | 'FAILED';

/**
 * Active session tracking for user voice enrollment.
 */
export interface EnrollmentSession {
  state: EnrollmentState;
  userId: string;
  /** Number of valid voice samples captured */
  samplesRecorded: number;
  /** Total samples required (default: 3) */
  samplesRequired: number;
  /** Error message for UI rendering on failure */
  errorMessage?: string;
  startedAt: number;
  completedAt?: number;
}

/**
 * Gemini Function Declaration interface for enrolling voice identity.
 */
export interface EnrollVoiceFunctionDeclaration {
  name: 'enroll_voice_identity';
  description: 'Initiates or resumes the biometric voice enrollment process for the current user.';
  parameters: {
    type: 'OBJECT';
    properties: {
      action: {
        type: 'STRING';
        enum: ['START', 'CANCEL', 'RESET'];
        description: 'The enrollment action to perform.';
      };
      reason?: {
        type: 'STRING';
        description: 'Context for triggering enrollment.';
      };
    };
    required: ['action'];
  };
}
