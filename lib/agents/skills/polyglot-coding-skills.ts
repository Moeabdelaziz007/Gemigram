/**
 * 🌐 Polyglot Programming Skills
 * 
 * Multi-language programming expertise across popular languages and frameworks.
 * Enables agents to work fluently in different programming ecosystems.
 */

import { SkillDefinition } from '../skill-types';

/**
 * Python Programming Expert
 */
export const PYTHON_EXPERT_SKILL: SkillDefinition = {
  id: 'python_expert',
  name: 'Python Expert',
  description: 'Advanced Python programming for web, data science, automation, and AI',
  category: 'integration',
  capabilities: [
    'web_development', // Django, Flask, FastAPI
    'data_science', // Pandas, NumPy
    'machine_learning', // TensorFlow, PyTorch
    'automation_scripting',
    'api_development',
    'async_programming',
    'package_creation',
    'testing_pytest'
  ],
  permissions: ['read', 'write', 'execute'],
  requirements: {
    minMemoryMB: 384,
    externalServices: ['PyPI', 'Python Runtime']
  },
  dependencies: ['code_assistant'],
  conflicts: [],
  metadata: {
    icon: 'Code',
    color: 'text-blue-400',
    difficulty: 'intermediate',
    estimatedSetupTime: '15 minutes',
    tags: ['python', 'programming', 'data-science', 'ai', 'web', 'django', 'flask'],
    version: '1.0.0',
    author: 'Gemigram',
    documentationUrl: 'https://gemigram.ai/docs/skills/python-expert'
  }
};

/**
 * JavaScript/TypeScript Mastery
 */
export const JAVASCRIPT_TYPESCRIPT_SKILL: SkillDefinition = {
  id: 'javascript_typescript',
  name: 'JavaScript/TypeScript Master',
  description: 'Full-stack JavaScript development with modern frameworks and tools',
  category: 'integration',
  capabilities: [
    'frontend_frameworks', // React, Vue, Svelte
    'backend_node', // Express, NestJS
    'typescript_advanced',
    'build_tooling',
    'testing_jest_vitest',
    'bundling_optimization',
    'server_side_rendering',
    'edge_computing'
  ],
  permissions: ['read', 'write', 'execute'],
  requirements: {
    minMemoryMB: 512,
    externalServices: ['npm', 'Node.js Runtime']
  },
  dependencies: ['code_assistant', 'frontend_development'],
  conflicts: [],
  metadata: {
    icon: 'Terminal',
    color: 'text-yellow-400',
    difficulty: 'intermediate',
    estimatedSetupTime: '18 minutes',
    tags: ['javascript', 'typescript', 'react', 'nodejs', 'full-stack', 'nextjs', 'vue'],
    version: '1.0.0',
    author: 'Gemigram',
    documentationUrl: 'https://gemigram.ai/docs/skills/javascript-typescript'
  }
};

/**
 * Rust Systems Programming
 */
export const RUST_PROGRAMMING_SKILL: SkillDefinition = {
  id: 'rust_programming',
  name: 'Rust Systems Programmer',
  description: 'High-performance, memory-safe systems programming in Rust',
  category: 'integration',
  capabilities: [
    'systems_programming',
    'memory_safety',
    'concurrency_patterns',
    'ffi_bindings',
    'webassembly',
    'cli_tools',
    'performance_optimization',
    'embedded_rust'
  ],
  permissions: ['read', 'write', 'execute'],
  requirements: {
    minMemoryMB: 512,
    externalServices: ['Cargo', 'Rust Compiler']
  },
  dependencies: ['code_assistant'],
  conflicts: [],
  metadata: {
    icon: 'Cog',
    color: 'text-orange-600',
    difficulty: 'advanced',
    estimatedSetupTime: '25 minutes',
    tags: ['rust', 'systems', 'performance', 'wasm', 'native', 'memory-safe'],
    version: '1.0.0',
    author: 'Gemigram',
    documentationUrl: 'https://gemigram.ai/docs/skills/rust-programming'
  }
};

