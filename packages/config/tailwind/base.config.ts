import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    '../../packages/ui/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
          950: '#1E1B4B'
        },
        secondary: {
          50: '#FDF2F8',
          500: '#EC4899',
          900: '#831843'
        },
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
        background: {
          light: '#FFFFFF',
          dark: '#0F172A'
        },
        surface: {
          light: '#F8FAFC',
          dark: '#1E293B'
        },
        border: {
          light: '#E2E8F0',
          dark: '#334155'
        }
      },
      fontFamily: {
        ui: ['Inter', 'sans-serif'],
        code: ['JetBrains Mono', 'monospace']
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        full: '9999px'
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px'
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
      },
      transitionProperty: {
        all: 'all',
        colors: 'color, background-color, border-color, text-decoration-color, fill, stroke',
        opacity: 'opacity',
        shadow: 'box-shadow',
        transform: 'transform'
      },
      transitionDuration: {
        DEFAULT: '150ms',
        '200': '200ms',
        '300': '300ms'
      },
      transitionTimingFunction: {
        DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
        in: 'cubic-bezier(0.4, 0, 1, 1)',
        out: 'cubic-bezier(0, 0, 0.2, 1)',
        'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)'
      }
    }
  },
  plugins: [
    require('tailwindcss-animate')
  ]
};

export default config;
