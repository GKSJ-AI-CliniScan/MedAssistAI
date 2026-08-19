/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        clinical: {
          bgLight: '#F5F8F7',
          cardLight: '#FFFFFF',
          textLight: '#102A43',
          mutedLight: '#607D8B',
          green: '#087F5B',
          teal: '#14B8A6',
          mint: '#DDF7EE',
          violet: '#6C63FF',
          warning: '#F4B942',
          critical: '#E05252',
          bgDark: '#071821',
          bgDarkSec: '#0B2430',
          cardDark: '#0D2633',
          textDark: '#F4FAF8',
          mutedDark: '#A8C0C8',
          greenDark: '#14B87A',
          tealDark: '#21C7B7',
          violetDark: '#8175FF',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      boxShadow: {
        'aurora-light': '0 10px 30px -10px rgba(8, 127, 91, 0.12), 0 4px 12px -2px rgba(20, 184, 166, 0.08)',
        'aurora-dark': '0 10px 35px -10px rgba(20, 199, 183, 0.18), 0 0 20px 0 rgba(129, 117, 255, 0.1)',
        'glass-light': '0 8px 32px 0 rgba(16, 42, 67, 0.06)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.4)',
      }
    },
  },
  plugins: [],
}

