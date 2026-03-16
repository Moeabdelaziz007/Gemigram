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
        'carbon-black': '#050505',
        'carbon-surface': '#0a0a0a',
        'carbon-fiber': '#111111',
        'carbon-gray': '#4a4a4a',
        'aether-neon': '#00ff41',
        'neon-green': '#10ff87',
        'neon-dim': 'rgba(16,255,135,0.1)',
        'mint-chip': '#00ffa3',
        'cyber-lime': '#ccff00',
        'neon-blue': '#00f0ff',
        'electric-purple': '#b026ff',
        'glass-border': 'rgba(255, 255, 255, 0.08)',
        'glass-bg': 'rgba(5, 5, 5, 0.6)',
      },
      fontFamily: {
        heading: ['Inter', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
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
          '0%, 100%': { boxShadow: '0 0 10px rgba(0, 255, 65, 0.1)' },
          '50%': { boxShadow: '0 0 20px rgba(0, 255, 65, 0.3)' },
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
