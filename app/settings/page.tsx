'use client';

import { Shield, Database, ChevronRight, Mic, Bell, Palette, Key, Search, Save, RotateCcw, Brain, Package } from 'lucide-react';
import { useAuth } from '@/components/Providers';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SettingsPage() {
  const { login, user } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  const [searchQuery, setSearchQuery] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [apiKeys, setApiKeys] = useState({
    gemini: '',
    github: '',
    weather: ''
  });
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
    setSkills(skills.map(skill =>
      skill.id === id ? { ...skill, enabled: !skill.enabled } : skill
    ));
    setHasChanges(true);
  };

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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="pb-24"
        >
          {/* General Tab */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div className="glass-strong p-8 rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.05)_0%,transparent_60%)] pointer-events-none" />
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center border border-cyan-500/30 group-hover:scale-110 transition-transform duration-500">
                    <Database className="w-7 h-7 text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Workspace Integrations</h3>
                    <p className="text-sm text-white/40">Connect external services and manage data sources.</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {user ? (
                    <div className="w-full p-5 rounded-2xl glass-medium border border-cyan-500/30 flex items-center justify-between relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent pointer-events-none" />
                      <div className="flex items-center gap-4 relative z-10">
                        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                          <img src={user.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.uid}`} alt="Profile" className="w-10 h-10 rounded-lg" />
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-white tracking-wide">{user.displayName || 'Sovereign Agent'}</p>
                          <p className="text-xs text-cyan-400/80 font-mono mt-0.5">Connected: {user.email}</p>
                        </div>
                      </div>
                      <div className="px-4 py-1.5 rounded-full bg-cyan-500/20 border border-cyan-500/50 text-[10px] font-black uppercase tracking-widest text-cyan-400 relative z-10">
                        Verified
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={login}
                      className="w-full p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-cyan-400/50 transition-all flex items-center justify-between group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                      <div className="flex items-center gap-5 relative z-10">
                        <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center border border-red-500/30 group-hover:scale-110 transition-transform">
                          <span className="text-red-400 font-black text-xl">G</span>
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-white tracking-wide">Connect Google Workspace</p>
                          <p className="text-sm text-white/40 mt-1">Access Gmail, Calendar, and Drive integration</p>
                        </div>
                      </div>
                      <ChevronRight className="w-6 h-6 text-white/20 group-hover:text-cyan-400 transition-colors relative z-10" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Voice Tab */}
          {activeTab === 'voice' && (
            <div className="space-y-6">
              <div className="glass-strong p-8 rounded-3xl border border-white/10 bg-gradient-to-br from-neon-green/5 to-transparent backdrop-blur-xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(57,255,20,0.05)_0%,transparent_60%)] pointer-events-none" />
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-neon-green/20 to-cyan-500/20 flex items-center justify-center border border-neon-green/30 group-hover:scale-110 transition-transform duration-500">
                    <Mic className="w-7 h-7 text-neon-green drop-shadow-[0_0_10px_rgba(57,255,20,0.5)]" />
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
              <div className="glass-strong p-8 rounded-3xl border border-white/10 bg-gradient-to-br from-electric-purple/5 to-transparent backdrop-blur-xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.05)_0%,transparent_60%)] pointer-events-none" />
                <div className="flex items-center gap-4 mb-8 relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-electric-purple/20 to-pink-500/20 flex items-center justify-center border border-electric-purple/30 group-hover:scale-110 transition-transform duration-500">
                    <Shield className="w-7 h-7 text-electric-purple drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-white tracking-tight">Agent Skills & Tools</h3>
                    <p className="text-sm text-white/50 font-medium tracking-wide mt-1">Enable or disable neural capabilities for your sovereign agents.</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 relative z-10">
                  {skills.map((skill) => (
                    <motion.div
                      key={skill.id}
                      whileHover={{ y: -5 }}
                      className={`p-6 rounded-2xl glass-medium border transition-all duration-300 relative overflow-hidden group/card ${
                        skill.enabled ? 'border-electric-purple/40 bg-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.5)]' : 'border-white/10 bg-black/40'
                      }`}
                    >
                      {skill.enabled && (
                        <div className="absolute inset-0 bg-gradient-to-br from-electric-purple/5 to-transparent opacity-50 pointer-events-none" />
                      )}

                      <div className="flex items-start justify-between mb-4 relative z-10">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${skill.bg} ${skill.border} ${skill.color}`}>
                          <Database className="w-5 h-5" />
                        </div>
                        <button
                          onClick={() => toggleSkill(skill.id)}
                          className={`w-12 h-6 rounded-full relative transition-all duration-300 ${
                            skill.enabled
                              ? 'bg-gradient-to-r from-electric-purple to-pink-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]'
                              : 'bg-white/10 border border-white/20'
                          }`}
                        >
                          <motion.div
                            animate={{ x: skill.enabled ? 24 : 2 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm`}
                          />
                        </button>
                      </div>
                      <div className="relative z-10">
                        <p className={`font-bold text-lg mb-1 tracking-wide ${skill.enabled ? 'text-white' : 'text-white/60'}`}>{skill.name}</p>
                        <p className={`text-xs leading-relaxed ${skill.enabled ? 'text-white/60' : 'text-white/30'}`}>{skill.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="glass-strong p-8 rounded-3xl border border-white/10 bg-gradient-to-br from-red-500/5 to-transparent backdrop-blur-xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.05)_0%,transparent_60%)] pointer-events-none" />
                <div className="flex items-center gap-4 mb-8 relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center border border-red-500/30 group-hover:scale-110 transition-transform duration-500">
                    <Key className="w-7 h-7 text-red-400 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-white tracking-tight">API Keys & External Integrations</h3>
                    <p className="text-sm text-white/50 font-medium tracking-wide mt-1">Manage authentication tokens securely for external services.</p>
                  </div>
                </div>

                <div className="grid gap-6 relative z-10">
                  {/* Gemini API Key */}
                  <div className="p-6 rounded-3xl glass-medium border border-neon-blue/20 bg-gradient-to-r from-neon-blue/5 to-transparent relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-neon-blue/10 blur-[50px] pointer-events-none" />
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-neon-blue/10 flex items-center justify-center border border-neon-blue/30">
                          <Brain className="w-5 h-5 text-neon-blue" />
                        </div>
                        <div>
                          <p className="font-bold text-white tracking-wide">Google Gemini API Key</p>
                          <p className="text-xs text-white/50 mt-0.5">Core intelligence engine required for agent reasoning</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                         <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                         <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest">Active</span>
                      </div>
                    </div>

                    <div className="relative mt-2">
                      <input
                        type="password"
                        value={apiKeys.gemini || 'AIzaSyA_mock_key_value_for_display_only'}
                        onChange={(e) => {
                          setApiKeys({...apiKeys, gemini: e.target.value});
                          setHasChanges(true);
                        }}
                        className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-neon-blue font-mono text-sm tracking-widest focus:outline-none focus:border-neon-blue/50 transition-colors placeholder:text-white/20"
                        placeholder="Enter your Gemini API key..."
                      />
                      <button className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-bold text-white/70 transition-colors uppercase tracking-wider">
                        Update
                      </button>
                    </div>
                  </div>

                  {/* MCP Marketplace Key */}
                  <div className="p-6 rounded-3xl glass-medium border border-electric-purple/20 bg-gradient-to-r from-electric-purple/5 to-transparent relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-electric-purple/10 blur-[50px] pointer-events-none" />
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-electric-purple/10 flex items-center justify-center border border-electric-purple/30">
                          <Package className="w-5 h-5 text-electric-purple" />
                        </div>
                        <div>
                          <p className="font-bold text-white tracking-wide">MCP Marketplace Token</p>
                          <p className="text-xs text-white/50 mt-0.5">Access official Model Context Protocol servers</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                         <div className="w-2 h-2 rounded-full bg-white/30" />
                         <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Optional</span>
                      </div>
                    </div>

                    <div className="relative mt-2">
                      <input
                        type="password"
                        value={apiKeys.github}
                        onChange={(e) => {
                          setApiKeys({...apiKeys, github: e.target.value});
                          setHasChanges(true);
                        }}
                        className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-electric-purple font-mono text-sm tracking-widest focus:outline-none focus:border-electric-purple/50 transition-colors placeholder:text-white/20"
                        placeholder="ghp_..."
                      />
                    </div>
                  </div>

                  {/* Two-Factor Auth */}
                  <div className="p-6 rounded-3xl glass-medium border border-red-500/20 bg-gradient-to-r from-red-500/5 to-transparent flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20 group-hover:bg-red-500/20 transition-colors">
                        <Shield className="w-6 h-6 text-red-400" />
                      </div>
                      <div>
                        <p className="font-bold text-white tracking-wide">Two-Factor Authentication</p>
                        <p className="text-xs text-white/50 mt-1">Add an extra layer of security to your sovereign workspace</p>
                      </div>
                    </div>
                    <button className="px-6 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-bold text-xs uppercase tracking-widest transition-all hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                      Enable 2FA
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Action Buttons - Fixed at bottom */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="fixed bottom-8 right-8 z-50 flex items-center justify-end gap-4 p-4 glass-strong border border-white/10 rounded-2xl backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)]"
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
          className={`flex items-center gap-2 px-8 py-3 rounded-xl font-black text-sm uppercase tracking-[0.2em] transition-all relative overflow-hidden group ${
            hasChanges
              ? 'bg-gemigram-neon text-black shadow-[0_0_30px_rgba(57,255,20,0.4)] hover:shadow-[0_0_50px_rgba(57,255,20,0.6)] hover:scale-105'
              : 'bg-white/5 text-white/30 cursor-not-allowed border border-white/10'
          }`}
        >
          {hasChanges && (
             <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          )}
          <Save className="w-4 h-4 relative z-10" />
          <span className={`relative z-10 ${hasChanges ? '' : 'opacity-50'}`}>Persist_Changes</span>
        </button>
      </motion.div>
    </div>
  );
}
