/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Instrument Sans', 'sans-serif'],
      },
      colors: {
        camel: ({ opacityValue }) => {
          if (opacityValue !== undefined) {
            return `rgba(212, 163, 115, ${opacityValue})`;
          }
          return 'rgba(212, 163, 115, 1)';  // Fully opaque if no opacity specified
        },
        tea: '#FAEDCD',
      },
    },
  },
  plugins: [],
};
