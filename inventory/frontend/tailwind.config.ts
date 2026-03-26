import type { Config } from "tailwindcss";
import daisyui from "daisyui";

export default {
  content: [
    "./app/**/*.{vue,js,ts}",
    "./components/**/*.{vue,js,ts}",
    "./layouts/**/*.{vue,js,ts}",
    "./pages/**/*.{vue,js,ts}",
    "./composables/**/*.{js,ts}",
    "./plugins/**/*.{js,ts}",
    "./utils/**/*.{js,ts}",
    "./server/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
  ],
  theme: {
    extend: {
      boxShadow: {
        panel: "0 8px 30px rgba(15, 23, 42, 0.08)",
      },
      borderRadius: {
        panel: "1rem",
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        avtheme: {
          primary: "#0f766e",
          "primary-content": "#f0fdfa",
          secondary: "#0ea5e9",
          "secondary-content": "#082f49",
          accent: "#f59e0b",
          "accent-content": "#451a03",
          neutral: "#1f2937",
          "neutral-content": "#f9fafb",
          "base-100": "#ffffff",
          "base-200": "#f3f4f6",
          "base-300": "#e5e7eb",
          "base-content": "#111827",
          info: "#0ea5e9",
          "info-content": "#082f49",
          success: "#16a34a",
          "success-content": "#052e16",
          warning: "#f59e0b",
          "warning-content": "#451a03",
          error: "#dc2626",
          "error-content": "#450a0a",
        },
      },
    ],
    darkTheme: "avtheme",
    logs: false,
  },
} satisfies Config;
