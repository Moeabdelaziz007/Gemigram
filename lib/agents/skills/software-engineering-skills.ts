/**
 * 🏗️ Software Engineering & Architecture Skills
 * 
 * Professional engineering practices, system design, architecture patterns,
 * and quality assurance for building robust, scalable software systems.
 */

import { SkillDefinition } from '../skill-types';

/**
 * System Architecture Design
 */
export const SYSTEM_ARCHITECT_SKILL: SkillDefinition = {
  id: 'system_architect',
  name: 'System Architect',
  description: 'Design scalable, maintainable system architectures with best practices',
  category: 'analysis',
  capabilities: [
    'architecture_patterns',
    'system_design',
    'scalability_planning',
    'trade_off_analysis',
    'technology_selection',
    'documentation_creation',
    'uml_modeling',
    'domain_driven_design',
    'event_driven_architecture'
  ],
  permissions: ['read', 'write', 'execute'],
  requirements: {
    minMemoryMB: 384,
    externalServices: ['Modeling Tools']
  },
  dependencies: ['code_assistant'],
  conflicts: [],
  metadata: {
    icon: 'Network',
    color: 'text-teal-500',
    difficulty: 'advanced',
    estimatedSetupTime: '25 minutes',
    tags: ['architecture', 'system-design', 'patterns', 'scalability', 'engineering', 'ddd'],
    version: '1.0.0',
    author: 'Gemigram',
    documentationUrl: 'https://gemigram.ai/docs/skills/system-architect'
  }
};

/**
 * Code Quality & Best Practices
 */
export const CODE_QUALITY_SKILL: SkillDefinition = {
  id: 'code_quality',
  name: 'Code Quality Guardian',
  description: 'Ensure code quality through linting, testing, and adherence to best practices',
  category: 'utility',
  capabilities: [
    'code_review',
    'static_analysis',
    'testing_strategies',
    'refactoring',
    'design_patterns',
    'clean_code_principles',
    'technical_debt_management',
    'code_smells_detection',
    'performance_profiling'
  ],
  permissions: ['read', 'execute'],
  requirements: {
    minMemoryMB: 256,
    externalServices: ['Linting Tools', 'Testing Frameworks']
  },
  dependencies: ['code_assistant'],
  conflicts: [],
  metadata: {
    icon: 'ShieldCheck',
    color: 'text-emerald-500',
    difficulty: 'intermediate',
    estimatedSetupTime: '15 minutes',
    tags: ['quality', 'testing', 'best-practices', 'refactoring', 'clean-code', 'linting'],
    version: '1.0.0',
    author: 'Gemigram',
    documentationUrl: 'https://gemigram.ai/docs/skills/code-quality'
  }
};

/**
 * Security Engineering
 */
export const SECURITY_ENGINEERING_SKILL: SkillDefinition = {
  id: 'security_engineering',
  name: 'Security Engineer',
  description: 'Implement secure coding practices and vulnerability assessment',
  category: 'utility',
  capabilities: [
    'threat_modeling',
    'vulnerability_assessment',
    'secure_coding',
    'penetration_testing',
    'encryption_implementation',
    'security_auditing',
    'compliance_checking',
    'owasp_top_10',
    'zero_trust_architecture'
  ],
  permissions: ['read', 'execute', 'network'],
  requirements: {
    minMemoryMB: 384,
    externalServices: ['Security Scanners', 'Vulnerability Databases']
  },
  dependencies: ['code_quality'],
  conflicts: [],
  metadata: {
    icon: 'Lock',
    color: 'text-red-600',
    difficulty: 'advanced',
    estimatedSetupTime: '20 minutes',
    tags: ['security', 'cybersecurity', 'encryption', 'vulnerability', 'compliance', 'owasp'],
    version: '1.0.0',
    author: 'Gemigram',
    documentationUrl: 'https://gemigram.ai/docs/skills/security-engineering'
  }
};

/**
 * Technical Writing & Documentation
 */
export const TECHNICAL_WRITING_SKILL: SkillDefinition = {
  id: 'technical_writing',
  name: 'Technical Writer',
  description: 'Create comprehensive technical documentation and specifications',
  category: 'creative',
  capabilities: [
    'api_documentation',
    'technical_specifications',
    'user_guides',
    'architecture_decision_records',
    'runbook_creation',
    'diagram_creation',
    'knowledge_base_management',
    'version_controlled_docs'
  ],
  permissions: ['read', 'write'],
  requirements: {
    minMemoryMB: 192,
    externalServices: []
  },
  dependencies: [],
  conflicts: [],
  metadata: {
    icon: 'FileText',
    color: 'text-blue-400',
    difficulty: 'intermediate',
    estimatedSetupTime: '12 minutes',
    tags: ['documentation', 'writing', 'technical', 'api-docs', 'specifications'],
    version: '1.0.0',
    author: 'Gemigram',
    documentationUrl: 'https://gemigram.ai/docs/skills/technical-writing'
  }
};

/**
 * Agile Project Management
 */
export const AGILE_PM_SKILL: SkillDefinition = {
  id: 'agile_project_management',
  name: 'Agile Project Manager',
  description: 'Manage software projects using Agile, Scrum, and Kanban methodologies',
  category: 'productivity',
  capabilities: [
    'sprint_planning',
    'backlog_grooming',
    'story_estimation',
    'velocity_tracking',
    'kanban_board_management',
    'retrospective_facilitation',
    'risk_management',
    'stakeholder_communication'
  ],
  permissions: ['read', 'write', 'execute'],
  requirements: {
    minMemoryMB: 256,
    externalServices: ['Project Management Tool']
  },
  dependencies: ['task_management'],
  conflicts: [],
  metadata: {
    icon: 'Users',
    color: 'text-indigo-500',
    difficulty: 'intermediate',
    estimatedSetupTime: '15 minutes',
    tags: ['agile', 'scrum', 'kanban', 'project-management', 'sprint', 'planning'],
    version: '1.0.0',
    author: 'Gemigram',
    documentationUrl: 'https://gemigram.ai/docs/skills/agile-project-management'
  }
};

// Export all software engineering skills as an array
export const SOFTWARE_ENGINEERING_SKILLS: SkillDefinition[] = [
  SYSTEM_ARCHITECT_SKILL,
  CODE_QUALITY_SKILL,
  SECURITY_ENGINEERING_SKILL,
  TECHNICAL_WRITING_SKILL,
  AGILE_PM_SKILL
];
