/** @type {import('tailwindcss').Config} */
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: token('canvas'),
        paper: token('paper'),
        drawer: token('drawer'),
        ink: token('ink'),
        'ink-soft': token('ink-soft'),
        'ink-faint': token('ink-faint'),
        rule: token('rule'),
        'rule-strong': token('rule-strong'),
        primary: {
          DEFAULT: token('primary'),
          hover: token('primary-hover'),
          fg: token('primary-fg'),
        },
        real: { DEFAULT: token('real'), bg: token('real-bg') },
        warn: { DEFAULT: token('warn'), bg: token('warn-bg') },
        fake: { DEFAULT: token('fake'), bg: token('fake-bg') },
      },
      fontFamily: {
        sans: ['"Inter Tight"', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '0',
        sm: '0',
        md: '0',
        lg: '0',
        xl: '0',
        '2xl': '0',
      },
      boxShadow: {
        drawer: 'none',
        modal: 'none',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        grow: { from: { width: '0%' } },
        shimmer: {
          from: { transform: 'translateX(-100%)' },
          to: { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.4s ease-out both',
        grow: 'grow 0.9s cubic-bezier(0.22, 1, 0.36, 1) both',
        shimmer: 'shimmer 1.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
