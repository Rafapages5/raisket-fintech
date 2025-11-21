import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ['Inter', 'sans-serif'],
        headline: ['Inter', 'sans-serif'],
        code: ['monospace'],
      },
      colors: {
        // Colores principales Raisket
        raisket: {
          // Azules
          'blue-primary': '#1A365D',
          'blue-secondary': '#2D4A68',
          'blue-hover': '#2A4A6B',
          // Verdes
          'green-primary': '#00D9A5',
          'green-secondary': '#4FD1C7',
          'green-hover': '#00C294',
          // Funcionales
          'warning': '#F59E0B',
          'error': '#EF4444',
          'premium': '#8B5CF6',
          // Grises
          'white': '#FFFFFF',
          'gray-light': '#F8FAFC',
          'gray-medium': '#64748B',
          'gray-dark': '#334155',
          'disabled': '#94A3B8',
          'border': '#E2E8F0',
        },
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: '#1A365D',
          foreground: '#FFFFFF',
          hover: '#2A4A6B',
        },
        secondary: {
          DEFAULT: '#2D4A68',
          foreground: '#FFFFFF',
        },
        muted: {
          DEFAULT: '#F8FAFC',
          foreground: '#64748B',
        },
        accent: {
          DEFAULT: '#00D9A5',
          foreground: '#FFFFFF',
          hover: '#00C294',
        },
        destructive: {
          DEFAULT: '#EF4444',
          foreground: '#FFFFFF',
        },
        warning: {
          DEFAULT: '#F59E0B',
          foreground: '#FFFFFF',
        },
        premium: {
          DEFAULT: '#8B5CF6',
          foreground: '#FFFFFF',
        },
        border: '#E2E8F0',
        input: '#E2E8F0',
        ring: '#00D9A5',
        chart: {
          '1': '#1A365D',
          '2': '#00D9A5',
          '3': '#F59E0B',
          '4': '#8B5CF6',
          '5': '#EF4444',
        },
        sidebar: {
          DEFAULT: '#1A365D',
          foreground: '#FFFFFF',
          primary: '#00D9A5',
          'primary-foreground': '#FFFFFF',
          accent: '#4FD1C7',
          'accent-foreground': '#FFFFFF',
          border: '#2D4A68',
          ring: '#00D9A5',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
