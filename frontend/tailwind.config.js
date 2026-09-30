/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#0B0F19',
          900: '#0F1524',
          800: '#161D2E',
          700: '#1F2A40',
        },
        accent: {
          DEFAULT: '#5B6EF5',
          light: '#8A96F9',
        },
        real: '#1FA97D',
        fake: '#E5484D',
        warn: '#D9A441',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0,0,0,0.25)',
      },
    },
  },
  plugins: [],
}
