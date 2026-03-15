import { useEffect, useRef, useState } from 'react';

const MODEL = "models/gemini-2.5-flash-native-audio-preview-09-2025";

export function useLiveAPI(apiKey: string, onFunctionCall: (call: any) => void) {
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const connect = () => {
    if (!apiKey) return;
    
    // Endpoint: Ensure the WebSocket connects exactly to the v1beta BidiGenerateContent endpoint
    const wsUrl = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key=${apiKey}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      setIsConnected(true);
      console.log("Live API connected");
      
      // Initial Setup: Send BidiGenerateContentSetup JSON object
      ws.send(JSON.stringify({
        setup: {
          model: MODEL,
          generationConfig: {
            responseModalities: ["AUDIO"],
            speechConfig: {
              voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } }
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
        
        // Listen for serverMessage.toolCall
        if (message.toolCall) {
          const functionCalls = message.toolCall.functionCalls;
          if (functionCalls) {
            for (const call of functionCalls) {
              // Pause the audio stream contextually
              if (audioContextRef.current) audioContextRef.current.suspend();
              
              try {
                // Send the tool execution request to our Firebase API route
                const response = await fetch('/api/agent/execute', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(call)
                });
                const result = await response.json();
                
                // Update the VoiceAgent state to render the UI Widget
                onFunctionCall(result);

                // Crucially: Send back a toolResponse
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
              } finally {
                // Resume audio
                if (audioContextRef.current) audioContextRef.current.resume();
              }
            }
          }
        }

        // Handle audio response
        if (message.serverContent?.modelTurn?.parts) {
          for (const part of message.serverContent.modelTurn.parts) {
            if (part.inlineData) {
              playAudio(part.inlineData.data);
            }
          }
        }
      } catch (err) {
        console.error("Error parsing message:", err);
      }
    };

    ws.onerror = (err) => {
      console.error("Live API error:", err);
      setIsConnected(false);
    };

    ws.onclose = () => {
      setIsConnected(false);
      console.log("Live API disconnected");
    };

    wsRef.current = ws;
  };

  const disconnect = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
  };

  const playAudio = async (base64Data: string) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    
    const audioContext = audioContextRef.current;
    const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
    const audioBuffer = await audioContext.decodeAudioData(binaryData.buffer);
    
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start();
  };

  const sendAudio = (base64Data: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      // Streaming Audio: Use the updated schema
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

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
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

      mediaRecorder.start(100); // Send data every 100ms
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone access failed:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  return { isConnected, isRecording, connect, disconnect, startRecording, stopRecording };
}

