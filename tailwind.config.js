/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./identidad_tech.js"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "bg-dark": "#05070c",
        "bg-surface": "rgba(11, 16, 26, 0.76)",
        "bg-card": "rgba(13, 19, 30, 0.6)",
        "bg-card-hover": "rgba(18, 27, 43, 0.82)",
        "bg-elevated": "#04060a",

        "text-main": "#f7fafc",
        "text-muted": "#94a3b8",
        "text-subtle": "#62748e",

        "primary-cyan": "#00e5ff",
        "primary-cyan-soft": "#5eead4",
        "primary-blue": "#0a3d91",
        "primary-blue-strong": "#1746c2",
        "accent-glow": "rgba(0, 229, 255, 0.2)",
        "accent-glow-strong": "rgba(0, 229, 255, 0.45)",

        "state-error": "#f87171",

        "line-subtle": "rgba(0, 229, 255, 0.12)",
        "line-strong": "rgba(0, 229, 255, 0.32)",
        "line-dark": "rgba(255, 255, 255, 0.07)",
      },
      fontFamily: {
        display: ["Archivo", "system-ui", "-apple-system", "sans-serif"],
        body: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ["IBM Plex Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      spacing: {
        pad: "clamp(1.25rem, 5vw, 4rem)",
        gap: "clamp(1rem, 2.5vw, 1.75rem)",
      },
      borderRadius: {
        sm: "6px",
        md: "12px",
        pill: "9999px",
      },
      backdropBlur: {
        glass: "3px",
        "glass-strong": "14px",
      },
      boxShadow: {
        card: "0 10px 28px -12px rgba(0, 0, 0, 0.65), inset 0 1px 0 rgba(255, 255, 255, 0.07)",
        glow: "0 0 22px rgba(0, 229, 255, 0.2)",
        elevated: "0 20px 48px -16px rgba(0, 0, 0, 0.7)",
      },
      transitionTimingFunction: {
        system: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      transitionDuration: {
        fast: "220ms",
        base: "350ms",
        slow: "600ms",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { opacity: 0.3, transform: "scale(0.85)" },
          "50%": { opacity: 1, transform: "scale(1.25)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
      animation: {
        pulseGlow: "pulseGlow 2.2s infinite cubic-bezier(0.4,0,0.6,1)",
        marquee: "marquee var(--marquee-duration, 32s) linear infinite",
      },
      screens: {
        xs: "420px",
      },
    },
  },
  plugins: [],
};
