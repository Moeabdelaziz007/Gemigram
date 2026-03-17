'use client';

import { Shield, Database, ChevronRight, Mic, Bell, Palette, Key, Search, Save, RotateCcw } from 'lucide-react';
import { useAuth } from '@/components/Providers';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SettingsPage() {
  const { login } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  const [searchQuery, setSearchQuery] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  const tabs = [
    { id: 'general', label: 'General', icon: Database },
    { id: 'voice', label: 'Voice', icon: Mic },
    { id: 'skills', label: 'Skills', icon: Shield },
    { id: 'security', label: 'Security', icon: Key },
  ];

  const handleSave = () => {
    // TODO: Implement save logic
    setHasChanges(false);
  };

  const handleReset = () => {
    // TODO: Implement reset logic
    setHasChanges(false);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto h-full overflow-y-auto">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-neon-green via-cyan-400 to-electric-purple drop-shadow-[0_0_30px_rgba(16,255,135,0.3)]">
          Settings
        </h2>
        <p className="text-slate-400">Configure your workspace and permissions.</p>
      </motion.div>

      {/* Search Bar */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-8 relative"
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search settings..."
            className="w-full pl-12 pr-4 py-4 rounded-2xl cyber-panel border border-white/10 focus:border-neon-green/50 focus:outline-none focus:ring-2 focus:ring-neon-green/20 bg-white/5 text-white placeholder:text-white/30 transition-all"
          />
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex gap-2 mb-8 p-1.5 rounded-2xl cyber-panel border border-white/10 overflow-x-auto"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wider transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-gemigram-neon text-black shadow-[0_0_20px_rgba(16,255,135,0.3)]'
                : 'text-white/40 hover:text-white hover:bg-white/5'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </motion.div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {/* General Tab */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div className="cyber-panel p-8 rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center border border-cyan-500/30">
                    <Database className="w-7 h-7 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Workspace Integrations</h3>
                    <p className="text-sm text-white/40">Connect external services and manage data sources.</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <button
                    onClick={login}
                    className="w-full p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-cyan-400/50 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center border border-red-500/30">
                        <span className="text-red-400 font-bold text-lg">G</span>
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-white">Connect Google Workspace</p>
                        <p className="text-xs text-white/40 mt-0.5">Access Gmail, Calendar, and Drive</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Voice Tab */}
          {activeTab === 'voice' && (
            <div className="space-y-6">
              <div className="cyber-panel p-8 rounded-3xl border border-white/10 bg-gradient-to-br from-neon-green/5 to-transparent backdrop-blur-xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-neon-green/20 to-cyan-500/20 flex items-center justify-center border border-neon-green/30">
                    <Mic className="w-7 h-7 text-neon-green" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Voice Configuration</h3>
                    <p className="text-sm text-white/40">Customize voice settings and audio preferences.</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="font-medium text-white">Voice Selection</p>
                        <p className="text-xs text-white/40 mt-0.5">Choose your agent's voice identity</p>
                      </div>
                      <select className="px-4 py-2 rounded-xl cyber-panel border border-white/10 text-white text-sm focus:border-neon-green/50 focus:outline-none bg-white/5">
                        <option>Zephyr (Default)</option>
                        <option>Charon</option>
                        <option>Puck</option>
                        <option>Kore</option>
                        <option>Fenrir</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="font-medium text-white">Speech Rate</p>
                        <p className="text-xs text-white/40 mt-0.5">Adjust conversation speed</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-white/40">Slow</span>
                        <input 
                          type="range" 
                          min="0.5"
                          max="2"
                          step="0.1"
                          defaultValue="1"
                          className="w-32 accent-neon-green"
                        />
                        <span className="text-xs text-white/40">Fast</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-white">Voice Cloning</p>
                        <p className="text-xs text-white/40 mt-0.5">Create custom voice profiles</p>
                      </div>
                      <button className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-neon-green to-mint-chip text-black font-bold text-sm uppercase tracking-wider hover:shadow-[0_0_20px_rgba(16,255,135,0.3)] transition-all">
                        Clone Voice
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Skills Tab */}
          {activeTab === 'skills' && (
            <div className="space-y-6">
              <div className="cyber-panel p-8 rounded-3xl border border-white/10 bg-gradient-to-br from-electric-purple/5 to-transparent backdrop-blur-xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-electric-purple/20 to-pink-500/20 flex items-center justify-center border border-electric-purple/30">
                    <Shield className="w-7 h-7 text-electric-purple" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Agent Skills & Tools</h3>
                    <p className="text-sm text-white/40">Enable or disable capabilities for your agents.</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { name: 'Google Search', desc: 'Real-time web information', enabled: true },
                    { name: 'Weather Data', desc: 'Current conditions and forecasts', enabled: true },
                    { name: 'Crypto Prices', desc: 'Live cryptocurrency rates', enabled: false },
                    { name: 'Google Maps', desc: 'Location and navigation data', enabled: false },
                    { name: 'Calculator', desc: 'Mathematical computations', enabled: true },
                    { name: 'Semantic Memory', desc: 'Long-term context retention', enabled: true },
                  ].map((skill, idx) => (
                    <div key={idx} className="p-5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between group hover:border-electric-purple/50 transition-all">
                      <div>
                        <p className="font-medium text-white">{skill.name}</p>
                        <p className="text-xs text-white/40 mt-0.5">{skill.desc}</p>
                      </div>
                      <button
                        className={`w-12 h-6 rounded-full relative transition-all ${
                          skill.enabled
                            ? 'bg-gradient-to-r from-electric-purple to-pink-500'
                            : 'bg-white/10'
                        }`}
                      >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${
                          skill.enabled ? 'right-1' : 'left-1'
                        }`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="cyber-panel p-8 rounded-3xl border border-white/10 bg-gradient-to-br from-red-500/5 to-transparent backdrop-blur-xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center border border-red-500/30">
                    <Key className="w-7 h-7 text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Security & API Keys</h3>
                    <p className="text-sm text-white/40">Manage authentication and access tokens.</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-medium text-white">Gemini API Key</p>
                        <p className="text-xs text-white/40 mt-0.5">Required for agent intelligence</p>
                      </div>
                      <button className="px-4 py-2 rounded-xl border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-all text-sm">
                        Update
                      </button>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-black/20 border border-white/5">
                      <div className="flex-1 font-mono text-xs text-white/30">sk_•••••••••••••••••••••••••</div>
                      <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-white">Two-Factor Authentication</p>
                        <p className="text-xs text-white/40 mt-0.5">Add an extra layer of security</p>
                      </div>
                      <button className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 text-red-400 font-bold text-sm uppercase tracking-wider hover:bg-red-500/30 transition-all">
                        Enable 2FA
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Action Buttons */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="sticky bottom-8 mt-8 flex items-center justify-end gap-4 p-4 cyber-panel border border-white/10 rounded-2xl backdrop-blur-xl"
      >
        <button 
          onClick={handleReset}
          className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="font-bold text-sm uppercase tracking-wider">Reset</span>
        </button>
        <button 
          onClick={handleSave}
          disabled={!hasChanges}
          className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm uppercase tracking-wider transition-all ${
            hasChanges
              ? 'bg-gemigram-neon text-black shadow-[0_0_30px_rgba(16,255,135,0.3)] hover:shadow-[0_0_50px_rgba(16,255,135,0.5)]'
              : 'bg-white/5 text-white/30 cursor-not-allowed'
          }`}
        >
          <Save className="w-4 h-4" />
          <span className={hasChanges ? '' : 'opacity-50'}>Persist_Changes</span>
        </button>
      </motion.div>
    </div>
  );
}
