'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Plus, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import { useMemory } from '@/hooks/useMemory';

interface MemoryWidgetProps {
  agentId: string;
}

export function MemoryWidget({ agentId }: MemoryWidgetProps) {
  const { memories, skills, loading, error, saveMemory, deleteMemory, addSkill } = useMemory(agentId);
  const [activeTab, setActiveTab] = useState<'memories' | 'skills'>('memories');
  const [newMemory, setNewMemory] = useState('');
  const [newSkillName, setNewSkillName] = useState('');

  const handleAddMemory = async () => {
    if (!newMemory.trim()) return;
    try {
      await saveMemory(newMemory, 'semantic', 5, { tags: [] });
      setNewMemory('');
    } catch (err) {
      console.error('Failed to save memory:', err);
    }
  };

  const handleAddSkill = async () => {
    if (!newSkillName.trim()) return;
    try {
      await addSkill(newSkillName, 'Custom skill', 'custom');
      setNewSkillName('');
    } catch (err) {
      console.error('Failed to add skill:', err);
    }
  };

  if (error) {
    return (
      <div className="p-4 md:p-6 rounded-2xl quantum-glass border border-red-500/30 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-red-400">Memory Error</p>
          <p className="text-xs text-red-300/70">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="flex gap-2">
        {(['memories', 'skills'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg transition-all text-sm font-semibold ${
              activeTab === tab
                ? 'bg-aether-neon text-black'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            {tab === 'memories' ? 'Memories' : 'Skills'}
            <span className="ml-2 text-xs opacity-70">
              {tab === 'memories' ? memories.length : skills.length}
            </span>
          </button>
        ))}
      </div>

      {/* Memories Tab */}
      <AnimatePresence mode="wait">
        {activeTab === 'memories' && (
          <motion.div
            key="memories"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            {/* Add Memory Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newMemory}
                onChange={(e) => setNewMemory(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddMemory()}
                placeholder="Add a memory..."
                className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-aether-neon/50 focus:bg-white/10"
              />
              <button
                onClick={handleAddMemory}
                disabled={!newMemory.trim() || loading}
                className="px-3 py-2 rounded-lg bg-aether-neon text-black font-semibold text-sm hover:bg-white disabled:opacity-50 transition-all"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Memory List */}
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {loading ? (
                <div className="text-center py-8 text-white/40 text-sm">Loading memories...</div>
              ) : memories.length > 0 ? (
                memories.slice(0, 10).map((memory) => (
                  <motion.div
                    key={memory.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10 group hover:border-white/20 transition-all"
                  >
                    <Brain className="w-4 h-4 text-aether-neon flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white break-words line-clamp-2">{memory.content}</p>
                      <p className="text-xs text-white/40 mt-1">{memory.type}</p>
                    </div>
                    <button
                      onClick={() => memory.id && deleteMemory(memory.id)}
                      className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-red-500/20 text-red-400 transition-all"
                      title="Delete memory"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8 text-white/40 text-sm">No memories yet</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skills Tab */}
      <AnimatePresence mode="wait">
        {activeTab === 'skills' && (
          <motion.div
            key="skills"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            {/* Add Skill Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                placeholder="Add a skill..."
                className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-aether-neon/50 focus:bg-white/10"
              />
              <button
                onClick={handleAddSkill}
                disabled={!newSkillName.trim() || loading}
                className="px-3 py-2 rounded-lg bg-aether-neon text-black font-semibold text-sm hover:bg-white disabled:opacity-50 transition-all"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Skills List */}
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {loading ? (
                <div className="text-center py-8 text-white/40 text-sm">Loading skills...</div>
              ) : skills.length > 0 ? (
                skills.map((skill) => (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10 group hover:border-white/20 transition-all"
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white">{skill.name}</p>
                      <p className="text-xs text-white/40">Success: {skill.successCount} • Fail: {skill.failureCount}</p>
                    </div>
                    <button
                      onClick={() => skill.id && deleteMemory(skill.id)}
                      className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-red-500/20 text-red-400 transition-all"
                      title="Delete skill"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8 text-white/40 text-sm">No skills yet</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
