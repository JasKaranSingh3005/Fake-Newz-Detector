/** @type {import('tailwindcss').Config} */

// Colors resolve to CSS variables (defined in src/index.css for light and .dark).
// The <alpha-value> placeholder keeps opacity modifiers like border-fake/30 working.
const c = (name) => `rgb(var(--c-${name}) / <alpha-value>)`

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: c('canvas'),
        paper: c('paper'),
        drawer: c('drawer'),
        ink: c('ink'),
        'ink-soft': c('ink-soft'),
        'ink-faint': c('ink-faint'),
        rule: c('rule'),
        'rule-strong': c('rule-strong'),
        accent: c('accent'),
        primary: { DEFAULT: c('primary'), hover: c('primary-hover') },
        real: { DEFAULT: c('real'), bg: c('real-bg') },
        warn: { DEFAULT: c('warn'), bg: c('warn-bg') },
        fake: { DEFAULT: c('fake'), bg: c('fake-bg') },
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
