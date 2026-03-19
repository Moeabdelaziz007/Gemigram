/**
 * Sovereign Voice Synthesis Engine (Phase 5)
 * 
 * Orchestrates high-fidelity vocal delivery across multiple providers.
 * Primary: ElevenLabs (High Emotional Range)
 * Fallback: Web Speech API (Zero Latency / $0 Cost)
 */

import { useGemigramStore } from '../store/useGemigramStore';

interface SynthesisOptions {
  voiceId?: string;
  stability?: number;
  similarityBoost?: number;
  provider?: 'elevenlabs' | 'google' | 'browser';
}

export class SynthesisEngine {
  private static API_KEY = process.env.NEXT_PUBLIC_ELEVEN_LABS_KEY;
  private static DEFAULT_VOICE = 'pNInz6obpgmqMbaLJP7m'; // Charon (Deep/Gravelly)

  /**
   * Translates text into high-fidelity neural audio.
   */
  static async speak(text: string, options: SynthesisOptions = {}): Promise<void> {
    const { isSpeaking } = useGemigramStore.getState();
    if (isSpeaking) return;

    try {
      useGemigramStore.setState({ isSpeaking: true });

      const provider = options.provider || (this.API_KEY ? 'elevenlabs' : 'browser');

      if (provider === 'elevenlabs' && this.API_KEY) {
        await this.speakElevenLabs(text, options.voiceId || this.DEFAULT_VOICE);
      } else {
        await this.speakBrowser(text);
      }
    } catch (error) {
      console.error('[SynthesisEngine_Error]:', error);
    } finally {
      useGemigramStore.setState({ isSpeaking: false });
    }
  }

  private static async speakElevenLabs(text: string, voiceId: string): Promise<void> {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': this.API_KEY || '',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    });

    if (!response.ok) throw new Error('ElevenLabs Synthesis Failed');

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    
    return new Promise((resolve) => {
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        resolve();
      };
      audio.play();
    });
  }

  private static speakBrowser(text: string): Promise<void> {
    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      // Attempt to find a high-quality Arabic or English voice
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => v.lang.includes('ar') || v.lang.includes('en-GB'));
      
      if (preferredVoice) utterance.voice = preferredVoice;
      
      utterance.onend = () => resolve();
      window.speechSynthesis.speak(utterance);
    });
  }
}
