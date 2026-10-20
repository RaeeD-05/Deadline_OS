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
        foreground: 'var(--foreground)',
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        border: 'var(--border)',
        accent: {
          indigo: '#6366f1',
          crimson: '#f43f5e',
          amber: '#f59e0b',
          emerald: '#10b981',
          cyan: '#06b6d4',
          purple: '#8b5cf6',
        },
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'siren': 'siren 1.5s ease-in-out infinite',
      },
      keyframes: {
        siren: {
          '0%, 100%': { borderColor: 'rgba(244, 63, 94, 0.3)', boxShadow: '0 0 15px rgba(244, 63, 94, 0.15)' },
          '50%': { borderColor: 'rgba(244, 63, 94, 0.8)', boxShadow: '0 0 25px rgba(244, 63, 94, 0.4)' },
        }
      }
    },
  },
  plugins: [],
};
