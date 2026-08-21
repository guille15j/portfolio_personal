/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./identidad_tech.js"],
  darkMode: "class",
theme: {
    extend: {
      colors: {
        "bg-dark": "#0e0f11",
        "bg-surface": "rgba(20, 22, 24, 0.78)",
        "bg-card": "rgba(24, 26, 29, 0.70)",
        "bg-card-hover": "rgba(31, 34, 38, 0.85)",
        "bg-elevated": "#14161a",

        "text-main": "#f2f3f1",
        "text-muted": "#9ba1a0",
        "text-subtle": "#7d8382",

        "primary-cyan": "#3fa89b",
        "primary-cyan-soft": "#7fc9bf",
        "primary-blue": "#d9873f",
        "primary-blue-strong": "#b5661f",
        "accent-glow": "rgba(63, 168, 155, 0.18)",
        "accent-glow-strong": "rgba(63, 168, 155, 0.40)",

        "state-error": "#e0574a",

        "line-subtle": "rgba(63, 168, 155, 0.12)",
        "line-strong": "rgba(63, 168, 155, 0.28)",
        "line-dark": "rgba(255, 255, 255, 0.06)",
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
