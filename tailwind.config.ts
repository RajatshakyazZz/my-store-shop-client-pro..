import type { Config } from "tailwindcss";

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
        rb: {
          bg: "#f8fafc",
          text: "#0f172a",
          muted: "#64748b",
          red: "#dc2626",
          "red-light": "#ef4444",
          "red-dark": "#b91c1c",
          "red-soft": "#fef2f2",
          purple: "#dc2626",
          "purple-light": "#ef4444",
          "purple-dark": "#b91c1c",
          "purple-soft": "#fef2f2",
          pink: "#f43f5e",
          green: "#059669",
          "green-soft": "#ecfdf5",
          line: "#e2e8f0",
          card: "#ffffff",
        },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
      },
      boxShadow: {
        card: "0 14px 40px rgba(15, 23, 42, 0.06)",
        soft: "0 8px 24px rgba(15, 23, 42, 0.04)",
        btn: "0 10px 24px rgba(220, 38, 38, 0.32)",
        dock: "0 16px 40px rgba(2, 6, 23, 0.35)",
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
