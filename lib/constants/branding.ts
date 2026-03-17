export const BRAND = {
  product: {
    name: 'Gemigram',
    platformName: 'Gemigram AIOS',
    tagline: 'The Voice-Native AI Social Nexus',
    systemVersion: 'OS_Sovereign.v3.0',
  },
  subProducts: {
    forge: 'Gemigram Forge',
    galaxy: 'Gemigram Galaxy',
    hub: 'Neural Hub',
    workspace: 'Neural Workspace',
    marketplace: 'Gemigram Market',
  },
  naming: {
    aether: {
      role: 'legacy_alias',
      note: 'Aether is retained only for backwards compatibility in code exports and storage keys.',
    },
  },
  labels: {
    views: {
      home: 'Sovereign Core',
      workspace: 'Neural Workspace',
      hub: 'Neural Hub',
      settings: 'Config Matrix',
      forge: 'Gemigram Forge',
      galaxy: 'Gemigram Galaxy',
      about: 'About Gemigram',
      marketplace: 'Gemigram Market',
    },
    nav: {
      home: 'SOVEREIGN_CORE',
      galaxy: 'GEMIGRAM_GALAXY',
      hub: 'NEURAL_HUB',
      forge: 'GEMIGRAM_FORGE',
      workspace: 'WORKSPACE',
      marketplace: 'GEMIGRAM_MARKET',
      settings: 'CONFIG',
      about: 'ABOUT',
    },
  },
  assets: {
    primaryLogo: {
      path: '/assets/branding/logo.png',
      usage: 'Primary wordmark/logo for app shell and brand surfaces (canonical key: primaryLogo).',
    },
    icon: {
      path: '/assets/branding/logo.png',
      usage: 'Compact icon for avatars, favicons, and constrained UI elements (canonical key: icon).',
    },
    forgeMark: {
      path: '/assets/branding/forge-logo.png',
      usage: 'Gemigram Forge mark used for forge workflows and forge-themed logo variants (canonical key: forgeMark).',
    },
  },
} as const;

export type BrandType = typeof BRAND;
