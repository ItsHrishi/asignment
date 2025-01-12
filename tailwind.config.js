/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        lightBlue: "rgba(236, 247, 255, 1)",
        primaryBlue: "rgba(31, 140, 208, 1)",
        customGray: "rgba(225, 231, 235, 1)",
      },
    },
  },
  plugins: [],
};
