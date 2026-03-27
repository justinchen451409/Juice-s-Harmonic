/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
      },
      colors: {
        // Semantic theme tokens — light/dark via CSS variables
        'th-bg':       'var(--th-bg)',
        'th-panel':    'var(--th-panel)',
        'th-surface':  'var(--th-surface)',
        'th-hover':    'var(--th-hover)',
        'th-active':   'var(--th-active)',
        'th-bd':       'var(--th-bd)',
        'th-bd-sub':   'var(--th-bd-sub)',
        'th-bd-str':   'var(--th-bd-str)',
        'th-tx':       'var(--th-tx)',
        'th-tx2':      'var(--th-tx2)',
        'th-tx3':      'var(--th-tx3)',
        'th-tx4':      'var(--th-tx4)',
      },
    },
  },
  plugins: [],
}
