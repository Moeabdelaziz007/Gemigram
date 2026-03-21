'use client';

import { Agent } from '@/lib/store/useGemigramStore';

/**
 * Avatar Styles from DiceBear
 */

/**
 * Generate agent avatar URL using DiceBear API
 * 
 * @param seed - Seed for deterministic generation (usually agent name or id)
 * @param size - Image size in pixels
 * @param style - DiceBear style name
 * @returns Fully qualified DiceBear PNG URL
 */
export function generateAgentAvatarUrl(
  seed: string, 
  size: number = 256,
  style: string = 'bottts-neutral'
): string {
  const encodedSeed = encodeURIComponent(seed);
  return `https://api.dicebear.com/7.x/${style}/png?seed=${encodedSeed}&size=${size}&backgroundColor=050B14`;
}

/**
 * Generate agent avatar SVG URL using DiceBear API
 * 
 * @param seed - Seed for deterministic generation
 * @param style - DiceBear style name
 * @returns Fully qualified DiceBear SVG URL
 */
export function generateAgentAvatarSvg(
  seed: string, 
  style: string = 'bottts-neutral'
): string {
  const encodedSeed = encodeURIComponent(seed);
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${encodedSeed}&backgroundColor=050B14`;
}

/**
 * Generate a set of PWA-compliant icons for an agent
 * 
 * @param seed - Seed for generation
 * @returns Array of icon objects for PWA manifest
 */
export function generatePWAIcons(seed: string): Array<{ src: string; sizes: string; type: string; purpose: string }> {
  const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
  
  return sizes.map(size => ({
    src: generateAgentAvatarUrl(seed, size),
    sizes: `${size}x${size}`,
    type: 'image/png',
    purpose: 'any maskable',
  }));
}

/**
 * Legacy support for generateAgentAvatar
 * Now wraps DiceBear logic
 */
export async function generateAgentAvatar(config: { agent: Agent; size?: number }): Promise<string> {
  const { agent, size = 512 } = config;
  
  // Use existing avatar if provided and not a fallback
  if (agent.avatarUrl && !agent.avatarUrl.includes('dicebear')) {
    return agent.avatarUrl;
  }

  // Determine style based on soul if applicable
  let style = 'bottts-neutral';
  if (agent.soul?.toLowerCase().includes('mystical')) style = 'shapes';
  if (agent.soul?.toLowerCase().includes('warrior')) style = 'identicon';
  if (agent.soul?.toLowerCase().includes('creative')) style = 'rings';

  return generateAgentAvatarUrl(agent.seed || agent.name || agent.id, size, style);
}

/**
 * Validate generated avatar (simplified for API-based URLs)
 */
export function validateAvatarData(url: string): { valid: boolean; error?: string } {
  if (!url) return { valid: false, error: 'Empty URL' };
  if (url.startsWith('https://api.dicebear.com/')) return { valid: true };
  if (url.startsWith('data:image/')) return { valid: true };
  return { valid: false, error: 'Unsupported avatar source' };
}

export default generateAgentAvatar;
