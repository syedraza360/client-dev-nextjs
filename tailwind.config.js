import { COLORS } from "./src/constants/colors.constants"

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      screens: {
        mobile: { max: "508px" },
        "mobile-min": { min: "509px" },
        tablet: "900px",
        laptop: "1512px",
        desktop: "1920px"
      },
      fontSize: {
        10: "10px",
        11: "11px",
        13: "13px"
      },
      borderRadius: {
        5: "5px",
        10: "10px",
        20: "20px",
        30: "30px"
      },
      lineHeight: {
        4.5: "1.125rem",
        135: "135%"
      },
      boxShadow: {
        title: "0px 1px 2px 0px rgba(16, 24, 40, 0.06)"
      },
      colors: COLORS
    }
  },
  plugins: [require("tailwindcss-rtl")]
}
