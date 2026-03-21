/**
 * Sovereign Voice Synthesis Engine (Phase 4)
 * 
 * Orchestrates vocal delivery using Web Speech API as a fallback
 * to Gemini Native Audio.
 */

import { useGemigramStore } from '../store/useGemigramStore';



export class SynthesisEngine {
  /**
   * Translates text into high-fidelity neural audio via browser fallback.
   */
  static async speak(text: string): Promise<void> {
    const { isSpeaking } = useGemigramStore.getState();
    if (isSpeaking) return;

    try {
      useGemigramStore.setState({ isSpeaking: true });
      await this.speakBrowser(text);
    } catch (error) {
      console.error('[SynthesisEngine_Error]:', error);
    } finally {
      useGemigramStore.setState({ isSpeaking: false });
    }
  }

  private static speakBrowser(text: string): Promise<void> {
    return new Promise((resolve) => {
      if (typeof window === 'undefined' || !window.speechSynthesis) {
        resolve();
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Attempt to find a premium neural-like voice
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => 
        (v.lang.includes('ar') || v.lang.includes('en-GB')) && 
        (v.name.includes('Google') || v.name.includes('Natural'))
      );
      
      if (preferredVoice) utterance.voice = preferredVoice;
      
      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();
      
      window.speechSynthesis.speak(utterance);
    });
  }
}
