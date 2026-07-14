/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        stage: {
          bg: '#F6F3FB',
          card: '#FFFFFF',
          ink: '#221B2E',
          inkSoft: '#5C5468',
          border: '#E4DEF0',
          gold: '#E8A33D',
          goldDark: '#C97F1E',
          pink: '#FF6F91',
          pinkDark: '#E14D72',
          mint: '#2FBF8F',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Manrope"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      keyframes: {
        'fade-slide-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'ticker-in': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '10%': { opacity: '1', transform: 'translateY(0)' },
          '90%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(-16px)' },
        },
        'pulse-ring': {
          '0%': { boxShadow: '0 0 0 0 rgba(232, 163, 61, 0.45)' },
          '100%': { boxShadow: '0 0 0 10px rgba(232, 163, 61, 0)' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'fade-slide-up': 'fade-slide-up 0.45s ease-out both',
        'pulse-ring': 'pulse-ring 1.6s ease-out infinite',
        'spin-slow': 'spin-slow 2.4s linear infinite',
      },
    },
  },
  plugins: [],
};
