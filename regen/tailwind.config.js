/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0A0A0A',
        surface: '#111111',
        surface2: '#1A1A1A',
        border: '#2A2A2A',
        cyan: { DEFAULT: '#00FFC6', dim: '#00CC9E', dark: '#007A5E' },
        blue: { DEFAULT: '#00D1FF', dim: '#00A8CC', dark: '#005A6E' },
        green: { DEFAULT: '#39FF14', dim: '#2BCC10', dark: '#1A7A0C' },
        critical: '#FF3B3B',
        warning: '#FFB020',
        info: '#00D1FF',
        muted: '#666666',
        text: { primary: '#F0F0F0', secondary: '#A0A0A0', dim: '#666666' },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-in-right': 'slideInRight 250ms cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'fade-in': 'fadeIn 200ms ease forwards',
      },
      keyframes: {
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      width: { sidebar: '88px', 'alerts-panel': '300px', 'detail-panel': '380px' },
      height: { topbar: '56px' },
    },
  },
  plugins: [],
};
