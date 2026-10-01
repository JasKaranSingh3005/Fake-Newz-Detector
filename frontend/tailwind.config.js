/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#F8FAFC',
        paper: '#FFFFFF',
        drawer: '#F1F5F9',
        ink: '#0B132B',
        'ink-soft': '#475569',
        'ink-faint': '#64748B',
        rule: '#E2E8F0',
        'rule-strong': '#CBD5E1',
        primary: { DEFAULT: '#6F7693', hover: '#747683' },
        real: { DEFAULT: '#059669', bg: '#ECFDF5' },
        warn: { DEFAULT: '#D97706', bg: '#FEF3C7' },
        fake: { DEFAULT: '#DC2626', bg: '#FEE2E2' },
      },
      fontFamily: {
        serif: ['Newsreader', 'Georgia', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
      },
      boxShadow: {
        drawer: '0 4px 20px -2px rgba(11, 19, 43, 0.06)',
        modal: '0 12px 32px -4px rgba(11, 19, 43, 0.12)',
      },
    },
  },
  plugins: [],
}
