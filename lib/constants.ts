/**
 * GemigramOS Branding Constants
 * Programmatic source of truth for design tokens.
 */

export const BRANDING = {
  colors: {
    black: '#050505',
    surface: '#0F0F0F',
    fiber: '#1A1A1A',
    gray: '#4A4A4A',
    neon: '#39FF14',
    glass: 'rgba(255, 255, 255, 0.02)',
    border: 'rgba(57, 255, 20, 0.1)',
  },
  typography: {
    heading: 'Inter, sans-serif',
    body: 'Inter, sans-serif',
    mono: 'Fira Code, monospace',
  },
  effects: {
    blur: '32px',
    glow: '0 0 20px rgba(57, 255, 20, 0.15)',
    carbonTexture: 'https://www.transparenttextures.com/patterns/carbon-fibre.png',
  },
  rounding: {
    card: '2rem',
    button: '1rem',
    full: '9999px',
  }
} as const;

export type BrandingType = typeof BRANDING;
