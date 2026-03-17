/**
 * 🛠️ Intelligent Skills Assignment System
 *
 * Automatically detects and suggests skills based on agent description,
 * role, and voice input during creation flow.
 */

import { skillRegistry } from './skill-registry';

export interface SkillDefinition {
  id: string;
  name: string;
  category: 'communication' | 'productivity' | 'data' | 'creative' | 'social';
  keywords: string[];
  enabled: boolean;
  dependencies?: string[];
}

export type SkillsConfig = Record<string, boolean>;

export const LEGACY_WORKSPACE_SKILL_IDS = ['gmail', 'calendar', 'drive'] as const;

const LEGACY_BOOLEAN_KEYS = new Set<string>([
  'gmail',
  'calendar',
  'drive',
  'docs',
  'sheets',
  'slides',
  'maps',
  'search',
  'translate',
  'photos'
]);

/**
 * Skill definitions with keyword matching
 */
const SKILL_DEFINITIONS: Record<string, SkillDefinition> = {
  gmail: {
    id: 'gmail',
    name: 'Gmail Integration',
    category: 'communication',
    keywords: ['email', 'message', 'send', 'receive', 'inbox', 'mail', 'communicate', 'correspond'],
    enabled: false
  },

  calendar: {
    id: 'calendar',
    name: 'Calendar Management',
    category: 'productivity',
    keywords: ['schedule', 'meeting', 'appointment', 'calendar', 'event', 'organize', 'plan', 'remind'],
    enabled: false,
    dependencies: ['gmail']
  },

  drive: {
    id: 'drive',
    name: 'Google Drive',
    category: 'productivity',
    keywords: ['document', 'file', 'storage', 'drive', 'folder', 'share', 'upload', 'download'],
    enabled: false
  },

  docs: {
    id: 'docs',
    name: 'Google Docs',
    category: 'creative',
    keywords: ['write', 'document', 'edit', 'text', 'doc', 'article', 'report', 'content'],
    enabled: false,
    dependencies: ['drive']
  },

  sheets: {
    id: 'sheets',
    name: 'Google Sheets',
    category: 'data',
    keywords: ['spreadsheet', 'data', 'excel', 'table', 'calculate', 'analyze', 'numbers', 'chart'],
    enabled: false,
    dependencies: ['drive']
  },

  slides: {
    id: 'slides',
    name: 'Google Slides',
    category: 'creative',
    keywords: ['presentation', 'slide', 'deck', 'show', 'pitch', 'visual', 'display'],
    enabled: false,
    dependencies: ['drive']
  },

  maps: {
    id: 'maps',
    name: 'Google Maps',
    category: 'productivity',
    keywords: ['location', 'map', 'place', 'direction', 'navigate', 'address', 'nearby', 'find'],
    enabled: false
  },

  search: {
    id: 'search',
    name: 'Web Search',
    category: 'data',
    keywords: ['search', 'find', 'look up', 'research', 'query', 'information', 'web', 'google'],
    enabled: false
  },

  translate: {
    id: 'translate',
    name: 'Translation',
    category: 'communication',
    keywords: ['translate', 'language', 'convert', 'multilingual', 'interpret', 'foreign'],
    enabled: false
  },

  photos: {
    id: 'photos',
    name: 'Google Photos',
    category: 'creative',
    keywords: ['photo', 'image', 'picture', 'album', 'gallery', 'visual', 'memory'],
    enabled: false,
    dependencies: ['drive']
  }
};

const ROLE_PRESETS: Record<string, SkillsConfig> = {
  assistant: {
    gmail: true,
    calendar: true,
    drive: true,
    search: true
  },
  analyst: {
    sheets: true,
    docs: true,
    search: true,
    drive: true
  },
  creator: {
    docs: true,
    slides: true,
    photos: true,
    drive: true
  },
  researcher: {
    search: true,
    docs: true,
    sheets: true,
    translate: true
  },
  coordinator: {
    calendar: true,
    gmail: true,
    drive: true,
    maps: true
  },
  communicator: {
    gmail: true,
    translate: true,
    drive: true
  }
};

