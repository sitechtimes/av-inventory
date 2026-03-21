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
    themes: ["light"],
    logs: false,
  },
} satisfies Config;
