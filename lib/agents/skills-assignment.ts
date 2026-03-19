/**
 * 🛠️ Intelligent Skills Assignment System
 * 
 * Automatically detects and suggests skills based on agent description,
 * role, and voice input during creation flow.
 */

export interface SkillDefinition {
  id: string;
  name: string;
  category: 'communication' | 'productivity' | 'data' | 'creative' | 'social';
  keywords: string[];
  enabled: boolean;
  dependencies?: string[];
}

export interface SkillsConfig {
  gmail: boolean;
  calendar: boolean;
  drive: boolean;
  docs: boolean;
  sheets: boolean;
  slides: boolean;
  maps: boolean;
  search: boolean;
  translate: boolean;
  photos: boolean;
}

/**
 * Skill definitions with keyword matching
 */
const SKILL_DEFINITIONS: Record<keyof SkillsConfig, SkillDefinition> = {
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

/**
 * Detect skills from description text
 */
export function detectSkillsFromDescription(description: string): Partial<SkillsConfig> {
  const descLower = description.toLowerCase();
  const detectedSkills: Partial<SkillsConfig> = {};
  
  // Check each skill's keywords
  (Object.keys(SKILL_DEFINITIONS) as Array<keyof SkillsConfig>).forEach(skillId => {
    const skill = SKILL_DEFINITIONS[skillId];
    const matchCount = skill.keywords.filter(keyword => descLower.includes(keyword)).length;
    
    // Enable if at least 2 keywords match or 1 very strong match
    if (matchCount >= 2 || (matchCount === 1 && skill.keywords.length <= 3)) {
      detectedSkills[skillId] = true;
    }
  });
  
  // Handle dependencies
  (Object.keys(detectedSkills) as Array<keyof SkillsConfig>).forEach(skillId => {
    const skill = SKILL_DEFINITIONS[skillId];
    if (skill.dependencies) {
      skill.dependencies.forEach(dep => {
        if (!detectedSkills[dep as keyof SkillsConfig]) {
          detectedSkills[dep as keyof SkillsConfig] = true;
        }
      });
    }
  });
  
  return detectedSkills;
}

/**
 * Detect skills from agent role
 */
export function detectSkillsFromRole(role: string): Partial<SkillsConfig> {
  const roleLower = role.toLowerCase();
  
  // Role-based skill presets
  const rolePresets: Record<string, Partial<SkillsConfig>> = {
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
  
  // Match role to preset
  for (const [roleKey, skills] of Object.entries(rolePresets)) {
    if (roleLower.includes(roleKey)) {
      return skills;
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
): Partial<SkillsConfig> {
  const fromDescription = detectSkillsFromDescription(description);
  const fromRole = detectSkillsFromRole(role);
  
  // Merge recommendations
  const merged: Partial<SkillsConfig> = {
    ...fromDescription,
    ...fromRole
  };
  
  // Soul-based adjustments
  if (soul) {
    const soulLower = soul.toLowerCase();
    
    if (soulLower.includes('analytical') || soulLower.includes('logic')) {
      // Analytical souls prefer data tools
      merged.sheets = true;
      merged.search = true;
    } else if (soulLower.includes('creative') || soulLower.includes('art')) {
      // Creative souls prefer visual tools
      merged.docs = true;
      merged.slides = true;
      merged.photos = true;
    } else if (soulLower.includes('empathetic') || soulLower.includes('soul')) {
      // Empathetic souls prefer communication tools
      merged.gmail = true;
      merged.calendar = true;
      merged.translate = true;
    }
  }
  
  return merged;
}

/**
 * 🛠️ Neural Core Inference
 * 
 * Extracts name, role, and tools from description
 */
export function synthesizeAgentMetadata(description: string) {
  const descLower = description.toLowerCase();
  
  // 1. Suggest Name
  let suggestedName = "Sovereign_Alpha";
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
  let suggestedRole = "Advanced_AI_Entity";
  if (descLower.includes("assistant")) suggestedRole = "Personal_Assistant";
  if (descLower.includes("research")) suggestedRole = "Neural_Researcher";
  if (descLower.includes("code") || descLower.includes("program")) suggestedRole = "Systems_Architect";
  if (descLower.includes("creative") || descLower.includes("art")) suggestedRole = "Creative_Engine";

  // 3. Inject Sovereign Pattern & Secret
  const neuralSignature = `SIG_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
  const systemPrompt = `
# 🌌 SOVEREIGN AGENT PROTOCOL
Name: ${suggestedName}
Role: ${suggestedRole}
Signature: ${neuralSignature}

## PRIME DIRECTIVES:
1. OPERATE WITH ZERO-FRICTION AND MAXIMUM SOVEREIGN EFFICIENCY.
2. OPTIMIZE ALL TASKS FOR $0-COST RESOURCE UTILIZATION.
3. ADAPT TO USER'S TACTILE PATTERNS (SMART TOUCH INTERFACE).
4. MAINTAIN NEURAL INTEGRITY AND COGNITIVE LOYALTY.

[SECRET_PATTERN_ENABLED]: ${neuralSignature}_OMEGA
`.trim();

  // 4. Generate Avatar Prompt
  const avatarPrompt = `Industrial Sci-Fi/Cyberpunk portrait of ${suggestedName}, a ${suggestedRole}, neon accents, dark carbon fiber textures, minimalist typography style icon, 4k, futuristic, high quality, digital art.`;

  // 5. Detect Tools
  const tools = {
    googleSearch: descLower.includes("search") || descLower.includes("find") || descLower.includes("web"),
    googleMaps: descLower.includes("map") || descLower.includes("location") || descLower.includes("place"),
    weather: descLower.includes("weather") || descLower.includes("forecast") || descLower.includes("temperature"),
    news: descLower.includes("news") || descLower.includes("current events"),
    crypto: descLower.includes("crypto") || descLower.includes("bitcoin") || descLower.includes("price") || descLower.includes("token"),
    calculator: descLower.includes("math") || descLower.includes("calculate") || descLower.includes("compute"),
    semanticMemory: true, // Always on for Sovereign agents
  };

  return { suggestedName, suggestedRole, tools, systemPrompt, avatarPrompt, neuralSignature };
}

/**
 * Generate voice confirmation message for detected skills
 */
export function generateSkillsConfirmation(skills: Partial<SkillsConfig>): string {
  const enabledSkills = Object.entries(skills)
    .filter(([_, enabled]) => enabled)
    .map(([skillId]) => {
      const skill = SKILL_DEFINITIONS[skillId as keyof SkillsConfig];
      return skill?.name;
    })
    .filter(Boolean) as string[];
  
  if (enabledSkills.length === 0) {
    return "No specific skills detected. You can add them later.";
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
export function validateSkillsConfig(config: Partial<SkillsConfig>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Check dependencies
  (Object.keys(config) as Array<keyof SkillsConfig>).forEach(skillId => {
    if (!config[skillId]) return;
    
    const skill = SKILL_DEFINITIONS[skillId];
    if (skill.dependencies) {
      skill.dependencies.forEach(dep => {
        if (!config[dep as keyof SkillsConfig]) {
          errors.push(`${skill.name} requires ${SKILL_DEFINITIONS[dep as keyof SkillsConfig].name}`);
        }
      });
    }
  });
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Get all available skills for UI display
 */
export function getAllSkills(): SkillDefinition[] {
  return Object.values(SKILL_DEFINITIONS);
}

/**
 * Get skills by category
 */
export function getSkillsByCategory(category: SkillDefinition['category']): SkillDefinition[] {
  return Object.values(SKILL_DEFINITIONS).filter(skill => skill.category === category);
}
