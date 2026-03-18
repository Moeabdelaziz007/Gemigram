'use client';

import { Code2, Cloud, Bitcoin, Mail, Calendar, ExternalLink, Clock } from 'lucide-react';
import { EphemeralWidget } from './ui/EphemeralWidget';
import { WeatherResult, CryptoResult } from '../lib/types/live-api';
import { motion } from 'framer-motion';

export function WidgetRenderer({ data }: { data: any }) {
  if (!data) return null;

  // Gmail Triage Widget
  if (data.type === 'gmail_triage' || (data as any).messages) {
    const gmailData = data as any;
    return (
      <EphemeralWidget className="w-full h-full flex flex-col p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-red-500/20 flex items-center justify-center border border-red-500/30">
            <Mail className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-widest text-white">Gmail Triage</h2>
            <p className="text-[10px] font-mono text-white/30 uppercase">Primary Inbox • 10x Filter</p>
          </div>
        </div>
        <div className="flex-1 space-y-3 overflow-y-auto no-scrollbar">
          {gmailData.messages?.map((msg: any) => (
            <div key={msg.id} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-red-500/30 transition-all group cursor-pointer">
              <p className="text-sm text-white/80 line-clamp-2 leading-relaxed">{msg.snippet}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-[9px] font-mono text-white/20 uppercase">SEC-ENCRYPTED-ID: {msg.id.slice(0, 8)}</span>
                <ExternalLink className="w-3 h-3 text-white/0 group-hover:text-white/40 transition-all" />
              </div>
            </div>
          ))}
        </div>
      </EphemeralWidget>
    );
  }

  // Calendar Agenda Widget
  if (data.type === 'calendar_agenda' || (data as any).events) {
    const calendarData = data as any;
    return (
      <EphemeralWidget className="w-full h-full flex flex-col p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/20 flex items-center justify-center border border-sky-500/30">
            <Calendar className="w-6 h-6 text-sky-400" />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-widest text-white">Neural Agenda</h2>
            <p className="text-[10px] font-mono text-white/30 uppercase">Synchronized Events • Next 24H</p>
          </div>
        </div>
        <div className="flex-1 space-y-3 overflow-y-auto no-scrollbar">
          {calendarData.events?.map((ev: any, i: number) => (
            <div key={i} className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-sky-500/30 transition-all group">
              <div className="flex flex-col items-center justify-center min-w-[60px] border-r border-white/10 pr-4">
                <Clock className="w-3 h-3 text-sky-400/60 mb-1" />
                <span className="text-[10px] font-bold text-white/80">
                  {new Date(ev.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-white group-hover:text-sky-400 transition-colors">{ev.summary}</h3>
                {ev.location && <p className="text-[10px] text-white/40 uppercase tracking-tighter mt-1">{ev.location}</p>}
              </div>
            </div>
          ))}
        </div>
      </EphemeralWidget>
    );
  }

  // Weather Widget
  if ((data as WeatherResult).temperature !== undefined) {
    const weatherData = data as WeatherResult;
    return (
      <EphemeralWidget className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-cyan-500/10 to-transparent">
        <motion.div 
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="w-20 h-20 rounded-[2rem] bg-cyan-500/20 flex items-center justify-center mb-8 border border-cyan-400/30 shadow-[0_0_30px_rgba(34,211,238,0.2)]"
        >
          <Cloud className="w-10 h-10 text-cyan-400" />
        </motion.div>
        <h2 className="text-3xl font-black uppercase tracking-[0.2em] text-white mb-1">{weatherData.location}</h2>
        <p className="text-xs font-mono text-cyan-400/60 uppercase tracking-widest mb-6">{weatherData.condition}</p>
        <div className="text-8xl font-black text-white tracking-tighter mb-8 drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
          {weatherData.temperature}<span className="text-cyan-400">°</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-1">Humidity</p>
            <p className="text-lg font-bold text-white">{weatherData.humidity}</p>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center">
            <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-1">Wind</p>
            <p className="text-lg font-bold text-white">12km/h</p>
          </div>
        </div>
      </EphemeralWidget>
    );
  }

  // Crypto Widget
  if ((data as CryptoResult).symbol !== undefined) {
    const cryptoData = data as CryptoResult;
    const isPositive = !cryptoData.change24h.startsWith('-');
    return (
      <EphemeralWidget className="w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-amber-500/10 to-transparent">
        <div className="w-20 h-20 rounded-[2rem] bg-amber-500/20 flex items-center justify-center mb-8 border border-amber-400/30 shadow-[0_0_30px_rgba(251,191,36,0.2)]">
          <Bitcoin className="w-10 h-10 text-amber-400" />
        </div>
        <h2 className="text-3xl font-black uppercase tracking-[0.2em] text-white mb-1">{cryptoData.symbol}</h2>
        <div className="text-5xl font-black text-white tracking-tighter mb-4">
          {cryptoData.price}
        </div>
        <div className={`px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest ${isPositive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
          {isPositive ? '▲' : '▼'} {cryptoData.change24h}
        </div>
      </EphemeralWidget>
    );
  }

  // Fallback for unknown tools
  return (
    <EphemeralWidget className="w-full h-full flex flex-col p-6">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-aether-neon/40 transition-all">
          <Code2 className="w-6 h-6 text-white/40" />
        </div>
        <div>
          <h2 className="text-xl font-black uppercase tracking-widest text-white">Neural Output</h2>
          <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest">Protocol: JSON-EPHEMERAL-STREAM</p>
        </div>
      </div>
      <div className="flex-1 overflow-hidden custom-scrollbar bg-black/40 rounded-3xl p-6 border border-white/5 shadow-inner">
        <pre className="text-aether-neon/70 font-mono text-xs leading-relaxed whitespace-pre-wrap">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </EphemeralWidget>
  );
}
