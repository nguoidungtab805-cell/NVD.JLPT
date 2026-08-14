/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx,js,jsx}", "./components/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        nvdOrange: "#FF7A3D",
        nvdPeach: "#FFF3E6",
        nvdRed: "#E63946",
        nvdBlue: "#5B8DEF"
      }
    }
  },
  plugins: []
};
