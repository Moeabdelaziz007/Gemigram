'use client';

/**
 * 🎴 Skill Card Component
 * 
 * Individual skill display card with selection toggle and details view.
 * Responsive design with visual feedback for selection state.
 */

import { motion } from 'framer-motion';
import { Check, Info } from 'lucide-react';
import { SkillDefinition } from '@/lib/agents/skill-types';
import * as LucideIcons from 'lucide-react';

interface SkillCardProps {
  skill: SkillDefinition;
  isSelected: boolean;
  onToggle: () => void;
  onViewDetails: () => void;
}

export default function SkillCard({ 
  skill, 
  isSelected, 
  onToggle, 
  onViewDetails 
}: SkillCardProps) {
  // Get Lucide icon dynamically
  const IconComponent = (LucideIcons as Record<string, React.ComponentType<unknown>>)[skill.metadata.icon] || LucideIcons.Puzzle;
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer touch-target-min group ${
        isSelected
          ? 'bg-aether-neon/10 border-aether-neon/50 shadow-lg shadow-aether-neon/20'
          : 'bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10'
      }`}
      onClick={onToggle}
      role="checkbox"
      aria-checked={isSelected}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onToggle();
        }
      }}
    >
      {/* Toggle Indicator */}
      <div className={`absolute top-3 right-3 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
        isSelected 
          ? 'border-aether-neon bg-aether-neon shadow-md shadow-aether-neon/50' 
          : 'border-white/30 group-hover:border-white/50'
      }`}>
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            <Check className="w-4 h-4 text-black" strokeWidth={3} />
          </motion.div>
        )}
      </div>
      
      {/* Icon */}
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${skill.metadata.color} bg-white/10 group-hover:scale-110 transition-transform`}>
        <IconComponent className="w-6 h-6" />
      </div>
      
      {/* Name & Description */}
      <h3 className="text-lg font-bold text-white mb-1 group-hover:text-aether-neon transition-colors">
        {skill.name}
      </h3>
      <p className="text-white/60 text-sm mb-3 line-clamp-2 leading-relaxed">
        {skill.description}
      </p>
      
      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {skill.metadata.tags.slice(0, 3).map(tag => (
          <span 
            key={tag} 
            className="text-[10px] px-2 py-0.5 bg-white/5 text-white/40 rounded uppercase tracking-wider"
          >
            {tag}
          </span>
        ))}
      </div>
      
      {/* Footer with Difficulty & Info */}
      <div className="flex items-center justify-between pt-3 border-t border-white/5">
        {/* Difficulty Badge */}
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
            skill.metadata.difficulty === 'beginner' 
              ? 'bg-green-500/20 text-green-400' 
              : skill.metadata.difficulty === 'intermediate'
                ? 'bg-yellow-500/20 text-yellow-400'
                : 'bg-red-500/20 text-red-400'
          }`}>
            {skill.metadata.difficulty}
          </span>
          
          {/* Setup Time */}
          {skill.metadata.estimatedSetupTime && (
            <span className="text-[10px] text-white/40">
              {skill.metadata.estimatedSetupTime}
            </span>
          )}
        </div>
        
        {/* Info Button */}
        <button
          onClick={(e) => { 
            e.stopPropagation(); 
            onViewDetails(); 
          }}
          className="text-white/40 hover:text-white hover:text-aether-neon transition-colors p-1"
          aria-label={`View details for ${skill.name}`}
        >
          <Info className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
