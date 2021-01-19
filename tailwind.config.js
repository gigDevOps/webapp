const colors = require('tailwindcss/colors');
module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        secondary: '#f69425',
        link: colors.blue['400']
      },
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
