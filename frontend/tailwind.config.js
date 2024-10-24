/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Instrument Sans', 'sans-serif'],
      },
      colors: {
        camel: '#D4A373',
        camel2: 'rgba(212, 163, 115, 0.2)',
        tea: {100:'#CCD5AE'},
        cream: '#FAEDCD',
      },
    },
  },
  plugins: [],
};
