'use client';

/**
 * Text-to-Speech Utility for Astraeus Voice Interface
 * Uses Web Speech API for natural voice synthesis
 */

export interface VoiceConfig {
  rate: number;      // Speed: 0.1 to 10
  pitch: number;     // Pitch: 0 to 2
  volume: number;    // Volume: 0 to 1
  voice?: SpeechSynthesisVoice;
}

class TextToSpeechService {
  private synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
  private isSpeaking = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    if (this.synth) {
      // Wait for voices to load
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => {
          console.log('Voices changed - available for TTS');
        };
      }
    }
  }

  /**
   * Get available voices
   */
  getAvailableVoices(): SpeechSynthesisVoice[] {
    if (!this.synth) return [];
    return this.synth.getVoices();
  }

  /**
   * Find optimal voice for Astraeus
   */
  findAstraeusVoice(): SpeechSynthesisVoice | undefined {
    const voices = this.getAvailableVoices();
    
    // Prefer English voices with good quality
    const preferredVoices = voices.filter(voice => 
      voice.lang.startsWith('en') && 
      (voice.name.includes('Google') || voice.name.includes('Premium'))
    );
    
    return preferredVoices[0] || voices[0];
  }

  /**
   * Speak text with optional callback
   */
  speak(
    text: string, 
    config?: Partial<VoiceConfig>,
    onEnd?: () => void
  ): void {
    if (!this.synth) {
      console.warn('Speech synthesis not supported');
      if (onEnd) onEnd();
      return;
    }

    // Cancel any ongoing speech
    this.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Apply configuration
    const finalConfig: VoiceConfig = {
      rate: config?.rate ?? 1.0,
      pitch: config?.pitch ?? 1.0,
      volume: config?.volume ?? 1.0,
      voice: config?.voice || this.findAstraeusVoice(),
    };

    utterance.rate = finalConfig.rate;
    utterance.pitch = finalConfig.pitch;
    utterance.volume = finalConfig.volume;
    if (finalConfig.voice) {
      utterance.voice = finalConfig.voice;
    }

    // Handle events
    utterance.onstart = () => {
      this.isSpeaking = true;
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.currentUtterance = null;
      if (onEnd) onEnd();
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      this.isSpeaking = false;
      this.currentUtterance = null;
      if (onEnd) onEnd();
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  /**
   * Stop current speech
   */
  cancel(): void {
    if (this.synth && this.isSpeaking) {
      this.synth.cancel();
      this.isSpeaking = false;
      this.currentUtterance = null;
    }
  }

  /**
   * Pause speech
   */
  pause(): void {
    if (this.synth && this.isSpeaking) {
      this.synth.pause();
    }
  }

  /**
   * Resume paused speech
   */
  resume(): void {
    if (this.synth && this.isSpeaking) {
      this.synth.resume();
    }
  }

  /**
   * Check if currently speaking
   */
  getIsSpeaking(): boolean {
    return this.isSpeaking;
  }
}

// Singleton instance
export const ttsService = new TextToSpeechService();

/**
 * React Hook for Text-to-Speech
 */
export function useTextToSpeech() {
  const speak = (text: string, config?: Partial<VoiceConfig>) => {
    return new Promise<void>((resolve) => {
      ttsService.speak(text, config, resolve);
    });
  };

  const cancel = () => ttsService.cancel();
  const pause = () => ttsService.pause();
  const resume = () => ttsService.resume();
  const isSpeaking = () => ttsService.getIsSpeaking();

  return {
    speak,
    cancel,
    pause,
    resume,
    isSpeaking,
    getAvailableVoices: () => ttsService.getAvailableVoices(),
  };
}
