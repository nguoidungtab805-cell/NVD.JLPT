// FILE: tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'jp-orange': '#F05627',
        'jp-red': '#C8102E',
        'jp-navy': '#1A2A3A',
        'jp-cream': '#F9F6F0',
      },
      backgroundImage: {
        'jp-pattern': "url('/patterns/seigaiha.png')", // Họa tiết sóng
      }
    },
  },
  plugins: [],
};
export default config;
