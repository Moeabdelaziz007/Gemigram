'use client';

import { useMemo } from 'react';
import { getAllSkills, type SkillDefinition } from '@/lib/agents/skills-assignment';

interface SkillSelectorProps {
  selectedSkills: Record<string, boolean>;
  onChange: (skills: Record<string, boolean>) => void;
  showHeader?: boolean;
  compact?: boolean;
}

const CATEGORY_LABELS: Record<string, string> = {
  communication: 'Communication',
  productivity: 'Productivity',
  data: 'Data',
  creative: 'Creative',
  social: 'Social',
  analysis: 'Analysis',
  integration: 'Integration',
  utility: 'Utility',
  development: 'Development',
  engineering: 'Engineering',
  meta_cognition: 'Meta-Cognition',
  mcp_integration: 'MCP Integration'
};

export default function SkillSelector({
  selectedSkills,
  onChange,
  showHeader = true,
  compact = false
}: SkillSelectorProps) {
  const skills = useMemo(() => getAllSkills(), []);

  const groupedSkills = useMemo(() => {
    const groups = new Map<SkillDefinition['category'], SkillDefinition[]>();

    skills.forEach(skill => {
      const group = groups.get(skill.category) || [];
      group.push(skill);
      groups.set(skill.category, group);
    });

    return groups;
  }, [skills]);

  const orderedCategories = useMemo(() => {
    return Array.from(groupedSkills.keys()).sort((a, b) => a.localeCompare(b));
  }, [groupedSkills]);

  const toggleSkill = (skillId: string) => {
    onChange({
      ...selectedSkills,
      [skillId]: !selectedSkills[skillId]
    });
  };

  return (
    <div className="space-y-5">
      {showHeader && <h3 className="text-lg font-semibold text-white">Available Skills</h3>}
      {orderedCategories.map(category => {
        const categorySkills = groupedSkills.get(category);
        if (!categorySkills?.length) return null;

        return (
          <section key={category} className="space-y-3">
            <h4 className="text-sm uppercase tracking-wider text-white/60">
              {CATEGORY_LABELS[category] || category}
            </h4>
            <div className={`grid gap-2 ${compact ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
              {categorySkills.map(skill => {
                const checked = !!selectedSkills[skill.id];
                return (
                  <label
                    key={skill.id}
                    className={`flex cursor-pointer items-center justify-between rounded-xl border px-3 py-2 text-sm transition-colors ${
                      checked
                        ? 'border-aether-neon/50 bg-aether-neon/10 text-aether-neon'
                        : 'border-white/10 bg-white/5 text-white/80 hover:border-white/20'
                    }`}
                  >
                    <span>{skill.name}</span>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleSkill(skill.id)}
                      className="h-4 w-4"
                    />
                  </label>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
