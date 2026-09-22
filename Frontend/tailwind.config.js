/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#0B1220', // Page Background in Dark Mode
          900: '#111C2E', // Surface / Secondary background in Dark Mode
          800: '#16243A', // Card / Container background in Dark Mode
          700: '#1E293B',
          600: '#334155',
        },
        ocean: {
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#BAE6FD',
          300: '#7DD3FC',
          400: '#38BDF8',
          500: '#0EA5E9',
          600: '#0284C7',
          700: '#0369A1', // Primary Ocean Blue
          800: '#075985',
          900: '#0C4A6E', // Deep Ocean Blue
          950: '#082F49',
        },
        aqua: {
          50: '#ECFEFF',
          100: '#CFFAFE',
          200: '#A5F3FC',
          300: '#67E8F9',
          400: '#22D3EE',
          500: '#06B6D4', // Aqua/Cyan Accent
          600: '#0891B2',
          700: '#0E7490',
        },
        sand: {
          50: '#F8FAFC',  // Soft sand background
          100: '#F1F5F9',
          200: '#E2E8F0',
        },
        coral: {
          50: '#FFF1F2',
          100: '#FFE4E6',
          200: '#FECDD3',
          300: '#FDA4AF',
          400: '#FB7185', // Coral Accent
          500: '#F43F5E', // Vibrant Coral CTA
          600: '#E11D48',
          700: '#BE123C',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
        script: ['Caveat', 'cursive'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(3, 105, 161, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'soft-lg': '0 10px 30px -4px rgba(3, 105, 161, 0.12), 0 4px 10px -2px rgba(0, 0, 0, 0.04)',
        'coral': '0 10px 25px -3px rgba(244, 63, 94, 0.35)',
        'aqua': '0 10px 25px -3px rgba(6, 182, 212, 0.35)',
      },
      animation: {
        'wave-slow': 'wave 15s ease-in-out infinite alternate',
      },
      keyframes: {
        wave: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-25%)' },
        },
      },
    },
  },
  plugins: [],
}
