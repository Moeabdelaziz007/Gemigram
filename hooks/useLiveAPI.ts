import { useEffect, useRef, useState, useCallback } from 'react';
import { useAetherStore } from '../lib/store/useAetherStore';
import { useVisionPulse } from './useVisionPulse';
import { handleNeuralTool } from '../lib/tools/neural-handlers';
import { ToolResult, Tool } from '../lib/types/live-api';

const MODEL = "models/gemini-2.5-flash-native-audio-preview-09-2025";

export function useLiveAPI(apiKey: string, onFunctionCall: (call: ToolResult) => void, accessToken?: string | null) {
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

  // ─── Reconnection State (Gem #7: Gateway Backpressure) ────
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const maxReconnectAttempts = 5;
  const baseReconnectDelay = 1000; // 1s
  const maxReconnectDelay = 30000; // 30s
  const intentionalDisconnectRef = useRef(false);
  const lastConnectArgsRef = useRef<{ systemInstruction?: string; voiceName?: string; tools?: Tool[] }>({});

  // 1. Utility Callbacks (Top-Level)
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

  const playAudio = useCallback(async (base64Data: string) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    
    const audioContext = audioContextRef.current;
    const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
    const audioBuffer = await audioContext.decodeAudioData(binaryData.buffer);
    
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    
    if (!analyserRef.current) {
      analyserRef.current = audioContext.createAnalyser();
      analyserRef.current.fftSize = 256;
      updateVolume();
    }
    
    source.connect(analyserRef.current);
    analyserRef.current.connect(audioContext.destination);
    source.start();
  }, [updateVolume]);

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

  // 2. Core Logic Callbacks (Reconnection & Circular Handling)
  // We use a forward reference for reconnect to avoid TDZ in connect ws.onclose
  const scheduleReconnectRef = useRef<() => void>(() => {});

  const connect = useCallback((systemInstruction?: string, voiceName: string = "Zephyr", tools?: Tool[]) => {
    if (!apiKey) return;

    lastConnectArgsRef.current = { systemInstruction, voiceName, tools };
    intentionalDisconnectRef.current = false;
    
    addLog("Initializing neural connection...", "system");
    
    const wsUrl = accessToken 
      ? `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?accessToken=${accessToken}`
      : `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key=${apiKey}`;
    
    const ws = new WebSocket(wsUrl);
    const transcript = useAetherStore.getState().transcript;
    const setLinkType = useAetherStore.getState().setLinkType;

    ws.onopen = () => {
      setIsConnected(true);
      setLinkType('stateless'); // Reset to active state
      reconnectAttemptsRef.current = 0;
      addLog("Live API connected successfully.", "system");
      
      const setupMsg: any = {
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
      };

      ws.send(JSON.stringify(setupMsg));

      // ─── Phase 17: Hibernate Re-injection (Context Recovery) ────
      if (transcript.length > 0) {
        addLog(`Synchronizing neural context (${transcript.length} nodes)...`, "system");
        setLinkType('hibernating');
        
        // Map history to model turns
        const historyParts = transcript.slice(-10).map(msg => ({
          text: msg.content
        }));

        // We send a clientContent message to catch up the model
        // Note: In real-world bidi, we might need to send this after setup confirmation
        setTimeout(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
              clientContent: {
                turns: [{
                  role: "user",
                  parts: [{ text: `System Note: This is a resumed session. Previous context: ${transcript.slice(-5).map(m => m.content).join(' | ')}` }]
                }],
                turnComplete: true
              }
            }));
            setLinkType('stateless');
          }
        }, 1000);
      }
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
                const activeProjectId = useAetherStore.getState().activeProjectId;
                const result = await handleNeuralTool(call.name, { ...call.args, accessToken, activeProjectId });
                
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
                console.error("Neural Tool error:", err);
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
    };

    ws.onclose = (event) => {
      setIsConnected(false);
      wsRef.current = null;
      
      if (intentionalDisconnectRef.current) {
        addLog("Connection closed.", "system");
        useAetherStore.getState().setLinkType('stateless');
      } else {
        addLog(`Connection lost (code: ${event.code}). Hibernating session...`, "system");
        useAetherStore.getState().setLinkType('hibernating');
        scheduleReconnectRef.current();
      }
    };

    wsRef.current = ws;
  }, [apiKey, addLog, onFunctionCall, playAudio, addTranscriptMessage, setContextUsage, setInterrupted, accessToken]);

  const scheduleReconnect = useCallback(() => {
    if (intentionalDisconnectRef.current) return;
    if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
      addLog(`Max reconnection attempts (${maxReconnectAttempts}) reached. Giving up.`, "system");
      reconnectAttemptsRef.current = 0;
      return;
    }

    const attempt = reconnectAttemptsRef.current;
    const delay = Math.min(baseReconnectDelay * Math.pow(2, attempt), maxReconnectDelay);
    const jitter = delay * 0.2 * Math.random();
    const actualDelay = Math.round(delay + jitter);

    addLog(`Reconnecting in ${(actualDelay / 1000).toFixed(1)}s (attempt ${attempt + 1}/${maxReconnectAttempts})...`, "system");

    reconnectTimerRef.current = setTimeout(() => {
      reconnectAttemptsRef.current += 1;
      const args = lastConnectArgsRef.current;
      connect(args.systemInstruction, args.voiceName, args.tools);
    }, actualDelay);
  }, [addLog, connect]);

  // Sync ref
  useEffect(() => {
    scheduleReconnectRef.current = scheduleReconnect;
  }, [scheduleReconnect]);

  const disconnect = useCallback(() => {
    intentionalDisconnectRef.current = true;
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
    reconnectAttemptsRef.current = 0;
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

  // 2. Core Logic Callbacks (Reconnection & Circular Handling)
  const workletNodeRef = useRef<AudioWorkletNode | null>(null);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext({ sampleRate: 24000 });
      }
      
      const audioContext = audioContextRef.current;
      await audioContext.audioWorklet.addModule('/audio-processor.js');
      
      const source = audioContext.createMediaStreamSource(stream);
      workletNodeRef.current = new AudioWorkletNode(audioContext, 'neural-spine-processor');
      
      workletNodeRef.current.port.onmessage = (event) => {
        if (event.data.type === 'audio_chunk') {
          const rawPcm = event.data.payload;
          
          // Convert Float32 to Int16 for Gemini
          const pcm16 = new Int16Array(rawPcm.length);
          for (let i = 0; i < rawPcm.length; i++) {
            pcm16[i] = Math.max(-1, Math.min(1, rawPcm[i])) * 0x7FFF;
          }
          
          const base64data = btoa(String.fromCharCode(...new Uint8Array(pcm16.buffer)));
          
          if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({
              realtimeInput: {
                mediaChunks: [{
                  mimeType: 'audio/pcm;rate=24000',
                  data: base64data
                }]
              }
            }));
          }
        }
      };

      source.connect(workletNodeRef.current);
      setIsRecording(true);
      addLog("Neural Spine: Raw PCM streaming active.", "user");
    } catch (err) {
      console.error("Neural Spine transition failure:", err);
      addLog("Microphone access denied or Worklet failure.", "system");
    }
  }, [addLog]);

  const stopRecording = useCallback(() => {
    if (workletNodeRef.current) {
      workletNodeRef.current.disconnect();
      workletNodeRef.current = null;
    }
    setIsRecording(false);
    addLog("Neural Link: Microphone muted.", "user");
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
