/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      xxs: { max: "350px" }, // Mobile (iPhone 3 - iPhone XS Max).
      xs: { max: "575px" }, // Mobile (iPhone 3 - iPhone XS Max).
      mxs: { max: "900px" }, // Mobile (iPhone 3 - iPhone XS Max).
      sm: { min: "576px", max: "897px" }, // Mobile (matches max: iPhone 11 Pro Max landscape @ 896px).
      md: { min: "898px", max: "1199px" }, // Tablet (matches max: iPad Pro @ 1112px).
      lg: { min: "1200px" }, // Desktop smallest.
      xl: { min: "1159px" }, // Desktop wide.
      "2xl": { min: "1359px" }, // Desktop widescreen.
    },
    extend: {
      colors: {
        red: {
          100: "#f4bec4",
          200: "#f1a9b0",
          300: "#ed939d",
          400: "#e97d89",
          500: "#e66875",
          600: "#e25261",
          700: "#df3d4e",
          800: "#db273a",
        },
        flush: {
          100: "#ba3d3f",
          200: "#ba3d3f",
          300: "#a63638",
        },
        status: {
          danger: "#E80C33",
          warning: "#FBBC1B",
          success: "#27CE76",
          primary: "#4CD58D",
        },
        shades: {
          white: "#FFFFFF",
          black: "#000000",
          secondary: "#ADADAD",
          primary: "#315672",
        },
      },
      fontFamily: {
        sans: ["Open Sans", "ubuntu", ...defaultTheme.fontFamily.sans],
      },
    },
  },

  plugins: [],
};
