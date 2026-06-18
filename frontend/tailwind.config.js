/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          primary: '#00ff88',
          secondary: '#0088ff',
          accent: '#ff0088',
          warning: '#ffaa00',
          danger: '#ff0044',
          dark: '#0a0a0f',
          darker: '#050508',
          gray: '#1a1a2e',
          light: '#16213e'
        },
        neon: {
          blue: '#00d4ff',
          green: '#00ff88',
          purple: '#aa00ff',
          pink: '#ff00aa',
          orange: '#ff6600'
        }
      },
      fontFamily: {
        'cyber': ['Orbitron', 'monospace'],
        'tech': ['Rajdhani', 'sans-serif']
      },
      animation: {
        'pulse-neon': 'pulse-neon 2s ease-in-out infinite alternate',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'scan': 'scan 2s ease-in-out infinite',
        'matrix': 'matrix 20s linear infinite'
      },
      keyframes: {
        'pulse-neon': {
          '0%': { 
            boxShadow: '0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor'
          },
          '100%': { 
            boxShadow: '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor'
          }
        },
        'glow': {
          '0%': { filter: 'brightness(1) saturate(1)' },
          '100%': { filter: 'brightness(1.2) saturate(1.5)' }
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' }
        },
        'scan': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100vw)' }
        },
        'matrix': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' }
        }
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
}
