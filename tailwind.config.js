/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'display': ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#E6FFFC',
          100: '#B3FFF7',
          200: '#80FFF2',
          300: '#4DFFED',
          400: '#1AFFE8',
          500: '#00F5D4',
          600: '#00C2A7',
          700: '#008F7A',
          800: '#005C4D',
          900: '#002920',
        },
        secondary: {
          50: '#F3F0FF',
          100: '#E0D9FF',
          200: '#CCC2FF',
          300: '#B8ABFF',
          400: '#A494FF',
          500: '#7C4DFF',
          600: '#6B3ECC',
          700: '#5A2F99',
          800: '#492066',
          900: '#381133',
        },
        dark: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          950: '#020617',
        },
        glass: {
          light: 'rgba(255, 255, 255, 0.1)',
          medium: 'rgba(255, 255, 255, 0.15)',
          dark: 'rgba(0, 0, 0, 0.1)',
        }
      },
      backgroundImage: {
        'noise': "url('data:image/svg+xml,%3Csvg viewBox=\"0 0 256 256\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noiseFilter\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.9\" numOctaves=\"4\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23noiseFilter)\" opacity=\"0.05\"/%3E%3C/svg%3E')",
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(0, 245, 212, 0.5), 0 0 10px rgba(0, 245, 212, 0.3), 0 0 15px rgba(0, 245, 212, 0.1)' },
          '100%': { boxShadow: '0 0 10px rgba(0, 245, 212, 0.8), 0 0 20px rgba(0, 245, 212, 0.5), 0 0 30px rgba(0, 245, 212, 0.3)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 5px rgba(124, 77, 255, 0.5)' },
          '50%': { opacity: '0.8', boxShadow: '0 0 20px rgba(124, 77, 255, 0.8), 0 0 30px rgba(124, 77, 255, 0.4)' },
        },
      },
      boxShadow: {
        'glow-primary': '0 0 20px rgba(0, 245, 212, 0.3)',
        'glow-secondary': '0 0 20px rgba(124, 77, 255, 0.3)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.1)',
        'glass-lg': '0 16px 64px rgba(0, 0, 0, 0.15)',
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.glass': {
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        },
        '.glass-dark': {
          background: 'rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
        '.text-glow': {
          textShadow: '0 0 10px currentColor',
        },
      }
      addUtilities(newUtilities)
    }
  ],
};
