/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        surface: 'var(--surface)',
        'surface-subtle': 'var(--surface-subtle)',
        'surface-hover': 'var(--surface-hover)',
        border: 'var(--border)',
        'border-strong': 'var(--border-strong)',
        primary: {
          DEFAULT: '#5B5BF0',
          hover: '#4C4CD4',
          end: '#8B5CF6',
          gradient: 'linear-gradient(135deg, #5B5BF0 0%, #8B5CF6 100%)',
        },
        accent: {
          DEFAULT: '#14B8A6',
          hover: '#0D9488',
        },
        success: {
          DEFAULT: '#22C55E',
          light: '#DCFCE7',
          dark: '#14532D',
        },
        warning: {
          DEFAULT: '#F59E0B',
          light: '#FEF3C7',
          dark: '#78350F',
        },
        danger: {
          DEFAULT: '#EF4444',
          light: '#FEE2E2',
          dark: '#7F1D1D',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 2px 10px -2px rgba(0, 0, 0, 0.05), 0 8px 24px -4px rgba(0, 0, 0, 0.04)',
        'soft-dark': '0 4px 20px -2px rgba(0, 0, 0, 0.4), 0 10px 30px -4px rgba(0, 0, 0, 0.3)',
        card: '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04)',
        elevated: '0 10px 30px -5px rgba(0, 0, 0, 0.08), 0 4px 10px -2px rgba(0, 0, 0, 0.04)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
};
