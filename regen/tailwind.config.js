/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        railway: {
          50:  '#EBF3FB',
          100: '#C8E0F5',
          200: '#9DB9CF',
          300: '#6E96B8',
          400: '#3A72A0',
          500: '#145DA0',
          600: '#0F4A84',
          700: '#0B3868',
          800: '#07264C',
          900: '#0B1F33',
        },
      },
      textColor: {
        healthy:  '#16A34A',
        warning:  '#F59E0B',
        critical: '#DC2626',
        offline:  '#6B7280',
      },
      borderColor: {
        healthy:  '#16A34A',
        warning:  '#F59E0B',
        critical: '#DC2626',
        offline:  '#6B7280',
      },
    },
  },
  plugins: [],
}
