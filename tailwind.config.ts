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
        lunch: {
          yellow: "#FFD93D",
          orange: "#FF6B35",
          green: "#6BCB77",
          dark: "#2D3436",
          light: "#FFF9E6",
        },
      },
      animation: {
        "float": "float 3s ease-in-out infinite",
        "fly": "fly 2s ease-in-out infinite",
        "bounce-slow": "bounce 2s infinite",
        "spin-slow": "spin 3s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        fly: {
          "0%": { transform: "translateX(-100px) rotate(0deg)" },
          "50%": { transform: "translateX(100px) rotate(180deg)" },
          "100%": { transform: "translateX(-100px) rotate(360deg)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;

