/**
 * 🏛️ Centralized Skill Registry System
 * 
 * Singleton-based registry for managing skill definitions, dependencies, and validation.
 * Provides a global access point for all skill-related operations in the Gemigram AetherOS.
 */

import { 
  SkillDefinition, 
  SkillCategory, 
  ValidationResult,
  SkillBundle 
} from './skill-types';

/**
 * Skill Registry - Singleton for global skill management
 */
class SkillRegistry {
  private static instance: SkillRegistry;
  private skills: Map<string, SkillDefinition> = new Map();
  private bundles: Map<string, SkillBundle> = new Map();
  
  /**
   * Private constructor to enforce singleton pattern
   */
  /**
   * Register a skill bundle
   * @param bundle - Skill bundle definition
   * @throws Error if bundle ID already exists
   */
  registerBundle(bundle: SkillBundle): void {
    if (this.bundles.has(bundle.id)) {
      throw new Error(`Bundle "${bundle.id}" is already registered.`);
    }
    this.bundles.set(bundle.id, bundle);
  }
  
  /**
   * Get a bundle by its ID
   * @param id - Bundle identifier
   * @returns Bundle definition or undefined if not found
   */
  getBundle(id: string): SkillBundle | undefined {
    return this.bundles.get(id);
  }
  
  /**
   * Get all registered bundles
   * @returns Array of all skill bundles
   */
  getAllBundles(): SkillBundle[] {
    return Array.from(this.bundles.values());
  }
  
  /**
   * Get skills from a specific bundle
   * @param bundleId - Bundle identifier
   * @returns Array of skill definitions in the bundle
   */
  getBundleSkills(bundleId: string): SkillDefinition[] {
    const bundle = this.bundles.get(bundleId);
    if (!bundle) return [];
    
    return bundle.skills
      .map(skillId => this.skills.get(skillId))
      .filter((skill): skill is SkillDefinition => skill !== undefined);
  }
  
  private constructor() {}
  
  /**
   * Get the singleton instance of the registry
   */
  static getInstance(): SkillRegistry {
    if (!SkillRegistry.instance) {
      SkillRegistry.instance = new SkillRegistry();
    }
    return SkillRegistry.instance;
  }
  
  /**
   * Register a new skill definition
   * @param skill - The skill definition to register
   * @throws Error if skill ID already exists
   */
  register(skill: SkillDefinition): void {
    if (this.skills.has(skill.id)) {
      throw new Error(`Skill "${skill.id}" is already registered. Use update() to modify existing skills.`);
    }
    
    // Validate skill before registration
    const validation = this.validateSkillDefinition(skill);
    if (!validation.valid) {
      throw new Error(`Invalid skill definition: ${validation.errors.join(', ')}`);
    }
    
    this.skills.set(skill.id, skill);
  }
  
  /**
   * Update an existing skill definition
   * @param skill - Updated skill definition
   * @throws Error if skill doesn't exist
   */
  update(skill: SkillDefinition): void {
    if (!this.skills.has(skill.id)) {
      throw new Error(`Skill "${skill.id}" not found. Use register() to add new skills.`);
    }
    this.skills.set(skill.id, skill);
  }
  
  /**
   * Get a skill by its ID
   * @param id - Skill identifier
   * @returns Skill definition or undefined if not found
   */
  get(id: string): SkillDefinition | undefined {
    return this.skills.get(id);
  }
  
  /**
   * Check if a skill exists in the registry
   * @param id - Skill identifier
   * @returns true if skill exists
   */
  has(id: string): boolean {
    return this.skills.has(id);
  }
  
  /**
   * Get all registered skills
   * @returns Array of all skill definitions
   */
  getAll(): SkillDefinition[] {
    return Array.from(this.skills.values());
  }
  
  /**
   * Get skills filtered by category
   * @param category - Category to filter by
   * @returns Array of skills in the specified category
   */
  getByCategory(category: SkillCategory): SkillDefinition[] {
    return this.getAll().filter(skill => skill.category === category);
  }
  
  /**
   * Get skills by multiple categories
   * @param categories - Array of categories to filter by
   * @returns Array of skills matching any of the categories
   */
  getByCategories(categories: SkillCategory[]): SkillDefinition[] {
    return this.getAll().filter(skill => categories.includes(skill.category));
  }
  
  /**
   * Search skills by keyword
   * @param query - Search query
   * @returns Array of matching skills
   */
  search(query: string): SkillDefinition[] {
    const queryLower = query.toLowerCase();
    return this.getAll().filter(skill => 
      skill.name.toLowerCase().includes(queryLower) ||
      skill.description.toLowerCase().includes(queryLower) ||
      skill.metadata.tags.some(tag => tag.toLowerCase().includes(queryLower))
    );
  }
  