function resolveSkillDependencies(config: SkillsConfig): SkillsConfig {
  const resolved = { ...config };

  Object.entries(config).forEach(([skillId, enabled]) => {
    if (!enabled) return;

    skillRegistry.resolveDependencies(skillId).forEach(depId => {
      resolved[depId] = true;
    });

    const fallbackDef = SKILL_DEFINITIONS[skillId];
    fallbackDef?.dependencies?.forEach(depId => {
      resolved[depId] = true;
    });
  });

  return resolved;
}

/**
 * Convert legacy persisted skill booleans (gmail/calendar/drive, etc.)
 * into ID-keyed registry-compatible config.
 */
export function migrateLegacySkillsConfig(config: unknown): SkillsConfig {
  if (!config || typeof config !== 'object') return {};

  const source = config as Record<string, unknown>;
  const migrated: SkillsConfig = {};

  Object.entries(source).forEach(([key, value]) => {
    if (typeof value !== 'boolean') return;
    if (LEGACY_BOOLEAN_KEYS.has(key) || skillRegistry.has(key)) {
      migrated[key] = value;
    }
  });

  return migrated;
}

/**
 * Detect skills from description text
 */
export function detectSkillsFromDescription(description: string): SkillsConfig {
  const descLower = description.toLowerCase();
  const detectedSkills: SkillsConfig = {};

  // Check each skill's keywords
  Object.entries(SKILL_DEFINITIONS).forEach(([skillId, skill]) => {
    const matchCount = skill.keywords.filter(keyword => descLower.includes(keyword)).length;

    // Enable if at least 2 keywords match or 1 very strong match
    if (matchCount >= 2 || (matchCount === 1 && skill.keywords.length <= 3)) {
      detectedSkills[skillId] = true;
    }
  });

  return resolveSkillDependencies(detectedSkills);
}

/**
 * Detect skills from agent role
 */
export function detectSkillsFromRole(role: string): SkillsConfig {
  const roleLower = role.toLowerCase();

  for (const [roleKey, skills] of Object.entries(ROLE_PRESETS)) {
    if (roleLower.includes(roleKey)) {
      return resolveSkillDependencies(skills);
    }
  }

  return {};
}

/**
 * Get recommended skills based on combined analysis
 */
export function getRecommendedSkills(
  description: string,
  role: string,
  soul?: string
): SkillsConfig {
  const fromDescription = detectSkillsFromDescription(description);
  const fromRole = detectSkillsFromRole(role);

  const merged: SkillsConfig = {
    ...fromDescription,
    ...fromRole
  };

  if (soul) {
    const soulLower = soul.toLowerCase();

    if (soulLower.includes('analytical') || soulLower.includes('logic')) {
      merged.sheets = true;
      merged.search = true;
    } else if (soulLower.includes('creative') || soulLower.includes('art')) {
      merged.docs = true;
      merged.slides = true;
      merged.photos = true;
    } else if (soulLower.includes('empathetic') || soulLower.includes('soul')) {
      merged.gmail = true;
      merged.calendar = true;
      merged.translate = true;
    }
  }

  return resolveSkillDependencies(merged);
}

/**
 * 🛠️ Neural Core Inference
 *
 * Extracts name, role, and tools from description
 */
export function synthesizeAgentMetadata(description: string) {
  const descLower = description.toLowerCase();

  // 1. Suggest Name
  let suggestedName = 'Sovereign_Alpha';
  const namePatterns = [
    /call (?:it|him|her|them|the agent|the entity) ([\w\s]+)/i,
    /name (?:it|him|her|them|the agent|the entity) ([\w\s]+)/i,
    /(?:designation|identifier) (?:is|shall be) ([\w\s]+)/i,
    /([\w\s]+) is the name/i
  ];

  for (const pattern of namePatterns) {
    const match = description.match(pattern);
    if (match && match[1]) {
      suggestedName = match[1].trim().replace(/\s+/g, '_');
      break;
    }
  }

  // 2. Derive Role
  let suggestedRole = 'Advanced_AI_Entity';
  if (descLower.includes('assistant')) suggestedRole = 'Personal_Assistant';
  if (descLower.includes('research')) suggestedRole = 'Neural_Researcher';
  if (descLower.includes('code') || descLower.includes('program')) suggestedRole = 'Systems_Architect';
  if (descLower.includes('creative') || descLower.includes('art')) suggestedRole = 'Creative_Engine';

  // 3. Detect Tools
  const tools = {
    googleSearch: descLower.includes('search') || descLower.includes('find') || descLower.includes('web'),
    googleMaps: descLower.includes('map') || descLower.includes('location') || descLower.includes('place'),
    weather: descLower.includes('weather') || descLower.includes('forecast') || descLower.includes('temperature'),
    news: descLower.includes('news') || descLower.includes('current events'),
    crypto: descLower.includes('crypto') || descLower.includes('bitcoin') || descLower.includes('price') || descLower.includes('token'),
    calculator: descLower.includes('math') || descLower.includes('calculate') || descLower.includes('compute'),
    semanticMemory: true // Always on for Sovereign agents
  };

  return { suggestedName, suggestedRole, tools };
}

