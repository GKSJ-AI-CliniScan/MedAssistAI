/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#090d16',
          surface: 'rgba(15, 23, 42, 0.65)',
          border: 'rgba(255, 255, 255, 0.08)',
          text: '#f8fafc',
          muted: '#94a3b8'
        },
        primary: {
          light: '#06b6d4',
          DEFAULT: '#0891b2',
          dark: '#0e7490'
        },
        secondary: {
          light: '#6366f1',
          DEFAULT: '#4f46e5',
          dark: '#4338ca'
        },
        accent: {
          rose: '#f43f5e',
          emerald: '#10b981',
          amber: '#f59e0b'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Outfit', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glass-sm': '0 2px 10px 0 rgba(0, 0, 0, 0.1)',
        'glass-md': '0 8px 32px 0 rgba(0, 0, 0, 0.15)',
        'glass-lg': '0 8px 32px 0 rgba(0, 0, 0, 0.25)',
        'glow-primary': '0 0 15px rgba(6, 182, 212, 0.35)',
        'glow-secondary': '0 0 15px rgba(99, 102, 241, 0.35)',
      }
    },
  },
  plugins: [],
}
