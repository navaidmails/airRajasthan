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
        navy: {
          50: "#F4F7FB",
          100: "#E3ECF6",
          200: "#C4D6EB",
          300: "#99B9DC",
          400: "#6B96CB",
          500: "#4474B5",
          600: "#2F599B",
          700: "#234479",
          800: "#1A3258",
          850: "#11223C",
          900: "#0B1728",
          950: "#060D18",
        },
        saffron: {
          50: "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#D97706",
          700: "#B45309",
          800: "#92400E",
          900: "#78350F",
        },
        cargo: {
          steel: "#475569",
          surface: "#F8FAFC",
          border: "#E2E8F0",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-outfit)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        aviation: "0 10px 30px -10px rgba(11, 23, 40, 0.15)",
        "aviation-lg": "0 20px 40px -15px rgba(11, 23, 40, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
