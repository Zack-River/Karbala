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
        // Core palette from design system
        karbala: {
          black: "#0D0B09",
          gold: {
            DEFAULT: "#D4B98A",
            light: "#E8D5A3",
            dark: "#A8925E",
            muted: "#6B5A3E",
          },
          crimson: "#8B1E1E",
          white: "#F0E8D8",
          secondary: "#C5B89A",
          gray: "#7A6E5E",
          card: "#1C1916",
          "card-hover": "#232019",
        },
      },
      fontFamily: {
        scheherazade: ["var(--font-scheherazade)", "var(--font-noto-sans)", "system-ui", "serif"],
        kufi: ["var(--font-kufi)", "var(--font-noto-sans)", "system-ui", "sans-serif"],
        cinzel: ["var(--font-cinzel)", "var(--font-noto-sans)", "system-ui", "serif"],
        sans: ["var(--font-noto-sans)", "system-ui", "sans-serif"],
      },
      fontSize: {
        // Display scale (Scheherazade)
        "display-hero": ["clamp(3rem, 8vw, 7rem)", { lineHeight: "1.1" }],
        "display-h2": ["clamp(2rem, 5vw, 3.5rem)", { lineHeight: "1.2" }],
        "display-h3": ["clamp(1.4rem, 3vw, 2rem)", { lineHeight: "1.3" }],
        "display-h4": ["clamp(1.1rem, 2vw, 1.4rem)", { lineHeight: "1.3" }],
        // Body scale (Noto Kufi)
        "body-lg": ["1.125rem", { lineHeight: "1.8" }],
        "body-md": ["1rem", { lineHeight: "1.75" }],
        "body-sm": ["0.875rem", { lineHeight: "1.7" }],
        // Special (Cinzel)
        "night-number": ["2.5rem", { lineHeight: "1" }],
      },
      spacing: {
        xs: "4px",
        sm: "8px",
        md: "12px",
        base: "16px",
        lg: "20px",
        xl: "24px",
        "2xl": "32px",
        "3xl": "40px",
        "4xl": "48px",
        "5xl": "64px",
        "6xl": "80px",
        "7xl": "96px",
        "8xl": "128px",
      },
      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        pill: "9999px",
      },
      boxShadow: {
        ambient:
          "0 4px 24px rgba(0, 0, 0, 0.6), 0 1px 4px rgba(212, 185, 138, 0.08)",
        elevated:
          "0 8px 40px rgba(0, 0, 0, 0.8), 0 2px 8px rgba(212, 185, 138, 0.15)",
        glow: "0 0 20px rgba(212, 185, 138, 0.2)",
        deep: "inset 0 0 200px rgba(0, 0, 0, 0.7)",
      },
      borderColor: {
        "gold-subtle": "rgba(212, 185, 138, 0.12)",
        "gold-medium": "rgba(212, 185, 138, 0.25)",
        "gold-strong": "rgba(212, 185, 138, 0.45)",
        "gold-card": "rgba(212, 185, 138, 0.15)",
      },
      transitionTimingFunction: {
        premium: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      transitionDuration: {
        "350": "350ms",
      },
      maxWidth: {
        content: "1280px",
        prose: "720px",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "gold-shimmer": {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        pulse: {
          "0%, 100%": { transform: "translateY(0)", opacity: "1" },
          "50%": { transform: "translateY(10px)", opacity: "0.5" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s ease-out forwards",
        "gold-shimmer": "gold-shimmer 3s linear infinite",
        "scroll-hint": "pulse 1.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
