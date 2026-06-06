/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        panel: '#0a0a0a',
        accent: {
          crimson: '#ff1e43',
          amber: '#ffb000',
          emerald: '#00ff66',
        }
      },
      animation: {
        'ticker': 'ticker 30s linear infinite',
        'pulse-fast': 'pulse 1.5s cubic-bezier(0.16, 1, 0.3, 1) infinite',
      },
      keyframes: {
        ticker: {
          '0%': { transform: 'translate3d(0, 0, 0)' },
          '100%': { transform: 'translate3d(-50%, 0, 0)' },
        }
      },
      boxShadow: {
        'cinematic-low': '0 4px 30px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        'glow-crimson': '0 0 15px rgba(255, 30, 67, 0.35), 0 0 30px rgba(255, 30, 67, 0.1)',
        'glow-emerald': '0 0 15px rgba(0, 255, 102, 0.25)',
      },
      transitionTimingFunction: {
        'cinematic': 'cubic-bezier(0.16, 1, 0.3, 1)', // Ultra-fast snap out, smooth settle
      }
    },
  },
  plugins: [],
}
