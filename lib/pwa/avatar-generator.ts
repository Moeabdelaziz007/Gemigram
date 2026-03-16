'use client';

import { Agent } from '@/lib/store/useAetherStore';

/**
 * Avatar Generation Configuration
 */
export interface AvatarConfig {
  agent: Agent;
  size?: number;
  format?: 'png' | 'jpeg' | 'webp';
  quality?: number;
}

/**
 * Soul-based color palettes for avatar generation
 */
const SOUL_COLORS: Record<string, [string, string]> = {
  analytical: ['#06b6d4', '#3b82f6'],      // Cyan to Blue
  logic: ['#06b6d4', '#3b82f6'],           // Cyan to Blue
  creative: ['#d946ef', '#ec4899'],        // Fuchsia to Pink
  art: ['#d946ef', '#ec4899'],             // Fuchsia to Pink
  aggressive: ['#ef4444', '#f97316'],      // Red to Orange
  warrior: ['#ef4444', '#f97316'],         // Red to Orange
  mystical: ['#8b5cf6', '#a855f7'],        // Purple
  soul: ['#8b5cf6', '#a855f7'],            // Purple
  empathetic: ['#10ff87', '#00ff41'],      // Neon Green (default)
  default: ['#10ff87', '#00ff41'],         // Neon Green (default)
};

/**
 * Generate avatar from agent data using Canvas API
 * 
 * @param config - Avatar generation configuration
 * @returns Promise resolving to base64 data URL of generated avatar
 * 
 * @example
 * ```typescript
 * const avatar = await generateAgentAvatar({ agent, size: 512 });
 * ```
 */
export async function generateAgentAvatar(config: AvatarConfig): Promise<string> {
  const { agent, size = 512, format = 'png', quality = 0.95 } = config;

  // Use existing avatar if available
  if (agent.avatarUrl) {
    return agent.avatarUrl;
  }

  try {
    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Canvas context not available');
    }

    // Get colors based on soul/persona
    const colors = getColorsForSoul(agent.soul || agent.role || '');

    // Draw background gradient
    drawGradientBackground(ctx, size, colors);

    // Draw geometric patterns
    drawGeometricPatterns(ctx, size, colors);

    // Draw agent initial or symbol
    drawAgentSymbol(ctx, size, agent.name, colors);

    // Add glow effects
    addGlowEffects(ctx, size, colors);

    // Convert to data URL
    return canvas.toDataURL(`image/${format}`, quality);
  } catch (error) {
    console.error('[AvatarGenerator] Failed to generate avatar:', error);
    // Return fallback avatar
    return '/aether-entity.png';
  }
}

/**
 * Validate avatar image data
 * 
 * @param dataUrl - Base64 data URL to validate
 * @returns Validation result with success status and optional error message
 */
export function validateAvatarData(dataUrl: string): { valid: boolean; error?: string } {
  // Check if data URL format is correct
  const dataUrlRegex = /^data:image\/(png|jpeg|webp);base64,/;
  if (!dataUrlRegex.test(dataUrl)) {
    return { valid: false, error: 'Invalid data URL format' };
  }
  
  // Extract base64 data
  const base64Data = dataUrl.replace(dataUrlRegex, '');
  
  // Check minimum size (should be at least 1KB)
  if (base64Data.length < 1024) {
    return { valid: false, error: 'Avatar image too small' };
  }
  
  // Check maximum size (should not exceed 5MB)
  if (base64Data.length > 5 * 1024 * 1024) {
    return { valid: false, error: 'Avatar image too large (max 5MB)' };
  }
  
  // Try to create Image object to verify it's a valid image
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      // Check dimensions
      if (img.width < 48 || img.height < 48) {
        resolve({ valid: false, error: 'Avatar dimensions too small (min 48x48)' });
      } else if (img.width > 2048 || img.height > 2048) {
        resolve({ valid: false, error: 'Avatar dimensions too large (max 2048x2048)' });
      } else {
        resolve({ valid: true });
      }
    };
    img.onerror = () => {
      resolve({ valid: false, error: 'Failed to parse image data' });
    };
    img.src = dataUrl;
  }).catch(() => ({ valid: false, error: 'Image validation failed' })) as any;
}

/**
 * Get gradient colors based on agent soul/role
 */
