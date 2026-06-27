import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Sora', 'Inter', 'sans-serif'],
        mono:    ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        green:  { DEFAULT: '#16a34a', light: '#22c55e', dim: 'rgba(34,197,94,0.12)', faint: 'rgba(34,197,94,0.06)' },
        red:    { DEFAULT: '#dc2626', light: '#ef4444', dim: 'rgba(239,68,68,0.12)', faint: 'rgba(239,68,68,0.06)' },
        amber:  { DEFAULT: '#d97706', light: '#f59e0b', dim: 'rgba(245,158,11,0.12)' },
        surface: 'var(--surface)',
        'surface-2': 'var(--surface-2)',
        border:  'var(--border)',
        text: {
          primary:   'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted:     'var(--text-muted)',
        },
      },
      borderRadius: {
        sm:  '6px',
        DEFAULT: '10px',
        lg:  '14px',
        xl:  '18px',
        '2xl': '24px',
        '3xl': '32px',
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        glow: '0 0 20px rgba(34,197,94,0.25)',
      },
      animation: {
        'fade-in':   'fadeIn 0.2s ease',
        'slide-up':  'slideUp 0.25s cubic-bezier(0.34,1.56,0.64,1)',
        'scale-in':  'scaleIn 0.15s ease',
        'ticker':    'ticker 30s linear infinite',
        'shimmer':   'shimmer 1.4s ease-in-out infinite',
        'pulse-dot': 'pulseDot 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:   { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp:  { from: { transform: 'translateY(16px)', opacity: '0' }, to: { transform: 'translateY(0)', opacity: '1' } },
        scaleIn:  { from: { transform: 'scale(0.95)', opacity: '0' }, to: { transform: 'scale(1)', opacity: '1' } },
        ticker:   { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        shimmer:  { '0%': { backgroundPosition: '-400px 0' }, '100%': { backgroundPosition: '400px 0' } },
        pulseDot: { '0%,100%': { opacity: '1', transform: 'scale(1)' }, '50%': { opacity: '0.4', transform: 'scale(0.8)' } },
      },
      screens: {
        xs: '390px',
      },
    },
  },
  plugins: [],
}

export default config
