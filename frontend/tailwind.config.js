/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#070C15',
          900: '#0B1220',
          850: '#111C2E',
          800: '#172438',
          750: '#1E2D4A',
          700: '#273859',
          600: '#334870',
        },
        brand: {
          teal: '#35D0BA',
          'teal-dark': '#1C8A7B',
          cyan: '#06B6D4',
          emerald: '#10B981',
          amber: '#F59E0B',
          coral: '#F43F5E',
        },
        slate: {
          925: '#0B0F17',
          950: '#030712',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif']
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-pulse': 'glow 2s ease-in-out infinite alternate',
        'fade-in': 'fadeIn 0.2s ease-out forwards',
        'radar-sweep': 'radar 3s linear infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(53, 208, 186, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(53, 208, 186, 0.6)' },
        },
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(4px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        radar: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      }
    },
  },
  plugins: [],
}

