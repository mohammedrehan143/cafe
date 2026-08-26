import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        banhmi: {
          bg: "#FFF8F0",
          card: "#FFF3E3",
          red: "#4A2818",
          redDark: "#2E1509",
          yellow: "#4A2818",
          gold: "#D4A373",
          green: "#1E5128",
          dark: "#1C1917",
          brown: "#382922",
        },
        cream: {
          50: "#FCFAF6",
          100: "#FFF8F0",
          200: "#FDEED9",
          300: "#F6DEC2",
          400: "#E8C49D",
          500: "#D49226",
        },
        espresso: {
          50: "#F5F2F0",
          100: "#E5DDD8",
          200: "#CBBDB5",
          300: "#AA978D",
          400: "#7F685C",
          500: "#5C463B",
          600: "#48362D",
          700: "#382922",
          800: "#2A1F19",
          900: "#1D1511",
          950: "#120D0A",
        },
        amberGold: {
          400: "#FFB703",
          500: "#D49226",
          600: "#B8771A",
        }
      },
      fontFamily: {
        display: ["var(--font-asap)", "Impact", "sans-serif"],
        sans: ["var(--font-poppins)", "Inter", "sans-serif"],
        mono: ["var(--font-space-mono)", "monospace"],
        calligraphy: ["var(--font-calligraphy)", "Dancing Script", "cursive"],
        serif: ["var(--font-serif)", "Playfair Display", "Georgia", "serif"],
      },
      animation: {
        "spin-slow": "spin 25s linear infinite",
        "float-gentle": "floatGentle 4s ease-in-out infinite",
        "pulse-subtle": "pulseSubtle 3s ease-in-out infinite",
        "marquee": "marquee 32s linear infinite",
        "marquee-slow": "marquee 45s linear infinite",
      },
      keyframes: {
        floatGentle: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-14px) rotate(2deg)" },
        },
        pulseSubtle: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.85", transform: "scale(1.03)" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      boxShadow: {
        'warm-sm': '0 2px 8px -2px rgba(29, 21, 17, 0.05), 0 1px 4px -1px rgba(29, 21, 17, 0.03)',
        'warm-md': '0 8px 24px -4px rgba(29, 21, 17, 0.08), 0 2px 8px -2px rgba(29, 21, 17, 0.04)',
        'warm-xl': '0 30px 60px -12px rgba(29, 21, 17, 0.15), 0 8px 24px -6px rgba(29, 21, 17, 0.08)',
        'red-glow': '0 0 35px rgba(226, 55, 39, 0.35)',
      }
    },
  },
  plugins: [],
};
export default config;
