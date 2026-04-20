/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#8B5CF6', // Vibrant purple
        secondary: '#1E1B4B', // Deep dark purple
        accent: '#0F172A', // Dark slate blue
        background: '#020617', // Very dark blue
        'cyber-purple': '#8E54E9',
        'cyber-blue': '#7C3AED',
        'cyber-dark': '#0A0A1A',
        'cyber-gray': '#1E1B4B',
        'neon-purple': '#A855F7',
        'neon-blue': '#60A5FA',
        'matrix-dark': '#1E1B4B',
        'dark-purple': '#2E1065',
        'light-purple': '#C084FC',
        text: {
          dark: '#E2E8F0',
          light: '#94A3B8'
        }
      },
      fontFamily: {
        'heading': ['Share Tech Mono', 'monospace'],
        'body': ['Fira Code', 'monospace'],
        'mono': ['JetBrains Mono', 'monospace']
      },
      borderRadius: {
        '2xl': '1rem',
        'cyber': '0.5rem 0 0.5rem 0',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'glitch': 'glitch 0.3s infinite',
        'matrix-rain': 'matrixRain 20s linear infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'scan-line': 'scanLine 8s linear infinite',
        'border-pulse': 'borderPulse 2s ease-in-out infinite',
        'text-flicker': 'textFlicker 3s linear infinite',
        'gradient-shift': 'gradientShift 5s ease infinite',
        'neon-pulse': 'neonPulse 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0px)', opacity: '1' }
        },
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' }
        },
        matrixRain: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' }
        },
        scanLine: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(100vh)' }
        },
        borderPulse: {
          '0%, 100%': { borderColor: 'rgba(139, 92, 246, 0.3)' },
          '50%': { borderColor: 'rgba(139, 92, 246, 0.8)' }
        },
        textFlicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
          '55%': { opacity: '1' }
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' }
        },
        neonPulse: {
          '0%, 100%': { 
            boxShadow: '0 0 10px rgba(139, 92, 246, 0.5), 0 0 20px rgba(139, 92, 246, 0.3), 0 0 30px rgba(139, 92, 246, 0.1)'
          },
          '50%': { 
            boxShadow: '0 0 20px rgba(139, 92, 246, 0.8), 0 0 40px rgba(139, 92, 246, 0.5), 0 0 60px rgba(139, 92, 246, 0.3)'
          }
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glass': 'linear-gradient(135deg, rgba(139, 92, 246, 0.05), rgba(59, 130, 246, 0.02))',
        'matrix-gradient': 'linear-gradient(180deg, rgba(139, 92, 246, 0.1) 0%, transparent 100%)',
        'cyber-grid': 'linear-gradient(rgba(139, 92, 246, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.05) 1px, transparent 1px)',
        'cyber-gradient': 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 50%, #A855F7 100%)',
        'dark-gradient': 'linear-gradient(135deg, #1E1B4B 0%, #0F172A 50%, #020617 100%)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      boxShadow: {
        'neon': '0 0 10px rgba(139, 92, 246, 0.5), 0 0 20px rgba(139, 92, 246, 0.3), 0 0 30px rgba(139, 92, 246, 0.1)',
        'neon-strong': '0 0 20px rgba(139, 92, 246, 0.7), 0 0 40px rgba(139, 92, 246, 0.5), 0 0 60px rgba(139, 92, 246, 0.3)',
        'neon-blue': '0 0 10px rgba(59, 130, 246, 0.5), 0 0 20px rgba(59, 130, 246, 0.3), 0 0 30px rgba(59, 130, 246, 0.1)',
        'cyber': '5px 5px 0px rgba(139, 92, 246, 0.2)',
        'inner-glow': 'inset 0 0 20px rgba(139, 92, 246, 0.1)',
      }
    },
  },
  plugins: [],
}