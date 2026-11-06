import type { Config } from "tailwindcss";

/**
 * CreatorMint design tokens
 * ------------------------------------------------------------------
 * ink   – deep night navy-black used for dark chrome + primary text
 * mint  – electric lime FILL scale (buttons, badges, borders, glows).
 *         500–700 are bright lime meant for ink text on top;
 *         800–950 are deep forest tones for dark panels.
 * leaf  – lime TEXT scale. 500+ are deep greens that keep ≥4.5:1
 *         contrast on white; 300–400 are bright lime for dark surfaces.
 * volt  – neon yellow highlight (reference #FFFF00), always paired
 *         with ink text.
 * canvas – the soft mint-white page background family.
 */
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/admin/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0B1019",
          950: "#070A11",
          900: "#0B1019",
          850: "#10161F",
          800: "#151C27",
          700: "#1E2733",
          600: "#2B3542",
          500: "#465161",
          400: "#6B7584",
          300: "#9AA2AE",
        },
        mint: {
          50: "#F7FEE7",
          100: "#ECFCCA",
          200: "#D8F999",
          300: "#BBF451",
          400: "#A8EE1C",
          500: "#9AE600",
          600: "#9AE600",
          700: "#8BD300",
          800: "#2F5200",
          900: "#1B2E00",
          950: "#0F1A00",
        },
        leaf: {
          50: "#F6FDE9",
          100: "#ECFAD0",
          200: "#D9F5A3",
          300: "#BBF451",
          400: "#9AE600",
          500: "#4D8200",
          600: "#467600",
          700: "#3A6300",
          800: "#2E4F00",
          900: "#223B00",
          950: "#152500",
        },
        volt: {
          DEFAULT: "#FFFF00",
          50: "#FFFFE0",
          100: "#FFFFB8",
          200: "#FFFF70",
          300: "#FFFF00",
          400: "#F2F200",
          500: "#E3E300",
        },
        canvas: {
          DEFAULT: "#F4F6EF",
          50: "#FAFBF7",
          100: "#F4F6EF",
          200: "#E9EDE1",
          300: "#DCE2D2",
        },
        rb: {
          bg: "#F4F6EF",
          text: "#0B1019",
          muted: "#5B6472",
          red: "#9AE600",
          "red-light": "#BBF451",
          "red-dark": "#467600",
          "red-soft": "#F7FEE7",
          purple: "#9AE600",
          "purple-light": "#BBF451",
          "purple-dark": "#467600",
          "purple-soft": "#F7FEE7",
          pink: "#FFFF00",
          green: "#467600",
          "green-soft": "#F7FEE7",
          line: "#E3E8DA",
          card: "#ffffff",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "Inter", "sans-serif"],
      },
      boxShadow: {
        card: "0 14px 40px -12px rgba(11, 16, 25, 0.10)",
        soft: "0 8px 24px -10px rgba(11, 16, 25, 0.08)",
        btn: "0 10px 22px -10px rgba(11, 16, 25, 0.45)",
        dock: "0 18px 40px -12px rgba(7, 10, 17, 0.55)",
        lift: "0 24px 48px -20px rgba(11, 16, 25, 0.28)",
      },
      animation: {
        marquee: "marquee 35s linear infinite",
        "marquee-reverse": "marquee-reverse 35s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "marquee-reverse": {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0%)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
