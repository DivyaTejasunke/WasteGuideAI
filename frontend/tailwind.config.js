/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: '#EEF0E4',
          dim: '#E3E6D8',
        },
        ink: {
          DEFAULT: '#10201A',
          soft: '#2B3D33',
        },
        forest: {
          50: '#EAF2ED',
          100: '#CFE3D6',
          300: '#83AF97',
          500: '#3A5A40',
          700: '#1B4332',
          900: '#0F1B14',
        },
        sage: {
          300: '#B9C7B4',
          500: '#7A9278',
          700: '#52796F',
        },
        signal: {
          gold: '#C99A2E',
          rust: '#B4552F',
          clay: '#A9542A',
        },
        badge: {
          recycle: '#2D8A5B',
          organic: '#6E9C3B',
          hazard: '#C44536',
          electronic: '#6C4AB6',
          mixed: '#8A8072',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        body: ['"Public Sans"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        sm: '4px',
        DEFAULT: '8px',
        lg: '14px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(16,32,26,0.06), 0 8px 24px rgba(16,32,26,0.06)',
      },
    },
  },
  plugins: [],
}
