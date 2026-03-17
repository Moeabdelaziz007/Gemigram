'use client';

import { useState, useCallback, useRef } from 'react';

export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const speak = useCallback((text: string, onEnd?: () => void) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utteranceRef.current = utterance;
      
      utterance.pitch = 0.8;
      utterance.rate = 1.1;
      
      const voices = window.speechSynthesis.getVoices();
      const techVoice = voices.find(v => 
        v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Zira')
      );
      if (techVoice) utterance.voice = techVoice;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        if (onEnd) onEnd();
      };
      
      speechSynthesis.speak(utterance);
    } else {
      if (onEnd) onEnd();
    }
  }, []);

  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return { speak, stop, isSpeaking };
}
