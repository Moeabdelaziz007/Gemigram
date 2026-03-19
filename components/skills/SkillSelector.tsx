'use client';

import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import SkillCard from './SkillCard';
import SkillDetailsModal from './SkillDetailsModal';
import { skillRegistry, autoRegisterSkills } from '@/lib/agents/skill-registry';
import type { SkillCategory, SkillDefinition } from '@/lib/agents/skill-types';
import { GOOGLE_WORKSPACE_SKILLS } from '@/lib/agents/skills/google-workspace-skills';
import { ANALYSIS_DATA_SKILLS } from '@/lib/agents/skills/analysis-skills';
import { CREATIVE_UTILITY_SKILLS } from '@/lib/agents/skills/creative-skills';
import { SELF_IMPROVEMENT_SKILLS } from '@/lib/agents/skills/self-improvement-skills';
import { PROACTIVE_SKILLS } from '@/lib/agents/skills/proactive-skills';
import { BRAINSTORMING_SKILLS } from '@/lib/agents/skills/brainstorming-skills';
import { DEVELOPMENT_SKILLS } from '@/lib/agents/skills/development-skills';
import { SOFTWARE_ENGINEERING_SKILLS } from '@/lib/agents/skills/software-engineering-skills';
import { POLYGLOT_CODING_SKILLS } from '@/lib/agents/skills/polyglot-coding-skills';
import { ADVANCED_CONTENT_SKILLS } from '@/lib/agents/skills/content-creation-advanced-skills';

interface SkillSelectorProps {
  selectedSkills: Record<string, boolean>;
  onChange: (skills: Record<string, boolean>) => void;
  showHeader?: boolean;
  compact?: boolean;
}

const FALLBACK_SKILLS: SkillDefinition[] = [
  ...GOOGLE_WORKSPACE_SKILLS,
  ...ANALYSIS_DATA_SKILLS,
  ...CREATIVE_UTILITY_SKILLS,
  ...SELF_IMPROVEMENT_SKILLS,
  ...PROACTIVE_SKILLS,
  ...BRAINSTORMING_SKILLS,
  ...DEVELOPMENT_SKILLS,
  ...SOFTWARE_ENGINEERING_SKILLS,
  ...POLYGLOT_CODING_SKILLS,
  ...ADVANCED_CONTENT_SKILLS
];

const CATEGORY_ORDER: SkillCategory[] = [
  'communication',
  'productivity',
  'analysis',
  'creative',
  'social',
  'data',
  'integration',
  'utility',
  'development',
  'engineering',
  'meta_cognition',
  'mcp_integration'
];

function formatCategory(category: SkillCategory): string {
  return category.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getSkillsFromRegistry(): SkillDefinition[] {
  const existing = skillRegistry.getAll();
  if (existing.length > 0) {
    return existing;
  }

  autoRegisterSkills(...FALLBACK_SKILLS);
  return skillRegistry.getAll();
}

export default function SkillSelector({
  selectedSkills,
  onChange,
  showHeader = true,
  compact = false
}: SkillSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | SkillCategory>('all');
  const [selectedSkill, setSelectedSkill] = useState<SkillDefinition | null>(null);

  const allSkills = useMemo(
    () => [...getSkillsFromRegistry()].sort((a, b) => a.name.localeCompare(b.name)),
    []
  );

  const categoryOptions = useMemo(() => {
    const presentCategories = new Set(allSkills.map((skill) => skill.category));
    return CATEGORY_ORDER.filter((category) => presentCategories.has(category));
  }, [allSkills]);

  const filteredSkills = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    return allSkills.filter((skill) => {
      const categoryMatch = activeCategory === 'all' || skill.category === activeCategory;
      const searchMatch =
        normalizedSearch.length === 0 ||
        skill.name.toLowerCase().includes(normalizedSearch) ||
        skill.description.toLowerCase().includes(normalizedSearch) ||
        skill.metadata.tags.some((tag) => tag.toLowerCase().includes(normalizedSearch));

      return categoryMatch && searchMatch;
    });
  }, [activeCategory, allSkills, searchQuery]);

  const handleToggleSkill = (skillId: string) => {
    onChange({
      ...selectedSkills,
      [skillId]: !selectedSkills[skillId]
    });
  };

  const selectedCount = useMemo(
    () => Object.values(selectedSkills).filter(Boolean).length,
    [selectedSkills]
  );

  return (
    <div className="space-y-5">
      {showHeader && (
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-bold text-white">Skill Selection</h3>
          <p className="text-sm text-white/60">
            Pick the capabilities this agent should have. {selectedCount} selected.
          </p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search skills by name, description, or tag"
            className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-aether-neon/40"
          />
        </div>

        <select
          value={activeCategory}
          onChange={(e) => setActiveCategory(e.target.value as 'all' | SkillCategory)}
          className="sm:w-64 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-aether-neon/40"
        >
          <option value="all">All Categories</option>
          {categoryOptions.map((category) => (
            <option key={category} value={category}>
              {formatCategory(category)}
            </option>
          ))}
        </select>
      </div>

      <div className={`grid gap-3 ${compact ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
        <AnimatePresence>
          {filteredSkills.map((skill) => (
            <SkillCard
              key={skill.id}
              skill={skill}
              isSelected={Boolean(selectedSkills[skill.id])}
              onToggle={() => handleToggleSkill(skill.id)}
              onViewDetails={() => setSelectedSkill(skill)}
            />
          ))}
        </AnimatePresence>
      </div>

      {filteredSkills.length === 0 && (
        <div className="text-center py-10 rounded-2xl border border-dashed border-white/20 bg-white/5 text-white/60">
          No skills match your filters.
        </div>
      )}

      {selectedSkill && (
        <SkillDetailsModal
          skill={selectedSkill}
          isOpen={Boolean(selectedSkill)}
          onClose={() => setSelectedSkill(null)}
        />
      )}
    </div>
  );
}
