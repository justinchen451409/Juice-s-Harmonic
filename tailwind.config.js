/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Inter"', '"Segoe UI"', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
      colors: {
        surface: {
          0: '#0a0a0b',
          1: '#111113',
          2: '#18181b',
          3: '#1e1e22',
          4: '#27272b',
          5: '#303034',
        },
        border: {
          subtle: '#2a2a2e',
          default: '#3a3a3f',
          strong: '#52525b',
        },
        txt: {
          primary: '#f4f4f5',
          secondary: '#a1a1aa',
          tertiary: '#71717a',
        },
      },
    },
  },
  plugins: [],
}
