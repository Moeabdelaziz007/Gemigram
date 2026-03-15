'use client';

import { useState, useEffect } from 'react';
import { useLiveAPI } from '../hooks/useLiveAPI';
import { WidgetRenderer } from './WidgetRenderer';
import { Mic, MicOff, Zap } from 'lucide-react';

export function VoiceAgent() {
  const [apiKey] = useState(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');
  const [activeWidget, setActiveWidget] = useState<any>(null);
  const [agentState, setAgentState] = useState<'Disconnected' | 'Listening' | 'Thinking' | 'Speaking'>('Disconnected');

  const { isConnected, isRecording, connect, disconnect, startRecording, stopRecording } = useLiveAPI(apiKey, (call) => {
    setActiveWidget(call);
    setAgentState('Thinking');
  });

  useEffect(() => {
    if (!isConnected) setAgentState('Disconnected');
    else if (isRecording) setAgentState('Listening');
    else setAgentState('Speaking');
  }, [isConnected, isRecording]);

  const toggleConnection = () => {
    if (isConnected) {
      disconnect();
      stopRecording();
    } else {
      connect();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-white p-6">
      {/* Sub-task 1: Voice Controller UI (The Node) */}
      <div className="glass-container p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col items-center gap-6">
        <div className="relative">
          <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 ${agentState === 'Listening' ? 'bg-emerald-500/20 animate-pulse' : 'bg-white/5'}`}>
            <Zap className={`w-16 h-16 ${agentState === 'Thinking' ? 'animate-spin' : ''}`} />
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-red-500'}`} />
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={toggleConnection}
            className={`px-8 py-4 rounded-full font-semibold flex items-center gap-3 transition-all ${
              isConnected ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
            }`}
          >
            {isConnected ? 'Disconnect' : 'Connect'}
          </button>
          
          <button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={!isConnected}
            className={`px-8 py-4 rounded-full font-semibold flex items-center gap-3 transition-all ${
              !isConnected ? 'opacity-50 cursor-not-allowed bg-zinc-800' :
              isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            {isRecording ? <MicOff /> : <Mic />}
            {isRecording ? 'Stop Listening' : 'Start Listening'}
          </button>
        </div>
        
        <p className="text-sm text-zinc-400 font-mono tracking-widest uppercase">{agentState}</p>
      </div>

      {/* Sub-task 2: The Dynamic Workspace (The Arena) */}
      <div className="mt-12 w-full max-w-4xl min-h-[400px] rounded-3xl bg-white/5 border border-white/10 p-6 flex flex-col items-center justify-center">
        {activeWidget ? (
          <WidgetRenderer data={activeWidget} />
        ) : (
          <p className="text-zinc-600 font-mono">Awaiting tool execution...</p>
        )}
      </div>
    </div>
  );
}