  /**
   * Validate a skill configuration
   * @param config - Skill configuration object
   * @returns Validation result with errors and warnings
   */
  validateConfig(config: Record<string, boolean>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // Check each enabled skill
    Object.entries(config).forEach(([skillId, enabled]) => {
      if (!enabled) return;
      
      const skill = this.skills.get(skillId);
      
      if (!skill) {
        errors.push(`Unknown skill: ${skillId}`);
        return;
      }
      
      // Check dependencies
      if (skill.dependencies) {
        skill.dependencies.forEach(depId => {
          if (!config[depId]) {
            errors.push(`"${skill.name}" requires "${this.skills.get(depId)?.name || depId}" to be enabled`);
          }
        });
      }
      
      // Check conflicts
      if (skill.conflicts) {
        skill.conflicts.forEach(conflictId => {
          if (config[conflictId]) {
            errors.push(`"${skill.name}" conflicts with "${this.skills.get(conflictId)?.name || conflictId}"`);
          }
        });
      }
    });
    
    // Check for circular dependencies
    const circularDeps = this.detectCircularDependencies(config);
    if (circularDeps.length > 0) {
      errors.push(`Circular dependency detected: ${circularDeps.join(' → ')}`);
    }
    
    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }
  
  /**
   * Resolve all dependencies for a skill
   * @param skillId - Skill identifier
   * @returns Array of all required skill IDs (including transitive dependencies)
   */
  resolveDependencies(skillId: string): string[] {
    const skill = this.skills.get(skillId);
    if (!skill) return [];
    
    const dependencies = new Set<string>();
    const visited = new Set<string>();
    
    const resolve = (id: string) => {
      if (visited.has(id)) return;
      visited.add(id);
      
      const s = this.skills.get(id);
      if (s?.dependencies) {
        s.dependencies.forEach(depId => {
          dependencies.add(depId);
          resolve(depId);
        });
      }
    };
    
    resolve(skillId);
    return Array.from(dependencies);
  }
  
  /**
   * Get the full dependency tree for a skill
   * @param skillId - Skill identifier
   * @returns Map of skill IDs to their direct dependencies
   */
  getDependencyTree(skillId: string): Map<string, string[]> {
    const tree = new Map<string, string[]>();
    const visited = new Set<string>();
    
    const buildTree = (id: string) => {
      if (visited.has(id)) return;
      visited.add(id);
      
      const skill = this.skills.get(id);
      if (skill?.dependencies) {
        tree.set(id, [...skill.dependencies]);
        skill.dependencies.forEach(depId => buildTree(depId));
      } else {
        tree.set(id, []);
      }
    };
    
    buildTree(skillId);
    return tree;
  }
  

  /**
   * Expand a bundle into individual skills
   * @param bundleId - Bundle identifier
   * @returns Record of skill IDs to true
   */
  expandBundle(bundleId: string): Record<string, boolean> {
    const bundle = this.getBundle(bundleId);
    if (!bundle) return {};
    
    const skills: Record<string, boolean> = {};
    bundle.skills.forEach(skillId => {
      skills[skillId] = true;
    });
    
    return skills;
  }
  
  /**
   * Detect circular dependencies in a configuration
   * @param config - Skill configuration
   * @returns Array showing circular dependency path if found
   */
  private detectCircularDependencies(config: Record<string, boolean>): string[] {
    const visited = new Set<string>();
    const recursionStack = new Set<string>();
    const path: string[] = [];
    
    const dfs = (skillId: string): boolean => {
      visited.add(skillId);
      recursionStack.add(skillId);
      path.push(skillId);
      
      const skill = this.skills.get(skillId);
      if (skill?.dependencies) {
        for (const depId of skill.dependencies) {
          if (!config[depId]) continue;
          
          if (!visited.has(depId)) {
            if (dfs(depId)) return true;
          } else if (recursionStack.has(depId)) {
            path.push(depId);
            return true;
          }
        }
      }
      
      path.pop();
      recursionStack.delete(skillId);
      return false;
    };
    
    for (const [skillId, enabled] of Object.entries(config)) {
      if (enabled && !visited.has(skillId)) {
        if (dfs(skillId)) return path;
      }
    }
    
    return [];
  }
  
