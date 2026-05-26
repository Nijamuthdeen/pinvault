/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
      colors: {
        coral: { 400: '#FF6B6B', 500: '#E05555', 600: '#C94040' },
        stone: { 50: '#FAFAF9', 100: '#F5F5F0' },
      },
      columns: { 2: '2', 3: '3', 4: '4', 5: '5' },
    },
  },
  plugins: [],
};