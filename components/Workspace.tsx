'use client';

import { Agent } from '@/lib/store/slices/createAgentSlice';
import { Mail, Calendar, HardDrive, LayoutGrid } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useAuth } from '@/components/Providers';
import { fetchLatestMails, fetchCalendarEvents, fetchDriveFiles, type GWSMail, type GWSEvent, type GWSFile } from '@/lib/gws-tools';

type WorkspaceProps = {
  activeAgent: Agent;
};

export default function Workspace({ activeAgent }: WorkspaceProps) {
  const { googleAccessToken } = useAuth();
  const [mails, setMails] = useState<GWSMail[]>([]);
  const [events, setEvents] = useState<GWSEvent[]>([]);
  const [files, setFiles] = useState<GWSFile[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadSovereignData() {
      if (googleAccessToken) {
        setLoading(true);
        try {
          const [mailData, eventData, fileData] = await Promise.all([
            fetchLatestMails(googleAccessToken, 3),
            fetchCalendarEvents(googleAccessToken, 3),
            fetchDriveFiles(googleAccessToken, 3)
          ]);
          setMails(mailData);
          setEvents(eventData);
          setFiles(fileData);
        } catch (err) {
          console.error("GWS Sync Error:", err);
        } finally {
          setLoading(false);
        }
      }
    }
    loadSovereignData();
  }, [googleAccessToken, activeAgent]);

  const widgets = [];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-6 rounded-3xl bg-white/5 border border-white/10 animate-pulse">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-5 h-5 bg-white/10 rounded-full" />
              <div className="w-24 h-4 bg-white/10 rounded" />
            </div>
            <div className="space-y-2">
              <div className="w-full h-3 bg-white/5 rounded" />
              <div className="w-3/4 h-3 bg-white/5 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // GWS Widgets (Sovereign Data)
  if (mails.length > 0) {
    widgets.push({
      id: 'gmail',
      title: 'Sovereign Mail',
      icon: <Mail className="w-5 h-5 text-red-400" />,
      content: (
        <div className="space-y-2">
          {mails.map(m => (
            <div key={m.id} className="text-xs border-l border-red-500/30 pl-2">
              <div className="font-bold truncate">{m.subject}</div>
              <div className="opacity-60 truncate">{m.snippet}</div>
            </div>
          ))}
        </div>
      )
    });
  }

  if (events.length > 0) {
    widgets.push({
      id: 'calendar',
      title: 'Upcoming Events',
      icon: <Calendar className="w-5 h-5 text-blue-400" />,
      content: (
        <div className="space-y-2">
          {events.map(ev => (
            <div key={ev.id} className="text-xs border-l border-blue-500/30 pl-2">
              <div className="font-bold">{ev.summary}</div>
              <div className="opacity-60 text-[10px]">{new Date(ev.start.dateTime || ev.start.date || '').toLocaleString()}</div>
            </div>
          ))}
        </div>
      )
    });
  }

  if (files.length > 0) {
    widgets.push({
      id: 'drive',
      title: 'Active Assets',
      icon: <HardDrive className="w-5 h-5 text-emerald-400" />,
      content: (
        <div className="space-y-2">
          {files.map(f => (
            <div key={f.id} className="flex items-center gap-2 text-xs">
              <LayoutGrid className="w-3 h-3 opacity-40" />
              <span className="truncate">{f.name}</span>
            </div>
          ))}
        </div>
      )
    });
  }

  // Legacy fallback or dynamic tool widgets if GWS is empty
  if (widgets.length === 0) {
    return (
        <div className="flex items-center justify-center p-20 opacity-30 italic text-white">
            Workspace idle. Awaiting sovereign command...
        </div>
    );
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