function getColorsForSoul(soul: string): [string, string] {
  const soulLower = soul.toLowerCase();
  
  for (const [key, colors] of Object.entries(SOUL_COLORS)) {
    if (soulLower.includes(key)) {
      return colors;
    }
  }
  
  return SOUL_COLORS.default;
}

/**
 * Draw gradient background
 */
function drawGradientBackground(
  ctx: CanvasRenderingContext2D,
  size: number,
  colors: [string, string]
): void {
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, colors[0]);
  gradient.addColorStop(1, colors[1]);
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
}

/**
 * Draw geometric patterns for visual interest
 */
function drawGeometricPatterns(
  ctx: CanvasRenderingContext2D,
  size: number,
  colors: [string, string]
): void {
  // Draw concentric circles
  const centerX = size / 2;
  const centerY = size / 2;
  
  for (let i = 0; i < 3; i++) {
    const radius = (size / 6) * (i + 1);
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 - i * 0.02})`;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  
  // Draw corner accents
  const accentSize = size / 8;
  ctx.fillStyle = `rgba(255, 255, 255, 0.05)`;
  
  // Top-left
  ctx.fillRect(0, 0, accentSize, accentSize);
  
  // Top-right
  ctx.fillRect(size - accentSize, 0, accentSize, accentSize);
  
  // Bottom-left
  ctx.fillRect(0, size - accentSize, accentSize, accentSize);
  
  // Bottom-right
  ctx.fillRect(size - accentSize, size - accentSize, accentSize, accentSize);
}

/**
 * Draw agent initial or symbol
 */
function drawAgentSymbol(
  ctx: CanvasRenderingContext2D,
  size: number,
  agentName: string,
  colors: [string, string]
): void {
  const initial = agentName.charAt(0).toUpperCase() || 'A';
  const fontSize = size / 2;
  
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${fontSize}px Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Add shadow for depth
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowBlur = 20;
  ctx.shadowOffsetX = 5;
  ctx.shadowOffsetY = 5;
  
  ctx.fillText(initial, size / 2, size / 2);
  
  // Reset shadow
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
}

/**
 * Add glow effects for neon aesthetic
 */
function addGlowEffects(
  ctx: CanvasRenderingContext2D,
  size: number,
  colors: [string, string]
): void {
  const centerX = size / 2;
  const centerY = size / 2;
  
  // Outer glow ring
  const gradient = ctx.createRadialGradient(
    centerX, centerY, 0,
    centerX, centerY, size / 2
  );
  gradient.addColorStop(0, `${colors[0]}40`); // 25% opacity
  gradient.addColorStop(1, 'transparent');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  
  // Inner highlight
  ctx.beginPath();
  ctx.arc(centerX, centerY, size / 4, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(255, 255, 255, 0.1)`;
  ctx.fill();
}

/**
 * Generate multiple avatar sizes for PWA icons
 */
export async function generateAvatarSizes(
  config: AvatarConfig
): Promise<Record<number, string>> {
  const sizes = [48, 72, 96, 144, 192, 512];
  const avatars: Record<number, string> = {};

  for (const size of sizes) {
    try {
      avatars[size] = await generateAgentAvatar({ ...config, size });
    } catch (error) {
      console.error(`[AvatarGenerator] Failed to generate ${size}px avatar:`, error);
      avatars[size] = '/aether-entity.png';
    }
  }

  return avatars;
}

/**
 * Validate generated avatar
 */
export function validateAvatar(dataUrl: string): { valid: boolean; error?: string } {
  // Check if it's a valid data URL
  if (!dataUrl.startsWith('data:image/')) {
    return { valid: false, error: 'Invalid data URL format' };
  }

  // Check size (max 1MB)
  const sizeInBytes = Math.ceil((dataUrl.length * 3) / 4);
  if (sizeInBytes > 1024 * 1024) {
    return { valid: false, error: 'Avatar image too large (max 1MB)' };
  }

  // Check format
  const allowedFormats = ['png', 'jpeg', 'webp'];
  const format = dataUrl.match(/data:image\/(\w+)/)?.[1];
  if (!format || !allowedFormats.includes(format.toLowerCase())) {
    return { valid: false, error: 'Invalid image format' };
  }

  return { valid: true };
}

export default generateAgentAvatar;
