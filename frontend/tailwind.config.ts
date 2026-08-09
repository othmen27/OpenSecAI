import type { Config } from "tailwindcss";

/**
 * OpenSecAI workspace theme.
 *
 * Single source of truth for the neutral palette and the accent color so the
 * whole UI can be rethemed from one place. Component styling only ever uses
 * these tokens via Tailwind utilities — no isolated hex values in JSX/CSS.
 */
export default {
  theme: {
    extend: {
      colors: {
        // Low-contrast neutral ramp (slate-leaning) used for text, surfaces
        // and hairline borders. Dark-mode equivalents come from the same ramp
        // via the `dark:` variant.
        neutral: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
          950: "#020617",
        },
        // Muted teal — reserved for AI presence and active states only.
        accent: {
          DEFAULT: "#4c8b98",
          50: "#f3f8f9",
          100: "#e0eef0",
          200: "#c4dee2",
          300: "#99c6cd",
          400: "#67a7b3",
          500: "#4c8b98",
          600: "#42737f",
          700: "#3a5f69",
          800: "#34505a",
          900: "#2f444c",
          950: "#1b2c32",
        },
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["Cascadia Code", "JetBrains Mono", "SFMono-Regular", "Consolas", "Courier New", "monospace"],
      },
    },
  },
} satisfies Config;