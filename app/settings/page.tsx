'use client';

import { Shield, ChevronRight, Mic, Key, Search, Database } from 'lucide-react';
import { useAuth } from '@/components/Providers';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SettingsPage() {
  const { login, user } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  const [searchQuery, setSearchQuery] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [skills, setSkills] = useState([
    { id: 'google_search', name: 'Google Search', desc: 'Real-time web information', enabled: true, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/30' },
    { id: 'weather', name: 'Weather Data', desc: 'Current conditions and forecasts', enabled: true, color: 'text-cyan-400', bg: 'bg-cyan-400/10', border: 'border-cyan-400/30' },
    { id: 'crypto', name: 'Crypto Prices', desc: 'Live cryptocurrency rates', enabled: false, color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/30' },
    { id: 'maps', name: 'Google Maps', desc: 'Location and navigation data', enabled: false, color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/30' },
    { id: 'calculator', name: 'Calculator', desc: 'Mathematical computations', enabled: true, color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/30' },
    { id: 'semantic_memory', name: 'Semantic Memory', desc: 'Long-term context retention', enabled: true, color: 'text-gemigram-neon', bg: 'bg-gemigram-neon/10', border: 'border-gemigram-neon/30' },
  ]);

  const tabs = [
    { id: 'general', label: 'General', icon: Database },
    { id: 'voice', label: 'Voice', icon: Mic },
    { id: 'skills', label: 'Skills & Tools', icon: Shield },
    { id: 'security', label: 'API & Security', icon: Key },
  ];

  const toggleSkill = (id: string) => {
    setSkills(skills.map((skill) => (skill.id === id ? { ...skill, enabled: !skill.enabled } : skill)));
    setHasChanges(true);
  };

  return (
    <div className="page-shell page-stack py-4 sm:py-6 md:py-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <h2 className="page-title bg-gradient-to-r from-neon-green via-cyan-400 to-electric-purple bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(16,255,135,0.3)]">Settings</h2>
        <p className="page-copy">Configure your workspace and permissions.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/30" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search settings..."
          className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-12 pr-4 text-white placeholder:text-white/30 transition-all focus:border-neon-green/50 focus:outline-none focus:ring-2 focus:ring-neon-green/20"
        />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex gap-2 overflow-x-auto rounded-2xl border border-white/10 p-1.5 cyber-panel no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all sm:px-6 ${
              activeTab === tab.id ? 'bg-gemigram-neon text-black shadow-[0_0_20px_rgba(16,255,135,0.3)]' : 'text-white/40 hover:bg-white/5 hover:text-white'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4, ease: 'easeOut' }} className="pb-4">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div className="rounded-[1.75rem] border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-5 glass-strong sm:p-6 md:p-8">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/20 to-blue-500/20">
                    <Database className="h-7 w-7 text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Workspace Integrations</h3>
                    <p className="text-sm text-white/40">Connect external services and manage data sources.</p>
                  </div>
                </div>
                {user ? (
                  <div className="relative flex flex-col gap-4 rounded-2xl border border-cyan-500/30 p-5 glass-medium sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border border-white/20 bg-white/10">
                        <img src={user.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.uid}`} alt="Profile" className="h-10 w-10 rounded-lg" />
                      </div>
                      <div className="text-left">
                        <p className="font-bold tracking-wide text-white">{user.displayName || 'Sovereign Agent'}</p>
                        <p className="mt-0.5 text-xs font-mono text-cyan-400/80">Connected: {user.email}</p>
                      </div>
                    </div>
                    <div className="w-fit rounded-full border border-cyan-500/50 bg-cyan-500/20 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-cyan-400">Verified</div>
                  </div>
                ) : (
                  <button onClick={login} className="group relative flex w-full flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 text-left transition-all hover:border-cyan-400/50 hover:bg-white/10 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-5">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-red-500/30 bg-red-500/20 transition-transform group-hover:scale-110">
                        <span className="text-xl font-black text-red-400">G</span>
                      </div>
                      <div>
                        <p className="font-bold tracking-wide text-white">Connect Google Workspace</p>
                        <p className="mt-1 text-sm text-white/40">Access Gmail, Calendar, and Drive integration</p>
                      </div>
                    </div>
                    <ChevronRight className="h-6 w-6 text-white/20 transition-colors group-hover:text-cyan-400" />
                  </button>
                )}
              </div>
            </div>
          )}

          {activeTab === 'voice' && (
            <div className="space-y-6">
              <div className="rounded-[1.75rem] border border-white/10 bg-gradient-to-br from-neon-green/5 to-transparent p-5 glass-strong sm:p-6 md:p-8">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-neon-green/30 bg-gradient-to-br from-neon-green/20 to-cyan-500/20">
                    <Mic className="h-7 w-7 text-neon-green drop-shadow-[0_0_10px_rgba(57,255,20,0.5)]" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Voice Configuration</h3>
                    <p className="text-sm text-white/40">Customize voice settings and audio preferences.</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="font-medium text-white">Voice Selection</p>
                        <p className="mt-0.5 text-xs text-white/40">Choose your agent's voice identity</p>
                      </div>
                      <select className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-neon-green/50 focus:outline-none">
                        <option>Zephyr (Default)</option>
                        <option>Charon</option>
                        <option>Puck</option>
                        <option>Kore</option>
                        <option>Fenrir</option>
                      </select>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="font-medium text-white">Speech Rate</p>
                        <p className="mt-0.5 text-xs text-white/40">Adjust conversation speed</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-xs text-white/40">Slow</span>
                        <input type="range" min="0.5" max="2" step="0.1" defaultValue="1" className="w-full max-w-40 accent-neon-green" />
                        <span className="text-xs text-white/40">Fast</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="font-medium text-white">Voice Cloning</p>
                        <p className="mt-0.5 text-xs text-white/40">Create custom voice profiles</p>
                      </div>
                      <button className="btn-primary w-full md:w-auto">Clone Voice</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="space-y-6">
              <div className="rounded-[1.75rem] border border-white/10 bg-gradient-to-br from-electric-purple/5 to-transparent p-5 glass-strong sm:p-6 md:p-8">
                <div className="relative z-10 mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-electric-purple/30 bg-gradient-to-br from-electric-purple/20 to-pink-500/20">
                    <Shield className="h-7 w-7 text-electric-purple drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black tracking-tight text-white sm:text-3xl">Agent Skills & Tools</h3>
                    <p className="mt-1 text-sm font-medium tracking-wide text-white/50">Enable or disable neural capabilities for your sovereign agents.</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {skills.map((skill) => (
                    <motion.div key={skill.id} whileHover={{ y: -5 }} className={`relative overflow-hidden rounded-2xl border p-5 glass-medium transition-all duration-300 ${skill.enabled ? 'border-electric-purple/40 bg-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.5)]' : 'border-white/10 bg-black/40'}`}>
                      <div className="mb-4 flex items-start justify-between gap-4">
                        <div>
                          <h4 className="text-base font-black uppercase tracking-tight text-white">{skill.name}</h4>
                          <p className="mt-1 text-sm text-white/45">{skill.desc}</p>
                        </div>
                        <button onClick={() => toggleSkill(skill.id)} className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ${skill.enabled ? 'bg-gemigram-neon text-black' : 'bg-white/10 text-white/60'}`}>
                          {skill.enabled ? 'Enabled' : 'Disabled'}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="rounded-[1.75rem] border border-white/10 p-5 glass-strong sm:p-6 md:p-8">
              <div className="mb-6 space-y-2">
                <h3 className="text-2xl font-black text-white">API & Security</h3>
                <p className="text-sm text-white/50">Protected credentials and access control stay stacked on smaller screens.</p>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {['Gemini API Key', 'GitHub Token', 'Weather Provider Key', 'Audit Webhook'].map((item) => (
                  <label key={item} className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-white/60">{item}</span>
                    <input type="password" placeholder="••••••••••••" className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-gemigram-neon/50" />
                  </label>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {hasChanges && (
        <div className="fixed-safe-bottom safe-x fixed left-4 right-4 z-[90] sm:left-auto sm:right-6">
          <div className="ml-auto flex w-full max-w-md flex-col gap-3 rounded-2xl border border-gemigram-neon/20 bg-black/80 p-4 shadow-2xl backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-white/70">You have unsaved settings changes.</p>
            <button onClick={() => setHasChanges(false)} className="btn-primary w-full sm:w-auto">Save Changes</button>
          </div>
        </div>
      )}
    </div>
  );
}
