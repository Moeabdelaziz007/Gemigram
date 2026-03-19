import { Agent } from '@/lib/store/useGemigramStore';

/**
 * PWA Manifest configuration for agent deployment
 */
export interface AgentManifestConfig {
  agent: Agent;
  avatarUrl: string;
  userId: string;
  baseUrl?: string;
}

/**
 * Generate PWA manifest for agent
 */
export function generateAgentManifest(config: AgentManifestConfig): WebAppManifest {
  const { agent, avatarUrl, baseUrl = '' } = config;
  
  // Generate icon variants
  const icons = generateManifestIcons(avatarUrl);
  
  return {
    name: `${agent.name} - AI Agent`,
    short_name: agent.name.length > 15 ? agent.name.substring(0, 15) : agent.name,
    description: agent.role || 'AI Assistant',
    start_url: `${baseUrl}/?agent=${agent.id}`,
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#050B14',
    theme_color: '#10ff87',
    icons,
    categories: ['productivity', 'utilities'],
    shortcuts: [
      {
        name: 'Chat',
        url: `${baseUrl}/workspace?agent=${agent.id}`,
        description: 'Start conversation',
      },
      {
        name: 'Settings',
        url: `${baseUrl}/hub/${agent.id}`,
        description: 'Configure agent',
      },
    ],
    screenshots: [],
    prefer_related_applications: false,
  };
}

/**
 * Generate icon sizes for manifest
 */
function generateManifestIcons(baseUrl: string): ManifestIcon[] {
  const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
  
  return sizes.map(size => ({
    src: `${baseUrl}?size=${size}`,
    sizes: `${size}x${size}`,
    type: 'image/png',
    purpose: 'any maskable',
  }));
}

/**
 * Install agent as PWA
 * Uses the permanent manifest route for reliable PWA installation
 */
export async function installAgentAsPWA(config: AgentManifestConfig): Promise<boolean> {
  try {
    const { agent } = config;
    
    // Use the permanent manifest route instead of blob URL
    const manifestUrl = `/manifest/${agent.id}`;
    
    // Update or create manifest link
    updateManifestLink(manifestUrl);
    
    // Handle desktop browsers with beforeinstallprompt
    if (typeof window !== 'undefined') {
      await handleDesktopInstall();
    }
    
    return true;
  } catch (error) {
    console.error('[PWA] Installation failed:', error);
    return false;
  }
}

/**
 * Update manifest link element
 */
function updateManifestLink(url: string): void {
  let link = document.querySelector('link[rel="manifest"]') as HTMLLinkElement;
  
  if (!link) {
    link = document.createElement('link');
    link.rel = 'manifest';
    document.head.appendChild(link);
  }
  
  link.href = url;
}

/**
 * Handle desktop browser installation
 */
async function handleDesktopInstall(): Promise<void> {
  return new Promise((resolve) => {
    const handler = (e: Event) => {
      e.preventDefault();
      const installEvent = e as BeforeInstallPromptEvent;
      
      // Store event for later use
      (window as any).deferredPrompt = installEvent;
      
      // Show prompt
      installEvent.prompt();
      
      resolve();
    };
    
    window.addEventListener('beforeinstallprompt', handler, { once: true });
    
    // Timeout after 2 seconds if no event
    setTimeout(resolve, 2000);
  });
}

/**
 * Show iOS installation instructions
 */
export function showIOSInstallInstructions(agentName: string): void {
  // This would typically show a modal/dialog
  /* 
  console.log(`
    To install ${agentName} on iOS:
    1. Tap the Share button
    2. Scroll down and tap "Add to Home Screen"
    3. Tap "Add" in the top right corner
  `);
  */
}

// TypeScript interfaces
interface WebAppManifest {
  name: string;
  short_name: string;
  description: string;
  start_url: string;
  display: string;
  orientation: string;
  background_color: string;
  theme_color: string;
  icons: ManifestIcon[];
  categories?: string[];
  shortcuts?: Array<{
    name: string;
    url: string;
    description: string;
  }>;
  screenshots?: Array<{
    src: string;
    sizes: string;
    type: string;
  }>;
  prefer_related_applications?: boolean;
}

interface ManifestIcon {
  src: string;
  sizes: string;
  type: string;
  purpose: string;
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => void;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default {
  generateAgentManifest,
  installAgentAsPWA,
  showIOSInstallInstructions,
};
