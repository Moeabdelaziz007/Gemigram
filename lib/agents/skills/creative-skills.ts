/**
 * 🎨 Creative & Utility Skills
 * 
 * Comprehensive skill definitions for content creation, translation, and utility functions.
 * Includes creative tools, communication enhancers, and productivity boosters.
 */

import { SkillDefinition } from '../skill-types';

/**
 * Content Creation Studio Skill
 */
export const CONTENT_CREATION_SKILL: SkillDefinition = {
  id: 'content_creation',
  name: 'Content Creation Studio',
  description: 'Generate creative content including text, images, code, and multimedia',
  category: 'creative',
  capabilities: [
    'text_generation',
    'image_generation',
    'code_generation',
    'content_editing',
    'style_transfer',
    'copywriting',
    'storytelling',
    'script_writing'
  ],
  permissions: ['read', 'write', 'execute'],
  requirements: {
    minMemoryMB: 256,
    externalServices: ['AI Generation API']
  },
  dependencies: [],
  conflicts: [],
  metadata: {
    icon: 'Palette',
    color: 'text-pink-500',
    difficulty: 'intermediate',
    estimatedSetupTime: '10 minutes',
    tags: ['creative', 'generation', 'content', 'art', 'writing', 'multimedia'],
    version: '1.0.0',
    author: 'Gemigram',
    documentationUrl: 'https://gemigram.ai/docs/skills/content-creation'
  }
};

/**
 * Universal Translator Skill
 */
export const TRANSLATION_SKILL: SkillDefinition = {
  id: 'translation',
  name: 'Universal Translator',
  description: 'Translate text between 100+ languages with contextual understanding',
  category: 'communication',
  capabilities: [
    'text_translation',
    'language_detection',
    'contextual_translation',
    'localization',
    'pronunciation_guide',
    'idiom_translation',
    'technical_translation',
    'real_time_translation'
  ],
  permissions: ['read', 'write', 'network'],
  requirements: {
    apiKeys: ['GOOGLE_TRANSLATE_API_KEY'],
    oauthScopes: [],
    externalServices: ['Translation API']
  },
  dependencies: [],
  conflicts: [],
  metadata: {
    icon: 'Languages',
    color: 'text-green-500',
    difficulty: 'beginner',
    estimatedSetupTime: '5 minutes',
    tags: ['translation', 'language', 'communication', 'international', 'multilingual', 'localization'],
    version: '1.0.0',
    author: 'Gemigram',
    documentationUrl: 'https://cloud.google.com/translate'
  }
};

/**
 * Voice Synthesis Skill
 */
export const VOICE_SYNTHESIS_SKILL: SkillDefinition = {
  id: 'voice_synthesis',
  name: 'Voice Synthesis',
  description: 'Text-to-speech conversion with natural voices in multiple languages',
  category: 'communication',
  capabilities: [
    'text_to_speech',
    'voice_cloning',
    'emotion_synthesis',
    'multi_voice_support',
    'pronunciation_control',
    'speech_pacing',
    'audio_formats'
  ],
  permissions: ['read', 'execute', 'storage'],
  requirements: {
    apiKeys: [],
    oauthScopes: [],
    externalServices: ['Gemini Live Native Audio', 'Web Speech API']
  },
  dependencies: [],
  conflicts: [],
  metadata: {
    icon: 'Mic',
    color: 'text-violet-500',
    difficulty: 'intermediate',
    estimatedSetupTime: '10 minutes',
    tags: ['voice', 'speech', 'audio', 'tts', 'synthesis', 'narration', 'sovereign'],
    version: '1.1.0',
    author: 'Aether Architect',
    documentationUrl: 'https://ai.google.dev/gemini/docs/live'
  }
};

/**
 * Social Media Manager Skill
 */
export const SOCIAL_MEDIA_SKILL: SkillDefinition = {
  id: 'social_media',
  name: 'Social Media Manager',
  description: 'Manage and schedule posts across multiple social media platforms',
  category: 'social',
  capabilities: [
    'post_scheduling',
    'multi_platform_posting',
    'engagement_tracking',
    'hashtag_optimization',
    'analytics_reporting',
    'content_calendar',
    'audience_insights'
  ],
  permissions: ['read', 'write', 'network', 'api_access'],
  requirements: {
    apiKeys: ['BUFFER_API_KEY'],
    oauthScopes: [],
    externalServices: ['Buffer API', 'Twitter API', 'LinkedIn API']
  },
  dependencies: [],
  conflicts: [],
  metadata: {
    icon: 'Share2',
    color: 'text-blue-600',
    difficulty: 'intermediate',
    estimatedSetupTime: '15 minutes',
    tags: ['social', 'marketing', 'posting', 'engagement', 'twitter', 'linkedin'],
    version: '1.0.0',
    author: 'Gemigram',
    documentationUrl: 'https://buffer.com/developers'
  }
};

