/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'verde-belic': {
          DEFAULT: '#57dba0',
          50: '#f0fdf6',
          100: '#d9f9e8',
          200: '#b0f2d0',
          300: '#7ae8b3',
          400: '#57dba0',
          500: '#2abf7e',
          600: '#1d9d65',
          700: '#1a7d52',
          800: '#196343',
          900: '#175138',
          950: '#072d1e'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      }
    }
  },
  plugins: []
};
