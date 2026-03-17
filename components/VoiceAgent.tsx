'use client';

import { useState, useEffect, useMemo } from 'react';
import { useLiveAPI } from '../hooks/useLiveAPI';
import { useAetherStore, Agent } from '../lib/store/useAetherStore';
import { useAudioProcessor } from '../hooks/useAudioProcessor';
import { WidgetRenderer } from './WidgetRenderer';
import { ToolResult, Tool, FunctionDeclaration } from '../lib/types/live-api';
import { Mic, MicOff, Activity, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SovereignDashboard } from './SovereignDashboard';

export function VoiceAgent({ activeAgent, googleAccessToken }: VoiceAgentProps) {
  const [apiKey] = useState(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');
  const [activeWidget, setActiveWidget] = useState<ToolResult | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const transcript = useAetherStore(state => state.transcript);
  const contextUsage = useAetherStore(state => state.contextUsage);
  const linkType = useAetherStore(state => state.linkType);
  const setLinkType = useAetherStore(state => state.setLinkType);
  const setVoiceSession = useAetherStore(state => state.setVoiceSession);

  useEffect(() => {
    const checkBridge = async () => {
      try {
        const res = await fetch('http://localhost:9999/status');
        if (res.ok) setLinkType('bridge');
        else setLinkType('stateless');
      } catch (e) {
        setLinkType('stateless');
      }
    };
    checkBridge();
  }, [setLinkType]);
  const { 
    isConnected, 
    isRecording, 
    logs, 
    volume: cloudVolume, 
    connect, 
    disconnect, 
    startRecording, 
    stopRecording,
    isCapturing,
    startPulse,
    stopPulse
  } = useLiveAPI(apiKey, (call) => {
    setActiveWidget(call);
    setIsThinking(false);
  }, googleAccessToken);

  useEffect(() => {
    setVoiceSession({
      stage: 'workspace',
      lastVoiceAction: isConnected
        ? isRecording
          ? 'You are live. Keep speaking naturally.'
          : 'Tap the mic to start your next voice turn.'
        : 'Use Establish Link to reconnect your voice channel.',
    });
  }, [isConnected, isRecording, setVoiceSession]);

  const { processStream, getVolume, isWasmLoaded, isSpeaking } = useAudioProcessor();

  // Optimized volume selection: WASM/AL (Local) > Cloud Direct
  const volume = isWasmLoaded || isSpeaking ? getVolume() : cloudVolume;

  const agentStatus = useMemo(() => {
    if (linkType === 'hibernating') return 'Hibernating';
    if (!isConnected) return 'Disconnected';
    if (activeWidget) return 'Executing';
    if (isThinking) return 'Thinking';
    if (isRecording || isSpeaking) return 'Listening';
    return 'Speaking';
  }, [isConnected, isThinking, isRecording, isSpeaking, activeWidget, linkType]);

  const voiceActionPrompt = isConnected
    ? isRecording
      ? 'Listening now. Share your request in one sentence.'
      : 'Connection is active. Tap mic for your next voice action.'
    : 'Voice link is offline. Re-establish to continue voice-first flow.';

  const toggleConnection = () => {
    if (isConnected) {
      disconnect();
      stopRecording();
    } else {
      const tools: Tool[] = [];
      const functionDeclarations: FunctionDeclaration[] = [];

      if (activeAgent?.tools?.googleSearch) {
        tools.push({ googleSearch: {} });
      }
      
      if (activeAgent?.tools?.weather) {
        functionDeclarations.push({
          name: "getWeather",
          description: "Get the current weather for a location.",
          parameters: {
            type: "OBJECT",
            properties: {
              location: { type: "STRING", description: "The city and state, e.g. San Francisco, CA" }
            },
            required: ["location"]
          }
        });
      }

      if (activeAgent?.tools?.crypto) {
        functionDeclarations.push({
          name: "getCryptoPrice",
          description: "Get the current price of a cryptocurrency.",
          parameters: {
            type: "OBJECT",
            properties: {
              symbol: { type: "STRING", description: "The cryptocurrency symbol, e.g. BTC, ETH" }
            },
            required: ["symbol"]
          }
        });
      }

      if (activeAgent?.tools?.googleMaps) {
        functionDeclarations.push({
          name: "getMapLocation",
          description: "Get geographical data for a location.",
          parameters: {
            type: "OBJECT",
            properties: {
              location: { type: "STRING" }
            }
          }
        });
      }

      functionDeclarations.push({
        name: "create_agent",
        description: "Materialize a new specialized Sovereign Intelligence agent based on user description.",
        parameters: {
          type: "OBJECT",
          properties: {
            name: { type: "STRING", description: "The name of the new agent" },
            role: { type: "STRING", description: "The primary role or purpose of the agent" },
            systemPrompt: { type: "STRING", description: "The technical system instructions for the agent" },
            soul: { type: "STRING", description: "The personality traits and ethical framework of the agent" },
            rules: { type: "STRING", description: "Operational constraints and behavioral rules" },
            voiceName: { type: "STRING", enum: ["Charon", "Puck", "Kore", "Fenrir"], description: "The auditory identity of the agent" },
            tools: { 
              type: "ARRAY", 
              items: { type: "STRING" }
            },
            skills: {
              type: "ARRAY",
              items: { type: "STRING" }
            }
          },
          required: ["name", "role", "systemPrompt"]
        }
      });

      functionDeclarations.push({
        name: "listProjects",
        description: "List all Firebase projects the user has access to.",
        parameters: { type: "OBJECT", properties: {} }
      });

      functionDeclarations.push({
        name: "getProjectDetails",
        description: "Get detailed information about a specific project.",
        parameters: {
          type: "OBJECT",
          properties: {
            projectId: { type: "STRING" }
          },
          required: ["projectId"]
        }
      });

      if (functionDeclarations.length > 0) {
        tools.push({ functionDeclarations });
      }
      
      connect(activeAgent?.systemPrompt, activeAgent?.voiceName, tools);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-[#030303] overflow-hidden">
      {/* The Sovereign Dashboard HUD */}
      <SovereignDashboard 
        activeAgent={activeAgent}
        volume={volume}
        status={agentStatus}
        linkType={linkType}
        transcript={transcript}
      />

      <div className="absolute bottom-40 left-1/2 -translate-x-1/2 z-[105] w-[min(92vw,52rem)]">
        <div className="glass-medium border border-white/15 rounded-2xl px-5 py-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-gemigram-neon/80 font-bold">Voice Link Status · {agentStatus}</p>
            <p className="text-sm text-white/85">{voiceActionPrompt}</p>
          </div>
          {!isConnected && (
            <button
              onClick={toggleConnection}
              className="shrink-0 px-4 py-2 rounded-xl border border-gemigram-neon/30 bg-gemigram-neon/10 text-gemigram-neon text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Re-establish voice link
            </button>
          )}
        </div>
      </div>

      {/* Control Actions Overlay (Floating) */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-6">
         <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleConnection}
            className={`px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] transition-all shadow-2xl ${
               isConnected 
               ? 'bg-red-500/20 text-red-500 border border-red-500/30' 
               : 'bg-gemigram-neon/20 text-gemigram-neon border border-gemigram-neon/30'
            }`}
         >
            {isConnected ? 'Kill_Link' : 'Establish_Link'}
         </motion.button>

         <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => isRecording ? stopRecording() : startRecording()}
            disabled={!isConnected}
            className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all shadow-2xl ${
               !isConnected ? 'bg-white/5 text-white/20' :
               isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-white/10 text-white border border-white/10'
            }`}
         >
            {isRecording ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
         </motion.button>
      </div>

      {/* Widget Overlay */}
      <AnimatePresence>
        {activeWidget && (
           <div className="absolute inset-x-0 bottom-40 z-[110] px-6 pointer-events-none flex justify-center">
              <motion.div 
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 50, scale: 0.9 }}
                className="w-full max-w-2xl sovereign-glass p-8 rounded-[32px] border border-gemigram-neon/30 pointer-events-auto shadow-2xl"
              >
                 <WidgetRenderer data={activeWidget!} />
              </motion.div>
           </div>
        )}
      </AnimatePresence>

      {/* Sidebar Logs (Slide-in) */}
      <AnimatePresence>
        {showLogs && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            className="absolute left-0 top-0 bottom-0 w-80 z-20 quantum-glass border-r border-white/10 p-8 flex flex-col"
          >
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-8 flex items-center gap-2">
              <Activity className="w-4 h-4" /> Neural Logs
            </h3>
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar flex flex-col-reverse">
              <div className="flex flex-col gap-3">
                {logs.map((log) => (
                  <div 
                    key={log.id}
                    className={`text-[10px] font-mono leading-relaxed ${
                      log.type === 'system' ? 'text-slate-500' :
                      log.type === 'user' ? 'text-emerald-400' :
                      log.type === 'tool' ? 'text-fuchsia-400' :
                      'text-cyan-400'
                    }`}
                  >
                    <span className="opacity-30 mr-2">[{log.timestamp}]</span>
                    {log.text}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}
