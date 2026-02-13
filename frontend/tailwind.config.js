/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // TCNR01 品牌色系
        tcnr01: {
          black: '#111111',
          white: '#FFFFFF',
          gray: {
            50: '#F5F5F5',
            100: '#E5E5E5',
            200: '#CCCCCC',
            300: '#757575',
            400: '#707072',
            500: '#525252',
            600: '#333333',
            700: '#111111',
          },
          orange: '#FA5400',
          green: '#128A09',
          red: '#D43F21',
        },
      },
      fontFamily: {
        // TCNR01 使用 Helvetica Neue
        tcnr01: ['"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
      },
      fontSize: {
        // TCNR01 字體大小系統
        'tcnr01-xs': ['12px', { lineHeight: '1.5' }],
        'tcnr01-sm': ['14px', { lineHeight: '1.5' }],
        'tcnr01-base': ['16px', { lineHeight: '1.5' }],
        'tcnr01-lg': ['20px', { lineHeight: '1.3' }],
        'tcnr01-xl': ['24px', { lineHeight: '1.2' }],
        'tcnr01-2xl': ['28px', { lineHeight: '1.2' }],
        'tcnr01-3xl': ['36px', { lineHeight: '1.1' }],
        'tcnr01-4xl': ['48px', { lineHeight: '1.1' }],
      },
      spacing: {
        // TCNR01 間距系統
        'tcnr01-xs': '4px',
        'tcnr01-sm': '8px',
        'tcnr01-md': '12px',
        'tcnr01-lg': '16px',
        'tcnr01-xl': '24px',
        'tcnr01-2xl': '36px',
        'tcnr01-3xl': '48px',
        'tcnr01-4xl': '60px',
      },
      borderRadius: {
        'tcnr01': '8px',
        'tcnr01-lg': '12px',
        'tcnr01-full': '9999px',
      },
      boxShadow: {
        'tcnr01': '0 2px 4px rgba(0, 0, 0, 0.1)',
        'tcnr01-lg': '0 4px 12px rgba(0, 0, 0, 0.15)',
        'tcnr01-xl': '0 8px 24px rgba(0, 0, 0, 0.2)',
      },
      aspectRatio: {
        'tcnr01-product': '1 / 1.25',
      },
      animation: {
        'tcnr01-ripple': 'ripple 0.6s linear',
        'tcnr01-slide-in': 'slideIn 0.3s ease-out',
        'tcnr01-fade-in': 'fadeIn 0.2s ease-out',
      },
      keyframes: {
        ripple: {
          '0%': { transform: 'scale(0)', opacity: '0.5' },
          '100%': { transform: 'scale(4)', opacity: '0' },
        },
        slideIn: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      transitionDuration: {
        'tcnr01': '200ms',
      },
    },
  },
  plugins: [],
}
