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
        // === AirRajasthan Brand Tokens ===
        // Extracted from official logo
        brand: {
          charcoal: "#3D3D3B",   // Wordmark text — primary dark
          blue: "#1E73BE",        // Left slash // — primary action
          golden: "#B5834A",      // Right slash // — accent
        },

        // Extended charcoal scale (dark backgrounds, text hierarchy)
        charcoal: {
          50:  "#F5F5F4",
          100: "#E8E8E7",
          200: "#D4D4D2",
          300: "#AEAEAB",
          400: "#868684",
          500: "#636360",
          600: "#4E4E4C",
          700: "#3D3D3B",  // = brand.charcoal
          800: "#2E2E2D",
          900: "#1E1E1D",
          950: "#111110",
        },

        // Extended blue scale (primary actions, links, focus)
        sky: {
          50:  "#EFF6FD",
          100: "#D9ECFA",
          200: "#B3D9F5",
          300: "#7DBFED",
          400: "#47A4E2",
          500: "#1E73BE",  // = brand.blue
          600: "#185E9C",
          700: "#12497A",
          800: "#0C3557",
          900: "#07213A",
          950: "#040F1C",
        },

        // Extended golden/tan scale (accent, highlights)
        golden: {
          50:  "#FBF6EF",
          100: "#F4E8D6",
          200: "#E9CEAE",
          300: "#D9AE7E",
          400: "#C8904F",
          500: "#B5834A",  // = brand.golden
          600: "#956B39",
          700: "#73522C",
          800: "#513A1F",
          900: "#2F2112",
          950: "#180E08",
        },

        // Neutral surfaces and borders
        surface: {
          bg:     "#F9F9F8",
          card:   "#FFFFFF",
          border: "#E4E4E3",
          muted:  "#F2F2F1",
        },

        // Legacy aliases kept for backward compatibility during migration
        // These will gradually be removed as pages are updated
        navy: {
          50:  "#F5F5F4",
          100: "#E8E8E7",
          200: "#D4D4D2",
          300: "#AEAEAB",
          400: "#868684",
          500: "#636360",
          600: "#4E4E4C",
          700: "#3D3D3B",
          800: "#2E2E2D",
          850: "#252524",
          900: "#1E1E1D",
          950: "#111110",
        },
        saffron: {
          50:  "#FBF6EF",
          100: "#F4E8D6",
          200: "#E9CEAE",
          300: "#D9AE7E",
          400: "#C8904F",
          500: "#B5834A",
          600: "#956B39",
          700: "#73522C",
          800: "#513A1F",
          900: "#2F2112",
        },
        cargo: {
          steel:   "#6B6B69",
          surface: "#F9F9F8",
          border:  "#E4E4E3",
        },
      },

      fontFamily: {
        sans:    ["var(--font-barlow)", "system-ui", "sans-serif"],
        display: ["var(--font-rajdhani)", "system-ui", "sans-serif"],
        // Keep legacy variable names pointing to new fonts
        rajdhani: ["var(--font-rajdhani)", "system-ui", "sans-serif"],
        barlow:   ["var(--font-barlow)", "system-ui", "sans-serif"],
      },

      boxShadow: {
        aviation:    "0 10px 30px -10px rgba(29, 29, 27, 0.15)",
        "aviation-lg": "0 20px 40px -15px rgba(29, 29, 27, 0.25)",
        "brand-blue":  "0 4px 20px -4px rgba(30, 115, 190, 0.35)",
        "brand-golden":"0 4px 20px -4px rgba(181, 131, 74, 0.35)",
      },

      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #1E73BE 0%, #B5834A 100%)",
        "charcoal-gradient": "linear-gradient(180deg, #3D3D3B 0%, #1E1E1D 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
