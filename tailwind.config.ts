import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#121212',
        surface: '#1a1a1a',
        'surface-2': '#222222',
        'surface-3': '#2a2a2a',
        border: '#2e2e2e',
        'border-2': '#3a3a3a',
        text: '#e8e8e8',
        muted: '#888888',
        faint: '#555555',
        primary: '#6366f1',
        'primary-hover': '#4f46e5',
        'primary-light': '#818cf8',
        accent: '#10b981',
        'accent-hover': '#059669',
        warning: '#f59e0b',
        error: '#ef4444',
        success: '#22c55e',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { transform: 'translateY(10px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
      },
    },
  },
  plugins: [],
}
export default config
