import defaultTheme from 'tailwindcss/defaultTheme'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,ts,tsx,js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#047857',
          soft: '#55E792',
        },
        background: {
          light: '#f1f5f9',
          dark: '#0f172a',
        },
        surface: {
          light: '#ffffff',
          dark: '#162029',
        },
        card: {
          light: '#ffffff',
          dark: '#192534',
        },
        text: {
          light: '#111827',
          dark: '#e2e8f0',
        },
        subtext: {
          light: '#475569',
          dark: '#94a3b8',
        },
      },
      boxShadow: {
        soft: '0 16px 40px rgba(15, 23, 42, 0.12)',
      },
      fontFamily: {
        display: ['"Inter"', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
}
