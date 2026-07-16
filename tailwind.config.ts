import type { Config } from "tailwindcss"

export default {
  content: [
    "./contents/**/*.tsx",
    "./components/**/*.tsx",
    "./background/**/*.ts"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["DM Mono", "monospace"]
      },
      colors: {
        background: "#FAFAF7",
        foreground: "#1A1A18",
        card: "#FFFFFF",
        muted: "#F0EFEB",
        "muted-foreground": "#8A8A85",
        border: "rgba(26,26,24,0.08)",
        primary: "#1A1A18",
        "primary-foreground": "#FAFAF7",
        accent: "#EDECE8"
      },
      borderRadius: {
        DEFAULT: "0.375rem",
        lg: "0.5rem",
        md: "0.375rem"
      }
    }
  },
  plugins: []
} satisfies Config
