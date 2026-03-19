/**
 * 🔌 API Integration Skills
 * 
 * Comprehensive skills for discovering, authenticating, and managing API integrations
 * from various marketplaces and public sources.
 */

import { SkillDefinition } from '../skill-types';

/**
 * Public API Discovery Skill
 */
export const PUBLIC_API_DISCOVERY_SKILL: SkillDefinition = {
  id: 'public_api_discovery',
  name: 'Public API Finder',
  description: 'Discover free public APIs for rapid prototyping and experimentation',
  category: 'mcp_integration',
  capabilities: [
    'api_search',
    'category_filtering',
    'authentication_filtering',
    'cors_checking',
    'rate_limit_analysis',
    'documentation_quality'
  ],
  permissions: ['read', 'network'],
  requirements: {
    minMemoryMB: 128,
    externalServices: []
  },
  dependencies: [],
  conflicts: [],
  metadata: {
    icon: 'Search',
    color: 'text-cyan-500',
    difficulty: 'beginner',
    estimatedSetupTime: '5 minutes',
    tags: ['api', 'discovery', 'free', 'public', 'open-data'],
    version: '1.0.0',
    author: 'Gemigram',
    documentationUrl: 'https://gemigram.ai/docs/skills/public-api-discovery'
  }
};

/**
 * Enterprise API Gateway Skill
 */
export const ENTERPRISE_API_GATEWAY_SKILL: SkillDefinition = {
  id: 'enterprise_api_gateway',
  name: 'Enterprise API Gateway',
  description: 'Connect to enterprise API gateways including Apigee, Kong, and AWS API Gateway',
  category: 'mcp_integration',
  capabilities: [
    'gateway_discovery',
    'oauth2_flow',
    'api_key_management',
    'rate_limit_negotiation',
    'quota_tracking',
    'sla_monitoring'
  ],
  permissions: ['read', 'write', 'network', 'mcp_access'],
  requirements: {
    minMemoryMB: 384,
    externalServices: ['API Gateway']
  },
  dependencies: [],
  conflicts: [],
  metadata: {
    icon: 'Building',
    color: 'text-slate-600',
    difficulty: 'advanced',
    estimatedSetupTime: '20 minutes',
    tags: ['enterprise', 'api-gateway', 'apigee', 'kong', 'aws', 'corporate'],
    version: '1.0.0',
    author: 'Gemigram',
    documentationUrl: 'https://gemigram.ai/docs/skills/enterprise-api-gateway'
  }
};

/**
 * API Authentication Handler Skill
 */
export const API_AUTHENTICATION_SKILL: SkillDefinition = {
  id: 'api_authentication',
  name: 'API Authentication Expert',
  description: 'Handle diverse API authentication methods including OAuth2, API keys, JWT, and basic auth',
  category: 'utility',
  capabilities: [
    'oauth2_flow',
    'jwt_handling',
    'api_key_injection',
    'basic_auth',
    'bearer_token',
    'token_refresh',
    'signature_generation',
    'hmac_authentication'
  ],
  permissions: ['read', 'write', 'network'],
  requirements: {
    minMemoryMB: 256,
    externalServices: []
  },
  dependencies: [],
  conflicts: [],
  metadata: {
    icon: 'Lock',
    color: 'text-red-500',
    difficulty: 'advanced',
    estimatedSetupTime: '15 minutes',
    tags: ['authentication', 'oauth2', 'jwt', 'security', 'api', 'tokens'],
    version: '1.0.0',
    author: 'Gemigram',
    documentationUrl: 'https://gemigram.ai/docs/skills/api-authentication'
  }
};

/**
 * API Rate Limiting Manager Skill
 */
export const API_RATE_LIMITING_SKILL: SkillDefinition = {
  id: 'api_rate_limiting',
  name: 'API Rate Limit Manager',
  description: 'Intelligently manage API rate limits, quotas, and throttling across multiple providers',
  category: 'utility',
  capabilities: [
    'rate_limit_detection',
    'quota_tracking',
    'request_throttling',
    'backoff_strategies',
    'retry_logic',
    'burst_handling',
    'multi_provider_coordination'
  ],
  permissions: ['read', 'execute'],
  requirements: {
    minMemoryMB: 192,
    externalServices: []
  },
  dependencies: [],
  conflicts: [],
  metadata: {
    icon: 'Gauge',
    color: 'text-yellow-500',
    difficulty: 'intermediate',
    estimatedSetupTime: '12 minutes',
    tags: ['rate-limiting', 'throttling', 'quota', 'api-management', 'optimization'],
    version: '1.0.0',
    author: 'Gemigram',
    documentationUrl: 'https://gemigram.ai/docs/skills/api-rate-limiting'
  }
};

// Export all API marketplace skills as an array
export const API_MARKETPLACE_SKILLS: SkillDefinition[] = [
  PUBLIC_API_DISCOVERY_SKILL,
  ENTERPRISE_API_GATEWAY_SKILL,
  API_AUTHENTICATION_SKILL,
  API_RATE_LIMITING_SKILL
];

/**
 * Helper function to get skill by ID
 */
export function getAPIMarketplaceSkill(skillId: string): SkillDefinition | undefined {
  return API_MARKETPLACE_SKILLS.find(skill => skill.id === skillId);
}

/**
 * Get skills by category
 */
export function getAPISkillsByCategory(category: string): SkillDefinition[] {
  return API_MARKETPLACE_SKILLS.filter(skill => skill.category === category);
}
