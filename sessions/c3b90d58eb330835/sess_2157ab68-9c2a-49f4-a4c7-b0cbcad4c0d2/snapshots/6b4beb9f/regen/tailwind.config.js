/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // REGEN Brand Colours
        navy: {
          DEFAULT: '#0B1F33',
          50: '#E8EEF4',
          100: '#C5D4E3',
          200: '#9DB9CF',
          300: '#749DBB',
          400: '#4B82A7',
          500: '#2B6093',
          600: '#1A4A7A',
          700: '#0B1F33',
          800: '#091929',
          900: '#06111D',
        },
        railway: {
          DEFAULT: '#145DA0',
          50: '#EBF3FB',
          100: '#C8E0F5',
          200: '#91C2EB',
          300: '#5AA4E0',
          400: '#2386D6',
          500: '#145DA0',
          600: '#104A80',
          700: '#0C3860',
          800: '#082540',
          900: '#041220',
        },
        cyan: {
          DEFAULT: '#00A6C7',
          50: '#E0F7FC',
          100: '#B3EDF7',
          200: '#80E2F1',
          300: '#4DD7EC',
          400: '#1ACCE7',
          500: '#00A6C7',
          600: '#00849F',
          700: '#006378',
          800: '#004250',
          900: '#002128',
        },
        // Status colours
        healthy: '#16A34A',
        warning: '#F59E0B',
        critical: '#DC2626',
        offline: '#6B7280',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      backgroundColor: {
        page: '#F5F7FA',
      },
    },
  },
  plugins: [],
}
