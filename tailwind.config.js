/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#faf8fb',
          100: '#f4f0f6',
          200: '#ebe1ee',
          300: '#dcc7e1',
          400: '#c7a3cf',
          500: '#b07db8',
          600: '#8b5a8c',
          700: '#7a4f7c',
          800: '#664267',
          900: '#563856',
          950: '#341f35',
        },
        secondary: {
          50: '#fbf9fc',
          100: '#f7f2f9',
          200: '#f0e8f3',
          300: '#e4d4ea',
          400: '#d4a5d6',
          500: '#c28bc5',
          600: '#aa6bb0',
          700: '#945899',
          800: '#7a4a7e',
          900: '#654066',
          950: '#42253f',
        },
        accent: {
          50: '#fff0f4',
          100: '#ffe3ea',
          200: '#ffcdd9',
          300: '#ffa6bb',
          400: '#ff6b9d',
          500: '#fa4482',
          600: '#e8216a',
          700: '#c4165a',
          800: '#a31651',
          900: '#8b1549',
          950: '#4e0724',
        },
        surface: '#ffffff',
        background: '#f8f6f9',
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'salon': '0 2px 8px rgba(139, 90, 140, 0.1)',
        'salon-lg': '0 4px 16px rgba(139, 90, 140, 0.15)',
      }
    },
  },
  plugins: [],
}