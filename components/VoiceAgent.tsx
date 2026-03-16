'use client';

import { useState, useEffect, useMemo } from 'react';
import { useLiveAPI } from '../hooks/useLiveAPI';
import { useAetherStore } from '../lib/store/useAetherStore';
import { useAudioProcessor } from '../hooks/useAudioProcessor';
import { WidgetRenderer } from './WidgetRenderer';
import { Mic, MicOff, Zap, Activity, Settings, Maximize2, User, Terminal, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { DigitalEntity } from './DigitalEntity';

type VoiceAgentProps = {
  activeAgent: any;
  googleAccessToken?: string | null;
};

export function VoiceAgent({ activeAgent, googleAccessToken }: VoiceAgentProps) {
  const [apiKey] = useState(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');
  const [activeWidget, setActiveWidget] = useState<any>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const transcript = useAetherStore(state => state.transcript);
  const contextUsage = useAetherStore(state => state.contextUsage);
  const linkType = useAetherStore(state => state.linkType);
  const setLinkType = useAetherStore(state => state.setLinkType);

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

  const toggleConnection = () => {
    if (isConnected) {
      disconnect();
      stopRecording();
    } else {
      const tools: any[] = [];
      const functionDeclarations = [];

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
        // Declaration for future maps integration if handled by neural-handlers
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
      {/* Central Digital Entity */}
      <div className="absolute inset-0 z-0">
        {/* Dynamic Ambient Glow (Gem #9: Vitality Mapping) */}
        <motion.div 
          className="absolute inset-0 bg-carbon-neon/5 blur-[120px] pointer-events-none"
          animate={{ 
            opacity: isRecording || isConnected ? [0.05, 0.1 + volume * 0.4, 0.05] : 0,
            scale: [1, 1 + volume * 0.2, 1]
          }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        />
        <DigitalEntity 
          state={agentStatus} 
          volume={volume} 
          agentName={activeAgent?.name || 'Neural Link'} 
          linkType={linkType}
        />
      </div>

      {/* Floating Controls Overlay */}
      <div className="relative z-10 w-full h-full pointer-events-none flex flex-col justify-between p-8">
        {/* Top Bar */}
        <div className="flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowLogs(!showLogs)}
              className="w-12 h-12 rounded-2xl quantum-glass border border-white/10 flex items-center justify-center hover:bg-white/5 transition-all"
            >
              <Terminal className={`w-5 h-5 ${showLogs ? 'text-cyan-400' : 'text-slate-400'}`} />
            </button>

            <button 
              onClick={() => isCapturing ? stopPulse() : startPulse()}
              disabled={!isConnected}
              className={`w-12 h-12 rounded-2xl quantum-glass border border-white/10 flex items-center justify-center hover:bg-white/5 transition-all ${!isConnected && 'opacity-50'}`}
              title={isCapturing ? "Stop Vision Pulse" : "Start Vision Pulse"}
            >
              {isCapturing ? (
                <Eye className="w-5 h-5 text-emerald-400 animate-pulse" />
              ) : (
                <EyeOff className="w-5 h-5 text-slate-400" />
              )}
            </button>
            
            {/* Context Usage Indicator */}
            <div className="flex flex-col gap-1 w-32">
              <div className="flex justify-between text-[8px] uppercase tracking-[0.15em] text-slate-500 font-bold">
                <span>Core Load</span>
                <span>{Math.round(contextUsage * 100)}%</span>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                <motion.div 
                  className={`h-full ${contextUsage > 0.8 ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]'}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${contextUsage * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-4 py-2 rounded-xl quantum-glass border border-white/10 shadow-inner">
              <div className={`w-2 h-2 rounded-full ${isConnected ? (linkType === 'bridge' ? 'bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.5)] animate-pulse' : 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)] animate-pulse') : 'bg-slate-600'}`} />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                {isConnected ? `${linkType === 'bridge' ? 'Local Spine' : 'Cloud Direct'}: ${activeAgent?.name || 'Sovereign'}` : 'Neural Link: Standby'}
              </span>
            </div>
            
            <button
              onClick={toggleConnection}
              className={`px-6 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] transition-all relative overflow-hidden group ${
                isConnected 
                  ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20' 
                  : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20'
              }`}
            >
              <span className="relative z-10">{isConnected ? 'Kill Link' : 'Establish Link'}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </button>
          </div>
        </div>

        {/* Bottom Bar: Mic & Widgets */}
        <div className="flex flex-col items-center gap-8">
          {/* Transcript Overlay (Sovereign Glass Style) */}
          <div className="w-full max-w-2xl flex flex-col items-center gap-3 mb-6 relative">
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-600 pointer-events-none">
              Live Neural Feed
            </div>
            
            {!isConnected && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center space-y-2 py-12"
              >
                <div className="text-xl font-display font-light text-slate-400 tracking-tight">
                  Wake the <span className="text-cyan-400 font-medium">Sovereign Entity</span>
                </div>
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">
                  Select &quot;Establish Link&quot; to begin neural synchronization
                </div>
              </motion.div>
            )}

            <AnimatePresence mode="popLayout">
              {transcript.slice(-2).map((msg, idx) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                  animate={{ 
                    opacity: idx === transcript.slice(-2).length - 1 ? 1 : 0.4, 
                    y: 0, 
                    filter: 'blur(0px)',
                    scale: idx === transcript.slice(-2).length - 1 ? 1 : 0.95
                  }}
                  exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
                  className={`w-full px-8 py-5 rounded-[24px] backdrop-blur-xl border ${
                    msg.role === 'user' 
                      ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-100 shadow-[0_10px_30px_rgba(16,185,129,0.05)]' 
                      : 'bg-cyan-500/5 border-cyan-500/10 text-cyan-100 shadow-[0_10px_30px_rgba(6,182,212,0.05)]'
                  } relative overflow-hidden group`}
                >
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${msg.role === 'user' ? 'bg-emerald-500' : 'bg-cyan-500'} opacity-20`} />
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-[8px] font-bold uppercase tracking-[0.2em] ${msg.role === 'user' ? 'text-emerald-500' : 'text-cyan-500'}`}>
                      {msg.role === 'user' ? 'Direct Input' : 'Neural Response'}
                    </span>
                    <span className="text-[8px] font-mono text-slate-600 uppercase">
                      {new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-sm md:text-base font-light leading-relaxed tracking-tight">
                    {msg.content}
                  </p>
                  
                  {/* Subtle Grid Pattern inside bubble */}
                  <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Active Widget (Holographic Execution HUD) */}
          <AnimatePresence>
            {activeWidget && (
              <motion.div 
                initial={{ opacity: 0, y: 50, scale: 0.9, rotateX: 20 }}
                animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                exit={{ opacity: 0, y: 50, scale: 0.9, rotateX: 20 }}
                className="w-full max-w-2xl pointer-events-auto"
                style={{ perspective: '1000px' }}
              >
                <div className="relative group">
                  {/* Holographic Border Effects */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-aether-neon via-purple-500 to-aether-neon rounded-[34px] opacity-20 blur-xl group-hover:opacity-40 transition-opacity animate-pulse" />
                  
                  <div className="relative bg-[#050A10]/90 backdrop-blur-3xl border border-white/10 rounded-[32px] p-8 shadow-2xl overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-aether-neon/50 to-transparent" />
                    
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-aether-neon/10 border border-aether-neon/30 flex items-center justify-center">
                          <Zap className="w-5 h-5 text-aether-neon animate-pulse" />
                        </div>
                        <div>
                          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Neural Execution HUD</h4>
                          <p className="text-[8px] font-mono text-aether-neon opacity-70 uppercase tracking-widest">Active Tool: {activeWidget.name || 'Universal Resolver'}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setActiveWidget(null)}
                        className="px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest text-red-400/60 hover:text-red-400 hover:bg-red-400/10 border border-red-400/20 transition-all"
                      >
                        Abort Step
                      </button>
                    </div>

                    <div className="space-y-6">
                      <div className="flex gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                        <div className="flex-1">
                          <WidgetRenderer data={activeWidget} />
                        </div>
                      </div>
                      
                      {/* Telemetry Data */}
                      <div className="flex items-center justify-between px-2 text-[8px] font-mono text-white/20 uppercase tracking-[0.2em]">
                        <div className="flex items-center gap-4">
                          <span>Latency: 42ms</span>
                          <span>Precision: 0.998</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Activity className="w-3 h-3 text-aether-neon/50" />
                          <span>Stream Stable</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Scanline Effect */}
                    <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_2px,3px_100%]" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Mic Trigger */}
          <div className="pointer-events-auto">
            <motion.button
              onClick={() => {
                if (isRecording) {
                  stopRecording();
                } else {
                  startRecording();
                  setIsThinking(true);
                }
              }}
              disabled={!isConnected}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-2xl relative ${
                !isConnected ? 'opacity-50 cursor-not-allowed bg-white/5 text-slate-500' :
                isRecording ? 'bg-red-500 text-white shadow-red-500/40' : 'bg-white text-black shadow-white/20'
              }`}
            >
              {isRecording ? (
                <MicOff className="w-8 h-8" />
              ) : (
                <Mic className="w-8 h-8" />
              )}
              
              {/* Voice Rings */}
              {isRecording && (
                <motion.div 
                  className="absolute inset-0 rounded-full border-4 border-red-500"
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
            </motion.button>
          </div>
        </div>
      </div>

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
