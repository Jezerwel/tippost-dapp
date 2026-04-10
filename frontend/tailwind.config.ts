import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Bebas Neue", "Impact", "ui-sans-serif"],
        sans:    ["DM Sans", "ui-sans-serif", "system-ui", "sans-serif"],
        mono:    ["JetBrains Mono", "ui-monospace", "SF Mono", "monospace"],
      },
      borderRadius: {
        none: "0px",
        sm:   "2px",
        md:   "4px",
        lg:   "6px",
        xl:   "8px",
        "2xl": "12px",
        full: "9999px",
      },
      keyframes: {
        "error-in": {
          from: { opacity: "0", transform: "translateY(-4px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        spin: {
          from: { transform: "rotate(0deg)" },
          to:   { transform: "rotate(360deg)" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%":       { opacity: "0.4" },
        },
      },
      animation: {
        "error-in":   "error-in 0.2s ease-out",
        shimmer:      "shimmer 1.5s ease-in-out infinite",
        "fade-in-up": "fade-in-up 0.35s ease-out",
        spin:         "spin 1s linear infinite",
        pulse:        "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