/**
 * Task Management Skill
 */
export const TASK_MANAGEMENT_SKILL: SkillDefinition = {
  id: 'task_management',
  name: 'Task Manager',
  description: 'Create, organize, and track tasks with priority management',
  category: 'productivity',
  capabilities: [
    'task_creation',
    'priority_management',
    'deadline_tracking',
    'subtasks',
    'recurring_tasks',
    'task_templates',
    'progress_tracking',
    'team_collaboration'
  ],
  permissions: ['read', 'write', 'network'],
  requirements: {
    apiKeys: ['TODOIST_API_KEY'],
    oauthScopes: [],
    externalServices: ['Todoist API', 'Notion API']
  },
  dependencies: [],
  conflicts: [],
  metadata: {
    icon: 'CheckSquare',
    color: 'text-orange-500',
    difficulty: 'beginner',
    estimatedSetupTime: '8 minutes',
    tags: ['tasks', 'productivity', 'organization', 'todo', 'management', 'planning'],
    version: '1.0.0',
    author: 'Gemigram',
    documentationUrl: 'https://developer.todoist.com/'
  }
};

/**
 * Note Taking Skill
 */
export const NOTE_TAKING_SKILL: SkillDefinition = {
  id: 'note_taking',
  name: 'Smart Notes',
  description: 'Intelligent note-taking with organization and search capabilities',
  category: 'productivity',
  capabilities: [
    'note_creation',
    'categorization',
    'tagging',
    'full_text_search',
    'voice_notes',
    'handwriting_recognition',
    'note_linking',
    'export_formats'
  ],
  permissions: ['read', 'write', 'storage'],
  requirements: {
    minMemoryMB: 128,
    externalServices: ['Evernote API', 'OneNote API']
  },
  dependencies: [],
  conflicts: [],
  metadata: {
    icon: 'StickyNote',
    color: 'text-yellow-600',
    difficulty: 'beginner',
    estimatedSetupTime: '5 minutes',
    tags: ['notes', 'productivity', 'organization', 'knowledge', 'documentation'],
    version: '1.0.0',
    author: 'Gemigram',
    documentationUrl: 'https://dev.evernote.com/'
  }
};

/**
 * Code Assistant Skill
 */
export const CODE_ASSISTANT_SKILL: SkillDefinition = {
  id: 'code_assistant',
  name: 'Code Assistant',
  description: 'Programming assistance with code generation, debugging, and review',
  category: 'utility',
  capabilities: [
    'code_generation',
    'code_review',
    'debugging',
    'refactoring',
    'documentation',
    'testing',
    'optimization',
    'security_analysis'
  ],
  permissions: ['read', 'write', 'execute'],
  requirements: {
    minMemoryMB: 512,
    externalServices: ['GitHub API', 'GitLab API']
  },
  dependencies: [],
  conflicts: [],
  metadata: {
    icon: 'Code',
    color: 'text-emerald-500',
    difficulty: 'advanced',
    estimatedSetupTime: '15 minutes',
    tags: ['coding', 'programming', 'development', 'debugging', 'software', 'engineering'],
    version: '1.0.0',
    author: 'Gemigram',
    documentationUrl: 'https://docs.github.com/en/rest'
  }
};

/**
 * File Converter Skill
 */
export const FILE_CONVERTER_SKILL: SkillDefinition = {
  id: 'file_converter',
  name: 'Universal File Converter',
  description: 'Convert files between different formats while preserving quality',
  category: 'utility',
  capabilities: [
    'document_conversion',
    'image_conversion',
    'video_conversion',
    'audio_conversion',
    'batch_conversion',
    'quality_preservation',
    'metadata_transfer'
  ],
  permissions: ['read', 'write', 'execute', 'storage'],
  requirements: {
    minMemoryMB: 256,
    externalServices: ['CloudConvert API']
  },
  dependencies: [],
  conflicts: [],
  metadata: {
    icon: 'RefreshCw',
    color: 'text-teal-500',
    difficulty: 'beginner',
    estimatedSetupTime: '5 minutes',
    tags: ['conversion', 'files', 'format', 'media', 'documents', 'utility'],
    version: '1.0.0',
    author: 'Gemigram',
    documentationUrl: 'https://cloudconvert.com/api'
  }
};

// Export all creative and utility skills as an array
export const CREATIVE_UTILITY_SKILLS: SkillDefinition[] = [
  CONTENT_CREATION_SKILL,
  TRANSLATION_SKILL,
  VOICE_SYNTHESIS_SKILL,
  SOCIAL_MEDIA_SKILL,
  TASK_MANAGEMENT_SKILL,
  NOTE_TAKING_SKILL,
  CODE_ASSISTANT_SKILL,
  FILE_CONVERTER_SKILL
];
