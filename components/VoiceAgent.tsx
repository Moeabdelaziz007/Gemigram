'use client';

import { useState, useEffect, useMemo } from 'react';
import { useLiveAPI } from '../hooks/useLiveAPI';
import { useAetherStore } from '../lib/store/useAetherStore';
import { WidgetRenderer } from './WidgetRenderer';
import { Mic, MicOff, Zap, Activity, Settings, Maximize2, User, Terminal, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { DigitalEntity } from './DigitalEntity';

type VoiceAgentProps = {
  activeAgent: any;
};

export function VoiceAgent({ activeAgent }: VoiceAgentProps) {
  const [apiKey] = useState(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');
  const [activeWidget, setActiveWidget] = useState<any>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const transcript = useAetherStore(state => state.transcript);
  const contextUsage = useAetherStore(state => state.contextUsage);

  const { 
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
  } = useLiveAPI(apiKey, (call) => {
    setActiveWidget(call);
    setIsThinking(false);
  });

  const agentState = useMemo(() => {
    if (!isConnected) return 'Disconnected';
    if (isThinking) return 'Thinking';
    if (isRecording) return 'Listening';
    return 'Speaking';
  }, [isConnected, isThinking, isRecording]);

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
        <DigitalEntity 
          state={agentState} 
          volume={volume} 
          agentName={activeAgent?.name || 'Neural Link'} 
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
              <div className="flex justify-between text-[8px] uppercase tracking-widest text-slate-500 font-bold">
                <span>Context</span>
                <span>{Math.round(contextUsage * 100)}%</span>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  className={`h-full ${contextUsage > 0.6 ? 'bg-red-500' : 'bg-cyan-500'}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${contextUsage * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl quantum-glass border border-white/10">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Neural Spine: {isConnected ? 'Active' : 'Standby'}</span>
            </div>
            <button
              onClick={toggleConnection}
              className={`px-8 py-3 rounded-full font-bold text-xs uppercase tracking-[0.2em] transition-all ${
                isConnected 
                  ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20' 
                  : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20'
              }`}
            >
              {isConnected ? 'Kill Link' : 'Establish Link'}
            </button>
          </div>
        </div>

        {/* Bottom Bar: Mic & Widgets */}
        <div className="flex flex-col items-center gap-8">
          {/* Transcript Overlay (Zero-G Style) */}
          <div className="w-full max-w-xl flex flex-col items-center gap-2 mb-4">
            <AnimatePresence mode="popLayout">
              {transcript.slice(-3).map((msg, idx) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1 - (2 - idx) * 0.3, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className={`px-6 py-3 rounded-2xl backdrop-blur-md border ${
                    msg.role === 'user' 
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                      : 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'
                  } text-sm font-medium shadow-xl`}
                >
                  {msg.content}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Active Widget (Satellite View) */}
          <AnimatePresence>
            {activeWidget && (
              <motion.div 
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 50, scale: 0.9 }}
                className="w-full max-w-2xl pointer-events-auto"
              >
                <div className="quantum-glass border border-white/10 rounded-[32px] p-6 shadow-2xl relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-fuchsia-500/5 pointer-events-none" />
                  <div className="flex items-center justify-between mb-4 relative z-10">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Neural Output</span>
                    <button 
                      onClick={() => setActiveWidget(null)}
                      className="text-[10px] font-bold uppercase tracking-widest text-red-400 hover:text-red-300 transition-colors"
                    >
                      Dismiss
                    </button>
                  </div>
                  <div className="relative z-10">
                    <WidgetRenderer data={activeWidget} />
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
