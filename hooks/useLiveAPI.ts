import { useEffect, useRef, useState, useCallback } from 'react';
import { useAetherStore } from '../lib/store/useAetherStore';
import { useVisionPulse } from './useVisionPulse';

const MODEL = "models/gemini-2.5-flash-native-audio-preview-09-2025";

export function useLiveAPI(apiKey: string, onFunctionCall: (call: any) => void) {
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [logs, setLogs] = useState<{ id: string; text: string; type: 'system' | 'user' | 'agent' | 'tool'; timestamp: string }[]>([]);
  const [volume, setVolume] = useState(0);
  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const addTranscriptMessage = useAetherStore(state => state.addTranscriptMessage);
  const setStreamingBuffer = useAetherStore(state => state.setStreamingBuffer);
  const setInterrupted = useAetherStore(state => state.setInterrupted);
  const setContextUsage = useAetherStore(state => state.setContextUsage);

  const sendVisionFrame = useCallback((base64Data: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        realtimeInput: {
          mediaChunks: [{
            mimeType: 'image/jpeg',
            data: base64Data
          }]
        }
      }));
      addLog("Vision pulse transmitted.", "system");
    }
  }, [addLog]);

  const { isCapturing, startPulse, stopPulse } = useVisionPulse(sendVisionFrame);

  const addLog = useCallback((text: string, type: 'system' | 'user' | 'agent' | 'tool') => {
    const timestamp = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLogs(prev => [...prev, { id: Math.random().toString(36).substring(7), text, type, timestamp }]);
  }, []);

  const updateVolume = useCallback(() => {
    if (!analyserRef.current) return;
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
    setVolume(average / 255);
    animationFrameRef.current = requestAnimationFrame(updateVolume);
  }, []);

  const connect = useCallback((systemInstruction?: string, voiceName: string = "Zephyr", tools?: any[]) => {
    if (!apiKey) return;
    
    addLog("Initializing neural connection...", "system");
    
    const wsUrl = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key=${apiKey}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      setIsConnected(true);
      addLog("Live API connected successfully.", "system");
      
      ws.send(JSON.stringify({
        setup: {
          model: MODEL,
          systemInstruction: systemInstruction ? {
            parts: [{ text: systemInstruction }]
          } : undefined,
          tools: tools && tools.length > 0 ? tools : undefined,
          generationConfig: {
            responseModalities: ["AUDIO", "TEXT"],
            speechConfig: {
              voiceConfig: { prebuiltVoiceConfig: { voiceName: voiceName } }
            }
          }
        }
      }));
    };

    ws.onmessage = async (event) => {
      try {
        let data = event.data;
        if (data instanceof Blob) {
          data = await data.text();
        }
        const message = JSON.parse(data);
        
        if (message.toolCall) {
          const functionCalls = message.toolCall.functionCalls;
          if (functionCalls) {
            for (const call of functionCalls) {
              addLog(`Executing tool: ${call.name}`, "tool");
              if (audioContextRef.current) audioContextRef.current.suspend();
              
              try {
                const response = await fetch('/api/agent/execute', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(call)
                });
                const result = await response.json();
                
                addLog(`Tool ${call.name} executed successfully.`, "tool");
                onFunctionCall(result);

                ws.send(JSON.stringify({
                  toolResponse: {
                    functionResponses: [{
                      id: call.id,
                      name: call.name,
                      response: result
                    }]
                  }
                }));
              } catch (err) {
                console.error("Firebase Bridge error:", err);
                addLog(`Error executing tool ${call.name}`, "system");
              } finally {
                if (audioContextRef.current) audioContextRef.current.resume();
              }
            }
          }
        }

        if (message.serverContent?.modelTurn?.parts) {
          for (const part of message.serverContent.modelTurn.parts) {
            if (part.inlineData) {
              playAudio(part.inlineData.data);
            }
            if (part.text) {
              addLog(part.text, "agent");
              addTranscriptMessage("agent", part.text);
            }
          }
        }
        if (message.serverContent?.interrupted) {
          setInterrupted(true);
          addLog("Interruption detected.", "system");
        }

        if (message.usageMetadata) {
          const { totalTokenCount } = message.usageMetadata;
          // Estimate usage based on a 1M token limit (Gemini 2.0 Flash limit)
          const usage = Math.min(totalTokenCount / 1000000, 1);
          setContextUsage(usage);
        }
      } catch (err) {
        console.error("Error parsing message:", err);
      }
    };

    ws.onerror = (err) => {
      console.error("Live API error:", err);
      addLog("Connection error occurred.", "system");
      setIsConnected(false);
    };

    ws.onclose = () => {
      setIsConnected(false);
      addLog("Connection closed.", "system");
    };

    wsRef.current = ws;
  }, [apiKey, addLog, onFunctionCall, playAudio, addTranscriptMessage, setContextUsage, setInterrupted]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setIsConnected(false);
    addLog("Disconnected.", "system");
  }, [addLog]);

  const playAudio = useCallback(async (base64Data: string) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    
    const audioContext = audioContextRef.current;
    const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
    const audioBuffer = await audioContext.decodeAudioData(binaryData.buffer);
    
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    
    // Connect to analyser for agent voice reactivity
    if (!analyserRef.current) {
      analyserRef.current = audioContext.createAnalyser();
      analyserRef.current.fftSize = 256;
      updateVolume();
    }
    
    source.connect(analyserRef.current);
    analyserRef.current.connect(audioContext.destination);
    source.start();
  }, [updateVolume]);

  const sendAudio = (base64Data: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        realtimeInput: {
          audio: {
            mimeType: 'audio/webm',
            data: base64Data
          }
        }
      }));
    }
  };

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Setup analyser for user voice reactivity
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }
      const source = audioContextRef.current.createMediaStreamSource(stream);
      if (!analyserRef.current) {
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;
        updateVolume();
      }
      source.connect(analyserRef.current);

      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = async (event) => {
        if (event.data.size > 0) {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64data = (reader.result as string).split(',')[1];
            sendAudio(base64data);
          };
          reader.readAsDataURL(event.data);
        }
      };

      mediaRecorder.start(100);
      setIsRecording(true);
      addLog("Microphone active. Listening...", "user");
    } catch (err) {
      console.error("Microphone access failed:", err);
      addLog("Microphone access denied.", "system");
    }
  }, [addLog, updateVolume]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      addLog("Microphone muted.", "user");
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    setVolume(0);
  }, [addLog]);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return { 
    isConnected, 
    isRecording, 
    logs, 
    volume, 
    connect, 
    disconnect, 
    startRecording, 
    stopRecording,
    isCapturing,
    startPulse,
    stopPulse
  };
}