/**
 * Go Programming for Concurrent Systems
 */
export const GO_PROGRAMMING_SKILL: SkillDefinition = {
  id: 'go_programming',
  name: 'Go Developer',
  description: 'Build efficient concurrent systems and microservices in Go',
  category: 'integration',
  capabilities: [
    'concurrent_programming',
    'microservices_go',
    'api_development',
    'performance_tuning',
    'testing_go',
    'dependency_management',
    'cloud_native_go',
    'grpc_implementation'
  ],
  permissions: ['read', 'write', 'execute'],
  requirements: {
    minMemoryMB: 384,
    externalServices: ['Go Modules']
  },
  dependencies: ['code_assistant'],
  conflicts: [],
  metadata: {
    icon: 'Globe',
    color: 'text-cyan-500',
    difficulty: 'intermediate',
    estimatedSetupTime: '18 minutes',
    tags: ['go', 'golang', 'concurrency', 'microservices', 'cloud-native', 'grpc'],
    version: '1.0.0',
    author: 'Gemigram',
    documentationUrl: 'https://gemigram.ai/docs/skills/go-programming'
  }
};

/**
 * Java Enterprise Development
 */
export const JAVA_ENTERPRISE_SKILL: SkillDefinition = {
  id: 'java_enterprise',
  name: 'Java Enterprise Developer',
  description: 'Build large-scale enterprise applications with Java and Spring',
  category: 'integration',
  capabilities: [
    'spring_boot',
    'enterprise_patterns',
    'microservices_java',
    'jvm_optimization',
    'build_maven_gradle',
    'testing_junit',
    'reactive_programming',
    'cloud_deployment'
  ],
  permissions: ['read', 'write', 'execute'],
  requirements: {
    minMemoryMB: 512,
    externalServices: ['Maven Central', 'JDK']
  },
  dependencies: ['code_assistant'],
  conflicts: [],
  metadata: {
    icon: 'Coffee',
    color: 'text-red-500',
    difficulty: 'advanced',
    estimatedSetupTime: '22 minutes',
    tags: ['java', 'spring', 'enterprise', 'jvm', 'microservices', 'maven'],
    version: '1.0.0',
    author: 'Gemigram',
    documentationUrl: 'https://gemigram.ai/docs/skills/java-enterprise'
  }
};

/**
 * C++ High-Performance Computing
 */
export const CPP_PROGRAMMING_SKILL: SkillDefinition = {
  id: 'cpp_programming',
  name: 'C++ Performance Engineer',
  description: 'Develop high-performance applications and systems in C++',
  category: 'integration',
  capabilities: [
    'modern_cpp', // C++17/20
    'memory_management',
    'template_metaprogramming',
    'performance_optimization',
    'multithreading',
    'game_development',
    'embedded_systems',
    'numerical_computing'
  ],
  permissions: ['read', 'write', 'execute'],
  requirements: {
    minMemoryMB: 512,
    externalServices: ['C++ Compiler', 'Build Tools']
  },
  dependencies: ['code_assistant'],
  conflicts: [],
  metadata: {
    icon: 'Cpu',
    color: 'text-purple-600',
    difficulty: 'advanced',
    estimatedSetupTime: '30 minutes',
    tags: ['cpp', 'c++', 'performance', 'systems', 'games', 'hpc'],
    version: '1.0.0',
    author: 'Gemigram',
    documentationUrl: 'https://gemigram.ai/docs/skills/cpp-programming'
  }
};

// Export all polyglot coding skills as an array
export const POLYGLOT_CODING_SKILLS: SkillDefinition[] = [
  PYTHON_EXPERT_SKILL,
  JAVASCRIPT_TYPESCRIPT_SKILL,
  RUST_PROGRAMMING_SKILL,
  GO_PROGRAMMING_SKILL,
  JAVA_ENTERPRISE_SKILL,
  CPP_PROGRAMMING_SKILL
];
