/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#0f1117',
          1: '#161b27',
          2: '#1e2435',
          3: '#252d40',
          4: '#2e3650',
        },
        accent: {
          DEFAULT: '#6366f1',
          hover: '#4f46e5',
          soft: 'rgba(99,102,241,0.15)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
