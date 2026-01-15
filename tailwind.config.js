/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        pretendard: ["Pretendard", "sans-serif"],
      },
      colors: {
        primary: {
          50:  "#e9fcf7",
          100: "#bcf6e5",
          200: "#9bf1d9",
          300: "#6eebc7",
          400: "#51e7bd",
          500: "#26e1ac",
          600: "#23cd9d",
          700: "#1ba07a",
          800: "#157c5f",
          900: "#105f48",
        },
        gray: {
          50:  "#f2f2f2",
          100: "#d6d6d8",
          200: "#c3c2c5",
          300: "#a7a7aa",
          400: "#969599",
          500: "#7c7b80",
          600: "#717074",
          700: "#58575b",
          800: "#444446",
          900: "#343436",
        },
      },
    },
  },
  plugins: [],
};
