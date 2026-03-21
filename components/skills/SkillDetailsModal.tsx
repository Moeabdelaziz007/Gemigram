'use client';

/**
 * 📋 Skill Details Modal Component
 * 
 * Comprehensive skill information display with capabilities, requirements,
 * dependencies, and metadata in a beautiful modal dialog.
 */

import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Key, Shield, Server, Cpu, Clock, Tag, BookOpen } from 'lucide-react';
import { SkillDefinition } from '@/lib/agents/skill-types';
import { skillRegistry } from '@/lib/agents/skill-registry';
import * as LucideIcons from 'lucide-react';

interface SkillDetailsModalProps {
  skill: SkillDefinition;
  isOpen: boolean;
  onClose: () => void;
}

export default function SkillDetailsModal({ 
  skill, 
  isOpen, 
  onClose 
}: SkillDetailsModalProps) {
  // Get Lucide icon dynamically
  const IconComponent = (LucideIcons as Record<string, React.ComponentType<unknown>>)[skill.metadata.icon] || LucideIcons.Puzzle;
  
  /**
   * Format capability name for display
   */
  const formatCapabilityName = (cap: string): string => {
    return cap
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  /**
   * Get dependency skill details
   */
  const getDependencySkills = () => {
    if (!skill.dependencies) return [];
    return skill.dependencies.map(depId => ({
      id: depId,
      name: skillRegistry.get(depId)?.name || depId,
      exists: skillRegistry.has(depId)
    }));
  };
  
  const dependencySkills = getDependencySkills();
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
            onClick={onClose}
          >
            {/* Modal Content */}
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="w-full max-w-3xl max-h-[85vh] overflow-y-auto bg-[#03070C]/95 border border-white/10 rounded-3xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Section */}
              <div className="sticky top-0 z-10 px-6 sm:p-8 pb-6 border-b border-white/10 bg-[#03070C]/95 backdrop-blur-sm">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors p-2 touch-target-comfortable"
                  aria-label="Close modal"
                >
                  <X className="w-6 h-6" />
                </button>
                
                <div className="flex items-start gap-4">
                  {/* Skill Icon */}
                  <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center ${skill.metadata.color} bg-white/10 shadow-lg`}>
                    <IconComponent className="w-8 h-8 sm:w-10 sm:h-10" />
                  </div>
                  
                  {/* Title & Description */}
                  <div className="flex-1 pt-2">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                      {skill.name}
                    </h2>
                    <p className="text-white/60 text-sm sm:text-base leading-relaxed">
                      {skill.description}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Content Sections */}
              <div className="px-6 sm:p-8 space-y-8">
                {/* Capabilities */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <Cpu className="w-5 h-5 text-gemigram-neon" />
                    <h3 className="text-lg font-bold text-white">Capabilities</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {skill.capabilities.map((cap, index) => (
                      <motion.div
                        key={cap}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5"
                      >
                        <Check className="w-4 h-4 text-gemigram-neon flex-shrink-0" />
                        <span className="text-white/80 text-sm">{formatCapabilityName(cap)}</span>
                      </motion.div>
                    ))}
                  </div>
                </section>
                
                {/* Requirements */}
                {Object.keys(skill.requirements).length > 0 && (
                  <section>
                    <div className="flex items-center gap-2 mb-4">
                      <Key className="w-5 h-5 text-yellow-500" />
                      <h3 className="text-lg font-bold text-white">Requirements</h3>
                    </div>
                    <div className="space-y-3">
                      {skill.requirements.apiKeys && skill.requirements.apiKeys.length > 0 && (
                        <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                          <div className="flex items-center gap-2 mb-2">
                            <Key className="w-4 h-4 text-yellow-500" />
                            <span className="font-semibold text-white text-sm">API Keys Required</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {skill.requirements.apiKeys.map(key => (
                              <span key={key} className="text-xs px-3 py-1.5 bg-yellow-500/20 text-yellow-400 rounded-lg font-mono">
                                {key}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {skill.requirements.oauthScopes && skill.requirements.oauthScopes.length > 0 && (
                        <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                          <div className="flex items-center gap-2 mb-2">
                            <Shield className="w-4 h-4 text-blue-500" />
                            <span className="font-semibold text-white text-sm">OAuth Scopes</span>
                          </div>
                          <ul className="space-y-1.5">
                            {skill.requirements.oauthScopes.map((scope, index) => (
                              <li key={index} className="text-xs text-white/60 font-mono break-all pl-4 border-l-2 border-blue-500/30">
                                {scope}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {skill.requirements.externalServices && skill.requirements.externalServices.length > 0 && (
                        <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                          <div className="flex items-center gap-2 mb-2">
                            <Server className="w-4 h-4 text-purple-500" />
                            <span className="font-semibold text-white text-sm">External Services</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {skill.requirements.externalServices.map(service => (
                              <span key={service} className="text-xs px-3 py-1.5 bg-purple-500/20 text-purple-400 rounded-lg">
                                {service}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {skill.requirements.minMemoryMB && (
                        <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                          <div className="flex items-center gap-2">
                            <Cpu className="w-4 h-4 text-green-500" />
                            <span className="font-semibold text-white text-sm">Minimum Memory</span>
                            <span className="text-white/60 text-sm ml-auto">{skill.requirements.minMemoryMB} MB</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </section>
                )}
                
                {/* Dependencies */}
                {dependencySkills.length > 0 && (
                  <section>
                    <div className="flex items-center gap-2 mb-4">
                      <Tag className="w-5 h-5 text-accent-purple" />
                      <h3 className="text-lg font-bold text-white">Dependencies</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {dependencySkills.map(dep => (
                        <div 
                          key={dep.id}
                          className={`px-4 py-2 rounded-xl flex items-center gap-2 ${
                            dep.exists 
                              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                              : 'bg-red-500/20 text-red-400 border border-red-500/30'
                          }`}
                        >
                          <Check className="w-4 h-4" />
                          <span className="text-sm font-semibold">{dep.name}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
                
                {/* Metadata Grid */}
                <section className="pt-6 border-t border-white/10">
                  <div className="flex items-center gap-2 mb-4">
                    <BookOpen className="w-5 h-5 text-pink-500" />
                    <h3 className="text-lg font-bold text-white">Information</h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {/* Difficulty */}
                    <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                      <span className="text-white/40 text-xs uppercase tracking-wider block mb-2">Difficulty</span>
                      <p className={`text-white font-semibold capitalize flex items-center gap-2 ${
                        skill.metadata.difficulty === 'beginner' ? 'text-green-400' :
                        skill.metadata.difficulty === 'intermediate' ? 'text-yellow-400' :
                        'text-red-400'
                      }`}>
                        <span className={`w-2 h-2 rounded-full ${
                          skill.metadata.difficulty === 'beginner' ? 'bg-green-400' :
                          skill.metadata.difficulty === 'intermediate' ? 'bg-yellow-400' :
                          'bg-red-400'
                        }`} />
                        {skill.metadata.difficulty}
                      </p>
                    </div>
                    
                    {/* Setup Time */}
                    <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                      <span className="text-white/40 text-xs uppercase tracking-wider block mb-2">Setup Time</span>
                      <div className="flex items-center gap-2 text-white font-semibold">
                        <Clock className="w-4 h-4" />
                        {skill.metadata.estimatedSetupTime || 'N/A'}
                      </div>
                    </div>
                    
                    {/* Version */}
                    <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                      <span className="text-white/40 text-xs uppercase tracking-wider block mb-2">Version</span>
                      <p className="text-white font-semibold font-mono">{skill.metadata.version}</p>
                    </div>
                    
                    {/* Author */}
                    <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                      <span className="text-white/40 text-xs uppercase tracking-wider block mb-2">Author</span>
                      <p className="text-white font-semibold">{skill.metadata.author || 'Gemigram'}</p>
                    </div>
                  </div>
                </section>
                
                {/* Tags */}
                {skill.metadata.tags.length > 0 && (
                  <section className="pt-6 border-t border-white/10">
                    <div className="flex items-center gap-2 mb-4">
                      <Tag className="w-5 h-5 text-cyan-500" />
                      <h3 className="text-lg font-bold text-white">Tags</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {skill.metadata.tags.map(tag => (
                        <span 
                          key={tag}
                          className="text-xs px-3 py-1.5 bg-cyan-500/20 text-cyan-400 rounded-lg uppercase tracking-wider"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