  /**
   * Validate a skill definition structure
   * @param skill - Skill definition to validate
   * @returns Validation result
   */
  private validateSkillDefinition(skill: SkillDefinition): ValidationResult {
    const errors: string[] = [];
    
    if (!skill.id || skill.id.trim() === '') {
      errors.push('Skill ID is required');
    }
    
    if (!skill.name || skill.name.trim() === '') {
      errors.push('Skill name is required');
    }
    
    if (!skill.description) {
      errors.push('Skill description is required');
    }
    
    if (!skill.category) {
      errors.push('Skill category is required');
    }
    
    if (!Array.isArray(skill.capabilities) || skill.capabilities.length === 0) {
      errors.push('At least one capability is required');
    }
    
    if (!Array.isArray(skill.permissions) || skill.permissions.length === 0) {
      errors.push('At least one permission is required');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
  
  /**
   * Clear all registered skills (useful for testing)
   */
  clear(): void {
    this.skills.clear();
    this.bundles.clear();
  }
  
  /**
   * Get total number of registered skills
   * @returns Count of registered skills
   */
  count(): number {
    return this.skills.size;
  }
}

/**
 * Pre-configured skill bundles for common use cases
 */
const SKILL_BUNDLES: SkillBundle[] = [
  // Self-Improvement Bundle
  {
    id: 'self_improver',
    name: 'Self-Improver',
    description: 'Enable agents to analyze performance and continuously improve',
    skills: ['self_analysis', 'continuous_learning', 'performance_optimizer'],
    targetPersona: 'Autonomous learning agents'
  },
  
  // Proactive Agent Bundle
  {
    id: 'proactive_agent',
    name: 'Proactive Assistant',
    description: 'Anticipate needs and take autonomous actions with confirmation',
    skills: ['proactive_tasks', 'intelligent_monitoring', 'event_driven_actions'],
    targetPersona: 'Proactive personal assistants'
  },
  
  // Creative Innovator Bundle
  {
    id: 'creative_innovator',
    name: 'Creative Innovator',
    description: 'Generate breakthrough ideas with advanced brainstorming techniques',
    skills: ['creative_brainstorming', 'lateral_thinking', 'design_thinking', 'triz_innovation'],
    targetPersona: 'Innovation consultants and creative professionals'
  },
  
  // Full-Stack Developer Bundle
  {
    id: 'fullstack_developer',
    name: 'Full-Stack Developer',
    description: 'Complete development stack from frontend to cloud deployment',
    skills: [
      'frontend_development',
      'backend_development',
      'database_architect',
      'devops_cicd',
      'api_designer'
    ],
    targetPersona: 'Full-stack software developers'
  },
  
  // Software Engineer Bundle
  {
    id: 'software_engineer',
    name: 'Software Engineer',
    description: 'Professional engineering practices and system architecture',
    skills: [
      'system_architect',
      'code_quality',
      'security_engineering',
      'technical_writing',
      'agile_project_management'
    ],
    targetPersona: 'Professional software engineers'
  },
  
  // Polyglot Programmer Bundle
  {
    id: 'polyglot_programmer',
    name: 'Polyglot Programmer',
    description: 'Multi-language programming expertise across popular stacks',
    skills: [
      'python_expert',
      'javascript_typescript',
      'rust_programming',
      'go_programming',
      'java_enterprise'
    ],
    targetPersona: 'Versatile programmers'
  },
  
  // Content Creator Pro Bundle
  {
    id: 'content_creator_pro',
    name: 'Content Creator Pro',
    description: 'Professional multimedia content creation suite',
    skills: [
      'video_production',
      'podcast_production',
      'graphic_design',
      'copywriting_strategy'
    ],
    targetPersona: 'Digital content creators'
  },
  
  // Ultimate AI Agent Bundle (All Skills)
  {
    id: 'ultimate_ai_agent',
    name: 'Ultimate AI Agent',
    description: 'Maximum capability agent with all advanced skills',
    skills: [
      // Self-improvement
      'self_analysis',
      'continuous_learning',
      'performance_optimizer',
      'error_recovery',
      'quality_assurance',
      // Proactive
      'proactive_tasks',
      'intelligent_monitoring',
      'event_driven_actions',
      'predictive_engagement',
      // Brainstorming
      'creative_brainstorming',
      'lateral_thinking',
      'design_thinking',
      'triz_innovation',
      'scenario_planning',
      // Development
      'frontend_development',
      'backend_development',
      'database_architect',
      'devops_cicd',
      'mobile_development',
      'api_designer',
      'cloud_infrastructure',
      // Engineering
      'system_architect',
      'code_quality',
      'security_engineering',
      'technical_writing',
      'agile_project_management',
      // Polyglot
      'python_expert',
      'javascript_typescript',
      'rust_programming',
      'go_programming',
      'java_enterprise',
      'cpp_programming',
      // Content Creation
      'video_production',
      'podcast_production',
      'graphic_design',
      'copywriting_strategy',
      'three_d_animation',
      'music_composition'
    ],
    targetPersona: 'Advanced autonomous AI entities'
  }
];

/**
 * Register all pre-configured skill bundles
 */
export function registerSkillBundles(): void {
  SKILL_BUNDLES.forEach(bundle => {
    try {
      skillRegistry.registerBundle(bundle);
    } catch (error) {
      console.warn(`Failed to register bundle ${bundle.id}:`, error);
    }
  });
}

// Export singleton instance
export const skillRegistry = SkillRegistry.getInstance();

// Helper function to auto-register skills
export function autoRegisterSkills(...skills: SkillDefinition[]): void {
  skills.forEach(skill => {
    try {
      skillRegistry.register(skill);
    } catch (error) {
      console.warn(`Failed to register skill ${skill.id}:`, error);
    }
  });
}
