// tailwind.config.js
module.exports = {
  purge: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  darkMode: 'class', // enable class-based dark mode
  theme: {
    extend: {
      // You can extend colors or fonts here if desired
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'sans-serif'],
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ['dark', 'hover'],
      textColor: ['dark', 'hover'],
      boxShadow: ['dark', 'hover'],
    },
  },
  plugins: [],
};