/**
 * Generate voice confirmation message for detected skills
 */
export function generateSkillsConfirmation(skills: SkillsConfig): string {
  const enabledSkills = Object.entries(skills)
    .filter(([, enabled]) => enabled)
    .map(([skillId]) => {
      const registrySkill = skillRegistry.get(skillId);
      if (registrySkill) return registrySkill.name;
      return SKILL_DEFINITIONS[skillId]?.name;
    })
    .filter(Boolean) as string[];

  if (enabledSkills.length === 0) {
    return 'No specific skills detected. You can add them later.';
  }

  if (enabledSkills.length === 1) {
    return `I've enabled ${enabledSkills[0]} based on your description.`;
  }

  if (enabledSkills.length === 2) {
    return `I've enabled ${enabledSkills.join(' and ')} based on your description.`;
  }

  const lastSkill = enabledSkills[enabledSkills.length - 1];
  const otherSkills = enabledSkills.slice(0, -1);

  return `I've enabled ${otherSkills.join(', ')}, and ${lastSkill} based on your description.`;
}

/**
 * Validate skills configuration
 */
export function validateSkillsConfig(config: SkillsConfig): { valid: boolean; errors: string[] } {
  const migrated = migrateLegacySkillsConfig(config);
  const resolved = resolveSkillDependencies(migrated);
  const registryValidation = skillRegistry.validateConfig(resolved);

  const legacyUnknownSkillErrors = registryValidation.errors.filter(error => {
    const unknownPrefix = 'Unknown skill: ';
    if (!error.startsWith(unknownPrefix)) return false;
    const unknownSkillId = error.slice(unknownPrefix.length);
    return !!SKILL_DEFINITIONS[unknownSkillId];
  });

  const filteredRegistryErrors = registryValidation.errors.filter(
    error => !legacyUnknownSkillErrors.includes(error)
  );

  if (filteredRegistryErrors.length === 0) {
    return { valid: true, errors: [] };
  }

  // Only report legacy validation errors when the registry has no matching skill metadata.
  const fallbackErrors: string[] = [];

  Object.entries(resolved).forEach(([skillId, enabled]) => {
    if (!enabled || skillRegistry.has(skillId)) return;

    const skill = SKILL_DEFINITIONS[skillId];
    if (!skill?.dependencies) return;

    skill.dependencies.forEach(dep => {
      if (!resolved[dep]) {
        fallbackErrors.push(`${skill.name} requires ${SKILL_DEFINITIONS[dep]?.name || dep}`);
      }
    });
  });

  return {
    valid: false,
    errors: [...filteredRegistryErrors, ...fallbackErrors]
  };
}

/**
 * Get all available skills for UI display
 */
export function getAllSkills(): SkillDefinition[] {
  const registrySkills = skillRegistry.getAll();

  const fromRegistry: SkillDefinition[] = registrySkills.map(skill => ({
    id: skill.id,
    name: skill.name,
    category: (skill.category === 'analysis' ? 'data' : skill.category) as SkillDefinition['category'],
    keywords: [...skill.metadata.tags],
    enabled: false,
    dependencies: skill.dependencies
  }));

  if (fromRegistry.length > 0) {
    return fromRegistry;
  }

  return Object.values(SKILL_DEFINITIONS);
}

/**
 * Get skills by category
 */
export function getSkillsByCategory(category: SkillDefinition['category']): SkillDefinition[] {
  return getAllSkills().filter(skill => skill.category === category);
}
