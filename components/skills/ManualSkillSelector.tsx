'use client';

/**
 * 🎯 Manual Skill Selector Overlay
 * 
 * Full-screen overlay for manual skill configuration during agent creation.
 * Provides a comprehensive skill selection interface with confirmation.
 */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Save } from 'lucide-react';
import SkillSelector from './SkillSelector';
import { migrateLegacySkillsConfig } from '@/lib/agents/skills-assignment';

interface ManualSkillSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  initialSkills: Record<string, boolean>;
  onConfirm: (skills: Record<string, boolean>) => void;
}

export default function ManualSkillSelector({
  isOpen,
  onClose,
  initialSkills,
  onConfirm
}: ManualSkillSelectorProps) {
  const [selectedSkills, setSelectedSkills] = useState<Record<string, boolean>>(
    migrateLegacySkillsConfig(initialSkills)
  );
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setSelectedSkills(migrateLegacySkillsConfig(initialSkills));
  }, [initialSkills]);
  
  /**
   * Handle confirmation
   */
  const handleConfirm = () => {
    setIsSaving(true);
    // Small delay for visual feedback
    setTimeout(() => {
      onConfirm(selectedSkills);
      setIsSaving(false);
      onClose();
    }, 300);
  };
  
  /**
   * Count enabled skills
   */
  const enabledCount = Object.values(selectedSkills).filter(Boolean).length;
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          >
            <div 
              className="w-full max-w-5xl h-[85vh] sm:h-[80vh] bg-[#03070C]/95 border border-white/10 rounded-[32px] overflow-hidden flex flex-col shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    Configure Agent Skills
                  </h2>
                  <p className="text-white/60 text-sm mt-1">
                    Select capabilities manually or use suggestions
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="text-white/60 hover:text-white transition-colors p-2 touch-target-comfortable"
                  aria-label="Close modal"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <SkillSelector
                  selectedSkills={selectedSkills}
                  onChange={setSelectedSkills}
                  showHeader={false}
                  compact={false}
                />
              </div>
              
              {/* Footer Actions */}
              <div className="px-6 py-4 border-t border-white/10 bg-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                    enabledCount > 0 
                      ? 'bg-aether-neon/20 text-aether-neon' 
                      : 'bg-white/10 text-white/40'
                  }`}>
                    <Check className="w-4 h-4" />
                    <span className="text-sm font-semibold">
                      {enabledCount} skill{enabledCount !== 1 ? 's' : ''} selected
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    className="px-6 py-3 rounded-xl border border-white/20 text-white hover:bg-white/10 transition-colors font-semibold touch-target-comfortable"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirm}
                    disabled={isSaving}
                    className="px-8 py-3 rounded-xl bg-aether-neon text-black font-semibold hover:bg-aether-neon/90 transition-colors flex items-center gap-2 touch-target-comfortable disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-5 h-5" />
                    {isSaving ? 'Saving...' : 'Save Skills'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
