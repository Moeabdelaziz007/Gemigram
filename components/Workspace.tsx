'use client';

import { Agent } from '@/lib/store/useAetherStore';
import { Cloud, Newspaper, Bitcoin, Calculator, Database } from 'lucide-react';
import { motion } from 'framer-motion';
type WorkspaceProps = {
  activeAgent: Agent;
};

export default function Workspace({ activeAgent }: WorkspaceProps) {
  const widgets = [];

  if (activeAgent.tools?.weather) {
    widgets.push({
      id: 'weather',
      title: 'Weather',
      icon: <Cloud className="w-5 h-5 text-cyan-400" />,
      content: '22°C, Clear Skies'
    });
  }
  if (activeAgent.tools?.news) {
    widgets.push({
      id: 'news',
      title: 'Latest News',
      icon: <Newspaper className="w-5 h-5 text-fuchsia-400" />,
      content: 'AI breakthroughs continue to accelerate global innovation.'
    });
  }
  if (activeAgent.tools?.crypto) {
    widgets.push({
      id: 'crypto',
      title: 'Crypto Market',
      icon: <Bitcoin className="w-5 h-5 text-emerald-400" />,
      content: 'BTC: $98,450.22'
    });
  }
  if (activeAgent.tools?.calculator) {
    widgets.push({
      id: 'calc',
      title: 'Calculator',
      icon: <Calculator className="w-5 h-5 text-amber-400" />,
      content: 'Ready for input'
    });
  }
  if (activeAgent.tools?.semanticMemory) {
    widgets.push({
      id: 'memory',
      title: 'RAG Memory',
      icon: <Database className="w-5 h-5 text-indigo-400" />,
      content: '5 memories indexed'
    });
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
      {widgets.map((widget, index) => (
        <motion.div
          key={widget.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition-colors"
        >
          <div className="flex items-center gap-3 mb-4">
            {widget.icon}
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-300">{widget.title}</h3>
          </div>
          <div className="text-white font-medium">{widget.content}</div>
        </motion.div>
      ))}
    </div>
  );
}
