/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F0F3FA',
          100: '#E0E7F5',
          200: '#C2CFEB',
          300: '#94ABE0',
          400: '#5F80D4',
          500: '#385CC4',
          600: '#2644A8',
          700: '#1B2A6B', // Main Logo Primary Navy
          800: '#162254',
          900: '#111A42',
          950: '#0A0F2B',
        },
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
