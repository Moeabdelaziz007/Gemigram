/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ============================================
        // UNIFIED BRAND PALETTE — Single Source of Truth
        // Brand Green: #39FF14 (High-Punch Neon)
        // ============================================
        'gemigram': {
          'neon': '#39FF14',
          'green': '#39FF14',
          'mint': '#00FFA3',
          'lime': '#DFFF00',
        },

        // Core Theme Colors
        'carbon-black': '#050B14',
        'carbon-surface': '#0F1724',
        'carbon-fiber': '#1a2332',
        'carbon-gray': '#4a4a4a',
        'aether-neon': '#39FF14',
        'neon-green': '#39FF14',
        'neon-dim': 'rgba(57, 255, 20, 0.1)',
        'mint-chip': '#00FFA3',
        'cyber-lime': '#DFFF00',
        'neon-blue': '#00f0ff',
        'electric-purple': '#b026ff',
        'glass-border': 'rgba(255, 255, 255, 0.08)',
        'glass-bg': 'rgba(5, 11, 20, 0.6)',

        // Additional Accent Colors
        'neon': {
          'blue': '#00f0ff',
          'purple': '#b026ff',
          'pink': '#ff006e',
        },
      },
      fontSize: {
        'display': ['4rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'h1': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'h2': ['2.25rem', { lineHeight: '1.3', letterSpacing: '0' }],
        'h3': ['1.75rem', { lineHeight: '1.4', letterSpacing: '0.01em' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6' }],
        'body': ['0.9375rem', { lineHeight: '1.6' }],
        'body-sm': ['0.8125rem', { lineHeight: '1.5' }],
        'caption': ['0.6875rem', { lineHeight: '1.4', letterSpacing: '0.02em' }],
      },
      fontWeight: {
        'hairline': 100,
        'thin': 200,
        'light': 300,
        'normal': 400,
        'medium': 500,
        'semibold': 600,
        'bold': 700,
        'extrabold': 800,
        'black': 900,
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        body: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'pulse-neon': 'pulse-neon 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-neon': {
          '0%, 100%': { boxShadow: '0 0 10px rgba(57, 255, 20, 0.1)' },
          '50%': { boxShadow: '0 0 20px rgba(57, 255, 20, 0.3)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        scanline: {
          '0%': { top: '-100px' },
          '100%': { top: '100%' },
        },
      },
    },
  },
  plugins: [],
}
